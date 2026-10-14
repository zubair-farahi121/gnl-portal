import { C1_BREADCRUMB, C1_COPY, CODE_MODE, WALLET_CONSENT, WALLET_COPY, issuedLabel, type CodeMode } from "@/lib/data/flow3";
import { NOA_C1, NOA_WALLET_COPY, noaIssuedLabel } from "@/lib/data/flow4";
import { FLOW3_ROUTES, FLOW4_ROUTES } from "@/lib/data/service-config";
import type { CredentialKind } from "@/lib/mock-issuer";

/**
 * THE CREDENTIALS — one entry per kind of offer the mock issuer makes.
 * ADDED 2026-10-14 with Flow 4.
 *
 * Flow 3 (vehicle registration certificate) and Flow 4 (notice of
 * assessment) are the same journey: a C1 page with a QR, and the same wallet
 * app W-01..W-09. What differs is WHAT IS SAID, and it differs by the
 * credential being offered — so the C1 page takes its entry here by kind,
 * and every wallet screen takes its entry from the CURRENT offer's kind
 * (`useWalletCredential`, src/components/wallet/WalletClient.tsx).
 *
 * THE VEHICLE ENTRY IS FLOW 3's EXISTING CONSTANTS, referenced, not copied:
 * C1_COPY / WALLET_COPY in flow3.ts are still the one source of Flow 3's
 * strings, and with no offer (or an offer from an older store) the wallet
 * falls back to this entry, so Flow 3 renders exactly what it rendered before.
 */

/* ------------------------------------------------------------- the C1 -- */

export type BenefitIcon = "lock" | "id" | "eye" | "monitor-check" | "laptop-cap" | "eye-blue";

export type C1Copy = Omit<typeof C1_COPY, "benefits" | "noWalletHelp" | "heading" | "subtitle" | "benefitsTitle"> & {
  heading: string;
  subtitle: string;
  benefitsTitle: string;
  benefits: readonly { icon: BenefitIcon; text: string; nodeId: string }[];
  noWalletHelp: string;
};

/** The node ids the C1 page stamps on its desktop layout (provenance only). */
export type C1Nodes = Record<
  | "main" | "left" | "crumb" | "titleBlock" | "heading" | "subtitle" | "cardRow" | "card"
  | "qrWrap" | "qr" | "stateWrap" | "state" | "worksWithBlock" | "worksWith" | "appleRow"
  | "appleText" | "googleRow" | "googleText" | "issuedBy" | "expiry" | "right" | "benefits",
  string
>;

export type C1PhoneNodes = Record<
  | "main" | "crumb" | "titleBlock" | "heading" | "subtitle" | "imageCard" | "actions"
  | "buttons" | "apple" | "google" | "help" | "benefits",
  string
>;

export type C1Content = {
  kind: CredentialKind;
  breadcrumb: { label: string; href: string };
  copy: C1Copy;
  /** The QR's accessible name. */
  qrLabel: string;
  /** Which drawn stand-in the phone layout's image card shows. */
  phoneImage: "vehicle-certificate" | "notice-of-assessment";
  nodes: C1Nodes;
  /** null: no Figma phone frame for this credential (Flow 4). */
  phoneNodes: C1PhoneNodes | null;
};

/** Flow 3's C1 page, as it was written on 2026-09-29 — every id is the one the page carried. */
export const VRC_C1: C1Content = {
  kind: "driver-vehicle",
  breadcrumb: { label: C1_BREADCRUMB.label, href: C1_BREADCRUMB.href },
  copy: C1_COPY,
  qrLabel: "QR code to add your vehicle registration certificate to your wallet",
  phoneImage: "vehicle-certificate",
  nodes: {
    main: "6220:86447",
    left: "6220:86448",
    crumb: "6220:86449",
    titleBlock: "6220:86451",
    heading: "6220:86453",
    subtitle: "6220:86454",
    cardRow: "6220:86455",
    card: "6220:86456",
    qrWrap: "6220:86457",
    qr: "6220:86458",
    stateWrap: "6220:86459",
    state: "6220:86460",
    worksWithBlock: "6220:86461",
    worksWith: "6220:86462",
    appleRow: "6220:86463",
    appleText: "6220:86465",
    googleRow: "6220:86466",
    googleText: "6220:86468",
    issuedBy: "6285:90653",
    expiry: "6220:86469",
    right: "6220:86470",
    benefits: "6220:86471",
  },
  phoneNodes: {
    main: "6220:86490",
    crumb: "6220:86491",
    titleBlock: "6220:86493",
    heading: "6220:86494",
    subtitle: "6220:86495",
    imageCard: "6220:86496",
    actions: "6220:86498",
    buttons: "6220:86499",
    apple: "6220:86500",
    google: "6220:86503",
    help: "6220:86506",
    benefits: "6220:86507",
  },
};

export const C1_CONTENT: Record<CredentialKind, C1Content> = {
  "driver-vehicle": VRC_C1,
  studentaid: NOA_C1,
};

/** Where each credential's C1 page is — the wallet's "◀ MyGovNL" goes back there. */
export const C1_ROUTE: Record<CredentialKind, string> = {
  "driver-vehicle": FLOW3_ROUTES.c1,
  studentaid: FLOW4_ROUTES.c1,
};

/**
 * The presenter stage for a credential (Shift+W). Flow 3's is the bare path,
 * exactly as before; any other kind says which C1 page to show.
 */
export function stageRoute(kind: CredentialKind): string {
  return kind === "driver-vehicle" ? FLOW3_ROUTES.stage : `${FLOW3_ROUTES.stage}?c=${kind}`;
}

/* ---------------------------------------------------------- the wallet -- */

export type WalletRow = { readonly label: string; readonly value: string };

export type WalletCredential = {
  kind: CredentialKind;
  /** A second line under the issuer's name on W-03 / W-04 / W-05 (Flow 4 only). */
  issuerSubline?: string;
  connectBody: string;
  offer: {
    heading: string;
    /** "h3" is Flow 3's 36 px; Flow 4's W-04 heading is H4, 28 px. */
    headingSize: "default" | "h4";
    body: string;
    cardTitle: string;
    cardSubtitle: string;
    /** The icon beside the offer card's title. */
    icon: "vc" | "tasks";
  };
  review: {
    cardTitle: string;
    cardSubline?: string;
    /** Flow 4's card is drawn 188 tall with its content centred (6420:95309). */
    cardMinHeight?: number;
    intro: string;
    rows: readonly WalletRow[];
    consent: string;
    accept: string;
    decline: string;
  };
  /** W-07: the SMS code (Flow 3) or the wallet's own PIN (Flow 4). */
  codeMode: CodeMode;
  addedBody: string;
  /** W-09's card for this credential. */
  card: {
    title: string;
    subline?: string;
    rows: readonly WalletRow[];
    issuedLabel: (iso: string | null | undefined) => string;
    glyph: "truck" | "tasks";
    /** `data-wallet-card` — the gates find the card by it. */
    dataCard: string;
  };
};

const VRC_WALLET: WalletCredential = {
  kind: "driver-vehicle",
  connectBody: WALLET_COPY.connect.body,
  offer: {
    heading: WALLET_COPY.offer.heading,
    headingSize: "default",
    body: WALLET_COPY.offer.body,
    cardTitle: WALLET_COPY.offer.cardTitle,
    cardSubtitle: WALLET_COPY.offer.cardSubtitle,
    icon: "vc",
  },
  review: {
    cardTitle: WALLET_COPY.review.cardTitle,
    intro: WALLET_COPY.review.intro,
    rows: WALLET_COPY.review.rows,
    consent: WALLET_CONSENT,
    accept: WALLET_COPY.review.accept,
    decline: WALLET_COPY.review.decline,
  },
  /* THE one switch for Flow 3's W-07 is still flow3.ts's CODE_MODE ("sms"). */
  codeMode: CODE_MODE,
  addedBody: WALLET_COPY.added.body,
  card: {
    title: WALLET_COPY.cards.vrc.title,
    rows: WALLET_COPY.cards.vrc.rows,
    issuedLabel,
    glyph: "truck",
    dataCard: "vehicle-registration-certificate",
  },
};

const NOA_WALLET: WalletCredential = {
  kind: "studentaid",
  issuerSubline: NOA_WALLET_COPY.issuerSubline,
  connectBody: NOA_WALLET_COPY.connectBody,
  offer: { ...NOA_WALLET_COPY.offer, headingSize: "h4", icon: "tasks" },
  review: {
    cardTitle: NOA_WALLET_COPY.review.cardTitle,
    cardSubline: NOA_WALLET_COPY.review.cardSubline,
    cardMinHeight: 188,
    intro: NOA_WALLET_COPY.review.intro,
    rows: NOA_WALLET_COPY.review.rows,
    consent: NOA_WALLET_COPY.review.consent,
    /* Decision 2 — Figma "Accept" / "Decline", renamed as Flow 3's were. */
    accept: WALLET_COPY.review.accept,
    decline: WALLET_COPY.review.decline,
  },
  /* Decision 4 — the wallet-PIN screen of 6412:86737; no SMS banner. */
  codeMode: "wallet_pin",
  addedBody: NOA_WALLET_COPY.addedBody,
  card: {
    title: NOA_WALLET_COPY.card.title,
    subline: NOA_WALLET_COPY.card.subline,
    rows: NOA_WALLET_COPY.card.rows,
    issuedLabel: noaIssuedLabel,
    glyph: "tasks",
    dataCard: "notice-of-assessment",
  },
};

export const WALLET_CREDENTIALS: Record<CredentialKind, WalletCredential> = {
  "driver-vehicle": VRC_WALLET,
  studentaid: NOA_WALLET,
};
