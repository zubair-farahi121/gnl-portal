"use client";

import { useRouter } from "next/navigation";
import { CidScreen } from "@/components/cid/CidScreen";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { useDemoState } from "@/lib/demo-state";
import { CID_ACTIONS, CID_VERIFIED } from "@/lib/data/cid";

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
 * like them (both now supplied by CidScreen). The exception in
 * design/token-exceptions-phase3.md is resolved.
 *
 * "use client" is required: this is the screen that flips the demo to verified.
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — 2026-09-22. INVENTED; NOT IN FIGMA.
 *
 * Mobile-only frame, same as the other two CID screens; at and above 768 the
 * content is dropped into the onboard page's wizard chrome. See CidScreen for
 * the full provenance note and the CSS-only breakpoint mechanism.
 *
 * Invented here, specifically:
 *   Frame 5  `md:py-0`  — the 24px pads are the mobile frame's spacing to the
 *                         header and to Frame 6; the card's 32px gap does that
 *                         job at desktop and the two would stack.
 *   Frame 6  `md:flex-row md:items-center md:justify-end md:gap-[24px]
 *            md:pt-[16px]`, both buttons `md:w-auto`, and `md:order-1/2` —
 *                         a full-width stacked pair of buttons in an 820px
 *                         card reads as a phone screen stretched. It becomes
 *                         the onboard actions-row, and the order classes put
 *                         the primary on the RIGHT as onboard does, without
 *                         touching the DOM (and therefore tab) order.
 * The 32px heading and the 14px description are unchanged at every width —
 * 14px is already what the onboard card uses for its own body copy.
 * ------------------------------------------------------------------------
 */
export default function CidVerifiedPage() {
  const router = useRouter();
  const { setVerified, reset } = useDemoState();

  const onContinue = () => {
    setVerified(true);
    router.push("/auth/loading/");
  };

  return (
    <CidScreen mainNodeId="6062:22542" subStep={CID_VERIFIED.subStep}>
      {/* Frame 5 — 6062:22553 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[16px] py-[24px] md:py-0"
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
        className="flex w-full shrink-0 flex-col items-start gap-[8px] md:flex-row md:items-center md:justify-end md:gap-[24px] md:pt-[16px]"
        data-node-id="6062:22582"
      >
        <BtnPrimary className="w-full md:order-2 md:w-auto" onClick={onContinue}>
          {CID_ACTIONS.continue}
        </BtnPrimary>
        {/*
         * "Log out" returns to the login page and clears the demo's
         * verified flag, so the next run starts unverified. It used to be
         * inert, which read as a broken build in front of the client.
         */}
        <BtnOutline
          href="/"
          onClick={reset}
          className="w-full justify-center md:order-1 md:w-auto"
        >
          {CID_ACTIONS.logOut}
        </BtnOutline>
      </div>
    </CidScreen>
  );
}
