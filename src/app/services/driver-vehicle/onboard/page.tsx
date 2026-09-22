import Link from "next/link";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { ASSETS } from "@/lib/assets";
import {
  IDV_OPTIONS,
  SECTION_INTRO,
  WIZARD_ACTIONS,
  WIZARD_TITLE,
  type IdvOption,
} from "@/lib/data/onboarding";

/*
 * driver-vehicle-prerequisite-check — Figma 6031:6304, 1440 x 1202.215.
 *
 * Geometry, verbatim from get_design_context on 6031:6307 and its sublayers:
 *   top-nav actions    1440 x 69      at y=0
 *   main-content       1440 x 993     at y=69
 *     wizard-card       820 x 689     at x=310, y=152   p-[40px], gap-[32px]
 *       wizard-header   740 x 98      at y=40
 *       section-intro   740 x 73      at y=170
 *       Frame 1         740 x 287     at y=275   gap-[24px]
 *         service-item-card 740 x 134 at y=0     (MRD, radio unselected)
 *         service-item-card 740 x 129 at y=158   (GNL/CID, radio selected)
 *       actions-row     740 x 55      at y=594
 *   footer verified    1440 x 140.215 at y=1062
 *
 * 152 + 689 = 841 of a 993px main, leaving 152 at the bottom — the card sits in
 * a symmetric well. No "use client": nothing on this page uses a hook.
 *
 * ------------------------------------------------------------------------
 * RESPONSIVE (2026-09-21).
 *
 * The card used to be placed with `pl-[310px]`, which is (1440 - 820) / 2 —
 * a centring value written as a left offset. That only centres at exactly
 * 1440: at 375 it pushed an 820px card to x=310 and left 65px of it on screen,
 * and at 320 the card rendered 48px wide. It is replaced by a real centring
 * container — `.gnl-gutter [--gnl-gutter:310px]` plus `justify-center` — which
 * is byte-identical at 1440 (310px of padding each side of an 820px card in a
 * 1440px canvas leaves zero free space, so `justify-center` cannot move it)
 * and genuinely centres the card at every width below.
 *
 * The gutter then steps 310 -> 96 -> 64 -> 24 -> 16 down the ladder while
 * WizardCard's own `max-lg:w-full` lets the card take the room. The 152px
 * well becomes explicit bottom padding, so releasing the main's pinned height
 * below 1440 does not pull the footer up under the card, and it steps down
 * with the viewport too — 152 -> 96 below 1280 -> 48 at 768 and under, where
 * 152px of empty space either side of the card is half a phone screen.
 * ------------------------------------------------------------------------
 *
 * STEPPER: this frame is the authority for the two values Task 7 left
 * provisional. Both were already correct and are unchanged — step-bar is
 * #e9ebf0 and step-bar-fill is 555 of a 740px track, exactly 75% for
 * current={2} under the (current + 1) / 4 formula.
 */

/**
 * service-item-card chrome. Border is #d4d8da, not the #e0e4e6 card token.
 *
 * Stroke painted with an inset box-shadow, as TopNav and WizardCard do: Figma
 * draws it inside the frame, so a CSS border made the cards 136/131 instead of
 * the designed 134/129.
 *
 * RESPONSIVE: the card is `details | crest` at the design width. The crest is
 * a fixed 72px, so as the card narrows the details column pays for all of it —
 * at 393 it is down to ~193px, which is narrower than the option titles. Below
 * 480 the crest therefore drops onto its own line under the details, and the
 * padding steps 24 -> 16. Above 480 the row is unchanged.
 */
const OPTION_CARD =
  "box-border flex w-full items-center justify-between rounded-[6px] bg-white p-[24px] shadow-[inset_0_0_0_1px_#d4d8da] max-xs:flex-col max-xs:items-start max-xs:gap-[16px] max-xs:p-[16px]";

/**
 * The two option titles genuinely disagree in the design file and are
 * reproduced, not harmonised: the MRD title is body grey on a 1.5 leading
 * (row 24px tall), the GNL/CID title is link blue on `normal` leading
 * (row 19px tall). That 5px is exactly why the cards are 134px and 129px.
 */
const TITLE_STYLE = {
  muted: "text-[16px] font-bold leading-[1.5] text-[#5f6368]",
  link: "text-[16px] font-bold leading-[normal] text-[#004b87]",
} as const;

/**
 * GNL Logo — Figma 6098:100409 / 6098:60395, 72.134 x 36.215.
 *
 * Same component and the same two leaves as the desktop footer crest, at the
 * same size. SiteFooter keeps its copy private, so the geometry is repeated
 * here rather than exported across a component boundary; the percentage insets
 * are identical, so both stay correct from one pair of asset files.
 */
function GnlLogo() {
  return (
    <div
      className="relative h-[36.215px] w-[72.134px] shrink-0 overflow-clip"
      data-node-id="6098:60395"
    >
      <div className="absolute inset-[0_36.61%_18.23%_0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.gnlCrestFlowers} />
      </div>
      <div className="absolute inset-[30.74%_0_0.72%_0.08%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.gnlCrestWordmark} />
      </div>
    </div>
  );
}

function OptionBody({ option }: { option: IdvOption }) {
  return (
    <>
      {/* service-details — flex-1, so the crest keeps its 72.134px at the right edge. */}
      <div className="flex min-w-px flex-1 flex-col items-start gap-[12px]">
        {/* service-title-row. Shrink-to-fit by design, so the title has no
            width to wrap against; below 768 it takes the full details column
            and top-aligns the radio against what may now be two lines. */}
        <div className="flex shrink-0 items-center gap-[12px] max-md:w-full max-md:items-start">
          <div className="relative size-[16px] shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={option.selected ? ASSETS.radioSelected : ASSETS.radioUnselected}
            />
          </div>
          {/* The design's `whitespace-nowrap` holds these on one line at 740px.
              "Motor Registration Division (MRD)" is ~245px, wider than the
              details column gets below 768, so it is released there. */}
          <p
            className={`shrink-0 whitespace-nowrap ${TITLE_STYLE[option.titleStyle]} max-md:min-w-px max-md:shrink max-md:whitespace-normal`}
          >
            {option.title}
          </p>
        </div>

        {/* verification-list-wrapper — pl-[28px] aligns the list under the title, not the radio. */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[8px] pl-[28px]">
          <p className="w-full shrink-0 text-[14px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]">
            {option.verifyIntro}
          </p>
          {option.bullets.map((bullet) => (
            <div key={bullet} className="flex w-full shrink-0 items-center gap-[8px]">
              <div className="relative size-[4px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.bulletDot} />
              </div>
              <p className="min-w-px flex-1 text-[14px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]">
                {bullet}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* crest-container — vertically centred in the card. */}
      <div className="flex shrink-0 flex-col items-center justify-center">
        <GnlLogo />
      </div>
    </>
  );
}

/**
 * Only the CertifiO ID option (GNL Identity Verification Service) carries an
 * href, so it is the one clickable element on this screen. Every other option
 * renders as a plain div and does not navigate, which keeps the presenter from
 * clicking into an unbuilt provider screen on stage.
 */
function OptionCard({ option }: { option: IdvOption }) {
  if (option.href) {
    return (
      <Link className={OPTION_CARD} href={option.href} data-node-id={option.nodeId}>
        <OptionBody option={option} />
      </Link>
    );
  }
  return (
    <div
      className={`${OPTION_CARD} cursor-default select-none`}
      data-node-id={option.nodeId}
      data-demo-inert="true"
      aria-disabled="true"
    >
      <OptionBody option={option} />
    </div>
  );
}

export default function PrerequisiteCheckPage() {
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      <main className="h-[993px] w-full max-[1439px]:h-auto" data-node-id="6031:6306">
        {/*
         * The 152px design padding steps down 152 -> 96 -> 48 -> 32.
         *
         * `max-md` (a NAMED breakpoint), not the arbitrary `max-[768px]` this
         * used to carry. Tailwind emits arbitrary max-width variants in a
         * different sort group from named ones: `max-[768px]` landed BEFORE
         * `max-xl` in the stylesheet, so at 390px both matched and the 96px
         * rule won on order. The card sat under ~96px of dead white space on
         * every phone. Named variants sort by width, so `max-md` wins there.
         */}
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] max-[1439px]:pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          <WizardCard>
            {/*
             * RE-SYNC 2026-09-21: this frame (6031:6304) received the same
             * type-scale bump as the confirmation screen and grew 1202 -> 1253.
             * size="lg" carries the wizard-title 24->28, step-bar 8->16 and
             * step-labels 12->16. The four CID mobile frames were NOT rebuilt
             * and stay on the default "sm" scale.
             */}
            <WizardHeader title={WIZARD_TITLE} current={2} size="lg" />

            {/* section-intro 6031:6318 */}
            <div
              className="flex w-full shrink-0 flex-col items-start gap-[8px]"
              data-node-id="6031:6318"
            >
              <p
                className="w-full text-[28px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
                data-node-id="6031:6319"
              >
                {SECTION_INTRO.title}
              </p>
              <p
                className="w-full text-[15px] font-normal leading-[1.5] text-[#212326] [word-break:break-word]"
                data-node-id="6031:6320"
              >
                {SECTION_INTRO.subtitle}
              </p>
            </div>

            {/* Frame 1 6031:6321 — the IDV method options. */}
            <div
              className="flex w-full shrink-0 flex-col items-start gap-[24px]"
              data-node-id="6031:6321"
            >
              {IDV_OPTIONS.map((option) => (
                <OptionCard key={option.nodeId} option={option} />
              ))}
            </div>

            {/*
             * actions-row 6031:6348.
             *
             * FIXED 2026-09-21: these three were previously rendered inert, on
             * the reasoning that the IDV method is chosen by clicking the CID
             * card above. That is wrong for a live demo — a presenter reaches
             * for Continue, not the card, and a dead button reads as a broken
             * build in front of the client. All three now navigate:
             *   Cancel / Back -> back to the service page
             *   Continue      -> on to the CID flow (same target as the card)
             *
             * Cancel is Lato:SemiBold in Figma — the webfont has no 600, so it
             * renders at 700. Styling is unchanged; only behaviour was added.
             */}
            {/*
             * RESPONSIVE: the three controls are ~279px of content plus 48px
             * of gaps, against 240px of card interior at a 320px viewport.
             * Below 480 they become a full-width stack. `flex-col-reverse`
             * keeps the primary action at the top of that stack while leaving
             * the DOM (and therefore the tab order) in its designed order.
             */}
            <div
              className="flex w-full shrink-0 items-center justify-end gap-[24px] pt-[16px] max-xs:flex-col-reverse max-xs:items-stretch max-xs:gap-[12px]"
              data-node-id="6031:6348"
            >
              <Link
                href="/services/driver-vehicle/"
                className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[normal] text-[#004b87] max-xs:py-[10px] max-xs:text-center"
                data-node-id="6031:6349"
              >
                {WIZARD_ACTIONS.cancelLabel}
              </Link>
              <BtnOutline
                href="/services/driver-vehicle/"
                className="max-xs:w-full max-xs:justify-center"
              >
                {WIZARD_ACTIONS.backLabel}
              </BtnOutline>
              <BtnPrimary href="/cid/terms/" className="max-xs:w-full">
                {WIZARD_ACTIONS.continueLabel}
              </BtnPrimary>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
