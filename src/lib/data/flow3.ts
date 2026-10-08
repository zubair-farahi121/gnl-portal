import { WALLET_PERSONA } from "@/lib/data/driver-vehicle";
import { FLOW3_ROUTES, serviceRoutes } from "@/lib/data/service-config";
import type { OfferStatus } from "@/lib/mock-issuer";

/**
 * FLOW 3 — "Issuance of Vehicle Registration Certificate". ADDED 2026-09-29.
 *
 * Copy for the C1 side of the flow: the GNL page that shows the QR code.
 * Every string is verbatim from `get_design_context` on the nodes named beside
 * it (read-only; no Figma write tool was called), unless a comment says it is
 * derived. The wallet's own copy is further down this file, and its visual
 * tokens are in wallet-tokens.ts — deliberately a different file, because the
 * wallet is a different visual language (design/FLOW3_OBSERVED.md).
 *
 * The frames: desktop 6220:86445 (1440 x 1024, "Waiting for scan…"),
 * 6289:45276 and 6289:46104 (the same page, both reading "Adding to your
 * wallet…"), and the phone twin 6220:86488 (393 x 1471, buttons instead of a
 * QR). Canvas annotation 6220:86486 names the three states.
 */

/** 6220:86450 — U+2190 is part of the string, as on the service page's crumb. */
export const C1_BREADCRUMB = {
  label: "← Back to Driver and Vehicle",
  /**
   * Figma points it at https://www.gov.nl.ca (same as every crumb in the
   * file). Retargeted to the TRUSTED Driver and Vehicle page, which is where
   * the user came from — `?verified=1` so it lands Trusted even for a
   * presenter who deep-linked here. The same retargeting as BREADCRUMB in
   * driver-vehicle.ts.
   */
  href: serviceRoutes("driver-vehicle").pageVerified,
  nodeId: "6220:86450",
} as const;

export const C1_COPY = {
  /** 6220:86453 — 32px Lato Bold at 1440; 24px on the phone twin (6220:86494). */
  heading: "Add your vehicle registration certificate to your wallet",
  /**
   * 6220:86454. Figma: "…Scan the code with Apple Wallet or Google Wallet to
   * add it." CHANGED 2026-09-30 (branch feedback-ui, team meeting) to name no
   * wallet brand in the instruction; the "Works with" Apple / Google marks and
   * the phone's "Add to Apple Wallet / Add to Google Wallet" buttons stay.
   * Desktop and phone both render this string.
   */
  subtitle:
    "Your registration is verified and active. Scan the code with your digital wallet to add it.",
  /** 6220:86462. */
  worksWith: "Works with",
  /** 6220:86465 / 6220:86468. */
  appleWallet: "Apple Wallet",
  googleWallet: "Google Wallet",
  /**
   * 6285:90653 — two spans in Figma ("Issued " + "by the Government of…"),
   * one sentence on screen.
   */
  issuedBy: "Issued by the Government of Newfoundland and Labrador",
  /**
   * 6220:86469 — "This code expires in **8 minutes**. Trouble scanning? [Get a
   * new code]". Split where the weight changes. STATIC: nothing counts down.
   * The design shows a fixed "8 minutes" and a live timer would be the one
   * number on screen that changes between rehearsal and the real thing.
   */
  expiry: {
    before: "This code expires in",
    emphasis: "8 minutes",
    after: ".",
    trouble: "Trouble scanning?",
    /** Toast — the demo has no second code to issue. */
    link: "Get a new code",
  },
  /** 6220:86472 — Lato ExtraBold in Figma; Lato ships no 800, rendered 700. */
  benefitsTitle: "What can you do with a digital vehicle registration certificate?",
  /** 6220:86477 / 6220:86481 / 6220:86485, with their icon names. */
  benefits: [
    { icon: "lock", text: "Sign in without a password", nodeId: "6220:86474" },
    {
      icon: "id",
      text: "Skip the paperwork next time you renew or transfer ownership",
      nodeId: "6220:86478",
    },
    {
      icon: "eye",
      text: "Share only what's needed, like proving your vehicle is registered, without handing over your full VIN or address",
      nodeId: "6220:86482",
    },
  ],
  /** Phone twin 6220:86502 / 6220:86505 — the same-device path. */
  addToApple: "Add to Apple Wallet",
  addToGoogle: "Add to Google Wallet",
  /**
   * Phone twin 6220:86506: "Don't have a wallet app? [Get help adding your
   * licence]" — the bracketed part is drawn in MAGENTA #f200ff with literal
   * square brackets, which is the designer's placeholder convention, not a
   * style. Rendered as a normal GNL link (#004b87, toast) without the
   * brackets; logged as an open question in DEMO_AUDIT.md "Flow 3". Note it
   * also says "licence" on a registration-certificate page.
   */
  noWalletApp: "Don't have a wallet app?",
  noWalletHelp: "Get help adding your licence",
  /**
   * The GNL toast when the same-device user comes back from the wallet with
   * the certificate issued (brief §8, "◀ MyGovNL"). Brief wording.
   */
  returnToast: "Added to your wallet",
} as const;

/**
 * The desktop's three states (FLOW3_BRIEF.md §3 table), and the status line
 * under the QR for each — THE HEADLINE BEHAVIOUR OF FLOW 3.
 *
 *   waiting  6220:86460 "Waiting for scan…"                      (drawn)
 *   adding   6289:45291 / 6289:46119 "Adding to your wallet…"    (drawn, twice
 *            — re-read 2026-09-29 with get_design_context: frames 2 AND 3
 *            of F3-02 both say this; neither says "Added")
 *   added    "Added to your wallet" — NOT DRAWN. Taken from the magenta
 *            designer note 6220:86486 ("dynamic states : Waiting for scan /
 *            Adding to your wallet / Added to your wallet"); no ellipsis
 *            because it is the one state that is finished. Open question.
 *
 * U+2026 where Figma has it. Same Lato Light 16 #5f6368 centred line in every
 * state, so on stage the line visibly CHANGES rather than being replaced.
 */
export type DesktopState = "waiting" | "adding" | "added";

export const C1_STATUS: Record<DesktopState, string> = {
  waiting: "Waiting for scan…",
  adding: "Adding to your wallet…",
  added: "Added to your wallet",
};

/** Brief §3 table — offer status -> desktop state. `declined` shows "Waiting" again. */
export function desktopState(status: OfferStatus | null | undefined): DesktopState {
  if (!status || status === "created" || status === "declined") return "waiting";
  if (status === "issued") return "added";
  return "adding";
}

/**
 * P1 (brief §10 item 7): after issuing, the "Skip the paper copy" upsell on
 * F3-01 shows a disabled "Added to wallet ✓". A PROPOSAL — Tatyana to
 * confirm — so it is behind this flag, OFF, and with it off the Trusted page
 * is byte-for-byte what it was (the `service-verified` baseline proves it).
 */
export const UPSELL_ADDED_STATE_ENABLED = false;
export const UPSELL_ADDED_LABEL = "Added to wallet ✓";

/**
 * The window the QR click opens the wallet in. A NAME, so clicking the QR a
 * second time re-focuses the same wallet window instead of stacking a new one
 * behind the presenter's slides. The size is the Figma wallet frames' own
 * (390–393 x 844–874) — a phone-shaped window, not a drawn phone.
 */
export const WALLET_WINDOW = {
  name: "gnl-demo-wallet",
  /* ~400 x 860 (brief §3 "Phone view window"): the wallet's own 393 x 852
     phone plus room for window chrome. At this width the wallet drops its
     frame and fills the window (brief §6, <= 430 px). */
  features: "popup,width=400,height=860",
  href: FLOW3_ROUTES.walletHome,
} as const;

/* ======================================================================== *
 * THE WALLET — W1..W9. Copy verbatim from get_design_context on each frame
 * (node ids beside each string). Visual values are NOT here — they are in
 * wallet-tokens.ts, which is the wallet's own, isolated token file.
 * ======================================================================== */

/**
 * The persona, from the demo's persona module — never retyped here.
 * `WALLET_PERSONA` (driver-vehicle.ts, brief §9) is built from DEMO_USER and
 * VEHICLE_CHEV, which also feed the Trusted page's CHEV card, so the wallet
 * and the portal cannot disagree about a VIN.
 */
const OWNER = WALLET_PERSONA.walletHolder;
const VRC = WALLET_PERSONA.vehicleRegistrationCertificate;
/** "Hello, Jason!" (6346:87250) — the first name of the same persona. */
const FIRST_NAME = OWNER.split(" ")[0];

/**
 * THE ISSUER, as the wallet spells it — with "&" (6337:82531, 6298:79357,
 * 6345:12127, 6345:12879). The C1 page spells it "and" (6285:90653). Two
 * spellings in one flow; both reproduced where drawn.
 */
export const WALLET_ISSUER = VRC.issuingAuthority;

/**
 * W-07's code step — ONE SWITCH (FLOW3_BRIEF.md §7 W-07, §11 question 1).
 *   "sms"         as in Figma 6322:60882: "We sent a 6-digit code by SMS…",
 *                 and a simulated SMS banner slides down; tapping it fills
 *                 the code.
 *   "wallet_pin"  what Martin saw: the wallet asks for its OWN PIN. No banner.
 *                 Its text is not designed yet — placeholders below, never
 *                 invented copy. Tatyana is checking.
 */
/**
 * sessionStorage flag set by /wallet/start/?from=mygovnl — this tab is the
 * same-device path (F3-03 -> wallet), so the wallet's status bar shows the
 * iOS-style "◀ MyGovNL" back link (brief §8).
 */
export const SAME_DEVICE_KEY = "gnl-demo:wallet-same-device";

export type CodeMode = "sms" | "wallet_pin";
export const CODE_MODE: CodeMode = "sms";

/**
 * W-05's consent — ONE CONSTANT (brief §7 W-05): Tatyana may replace it with
 * Maud's wording. 6354:87423, verbatim.
 */
export const WALLET_CONSENT =
  "It will be securely stored in your wallet. You control when its information is shared.";

/** "Issued <Month D, YYYY>" — the new card's date is TODAY (brief §9, §10 item 3). */
export function issuedLabel(iso: string | null | undefined): string {
  const d = iso ? new Date(iso) : new Date();
  const month = d.toLocaleString("en-US", { month: "long" });
  return `Issued ${month} ${d.getDate()}, ${d.getFullYear()}`;
}

/** "N cards total" — 2 before the certificate is added, 3 after (brief §7 W-09). */
export function cardsTotal(n: number): string {
  return `${n} cards total`;
}

export const WALLET_COPY = {
  /** W-01 6288:59109. */
  home: {
    greeting: `Hello, ${FIRST_NAME}!`,
    /** greeting-subtitle 6288:59127. */
    subtitle: "Receive or share from your wallet",
    /** scan-label 6288:59147 — two lines, "Scan" / "QR-code". */
    scan: ["Scan", "QR-code"],
    /** present-label 6288:59156. Toast — no in-person presentation flow. */
    present: ["Present", "In-person"],
    /** help-link 6288:59158. Toast. */
    help: "How does it work?",
    /**
     * today-card 6288:59161 — HIDDEN in the Figma frame, shown because the
     * brief asks for two list cards (§7 W-01). Text verbatim from
     * get_design_context: "Today" / "Added Personalausweis" — a German ID
     * card, left over from the Paradym inspiration. Open question.
     */
    todayTitle: "Today",
    todaySubtitle: "Added Personalausweis",
    /** all-cards-card 6288:59167 — opens W-09. Count is live (2 / 3). */
    credentialsTitle: "Your credentials",
  },
  /** W-02 6286:90660. */
  scan: {
    title: "Scan QR Code",
    /**
     * DELIBERATE COPY FIX (brief §7 W-02, §10 item 1): Figma 6286:90674 says
     * "the **login** QR code" — the frame came from the password-less login
     * scenario. This code is not a login.
     */
    hint: "Point your camera at the QR code displayed on your computer.",
    /**
     * button_default 6286:90676 — HIDDEN in the frame, shown because the brief
     * asks for it (§7 W-02). Text verbatim. Toast.
     */
    manual: "Enter Code Manually",
    /** Not drawn — the accessible name of the tappable viewfinder. */
    viewfinderLabel: "Scan the QR code",
  },
  /** W-03 6325:60170. */
  connect: {
    heading: "Allow connection?",
    body: "MyGovNL wants to offer you a new digital Vehicle Registration Certificate for your wallet.",
    verifiedTitle: "Verified government issuer",
    verifiedBody: "Issuer identity has been cryptographically confirmed",
    firstTimeTitle: "First-time interaction",
    firstTimeBody: "No previous transactions found with this organization",
    accept: "Yes, connect",
    decline: "Decline",
  },
  /** W-04 6240:54958. */
  offer: {
    heading: "Certificate offered",
    body: "Your registration certificate is verified and ready for secure on-device storage.",
    cardTitle: "Vehicle registration certificate",
    cardSubtitle: "Verifiable Digital Credential",
    action: "View offer",
  },
  /** W-05 6240:55097. */
  review: {
    /** Headings 6345:12128 ("Heading here" layer). */
    heading: "Is the information correct?",
    cardTitle: "Vehicle Registration Certificate",
    intro: "Verify your vehicle registration details before saving them onto this device.",
    /** 6345:12853 … 6345:12877 — label / value, in frame order (brief §7 table). */
    rows: [
      { label: "Registration Number (License Plate)", value: VRC.plate },
      { label: "Vehicle Identification Number (VIN)", value: VRC.vin },
      { label: "Make (Manufacturer)", value: VRC.make },
      { label: "Model", value: VRC.model },
      { label: "First Registration Date", value: VRC.firstRegistrationDate },
      { label: "Expiry Date", value: VRC.expiryDate },
      { label: "Owner Identifier", value: VRC.owner },
      { label: "Issuing Country", value: VRC.issuingCountry },
      { label: "Issuing Authority", value: VRC.issuingAuthority },
    ],
    consent: WALLET_CONSENT,
    /*
     * CHANGED 2026-09-30 (branch feedback-ui, team meeting). Figma: "Accept" /
     * "Decline". Labels only — "Cancel" does exactly what "Decline" did
     * (offer `declined`, wallet home, C1 back to "Waiting for scan…"). W-03's
     * "Yes, connect" / "Decline" above is unchanged.
     */
    accept: "Add to wallet",
    decline: "Cancel",
  },
  /** W-06 6293:46861 — three ASCII dots in the frame, not U+2026. */
  connecting: {
    heading: "Connecting wallet...",
    body: "Establishing a secure connection to transfer your digital certificate.",
  },
  /** W-07 6322:60882. */
  code: {
    sms: {
      /** Headings ("Heading here" layer) on 6322:60882. */
      heading: "Enter your verification code",
      bodyBefore: "We sent a 6-digit code by SMS to ",
      /** Bold in the frame. U+2022 bullets. */
      phone: WALLET_PERSONA.smsMaskedPhone,
      bodyAfter: ". This code was not included in the QR code.",
    },
    wallet_pin: {
      /** NOT DESIGNED — brief §11 item 6: placeholder, never invented copy. */
      heading: "[Heading from Tatyana's updated design]",
      bodyBefore: "[Wallet PIN text from Tatyana's updated design]",
      phone: "",
      bodyAfter: "",
    },
    /** button_default 6322:60923. */
    action: "Continue",
    /** The simulated SMS (brief §7 W-07). "Messages · Your GNL code is 482 915". */
    smsApp: "Messages",
    smsText: "Your GNL code is 482 915",
    smsCode: "482915",
    length: 6,
    /** Accessible names for the non-digit controls — not drawn as text. */
    deleteLabel: "Delete last digit",
    smsLabel: "Messages: Your GNL code is 482 915. Tap to fill in the code.",
  },
  /** W-08 6240:55218. */
  added: {
    heading: "Added Successfully",
    body: "Your Vehicle Registration Certificate is secure and ready for use.",
    /** button_default 6240:55238 — with the white → (arrow_forward visible). */
    action: "Go to Wallet",
  },
  /** W-09 6240:55253. */
  cards: {
    greeting: `Hello, ${FIRST_NAME}!`,
    credentialsTitle: "Your credentials",
    vrc: {
      title: "Vehicle Registration Certificate",
      /* "Issued October 31, 2026" in Figma is a placeholder — today's date is
         used instead (issuedLabel). */
      rows: [
        { label: "Owner", value: VRC.owner },
        { label: "Plate", value: VRC.plate },
        { label: "Expiry", value: VRC.expiryDate },
      ],
    },
    others: WALLET_PERSONA.existingWalletCards.map((c, i) => ({
      ...c,
      kind: i === 0 ? ("photo-id" as const) : ("proof-of-age" as const),
      nodeId: i === 0 ? "6328:13015" : "6328:13076",
    })),
  },
  /** The wallet's own "not in this demo" message — the demo's standard wording. */
  inert: "Not part of this demo",
} as const;
