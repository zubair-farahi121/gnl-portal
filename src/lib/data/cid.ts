/**
 * Content for the CertifiO ID (CID) mobile screens.
 *
 *   /cid/welcome    CID_Welcome     6217:62833   393 x 1086.81   (cut from the flow)
 *   /cid/terms      CID_TU          6217:62834   393 x  810.81
 *   /cid/biometric  CID_Biometric   6217:62835   393 x  834.81
 *   /cid/verified   CID_ID_success  6217:66058   393 x 1014.81
 *
 * RE-SYNC — 2026-09-22. The three live frames were reworked: the six-dot CID
 * stepper rail is gone and a `sub-step-readout` pill took its place inside
 * `wizard-header` → `progress-stepper`. Each frame lost 30px of body (the dot
 * rail plus its gap) and gained 34px of header, minus the 24px of top padding
 * `Frame 5` dropped on CID_TU and CID_Biometric — net -60 on those two and -36
 * on CID_ID_success, which kept its `py-[24px]`.
 *
 * NOTE ON NODE IDS: the ids in the plan (6039:6580, 6039:11307, 6049:12226,
 * 6062:22540) no longer resolve — the frames were re-published as the symbols
 * above. Matched by name AND by exact frame size; every inner node id in the
 * plan (Frame 5, Frame 6, the hidden Check box instances) is still present and
 * still at the documented offsets. See design/token-exceptions-phase3.md.
 *
 * Copy is character-for-character from `get_design_context`. None of the four
 * frames contains an apostrophe of either kind, so the U+0027 / U+2019 split
 * seen elsewhere in the file does not arise here.
 */

/** wizard-title, shared by all four frames. Figma 6039:8143 et al. */
export const CID_WIZARD_TITLE = "Driver and Vehicle";

/**
 * step-bar-fill on the CID `wizard-header`, verbatim.
 *
 * 278.869px of a 361px track is 77.25%, where the desktop frames fill 555 of
 * 740 (75%) for the same `current={2}`. Reproduced, not harmonised.
 *
 * ALL THREE frames now carry this same fill and bold `Prerequisite Check`
 * (6257:67902 / 6257:67919 / 6257:69751). CID_ID_success used to be the odd
 * one out — a #243746 step-bar TRACK, which read as a 100%-filled bar — and no
 * longer is, so it takes `current={2}` and this fill like the other two.
 */
export const CID_STEPPER_FILL = "278.869px";

/**
 * `sub-step-readout` — the pill that replaced the six-dot rail.
 *
 * Two text runs plus a bullet between them, each its own node in Figma. The
 * counter says "of 5" while the four-step bar above it says four: the pill
 * counts CID's own IDV sub-steps, the bar counts the GNL onboarding wizard's.
 * Reproduced as designed — logged in design/token-exceptions-phase3.md.
 */
export type CidSubStep = {
  readonly label: string;
  readonly step: string;
  readonly nodeId: string;
};

export type CidDescriptionBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "link"; text: string }
  | { kind: "bullets"; items: readonly string[] };

/**
 * CID_Welcome — Frame 5 is 6039:8154; card-description 6039:8156.
 *
 * DEAD DATA. The screen was cut from the flow on 2026-09-21 and nothing
 * imports this; kept only so the copy is not lost if it comes back. Its
 * `stepperLabel` belongs to the six-dot rail that no longer exists — the live
 * frames use `subStep` instead.
 */
export const CID_WELCOME = {
  title: "Welcome to GNL Identity Verification Service",
  stepperLabel: "Welcome",
  /** Three 16px paragraphs at leading 24, 16px apart. Measured block: 361 x 248. */
  paragraphs: [
    "To help protect your information and complete your request securely, we need to verify your identity.",
    "The next steps will guide you through a quick identity verification process. Before proceeding, please review and accept the Terms of Use and Privacy Notice.",
    "We will then collect the information required to confirm your identity and complete the verification.",
  ],
} as const;

/**
 * CID_TU — Frame 5 is 6039:11320; card-description 6039:11341; Frame 6 is
 * 6049:12216; pill 6257:72178.
 *
 * `title` and `linkLabel` genuinely differ in case. The heading is sentence
 * case ("Terms of use", 6039:11321) after the rework; the inline link inside
 * the description is still title case ("Terms of Use", 6039:11341). Both are
 * verbatim — do not harmonise them.
 */
export const CID_TERMS = {
  title: "Terms of use",
  subStep: { label: "Terms of use", step: "step 1 of 5", nodeId: "6257:72178" },
  body: "Your identity documents will be used only to verify your identity and will be deleted after verification.",
  /** Rendered #004b87 underlined. Inert in the demo — it is not a route. */
  linkLabel: "Terms of Use",
} as const;

/**
 * CID_Biometric — Frame 5 is 6049:12239; card-description 6049:12262; Frame 6
 * is 6049:12264; pill 6257:67925.
 */
export const CID_BIOMETRIC = {
  title: "Biometric consent",
  subStep: { label: "Biometric consent", step: "step 2 of 5", nodeId: "6257:67925" },
  body: "A photo or video of your face will be used to verify your identity. It will be deleted after the verification process is complete.",
  linkLabel: "Terms of Use",
} as const;

/**
 * CID_ID_success — Frame 5 is 6062:22553; card-description 6062:23365;
 * Frame 6 is 6062:22582.
 *
 * The description is a single Figma text node holding two paragraphs, a blank
 * line and a four-item bulleted list. The blank line is a ZERO WIDTH SPACE
 * (U+200B) in the design file, not an empty paragraph — an empty `<p>` would
 * collapse and lose the 21px it occupies.
 */
export const CID_VERIFIED = {
  title: "Your identity has been verified",
  subStep: { label: "Identity verified", step: "step 5 of 5", nodeId: "6257:72248" },
  description: [
    {
      kind: "paragraph",
      text: "You can now securely access Driver and Vehicle services and complete transactions online.",
    },
    { kind: "paragraph", text: "​" },
    // The trailing space is in the design file.
    { kind: "paragraph", text: "Available services include " },
    {
      kind: "bullets",
      items: [
        "licence and registration renewals",
        "address changes",
        "driving record purchases",
        "road test payments, and more.",
      ],
    },
  ] as readonly CidDescriptionBlock[],
} as const;

/**
 * ====================================================================
 * THE ID-DOCUMENT STEP — added 2026-09-22.
 *
 *   /cid/document/       CID_ID1   6087:31396   393 x 1168.81
 *   /cid/capture-front/  CID_ID1   6056:19118   393 x 1174.81
 *   /cid/capture-back/   CID_ID1   6057:20924   393 x 1174.81
 *
 * All three are named `CID_ID1` in Figma and sit on the y=779 row at
 * x=1591.367 / 3178.742 / 4251.617. They are OURS — the wizard-title on each
 * reads "Driver and Vehicle". Three more frames with the same name sit on the
 * y=2341 row (6217:66072 / 6217:76798 / 6217:66154) and are StudentAidNL's;
 * they are NOT used here. StudentAidNL's capture screen draws an empty
 * viewport with four corner brackets — ours draws the captured document in a
 * flat grey panel, which is why the two look nothing alike.
 *
 * THE PILL SAYS "step 4 of 5" ON ALL THREE. So does StudentAidNL's.
 *
 * SUPERSEDED 2026-09-23. This block used to read "there is no frame anywhere in
 * the file whose pill reads 'step 3 of 5'". There are two — 6217:65268 and
 * 6217:65271, the liveness screens, both named `CID_Biometric`, which is how
 * they stayed hidden. They are now built as /cid/liveness/ and
 * /cid/liveness-capture/ and the counter no longer skips a number. See
 * CID_LIVENESS below.
 *
 * TYPEFACE. These frames are the Yoti/CertifiO vendor UI inside the GNL
 * wizard, and every text node on them is Montserrat on the Yoti colour ramp
 * (`Yoti app` #333b40, `Yoti gris` #546072, `Yoti CTA` #27619b) rather than
 * Lato on the GNL ramp. Montserrat is not self-hosted here and the Figma /
 * Google font hosts are both blocked by the proxy, so the type renders in
 * Lato. Colours ARE reproduced verbatim. See design/token-exceptions.md.
 * ====================================================================
 */

/**
 * CID_ID1 (document selection) — `accepted-documents` is 6087:32267; the
 * heading 6087:32268; `documents-list` 6087:32269; `Frame 6` 6087:31453;
 * pill 6257:72214.
 *
 * `Frame 6` also holds a `btn-back` (6087:31455) that is `hidden="true"` in
 * Figma. Hidden layers are not part of the design and are not rendered, which
 * is the same rule the `Check box` instances on every other CID frame follow.
 * Continue is therefore the only control on all three of these screens.
 */
export type CidDocumentOption = {
  readonly nodeId: string;
  readonly label: string;
  /** Second line, 12px #4b5563. Only the Indian Status Card row has one. */
  readonly note?: string;
  /** Exactly one row is selected in the design: Driver's License. */
  readonly selected?: true;
};

export const CID_DOCUMENT = {
  title: "Accepted documents:",
  subStep: {
    label: "ID document selection",
    step: "step 4 of 5",
    nodeId: "6257:72214",
  },
  /**
   * Verbatim, in frame order. The apostrophe in "Driver's License" is U+0027
   * in the design file, and the American spelling "License" is the design's
   * too — the rest of the portal says "licence". Reproduced, not harmonised.
   */
  options: [
    { nodeId: "6087:32270", label: "Passport" },
    {
      nodeId: "6087:32276",
      label: "Indian Status Card (SCIS)",
      note: "Issued on or after 01/2010",
    },
    { nodeId: "6087:32281", label: "Permanent Resident Card" },
    { nodeId: "6087:32285", label: "NEXUS Card" },
    { nodeId: "6087:32289", label: "Provincial or Territorial Identity Document" },
    { nodeId: "6087:32293", label: "Health Insurance Card" },
    { nodeId: "6087:32297", label: "Driver's License", selected: true },
  ] as readonly CidDocumentOption[],
} as const;

/**
 * CID_ID1 (capture, front) — `Frame 5` is 6056:19131; the heading 6088:32304;
 * `Frame 14` (the viewport) 6088:32330; `image 16` 6056:19942; `Frame 6` is
 * 6056:19165; pill 6257:72233.
 *
 * The heading's brackets are round parentheses in the design file.
 */
export const CID_CAPTURE_FRONT = {
  title: "Capture ID document (front)",
  subStep: {
    label: "ID document selection",
    step: "step 4 of 5",
    nodeId: "6257:72233",
  },
} as const;

/**
 * CID_ID1 (capture, back) — `Frame 5` is 6057:20937; the heading 6088:32306;
 * `Frame 14` 6088:32333; `image 17` 6088:32336; `Frame 6` is 6057:20966;
 * pill 6257:72243.
 */
export const CID_CAPTURE_BACK = {
  title: "Capture ID document (back)",
  subStep: {
    label: "ID document selection",
    step: "step 4 of 5",
    nodeId: "6257:72243",
  },
} as const;

/**
 * ====================================================================
 * THE THREE SCREENS LOCATED 2026-09-22.
 *
 *   /cid/continue-on-mobile/  CID_Redirect to mobile      6217:62059  1440 x 1161.196
 *   /cid/country/             CID_ID1_Country             6217:66054   393 x 1060.811
 *   /cid/capture-intro/       CID_ID1_Front_instruction   6217:66055   393 x  994.811
 *
 * These close gaps G5, G1 and G2 in design/verification-frame-map.md, which had
 * all three down as "exists but unaddressable" or "not found". In particular
 * conflict C2 — "the front-instruction master's node id is not derivable from an
 * instance" — is now settled: the master is `6217:66055`, and its
 * `progress-stepper` is `6257:69650`, exactly the id the frame map predicted
 * from the stepper-upgrade ordering. That is strong confirmation the three
 * left-cluster capture frames really are ours and really are current.
 *
 * THE STEP COUNTER NO LONGER SKIPS 3 — corrected 2026-09-23. This block used to
 * say it did. `CID_ID1_Country`'s pill still reads `step 4 of 5`, verbatim and
 * un-renumbered, but it is no longer the fourth screen the presenter sees: the
 * two liveness frames (6217:65268 / 6217:65271) now sit before it carrying
 * `step 3 of 5`. See CID_LIVENESS below and design/verification-frame-map.md
 * §12.
 * ====================================================================
 */

/**
 * CID_Redirect to mobile — `Frame 2` is 6156:60701; `Frame 1` 6156:60702;
 * `Headings` 6156:60703; the paragraph node 6156:60705; the footnote
 * 6156:60707; the link 6156:60708.
 *
 * THIS ONE IS NOT A CID MOBILE FRAME. It is 1440 wide and every string on it is
 * Lato on the GNL ramp (`--gnl-heading`, `--gnl-text` #5f6368, link #004b87) —
 * the GNL side of the journey, not the Yoti side. It lives in this file because
 * its frame name is `CID_*` and it is routed under `/cid/`, not because it
 * shares the CID mobile chrome. It does not: it uses the desktop shell.
 *
 * NO SUB-STEP PILL. Like every other 1440 frame in the file, it carries no
 * `sub-step-readout` — which is also why it does not disturb the counter above.
 *
 * `paragraphs` is ONE Figma text node (6156:60705) holding three paragraphs, so
 * the 12px between them is `mb-[12px]`, not a flex gap — the same arrangement
 * `IDV_STATUS` uses on /auth/loading/.
 */
export const CID_MOBILE_HANDOFF = {
  heading: "Continue on a smartphone",
  paragraphs: [
    "For an optimal experience, we recommend continuing your identity verification on a smartphone.",
    "Although the process is also accessible from a computer, the mobile interface is specially designed to simplify the steps and speed up validation.",
    "Scan the QR code to continue on a smartphone.",
  ],
  footnote: "Your progress will be automatically saved and transferred.",
  /**
   * The frame's ONLY control (6156:60708). The QR is an image, not a link, and
   * `Banner` (6156:60704) is hidden="true". So this single link is both the
   * forward move and the whole of the screen's interactivity.
   */
  continueOnComputer: "Continue on my computer",
} as const;

/**
 * CID_ID1_Country — `document-type-select` is 6056:15795; `Main-Text`
 * 6056:15796; `select-dropdown` 6076:31356; `PrivacyInfoCard` 6056:15803;
 * `Frame 6` 6056:15021; pill 6257:72205.
 *
 * Yoti vendor surface, so Montserrat on the Yoti ramp — rendered in Lato here,
 * as on every other ID-document screen. `Check box` (6056:15020) and `btn-back`
 * (6056:15024) are both hidden="true", so Continue is the only control.
 *
 * DESPITE THE FRAME NAME, the heading is about the document TYPE and the only
 * control below it picks a COUNTRY. Both strings are verbatim; the mismatch is
 * the design file's, not a transcription error.
 */
export const CID_COUNTRY = {
  title: "Select the type of identity document you want to add",
  body: "You will need to take a photo of your identity document at the next step. We will ask you to activate camera access for this.",
  subStep: {
    label: "ID document selection",
    step: "step 4 of 5",
    nodeId: "6257:72205",
  },
  /**
   * `select-dropdown` 6076:31356 is a STATIC REPRODUCTION, not a `<select>`.
   * The design shows one resting state with no option list anywhere in the
   * file, and the demo has no data to populate one — exactly how the radio
   * cards on /cid/document/ and /services/driver-vehicle/onboard/ are handled.
   */
  selectLabel: "Select the country of issuance",
  /**
   * `PrivacyInfoCard` 6056:15803 — Yoti's own disclosure block, rendered by the
   * provider in production. `linkLabel` has no destination in the design and is
   * inert in the demo, like the Terms of Use link on /cid/terms/.
   */
  privacy: {
    title: "Your privacy and Yoti",
    body: "Review the information below to learn more about this process and how Yoti uses and securely handles the information you provide.",
    linkLabel: "Privacy Policy",
    poweredBy: "Powered by",
  },
} as const;

/**
 * CID_ID1_Front_instruction — `Screen 7 - id-photo-instructions` is 6056:20786;
 * `Instruction Header` 6056:20791; `Guidelines Card` 6056:20794; `Frame 6`
 * 6056:20001; pill 6257:72219.
 *
 * Three layers are hidden="true" and are not rendered: `Expiry Banner`
 * (6056:20787, "For security reasons, this session will expire in 10 minutes."),
 * `Check box` (6056:20000) and `btn-back` (6056:20004). Continue is the only
 * control, as on the other three ID-document screens.
 *
 * "THIS TIME" IS IN THE DESIGN. `subtitle` says "We will try to get a clearer
 * image this time using your phone camera" on a screen that sits in the happy
 * path, before any capture has been attempted. Reproduced verbatim; already
 * logged as copy issue 6 in design/verification-frame-map.md §8.
 *
 * The apostrophe in `guidelinesTitle` is U+0027, and the heading's brackets are
 * round parentheses — both as in the design file.
 */
export type CidGuideline = {
  readonly nodeId: string;
  /** `ASSETS` key for the row's 34 x 34 icon. */
  readonly icon: "iconGuidelineClear" | "iconGuidelineLight" | "iconGuidelineFramed";
  readonly text: string;
  /**
   * Figma sets cross-axis alignment PER ROW: `items-start` on the two rows
   * whose label wraps to two lines, `items-center` on the one-line row. That is
   * what makes the card 192px and not 194.
   */
  readonly align: "start" | "center";
};

export const CID_CAPTURE_INTRO = {
  title: "Prepare to take a photo of your identity document (front)",
  subtitle: "We will try to get a clearer image this time using your phone camera.",
  subStep: {
    label: "ID document selection",
    step: "step 4 of 5",
    nodeId: "6257:72219",
  },
  guidelinesTitle: "Don't forget:",
  guidelines: [
    {
      nodeId: "6056:20796",
      icon: "iconGuidelineClear",
      text: "Make sure the information is clear and nothing is obscured",
      align: "start",
    },
    {
      nodeId: "6056:20801",
      icon: "iconGuidelineLight",
      text: "Find a well-lit area",
      align: "center",
    },
    {
      nodeId: "6056:20806",
      icon: "iconGuidelineFramed",
      text: "Make sure the document is properly framed",
      align: "start",
    },
  ] as readonly CidGuideline[],
} as const;

/**
 * ====================================================================
 * THE LIVENESS CHECK — added 2026-09-23. THE STEP-3 HOLE IS NOW CLOSED.
 *
 *   /cid/liveness/          CID_Biometric   6217:65268   393 x 1282.44092
 *   /cid/liveness-capture/  CID_Biometric   6217:65271   393 x 1231.81055
 *
 * Both are named `CID_Biometric` — the SAME name as the built consent screen
 * 6217:62835 — which is why several earlier audits walked straight past them.
 * They are not that screen: they are 393 x 1282.441 and 393 x 1231.811 against
 * its 393 x 834.811, they sit in the `Yoti` section at y=779 (x=44.87 and
 * 553.87) rather than on Row B at y=3563, and their headings are "Prepare to
 * scan your face" and "Position your face within the frame."
 *
 * THEY ARE STEP 3, AND THIS IS THE WHOLE POINT. Both pills read
 * `Liveness check • step 3 of 5` (6257:72187 / 6257:72196) — the only two
 * nodes in the file that display "step 3 of 5". `verification-frame-map.md`
 * logged as open conflict C4 that nothing displayed it and asked whether a
 * screen was missing or the stepper should read "of 4". It was a missing
 * screen, twice over. The counter used to run 1 → 2 → 4 → 4 → 4 → 4 → 4 → 5;
 * it now runs 1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 5, with no number skipped.
 *
 * WHERE THEY GO. First in the Yoti cluster, BEFORE `CID_ID1_Country` at
 * x=1076.87 — and the Yoti cluster's x-order is flow order, the same rule that
 * placed every other screen in this file. So: biometric consent (step 2) →
 * these two (step 3) → country (step 4). See design/page-inventory.md bucket 2a.
 *
 * NOT ABANDONED SKETCHES. Both have live instances on the StudentAidNL row in
 * the matching position (6217:66069 / 6217:66070, between that row's
 * `CID_Biometric` and its `CID_ID1_Country`), and the master/instance height
 * delta matches the other CID screens on that row.
 *
 * TYPE AND COLOUR, as on every other Yoti surface here: Montserrat on the Yoti
 * ramp (`Yoti app` #333b40, `Yoti gris` #546072, `Yoti CTA` #27619b), rendered
 * in Lato because Montserrat is not self-hosted and both font hosts are
 * blocked by the proxy. Colours verbatim. NOTE the new weight on these two
 * screens: Montserrat:Medium, which Lato also does not ship — it maps to 400.
 * Logged in design/token-exceptions.md.
 * ====================================================================
 */

/**
 * CID_Biometric (liveness, prepare) — 6217:65268. `Frame 5` is 6056:13104;
 * `Frame 13` 6087:31395; the heading 6056:13105; `illustration-frame`
 * 6056:13912; `instructions-list` 6056:13914; `Frame 6` 6056:13131;
 * pill 6257:72187.
 *
 * `Check box` (6056:13130) is hidden="true" and is not rendered, the same rule
 * every other CID frame applies. Continue is therefore the ONLY control, and
 * the reverse move is the presenter's ArrowLeft and the browser's back button.
 *
 * THE COPY IS VERBATIM AND ITS PUNCTUATION IS THE DESIGN'S. None of the three
 * instruction rows ends in a full stop; the heading has none either. The
 * heading wraps to two lines at 393 ("Prepare to scan your / face"), which is
 * where its measured 78px comes from — it is not a hard break in the file.
 */
export type CidLivenessTip = {
  readonly nodeId: string;
  /** `ASSETS` key for the row's 34 x 34 icon. */
  readonly icon:
    | "iconLivenessLighting"
    | "iconLivenessBackground"
    | "iconLivenessEyeLevel";
  readonly text: string;
};

export const CID_LIVENESS = {
  title: "Prepare to scan your face",
  subStep: {
    label: "Liveness check",
    step: "step 3 of 5",
    nodeId: "6257:72187",
  },
  /**
   * `instructions-list` 6056:13914 — three rows, 16px apart, each
   * `items-center` with a 34px icon and a 14px Montserrat:Medium label at
   * leading 1.4. Unlike the `Guidelines Card` on /cid/capture-intro/, the
   * cross-axis alignment here is the SAME on all three rows, so there is no
   * per-row `align` to carry.
   */
  tips: [
    {
      nodeId: "6056:13915",
      icon: "iconLivenessLighting",
      text: "Find a well-lit area with a clear background",
    },
    {
      nodeId: "6056:13920",
      icon: "iconLivenessBackground",
      text: "Be aware that your upper body and background will be visible",
    },
    {
      nodeId: "6056:13925",
      icon: "iconLivenessEyeLevel",
      text: "Hold your phone at eye level",
    },
  ] as readonly CidLivenessTip[],
} as const;

/**
 * CID_Biometric (liveness, capture) — 6217:65271. `Frame 5` is 6056:14036;
 * `Frame 10` 6076:31255; `Yoti_back` 6217:65270; `Frame 9` (the viewport)
 * 6076:31259; `Frame 7` (the instruction pill) 6076:31260; `Group 6` (the face
 * guide) 6076:31262; the Continue button 6076:31364; pill 6257:72196.
 *
 * `Check box` (6056:14081) is hidden="true" and is not rendered.
 *
 * THIS SCREEN HAS A REAL BACK CONTROL, which makes it the only Yoti screen in
 * the run that does. `Yoti_back` is a visible component instance, not a hidden
 * `btn-back` like the ones on /cid/country/, /cid/document/ and
 * /cid/capture-intro/. It points at /cid/liveness/ — one step back, which is
 * what a "Back" above a live camera viewport can only mean.
 *
 * NOTE THE BUTTON IS NOT IN A `Frame 6`. On this frame the `Yoti ContinueButton`
 * (6076:31364) is a DIRECT child of `Main content` at y=760, where every other
 * CID frame wraps it in a `Frame 6`. Reproduced as drawn.
 *
 * THE HEADING IS A SENTENCE WITH A FULL STOP — "Position your face within the
 * frame." — and it lives INSIDE the viewport, in a white pill, not above it.
 * Both are the design's.
 */
export const CID_LIVENESS_CAPTURE = {
  /** 6076:31261, inside the white pill `Frame 7`. The full stop is in Figma. */
  title: "Position your face within the frame.",
  subStep: {
    label: "Liveness check",
    step: "step 3 of 5",
    nodeId: "6257:72196",
  },
  /** `Yoti_back` label, 6076:31258. 14.054px Montserrat:Bold #546072. */
  backLabel: "Back",
} as const;

/**
 * Button labels. Both buttons in the CID_TU / CID_Biometric `Frame 6` are
 * named `btn-back` in Figma and styled identically; the right-hand one is the
 * forward action despite the name.
 */
export const CID_ACTIONS = {
  decline: "I do not agree",
  accept: "I agree",
  continue: "Continue to Driver and Vehicle service",
  logOut: "Log out",
  /**
   * The `Yoti ContinueButton` label on all three ID-document frames
   * (6087:31454 / 6076:31376 / 6076:31382). Plain "Continue", unlike the long
   * label CID_ID_success uses.
   */
  continueShort: "Continue",
} as const;
