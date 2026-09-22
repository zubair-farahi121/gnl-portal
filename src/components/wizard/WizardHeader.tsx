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
const TITLE_SIZE = { sm: "text-[24px]", lg: "text-[28px]" } as const;

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
    <div className="flex w-full shrink-0 flex-col items-center gap-[24px]" data-node-id="6031:6308">
      <p
        className={`w-full shrink-0 text-center ${TITLE_SIZE[size]} font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)]`}
        data-node-id="6031:6309"
      >
        {title}
      </p>
      <ProgressStepper current={current} fillWidth={fillWidth} size={size} subStep={subStep} />
    </div>
  );
}
