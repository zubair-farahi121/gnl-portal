import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ConfirmDetailsCard } from "@/components/onboarding/ConfirmDetailsCard";
import { PREREQ_REQUIRED, WIZARD_TITLE } from "@/lib/data/onboarding";
import { serviceRoutes } from "@/lib/data/service-config";

/*
 * `"driver-vehicle"` is a LITERAL here, not `DEFAULT_SERVICE_ID` — this page
 * lives at `src/app/services/driver-vehicle/`, so the route directory fixes
 * the service. Same convention as the four pages beside it; Flow B gets its own
 * directory (or the folder becomes a `[serviceId]` segment) passing
 * `"studentaid"`, and PP-06 needs no other change.
 */
const SERVICE_ID = "driver-vehicle" as const;
const ROUTES = serviceRoutes(SERVICE_ID);

/*
 * NL-06 — Confirm Some Details: **Required**. Wizard step 3 of 4, 75 %.
 *
 * ADDED 2026-09-23 (Tier 1 item 1.1). DEMO_AUDIT.md NL-06: *"Brief says K/B —
 * it is B."* No route, no component and no copy existed; this and the two
 * screens before it are why the four-step bar named steps the demo could not
 * show (X-09).
 *
 * ====================================================================
 * GEOMETRY IS **DERIVED FROM THE BRIEF, NOT MEASURED FROM A NODE**.
 *
 * The only thing in Figma for this screen is `6031:6301` — a pasted SCREENSHOT
 * of the live portal, 1440 x 979.5. It is an image: no text layer, no child
 * nodes, nothing `get_design_context` can read and nothing to measure. So
 * nothing on this page was taken off a ruler.
 *
 * What it IS built from:
 *   copy       BUILD_BRIEF.md §8.1 NL-06, verbatim (see PREREQ_REQUIRED)
 *   box        the MEASURED Confirmed frame 6217:81644, reused unchanged —
 *              because §8.1 requires one component with two states, and the
 *              Confirmed state is the one that was measured
 *   structure  confirmed by reading `6031:6301` this session: heading, intro
 *              sentence, one label/status row, Cancel / Back / Continue
 *              right-aligned, four-step bar at 75 %
 *
 * The screenshot draws a hairline under the requirement row. 6217:81644 — the
 * redrawn frame, and the measured one — draws none, so none is drawn here:
 * the two states have to be the same screen. See ConfirmDetailsCard.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * EXITS — §8.1: "Buttons Cancel, Back, Continue -> NL-07."
 *   Cancel   -> /services/driver-vehicle/          §7.4, leave onboarding
 *   Back     -> /services/driver-vehicle/terms/    NL-05, the previous step
 *   Continue -> /services/driver-vehicle/onboard/  NL-07, choose the method
 *
 * The Confirmed twin's three exits are different (service page / provider
 * status / Ready to Use) and are passed by that page. The component holds no
 * destination of its own.
 * ------------------------------------------------------------------------
 *
 * RESPONSIVE: the 152px well steps 152 -> 96 -> 48 -> 32, mirroring every other
 * 1440 wizard frame, and the main's pinned height is released below the design
 * width. Height is NOT pinned at all here — there is no measured frame height
 * to pin it to — so `min-h` carries the well instead and the footer still sits
 * at the bottom of a short page via `.gnl-desktop-shell`.
 *
 * No "use client": nothing on this page uses a hook.
 */
export default function ConfirmDetailsRequiredPage() {
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      <main className="w-full">
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          <ConfirmDetailsCard
            state="required"
            service={SERVICE_ID}
            wizardTitle={WIZARD_TITLE}
            title={PREREQ_REQUIRED.title}
            intro={PREREQ_REQUIRED.intro}
            requirementLabel={PREREQ_REQUIRED.requirement.label}
            requirementStatus={PREREQ_REQUIRED.requirement.status}
            cancelHref={ROUTES.page}
            backHref={ROUTES.terms}
            continueHref={ROUTES.onboard}
          />
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
