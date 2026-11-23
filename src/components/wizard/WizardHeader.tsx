import {
  ProgressStepper,
  type StepperSize,
  type SubStep,
} from "@/components/wizard/ProgressStepper";
import type { StepIndex } from "@/lib/demo-data";

/*
 * wizard-header — Figma 6031:6308, 740 x 98.
 *
 *   wizard-title  740 x 36 at y=0   (24px Bold, 1.5 line-height, centred)
 *   progress-stepper 740 x 38 at y=60 → 24px gap
 */
/**
 * The CID mobile frames repeat this header verbatim at 361px wide (Figma
 * 6056:13069 / 6056:13080 / 6062:22543 — plain frames, not instances of the
 * desktop one), so the component is shared. `fillWidth` exists only because
 * those frames disagree with the desktop frames on the step-bar-fill width.
 *
 * `size` exists for the same reason. The rebuilt desktop frames set the title
 * to 28px (6031:6309 / 6217:82432); the CID mobile headers are still 24px
 * (6056:13070). Default `sm` keeps the pre-resync output.
 *
 * CID RE-SYNC — 2026-09-22. The three CID headers grew 98 -> 128 tall: the
 * 24px title gap is unchanged, but `progress-stepper` went 38 -> 68 because it
 * gained the `sub-step-readout` pill (26px) plus its 8px gap, and tightened
 * its own column gap 12 -> 8. Passing `subStep` is what adds the pill; the
 * desktop frames pass nothing and are untouched.
 */
/**
 * `cid` is the two-breakpoint scale added with the CID desktop layout
 * (2026-09-22): the measured 24px mobile title below 768, the `lg` 28px title
 * at and above it, where this header renders inside the same WizardCard as
 * /onboard/. The `md:` half is INVENTED — Figma has no desktop CID frame.
 * See the note on the size maps in ProgressStepper.
 */
const TITLE_SIZE = {
  sm: "text-[24px] text-[color:var(--gnl-heading,#212326)]",
  /* GNWT desktop wizard (release-2, B-wizard.md §1.3): 35px Bold #333333,
     stepping down on narrow screens so a long service name stays readable. */
  lg: "text-[35px] text-[#333333] max-md:text-[30px] max-xs:text-[24px]",
  cid: "text-[24px] text-[color:var(--gnl-heading,#212326)] md:text-[28px]",
} as const;

/** Title-to-stepper gap. GNWT `lg`: 16px. */
const HEADER_GAP = { sm: "gap-[24px]", lg: "gap-[16px]", cid: "gap-[24px]" } as const;

export function WizardHeader({
  title,
  current,
  fillWidth,
  size = "sm",
  subStep,
}: {
  title: string;
  current: StepIndex;
  fillWidth?: string;
  /** `lg` is the rebuilt desktop scale. Defaults to the CID/mobile `sm`. */
  size?: StepperSize;
  /** CID mobile only — renders `sub-step-readout` under the step labels. */
  subStep?: SubStep;
}) {
  return (
    <div className={`flex w-full shrink-0 flex-col items-center ${HEADER_GAP[size]}`} data-node-id="6031:6308">
      <p
        className={`w-full shrink-0 text-center ${TITLE_SIZE[size]} font-bold leading-[1.5] [overflow-wrap:anywhere]`}
        data-node-id="6031:6309"
      >
        {title}
      </p>
      <ProgressStepper current={current} fillWidth={fillWidth} size={size} subStep={subStep} />
    </div>
  );
}
