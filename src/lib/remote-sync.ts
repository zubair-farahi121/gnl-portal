"use client";

import {
  ROOM_KEY,
  STORE_CHANGED_EVENT,
  emitStoreChanged,
  readStore,
  writeStore,
  type DemoStore,
} from "@/lib/demo-state";
import { SERVICES, type ServiceId } from "@/lib/data/service-config";
import { MOBILE_ROUTE } from "@/lib/data/phone-path";
import type { CredentialOffer, OfferStatus } from "@/lib/mock-issuer";

/* ====================================================================
 * REMOTE SYNC — "the phone path". ADDED 2026-09-30, docs/PHONE_PATH.md.
 *
 * The demo keeps its state in each browser's localStorage (`gnl-demo:v1`),
 * and windows of ONE browser stay in step through the `storage` event. A real
 * phone is a different browser, so it needs a server in the middle. When the
 * build is served by server/demo-server.mjs (`npm run serve:phone`), this
 * module mirrors TWO small things into a shared "room" on that server:
 *
 *   wallet  the Flow 3 offer the C1 page shows as a QR (the current offer
 *           only, `{ currentOfferId, offers: { [id]: offer } }`)
 *   idv     the CertifiO ID hand-off: `{ status, service, run }`
 *
 * Nothing else leaves the browser (no persona, no onboarding progress).
 *
 * OPT-IN, PER LAPTOP BROWSER. The laptop only opens a room once the presenter
 * has turned phone mode on at /demo/phone/ (`gnl-demo:phone-mode` = "on", kept
 * across resets). Until then this module makes NO request at all — not even
 * the /api/health probe — so the static build and the server build look and
 * behave identically, pixel for pixel. The PHONE needs no opt-in: it arrives
 * through a QR whose URL names a room (`?room=…`), and that is its consent.
 *
 * HOW A REMOTE CHANGE REACHES THE UI. It is written into the local store and
 * STORE_CHANGED_EVENT is fired — the same same-window signal the mock issuer
 * uses — so the C1 state line, the QR overlay and everything else that
 * already listens react with no other change. Other windows of the same
 * browser hear it through `storage`, as before.
 *
 * NO ECHO LOOPS. The server keeps, per top-level key, the version that last
 * wrote it and the DEVICE that wrote it (`meta[key] = { v, by }`; the device
 * id is random and kept in localStorage, so every window of one browser is
 * one device). A client applies a key only when its version is newer than
 * the last one it saw AND another device wrote it. Its own writes come back
 * with its own id and are skipped; writes it applies are never pushed again
 * (`applying`), and a push only happens when the mirrored value really
 * changed (`lastWallet`).
 *
 * WHO LISTENS. Only the two laptop screens that wait for the phone poll the
 * room: the C1 wallet page and "Continue on a smartphone". The phone only
 * pushes. Polling is a plain GET once a second rather than an EventSource
 * (the server offers SSE too): a held-open connection keeps a page from ever
 * being "network idle", which stalls the browser-automation gates, and some
 * proxies buffer event streams. A GET a second is nothing for one laptop.
 *
 * RESET. `resetAll` (Esc, /reset) fires ROOM_RESET_EVENT with the room it
 * dropped; RemoteSyncBridge calls `clearRoom`, which DELETEs it on the
 * server, so the phone's next push finds nothing and the next run gets a
 * fresh room.
 * ==================================================================== */

export type Health = { publicUrl: string | null };
type Meta = Record<string, { v: number; by: string }>;
export type RoomState = { version: number; doc: Record<string, unknown>; meta: Meta };
export type IdvStatus = "waiting" | "started" | "complete";
export type IdvDoc = { status: IdvStatus; service: ServiceId; run: string };
type WalletMirror = { currentOfferId: string; offers: Record<string, CredentialOffer> } | null;

const DEVICE_KEY = "gnl-demo:device";
/** localStorage, the LAPTOP's opt-in. Survives Reset on purpose: it is a presenter setting. */
export const PHONE_MODE_KEY = "gnl-demo:phone-mode";
/** sessionStorage: this PHONE tab arrived through a hand-off QR. */
const HANDOFF_KEY = "gnl-demo:handoff";
/**
 * localStorage: the room THIS browser created (the laptop). Only the creator
 * may DELETE a room — a phone that resets (CID verified "Log out") only
 * detaches, so it cannot end the laptop's session mid-demo.
 */
const OWNER_KEY = "gnl-demo:room-owner";

/** Same rule as the server. Ids are 32 hex characters; the range is the server's guard. */
export const ROOM_RE = /^[a-z0-9]{8,32}$/;
const TOKEN_RE = /^[A-Za-z0-9_-]{8,64}$/;
const OFFER_ID_RE = /^[A-Za-z0-9_-]{1,64}$/;
const STATUSES: readonly OfferStatus[] = [
  "created",
  "scanned",
  "connected",
  "viewed",
  "accepted",
  "code_verified",
  "issued",
  "declined",
];
const IDV_STATUSES: readonly IdvStatus[] = ["waiting", "started", "complete"];
const SERVICE_IDS = Object.keys(SERVICES) as ServiceId[];

const POLL_MS = 1000;
const HEALTH_TIMEOUT_MS = 1500;
const REQUEST_TIMEOUT_MS = 5000;

/* --------------------------------------------------------- utilities -- */

function randomToken(bytes = 12): string {
  const a = new Uint8Array(bytes);
  crypto.getRandomValues(a);
  let s = "";
  for (const b of a) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function lsGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function lsSet(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* private mode — sync still works for this page's lifetime */
  }
}

export function isServiceId(v: unknown): v is ServiceId {
  return typeof v === "string" && (SERVICE_IDS as string[]).includes(v);
}

function isIso(v: unknown): v is string {
  return typeof v === "string" && v.length <= 40 && !Number.isNaN(Date.parse(v));
}

let memDevice: string | null = null;
function deviceId(): string {
  if (memDevice) return memDevice;
  const stored = lsGet(DEVICE_KEY);
  if (stored && TOKEN_RE.test(stored)) return (memDevice = stored);
  memDevice = randomToken(12);
  lsSet(DEVICE_KEY, memDevice);
  return memDevice;
}

function storageWorks(): boolean {
  try {
    localStorage.getItem(ROOM_KEY);
    return true;
  } catch {
    return false;
  }
}

function storedRoom(): string | null {
  const v = lsGet(ROOM_KEY);
  return v && ROOM_RE.test(v) ? v : null;
}

/** Has the presenter turned phone mode on in this (laptop) browser? */
export function phoneModeOn(): boolean {
  return lsGet(PHONE_MODE_KEY) === "on";
}

export function setPhoneMode(on: boolean) {
  lsSet(PHONE_MODE_KEY, on ? "on" : null);
  if (!on) {
    /* Off means off: no stored room left behind for resumeStoredRoom. */
    const id = storedRoom();
    lsSet(ROOM_KEY, null);
    void clearRoom(id);
  }
}

/* ------------------------------------------------------------ server -- */

type Result = { ok: true; state: RoomState } | { ok: false; gone: boolean };

function parseState(j: unknown): RoomState | null {
  if (!j || typeof j !== "object") return null;
  const { version, doc, meta } = j as Record<string, unknown>;
  if (typeof version !== "number" || !doc || typeof doc !== "object" || !meta || typeof meta !== "object") return null;
  const clean: Meta = {};
  for (const [k, m] of Object.entries(meta as Record<string, unknown>)) {
    const { v, by } = (m ?? {}) as Record<string, unknown>;
    if (typeof v === "number" && typeof by === "string") clean[k] = { v, by };
  }
  return { version, doc: doc as Record<string, unknown>, meta: clean };
}

async function call(path: string, init?: RequestInit): Promise<Result & { id?: string }> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(path, { cache: "no-store", ...init, signal: ctl.signal });
    if (!res.ok) return { ok: false, gone: res.status === 404 };
    const j = (await res.json()) as Record<string, unknown>;
    const state = parseState(j);
    if (!state) return { ok: false, gone: false };
    return { ok: true, state, id: typeof j.id === "string" ? j.id : undefined };
  } catch {
    return { ok: false, gone: false };
  } finally {
    clearTimeout(t);
  }
}

const getState = (id: string) => call(`/api/rooms/${id}`);

function postPatch(id: string, patch: Record<string, unknown>) {
  return call(`/api/rooms/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ by: deviceId(), patch }),
  });
}

/* ------------------------------------------------------------ health -- */

let health: Promise<Health | null> | null = null;

/**
 * Is the sync server there? Asked at most ONCE per page load, with a short
 * timeout, and only by a caller that has a reason to (an opted-in laptop, a
 * phone URL naming a room, a stored room). null = no (static build, timeout).
 */
export function probeSync(): Promise<Health | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  health ??= (async () => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), HEALTH_TIMEOUT_MS);
    try {
      const res = await fetch("/api/health", { cache: "no-store", signal: ctl.signal });
      if (!res.ok) return null;
      const j = (await res.json()) as Record<string, unknown>;
      if (!j || j.ok !== true) return null;
      const base =
        typeof j.publicUrl === "string" && /^https?:\/\/[^\s"'<>]+$/.test(j.publicUrl)
          ? j.publicUrl.replace(/\/+$/, "")
          : null;
      return { publicUrl: base };
    } catch {
      return null;
    } finally {
      clearTimeout(t);
    }
  })();
  return health;
}

/** LAPTOP: the server, but only when the presenter opted in. No request otherwise. */
export function laptopSync(): Promise<Health | null> {
  if (typeof window === "undefined" || !phoneModeOn()) return Promise.resolve(null);
  return probeSync();
}

/**
 * The address QR codes encode in phone mode: the server's `publicUrl`
 * (DEMO_PUBLIC_URL, or the laptop's LAN address), then the build-time
 * PUBLIC_BASE_URL, then wherever this page was loaded from.
 */
export function qrBase(h: Health): string {
  const build = (process.env.PUBLIC_BASE_URL || "").replace(/\/+$/, "");
  return h.publicUrl || build || window.location.origin;
}

/* ------------------------------------------------------ local mirror -- */

let room: string | null = null;
let attached: { id: string; p: Promise<RoomState | null> } | null = null;
let attachSeq = 0;
const lastSeen: Record<string, number> = {};
let lastWallet: string | undefined;
let applying = false;
let pushChain: Promise<unknown> = Promise.resolve();
let pusherOn = false;

function walletMirror(store: DemoStore): WalletMirror {
  const id = store.wallet?.currentOfferId;
  const offer = id ? store.wallet?.offers?.[id] : undefined;
  return id && offer ? { currentOfferId: id, offers: { [id]: offer } } : null;
}

/** Remote wallet -> a clean mirror, or `undefined` if it is not one. */
function sanitizeWallet(v: unknown): WalletMirror | undefined {
  if (v === null || v === undefined) return null;
  if (typeof v !== "object") return undefined;
  const { currentOfferId: id, offers } = v as Record<string, unknown>;
  if (typeof id !== "string" || !OFFER_ID_RE.test(id) || !offers || typeof offers !== "object") return undefined;
  const o = (offers as Record<string, unknown>)[id] as Record<string, unknown> | undefined;
  if (!o || typeof o !== "object") return undefined;
  if (o.id !== id || o.serviceId !== "driver-vehicle" || o.credentialType !== "VehicleRegistrationCertificate") return undefined;
  if (!STATUSES.includes(o.status as OfferStatus) || !isIso(o.createdAt) || !isIso(o.expiresAt)) return undefined;
  const offer: CredentialOffer = {
    id,
    serviceId: "driver-vehicle",
    credentialType: "VehicleRegistrationCertificate",
    status: o.status as OfferStatus,
    createdAt: o.createdAt,
    expiresAt: o.expiresAt,
    ...(isIso(o.issuedAt) ? { issuedAt: o.issuedAt } : {}),
    ...(isIso(o.scannedAt) ? { scannedAt: o.scannedAt } : {}),
  };
  return { currentOfferId: id, offers: { [id]: offer } };
}

/** Write a remote wallet into the local store and tell this window's UI. */
function applyWallet(remote: WalletMirror) {
  const store = readStore();
  lastWallet = JSON.stringify(remote);
  if (JSON.stringify(walletMirror(store)) === lastWallet) return;
  const wallet = { ...store.wallet };
  if (remote) {
    wallet.offers = { ...remote.offers };
    wallet.currentOfferId = remote.currentOfferId;
  } else {
    delete wallet.offers;
    delete wallet.currentOfferId;
  }
  writeStore({ ...store, wallet });
  applying = true;
  try {
    emitStoreChanged();
  } finally {
    applying = false;
  }
}

/** A snapshot from the server: apply what ANOTHER device changed since we last looked. */
function receive(st: RoomState) {
  const me = deviceId();
  for (const [k, m] of Object.entries(st.meta)) {
    if (m.v <= (lastSeen[k] ?? 0)) continue;
    lastSeen[k] = m.v;
    if (k !== "wallet" || m.by === me) continue;
    const w = sanitizeWallet(st.doc.wallet);
    if (w !== undefined) applyWallet(w);
  }
}

function detach() {
  room = null;
  attached = null;
  attachSeq++; // an attach still in flight must not re-store the room
  lastWallet = undefined;
  for (const k of Object.keys(lastSeen)) delete lastSeen[k];
}

/**
 * The server no longer has `id` (server restart, 2 h expiry, deleted): stop
 * using it, so the next ensureRoom ("Get a new code", the 8-minute refresh)
 * makes a fresh room instead of resuming a dead one from the cache.
 */
function forgetRoom(id: string) {
  if (room === id) detach();
  if (storedRoom() === id) lsSet(ROOM_KEY, null);
}

/** Local change (mock issuer, reset) -> push the wallet if it really changed. */
function onLocalChange() {
  if (applying || !room) return;
  if (storageWorks() && storedRoom() !== room) {
    detach(); // Reset (Esc, /reset) dropped the room: stop mirroring into it
    return;
  }
  const m = walletMirror(readStore());
  const json = JSON.stringify(m);
  if (json === lastWallet) return;
  lastWallet = json;
  void pushPatch({ wallet: m }).then((st) => {
    /* Not sent: do not count it as sent, so the next change pushes again. */
    if (!st && lastWallet === json) lastWallet = undefined;
  });
}

function startPusher() {
  if (pusherOn) return;
  pusherOn = true;
  window.addEventListener(STORE_CHANGED_EVENT, onLocalChange);
}

/**
 * Attach this window to a room.
 *   join    the PHONE, arriving from a QR: take what the other device wrote.
 *   resume  the LAPTOP (or any page reload): keep local state, but adopt the
 *           phone's progress on the SAME offer (a laptop reload mid-flow).
 */
function attach(id: string, mode: "join" | "resume"): Promise<RoomState | null> {
  if (mode === "resume" && attached?.id === id) return attached.p;
  const seq = ++attachSeq;
  const p = (async () => {
    const r = await getState(id);
    if (seq !== attachSeq) return null; // a newer attach (or a reset) won
    if (!r.ok) {
      if (r.gone && storedRoom() === id) lsSet(ROOM_KEY, null);
      return null;
    }
    /* A reset landed while we were asking: do not bring the room back. */
    if (mode === "resume" && storageWorks() && storedRoom() !== id) return null;
    const st = r.state;
    room = id;
    lsSet(ROOM_KEY, id);
    for (const k of Object.keys(lastSeen)) delete lastSeen[k];
    for (const [k, m] of Object.entries(st.meta)) lastSeen[k] = m.v;
    startPusher();

    const me = deviceId();
    const local = walletMirror(readStore());
    const m = st.meta.wallet;
    const remote = m ? sanitizeWallet(st.doc.wallet) : null;
    if (mode === "join") {
      if (m && m.by !== me && remote !== undefined && remote !== null) applyWallet(remote);
      else lastWallet = JSON.stringify(local); // nothing to take; do not push stale local state
    } else if (
      remote &&
      m?.by !== me &&
      remote.currentOfferId === local?.currentOfferId &&
      JSON.stringify(remote) !== JSON.stringify(local)
    ) {
      applyWallet(remote);
    } else {
      lastWallet = JSON.stringify(remote ?? null);
      onLocalChange();
    }
    return st;
  })();
  attached = { id, p };
  void p.then((st) => {
    if (!st && attached?.p === p) attached = null;
  });
  return p;
}

/** Serialised POST of a top-level patch to the current room. */
export function pushPatch(patch: Record<string, unknown>): Promise<RoomState | null> {
  const id = room;
  if (!id) return Promise.resolve(null);
  const run = pushChain.then(async () => {
    const r = await postPatch(id, patch);
    if (!r.ok) {
      if (r.gone) forgetRoom(id);
      return null;
    }
    for (const k of Object.keys(patch)) {
      const m = r.state.meta[k];
      if (m) lastSeen[k] = Math.max(lastSeen[k] ?? 0, m.v);
    }
    return r.state;
  });
  pushChain = run.catch(() => null);
  return run;
}

/* --------------------------------------------------------------- API -- */

/** LAPTOP: the stored room, or a new one. null when phone mode is off or unavailable. */
export async function ensureRoom(): Promise<string | null> {
  if (!(await laptopSync())) return null;
  const stored = storedRoom();
  if (stored && (await attach(stored, "resume"))) return stored;
  const made = await call("/api/rooms", { method: "POST" });
  if (!made.ok || !made.id || !ROOM_RE.test(made.id)) return null;
  lsSet(ROOM_KEY, made.id);
  lsSet(OWNER_KEY, made.id);
  return (await attach(made.id, "resume")) ? made.id : null;
}

/** PHONE: join the room a QR code named. null when the server is absent or the id is bad/unknown. */
export async function joinRoom(id: string | null): Promise<RoomState | null> {
  if (!id || !ROOM_RE.test(id)) return null;
  if (!(await probeSync())) return null;
  return attach(id, "join");
}

/**
 * ANY PAGE, once, from RemoteSyncBridge: re-attach after a full reload so a
 * phone that reloads mid-flow keeps pushing. Does nothing without a stored
 * room (so never on a static build), or when the URL is about to join one.
 */
export async function resumeStoredRoom(): Promise<void> {
  const stored = storedRoom();
  if (!stored || new URLSearchParams(window.location.search).has("room")) return;
  if (!(await probeSync())) return;
  await attach(stored, "resume");
}

/**
 * RESET (Esc, /reset, "Log out" on CID verified, phone mode off): forget the
 * room here and — only in the browser that created it (OWNER_KEY) — delete it
 * on the server, so a phone from this run can no longer move the laptop and
 * nothing from it lingers in memory. A phone that resets only detaches.
 */
export async function clearRoom(id: string | null): Promise<void> {
  if (room) detach();
  if (!id || !ROOM_RE.test(id)) return;
  /* Only the browser that created the room deletes it (see OWNER_KEY). */
  if (lsGet(OWNER_KEY) !== id) return;
  lsSet(OWNER_KEY, null);
  if (!(await probeSync())) return;
  try {
    await fetch(`/api/rooms/${id}`, { method: "DELETE", cache: "no-store", keepalive: true });
  } catch {
    /* the room expires on its own after 2 h */
  }
}

/**
 * LAPTOP: poll the room once a second (see "WHO LISTENS") and apply what
 * the phone changed. `cb` also gets every snapshot. Returns stop().
 */
export function watchRoom(cb?: (st: RoomState) => void): () => void {
  let stopped = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const tick = async () => {
    const id = room;
    if (id) {
      const r = await getState(id);
      if (stopped) return;
      if (r.ok && id === room) {
        receive(r.state);
        cb?.(r.state);
      } else if (!r.ok && r.gone) {
        forgetRoom(id);
      }
    }
    if (!stopped) timer = setTimeout(tick, POLL_MS);
  };
  void tick();
  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}

export function readIdv(v: unknown): IdvDoc | null {
  if (!v || typeof v !== "object") return null;
  const { status, service, run } = v as Record<string, unknown>;
  if (!IDV_STATUSES.includes(status as IdvStatus) || !isServiceId(service)) return null;
  if (typeof run !== "string" || !TOKEN_RE.test(run)) return null;
  return { status: status as IdvStatus, service, run };
}

/**
 * LAPTOP, "Continue on a smartphone": open a hand-off for `service`. Writes a
 * fresh `run` id, so a phone from an earlier run can never advance this
 * screen. Returns the URL the QR should encode, or null when phone mode is off.
 */
export async function openHandoff(service: ServiceId): Promise<{ url: string; run: string } | null> {
  const h = await laptopSync();
  if (!h) return null;
  const id = await ensureRoom();
  if (!id) return null;
  const run = randomToken(9);
  const st = await pushPatch({ idv: { status: "waiting", service, run } });
  if (!st) return null;
  return { url: `${qrBase(h)}${MOBILE_ROUTE}?room=${id}&service=${service}`, run };
}

type HandoffRecord = { room: string; service: ServiceId; run: string };

function readHandoff(): HandoffRecord | null {
  try {
    const v = JSON.parse(sessionStorage.getItem(HANDOFF_KEY) ?? "null") as Record<string, unknown> | null;
    if (!v || typeof v.room !== "string" || !ROOM_RE.test(v.room)) return null;
    if (!isServiceId(v.service) || typeof v.run !== "string" || !TOKEN_RE.test(v.run)) return null;
    return { room: v.room, service: v.service, run: v.run };
  } catch {
    return null;
  }
}

/** PHONE: did this tab arrive through the laptop's hand-off QR for `service`? */
export function isHandoffTab(service: ServiceId): boolean {
  return readHandoff()?.service === service;
}

/**
 * PHONE, /cid/mobile/: join, check the laptop really opened a hand-off for
 * this service, remember it for this tab, and tell the laptop the phone has
 * started. false = carry on standalone (server absent, unknown room…).
 */
export async function startHandoff(id: string | null, service: ServiceId): Promise<boolean> {
  const st = await joinRoom(id);
  if (!st || !id) return false;
  const idv = readIdv(st.doc.idv);
  if (!idv || idv.service !== service) return false;
  try {
    sessionStorage.setItem(HANDOFF_KEY, JSON.stringify({ room: id, service, run: idv.run }));
  } catch {
    /* ignore */
  }
  return Boolean(await pushPatch({ idv: { status: "started", service, run: idv.run } }));
}

/**
 * PHONE, CID verified: if this tab came through a hand-off for `service`,
 * tell the laptop verification is complete. true = the laptop was told.
 */
export async function completeHandoff(service: ServiceId): Promise<boolean> {
  const rec = readHandoff();
  if (!rec || rec.service !== service) return false;
  if (!(await probeSync())) return false;
  if (room !== rec.room && !(await attach(rec.room, "join"))) return false;
  return Boolean(await pushPatch({ idv: { status: "complete", service, run: rec.run } }));
}
