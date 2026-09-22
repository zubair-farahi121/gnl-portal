import { SubStepReadout } from "@/components/wizard/SubStepReadout";
import { STEPPER_STEPS, type StepIndex } from "@/lib/demo-data";

/*
 * progress-stepper — Figma 6031:6310 (inside wizard-header 6031:6308).
 *
 * Geometry verified against the prerequisite-check frame:
 *   step-bar     740 x 8   at y=0,  radius 4
 *   step-labels  740 x 18  at y=20  → 12px gap below the bar
 *   step-bar-fill 555 of 740 at current=2 → exactly 75% = (2+1)/4,
 *                 so the even-quarters formula is correct, not a coincidence.
 *
 * The label x-positions in Figma (0 / 184.667 / 434.333 / 670) are precisely
 * what `justify-between` produces for these four label widths in a 740px row,
 * so justify-between reproduces the design rather than approximating it.
 *
 * Track colour is #e9ebf0, NOT the --gnl-border token (#e0e4e6) the plan
 * provisionally assumed. Logged in design/token-exceptions.md.
 *
 * SIZE VARIANTS (added when re-syncing 6217:82446). The desktop frames were
 * rebuilt at a larger scale — step-bar 8 -> 16, labels 12px -> 16px, and the
 * current label recoloured #5f6368 -> #212326. The CID mobile frames were NOT
 * rebuilt to that scale and still measure 8 / 12px, so this is a genuine
 * two-scale component, not a global restyle.
 *
 * CID RE-SYNC — 2026-09-22 (6257:67855 / 6257:67917 / 6257:69749). The mobile
 * `sm` scale moved on two points and gained a third child:
 *   - column gap 12px -> 8px. `lg` (6031:6310) is still 12px, so the gap is
 *     now keyed to `size` like everything else here.
 *   - the current label is now `Lato:Bold` on `--gnl-heading` (#212326), where
 *     it used to be bold on #5f6368. `sm` and `lg` therefore agree on the
 *     current label now; the map is kept so the two scales stay separable.
 *   - `sub-step-readout` — the pill — is the third child, below step-labels.
 *     See SubStepReadout. It is optional: no desktop frame carries one.
 * `lg` is byte-identical to the pre-resync output.
 */
/*
 * RESPONSIVE — and why it is keyed on `size` rather than on a breakpoint alone.
 *
 * The four labels are `whitespace-nowrap` in a `justify-between` row, so once
 * their combined width passes the track width they simply run off the end.
 * That happens on BOTH scales, but at different widths and — crucially — on
 * frames with different design widths:
 *
 *   lg  is the desktop-only scale (onboard / confirmation, drawn at 1440).
 *       Its 16px labels total ~355px against 240px of card interior at a 320px
 *       viewport, so they step down at 768 and again at 480, and are allowed
 *       to wrap below 480. All three are below the 1440 design width.
 *   sm  is the CID mobile scale, drawn at 393. For those frames 393 is the
 *       untouchable width (see the breakpoint note in globals.css), so its one
 *       relaxation is at `max-xxs` (< 384) — below their own design width,
 *       exactly as `lg`'s are below 1440. At 393 nothing changes.
 *
 * Keying the variants to the size map is what keeps those two ladders apart
 * without a second component or a `.gnl-desktop-shell` descendant selector.
 */
const BAR_H = { sm: "h-[8px]", lg: "h-[16px]" } as const;
/** Column gap of `progress-stepper` itself. CID mobile is 8px, desktop 12px. */
const STACK_GAP = { sm: "gap-[8px]", lg: "gap-[12px]" } as const;
const LABEL_SIZE = {
  sm: "text-[12px] max-xxs:gap-[6px] max-xxs:text-[11px] max-xxs:whitespace-normal",
  lg: "text-[16px] max-md:text-[14px] max-xs:gap-[8px] max-xs:text-[12px] max-xs:whitespace-normal max-xxs:gap-[4px] max-xxs:text-[10px]",
} as const;
/** Figma marks the current label Lato:Bold on --gnl-heading at both scales. */
const CURRENT_LABEL = {
  sm: "font-bold text-[color:var(--gnl-heading,#212326)]",
  lg: "font-bold text-[#212326]",
} as const;

/**
 * Releasing `whitespace-nowrap` on the row is not enough on its own: the
 * labels are `shrink-0` flex items, so they size to max-content and run past
 * the track rather than wrapping. They have to be allowed to shrink at the
 * same breakpoint, and `min-w-px` defeats the automatic minimum that would
 * otherwise hold them at max-content anyway.
 *
 * They also become four EQUAL centred columns rather than four shrink-to-fit
 * boxes under `justify-between`. Shrink-to-fit plus zero free space packed the
 * wrapped labels against each other — "Summary" and "Terms and Conditions"
 * read as one word — and gave each step a different width for no reason. Equal
 * columns are what makes it still read as a four-step stepper at 320px.
 */
const LABEL_ITEM = {
  sm: "shrink-0 max-xxs:min-w-px max-xxs:flex-1 max-xxs:text-center",
  lg: "shrink-0 max-xs:min-w-px max-xs:flex-1 max-xs:text-center",
} as const;

export type StepperSize = "sm" | "lg";

/**
 * `sub-step-readout` content. Present on the three CID mobile frames only —
 * every desktop wizard frame stops at `step-labels`.
 */
export type SubStep = {
  /** e.g. "Terms of use". */
  label: string;
  /** e.g. "step 1 of 5". */
  step: string;
  /** The frame's own pill node id. */
  nodeId: string;
};

export function ProgressStepper({
  current,
  fillWidth,
  size = "sm",
  subStep,
}: {
  current: StepIndex;
  /** Renders the pill under `step-labels`. Omitted on every desktop frame. */
  subStep?: SubStep;
  /** `lg` is the rebuilt desktop scale. Defaults to the CID/mobile `sm`. */
  size?: StepperSize;
  /**
   * Explicit step-bar-fill width, as a CSS length.
   *
   * Only the three CID mobile frames need this, and after the 2026-09-22
   * rework all three do. Their 361px track is filled to 278.869px at
   * current={2}, which is 77.25% — NOT the 75% the desktop frames use for the
   * same step (555 of 740). Reproduced rather than harmonised; see
   * design/token-exceptions-phase3.md.
   */
  fillWidth?: string;
}) {
  const pct = ((current + 1) / STEPPER_STEPS.length) * 100;

  return (
    <div
      className={`flex w-full shrink-0 flex-col items-start ${STACK_GAP[size]}`}
      data-node-id="6031:6310"
    >
      <div
        className={`flex ${BAR_H[size]} w-full shrink-0 items-start overflow-clip rounded-[4px] bg-[#e9ebf0]`}
        data-node-id="6031:6311"
      >
        <div
          className="h-full shrink-0 bg-[#243746]"
          style={{ width: fillWidth ?? `${pct}%` }}
          data-node-id="6031:6312"
        />
      </div>
      <div
        className={`flex w-full shrink-0 items-start justify-between whitespace-nowrap ${LABEL_SIZE[size]} leading-[1.5] text-[#5f6368]`}
        data-node-id="6031:6313"
      >
        {STEPPER_STEPS.map((label, i) => (
          // Figma marks inactive labels Lato:Medium; the webfont has no 500, so
          // they render at 400. See design/token-exceptions.md.
          <p
            key={label}
            className={`${LABEL_ITEM[size]} ${
              i === current ? CURRENT_LABEL[size] : "font-normal"
            }`}
          >
            {label}
          </p>
        ))}
      </div>
      {subStep && (
        <SubStepReadout label={subStep.label} step={subStep.step} nodeId={subStep.nodeId} />
      )}
    </div>
  );
}
