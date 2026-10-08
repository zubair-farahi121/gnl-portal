"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  IconArrowRight,
  IconClose,
  IconBack,
  WALLET_BUTTON_CLASS,
  walletButtonStyle,
} from "@/components/wallet/WalletUi";
import { useDemoState } from "@/lib/demo-state";
import { SAME_DEVICE_KEY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_SIZE } from "@/lib/data/wallet-tokens";
import { peekCurrentOffer, updateOffer, type OfferStatus } from "@/lib/mock-issuer";

/*
 * WALLET — the client pieces the screens share. ADDED 2026-09-29 with the
 * FLOW3_BRIEF.md rework (§6 header and navigation rules, §7 statuses).
 *
 * HOW A WALLET SCREEN TALKS TO THE DESKTOP. Every status change goes through
 * `useOfferStatus().set(status)`, which calls the DEMO MOCK issuer
 * (src/lib/mock-issuer.ts) for the CURRENT offer and does NOT wait for it:
 * the wallet moves on at once, and the C1 page in the other window hears
 * the change 300–800 ms later, as it would over a network. The issuer's
 * per-window queue keeps the calls in order whatever latency each one draws.
 */

/** Fire-and-forget status change on the current offer. No offer -> no-op. */
export function useOfferStatus() {
  const { walletOffer } = useDemoState();
  const set = useCallback((status: OfferStatus) => {
    const cur = peekCurrentOffer();
    if (cur) void updateOffer(cur.id, { status });
  }, []);
  return { offer: walletOffer, set };
}

/* ------------------------------------------------------ screen wrapper -- */

/** sessionStorage key: the next screen should enter from the LEFT (a Back). */
const NAV_DIR_KEY = "gnl-demo:wallet-nav";

export function markBackNavigation() {
  try {
    sessionStorage.setItem(NAV_DIR_KEY, "back");
  } catch {
    /* private mode — the screen just enters from the right */
  }
}

/**
 * One wallet screen — `<main>` inside the phone's scroll area.
 *
 * - brief §8: enters with a ~250 ms push from the right; from the LEFT when it
 *   was reached by a Back (header arrow). The direction is read in a layout
 *   effect, before paint on a client navigation, so the markup the server
 *   rendered is unchanged (no hydration question).
 * - `padBottom`: every screen keeps the phone's 34 px home-indicator strip
 *   clear; W-07 turns it off and pads its own #F3F5FB keypad area instead.
 * - scrolls the phone back to the top on arrival (the scroll area is shared
 *   by every screen, so W-05's scroll position must not carry into W-06).
 */
export function WalletScreen({
  screen,
  nodeId,
  children,
  className = "",
  style,
  padBottom = true,
}: {
  screen: string;
  nodeId: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  padBottom?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    try {
      if (sessionStorage.getItem(NAV_DIR_KEY) === "back") {
        sessionStorage.removeItem(NAV_DIR_KEY);
        ref.current?.setAttribute("data-dir", "back");
      }
    } catch {
      /* ignore */
    }
    ref.current?.closest("[data-wallet-scroll]")?.scrollTo({ top: 0 });
  }, []);
  return (
    <main
      ref={ref}
      className={`gnl-wallet-push flex w-full flex-1 shrink-0 flex-col ${className}`}
      style={{ paddingBottom: padBottom ? WALLET_SIZE.homeIndicatorArea : 0, ...style }}
      data-wallet-screen={screen}
      data-node-id={nodeId}
    >
      {children}
    </main>
  );
}

/* ------------------------------------------------------------- header -- */

/**
 * Close ✕ (brief §6): wallet home; if the credential is not issued yet the
 * offer goes back to `created`, so the desktop shows "Waiting for scan" again.
 */
export function useWalletClose() {
  const router = useRouter();
  const { set } = useOfferStatus();
  return useCallback(() => {
    const cur = peekCurrentOffer();
    if (cur && cur.status !== "issued" && cur.status !== "created") set("created");
    router.push(FLOW3_ROUTES.walletHome);
  }, [router, set]);
}

/**
 * The wallet header on W-03..W-08 (brief §6; header-container 6325:60180 and
 * its twins): 24 px sides; a 40 px row with the back arrow (16 px, 70 % ink)
 * left and the close ✕ (16 px, 2 px lines, 70 % ink) right; then the progress
 * bar — 6 px #E6E8EF track, radius 3, #1E404D fill at the brief's percentage.
 *
 * Esc = close (brief §12). DemoNav leaves Escape alone on these screens.
 */
export function WalletHeader({ back, progress }: { back: string; progress: number }) {
  const close = useWalletClose();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[12px] px-[24px] pb-[8px]" data-wallet-header="true">
      <div className="flex h-[40px] w-full items-center justify-between">
        <Link
          href={back}
          onClick={markBackNavigation}
          aria-label="Back"
          data-wallet-back="true"
          className="-ml-[12px] flex size-[40px] items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#1e404d]"
        >
          <IconBack />
        </Link>
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          data-wallet-close="true"
          className="-mr-[12px] flex size-[40px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#1e404d]"
        >
          <IconClose />
        </button>
      </div>
      <div
        className="flex w-full items-start overflow-hidden"
        style={{ height: WALLET_SIZE.progressHeight, borderRadius: "3px", background: WALLET_COLOR.line }}
        role="progressbar"
        aria-label="Progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div className="h-full" style={{ width: `${progress * 100}%`, background: WALLET_COLOR.brand }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ buttons -- */

/**
 * A wallet button that sets an offer status and then navigates — W-03
 * connect / decline, W-04 view offer, W-05 accept / decline.
 */
export function WalletStatusButton({
  status,
  href,
  children,
  variant = "primary",
  armConnect = false,
  dataAction,
}: {
  status: OfferStatus;
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  /** W-05 "Add to wallet" (was "Accept"): arm W-06's one-shot auto-advance. */
  armConnect?: boolean;
  dataAction?: string;
}) {
  const router = useRouter();
  const { set } = useOfferStatus();
  const { armWalletConnect } = useDemoState();
  return (
    <button
      type="button"
      className={WALLET_BUTTON_CLASS}
      style={walletButtonStyle(variant)}
      data-wallet-action={dataAction ?? status}
      onClick={() => {
        set(status);
        if (armConnect) armWalletConnect();
        router.push(href);
      }}
    >
      {children}
    </button>
  );
}

/**
 * Moves the offer forward when a screen OPENS, if it is behind — so the
 * presenter's ArrowRight (DemoNav), a typed URL or a same-device deep link
 * tells the desktop the same story as the buttons do.
 *   W-03  created / declined  -> scanned
 *   W-08  anything but issued -> issued  (and the wallet stores the card)
 * Renders nothing. Waits for `ready` (the store is only readable after mount).
 */
export function WalletEnsureStatus({ screen }: { screen: "W-03" | "W-08" }) {
  const { ready, storeWalletCard } = useDemoState();
  const { set } = useOfferStatus();
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    const cur = peekCurrentOffer();
    if (screen === "W-03") {
      if (cur && (cur.status === "created" || cur.status === "declined")) set("scanned");
    } else {
      storeWalletCard();
      if (cur && cur.status !== "issued") set("issued");
    }
  }, [ready, screen, set, storeWalletCard]);
  return null;
}

/* -------------------------------------------------------- card count -- */

/**
 * "2 cards total" before the certificate is added, "3 cards total" after
 * (brief §7 W-09; also W-01's all-cards card). Reads the WALLET's own record
 * (`cardIssuedAt`). Prerendered as 2 — the store is empty until mount — so
 * the server HTML and the first client render agree.
 */
export function WalletCardCount({ style }: { style?: React.CSSProperties }) {
  const { walletCardIssuedAt } = useDemoState();
  const n = walletCardIssuedAt ? 3 : 2;
  return (
    <span style={style} data-wallet-count={n}>
      {`${n} cards total`}
    </span>
  );
}

/**
 * W-02's close ✕ (1.5 px, ink — 6286:90670) -> W-01, with the §6 close rule.
 * Esc does the same (brief §12).
 */
export function WalletScanClose() {
  const close = useWalletClose();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);
  return (
    <button
      type="button"
      onClick={close}
      aria-label="Close"
      data-wallet-close="true"
      className="-mr-[12px] flex size-[40px] cursor-pointer items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-[#1e404d]"
    >
      <IconClose color={WALLET_COLOR.text} width={1.5} />
    </button>
  );
}

/** W-08's primary button: a link with the white → (arrow_forward visible in 6240:55238). */
export function WalletLinkWithArrow({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className={WALLET_BUTTON_CLASS} style={walletButtonStyle("primary")} data-wallet-action="go-to-wallet">
      <span>{children}</span>
      <IconArrowRight />
    </Link>
  );
}

/* ------------------------------------------------- same-device return -- */

/**
 * iOS-style "◀ MyGovNL" beside the clock — FLOW3_BRIEF.md §8, same-device
 * mode only (this tab came in through F3-03's "Add to Apple / Google Wallet",
 * i.e. /wallet/start/?from=mygovnl). It returns to F3-03, which then shows the
 * GNL toast "Added to your wallet" if the certificate was issued.
 * Read from sessionStorage after mount, so the static HTML never has it.
 */
export function SameDeviceBackLink() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    try {
      setOn(sessionStorage.getItem(SAME_DEVICE_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);
  if (!on) return null;
  return (
    <Link
      href={`${FLOW3_ROUTES.c1}?from=wallet`}
      className="whitespace-nowrap rounded-[4px] focus-visible:outline-2 focus-visible:outline-[#1e404d]"
      style={{ fontSize: "12px", fontWeight: 600, lineHeight: "18px", color: WALLET_COLOR.brand }}
      data-wallet-mygovnl="true"
    >
      ◀ MyGovNL
    </Link>
  );
}
