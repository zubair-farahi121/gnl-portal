import { CameraViewport } from "@/components/cid/CameraViewport";
import { CidScreen } from "@/components/cid/CidScreen";
import { YotiActionBar, YotiContinue } from "@/components/cid/yoti/YotiChrome";
import { ASSETS } from "@/lib/assets";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { YOTI_COLOR, YOTI_TEXT } from "@/lib/data/yoti-tokens";

/*
 * CID_ID1 (capture, back) — Figma 6057:20924, 393 x 1174.810546875.
 *
 * ====================================================================
 * ONE ROUTE TODAY, NOT TWO — 2026-09-23, and this is the deliberate exception.
 *
 * Every other CID screen component is rendered by both /cid/<screen>/ and
 * /cid/[serviceId]/<screen>/. This one is rendered by /cid/capture-back/ and by
 * nothing else, because §9 says of PP-09..PP-19: "**no back capture**" — a
 * passport has one page to photograph. `captureSides: ['front']` on
 * `studentaid` is that sentence in the config, and it is honoured twice:
 *
 *   - the capture-FRONT screen reads it and links straight to step 5, so Flow B
 *     never reaches this screen (see CidCaptureFrontScreen);
 *   - `cidBackCaptureParams` in src/lib/data/service-config.ts reads it and
 *     returns no params, so /cid/studentaid/capture-back/ is never generated.
 *
 * The component is still parameterised, so a third service with a two-sided
 * document would get its copy of this screen with no edit here. It is simply
 * that today exactly one service has one.
 * ====================================================================
 *
 * ADDED 2026-09-22. The last of the three Driver-and-Vehicle `CID_ID1` frames;
 * see CidDocumentScreen for how they were told apart from StudentAidNL's three.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata / get_design_context
 * on 6057:20924 and 6057:20937. Box for box this frame is /cid/capture-front/
 * — same 764px Main content, same 542px Frame 5, same 400px viewport, same
 * 37px Continue — and it differs on exactly three things, all of them listed
 * below:
 *   top-nav actions    393 x 145        at y=0
 *   Main content       393 x 764        at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header    361 x 121        at y=24    gap-[24px]
 *       sub-step-readout 208 x 26       at y=42    6257:72243   <- DIFFERENT NODE
 *     Frame 5            361 x 542      at y=153   py-[24px] gap-[16px]
 *       heading            361 x 78     at y=24    32px Bold #333b40, 2 lines
 *       Frame 14           361 x 400    at y=118   px-[16px], justify-center
 *         image 17         329 x 207.682 at y=96.159                <- 1. ASPECT
 *     Frame 6            361 x 37       at y=703
 *       Yoti ContinueButton 361 x 37    at y=0     #27619b, full width
 *   footer verified    393 x 265.810546875 at y=909
 *
 * 24 + 121 + 8 + 542 + 8 + 37 + 24 = 764, and 145 + 764 + 265.81 = 1174.81 —
 * identical to the front frame, because the two images occupy the same 400px
 * panel whatever their own proportions.
 *
 * THE THREE DIFFERENCES FROM THE FRONT SCREEN:
 *   1. ASPECT. `image 17` is 288.001953125 x 181.80224609375 natural, i.e.
 *      1.58415, against the front's 1.611856. At 329px wide that is 207.682
 *      tall, so the centred offset is (400 - 207.682) / 2 = 96.159 rather than
 *      97.944. Both offsets are produced by `justify-center`, not hardcoded.
 *   2. NO RADIUS, NO CROP. The front image sits in a `rounded-[2px]` clip with
 *      the PNG deliberately oversized (105.4% x 104.6%, offset up and left).
 *      This one has neither: square corners, and the PNG fills its box exactly
 *      with `object-cover`. Reproduced as drawn — the two frames genuinely
 *      disagree, and it is not worth harmonising a placeholder.
 *   3. `mix-blend-multiply`, which the front image does not carry. It is in
 *      the design file, so it is here; on the opaque rgba(17,22,37,0.05) panel
 *      it has almost no visible effect, but it will matter once the real PNG
 *      (which has a white background) replaces the placeholder.
 *
 * THE VIEWPORT IS A LIVE CAMERA PREVIEW OVER THE STATIC MOCK — 2026-09-22.
 *
 * Same change as /cid/capture-front/, made at the same time and for the same
 * reason (the user asked for the camera to open on the two ID-capture screens
 * so the dry run is more convincing on stage). `image 17` hosts
 * `CameraViewport`: a live `<video>` when the browser can give one, and THIS
 * MOCK, unchanged, when it cannot.
 *
 * WHAT DID NOT CHANGE. `Frame 14` is still the measured 400px panel and
 * `image 17` still its own box at its own 1.58415 aspect with no radius and no
 * crop; the video fills that box with `object-cover`, which is exactly what
 * the mock image already does here. The server-rendered HTML is still the
 * mock — the video appears only after mount — so there is no hydration
 * mismatch and the fallback render is byte-identical to the pre-camera build.
 *
 * NOTHING IS CAPTURED: no frame is read, stored or uploaded, there is still no
 * backend and no network call, and Continue just advances — to /cid/upload/
 * since 2026-09-27, which then advances to /cid/verified/ on its own. Video
 * only, never audio.
 *
 * FORCING THE MOCK: `?mock=1` on either capture screen (sticky until
 * `?mock=0`). getUserMedia also needs a SECURE CONTEXT, so on an http://
 * deployment the camera silently never starts and the mock shows. Full
 * failure list in src/components/cid/CameraViewport.tsx and in
 * design/token-exceptions.md.
 *
 * NOTE ON `mix-blend-multiply`: it sits on the `image 17` WRAPPER (difference
 * 3 above), so it applies to whichever child renders. On the near-white panel
 * it darkens a live frame by about the panel's own 5% and is not worth
 * removing — the design value stays as drawn.
 *
 * HIDDEN LAYER NOT RENDERED: `Check box` (6057:20965) is hidden="true" in
 * Figma. `Frame 6` holds the Continue button and nothing else — there is no
 * Back button in the design. Reverse navigation is the presenter's ArrowLeft
 * (src/lib/flow.ts) and the browser's back button.
 *
 * THE PILL SAYS "step 4 of 5", the third screen in a row to do so, and the
 * next screen (/cid/verified/) jumps to "step 5 of 5". See
 * design/token-exceptions.md.
 *
 * TYPE AND COLOUR. Montserrat:Bold #333b40, `leading-[normal]` (~1.2 — the
 * measured 39px lines), on the Yoti ramp; Montserrat is self-hosted since
 * 2026-09-23. See design/token-exceptions.md.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — INVENTED; NOT IN FIGMA. Identical treatment to
 * /cid/capture-front/, and for the same reasons — see that file and CidScreen.
 *   Frame 5  `md:py-0`
 *   Frame 14 `md:items-center`, image `md:max-w-[633px]` — the panel keeps its
 *            MEASURED 400px height at every width, so the image is capped at
 *            the widest it can be and still fit: 400 x 1.58415 = 633.66,
 *            rounded down. (The front screen's cap is 644 because its aspect
 *            is wider. The two numbers differ on purpose.)
 *   Frame 6  the onboard actions-row: right aligned, natural width, 16px above.
 * ------------------------------------------------------------------------
 */
export function CidCaptureBackScreen({ service }: { service: ServiceConfig }) {
  const { captureBack: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="6057:20926" subStep={copy.subStep} yotiZone>
      {/* Frame 5 — 6057:20937 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px] md:py-0"
        data-node-id="6057:20937"
      >
        {/* MOVED TO THE TOKEN SCALE 2026-09-27 — see the identical note on
            /cid/capture-front/. 32px -> `YOTI_TEXT.heading` (24px) at 1.2. */}
        <p
          className="w-full shrink-0 font-bold [word-break:break-word]"
          style={{
            fontSize: YOTI_TEXT.heading,
            lineHeight: YOTI_TEXT.headingLeading,
            color: YOTI_COLOR.ink,
          }}
          data-node-id="6088:32306"
        >
          {copy.title}
        </p>

        {/* Frame 14 — 6088:32333. The camera viewport: the measured flat panel,
            now hosting the live preview (or the mock — see the header). */}
        <div
          className="flex h-[400px] w-full shrink-0 flex-col items-start justify-center px-[16px] md:items-center"
          style={{ backgroundColor: "rgba(17, 22, 37, 0.05)" }}
          data-node-id="6088:32333"
        >
          {/* image 17 — 6088:32336. No radius and no crop, unlike the front. */}
          <div
            /* `overflow-hidden` added 2026-09-27 WITH THE SPECIMEN ANIMATION,
               and only because of it: the image is tilted and scaled while it
               slides in, so without a clip its corners would swing outside the
               window box for 1.5s. It adds NO radius and NO crop — the image
               still fills this box exactly at rest, which is difference 2 from
               the front frame and is unchanged. */
            className="relative w-full shrink-0 overflow-hidden mix-blend-multiply md:max-w-[633px] aspect-[288.001953125/181.80224609375]"
            data-node-id="6088:32336"
            data-name="image 17"
          >
            {/* The live camera fills this box; its child is the fallback, the
                mock exactly as it was authored — same box, same object-cover. */}
            <CameraViewport>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/* `gnl-yoti-specimen` — see the identical note on
                  /cid/capture-front/ and the rule in globals.css. */}
              <img
                alt=""
                className="gnl-yoti-specimen pointer-events-none absolute inset-0 block size-full max-w-none object-cover"
                src={ASSETS.idDocBack}
              />
            </CameraViewport>
          </div>
        </div>
      </div>

      {/*
       * Frame 6 — 6057:20966, REPLACED BY THE PINNED BAR 2026-09-27. Same
       * change and same reasoning as on Y1; see the long note on
       * CidLivenessScreen.
       *
       * THE DESTINATION MOVED, and this is the one place in Flow A where Y8
       * inserts itself: Continue used to go straight to /cid/verified/ and now
       * goes to /cid/upload/, which advances to step 5 on its own. So this is
       * no longer the LAST Yoti-owned control in the journey — it is the last
       * control of any kind before the zone hands over, because Y8 has none.
       */}
      <YotiActionBar>
        <YotiContinue href={routes.upload}>{actions.continueShort}</YotiContinue>
      </YotiActionBar>
    </CidScreen>
  );
}
