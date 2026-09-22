/**
 * Content for the four CertifiO ID (CID) mobile screens.
 *
 *   /cid/welcome    CID_Welcome     6217:62833   393 x 1086.81
 *   /cid/terms      CID_TU          6217:62834   393 x  870.81
 *   /cid/biometric  CID_Biometric   6217:62835   393 x  894.81
 *   /cid/verified   CID_ID_success  6217:66058   393 x 1050.81
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
 */
export const CID_STEPPER_FILL = "278.869px";

/**
 * The CID dot-stepper has six dots. Only four of them are ever labelled in the
 * happy-path frames, and each frame shows exactly one label, so the labels are
 * carried per screen rather than as a shared array.
 */
export const CID_STEP_COUNT = 6;

export type CidDescriptionBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "link"; text: string }
  | { kind: "bullets"; items: readonly string[] };

/** CID_Welcome — Frame 5 is 6039:8154; card-description 6039:8156. */
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

/** CID_TU — Frame 5 is 6039:11320; card-description 6039:11341; Frame 6 is 6049:12216. */
export const CID_TERMS = {
  title: "Terms of Use",
  stepperLabel: "Terms of Use",
  body: "Your identity documents will be used only to verify your identity and will be deleted after verification.",
  /** Rendered #004b87 underlined. Inert in the demo — it is not a route. */
  linkLabel: "Terms of Use",
} as const;

/** CID_Biometric — Frame 5 is 6049:12239; card-description 6049:12262; Frame 6 is 6049:12264. */
export const CID_BIOMETRIC = {
  title: "Biometric consent",
  stepperLabel: "Biometric consent",
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
  stepperLabel: "Identity verified",
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
 * Button labels. Both buttons in the CID_TU / CID_Biometric `Frame 6` are
 * named `btn-back` in Figma and styled identically; the right-hand one is the
 * forward action despite the name.
 */
export const CID_ACTIONS = {
  decline: "I do not agree",
  accept: "I agree",
  continue: "Continue to Driver and Vehicle service",
  logOut: "Log out",
} as const;
