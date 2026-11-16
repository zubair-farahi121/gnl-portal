import { MOBILE_ROUTE } from "@/lib/data/phone-path";
import { SERVICES, cidRoutes, serviceRoutes, type ServiceId } from "@/lib/data/service-config";

/*
 * THE IDV PRESENTER STAGE's hand-off — ADDED 2026-10-23.
 *
 * /demo/idv-stage/ shows the portal (left) and a phone (right) side by side,
 * as /demo/wallet-stage/ does for the wallet flows. Both are SAME-ORIGIN
 * iframes of one browser tab, so the "Continue on a smartphone" hand-off
 * does not need the laptop server the real-phone path uses
 * (src/lib/remote-sync.ts, docs/PHONE_PATH.md): one localStorage record,
 * `gnl-demo:stage-idv`, and the `storage` event, which every OTHER frame of
 * the tab receives. It works on a static host (Vercel).
 *
 *   desktop frame  "Continue on a smartphone"  -> record `waiting`
 *   phone frame    scans (or the QR is clicked) -> /cid/mobile/ -> `started`
 *   phone frame    CertifiO ID … verified       -> `complete`
 *   desktop frame  sees `complete`              -> markVerified, moves on,
 *                                                  record `consumed`
 *
 * WHICH FRAME AM I. The stage names its iframes (`window.name`), and a frame
 * keeps its name across every navigation inside it — so a page knows it is
 * the stage's desktop or phone without any query parameter. Outside the
 * stage `window.name` is "" and every function here is a no-op / false: no
 * existing screen changes behaviour.
 *
 * RESUME. The record also keeps the phone's last CertifiO ID screen
 * (`phoneRoute`). Reopening the stage — another presenter, a reload, Shift+W
 * again — puts the phone back exactly there, and the desktop frame opens on
 * the page the presenter was on.
 *
 * RESET. `resetAll` (Esc, the stage's Reset button) removes this key with
 * the store; the phone frame hears it and returns to its home screen.
 */

export const STAGE_KEY = "gnl-demo:stage-idv";
/** Same-window change event: `storage` only reaches OTHER frames. */
export const STAGE_EVENT = "gnl-demo:stage-changed";

export const STAGE_FRAME_NAME = {
  desktop: "gnl-stage-desktop",
  phone: "gnl-stage-phone",
} as const;

export const IDV_STAGE_ROUTE = "/demo/idv-stage/";
export const STAGE_PHONE_HOME = "/demo/idv-phone/";

export type StageRole = keyof typeof STAGE_FRAME_NAME;
export type StageStatus = "waiting" | "started" | "complete";
export type StageRecord = {
  status: StageStatus;
  service: ServiceId;
  run: string;
  /** The phone's last CertifiO ID screen, path + query. */
  phoneRoute?: string;
  /** Set when the desktop's QR is clicked: the phone "scans" by itself. */
  scan?: number;
  /** The desktop has already acted on `complete`. */
  consumed?: boolean;
};

const STATUSES: readonly StageStatus[] = ["waiting", "started", "complete"];
const RUN_RE = /^[a-z0-9]{6,24}$/;

export function isServiceIdValue(v: unknown): v is ServiceId {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(SERVICES, v);
}

export function stageRole(): StageRole | null {
  try {
    if (typeof window === "undefined" || window.self === window.top) return null;
    if (window.name === STAGE_FRAME_NAME.desktop) return "desktop";
    if (window.name === STAGE_FRAME_NAME.phone) return "phone";
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * A same-origin path a stage frame may open: "/x/…" in plain URL characters
 * only — never "//host", a backslash, whitespace or a control character
 * (browsers drop tabs and newlines from URLs, so "/\t/host" would become
 * "//host") — and never the stage itself.
 */
const SAFE_PATH_RE = /^\/(?!\/)[A-Za-z0-9\-._~/?=&%]*$/;
export function safeStagePath(v: string | null): string | null {
  if (!v || v.length > 300 || !SAFE_PATH_RE.test(v)) return null;
  if (v.startsWith("/demo/")) return null;
  return v;
}

/** The service a portal or CertifiO ID path belongs to, if it names one. */
export function serviceFromPath(pathname: string): ServiceId | null {
  for (const id of Object.keys(SERVICES) as ServiceId[]) {
    if (pathname.startsWith(`/services/${id}/`)) return id;
  }
  /* /cid/mobile/ names its service in the query (`?service=`), not the path. */
  if (pathname.startsWith(MOBILE_ROUTE)) return null;
  if (pathname.startsWith("/cid/studentaid/")) return "studentaid";
  if (pathname.startsWith("/cid/")) return "driver-vehicle";
  return null;
}

/**
 * Pages where Shift+W opens the WALLET stage: the wallet itself, the "add to
 * your wallet" (C1) pages, and a service page once the service is Trusted —
 * where the wallet story starts. Everywhere else in the journey (login,
 * dashboard, the service page before onboarding, the wizard, CertifiO ID,
 * processing) Shift+W opens the IDV stage on that page. CHANGED 2026-10-23
 * after the first try-out: the IDV stage used to open from the wizard and
 * CertifiO ID pages only, so Shift+W on the login page showed the wallet.
 */
export function isWalletStagePath(pathname: string, trusted: (id: ServiceId) => boolean): boolean {
  if (pathname.startsWith("/wallet/") || pathname.startsWith("/demo/") || pathname.startsWith(MOBILE_ROUTE)) return true;
  const id = serviceFromPath(pathname);
  if (!id) return false;
  const r = serviceRoutes(id);
  if (pathname === `${r.page}wallet/`) return true;
  return pathname === r.page && trusted(id);
}

export function idvStageUrl(service: ServiceId, from?: string): string {
  const q = new URLSearchParams({ service });
  if (from) q.set("from", from);
  return `${IDV_STAGE_ROUTE}?${q.toString()}`;
}

export function phoneHomeUrl(service: ServiceId): string {
  return `${STAGE_PHONE_HOME}?service=${service}`;
}

export function phoneDoneUrl(service: ServiceId): string {
  return `${MOBILE_ROUTE}?done=1&service=${service}`;
}

export function readStage(): StageRecord | null {
  try {
    const v = JSON.parse(localStorage.getItem(STAGE_KEY) ?? "null") as Record<string, unknown> | null;
    if (!v || typeof v !== "object") return null;
    if (!STATUSES.includes(v.status as StageStatus) || !isServiceIdValue(v.service)) return null;
    if (typeof v.run !== "string" || !RUN_RE.test(v.run)) return null;
    const phoneRoute = typeof v.phoneRoute === "string" ? safeStagePath(v.phoneRoute) ?? undefined : undefined;
    return {
      status: v.status as StageStatus,
      service: v.service,
      run: v.run,
      ...(phoneRoute ? { phoneRoute } : {}),
      ...(typeof v.scan === "number" ? { scan: v.scan } : {}),
      ...(v.consumed === true ? { consumed: true } : {}),
    };
  } catch {
    return null;
  }
}

function writeStage(rec: StageRecord | null) {
  try {
    if (rec) localStorage.setItem(STAGE_KEY, JSON.stringify(rec));
    else localStorage.removeItem(STAGE_KEY);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(STAGE_EVENT));
}

export function clearStage() {
  writeStage(null);
}

/** Calls `cb` with the record now and on every change, from any frame. Returns stop(). */
export function watchStage(cb: (rec: StageRecord | null) => void): () => void {
  const fire = () => cb(readStage());
  const onStorage = (e: StorageEvent) => {
    if (e.key === STAGE_KEY || e.key === null) fire();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(STAGE_EVENT, fire);
  fire();
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STAGE_EVENT, fire);
  };
}

function newRun(): string {
  const a = new Uint8Array(8);
  crypto.getRandomValues(a);
  return Array.from(a, (b) => (b % 36).toString(36)).join("");
}

/**
 * DESKTOP frame, "Continue on a smartphone". Keeps a run that is still in
 * progress for this service (so reopening the stage never strands the phone),
 * otherwise starts a fresh one. A FINISHED run is never reused: arriving here
 * after one (Back, "Continue on my computer", a second demo) means a new
 * hand-off, never an instant jump past the scan. Returns the record to act on.
 */
export function openStageHandoff(service: ServiceId): StageRecord {
  const cur = readStage();
  if (cur && cur.service === service && cur.status !== "complete") return cur;
  const rec: StageRecord = { status: "waiting", service, run: newRun() };
  writeStage(rec);
  return rec;
}

/** The URL the stage's QR encodes. Cosmetic: the phone frame is driven by the record. */
export function stageQrUrl(service: ServiceId): string {
  return `${window.location.origin}${MOBILE_ROUTE}?service=${service}`;
}

/** DESKTOP frame: the presenter clicked the QR — the phone scans it. */
export function requestStageScan(run: string) {
  const cur = readStage();
  if (!cur || cur.run !== run || cur.status !== "waiting") return;
  writeStage({ ...cur, scan: Date.now() });
}

/** DESKTOP frame: it has moved on after `complete`. */
export function consumeStage(run: string) {
  const cur = readStage();
  if (cur && cur.run === run) writeStage({ ...cur, consumed: true });
}

/** PHONE frame, /cid/mobile/: the scan landed. false = not a stage phone, or nothing to join. */
export function startStageHandoff(service: ServiceId): boolean {
  if (stageRole() !== "phone") return false;
  const cur = readStage();
  if (!cur || cur.service !== service || cur.status === "complete") return false;
  writeStage({ ...cur, status: "started", phoneRoute: cidRoutes(service).terms });
  return true;
}

/** PHONE frame: is this verification the desktop's hand-off? */
export function isStageHandoffTab(service: ServiceId): boolean {
  if (stageRole() !== "phone") return false;
  const cur = readStage();
  return Boolean(cur && cur.service === service && cur.status !== "waiting");
}

/** PHONE frame, CertifiO ID verified: tell the desktop. true = it was told. */
export function completeStageHandoff(service: ServiceId): boolean {
  if (!isStageHandoffTab(service)) return false;
  const cur = readStage();
  if (!cur) return false;
  if (cur.status !== "complete") writeStage({ ...cur, status: "complete", phoneRoute: phoneDoneUrl(service) });
  return true;
}

/** PHONE frame: remember the CertifiO ID screen it is on, for resume. */
export function notePhoneRoute(route: string) {
  if (stageRole() !== "phone") return;
  const cur = readStage();
  const safe = safeStagePath(route);
  if (!cur || cur.status !== "started" || !safe || !safe.startsWith("/cid/") || safe.startsWith(MOBILE_ROUTE)) return;
  if (cur.phoneRoute === safe) return;
  writeStage({ ...cur, phoneRoute: safe });
}

/*
 * Requests from a stage frame (or the stage page's own keys) to the stage
 * page: leave the stage (Shift+W) or reset it (Esc). A frame posts to its
 * parent, same origin only; the stage page also listens for the same names
 * as window events, which its own DemoNav dispatches.
 */
export const STAGE_MSG = { exit: "gnl-stage:exit", reset: "gnl-stage:reset" } as const;
export type StageMsg = (typeof STAGE_MSG)[keyof typeof STAGE_MSG];

export function askStage(type: StageMsg) {
  try {
    window.parent.postMessage({ gnlStage: type }, window.location.origin);
  } catch {
    /* ignore */
  }
}
