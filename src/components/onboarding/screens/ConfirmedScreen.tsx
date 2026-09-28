import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ConfirmDetailsCard, type ConfirmDetailsNodeIds } from "@/components/onboarding/ConfirmDetailsCard";
import { getOnboardingCopy } from "@/lib/data/onboarding";
import {
  APP_ROUTES,
  serviceRoutes,
  type ServiceConfig,
  type ServiceId,
} from "@/lib/data/service-config";

/*
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-28.
 *
 *   /services/driver-vehicle/prerequisite/  NL-22  Figma 6217:81644
 *   /services/studentaid/prerequisite/      PP-21  Figma 6217:80071
 *
 * MOVED here from the Flow A page unchanged, with the service as a prop; the
 * `prereq-confirm` baseline must stay at 0.000%.
 *
 * PP-21 IS A REAL, MEASURED FRAME, unlike PP-04..PP-06 — read with get_metadata
 * and get_design_context on 6217:80071 / 6217:80074, 2026-09-28. It is NL-22's
 * frame with the StudentAidNL title and requirement; the requirement wraps to
 * two lines in the 448px label column Figma pins, so the card is 507 tall, not
 * 483, and the frame 1020.215 rather than 996.215. That is the only geometric
 * difference, and it is why the frame's pinned height is per service below.
 *
 * THIS IS WHERE FLOW B's PROCESSING SCREEN LANDS. /auth/loading/ is shared by
 * both flows; its one-shot auto-advance now routes to THIS screen for whichever
 * service armed it — see src/components/onboarding/ProcessingAdvance.tsx.
 * ====================================================================
 */

/**
 * The frame-specific bits: node ids and the main-content box.
 *
 * FLOW A keeps its PINNED 787px main (69 + 787 + 140.215 = 996.215), exactly
 * the class strings the page always had. FLOW B is NOT pinned: its measured
 * 811 (152 + 507 + 152) assumes the requirement wraps where Figma's fixed
 * 448px label box wraps it, and this build lets the label take the free width
 * instead (see ConfirmDetailsCard's Frame 1 note), so the card's height is
 * the browser's to decide. A 152px bottom pad gives the same symmetric well at
 * whatever height that is — the Summary / Terms / Required screens' method.
 */
const CONFIRMED_FRAME: Record<
  ServiceId,
  {
    mainNodeId: string;
    mainClassName: string;
    wellClassName: string;
    nodeIds: ConfirmDetailsNodeIds;
  }
> = {
  "driver-vehicle": {
    mainNodeId: "6217:81646",
    mainClassName: "h-[787px] w-full max-[1439px]:h-auto",
    wellClassName:
      "gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] max-[1439px]:pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]",
    nodeIds: {
      intro: "6217:81658",
      title: "6217:81659",
      description: "6217:81660",
      row: "6217:81661",
      rowLabel: "6217:81662",
      rowStatus: "6217:81663",
      actions: "6217:81664",
      cancel: "6217:81665",
      continue: "6217:81668",
    },
  },
  studentaid: {
    mainNodeId: "6217:80073",
    mainClassName: "w-full",
    wellClassName:
      "gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]",
    nodeIds: {
      intro: "6217:80085",
      title: "6217:80086",
      description: "6217:80867",
      row: "6217:80087",
      rowLabel: "6217:80865",
      rowStatus: "6217:80869",
      actions: "6217:80097",
      cancel: "6217:80098",
      continue: "6217:80101",
    },
  },
};

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
 * EXITS — all three controls navigate; none is decorative. Cancel and
 * Continue are THIS service's routes; Back is the one SHARED screen.
 *   Cancel   -> /services/<id>/             leave onboarding, same target the
 *                                           onboard frame's Cancel uses
 *   Back     -> /auth/loading/              step 6, the provider IDV-status
 *                                           page, exactly as the frame order
 *                                           in Figma implies
 *   Continue -> /services/<id>/confirmation/   step 8 (NL-23 / PP-22)
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
 * are NAMED variants on purpose — see the note in ChooseMethodScreen.tsx.
 *
 * No "use client": nothing on this page uses a hook.
 */
export function ConfirmedScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  const copy = getOnboardingCopy(service);
  const frame = CONFIRMED_FRAME[service.id];
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      {/* Main Content — 6217:81646 (NL-22) / 6217:80073 (PP-21) */}
      <main className={frame.mainClassName} data-node-id={frame.mainNodeId}>
        <div className={frame.wellClassName}>
          {/* wizard-card — 6217:81647 (NL-22) / 6217:80074 (PP-21) */}
          <ConfirmDetailsCard
            state="confirmed"
            service={service.id}
            wizardTitle={copy.wizardTitle}
            title={copy.prereqConfirm.title}
            intro={copy.prereqConfirm.intro}
            requirementLabel={copy.prereqConfirm.requirement.label}
            requirementStatus={copy.prereqConfirm.requirement.status}
            cancelHref={routes.page}
            backHref={APP_ROUTES.processing}
            continueHref={routes.confirmation}
            nodeIds={frame.nodeIds}
          />
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
