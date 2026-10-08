"use client";

import { useRouter } from "next/navigation";
import { CidScreen } from "@/components/cid/CidScreen";
import { HandoffDoneNotice } from "@/components/cid/HandoffDoneNotice";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { useDemoState } from "@/lib/demo-state";
import { getCidCopy } from "@/lib/data/cid";
import { APP_ROUTES, type ServiceConfig } from "@/lib/data/service-config";
import { MOBILE_ROUTE } from "@/lib/data/phone-path";
import { isHandoffTab } from "@/lib/remote-sync";

/*
 * CID_ID_success — Figma 6217:66058, 393 x 1014.810546875.
 *
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. /cid/verified/ (Flow A) and
 * /cid/studentaid/verified/ (Flow B, §9 PP-19, "step 5 (PP-19) uses the 10.1
 * copy"). THIS IS THE ONE CID SCREEN WHOSE BODY COPY ACTUALLY DIFFERS between
 * the two: §10.1 replaces the service name in the first sentence, all four
 * bullets, and the primary CTA. All three come from the service config and are
 * baked into each route's prerendered HTML.
 *
 * "use client" MOVED HERE FROM THE PAGE. This is the screen that flips the demo
 * to verified, so it needs hooks — but the ROUTE files above it are now plain
 * server components, which is what lets `/cid/[serviceId]/verified/` resolve its
 * param at build time and hand this component a finished `ServiceConfig`. The
 * rendered markup is unchanged; only the client boundary moved down one level.
 * ====================================================================
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
 * the other two frames, so this page takes `current={2}` and the shared stepper
 * fill like them (both now supplied by CidScreen). The exception in
 * design/token-exceptions-phase3.md is resolved.
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
export function CidVerifiedScreen({ service }: { service: ServiceConfig }) {
  const router = useRouter();
  const { markVerified, resetAll } = useDemoState();
  const { verified: copy, actions } = getCidCopy(service);

  /*
   * THE ONLY FORWARD ENTRY TO /auth/loading/, AND THEREFORE THE ONLY PLACE THE
   * NL-21 AUTO-ADVANCE IS ARMED.
   *
   * `markVerified` writes `status: "verified"` + `verifiedAt` for the service
   * (BUILD_BRIEF.md §12.2) AND sets the one-shot `pendingAdvance` flag that
   * `ProcessingAdvance` consumes on the next screen. Arming it here — rather
   * than letting /auth/loading/ start a timer on every visit — is what keeps
   * step 7's **Back** working; see design/token-exceptions.md §10.10 and the
   * note on src/components/onboarding/ProcessingAdvance.tsx.
   *
   * It does NOT mark the service `onboarded`: §8.3 puts that on NL-23 ("On
   * open, mark the service onboarded"), which is what makes the service page
   * flip to Trusted. Until then the badge still reads "Confirmation required",
   * which is §12.2's rule verbatim.
   *
   * IT USED TO BE THE LITERAL "driver-vehicle", with a comment saying so — the
   * seam every `/cid/` screen shared. It is now `service.id`, which is the
   * service the ROUTE names: /cid/verified/ still writes `driver-vehicle`, and
   * /cid/studentaid/verified/ writes `studentaid`. Nothing here reads a store
   * to find that out.
   */
  const onContinue = () => {
    /* Phone path (docs/PHONE_PATH.md): a PHONE that came through the laptop's
       hand-off QR has already handed the result back — the laptop moved on by
       itself — so the phone ends on "You can return to your computer". */
    if (isHandoffTab(service.id)) {
      router.replace(`${MOBILE_ROUTE}?done=1&service=${service.id}`);
      return;
    }
    markVerified(service.id);
    router.push(APP_ROUTES.processing);
  };

  return (
    <CidScreen service={service} mainNodeId="6062:22542" subStep={copy.subStep}>
      {/* Phone path (2026-09-30): null unless this phone tab came through the
          laptop's hand-off QR — see src/components/cid/HandoffDoneNotice.tsx. */}
      <HandoffDoneNotice serviceId={service.id} />
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
          {copy.title}
        </p>

        {/* card-description 6062:23365 — one text node: 3 paragraphs + a bulleted list. */}
        <div
          className="w-full shrink-0 text-[14px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]"
          data-node-id="6062:23365"
        >
          {copy.description.map((block, i) =>
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
          {actions.continue}
        </BtnPrimary>
        {/*
         * "Log out" returns to the login page and clears the store, so the next
         * run starts from scratch. It used to be inert, which read as a broken
         * build in front of the client.
         *
         * NOTE IT DIFFERS FROM THE HEADER'S Log Out, WHICH NO LONGER RESETS
         * (§7.1, Q-17). This one is the CertifiO ID session's own abandon
         * control — the user is walking away mid-verification, on what is
         * drawn as the provider's screen, so starting the next run clean is
         * the honest behaviour. The header's is a portal sign-out and keeps
         * progress. Two controls, two meanings, both deliberate.
         */}
        <BtnOutline
          href={APP_ROUTES.login}
          onClick={resetAll}
          className="w-full justify-center md:order-1 md:w-auto"
        >
          {actions.logOut}
        </BtnOutline>
      </div>
    </CidScreen>
  );
}
