"use client";

import Link from "next/link";

/*
 * ContinueButton — Figma 6031:6352, 106 x 37.
 *
 * Geometry confirms the token values exactly:
 *   width  24 + 58 (label) + 24 = 106
 *   height 10 + 17 (label) + 10 =  37   (17px = 14px Lato at leading-normal)
 *
 * Radius is 4px. The outline button next to it is 6px. That mismatch is a real
 * inconsistency in the design file — it is reproduced, not harmonised.
 * See design/token-exceptions.md.
 *
 * LEADING: Figma says `line-height: normal`, which is `leading-[normal]`, NOT
 * Tailwind's `leading-normal` (that is 1.5). With 1.5 the button measured
 * 106 x 41 against Figma's 106 x 37. Corrected in Task 12 — see
 * design/token-exceptions-phase2b.md.
 *
 * SIZE VARIANTS (added when re-syncing 6217:82446). The rebuilt desktop
 * frames set the label to 16px, which makes the button 39 tall instead of 37
 * — confirmation's ContinueButton 6102:101192 measures 324 x 39 with its
 * 276 x 19 label at x=24, y=10, and 19px is 16px Lato at `leading-[normal]`.
 * `sm` (14px) stays the default so nothing else moves.
 */

/*
 * TOUCH TARGET. `gnl-touch` raises the button to a 44px minimum below 768 —
 * but only inside `.gnl-desktop-shell`. The CID mobile frames use this same
 * component at their own designed 37px, and they are drawn at 393px, so
 * inflating them there would fight the design and move the mobile baselines.
 * Nothing changes at or above 768. See globals.css.
 */
const CLASSES =
  "gnl-touch box-border inline-flex items-center justify-center overflow-clip rounded-[4px] bg-[#243746] px-[24px] py-[10px] font-bold leading-[normal] text-white";

const LABEL_SIZE = { sm: "text-[14px]", lg: "text-[16px]" } as const;

export function BtnPrimary({
  children,
  onClick,
  href,
  className,
  size = "sm",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  /** Box overrides only. CID_ID_success stretches this button to `w-full`. */
  className?: string;
  /** `lg` is the rebuilt desktop scale (16px label). Defaults to `sm`. */
  size?: "sm" | "lg";
}) {
  const base = `${CLASSES} ${LABEL_SIZE[size]}`;
  const classes = className ? `${base} ${className}` : base;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} data-node-id="6031:6352">
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} data-node-id="6031:6352">
      {children}
    </button>
  );
}
