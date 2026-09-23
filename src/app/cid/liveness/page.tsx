import { CidScreen } from "@/components/cid/CidScreen";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { ASSETS } from "@/lib/assets";
import { CID_ACTIONS, CID_LIVENESS, type CidLivenessTip } from "@/lib/data/cid";

/*
 * CID_Biometric (liveness, prepare) — Figma 6217:65268, 393 x 1282.44091796875.
 *
 * ADDED 2026-09-23. THE MISSING STEP 3. Together with /cid/liveness-capture/
 * (6217:65271) this closes the hole that made the demo's sub-step pill run
 * 1 → 2 → 4 → 4 → 4 → 4 → 4 → 5 on stage. Both frames carry
 * `Liveness check • step 3 of 5` verbatim, and they are the ONLY two nodes in
 * the file that display "step 3 of 5" — which is exactly what
 * design/verification-frame-map.md §12 raised as open conflict C4 ("is a screen
 * missing, or should the stepper read 'of 4'?"). It was a missing screen, twice.
 *
 * WHY IT WAS MISSED FOR SO LONG. The frame is named `CID_Biometric` — the same
 * name as the already-built consent screen 6217:62835 — so a name-based search
 * walks straight past it. It is told apart by size (1282.441 vs 834.811), by
 * position (the `Yoti` section at y=779, x=44.87, not Row B at y=3563) and by
 * its heading.
 *
 * IT IS CURRENT, NOT AN ABANDONED SKETCH. It has a live instance in the
 * parallel StudentAidNL journey at the matching position (6217:66069), and the
 * master/instance height delta matches the other CID screens on that row.
 *
 * WHERE IT SITS. First in the Yoti cluster, BEFORE `CID_ID1_Country`
 * (x=1076.87), and the Yoti cluster's x-order is flow order — the same rule
 * that ordered every other screen in this build. So biometric consent (step 2)
 * → here → /cid/liveness-capture/ → /cid/country/ (step 4). `/cid/biometric/`'s
 * "I agree" was re-pointed from /cid/country/ to here in the same change.
 *
 * A 393 CID SCREEN, so it uses CidScreen. Below 768 that renders the Figma
 * mobile frame unchanged; at 768 and up it drops this content into the desktop
 * wizard chrome, which is INVENTED — see CidScreen for the full provenance note
 * and the CSS-only breakpoint mechanism.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata on 6217:65268 and
 * get_design_context on 6056:13104:
 *   top-nav actions      393 x 145           at y=0        (6056:13092)
 *   Main content         393 x 871.63043     at y=145      px-[16px] py-[24px] gap-[8px]
 *     wizard-header      361 x 121           at y=24       gap-[24px]
 *       wizard-title     361 x  29           at y=0
 *       progress-stepper 361 x  68           at y=53       gap-[8px]
 *         step-bar       361 x   8           at y=0        fill 278.869
 *         step-labels    361 x  18           at y=16       current = Prerequisite Check
 *         sub-step-readout 167 x 26          at y=42       6257:72187  <- THE PILL
 *     Frame 5            361 x 649.63043     at y=153      py-[24px]
 *       Frame 13         361 x 601.63043     at y=24       px-[8px] gap-[16px]
 *         heading        345 x  78           at y=0        32px Bold #333b40, 2 lines
 *         illustration-frame 345 x 345.63043 at y=94       radius 16, overflow-clip
 *         instructions-list  345 x 146       at y=455.63043  gap-[16px]
 *           InstructionRow 345 x 40          at y=0        gap-[16px] items-center
 *           InstructionRow 345 x 40          at y=56
 *           InstructionRow 345 x 34          at y=112
 *     Frame 6            361 x  37           at y=810.63043
 *       Yoti ContinueButton 361 x 37         at y=0        #27619b, full width
 *   footer verified      393 x 265.810546875 at y=1016.63043  (6056:13136)
 *
 * The sums close exactly:
 *   Frame 13   78 + 16 + 345.63043 + 16 + 146           = 601.63043
 *   Frame 5    24 + 601.63043 + 24                      = 649.63043
 *   Main       24 + 121 + 8 + 649.63043 + 8 + 37 + 24   = 871.63043
 *   Frame     145 + 871.63043 + 265.810546875           = 1282.44098
 *
 * THE PILL IS 167 WIDE, not the 184-208 the other CID frames carry — "Liveness
 * check" is simply a shorter label than "ID document selection". It is not a
 * different component; SubStepReadout sizes itself from its content.
 *
 * ILLUSTRATION BOX MODEL. `illustration-frame` (6056:13912) is a `w-full`
 * rounded-16 clip and its child (6076:31212) carries
 * `aspect-[361/361.65966796875]`, so the 345px content column makes it
 * 345 x 345.63043 on its own — the height is PRODUCED by the aspect ratio, not
 * hardcoded, exactly as /cid/capture-front/ produces its 204.111.
 *
 * ALL THREE ROWS ARE `items-center`. This is the one place this screen differs
 * structurally from the `Guidelines Card` on /cid/capture-intro/, where Figma
 * sets alignment per row and that is load-bearing for the card height. Here it
 * is uniform, so there is no per-row `align` to carry — and the row heights
 * still differ (40 / 40 / 34) purely because the first two labels wrap to two
 * lines at 14px/1.4 and the third does not.
 *
 * HIDDEN LAYER NOT RENDERED: `Check box` (6056:13130, 286 x 27 at y=577) is
 * hidden="true" in Figma, the same as on every other CID frame. Hidden layers
 * are not part of the design. `Frame 6` holds the Continue button and nothing
 * else — there is NO Back button on this frame, so Continue is the only
 * control and the reverse move is the presenter's ArrowLeft (src/lib/flow.ts)
 * and the browser's back button. (The NEXT screen does have a real Back, which
 * points here — so this screen is reachable backwards from there.)
 *
 * TYPE AND COLOUR. Montserrat on the Yoti ramp — `Yoti app` #333b40 for the
 * heading, `Yoti gris` #546072 for the three labels. COLOURS verbatim. The
 * TYPEFACE renders in Lato: Montserrat is not self-hosted here and both font
 * hosts are blocked by the proxy. Montserrat:Bold maps to Lato 700 and
 * Montserrat:MEDIUM — which is new on these two frames, and which Lato also
 * does not ship — maps to Lato 400. Logged in design/token-exceptions.md.
 *
 * The heading is `leading-[normal]` (~1.2, giving the measured 39px lines and
 * the 78px two-line block), NOT Tailwind's `leading-normal` (1.5). Figma says
 * normal. The labels are `leading-[1.4]`, which Figma states as a number.
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
 *   Frame 5  `md:py-0` — the 24px pads are the mobile frame's spacing away from
 *                        wizard-header above and Frame 6 below. Inside the card
 *                        the 32px card gap does both jobs and the two would
 *                        stack to 56. Same treatment as every CID sibling.
 *   illustration-frame `md:max-w-[480px]` — the ONE invented box on this page.
 *                        The illustration is `w-full` at a fixed aspect, so in
 *                        an 820px card its content column is 740px and the
 *                        picture would render 741px tall: a single decorative
 *                        drawing taller than the entire phone frame, pushing
 *                        Continue below the fold on a laptop. Capped at 480 and
 *                        left-aligned, which is where the mobile `items-start`
 *                        already puts it, so nothing moves at 393. The same
 *                        problem /cid/capture-front/ solved with
 *                        `md:max-w-[644px]`; the number differs because that
 *                        panel has a measured height to fit inside and this one
 *                        does not.
 *   Frame 6  `md:flex-row md:items-center md:justify-end md:pt-[16px]` with
 *                        `md:w-auto` on the button — lifted verbatim from
 *                        /cid/country/ and /cid/capture-intro/ so every Yoti
 *                        screen puts its Continue in the same place.
 *
 * The 32px heading, the 16px gaps and all three instruction rows are UNCHANGED
 * at every width. At 320 the labels simply wrap to more lines inside rows that
 * are already `flex-[1_0_0] min-w-px`, so nothing needed a `max-xxs:`
 * relaxation — the same result /cid/capture-intro/ reported for its card.
 * ------------------------------------------------------------------------
 */

/**
 * InstructionRow — Figma 6056:13915 / 6056:13920 / 6056:13925.
 *
 * Uniform `items-center` on all three (see the note above). The icon box is
 * pinned to the exact 34px leaf size and the label takes the rest with
 * `flex-[1_0_0] min-w-px`, so a long label wraps inside the row instead of
 * widening it.
 *
 * YOTI-OWNED ROW — these steps are provider-rendered inside GNL chrome in
 * production: GNL supplies the top nav, wizard header, stepper and footer;
 * Yoti supplies this body and the Continue button below it.
 */
function InstructionRow({ tip }: { tip: CidLivenessTip }) {
  return (
    <div
      className="flex w-full shrink-0 items-center gap-[16px]"
      data-node-id={tip.nodeId}
      data-name="InstructionRow"
    >
      {/* YOTI-OWNED ARTWORK — placeholder; see src/lib/assets.ts. */}
      <div className="relative size-[34px] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute inset-0 block size-full max-w-none"
          src={ASSETS[tip.icon]}
        />
      </div>
      {/* Montserrat:Medium — Lato ships no 500, so this renders at 400. */}
      <p className="min-w-px flex-[1_0_0] text-[14px] font-normal leading-[1.4] text-[#546072] [word-break:break-word]">
        {tip.text}
      </p>
    </div>
  );
}

export default function CidLivenessPage() {
  return (
    <CidScreen mainNodeId="6056:13093" subStep={CID_LIVENESS.subStep}>
      {/* Frame 5 — 6056:13104 */}
      <div
        className="flex w-full shrink-0 flex-col items-start py-[24px] md:py-0"
        data-node-id="6056:13104"
      >
        {/* Frame 13 — 6087:31395. The 8px side padding is the design's. */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[16px] px-[8px]"
          data-node-id="6087:31395"
        >
          <p
            className="w-full shrink-0 text-[32px] font-bold leading-[normal] text-[#333b40] [word-break:break-word]"
            data-node-id="6056:13105"
          >
            {CID_LIVENESS.title}
          </p>

          {/*
           * illustration-frame — 6056:13912.
           *
           * YOTI-OWNED ARTWORK. `md:max-w-[480px]` is the one INVENTED box on
           * this page; see the header for why an uncapped `w-full` fixed-aspect
           * drawing bursts the desktop card.
           *
           * NO CAMERA HERE. This screen only shows what is about to happen —
           * it is a drawing. The live preview belongs to the NEXT screen.
           */}
          <div
            className="flex w-full shrink-0 flex-col items-center justify-center overflow-clip rounded-[16px] md:max-w-[480px]"
            data-node-id="6056:13912"
            data-name="illustration-frame"
          >
            {/*
             * 6076:31212. The height is produced by the aspect ratio — at the
             * 345px content column that is 345.63043, the measured value.
             */}
            <div
              className="relative w-full shrink-0 aspect-[361/361.65966796875]"
              data-node-id="6076:31212"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={ASSETS.livenessIllustration}
              />
            </div>
          </div>

          {/*
           * instructions-list — 6056:13914.
           *
           * YOTI-OWNED BLOCK — NOT A GNL COMPONENT. The identity provider's own
           * liveness guidance, rendered by Yoti inside GNL chrome in
           * production. The #546072 type is `Yoti gris`, which is not in the
           * GNL token set; do not restyle it to the GNL palette.
           * See design/verification-frame-map.md §7.
           */}
          <div
            className="flex w-full shrink-0 flex-col items-start gap-[16px]"
            data-node-id="6056:13914"
            data-name="instructions-list"
          >
            {CID_LIVENESS.tips.map((tip) => (
              <InstructionRow key={tip.nodeId} tip={tip} />
            ))}
          </div>
        </div>
      </div>

      {/* Frame 6 — 6056:13131 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[8px] md:flex-row md:items-center md:justify-end md:pt-[16px]"
        data-node-id="6056:13131"
      >
        {/*
         * YOTI-OWNED CONTROL — NOT A GNL COMPONENT.
         *
         * Figma 6217:65267 is an instance of `Yoti ContinueButton`
         * (6076:31361), the same second primary button every other Yoti screen
         * in this run carries. Its #27619b fill is the Yoti CTA blue, not the
         * GNL navy #243746 — deliberate, not drift. Reproduce its appearance;
         * do not fold it into the shared GNL primary and do not "fix" its
         * colour to match the rest of the wizard. `tone="yoti"` on BtnPrimary
         * exists for exactly this.
         *
         * It is the ONLY control on this screen — `Check box` (6056:13130) is
         * hidden and there is no Back — so if it is dead the flow stops here.
         * scripts/click-through.mjs asserts this hop at all three widths.
         */}
        <BtnPrimary
          href="/cid/liveness-capture/"
          tone="yoti"
          nodeId="6217:65267"
          className="w-full md:w-auto"
        >
          {CID_ACTIONS.continueShort}
        </BtnPrimary>
      </div>
    </CidScreen>
  );
}
