/**
 * Copy for the services dashboard — Figma `mygovnl-services-dashboard`
 * 6206:23559 (the 2026-09 rebuild; it was 6031:5974).
 *
 * No copy changed in the rebuild — every string below still matches its text
 * node character-for-character. What changed is type scale and two per-card
 * layout quirks, captured as the `titleWraps` / `duplicateChevron` flags.
 *
 * Copy is character-for-character from Figma, including its inconsistencies:
 * straight apostrophes in `Learner's` / `learner's` / `child's` (U+0027), the
 * missing apostrophe in `drivers licence`, and the literal `&` in
 * `(Class 1-4 & 9)`. Reproduced, not corrected — see
 * design/token-exceptions-phase2a.md.
 */

export type ServiceCardData = {
  /** 20px/30px Bold #004b87, underlined, single-line with ellipsis. */
  title: string;
  /**
   * The card body, which Figma models as a `bullet-list` of 15px/22px lines.
   * One string, newline-separated: `ServiceCard` splits on "\n" and renders
   * each line as a `bullet-row` with its own 5 x 13 marker and a 10px gap.
   * The plan assumed a single paragraph; the design is a list. Logged.
   */
  body: string;
  /**
   * Only "Driver and Vehicle" has one. Every other card is inert on purpose:
   * the presenter must not be able to click into an unbuilt screen on stage.
   */
  href?: string;
  /**
   * `card-header` is `items-start` rather than `items-center justify-between`.
   * True on exactly two cards — `service-card-c1-0` (6031:5991) and
   * `service-card-c2-0` (6031:6068). The split is arbitrary in the design
   * file; it is reproduced, not harmonised.
   */
  headerTop?: boolean;
  /**
   * The 28px title WRAPS instead of truncating to one line. True on exactly
   * ONE card — `service-card-c2-0` (6031:6068), whose card-header measures 60
   * (two 30px lines). Every other card-header in the file measures 32, so
   * every other title is single-line and ellipsised.
   */
  titleWraps?: boolean;
  /**
   * `service-card-c2-2` (Personal Health Record, 6031:6104) carries a leftover
   * 16 x 16 `chevron-right` 6031:6106 IN ADDITION to the 32 x 32 `Chevron`
   * every card has, so it renders two arrows. A design bug, reproduced
   * verbatim — see design/resync-login-dashboard.md.
   */
  duplicateChevron?: boolean;
};

/** `welcome-section` 6031:5977 — "Welcome Jason Momoa!" */
export const DEMO_USER = { name: "Jason Momoa" } as const;

/**
 * `services-grid` 6031:5988 — three explicit columns of 384px cards.
 *
 * Three arrays, not one auto-flowed list. The columns are 872 / 716 / 976 tall
 * in Figma because they hold 4 / 3 / 3 cards of differing content height;
 * auto-flow would not reproduce those breaks. (They were 906 / 730 / 974
 * before the rebuild — the cards lost 16px of padding and gained a bigger
 * title, so every column re-flowed.)
 */
export const SERVICE_COLUMNS: readonly (readonly ServiceCardData[])[] = [
  // grid-column-1 6031:5989 — 872 tall
  [
    {
      // service-card-c1-0 6031:5990 — 170 tall, top-aligned header, but a
      // SINGLE-LINE title (Figma fits it in 320px; Chromium would not).
      title: "Accessible parking permit",
      body: "Renew your accessible parking permit\nSave/print an existing permit",
      headerTop: true,
    },
    {
      // service-card-c1-1 6031:6008
      title: "Early Learning Gateway",
      body: "Search for a list of regulated child care services\nAdd your child to a waitlist(s) for regulated child care services",
    },
    {
      // service-card-c1-2 6031:6026
      title: "MyHealthNL",
      body: "View results, reports, and clinic notes\nManage NL Health Services appointments\nView a list of medications received from your pharmacy\nAccess education, resources and tools to support your overall health and well-being",
    },
    {
      // service-card-c1-3 6031:6052
      title: "Tickets and fines",
      body: "View and pay your tickets",
    },
  ],
  // grid-column-2 6031:6066 — 716 tall
  [
    {
      // service-card-c2-0 6031:6067 — 198 tall; the title wraps to TWO 30px
      // lines, which is the only 60px card-header on the page.
      title: "Domestic wood cutting permits",
      body: "Purchase a domestic wood cutting permit\nManage an existing wood cutting permit",
      headerTop: true,
      titleWraps: true,
    },
    {
      // service-card-c2-1 6031:6085
      title: "Learner's permit and off-road vehicle tests",
      body: "Take your 5I learner's permit test\nTake your off-road vehicle training test",
    },
    {
      // service-card-c2-2 6031:6103 — the card with TWO chevrons.
      title: "Personal Health Record",
      body: "View laboratory results and medical imaging records\nView a list of medications received from your pharmacy\nUse the Health Library to learn about medical conditions and test results\nAccess mental wellness resources",
      duplicateChevron: true,
    },
  ],
  // grid-column-3 6031:6129 — 976 tall
  [
    {
      // service-card-c3-0 6031:6130 — the ONLY navigable card in the demo.
      title: "Driver and Vehicle",
      body: "Renew your vehicle or drivers licence\nChange your address with Motor Registration\nPurchase your driving record (abstract)\nRenew your vehicle registration\nNotify Motor Registration when you no longer own a vehicle\nPay for your road test\nRequest a vehicle registration reprint\nTake your commercial driver test (Class 1-4 & 9)",
      href: "/services/driver-vehicle/",
    },
    {
      // service-card-c3-1 6031:6172
      title: "MCP",
      body: "Renew your MCP card\nRenew your child's MCP card\nUpdate your organ and tissue donor status\nChange your address with MCP\nReplace a lost or stolen MCP card",
    },
    {
      // service-card-c3-2 6031:6202
      title: "StudentAidNL",
      body: "Apply for student financial assistance\nCheck your application status\nReceive messages about your application\nDownload tax documents",
    },
  ],
];
