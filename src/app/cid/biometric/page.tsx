import { PhoneFrame } from "@/components/mobile/PhoneFrame";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { CidStepper } from "@/components/mobile/CidStepper";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { CID_ACTIONS, CID_BIOMETRIC, CID_STEPPER_FILL, CID_WIZARD_TITLE } from "@/lib/data/cid";

/*
 * CID_Biometric — Figma 6217:62835, 393 x 894.810546875.
 * (Plan node id 6049:12226; re-published, matched by name and exact size.)
 *
 * Geometry, verbatim from get_design_context on 6049:12239:
 *   top-nav actions  393 x 145      at y=0
 *   Main content     393 x 484      at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header  361 x 98       at y=24
 *     Frame 5        361 x 283      at y=130   py-[24px] gap-[16px]
 *       Progress Stepper 361 x 50   at y=24    <-- FIRST
 *       "Biometric consent" 361 x 48 at y=90
 *       card-description 361 x 105  at y=154
 *     Frame 6        361 x 39       at y=421   gap-[8px]
 *   footer verified  393 x 265.81   at y=629
 *
 * ORDER DIFFERS FROM CID_TU ON PURPOSE: here the dot stepper comes before the
 * heading, where every other CID frame puts the heading first. Reproduced as
 * designed, NOT normalised — logged in design/token-exceptions-phase3.md.
 *
 * HIDDEN LAYER NOT RENDERED: instance 6049:12263 ("Check box") is
 * hidden="true" in Figma.
 */
export default function CidBiometricPage() {
  return (
    <PhoneFrame>
      <MobileTopNav />

      <main
        className="box-border flex w-full flex-col items-start gap-[8px] px-[16px] py-[24px]"
        data-node-id="6049:12228"
      >
        <WizardHeader title={CID_WIZARD_TITLE} current={2} fillWidth={CID_STEPPER_FILL} />

        {/* Frame 5 — 6049:12239 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px]"
          data-node-id="6049:12239"
        >
          <CidStepper
            current={2}
            label={CID_BIOMETRIC.stepperLabel}
            labelIndentClassName="pl-[72px]"
            nodeId="6049:12241"
          />

          <p
            className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
            data-node-id="6049:12240"
          >
            {CID_BIOMETRIC.title}
          </p>

          {/* card-description 6049:12262 */}
          <div
            className="w-full shrink-0 text-[16px] font-normal text-[#5f6368] [word-break:break-word]"
            data-node-id="6049:12262"
          >
            <p className="mb-[16px] leading-[24px]">{CID_BIOMETRIC.body}</p>
            {/* Inert, as on CID_TU — the design gives it no destination. */}
            <p
              className="cursor-default leading-[24px] text-[#004b87] underline decoration-solid decoration-from-font select-none [text-decoration-skip-ink:none] [text-underline-position:from-font]"
              data-demo-inert="true"
            >
              {CID_BIOMETRIC.linkLabel}
            </p>
          </div>
        </div>

        {/* Frame 6 — 6049:12264 */}
        <div
          className="flex w-full shrink-0 items-start gap-[8px]"
          data-node-id="6049:12264"
        >
          <BtnOutline href="/cid/terms/" className="min-w-px flex-[1_0_0] justify-center">
            {CID_ACTIONS.decline}
          </BtnOutline>
          <BtnOutline href="/cid/verified/" className="min-w-px flex-[1_0_0] justify-center">
            {CID_ACTIONS.accept}
          </BtnOutline>
        </div>
      </main>

      <SiteFooter variant="mobile" />
    </PhoneFrame>
  );
}
