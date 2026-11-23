import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { MarkOnboarded } from "@/components/onboarding/TrackStep";
import {
  ACTIONS_ROW_DIVIDED,
  SECONDARY_TEXT,
  SECTION_TITLE,
  WIZARD_WELL,
} from "@/components/onboarding/gnwt-wizard";
import { WIZARD_ACTIONS } from "@/lib/data/onboarding";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";

/*
 * Ready to Use — "Success!". Wizard step 4 of 4, 100 %. One component, two routes:
 *   /services/driver-vehicle/confirmation/  Figma 32:55108 (Flow 1)
 *   /services/studentaid/confirmation/      Figma 44:81091 (Flow 2)
 *
 * GNWT RE-SKIN — release-2, 2026-11-16 (gnwt-specs/B-wizard.md §2.8, §5.12).
 *   "Success!" 29px Bold #333; body 16/1.5 #676869 with a STRAIGHT apostrophe
 *   ("it's", read from the raster, medium confidence); 1px #cacbcd divider;
 *   Back (ghost) + "Go to Service <service>" (black). No Cancel.
 *
 * `MarkOnboarded` (unchanged) records the service as `onboarded` on mount.
 *
 * EXITS (unchanged):
 *   Back        -> /services/<id>/prerequisite/   the Confirmed screen
 *   Go to Service -> /services/<id>/?verified=1   the Trusted service page
 */
export function ReadyToUseScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  return (
    <div className="gnl-desktop-shell">
      <TopNav />
      {/* Renders nothing — marks the service `onboarded` in `gnl-demo:v1`. */}
      <MarkOnboarded service={service.id} />

      <main className="w-full" data-node-id="6102:101146">
        <div className={WIZARD_WELL}>
          <WizardCard>
            <WizardHeader title={service.title} current={3} size="lg" />

            <div
              className="flex w-full shrink-0 flex-col items-start gap-[8px]"
              data-node-id="6102:101158"
            >
              <p className={SECTION_TITLE} data-node-id="6102:101159">
                Success!
              </p>
              <p className={SECONDARY_TEXT} data-node-id="6102:101160">
                Service has been successfully onboarded, and it&apos;s ready to be used.
              </p>
            </div>

            <div className={ACTIONS_ROW_DIVIDED} data-node-id="6102:101188">
              <BtnOutline href={routes.prerequisite} variant="ghost" className="max-xs:w-full">
                {WIZARD_ACTIONS.backLabel}
              </BtnOutline>
              <BtnPrimary
                href={routes.pageVerified}
                size="lg"
                tone="gnwt"
                className="max-md:min-w-px max-md:shrink max-md:text-center max-xs:w-full"
              >
                {service.goToServiceLabel}
              </BtnPrimary>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
