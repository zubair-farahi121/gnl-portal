/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import Link from "next/link";

import { SiteFooter } from "@/components/chrome/SiteFooter";
import { TopNav } from "@/components/chrome/TopNav";
import { BenefitGlyph, CertificateStandIn } from "@/components/service/WalletBrandIcons";
import {
  OfferExpiryLine,
  OfferQr,
  OfferStateLine,
  SameDeviceButtons,
  WalletOfferProvider,
} from "@/components/service/WalletOffer";
import { C1_BREADCRUMB, C1_COPY } from "@/lib/data/flow3";

/*
 * C1 — "Add your vehicle registration certificate to your wallet".
 * F3-02 desktop: Figma 6220:86445 / 6289:45276 / 6289:46104 (1440 x 1024, the
 * same layout in three states). F3-03 phone: 6220:86488 (393 x 1471).
 * ADDED 2026-09-29; REWORKED the same day to FLOW3_BRIEF.md §5.
 *
 * Reached from "Add to wallet" on the Trusted Driver and Vehicle page (the
 * "Skip the paper copy" upsell, F3-01 6285:87154 / 6257:73252). GNL design
 * throughout: Lato, the existing TopNav and SiteFooter, GNL colours. NOTHING
 * from the wallet's visual language appears here.
 *
 * A SERVER COMPONENT with one client island, WalletOfferProvider, which owns
 * the mock-issuer offer and feeds the QR, the state line, the countdown and
 * the phone-width buttons (src/components/service/WalletOffer.tsx).
 *
 * ====================================================================
 * F3-02 (768 and up) — brief §5, flow3_style_reference.txt:
 *   main             padding 48/80/80, two columns, gap 40
 *   left (827)       gap 24: breadcrumb (Lato 700 14 #004B87, underlined);
 *                    title (700 32/150 % #212326) + subtitle (400 16/150 %
 *                    #5F6368), gap 16; the QR card centred; the expiry line
 *   QR card          416 x 460, white, 1 px #D4D8DA, r-6, padding 32/24,
 *                    gap 16, centred: QR (~220 x 196), state line (300 16
 *                    #5F6368 centred, aria-live), then a 368-wide block, gap 8:
 *                    "Works with" (400 16); Apple mark 20 x 24 + "Apple Wallet"
 *                    (400 15 #5F6368), gap 10; Google Wallet mark 24 x 24 +
 *                    "Google Wallet"; the 2-line "Issued by the Government of
 *                    Newfoundland and Labrador" (300 16). Wallet rows are
 *                    INFORMATION ONLY, not buttons.
 *   right (413)      pt-150; the #E9ECEF card, r-6, p-24, gap 16: title
 *                    (800 24/150 % #5F6368) and three rows 24 apart, each a
 *                    64 px #E9ECEF icon box (40 px icon) + 400 14/150 % text
 *
 * F3-03 (below 768) — a DIFFERENT PAGE, not a reflow (brief §5):
 *   background #F4F6F8, main padding 24/16/32, gap 24: breadcrumb; title
 *   (700 28/130 %) + subtitle, gap 12; the image card (white, 1 px #D4D8DA,
 *   r-8, p-16) holding "image 28" (143 x 131, bottom corners r-24) — a
 *   CLEARLY LABELLED STAND-IN, the Figma raster cannot be exported (open
 *   question); the two wallet buttons -> W-03 (same-device); the 2-line
 *   "Don't have a wallet app? Get help adding your licence" (link -> toast);
 *   the benefits card (white, 1 px #D4D8DA, r-6, p-20).
 *   No QR and no state line on the phone, as drawn.
 *
 * The switch is the named `md` / `max-md` variant (768), the same one the CID
 * chrome switch uses — never an arbitrary `max-[768px]` (see globals.css).
 * The card strokes are inset box-shadows, as on every GNL card in this repo —
 * Figma strokes inside the frame.
 * ====================================================================
 */

const MAIN =
  "gnl-gutter [--gnl-gutter:80px] box-border flex w-full items-start gap-[40px] pt-[48px] pb-[80px] max-[1024px]:flex-col max-[1024px]:gap-[32px] max-md:hidden";

const CONTENT_LEFT =
  "flex w-[827px] shrink-0 flex-col items-start gap-[24px] max-[1439px]:min-w-px max-[1439px]:shrink max-[1024px]:w-full";

const CONTENT_RIGHT =
  "flex w-[413px] shrink-0 flex-col items-start pt-[150px] max-[1024px]:w-full max-[1024px]:pt-0";

const LINK =
  "text-[14px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]";

function Breadcrumb({ nodeId }: { nodeId: string }) {
  return (
    <div className="flex shrink-0 items-center" data-node-id={nodeId}>
      <Link className={`${LINK} whitespace-nowrap`} href={C1_BREADCRUMB.href} data-wallet-breadcrumb="true">
        {C1_BREADCRUMB.label}
      </Link>
    </div>
  );
}

function Benefits({ phone }: { phone?: boolean }) {
  return (
    <div
      className={`box-border flex w-full flex-col items-start gap-[16px] rounded-[6px] ${
        phone ? "bg-white p-[20px] shadow-[inset_0_0_0_1px_#d4d8da]" : "bg-[#e9ecef] p-[24px]"
      }`}
      data-node-id={phone ? "6220:86507" : "6220:86471"}
    >
      {/* Lato ExtraBold (800) in Figma — no 800 in the vendored Lato; 700. */}
      <h2 className="w-full text-[24px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]">
        {C1_COPY.benefitsTitle}
      </h2>
      <ul className="flex w-full flex-col items-start gap-[24px]">
        {C1_COPY.benefits.map((b) => (
          <li key={b.nodeId} className={`flex w-full items-center ${phone ? "gap-[24px]" : "gap-[8px]"}`}>
            <div className="flex size-[64px] shrink-0 items-center justify-center rounded-[6px] bg-[#e9ecef] p-[12px]">
              <BenefitGlyph icon={b.icon} />
            </div>
            <p className="min-w-px flex-[1_0_0] text-[14px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]">
              {b.text}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** F3-02, 768 and up. */
function DesktopPage() {
  return (
    <main className={MAIN} data-node-id="6220:86447">
      <div className={CONTENT_LEFT} data-node-id="6220:86448">
        <Breadcrumb nodeId="6220:86449" />

        {/* Frame 16 6220:86451 */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[16px]" data-node-id="6220:86451">
          <h1
            className="text-[32px] font-bold leading-[1.5] whitespace-nowrap text-[color:var(--gnl-heading,#212326)] max-[1439px]:whitespace-normal [word-break:break-word]"
            data-node-id="6220:86453"
          >
            {C1_COPY.heading}
          </h1>
          <p className="w-full text-[16px] font-normal leading-[1.5] text-[color:var(--gnl-text,#5f6368)] [word-break:break-word]" data-node-id="6220:86454">
            {C1_COPY.subtitle}
          </p>
        </div>

        {/* Frame 20 6220:86455 — the card, centred in the column */}
        <div className="flex w-full shrink-0 items-center justify-center" data-node-id="6220:86455">
          <div
            className="box-border flex w-[416px] max-w-full flex-col items-center gap-[16px] rounded-[6px] bg-white px-[24px] py-[32px] shadow-[inset_0_0_0_1px_#d4d8da]"
            data-node-id="6220:86456"
          >
            <div className="flex w-full flex-col items-center" data-node-id="6220:86457">
              <OfferQr />
            </div>
            <div className="flex w-full flex-col items-center justify-center" data-node-id="6220:86459">
              <OfferStateLine />
            </div>
            {/* Frame 21 6220:86461 — information only, not buttons */}
            <div className="flex w-full flex-col items-start gap-[8px]" data-node-id="6220:86461">
              <p className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368]" data-node-id="6220:86462">
                {C1_COPY.worksWith}
              </p>
              <div className="flex w-full items-center gap-[10px]" data-node-id="6220:86463">
                <img
                  src="/assets/flow3/apple-logo-grey.png"
                  alt="Apple logo"
                  width={20}
                  height={24}
                  className="block h-[24px] w-[20.27px] shrink-0 object-contain"
                />
                <p className="whitespace-nowrap text-[15px] font-normal leading-[normal] text-[#5f6368]" data-node-id="6220:86465">
                  {C1_COPY.appleWallet}
                </p>
              </div>
              <div className="flex w-full items-center gap-[10px]" data-node-id="6220:86466">
                <img
                  src="/assets/flow3/google-wallet-logo.png"
                  alt="Google Wallet logo"
                  width={24}
                  height={24}
                  className="block size-[24px] shrink-0"
                />
                <p className="whitespace-nowrap text-[15px] font-normal leading-[normal] text-[#5f6368]" data-node-id="6220:86468">
                  {C1_COPY.googleWallet}
                </p>
              </div>
              <p className="w-full text-[16px] font-light leading-[1.5] text-[#5f6368] [word-break:break-word]" data-node-id="6285:90653">
                {C1_COPY.issuedBy}
              </p>
            </div>
          </div>
        </div>

        <OfferExpiryLine />
      </div>

      <div className={CONTENT_RIGHT} data-node-id="6220:86470">
        <Benefits />
      </div>
    </main>
  );
}

/** F3-03, below 768. */
function PhonePage() {
  return (
    <main
      className="box-border flex w-full flex-col items-start gap-[24px] bg-[#f4f6f8] px-[16px] pt-[24px] pb-[32px] md:hidden"
      data-node-id="6220:86490"
    >
      <Breadcrumb nodeId="6220:86491" />

      {/* title-subtitle-block 6220:86493 */}
      <div className="flex w-full flex-col items-start gap-[12px]" data-node-id="6220:86493">
        <h1 className="w-full text-[28px] font-bold leading-[1.3] text-[#212326] [word-break:break-word]" data-node-id="6220:86494">
          {C1_COPY.heading}
        </h1>
        <p className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]" data-node-id="6220:86495">
          {C1_COPY.subtitle}
        </p>
      </div>

      {/* license-visual-container 6220:86496 */}
      <div
        className="box-border flex w-full flex-col items-center rounded-[8px] bg-white p-[16px] shadow-[inset_0_0_0_1px_#d4d8da]"
        data-node-id="6220:86496"
      >
        <CertificateStandIn />
      </div>

      {/* wallet-actions-section 6220:86498 */}
      <div className="flex w-full flex-col items-start gap-[16px]" data-node-id="6220:86498">
        <SameDeviceButtons />
        {/* 6220:86506 — "Don't have a wallet app? [Get help adding your
            licence]": the bracketed part is magenta #f200ff in Figma, the
            designer's placeholder convention — rendered as a normal GNL link
            without the brackets; it shows the "Not part of this demo" toast. */}
        <p className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]" data-node-id="6220:86506">
          {C1_COPY.noWalletApp}{" "}
          <button
            type="button"
            data-demo-inert="true"
            className="cursor-pointer text-left text-[16px] font-normal leading-[1.5] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]"
          >
            {C1_COPY.noWalletHelp}
          </button>
        </p>
      </div>

      <Benefits phone />
    </main>
  );
}

export default function AddToWalletPage() {
  return (
    <div className="gnl-desktop-shell" data-flow3="c1">
      <TopNav />
      <WalletOfferProvider>
        <DesktopPage />
        <PhonePage />
      </WalletOfferProvider>
      <SiteFooter variant="desktop" />
    </div>
  );
}
