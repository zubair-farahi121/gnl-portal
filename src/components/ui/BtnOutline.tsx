"use client";

import Link from "next/link";

/*
 * btn-back — Figma 6031:6350, 75 x 39.
 *
 * Radius is 6px while the primary button beside it is 4px. Reproduced as-is:
 * it is a genuine inconsistency in the design file, not something to fix here.
 *
 * BOX-MODEL DELTA — RESOLVED in Task 12. Figma draws the 1px stroke *inside*
 * the 75 x 39 frame (label at x=20, y=10 from the outer edge), which a CSS
 * `border` cannot do: it rendered 77 x 41. The stroke is now painted with an
 * inset box-shadow, the same way TopNav and WizardCard do it, so the mandated
 * px-[20px]/py-[10px] survive AND the box is exactly 75 x 39.
 *
 * LEADING: Figma says `line-height: normal` → `leading-[normal]`, NOT
 * Tailwind's `leading-normal` (which is 1.5, and made the button 43 tall).
 * Both corrections are logged in design/token-exceptions-phase2b.md.
 */

/*
 * TOUCH TARGET. Same arrangement as BtnPrimary: `gnl-touch` is a 44px minimum
 * below 768 inside `.gnl-desktop-shell` only, so the 393px CID frames — which
 * use this component at its designed 39px — are untouched, and so is every
 * width at or above 768. See globals.css.
 */
const CLASSES =
  "gnl-touch box-border inline-flex items-center rounded-[6px] bg-white px-[20px] py-[10px] text-[16px] font-bold leading-[normal] text-[#243746] shadow-[inset_0_0_0_1px_#243746]";

export function BtnOutline({
  children,
  onClick,
  href,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  /**
   * Box overrides only — never type, colour or radius. The CID mobile frames
   * stretch this same `btn-back` component to half width (`flex-[1_0_0]
   * min-w-px justify-center`) and full width (`w-full justify-center`).
   */
  className?: string;
}) {
  const classes = className ? `${CLASSES} ${className}` : CLASSES;

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick} data-node-id="6031:6350">
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes} data-node-id="6031:6350">
      {children}
    </button>
  );
}
