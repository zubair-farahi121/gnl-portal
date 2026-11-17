"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { TrackStep } from "@/components/onboarding/TrackStep";
import { CancelLink } from "@/components/onboarding/CancelLink";
import { ScopeIcon } from "@/components/onboarding/ScopeIcon";
import {
  ACTIONS_ROW_DIVIDED,
  BODY_TEXT,
  CANCEL_LINK,
  SECONDARY_TEXT,
  SECTION_TITLE,
  WIZARD_WELL,
} from "@/components/onboarding/gnwt-wizard";
import { WIZARD_ACTIONS, getOnboardingCopy } from "@/lib/data/onboarding";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { useDemoState } from "@/lib/demo-state";

/*
 * Terms and Conditions — wizard step 2 of 4, 50 %. One component, two routes:
 *   /services/driver-vehicle/terms/  Figma 24:49022 (Flow 1)
 *   /services/studentaid/terms/      Figma 42:76944 (Flow 2)
 *
 * GNWT RE-SKIN — release-2, 2026-11-16 (gnwt-specs/B-wizard.md §2.2, §4,
 * §5.10). Top to bottom:
 *   "Terms and Conditions" 29px Bold #333
 *   document block (no gaps): name 18/24 Regular, "Last modified: …",
 *     "Version …" 16/24, all #333
 *   scroll box: ~192 tall, 1px #e0e4e6, radius 4, padding 8, resizable
 *     vertically; the GNWT privacy notice, 16/24 #333, 16px between
 *     paragraphs, Act names in italics. The last paragraph of each notice is
 *     cut off in Figma (TODO for the designer, see the service config).
 *   "This service receives the following data from your profile:" ~18px #333
 *   scope rows (Flow 1 only; Flow 2's frame draws none): black 16px icon,
 *     12px gap, label 16/24 #676869, 4px between rows
 *   consent checkbox: 24px, checked = #005d8f with a white tick, 3px focus
 *     ring rgba(0,93,143,.5); label #333 ("condition" singular, as drawn)
 *   1px #cacbcd divider + Cancel (link) · Back (ghost) · I Consent (black)
 *
 * Gone: the GNL consent paragraph, the e-mail link, the "By Accepting This
 * Policy…" heading and "I Do Not Consent".
 *
 * THE VALIDATION RULE (§7.4) IS UNCHANGED. "I Consent" is a BUTTON: on an
 * unticked box it shows "To continue, you must agree to the terms and
 * conditions." (14px, #b11721, role="alert") and does not navigate. Ticking
 * the box clears the message.
 *
 * EXITS (unchanged):
 *   Cancel    -> /services/<id>/                 §7.4, resets onboarding
 *   Back      -> /services/<id>/summary/
 *   I Consent -> /services/<id>/confirm-details/ and writes `termsAcceptedAt`
 *
 * "use client": the checkbox holds state and "I Consent" has to be able to
 * refuse. The store is only WRITTEN, in a handler, after a click.
 */

export function ServiceTermsScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  const copy = getOnboardingCopy(service);
  const terms = copy.terms;
  const router = useRouter();
  const { patchService } = useDemoState();
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
        <div className={WIZARD_WELL}>
          <WizardCard>
            <WizardHeader title={copy.wizardTitle} current={1} size="lg" />

            {/* Heading, document block and the scroll box, 16px apart. */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
              <h1 className={SECTION_TITLE}>{terms.title}</h1>

              <div className="flex w-full shrink-0 flex-col items-start">
                {terms.showDocumentName ? (
                  <p className="w-full text-[18px] font-normal leading-[24px] text-[#333333] [overflow-wrap:anywhere]">
                    {terms.documentName}
                  </p>
                ) : null}
                <p className={BODY_TEXT}>{terms.lastModifiedLabel}</p>
                <p className={BODY_TEXT}>{terms.versionLabel}</p>
              </div>

              {/*
               * THE SCROLL BOX. A fixed height (not max-height) so it reads as
               * a scroll region with more below, as drawn; `resize-y` gives the
               * grip bottom-right. `tabIndex={0}` + a labelled group so the
               * notice can be scrolled from the keyboard.
               */}
              <div
                className="box-border h-[192px] min-h-[96px] w-full shrink-0 resize-y overflow-y-auto rounded-[4px] bg-white px-[8px] pt-[8px] pb-[8px] shadow-[inset_0_0_0_1px_#e0e4e6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
                tabIndex={0}
                role="group"
                aria-label={`${terms.title} — ${terms.documentName}`}
              >
                {terms.paragraphs.map((runs, i) => (
                  <p
                    key={i}
                    className={`${BODY_TEXT} ${i === terms.paragraphs.length - 1 ? "" : "mb-[16px]"}`}
                  >
                    {runs.map((run, j) =>
                      run.italic ? <em key={j}>{run.text}</em> : <span key={j}>{run.text}</span>,
                    )}
                  </p>
                ))}
              </div>
            </div>

            {/* Data heading + scope rows, then the consent checkbox. */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[24px]">
              <div className="flex w-full flex-col items-start gap-[16px]">
                <p className="w-full text-[18px] font-normal leading-[27px] text-[#333333] [overflow-wrap:anywhere]">
                  {terms.scopesTitle}
                </p>
                {terms.scopes.length > 0 ? (
                  <ul className="flex w-full list-none flex-col items-start gap-[4px] p-0">
                    {terms.scopes.map((scope) => (
                      <li key={scope.label} className="flex w-full items-center gap-[12px]">
                        <ScopeIcon icon={scope.icon} />
                        <p className={`min-w-px flex-1 ${SECONDARY_TEXT}`}>{scope.label}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {/* The checkbox, and the §7.4 validation message under it. */}
              <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                <div className="flex w-full items-start gap-[8px]">
                  {/* A native checkbox, restyled: 24px, #005d8f when checked,
                      with a white tick drawn over it. */}
                  <span className="relative flex size-[24px] shrink-0">
                    <input
                      id={checkboxId}
                      type="checkbox"
                      checked={accepted}
                      aria-invalid={showError || undefined}
                      aria-describedby={showError ? errorId : undefined}
                      onChange={(e) => {
                        setAccepted(e.target.checked);
                        /* Clear the message the moment the box is ticked. */
                        if (e.target.checked) setShowError(false);
                      }}
                      className="peer m-0 size-[24px] shrink-0 cursor-pointer appearance-none rounded-[3px] border border-[#676869] bg-white checked:border-[#005d8f] checked:bg-[#005d8f] focus-visible:shadow-[0_0_0_3px_rgba(0,93,143,0.5)] focus-visible:outline-none"
                    />
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-[4px] hidden size-[16px] text-white peer-checked:block"
                      fill="currentColor"
                    >
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </span>
                  <label
                    htmlFor={checkboxId}
                    className="min-w-px flex-1 cursor-pointer text-[16px] font-normal leading-[24px] text-[#333333] [overflow-wrap:anywhere]"
                  >
                    {terms.checkboxLabel}
                  </label>
                </div>
                {showError && (
                  /* §7.4, verbatim, in #b11721. `role="alert"` so it is
                     announced the moment it appears. */
                  <p
                    id={errorId}
                    role="alert"
                    className="w-full pl-[32px] text-[14px] font-normal leading-[21px] text-[#b11721] [overflow-wrap:anywhere] max-xs:pl-0"
                  >
                    {terms.validationMessage}
                  </p>
                )}
              </div>
            </div>

            <div className={ACTIONS_ROW_DIVIDED}>
              <CancelLink service={service.id} href={routes.page} className={CANCEL_LINK}>
                {WIZARD_ACTIONS.cancelLabel}
              </CancelLink>
              <BtnOutline href={routes.summary} variant="ghost" className="max-xs:w-full">
                {WIZARD_ACTIONS.backLabel}
              </BtnOutline>
              {/* A BUTTON, not a link — it has to be able to refuse. */}
              <BtnPrimary onClick={onConsent} size="lg" tone="gnwt" className="max-xs:w-full">
                {terms.consentLabel}
              </BtnPrimary>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
