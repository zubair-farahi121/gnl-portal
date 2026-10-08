#!/usr/bin/env node
/*
 * GNL demo server — the static build PLUS a tiny in-memory sync API, so a real
 * phone can take part in the demo ("the phone path"). See docs/PHONE_PATH.md.
 *
 *   npm run build && npm run serve:phone        # http://localhost:4173/
 *
 * ====================================================================
 * TWO JOBS, KEPT APART.
 *
 * 1. STATIC FILES — exactly what `npm run serve` (serve 14.2.6) does. `serve`
 *    is a thin CLI around `serve-handler`; this file calls the same library
 *    with the same options the CLI builds (node_modules/serve/build/main.js,
 *    `loadConfiguration` + `startServer`):
 *      { public: <out/>, etag: true, symlinks: undefined }
 *    behind the same `compression()` middleware the CLI adds (it only skips it
 *    for `--no-compression`). No `rewrites`: that is what `-s` would add, and
 *    SPA mode sends every route to the login page. So trailing slashes, the
 *    404 page, ETags and Content-Disposition headers are the ones the static
 *    server sends. (`serve` also reads an optional `out/serve.json`; the build
 *    has none, so there is nothing to replicate there.)
 *
 * 2. /api/ — small "rooms" the two devices share. Everything else in the demo
 *    still lives in each browser's localStorage; the client
 *    (src/lib/remote-sync.ts) mirrors only the Flow 3 offer and a tiny `idv`
 *    hand-off object into a room.
 *
 *    GET    /api/health              → { ok: true, publicUrl }
 *    POST   /api/rooms               → 201 { id, version, doc, meta }
 *    GET    /api/rooms/:room         → { version, doc, meta }
 *    POST   /api/rooms/:room         → body { by?, patch } — top-level merge
 *                                      (each key replaced whole, null deletes),
 *                                      bumps `version`
 *    DELETE /api/rooms/:room         → 204; the laptop's Reset (Esc, /reset)
 *    GET    /api/rooms/:room/events  → Server-Sent Events: `{version, doc,
 *                                      meta}` now and on every change, a
 *                                      comment heartbeat every 15 s
 *
 *    `meta[key] = { v, by }` records WHICH version last wrote each top-level
 *    key and which device (`by`, a random id the browser keeps) wrote it. The
 *    client uses it to apply only what ANOTHER device changed, which is what
 *    stops echo loops and stops a stale write rewinding a newer local state.
 *
 *    WHY TOP-LEVEL MERGE AND NOT A DEEP RFC 7386 MERGE: a deep merge keeps the
 *    fields of the previous offer (e.g. `issuedAt`) when a new offer replaces
 *    it. Replacing each top-level key whole is the same merge-patch rule one
 *    level down, and it is all the demo needs.
 *
 * GUARD RAILS: room ids are made HERE (128 random bits, 32 hex characters)
 * and every id in a URL is checked against /^[a-z0-9]{8,32}$/ (400 otherwise);
 * bodies are JSON only (415), 16 KB max (413), and a room's doc may not grow
 * past 16 KB; at most 500 rooms (503 when full), each dropped 2 h after its
 * last use; at most 16 live event streams per room; no CORS headers and a
 * cross-origin `Origin` is refused (403), so only the demo's own pages can
 * call it; unknown /api routes are 404, wrong methods 405. API input never
 * reaches the filesystem (static files are served only for non-/api paths),
 * nothing is written to disk and nothing is evaluated. The demo persona is
 * fake: no personal data reaches this server, only offer statuses and
 * hand-off flags.
 *
 * ENV
 *   PORT             default 4173
 *   HOST             default 0.0.0.0 (so a phone on the same Wi-Fi can reach it)
 *   DEMO_PUBLIC_URL  the address a PHONE can reach, which the QR codes encode,
 *                    e.g. http://192.168.1.23:4173 or https://gnl-demo.example.
 *                    Unset -> PUBLIC_BASE_URL, then this machine's first LAN
 *                    IPv4 + PORT.
 *   TLS_CERT/TLS_KEY paths to a PEM certificate and key; both set -> HTTPS.
 *                    Phones only allow the camera on HTTPS (docs/PHONE_PATH.md).
 *   DEMO_SYNC=off    serve the static build only; /api/* is then plain static
 *                    serving, exactly like `npm run serve`.
 * ==================================================================== */

import http from "node:http";
import https from "node:https";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { createReadStream, readFileSync, statSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

import compression from "compression";
import serveHandler from "serve-handler";

/* ------------------------------------------------------------ config -- */

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "out");

const PORT = Number.parseInt(process.env.PORT ?? "4173", 10);
const HOST = process.env.HOST || "0.0.0.0";
const TLS_CERT = process.env.TLS_CERT || "";
const TLS_KEY = process.env.TLS_KEY || "";
const SYNC = (process.env.DEMO_SYNC ?? "on").toLowerCase() !== "off";

const MAX_BODY = 16 * 1024;
const MAX_DOC = 16 * 1024;
const MAX_KEYS = 8;
const MAX_ROOMS = 500;
const ROOM_TTL_MS = 2 * 60 * 60 * 1000;
const SWEEP_MS = 5 * 60 * 1000;
const HEARTBEAT_MS = 15 * 1000;
const MAX_LISTENERS = 16;

const ROOM_ID = /^[a-z0-9]{8,32}$/;
const DEVICE_ID = /^[A-Za-z0-9_-]{8,64}$/;
const DOC_KEY = /^[a-z][A-Za-z0-9]{0,31}$/;

function fail(msg) {
  console.error(`demo-server: ${msg}`);
  process.exit(1);
}

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) fail(`PORT must be 1-65535, got "${process.env.PORT}"`);
if (Boolean(TLS_CERT) !== Boolean(TLS_KEY)) fail("set BOTH TLS_CERT and TLS_KEY, or neither");
try {
  if (!statSync(path.join(PUBLIC_DIR, "index.html")).isFile()) throw new Error();
} catch {
  fail(`no static build at ${PUBLIC_DIR} — run \`npm run build\` first`);
}

const TLS = Boolean(TLS_CERT && TLS_KEY);
const PROTOCOL = TLS ? "https" : "http";

function lanIPv4() {
  for (const list of Object.values(networkInterfaces())) {
    for (const a of list ?? []) {
      if ((a.family === "IPv4" || a.family === 4) && !a.internal) return a.address;
    }
  }
  return null;
}

/** The address QR codes encode: DEMO_PUBLIC_URL, PUBLIC_BASE_URL, or the LAN IP. */
function publicUrl() {
  for (const name of ["DEMO_PUBLIC_URL", "PUBLIC_BASE_URL"]) {
    const env = (process.env[name] || "").trim();
    if (!env) continue;
    try {
      const u = new URL(env);
      if (u.protocol === "http:" || u.protocol === "https:") return u.origin + u.pathname.replace(/\/+$/, "");
    } catch {
      /* ignore a malformed value; try the next source */
    }
  }
  const ip = lanIPv4();
  return ip ? `${PROTOCOL}://${ip}:${PORT}` : null;
}

/* ------------------------------------------------------ static files -- */

/* The exact option object `serve out` hands to serve-handler. */
const STATIC_CONFIG = { public: PUBLIC_DIR, etag: true, symlinks: undefined };
const compress = promisify(compression());

/*
 * ONE DELIBERATE DIFFERENCE FROM `serve`, invisible on the wire: a file
 * descriptor leak fix. serve-handler 6.1.7 opens a read stream for every file
 * BEFORE it decides the answer is a 304 (or a HEAD), and never closes it —
 * measured: 100 revalidated page loads = 100 descriptors left open, in
 * `serve out` and here alike. Browsers revalidate on every navigation, so a
 * long demo (or a few gate runs) ends in EMFILE and a crash. Each stream is
 * now closed when its response closes, and a read error drops that one
 * connection instead of killing the process. Status, headers and bodies are
 * unchanged.
 */
function staticMethods(res) {
  return {
    createReadStream(file, opts) {
      const stream = createReadStream(file, opts);
      stream.on("error", () => res.destroy());
      res.once("close", () => stream.destroy());
      return stream;
    },
  };
}

async function serveStatic(req, res) {
  await compress(req, res);
  await serveHandler(req, res, STATIC_CONFIG, staticMethods(res));
}

/* ------------------------------------------------------------- rooms -- */

/** id -> { version, doc, meta, touched, listeners: Set<fn> } */
const rooms = new Map();

function snapshot(r) {
  return { version: r.version, doc: r.doc, meta: r.meta };
}

function dropRoom(id) {
  const r = rooms.get(id);
  if (!r) return;
  rooms.delete(id);
  for (const l of [...r.listeners]) l(null);
}

function sweep(now = Date.now()) {
  for (const [id, r] of rooms) if (now - r.touched > ROOM_TTL_MS) dropRoom(id);
}
setInterval(sweep, SWEEP_MS).unref();

function createRoom() {
  if (rooms.size >= MAX_ROOMS) sweep();
  if (rooms.size >= MAX_ROOMS) return null;
  let id;
  do id = randomBytes(16).toString("hex");
  while (rooms.has(id));
  const r = { version: 0, doc: {}, meta: {}, touched: Date.now(), listeners: new Set() };
  rooms.set(id, r);
  return { id, r };
}

/** Validates a `{ by?, patch }` body. Returns an error string or null. */
function checkPatch(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) return "body must be an object";
  const { by, patch } = body;
  if (by !== undefined && (typeof by !== "string" || !DEVICE_ID.test(by))) return "bad `by`";
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return "`patch` must be an object";
  const keys = Object.keys(patch);
  if (keys.length === 0 || keys.length > MAX_KEYS) return `\`patch\` needs 1-${MAX_KEYS} keys`;
  for (const k of keys) if (!DOC_KEY.test(k)) return "bad key in `patch`";
  return null;
}

/* -------------------------------------------------------------- http -- */

const API_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
  "Cross-Origin-Resource-Policy": "same-origin",
};

function send(res, status, body) {
  if (status === 204) {
    res.writeHead(204, { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    return res.end();
  }
  const text = JSON.stringify(body);
  res.writeHead(status, { ...API_HEADERS, "Content-Length": Buffer.byteLength(text) });
  res.end(text);
}

const error = (res, status, message) => send(res, status, { ok: false, error: message });

/** Reads a JSON body of at most MAX_BODY bytes. Resolves { value } or { status, message }. */
function readJson(req) {
  return new Promise((resolve) => {
    const type = (req.headers["content-type"] || "").split(";")[0].trim().toLowerCase();
    if (type !== "application/json") return resolve({ status: 415, message: "JSON only" });
    const declared = Number(req.headers["content-length"] || 0);
    if (declared > MAX_BODY) return resolve({ status: 413, message: "body too large" });
    const chunks = [];
    let size = 0;
    let done = false;
    req.on("data", (c) => {
      if (done) return;
      size += c.length;
      if (size > MAX_BODY) {
        done = true;
        resolve({ status: 413, message: "body too large" });
        req.resume();
        return;
      }
      chunks.push(c);
    });
    req.on("end", () => {
      if (done) return;
      done = true;
      try {
        resolve({ value: JSON.parse(Buffer.concat(chunks).toString("utf8")) });
      } catch {
        resolve({ status: 400, message: "invalid JSON" });
      }
    });
    req.on("error", () => {
      if (!done) resolve({ status: 400, message: "read error" });
      done = true;
    });
  });
}

/** Same origin only: a browser sends `Origin` on cross-site requests; refuse any that is not us. */
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // same-origin GETs and non-browser clients
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

function openEvents(res, r) {
  if (r.listeners.size >= MAX_LISTENERS) return error(res, 429, "too many listeners in this room");
  const write = (snap) => {
    if (!snap) return res.end(); // room reset or expired
    res.write(`data: ${JSON.stringify(snap)}\n\n`);
  };
  r.listeners.add(write);
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
    "X-Content-Type-Options": "nosniff",
  });
  res.write("retry: 3000\n\n");
  write(snapshot(r));
  const beat = setInterval(() => res.write(": ping\n\n"), HEARTBEAT_MS);
  res.on("close", () => {
    clearInterval(beat);
    r.listeners.delete(write);
  });
}

async function api(req, res, url) {
  const parts = url.pathname.split("/").filter(Boolean); // ["api", ...]
  const method = req.method;

  if (!sameOrigin(req)) return error(res, 403, "cross-origin requests are not allowed");

  if (parts.length === 2 && parts[1] === "health") {
    if (method !== "GET" && method !== "HEAD") return error(res, 405, "method not allowed");
    return send(res, 200, { ok: true, publicUrl: publicUrl() });
  }

  if (parts[1] !== "rooms" || parts.length > 4) return error(res, 404, "not found");

  if (parts.length === 2) {
    if (method !== "POST") return error(res, 405, "method not allowed");
    const made = createRoom();
    if (!made) return error(res, 503, "too many rooms, try again later");
    return send(res, 201, { id: made.id, ...snapshot(made.r) });
  }

  const id = parts[2];
  if (!ROOM_ID.test(id)) return error(res, 400, "bad room id");
  const r = rooms.get(id);

  if (parts.length === 4) {
    if (parts[3] !== "events") return error(res, 404, "not found");
    if (method !== "GET") return error(res, 405, "method not allowed");
    if (!r) return error(res, 404, "no such room");
    r.touched = Date.now();
    return openEvents(res, r);
  }

  if (method === "GET" || method === "HEAD") {
    if (!r) return error(res, 404, "no such room");
    r.touched = Date.now();
    return send(res, 200, snapshot(r));
  }

  if (method === "DELETE") {
    dropRoom(id); // idempotent: an unknown room is already "reset"
    return send(res, 204);
  }

  if (method === "POST") {
    const body = await readJson(req);
    if (body.status) return error(res, body.status, body.message);
    if (!r) return error(res, 404, "no such room");
    const bad = checkPatch(body.value);
    if (bad) return error(res, 400, bad);
    const { by = "anon", patch } = body.value;
    const doc = { ...r.doc };
    for (const [k, v] of Object.entries(patch)) {
      if (v === null) delete doc[k];
      else doc[k] = v;
    }
    if (Buffer.byteLength(JSON.stringify(doc)) > MAX_DOC) return error(res, 413, "room doc too large");
    r.version += 1;
    r.doc = doc;
    const meta = { ...r.meta };
    for (const k of Object.keys(patch)) meta[k] = { v: r.version, by };
    r.meta = meta;
    r.touched = Date.now();
    const snap = snapshot(r);
    for (const l of [...r.listeners]) l(snap);
    return send(res, 200, snap);
  }

  return error(res, 405, "method not allowed");
}

async function onRequest(req, res) {
  try {
    const url = new URL(req.url || "/", "http://localhost");
    if (SYNC && (url.pathname === "/api" || url.pathname.startsWith("/api/"))) return await api(req, res, url);
    return await serveStatic(req, res);
  } catch (e) {
    console.error("demo-server: request failed:", e?.message ?? e);
    if (!res.headersSent) error(res, 500, "internal error");
    else res.end();
  }
}

/* ------------------------------------------------------------ server -- */

const server = TLS
  ? https.createServer({ cert: readFileSync(TLS_CERT), key: readFileSync(TLS_KEY) }, onRequest)
  : http.createServer(onRequest);

server.on("error", (e) => fail(e.code === "EADDRINUSE" ? `port ${PORT} is already in use` : e.message));

server.listen(PORT, HOST, () => {
  const base = publicUrl();
  console.log(`demo-server: serving ${path.relative(process.cwd(), PUBLIC_DIR) || "."} at ${PROTOCOL}://localhost:${PORT}/`);
  console.log(
    SYNC
      ? `demo-server: phone path available — QR codes will encode ${base ?? "the page's own address"}` +
          `\ndemo-server: turn it on in the laptop's browser at ${base ?? `${PROTOCOL}://localhost:${PORT}`}/demo/phone/`
      : "demo-server: phone path OFF (DEMO_SYNC=off) — static files only",
  );
});

function shutdown() {
  for (const id of [...rooms.keys()]) dropRoom(id);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
