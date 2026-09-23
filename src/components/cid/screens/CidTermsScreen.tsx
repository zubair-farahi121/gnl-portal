import { CidScreen } from "@/components/cid/CidScreen";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";

/*
 * CID_TU — Figma 6217:62834, 393 x 810.810546875.
 *
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-23.
 *
 * The markup below used to be the body of src/app/cid/terms/page.tsx. It moved
 * here unchanged so that BOTH bindings can render it:
 *
 *   /cid/terms/              Flow A   src/app/cid/terms/page.tsx
 *   /cid/studentaid/terms/   Flow B   src/app/cid/[serviceId]/terms/page.tsx
 *
 * Both are PRERENDERED by `output: export`, so each one's HTML already carries
 * the right wizard title and the right cancel destination and neither reads a
 * service on the client. See the seam note at the foot of
 * src/lib/data/service-config.ts.
 *
 * SHARED SCREEN, so the cancel destination is the SESSION's service, not a
 * literal: "I do not agree" cancels the CertifiO ID session and returns to the
 * method step (NL-07 / PP-07) of whichever service is being onboarded. For
 * `driver-vehicle` that is the same "/services/driver-vehicle/onboard/" it has
 * always been.
 * ====================================================================
 *
 * RE-SYNCED 2026-09-22 against the reworked frame. The six-dot CID stepper
 * that sat between the heading and the description is gone; its replacement is
 * the `sub-step-readout` pill, which lives INSIDE wizard-header (see
 * SubStepReadout). The frame is 60px shorter as a result: -50 for the dot rail,
 * -16 for its gap, -24 for the top padding Frame 5 dropped, +30 for the pill
 * and its gap, minus the 4px progress-stepper gap tightened 12 -> 8.
 *
 * Geometry, verbatim from get_metadata / get_design_context on 6039:11309:
 *   top-nav actions  393 x 145      at y=0
 *   Main content     393 x 400      at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header  361 x 128      at y=24    gap-[24px]      <- was 98
 *       wizard-title     361 x 36   at y=0
 *       progress-stepper 361 x 68   at y=60    gap-[8px]       <- gap was 12
 *         step-bar         361 x 8  at y=0     fill 278.869
 *         step-labels      361 x 18 at y=16    current = Prerequisite Check
 *         sub-step-readout 155 x 26 at y=42    <- THE PILL, 6257:72178
 *     Frame 5        361 x 169      at y=160   pt-[0] pb-[24px] gap-[16px]
 *       "Terms of use"   361 x 48   at y=0     32px Bold #212326  <- was #5f6368
 *       card-description 361 x 81   at y=64
 *     Frame 6        361 x 39       at y=337   gap-[8px]
 *   footer verified  393 x 265.81   at y=545
 *
 * HEADING CASE: the frame now says "Terms of use" (sentence case) while the
 * inline link inside card-description is still "Terms of Use". Both verbatim.
 *
 * HIDDEN LAYER NOT RENDERED: instance 6049:12215 ("Check box", 286 x 27 at
 * y=577) is hidden="true" in Figma. Hidden layers are not part of the design.
 *
 * Both buttons are named `btn-back` in Figma and are styled identically; the
 * right-hand one is the forward action. Each is 176.5 wide — `flex-[1_0_0]`
 * over a 361px row with an 8px gap gives exactly 176.5.
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — 2026-09-22. INVENTED; NOT IN FIGMA.
 *
 * This frame is MOBILE ONLY in Figma (393 wide). On a laptop the page used to
 * be a 480px column stranded in white between two real 1440 desktop frames.
 * At and above 768 the content is now dropped into the same wizard chrome
 * `/services/driver-vehicle/onboard/` uses — see CidScreen for the full
 * provenance note and the mechanism.
 *
 * Every `md:` class on this page is part of that invention and nothing else
 * on it moved. Below 768 the output is byte for byte what it was, which the
 * visual gate holds at 393 x 818 (dH +7 against the 811 frame, the known
 * Figma-vs-CSS line-box difference, unchanged by this pass).
 *
 * Invented here, specifically:
 *   Frame 5  `md:pb-0`   — the 24px bottom pad is the mobile frame's spacing
 *                          to Frame 6; inside the card the 32px card gap does
 *                          that job and the two would stack to 56.
 *   Frame 6  `md:justify-end md:gap-[24px] md:pt-[16px]` and `md:flex-none`
 *                          on both buttons — two 366px half-width buttons in
 *                          an 820px card read as a phone screen stretched. The
 *                          row becomes the onboard actions-row: natural-width
 *                          controls, right aligned, 24px apart, 16px above.
 * The 32px heading and the 16px body are UNCHANGED at every width; both
 * already read at desktop size next to onboard's 28px intro and 15px body.
 * ------------------------------------------------------------------------
 */
export function CidTermsScreen({ service }: { service: ServiceConfig }) {
  // ONE `getCidCopy` call per screen — see the note on that function.
  const { terms: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="6039:11309" subStep={copy.subStep}>
      {/* Frame 5 — 6039:11320 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[16px] pt-0 pb-[24px] md:pb-0"
        data-node-id="6039:11320"
      >
        <p
          className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
          data-node-id="6039:11321"
        >
          {copy.title}
        </p>

        {/* card-description 6039:11341 */}
        <div
          className="w-full shrink-0 text-[16px] font-normal text-[#5f6368] [word-break:break-word]"
          data-node-id="6039:11341"
        >
          <p className="mb-[16px] leading-[24px]">{copy.body}</p>
          {/*
           * Rendered as text, not an anchor: the design gives it no
           * destination, and a live link would let the presenter leave the
           * flow mid-demo.
           */}
          <p
            className="cursor-default leading-[24px] text-[#004b87] underline decoration-solid decoration-from-font select-none [text-decoration-skip-ink:none] [text-underline-position:from-font]"
            data-demo-inert="true"
          >
            {copy.linkLabel}
          </p>
        </div>
      </div>

      {/* Frame 6 — 6049:12216 */}
      <div
        className="flex w-full shrink-0 items-start gap-[8px] md:items-center md:justify-end md:gap-[24px] md:pt-[16px]"
        data-node-id="6049:12216"
      >
        {/*
         * Back now returns to the prerequisite check, not CID_Welcome —
         * that screen was cut from the flow on 2026-09-21, so Terms of Use
         * is the first step of the IDV journey.
         */}
        <BtnOutline
          href={serviceRoutes(service.id).onboard}
          className="min-w-px flex-[1_0_0] justify-center md:flex-none"
        >
          {actions.decline}
        </BtnOutline>
        <BtnOutline
          href={routes.biometric}
          className="min-w-px flex-[1_0_0] justify-center md:flex-none"
        >
          {actions.accept}
        </BtnOutline>
      </div>
    </CidScreen>
  );
}
