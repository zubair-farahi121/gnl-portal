import { CameraViewport } from "@/components/cid/CameraViewport";
import { CidScreen } from "@/components/cid/CidScreen";
import { YotiActionBar, YotiContinue } from "@/components/cid/yoti/YotiChrome";
import { ASSETS } from "@/lib/assets";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { YOTI_COLOR, YOTI_TEXT } from "@/lib/data/yoti-tokens";

/*
 * CID_ID1 (capture, front) — Figma 6056:19118, 393 x 1174.810546875.
 *
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. /cid/capture-front/ (Flow A) and
 * /cid/studentaid/capture-front/ (Flow B, §9 PP-17 = 6217:76798).
 *
 * THIS IS THE SCREEN WHERE THE TWO FLOWS ACTUALLY FORK, and both halves of the
 * fork come from `captureSides` in §12.1:
 *
 *   TITLE.  §10.1 drops the "(front)" parenthetical for Flow B, because a
 *           passport has one page. That is `captureTitles.front` and it is
 *           applied in `getCidCopy`.
 *   FORWARD LINK. §9 says of PP-09..PP-19: "**no back capture**". So Continue
 *           goes to the back-capture screen only when the service photographs a
 *           back; otherwise it goes to Y8, the UPLOAD screen, which is where
 *           both flows rejoin before step 5. That is the `next` constant below,
 *           and it is driven by `captureSides` rather than by an
 *           `if (service.id === …)`, so a third service would work without
 *           touching this file.
 *
 *           UPDATED 2026-09-27. This used to read `routes.verified` for the
 *           no-back case, because /cid/upload/ did not exist. Flow B now runs
 *           capture-front -> upload -> verified and Flow A runs
 *           capture-back -> upload -> verified; the fork is still one line and
 *           still `captureSides`.
 *
 * Flow B therefore never links to the back capture, and — see
 * `cidBackCaptureParams` in src/lib/data/service-config.ts — that route is not
 * generated for it either. There is no orphan page to stumble into.
 *
 * WHAT IS *NOT* REPRODUCED, AND IT IS A REAL DIFFERENCE. StudentAidNL's capture
 * frame 6217:76798 draws an EMPTY viewport with four corner brackets, where the
 * Driver-and-Vehicle master draws a captured document in a flat
 * rgba(17,22,37,0.05) panel; and §9 names `id-canadian-passport.png` (274x384,
 * PORTRAIT) as PP-18's captured image against this frame's landscape licence.
 * Neither the bracket treatment nor a portrait passport asset is a value in
 * §12.1, and neither exists in this build — the brackets are a different set of
 * boxes, and the asset is not in public/. Flow B's capture screen therefore
 * shows the Driver-and-Vehicle panel with the live camera over it. Raised in the
 * report; it needs either a new config field plus artwork, or a decision that
 * the live camera makes the point on stage anyway.
 * ====================================================================
 *
 * ADDED 2026-09-22 with /cid/document/ and /cid/capture-back/. See the
 * provenance block on CidDocumentScreen for how the seven `CID_ID1` frames were
 * told apart; the short version is that this one's `wizard-title` reads
 * "Driver and Vehicle", so it is the master, and the three on the y=2341 row
 * read "StudentAidNL" and are its instances.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata / get_design_context
 * on 6056:19118 and 6056:19131:
 *   top-nav actions    393 x 145        at y=0
 *   Main content       393 x 764        at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header    361 x 121        at y=24    gap-[24px]
 *       wizard-title       361 x 29     at y=0
 *       progress-stepper   361 x 68     at y=53    gap-[8px]
 *         step-bar           361 x 8    at y=0     fill 278.869
 *         step-labels        361 x 18   at y=16    current = Prerequisite Check
 *         sub-step-readout   208 x 26   at y=42    6257:72233
 *     Frame 5            361 x 542      at y=153   py-[24px] gap-[16px]
 *       heading            361 x 78     at y=24    32px Bold #333b40, 2 lines
 *       Frame 14           361 x 400    at y=118   px-[16px], justify-center
 *         image 16         329 x 204.111 at y=97.944  radius 2
 *     Frame 6            361 x 37       at y=703
 *       Yoti ContinueButton 361 x 37    at y=0     #27619b, full width
 *   footer verified    393 x 265.810546875 at y=909
 *
 * 24 + 121 + 8 + 542 + 8 + 37 + 24 = 764, and 145 + 764 + 265.81 = 1174.81.
 *
 * NOTE THE 78px TWO-LINE HEADING IS THE MASTER'S. Flow B's shorter title
 * ("Capture ID document", no parenthetical) fits on ONE line at 393, so that
 * route's card is shorter. That is the design's own consequence of §10.1, not
 * a layout change — the frame is `w-full` with no pinned height.
 *
 * THE VIEWPORT IS A LIVE CAMERA PREVIEW OVER THE STATIC MOCK — 2026-09-22.
 *
 * It used to be a picture and nothing else. The user asked for the camera to
 * open here so the dry run is more convincing on stage ("regrading the photo
 * vierication and id, can we make open the camera so it will more attractive
 * to show"), so `image 16` now hosts `CameraViewport`, which shows a live
 * `<video>` when it can and renders THIS MOCK, unchanged, when it cannot.
 *
 * WHAT DID NOT CHANGE. The Figma geometry: `Frame 14` is still the 400px
 * panel, `image 16` is still the same box at the same aspect with the same
 * `rounded-[2px]` clip, and the video fills that box with `object-cover`
 * exactly as the picture does. The server-rendered HTML is still the mock —
 * the video appears only after mount — so there is no hydration mismatch, and
 * the fallback render is byte-identical to the pre-camera build.
 *
 * NOTHING IS CAPTURED. No frame is read, stored or uploaded; there is still no
 * backend and no network call. Continue still just advances. Video only, never
 * audio. The camera is requested on THIS screen and /cid/capture-back/ and
 * /cid/liveness-capture/ and nowhere else in the flow.
 *
 * FORCING THE MOCK: `?mock=1` on either capture screen (sticky — it is
 * remembered in localStorage until `?mock=0`). getUserMedia also needs a
 * SECURE CONTEXT, so on an http:// deployment the camera silently never
 * starts and the mock shows. Full failure list and rationale in the header of
 * src/components/cid/CameraViewport.tsx, and in design/token-exceptions.md.
 *
 * WHY THE IMAGE LANDS AT y=97.944 ON ITS OWN. `Frame 14` is a 400px-tall
 * column with `justify-center` and 16px of side padding, so the image is
 * 361 - 32 = 329 wide, and `aspect-[725.828125/450.30224609375]` makes it
 * 329 / 1.611856 = 204.111 tall. (400 - 204.111) / 2 = 97.944 — the offset is
 * produced by the centring, it is not a hardcoded number.
 *
 * THE IMAGE IS SLIGHTLY OVERSIZED INSIDE ITS OWN BOX, as designed: Figma
 * places the PNG at left -2.62%, top -2.31%, width 105.4%, height 104.6%
 * inside a `rounded-[2px]` clip, i.e. a small centre crop. Reproduced
 * verbatim, so dropping the real export in changes nothing about the layout.
 *
 * HIDDEN LAYER NOT RENDERED: `Check box` (6056:19164) is hidden="true" in
 * Figma, the same as on every other CID frame. `Frame 6` on this frame holds
 * the Continue button and nothing else — there is no Back button in the
 * design. Reverse navigation is the presenter's ArrowLeft (src/lib/flow.ts)
 * and the browser's back button.
 *
 * THE PILL SAYS "step 4 of 5" — the same value the document-selection screen
 * before it and the back-capture screen after it carry. See
 * design/token-exceptions.md.
 *
 * TYPE AND COLOUR. Montserrat:Bold #333b40 in the design; Montserrat is
 * self-hosted since 2026-09-23. Note the heading is `leading-[normal]` (~1.2,
 * giving the measured 39px lines and a 78px two-line block), NOT the
 * `leading-[1.5]` the GNL-ramp CID headings on /cid/terms/, /cid/biometric/ and
 * /cid/verified/ use. Figma says normal here.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — INVENTED; NOT IN FIGMA.
 *
 * Mobile-only frame, same as every CID frame; at and above 768 CidScreen drops
 * the content into the onboard page's wizard chrome. See CidScreen for the
 * full provenance note. Every `md:` class below is part of that invention.
 *
 *   Frame 5  `md:py-0` — the 24px pads are the mobile frame's spacing to the
 *                        header and to Frame 6; the card's own 32px gap does
 *                        that at desktop and the two would stack to 56.
 *   Frame 14 `md:items-center` and the image `md:max-w-[644px]` — the panel
 *                        keeps its MEASURED 400px height at every width, so
 *                        the image has to be stopped from outgrowing it. At
 *                        1440 the panel's content box is 708px wide, which at
 *                        this aspect would make the picture 439px tall and
 *                        burst the panel. 644px is 400 x 1.611856 rounded
 *                        down — the widest this image can be and still fit —
 *                        and `items-center` then centres it, where the mobile
 *                        `items-start` is a no-op because the image is
 *                        full-width at 393.
 *   Frame 6  the onboard actions-row: right aligned, natural width, 16px above.
 * The 32px heading and the 400px panel are UNCHANGED at every width.
 * ------------------------------------------------------------------------
 */
export function CidCaptureFrontScreen({ service }: { service: ServiceConfig }) {
  const { captureFront: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  /*
   * WHERE CONTINUE GOES IS THE SERVICE'S, NOT THIS SCREEN'S — §12.1
   * `captureSides`. Flow A photographs both sides of a licence, so it goes on
   * to the back capture; Flow B photographs a passport once, so it goes
   * straight to step 5 ("**no back capture**", §9). The test is on the DATA,
   * not on the service id, so the rule keeps working for any service that is
   * added later.
   */
  const next = service.captureSides.includes("back")
    ? routes.captureBack
    : routes.upload;

  return (
    <CidScreen service={service} mainNodeId="6056:19120" subStep={copy.subStep} yotiZone>
      {/* Frame 5 — 6056:19131 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px] md:py-0"
        data-node-id="6056:19131"
      >
        {/*
         * MOVED TO THE TOKEN SCALE 2026-09-27: a hardcoded 32px becomes
         * `YOTI_TEXT.heading` (24px) at `headingLeading` (1.2). 24 is §6's
         * value for every Yoti heading except Y1 and Y8, which get
         * `headingLarge`. Tatyana's 32 is the recreation's.
         *
         * THE MEASURED 78px TWO-LINE BLOCK IN THE HEADER ABOVE NO LONGER
         * HOLDS — at 24/1.2 the two lines are 58. That is expected: the frame
         * is `w-full` with no pinned height, so the card simply gets shorter,
         * and the Yoti baselines were re-taken in the same pass. Nothing
         * OUTSIDE the zone moved.
         */}
        <p
          className="w-full shrink-0 font-bold [word-break:break-word]"
          style={{
            fontSize: YOTI_TEXT.heading,
            lineHeight: YOTI_TEXT.headingLeading,
            color: YOTI_COLOR.ink,
          }}
          data-node-id="6088:32304"
        >
          {copy.title}
        </p>

        {/* Frame 14 — 6088:32330. The camera viewport: the measured flat panel,
            now hosting the live preview (or the mock — see the header). */}
        <div
          className="flex h-[400px] w-full shrink-0 flex-col items-start justify-center px-[16px] md:items-center"
          style={{ backgroundColor: "rgba(17, 22, 37, 0.05)" }}
          data-node-id="6088:32330"
        >
          {/* image 16 — 6056:19942 */}
          <div
            className="relative w-full shrink-0 overflow-hidden rounded-[2px] md:max-w-[644px] aspect-[725.828125/450.30224609375]"
            data-node-id="6056:19942"
            data-name="image 16"
          >
            {/*
             * The live camera fills this box; its child is the fallback, which
             * is the mock exactly as it was authored — the oversized placement
             * below (left -2.62%, top -2.31%, 105.4% x 104.6%) is still
             * Figma's own small centre crop, untouched.
             */}
            <CameraViewport>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {/*
               * `gnl-yoti-specimen` added 2026-09-27 — the specimen slides in
               * with a slight tilt and goes blurred -> sharp over 1.5s, then
               * holds the captured state. The animation's RESTING state is
               * this element's own CSS, so the Figma placement below is
               * untouched and anything that does not run the animation shows
               * exactly what shipped before. See globals.css.
               */}
              <img
                alt=""
                className="gnl-yoti-specimen pointer-events-none absolute left-[-2.62%] top-[-2.31%] block h-[104.6%] w-[105.4%] max-w-none"
                src={ASSETS.idDocFront}
              />
            </CameraViewport>
          </div>
        </div>
      </div>

      {/*
       * Frame 6 — 6056:19165, REPLACED BY THE PINNED BAR 2026-09-27. Same
       * change and same reasoning as on Y1; see the long note on
       * CidLivenessScreen.
       *
       * `next` IS UNCHANGED IN SHAPE AND CHANGED IN DESTINATION, and the
       * change is Y8's: the flow that photographs a back now goes on to it,
       * and the flow that does not goes to the UPLOAD screen rather than
       * straight to step 5. The test is still on `captureSides`, not on a
       * service id.
       */}
      <YotiActionBar>
        <YotiContinue href={next}>{actions.continueShort}</YotiContinue>
      </YotiActionBar>
    </CidScreen>
  );
}
