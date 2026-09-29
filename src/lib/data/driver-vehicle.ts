import { ASSETS } from "@/lib/assets";
import {
  APP_ROUTES,
  FLOW3_ROUTES,
  getService,
  serviceRoutes,
} from "@/lib/data/service-config";
import { DEMO_USER } from "@/lib/data/services";

/**
 * This module is the Driver-and-Vehicle service page's content. Everything on
 * it that Flow B also needs — the title, the subtitle, the onboard
 * destination — now comes from the shared config (BUILD_BRIEF.md §12.1)
 * instead of being spelled out here. The rest of this file is genuinely
 * Flow-A-only data (the persona, the licence, the vehicles) and stays.
 */
const SERVICE = getService("driver-vehicle");


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
  href: APP_ROUTES.dashboard,
  nodeId: "6031:6249",
} as const;

export const SERVICE_HEADER = {
  title: SERVICE.title,
  badgeLabel: "Confirmation required",
  subtitle: SERVICE.subtitle,
} as const;

export const VERIFICATION_CARD = {
  title: "To Use This Service We Need to Verify It Is You",
  body: 'Once you click the "Onboard" button you will be directed to the verification process which involves providing some information about yourself.',
  ctaLabel: "Onboard",
  /*
   * RE-POINTED 2026-09-23 from `.onboard` (NL-07, "Choose verification
   * service") to `.summary` (NL-04).
   *
   * BUILD_BRIEF.md §5 gives the order: *"service page -> Onboard -> Summary ->
   * Terms -> Confirm some details (Required) -> Choose verification service"*,
   * and §8.1 NL-03 ends "…'Onboard' -> NL-04". It pointed at NL-07 only because
   * the three screens between did not exist — DEMO_AUDIT.md X-09: *"25 % and
   * 50 % are never rendered because NL-04 and NL-05 do not exist"*, the seam
   * that made the four-step bar name two steps the demo could not show.
   *
   * The button's appearance is untouched; only its destination moved.
   */
  ctaHref: serviceRoutes(SERVICE.id).summary,
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
 * VERIFIED state — Figma 6257:72314 (`driver-vehicle-service-page_verified`),
 * 1440 x 1792.2152099609375.
 *
 * RE-SYNCED 2026-09-22. The frame this state was built from, 6065:23367, has
 * been DELETED from the file — `get_metadata` returns not found — and
 * 6257:72314 replaces it. That is a rebuild, not a resize: the frame is 27px
 * shorter (1819.215 -> 1792.215) because two layers were switched off and one
 * was added. See design/verification-frame-map.md §4 and §7.
 *
 * WHAT CHANGED, AND WHAT DID NOT:
 *
 *   REMOVED (hidden="true" in the new frame — hidden layers are not part of
 *   the design and are not rendered, the same rule every CID `Check box`
 *   follows):
 *     - `item-card-licence` 6257:72356, the 129px digital-wallet promo card
 *       ("Add your driver’s licence to your digital wallet?"). It is still in
 *       the file, switched off.
 *     - `VC - Add to your wallet` 6257:72404, the "Add to your digital wallet"
 *       outline button + green `New` pill on the CHEV card's button row.
 *   ADDED:
 *     - `VRC VC upsell` 6257:73252, a 102px panel INSIDE the CHEV card — a QR
 *       code, "Skip the paper copy" with a blue `New` pill, and an "Add to
 *       wallet" button. The wallet upsell moved from the driver's licence to
 *       the vehicle registration certificate, and from its own card into the
 *       vehicle card.
 *   UNCHANGED, despite what a diff of the two frames suggests:
 *     - the green `Trusted` badge beside the title (6257:72322) — this build
 *       already had it, from 6065:23375.
 *     - the sidebar `Favourite Service` card (6257:72428) — already present,
 *       and byte-identical to the unverified frame's 6031:6266, which is why
 *       `SidebarRight` is still shared between the two states.
 *     - the CHEV IMT expiry, "Expires on January 14, 2036" (6257:72396). The
 *       frame map lists this as a flip from expired; this build was already
 *       carrying 2036, so nothing moved. The 2022 expiry belongs to the
 *       TRAILER card (6257:72419) and is still expired.
 *
 * Copy below is character-for-character from `get_design_context` on
 * 6217:81647-era reads plus 6257:73252 (the new upsell); the actions-section
 * and linked-item strings are unchanged from 6065:23367 and were re-verified
 * against 6257:72331 / 6257:72354 by node name.
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
  nodeId: "6257:72322",
} as const;

export type ActionLink = { label: string; nodeId: string };

/** actions-section-card — Figma 6257:72331, 860 x 387. Unchanged by the re-sync. */
export const ACTIONS_SECTION = {
  title: "Actions",
  columns: [
    {
      heading: "Driver",
      nodeId: "6257:72334",
      links: [
        { label: "Renew your driver's licence", nodeId: "6257:72337" },
        { label: "Change your address with Motor Registration", nodeId: "6257:72338" },
        { label: "Purchase your driving record (abstract)", nodeId: "6257:72339" },
        { label: "Pay for your road test", nodeId: "6257:72340" },
      ] as readonly ActionLink[],
    },
    {
      heading: "Vehicle",
      nodeId: "6257:72341",
      links: [
        { label: "Renew your vehicle registration", nodeId: "6257:72344" },
        {
          label: "Notify Motor Registration when you no longer own a vehicle",
          nodeId: "6257:72345",
        },
        { label: "Request a reprint of your vehicle registration", nodeId: "6257:72346" },
        { label: "Complete your vehicle ownership transfer", nodeId: "6257:72347" },
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

/**
 * `VRC VC upsell` — Figma 6257:73252, 812 x 102, INSIDE the CHEV card.
 *
 * NEW IN THE 6257:72314 REBUILD. A flat #e9ecef panel: QR code, a title with
 * a blue `New` pill, two lines of body copy, and an "Add to wallet" button.
 * Everything on it is #004b87 link blue except the button.
 *
 * IT IS A DIGITAL-WALLET FEATURE, NOT AN IDV DEVICE HAND-OFF. The `QR code`
 * component (6259:73307) is the only QR artwork anywhere in this journey and
 * it belongs here — "add your vehicle registration certificate to your
 * wallet". No mobile-handoff / "continue on my computer" screen exists. See
 * design/verification-frame-map.md §5.
 */
export type VcUpsell = {
  title: string;
  badge: string;
  body: string;
  actionLabel: string;
  /**
   * Where "Add to wallet" goes. ADDED 2026-09-29 with Flow 3: it opens the C1
   * wallet page (6220:86445) instead of the "Not part of this demo" toast.
   * BEHAVIOUR ONLY — the button's pixels are unchanged; see VcUpsellPanel.
   */
  actionHref: string;
  nodeId: string;
};

/**
 * THE 2015 CHEV IMT — one record, three readers. EXTRACTED 2026-09-29.
 *
 * The Trusted page's linked-item card (6257:72388), the wallet's credential
 * preview (W5, 6240:55097) and the wallet dashboard (W9, 6240:55253) all show
 * the same plate, VIN and expiry. They used to live only inside the card's
 * pre-joined line "Plate JKM 026 • VIN 2G1125535F9268441"; they are pulled
 * out here so the wallet reads the SAME values rather than retyping them — a
 * typo in a VIN on one screen and not the other is exactly the kind of thing
 * a client reads.
 *
 * The card lines below are rebuilt from these fields and produce the
 * character-for-character strings they always did (the `service-verified`
 * baseline is the proof).
 *
 * `make`, `firstRegistered` and `issuingCountry` appear on no GNL screen:
 * they are W5's rows, verbatim from 6345:12861 / 6345:12867 / 6345:12876, and
 * match BUILD_BRIEF.md §12.5 where it has them.
 */
export const VEHICLE_CHEV = {
  /** "Model" row on W5 (6345:12864) and the card title here. */
  model: "2015 CHEV IMT",
  plate: "JKM 026",
  vin: "2G1125535F9268441",
  expiry: "January 14, 2036",
  make: "Chevrolet",
  firstRegistered: "January 14, 2015",
  issuingCountry: "Canada",
} as const;

/**
 * FLOW 3 PERSONA — FLOW3_BRIEF.md §9, "add this to the persona file (flows A
 * and B already use it)". ADDED 2026-09-29. These are the Figma values; every
 * one that the portal already shows is built from the same record
 * (DEMO_USER, VEHICLE_CHEV), so the wallet and the Trusted page's CHEV card
 * cannot disagree. Read by src/lib/data/flow3.ts.
 */
export const WALLET_PERSONA = {
  walletHolder: DEMO_USER.name,
  /** W-07 6322:60904 — bold in the frame, U+2022 bullets. */
  smsMaskedPhone: "••• ••• 0187",
  vehicleRegistrationCertificate: {
    plate: VEHICLE_CHEV.plate,
    vin: VEHICLE_CHEV.vin,
    make: VEHICLE_CHEV.make,
    model: VEHICLE_CHEV.model,
    firstRegistrationDate: VEHICLE_CHEV.firstRegistered,
    expiryDate: VEHICLE_CHEV.expiry,
    owner: DEMO_USER.name,
    issuingCountry: VEHICLE_CHEV.issuingCountry,
    /** "&", as the wallet frames spell it (6337:82531 …); C1 says "and". */
    issuingAuthority: "Government of Newfoundland & Labrador",
  },
  existingWalletCards: [
    { title: "Photo ID", issued: "Issued Aug 1, 2024" },
    { title: "Proof of age", issued: "Issued Mar 15, 2023" },
  ],
} as const;

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
  /** `VRC VC upsell` panel below the button row. Only the CHEV card has one. */
  upsell?: VcUpsell;
  nodeId: string;
};

/**
 * linked-items-section — Figma 6257:72354, 860 x 867. FOUR cards, 20px gaps.
 *
 * Was five cards / 894px on the deleted 6065:23367. The digital-wallet promo
 * card (now 6257:72356) is hidden="true" in the rebuilt frame and is not
 * rendered; that is the whole 27px difference between the two frame heights
 * (129px card + 20px gap = 149 removed, 102px upsell + 20px gap = 122 added).
 */
export const LINKED_ITEMS_TITLE = "Your linked items";

export const LINKED_ITEMS: readonly LinkedItem[] = [
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
    actions: [{ label: "View demerit points", variant: "outline", nodeId: "6257:72376" }],
    nodeId: "6257:72366",
  },
  {
    kind: "address",
    icon: ASSETS.iconMapPin,
    iconSize: 32,
    title: "Address",
    lines: [{ text: "15 PRINCESS ANNE PL" }],
    layout: "inline",
    actions: [{ label: "Update", variant: "primary", nodeId: "6257:72386" }],
    nodeId: "6257:72378",
  },
  {
    kind: "vehicle",
    icon: ASSETS.iconTruck,
    iconSize: 32,
    title: VEHICLE_CHEV.model,
    /* Rebuilt from VEHICLE_CHEV — the same two strings as before, U+2022 and all. */
    lines: [
      { text: `Plate ${VEHICLE_CHEV.plate} • VIN ${VEHICLE_CHEV.vin}` },
      { text: `Expires on ${VEHICLE_CHEV.expiry}` },
    ],
    layout: "stacked",
    /*
     * THREE buttons, not four. `VC - Add to your wallet` (6257:72404) — the
     * "Add to your digital wallet" outline button with the green `New` pill —
     * is hidden="true" in the rebuilt frame. Its job was taken over by the
     * `VRC VC upsell` panel below, which is why it was switched off rather
     * than deleted.
     */
    actions: [
      { label: "Renew", variant: "primary", nodeId: "6257:72398" },
      { label: "No longer have?", variant: "outline", nodeId: "6257:72400" },
      { label: "Lost your registration?", variant: "outline", nodeId: "6257:72402" },
    ],
    upsell: {
      title: "Skip the paper copy",
      badge: "New",
      body: "Add your verified vehicle registration certificate to your wallet. Show proof instantly from your phone.",
      actionLabel: "Add to wallet",
      /* Flow 3's entry point — the C1 wallet page. Was the toast until 2026-09-29. */
      actionHref: FLOW3_ROUTES.c1,
      nodeId: "6257:73252",
    },
    nodeId: "6257:72388",
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
      { label: "Renew", variant: "primary", nodeId: "6257:72421" },
      { label: "No longer have?", variant: "outline", nodeId: "6257:72423" },
      { label: "Lost your registration?", variant: "outline", nodeId: "6257:72425" },
    ],
    nodeId: "6257:72409",
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
