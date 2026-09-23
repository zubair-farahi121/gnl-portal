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
    /*
     * Was /cid/welcome/ — that screen was cut from the flow on 2026-09-21.
     * Was /cid/terms/ — re-pointed 2026-09-22 to the mobile hand-off
     * (Figma 6217:62059), which the canvas puts between this wizard and CID_TU.
     * Kept identical to the actions-row Continue on the same page, so a
     * presenter who clicks the card and a presenter who clicks the button land
     * on the same screen.
     */
    href: "/cid/continue-on-mobile/",
  },
];

export const WIZARD_ACTIONS = {
  cancelLabel: "Cancel",
  backLabel: "Back",
  continueLabel: "Continue",
} as const;

/* ------------------------------------------------------------------------- *
 * PREREQUISITE CONFIRMED — Figma 6217:81644
 * (`Driver and Vehicle_Prerequisite confirmed`), 1440 x 996.2152099609375.
 *
 * ADDED 2026-09-22. This is step 7 of the Driver-and-Vehicle journey, the
 * screen the flow skipped entirely: `/auth/loading/` went straight to
 * `/services/driver-vehicle/confirmation/` with nothing between. It is a
 * SEPARATE SCREEN from the confirmation frame, not a variant of it — the two
 * sit side by side on the same canvas row (x=23416.06 then x=25108.81), the
 * stepper is on `Prerequisite Check` here and `Ready to Use` there, and the
 * copy has nothing in common. See design/verification-frame-map.md §4.
 *
 * Copy is character-for-character from `get_design_context` on 6217:81647.
 *
 * APOSTROPHES — NOTE THE DISAGREEMENT WITH THE FRAME NEXT DOOR. This frame
 * uses the TYPOGRAPHIC U+2019 in BOTH strings: "it’s you" (6217:81660) and
 * "driver’s license" (6217:81662). The prerequisite-check frame 6031:6304
 * above uses the STRAIGHT U+0027 for the same requirement sentence
 * ("Must have a valid driver's license", IDV_OPTIONS bullets). Same words,
 * two different apostrophes, in one file. Both are reproduced verbatim; a
 * straight quote here would be a pixel-gate failure and vice versa.
 *
 * TRAILING SPACE. `intro` ends with a space in the design file, after the
 * colon. Kept — removing it would be a silent edit to Figma copy.
 *
 * "license" IS THE AMERICAN SPELLING, as designed. The rest of the portal
 * says "licence" (see LINKED_ITEMS). Reproduced, not harmonised.
 * ------------------------------------------------------------------------- */
export const PREREQ_CONFIRM = {
  /** section-title 6217:81659 — 36px Bold on --gnl-heading. */
  title: "Confirm some details",
  /** card-description 6217:81660 — 16px Regular #5f6368, leading 24px. */
  intro:
    "To onboard to Driver and Vehicle, you need to confirm it’s you by providing the following information: ",
  /**
   * Frame 1 6217:81661 — a two-column row, 24px gap. The requirement label is
   * Lato:SemiBold on --gnl-heading; the status is Lato:SemiBold #198754
   * (the --gnl-success green), right-aligned in the remaining width.
   *
   * The frame is named "Prerequisite CONFIRMED" and the single requirement
   * already reads Confirmed, so this is the POST-verification state. If a
   * pre-verification variant exists (same screen, requirement unmet, leading
   * into the CID journey) it is not reachable in the file — see
   * design/verification-frame-map.md §6.
   */
  requirement: {
    label: "Must have a valid driver’s license",
    status: "Confirmed",
    nodeId: "6217:81661",
    labelNodeId: "6217:81662",
    statusNodeId: "6217:81663",
  },
} as const;
