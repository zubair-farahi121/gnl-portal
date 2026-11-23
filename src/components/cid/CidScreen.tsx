import Link from "next/link";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { MobileTopNav } from "@/components/mobile/MobileTopNav";
import { WizardCard } from "@/components/wizard/WizardCard";
import { ProgressStepper, type SubStep } from "@/components/wizard/ProgressStepper";
import { SubStepReadout } from "@/components/wizard/SubStepReadout";
import { getCidCopy } from "@/lib/data/cid";
import type { ServiceConfig } from "@/lib/data/service-config";
import { STEPPER_STEPS, type StepIndex } from "@/lib/demo-data";

/*
 * CidScreen — the portal chrome around every CertifiO ID screen.
 *
 * ====================================================================
 * GNWT RE-BRAND — 2026-11-16 (release-2). Figma file Hfj015MPSmeRPYg72vZxTI,
 * mobile frames 393 wide: Flow 1 27:69099 (CID_TU) … 28:71505
 * (CID_ID_success); Flow 2 42:77306 … See gnwt-specs/C-certifio-mobile.md.
 *
 * Top to bottom, as every CID frame draws it:
 *   1. `gnwt-header`  — MobileTopNav below 768, TopNav at and above it.
 *   2. `wizard-header` — CidWizardHeader below.
 *   3. the CertifiO / Yoti content (this component's `children`).
 *   4. `gnwt-footer` — SiteFooter "mobile" below 768, "desktop" above.
 *
 * MEASURED BELOW 768 (pixel-measured on 27:69099 / 28:71505 / 29:72004):
 *   wizard-title  24px Bold, leading 1.5, #333, centred      box  36 at y=0
 *   step-bar      361 x 8 at y=60, track #e9ecef, fill #000 278.869px
 *   progress label ONE line, 12px Regular #333, at bar + 16. Its RIGHT EDGE
 *                 sits on the 3/4 mark of the bar (glyphs x=144.5..284.5 on
 *                 every frame; 16 + 0.75 x 361 = 286.75). It is not centred
 *                 on the page — it ends where step 3 of 4 ends.
 *   sub-step pill  at bar + 42 (8px under the label), unchanged.
 * The four-label row of the old GNL frames is gone on the phone.
 *
 * INVENTED AT AND ABOVE 768 (Figma has no desktop CID frame): the content
 * sits in the same WizardCard as the desktop wizard pages around it, with
 * the desktop wizard's own four-label `lg` ProgressStepper, so the stepper
 * does not change shape between /onboard/ and /cid/terms/ on a laptop.
 *
 * HOW THE BREAKPOINT SWITCH WORKS — PURE CSS, NO JAVASCRIPT. Both chromes are
 * in the DOM; one of each pair is switched off with `max-md:hidden` /
 * `md:hidden` inside `display: contents` wrappers, so the visible nav and
 * footer stay flex items of the shell (sticky footer) and, below 768, the
 * gutter div and WizardCard generate no box at all. Named variants only
 * (`md` / `max-md` / `xxs`) — never `max-[768px]`, see globals.css.
 *
 * THE SERVICE IS A PROP. The title is the ROUTE's service (`service.title`,
 * "Driver and Vehicle Services" / "Student Financial Assistance"), resolved at
 * build time, so both flows are prerendered with no client read. Do not add a
 * default for `service`.
 * ====================================================================
 */

/** The CID screens all sit on step 3 of 4, "Prerequisite Check". */
const CID_STEP: StepIndex = 2;

/** `3 of 4: Prerequisite Check` — derived, so it follows STEPPER_STEPS. */
const PROGRESS_LABEL = `${CID_STEP + 1} of ${STEPPER_STEPS.length}: ${STEPPER_STEPS[CID_STEP]}`;

/*
 * Portal (non-Yoti) typography and controls shared by the GNWT-skinned CID
 * screens — terms, biometric, verified and the phone's "done" screen. One
 * place, so the four screens cannot drift apart. All values pixel-measured on
 * 27:69099 and 28:71505.
 */
export const CID_PORTAL = {
  /** H1 — Noto Sans Bold 36 / 1.5, #333. Steps down below 384. */
  heading:
    "w-full shrink-0 text-[36px] font-bold leading-[1.5] text-[#333333] max-xxs:text-[30px] [word-break:break-word]",
  /** 16 / 24 body, #333 (terms, biometric). */
  body: "w-full shrink-0 text-[16px] font-normal text-[#333333] [word-break:break-word]",
  /** 14 / 1.5 body, #333 (verified, phone done). */
  bodySmall:
    "w-full shrink-0 text-[14px] font-normal leading-[1.5] text-[#333333] [word-break:break-word]",
  /** Inert underlined link, GNWT link blue. */
  link: "cursor-default leading-[24px] text-[color:var(--gnwt-link,#005d8f)] underline decoration-solid decoration-from-font select-none [text-decoration-skip-ink:none] [text-underline-position:from-font]",
} as const;

const BTN_BASE =
  "gnl-touch box-border inline-flex min-h-[40px] items-center justify-center rounded-[6px] px-[12px] py-[8px] text-center text-[16px] font-bold leading-[1.5] no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]";

/** GNWT button tones: black primary, and the borderless text ("ghost") button. */
const BTN_TONE = {
  primary: "bg-[#000000] text-white hover:bg-[#333333]",
  ghost: "bg-transparent text-[#333333] hover:bg-[#f3f8fc]",
} as const;

/**
 * GNWT portal button for the CID screens. Rendered here rather than through
 * the shared BtnPrimary / BtnOutline so the CID frames can take the GNWT look
 * without changing the buttons every other screen uses.
 */
export function CidButton({
  children,
  href,
  onClick,
  tone,
  className = "",
  nodeId,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  tone: keyof typeof BTN_TONE;
  /** Box overrides only (width, order). */
  className?: string;
  nodeId?: string;
}) {
  const classes = `${BTN_BASE} ${BTN_TONE[tone]} ${className}`;
  /* Same node ids the shared BtnPrimary / BtnOutline stamped before. */
  const id = nodeId ?? (tone === "primary" ? "6031:6352" : "6031:6350");
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes} data-node-id={id}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} data-node-id={id}>
      {children}
    </button>
  );
}

/**
 * wizard-header on the CID frames. Below 768: the measured single-label
 * stepper. At and above 768: the desktop wizard's four-label `lg` stepper.
 */
function CidWizardHeader({
  title,
  fillWidth,
  subStep,
}: {
  title: string;
  fillWidth: string;
  subStep: SubStep;
}) {
  return (
    <div
      className="flex w-full shrink-0 flex-col items-center gap-[24px] md:gap-[16px]"
      data-node-id="6031:6308"
      data-name="wizard-header"
    >
      <p
        className="w-full shrink-0 text-center text-[24px] font-bold leading-[1.5] text-[#333333] md:text-[35px] max-xxs:text-[22px] [word-break:break-word]"
        data-node-id="6031:6309"
      >
        {title}
      </p>

      <div className="flex w-full shrink-0 flex-col items-start gap-[8px]" data-name="progress-stepper">
        {/* PHONE stepper — bar + one label. */}
        <div className="contents md:hidden">
          <div
            className="flex h-[8px] w-full shrink-0 items-start overflow-clip rounded-[4px] bg-[#e9ecef]"
            data-name="step-bar"
          >
            <div
              className="h-full max-w-full shrink-0 bg-[#000000]"
              style={{ width: fillWidth }}
              data-name="step-bar-fill"
            />
          </div>
          {/* Four equal columns; the label spans the first three and ends at
              the 3/4 mark, which is where Figma puts it. */}
          <div className="grid w-full shrink-0 grid-cols-4" data-name="step-labels">
            <p
              className="col-span-3 whitespace-nowrap text-right text-[12px] font-normal leading-[1.5] text-[#333333]"
              data-step-label="current"
            >
              {PROGRESS_LABEL}
            </p>
          </div>
        </div>
        {/* DESKTOP stepper — the wizard's own four-label `lg` scale. */}
        <div className="contents max-md:hidden">
          <ProgressStepper current={CID_STEP} size="lg" />
        </div>
        <SubStepReadout label={subStep.label} step={subStep.step} nodeId={subStep.nodeId} />
      </div>
    </div>
  );
}

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
  /** The frame's own `Main content` node id. */
  mainNodeId: string;
  /** `sub-step-readout` content. Every CID frame carries one. */
  subStep: SubStep;
  /**
   * THE YOTI ZONE. Figma's note on these frames: "Yoti app (embed code) below
   * the stepper and above the footer starts here. Action buttons are part if
   * it. We have no control over its look and feel." That boundary is exactly
   * this component's `children`. `true` on the Yoti screens (liveness …
   * capture-back, upload) — the body renders in Montserrat. `false` on
   * terms, biometric and verified, which are portal-styled.
   */
  yotiZone?: boolean;
  children: React.ReactNode;
}) {
  const copy = getCidCopy(service);

  return (
    /* `md:max-w-none!`: the GNWT page is full width (header and footer run
       edge to edge, drawn at 1920); `.gnl-cid-shell` still carries the GNL
       1440 cap in globals.css, which is outside this pass. */
    <div className="gnl-cid-shell flex flex-col items-stretch md:max-w-none!">
      <div className="gnl-cid-desktop-chrome contents max-md:hidden">
        <TopNav />
      </div>
      <div className="contents md:hidden">
        <MobileTopNav />
      </div>

      {/* `Main content`. Below 768: px-16 py-24, a column at gap 8 (measured).
          At and above 768 it hands all of that to the card. */}
      <main
        className="box-border flex w-full flex-col items-start gap-[8px] px-[16px] py-[24px] md:block md:p-0"
        data-node-id={mainNodeId}
      >
        {/* INVENTED above 768 (the desktop wizard's well: 76px top and
            bottom, card centred); erased below it by `max-md:contents`. */}
        <div className="gnl-gutter [--gnl-gutter:64px] flex justify-center pt-[76px] pb-[76px] max-lg:pt-[48px] max-lg:pb-[48px] max-md:contents">
          <WizardCard className="max-md:contents">
            <CidWizardHeader
              title={copy.wizardTitle}
              fillWidth={copy.stepperFill}
              subStep={subStep}
            />
            {/* THE YOTI ZONE BOUNDARY. `contents`, so it generates no box. */}
            <div
              className={yotiZone ? "gnl-yoti-zone contents" : "contents"}
              data-yoti-zone={yotiZone ? "true" : undefined}
            >
              {children}
            </div>
          </WizardCard>
        </div>
      </main>

      <div className="gnl-cid-desktop-chrome contents max-md:hidden">
        <SiteFooter variant="desktop" />
      </div>
      <div className="contents md:hidden">
        <SiteFooter variant="mobile" />
      </div>
    </div>
  );
}
