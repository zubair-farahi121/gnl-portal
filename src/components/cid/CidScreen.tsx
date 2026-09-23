import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import type { SubStep } from "@/components/wizard/ProgressStepper";
import { getCidCopy } from "@/lib/data/cid";
import type { ServiceConfig } from "@/lib/data/service-config";

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
 *
 * ====================================================================
 * THE SERVICE IS A PROP — 2026-09-23.
 *
 * This component used to import `CID_WIZARD_TITLE`, a module constant that was
 * computed from a module constant that always answered "driver-vehicle". It now
 * takes the service the ROUTE names, which is what lets the same shell draw
 * "Driver and Vehicle" at /cid/terms/ and "StudentAidNL" at
 * /cid/studentaid/terms/ with no client read and no flash — both are prerendered
 * HTML files. See the seam note at the foot of src/lib/data/service-config.ts.
 *
 * DO NOT re-introduce a default for `service`. A default here would be a second
 * resolution point: a screen that forgot to pass one would silently render Flow
 * A's title inside Flow B's journey, and nothing would fail.
 * ====================================================================
 */
export function CidScreen({
  service,
  mainNodeId,
  subStep,
  yotiZone = false,
  children,
}: {
  /**
   * The service this CertifiO ID session is verifying for. Supplies the
   * `wizard-title` and nothing else in this component — every other
   * service-dependent string belongs to the screen inside `children`.
   */
  service: ServiceConfig;
  /** The frame's own `Main content` node id — it differs on all three. */
  mainNodeId: string;
  /** `sub-step-readout` content. All three CID frames carry one. */
  subStep: SubStep;
  /**
   * THE YOTI ZONE — brief §8.2 and §11.9.
   *
   * Figma's own note on these frames: "Yoti app (embed code) below the stepper
   * and above the footer starts here. Action buttons are part of it. We have no
   * control over its look and feel." That boundary is exactly this component's
   * `children`, which is why the flag lives here and not on each page's markup.
   *
   * `true` on NL-11..NL-19 only — /cid/liveness/, /cid/liveness-capture/,
   * /cid/country/, /cid/document/, /cid/capture-intro/, /cid/capture-front/ and
   * /cid/capture-back/. It renders the body in MONTSERRAT (400/500/600/700,
   * self-hosted in layout.tsx).
   *
   * `false` — the default — on the four CID routes that are GNL frames on the
   * GNL ramp: /cid/continue-on-mobile/ (NL-08), /cid/terms/ (NL-09),
   * /cid/biometric/ (NL-10) and /cid/verified/ (NL-20). Those stay in Lato.
   * Do not set this to `true` "for consistency": §11.9 says the two ramps are
   * meant to look different, and the GNL chrome this component draws above and
   * below the zone stays Lato on every one of the eleven screens.
   */
  yotiZone?: boolean;
  /** Frame 5 (heading + description) and Frame 6 (actions), from the page. */
  children: React.ReactNode;
}) {
  const copy = getCidCopy(service);

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
             * MEASURED. wizard-header at the CID frames' own values — the
             * SERVICE's title ("Driver and Vehicle" on the Figma masters,
             * "StudentAidNL" on their PP-10..PP-19 instances), current={2}, the
             * 278.869px step-bar fill the three frames carry, and the sub-step
             * pill. `size="cid"` is the `sm` numbers below 768 and the onboard
             * `lg` numbers above, which is the one INVENTED part of this
             * element.
             */}
            <WizardHeader
              title={copy.wizardTitle}
              current={2}
              fillWidth={copy.stepperFill}
              size="cid"
              subStep={subStep}
            />
            {/*
             * THE YOTI ZONE BOUNDARY. `contents`, so it generates NO box: the
             * page's own children stay direct flex items of the mobile <main>
             * (gap-[8px]) and of WizardCard above 768, exactly as before this
             * wrapper existed. Nothing moves; only the inherited font-family
             * changes, and only when `yotiZone` is set.
             *
             * Everything ABOVE this point — MobileTopNav / TopNav, the wizard
             * title, the progress bar, the step labels and the sub-step pill —
             * and the footer BELOW it are GNL chrome and stay in Lato on every
             * CID screen. That is the boundary Figma draws and §11.9 protects.
             */}
            <div
              className={yotiZone ? "gnl-yoti-zone contents" : "contents"}
              data-yoti-zone={yotiZone ? "true" : undefined}
            >
              {children}
            </div>
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
