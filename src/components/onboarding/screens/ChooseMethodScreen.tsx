/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { ASSETS } from "@/lib/assets";
import { WIZARD_ACTIONS, getOnboardingCopy, type IdvOption } from "@/lib/data/onboarding";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";
import { CancelLink } from "@/components/onboarding/CancelLink";
import { MethodRadio } from "@/components/onboarding/MethodRadio";
import { ACTIONS_ROW, CANCEL_LINK, WIZARD_WELL } from "@/components/onboarding/gnwt-wizard";

/*
 * Prerequisite Check — "Services" (method choice). Wizard step 3 of 4, 75 %.
 * One component, two routes:
 *   /services/driver-vehicle/onboard/  Figma 25:51591 (Flow 1)
 *   /services/studentaid/onboard/      Figma 42:77032 (Flow 2)
 *
 * GNWT RE-SKIN — release-2, 2026-11-16 (gnwt-specs/B-wizard.md §2.4, §5.11).
 *   section intro   "Services" 29px Bold #212326 / subtitle 16px #212326, gap 8
 *   ONE option card "GNWT Identity Verification Service" (18px Bold #005d8f),
 *                   radio selected (#005d8f), "This verification service is
 *                   able to verify:" + one bullet (16px #676869), and the GNWT
 *                   logo (200 x 43.421) on the right. Card: 1px #d4d8da,
 *                   radius 6, padding 24.
 *   actions         Cancel (link) · Back (ghost) · Continue (black)
 *
 * The GNL MRD / MCP cards, the grey GNL crest and the two GNL type scales are
 * gone. The radiogroup stays (a one-item group, the card is its <label>).
 *
 * EXITS (unchanged):
 *   Cancel   -> /services/<id>/                 §7.4, resets onboarding
 *   Back     -> /services/<id>/confirm-details/
 *   Continue -> this service's CertifiO hand-off (the same target as the card)
 *
 * No "use client": nothing on this page uses a hook.
 */

/** service-item-card. Stroke painted inside, as an inset shadow. */
const OPTION_CARD =
  "box-border flex w-full items-center justify-between gap-[24px] rounded-[6px] bg-white p-[24px] shadow-[inset_0_0_0_1px_#d4d8da] max-md:flex-col max-md:items-start max-md:gap-[16px] max-xs:p-[16px]";

const OPTION_TITLE = "text-[18px] font-bold leading-[normal] text-[#005d8f]";

const SMALL_TEXT =
  "text-[16px] font-normal leading-[1.5] text-[#676869] [overflow-wrap:anywhere]";

/** The GNWT logo — the same art as the header logo, 200 x 43.421. */
function GnwtLogo() {
  return (
    <img
      alt=""
      src={ASSETS.gnwtLogo}
      className="block h-[43.421px] w-[200px] max-w-full shrink-0 object-contain"
    />
  );
}

function titleId(option: IdvOption) {
  return `idv-method-${option.nodeId.replace(/[^0-9a-z]/gi, "-")}-title`;
}

function OptionBody({ option, group }: { option: IdvOption; group: string }) {
  return (
    <>
      {/* service-details */}
      <div className="flex min-w-px flex-1 flex-col items-start gap-[12px] max-md:w-full">
        {/* title row: radio + title */}
        <div className="flex min-w-0 max-w-full items-center gap-[12px]">
          <MethodRadio
            name={group}
            checked={option.selected}
            href={option.href}
            labelledBy={titleId(option)}
          />
          <p id={titleId(option)} className={`min-w-px ${OPTION_TITLE}`}>
            {option.title}
          </p>
        </div>

        {/* list wrapper — pl-[28px] aligns the list under the title, not the radio. */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[8px] pl-[28px]">
          <p className={`w-full ${SMALL_TEXT}`}>{option.verifyIntro}</p>
          {option.bullets.map((bullet) => (
            <div key={bullet} className="flex w-full items-center gap-[8px]">
              <span aria-hidden="true" className="block size-[4px] shrink-0 rounded-full bg-[#676869]" />
              <p className={`min-w-px flex-1 ${SMALL_TEXT}`}>{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* crest-container */}
      <div className="flex shrink-0 flex-col items-center justify-center max-md:w-full max-md:items-start max-md:pl-[28px]">
        <GnwtLogo />
      </div>
    </>
  );
}

function OptionCard({ option, group }: { option: IdvOption; group: string }) {
  if (option.href) {
    return (
      <label
        className={`${OPTION_CARD} cursor-pointer`}
        data-node-id={option.nodeId}
        data-href={option.href}
      >
        <OptionBody option={option} group={group} />
      </label>
    );
  }
  return (
    <label
      className={`${OPTION_CARD} cursor-default select-none`}
      data-node-id={option.nodeId}
      data-demo-inert="true"
    >
      <OptionBody option={option} group={group} />
    </label>
  );
}

export function ChooseMethodScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  const copy = getOnboardingCopy(service);
  const { nodeIds } = copy.methodStep;
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      <main className="w-full" data-node-id={nodeIds.main}>
        <div className={WIZARD_WELL}>
          <WizardCard>
            <WizardHeader title={copy.wizardTitle} current={2} size="lg" />

            {/* section-intro */}
            <div
              className="flex w-full shrink-0 flex-col items-start gap-[8px]"
              data-node-id={nodeIds.sectionIntro}
            >
              <p
                className="w-full text-[29px] font-bold leading-[1.5] text-[#212326] [overflow-wrap:anywhere] max-xs:text-[24px]"
                data-node-id={nodeIds.sectionTitle}
              >
                {copy.sectionIntro.title}
              </p>
              <p
                className="w-full text-[16px] font-normal leading-[1.5] text-[#212326] [overflow-wrap:anywhere]"
                data-node-id={nodeIds.sectionSubtitle}
              >
                {copy.sectionIntro.subtitle}
              </p>
            </div>

            {/* The option card(s), as a radiogroup. */}
            <div
              className="flex w-full shrink-0 flex-col items-start gap-[24px]"
              role="radiogroup"
              aria-label={copy.sectionIntro.title}
              data-node-id={nodeIds.options}
            >
              {copy.idvOptions.map((option) => (
                <OptionCard key={option.nodeId} option={option} group={`idv-method-${service.id}`} />
              ))}
            </div>

            <div className={ACTIONS_ROW} data-node-id={nodeIds.actions}>
              <CancelLink
                service={service.id}
                href={routes.page}
                className={CANCEL_LINK}
                nodeId={nodeIds.cancel}
              >
                {WIZARD_ACTIONS.cancelLabel}
              </CancelLink>
              <BtnOutline href={routes.confirmDetails} variant="ghost" className="max-xs:w-full">
                {WIZARD_ACTIONS.backLabel}
              </BtnOutline>
              <BtnPrimary
                href={copy.methodContinueHref}
                size="lg"
                tone="gnwt"
                className="max-xs:w-full"
              >
                {WIZARD_ACTIONS.continueLabel}
              </BtnPrimary>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
