import { WalletScreen } from "@/components/wallet/WalletClient";
import { WalletCardList } from "@/components/wallet/WalletCardList";
import { WalletMenuButton } from "@/components/wallet/WalletGlyphs";
import { WalletStatusBar } from "@/components/wallet/WalletUi";
import { WALLET_COPY } from "@/lib/data/flow3";
import { WALLET_COLOR, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-09 — "Your credentials", the wallet dashboard. Figma 6240:55253 (393 x
 * 844, `Screen 8: Wallet Dashboard`). ADDED 2026-09-29; REWORKED to
 * FLOW3_BRIEF.md §7 W-09. A BASELINE FRAME: `wallet-cards` (fresh store, so
 * the baseline is the BEFORE state — 2 cards).
 *
 *   top area     as W-01: status bar, menu button, greeting (no quick actions)
 *   panel        p-24 around rgba(8,16,16,0.05), 1 px #E6E8EF, r-16, p-16:
 *                "Your credentials" (600 16) / "N cards total" (300 14, 70 %)
 *                with a chevron, then the cards (gap 12) — WalletCardList
 */
export default function WalletCardsPage() {
  const c = WALLET_COPY.cards;
  return (
    <WalletScreen screen="W9" nodeId="6240:55253">
      {/* top-content 6346:87408 */}
      <div
        className="flex w-full flex-col items-start pb-[24px]"
        style={{ background: WALLET_COLOR.soft, borderRadius: "0 0 40px 40px" }}
      >
        <WalletStatusBar variant="home" background={WALLET_COLOR.soft} />
        <div className="flex w-full flex-col items-start px-[16px] pb-[16px]">
          <WalletMenuButton />
          <h1 className="w-full text-center" style={WALLET_TYPE.heading} data-node-id="6346:87416">
            {c.greeting}
          </h1>
        </div>
      </div>

      <div className="flex w-full flex-col p-[24px]">
        <WalletCardList />
      </div>
    </WalletScreen>
  );
}
