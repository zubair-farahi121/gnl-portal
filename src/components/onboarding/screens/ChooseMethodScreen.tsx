import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { ASSETS } from "@/lib/assets";
import {
  WIZARD_ACTIONS,
  getOnboardingCopy,
  type IdvOption,
  type MethodStepScale,
  type OptionTitleStyle,
} from "@/lib/data/onboarding";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { CancelLink } from "@/components/onboarding/CancelLink";
import { MethodRadio } from "@/components/onboarding/MethodRadio";

/*
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-28.
 *
 *   /services/driver-vehicle/onboard/  NL-07  Figma 6031:6304  2 cards
 *   /services/studentaid/onboard/      PP-07  Figma 6206:27601  3 cards
 *
 * MOVED here from the Flow A page, with the service as a prop. The `onboard`
 * baseline must stay at 0.000% — every Flow A class string below is the one
 * the page had, now reached through `SCALE.nl07` / `TITLE_STYLE.nl07`.
 *
 * WHAT PP-07 CHANGES, all measured (get_metadata 6206:27601,
 * get_design_context 6217:30590 / 6217:30595 / 6217:30621, 2026-09-28):
 *   - THREE cards, rendered from `service.methods` rather than a hardcoded
 *     pair, GNL IDV pre-selected. Each card's bullet is spelled as its own
 *     frame spells it — see METHOD_OPTIONS in src/lib/data/onboarding.ts.
 *   - The LARGER TYPE SCALE (`pp07`) — the frame was redrawn at 36/16/18/16.
 *   - GNL IDV and Continue go to PP-08 "Other verification", not straight to
 *     the hand-off, because `otherVerificationStep` is true.
 *   - Cancel AND Back are both visible, as on NL-07; nothing to change there.
 *
 * The old header note on this page said "PP-07 is this frame with a THIRD
 * option card and a visible Back … that is a Flow B build item, not this
 * pass." This is that pass.
 * ====================================================================
 */

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
const TITLE_STYLE: Record<MethodStepScale, Record<OptionTitleStyle, string>> = {
  nl07: {
    muted: "text-[16px] font-bold leading-[1.5] text-[#5f6368]",
    link: "text-[16px] font-bold leading-[normal] text-[#004b87]",
  },
  /* PP-07, get_design_context 6217:30595 / 6217:30621: the same two styles at
     18px — 27px and 22px rows, which is what the metadata measures. */
  pp07: {
    muted: "text-[18px] font-bold leading-[1.5] text-[#5f6368]",
    link: "text-[18px] font-bold leading-[normal] text-[#004b87]",
  },
};

/**
 * Every other class on this screen that the two frames draw differently. See
 * `METHOD_STEP` in src/lib/data/onboarding.ts for the measured table. The
 * `nl07` strings are the ones this page always had, character for character —
 * the `onboard` baseline is what proves it.
 */
const SCALE: Record<
  MethodStepScale,
  {
    main: string;
    well: string;
    sectionTitle: string;
    sectionSubtitle: string;
    smallText: string;
    bulletRow: string;
  }
> = {
  nl07: {
    main: "h-[993px] w-full max-[1439px]:h-auto",
    well: "gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] max-[1439px]:pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]",
    sectionTitle:
      "w-full text-[28px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]",
    sectionSubtitle:
      "w-full text-[15px] font-normal leading-[1.5] text-[#212326] [word-break:break-word]",
    smallText: "text-[14px]",
    bulletRow: "flex w-full shrink-0 items-center gap-[8px]",
  },
  /*
   * PP-07. The main is NOT pinned: 1259 is 152 + 955 + 152, and the 955px card
   * holds three cards of wrapping copy whose height is the browser's to decide,
   * so an explicit 152px bottom pad keeps the symmetric well at any height —
   * the Summary / Terms screens' method. The 36px heading steps down twice
   * below the tablet breakpoint, the same ladder every other 36px wizard
   * heading uses.
   */
  pp07: {
    main: "w-full",
    well: "gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]",
    sectionTitle:
      "w-full text-[36px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-md:text-[30px] max-xs:text-[26px]",
    sectionSubtitle:
      "w-full text-[16px] font-normal leading-[1.5] text-[#212326] [word-break:break-word]",
    smallText: "text-[16px]",
    /* `items-start`: the bullet text is two lines at 580px, and Figma hangs the
       marker off the FIRST line (Frame 14673, 4 x 15, dot at y=11). */
    bulletRow: "flex w-full shrink-0 items-start gap-[8px]",
  },
};

/**
 * GNL Logo — Figma 6098:100409 / 6098:60395, 72.134 x 36.215.
 *
 * 2026-10-01: the designer's `gnl-crest-grey.svg` (colour flowers, GREY
 * wordmark — this card is white, so the footer's white-wordmark crest would
 * vanish here). Its own box is 73 x 37, so it is drawn `object-contain` in the
 * Figma box. Decorative (alt=""): the card is a <label> and its radio is named
 * by the title alone.
 */
function GnlLogo() {
  return (
    <div
      className="relative h-[36.215px] w-[72.134px] shrink-0 overflow-clip"
      data-node-id="6098:60395"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="absolute inset-0 block size-full max-w-none object-contain" src={ASSETS.gnlCrestGrey} />
    </div>
  );
}

/** A stable id for an option's title, so its radio is named by the title alone. */
function titleId(option: IdvOption) {
  return `idv-method-${option.nodeId.replace(/[^0-9a-z]/gi, "-")}-title`;
}

function OptionBody({
  option,
  scale,
  group,
}: {
  option: IdvOption;
  scale: MethodStepScale;
  group: string;
}) {
  return (
    <>
      {/* service-details — flex-1, so the crest keeps its 72.134px at the right edge. */}
      <div className="flex min-w-px flex-1 flex-col items-start gap-[12px]">
        {/* service-title-row. Shrink-to-fit by design, so the title has no
            width to wrap against; below 768 it takes the full details column
            and top-aligns the radio against what may now be two lines. */}
        <div className="flex shrink-0 items-center gap-[12px] max-md:w-full max-md:items-start">
          {/* 2026-09-30 (feedback-ui): a native radio, not the 16px
              radio-selected / radio-unselected image. The card around it is
              the <label>. */}
          <MethodRadio
            name={group}
            checked={option.selected}
            href={option.href}
            labelledBy={titleId(option)}
          />
          {/* The design's `whitespace-nowrap` holds these on one line at 740px.
              "Motor Registration Division (MRD)" is ~245px, wider than the
              details column gets below 768, so it is released there. */}
          <p
            id={titleId(option)}
            className={`shrink-0 whitespace-nowrap ${TITLE_STYLE[scale][option.titleStyle]} max-md:min-w-px max-md:shrink max-md:whitespace-normal`}
          >
            {option.title}
          </p>
        </div>

        {/* verification-list-wrapper — pl-[28px] aligns the list under the title, not the radio. */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[8px] pl-[28px]">
          <p className={`w-full shrink-0 ${SCALE[scale].smallText} font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]`}>
            {option.verifyIntro}
          </p>
          {option.bullets.map((bullet) => (
            <div key={bullet} className={SCALE[scale].bulletRow}>
              {scale === "nl07" ? (
                <div className="relative size-[4px] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.bulletDot} />
                </div>
              ) : (
                /* PP-07 `Frame 14673` 6217:38157 — a 4 x 15 box with the 4px
                   dot at its foot (y=11), so the dot sits on the first line's
                   x-height rather than floating at the middle of two lines. */
                <div className="relative h-[15px] w-[4px] shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" className="absolute bottom-0 left-0 block size-[4px] max-w-none" src={ASSETS.bulletDot} />
                </div>
              )}
              <p className={`min-w-px flex-1 ${SCALE[scale].smallText} font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]`}>
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
 * href, so it is the one option that leads on. Every other option is inert:
 * it does not navigate, its radio does not stay checked, and it shows the
 * "Not part of this demo" toast — which keeps the presenter from clicking
 * into an unbuilt provider screen on stage.
 *
 * 2026-09-30 (feedback-ui): every card is a <label> wrapping a native radio
 * (MethodRadio), one `name` per group. It used to be a <Link> (GNL IDV) or a
 * <div> (inert) around a radio image. `data-href` marks the card that leads
 * on, for `npm run clicks`.
 */
function OptionCard({
  option,
  scale,
  group,
}: {
  option: IdvOption;
  scale: MethodStepScale;
  group: string;
}) {
  if (option.href) {
    return (
      <label
        className={`${OPTION_CARD} cursor-pointer`}
        data-node-id={option.nodeId}
        data-href={option.href}
      >
        <OptionBody option={option} scale={scale} group={group} />
      </label>
    );
  }
  return (
    <label
      className={`${OPTION_CARD} cursor-default select-none`}
      data-node-id={option.nodeId}
      data-demo-inert="true"
    >
      <OptionBody option={option} scale={scale} group={group} />
    </label>
  );
}

export function ChooseMethodScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  const copy = getOnboardingCopy(service);
  const { scale, nodeIds } = copy.methodStep;
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      <main className={SCALE[scale].main} data-node-id={nodeIds.main}>
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
        <div className={SCALE[scale].well}>
          <WizardCard>
            {/*
             * RE-SYNC 2026-09-21: this frame (6031:6304) received the same
             * type-scale bump as the confirmation screen and grew 1202 -> 1253.
             * size="lg" carries the wizard-title 24->28, step-bar 8->16 and
             * step-labels 12->16. The four CID mobile frames were NOT rebuilt
             * and stay on the default "sm" scale.
             */}
            <WizardHeader title={copy.wizardTitle} current={2} size="lg" />

            {/* section-intro 6031:6318 (NL-07) / 6217:30590 (PP-07) */}
            <div
              className="flex w-full shrink-0 flex-col items-start gap-[8px]"
              data-node-id={nodeIds.sectionIntro}
            >
              <p className={SCALE[scale].sectionTitle} data-node-id={nodeIds.sectionTitle}>
                {copy.sectionIntro.title}
              </p>
              <p className={SCALE[scale].sectionSubtitle} data-node-id={nodeIds.sectionSubtitle}>
                {copy.sectionIntro.subtitle}
              </p>
            </div>

            {/*
             * Frame 1 6031:6321 (NL-07) / 6217:30593 (PP-07) — the IDV method
             * options, IN `service.methods` ORDER: two cards for Flow A (MRD,
             * GNL IDV), three for Flow B (MCP, MRD, GNL IDV). GNL IDV is
             * pre-selected in both (`defaultMethod`) and is the only card that
             * navigates; MCP and MRD are inert and show the toast, exactly as
             * Flow A's MRD card always has.
             */}
            <div
              className="flex w-full shrink-0 flex-col items-start gap-[24px]"
              role="radiogroup"
              aria-label={copy.sectionIntro.title}
              data-node-id={nodeIds.options}
            >
              {copy.idvOptions.map((option) => (
                <OptionCard
                  key={option.nodeId}
                  option={option}
                  scale={scale}
                  group={`idv-method-${service.id}`}
                />
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
              data-node-id={nodeIds.actions}
            >
              {/* §7.4: Cancel leaves onboarding and resets it to not-started
                  (unless the service is already onboarded). Same `<Link>`, same
                  classes, same node id — see CancelLink. */}
              <CancelLink
                service={service.id}
                href={routes.page}
                className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[normal] text-[#004b87] max-xs:py-[10px] max-xs:text-center"
                nodeId={nodeIds.cancel}
              >
                {WIZARD_ACTIONS.cancelLabel}
              </CancelLink>
              {/*
               * RE-POINTED 2026-09-23 from the service page to NL-06
               * `/services/driver-vehicle/confirm-details/`.
               *
               * §7.4 is "Back -> previous page", and until Tier 1 the previous
               * page WAS the service page — NL-04, NL-05 and NL-06 did not
               * exist. Now they do, so leaving this pointing at the service
               * page would dump the presenter out of the wizard in one hop
               * from step 4 of 4. The reverse chain now walks back through
               * Confirm details -> Terms -> Summary, which `npm run clicks`
               * asserts hop by hop (B16..B19).
               *
               * Destination only. Nothing about the button moved.
               */}
              <BtnOutline
                href={routes.confirmDetails}
                className="max-xs:w-full max-xs:justify-center"
              >
                {WIZARD_ACTIONS.backLabel}
              </BtnOutline>
              {/*
               * RE-POINTED 2026-09-22 from /cid/terms/ to
               * /cid/continue-on-mobile/ (Figma 6217:62059). That frame sits at
               * x=13340.17 on Row B, between this one and CID_TU (x=15130), and
               * Row B's x-order is flow order — so the mobile hand-off comes
               * first and IT hands on to Terms of use. The IDV-method card
               * above is re-pointed with it, so both routes into the CID
               * journey still land on the same screen.
               *
               * 2026-09-28: `methodContinueHref`, the SAME value as the GNL IDV
               * card's href. For Flow A it is still /cid/continue-on-mobile/;
               * for Flow B it is PP-08 /services/studentaid/other-verification/,
               * whose own Continue then hands on to /cid/studentaid/… .
               */}
              {/* PP-07's ContinueButton 6217:30637 is 114 x 39 with a 66px
                  label — the 16px `lg` size, as on PP-08 / PP-21. NL-07 keeps
                  the default (`sm`) it has always had: `size` is undefined
                  for it, so the prop is not even passed. */}
              <BtnPrimary
                href={copy.methodContinueHref}
                className="max-xs:w-full"
                size={scale === "pp07" ? "lg" : undefined}
              >
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
