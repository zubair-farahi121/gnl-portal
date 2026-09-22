/*
 * sub-step-readout — the CID sub-step pill.
 *   CID_TU         6257:72178  ("Terms of use"      • "step 1 of 5")
 *   CID_Biometric  6257:67925  ("Biometric consent" • "step 2 of 5")
 *   CID_ID_success 6257:72248  ("Identity verified" • "step 5 of 5")
 *
 * It replaces the six-dot `CidStepper` rail that used to sit inside `Frame 5`
 * on each CID frame. Tatyana: "when I reworked the mobile pages, I removed the
 * CID stepper and replaced it with a pill."
 *
 * It is NOT a sibling of the heading any more — in the reworked frames it is
 * the THIRD child of `progress-stepper`, directly under `step-labels`, so it
 * reads as a sub-caption of the four-step bar rather than as a second stepper.
 * That is why it is rendered by `ProgressStepper` (via its `subStep` prop)
 * instead of by the pages.
 *
 * Geometry, verbatim from get_design_context on 6257:72178:
 *   bg-[rgba(233,235,240,0.5)]  rounded-[16px]
 *   px-[8px] py-[4px]  gap-[4px]  flex, items-start, whitespace-nowrap
 *   Lato:Regular, text-[12px], leading-[1.5], text-[#5f6368]
 *
 * Measured box 155 x 26 on CID_TU (184 on CID_Biometric, 171 on CID_ID_success)
 * — 26 = 4 + 18 + 4, where 18 is 12px Lato at leading 1.5. The widths are pure
 * content width, so nothing here is pinned.
 *
 * Three separate text nodes, not one string: the bullet and the counter are
 * their own `<p>` and are `text-right` in the design. Kept as three so the
 * 4px gaps land where Figma puts them.
 */
export function SubStepReadout({
  label,
  step,
  nodeId,
}: {
  /** Left-hand label, e.g. "Terms of use". */
  label: string;
  /** Right-hand counter, e.g. "step 1 of 5". */
  step: string;
  /** The frame's own `sub-step-readout` id — it differs on all three frames. */
  nodeId: string;
}) {
  return (
    <div
      className="flex shrink-0 items-start gap-[4px] whitespace-nowrap rounded-[16px] bg-[rgba(233,235,240,0.5)] px-[8px] py-[4px] text-[12px] font-normal leading-[1.5] text-[color:var(--gnl-text,#5f6368)] [word-break:break-word]"
      data-node-id={nodeId}
      data-name="sub-step-readout"
    >
      <p className="shrink-0">{label}</p>
      <p className="shrink-0 text-right">•</p>
      <p className="shrink-0 text-right">{step}</p>
    </div>
  );
}
