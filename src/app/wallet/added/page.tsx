import {
  WalletEnsureStatus,
  WalletHeader,
  WalletLinkWithArrow,
  WalletScreen,
} from "@/components/wallet/WalletClient";
import { WalletSuccessGlyph } from "@/components/wallet/WalletGlyphs";
import { WalletHeading, WalletLead, WalletStatusBar } from "@/components/wallet/WalletUi";
import { WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_PROGRESS } from "@/lib/data/wallet-tokens";

/*
 * W-08 — "Added Successfully". Figma 6240:55218 (393 x 844, `Screen 7:
 * Success`), progress 100 %. ADDED 2026-09-29; REWORKED to FLOW3_BRIEF.md §7.
 *
 * THE MOMENT THE OTHER WINDOW CHANGES. W-07's Continue already set
 * `code_verified` then `issued`; WalletEnsureStatus repeats `issued` if the
 * screen was reached another way (ArrowRight), and stores the card in the
 * wallet. The C1 page flips to "Added to your wallet" through the `storage`
 * event, without a reload.
 *
 *   header       back -> W-07, close ✕ (-> W-01; the offer stays `issued`)
 *   centre       p-32 gap-32: a 100 px mint circle with the check (5 px,
 *                #2E8E74) DRAWING IN; "Added Successfully" (900 48/100 %);
 *                the supporting copy at 280 wide
 *   button       p-24: primary "Go to Wallet" with the white → -> W-09
 */
export default function WalletAddedPage() {
  const c = WALLET_COPY.added;
  return (
    <WalletScreen screen="W8" nodeId="6240:55218">
      <WalletEnsureStatus screen="W-08" />
      <WalletStatusBar />
      <WalletHeader back={FLOW3_ROUTES.code} progress={WALLET_PROGRESS.added} />

      <div className="flex w-full flex-col items-center justify-center gap-[32px] p-[32px]" role="status" aria-live="polite">
        <div
          className="flex size-[100px] items-center justify-center rounded-full"
          style={{ background: WALLET_COLOR.mint }}
          data-node-id="6240:55232"
        >
          <WalletSuccessGlyph />
        </div>
        <div className="flex w-full flex-col items-center gap-[12px]">
          <WalletHeading size="xl">{c.heading}</WalletHeading>
          <WalletLead width={280}>{c.body}</WalletLead>
        </div>
      </div>

      <div className="flex w-full flex-col p-[24px]">
        <WalletLinkWithArrow href={FLOW3_ROUTES.cards}>{c.action}</WalletLinkWithArrow>
      </div>
    </WalletScreen>
  );
}
