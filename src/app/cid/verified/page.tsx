"use client";

import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/mobile/PhoneFrame";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { useDemoState } from "@/lib/demo-state";
import { CID_ACTIONS, CID_STEPPER_FILL, CID_VERIFIED, CID_WIZARD_TITLE } from "@/lib/data/cid";

/*
 * CID_ID_success — Figma 6217:66058, 393 x 1014.810546875.
 *
 * RE-SYNCED 2026-09-22. Same rework as the other two CID frames, but this one
 * KEEPS its `py-[24px]` on Frame 5, so it is -36px rather than -60px.
 *
 * Geometry, verbatim from get_metadata / get_design_context on 6062:22542:
 *   top-nav actions  393 x 145      at y=0
 *   Main content     393 x 604      at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header  361 x 128      at y=24    gap-[24px]
 *       wizard-title     361 x 36   at y=0
 *       progress-stepper 361 x 68   at y=60    gap-[8px]
 *         step-bar         361 x 8  at y=0     fill 278.869
 *         step-labels      361 x 18 at y=16    current = Prerequisite Check
 *         sub-step-readout 171 x 26 at y=42    <- THE PILL, 6257:72248
 *     Frame 5        361 x 328      at y=160   py-[24px] gap-[16px]
 *       title            361 x 96   at y=24    (32px Bold #212326, 2 lines)
 *       card-description 361 x 168  at y=136   (14px, NOT the 16px the other
 *                                               two CID frames use)
 *     Frame 6        361 x 84       at y=496   flex-col gap-[8px]
 *       ContinueButton 361 x 37     at y=0
 *       btn-back       361 x 39     at y=45
 *   footer verified  393 x 265.81   at y=749
 *
 * HIDDEN LAYER NOT RENDERED: instance 6062:22581 ("Check box") is
 * hidden="true" in Figma.
 *
 * WIZARD-HEADER STEP BAR: the #243746 step-bar TRACK this frame used to carry
 * — a dark track under a dark fill, which read as a 100%-filled bar and was
 * matched with `current={3}` — is GONE. 6257:69750 is now the ordinary #e9ebf0
 * track with the same 278.869 fill and the same bold "Prerequisite Check" as
 * the other two frames, so this page takes `current={2}` and CID_STEPPER_FILL
 * like them. The exception in design/token-exceptions-phase3.md is resolved.
 *
 * "use client" is required: this is the screen that flips the demo to verified.
 */
export default function CidVerifiedPage() {
  const router = useRouter();
  const { setVerified, reset } = useDemoState();

  const onContinue = () => {
    setVerified(true);
    router.push("/auth/loading/");
  };

  return (
    <PhoneFrame>
      <MobileTopNav />

      <main
        className="box-border flex w-full flex-col items-start gap-[8px] px-[16px] py-[24px]"
        data-node-id="6062:22542"
      >
        <WizardHeader
          title={CID_WIZARD_TITLE}
          current={2}
          fillWidth={CID_STEPPER_FILL}
          subStep={CID_VERIFIED.subStep}
        />

        {/* Frame 5 — 6062:22553 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px]"
          data-node-id="6062:22553"
        >
          {/* All three CID headings are #212326 now; this one always was. */}
          <p
            className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
            data-node-id="6062:22554"
          >
            {CID_VERIFIED.title}
          </p>

          {/* card-description 6062:23365 — one text node: 3 paragraphs + a bulleted list. */}
          <div
            className="w-full shrink-0 text-[14px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]"
            data-node-id="6062:23365"
          >
            {CID_VERIFIED.description.map((block, i) =>
              block.kind === "bullets" ? (
                <ul key={i} className="list-disc">
                  {block.items.map((item) => (
                    <li key={item} className="ms-[21px] leading-[1.5]">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p key={i} className="mb-0 whitespace-pre-wrap leading-[1.5]">
                  {block.text}
                </p>
              ),
            )}
          </div>
        </div>

        {/* Frame 6 — 6062:22582 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[8px]"
          data-node-id="6062:22582"
        >
          <BtnPrimary className="w-full" onClick={onContinue}>
            {CID_ACTIONS.continue}
          </BtnPrimary>
          {/*
           * "Log out" returns to the login page and clears the demo's
           * verified flag, so the next run starts unverified. It used to be
           * inert, which read as a broken build in front of the client.
           */}
          <BtnOutline href="/" onClick={reset} className="w-full justify-center">
            {CID_ACTIONS.logOut}
          </BtnOutline>
        </div>
      </main>

      <SiteFooter variant="mobile" />
    </PhoneFrame>
  );
}
