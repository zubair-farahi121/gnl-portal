/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import Link from "next/link";
import { ASSETS } from "@/lib/assets";

/*
 * `service-card-*` — GNWT services dashboard (Figma 20:23087, e.g. 18:21629).
 * release-2, 2026-11-16. Spec A §6.
 *
 *   card          white, 1px #D4D8DA border, radius 6, padding 12, gap 16,
 *                 flex-col, NO shadow. Min height 232 (grid row 1) or 285
 *                 (rows 2 and 3) at the 4-column width — see `minHeight`.
 *   card-header   items-start: title (flex-1, Noto Sans Medium 20/30, black,
 *                 underlined, wraps) + Chevron 32 pointing right, black.
 *   bullet-list   ONE paragraph (not bullets): Regular 16/22, #333.
 *   card-footer   flex-1, items-end, justify-end: 1x20 placeholder + star-off 20.
 *
 * THE TITLE IS THE LINK. Its `::after` is stretched over the whole card, so a
 * click anywhere on the card follows it, while the accessible name stays the
 * service title. Only "Driver and Vehicle Services" and "Student Financial
 * Assistance" pass an `href`; every other card's title is a <button> marked
 * `data-demo-inert`, which raises the "Not part of this demo" toast (the
 * delegated listener in DemoToast) and is keyboard-operable.
 *
 * The Chevron is inline (not `ASSETS.iconChevron32`) because that asset is
 * stroked in the old NL navy and the GNWT card draws it black. Same path,
 * rotated -90deg exactly as the Figma instance is.
 */

const CARD =
  "relative box-border flex w-full flex-col items-start gap-[16px] rounded-[6px] border border-solid border-[#d4d8da] bg-white p-[12px] hover:border-[#8b8d90]";

/** Fixed design heights, as minimums, applied only at the 4-column width. */
const MIN_HEIGHT = {
  232: "xl:min-h-[232px]",
  285: "xl:min-h-[285px]",
} as const;

const TITLE_CONTROL =
  "block w-full cursor-pointer text-left text-[20px] font-medium leading-[30px] text-black underline decoration-solid decoration-from-font [text-underline-position:from-font] [word-break:break-word] after:absolute after:inset-0 after:content-[''] hover:text-[#001f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]";

function Chevron() {
  return (
    <svg
      viewBox="0 0 32 32"
      width="32"
      height="32"
      fill="none"
      stroke="#000000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="block size-[32px] shrink-0 -rotate-90"
    >
      <path d="m5 10 11 12 11-12" />
    </svg>
  );
}

export function ServiceCard({
  title,
  body,
  href,
  clampTitle = false,
  minHeight,
}: {
  title: string;
  body: string;
  /** Only the two demo services have one. Without it the card is inert. */
  href?: string;
  /** Clamp the title to two lines with an ellipsis (ATOC only, per Figma). */
  clampTitle?: boolean;
  /** Design height of the card's grid row at 4 columns (232 or 285). */
  minHeight?: keyof typeof MIN_HEIGHT;
}) {
  const label = (
    <span
      className={clampTitle ? "line-clamp-2 overflow-hidden text-ellipsis" : "block"}
      title={clampTitle ? title : undefined}
    >
      {title}
    </span>
  );

  return (
    <div
      className={`${CARD} ${minHeight ? MIN_HEIGHT[minHeight] : ""}`}
      data-service-card={href ? "link" : "inert"}
    >
      {/* card-header */}
      <div className="flex w-full shrink-0 items-start gap-[8px]">
        <h3 className="m-0 min-w-px flex-[1_0_0]">
          {href ? (
            <Link href={href} className={TITLE_CONTROL}>
              {label}
            </Link>
          ) : (
            <button type="button" className={TITLE_CONTROL} data-demo-inert="true">
              {label}
            </button>
          )}
        </h3>
        <Chevron />
      </div>

      {/* bullet-list — a single paragraph in the GNWT design */}
      <p className="w-full text-[16px] font-normal leading-[22px] text-[#333333] [word-break:break-word]">
        {body}
      </p>

      {/* card-footer */}
      <div className="flex w-full flex-1 items-end justify-end">
        <div className="h-[20px] w-px shrink-0" />
        <img alt="" aria-hidden="true" className="block size-[20px] shrink-0" src={ASSETS.iconStarOff} />
      </div>
    </div>
  );
}
