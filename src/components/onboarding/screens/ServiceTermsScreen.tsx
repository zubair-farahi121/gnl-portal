"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { TrackStep } from "@/components/onboarding/TrackStep";
import { WIZARD_ACTIONS, getOnboardingCopy } from "@/lib/data/onboarding";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { useDemoState } from "@/lib/demo-state";

/*
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-28.
 *
 *   /services/driver-vehicle/terms/  NL-05  src/app/services/driver-vehicle/terms/page.tsx
 *   /services/studentaid/terms/      PP-05  src/app/services/[serviceId]/terms/page.tsx
 *
 * MOVED here from the Flow A page unchanged, with the service as a prop. The
 * `terms` baseline must stay at 0.000% — that is the proof.
 *
 * WHAT DIFFERS FOR FLOW B, and where it comes from (§9 PP-05):
 *   document name / date / version   "StudentAidNL" / 2026-08-26 / 7   config
 *   consent paragraph                a DIFFERENT TEXT                  config
 *                                    (`terms.consent`, added today — DEMO_AUDIT.md
 *                                    "What Tier 2 inherits" item 1 asked for it)
 *   scopes                           SEVEN rows, not four              STUDENTAID_SCOPES
 * PP-05 has no Figma node — "screenshot (image in flow)" in Appendix A — so
 * its geometry is this screen's, which is itself derived (see below).
 *
 * "use client" MOVED HERE FROM THE PAGE, the same move CidVerifiedScreen made:
 * the ROUTE files are now plain server components, which is what lets
 * `/services/[serviceId]/terms/` resolve its param at build time and hand this
 * component a finished `ServiceConfig`.
 * ====================================================================
 */

/*
 * NL-05 — Terms and Conditions. Wizard step 2 of 4, **50 %**.
 *
 * ADDED 2026-09-23 (Tier 1 item 1.3). DEMO_AUDIT.md NL-05: *"Brief says KEEP —
 * wrong. Longest copy block in the demo; includes the checkbox + the §7.4
 * validation rule (X-11), neither of which exists anywhere."*
 *
 * ====================================================================
 * GEOMETRY IS **DERIVED FROM THE BRIEF, NOT MEASURED FROM A NODE**.
 *
 * The only thing in Figma for this screen is `6031:6243` — a pasted SCREENSHOT
 * of the live portal, 1440 x 1400.25. It is an image: no text layer, no child
 * nodes, nothing to measure.
 *
 * What it IS built from:
 *   copy   BUILD_BRIEF.md §8.1 NL-05, verbatim, including the whole consent
 *          paragraph, "Last modified: 2025-04-29" and "Version 4" — see TERMS
 *          in src/lib/data/onboarding.ts
 *   box    the shared `WizardCard` / `WizardHeader`, i.e. the MEASURED wizard
 *   scale  §11 tokens — 36px Bold heading, 28/42 Bold section title (§11.3),
 *          16/24 Regular body, 14px for the small print
 *   structure  confirmed by reading `6031:6243` this session: heading, document
 *          name, two metadata lines, a BORDERED SCROLL BOX holding the consent
 *          with the email as a link, the "By Accepting…" list of four scopes
 *          with icons, the checkbox, then Cancel / Back / I Consent right-
 *          aligned with "I Do Not Consent" on its own line beneath
 *
 * The 18px sub-heading is the same derived value NL-04 uses for its item
 * titles, for the same reason — §11.3 jumps 16 -> 24 with nothing between.
 * ====================================================================
 *
 * PROGRESS: `current={1}` -> (1 + 1) / 4 = **50 %**, bold label `Terms and
 * Conditions`. The screenshot's fill measures 404 of an 808px track — 50.0 %.
 *
 * ------------------------------------------------------------------------
 * THE VALIDATION RULE — §7.4, the reason this screen is 4 h and not 2.
 *
 * *"Terms: checkbox 'I have read and accept terms and condition' must be
 * ticked; otherwise show red text under it: 'To continue, you must agree to the
 * terms and conditions.'"*
 *
 * So "I Consent" is a BUTTON, not a link: it has to be able to refuse. On an
 * unticked box it shows the message and **does not navigate** — the
 * click-through gate asserts exactly that, because a validation message that
 * appears while the page changes underneath it is the same class of defect as
 * a control that does nothing.
 *
 * The message is `role="alert"`, so it is announced when it appears, and the
 * checkbox gains `aria-invalid` and `aria-describedby` pointing at it. Ticking
 * the box clears the message immediately rather than waiting for a second
 * attempt.
 * ------------------------------------------------------------------------
 *
 * EXITS — §8.1: "Buttons Cancel, Back, 'I Consent', link 'I Do Not Consent'."
 * Every one of them is THIS service's route (`serviceRoutes(service.id)`):
 *   Cancel          -> /services/<id>/                §7.4
 *   Back            -> /services/<id>/summary/        NL-04 / PP-04
 *   I Consent       -> /services/<id>/confirm-details/  NL-06 / PP-06, and
 *                      writes `termsAcceptedAt` into `gnl-demo:v1` (§12.2)
 *   I Do Not Consent-> /services/<id>/                §7.4, verbatim:
 *                      *"'I Do Not Consent' -> service page."*
 *
 * "use client" is required: the checkbox holds state and "I Consent" has to be
 * able to refuse. Nothing is read from localStorage during render — the store
 * is only WRITTEN, in a handler, after a click. See src/lib/demo-state.tsx.
 */
export function ServiceTermsScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  const copy = getOnboardingCopy(service);
  const terms = copy.terms;
  const router = useRouter();
  const { patchService, cancelOnboarding } = useDemoState();
  const [accepted, setAccepted] = useState(false);
  const [showError, setShowError] = useState(false);
  const checkboxId = useId();
  const errorId = useId();

  const onConsent = () => {
    if (!accepted) {
      setShowError(true);
      return;
    }
    patchService(service.id, {
      status: "in_progress",
      step: "confirm-details",
      termsAcceptedAt: new Date().toISOString(),
    });
    router.push(routes.confirmDetails);
  };

  return (
    <div className="gnl-desktop-shell">
      <TopNav />
      <TrackStep service={service.id} step="terms" />

      <main className="w-full">
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          <WizardCard>
            <WizardHeader title={copy.wizardTitle} current={1} size="lg" />

            {/* section-intro — heading, then the terms document's own name,
                then its two metadata lines in a tight 4px stack. */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
              <h1 className="w-full shrink-0 text-[36px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-md:text-[30px] max-xs:text-[26px]">
                {terms.title}
              </h1>
              <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
                {/* §11.3 "section title 28/42 Bold". */}
                <p className="w-full text-[28px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-xs:text-[24px]">
                  {terms.documentName}
                </p>
                <p className="w-full text-[16px] font-normal leading-[24px] text-[#5f6368]">
                  {terms.lastModifiedLabel}
                </p>
                <p className="w-full text-[16px] font-normal leading-[24px] text-[#5f6368]">
                  {terms.versionLabel}
                </p>
              </div>
            </div>

            {/*
             * THE SCROLLABLE CONSENT BOX — §8.1 "Scrollable consent".
             *
             * A FIXED HEIGHT, NOT `max-height`, AND 184px IS NOT ARBITRARY.
             *
             * It was `max-height` first. Two things were wrong with that, both
             * caught by looking at the 393 render beside the 1440 one:
             *
             *   1. At 1440 the paragraph is five lines and fits, so the box
             *      collapsed to its content and there was nothing to scroll —
             *      i.e. the "scrollable consent" §8.1 asks for only existed on
             *      a phone. The Figma screenshot (6031:6243) draws a FIXED box
             *      with the text at the top and clear empty space below it, which
             *      is what a scroll region is supposed to look like before you
             *      scroll it.
             *   2. At 393 the cap cut the text through the middle of a line —
             *      "as they become available in MyGovNL" sliced horizontally —
             *      which reads as a rendering fault rather than as more text
             *      below.
             *
             * 184 = 16px top padding + 7 lines x 24px. The clip therefore
             * lands exactly on a line boundary at every width, and the box is
             * the same box on desktop and on a phone.
             *
             * `tabIndex={0}` with a `group` label: a scrollable region that
             * cannot be reached from the keyboard is unreadable to anyone not
             * using a mouse, and this is the one box on the screen whose whole
             * purpose is to be read before the checkbox below it is ticked.
             */}
            <div
              className="box-border w-full shrink-0 overflow-y-auto rounded-[6px] bg-white p-[16px] shadow-[inset_0_0_0_1px_#d4d8da] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004b87]"
              style={{ height: "184px" }}
              tabIndex={0}
              role="group"
              aria-label={`${terms.title} — ${terms.documentName}`}
            >
              <p className="text-[16px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]">
                {terms.consentBody}
                {/*
                 * The address is drawn as a link in the screenshot. It is NOT a
                 * `mailto:` — on stage that opens the presenter's mail client
                 * over the demo. §7.6 / §10.5: out of scope -> toast, which is
                 * what `data-demo-inert` wires it to, with no per-control
                 * handler. It is a <button> so it is keyboard-operable.
                 */}
                <button
                  type="button"
                  data-demo-inert="true"
                  className="text-[16px] font-bold leading-[24px] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font] [word-break:break-word]"
                >
                  {terms.consentEmail}
                </button>
                {/*
                 * Flow B's paragraph (§9 PP-05) has a full stop AFTER the
                 * address; Flow A's ends on it. Rendered only when there is
                 * something to render, so Flow A's markup gets no extra node.
                 */}
                {terms.consentAfterEmail ? terms.consentAfterEmail : null}
              </p>
            </div>

            {/* "By Accepting This Policy You're Allowing To:" + the scopes.
                Flow A: SHARED_DATA_SCOPES — the same four rows, with the same
                16px icons and the same node ids, that the service page's Data &
                Privacy card already draws. Flow B: STUDENTAID_SCOPES, the seven
                rows of PP-03's consent-list. One source per service, per §10.2
                — see `TERMS_SCOPES` in src/lib/data/onboarding.ts. */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
              <p className="w-full text-[18px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]">
                {terms.scopesTitle}
              </p>
              <ul className="flex w-full list-none flex-col items-start gap-[12px] p-0">
                {terms.scopes.map((scope) => (
                  <li
                    key={scope.label}
                    className="flex w-full items-center gap-[12px]"
                    data-node-id={scope.nodeId}
                  >
                    <div className="relative size-[16px] shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt=""
                        className="absolute inset-0 block size-full max-w-none"
                        src={scope.icon}
                      />
                    </div>
                    <p className="min-w-px flex-1 text-[16px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]">
                      {scope.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* The checkbox, and the §7.4 validation message under it. */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
              <div className="flex w-full items-start gap-[12px]">
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={accepted}
                  aria-invalid={showError || undefined}
                  aria-describedby={showError ? errorId : undefined}
                  onChange={(e) => {
                    setAccepted(e.target.checked);
                    /* Clear the message the moment the box is ticked, rather
                       than leaving red text above a now-valid form. */
                    if (e.target.checked) setShowError(false);
                  }}
                  className="mt-[4px] size-[16px] shrink-0 accent-[#243746] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004b87]"
                />
                <label
                  htmlFor={checkboxId}
                  className="min-w-px flex-1 cursor-pointer text-[16px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]"
                >
                  {terms.checkboxLabel}
                </label>
              </div>
              {showError && (
                /* §7.4, verbatim, in #d32f2f (§11.2 `danger`). `role="alert"`
                   so it is announced the moment it appears. */
                <p
                  id={errorId}
                  role="alert"
                  className="w-full pl-[28px] text-[14px] font-normal leading-[21px] text-[color:var(--gnl-danger,#d32f2f)] [word-break:break-word] max-xs:pl-0"
                >
                  {terms.validationMessage}
                </p>
              )}
            </div>

            {/*
             * actions-row, then "I Do Not Consent" on its own line beneath it —
             * which is how the screenshot draws it, and what keeps the decline
             * path from sitting in the same visual group as the three ordinary
             * wizard controls.
             */}
            <div className="flex w-full shrink-0 flex-col items-stretch gap-[16px] pt-[16px]">
              <div className="flex w-full items-center justify-end gap-[24px] max-xs:flex-col-reverse max-xs:items-stretch max-xs:gap-[12px]">
                <Link
                  href={routes.page}
                  onClick={() => cancelOnboarding(service.id)}
                  className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[normal] text-[#004b87] max-xs:py-[10px] max-xs:text-center"
                >
                  {WIZARD_ACTIONS.cancelLabel}
                </Link>
                <BtnOutline
                  href={routes.summary}
                  className="max-xs:w-full max-xs:justify-center"
                >
                  {WIZARD_ACTIONS.backLabel}
                </BtnOutline>
                {/* A BUTTON, not a link — it has to be able to refuse. */}
                <BtnPrimary onClick={onConsent} size="lg" className="max-xs:w-full">
                  {terms.consentLabel}
                </BtnPrimary>
              </div>
              <div className="flex w-full justify-end max-xs:justify-center">
                {/* §7.4: "I Do Not Consent" -> service page. It is a DECLINE,
                    so it leaves the journey — the same reset Cancel performs,
                    and for the same reason. */}
                <Link
                  href={routes.page}
                  onClick={() => cancelOnboarding(service.id)}
                  className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[normal] text-[#004b87] max-xs:py-[10px]"
                >
                  {terms.declineLabel}
                </Link>
              </div>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
