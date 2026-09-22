import { ProgressStepper, type StepperSize } from "@/components/wizard/ProgressStepper";
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
 */
const TITLE_SIZE = { sm: "text-[24px]", lg: "text-[28px]" } as const;

export function WizardHeader({
  title,
  current,
  fillWidth,
  size = "sm",
}: {
  title: string;
  current: StepIndex;
  fillWidth?: string;
  /** `lg` is the rebuilt desktop scale. Defaults to the CID/mobile `sm`. */
  size?: StepperSize;
}) {
  return (
    <div className="flex w-full shrink-0 flex-col items-center gap-[24px]" data-node-id="6031:6308">
      <p
        className={`w-full shrink-0 text-center ${TITLE_SIZE[size]} font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)]`}
        data-node-id="6031:6309"
      >
        {title}
      </p>
      <ProgressStepper current={current} fillWidth={fillWidth} size={size} />
    </div>
  );
}
