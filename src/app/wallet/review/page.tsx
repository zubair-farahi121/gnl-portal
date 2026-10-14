"use client";

/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { WalletHeader, WalletScreen, WalletStatusButton, useWalletCredential } from "@/components/wallet/WalletClient";
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
 *   actions      "Add to wallet" (Figma "Accept", renamed 2026-09-30) -> `accepted`, arms W-06, W-06
 *                "Cancel" (Figma "Decline", renamed 2026-09-30)  -> `declined`, W-01
 *
 * FLOW 4 (2026-10-14) — Figma 6412:86558 (393 x 2128), the notice of
 * assessment: the issuer sub-line; the dark card drawn 188 tall with
 * "StudentAidNL" 8 px under the GNL mark (6420:95310); 19 rows; its own
 * consent sentence, quoting "Add to wallet" (Figma quotes "Accept"). Same
 * buttons as Flow 3 (Figma "Accept" / "Decline" -> "Add to wallet" /
 * "Cancel", decision 2). All from the current offer; a vehicle offer (or
 * none) renders exactly what it did.
 */
export default function WalletReviewPage() {
  const c = WALLET_COPY.review;
  const cred = useWalletCredential();
  const r = cred.review;
  return (
    <WalletScreen screen="W5" nodeId="6240:55097">
      <WalletStatusBar />
      <WalletHeader back={FLOW3_ROUTES.offer} progress={WALLET_PROGRESS.review} />

      <div className="flex w-full flex-col items-start gap-[20px] px-[24px] pt-[8px]">
        <IssuerBlock gap={12} subline={cred.issuerSubline} />

        {/* Headings 6345:12128 */}
        <WalletHeading align="left">{c.heading}</WalletHeading>

        {/* 6345:12131 — the certificate card */}
        <div
          className="flex w-full flex-col items-center justify-center gap-[16px] p-[24px] text-center"
          style={{
            background: WALLET_COLOR.brand,
            borderRadius: "20px",
            color: "#ffffff",
            ...(r.cardMinHeight ? { minHeight: r.cardMinHeight } : {}),
          }}
          data-node-id="6345:12131"
        >
          {r.cardSubline ? (
            /* Frame 14682 6420:95310 — the mark, then the service, 8 px apart. */
            <div className="flex flex-col items-center gap-[8px]">
              <img
                src="/assets/flow3/gnl-crest-wordmark-white.svg"
                alt="Government of Newfoundland and Labrador"
                width={72}
                height={36}
                className="block h-[36px] w-[72px] object-contain"
              />
              <p style={{ fontSize: "14px", fontWeight: 300, lineHeight: 1.2 }}>{r.cardSubline}</p>
            </div>
          ) : (
            <img
              src="/assets/flow3/gnl-crest-wordmark-white.svg"
              alt="Government of Newfoundland and Labrador"
              width={72}
              height={36}
              className="block h-[36px] w-[72px] object-contain"
              data-node-id="6345:12133"
            />
          )}
          <p style={{ fontSize: "20px", fontWeight: 600, lineHeight: 1.5 }} data-node-id="6345:12850">
            {r.cardTitle}
          </p>
        </div>

        <p className="w-full" style={WALLET_TYPE.body} data-node-id="6345:12851">
          {r.intro}
        </p>

        {/* 6345:12852 — the rows. A <dl>: they are label / value pairs. */}
        <dl className="flex w-full flex-col" data-wallet-rows="true">
          {r.rows.map((row, i) => (
            <div
              key={row.label}
              className="flex w-full flex-col items-start gap-[2px] py-[12px]"
              style={i < r.rows.length - 1 ? { borderBottom: `1px solid ${WALLET_COLOR.line}` } : undefined}
            >
              <dt style={WALLET_TYPE.rowLabel}>{row.label}</dt>
              <dd className="[word-break:break-word]" style={WALLET_TYPE.rowValue}>
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="w-full" style={WALLET_TYPE.body} data-wallet-consent="true" data-node-id="6354:87423">
          {r.consent}
        </p>
      </div>

      {/* 6345:12881 — at the end of the content */}
      <WalletActions>
        <WalletStatusButton status="accepted" href={FLOW3_ROUTES.connecting} armConnect>
          {r.accept}
        </WalletStatusButton>
        <WalletStatusButton status="declined" href={FLOW3_ROUTES.walletHome} variant="secondary">
          {r.decline}
        </WalletStatusButton>
      </WalletActions>
    </WalletScreen>
  );
}
