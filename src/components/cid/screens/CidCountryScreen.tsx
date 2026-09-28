import { CidScreen } from "@/components/cid/CidScreen";
import {
  YotiActionBar,
  YotiContinue,
  YotiHelpIcon,
} from "@/components/cid/yoti/YotiChrome";
import { ASSETS } from "@/lib/assets";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { YOTI_COLOR, YOTI_SIZE, YOTI_TEXT } from "@/lib/data/yoti-tokens";

/*
 * CID_ID1_Country — Figma 6217:66054, 393 x 1060.810546875.
 *
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. /cid/country/ (Flow A) and
 * /cid/studentaid/country/ (Flow B, §9 PP-14 = 6217:66071, "reuse"). Only the
 * wizard title above and the forward link below come from the service.
 *
 * ADDED 2026-09-22. Document-type / country-of-issuance selection: the screen
 * that comes between biometric consent and the accepted-documents list.
 * design/verification-frame-map.md §9 had this as gap G1 ("a separate country
 * selection screen: not found"). It exists — G1 is closed.
 *
 * A 393 CID SCREEN, so it uses CidScreen like /cid/terms/, /cid/biometric/,
 * /cid/document/ and the two capture screens. Below 768 that renders the Figma
 * mobile frame unchanged; at 768 and up it drops this content into the desktop
 * wizard chrome, which is INVENTED — see CidScreen for the full provenance note
 * and the CSS-only mechanism.
 *
 * THE PILL SAYS "step 4 of 5" (6257:72205), the same as the three ID-document
 * screens after it. Nothing in the file displays "step 3 of 5" except the two
 * liveness frames, which now sit before this screen, so the counter runs
 * 1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 5 with no number skipped. Reproduced
 * verbatim, NOT renumbered — see design/verification-frame-map.md §12.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata on 6217:66054 and
 * get_design_context on 6056:15795:
 *   top-nav actions      393 x 145        at y=0        (6056:14970)
 *   Main content         393 x 650        at y=145      px-[16px] py-[24px] gap-[8px]
 *     wizard-header      361 x 121        at y=24       gap-[24px]
 *       wizard-title     361 x  29        at y=0
 *       progress-stepper 361 x  68        at y=53       gap-[8px]
 *         step-bar       361 x   8        at y=0        fill 278.869
 *         step-labels    361 x  18        at y=16       current = Prerequisite Check
 *         sub-step-readout 208 x 26       at y=42       6257:72205
 *     document-type-select 361 x 428      at y=153      py-[24px] gap-[24px]
 *       Main-Text        361 x 126        at y=24       gap-[12px]
 *         title          361 x  54        at y=0        22px Bold  #333b40
 *         body           361 x  60        at y=66       14px SemiBold leading 1.4
 *       select-dropdown  361 x  52        at y=174      p-[16px] radius 8
 *         label          240 x  20        at x=16, y=16  16px Regular #546072
 *         chevron-down    16 x  16        at x=329, y=18
 *       PrivacyInfoCard  361 x 154        at y=250      p-[16px] gap-[12px] radius 8
 *         yoti-header    177 x  20        at x=16, y=16  16px Bold #546072
 *         body           329 x  54        at x=16, y=48  13px Regular leading 1.4
 *         yoti-footer    329 x  24        at x=16, y=114 pt-[8px], justify-between
 *           Privacy Policy 95 x 16        at y=8        13px Bold #27619b underline
 *           Frame 12   110.701 x 16       at x=218.299, y=8   gap-[8px]
 *             Powered by  69 x 13         11px Bold #546072
 *             image 20 33.7011 x 16       YOTI badge, mix-blend-multiply
 *     Frame 6            361 x  37        at y=589
 *       Yoti ContinueButton 361 x 37      at y=0        #27619b, full width
 *   footer verified      393 x 265.8105   at y=795      (6056:15026)
 *
 * 24 + 121 + 8 + 428 + 8 + 37 + 24 = 650, and 145 + 650 + 265.8105 = 1060.8105
 * — the frame height, exactly. Inside document-type-select:
 * 24 + 126 + 24 + 52 + 24 + 154 + 24 = 428.
 *
 * HIDDEN LAYERS NOT RENDERED: `Check box` (6056:15020, 286 x 27 at y=577) and
 * `btn-back` (6056:15024, 361 x 39) are both hidden="true" in Figma. Hidden
 * layers are not part of the design — the same rule every other CID frame
 * applies to its own hidden instances. Continue is therefore the ONLY control
 * on this screen and there is no Back button; the reverse move is the
 * presenter's ArrowLeft (see src/lib/flow.ts) and the browser's back button.
 *
 * THE FRAME NAME AND THE HEADING DISAGREE. The frame is called
 * `CID_ID1_Country`, the heading says "Select the type of identity document you
 * want to add", and the only control below it picks a COUNTRY of issuance. All
 * three strings are verbatim; the mismatch is the design file's.
 *
 * TYPE AND COLOUR. Every text node here is Montserrat on the Yoti ramp, like
 * the other ID-document frames: `Yoti app` #333b40, `Yoti gris` #546072,
 * `Yoti CTA` #27619b, `Yoti gris pâle` #f3f4f6. The COLOURS are reproduced
 * verbatim, and Montserrat is self-hosted since 2026-09-23.
 *
 * SELECT BOX MODEL. Figma draws the select's 1px stroke INSIDE the 52px frame
 * (label at x=16, y=16 from the outer edge), which a CSS `border` cannot do —
 * it would make the control 54 tall and shift everything below it by 2px and
 * the frame by 2. The stroke is painted with an inset box-shadow, exactly as
 * the RadioRows on /cid/document/, WizardCard and TopNav already do it.
 *
 * STATIC BY DESIGN — THE SELECT IS NOT A `<select>`. It is a reproduction of
 * one resting state. There is no option list anywhere in the design file, the
 * demo has no country data to populate one, and a real dropdown would be a
 * control the presenter could leave open on stage. It is rendered as a plain
 * div marked `data-demo-inert`, exactly how the radio cards on /cid/document/
 * and /services/driver-vehicle/onboard/ are handled. Continue advances
 * regardless, which is also what those screens do.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — INVENTED; NOT IN FIGMA.
 *
 * This frame is MOBILE ONLY in Figma (393 wide), like every other CID frame. At
 * and above 768 CidScreen drops the content into the same wizard chrome
 * /services/driver-vehicle/onboard/ uses. Every `md:` class on this page is
 * part of that invention; nothing else moved.
 *
 * Invented here, specifically:
 *   document-type-select `md:pt-0 md:pb-0` — the 24px pads are the mobile
 *                        frame's spacing away from wizard-header above and
 *                        Frame 6 below. Inside the card the 32px card gap does
 *                        both jobs and the two would stack to 56.
 *   Frame 6  `md:flex-row md:items-center md:justify-end md:pt-[16px]` with
 *                        `md:w-auto` on the button — a full-width 740px button
 *                        in an 820px card reads as a phone screen stretched. It
 *                        becomes the onboard actions-row instead. Lifted
 *                        verbatim from /cid/document/ so the two consecutive
 *                        screens put their Continue in the same place.
 * The 22px heading, the 14px body, the select and the privacy card are
 * UNCHANGED at every width.
 *
 * ONE RELAXATION BELOW THE DESIGN WIDTH: the select's label is
 * `whitespace-nowrap` in Figma, where 240px of label plus a 16px chevron
 * exactly fills the 256px interior at 393. At 320 that interior is 224px, so
 * the label is released to wrap at `max-xxs:` — below 384, i.e. below the CID
 * canvas width, never at 393 itself. `max-xxs`, NOT `max-xs`: 393 is these
 * screens' untouchable design width and a `max-xs:` rule (< 480) would fire on
 * it and move the mobile baseline.
 * ------------------------------------------------------------------------
 */
export function CidCountryScreen({ service }: { service: ServiceConfig }) {
  const { country: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="6056:14971" subStep={copy.subStep} yotiZone>
      {/* document-type-select — 6056:15795 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[24px] pt-[24px] pb-[24px] md:pt-0 md:pb-0"
        data-node-id="6056:15795"
        data-name="document-type-select"
      >
        {/*
         * THE HELP ICON — Y1, Y3 and Y5 (YOTI_HELP_SCREENS). Its own
         * right-aligned row above the heading, exactly as on Y1; see the longer
         * note there. YOTI_OBSERVED.md Y3 lists it as item 1 on this screen,
         * before the heading.
         */}
        <div className="flex w-full shrink-0 justify-end" data-name="yoti-help-row">
          <YotiHelpIcon />
        </div>

        {/* Main-Text — 6056:15796 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[12px]"
          data-node-id="6056:15796"
          data-name="Main-Text"
          style={{ color: YOTI_COLOR.ink }}
        >
          {/* RAISED 2026-09-27: 22px -> `YOTI_TEXT.heading` (24px), leaded 1.2. */}
          <p
            className="w-full shrink-0 font-bold [word-break:break-word]"
            style={{
              fontSize: YOTI_TEXT.heading,
              lineHeight: YOTI_TEXT.headingLeading,
            }}
            data-node-id="6056:15797"
          >
            {copy.title}
          </p>
          {/*
           * Montserrat. RAISED 2026-09-27 from 14px SemiBold to
           * `YOTI_TEXT.body` (16px) REGULAR — YOTI_OBSERVED.md Y3 item 3 reads
           * "Body, 4 lines, REGULAR, dark", and §6's "smaller and lighter"
           * correction is about size, not weight: the recreation is a step
           * small AND a step heavy here, in opposite directions.
           */}
          <p
            className="w-full shrink-0 font-normal [word-break:break-word]"
            style={{
              fontSize: YOTI_TEXT.body,
              lineHeight: YOTI_TEXT.bodyLeading,
            }}
            data-node-id="6056:15798"
          >
            {copy.body}
          </p>
        </div>

        {/*
         * select-dropdown — 6076:31356.
         *
         * YOTI-OWNED CONTROL — NOT A GNL COMPONENT. This is the identity
         * provider's own country picker, rendered by Yoti inside GNL chrome in
         * production: GNL supplies the top nav, wizard header, stepper and
         * footer; Yoti supplies this body. Its #d1d5db stroke and #546072 label
         * are the Yoti ramp, not the GNL one — deliberate, not drift. Do not
         * fold it into a GNL form control or "fix" its colours to match the
         * rest of the wizard. See design/verification-frame-map.md §7.
         *
         * A DIV, NOT A `<select>`. Static reproduction — see the note above.
         */}
        {/*
         * RESTYLED TO THE REAL FIELD 2026-09-27. YOTI_OBSERVED.md Y3 item 4:
         * "white, full width, clearly TALLER than a normal input (~46 px),
         * rounded (~6 px), visible ~2 px muted blue-grey border, grey
         * placeholder … chevron ⌄ at the right."
         *
         * So four values move at once, and all four come from the token file:
         * `fieldHeight` 46 (the recreation's box was 52, produced by p-16),
         * `fieldRadius` 6 (was 8), `fieldBorder` 2 (was 1) and `YOTI_COLOR.border`
         * #9ca5b4 (was #d1d5db, a lighter grey with no blue in it).
         *
         * STILL AN INSET BOX-SHADOW, NOT A `border`. Figma draws the stroke
         * INSIDE the box; a CSS border would add 4px to the height at 2px and
         * push everything below it down. Same technique as the rows on
         * /cid/document/, WizardCard and TopNav.
         *
         * STILL A DIV, NOT A `<select>` — see the note above.
         */}
        <div
          className="box-border flex w-full shrink-0 cursor-default items-center justify-between bg-white px-[16px] select-none"
          style={{
            height: YOTI_SIZE.fieldHeight,
            borderRadius: YOTI_SIZE.fieldRadius,
            boxShadow: `inset 0 0 0 ${YOTI_SIZE.fieldBorder} ${YOTI_COLOR.border}`,
          }}
          data-node-id="6076:31356"
          data-name="select-dropdown"
          data-demo-inert="true"
          aria-disabled="true"
        >
          <p
            className="min-w-px shrink-0 font-normal leading-[normal] whitespace-nowrap max-xxs:whitespace-normal"
            style={{ fontSize: YOTI_TEXT.body, color: YOTI_COLOR.muted }}
          >
            {copy.selectLabel}
          </p>
          <div className="relative size-[16px] shrink-0" data-name="chevron-down">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={ASSETS.iconChevronDownYoti}
            />
          </div>
        </div>

        {/*
         * PrivacyInfoCard — 6056:15803.
         *
         * YOTI-OWNED BLOCK — NOT A GNL COMPONENT. The provider's own privacy
         * disclosure, including the "Powered by YOTI" badge. In production the
         * whole card is rendered by Yoti. Nobody should later mistake it for a
         * GNL card: the #f3f4f6 fill is `Yoti gris pâle` and the #27619b link
         * is `Yoti CTA`, neither of which appears in the GNL token set.
         */}
        {/*
         * RESTYLED TO THE REAL PANEL 2026-09-27 — "light grey (#f3f4f6),
         * rounded (~8 px), ROOMY PADDING" (YOTI_OBSERVED.md Y3 item 5). The
         * fill and the radius already matched (`YOTI_COLOR.panel`,
         * `YOTI_SIZE.panelRadius`) and are now spelled from the tokens; the
         * padding moves 16 -> `YOTI_SIZE.panelPadding` (20), which is the
         * "roomy" the transcription measures.
         */}
        <div
          className="box-border flex w-full shrink-0 flex-col items-start gap-[12px]"
          style={{
            background: YOTI_COLOR.panel,
            borderRadius: YOTI_SIZE.panelRadius,
            padding: YOTI_SIZE.panelPadding,
          }}
          data-node-id="6056:15803"
          data-name="PrivacyInfoCard"
        >
          {/* yoti-header 6056:15804 — one child, so no gap is expressed. */}
          <div
            className="flex shrink-0 items-center"
            data-node-id="6056:15804"
            data-name="yoti-header"
          >
            {/*
             * RAISED 2026-09-27: 16px -> `YOTI_TEXT.panelTitle` (18px).
             * YOTI_OBSERVED.md: "title 'Votre vie privée et Yoti', bold,
             * grey-blue, LARGER THAN BODY".
             */}
            <p
              className="shrink-0 font-bold leading-[normal] [word-break:break-word]"
              style={{
                fontSize: YOTI_TEXT.panelTitle,
                color: YOTI_COLOR.muted,
              }}
              data-node-id="6056:15807"
            >
              {copy.privacy.title}
            </p>
          </div>

          {/*
           * The panel body keeps its 13px. §6 gives no token for it and
           * YOTI_OBSERVED.md records only "body, 4 lines, regular, same
           * grey-blue" with no size, so raising it would be a guess dressed as
           * a measurement. Left as the recreation draws it and logged as an
           * open question instead. The COLOUR is now the token.
           */}
          <p
            className="w-full shrink-0 text-[13px] font-normal leading-[1.4] [word-break:break-word]"
            style={{ color: YOTI_COLOR.muted }}
            data-node-id="6056:15808"
          >
            {copy.privacy.body}
          </p>

          {/* yoti-footer 6056:15809 */}
          <div
            className="flex w-full shrink-0 items-center justify-between gap-[8px] pt-[8px]"
            data-node-id="6056:15809"
            data-name="yoti-footer"
          >
            {/*
             * Rendered as text, not an anchor: the design gives it no
             * destination, and a live link would let the presenter leave the
             * flow mid-demo. Same treatment as the Terms of Use link on
             * /cid/terms/.
             */}
            {/*
             * COLOUR CORRECTED 2026-09-27: #27619b -> `YOTI_COLOR.link`
             * (#355677). YOTI_OBSERVED.md Y3: "'Politique de confidentialité' —
             * bold, a DARKER BLUE THAN THE BUTTON BLUE". The recreation used
             * the button blue for both; the tokens file keeps them apart and
             * says in so many words that the difference is not a mistake.
             */}
            <p
              className="shrink-0 cursor-default text-[13px] font-bold leading-[normal] whitespace-nowrap underline decoration-solid decoration-from-font select-none [text-decoration-skip-ink:none] [text-underline-position:from-font]"
              style={{ color: YOTI_COLOR.link }}
              data-node-id="6056:15810"
              data-demo-inert="true"
            >
              {copy.privacy.linkLabel}
            </p>

            {/* Frame 12 — 6087:31386 */}
            <div
              className="flex shrink-0 items-center justify-center gap-[8px]"
              data-node-id="6087:31386"
            >
              <p
                className="shrink-0 text-[11px] font-bold leading-[normal] whitespace-nowrap text-[#546072]"
                data-node-id="6056:15811"
              >
                {copy.privacy.poweredBy}
              </p>
              {/*
               * image 20 — the YOTI badge, 33.701072692871094 x 16.
               * `mix-blend-multiply` on the box and 80% opacity on the image
               * are both Figma's; reproduced at the call site rather than baked
               * into the asset, so the real export drops straight in.
               */}
              <div
                className="relative h-[16px] w-[33.701072692871094px] shrink-0 mix-blend-multiply"
                data-node-id="6087:31390"
                data-name="image 20"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none opacity-80"
                  src={ASSETS.yotiBadge}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
       * Frame 6 — 6056:15021, REPLACED BY THE PINNED BAR 2026-09-27. Same
       * change, same reasoning and same destination as on Y1; see the long note
       * on CidLivenessScreen.
       *
       * NOTE WHAT THE REAL SCREEN DOES HERE, because it is an open question and
       * not a defect: YOTI_OBSERVED.md Y3 "Before a country is chosen" ends
       * "NO Continue button, no pinned bar — confirmed", and the bar only
       * appears in the "After typing a country" frame, on the same screen as
       * the accepted-documents list. The bar is drawn here anyway for the same
       * reason Y2 keeps its button: this build shows the resting state of a
       * static screen, and a resting state with no forward control is a dead
       * end on stage. Logged in DEMO_AUDIT.md.
       */}
      <YotiActionBar>
        <YotiContinue href={routes.document}>{actions.continueShort}</YotiContinue>
      </YotiActionBar>
    </CidScreen>
  );
}
