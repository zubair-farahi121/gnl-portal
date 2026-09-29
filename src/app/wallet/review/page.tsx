/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { WalletHeader, WalletScreen, WalletStatusButton } from "@/components/wallet/WalletClient";
import { IssuerBlock, WalletActions, WalletHeading, WalletStatusBar } from "@/components/wallet/WalletUi";
import { WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_PROGRESS, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-05 — review details and consent. Figma 6240:55097 (393 x 1432, `Screen 4:
 * Credential Preview`), progress 40 %. ADDED 2026-09-29; REWORKED to
 * FLOW3_BRIEF.md §7 W-05.
 *
 * THE ONE LONG SCREEN — it scrolls inside the phone frame, and its buttons
 * sit AT THE END of the content, as in Figma, so the user scrolls through the
 * details first (brief §7). The status bar is sticky.
 *
 *   header       back -> W-04, close ✕, progress 40 %
 *   content      px-24, gap 20: issuer badge (gap 12); heading ("Heading
 *                here" layer — "Is the information correct?", LEFT-aligned
 *                as the Headings instance draws it); the dark certificate
 *                card; the intro; the detail rows; the consent
 *   card         #1E404D, radius 20, p-24, centred: the white GNL crest and
 *                wordmark (72 x 36 — the REAL mark from design-reference) and
 *                "Vehicle Registration Certificate" (Inter 600 20, white)
 *   rows         label (300 12, 70 %) / value (600 16), py-12, a 1 px
 *                #E6E8EF line between rows (none under the last)
 *   consent      WALLET_CONSENT — ONE constant (Tatyana may swap in Maud's
 *                wording)
 *   actions      "Accept"  -> `accepted`, arms W-06, W-06
 *                "Decline" -> `declined`, W-01
 */
export default function WalletReviewPage() {
  const c = WALLET_COPY.review;
  return (
    <WalletScreen screen="W5" nodeId="6240:55097">
      <WalletStatusBar />
      <WalletHeader back={FLOW3_ROUTES.offer} progress={WALLET_PROGRESS.review} />

      <div className="flex w-full flex-col items-start gap-[20px] px-[24px] pt-[8px]">
        <IssuerBlock gap={12} />

        {/* Headings 6345:12128 */}
        <WalletHeading align="left">{c.heading}</WalletHeading>

        {/* 6345:12131 — the certificate card */}
        <div
          className="flex w-full flex-col items-center justify-center gap-[16px] p-[24px] text-center"
          style={{ background: WALLET_COLOR.brand, borderRadius: "20px", color: "#ffffff" }}
          data-node-id="6345:12131"
        >
          <img
            src="/assets/flow3/gnl-crest-wordmark-white.svg"
            alt="Government of Newfoundland and Labrador"
            width={72}
            height={36}
            className="block h-[36px] w-[72px] object-contain"
            data-node-id="6345:12133"
          />
          <p style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1.5 }} data-node-id="6345:12850">
            {c.cardTitle}
          </p>
        </div>

        <p className="w-full" style={WALLET_TYPE.body} data-node-id="6345:12851">
          {c.intro}
        </p>

        {/* 6345:12852 — the rows. A <dl>: they are label / value pairs. */}
        <dl className="flex w-full flex-col" data-wallet-rows="true">
          {c.rows.map((r, i) => (
            <div
              key={r.label}
              className="flex w-full flex-col items-start gap-[2px] py-[12px]"
              style={i < c.rows.length - 1 ? { borderBottom: `1px solid ${WALLET_COLOR.line}` } : undefined}
            >
              <dt style={WALLET_TYPE.rowLabel}>{r.label}</dt>
              <dd className="[word-break:break-word]" style={WALLET_TYPE.rowValue}>
                {r.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="w-full" style={WALLET_TYPE.body} data-wallet-consent="true" data-node-id="6354:87423">
          {c.consent}
        </p>
      </div>

      {/* 6345:12881 — at the end of the content */}
      <WalletActions>
        <WalletStatusButton status="accepted" href={FLOW3_ROUTES.connecting} armConnect>
          {c.accept}
        </WalletStatusButton>
        <WalletStatusButton status="declined" href={FLOW3_ROUTES.walletHome} variant="secondary">
          {c.decline}
        </WalletStatusButton>
      </WalletActions>
    </WalletScreen>
  );
}
