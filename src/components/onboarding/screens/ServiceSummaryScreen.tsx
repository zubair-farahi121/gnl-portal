import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { TrackStep } from "@/components/onboarding/TrackStep";
import { CancelLink } from "@/components/onboarding/CancelLink";
import { WIZARD_ACTIONS, getOnboardingCopy } from "@/lib/data/onboarding";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";

/*
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-28. The CID screens' pattern
 * (src/components/cid/screens/), applied to the desktop wizard.
 *
 *   /services/driver-vehicle/summary/  NL-04  src/app/services/driver-vehicle/summary/page.tsx
 *   /services/studentaid/summary/      PP-04  src/app/services/[serviceId]/summary/page.tsx
 *
 * The markup below MOVED here from the Flow A page unchanged; the only edits
 * are that the service, its routes and its copy are now a prop instead of a
 * module literal. `summary` is a frozen baseline and `npm run diff` must stay
 * at 0.000% on it — that is the proof the move was faithful.
 *
 * PP-04 has NO Figma node at all (§9: "As NL-04 with 'Welcome to
 * StudentAidNL'"), so Flow B's copy of this screen is this screen with a
 * different title and different destinations, and nothing else.
 * ====================================================================
 */

/*
 * NL-04 — Summary. Wizard step 1 of 4, **25 %**.
 *
 * ADDED 2026-09-23 (Tier 1 item 1.2). DEMO_AUDIT.md NL-04: *"Brief says KEEP —
 * the brief is wrong. No route, no component, no copy."* This is the screen
 * "Onboard" should always have led to, and the reason the progress bar's first
 * label was unreachable (X-09).
 *
 * ====================================================================
 * GEOMETRY IS **DERIVED FROM THE BRIEF, NOT MEASURED FROM A NODE**.
 *
 * The only thing in Figma for this screen is `6031:6242` — a pasted SCREENSHOT
 * of the live portal, 1440 x 1155.75. It is an image: no text layer, no child
 * nodes, nothing to measure and nothing to diff a baseline against.
 *
 * What it IS built from:
 *   copy   BUILD_BRIEF.md §8.1 NL-04, verbatim — see SUMMARY in
 *          src/lib/data/onboarding.ts, which also records why the three
 *          numbered items render as title-over-body
 *   box    the shared `WizardCard` / `WizardHeader`, i.e. the MEASURED
 *          6031:6304 / 6217:81644 / 6217:82446 wizard — 820 x auto, p-[40px],
 *          gap-[32px], 28px centred title, 16px bar, 16px labels (`size="lg"`)
 *   scale  §11 tokens: 36px Bold heading (the same slot NL-06 and NL-22 use),
 *          16/24 Regular body on #5f6368
 *   structure  confirmed by reading `6031:6242` this session — heading, intro
 *          sentence, three numbered items, Cancel + Continue right-aligned,
 *          four-step bar with Summary bold and the fill at one quarter
 *
 * THE ONE INVENTED VALUE is the 18px item title. §11.3's scale jumps 16 -> 24
 * with nothing between, and 24px Bold would out-shout the 36px heading three
 * times over; the screenshot draws the item titles at about half the heading.
 * 18px Bold is the nearest value the brief uses anywhere (§8.1 NL-01, "category
 * titles Bold 18") and it reproduces that proportion. Flagged for Tatyana.
 * ====================================================================
 *
 * PROGRESS: `current={0}` -> (0 + 1) / 4 = **25 %**, and the bold label is
 * `Summary`. The screenshot's fill measures 202 of an 808px track — 25.0 % —
 * so the even-quarters formula the rest of the wizard uses is right here too.
 *
 * ------------------------------------------------------------------------
 * Q-01 — "IS NOTIFICATION SETTINGS A WIZARD STEP?" — ANSWERED **NO**, AND THE
 * TENSION IS REAL.
 *
 * `6102:101142` draws a FIVE-step bar that includes "Notification Settings".
 * The built wizard and all three image-only frames — this one, NL-05 and NL-06
 * — draw FOUR. The brief settles the build, §8.1 NL-04 last line: *"The wizard
 * has 4 steps; there is no Notification Settings step in this demo."*
 *
 * So: FOUR steps in the bar, and item 3 stays in the body copy below, which is
 * exactly what §8.1's own copy block does. No fifth step is invented on a
 * guess. The contradiction is in the design file, not in this code, and it is
 * still open — DEMO_AUDIT.md Q-01.
 * ------------------------------------------------------------------------
 *
 * EXITS — §8.1: "Buttons Cancel, Continue." No Back: this is step 1.
 *   Cancel   -> /services/<id>/          §7.4  (the SAME service's page)
 *   Continue -> /services/<id>/terms/    NL-05 / PP-05
 *
 * RESPONSIVE: the 152px well steps 152 -> 96 -> 48 -> 32 like every other 1440
 * wizard frame. No pinned main height — there is no measured frame height to
 * pin it to — so the sticky footer in `.gnl-desktop-shell` carries a short page.
 * `max-md` / `max-xs` are NAMED variants; see the note in ChooseMethodScreen.tsx.
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
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          <WizardCard>
            <WizardHeader title={copy.wizardTitle} current={0} size="lg" />

            {/* section-intro. 36px is the largest heading on any wizard frame;
                the scale steps down twice below the tablet breakpoint, the same
                ladder the Confirm-some-details screens use. */}
            <div className="flex w-full shrink-0 flex-col items-start">
              <h1 className="w-full shrink-0 text-[36px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-md:text-[30px] max-xs:text-[26px]">
                {copy.summary.title}
              </h1>
            </div>

            {/* card-description — 16px on a 24px line-height, as NL-22. */}
            <p className="w-full shrink-0 text-[16px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]">
              {copy.summary.intro}
            </p>

            {/*
             * The three numbered items. 24px between items, 8px between an
             * item's title and its body — tighter inside than between, so the
             * list reads as three blocks rather than six lines.
             */}
            <ol className="flex w-full shrink-0 list-none flex-col items-start gap-[24px] p-0">
              {copy.summary.items.map((item) => (
                <li key={item.title} className="flex w-full flex-col items-start gap-[8px]">
                  {/* 18px Bold — the one derived type value on this screen. */}
                  <p className="w-full text-[18px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]">
                    {item.title}
                  </p>
                  <p className="w-full text-[16px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>

            {/*
             * actions-row. Two controls, not three — §8.1 gives this screen no
             * Back, and none is invented. Same box as every other wizard frame:
             * right-aligned, 24px gap, pt-[16px]; below 480 a full-width stack
             * with `flex-col-reverse`, which puts the primary action on top
             * while leaving the DOM (and the tab order) in its designed order.
             */}
            <div className="flex w-full shrink-0 items-center justify-end gap-[24px] pt-[16px] max-xs:flex-col-reverse max-xs:items-stretch max-xs:gap-[12px]">
              <CancelLink
                service={service.id}
                href={routes.page}
                className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[normal] text-[#004b87] max-xs:py-[10px] max-xs:text-center"
              >
                {WIZARD_ACTIONS.cancelLabel}
              </CancelLink>
              <BtnPrimary href={routes.terms} size="lg" className="max-xs:w-full">
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
