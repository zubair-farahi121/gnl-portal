/**
 * Content for the prerequisite check wizard — Figma 6031:6304
 * (`driver-vehicle-prerequisite-check`).
 *
 * Copy is character-for-character from `get_design_context` on 6031:6318
 * (section-intro), 6031:6323 / 6031:6336 (the two service-details blocks) and
 * 6031:6348 (actions-row).
 *
 * NOTE ON APOSTROPHES: "Must have a valid driver's license" uses a STRAIGHT
 * apostrophe (U+0027) in this frame, not the typographic U+2019 used on the
 * confirmation frame. Reproduced as designed — see
 * design/token-exceptions-phase2b.md.
 */

export const WIZARD_TITLE = "Driver and Vehicle";

export const SECTION_INTRO = {
  title: "Services",
  subtitle: "The following services will help us to confirm it is you:",
} as const;

/**
 * How an option card's title is painted.
 *
 * The two cards genuinely disagree in the design file: the MRD card's title is
 * body grey at line-height 1.5, the GNL/CID card's is link blue at line-height
 * normal. That is why the cards are 134px and 129px tall respectively. Both are
 * reproduced exactly; neither is harmonised.
 */
export type OptionTitleStyle = "muted" | "link";

export type IdvOption = {
  nodeId: string;
  title: string;
  titleStyle: OptionTitleStyle;
  /** Whether Figma shows `radio-inner` (hidden="true" on the MRD card). */
  selected: boolean;
  /** Intro line above the bullet list. */
  verifyIntro: string;
  bullets: readonly string[];
  /**
   * Set only on the CertifiO ID / CID option. Every other option renders inert,
   * so the presenter cannot click into an unbuilt screen on stage.
   */
  href?: string;
};

/** Frame 1 — Figma 6031:6321. Order is top-to-bottom as designed. */
export const IDV_OPTIONS: readonly IdvOption[] = [
  {
    nodeId: "6031:6322",
    title: "Motor Registration Division (MRD)",
    titleStyle: "muted",
    selected: false,
    verifyIntro: "This verification service is able to verify:",
    bullets: ["Must have a valid driver's license"],
  },
  {
    nodeId: "6031:6335",
    title: "GNL Identity Verification Service",
    titleStyle: "link",
    selected: true,
    verifyIntro: "This verification service is able to verify:",
    bullets: ["Must have a valid driver's license"],
    // Was /cid/welcome/ — that screen was cut from the flow on 2026-09-21.
    href: "/cid/terms/",
  },
];

export const WIZARD_ACTIONS = {
  cancelLabel: "Cancel",
  backLabel: "Back",
  continueLabel: "Continue",
} as const;
