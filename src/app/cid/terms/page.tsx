import { PhoneFrame } from "@/components/mobile/PhoneFrame";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { CID_ACTIONS, CID_STEPPER_FILL, CID_TERMS, CID_WIZARD_TITLE } from "@/lib/data/cid";

/*
 * CID_TU — Figma 6217:62834, 393 x 810.810546875.
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
 */
export default function CidTermsPage() {
  return (
    <PhoneFrame>
      <MobileTopNav />

      <main
        className="box-border flex w-full flex-col items-start gap-[8px] px-[16px] py-[24px]"
        data-node-id="6039:11309"
      >
        <WizardHeader
          title={CID_WIZARD_TITLE}
          current={2}
          fillWidth={CID_STEPPER_FILL}
          subStep={CID_TERMS.subStep}
        />

        {/* Frame 5 — 6039:11320 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[16px] pt-0 pb-[24px]"
          data-node-id="6039:11320"
        >
          <p
            className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
            data-node-id="6039:11321"
          >
            {CID_TERMS.title}
          </p>

          {/* card-description 6039:11341 */}
          <div
            className="w-full shrink-0 text-[16px] font-normal text-[#5f6368] [word-break:break-word]"
            data-node-id="6039:11341"
          >
            <p className="mb-[16px] leading-[24px]">{CID_TERMS.body}</p>
            {/*
             * Rendered as text, not an anchor: the design gives it no
             * destination, and a live link would let the presenter leave the
             * flow mid-demo.
             */}
            <p
              className="cursor-default leading-[24px] text-[#004b87] underline decoration-solid decoration-from-font select-none [text-decoration-skip-ink:none] [text-underline-position:from-font]"
              data-demo-inert="true"
            >
              {CID_TERMS.linkLabel}
            </p>
          </div>
        </div>

        {/* Frame 6 — 6049:12216 */}
        <div
          className="flex w-full shrink-0 items-start gap-[8px]"
          data-node-id="6049:12216"
        >
          {/*
           * Back now returns to the prerequisite check, not CID_Welcome —
           * that screen was cut from the flow on 2026-09-21, so Terms of Use
           * is the first step of the IDV journey.
           */}
          <BtnOutline
            href="/services/driver-vehicle/onboard/"
            className="min-w-px flex-[1_0_0] justify-center"
          >
            {CID_ACTIONS.decline}
          </BtnOutline>
          <BtnOutline href="/cid/biometric/" className="min-w-px flex-[1_0_0] justify-center">
            {CID_ACTIONS.accept}
          </BtnOutline>
        </div>
      </main>

      <SiteFooter variant="mobile" />
    </PhoneFrame>
  );
}
