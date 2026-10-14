"use client";

import {
  STORE_CHANGED_EVENT,
  STORE_KEY,
  emitStoreChanged,
  readStore,
  writeStore,
  type DemoStore,
} from "@/lib/demo-state";

/* ====================================================================
 * DEMO MOCK — NOT A CREDENTIAL ISSUER. NOTHING HERE TALKS TO A NETWORK.
 *
 * FLOW3_BRIEF.md §3: "Add a sibling mock credential issuer, clearly labelled
 * in the code as a demo mock." ADDED 2026-09-29.
 *
 * It plays the part of GNL's issuing service in Flow 3 ("Issuance of Vehicle
 * Registration Certificate", Figma section 6343:84884) and, since 2026-10-14,
 * Flow 4 ("Issuance of Notice of Assessment", StudentAidNL, 6422:98300): the
 * same issuer, an offer now says WHICH credential it is (`CredentialKind`).
 * The C1 page (F3-02, 6220:86445; Flow 4's 6412:85663) calls `createOffer()`
 * and shows the offer as a QR
 * code; the wallet mock (W-01..W-09) calls `updateOffer()` as the user moves
 * through it; the C1 page `subscribe()`s and changes its state line.
 *
 * WHERE THE OFFERS LIVE: inside the demo's existing `gnl-demo:v1` store
 * (`wallet.offers`, `wallet.currentOfferId`), in localStorage. That is the
 * brief's "reuse the sync": a write here fires the browser's `storage` event
 * in every OTHER same-origin window — the C1 window, the wallet popup, the
 * presenter stage's two iframes — and DemoStateProvider's existing listener
 * re-reads. The window that wrote hears it through STORE_CHANGED_EVENT.
 * No BroadcastChannel (optional in the brief; `storage` already reaches
 * every window that matters, which the click gate's sync test proves).
 *
 * FAKE LATENCY, 300–800 ms per call (brief §3), so the desktop visibly
 * "hears" the phone a beat later, as it would over a network.
 *
 * ONE QUEUE PER WINDOW. Calls are applied strictly in the order they were
 * made, whatever latency each one drew. Without this, "connected" (800 ms)
 * followed quickly by "declined" (300 ms) would land in the wrong order and
 * the desktop would end on "Adding to your wallet" after a decline.
 *
 * `issued` IS FINAL. Once the certificate is issued, no later status change
 * applies (Back from W-08 and Continue on W-07 again must not rewind the
 * desktop). Only a NEW offer ("Get a new code", expiry) or Reset starts over.
 * ==================================================================== */

export type OfferStatus =
  | "created" //       QR shown on C1
  | "scanned" //       wallet opened the offer (scanner detected the QR, or a deep link)
  | "connected" //     user accepted the connection (W-03)
  | "viewed" //        user opened the offer details (W-04 -> W-05)
  | "accepted" //      user accepted + consented (W-05)
  | "code_verified" // user entered the 6-digit code (W-07)
  | "issued" //        credential stored in the wallet (W-08)
  | "declined"; //     user declined in the wallet (W-03 / W-05)

/**
 * WHICH CREDENTIAL AN OFFER IS FOR — ADDED 2026-10-14 with Flow 4
 * ("Issuance of Notice of Assessment", Figma section 6422:98300).
 *
 * The kind is the issuing SERVICE's id, and each kind has exactly one
 * credential type. Flow 3's pair is unchanged; Flow 4 adds StudentAidNL's.
 * Everything that differs between the two credentials on screen (copy, rows,
 * icons, the W-07 code mode) is looked up from the kind — see
 * src/lib/data/credentials.ts — so the issuer itself stays credential-blind.
 */
export const CREDENTIAL_TYPE = {
  "driver-vehicle": "VehicleRegistrationCertificate",
  studentaid: "NoticeOfAssessment",
} as const;

export type CredentialKind = keyof typeof CREDENTIAL_TYPE;
export type CredentialType = (typeof CREDENTIAL_TYPE)[CredentialKind];

/**
 * The kind every pre-Flow-4 caller meant. `createOffer()` with no argument,
 * an offer from an older store, and "no offer at all" all read as Flow 3's
 * vehicle certificate — which is what keeps Flow 3 byte-for-byte the same.
 */
export const DEFAULT_KIND: CredentialKind = "driver-vehicle";

export function isCredentialKind(v: unknown): v is CredentialKind {
  return typeof v === "string" && Object.prototype.hasOwnProperty.call(CREDENTIAL_TYPE, v);
}

/** The kind of an offer; null / unknown -> DEFAULT_KIND (Flow 3). */
export function offerKind(o: Pick<CredentialOffer, "serviceId"> | null | undefined): CredentialKind {
  return o && isCredentialKind(o.serviceId) ? o.serviceId : DEFAULT_KIND;
}

export interface CredentialOffer {
  id: string;
  serviceId: CredentialKind;
  credentialType: CredentialType;
  status: OfferStatus;
  createdAt: string;
  /** createdAt + OFFER_TTL_MS — drives the optional countdown on F3-02. */
  expiresAt: string;
  issuedAt?: string;
  /**
   * NOT IN THE BRIEF'S INTERFACE — an addition. When the offer first left
   * the "waiting" states. The F3-02 countdown freezes at this moment, so it
   * does not tick on (or silently replace the QR) while the wallet is using
   * the offer.
   */
  scannedAt?: string;
}

/**
 * "This code expires in 8 minutes" — F3-02's line under the card
 * (6220:86469). The only source for the lifetime.
 */
export const OFFER_TTL_MS = 8 * 60 * 1000;

/** The statuses in which the desktop shows "Waiting for scan" (brief §3 table). */
export function isWaiting(status: OfferStatus): boolean {
  return status === "created" || status === "declined";
}

/** Fake network latency — 300–800 ms (brief §3). Zero under the reduced-latency flag below. */
function latency(): Promise<void> {
  const ms = LATENCY_OFF ? 0 : 300 + Math.random() * 500;
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Test-only escape hatch: `window.__GNL_DEMO_NO_LATENCY__ = true` before the
 * page loads. Not used by any gate today (they wait for the real latency);
 * kept so a future gate can opt out without touching this module.
 */
const LATENCY_OFF =
  typeof window !== "undefined" &&
  (window as unknown as { __GNL_DEMO_NO_LATENCY__?: boolean }).__GNL_DEMO_NO_LATENCY__ === true;

/** Per-window FIFO — see "ONE QUEUE PER WINDOW". */
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(job: () => T): Promise<T> {
  const run = queue.then(latency).then(job);
  queue = run.catch(() => undefined);
  return run;
}

/** A short, random, URL-safe id. `crypto.randomUUID` where available. */
function newId(): string {
  const c = typeof crypto !== "undefined" ? crypto : undefined;
  if (c && "randomUUID" in c) return c.randomUUID().replace(/-/g, "").slice(0, 12);
  return Math.random().toString(36).slice(2, 14);
}

function mutate(fn: (prev: DemoStore) => DemoStore): DemoStore {
  const next = fn(readStore());
  writeStore(next);
  emitStoreChanged();
  return next;
}

/** Read without latency — for rendering. The async API below is for "calls". */
export function peekOffer(id: string | null | undefined): CredentialOffer | null {
  if (!id || typeof window === "undefined") return null;
  return readStore().wallet?.offers?.[id] ?? null;
}

/** The offer the C1 page created most recently (the one the wallet works on). */
export function peekCurrentOffer(): CredentialOffer | null {
  if (typeof window === "undefined") return null;
  const w = readStore().wallet;
  return (w?.currentOfferId && w.offers?.[w.currentOfferId]) || null;
}

/**
 * The most recent offer of one kind (the one that kind's C1 page shows), or
 * null. Flow 4: with two credentials there can be one offer of each kind —
 * see `withOffer`.
 */
export function peekOfferOfKind(kind: CredentialKind): CredentialOffer | null {
  if (typeof window === "undefined") return null;
  return latestOfKind(readStore().wallet?.offers, kind);
}

export function latestOfKind(
  offers: Record<string, CredentialOffer> | undefined,
  kind: CredentialKind,
): CredentialOffer | null {
  let best: CredentialOffer | null = null;
  for (const o of Object.values(offers ?? {})) {
    if (offerKind(o) !== kind) continue;
    if (!best || Date.parse(o.createdAt) > Date.parse(best.createdAt)) best = o;
  }
  return best;
}

/**
 * `offers` with `offer` added and every OTHER offer of the same kind dropped.
 *
 * CHANGED 2026-10-14 (Flow 4). It used to be "older offers are dropped" — all
 * of them — because there was one credential. Now ONE OFFER PER KIND is kept:
 * running Flow 4 after Flow 3 must not wipe Flow 3's issued offer, or the
 * vehicle C1 page would fall back to "Waiting for scan…" for a certificate
 * that is already in the wallet. With only the vehicle kind in play (every
 * Flow 3 run) this is exactly the old rule.
 */
export function withOffer(
  offers: Record<string, CredentialOffer> | undefined,
  offer: CredentialOffer,
): Record<string, CredentialOffer> {
  const kind = offerKind(offer);
  const next: Record<string, CredentialOffer> = {};
  for (const [id, o] of Object.entries(offers ?? {})) {
    if (offerKind(o) !== kind) next[id] = o;
  }
  next[offer.id] = offer;
  return next;
}

/**
 * Create an offer of `kind` and make it the current one. Older offers OF THE
 * SAME KIND are dropped (`withOffer`) — the demo has one QR on screen at a
 * time per credential, and the wallet's issued cards are kept separately
 * (`wallet.cardIssuedAt` / `wallet.noaIssuedAt`), so nothing the audience
 * sees is lost. No argument = Flow 3's vehicle certificate, as before.
 */
export function createOffer(kind: CredentialKind = DEFAULT_KIND): Promise<CredentialOffer> {
  return enqueue(() => {
    const now = Date.now();
    const offer: CredentialOffer = {
      id: newId(),
      serviceId: kind,
      credentialType: CREDENTIAL_TYPE[kind],
      status: "created",
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + OFFER_TTL_MS).toISOString(),
    };
    mutate((prev) => ({
      ...prev,
      wallet: { ...prev.wallet, offers: withOffer(prev.wallet?.offers, offer), currentOfferId: offer.id },
    }));
    return offer;
  });
}

export function getOffer(id: string): Promise<CredentialOffer | null> {
  return enqueue(() => peekOffer(id));
}

/**
 * Patch an offer. Unknown id -> null, nothing written. `issued` is final (see
 * the header). Moving to `issued` stamps `issuedAt`; leaving the waiting
 * states stamps `scannedAt` once.
 */
export function updateOffer(
  id: string,
  patch: Partial<Pick<CredentialOffer, "status">>,
): Promise<CredentialOffer | null> {
  return enqueue(() => {
    const cur = peekOffer(id);
    if (!cur) return null;
    if (cur.status === "issued" && patch.status && patch.status !== "issued") return cur;
    const next: CredentialOffer = { ...cur, ...patch };
    if (patch.status === "issued" && !cur.issuedAt) next.issuedAt = new Date().toISOString();
    if (patch.status && !isWaiting(patch.status) && !cur.scannedAt) {
      next.scannedAt = new Date().toISOString();
    }
    mutate((prev) => ({
      ...prev,
      wallet: { ...prev.wallet, offers: { ...prev.wallet?.offers, [id]: next } },
    }));
    return next;
  });
}

/**
 * Point the wallet at an offer id taken from a QR / deep link
 * (`/wallet/start/?offer=ID`). Synchronous: this is the wallet deciding what
 * it is looking at, not a call to the issuer. Returns false if the id is
 * unknown in this browser (e.g. a real phone — brief §3 "Real phone", P2).
 */
export function selectOffer(id: string): boolean {
  if (!peekOffer(id)) return false;
  mutate((prev) => ({ ...prev, wallet: { ...prev.wallet, currentOfferId: id } }));
  return true;
}

/**
 * Listen to one offer. `cb` fires with the offer whenever it changes — in
 * this window (STORE_CHANGED_EVENT) or another one (`storage`) — and once
 * immediately with its current value. Returns the unsubscribe function.
 */
export function subscribe(id: string, cb: (offer: CredentialOffer | null) => void): () => void {
  let last = JSON.stringify(peekOffer(id));
  cb(peekOffer(id));
  const check = () => {
    const now = peekOffer(id);
    const key = JSON.stringify(now);
    if (key === last) return;
    last = key;
    cb(now);
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === STORE_KEY) check();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(STORE_CHANGED_EVENT, check);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORE_CHANGED_EVENT, check);
  };
}
