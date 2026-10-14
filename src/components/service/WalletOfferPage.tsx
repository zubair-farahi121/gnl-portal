/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import Link from "next/link";

import { SiteFooter } from "@/components/chrome/SiteFooter";
import { TopNav } from "@/components/chrome/TopNav";
import { BenefitGlyph, CertificateStandIn, NoticeOfAssessmentStandIn } from "@/components/service/WalletBrandIcons";
import {
  OfferExpiryLine,
  OfferQr,
  OfferStateLine,
  SameDeviceButtons,
  WalletOfferProvider,
} from "@/components/service/WalletOffer";
import { C1_CONTENT, type C1Content } from "@/lib/data/credentials";
import type { CredentialKind } from "@/lib/mock-issuer";

/*
 * THE C1 WALLET PAGE — "Add your <credential> to your wallet". MOVED HERE
 * 2026-10-14 from src/app/services/driver-vehicle/wallet/page.tsx, unchanged
 * but for one thing: every string and node id now comes from the credential's
 * C1Content (src/lib/data/credentials.ts) instead of Flow 3's constants, so
 * Flow 4 (StudentAidNL's notice of assessment, Figma 6412:85663) is the same
 * page with its own words. Flow 3's entry holds exactly the strings and ids
 * the page carried, so /services/driver-vehicle/wallet/ renders as before
 * (the `wallet-c1` baseline proves it).
 *
 * The layout notes below are Flow 3's, and hold for Flow 4: its frames
 * (6412:85663 / 6415:90752 / 6415:91577) are the same geometry node for node.
 * Flow 4 has NO PHONE FRAME in Figma; below 768 it uses F3-03's layout with
 * Flow 4's strings, no node ids, and a drawn notice-of-assessment stand-in.
 *
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

function Breadcrumb({ c, nodeId }: { c: C1Content; nodeId?: string }) {
  return (
    <div className="flex shrink-0 items-center" data-node-id={nodeId}>
      <Link className={`${LINK} whitespace-nowrap`} href={c.breadcrumb.href} data-wallet-breadcrumb="true">
        {c.breadcrumb.label}
      </Link>
    </div>
  );
}

function Benefits({ c, phone }: { c: C1Content; phone?: boolean }) {
  return (
    <div
      className={`box-border flex w-full flex-col items-start gap-[16px] rounded-[6px] ${
        phone ? "bg-white p-[20px] shadow-[inset_0_0_0_1px_#d4d8da]" : "bg-[#e9ecef] p-[24px]"
      }`}
      data-node-id={phone ? c.phoneNodes?.benefits : c.nodes.benefits}
    >
      {/* Lato ExtraBold (800) in Figma — no 800 in the vendored Lato; 700. */}
      <h2 className="w-full text-[24px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]">
        {c.copy.benefitsTitle}
      </h2>
      <ul className="flex w-full flex-col items-start gap-[24px]">
        {c.copy.benefits.map((b) => (
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
function DesktopPage({ c }: { c: C1Content }) {
  const n = c.nodes;
  return (
    <main className={MAIN} data-node-id={n.main}>
      <div className={CONTENT_LEFT} data-node-id={n.left}>
        <Breadcrumb c={c} nodeId={n.crumb} />

        {/* Frame 16 6220:86451 */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[16px]" data-node-id={n.titleBlock}>
          <h1
            className="text-[32px] font-bold leading-[1.5] whitespace-nowrap text-[color:var(--gnl-heading,#212326)] max-[1439px]:whitespace-normal [word-break:break-word]"
            data-node-id={n.heading}
          >
            {c.copy.heading}
          </h1>
          <p className="w-full text-[16px] font-normal leading-[1.5] text-[color:var(--gnl-text,#5f6368)] [word-break:break-word]" data-node-id={n.subtitle}>
            {c.copy.subtitle}
          </p>
        </div>

        {/* Frame 20 6220:86455 — the card, centred in the column */}
        <div className="flex w-full shrink-0 items-center justify-center" data-node-id={n.cardRow}>
          <div
            className="box-border flex w-[416px] max-w-full flex-col items-center gap-[16px] rounded-[6px] bg-white px-[24px] py-[32px] shadow-[inset_0_0_0_1px_#d4d8da]"
            data-node-id={n.card}
          >
            <div className="flex w-full flex-col items-center" data-node-id={n.qrWrap}>
              <OfferQr />
            </div>
            <div className="flex w-full flex-col items-center justify-center" data-node-id={n.stateWrap}>
              <OfferStateLine />
            </div>
            {/* Frame 21 6220:86461 — information only, not buttons */}
            <div className="flex w-full flex-col items-start gap-[8px]" data-node-id={n.worksWithBlock}>
              <p className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368]" data-node-id={n.worksWith}>
                {c.copy.worksWith}
              </p>
              <div className="flex w-full items-center gap-[10px]" data-node-id={n.appleRow}>
                <img
                  src="/assets/flow3/apple-logo-grey.png"
                  alt="Apple logo"
                  width={20}
                  height={24}
                  className="block h-[24px] w-[20.27px] shrink-0 object-contain"
                />
                <p className="whitespace-nowrap text-[15px] font-normal leading-[normal] text-[#5f6368]" data-node-id={n.appleText}>
                  {c.copy.appleWallet}
                </p>
              </div>
              <div className="flex w-full items-center gap-[10px]" data-node-id={n.googleRow}>
                <img
                  src="/assets/flow3/google-wallet-logo.png"
                  alt="Google Wallet logo"
                  width={24}
                  height={24}
                  className="block size-[24px] shrink-0"
                />
                <p className="whitespace-nowrap text-[15px] font-normal leading-[normal] text-[#5f6368]" data-node-id={n.googleText}>
                  {c.copy.googleWallet}
                </p>
              </div>
              <p className="w-full text-[16px] font-light leading-[1.5] text-[#5f6368] [word-break:break-word]" data-node-id={n.issuedBy}>
                {c.copy.issuedBy}
              </p>
            </div>
          </div>
        </div>

        <OfferExpiryLine />
      </div>

      <div className={CONTENT_RIGHT} data-node-id={n.right}>
        <Benefits c={c} />
      </div>
    </main>
  );
}

/** F3-03, below 768. */
function PhonePage({ c }: { c: C1Content }) {
  const n = c.phoneNodes;
  return (
    <main
      className="box-border flex w-full flex-col items-start gap-[24px] bg-[#f4f6f8] px-[16px] pt-[24px] pb-[32px] md:hidden"
      data-node-id={n?.main}
    >
      <Breadcrumb c={c} nodeId={n?.crumb} />

      {/* title-subtitle-block 6220:86493 */}
      <div className="flex w-full flex-col items-start gap-[12px]" data-node-id={n?.titleBlock}>
        <h1 className="w-full text-[28px] font-bold leading-[1.3] text-[#212326] [word-break:break-word]" data-node-id={n?.heading}>
          {c.copy.heading}
        </h1>
        <p className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]" data-node-id={n?.subtitle}>
          {c.copy.subtitle}
        </p>
      </div>

      {/* license-visual-container 6220:86496 */}
      <div
        className="box-border flex w-full flex-col items-center rounded-[8px] bg-white p-[16px] shadow-[inset_0_0_0_1px_#d4d8da]"
        data-node-id={n?.imageCard}
      >
        {c.phoneImage === "notice-of-assessment" ? <NoticeOfAssessmentStandIn /> : <CertificateStandIn />}
      </div>

      {/* wallet-actions-section 6220:86498 */}
      <div className="flex w-full flex-col items-start gap-[16px]" data-node-id={n?.actions}>
        <SameDeviceButtons />
        {/* 6220:86506 — "Don't have a wallet app? [Get help adding your
            licence]": the bracketed part is magenta #f200ff in Figma, the
            designer's placeholder convention — rendered as a normal GNL link
            without the brackets; it shows the "Not part of this demo" toast. */}
        <p className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]" data-node-id={n?.help}>
          {c.copy.noWalletApp}{" "}
          <button
            type="button"
            data-demo-inert="true"
            className="cursor-pointer text-left text-[16px] font-normal leading-[1.5] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]"
          >
            {c.copy.noWalletHelp}
          </button>
        </p>
      </div>

      <Benefits c={c} phone />
    </main>
  );
}

export function WalletOfferPage({ kind }: { kind: CredentialKind }) {
  const c = C1_CONTENT[kind];
  return (
    <div className="gnl-desktop-shell" data-flow3="c1" data-credential={kind}>
      <TopNav />
      <WalletOfferProvider kind={kind}>
        <DesktopPage c={c} />
        <PhonePage c={c} />
      </WalletOfferProvider>
      <SiteFooter variant="desktop" />
    </div>
  );
}
