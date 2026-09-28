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
 *
 * ====================================================================
 * ONE BUILDER, TWO SERVICES — 2026-09-28 (Flow B's desktop wizard).
 *
 * Until today every export below was a module constant computed ONCE, at
 * import time, from `getService("driver-vehicle")`. That is exactly the shape
 * the CID copy had before 2026-09-23, and it was cut the same way: the
 * constants became `getOnboardingCopy(service)`, a function of an explicit
 * `ServiceConfig`, and the old named exports are now just Flow A's result of
 * it — `WIZARD_TITLE === getOnboardingCopy(FLOW_A).wizardTitle`, and so on.
 *
 * WHY THE OLD EXPORTS STAY: they are the proof that Flow A did not move. Every
 * one of them is built from the same strings through the same template
 * literals it was built from before, so the rendered HTML of the seven
 * /services/driver-vehicle/ screens is byte-identical — which `npm run diff`
 * checks against frozen baselines rather than takes on trust.
 *
 * WHAT IS GENUINELY PER-SERVICE HERE, and was not in the config:
 *   - the method cards (PP-07 has THREE, each with its own spelling of the
 *     requirement — see METHOD_OPTIONS),
 *   - the method step's type scale (PP-07 was redrawn larger than NL-07 —
 *     see `methodStep`),
 *   - the PP-08 "Other verification" copy, which Flow A has no screen for.
 * ====================================================================
 */

import {
  CID_ROUTES,
  cidRoutes,
  getService,
  serviceRoutes,
  type IdvMethod,
  type ServiceConfig,
  type ServiceId,
} from "@/lib/data/service-config";
import { SHARED_DATA_SCOPES, type ScopeItem } from "@/lib/data/driver-vehicle";
import { STUDENTAID_SCOPES } from "@/lib/data/studentaid";

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
const FLOW_A = getService("driver-vehicle");

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
 *
 * PP-07 (6206:27601) repeats the same split on a larger scale: MCP and MRD are
 * grey on 1.5 (27px rows at 18px), GNL IDV is blue on `normal` (22px row).
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

/** One card's own content, before the service decides selection and href. */
type MethodOptionDef = Omit<IdvOption, "selected" | "href" | "verifyIntro">;

const VERIFY_INTRO = "This verification service is able to verify:";

/**
 * The method cards, PER SERVICE, keyed by method. The ORDER they render in is
 * `service.methods` (§12.1), not the key order here — "render the methods from
 * config.methods rather than hardcoding two".
 *
 * FLOW A — Frame 1, Figma 6031:6321. Unchanged: both cards carry the config's
 * `requirement`, U+0027, exactly as they did when this was `IDV_OPTIONS`.
 *
 * FLOW B — Frame 1, Figma 6217:30593 (PP-07, 6206:27601), read with
 * get_design_context on 6217:30595 / 6217:30621 and get_metadata on the frame,
 * 2026-09-28. THE THREE BULLETS ARE THREE DIFFERENT STRINGS, and each is
 * reproduced as its own card draws it:
 *
 *   MCP      6217:30604  "…valid driver’s license, health card, or …"  U+2019
 *   MRD      6217:34290  "Must have a valid driver's license"           U+0027
 *   GNL IDV  6217:30630  "…valid driver's license, health card, or …"  U+0027
 *
 * ONE DELIBERATE DEVIATION: the GNL IDV text node in Figma has a DOUBLE SPACE,
 * "or  have neither", rendered with `whitespace-pre-wrap`. §9 PP-07 — the copy
 * this build was told to use verbatim — writes it with one. One space is used:
 * a double space in the one card the presenter points at reads as a typo, and
 * the brief is the stated source of record for copy. Logged in DEMO_AUDIT.md.
 */
const METHOD_OPTIONS: Record<
  ServiceId,
  Partial<Record<IdvMethod, MethodOptionDef>>
> = {
  "driver-vehicle": {
    mrd: {
      nodeId: "6031:6322",
      title: "Motor Registration Division (MRD)",
      titleStyle: "muted",
      bullets: [FLOW_A.requirement],
    },
    gnl_idv: {
      nodeId: "6031:6335",
      title: "GNL Identity Verification Service",
      titleStyle: "link",
      bullets: [FLOW_A.requirement],
    },
  },
  studentaid: {
    mcp: {
      nodeId: "6217:30594",
      title: "Medical Care Plan (MCP)",
      titleStyle: "muted",
      bullets: [
        "Must have a valid driver’s license, health card, or have neither because out of province",
      ],
    },
    mrd: {
      nodeId: "6217:34280",
      title: "Motor Registration Division (MRD)",
      titleStyle: "muted",
      bullets: ["Must have a valid driver's license"],
    },
    gnl_idv: {
      nodeId: "6217:30620",
      title: "GNL Identity Verification Service",
      titleStyle: "link",
      bullets: [
        "Must have a valid driver's license, health card, or have neither because out of province",
      ],
    },
  },
};

/**
 * The method step's frame, per service. PP-07 IS NOT NL-07 AT A DIFFERENT
 * WIDTH — it was redrawn on the larger wizard scale the Summary / Terms /
 * Confirm-details screens use, and every measured value says so
 * (get_design_context on 6217:30590 / 6217:30595, 2026-09-28):
 *
 *                     NL-07 (6031:6304)       PP-07 (6206:27601)
 *   section title     28px Bold               36px Bold
 *   section subtitle  15px                    16px
 *   option title      16px                    18px
 *   verify + bullets  14px                    16px
 *   bullet marker     4x4 dot, centred        4x15 box, dot at the foot
 *   main-content      993 tall (pinned)       1259 tall (152 + 955 + 152)
 *
 * NL-07 is a frozen baseline and keeps its scale, so the screen component
 * takes `scale` and draws each frame as its own frame measures. This does not
 * resolve Q-23 (the 28px-vs-36px step-down on Flow A); it reproduces that the
 * design file answered it differently for Flow B.
 */
export type MethodStepScale = "nl07" | "pp07";

export type MethodStepFrame = {
  scale: MethodStepScale;
  nodeIds: {
    main: string;
    sectionIntro: string;
    sectionTitle: string;
    sectionSubtitle: string;
    options: string;
    actions: string;
    cancel: string;
  };
};

const METHOD_STEP: Record<ServiceId, MethodStepFrame> = {
  "driver-vehicle": {
    scale: "nl07",
    nodeIds: {
      main: "6031:6306",
      sectionIntro: "6031:6318",
      sectionTitle: "6031:6319",
      sectionSubtitle: "6031:6320",
      options: "6031:6321",
      actions: "6031:6348",
      cancel: "6031:6349",
    },
  },
  studentaid: {
    scale: "pp07",
    nodeIds: {
      main: "6206:27603",
      sectionIntro: "6217:30590",
      sectionTitle: "6217:30591",
      sectionSubtitle: "6217:30592",
      options: "6217:30593",
      actions: "6217:30633",
      cancel: "6217:30634",
    },
  },
};

/**
 * The scope rows a service's Terms screen lists under "By Accepting This Policy
 * You're Allowing To:". Flow A: the four rows of the service page's Data &
 * Privacy card (SHARED_DATA_SCOPES). Flow B: §9 PP-05 "Plus the 7 scopes" — the
 * seven rows of PP-03's consent-list. One source per service, per §10.2.
 */
const TERMS_SCOPES: Record<ServiceId, readonly ScopeItem[]> = {
  "driver-vehicle": SHARED_DATA_SCOPES,
  studentaid: STUDENTAID_SCOPES,
};

export const WIZARD_ACTIONS = {
  cancelLabel: "Cancel",
  backLabel: "Back",
  continueLabel: "Continue",
} as const;

/**
 * EVERY PER-SERVICE STRING ON THE DESKTOP WIZARD, for one service.
 *
 * The comment blocks on each field below are the ones that used to sit on the
 * module constants of the same name; they describe Flow A's frames because
 * those are the measured ones. Flow B's deviations are noted where they occur.
 */
export function getOnboardingCopy(service: ServiceConfig) {
  const routes = serviceRoutes(service.id);

  /*
   * Where "GNL Identity Verification Service" goes — the card AND the method
   * step's Continue, which are kept identical so a presenter who clicks either
   * lands on the same screen.
   *
   *   Flow A  -> the mobile hand-off (Figma 6217:62059). Was /cid/welcome/
   *              until 2026-09-21, then /cid/terms/ until 2026-09-22.
   *   Flow B  -> PP-08 "Other verification" (6217:35183) FIRST, because
   *              `otherVerificationStep` is true; PP-08's Continue then goes to
   *              Flow B's own hand-off, /cid/studentaid/continue-on-mobile/.
   *
   * `CID_ROUTES.handoff` is spelled out for Flow A (rather than
   * `cidRoutes(service.id).handoff`) only so the string is visibly the one the
   * old `IDV_OPTIONS` used; the two are the same string.
   */
  const handoff =
    service.id === "driver-vehicle" ? CID_ROUTES.handoff : cidRoutes(service.id).handoff;
  const gnlIdvHref = service.otherVerificationStep ? routes.otherVerification : handoff;

  const defs = METHOD_OPTIONS[service.id];
  const idvOptions: readonly IdvOption[] = service.methods.map((method) => {
    const def = defs[method];
    if (!def) {
      /* Loud at BUILD time, like `toServiceId`: a method in the config with no
         card defined here would otherwise render as nothing on stage. */
      throw new Error(`No method card defined for ${service.id} / ${method}`);
    }
    return {
      ...def,
      selected: method === service.defaultMethod,
      verifyIntro: VERIFY_INTRO,
      /* Only the CertifiO ID option navigates; the others are inert -> toast. */
      ...(method === "gnl_idv" ? { href: gnlIdvHref } : {}),
    };
  });

  return {
    wizardTitle: service.title,
    sectionIntro: SECTION_INTRO,
    methodStep: METHOD_STEP[service.id],
    idvOptions,
    /** The method step's Continue — the same target as the GNL IDV card. */
    methodContinueHref: gnlIdvHref,

    /* ------------------------------------------------------------------- *
     * PREREQUISITE CONFIRMED — Figma 6217:81644
     * (`Driver and Vehicle_Prerequisite confirmed`), 1440 x 996.2152099609375.
     * Flow B: 6217:80071 (PP-21), 1440 x 1020.215 — the same frame with the
     * StudentAidNL title and requirement, which wraps to two lines (the row is
     * 48 tall, not 24), hence the 24px taller frame.
     *
     * ADDED 2026-09-22. This is step 7 of the Driver-and-Vehicle journey, the
     * screen the flow skipped entirely: `/auth/loading/` went straight to
     * `/services/driver-vehicle/confirmation/` with nothing between. It is a
     * SEPARATE SCREEN from the confirmation frame, not a variant of it — the two
     * sit side by side on the same canvas row (x=23416.06 then x=25108.81), the
     * stepper is on `Prerequisite Check` here and `Ready to Use` there, and the
     * copy has nothing in common. See design/verification-frame-map.md §4.
     *
     * Copy is character-for-character from `get_design_context` on 6217:81647
     * (Flow A) and 6217:80074 (Flow B, read 2026-09-28).
     *
     * APOSTROPHES — NOTE THE DISAGREEMENT WITH THE FRAME NEXT DOOR. This frame
     * uses the TYPOGRAPHIC U+2019 in BOTH strings: "it’s you" (6217:81660) and
     * "driver’s license" (6217:81662). The prerequisite-check frame 6031:6304
     * above uses the STRAIGHT U+0027 for the same requirement sentence
     * ("Must have a valid driver's license", IDV_OPTIONS bullets). Same words,
     * two different apostrophes, in one file. Both are reproduced verbatim; a
     * straight quote here would be a pixel-gate failure and vice versa. PP-21
     * uses U+2019 in both too (6217:80867 / 6217:80865).
     *
     * TRAILING SPACE. `intro` ends with a space in the design file, after the
     * colon. Kept — removing it would be a silent edit to Figma copy. PP-21's
     * 6217:80867 has the same trailing space.
     *
     * "license" IS THE AMERICAN SPELLING, as designed. The rest of the portal
     * says "licence" (see LINKED_ITEMS). Reproduced, not harmonised.
     * ------------------------------------------------------------------- */
    prereqConfirm: {
      /** section-title 6217:81659 — 36px Bold on --gnl-heading. */
      title: "Confirm some details",
      /** card-description 6217:81660 — 16px Regular #5f6368, leading 24px. */
      intro:
        `To onboard to ${service.title}, you need to confirm it’s you by providing the following information: `,
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
        label: service.requirementConfirmed,
        status: "Confirmed",
      },
    },

    /* ------------------------------------------------------------------- *
     * NL-04 SUMMARY — Figma `6031:6242` (screenshot only). PP-04 is the same
     * screen with "Welcome to StudentAidNL" (§9) and has no Figma node at all.
     *
     * §8.1 writes the three items as one sentence each — "1. Terms and
     * Conditions: Read and accept our…". The screenshot draws them as a TITLE
     * line above a BODY line with the colon dropped, so that is the structure
     * used, with the brief's words unchanged on both sides of the split.
     *
     * Q-01 — "IS NOTIFICATION SETTINGS A WIZARD STEP?" — IS ANSWERED NO, HERE.
     * `6102:101142` shows a FIVE-step progress bar including it; the built
     * wizard, this screenshot and the two beside it all show FOUR. The brief
     * settles the build: §8.1 NL-04, last line — *"The wizard has 4 steps; there
     * is no Notification Settings step in this demo."* So item 3 stays in the
     * body copy, where the screenshot puts it, and the bar stays at four steps.
     * See DEMO_AUDIT.md Q-01.
     * ------------------------------------------------------------------- */
    summary: {
      /** Figma screenshot: ~36px heading, same slot as PREREQ_CONFIRM.title. */
      title: `Welcome to ${service.title}`,
      intro:
        "Here is what you'll need and what to expect when onboarding this service. Note: you may opt out of service onboarding at any time.",
      /**
       * The numbered list. The number is part of the title string, as §8.1 and
       * the screenshot both write it — not a CSS counter, so it cannot silently
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
           * KEPT, AND THERE IS NO STEP FOR IT. See the Q-01 note above: the
           * brief lists this item and forbids the step. Do not add a fifth
           * stepper label to "make them agree" — that is the guess §8.1 rules
           * out.
           */
          title: "3. Notification Settings",
          body: "Choose your preferred method of communication to receive important alerts and updates.",
        },
      ],
    },

    /* ------------------------------------------------------------------- *
     * NL-05 TERMS AND CONDITIONS — Figma `6031:6243` (screenshot only). PP-05
     * has no Figma node; §9 gives its copy.
     *
     * `documentName`, `lastModified`, `version` and — since 2026-09-28 — the
     * consent paragraph all come from the service config (§12.1 `terms`),
     * because they are exactly what Flow B changes: PP-05 is this screen with
     * "StudentAidNL", 2026-08-26, Version 7 and a different consent text.
     * `scopes` is per-service too: four rows for Flow A, seven for Flow B.
     * ------------------------------------------------------------------- */
    terms: {
      /** Page heading, the same 36px slot as the other two wizard screens. */
      title: "Terms and Conditions",
      /** Sub-heading — the service's own terms document name. */
      documentName: service.terms.name,
      lastModifiedLabel: `Last modified: ${service.terms.lastModified}`,
      versionLabel: `Version ${service.terms.version}`,
      /**
       * The consent paragraph, split at the email so the address can be a link
       * the way the screenshot draws it. The parts concatenate to the brief's
       * string exactly. See `ServiceTerms.consent`.
       */
      consentBody: service.terms.consent.beforeEmail,
      consentEmail: service.terms.consent.email,
      consentAfterEmail: service.terms.consent.afterEmail,
      scopesTitle: "By Accepting This Policy You're Allowing To:",
      scopes: TERMS_SCOPES[service.id],
      checkboxLabel: "I have read and accept terms and condition",
      /** §7.4, verbatim. Shown under the checkbox, in red, on an unticked Consent. */
      validationMessage: "To continue, you must agree to the terms and conditions.",
      consentLabel: "I Consent",
      declineLabel: "I Do Not Consent",
    },

    /* ------------------------------------------------------------------- *
     * NL-06 CONFIRM SOME DETAILS: **REQUIRED** — Figma `6031:6301` (screenshot
     * only). PP-06: `6206:27501`, ALSO a pasted screenshot, read 2026-09-28.
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
     * All four disagreements are the design file's own and every one is
     * reproduced rather than harmonised. PP-06's requirement is a FIFTH
     * spelling of the sentence — "driver license", no apostrophe — see
     * `studentaid.requirement` in the config.
     *
     * NO DIVIDER RULE. The NL-06 screenshot draws a hairline under the
     * requirement row (PP-06's does too); the CONFIRMED frame 6217:81644 —
     * which is a real, measured frame, and a frozen baseline — draws neither.
     * The component follows the measured frame, so the two states are the same
     * screen and the `prereq-confirm` baseline does not move.
     * ------------------------------------------------------------------- */
    prereqRequired: {
      title: "Confirm Some Details",
      intro: `To onboard to ${service.title}, you need to confirm it is you by providing the following information:`,
      requirement: {
        label: service.requirement,
        status: "Required",
      },
    },

    /* ------------------------------------------------------------------- *
     * PP-08 OTHER VERIFICATION — Figma 6217:35183, 1440 x 1030.215. FLOW B
     * ONLY; `otherVerificationStep` decides whether the screen exists.
     *
     * Copy is character-for-character from get_design_context on 6217:35197
     * and 6217:35200 (read 2026-09-28), and agrees with §9 PP-08 word for word.
     * ------------------------------------------------------------------- */
    otherVerification: {
      /** section-title 6217:35198 — 36px Bold on --gnl-heading. */
      title: "Other verification",
      /** 6217:35234 — beside the pre-selected radio. */
      option: "This option is for users who do not have a valid MCP number or MRD-issued ID.",
      /** 6217:35237 — under it, same 16px Regular #5f6368. */
      confirmation: "By continuing, you confirm that this applies to you.",
      /** Continue -> this service's CertifiO ID hand-off (§9 "Continue -> PP-09"). */
      continueHref: handoff,
    },
  };
}

export type OnboardingCopy = ReturnType<typeof getOnboardingCopy>;

/* ========================================================================= *
 * FLOW A's COPY, UNDER THE NAMES IT HAS ALWAYS HAD.
 *
 * Every export below is `getOnboardingCopy(FLOW_A)`'s field of the same
 * meaning. They are kept so that nothing importing them had to change in the
 * same pass that parameterised them — the same arrangement as `CID_ROUTES` in
 * the config. See the note at the top of this file.
 *
 * TIER 1 PROVENANCE, still true of Flow A's three front screens: NL-04, NL-05
 * and NL-06 exist in Figma ONLY as pasted screenshots of the live portal —
 * `6031:6242`, `6031:6243` and `6031:6301`. Their copy is taken **verbatim from
 * BUILD_BRIEF.md §8.1**; the screenshots confirm structure only. Every
 * apostrophe in §8.1's copy for these screens is U+0027 and is reproduced as
 * the brief writes it (Q-22).
 * ========================================================================= */
const FLOW_A_COPY = getOnboardingCopy(FLOW_A);

export const WIZARD_TITLE = FLOW_A_COPY.wizardTitle;

/** Frame 1 — Figma 6031:6321. Order is top-to-bottom as designed. */
export const IDV_OPTIONS: readonly IdvOption[] = FLOW_A_COPY.idvOptions;

export const PREREQ_CONFIRM = {
  ...FLOW_A_COPY.prereqConfirm,
  requirement: {
    ...FLOW_A_COPY.prereqConfirm.requirement,
    nodeId: "6217:81661",
    labelNodeId: "6217:81662",
    statusNodeId: "6217:81663",
  },
} as const;

export const SUMMARY = FLOW_A_COPY.summary;
export const TERMS = FLOW_A_COPY.terms;
export const PREREQ_REQUIRED = FLOW_A_COPY.prereqRequired;
