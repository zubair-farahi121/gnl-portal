import { WalletHeader, WalletScreen, WalletStatusButton } from "@/components/wallet/WalletClient";
import { WalletVcGlyph } from "@/components/wallet/WalletGlyphs";
import { IssuerBlock, WalletHeading, WalletLead, WalletStatusBar } from "@/components/wallet/WalletUi";
import { WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_PROGRESS, WALLET_SIZE, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-04 — "Certificate offered". Figma 6240:54958 (390 x 910, `Screen 1:
 * Renewal Approved` — a leftover name; the content is the offer), progress
 * 40 %. ADDED 2026-09-29; REWORKED to FLOW3_BRIEF.md §7 W-04.
 *
 *   header       back -> W-03, close ✕, progress 40 %
 *   content      p-24, gap 24: [issuer badge, heading, supporting copy]
 *                (pt-12, gap 16), then the offer card
 *   offer card   #F3F5FB, 1 px #E6E8EF, r-16, p-16, gap 24: the ID-card icon
 *                (`icon-verifiable-credentials`) beside "Vehicle registration
 *                certificate" (600 16) / "Verifiable Digital Credential"
 *                (300 14, 70 %); then, INSIDE the card, the primary button
 *                "View offer" -> `viewed` + W-05
 */
export default function WalletOfferPage() {
  const c = WALLET_COPY.offer;
  return (
    <WalletScreen screen="W4" nodeId="6240:54958">
      <WalletStatusBar />
      <WalletHeader back={FLOW3_ROUTES.connect} progress={WALLET_PROGRESS.offer} />

      <div className="flex w-full flex-col items-center gap-[24px] p-[24px]">
        <div className="flex w-full flex-col items-center gap-[16px] py-[12px]">
          <IssuerBlock />
          <WalletHeading>{c.heading}</WalletHeading>
          <WalletLead>{c.body}</WalletLead>
        </div>

        {/* 6240:54983 */}
        <div
          className="flex w-full flex-col items-start gap-[24px] p-[16px]"
          style={{ background: WALLET_COLOR.soft, border: `1px solid ${WALLET_COLOR.line}`, borderRadius: WALLET_SIZE.radiusMain }}
          data-node-id="6240:54983"
        >
          <div className="flex items-center gap-[12px]">
            <span className="shrink-0">
              <WalletVcGlyph />
            </span>
            <span className="flex flex-col items-start gap-[2px]">
              <span style={WALLET_TYPE.cardTitle}>{c.cardTitle}</span>
              <span style={WALLET_TYPE.cardDesc}>{c.cardSubtitle}</span>
            </span>
          </div>
          <WalletStatusButton status="viewed" href={FLOW3_ROUTES.review}>
            {c.action}
          </WalletStatusButton>
        </div>
      </div>
    </WalletScreen>
  );
}
