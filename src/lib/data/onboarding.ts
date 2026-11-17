/**
 * Copy for the desktop onboarding wizard (Summary -> Terms -> Prerequisite
 * Check -> Ready to Use), per service.
 *
 * GNWT RE-BRAND — release-2, 2026-11-16. Spec: gnwt-specs/B-wizard.md, Figma
 * `Hfj015MPSmeRPYg72vZxTI` "GNWT | Demo - IDV and VC integration":
 *   Flow 1 Driver and Vehicle Services      24:48794 summary, 24:49022 T&C,
 *          24:49147 prereq, 25:51591 method, 32:55012 confirmed, 32:55108 success
 *   Flow 2 Student Financial Assistance     40:76892, 42:76944, 42:77005,
 *          42:77032, 42:80944, 44:81091
 *
 * The GNL-only pieces are gone: the MRD / MCP method cards, the numbered
 * three-item summary, the Newfoundland consent paragraph and its e-mail link,
 * "I Do Not Consent", and the PP-08 "Other verification" step.
 *
 * Every per-service string comes from the service config (`SERVICES` in
 * service-config.ts); `getOnboardingCopy(service)` assembles it. The service
 * is decided at BUILD time by each route's own `getService(...)` call.
 *
 * APOSTROPHES ARE THE DESIGN'S. The intro sentence uses a curly ’ ("it’s you")
 * and ends with a trailing space; Flow 1's requirement uses a straight ',
 * Flow 2's a curly ’. Reproduced, not harmonised.
 */

import {
  cidRoutes,
  type IdvMethod,
  type ServiceConfig,
  type ServiceId,
} from "@/lib/data/service-config";

export const SECTION_INTRO = {
  title: "Services",
  subtitle: "The following services will help us to confirm it is you:",
} as const;

/** How an option card's title is painted. GNWT has only the link style. */
export type OptionTitleStyle = "link";

export type IdvOption = {
  nodeId: string;
  title: string;
  titleStyle: OptionTitleStyle;
  /** Whether the radio is selected. */
  selected: boolean;
  /** Intro line above the bullet list. */
  verifyIntro: string;
  bullets: readonly string[];
  /** Set only on the option that navigates (the CertifiO hand-off). */
  href?: string;
};

/** One card's own content, before the service decides selection and href. */
type MethodOptionDef = Omit<IdvOption, "selected" | "href" | "verifyIntro">;

const VERIFY_INTRO = "This verification service is able to verify:";

const GNWT_IDV_TITLE = "GNWT Identity Verification Service";

/**
 * The method cards, per service, keyed by method. ONE card in both GNWT flows
 * (Figma 25:51591 / 42:77032). The bullet is the service's requirement
 * sentence, spelled exactly as that service's frames spell it.
 *
 * Node ids are the GNL ones the tests already address; kept on purpose.
 */
const METHOD_OPTIONS: Record<ServiceId, Partial<Record<IdvMethod, MethodOptionDef>>> = {
  "driver-vehicle": {
    gnl_idv: {
      nodeId: "6031:6335",
      title: GNWT_IDV_TITLE,
      titleStyle: "link",
      bullets: ["Must have a valid driver's license or acceptable form of photo ID"],
    },
  },
  studentaid: {
    gnl_idv: {
      nodeId: "6217:30620",
      title: GNWT_IDV_TITLE,
      titleStyle: "link",
      bullets: ["Must have a valid driver’s license, health card or other"],
    },
  },
};

/** Node ids on the method step (kept from the GNL frames for the tests). */
export type MethodStepFrame = {
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

/** Which icon a Terms scope row draws (Bootstrap `envelope-at-fill` / `person-circle`). */
export type TermsScopeIcon = "envelope-at" | "person-circle";
export type TermsScope = { label: string; icon: TermsScopeIcon };

/**
 * "This service receives the following data from your profile:" rows.
 * Flow 2's frame (42:76944) draws the heading with NO rows under it —
 * reproduced as drawn; open question for the designer.
 */
const TERMS_SCOPES: Record<ServiceId, readonly TermsScope[]> = {
  "driver-vehicle": [
    { label: "Your email address", icon: "envelope-at" },
    { label: "Your username", icon: "person-circle" },
  ],
  studentaid: [],
};

/**
 * The Summary screen's primary CTA. The design file disagrees with itself:
 * Flow 1 (24:48794) says "I Consent", Flow 2 (40:76892) says "Continue".
 * Each frame is followed as drawn; open question for the designer.
 */
const SUMMARY_CTA: Record<ServiceId, string> = {
  "driver-vehicle": "I Consent",
  studentaid: "Continue",
};

export const WIZARD_ACTIONS = {
  cancelLabel: "Cancel",
  backLabel: "Back",
  continueLabel: "Continue",
} as const;

/** Every per-service string on the desktop wizard, for one service. */
export function getOnboardingCopy(service: ServiceConfig) {
  /*
   * Where the GNWT IDV card and the method step's Continue go: always this
   * service's CertifiO hand-off. There is no "Other verification" step.
   */
  const handoff = cidRoutes(service.id).handoff;

  const defs = METHOD_OPTIONS[service.id];
  const idvOptions: readonly IdvOption[] = service.methods.map((method) => {
    const def = defs[method];
    if (!def) {
      /* Loud at BUILD time: a method in the config with no card defined here
         would otherwise render as nothing on stage. */
      throw new Error(`No method card defined for ${service.id} / ${method}`);
    }
    return {
      ...def,
      selected: method === service.defaultMethod,
      verifyIntro: VERIFY_INTRO,
      ...(method === "gnl_idv" ? { href: handoff } : {}),
    };
  });

  /* Curly ’ and a trailing space, as Figma 24:49147 / 42:77005 spell it. */
  const prereqIntro = `To onboard to ${service.title}, you need to confirm it’s you by providing the following information: `;

  return {
    wizardTitle: service.title,
    sectionIntro: SECTION_INTRO,
    methodStep: METHOD_STEP[service.id],
    idvOptions,
    /** The method step's Continue — the same target as the GNWT IDV card. */
    methodContinueHref: handoff,

    /** Prerequisite Check, CONFIRMED — 32:55012 / 42:80944. */
    prereqConfirm: {
      title: "Confirm some details",
      intro: prereqIntro,
      requirement: {
        label: service.requirementConfirmed,
        status: "Confirmed",
      },
    },

    /** Summary — 24:48794 / 40:76892. */
    summary: {
      title: `Welcome to ${service.title}`,
      note: "Note: you may opt out of service onboarding at any time.",
      items: [
        {
          title: "Terms and Conditions",
          body: "Read and accept our Terms and Conditions to understand your rights and our commitment to your privacy.",
        },
      ],
      ctaLabel: SUMMARY_CTA[service.id],
    },

    /** Terms and Conditions — 24:49022 / 42:76944. */
    terms: {
      title: "Terms and Conditions",
      documentName: service.terms.name,
      lastModifiedLabel: `Last modified: ${service.terms.lastModified}`,
      versionLabel: `Version ${service.terms.version}`,
      paragraphs: service.terms.paragraphs,
      scopesTitle: "This service receives the following data from your profile:",
      scopes: TERMS_SCOPES[service.id],
      checkboxLabel: service.terms.checkboxLabel,
      showDocumentName: service.terms.showName,
      /** §7.4, verbatim. Shown under the checkbox, in red, on an unticked Consent. */
      validationMessage: "To continue, you must agree to the terms and conditions.",
      consentLabel: "I Consent",
    },

    /** Prerequisite Check, REQUIRED — 24:49147 / 42:77005. */
    prereqRequired: {
      title: "Confirm some details",
      intro: prereqIntro,
      requirement: {
        label: service.requirement,
        status: "Required",
      },
    },

    /**
     * The retired PP-08 route only forwards to the hand-off now (see
     * OtherVerificationScreen); this is where it forwards to.
     */
    otherVerification: {
      continueHref: handoff,
    },
  };
}

export type OnboardingCopy = ReturnType<typeof getOnboardingCopy>;
