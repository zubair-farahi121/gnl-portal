import { ASSETS } from "@/lib/assets";

/**
 * Content for the Driver and Vehicle service page — Figma 6031:6244
 * (`driver-vehicle-service-page`), UNVERIFIED state.
 *
 * Copy is character-for-character from `get_design_context` on 6031:6247
 * (content-left) and 6031:6265 (sidebar-right).
 *
 * NOTE ON APOSTROPHES: this frame uses a STRAIGHT apostrophe (U+0027), unlike
 * the confirmation frame (6102:101144) which uses the typographic U+2019. That
 * disagreement is in the design file, so it is reproduced rather than
 * normalised. See design/token-exceptions-phase2b.md.
 *
 * The double quotes around "Onboard" in the verification-card body are also
 * straight ASCII quotes in Figma, not curly ones.
 */

/** One row of the "This service receives the following data from your profile:" list. */
export type ScopeItem = {
  label: string;
  /** 16 x 16 icon from the local asset index. */
  icon: string;
  nodeId: string;
};

export const BREADCRUMB = {
  /** Leading glyph is U+2190 LEFTWARDS ARROW, part of the string in Figma. */
  label: "← Back to Services",
  /**
   * Figma points this at https://www.gov.nl.ca. Retargeted to the demo's own
   * dashboard so the presenter is not thrown out of the flow mid-story.
   * Logged as a deliberate deviation.
   */
  href: "/dashboard/",
  nodeId: "6031:6249",
} as const;

export const SERVICE_HEADER = {
  title: "Driver and Vehicle",
  badgeLabel: "Confirmation required",
  subtitle: "View and manage your driver and vehicle services",
} as const;

export const VERIFICATION_CARD = {
  title: "To Use This Service We Need to Verify It Is You",
  body: 'Once you click the "Onboard" button you will be directed to the verification process which involves providing some information about yourself.',
  ctaLabel: "Onboard",
  ctaHref: "/services/driver-vehicle/onboard/",
} as const;

export const FAVOURITE_CARD = {
  label: "Favourite Service",
} as const;

export const DATA_PRIVACY_CARD = {
  title: "Data & Privacy",
  body: "At any time, you can change your preferences and remove consent for your personal details to be shared with this service. By doing so you will no longer be able to use the service. Removing consent will stop new data from being shared from your profile. However, previously shared data will continue to be stored within the service.",
  scopesTitle: "This service receives the following data from your profile:",
  termsLabel: "Terms of Use",
  termsHref: "https://www.gov.nl.ca/disclaimer/",
} as const;

/** shared-data-list — Figma 6098:34115. Both name rows reuse the same `user` glyph. */
export const SHARED_DATA_SCOPES: readonly ScopeItem[] = [
  { label: "View your address", icon: ASSETS.iconHome, nodeId: "6098:34116" },
  { label: "View your email", icon: ASSETS.iconMail, nodeId: "6098:34120" },
  { label: "View your first name", icon: ASSETS.iconUserScope, nodeId: "6098:34124" },
  { label: "View your last name", icon: ASSETS.iconUserScope, nodeId: "6098:34128" },
];

export const CONTACT_CARD = {
  title: "Contact Information",
  phoneLabel: "1-877-636-6867",
  phoneHref: "tel:1-877-636-6867",
} as const;

/* ------------------------------------------------------------------------- *
 * VERIFIED state — Figma 6065:23367 (`driver-vehicle-service-page`),
 * 1440 x 1819.215 as the file stands on 2026-09-18.
 *
 * Copy below is character-for-character from `get_design_context` on
 * 6065:23373 (title-badge-row), 6076:24331 (actions-section-card) and
 * 6076:24354 (linked-items-section).
 *
 * APOSTROPHES: this frame mixes both forms and the mix is reproduced, not
 * normalised. `Add your driver’s licence to your digital wallet?` uses the
 * TYPOGRAPHIC U+2019; every other occurrence — `Driver's licence`,
 * `Renew your driver's licence`, `Your driver's licence is verified…` — uses
 * the STRAIGHT U+0027. See design/token-exceptions-phase4.md.
 *
 * DATA: the names, licence number, plate and VIN are confirmed synthetic
 * (O4 closed by Tatyana + Bea), so they are reproduced exactly as designed.
 * ------------------------------------------------------------------------- */

/** The badge swaps from the red "Confirmation required" pill to a green one. */
export const SERVICE_HEADER_VERIFIED = {
  badgeLabel: "Trusted",
  nodeId: "6065:23375",
} as const;

export type ActionLink = { label: string; nodeId: string };

/** actions-section-card — Figma 6076:24331, 860 x 387. */
export const ACTIONS_SECTION = {
  title: "Actions",
  columns: [
    {
      heading: "Driver",
      nodeId: "6076:24334",
      links: [
        { label: "Renew your driver's licence", nodeId: "6076:24337" },
        { label: "Change your address with Motor Registration", nodeId: "6076:24338" },
        { label: "Purchase your driving record (abstract)", nodeId: "6076:24339" },
        { label: "Pay for your road test", nodeId: "6076:24340" },
      ] as readonly ActionLink[],
    },
    {
      heading: "Vehicle",
      nodeId: "6076:24341",
      links: [
        { label: "Renew your vehicle registration", nodeId: "6076:24344" },
        {
          label: "Notify Motor Registration when you no longer own a vehicle",
          nodeId: "6076:24345",
        },
        { label: "Request a reprint of your vehicle registration", nodeId: "6076:24346" },
        { label: "Complete your vehicle ownership transfer", nodeId: "6076:24347" },
      ] as readonly ActionLink[],
    },
  ],
  otherTitle: "Other",
  otherLinkLabel: "Book an appointment",
} as const;

/** One button inside a linked-item card. Geometry differs from BtnPrimary/BtnOutline. */
export type LinkedItemAction = {
  label: string;
  variant: "primary" | "outline";
  /** Renders the green "New" pill overlapping the button's right edge by 8px. */
  badge?: string;
  nodeId: string;
};

export type LinkedItem = {
  kind: "wallet-promo" | "licence" | "address" | "vehicle";
  /** 32 x 32 glyph, or 58 x 58 for the wallet promo. */
  icon: string;
  iconSize: 32 | 58;
  title: string;
  /** Body lines under the title, in order. `emphasis` renders Lato:SemiBold. */
  lines: { text: string; emphasis?: boolean }[];
  /** Red pill with a 6px dot. Only the trailer card has one. */
  warning?: string;
  /** Inline row beside the details (wallet-promo / licence / address) or a row below (vehicles). */
  layout: "inline" | "stacked";
  actions: LinkedItemAction[];
  nodeId: string;
};

/** linked-items-section — Figma 6076:24354, 860 x 894. Five cards, 20px gaps. */
export const LINKED_ITEMS_TITLE = "Your linked items";

export const LINKED_ITEMS: readonly LinkedItem[] = [
  {
    kind: "wallet-promo",
    icon: ASSETS.iconDigitalId,
    iconSize: 58,
    title: "Add your driver’s licence to your digital wallet?",
    lines: [
      {
        text: "Your driver's licence is verified. Add it to your digital wallet for quick, secure access, no card needed.",
      },
      { text: "Expires on January 14, 2026" },
    ],
    layout: "inline",
    actions: [{ label: "Update", variant: "primary", nodeId: "6220:86430" }],
    nodeId: "6076:24356",
  },
  {
    kind: "licence",
    icon: ASSETS.iconUserLarge,
    iconSize: 32,
    title: "Driver's licence",
    lines: [
      { text: "IAN B GARLAND", emphasis: true },
      { text: "G470114011" },
      { text: "Expires on January 14, 2026" },
    ],
    layout: "inline",
    actions: [{ label: "View demerit points", variant: "outline", nodeId: "6220:86396" }],
    nodeId: "6220:86386",
  },
  {
    kind: "address",
    icon: ASSETS.iconMapPin,
    iconSize: 32,
    title: "Address",
    lines: [{ text: "15 PRINCESS ANNE PL" }],
    layout: "inline",
    actions: [{ label: "Update", variant: "primary", nodeId: "6076:24376" }],
    nodeId: "6076:24368",
  },
  {
    kind: "vehicle",
    icon: ASSETS.iconTruck,
    iconSize: 32,
    title: "2015 CHEV IMT",
    lines: [
      { text: "Plate JKM 026 • VIN 2G1125535F9268441" },
      { text: "Expires on January 14, 2036" },
    ],
    layout: "stacked",
    actions: [
      { label: "Renew", variant: "primary", nodeId: "6076:24390" },
      { label: "No longer have?", variant: "outline", nodeId: "6076:24392" },
      { label: "Lost your registration?", variant: "outline", nodeId: "6076:24394" },
      {
        label: "Add to your digital wallet",
        variant: "outline",
        badge: "New",
        nodeId: "6220:86433",
      },
    ],
    nodeId: "6076:24378",
  },
  {
    kind: "vehicle",
    icon: ASSETS.iconCircleX,
    iconSize: 32,
    title: "0 UTILITY TRAILER",
    lines: [{ text: "Plate TDH 578 • VIN HM00000000036027" }],
    warning: "Expired on March 31, 2022",
    layout: "stacked",
    actions: [
      { label: "Renew", variant: "primary", nodeId: "6076:24408" },
      { label: "No longer have?", variant: "outline", nodeId: "6076:24410" },
      { label: "Lost your registration?", variant: "outline", nodeId: "6076:24412" },
    ],
    nodeId: "6076:24396",
  },
];

/* ------------------------------------------------------------------------ *
 * IDV results status — Figma 6217:80871 `Provider page_IDV results status`
 * (route /auth/loading/), card 6236:46385.
 *
 * This frame REPLACED the deleted `gnl-vc-login-loading` (6158:69596). The
 * old frame was a spinner card; this one is a static message card with no
 * spinner and no progress indicator of any kind.
 *
 * APOSTROPHES: this frame uses the STRAIGHT apostrophe U+0027 throughout
 * ("We've", "don't", "We'll", "it's"), unlike the confirmation frame
 * (6217:82446) which uses the typographic U+2019 in "it’s" / "Driver’s".
 * The file genuinely disagrees with itself; both are reproduced verbatim.
 * ------------------------------------------------------------------------ */
export const IDV_STATUS = {
  /** Figma I6236:46387;9411:3313 — 40px Lato **Regular**, not Bold. */
  heading: "We've received your information",
  /** Figma 6236:46389 — three paragraphs in one 16px text node. */
  paragraphs: [
    "Your identity verification is now being processed. Depending on your request, this can take anywhere from a few minutes to longer.",
    "You don't need to stay on this page. We'll let you know as soon as it's ready.",
    "You can close this window.",
  ],
  /** Figma 6236:46390 — a separate node, 32px below the block above. */
  footnote: "Your progress will be automatically saved and transferred.",
} as const;
