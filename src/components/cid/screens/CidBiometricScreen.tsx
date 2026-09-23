import { CidScreen } from "@/components/cid/CidScreen";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";

/*
 * CID_Biometric — Figma 6217:62835, 393 x 834.810546875.
 *
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. Rendered at /cid/biometric/ (Flow A)
 * and /cid/studentaid/biometric/ (Flow B, §9 PP-11, a plain instance of this
 * frame). Both prerendered; see CidTermsScreen for the full note.
 *
 * RE-SYNCED 2026-09-22, same rework as CID_TU: the six-dot rail is gone and
 * the `sub-step-readout` pill inside wizard-header replaces it. -60px overall.
 *
 * Geometry, verbatim from get_metadata / get_design_context on 6049:12228:
 *   top-nav actions  393 x 145      at y=0
 *   Main content     393 x 424      at y=145   px-[16px] py-[24px] gap-[8px]
 *     wizard-header  361 x 128      at y=24    gap-[24px]
 *       wizard-title     361 x 36   at y=0
 *       progress-stepper 361 x 68   at y=60    gap-[8px]
 *         step-bar         361 x 8  at y=0     fill 278.869
 *         step-labels      361 x 18 at y=16    current = Prerequisite Check
 *         sub-step-readout 184 x 26 at y=42    <- THE PILL, 6257:67925
 *     Frame 5        361 x 193      at y=160   pt-[0] pb-[24px] gap-[16px]
 *       "Biometric consent" 361 x 48 at y=0    32px Bold #212326  <- was #5f6368
 *       card-description 361 x 105  at y=64
 *     Frame 6        361 x 39       at y=361   gap-[8px]
 *   footer verified  393 x 265.81   at y=569
 *
 * ORDER NO LONGER DIFFERS FROM CID_TU. This frame used to put the dot stepper
 * ABOVE the heading — the exception logged in design/token-exceptions-phase3.md
 * — and the rework removed it. Heading first, exactly as on CID_TU.
 *
 * HIDDEN LAYER NOT RENDERED: instance 6049:12263 ("Check box") is
 * hidden="true" in Figma.
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — 2026-09-22. INVENTED; NOT IN FIGMA.
 *
 * Identical treatment to CID_TU, and for the same reason: this frame exists
 * only at 393 in Figma, and on a laptop it sat as a 480px strip between two
 * real 1440 frames. At and above 768 the content goes into the onboard page's
 * wizard chrome — see CidScreen for the full provenance note.
 *
 * Every `md:` class below is part of that invention; nothing else moved, and
 * the visual gate still measures this frame at 393 x 842 (dH +7 against 835,
 * the known Figma-vs-CSS line-box difference).
 *   Frame 5  `md:pb-0`  — the card's own 32px gap replaces the mobile 24px pad.
 *   Frame 6  onboard actions-row geometry: right aligned, natural widths,
 *            24px apart, 16px above, instead of two half-width buttons.
 * The 32px heading and 16px body are unchanged at every width.
 * ------------------------------------------------------------------------
 */
export function CidBiometricScreen({ service }: { service: ServiceConfig }) {
  const { biometric: copy, actions } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="6049:12228" subStep={copy.subStep}>
      {/* Frame 5 — 6049:12239 */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[16px] pt-0 pb-[24px] md:pb-0"
        data-node-id="6049:12239"
      >
        <p
          className="w-full shrink-0 text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
          data-node-id="6049:12240"
        >
          {copy.title}
        </p>

        {/* card-description 6049:12262 */}
        <div
          className="w-full shrink-0 text-[16px] font-normal text-[#5f6368] [word-break:break-word]"
          data-node-id="6049:12262"
        >
          <p className="mb-[16px] leading-[24px]">{copy.body}</p>
          {/* Inert, as on CID_TU — the design gives it no destination. */}
          <p
            className="cursor-default leading-[24px] text-[#004b87] underline decoration-solid decoration-from-font select-none [text-decoration-skip-ink:none] [text-underline-position:from-font]"
            data-demo-inert="true"
          >
            {copy.linkLabel}
          </p>
        </div>
      </div>

      {/* Frame 6 — 6049:12264 */}
      <div
        className="flex w-full shrink-0 items-start gap-[8px] md:items-center md:justify-end md:gap-[24px] md:pt-[16px]"
        data-node-id="6049:12264"
      >
        <BtnOutline
          href={routes.terms}
          className="min-w-px flex-[1_0_0] justify-center md:flex-none"
        >
          {actions.decline}
        </BtnOutline>
        {/*
         * RETARGETED 2026-09-22: "I agree" used to jump straight to
         * /cid/verified/, which skipped the identity verification itself. It
         * now enters the ID-document step.
         *
         * RE-POINTED the same day, /cid/document/ -> /cid/country/ (Figma
         * 6217:66054), the document-type / country-of-issuance screen that had
         * been gap G1 in design/verification-frame-map.md.
         *
         * RE-POINTED AGAIN 2026-09-23, /cid/country/ -> /cid/liveness/ (Figma
         * 6217:65268). The liveness check is what actually comes next: this
         * screen takes consent for a face scan ("A photo or video of your face
         * will be used to verify your identity"), and until now the demo took
         * that consent and then never scanned a face. The two liveness frames
         * sit first in the Yoti cluster, before `CID_ID1_Country`, and that
         * cluster's x-order is flow order.
         *
         * IT IS ALSO WHAT FIXES THE COUNTER. This screen's pill reads
         * "step 2 of 5" and /cid/country/'s reads "step 4 of 5"; the liveness
         * frames carry the only "step 3 of 5" in the file. The step is now
         * liveness -> liveness capture -> country -> document -> capture
         * instructions -> capture front -> capture back -> verified. See
         * src/lib/flow.ts.
         *
         * SAME-SERVICE, since 2026-09-23: `routes` is the CertifiO ID route set
         * for THIS service, so Flow B's consent screen advances to
         * /cid/studentaid/liveness/ and never crosses into Flow A's run.
         */}
        <BtnOutline
          href={routes.liveness}
          className="min-w-px flex-[1_0_0] justify-center md:flex-none"
        >
          {actions.accept}
        </BtnOutline>
      </div>
    </CidScreen>
  );
}
