import { CidScreen } from "@/components/cid/CidScreen";
import {
  YotiActionBar,
  YotiContinue,
  YotiHelpIcon,
} from "@/components/cid/yoti/YotiChrome";
import { ASSETS } from "@/lib/assets";
import { getCidCopy, type CidGuideline } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { YOTI_COLOR, YOTI_SIZE, YOTI_TEXT } from "@/lib/data/yoti-tokens";

/*
 * CID_ID1_Front_instruction — Figma 6217:66055, 393 x 994.810546875.
 *
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. /cid/capture-intro/ (Flow A) and
 * /cid/studentaid/capture-intro/ (Flow B, §9 PP-16 = 6217:66151, listed as a
 * plain "reuse" instance).
 *
 * NOTE THE TITLE KEEPS "(front)" IN BOTH FLOWS. §10.1 drops the parenthetical
 * from the CAPTURE headings (PP-17) and says nothing about this INSTRUCTION
 * screen; PP-16 is a straight instance. So it is not harmonised on a guess —
 * flagged for Tatyana rather than decided here, exactly the way the U+0027 /
 * U+2019 split is handled elsewhere.
 *
 * ADDED 2026-09-22. The capture instructions: what to do before the camera
 * opens. This is step 4b, the screen design/verification-frame-map.md §9 listed
 * as gap G2 — "Exists, but I cannot give you its node id" — and §10 raised as
 * conflict C2, "the build cannot add this screen until someone reads the
 * master's id off the canvas."
 *
 * C2 IS NOW SETTLED, AND THE FRAME MAP'S REASONING WAS RIGHT. The master is
 * 6217:66055, and its `progress-stepper` is 6257:69650 — precisely the id the
 * frame map predicted from the stepper-upgrade ordering (…69636 on 6087:31396,
 * then …69650 here, then …69707 on 6056:19118). Its `wizard-header` is the
 * 121px single-line Driver-and-Vehicle signature, not StudentAidNL's 134px, and
 * its `Yoti ContinueButton` is 6076:31370, the instance the frame map named.
 * Four independent predictions, four hits: this is the master, sequenced
 * between /cid/document/ and /cid/capture-front/.
 *
 * A 393 CID SCREEN, so it uses CidScreen. Below 768 that renders the Figma
 * mobile frame unchanged; at 768 and up it drops this content into the desktop
 * wizard chrome, which is INVENTED — see CidScreen for the full provenance note.
 *
 * THE PILL SAYS "step 4 of 5" (6257:72219), like the four screens around it.
 * Counter reproduced verbatim, not renumbered.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata on 6217:66055 and
 * get_design_context on 6056:20786:
 *   top-nav actions      393 x 145        at y=0        (6056:19945)
 *   Main content         393 x 584        at y=145      px-[16px] py-[24px] gap-[8px]
 *     wizard-header      361 x 121        at y=24       gap-[24px]
 *       wizard-title     361 x  29        at y=0
 *       progress-stepper 361 x  68        at y=53       gap-[8px]
 *         step-bar       361 x   8        at y=0        fill 278.869
 *         step-labels    361 x  18        at y=16       current = Prerequisite Check
 *         sub-step-readout 208 x 26       at y=42       6257:72219
 *     Screen 7 - id-photo-instructions 361 x 362 at y=153  py-[24px] gap-[20px]
 *       Expiry Banner    361 x  56        at y=24       hidden="true"
 *       Instruction Header 361 x 102      at y=24       gap-[8px]
 *         title          361 x  54        at y=0        22px Bold  #333b40
 *         subtitle       361 x  40        at y=62       14px Regular leading 20px #4b5563
 *       Guidelines Card  361 x 192        at y=146      p-[16px] gap-[12px] radius 8
 *         "Don't forget:" 329 x 18        at x=16, y=16  15px Bold #546072
 *         Guideline Row 1 329 x 36        at x=16, y=46  gap-[12px] items-START
 *           icon          34 x 34         at y=0
 *           label        283 x 36         at x=46        13px SemiBold leading 18px
 *         Guideline Row 2 329 x 34        at x=16, y=94  gap-[12px] items-CENTER
 *           icon          34 x 34         at y=0
 *           label        283 x 18         at x=46, y=8
 *         Guideline Row 3 329 x 36        at x=16, y=140 gap-[12px] items-START
 *           icon          34 x 34         at y=0
 *           label        283 x 36         at x=46
 *     Frame 6            361 x  37        at y=523
 *       Yoti ContinueButton 361 x 37      at y=0        #27619b, full width
 *   footer verified      393 x 265.8105   at y=729      (6056:20006)
 *
 * 24 + 121 + 8 + 362 + 8 + 37 + 24 = 584, and 145 + 584 + 265.8105 = 994.8105
 * — the frame height, exactly. Inside Screen 7: 24 + 102 + 20 + 192 + 24 = 362.
 * Inside Guidelines Card: 16 + 18 + 12 + 36 + 12 + 34 + 12 + 36 + 16 = 192.
 *
 * NOTE THE 20px GAP. `Screen 7` uses gap-[20px] between its two children, where
 * /cid/document/'s `accepted-documents` and /cid/country/'s
 * `document-type-select` both use 24. Reproduced, not harmonised.
 *
 * PER-ROW CROSS-AXIS ALIGNMENT IS THE DESIGN'S, AND IT IS LOAD-BEARING. Rows 1
 * and 3 are `items-start` and row 2 is `items-center` — which is exactly why
 * rows 1 and 3 measure 36 (a 34px icon beside two 18px lines) and row 2
 * measures 34 (a 34px icon beside one 18px line, centred). Flatten them all to
 * one value and the card stops being 192.
 *
 * HIDDEN LAYERS NOT RENDERED — THREE of them here, one more than the other CID
 * frames: `Expiry Banner` (6056:20787, 361 x 56, "For security reasons, this
 * session will expire in 10 minutes."), `Check box` (6056:20000) and `btn-back`
 * (6056:20004) are all hidden="true" in Figma. The Expiry Banner sits at the
 * SAME y=24 as Instruction Header, so it is an overlay state the design
 * anticipates but does not show — rendering it would push the whole card down
 * 80px and break the measured 362. Hidden layers are not part of the design.
 *
 * So Continue is the ONLY control on this screen. The reverse move is the
 * presenter's ArrowLeft (see src/lib/flow.ts) and the browser's back button —
 * same as /cid/document/, /cid/country/ and the two capture screens.
 *
 * "THIS TIME" IS IN THE DESIGN FILE. The subtitle reads "We will try to get a
 * clearer image this time using your phone camera" on a screen that sits in the
 * happy path, before any capture has been attempted. Reproduced verbatim;
 * already logged as copy issue 6 in design/verification-frame-map.md §8. It is
 * also the sentence that proves the capture is expected to happen on a PHONE,
 * which is what the mobile-handoff screen (6217:62059) hands off to.
 *
 * NO CAMERA. `getUserMedia` is not called here. This screen only describes what
 * is about to happen; the capture screens after it host the live viewport.
 *
 * TYPE AND COLOUR. Montserrat on the Yoti ramp (`Yoti app` #333b40, `Yoti gris`
 * #546072, `Yoti gris pâle` #f3f4f6, plus #4b5563 for the subtitle), like the
 * other ID-document frames. COLOURS verbatim; Montserrat is self-hosted since
 * 2026-09-23.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — INVENTED; NOT IN FIGMA.
 *
 * This frame is MOBILE ONLY in Figma (393 wide). Every `md:` class on this page
 * is part of CidScreen's invented desktop chrome; nothing else moved.
 *
 * Invented here, specifically:
 *   Screen 7  `md:pt-0 md:pb-0` — the 24px pads are the mobile frame's spacing
 *                       away from wizard-header above and Frame 6 below. Inside
 *                       the card the 32px card gap does both jobs.
 *   Frame 6   `md:flex-row md:items-center md:justify-end md:pt-[16px]` with
 *                       `md:w-auto` on the button — lifted verbatim from
 *                       /cid/document/ and /cid/country/ so all four
 *                       ID-document screens put Continue in the same place.
 * The 22px heading, the 14px subtitle, the guidelines card and all three rows
 * are UNCHANGED at every width — 34 + 12 + 283 = 329 fits the card interior at
 * 393, and at 320 the label column simply wraps to more lines inside a row that
 * was already `flex-[1_0_0] min-w-px`. Nothing needed a `max-xxs:` relaxation.
 * ------------------------------------------------------------------------
 */

/**
 * Guideline Row — Figma 6056:20796 / 6056:20801 / 6056:20806.
 *
 * `align` is per row and comes from the design; see the note above on why it
 * cannot be flattened. The icon box is pinned to the exact 34px leaf size and
 * the label takes the rest with `flex-[1_0_0] min-w-px`, so a long label wraps
 * inside the row instead of widening it.
 */
function GuidelineRow({ guideline }: { guideline: CidGuideline }) {
  return (
    <div
      className={`flex w-full shrink-0 gap-[12px] ${
        guideline.align === "center" ? "items-center" : "items-start"
      }`}
      data-node-id={guideline.nodeId}
      data-name="Guideline Row"
    >
      {/* YOTI-OWNED ARTWORK — placeholder; see src/lib/assets.ts. */}
      <div className="relative size-[34px] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block size-full max-w-none"
          src={ASSETS[guideline.icon]}
        />
      </div>
      {/*
       * Montserrat:SemiBold. REAL 600 since 2026-09-23 — Montserrat is now
       * self-hosted (layout.tsx) and this zone is `.gnl-yoti-zone`, so the
       * weight is no longer collapsed to Lato 700.
       */}
      {/*
       * The row label keeps its 13px/18px. §6 gives no token for card rows and
       * YOTI_OBSERVED.md Y5 records only "[thin outline icon | text], all
       * grey-blue, comfortably spaced" with no size, so raising it would be a
       * guess dressed as a measurement — and the per-row `items-start` /
       * `items-center` alignment that makes this card measure 192 is derived
       * from the 18px line box. The COLOUR is now the token. Logged as an open
       * question alongside Y3's panel body, which is the same situation.
       */}
      <p
        className="min-w-px flex-[1_0_0] text-[13px] font-semibold leading-[18px] [word-break:break-word]"
        style={{ color: YOTI_COLOR.muted }}
      >
        {guideline.text}
      </p>
    </div>
  );
}

export function CidCaptureIntroScreen({ service }: { service: ServiceConfig }) {
  const { captureIntro: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="6056:19946" subStep={copy.subStep} yotiZone>
      {/* Screen 7 - id-photo-instructions — 6056:20786 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[20px] pt-[24px] pb-[24px] md:pt-0 md:pb-0"
        data-node-id="6056:20786"
        data-name="Screen 7 - id-photo-instructions"
      >
        {/*
         * THE HELP ICON — Y1, Y3 and Y5 (YOTI_HELP_SCREENS), in its own
         * right-aligned row above the heading; see the longer note on Y1.
         *
         * Y5 IS THE ONE WHERE ITS PRESENCE IS INFERRED RATHER THAN SEEN.
         * YOTI_OBSERVED.md Y5 item 1: "The help icon belongs at the right of
         * this same row; here it is HIDDEN UNDER THE SESSION-EXPIRY TOAST,
         * which is why §6 hedges 'probably Y5 too'." §13 requires it, so it is
         * drawn, and the inference is logged as an open question rather than
         * left implicit in the markup.
         *
         * "THIS SAME ROW" IS THE BADGE'S ROW, and the badge is not built — see
         * the audit row for it. When the badge lands, this becomes a
         * `justify-between` row with the badge on the left and nothing else
         * changes.
         */}
        <div className="flex w-full shrink-0 justify-end" data-name="yoti-help-row">
          <YotiHelpIcon />
        </div>

        {/* Instruction Header — 6056:20791 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[8px]"
          data-node-id="6056:20791"
          data-name="Instruction Header"
        >
          {/* RAISED 2026-09-27: 22px -> `YOTI_TEXT.heading` (24px), leaded 1.2. */}
          <p
            className="w-full shrink-0 font-bold [word-break:break-word]"
            style={{
              fontSize: YOTI_TEXT.heading,
              lineHeight: YOTI_TEXT.headingLeading,
              color: YOTI_COLOR.ink,
            }}
            data-node-id="6056:20792"
          >
            {copy.title}
          </p>
          {/*
           * RAISED 2026-09-27: 14px/20px -> `YOTI_TEXT.body` (16px) at
           * `bodyLeading` (1.4). YOTI_OBSERVED.md Y5 item 3: "Body, 3 lines,
           * regular, DARK" — so the colour moves too, from the recreation's
           * #4b5563 to `YOTI_COLOR.ink`.
           */}
          <p
            className="w-full shrink-0 font-normal [word-break:break-word]"
            style={{
              fontSize: YOTI_TEXT.body,
              lineHeight: YOTI_TEXT.bodyLeading,
              color: YOTI_COLOR.ink,
            }}
            data-node-id="6056:20793"
          >
            {copy.subtitle}
          </p>
        </div>

        {/*
         * Guidelines Card — 6056:20794.
         *
         * YOTI-OWNED BLOCK — NOT A GNL COMPONENT. This is the identity
         * provider's own capture guidance, rendered by Yoti inside GNL chrome
         * in production: GNL supplies the top nav, wizard header, stepper and
         * footer; Yoti supplies this body and the Continue button below it.
         * The #f3f4f6 fill is `Yoti gris pâle` and the #546072 type is `Yoti
         * gris`; neither is in the GNL token set. Do not restyle to the GNL
         * palette and do not mistake this card for a GNL component.
         * See design/verification-frame-map.md §7.
         */}
        {/*
         * RESTYLED TO THE REAL CARD 2026-09-27 — YOTI_OBSERVED.md Y5 item 4:
         * "light grey (#f3f4f6), rounded (~8 px), ROOMY PADDING". Fill and
         * radius already matched and are now spelled from `YOTI_COLOR.panel`
         * and `YOTI_SIZE.panelRadius`; the padding moves 16 ->
         * `YOTI_SIZE.panelPadding` (20). Identical treatment to the privacy
         * panel on Y3, which is the same component in the real UI.
         */}
        <div
          className="box-border flex w-full shrink-0 flex-col items-start gap-[12px]"
          style={{
            background: YOTI_COLOR.panel,
            borderRadius: YOTI_SIZE.panelRadius,
            padding: YOTI_SIZE.panelPadding,
          }}
          data-node-id="6056:20794"
          data-name="Guidelines Card"
        >
          {/* RAISED 2026-09-27: 15px -> `YOTI_TEXT.cardTitle` (16px). */}
          <p
            className="w-full shrink-0 font-bold leading-[normal] [word-break:break-word]"
            style={{ fontSize: YOTI_TEXT.cardTitle, color: YOTI_COLOR.muted }}
            data-node-id="6056:20795"
          >
            {copy.guidelinesTitle}
          </p>
          {copy.guidelines.map((guideline) => (
            <GuidelineRow key={guideline.nodeId} guideline={guideline} />
          ))}
        </div>
      </div>

      {/*
       * Frame 6 — 6056:20001, REPLACED BY THE PINNED BAR 2026-09-27. Same
       * change and same reasoning as on Y1; see the long note on
       * CidLivenessScreen. The destination is unchanged: this service's
       * capture-front screen.
       */}
      <YotiActionBar>
        <YotiContinue href={routes.captureFront}>
          {actions.continueShort}
        </YotiContinue>
      </YotiActionBar>
    </CidScreen>
  );
}
