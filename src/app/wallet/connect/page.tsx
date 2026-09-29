import {
  WalletEnsureStatus,
  WalletHeader,
  WalletScreen,
  WalletStatusButton,
} from "@/components/wallet/WalletClient";
import { WalletShieldGlyph, WalletSwapGlyph } from "@/components/wallet/WalletGlyphs";
import {
  IconChevron,
  IssuerBlock,
  WalletActions,
  WalletHeading,
  WalletLead,
  WalletStatusBar,
} from "@/components/wallet/WalletUi";
import { WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_PROGRESS, WALLET_SIZE, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-03 — "Allow connection?". Figma 6325:60170 (390 x 881,
 * `government-issuer-interaction-request`), progress 20 %. ADDED 2026-09-29;
 * REWORKED to FLOW3_BRIEF.md §7 W-03. A BASELINE FRAME: `wallet-connect`.
 *
 * Where the same-device path (F3-03's "Add to Apple / Google Wallet") lands,
 * through /wallet/start/. On arrival, an offer that is still waiting becomes
 * `scanned` (WalletEnsureStatus) — covers the presenter's ArrowRight too.
 *
 *   header       back -> W-02, close ✕, progress 20 %
 *   content      pt-16 px-24 pb-24, gap 24: issuer badge; title stack
 *                (heading + supporting copy, gap 12); two trust cards (gap 12)
 *   verified     #DBF0EA, 1 px #86CEBA, r-16, p-16, gap 16: a 40 px #86CEBA
 *                circle with the shield-check, title (600 16 #1E404D) +
 *                description, a chevron -> toast
 *   first-time   #F3F5FB, 1 px #E6E8EF, r-16: a white 40 px circle with the
 *                switch icon, title (600 16) + description
 *   actions      "Yes, connect" -> `connected` + W-04
 *                "Decline"      -> `declined` + W-01 (desktop: "Waiting for scan")
 */
export default function WalletConnectPage() {
  const c = WALLET_COPY.connect;
  return (
    <WalletScreen screen="W3" nodeId="6325:60170">
      <WalletEnsureStatus screen="W-03" />
      <WalletStatusBar />
      <WalletHeader back={FLOW3_ROUTES.scan} progress={WALLET_PROGRESS.connect} />

      {/* content-scroll 6325:60190 */}
      <div className="flex w-full flex-col items-center gap-[24px] px-[24px] pt-[16px] pb-[24px]">
        <IssuerBlock />

        {/* title-stack 6325:60910 */}
        <div className="flex w-full flex-col items-center gap-[12px]">
          <WalletHeading>{c.heading}</WalletHeading>
          <WalletLead>{c.body}</WalletLead>
        </div>

        {/* trust-indicators-stack 6325:60913 */}
        <div className="flex w-full flex-col items-start gap-[12px]">
          <div
            className="flex w-full items-center gap-[16px] p-[16px]"
            style={{ background: WALLET_COLOR.mint, border: `1px solid ${WALLET_COLOR.mintBorder}`, borderRadius: WALLET_SIZE.radiusMain }}
            data-node-id="6325:60914"
          >
            <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px]" style={{ background: WALLET_COLOR.mintBorder }}>
              <WalletShieldGlyph />
            </span>
            <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px]">
              <span style={{ ...WALLET_TYPE.cardTitle, color: WALLET_COLOR.brand }}>{c.verifiedTitle}</span>
              <span style={WALLET_TYPE.cardDesc}>{c.verifiedBody}</span>
            </span>
            {/* The chevron is a control (brief §7: "The chevron shows the toast"). */}
            <button
              type="button"
              data-wallet-inert="true"
              aria-label={`${c.verifiedTitle}: more details`}
              className="-m-[4px] flex cursor-pointer items-center justify-center rounded-full p-[4px] focus-visible:outline-2 focus-visible:outline-[#1e404d]"
            >
              <IconChevron />
            </button>
          </div>

          <div
            className="flex w-full items-center gap-[16px] p-[16px]"
            style={{ background: WALLET_COLOR.soft, border: `1px solid ${WALLET_COLOR.line}`, borderRadius: WALLET_SIZE.radiusMain }}
            data-node-id="6325:60926"
          >
            <span
              className="flex size-[40px] shrink-0 items-center justify-center rounded-[20px]"
              style={{ background: WALLET_COLOR.background, border: `1px solid ${WALLET_COLOR.line}` }}
            >
              <WalletSwapGlyph />
            </span>
            <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px]">
              <span style={WALLET_TYPE.cardTitle}>{c.firstTimeTitle}</span>
              <span style={WALLET_TYPE.cardDesc}>{c.firstTimeBody}</span>
            </span>
          </div>
        </div>
      </div>

      {/* 6320:81738 — at the end of the content */}
      <WalletActions>
        <WalletStatusButton status="connected" href={FLOW3_ROUTES.offer}>
          {c.accept}
        </WalletStatusButton>
        <WalletStatusButton status="declined" href={FLOW3_ROUTES.walletHome} variant="secondary">
          {c.decline}
        </WalletStatusButton>
      </WalletActions>
    </WalletScreen>
  );
}
