import Link from "next/link";
import { ASSETS } from "@/lib/assets";

/*
 * `service-card-*` — Figma 6031:5990 and its nine siblings on
 * `mygovnl-services-dashboard` 6206:23559. One component, ten instances.
 *
 * Geometry, verbatim from get_design_context on 6031:5990 / 6068 / 6085 / 6104:
 *   card          w-full (384 in a 1200 grid) p-[16px] gap-[16px] r-[6px]
 *                 1px #d4d8da stroke, white fill, NO shadow
 *   card-header   6031:5991  title (flex-1) + Chevron 32 x 32
 *   bullet-list   6031:5995  pl-[32px] gap-[10px]
 *     bullet-row  6031:5996  gap-[8px], marker 5 x 13 + text (flex-1)
 *   card-footer   6031:6004  placeholder-space 1 x 20 + star-off 20 x 20
 *
 * The 2026-09 redesign changed four things here: padding 24 -> 16, the title
 * 20px -> 28px, the body 15px -> 16px, and the header chevron from a flat
 * 16 x 16 `chevron-right` to a 32 x 32 `Chevron` instance rotated -90deg.
 * The bullet list also gained a 32px left indent it did not have before.
 *
 * Height checks out against Figma exactly, which is why the stroke is an inset
 * ring and not a `border`: Figma draws it inside the 384px box, so a real
 * border would add 2px to every one of the ten cards and push the grid columns
 * 6-8px past their measured heights.
 *   c1-0: 16 + 32 (header) + 16 + 54 (2 bullets) + 16 + 20 + 16 = 170  ✓
 *   c3-0: 16 + 32 + 16 + 312 (8 bullets) + 16 + 20 + 16 = 428          ✓
 *
 * `body` is newline-separated because the Figma body is a bullet list, not a
 * paragraph. See ServiceCardData in src/lib/data/services.ts.
 */

/*
 * RESPONSIVE — the card is a grid item below 1280.
 *
 * At >= 1280 the dashboard's services-grid is three flex COLUMNS and each card
 * is `w-full` inside its column; `basis` is unset, so nothing here applies and
 * the designed 384px card is untouched.
 *
 * Below 1280 those column wrappers go `display: contents` (see
 * AllServicesSection) and the cards become direct children of the grid, so the
 * card itself now carries the column count: half width down to 768, full width
 * below it. That is what lets the ten cards flow and wrap evenly instead of
 * leaving an empty column, and `w-full` is inert while a flex-basis is set.
 */
const CARD =
  "box-border flex w-full flex-col items-start gap-[16px] rounded-[6px] bg-white p-[16px] shadow-[inset_0_0_0_1px_#d4d8da] max-xl:grow-0 max-xl:basis-[calc(50%-12px)] max-md:basis-full";

/**
 * The title is 28px/30px Bold #004b87, underlined, and flexes to fill the
 * header.
 *
 * Two independent quirks ride on it, and they do NOT coincide:
 *
 *   `headerTop`  — `service-card-c1-0` 6031:5991 and `service-card-c2-0`
 *                  6031:6068 are `items-start`; the other eight headers are
 *                  `items-center justify-between`. Worth 1px of title offset
 *                  in a 32px header, and reproduced because it is there.
 *   `titleWraps` — ONLY `service-card-c2-0` wraps. Its card-header is 60 tall
 *                  (two 30px lines); every other header in the file measures
 *                  32, so every other title is single-line and ellipsised.
 *
 * `service-card-c1-0` ("Accessible parking permit") is the awkward one: Figma
 * fits it on one line at exactly 320px, Chromium's Lato is a hair wider and
 * wraps it. Single-line wins, because the 170px card height it produces is
 * what Figma measured and what grid-column-1's 872px depends on. The cost is
 * an ellipsis Figma does not show. Logged in
 * design/resync-login-dashboard.md — do not "fix" it by letting it wrap.
 *
 * RESPONSIVE: below 1280 the title drops `whitespace-nowrap` and the ellipsis
 * and is allowed to wrap. The single-line rule above exists to protect a
 * measured 170px card height inside a 1200px THREE-COLUMN grid — and that grid
 * only exists at >= 1280 (below it the cards go two-up, then one-up). So 1280
 * is exactly where the reason for the rule stops applying, and it is where the
 * rule stops. It was 768 before the grid gained its two-column step, which
 * left every title ellipsised across the whole 768..1279 band for a card
 * height that nothing was measuring any more.
 *
 * A truncated service name on a layout where the card is not the designed
 * 384px is a usability failure, not a fidelity win. Nothing about the type
 * changes — only whether it wraps.
 */
const TITLE =
  "min-w-px flex-[1_0_0] overflow-hidden text-ellipsis text-[28px] font-bold leading-[30px] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font] [word-break:break-word] max-xl:overflow-visible max-xl:whitespace-normal";

function CardBody({
  title,
  body,
  headerTop = false,
  titleWraps = false,
  duplicateChevron = false,
}: {
  title: string;
  body: string;
  headerTop?: boolean;
  titleWraps?: boolean;
  duplicateChevron?: boolean;
}) {
  return (
    <>
      {/* card-header 6031:5991 */}
      <div
        className={`flex w-full shrink-0 rounded-[6px] max-xl:items-start ${
          headerTop ? "items-start" : "items-center justify-between"
        }`}
      >
        <p className={titleWraps ? TITLE : `${TITLE} whitespace-nowrap`}>
          {title}
        </p>

        {/* chevron-right 6031:6106 — Personal Health Record ONLY. That card
            carries BOTH this leftover 16px chevron and the 32px Chevron below
            it, so two arrows render side by side. Logged, not fixed. */}
        {duplicateChevron ? (
          <div className="relative size-[16px] shrink-0" data-node-id="6031:6106">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={ASSETS.iconChevronRight}
            />
          </div>
        ) : null}

        {/* Chevron 6217:35028 — 32 x 32, source glyph points down, rotated
            -90deg by the design to point right. */}
        <div className="flex size-[32px] shrink-0 items-center justify-center">
          <div className="flex-none -rotate-90">
            <div className="relative size-[32px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={ASSETS.iconChevron32}
              />
            </div>
          </div>
        </div>
      </div>

      {/* bullet-list 6031:5995 — pl-[32px] is new in the redesign. The indent
          halves below 480, where 32px of it is a tenth of the screen. */}
      <div className="flex w-full shrink-0 flex-col items-start gap-[10px] pl-[32px] max-xs:pl-[16px]">
        {body.split("\n").map((line) => (
          <div key={line} className="flex w-full shrink-0 items-start gap-[8px]">
            {/* marker 6031:5997 — 5 x 13, deliberately not square */}
            <div className="relative h-[13px] w-[5px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={ASSETS.bulletMarker}
              />
            </div>
            <p className="flex-[1_0_0] min-w-px text-[16px] font-normal leading-[22px] text-[#5f6368] [word-break:break-word]">
              {line}
            </p>
          </div>
        ))}
      </div>

      {/* card-footer 6031:6004 */}
      <div className="flex w-full shrink-0 items-end justify-between rounded-[6px]">
        {/* placeholder-space 6031:6005 — a real 1 x 20 spacer in the design,
            not padding. It holds the footer open on cards with no left action. */}
        <div className="h-[20px] w-px shrink-0" />
        <div className="relative size-[20px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            src={ASSETS.iconStarOff}
          />
        </div>
      </div>
    </>
  );
}

export function ServiceCard({
  title,
  body,
  href,
  headerTop,
  titleWraps,
  duplicateChevron,
}: {
  title: string;
  body: string;
  href?: string;
  headerTop?: boolean;
  titleWraps?: boolean;
  duplicateChevron?: boolean;
}) {
  const inner = (
    <CardBody
      title={title}
      body={body}
      headerTop={headerTop}
      titleWraps={titleWraps}
      duplicateChevron={duplicateChevron}
    />
  );

  /*
   * Without an href the card is a plain <div> — not a disabled link, not a
   * button with a no-op handler. Nothing to click means nothing can strand the
   * presenter on an unbuilt screen. Only "Driver and Vehicle" passes an href.
   */
  if (!href) {
    return (
      <div
        className={`${CARD} cursor-default select-none`}
        data-demo-inert="true"
        aria-disabled="true"
      >
        {inner}
      </div>
    );
  }

  return (
    <Link className={CARD} href={href}>
      {inner}
    </Link>
  );
}
