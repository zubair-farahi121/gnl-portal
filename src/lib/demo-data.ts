/**
 * ALL hardcoded demo content lives here.
 *
 * Copy is character-for-character from Figma, including typographic
 * apostrophes (U+2019). A straight apostrophe is a pixel-gate failure.
 */

/**
 * The four onboarding wizard steps, in Figma order.
 * Source: wizard-header 6031:6308 → step-labels 6031:6313.
 */
export const STEPPER_STEPS = [
  "Summary",
  "Terms and Conditions",
  "Prerequisite Check",
  "Ready to Use",
] as const;

/** Index into STEPPER_STEPS. Narrow on purpose: an out-of-range step is a type error. */
export type StepIndex = 0 | 1 | 2 | 3;
