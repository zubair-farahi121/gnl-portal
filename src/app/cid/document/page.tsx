import { CidScreen } from "@/components/cid/CidScreen";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { ASSETS } from "@/lib/assets";
import { CID_ACTIONS, CID_DOCUMENT, type CidDocumentOption } from "@/lib/data/cid";

/*
 * CID_ID1 (ID document selection) — Figma 6087:31396, 393 x 1168.810546875.
 *
 * ADDED 2026-09-22. This screen and the two capture screens after it were the
 * flow the demo was missing: the wizard ran Terms (step 1 of 5) -> Biometric
 * consent (step 2 of 5) -> Identity verified (step 5 of 5) with the actual
 * identity verification — the centrepiece — absent.
 *
 * WHICH FRAME THIS IS. Seven frames in the file are named `CID_ID1` or
 * `CID_ID1_Front camera`. Three of them are OURS, on the y=779 row, and their
 * `wizard-title` reads "Driver and Vehicle":
 *   6087:31396  ID document selection   393 x 1168.81   <- this file
 *   6056:19118  Capture ID document (front)  393 x 1174.81
 *   6057:20924  Capture ID document (back)   393 x 1174.81
 * Three more sit on the y=2341 row (6217:66072 / 6217:76798 / 6217:66154) and
 * are StudentAidNL's — a different service journey, NOT used here. The
 * seventh, 6102:103451, is the Driver-and-Vehicle "Success!" frame, which is
 * the already-built /services/driver-vehicle/confirmation/ screen.
 *
 * Two visible differences confirm the split beyond the title: StudentAidNL's
 * list pre-selects Passport, ours pre-selects Driver's License; and
 * StudentAidNL's capture screen draws an empty corner-bracket viewport where
 * ours draws the captured document in a flat grey panel.
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
 * HIDDEN LAYERS NOT RENDERED: `Check box` (6087:31452, 286 x 27 at y=577) and
 * `btn-back` (6087:31455, 361 x 39) are both hidden="true" in Figma. Hidden
 * layers are not part of the design — the same rule CID_TU, CID_Biometric and
 * CID_ID_success already apply to their own `Check box` instances. That is why
 * Continue is the ONLY control on this screen and there is no Back button;
 * reverse navigation is the presenter's ArrowLeft (see src/lib/flow.ts) and
 * the browser's own back button.
 *
 * THE PILL SAYS "step 4 of 5", NOT "step 3 of 5". So does every other CID_ID1
 * frame in the file, StudentAidNL's included. No frame anywhere reads
 * "step 3 of 5", so the demo's sub-step counter runs 1 -> 2 -> 4 -> 4 -> 4 -> 5.
 * Reproduced verbatim rather than renumbered; logged in
 * design/token-exceptions.md as an open question for Tatyana.
 *
 * TYPE AND COLOUR. Every text node here is Montserrat on the Yoti ramp, not
 * Lato on the GNL ramp — these are the CertifiO vendor screens inside the GNL
 * wizard. The COLOURS are reproduced verbatim (#333b40 heading, #546072 row
 * label, #4b5563 note, #d1d5db row border, #27619b selection and button). The
 * TYPEFACE is not: Montserrat is not self-hosted in this project and both the
 * Figma and Google font hosts are blocked by the proxy, so it renders in Lato,
 * with Montserrat:Bold and Montserrat:SemiBold both mapped to Lato 700 and
 * Montserrat:Regular to 400. Logged in design/token-exceptions.md.
 *
 * ROW BOX MODEL. Figma draws the row stroke INSIDE the 52px frame (content at
 * x=16 from the outer edge), which a CSS `border` cannot do — it would make
 * the rows 54 and the selected one 56. The stroke is painted with an inset
 * box-shadow, the same way WizardCard, TopNav and the onboard option cards do
 * it, so p-[16px] survives and every row measures exactly as designed.
 *
 * STATIC BY DESIGN. The list is a design reproduction, not a form: no input,
 * no state, no click handler, exactly as /services/driver-vehicle/onboard/
 * handles its own radio cards. Driver's License is pre-selected because that
 * is what the frame shows. Continue advances regardless.
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
      className={`box-border flex w-full shrink-0 items-center gap-[12px] rounded-[8px] bg-white p-[16px] ${
        option.selected
          ? "shadow-[inset_0_0_0_2px_#27619b]"
          : "shadow-[inset_0_0_0_1px_#d1d5db]"
      }`}
      data-node-id={option.nodeId}
      data-name="RadioRow"
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
        <p className="w-full shrink-0 text-[16px] font-bold leading-[normal] text-[#546072] [word-break:break-word]">
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

export default function CidDocumentPage() {
  return (
    <CidScreen mainNodeId="6087:31398" subStep={CID_DOCUMENT.subStep}>
      {/* accepted-documents — 6087:32267 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[24px] pt-[24px] md:pt-0"
        data-node-id="6087:32267"
        data-name="accepted-documents"
      >
        <p
          className="w-full shrink-0 text-[22px] font-bold leading-[normal] text-[#333b40] [word-break:break-word]"
          data-node-id="6087:32268"
        >
          {CID_DOCUMENT.title}
        </p>

        {/* documents-list — 6087:32269 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[10px]"
          data-node-id="6087:32269"
          data-name="documents-list"
        >
          {CID_DOCUMENT.options.map((option) => (
            <RadioRow key={option.nodeId} option={option} />
          ))}
        </div>
      </div>

      {/* Frame 6 — 6087:31453 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[8px] md:flex-row md:items-center md:justify-end md:pt-[16px]"
        data-node-id="6087:31453"
      >
        {/*
         * YOTI-OWNED CONTROL — NOT A GNL COMPONENT.
         *
         * Figma 6087:31454 is an instance of `Yoti ContinueButton`
         * (6076:31361), a second primary button that exists only on the four
         * ID-document frames. In production this step is rendered by the
         * identity provider inside GNL chrome: GNL supplies the top nav, the
         * wizard header, the stepper and the footer; Yoti supplies the body
         * and THIS button. Its #27619b fill is the Yoti CTA blue, not the
         * GNL navy #243746 — the two are deliberate, not drift.
         *
         * So: reproduce its appearance, do not fold it into the GNL primary,
         * and do not "fix" its colour to match the rest of the wizard. The
         * `tone="yoti"` variant on BtnPrimary exists for exactly this reason.
         * See design/verification-frame-map.md §7.
         */}
        {/*
         * RE-POINTED 2026-09-22 from /cid/capture-front/ to
         * /cid/capture-intro/ (Figma 6217:66055), the capture-instruction
         * screen that was gap G2 / conflict C2 in the frame map — it was known
         * to exist but had no addressable node id until now. It is step 4b and
         * sits between this screen and the front capture.
         */}
        <BtnPrimary
          href="/cid/capture-intro/"
          tone="yoti"
          nodeId="6087:31454"
          className="w-full md:w-auto"
        >
          {CID_ACTIONS.continueShort}
        </BtnPrimary>
      </div>
    </CidScreen>
  );
}
