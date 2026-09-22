import { Fragment } from "react";
import { ASSETS } from "@/lib/assets";
import { CID_STEP_COUNT } from "@/lib/data/cid";

/*
 * "Progress Stepper" — the CID dot stepper.
 *   CID_Welcome    6039:11287
 *   CID_TU         6039:11322
 *   CID_Biometric  6049:12241
 *   CID_ID_success 6062:22555
 *
 * This is NOT the wizard `progress-stepper` (the 8px bar). The four CID frames
 * carry BOTH: the bar inside `wizard-header` and this dot row inside `Frame 5`.
 * Almost certainly a design slip — logged in design/token-exceptions-phase3.md
 * and raised with Tatyana — but reproduced rather than silently dropped.
 *
 * Geometry, identical in all four frames:
 *   container    361 x 50   flex-col, gap-[8px], radius 24, bg white
 *   stepper-row  361 x 24   6 dots, 5 flex-1 connectors, items-center
 *     active dot     24 x 24
 *     other dots     18.667 x 18.667   (y=2.667, i.e. vertically centred)
 *     connector-line 48.733 x 4        (= (361 - 24 - 5*18.667) / 5, so flex-1)
 *   labels-row   361 x 18   exactly one label, inset from the left
 *
 * A connector is filled (#243746) when it sits BEFORE the active dot and
 * #c2c8d6 otherwise.
 */

const DOT_WRAPPER = "relative shrink-0";
const IMG = "absolute inset-0 block size-full max-w-none";

function StepDot({ index, current }: { index: number; current: number }) {
  if (index === current) {
    return (
      <div className={`${DOT_WRAPPER} size-[24px]`} data-name="active-step-dot">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className={IMG} src={ASSETS.stepDotActive} />
      </div>
    );
  }
  const done = index < current;
  return (
    <div
      className={`${DOT_WRAPPER} size-[18.667px]`}
      data-name={done ? "completed-step-dot" : "inactive-step-dot"}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className={IMG} src={done ? ASSETS.stepDotComplete : ASSETS.stepDotInactive} />
    </div>
  );
}

export function CidStepper({
  current,
  label,
  labelIndentClassName,
  alignRight = false,
  nodeId,
}: {
  /** 0-based index of the active dot, 0 .. CID_STEP_COUNT - 1. */
  current: number;
  label: string;
  /**
   * Left inset of the label container, verbatim from Figma — `pl-[34px]`,
   * `pl-[72px]`, `pl-[229px]`. The label is NOT centred under its dot in any
   * of the four frames; the insets are hand-placed and disagree with the dot
   * positions, so they are carried as literal values.
   */
  labelIndentClassName?: string;
  /** CID_ID_success only: labels-row is `justify-end`, container `items-end`. */
  alignRight?: boolean;
  nodeId: string;
}) {
  return (
    <div
      className="flex w-full shrink-0 flex-col items-start gap-[8px] rounded-[24px] bg-white"
      data-node-id={nodeId}
      data-name="Progress Stepper"
    >
      <div className="flex w-full shrink-0 items-center" data-name="stepper-row">
        {Array.from({ length: CID_STEP_COUNT }, (_, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <div
                className={`relative h-[4px] min-w-px flex-[1_0_0] ${
                  i <= current ? "bg-[#243746]" : "bg-[#c2c8d6]"
                }`}
                data-name="connector-line"
              />
            )}
            <StepDot index={i} current={current} />
          </Fragment>
        ))}
      </div>

      <div
        className={`flex w-full shrink-0 items-start ${alignRight ? "justify-end" : ""}`}
        data-name="labels-row"
      >
        <div
          className={`flex shrink-0 flex-col ${alignRight ? "items-end" : "items-center"} ${
            labelIndentClassName ?? ""
          }`}
          data-name="welcome-label-container"
        >
          <p className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
