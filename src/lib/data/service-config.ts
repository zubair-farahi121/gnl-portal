/**
 * SERVICES — the one object per service holding everything that differs
 * between Flow A (Driver and Vehicle) and Flow B (StudentAidNL).
 *
 * BUILD_BRIEF.md §12.1, verbatim field list. §9 opens with the rule this file
 * exists to make true: *"Reuse every Flow A component; differences live in the
 * service config (12.1)."*
 *
 * ====================================================================
 * WHY THIS LANDED BEFORE ANY FLOW B SCREEN WAS BUILT
 *
 * DEMO_AUDIT.md §8 corrects the headline number: Flow B is **21 BUILD rows but
 * only about seven genuinely new screens**. Eleven of those rows (PP-09..PP-19)
 * are the SAME ten `/cid/` routes the demo already has, with a different
 * service title, different step-5 copy and two behaviour flags —
 * `defaultDocument: PASSPORT` and `captureSides: ['front']`.
 *
 * That arithmetic only holds if the config exists first. §8 again: *"Tier 0.3
 * (the service config) is the one irreversible decision. Done on Wednesday it
 * makes Flow B cheap; started on Friday it becomes the reason Flow B does not
 * ship."*
 * ====================================================================
 *
 * ====================================================================
 * THE CONSTRAINT THAT SHAPED EVERY LINE BELOW
 *
 * Most of the literals this file replaces live on screens BUILD_BRIEF.md §1.4
 * marks **KEEP** — "a KEEP screen must not be refactored or restyled" — and
 * §15 requires "KEEP screens unchanged (compare screenshots before and after)".
 *
 * Reading a value from config instead of from a literal is not a restyle. But
 * it has to produce **byte-identical rendered output for `driver-vehicle`**,
 * and that is checked, not asserted: `npm run diff` compares all 19 frames
 * against baselines frozen before this change and must stay at 0.000%.
 *
 * Two consequences you will see below and should not "tidy":
 *
 *   1. EVERY STRING IS THE EXISTING STRING, CHARACTER FOR CHARACTER, including
 *      the design file's inconsistent apostrophes and its American "license".
 *      Nothing was harmonised on the way in. If a value here disagrees with
 *      another value here, the design file disagrees with itself — see
 *      `requirement` / `requirementConfirmed` below, and
 *      design/token-exceptions.md.
 *
 *   2. THE ROUTES ARE THE APP'S EXISTING ROUTES, not the suggestions in
 *      BUILD_BRIEF.md §6. §6 says so itself: *"Suggestions. If the app already
 *      has a path for a screen, keep the existing one."* `serviceRoutes()`
 *      reproduces `/services/driver-vehicle/…` exactly as the pages spelled it.
 * ====================================================================
 *
 * WHAT THIS PASS DID **NOT** DO: no Flow B screen and no Flow B route was
 * built. The `studentaid` entry below is complete and inert — nothing renders
 * it yet. That is deliberate; see `DEFAULT_SERVICE_ID`.
 *
 * UPDATE 2026-09-28: that is no longer true. The CID screens have rendered
 * `studentaid` since 2026-09-23 (src/app/cid/[serviceId]/), and Flow B's
 * desktop wizard and service page render it from today
 * (src/app/services/[serviceId]/). `terms.consent` and the `otherVerification`
 * route were added for them; nothing about Flow A's values changed.
 */

/** The two services in the demo. Route segment and config key are the same string. */
export type ServiceId = "driver-vehicle" | "studentaid";

/**
 * The service whose screens live at the app's bare, un-prefixed paths —
 * `/services/driver-vehicle/…` and `/cid/…`.
 *
 * MOVED TO THE TOP OF THE FILE 2026-09-23, from just above `getService` at the
 * bottom, because `CID_ROUTES` below is now DERIVED from it and a `const` read
 * before its declaration is a TDZ crash, not a lint nit. The reasoning that
 * used to sit here is in the seam note at the foot of the file, which is where
 * it belongs now that the seam has actually been cut.
 */
export const DEFAULT_SERVICE_ID: ServiceId = "driver-vehicle";

/**
 * Verification methods on the "Choose verification service" step.
 * `gnl_idv` is the CertifiO ID journey and is selected by default in both
 * flows (§8.1 NL-07, §9 PP-07). `mrd` and `mcp` are the P2 legacy forms.
 */
export type IdvMethod = "mrd" | "mcp" | "gnl_idv";

/** §12.1 spells these two in upper snake case; kept as the brief writes them. */
export type DocumentType = "DRIVERS_LICENCE" | "PASSPORT";

export type CaptureSide = "front" | "back";

export type ServiceTerms = {
  /** Sub-title on the Terms screen: "Driver and Vehicle Services". */
  name: string;
  /** Rendered verbatim after "Last modified: ". */
  lastModified: string;
  /** Rendered verbatim after "Version ". A string, because the design shows no unit. */
  version: string;
  /**
   * The consent paragraph in the Terms scroll box (NL-05 / PP-05).
   *
   * ADDED 2026-09-28 WITH FLOW B's DESKTOP WIZARD. DEMO_AUDIT.md "What Tier 2
   * inherits", item 1: *"The Terms consent paragraph is still hardcoded for
   * `driver-vehicle` … Flow B's paragraph (§9 PP-05) is a DIFFERENT TEXT, not a
   * substitution. Add a `consent` field to `ServiceConfig` before building
   * PP-05, or that screen will fork."* This is that field.
   *
   * THREE PARTS, NOT ONE STRING, because the email address inside the paragraph
   * is drawn as a link (an inert <button> — see the Terms screen) and the two
   * paragraphs put it in different places: Flow A's ENDS on the address, Flow
   * B's has a full stop after it. `afterEmail` is "" for Flow A, and the screen
   * renders nothing at all for an empty string, so Flow A's DOM is unchanged.
   */
  consent: {
    beforeEmail: string;
    email: string;
    afterEmail: string;
  };
};

export type ServiceConfig = {
  id: ServiceId;
  /** Service page title, wizard title and CID wizard title — one string, three places. */
  title: string;
  /** Service page sub-title, under the badge. §10.1 fixes the Flow B wording. */
  subtitle: string;
  /**
   * The single prerequisite sentence, as the **prerequisite-check** frame
   * spells it: STRAIGHT apostrophe U+0027.
   *
   * See `requirementConfirmed` for why there are two.
   */
  requirement: string;
  /**
   * THE SAME SENTENCE, TYPOGRAPHIC APOSTROPHE U+2019 — because Figma uses a
   * different apostrophe on the "Confirm some details: Confirmed" frame
   * (6217:81644) than on the prerequisite-check frame (6031:6304), for the
   * same words, in the same file.
   *
   * This is NOT a modelling mistake and must not be collapsed into one field.
   * It is logged in design/token-exceptions-phase2b.md and reproduced on
   * purpose: substituting one for the other is a visible glyph change and a
   * pixel-gate failure in whichever direction it is done.
   *
   * CORRECTED 2026-09-28. This used to say "Flow B's requirement contains no
   * apostrophe at all, so both fields carry the same string there." It does
   * contain one, and the two Flow B frames disagree with each other even more
   * than Flow A's do — see the `studentaid` entry below.
   */
  requirementConfirmed: string;
  /** Options on NL-07 / PP-07, in the order the frames draw them. */
  methods: readonly IdvMethod[];
  /** Pre-selected method. `gnl_idv` in both flows (§8.1, §9). */
  defaultMethod: IdvMethod;
  /** Flow B inserts PP-08 "Other verification" between the method step and the hand-off. */
  otherVerificationStep: boolean;
  /** Pre-selected row on the "Accepted documents" screen (NL-14 / PP-15). */
  defaultDocument: DocumentType;
  /** Flow A photographs both sides of a licence; Flow B photographs a passport once. */
  captureSides: readonly CaptureSide[];
  /**
   * Heading on each capture screen. Flow B drops "(front)" per §10.1 and has
   * no `back` entry at all, which is why this is a partial record and not a
   * full one — a `back` title for a service with no back capture would be
   * dead copy that a later reader would mistake for a screen.
   */
  captureTitles: Partial<Record<CaptureSide, string>>;
  /** Named inside the step-5 sentence: "securely access <label> services". */
  successServiceLabel: string;
  /** The step-5 bullet list. §10.1 replaces all four for Flow B. */
  availableServices: readonly string[];
  /** The primary CTA on the "Ready to Use / Success!" screen. */
  goToServiceLabel: string;
  terms: ServiceTerms;
};

/**
 * Route destinations per service.
 *
 * THESE ARE THE APP'S EXISTING PATHS. Before this file they were 13 string
 * literals spread across six page components; the strings produced here are
 * character-for-character what those literals said, trailing slash and query
 * string included, which is what keeps `driver-vehicle` byte-identical.
 *
 * `?verified=1` is reproduced rather than fixed. DEMO_AUDIT.md X-04 is right
 * that the Trusted state belongs in the persisted store (§7.5 / §12.2) instead
 * of a query param — but that is Tier 1 item 1.4, a behaviour change, and this
 * pass is a refactor that must not change behaviour. Centralising it here is
 * what makes that later change a one-line edit instead of a five-file hunt.
 */
export function serviceRoutes(id: ServiceId) {
  const base = `/services/${id}/`;
  return {
    /** Service page, pre-verification (NL-03 / PP-03). */
    page: base,
    /** Service page, Trusted (NL-25 / PP-23). */
    pageVerified: `${base}?verified=1`,
    /** Summary, step 1 of the wizard, 25 % (NL-04 / PP-04). Added Tier 1. */
    summary: `${base}summary/`,
    /** Terms and Conditions, step 2, 50 % (NL-05 / PP-05). Added Tier 1. */
    terms: `${base}terms/`,
    /**
     * Confirm Some Details: **Required** (NL-06 / PP-06). Added Tier 1.
     *
     * TWO ROUTES, ONE COMPONENT — and the two-letter difference between
     * `prerequisite` and a hypothetical `prerequisites` is exactly why this one
     * is not called that. BUILD_BRIEF.md §6 suggests `.../prerequisites` for
     * Required and `.../prerequisites/confirmed` for Confirmed; the app already
     * spells the Confirmed screen `.../prerequisite/` and §6 says to keep an
     * existing path, so the Required twin gets a name that cannot be misread as
     * the other one.
     *
     * WHY NOT ONE ROUTE WHOSE STATE COMES FROM THE STORE. The Confirmed screen
     * is a frozen baseline frame (`prereq-confirm` in design/frames.json) and
     * the store is only readable AFTER mount — see the hydration note in
     * src/lib/demo-state.tsx. A single store-driven route would render Required
     * first and flip to Confirmed a frame later on every load: a visible flash
     * on stage, and a race in the pixel gate. Two routes mean each one's
     * server-rendered HTML is already the right state, with no client read at
     * all. The *component* is still one — see ConfirmDetailsCard.
     */
    confirmDetails: `${base}confirm-details/`,
    /** Choose verification service (NL-07 / PP-07). */
    onboard: `${base}onboard/`,
    /**
     * PP-08 "Other verification" — Figma 6217:35183. ADDED 2026-09-28.
     *
     * FLOW B ONLY. It is a path for every service (like `cidRoutes().captureBack`
     * is) but a PAGE only for services with `otherVerificationStep: true` —
     * `otherVerificationParams` below decides which, exactly as
     * `cidBackCaptureParams` decides the back capture. So
     * /services/driver-vehicle/other-verification/ is never generated and
     * nothing links to it.
     *
     * Named for the screen's own heading rather than §6's suggested
     * `.../prerequisites/other`, for the same reason `confirmDetails` is: the
     * app's wizard paths are flat, one segment per screen.
     */
    otherVerification: `${base}other-verification/`,
    /** Confirm some details, **Confirmed** (NL-22 / PP-21). */
    prerequisite: `${base}prerequisite/`,
    /** Ready to Use: Success! (NL-23 / PP-22). */
    confirmation: `${base}confirmation/`,
  } as const;
}

/**
 * The path each CertifiO ID screen hangs off, below whatever prefix the service
 * gets. ONE list, so the two services cannot drift apart by a typo.
 */
const CID_ROUTE_SUFFIXES = {
  handoff: "continue-on-mobile/",
  terms: "terms/",
  biometric: "biometric/",
  liveness: "liveness/",
  livenessCapture: "liveness-capture/",
  country: "country/",
  document: "document/",
  captureIntro: "capture-intro/",
  captureFront: "capture-front/",
  captureBack: "capture-back/",
  /**
   * Y8, the UPLOAD screen — added 2026-09-27.
   *
   * NOT A FIGMA FRAME. Tatyana's recreation has no upload step at all; this
   * screen exists because the real verification does. design/YOTI_OBSERVED.md
   * "Y8 — Upload (6127:50651)" transcribes it: a left-aligned badge, a large
   * block of text naming the document, and a thin progress bar — no button, no
   * help icon, no pinned bar.
   *
   * IT IS IN BOTH FLOWS, and it is the LAST Yoti screen in each, sitting
   * between whichever capture screen the service ends on and step 5:
   *   Flow A  … capture-back  -> upload -> verified
   *   Flow B  … capture-front -> upload -> verified
   * Which capture screen that is comes from `captureSides`, exactly as the
   * forward link on /cid/capture-front/ already did — see that screen.
   */
  upload: "upload/",
  verified: "verified/",
} as const;

/**
 * THE PREFIX PER SERVICE, AND WHY THEY ARE NOT SYMMETRIC.
 *
 * `driver-vehicle` keeps the BARE `/cid/…` paths it has always had. Those
 * eleven URLs are frozen baseline frames (design/frames.json), they are what
 * `npm run diff` measures, and they are what the presenter types on stage. §6
 * of BUILD_BRIEF.md is explicit: *"If the app already has a path for a screen,
 * keep the existing one."* Moving Flow A under `/cid/driver-vehicle/…` for the
 * sake of symmetry would move nineteen frames and gain nothing.
 *
 * `studentaid` gets `/cid/studentaid/…`, built by the `[serviceId]` segment at
 * src/app/cid/[serviceId]/. Only the services that are NOT the default appear
 * under that segment — see `cidVariantParams`.
 */
const CID_BASE: Record<ServiceId, string> = {
  "driver-vehicle": "/cid/",
  studentaid: "/cid/studentaid/",
};

/**
 * The CertifiO ID session routes FOR ONE SERVICE.
 *
 * ONE SET OF SCREENS, TWO SETS OF URLS. DEMO_AUDIT.md §8's "eleven rows, zero
 * new screens" still holds — §9's PP-09..PP-19 are the same ten screens with a
 * different service config — but each service needs its own PRERENDERED copy of
 * them so that the service is decided at build time and never read on the
 * client. See the seam note at the foot of this file for why that matters more
 * than URL tidiness.
 *
 * `captureBack` is in the list for both services because it is a path, not a
 * page: whether that page EXISTS is decided by `captureSides` in
 * `cidVariantParams`, and whether it is *linked* is decided by `captureSides`
 * on the capture-front screen. Flow B does neither.
 */
export function cidRoutes(id: ServiceId) {
  const base = CID_BASE[id];
  return {
    handoff: `${base}${CID_ROUTE_SUFFIXES.handoff}`,
    terms: `${base}${CID_ROUTE_SUFFIXES.terms}`,
    biometric: `${base}${CID_ROUTE_SUFFIXES.biometric}`,
    liveness: `${base}${CID_ROUTE_SUFFIXES.liveness}`,
    livenessCapture: `${base}${CID_ROUTE_SUFFIXES.livenessCapture}`,
    country: `${base}${CID_ROUTE_SUFFIXES.country}`,
    document: `${base}${CID_ROUTE_SUFFIXES.document}`,
    captureIntro: `${base}${CID_ROUTE_SUFFIXES.captureIntro}`,
    captureFront: `${base}${CID_ROUTE_SUFFIXES.captureFront}`,
    captureBack: `${base}${CID_ROUTE_SUFFIXES.captureBack}`,
    upload: `${base}${CID_ROUTE_SUFFIXES.upload}`,
    verified: `${base}${CID_ROUTE_SUFFIXES.verified}`,
  } as const;
}

/**
 * Flow A's CID routes, as eleven plain strings.
 *
 * KEPT AS AN EXPORT ON PURPOSE. `src/lib/flow.ts`, `src/lib/data/onboarding.ts`
 * and the `/services/driver-vehicle/onboard/` page all reach for these, and
 * none of them is service-aware yet. Every string it produces is
 * character-for-character the literal that used to be written here — `/cid/` +
 * the suffix table above — which is what keeps Flow A's HTML byte-identical.
 */
export const CID_ROUTES = cidRoutes(DEFAULT_SERVICE_ID);

/** Routes that are not per-service. */
export const APP_ROUTES = {
  login: "/",
  dashboard: "/dashboard/",
  /** "We've received your information" (NL-21 / PP-20). */
  processing: "/auth/loading/",
  /**
   * BUILD_BRIEF.md §6 `/reset` — clears `gnl-demo:v1` and returns to the login
   * page. §7.1: this, and only this, clears onboarding progress; the header's
   * Log Out keeps it.
   */
  reset: "/reset/",
} as const;

/**
 * The document label as the "Accepted documents" frame spells it.
 *
 * Both strings are verbatim from Figma 6087:31396 and must stay that way:
 * "Driver's License" carries the design's U+0027 apostrophe AND its American
 * spelling, where the rest of the portal says "licence". Reproduced, not
 * harmonised — design/token-exceptions.md §9.8.
 */
export const DOCUMENT_LABEL: Record<DocumentType, string> = {
  DRIVERS_LICENCE: "Driver's License",
  PASSPORT: "Passport",
};

export const SERVICES: Record<ServiceId, ServiceConfig> = {
  /*
   * FLOW A — the built flow. Every string here was lifted from the component
   * or data module that previously hardcoded it, unchanged. If any of them is
   * edited, `npm run diff` will say so.
   */
  "driver-vehicle": {
    id: "driver-vehicle",
    title: "Driver and Vehicle",
    subtitle: "View and manage your driver and vehicle services",
    // U+0027, as the prerequisite-check frame draws it.
    requirement: "Must have a valid driver's license",
    // U+2019, as the prerequisite-confirmed frame draws it. See the type.
    requirementConfirmed: "Must have a valid driver’s license",
    methods: ["mrd", "gnl_idv"],
    defaultMethod: "gnl_idv",
    otherVerificationStep: false,
    defaultDocument: "DRIVERS_LICENCE",
    captureSides: ["front", "back"],
    captureTitles: {
      front: "Capture ID document (front)",
      back: "Capture ID document (back)",
    },
    successServiceLabel: "Driver and Vehicle",
    availableServices: [
      "licence and registration renewals",
      "address changes",
      "driving record purchases",
      // The trailing full stop is the design's; it closes the whole list.
      "road test payments, and more.",
    ],
    // U+2019 in "Driver’s", as the confirmation frame draws it.
    goToServiceLabel: "Go to Service Driver’s License Renewal",
    terms: {
      name: "Driver and Vehicle Services",
      lastModified: "2025-04-29",
      version: "4",
      /*
       * MOVED HERE 2026-09-28 from `TERMS.consentBody` in
       * src/lib/data/onboarding.ts, character for character — the trailing
       * space after "contact" is the join to the address. §8.1 NL-05 verbatim.
       */
      consent: {
        beforeEmail:
          "I consent to Government of Newfoundland and Labrador checking the information that I provide against the Motor Registration Division's system to make sure that I am who I say I am, validate my access to new services as they become available in MyGovNL, and receive personalized notifications regarding my upcoming renewals. For any questions related to how your information is being handled, please contact ",
        email: "digitalgovernment@gov.nl.ca",
        afterEmail: "",
      },
    },
  },

  /*
   * FLOW B — BUILT END TO END 2026-09-28. The CID screens have rendered this
   * entry since 2026-09-23; the desktop wizard and the service page
   * (src/app/services/[serviceId]/) render it from today.
   *
   * Most values are from BUILD_BRIEF.md §9, §10.1 and §12.1. The two
   * requirement strings were RE-READ FROM FIGMA on 2026-09-28 (read-only
   * get_design_context / get_screenshot, no write) and corrected — see below.
   */
  studentaid: {
    id: "studentaid",
    title: "StudentAidNL",
    // §10.1 copy fix — the Figma frame's subtitle still says Driver and Vehicle.
    subtitle: "View and manage your StudentAidNL services",
    /*
     * PP-06 Confirm Some Details: REQUIRED. "driver license" — NO apostrophe
     * and no "s". That is what §9 PP-06 writes and what the only source for the
     * screen draws: 6206:27501 is a pasted screenshot of the live portal, read
     * 2026-09-28, and it says "Must have a valid driver license, health card, or
     * have neither because out of province". Reproduced, not corrected.
     *
     * WAS "driver's license" until 2026-09-28, copied from PP-07's card. PP-07's
     * three cards do not use this field at all any more — they spell their own
     * bullets, because the design gives them THREE different spellings; see
     * `METHOD_OPTIONS` in src/lib/data/onboarding.ts.
     */
    requirement:
      "Must have a valid driver license, health card, or have neither because out of province",
    /*
     * PP-21 Confirm some details: CONFIRMED — Figma 6217:80865, verbatim:
     * TYPOGRAPHIC U+2019 in "driver’s" AND A TRAILING FULL STOP, which §9 PP-21
     * also writes. It was the PP-07 string without the stop until 2026-09-28.
     */
    requirementConfirmed:
      "Must have a valid driver’s license, health card, or have neither because out of province.",
    // PP-07 draws three cards: MCP, MRD, GNL IDV — GNL IDV selected.
    methods: ["mcp", "mrd", "gnl_idv"],
    defaultMethod: "gnl_idv",
    // PP-08 "Other verification" (6217:35183) sits between the method step and the hand-off.
    otherVerificationStep: true,
    defaultDocument: "PASSPORT",
    // No back capture: a passport has one page to photograph.
    captureSides: ["front"],
    // §10.1: "(front)" is dropped on both capture states.
    captureTitles: { front: "Capture ID document" },
    successServiceLabel: "StudentAidNL",
    availableServices: [
      "Apply for student financial assistance",
      "Check your application status",
      "Receive messages about your application",
      "Download tax documents",
    ],
    goToServiceLabel: "Go to Service StudentAidNL",
    terms: {
      name: "StudentAidNL",
      lastModified: "2026-08-26",
      version: "7",
      /*
       * §9 PP-05, verbatim. A DIFFERENT PARAGRAPH from Flow A's, not a
       * substitution into it — "hereby", MCP as well as MRD, no "new services"
       * clause — and it ends with a full stop AFTER the address, which is why
       * `afterEmail` exists.
       */
      consent: {
        beforeEmail:
          "I hereby consent to the Government of Newfoundland and Labrador collecting, using, and verifying the information I provide by comparing it with records maintained by the Motor Registration Division and the Medical Care Plan (MCP). This verification is conducted for the purposes of confirming my identity and delivering personalized notifications where required. Any questions regarding the collection, use, or handling of my personal information may be directed to ",
        email: "digitalgovernment@gov.nl.ca",
        afterEmail: ".",
      },
    },
  },
};

export function getService(id: ServiceId = DEFAULT_SERVICE_ID): ServiceConfig {
  return SERVICES[id];
}

/**
 * ====================================================================
 * THE SEAM, AND HOW IT WAS CUT — 2026-09-23.
 *
 * THIS BLOCK USED TO SAY the CID screens resolved their service through a
 * single module constant, `CID_SERVICE`, which always answered
 * "driver-vehicle"; that when Flow B was built that constant was the ONE thing
 * to replace; and that there were two ways to do it — (a) read the service out
 * of the `gnl-demo:v1` store, or (b) put `?service=studentaid` on the links.
 *
 * NEITHER WAS TAKEN, AND BOTH SHOULD STAY REJECTED.
 *
 *   (a) THE STORE IS ONLY READABLE AFTER MOUNT. See the hydration note in
 *       src/lib/demo-state.tsx, and the identical argument already made for
 *       `confirmDetails` vs `prerequisite` in `serviceRoutes` above. A
 *       store-driven CID screen would server-render "Driver and Vehicle",
 *       hydrate, and flip to "StudentAidNL" a frame later: a visible flash on
 *       stage, in the wizard title, on ten consecutive screens, plus a race in
 *       the pixel gate. The whole point of a static export is that the HTML is
 *       already right.
 *
 *   (b) A QUERY PARAM shows in the URL on stage — the same objection
 *       DEMO_AUDIT.md raises against `?verified=1` — AND it makes every CID
 *       page read `useSearchParams`, which in a statically-exported App Router
 *       page means a Suspense boundary and a client render of the title. Same
 *       flash, plus a uglier URL.
 *
 * WHAT WAS DONE INSTEAD: the service is a PARAMETER, decided at BUILD time.
 *
 *   - `getCidCopy(service)` in src/lib/data/cid.ts replaced the module-level
 *     constants. Nothing in the CID tree computes copy at import time any more.
 *   - Every screen's markup moved to a component under
 *     src/components/cid/screens/ that takes `service: ServiceConfig` as an
 *     explicit prop. `CidScreen` takes it too, and reads the wizard title off
 *     it rather than off a global.
 *   - `src/app/cid/<screen>/page.tsx` binds those components to
 *     `getService("driver-vehicle")` — Flow A, at the URLs it has always had.
 *   - `src/app/cid/[serviceId]/<screen>/page.tsx` binds the SAME components to
 *     whichever service `generateStaticParams` names. `output: export`
 *     prerenders one static HTML file per screen per service, so
 *     /cid/studentaid/terms/ is a real file on disk with "StudentAidNL" already
 *     in it. No client read, no flash, and every screen still individually
 *     addressable by URL — which is what keeps the presenter's ArrowRight and
 *     type-the-URL recovery working on stage (DEMO_AUDIT.md §7, item 3.2).
 *
 * THE RULE THE OLD NOTE ENDED ON STILL STANDS: there is exactly ONE resolution
 * point per route — the page's own `getService(...)` call — and nothing below
 * it reads a service from anywhere else. Do not add a second one.
 * ====================================================================
 */

/**
 * The services that get their own `/cid/[serviceId]/…` copies of the CertifiO
 * ID screens, as `generateStaticParams` wants them.
 *
 * `driver-vehicle` is EXCLUDED because it already owns the bare `/cid/…` paths
 * (see `CID_BASE`). Generating it here as well would publish a second, silently
 * duplicate copy of eleven frozen baseline frames at `/cid/driver-vehicle/…` —
 * two URLs for one screen, and a second thing to keep at 0.000 %.
 *
 * Re-exported as `generateStaticParams` by each page under
 * src/app/cid/[serviceId]/, so the list of Flow B routes is declared once.
 */
/**
 * Narrow a raw route segment to a `ServiceId`, loudly.
 *
 * `generateStaticParams` hands Next.js strings and Next.js hands them back as
 * strings, so something has to close the loop. It THROWS rather than falling
 * back to `DEFAULT_SERVICE_ID`, because a silent fallback is the failure mode
 * this whole refactor exists to prevent: a mistyped segment would quietly
 * prerender Flow A's copy at a Flow B URL and no gate would notice. At build
 * time a throw is a failed `npm run build`, which is exactly what it should be.
 */
export function toServiceId(value: string): ServiceId {
  if (value in SERVICES) return value as ServiceId;
  throw new Error(`Unknown serviceId route segment: ${value}`);
}

export function cidVariantParams(): { serviceId: ServiceId }[] {
  return (Object.keys(SERVICES) as ServiceId[])
    .filter((id) => id !== DEFAULT_SERVICE_ID)
    .map((serviceId) => ({ serviceId }));
}

/**
 * The same list, narrowed to the services that photograph the BACK of a
 * document — i.e. the ones `/cid/[serviceId]/capture-back/` should exist for.
 *
 * §9 of BUILD_BRIEF.md says of PP-09..PP-19: "**no back capture**". A passport
 * has one page. So rather than publish a StudentAidNL back-capture screen whose
 * heading would have to be invented (§12.1 gives `studentaid` no `back` entry in
 * `captureTitles` at all) and which nothing links to, that route is simply not
 * generated: `captureSides` decides, exactly as it decides the forward link on
 * the capture-front screen. Today this returns an empty list, and Next.js
 * prerenders zero pages for that segment.
 */
export function cidBackCaptureParams(): { serviceId: ServiceId }[] {
  return cidVariantParams().filter(({ serviceId }) =>
    SERVICES[serviceId].captureSides.includes("back"),
  );
}

/**
 * The services that get their own `/services/[serviceId]/…` DESKTOP wizard and
 * service page — added 2026-09-28 with Flow B's desktop screens.
 *
 * THE SAME LIST AS `cidVariantParams`, AND FOR THE SAME REASON. `driver-vehicle`
 * owns the static folder src/app/services/driver-vehicle/, whose seven URLs are
 * frozen baseline frames. A static segment beats a dynamic sibling on an exact
 * match, so generating `driver-vehicle` here would not even be served — it
 * would only be a second, dead prerender of seven frames. So it is excluded,
 * and today this names exactly one service: `studentaid`.
 *
 * A separate name rather than a second call site of `cidVariantParams` so that
 * a reader of src/app/services/[serviceId]/ is not sent to the CID seam to find
 * out which services have a desktop wizard.
 */
export function serviceVariantParams(): { serviceId: ServiceId }[] {
  return cidVariantParams();
}

/**
 * The services whose wizard has PP-08 "Other verification" — i.e. the ones
 * `/services/[serviceId]/other-verification/` should exist for.
 *
 * `otherVerificationStep` decides, exactly as `captureSides` decides the back
 * capture in `cidBackCaptureParams`: a service without the step gets no page at
 * that path, so there is no orphan screen for a presenter to type their way
 * into. Today: `studentaid` only.
 */
export function otherVerificationParams(): { serviceId: ServiceId }[] {
  return serviceVariantParams().filter(
    ({ serviceId }) => SERVICES[serviceId].otherVerificationStep,
  );
}
