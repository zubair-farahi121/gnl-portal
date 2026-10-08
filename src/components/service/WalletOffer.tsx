"use client";

/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

import { showDemoToast } from "@/components/ui/DemoToast";
import { useDemoState } from "@/lib/demo-state";
import { C1_COPY, C1_STATUS, WALLET_WINDOW, desktopState, type DesktopState } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import {
  OFFER_TTL_MS,
  createOffer,
  isWaiting,
  peekCurrentOffer,
  subscribe,
  type CredentialOffer,
} from "@/lib/mock-issuer";
import { qrMatrix, walletOfferUrl } from "@/lib/qr";
import { ensureRoom, laptopSync, qrBase, watchRoom } from "@/lib/remote-sync";

/*
 * F3-02 / F3-03 — the LIVE parts of the C1 page "Add your vehicle
 * registration certificate to your wallet". ADDED 2026-09-29 with the
 * FLOW3_BRIEF.md rework (§3, §5). GNL design throughout (Lato, GNL colours):
 * nothing from the wallet's visual language appears here.
 *
 * ====================================================================
 * THE OFFER (brief §5 "Behaviour").
 *   - When the page opens it asks the DEMO MOCK issuer for an offer — unless
 *     one already exists and is still usable, so a REFRESH KEEPS THE STATE
 *     (brief §9): mid-flow it still says "Adding…", after issuing "Added…".
 *     "Usable" = not expired, or already past the waiting states.
 *   - It `subscribe()`s to the offer and maps its status to the desktop's
 *     three states (brief §3 table, `desktopState`).
 *   - "Get a new code" makes a new offer, and a new QR (brief §13 P1).
 *   - The countdown (P1) ticks mm:ss from `expiresAt`; at zero, while still
 *     waiting, a new offer is created SILENTLY. Once the wallet has picked the
 *     offer up it freezes at `scannedAt` — it is no longer counting anything.
 *
 * HYDRATION. The static HTML has no offer: the QR area is an empty 196.5 px
 * square, the state line says "Waiting for scan…" and the timer "08:00". The
 * store is read after mount (the demo-wide rule, src/lib/demo-state.tsx), so
 * the first client render matches, and the offer arrives as an update.
 * ====================================================================
 */

type OfferCtx = {
  offer: CredentialOffer | null;
  /** Phone path: the shared room the QR names, or null (phone mode off / static build). */
  sync: { base: string; room: string } | null;
  state: DesktopState;
  remainingMs: number;
  newCode: () => void;
};

const Ctx = createContext<OfferCtx | null>(null);

function useOfferCtx(): OfferCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("WalletOffer parts must be inside WalletOfferProvider");
  return v;
}

function isUsable(o: CredentialOffer | null, now: number): o is CredentialOffer {
  if (!o) return false;
  if (!isWaiting(o.status)) return true;
  return Date.parse(o.expiresAt) > now;
}

/**
 * Keyframes for this page only — emitted by the provider, `gnl-c1w-` prefixed,
 * all removed under prefers-reduced-motion (brief §8).
 */
const C1_CSS = `
@keyframes gnl-c1w-fade { from { opacity: 0; } to { opacity: 1; } }
.gnl-c1w-fade { animation: gnl-c1w-fade 300ms ease-out both; }
@keyframes gnl-c1w-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .35; transform: scale(.8); } }
.gnl-c1w-pulse { animation: gnl-c1w-pulse 1.6s ease-in-out infinite; }
@keyframes gnl-c1w-dots { from { width: 0; } to { width: 1.05em; } }
.gnl-c1w-dots { display: inline-block; overflow: hidden; vertical-align: bottom; white-space: nowrap; animation: gnl-c1w-dots 1.2s steps(4, jump-none) infinite; }
@keyframes gnl-c1w-spin { to { transform: rotate(360deg); } }
.gnl-c1w-spin { animation: gnl-c1w-spin 900ms linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .gnl-c1w-fade, .gnl-c1w-pulse, .gnl-c1w-dots, .gnl-c1w-spin { animation: none; }
  .gnl-c1w-dots { width: auto; }
}
`;

export function WalletOfferProvider({ children }: { children: React.ReactNode }) {
  const { ready, walletOffer } = useDemoState();
  const [offer, setOffer] = useState<CredentialOffer | null>(null);
  const [now, setNow] = useState<number | null>(null);
  const creating = useRef(false);

  const make = useCallback(() => {
    if (creating.current) return;
    creating.current = true;
    void createOffer().finally(() => {
      creating.current = false;
    });
  }, []);

  /* On open: reuse a usable offer, else create one. Also re-runs after a Reset
     in another window (the offer vanishes -> a new one is made). */
  const currentId = walletOffer?.id ?? null;
  useEffect(() => {
    if (!ready) return;
    if (!isUsable(peekCurrentOffer(), Date.now())) make();
  }, [ready, currentId, make]);

  /* Same-device return (brief §8): the wallet's "◀ MyGovNL" lands here with
     ?from=wallet — announce the result with the GNL toast, then drop the
     param so a refresh does not repeat it. */
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("from") !== "wallet") return;
    window.history.replaceState(null, "", window.location.pathname);
    if (peekCurrentOffer()?.status === "issued") showDemoToast(C1_COPY.returnToast);
  }, [ready]);

  /* Listen to the current offer (brief §5: "The page listens to the offer"). */
  useEffect(() => {
    if (!currentId) {
      setOffer(null);
      return;
    }
    return subscribe(currentId, setOffer);
  }, [currentId]);

  /*
   * THE PHONE PATH (2026-09-30, docs/PHONE_PATH.md). Only when the build is
   * served by server/demo-server.mjs AND phone mode is on (/demo/phone/):
   * join (or start) the shared room, so the QR can name it and a real
   * phone's progress reaches this page. The phone's writes land in the local
   * store and fire the store's own change event, so `subscribe` above and
   * the state line react exactly as they do for the pop-up. Re-checked when
   * the offer changes: a Reset (Esc) drops the room and the next offer starts
   * a new one. Otherwise `laptopSync` says no without a single request.
   */
  const [sync, setSync] = useState<OfferCtx["sync"]>(null);
  useEffect(() => {
    if (!ready) return;
    let dead = false;
    void (async () => {
      const h = await laptopSync();
      if (!h || dead) return;
      const room = await ensureRoom();
      if (dead) return;
      const base = qrBase(h);
      setSync((prev) => (room ? (prev?.room === room && prev.base === base ? prev : { base, room }) : null));
    })();
    return () => {
      dead = true;
    };
  }, [ready, currentId]);

  /* …and listen for the phone while this page is open (a GET a second). */
  const syncOn = sync !== null;
  useEffect(() => (syncOn ? watchRoom() : undefined), [syncOn]);

  /* The countdown clock — one tick a second, client-only. */
  useEffect(() => {
    if (!ready) return;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [ready]);

  const waiting = !offer || isWaiting(offer.status);
  const remainingMs = !offer
    ? OFFER_TTL_MS
    : Math.max(
        0,
        Date.parse(offer.expiresAt) -
          (waiting || !offer.scannedAt ? (now ?? Date.parse(offer.createdAt)) : Date.parse(offer.scannedAt)),
      );

  /* At zero, while waiting: silently a new offer (brief §13 P1). */
  useEffect(() => {
    if (offer && waiting && now !== null && remainingMs <= 0) make();
  }, [offer, waiting, now, remainingMs, make]);

  const value = useMemo<OfferCtx>(
    () => ({ offer, sync, state: desktopState(offer?.status), remainingMs, newCode: make }),
    [offer, sync, remainingMs, make],
  );

  return (
    <Ctx.Provider value={value}>
      <style>{C1_CSS}</style>
      {children}
    </Ctx.Provider>
  );
}

/* ------------------------------------------------------------------ QR -- */

/**
 * "image 13" (6220:86458, 220.4 x 196.5) — the QR, generated in code from
 * the offer (brief §3, §10 item 2: never the Figma image, which is a crop of
 * a CertifiO screenshot). Drawn 196.5 px square, centred in the 220 box.
 *
 * CLICKING IT OPENS THE PHONE VIEW WINDOW at W-01 (brief §3, P0): a named
 * ~400 x 860 popup, re-used on a second click; a blocked popup falls back to
 * a new tab. Still a real <a href> so it works from the keyboard and the
 * gates can read where it points.
 *
 * OVERLAY (brief §8, P1): during "Adding" the QR dims to ~35 % with a small
 * spinner; on "Added" to ~20 % with a green (#198754) check badge. The QR
 * never moves.
 */
export function OfferQr() {
  const { offer, sync, state } = useOfferCtx();
  const text = offer ? walletOfferUrl(offer.id, sync) : null;
  const qr = useMemo(() => (text ? qrMatrix(text) : null), [text]);
  const quiet = 4;
  const box = qr ? qr.size + quiet * 2 : 1;
  const dim = state === "adding" ? 0.35 : state === "added" ? 0.2 : 1;

  return (
    <a
      href={WALLET_WINDOW.href}
      target={WALLET_WINDOW.name}
      aria-label="QR code to add your vehicle registration certificate to your wallet. Opens the wallet in a new window."
      className="relative flex h-[196.5px] w-[220.4px] cursor-pointer items-center justify-center rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#004b87]"
      data-wallet-qr="true"
      data-qr-text={text ?? ""}
      data-qr-url={text ?? ""}
      data-offer-id={offer?.id ?? ""}
      data-node-id="6220:86458"
      onClick={(e) => {
        e.preventDefault();
        const w = window.open(WALLET_WINDOW.href, WALLET_WINDOW.name, WALLET_WINDOW.features);
        if (w) w.focus();
        else window.open(WALLET_WINDOW.href, "_blank");
      }}
    >
      {qr ? (
        /* The fade is on this wrapper, the dim on the <svg>: an animation with
           `fill-mode: both` would otherwise pin opacity at 1 over the inline
           dim. */
        <span key={text ?? ""} className="gnl-c1w-fade block">
          <svg
            viewBox={`${-quiet} ${-quiet} ${box} ${box}`}
            width="196.5"
            height="196.5"
            shapeRendering="crispEdges"
            role="img"
            aria-label="QR code to add your vehicle registration certificate to your wallet"
            className="block transition-opacity duration-300"
            style={{ opacity: dim }}
            data-qr-modules={qr.size}
          >
            <rect x={-quiet} y={-quiet} width={box} height={box} fill="#ffffff" />
            <path d={qr.path} fill="#000000" />
          </svg>
        </span>
      ) : (
        <span className="block size-[196.5px] rounded-[4px] bg-[#f4f6f8]" aria-hidden="true" data-qr-pending="true" />
      )}
      {state === "adding" ? (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span className="gnl-c1w-spin block size-[36px] rounded-full border-[3px] border-[#d4d8da] border-t-[#004b87]" />
        </span>
      ) : null}
      {state === "added" ? (
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span className="gnl-c1w-fade flex size-[48px] items-center justify-center rounded-full bg-[#198754]">
            <svg viewBox="0 0 24 24" width="26" height="26" className="block">
              <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </span>
      ) : null}
    </a>
  );
}

/* ---------------------------------------------------------- state line -- */

/**
 * The state line (6220:86460 / 6289:45291 / 6289:46119 — Lato Light 16
 * #5f6368, centred). `aria-live="polite"` (brief §5, §12). ONE element whose
 * text changes, with the P1 extras (brief §8): a cross-fade between states,
 * a soft pulsing dot on "Waiting for scan", animated dots on "Adding to your
 * wallet". The TEXT is exactly the Figma string in every state — the dots
 * animation only clips how much of the "…" is visible.
 */
export function OfferStateLine() {
  const { state } = useOfferCtx();
  const text = C1_STATUS[state];
  const base = text.endsWith("…") ? text.slice(0, -1) : text;
  return (
    <p
      className="w-full text-center text-[16px] font-light leading-[1.5] text-[color:var(--gnl-text,#5f6368)] [word-break:break-word]"
      data-node-id="6220:86460"
      data-wallet-status={state}
      role="status"
      aria-live="polite"
    >
      <span key={state} className="gnl-c1w-fade inline-flex items-center justify-center gap-[8px]">
        {state === "waiting" ? (
          <span aria-hidden="true" className="gnl-c1w-pulse inline-block size-[8px] rounded-full bg-[#004b87]" />
        ) : null}
        {state === "adding" ? (
          <span>
            {base}
            <span className="gnl-c1w-dots">…</span>
          </span>
        ) : (
          <span>{text}</span>
        )}
      </span>
    </p>
  );
}

/* --------------------------------------------------------- expiry line -- */

function mmss(ms: number): string {
  const s = Math.ceil(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/**
 * 6220:86469 — "This code expires in **8 minutes**. Trouble scanning? Get a
 * new code". P1 (brief §13): the time counts down as **mm:ss**, and "Get a new
 * code" makes a new offer and QR. Lato Regular 16 #5f6368, the time Bold, the
 * link #004b87 underlined.
 */
export function OfferExpiryLine() {
  const { remainingMs, newCode } = useOfferCtx();
  return (
    <p
      className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]"
      data-node-id="6220:86469"
    >
      {C1_COPY.expiry.before}{" "}
      <span className="font-bold tabular-nums" data-wallet-countdown="true">
        {mmss(remainingMs)}
      </span>
      {C1_COPY.expiry.after} {C1_COPY.expiry.trouble}{" "}
      <button
        type="button"
        onClick={newCode}
        data-wallet-new-code="true"
        className="cursor-pointer text-[16px] font-normal leading-[1.5] text-[#004b87] underline decoration-solid decoration-from-font [text-decoration-skip-ink:none] [text-underline-position:from-font] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004b87]"
      >
        {C1_COPY.expiry.link}
      </button>
    </p>
  );
}

/* ---------------------------------------------------- same-device path -- */

/**
 * F3-03's two buttons (6220:86500 / 6220:86503): 361 x 48, radius 8, padding
 * 12/16, Lato 700 15 white; "Add to Apple Wallet" on #000000 with the white
 * Apple mark (20 x 24), "Add to Google Wallet" on #1F1F1F with the Google
 * Wallet mark (24 x 24) — the REAL marks from design-reference/flow3/brand.
 * Both open the wallet mock at W-03 through /wallet/start/ (same-device
 * mode, brief §3), with this page's offer.
 */
export function SameDeviceButtons() {
  const { offer } = useOfferCtx();
  const href = `${FLOW3_ROUTES.start}?${offer ? `offer=${encodeURIComponent(offer.id)}&` : ""}from=mygovnl`;
  const cls =
    "box-border flex h-[48px] w-full items-center justify-center gap-[10px] rounded-[8px] px-[16px] py-[12px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004b87]";
  return (
    <div className="flex w-full flex-col items-start gap-[12px]" data-node-id="6220:86499">
      <Link href={href} className={`${cls} bg-black`} data-wallet-same-device="apple" data-node-id="6220:86500">
        <img src="/assets/flow3/apple-logo-white.png" alt="" width={20} height={24} className="block h-[24px] w-[20px] object-contain" />
        <span className="whitespace-nowrap text-[15px] font-bold leading-[normal] text-white">{C1_COPY.addToApple}</span>
      </Link>
      <Link href={href} className={`${cls} bg-[#1f1f1f]`} data-wallet-same-device="google" data-node-id="6220:86503">
        <img src="/assets/flow3/google-wallet-logo.png" alt="" width={24} height={24} className="block size-[24px]" />
        <span className="whitespace-nowrap text-[15px] font-bold leading-[normal] text-white">{C1_COPY.addToGoogle}</span>
      </Link>
    </div>
  );
}
