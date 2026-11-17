import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { TrackStep } from "@/components/onboarding/TrackStep";
import { CancelLink } from "@/components/onboarding/CancelLink";
import { WIZARD_ACTIONS, getOnboardingCopy } from "@/lib/data/onboarding";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";
import {
  ACTIONS_ROW_DIVIDED,
  CANCEL_LINK,
  SECONDARY_TEXT,
  SECTION_TITLE,
  WIZARD_WELL,
} from "@/components/onboarding/gnwt-wizard";

/*
 * Summary — wizard step 1 of 4, 25 %. One component, two routes:
 *   /services/driver-vehicle/summary/  Figma 24:48794 (Flow 1)
 *   /services/studentaid/summary/      Figma 40:76892 (Flow 2)
 *
 * GNWT RE-SKIN — release-2, 2026-11-16 (gnwt-specs/B-wizard.md §2.1, §5.9).
 *   wizard header   35px title, black fill at 25 %, "Summary" bold
 *   section title   "Welcome to <service>", 29px Bold #333
 *   note            "Note: you may opt out …", 16/24 #676869
 *   block           "Terms and Conditions" (20px Bold #333, ~28 line-height)
 *                   with its body directly under it (16/24 #676869)
 *   actions         1px #cacbcd divider, then Cancel (link) + the primary.
 *                   The primary reads "I Consent" on Flow 1 and "Continue" on
 *                   Flow 2 — each frame as drawn (open question for the
 *                   designer). It goes to Terms either way. No Back.
 *
 * The GNL intro sentence and the three numbered items are gone.
 *
 * EXITS (unchanged):
 *   Cancel  -> /services/<id>/        §7.4, resets onboarding (CancelLink)
 *   primary -> /services/<id>/terms/
 */
export function ServiceSummaryScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  const copy = getOnboardingCopy(service);
  return (
    <div className="gnl-desktop-shell">
      <TopNav />
      {/* Renders nothing — records `in_progress` / `summary` in `gnl-demo:v1`. */}
      <TrackStep service={service.id} step="summary" />

      <main className="w-full">
        <div className={WIZARD_WELL}>
          <WizardCard>
            <WizardHeader title={copy.wizardTitle} current={0} size="lg" />

            <h1 className={SECTION_TITLE}>{copy.summary.title}</h1>

            {/* Note, then the Terms block, 16px apart. */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
              <p className={SECONDARY_TEXT}>{copy.summary.note}</p>
              {copy.summary.items.map((item) => (
                <div key={item.title} className="flex w-full flex-col items-start">
                  <h2 className="w-full text-[20px] font-bold leading-[28px] text-[#333333] [overflow-wrap:anywhere]">
                    {item.title}
                  </h2>
                  <p className={SECONDARY_TEXT}>{item.body}</p>
                </div>
              ))}
            </div>

            <div className={ACTIONS_ROW_DIVIDED}>
              <CancelLink service={service.id} href={routes.page} className={CANCEL_LINK}>
                {WIZARD_ACTIONS.cancelLabel}
              </CancelLink>
              <BtnPrimary href={routes.terms} size="lg" tone="gnwt" className="max-xs:w-full">
                {copy.summary.ctaLabel}
              </BtnPrimary>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
