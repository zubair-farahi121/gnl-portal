import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import type { SubStep } from "@/components/wizard/ProgressStepper";
import { CID_STEPPER_FILL, CID_WIZARD_TITLE } from "@/lib/data/cid";

/*
 * CidScreen — the shell, chrome and wizard header shared by the three CID
 * steps (/cid/terms/, /cid/biometric/, /cid/verified/).
 *
 * ====================================================================
 * PROVENANCE — READ THIS BEFORE CHANGING ANYTHING HERE
 *
 * MEASURED (Figma, mobile frames, 393px wide):
 *   CID_TU          6217:62834   393 x 810.81
 *   CID_Biometric   6217:62835   393 x 834.81
 *   CID_ID_success  6217:66058   393 x 1014.81
 *   Everything this file renders BELOW 768 comes from those frames and is
 *   unchanged from the pre-2026-09-22 pages: MobileTopNav (6039:9699), the
 *   bare `<main>` at px-[16px] py-[24px] gap-[8px], wizard-header (6056:13069
 *   et al) at the `sm` scale with the sub-step pill, and SiteFooter's mobile
 *   variant (6039:9695). No box below 768 moved.
 *
 * INVENTED (2026-09-22 — NOT in Figma, needs Tatyana's review):
 *   Everything this file renders AT AND ABOVE 768. Figma has mobile frames
 *   only for the CID screens; there is no desktop CID frame at all. The
 *   desktop layout here is not a measurement, it is a decision: reuse the
 *   chrome `/services/driver-vehicle/onboard/` (6031:6304) already uses, so
 *   the demo stops going full desktop page -> 480px strip -> full desktop page
 *   as the presenter walks the flow. Specifically invented:
 *     - the desktop TopNav (6031:6245) in place of MobileTopNav
 *     - the 820px WizardCard (6031:6307) around the CID content
 *     - the centring well: `.gnl-gutter [--gnl-gutter:310px]` and the
 *       152 -> 96 padding ladder, both lifted verbatim from the onboard page
 *     - SiteFooter's desktop variant (6031:5972)
 *     - the `cid` stepper/title scale stepping up to the onboard `lg` numbers
 *       (see ProgressStepper)
 * ====================================================================
 *
 * HOW THE BREAKPOINT SWITCH WORKS — PURE CSS, NO JAVASCRIPT.
 *
 * Both chromes are rendered into the DOM and one of each pair is switched off
 * per breakpoint. There is deliberately no media-query hook and no
 * server/client branch anywhere: layout.tsx dropped `suppressHydrationWarning`
 * when the old scale script was removed, so a mismatch surfaces loudly.
 *
 * The wrappers are `contents` + `max-md:hidden` / `md:hidden`. `display:
 * contents` matters twice over:
 *   - the visible nav and footer stay direct flex ITEMS of the shell, so the
 *     sticky-footer rule still pushes the footer to the bottom of a short page
 *     (`.gnl-cid-shell footer` in globals.css is a descendant selector for
 *     exactly this reason — selectors match the DOM, not the box tree);
 *   - and below 768 the gutter div and the WizardCard generate no box at all,
 *     so the CID content lands as direct children of the mobile `<main>` with
 *     its 8px gap, byte for byte the old PhoneFrame output.
 *
 * NAMED VARIANTS ONLY (`md` / `max-md` / `xs` / `xxs`). Never `max-[768px]`:
 * Tailwind sorts arbitrary max-width variants into a different group from the
 * named ones, so an arbitrary one loses to `max-xl` at phone widths. That bug
 * has already been found and fixed once here — see the comment on the wrapper
 * div in the onboard page.
 *
 * CONTENT IS AUTHORED ONCE. Only the chrome differs between breakpoints; the
 * heading, stepper, pill, body copy and buttons exist in a single place (the
 * page's own `children`) and are never duplicated per breakpoint.
 */
export function CidScreen({
  mainNodeId,
  subStep,
  children,
}: {
  /** The frame's own `Main content` node id — it differs on all three. */
  mainNodeId: string;
  /** `sub-step-readout` content. All three CID frames carry one. */
  subStep: SubStep;
  /** Frame 5 (heading + description) and Frame 6 (actions), from the page. */
  children: React.ReactNode;
}) {
  return (
    <div className="gnl-cid-shell flex flex-col items-stretch">
      {/* INVENTED desktop chrome. `gnl-cid-desktop-chrome` is what lets the
          `.gnl-touch` 44px rule reach this nav at exactly 768, the one width
          where it is visible and the media query still applies. */}
      <div className="gnl-cid-desktop-chrome contents max-md:hidden">
        <TopNav />
      </div>
      {/* MEASURED mobile chrome — Figma 6039:9699. */}
      <div className="contents md:hidden">
        <MobileTopNav />
      </div>

      {/*
       * `Main content`. Below 768 this is the Figma frame's own box:
       * px-[16px] py-[24px], a column at gap-[8px]. At 768 and up it hands all
       * of that to the card and becomes a plain block, so the well below can
       * own the padding exactly as it does on the onboard page.
       */}
      <main
        className="box-border flex w-full flex-col items-start gap-[8px] px-[16px] py-[24px] md:block md:p-0"
        data-node-id={mainNodeId}
      >
        {/*
         * INVENTED above 768; nothing at all below it.
         *
         * Class string lifted from the onboard page's centring wrapper so the
         * two screens place their card identically: `--gnl-gutter:310px` is
         * (1440 - 820) / 2 written as a real gutter, `justify-center` centres
         * the card once the gutter steps down (310 -> 96 -> 64 -> 24 -> 16),
         * and the 152px design well steps 152 -> 96 with the viewport.
         *
         * `max-md:contents` erases the whole box below 768 — padding, flex and
         * all — so the phone layout cannot be touched by any of it.
         */}
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:contents">
          {/* INVENTED above 768: the same 820px wizard-card (6031:6307) the
              onboard and confirmation frames measure. `max-md:contents` makes
              it vanish below 768. */}
          <WizardCard className="max-md:contents">
            {/*
             * MEASURED. wizard-header at the CID frames' own values — title
             * "Driver and Vehicle", current={2}, the 278.869px step-bar fill
             * the three frames carry, and the sub-step pill. `size="cid"` is
             * the `sm` numbers below 768 and the onboard `lg` numbers above,
             * which is the one INVENTED part of this element.
             */}
            <WizardHeader
              title={CID_WIZARD_TITLE}
              current={2}
              fillWidth={CID_STEPPER_FILL}
              size="cid"
              subStep={subStep}
            />
            {children}
          </WizardCard>
        </div>
      </main>

      {/* INVENTED desktop chrome — Figma 6031:5972, the desktop footer. */}
      <div className="gnl-cid-desktop-chrome contents max-md:hidden">
        <SiteFooter variant="desktop" />
      </div>
      {/* MEASURED mobile chrome — Figma 6039:9695. */}
      <div className="contents md:hidden">
        <SiteFooter variant="mobile" />
      </div>
    </div>
  );
}
