import { CidScreen } from "@/components/cid/CidScreen";
import { YotiActionBar, YotiContinue } from "@/components/cid/yoti/YotiChrome";
import { ASSETS } from "@/lib/assets";
import { getCidCopy, type CidDocumentOption } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { YOTI_COLOR, YOTI_SIZE, YOTI_TEXT } from "@/lib/data/yoti-tokens";

/*
 * CID_ID1 (ID document selection) — Figma 6087:31396, 393 x 1168.810546875.
 *
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. /cid/document/ (Flow A) and
 * /cid/studentaid/document/ (Flow B, §9 PP-15 = 6217:66072).
 *
 * THIS IS THE SCREEN DEMO_AUDIT.md §8 USES TO MAKE ITS ARGUMENT: PP-15 is "a
 * row, not a screen", because the frame is identical and only the PRE-SELECTED
 * ROW changes — Driver's License for Flow A, Passport for Flow B. That comes
 * from `defaultDocument` in §12.1 and is applied in `getCidCopy`, so the
 * difference between the two prerendered HTML files is one border colour and
 * one `<img src>`.
 * ====================================================================
 *
 * ADDED 2026-09-22. This screen and the two capture screens after it were the
 * flow the demo was missing: the wizard ran Terms (step 1 of 5) -> Biometric
 * consent (step 2 of 5) -> Identity verified (step 5 of 5) with the actual
 * identity verification — the centrepiece — absent.
 *
 * WHICH FRAME THIS IS. Seven frames in the file are named `CID_ID1` or
 * `CID_ID1_Front camera`. Three of them are the Driver-and-Vehicle MASTERS, on
 * the y=779 row, and their `wizard-title` reads "Driver and Vehicle":
 *   6087:31396  ID document selection   393 x 1168.81   <- this file
 *   6056:19118  Capture ID document (front)  393 x 1174.81
 *   6057:20924  Capture ID document (back)   393 x 1174.81
 * Three more sit on the y=2341 row (6217:66072 / 6217:76798 / 6217:66154) and
 * are StudentAidNL's INSTANCES of them — which is exactly what this component
 * now renders when it is given the `studentaid` config. The seventh,
 * 6102:103451, is the Driver-and-Vehicle "Success!" frame, which is the
 * already-built /services/driver-vehicle/confirmation/ screen.
 *
 * TWO VISIBLE DIFFERENCES between the master and the StudentAidNL instance, and
 * only ONE of them is reproduced. The list pre-selects Passport rather than
 * Driver's License — that is `defaultDocument`, and it is reproduced. The
 * StudentAidNL CAPTURE screen also draws an empty corner-bracket viewport where
 * the master draws the captured document in a flat grey panel; that one is NOT
 * reproduced, because it is a different set of boxes rather than a config value.
 * See the note on CidCaptureFrontScreen.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata / get_design_context
 * on 6087:31396 and 6087:32267:
 *   top-nav actions    393 x 145        at y=0
 *   Main content       393 x 758        at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header    361 x 121        at y=24    gap-[24px]
 *       wizard-title       361 x 29     at y=0
 *       progress-stepper   361 x 68     at y=53    gap-[8px]
 *         step-bar           361 x 8    at y=0     fill 278.869
 *         step-labels        361 x 18   at y=16    current = Prerequisite Check
 *         sub-step-readout   208 x 26   at y=42    6257:72214
 *     accepted-documents 361 x 536      at y=153   pt-[24px] gap-[24px]
 *       "Accepted documents:" 361 x 27  at y=24    22px Bold #333b40
 *       documents-list     361 x 461    at y=75    gap-[10px]
 *         RadioRow  361 x 52  at y=0    p-[16px] gap-[12px] radius 8
 *         RadioRow  361 x 69  at y=62   (the one with a 12px second line)
 *         RadioRow  361 x 52  at y=141
 *         RadioRow  361 x 52  at y=203
 *         RadioRow  361 x 72  at y=265  (title wraps to two lines)
 *         RadioRow  361 x 52  at y=347
 *         RadioRow  361 x 52  at y=409  SELECTED — 2px #27619b
 *     Frame 6            361 x 37       at y=697
 *       Yoti ContinueButton 361 x 37    at y=0     #27619b, full width
 *   footer verified    393 x 265.810546875 at y=903
 *
 * 24 + 121 + 8 + 536 + 8 + 37 + 24 = 758, and 145 + 758 + 265.81 = 1168.81.
 *
 * NOTE THE MEASURED "SELECTED" ROW IS THE LAST ONE because these numbers were
 * taken off the Driver-and-Vehicle master. On the StudentAidNL instance the 2px
 * #27619b sits on the FIRST row instead; the row heights, gaps and totals are
 * unchanged, because selection is a border colour, not a box.
 *
 * HIDDEN LAYERS NOT RENDERED: `Check box` (6087:31452, 286 x 27 at y=577) and
 * `btn-back` (6087:31455, 361 x 39) are both hidden="true" in Figma. Hidden
 * layers are not part of the design — the same rule CID_TU, CID_Biometric and
 * CID_ID_success already apply to their own `Check box` instances. That is why
 * Continue is the ONLY control on this screen and there is no Back button;
 * reverse navigation is the presenter's ArrowLeft (see src/lib/flow.ts) and
 * the browser's own back button.
 *
 * THE PILL SAYS "step 4 of 5". So does every other CID_ID1 frame in the file,
 * StudentAidNL's included. Reproduced verbatim rather than renumbered.
 *
 * TYPE AND COLOUR. Every text node here is Montserrat on the Yoti ramp, not
 * Lato on the GNL ramp — these are the CertifiO vendor screens inside the GNL
 * wizard. The COLOURS are reproduced verbatim (#333b40 heading, #546072 row
 * label, #4b5563 note, #d1d5db row border, #27619b selection and button), and
 * Montserrat is self-hosted since 2026-09-23.
 *
 * ROW BOX MODEL. Figma draws the row stroke INSIDE the 52px frame (content at
 * x=16 from the outer edge), which a CSS `border` cannot do — it would make the
 * rows 54 and the selected one 56. The stroke is painted with an inset
 * box-shadow, the same way WizardCard, TopNav and the onboard option cards do
 * it, so p-[16px] survives and every row measures exactly as designed.
 *
 * STATIC BY DESIGN. The list is a design reproduction, not a form: no input,
 * no state, no click handler, exactly as /services/driver-vehicle/onboard/
 * handles its own radio cards. Continue advances regardless.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — INVENTED; NOT IN FIGMA.
 *
 * This frame is MOBILE ONLY in Figma (393 wide), like every other CID frame.
 * At and above 768 CidScreen drops the content into the same wizard chrome
 * /services/driver-vehicle/onboard/ uses — see CidScreen for the full
 * provenance note and the CSS-only mechanism. Every `md:` class on this page
 * is part of that invention; nothing else moved.
 *
 * Invented here, specifically:
 *   accepted-documents `md:pt-0` — the 24px top pad is the mobile frame's
 *                        spacing away from wizard-header; inside the card the
 *                        32px card gap does that job and the two would stack.
 *   Frame 6  `md:flex-row md:items-center md:justify-end md:pt-[16px]` with
 *                        `md:w-auto` on the button — a full-width 740px button
 *                        in an 820px card reads as a phone screen stretched.
 *                        It becomes the onboard actions-row instead.
 * The 22px heading, the 16px row labels and the 10px list gap are UNCHANGED at
 * every width.
 * ------------------------------------------------------------------------
 */

/**
 * RadioRow — Figma 6087:32270 et al.
 *
 * `items-center` is the design's, and it is why the two-line rows put the
 * radio at y=24.5 / y=26 rather than at y=16: the circle centres against the
 * whole text block, not against its first line.
 */
function RadioRow({ option }: { option: CidDocumentOption }) {
  return (
    <div
      /*
       * RESTYLED TO THE REAL ROW 2026-09-27. YOTI_OBSERVED.md Y4: "white, full
       * width, rounded (~8 px), 2 PX MUTED BLUE-GREY BORDER, ~54 px tall".
       *
       * So the UNSELECTED row goes from 1px #d1d5db to `YOTI_SIZE.rowBorder`
       * (2) in `YOTI_COLOR.border` (#9ca5b4) and gains `rowMinHeight` (54),
       * which the 16px padding alone did not reach. The SELECTED row keeps its
       * 2px `YOTI_COLOR.button` — see the note in CidDocumentScreen's header on
       * why selection is not removed even though no real screenshot shows it.
       *
       * `minHeight`, not `height`: two of the seven rows are taller than 54
       * because their label wraps or carries a second line, and Figma measures
       * them at 69 and 72. Pinning the height would clip both.
       *
       * STILL AN INSET BOX-SHADOW, NOT A `border` — Figma draws the stroke
       * inside the box, and at 2px a real border would make every row 4px
       * taller and move the whole list.
       *
       * `data-selected` is how scripts/click-through.mjs finds the pre-selected
       * row now. It used to read the Tailwind class name
       * (`inset_0_0_0_2px`), which stopped telling the two states apart the
       * moment BOTH borders became 2px — a check that would have kept passing
       * while measuring nothing.
       */
      className="box-border flex w-full shrink-0 items-center gap-[12px] bg-white p-[16px]"
      style={{
        minHeight: YOTI_SIZE.rowMinHeight,
        borderRadius: YOTI_SIZE.rowRadius,
        boxShadow: `inset 0 0 0 ${YOTI_SIZE.rowBorder} ${
          option.selected ? YOTI_COLOR.button : YOTI_COLOR.border
        }`,
      }}
      data-node-id={option.nodeId}
      data-name="RadioRow"
      data-selected={option.selected ? "true" : undefined}
    >
      <div className="relative size-[20px] shrink-0" data-name="radio-circle">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block size-full max-w-none"
          src={option.selected ? ASSETS.radioCircle20Selected : ASSETS.radioCircle20}
        />
      </div>
      {/* radio-text — flex-[1_0_0] with min-w-px so a long label wraps inside
          the row instead of widening it. gap-[2px] only when there is a note. */}
      <div
        className={`flex min-w-px flex-[1_0_0] flex-col items-start ${
          option.note ? "gap-[2px]" : ""
        }`}
        data-name="radio-text"
      >
        {/*
         * `6087:32275` et al — Montserrat:SemiBold. REAL 600 since 2026-09-23;
         * Montserrat is self-hosted (layout.tsx) and this zone is
         * `.gnl-yoti-zone`, so it is no longer collapsed to Lato 700.
         */}
        {/*
         * The label keeps 16px — `YOTI_TEXT.body`, which the recreation already
         * matched, so this is a re-spelling rather than a change. The WEIGHT
         * drops from SemiBold to regular: YOTI_OBSERVED.md Y4 describes "an
         * empty circle radio … and a REGULAR-WEIGHT dark label".
         */}
        <p
          className="w-full shrink-0 font-normal leading-[normal] [word-break:break-word]"
          style={{ fontSize: YOTI_TEXT.body, color: YOTI_COLOR.muted }}
        >
          {option.label}
        </p>
        {option.note && (
          <p className="w-full shrink-0 text-[12px] font-normal leading-[normal] text-[#4b5563] [word-break:break-word]">
            {option.note}
          </p>
        )}
      </div>
    </div>
  );
}

export function CidDocumentScreen({ service }: { service: ServiceConfig }) {
  const { document: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="6087:31398" subStep={copy.subStep} yotiZone>
      {/* accepted-documents — 6087:32267 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[24px] pt-[24px] md:pt-0"
        data-node-id="6087:32267"
        data-name="accepted-documents"
      >
        {/*
         * RAISED 2026-09-27: 22px -> `YOTI_TEXT.listTitle` (20px)?  No — this
         * one goes the other way and the token says so: §6 gives
         * "Accepted documents:" its own `listTitle` value of 20px, below the
         * 24px heading scale and below Tatyana's 22. YOTI_OBSERVED.md Y4 places
         * it as "bold, dark, LARGER THAN THE ROW LABELS" (16px) and says
         * nothing stronger. The token is the authority; logged as an open
         * question with Y1's heading, which moves the same way.
         */}
        <p
          className="w-full shrink-0 font-bold leading-[normal] [word-break:break-word]"
          style={{ fontSize: YOTI_TEXT.listTitle, color: YOTI_COLOR.ink }}
          data-node-id="6087:32268"
        >
          {copy.title}
        </p>

        {/*
         * documents-list — 6087:32269. Gap raised 10 -> `YOTI_SIZE.rowGap`
         * (15): YOTI_OBSERVED.md Y4, "Generous gap between rows (~15 px): they
         * read as separate cards, not a joined list."
         */}
        <div
          className="flex w-full shrink-0 flex-col items-start"
          style={{ gap: YOTI_SIZE.rowGap }}
          data-node-id="6087:32269"
          data-name="documents-list"
        >
          {copy.options.map((option) => (
            <RadioRow key={option.nodeId} option={option} />
          ))}
        </div>
      </div>

      {/*
       * Frame 6 — 6087:31453, REPLACED BY THE PINNED BAR 2026-09-27. Same
       * change and same reasoning as on Y1; see the long note on
       * CidLivenessScreen. The destination is unchanged: /cid/capture-intro/,
       * this service's copy of it.
       */}
      <YotiActionBar>
        <YotiContinue href={routes.captureIntro}>
          {actions.continueShort}
        </YotiContinue>
      </YotiActionBar>
    </CidScreen>
  );
}
