import Link from "next/link";

import { CameraViewport } from "@/components/cid/CameraViewport";
import { CidScreen } from "@/components/cid/CidScreen";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { ASSETS } from "@/lib/assets";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";

/*
 * CID_Biometric (liveness, capture) — Figma 6217:65271, 393 x 1231.810546875.
 *
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. /cid/liveness-capture/ (Flow A) and
 * /cid/studentaid/liveness-capture/ (Flow B, §9 PP-13 = 6217:66070, "reuse").
 * Both the Back link and the Continue button resolve against the SAME service's
 * route set, so neither flow can leak into the other mid-scan.
 *
 * ADDED 2026-09-23 with /cid/liveness/ (6217:65268). The second half of the
 * missing step 3: the face scan itself. Both frames carry
 * `Liveness check • step 3 of 5` verbatim and are the only two nodes in the
 * file that display it — see the header on CidLivenessScreen for why they were
 * invisible to earlier audits (both are named `CID_Biometric`, the same name as
 * the built consent screen 6217:62835) and for the canvas evidence that puts
 * them between step 2 and step 4.
 *
 * A 393 CID SCREEN, so it uses CidScreen. Below 768 that renders the Figma
 * mobile frame unchanged; at 768 and up it drops this content into the desktop
 * wizard chrome, which is INVENTED — see CidScreen for the full provenance note.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata on 6217:65271 and
 * get_design_context on 6056:14036:
 *   top-nav actions      393 x 145           at y=0        (6056:14024)
 *   Main content         393 x 821           at y=145      px-[16px] py-[24px] gap-[8px]
 *     wizard-header      361 x 121           at y=24       gap-[24px]
 *       wizard-title     361 x  29           at y=0
 *       progress-stepper 361 x  68           at y=53       gap-[8px]
 *         step-bar       361 x   8           at y=0        fill 278.869
 *         step-labels    361 x  18           at y=16       current = Prerequisite Check
 *         sub-step-readout 167 x 26          at y=42       6257:72196  <- THE PILL
 *     Frame 5            361 x 599           at y=153      py-[24px]
 *       Frame 10         361 x 551           at y=24       px-[8px] gap-[12px]
 *         Yoti_back      55.9609375 x 17     at y=0        gap-[7px] items-center
 *           image 19     11.961 x 16.053     at x=0
 *           "Back"       ~37 x 17            14.054px Bold #546072
 *         Frame 9        345 x 522           at y=29       bg #e9ebe8, px-[12px],
 *                                                          gap-[65px], items-center,
 *                                                          justify-center
 *           Frame 7      321 x  51           at y=71.47107  bg white, p-[8px], radius 8
 *             heading  264 x 17              at x=28.5, y=17  14.054px Bold #546072
 *           Group 6      193.27098 x 263.05786  at y=187.47107
 *     Yoti ContinueButton 361 x 37           at y=760      #27619b, full width
 *   footer verified      393 x 265.810546875 at y=966      (6056:14087)
 *
 * The sums close exactly:
 *   Frame 10   17 + 12 + 522                        = 551
 *   Frame 5    24 + 551 + 24                        = 599
 *   Main       24 + 121 + 8 + 599 + 8 + 37 + 24     = 821
 *   Frame     145 + 821 + 265.810546875             = 1231.810546875
 *
 * AND THE TWO OFFSETS INSIDE Frame 9 ARE PRODUCED, NOT HARDCODED. Frame 9 is a
 * 522px column with `justify-center` holding 51 + 65 + 263.05786 = 379.05786 of
 * content, so the pill lands at (522 - 379.05786) / 2 = 71.47107 and the face
 * guide at 71.47107 + 51 + 65 = 187.47107 — exactly the measured values. The
 * centring does it; there is no magic number in this file.
 *
 * THIS SCREEN HAS A REAL BACK CONTROL, and it is the only Yoti screen in the run
 * that does. `Yoti_back` (6217:65270, an instance of 6076:31385) is a VISIBLE
 * component, not one of the hidden `btn-back` layers that /cid/country/,
 * /cid/document/ and /cid/capture-intro/ carry. It points one step back, at the
 * liveness prepare screen — the only thing "Back" above a live camera viewport
 * can mean, and it makes that screen reachable backwards by an on-screen control
 * rather than only by ArrowLeft.
 *
 * THE CONTINUE BUTTON IS NOT IN A `Frame 6`. On this frame 6076:31364 is a
 * DIRECT child of `Main content` at y=760, where every other CID frame wraps it
 * in a `Frame 6` flex row. Reproduced as drawn — that is why the markup below
 * puts BtnPrimary straight into CidScreen's children with no wrapper, and why
 * its desktop alignment classes sit on the button itself.
 *
 * HIDDEN LAYER NOT RENDERED: `Check box` (6056:14081, 286 x 27 at y=577) is
 * hidden="true" in Figma, as on every other CID frame.
 *
 * TYPE AND COLOUR. Montserrat on the Yoti ramp: both text nodes are
 * Montserrat:Bold at 14.054px in `Yoti gris` #546072, and the viewport fill is
 * #e9ebe8. COLOURS and the odd 14.054px size are verbatim. Both are
 * `leading-[normal]` (~1.2), which is what makes the 14.054px label a 17px line
 * box, NOT Tailwind's `leading-normal` (1.5) — that would make it 21 and break
 * Frame 10's measured 551.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * THE VIEWPORT IS A LIVE CAMERA PREVIEW, FRONT-FACING.
 *
 * Figma draws `Frame 9` as a flat #e9ebe8 panel with the instruction pill and
 * the face guide floating on it — i.e. a camera viewport with its feed not yet
 * running. The component that already exists for exactly this,
 * src/components/cid/CameraViewport, is REUSED here rather than reimplemented,
 * per the same user request that put it on the two ID-capture screens
 * ("regrading the photo vierication and id, can we make open the camera so it
 * will more attractive to show").
 *
 * FRONT CAMERA, NOT REAR — `facingMode="user"`. The two ID-capture screens
 * photograph a document and ask for `environment`; this one scans the holder's
 * own face, and the design says so out loud on the screen before it ("Hold your
 * phone at eye level", over a drawing of a selfie). It is a PROP on the shared
 * component, not a second copy of it. Always `ideal`, never `exact`: the dry
 * run happens on a laptop, which has only a front camera, and an `exact`
 * constraint in either direction would throw OverconstrainedError and lose the
 * feed. See the prop's note in CameraViewport.
 *
 * THE FALLBACK IS THE FIGMA RENDER ITSELF. CameraViewport is given `null` for
 * its mock `children` on purpose: when the camera is denied, missing, busy,
 * forced off with `?mock=1`, or on an insecure origin, this screen falls back to
 * the flat #e9ebe8 panel with the pill and the face guide — which IS the design,
 * exactly as drawn. The other two screens need a mock image because Figma draws
 * a captured document in their panel; this one does not.
 *
 * THE PILL AND THE FACE GUIDE STAY PUT IN BOTH STATES. They are `relative`
 * siblings that follow the `absolute inset-0` video in DOM order, so they paint
 * above it, and they are in normal flow, so the panel's measured centring
 * produces their positions whether the feed is running or not. The video is
 * `object-cover` inside `inset-0`, so it cannot change the 522px box.
 *
 * NOT MIRRORED. A selfie preview is conventionally flipped horizontally, and it
 * would probably read better on stage — but Figma does not draw a mirror and
 * this build does not invent one. Flagged in design/token-exceptions.md as a
 * question for Tatyana rather than decided here.
 *
 * NOTHING IS CAPTURED. No frame is read, drawn to a canvas, stored or uploaded;
 * there is no backend and no network call. Continue just advances. Video only,
 * never audio. Verified by `npm run camera`.
 * ------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — INVENTED; NOT IN FIGMA.
 *
 * Mobile-only frame, like every CID frame; at and above 768 CidScreen drops the
 * content into the onboard page's wizard chrome. Every `md:` class below is
 * part of that invention.
 *
 *   Frame 5  `md:py-0` — the 24px pads are the mobile frame's spacing to the
 *                        header and to the button; the card's own 32px gap does
 *                        that at desktop and the two would stack to 56.
 *   Frame 7  `md:max-w-[321px]` — the pill keeps its MEASURED width instead of
 *                        stretching to the 716px interior of an 820px card. A
 *                        full-bleed pill around 264px of centred text reads as
 *                        a phone screen pulled sideways. Frame 9 is already
 *                        `items-center`, so the cap centres it with no extra
 *                        rule, and at 393 the cap is above the 321px the design
 *                        gives it and therefore inert.
 *   Continue `md:self-end md:w-auto` — the onboard actions-row position. It is
 *                        `self-end` rather than a `md:justify-end` on a parent
 *                        because, uniquely on this frame, the button HAS no
 *                        parent row (see above); the effect matches the other
 *                        Yoti screens exactly.
 *
 * Frame 9 keeps its measured 522px height and full width at every breakpoint,
 * the same way /cid/capture-front/ keeps its 400px panel.
 *
 * ONE RELAXATION BELOW THE DESIGN WIDTH: the pill's label is
 * `whitespace-nowrap` in Figma, where 264px of text sits inside the 305px pill
 * interior at 393. At 320 that interior is 232px, so the label is released to
 * wrap at `max-xxs:` — below 384, i.e. below the CID canvas width, never at 393
 * itself. `max-xxs`, NOT `max-xs`: 393 is these screens' untouchable design
 * width and a `max-xs:` rule (< 480) would fire on it and move the mobile
 * baseline. Same relaxation, same reasoning, as the select label on
 * /cid/country/.
 * ------------------------------------------------------------------------
 */
export function CidLivenessCaptureScreen({ service }: { service: ServiceConfig }) {
  const { livenessCapture: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="6056:14025" subStep={copy.subStep} yotiZone>
      {/* Frame 5 — 6056:14036 */}
      <div
        className="flex w-full shrink-0 flex-col items-start py-[24px] md:py-0"
        data-node-id="6056:14036"
      >
        {/* Frame 10 — 6076:31255. The 8px side padding is the design's. */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[12px] px-[8px]"
          data-node-id="6076:31255"
        >
          {/*
           * Yoti_back — 6217:65270, an instance of 6076:31385.
           *
           * YOTI-OWNED CONTROL — NOT A GNL COMPONENT. In production this whole
           * step is rendered by the identity provider inside GNL chrome: GNL
           * supplies the top nav, wizard header, stepper and footer; Yoti
           * supplies this control, the viewport and the Continue button. Its
           * #546072 label is `Yoti gris`; do not fold it into the GNL
           * BtnOutline or restyle it to the GNL palette.
           *
           * A REAL, LIVE CONTROL with an explicit destination — one step back,
           * to this service's liveness prepare screen. It is the only visible
           * Back anywhere in the Yoti run and it is asserted in both directions
           * by scripts/click-through.mjs at 1440 / 768 / 390.
           */}
          <Link
            href={routes.liveness}
            className="flex shrink-0 items-center gap-[7px]"
            data-node-id="6217:65270"
            data-name="Yoti_back"
          >
            {/* image 19 — 6076:31257. YOTI-OWNED ARTWORK; placeholder. */}
            <div className="relative h-[16.053px] w-[11.961px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none object-cover"
                src={ASSETS.iconYotiBack}
              />
            </div>
            {/* Montserrat:Bold. 14.054px is Figma's. */}
            <p
              className="shrink-0 text-[14.054px] font-bold leading-[normal] whitespace-nowrap text-[#546072]"
              data-node-id="6076:31258"
            >
              {copy.backLabel}
            </p>
          </Link>

          {/*
           * Frame 9 — 6076:31259. The camera viewport.
           *
           * YOTI-OWNED SURFACE. `relative` is Figma's own and is also what the
           * `absolute inset-0` video needs; the measured height, fill, padding,
           * 65px gap and centring are all the design's.
           */}
          <div
            className="relative flex h-[522px] w-full shrink-0 flex-col items-center justify-center gap-[65px] bg-[#e9ebe8] px-[12px]"
            data-node-id="6076:31259"
            data-name="liveness-viewport"
          >
            {/*
             * The live front-facing preview. `children` is null on purpose —
             * the fallback IS the panel behind it, which is what Figma draws.
             * See the header.
             */}
            <CameraViewport facingMode="user">{null}</CameraViewport>

            {/*
             * Frame 7 — 6076:31260. The instruction pill, INSIDE the viewport,
             * which is where the design puts it. `relative` so it paints above
             * the absolutely-positioned video.
             */}
            <div
              className="relative flex h-[51px] w-full shrink-0 items-center justify-center rounded-[8px] bg-white p-[8px] md:max-w-[321px]"
              data-node-id="6076:31260"
            >
              <p
                className="shrink-0 text-[14.054px] font-bold leading-[normal] whitespace-nowrap text-[#546072] max-xxs:whitespace-normal"
                data-node-id="6076:31261"
              >
                {copy.title}
              </p>
            </div>

            {/*
             * Group 6 — 6076:31262. The face-position guide.
             *
             * YOTI-OWNED ARTWORK; placeholder. The box is the group's measured
             * size and the image is placed at `inset-[-0.76%_-1.03%]` because
             * Figma draws the stroke overflowing the group by ~2px on each
             * side. Reproduced verbatim — the asset's natural size is the
             * overflowed one, so a real export drops in with no layout change.
             * See src/lib/assets.ts.
             */}
            <div
              className="relative h-[263.057861328125px] w-[193.27098083496094px] shrink-0"
              data-node-id="6076:31262"
              data-name="Group 6"
            >
              <div className="absolute inset-[-0.76%_-1.03%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="block size-full max-w-none"
                  src={ASSETS.livenessFaceGuide}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*
       * Yoti ContinueButton — 6076:31364.
       *
       * NO `Frame 6` WRAPPER. Unique to this frame: Figma makes the button a
       * direct child of `Main content` at y=760. Reproduced, which is why the
       * desktop alignment lives on the button itself rather than on a row.
       *
       * YOTI-OWNED CONTROL — NOT A GNL COMPONENT. An instance of
       * `Yoti ContinueButton` (6076:31361); its #27619b fill is the Yoti CTA
       * blue, not the GNL navy #243746. Reproduce it, do not harmonise it.
       * See design/verification-frame-map.md §7.
       */}
      <BtnPrimary
        href={routes.country}
        tone="yoti"
        nodeId="6076:31364"
        className="w-full md:mt-[16px] md:w-auto md:self-end"
      >
        {actions.continueShort}
      </BtnPrimary>
    </CidScreen>
  );
}
