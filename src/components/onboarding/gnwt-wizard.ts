/*
 * Shared class strings for the GNWT onboarding wizard and the desktop
 * hand-off pages — release-2 re-brand, spec gnwt-specs/B-wizard.md.
 *
 * One place for the values every wizard screen repeats, so the six screens
 * cannot drift apart. Colours are the GNWT tokens the spec measures:
 *   #333333 text primary, #676869 text secondary, #005d8f link,
 *   #cacbcd divider, #212326 hand-off heading.
 */

/**
 * The page well around the card. Header -> 76px -> card -> 76px -> footer at
 * desktop (§1.1); the card is centred with `justify-center` and capped by
 * `max-w-full`, so a small gutter is enough. `.gnl-gutter` steps the 48px side
 * gutter down to 24 below 768 and 16 below 480.
 */
export const WIZARD_WELL =
  "gnl-gutter [--gnl-gutter:48px] flex w-full justify-center pt-[76px] pb-[76px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]";

/** Section title — "Confirm some details", "Welcome to …", "Success!" (§1.4). */
export const SECTION_TITLE =
  "w-full shrink-0 text-[29px] font-bold leading-[1.5] text-[#333333] [overflow-wrap:anywhere] max-xs:text-[24px]";

/** Body / intro copy, 16 on 24. */
export const BODY_TEXT =
  "w-full text-[16px] font-normal leading-[24px] text-[#333333] [overflow-wrap:anywhere]";

/** Secondary body copy (notes, success body, scope labels), 16 on 24. */
export const SECONDARY_TEXT =
  "w-full text-[16px] font-normal leading-[24px] text-[#676869] [overflow-wrap:anywhere]";

/**
 * Cancel — a text link, not a button (§1.5): SemiBold 600, 16px,
 * line-height normal, #005d8f, no underline.
 */
export const CANCEL_LINK =
  "shrink-0 whitespace-nowrap rounded-[2px] text-[16px] font-semibold leading-[normal] text-[#005d8f] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f] max-xs:py-[10px] max-xs:text-center";

/**
 * The actions row: right-aligned, 24px gap, 16px top padding. Below 480 it
 * becomes a full-width stack with the primary on top (`flex-col-reverse`),
 * the DOM and tab order unchanged.
 */
export const ACTIONS_ROW =
  "flex w-full shrink-0 items-center justify-end gap-[24px] pt-[16px] max-xs:flex-col-reverse max-xs:items-stretch max-xs:gap-[12px]";

/**
 * The same row with the 1px #cacbcd divider above it (Summary, T&C, Success).
 * The card's 32px gap is pulled in to about 16px above the divider (24 -> 16
 * at phone width, where the card gap is 24).
 */
export const ACTIONS_ROW_DIVIDED = `${ACTIONS_ROW} -mt-[16px] border-t border-[#cacbcd] max-xs:-mt-[8px]`;
