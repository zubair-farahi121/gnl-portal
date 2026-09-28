/**
 * YOTI TOKENS — the one file to edit after Zubair's real verification.
 *
 * YOTI_BRIEF.md §6: "Put the Yoti tokens (colours, font, sizes above) in one
 * file, so they are easy to change after Zubair's real verification."
 *
 * ====================================================================
 * THESE ARE NOT GNL TOKENS AND MUST NEVER BE MIXED WITH THEM.
 *
 * Everything here describes a surface WE DO NOT CONTROL. Yoti's face-scan and
 * document steps arrive as embed code — effectively an iframe. Tatyana, on
 * Slack: "we can put our header, stepper and footer around it, but the main
 * content is embedded and we can't change it in any way."
 *
 * So the rule (§3) is inverted from the rest of this codebase. Everywhere else
 * we reproduce Tatyana's GNL design. Inside the Yoti zone we reproduce the REAL
 * YOTI, and Tatyana's recreation is only the fallback for screens no real
 * screenshot covers. §4 makes that explicit with three marks: REAL (in the
 * screenshot — keep), FIGMA (only in the recreation — keep, but styled with the
 * values below), MINE (in neither — DELETE).
 *
 * Source of every number: design/YOTI_OBSERVED.md, read off the real
 * screenshots in Figma section 6127:50647. Where YOTI_OBSERVED.md and
 * YOTI_BRIEF.md §6 disagree, YOTI_OBSERVED.md wins — it was measured from the
 * images; §6 was measured once and rounded.
 *
 * PRECEDENCE, highest first:
 *   1. Zubair's own English verification screenshots (§12) — not yet taken.
 *   2. design/YOTI_OBSERVED.md (the French screenshots).
 *   3. YOTI_BRIEF.md §6.
 *   4. Tatyana's Figma recreation.
 * ====================================================================
 *
 * WHY A `const` OBJECT AND NOT CSS VARIABLES. The zone has to be *isolated*
 * (§6: "GNL global styles must not leak into it, and its styles must not leak
 * out"). CSS custom properties inherit, which is the opposite of isolation —
 * a `--yoti-blue` defined on the zone would be readable by anything nested,
 * and a GNL variable of the same name further up would silently win. Importing
 * explicit values means a Yoti colour can only appear where someone typed it.
 */

/**
 * Colours, from §6 and YOTI_OBSERVED.md.
 *
 * The two blues are NOT interchangeable and the difference is deliberate:
 * `button` is the filled Continue button, `link` is the darker blue of the
 * "Privacy Policy" link inside the grey panel on Y3.
 */
export const YOTI_COLOR = {
  /** Headings, body text, the Y8 progress fill, the Y2 window outline. */
  ink: "#333b40",
  /** Secondary text: panel copy, tips, sub-lines, the help icon. */
  muted: "#546072",
  /** Continue button fill, and the selected document row. */
  button: "#286cab",
  /** "Privacy Policy" link on Y3. Darker than `button` — not a mistake. */
  link: "#355677",
  /** Y1 illustration panel. */
  illustration: "#ebf5ff",
  /** Y3 privacy panel and the Y5 "Don't forget:" card. */
  panel: "#f3f4f6",
  /** Round badge on Y5 and Y8. */
  badge: "#eef6f8",
  /** Borders: country field and document rows. */
  border: "#9ca5b4",
  /** The radio outline specifically — §6 gives #9da5b4, one digit off `border`. */
  radioBorder: "#9da5b4",
  /** Y8 progress track. */
  track: "#d0d5db",
  /** "‹ Back" on Y2. */
  back: "#68707b",
  /**
   * The focus ring on the Y3 country field. Yes, really — a thick bright
   * magenta, clearly visible in 6127:50655. It is Yoti's, not ours, and it is
   * reproduced because §3 says to show only and exactly what Yoti shows.
   */
  focus: "#f500dc",
  white: "#ffffff",
} as const;

/**
 * Type scale. §6's headline correction: Tatyana's recreation is SMALLER and
 * LIGHTER than the real thing almost everywhere, so every value here is a step
 * up from what the existing screens currently render.
 */
export const YOTI_TEXT = {
  /** Most headings. */
  heading: "24px",
  /** Y1 and Y8 only — measurably larger than the rest (§6, §7 Y8). */
  headingLarge: "27px",
  /** Tight, as the real screenshots show. */
  headingLeading: "1.2",
  /** Body copy. */
  body: "16px",
  bodyLeading: "1.4",
  /** Y1's three tips run a touch larger than body (YOTI_OBSERVED.md Y1). */
  tip: "17px",
  /** "Accepted documents:" on Y4. */
  listTitle: "20px",
  /** "Your privacy and Yoti" on Y3. */
  panelTitle: "18px",
  /** "Don't forget:" on Y5. */
  cardTitle: "16px",
  /** Continue button label. */
  button: "16px",
  /** "‹ Back" on Y2. */
  back: "15px",
  /** "Powered by" on Y3. */
  poweredBy: "13px",
} as const;

/** Geometry. */
export const YOTI_SIZE = {
  /** Side gutter inside the zone (YOTI_OBSERVED.md: 20–24px). */
  gutter: "20px",
  /** Continue button: ~48px tall, radius ~6 — NOT the 37px/radius-4 recreation. */
  buttonHeight: "48px",
  buttonRadius: "6px",
  /** White space above the button inside its pinned bar. */
  barPadding: "16px",
  /** The chevron on the Continue button, and its inset from the right edge. */
  chevronWidth: "6px",
  chevronHeight: "12px",
  chevronInset: "18px",
  /** Circled "?" — Y1, Y3, Y5. */
  helpIcon: "18px",
  /** Y1 illustration panel. */
  illustrationRadius: "16px",
  /** Y3 country field. */
  fieldHeight: "46px",
  fieldRadius: "6px",
  fieldBorder: "2px",
  focusRing: "4px",
  /** Y4 document rows. */
  rowMinHeight: "54px",
  rowRadius: "8px",
  rowBorder: "2px",
  rowGap: "15px",
  radio: "20px",
  /** Y3 privacy panel / Y5 card. */
  panelRadius: "8px",
  panelPadding: "20px",
  /** Y5 and Y8 round badge. */
  badge: "110px",
  /** Y8 progress bar. */
  progressHeight: "5px",
  /** Y8 fill duration. §7 Y8: "It fills in about 2 s." */
  progressMs: 2000,
} as const;

/**
 * The shadow above the pinned action bar.
 *
 * §6: "a soft shadow above it (about 10 px, fading upwards)". Written as a
 * negative-Y shadow with no spread so it only ever paints UPWARD, over the
 * scrolling Yoti content — never downward onto the MyGovNL footer, which is
 * ours and must not gain a shadow it never had (§13: "Nothing outside the Yoti
 * zone has changed").
 */
export const YOTI_BAR_SHADOW = "0 -4px 10px -2px rgba(51, 59, 64, 0.10)";

/**
 * Y2's treatment OUTSIDE the head window.
 *
 * YOTI_OBSERVED.md Y2: "washed toward white and blurred — the room is still
 * readable but flattened and pale". §6 gives the white layer as about 65%. The
 * blur is deliberately slight: the real screenshot is soft, not frosted.
 */
export const YOTI_MASK = {
  washWhite: 0.65,
  blurPx: 3,
  /** The dark edge of the window itself. */
  outline: YOTI_COLOR.ink,
  outlineWidth: 2.5,
  /**
   * The thin band just inside the outline.
   *
   * WHITE, NOT BEIGE. Tatyana's `face-outline.svg` draws this band in #d6cfc9
   * and the current build reproduces that beige. §7 Y2 is explicit: "That file
   * comes from Tatyana's recreation, where the inner band is beige (#d6cfc9):
   * make it white." The real screenshot shows a semi-transparent white band.
   */
  bandColor: "rgba(255,255,255,0.55)",
  bandWidth: 5,
} as const;

/**
 * Screens that show the circled "?" — §6 and §7.
 *
 * Y2 has "‹ Back" instead, and Y8 has nothing. On Y5 the real screenshot has
 * the icon hidden behind the session-expiry toast, so its presence there is
 * inferred rather than seen; §6 says "probably Y5 too" and §13 requires it, so
 * it is included and logged as an open question.
 */
export const YOTI_HELP_SCREENS = ["Y1", "Y3", "Y5"] as const;

/**
 * Y8's copy, isolated per §7 Y8: "The English text is our translation of the
 * French screenshot. It will be replaced by the real English text after
 * Zubair's verification. Keep it in one constant."
 *
 * `documentLabel` is the flow's own — "Driver's License" in Flow A, "Passport"
 * in Flow B — so it is a parameter, never a literal. The real screenshot names
 * a real person's health card; that is NOT reproduced (§10).
 */
export function yotiUploadCopy(documentLabel: string): string {
  return `Please don't close this window until we've uploaded your ${documentLabel}. This usually takes less than a minute.`;
}
