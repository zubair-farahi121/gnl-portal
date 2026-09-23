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

import { CID_ROUTES, getService } from "@/lib/data/service-config";

/**
 * The title, the single requirement sentence and the CertifiO ID destination
 * are the three things Flow B varies on this wizard (BUILD_BRIEF.md §12.1), so
 * they come from the shared config rather than being spelled out here. Every
 * other string in this file is the same on both flows and stays put.
 *
 * NOTE THE TWO APOSTROPHE SPELLINGS. `requirement` (U+0027) is what the
 * prerequisite-check frame 6031:6304 draws; `requirementConfirmed` (U+2019) is
 * what the prerequisite-CONFIRMED frame 6217:81644 draws, for the same words.
 * The design file disagrees with itself and both are reproduced — see the note
 * on PREREQ_CONFIRM below.
 */
const SERVICE = getService("driver-vehicle");

export const WIZARD_TITLE = SERVICE.title;

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
    bullets: [SERVICE.requirement],
  },
  {
    nodeId: "6031:6335",
    title: "GNL Identity Verification Service",
    titleStyle: "link",
    selected: true,
    verifyIntro: "This verification service is able to verify:",
    bullets: [SERVICE.requirement],
    /*
     * Was /cid/welcome/ — that screen was cut from the flow on 2026-09-21.
     * Was /cid/terms/ — re-pointed 2026-09-22 to the mobile hand-off
     * (Figma 6217:62059), which the canvas puts between this wizard and CID_TU.
     * Kept identical to the actions-row Continue on the same page, so a
     * presenter who clicks the card and a presenter who clicks the button land
     * on the same screen.
     */
    href: CID_ROUTES.handoff,
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
    `To onboard to ${SERVICE.title}, you need to confirm it\u2019s you by providing the following information: `,
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
    label: SERVICE.requirementConfirmed,
    status: "Confirmed",
    nodeId: "6217:81661",
    labelNodeId: "6217:81662",
    statusNodeId: "6217:81663",
  },
} as const;

/* ========================================================================= *
 * TIER 1 — THE THREE SCREENS AT THE FRONT OF THE WIZARD (NL-04 / 05 / 06).
 *
 * ADDED 2026-09-23. DEMO_AUDIT.md rows NL-04, NL-05 and NL-06: *"Brief says
 * KEEP — the brief is wrong. No route, no component, no copy."* These are the
 * first three screens after "Onboard", and without them the four-step progress
 * bar named two steps the demo could not show (X-09).
 *
 * ------------------------------------------------------------------------
 * PROVENANCE — READ THIS BEFORE "CORRECTING" ANY STRING BELOW.
 *
 * These three frames exist in Figma ONLY as pasted screenshots of the live
 * portal — `6031:6242` (NL-04, 1440x1156), `6031:6243` (NL-05, 1440x1400) and
 * `6031:6301` (NL-06, 1440x980). They are IMAGES: there is no text layer, so
 * `get_design_context` returns nothing to read and no node can be measured.
 * `design-reference/copydeck.txt`, which BUILD_BRIEF.md §3 describes as "exact
 * text of new screens", was never delivered (DEMO_AUDIT.md §6).
 *
 * So the copy below is taken **verbatim from BUILD_BRIEF.md §8.1**, which the
 * Tier 1 brief names as the source of record for these three screens. The
 * three screenshots were read this session to confirm the STRUCTURE — item
 * title above body, the scroll box, the scope list, the button order and the
 * progress percentages — and they agree with §8.1 on every word.
 *
 * APOSTROPHES ARE STRAIGHT (U+0027) HERE. Every apostrophe in §8.1's copy for
 * these screens is U+0027 — "you'll", "Division's", "You're", "driver's" — and
 * they are reproduced as the brief writes them, not normalised to the U+2019
 * the CONFIRMED frame 6217:81644 uses. The file already disagrees with itself
 * on this (see PREREQ_CONFIRM above); this is one more instance, not a new
 * one, and a copy review before Tuesday is the way to settle it, not a silent
 * edit here. Raised as Q-22.
 * ------------------------------------------------------------------------ */

/**
 * NL-04 SUMMARY — Figma `6031:6242` (screenshot only).
 *
 * §8.1 writes the three items as one sentence each — "1. Terms and Conditions:
 * Read and accept our…". The screenshot draws them as a TITLE line above a
 * BODY line with the colon dropped, so that is the structure used, with the
 * brief's words unchanged on both sides of the split. Nothing is added,
 * nothing is removed; only the colon that joined them becomes a line break.
 *
 * Q-01 — "IS NOTIFICATION SETTINGS A WIZARD STEP?" — IS ANSWERED NO, HERE.
 * `6102:101142` shows a FIVE-step progress bar including it; the built wizard,
 * this screenshot and the two beside it all show FOUR. The brief settles the
 * build: §8.1 NL-04, last line — *"The wizard has 4 steps; there is no
 * Notification Settings step in this demo."* So item 3 stays in the body copy,
 * where the screenshot puts it, and the bar stays at four steps. The tension is
 * real and unresolved in the design file; it is NOT resolved by inventing a
 * fifth step. See DEMO_AUDIT.md Q-01.
 */
export const SUMMARY = {
  /** Figma screenshot: ~36px heading, same slot as PREREQ_CONFIRM.title. */
  title: `Welcome to ${SERVICE.title}`,
  intro:
    "Here is what you'll need and what to expect when onboarding this service. Note: you may opt out of service onboarding at any time.",
  /**
   * The numbered list. The number is part of the title string, as §8.1 and the
   * screenshot both write it — not a CSS counter, so it cannot silently
   * renumber if an item is ever added or cut.
   */
  items: [
    {
      title: "1. Terms and Conditions",
      body: "Read and accept our Terms and Conditions to understand your rights and our commitment to your privacy.",
    },
    {
      title: "2. Verification",
      body: "Before providing access to the service we need to verify it is you. Have your information ready for this quick check.",
    },
    {
      /*
       * KEPT, AND THERE IS NO STEP FOR IT. See the Q-01 note above: the brief
       * lists this item and forbids the step. Do not add a fifth stepper label
       * to "make them agree" — that is the guess §8.1 rules out.
       */
      title: "3. Notification Settings",
      body: "Choose your preferred method of communication to receive important alerts and updates.",
    },
  ],
} as const;

/**
 * NL-05 TERMS AND CONDITIONS — Figma `6031:6243` (screenshot only).
 *
 * `name`, `lastModified` and `version` come from the service config (§12.1
 * `terms`), because they are exactly what Flow B changes: PP-05 is this screen
 * with "StudentAidNL", 2026-08-26 and Version 7. `consent` is per-service too
 * and is spelled out here for `driver-vehicle` only — Flow B's paragraph (§9
 * PP-05) is a different text and belongs in the config when Tier 2 lands.
 */
export const TERMS = {
  /** Page heading, the same 36px slot as the other two wizard screens. */
  title: "Terms and Conditions",
  /** Sub-heading — the service's own terms document name. */
  documentName: SERVICE.terms.name,
  lastModifiedLabel: `Last modified: ${SERVICE.terms.lastModified}`,
  versionLabel: `Version ${SERVICE.terms.version}`,
  /**
   * The consent paragraph, §8.1 verbatim, split at the email so the address can
   * be a link the way the screenshot draws it. The two halves concatenate to
   * the brief's string exactly — the trailing space after "contact" is the join.
   */
  consentBody:
    "I consent to Government of Newfoundland and Labrador checking the information that I provide against the Motor Registration Division's system to make sure that I am who I say I am, validate my access to new services as they become available in MyGovNL, and receive personalized notifications regarding my upcoming renewals. For any questions related to how your information is being handled, please contact ",
  consentEmail: "digitalgovernment@gov.nl.ca",
  scopesTitle: "By Accepting This Policy You're Allowing To:",
  checkboxLabel: "I have read and accept terms and condition",
  /** §7.4, verbatim. Shown under the checkbox, in red, on an unticked Consent. */
  validationMessage: "To continue, you must agree to the terms and conditions.",
  consentLabel: "I Consent",
  declineLabel: "I Do Not Consent",
} as const;

/**
 * NL-06 CONFIRM SOME DETAILS: **REQUIRED** — Figma `6031:6301` (screenshot only).
 *
 * The Required twin of PREREQ_CONFIRM above, and rendered by the SAME
 * component (`ConfirmDetailsCard`). Only these four values differ:
 *
 *   heading      "Confirm Some Details"  (title case) vs "Confirm some details"
 *   intro        "…confirm it is you…"   vs "…confirm it's you…"  (U+2019)
 *   requirement  SERVICE.requirement     vs SERVICE.requirementConfirmed
 *                (U+0027)                   (U+2019)
 *   status       "Required" #d32f2f      vs "Confirmed" #198754
 *
 * All four disagreements are the design file's own and every one is reproduced
 * rather than harmonised, exactly as the two apostrophe spellings already are.
 * The casing of the heading is the most surprising of them: §8.1 writes
 * "Confirm Some Details", §8.2 writes "Confirm some details", and both
 * screenshots agree with their own brief section.
 *
 * NO DIVIDER RULE. The NL-06 screenshot draws a hairline under the requirement
 * row and NL-05's draws one above the actions row; the CONFIRMED frame
 * 6217:81644 — which is a real, measured frame, and a frozen baseline — draws
 * neither. The screenshots are of the OLDER live portal; 6217:81644 is the
 * redrawn wizard. The component follows the measured frame, so the two states
 * are the same screen and the `prereq-confirm` baseline does not move.
 */
export const PREREQ_REQUIRED = {
  title: "Confirm Some Details",
  intro: `To onboard to ${SERVICE.title}, you need to confirm it is you by providing the following information:`,
  requirement: {
    label: SERVICE.requirement,
    status: "Required",
  },
} as const;
