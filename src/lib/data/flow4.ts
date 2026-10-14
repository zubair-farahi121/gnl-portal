import { DEMO_USER } from "@/lib/data/services";
import { FLOW4_ROUTES, serviceRoutes } from "@/lib/data/service-config";
import { C1_COPY } from "@/lib/data/flow3";
import type { C1Content } from "@/lib/data/credentials";

/**
 * FLOW 4 — "Issuance of Notice of Assessment" (StudentAidNL). ADDED 2026-10-14.
 * User: "ok let implment this 4th flow also where it shoud be".
 * Figma section 6422:98300, read with get_metadata / get_design_context /
 * get_screenshot / get_variable_defs only (no Figma write tool was called).
 *
 * THE SAME FLOW AS FLOW 3 WITH A DIFFERENT CREDENTIAL. The C1 page is Flow 3's
 * layout (src/components/service/WalletOfferPage.tsx) and the wallet is the
 * same app (src/app/wallet/*); this file holds only what Flow 4 SAYS. Every
 * string is verbatim from the node named beside it unless a comment says it
 * is derived or changed — and every change is one of the team's decisions,
 * logged in DEMO_AUDIT.md "Flow 4":
 *
 *   1. persona Jason Moore (Figma W-05 / W-09: "Jason Momoa") — DEMO_USER;
 *   2. W-05 buttons "Add to wallet" / "Cancel" (Figma "Accept" / "Decline"),
 *      and the consent paragraph quotes the new button name;
 *   3. the C1 subtitle names no wallet brand;
 *   4. W-07 is the wallet-PIN screen (no SMS), any 6 digits;
 *   5. "Issued <today>" on W-09, as Flow 3.
 *
 * The frames (left to right on the canvas):
 *   6408:84644  StudentAidNL-service-page_trusted   the entry panel
 *   6412:85663  student-aid-service-page            C1, "Waiting for scan…"
 *   6415:90752 / 6415:91577                          C1, "Adding to your wallet…"
 *   6412:86701  W-01  6412:85792 W-02  6412:86796 W-03  6412:85809 W-04
 *   6412:86558  W-05  6412:86535 W-06  6412:86737 W-07  6412:86625 W-08
 *   6412:86648  W-09
 */

/* ======================================================================== *
 * THE ENTRY — "Skip retyping your funding details", 6412:85602, under
 * "Access the StudentAid Portal" on the Trusted StudentAidNL page. Flow 3's
 * "Skip the paper copy" panel (VcUpsellPanel) with these strings and ids.
 * ======================================================================== */
export const NOA_UPSELL = {
  /** 6412:85607. */
  title: "Skip retyping your funding details",
  /** New_pill 6412:85609. */
  badge: "New",
  /** 6412:85610. */
  body: "Add your verified notice of assessment to your wallet. Reuse it for scholarship, bursary, and award applications, no re-entering numbers.",
  /** btn-primary 6412:85613 — opens Flow 4's C1 page. */
  actionLabel: "Add to wallet",
  actionHref: FLOW4_ROUTES.c1,
  /** `VRC VC upsell` 6412:85602 — the layer kept Flow 3's name in Figma. */
  nodeId: "6412:85602",
  nodeIds: {
    avatar: "6412:85603",
    qr: "6412:85604",
    details: "6412:85605",
    titleRow: "6412:85606",
    title: "6412:85607",
    pill: "6412:85608",
    pillText: "6412:85609",
    body: "6412:85610",
    actions: "6412:85611",
    action: "6412:85612",
  },
} as const;

/* ======================================================================== *
 * C1 — "Add your notice of assessment to your wallet". 6412:85663 (waiting),
 * 6415:90752 / 6415:91577 (adding). Same geometry as Flow 3's 6220:86445.
 * ======================================================================== */
export const NOA_C1: C1Content = {
  kind: "studentaid",
  breadcrumb: {
    /** 6412:85668 — U+2190, as on Flow 3's crumb. */
    label: "← Back to StudentAidNL",
    /**
     * Figma points it at https://www.gov.nl.ca, like every crumb in the file;
     * retargeted to the TRUSTED StudentAidNL page the user came from — Flow
     * 3's C1_BREADCRUMB rule.
     */
    href: serviceRoutes("studentaid").pageVerified,
  },
  copy: {
    ...C1_COPY,
    /** 6412:85671. */
    heading: "Add your notice of assessment to your wallet",
    /**
     * 6412:85672: "…Scan the code with Apple Wallet or Google Wallet to add
     * it." CHANGED (decision 3) to name no wallet brand, exactly as Flow 3's
     * subtitle was changed on 2026-09-30. The "Works with" marks stay.
     */
    subtitle:
      "Your notice of assessment is verified and active. Scan the code with your digital wallet to add it.",
    /** 6412:85691 — Lato ExtraBold in Figma; rendered 700, as Flow 3. */
    benefitsTitle: "What can you do with a digital notice of assessment?",
    /**
     * 6412:85696 / 6412:85700 / 6412:85704, with their Figma icon names
     * (`Checkmark_magnifying glass_screen`, `Graduation cap_screen`, `Eye`).
     * Apostrophes are U+0027 in Figma.
     */
    benefits: [
      {
        icon: "monitor-check",
        text: "Skip resubmitting proof of funding for scholarship and bursary applications",
        nodeId: "6412:85693",
      },
      {
        icon: "laptop-cap",
        text: "Prove you're a full-time student receiving assistance, without sharing your loan or grant amounts",
        nodeId: "6412:85697",
      },
      {
        icon: "eye-blue",
        text: "Share only what's needed, like proving you're eligible for a student discount, without handing over your reference number or full financial breakdown",
        nodeId: "6412:85701",
      },
    ],
    /**
     * NO FIGMA PHONE TWIN FOR FLOW 4. Below 768 the page mirrors Flow 3's
     * F3-03 (6220:86488) with Flow 4's strings. This one line is DERIVED from
     * F3-03's "Get help adding your licence" with the credential's name in
     * it; it shows the "Not part of this demo" toast. Open question.
     */
    noWalletHelp: "Get help adding your notice of assessment",
  },
  qrLabel: "QR code to add your notice of assessment to your wallet",
  phoneImage: "notice-of-assessment",
  nodes: {
    main: "6412:85665",
    left: "6412:85666",
    crumb: "6412:85667",
    titleBlock: "6412:85669",
    heading: "6412:85671",
    subtitle: "6412:85672",
    cardRow: "6412:85673",
    card: "6412:85674",
    qrWrap: "6412:85675",
    qr: "6412:85676",
    stateWrap: "6412:85677",
    state: "6412:85678",
    worksWithBlock: "6412:85679",
    worksWith: "6412:85680",
    appleRow: "6412:85681",
    appleText: "6412:85683",
    googleRow: "6412:85684",
    googleText: "6412:85686",
    issuedBy: "6412:85687",
    expiry: "6412:85688",
    right: "6412:85689",
    benefits: "6412:85690",
  },
  /* No phone frame in Figma -> no node ids on the phone layout (claiming
     Flow 3's ids for it would be inventing provenance). */
  phoneNodes: null,
};

/* ======================================================================== *
 * THE WALLET — W-03..W-09 for the notice of assessment. Visual values are
 * wallet-tokens.ts, shared with Flow 3; only copy and data are here.
 * ======================================================================== */

/**
 * The notice of assessment's DATA — W-05's 19 rows (6412:86589, in frame
 * order) and W-09's four. Synthetic, verbatim from Figma, EXCEPT the
 * recipient: Figma says "Jason Momoa" (6412:86595, 6412:86678); the persona is
 * Jason Moore and comes from DEMO_USER, never retyped (decision 1).
 */
export const NOTICE_OF_ASSESSMENT = {
  issuer: "StudentAidNL, Government of Newfoundland and Labrador",
  recipient: DEMO_USER.name,
  reference: "SA-2026-048217",
  academicYear: "2026-2027",
  studyPeriod: "September 2026 to April 2027",
  institution: "Memorial University",
  /**
   * W-05 6412:86610 says "Full-time"; W-09 6418:93848 says "Full time".
   * REPRODUCED BOTH, as drawn — open question in DEMO_AUDIT.md "Flow 4".
   */
  studyLoad: "Full-time",
  studyLoadOnCard: "Full time",
  assessmentDate: "August 18, 2026",
  assessmentType: "Initial Assessment",
  msfaaStatus: "Confirmed",
  canadaStudentGrant: "$3,500",
  canadaStudentLoan: "$7,200",
  nlStudentGrant: "$3,360",
  nlStudentLoan: "$3,360",
  totalApproved: "$17,420",
  status: "Eligible",
  credentialId: "SFAA-2026-0004471",
  issued: "August 18, 2026",
  revocation: "Not revoked, current version",
} as const;

const NOA = NOTICE_OF_ASSESSMENT;

/** "Issued <Mon D, YYYY>" — W-09 6412:86673 draws the SHORT month ("Issued Aug 18, 2026"), as the base cards do. */
export function noaIssuedLabel(iso: string | null | undefined): string {
  const d = iso ? new Date(iso) : new Date();
  const month = d.toLocaleString("en-US", { month: "short" });
  return `Issued ${month} ${d.getDate()}, ${d.getFullYear()}`;
}

export const NOA_WALLET_COPY = {
  /** The line under "Government of Newfoundland & Labrador" on W-03 (6420:96729), W-04 (6420:97429), W-05 (6420:98129). */
  issuerSubline: "StudentAidNL",
  /** W-03 6412:87509. Heading, trust cards and buttons are Flow 3's strings (6412:87508, 6412:87510, 6412:87525). */
  connectBody: "StudentAidNL, MyGovNL wants to offer you a new digital notice of assessment for your wallet.",
  /** W-04 6412:85809. */
  offer: {
    /** 6412:86522 — H4: Inter 900 28/110 %, no tracking (Flow 3's W-04 heading is H3 36). */
    heading: "Notice of assessment offered",
    /** 6412:86523. */
    body: "Your notice of assessment is verified and ready for secure on-device storage.",
    /** 6412:86528 / 6412:86529 — lower-case "digital", as drawn. */
    cardTitle: "Notice of assessment",
    cardSubtitle: "Verifiable digital credential",
  },
  /** W-05 6412:86558. */
  review: {
    /** The dark card 6420:95309: the GNL mark, "StudentAidNL" (6420:95312), "Notice of assessment" (6420:95313). */
    cardSubline: "StudentAidNL",
    cardTitle: "Notice of assessment",
    /** 6412:86588 — capital N, as drawn. */
    intro: "Verify your Notice of assessment details before saving them onto this device.",
    rows: [
      { label: "Issuer", value: NOA.issuer },
      { label: "Recipient", value: NOA.recipient },
      { label: "Application/reference number", value: NOA.reference },
      { label: "Academic year", value: NOA.academicYear },
      { label: "Study period", value: NOA.studyPeriod },
      { label: "Institution", value: NOA.institution },
      { label: "Study load", value: NOA.studyLoad },
      { label: "Assessment date", value: NOA.assessmentDate },
      { label: "Assessment type", value: NOA.assessmentType },
      { label: "MSFAA status", value: NOA.msfaaStatus },
      { label: "Federal funding, Canada Student Grant", value: NOA.canadaStudentGrant },
      { label: "Federal funding, Canada Student Loan", value: NOA.canadaStudentLoan },
      { label: "Provincial funding, NL Student Grant", value: NOA.nlStudentGrant },
      { label: "Provincial funding, NL Student Loan", value: NOA.nlStudentLoan },
      { label: "Total approved funding", value: NOA.totalApproved },
      { label: "Status", value: NOA.status },
      { label: "Credential ID", value: NOA.credentialId },
      { label: "Issued", value: NOA.issued },
      { label: "Revocation status", value: NOA.revocation },
    ],
    /**
     * 6412:86617: 'By selecting "Accept," your digital notice of assessment
     * credential is added to your wallet. It's stored securely, and you decide
     * when it's shared.' The quoted button name follows the renamed button
     * (decision 2). Straight quotes and apostrophes, as in Figma.
     */
    consent:
      "By selecting \"Add to wallet,\" your digital notice of assessment credential is added to your wallet. It's stored securely, and you decide when it's shared.",
  },
  /** W-08 6412:86642 — capital N, as drawn. */
  addedBody: "Your Notice of assessment is secure and ready for use.",
  /** W-09 6412:86666 — the expanded card. */
  card: {
    title: "Notice of assessment",
    /** 6420:95304 — full ink, not 70 %. */
    subline: "StudentAidNL, MyGovNL",
    rows: [
      { label: "Recipient", value: NOA.recipient },
      { label: "Institution", value: NOA.institution },
      { label: "Academic year", value: NOA.academicYear },
      { label: "Study load", value: NOA.studyLoadOnCard },
    ],
  },
} as const;
