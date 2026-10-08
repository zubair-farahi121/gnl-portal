"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { WalletHeader, WalletScreen } from "@/components/wallet/WalletClient";
import { WalletLoadingDots } from "@/components/wallet/WalletGlyphs";
import { WalletHeading, WalletLead, WalletStatusBar } from "@/components/wallet/WalletUi";
import { useDemoState } from "@/lib/demo-state";
import { WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_PROGRESS, WALLET_TIMING } from "@/lib/data/wallet-tokens";

/*
 * W-06 — "Connecting wallet...". Figma 6293:46861 (390 x 844, `Screen 2:
 * Wallet Redirect`), progress 60 %. ADDED 2026-09-29; REWORKED to
 * FLOW3_BRIEF.md §7 W-06.
 *
 * A TRANSITION SCREEN: it leaves by itself after ~1.8 s for W-07.
 *
 * ONE-SHOT, SO BACK DOES NOT BOUNCE (the /auth/loading/ lesson, DEMO_AUDIT.md
 * NL-21). The advance is ARMED by W-05's "Add to wallet" (was "Accept") and CONSUMED on mount here.
 * Reached any other way — W-07's Back, ArrowLeft, a typed URL — nothing is
 * armed and the screen stays put; ArrowRight still moves on. `replace`, so
 * W-06 does not sit in the history between W-05 and W-07.
 *
 *   120 px mint circle with the 8-dot loader (one #45AB8E, seven ink),
 *   rotating smoothly; "Connecting wallet..." (900 36); the supporting copy
 *   at 280 wide. `aria-live` on the text (brief §12).
 *
 * "Powered by Portage Cryptography" (6293:46899) is HIDDEN in Figma and is
 * not shown (brief §7 W-06).
 */
export default function WalletConnectingPage() {
  const router = useRouter();
  const { ready, takeWalletConnect } = useDemoState();
  const c = WALLET_COPY.connecting;

  useEffect(() => {
    if (!ready) return;
    if (!takeWalletConnect()) return;
    const t = setTimeout(() => router.replace(FLOW3_ROUTES.code), WALLET_TIMING.connectMs);
    return () => clearTimeout(t);
    // Once, when the store becomes readable — `takeWalletConnect` changes
    // identity with the store, and listing it would cancel its own timer.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  return (
    <WalletScreen screen="W6" nodeId="6293:46861">
      <WalletStatusBar />
      <WalletHeader back={FLOW3_ROUTES.review} progress={WALLET_PROGRESS.connecting} />

      <div className="flex w-full flex-col items-center justify-center gap-[32px] p-[32px]" role="status" aria-live="polite">
        <div
          className="flex size-[120px] items-center justify-center rounded-full"
          style={{ background: WALLET_COLOR.mint }}
          data-node-id="6293:46873"
        >
          <WalletLoadingDots />
        </div>
        <div className="flex w-full flex-col items-center gap-[12px]">
          <WalletHeading>{c.heading}</WalletHeading>
          <WalletLead width={280}>{c.body}</WalletLead>
        </div>
      </div>
    </WalletScreen>
  );
}
