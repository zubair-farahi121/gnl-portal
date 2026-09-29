/**
 * WALLET TOKENS — the one file that says what the wallet looks like.
 * ADDED 2026-09-29 with Flow 3 ("Issuance of Vehicle Registration Certificate").
 * REWRITTEN the same day to FLOW3_BRIEF.md §6's token table, which replaces
 * the first build's reading of the Portage variable bindings. Where the two
 * disagreed, the brief won:
 *   - secondary button stroke   #081010        -> rgba(8,16,16,0.6)
 *   - disabled button text      60 % ink       -> 70 % ink
 *   - W-08 check stroke         #45ab8e        -> #2E8E74
 *   - W-05 certificate radius   16             -> 20
 *   - W-09 card shadow          0 2 4 / 7 %    -> 0 2px 8px rgba(0,0,0,0.07)
 *   - progress                  px fractions   -> the brief's 20/40/40/60/80/100 %
 *
 * ====================================================================
 * THESE ARE NOT GNL TOKENS AND MUST NEVER BE MIXED WITH THEM (brief §6: "Don't
 * use GNL styles or Lato inside the wallet"). The wallet is a neutral phone
 * app — Inter, Black 900 headlines, #081010 ink and buttons, a mint accent,
 * #F3F5FB panels, radius 8 / 16. Side by side on stage it must read as a
 * different product from the GNL portal (Lato, #243746, radius 6).
 *
 *   - nothing GNL leaks IN: the wallet imports no GNL token, no `gnl-*` class
 *     and no `--gnl-*` variable, and its root sets its own font, colour and
 *     line-height so nothing is inherited from <body>;
 *   - nothing wallet leaks OUT: plain constants, not CSS custom properties
 *     (which inherit), Inter loaded by the WALLET's layout only, and its few
 *     CSS rules emitted in that layout, `gnl-wallet-` prefixed.
 * ====================================================================
 */

export const WALLET_COLOR = {
  /** Ink — headings, values, primary button fill, home indicator. */
  text: "#081010",
  /** Secondary text — supporting copy, card descriptions, row labels (70 %). */
  textSecondary: "rgba(8,16,16,0.7)",
  /** Tertiary text — W-02's hint line (60 %). Also the secondary button stroke. */
  textTertiary: "rgba(8,16,16,0.6)",
  background: "#ffffff",
  /** Soft blue-grey — panels, code boxes, the keypad area. */
  soft: "#f3f5fb",
  /** Soft border — hairlines, card strokes, progress track, keypad lines. */
  line: "#e6e8ef",
  /** Brand dark (teal) — progress fill, scan card, dark certificate card, links. */
  brand: "#1e404d",
  /** Mint — badge circles, icon boxes, the verified card. */
  mint: "#dbf0ea",
  /** Border mint — the verified card's stroke and icon circle, W-02's scan line. */
  mintBorder: "#86ceba",
  /** Green — the active code box, the leading loader dot. */
  green: "#45ab8e",
  /** Check stroke — W-08's success tick. */
  check: "#2e8e74",
  /** Other icon boxes on W-09. */
  tilePhotoId: "#e8f0f8",
  tileProofOfAge: "#fde8e8",
  /** W-02's dashed viewfinder stroke (6286:90672). */
  viewfinder: "rgba(8,16,16,0.4)",
  /** The "Your credentials" panel and W-01's list cards. */
  tint05: "rgba(8,16,16,0.05)",
  /** A filled code box's stroke (6322:60905). */
  codeFilled: "rgba(8,16,16,0.6)",
  /**
   * NOT A FIGMA VALUE. The page behind the phone frame at > 430 px — the same
   * soft border grey, so the white phone reads without a heavy backdrop.
   */
  backdrop: "#f3f5fb",
  /** The wallet's own neutral toast (it never uses the GNL one). */
  toast: "#081010",
  toastText: "#ffffff",
} as const;

/** Inter weights — brief §6: 300, 500, 600, 700, 800, 900 (400 kept for the toast). */
export const WALLET_WEIGHT = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

/** Type styles from the brief's §6 table, ready to spread into `style`. */
export const WALLET_TYPE = {
  /** Heading — Inter 900 36/110 %, −0.03em. */
  heading: { fontSize: "36px", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em" },
  /** "Added Successfully" — Inter 900 48/100 %, −0.03em. */
  headingXl: { fontSize: "48px", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.03em" },
  /** Supporting copy — Inter 300 18/150 %, 70 % ink. */
  lead: { fontSize: "18px", fontWeight: 300, lineHeight: 1.5, color: "rgba(8,16,16,0.7)" },
  /** Body — Inter 300 16/150 %, 70 % ink (W-05 intro / consent, W-07 body, W-01 subtitle). */
  body: { fontSize: "16px", fontWeight: 300, lineHeight: 1.5, color: "rgba(8,16,16,0.7)" },
  /** Card title — Inter 600 16/150 %. */
  cardTitle: { fontSize: "16px", fontWeight: 600, lineHeight: 1.5 },
  /** Card description — Inter 300 14/120 %, 70 % ink. */
  cardDesc: { fontSize: "14px", fontWeight: 300, lineHeight: 1.2, color: "rgba(8,16,16,0.7)" },
  /** Quick-action card label (W-01) — Inter 600 18/150 %. */
  actionLabel: { fontSize: "18px", fontWeight: 600, lineHeight: 1.5 },
  /** W-02 title "Scan QR Code" — Inter 900 18/130 %. */
  screenTitle: { fontSize: "18px", fontWeight: 900, lineHeight: 1.3 },
  /** Status bar time — Inter 600 15. */
  statusTime: { fontSize: "15px", fontWeight: 600, lineHeight: "18px" },
  /** W-05 detail label — Inter 300 12 / value Inter 600 16. */
  rowLabel: { fontSize: "12px", fontWeight: 300, lineHeight: "15px", color: "rgba(8,16,16,0.7)" },
  rowValue: { fontSize: "16px", fontWeight: 600, lineHeight: "19px" },
  /** W-07 code digit — Inter 700 24; keypad digit — Inter 500 24. */
  codeDigit: { fontSize: "24px", fontWeight: 700, lineHeight: "29px" },
  keypadDigit: { fontSize: "24px", fontWeight: 500, lineHeight: "29px" },
  /** Help link — Inter 300 14/120 %, teal, underlined. */
  link: { fontSize: "14px", fontWeight: 300, lineHeight: 1.2, color: "#1e404d" },
  toast: { fontSize: "14px", fontWeight: 600, lineHeight: 1.4 },
} as const;

export const WALLET_SIZE = {
  /** Buttons, code boxes, W-09 tiles. */
  radiusSmall: "8px",
  /** Cards. */
  radiusMain: "16px",
  /** Button stroke. */
  border: "1.5px",
  buttonHeight: "56px",
  /** Side padding of the wallet header and most screens. */
  gutter: "24px",
  progressHeight: "6px",
  /** THE phone frame (brief §6): one size for every screen. */
  phoneWidth: 393,
  phoneHeight: 852,
  phoneRadius: 48,
  /** At or below this viewport width the frame is dropped: full screen. */
  fullScreenMax: 430,
  /** Home indicator bar and its reserved strip. */
  homeIndicatorWidth: 140,
  homeIndicatorHeight: 5,
  homeIndicatorArea: 34,
} as const;

/** Progress bar fill per screen — brief §6, verbatim. */
export const WALLET_PROGRESS = {
  connect: 0.2,
  offer: 0.4,
  review: 0.4,
  connecting: 0.6,
  code: 0.8,
  added: 1,
} as const;

export const WALLET_TIMING = {
  /** W-02: the simulated camera "detects" the QR after about 1.2 s (brief §7). */
  scanDetectMs: 1200,
  /** W-02: the snap / pulse between detection and W-03. */
  scanSnapMs: 350,
  /** W-06 "Connecting wallet..." -> W-07, about 1.8 s (brief §7). */
  connectMs: 1800,
  /** W-07: Continue -> `code_verified`, about 0.6 s, -> `issued` + W-08 (brief §7). */
  codeIssueMs: 600,
  /** W-07: the SMS banner slides down this long after the screen opens. */
  smsBannerDelayMs: 900,
  /** W-09: the new card's soft highlight, about 3 s (brief §7). */
  newCardHighlightMs: 3000,
  /** Wallet toast on-screen time — the GNL toast's 3.2 s, for consistency. */
  toastMs: 3200,
} as const;
