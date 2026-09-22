import { PhoneFrame } from "@/components/mobile/PhoneFrame";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { CidStepper } from "@/components/mobile/CidStepper";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { CID_ACTIONS, CID_STEPPER_FILL, CID_TERMS, CID_WIZARD_TITLE } from "@/lib/data/cid";

/*
 * CID_TU — Figma 6217:62834, 393 x 870.810546875.
 * (Plan node id 6039:11307; re-published, matched by name and exact size.)
 *
 * Geometry, verbatim from get_design_context on 6039:11309:
 *   top-nav actions  393 x 145      at y=0
 *   Main content     393 x 460      at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header  361 x 98       at y=24
 *     Frame 5        361 x 259      at y=130   py-[24px] gap-[16px]
 *       "Terms of Use"   361 x 48   at y=24
 *       Progress Stepper 361 x 50   at y=88
 *       card-description 361 x 81   at y=154
 *     Frame 6        361 x 39       at y=397   gap-[8px]
 *   footer verified  393 x 265.81   at y=605
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
        <WizardHeader title={CID_WIZARD_TITLE} current={2} fillWidth={CID_STEPPER_FILL} />

        {/* Frame 5 — 6039:11320 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px]"
          data-node-id="6039:11320"
        >
          <p
            className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
            data-node-id="6039:11321"
          >
            {CID_TERMS.title}
          </p>

          <CidStepper
            current={1}
            label={CID_TERMS.stepperLabel}
            labelIndentClassName="pl-[34px]"
            nodeId="6039:11322"
          />

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
