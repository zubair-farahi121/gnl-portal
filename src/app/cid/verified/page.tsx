"use client";

import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/mobile/PhoneFrame";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { CidStepper } from "@/components/mobile/CidStepper";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { useDemoState } from "@/lib/demo-state";
import { CID_ACTIONS, CID_VERIFIED, CID_WIZARD_TITLE } from "@/lib/data/cid";

/*
 * CID_ID_success — Figma 6217:66058, 393 x 1050.810546875.
 * (Plan node id 6062:22540; re-published, matched by name and exact size.)
 *
 * Geometry, verbatim from get_design_context on 6062:22542:
 *   top-nav actions  393 x 145      at y=0
 *   Main content     393 x 640      at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header  361 x 98       at y=24
 *     Frame 5        361 x 394      at y=130   py-[24px] gap-[16px]
 *       title            361 x 96   at y=24    (32px Bold, wraps to 2 lines)
 *       Progress Stepper 361 x 50   at y=136
 *       card-description 361 x 168  at y=202   (14px, NOT the 16px used on the
 *                                               other three CID frames)
 *     Frame 6        361 x 84       at y=532   flex-col gap-[8px]
 *       ContinueButton 361 x 37     at y=0
 *       btn-back       361 x 39     at y=45
 *   footer verified  393 x 265.81   at y=785
 *
 * HIDDEN LAYER NOT RENDERED: instance 6062:22581 ("Check box") is
 * hidden="true" in Figma.
 *
 * WIZARD-HEADER STEP BAR: this frame sets the step-bar TRACK to #243746 (the
 * fill colour) while leaving step-bar-fill at 278.869 of 361 and bolding
 * "Ready to Use". A dark track under a dark fill renders identically to a
 * 100%-filled bar, which is what `current={3}` produces, so the component is
 * used unmodified here. Logged in design/token-exceptions-phase3.md.
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
        <WizardHeader title={CID_WIZARD_TITLE} current={3} />

        {/* Frame 5 — 6062:22553 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px]"
          data-node-id="6062:22553"
        >
          {/*
           * Heading colour is #212326 here and #5f6368 on the other three CID
           * frames, at the same 32px Bold. Reproduced, not harmonised.
           */}
          <p
            className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
            data-node-id="6062:22554"
          >
            {CID_VERIFIED.title}
          </p>

          {/*
           * The 229px label inset is hand-placed in Figma against this frame's
           * 361px track. Below 384 — under the 393 this frame is drawn at, so
           * the mobile baselines cannot move — 229 plus the label is wider
           * than the row, and `justify-end` was pushing the whole container to
           * x=-11. The inset is dropped there; the label stays right-aligned,
           * which is where the design puts it anyway.
           */}
          <CidStepper
            current={5}
            label={CID_VERIFIED.stepperLabel}
            labelIndentClassName="pl-[229px] max-xxs:pl-0"
            alignRight
            nodeId="6062:22555"
          />

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
