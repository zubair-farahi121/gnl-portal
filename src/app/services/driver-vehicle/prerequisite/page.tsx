import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ConfirmDetailsCard } from "@/components/onboarding/ConfirmDetailsCard";
import { PREREQ_CONFIRM, WIZARD_TITLE } from "@/lib/data/onboarding";
import { APP_ROUTES, serviceRoutes } from "@/lib/data/service-config";

/* Destinations only — PP-21 is this frame with the StudentAidNL requirement
 * copy, which already comes from the config via PREREQ_CONFIRM. §12.1. */
/*
 * `"driver-vehicle"` is a LITERAL here, not `DEFAULT_SERVICE_ID`, and that is
 * deliberate: this page lives at `src/app/services/driver-vehicle/`, so the
 * service is fixed by the route directory itself. Resolving it from the
 * default would make this page silently follow whatever the CertifiO ID
 * screens happen to be running, which is a different thing.
 *
 * Flow B gets its own `src/app/services/studentaid/` directory (or the whole
 * folder becomes a `[serviceId]` segment) passing `"studentaid"` here. Either
 * way, everything below reads from the config and nothing else changes.
 */
const ROUTES = serviceRoutes("driver-vehicle");

/*
 * NL-22 — Confirm some details: **Confirmed**.
 * Figma 6217:81644 `Driver and Vehicle_Prerequisite confirmed`,
 * 1440 x 996.2152099609375.
 *
 * ADDED 2026-09-22. Step 7 of the verification journey, and the last screen
 * the flow was missing: `/auth/loading/` used to hand straight to
 * `/services/driver-vehicle/confirmation/`.
 *
 * REFACTORED 2026-09-23 (Tier 1 item 1.1). The wizard card is now
 * `ConfirmDetailsCard`, shared with NL-06 `/services/driver-vehicle/
 * confirm-details/` — BUILD_BRIEF.md §8.1's *"one component, two states"*. The
 * markup MOVED, byte for byte; nothing on this screen changed. That is checked
 * rather than asserted: `prereq-confirm` is a frozen baseline and `npm run
 * diff` must still report 0.000% on it. All the measured geometry and the
 * apostrophe notes now live on the component.
 *
 * NOT A VARIANT OF THE CONFIRMATION FRAME. 6217:81644 and 6217:82446 sit side
 * by side on the same canvas row at x=23416.06 and x=25108.81, in that order,
 * and differ on everything: the stepper is on **Prerequisite Check** here and
 * **Ready to Use** there, the heading is "Confirm some details" against
 * "Success!", and the actions are Cancel/Back/Continue against Back/Go to
 * Service. A prior audit had them down as the same screen rebuilt; they are
 * not. See design/verification-frame-map.md §4.
 *
 * THIS IS A 1440 DESKTOP WIZARD FRAME, NOT A CID SCREEN. It does not use
 * CidScreen: there is a real desktop frame here, so nothing about this page is
 * invented chrome.
 *
 * Frame maths: top-nav 69 + Main Content 787 + footer 140.215 = 996.215, and
 * the card sits in a SYMMETRIC 152px well — 152 + 483 = 635 of a 787px main,
 * leaving 152 below. Same arrangement as the onboard frame.
 *
 * ------------------------------------------------------------------------
 * EXITS — all three controls navigate; none is decorative.
 *   Cancel   -> /services/driver-vehicle/   leave onboarding, same target the
 *                                           onboard frame's Cancel uses
 *   Back     -> /auth/loading/              step 6, the provider IDV-status
 *                                           page, exactly as the frame order
 *                                           in Figma implies
 *   Continue -> /services/driver-vehicle/confirmation/   step 8
 *
 * BACK IS WHY THE NL-21 AUTO-ADVANCE IS ARMED ONE-SHOT. `Back` points at
 * /auth/loading/, and that screen's 2.6s timer was REMOVED on 2026-09-22
 * precisely because it turned this Back into a round trip. §8.3 asks for the
 * advance again; it was re-introduced on 2026-09-23 behind a one-shot flag
 * (`pendingAdvance` in src/lib/demo-state.tsx) that is consumed on the way
 * forward, so arriving here-then-Back finds it already spent and the screen
 * stays put. The click-through gate asserts both directions.
 * ------------------------------------------------------------------------
 *
 * RESPONSIVE: the 152px well steps 152 -> 96 -> 48 -> 32 and the main's pinned
 * height is released below the design width. Inert at 1440. `max-md` / `max-xs`
 * are NAMED variants on purpose — see the note in ../onboard/page.tsx.
 *
 * No "use client": nothing on this page uses a hook.
 */
export default function PrerequisitePage() {
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      {/* Main Content 6217:81646 */}
      <main className="h-[787px] w-full max-[1439px]:h-auto" data-node-id="6217:81646">
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] max-[1439px]:pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          {/* wizard-card 6217:81647 */}
          <ConfirmDetailsCard
            state="confirmed"
            service="driver-vehicle"
            wizardTitle={WIZARD_TITLE}
            title={PREREQ_CONFIRM.title}
            intro={PREREQ_CONFIRM.intro}
            requirementLabel={PREREQ_CONFIRM.requirement.label}
            requirementStatus={PREREQ_CONFIRM.requirement.status}
            cancelHref={ROUTES.page}
            backHref={APP_ROUTES.processing}
            continueHref={ROUTES.confirmation}
            nodeIds={{
              intro: "6217:81658",
              title: "6217:81659",
              description: "6217:81660",
              row: PREREQ_CONFIRM.requirement.nodeId,
              rowLabel: PREREQ_CONFIRM.requirement.labelNodeId,
              rowStatus: PREREQ_CONFIRM.requirement.statusNodeId,
              actions: "6217:81664",
              cancel: "6217:81665",
              continue: "6217:81668",
            }}
          />
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
