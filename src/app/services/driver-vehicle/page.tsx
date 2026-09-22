"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { LinkedItemCard } from "@/components/service/LinkedItemCard";
import { ASSETS } from "@/lib/assets";
import { useDemoState } from "@/lib/demo-state";
import {
  ACTIONS_SECTION,
  BREADCRUMB,
  CONTACT_CARD,
  DATA_PRIVACY_CARD,
  FAVOURITE_CARD,
  LINKED_ITEMS,
  LINKED_ITEMS_TITLE,
  SERVICE_HEADER,
  SERVICE_HEADER_VERIFIED,
  SHARED_DATA_SCOPES,
  VERIFICATION_CARD,
} from "@/lib/data/driver-vehicle";

/*
 * driver-vehicle-service-page — Figma 6031:6244, 1440 x 1038.215.
 *
 * Geometry, verbatim from get_design_context on 6031:6247 and 6031:6265:
 *   top-nav actions    1440 x 69      at y=0
 *   main-container     1440 x 829     at y=69
 *     content-left      860 x 442     at x=80,  y=48   gap-[24px]
 *       breadcrumb-row  120 x 17      at y=0
 *       title-badge-row 860 x 48      at y=41
 *       service-subtitle 860 x 24     at y=113
 *       verification-card 860 x 281   at y=161
 *     sidebar-right     380 x 701     at x=980, y=48   gap-[20px]
 *       favourite-card  380 x 64      at y=0
 *       data-privacy-card 380 x 504   at y=84
 *       contact-card    380 x 93      at y=608
 *   footer verified    1440 x 140.215 at y=898
 *
 * main-container padding falls out of those offsets: pt-[48px], px-[80px],
 * pb-[80px] (829 - 48 - 701 = 80), with a 40px column gap
 * (980 - (80 + 860) = 40). 80 + 860 + 40 + 380 + 80 = 1440.
 *
 * ------------------------------------------------------------------------
 * RESPONSIVE (2026-09-21). Both states share one scheme, because both are the
 * same 860 + 380 pair inside the same main-container.
 *
 *   = 1440      untouched. 80 + 860 + 40 + 380 + 80 is exactly 1440, so the
 *               columns fit with zero free space and nothing below can fire.
 *   1025..1439  still two columns. The 80px gutter moves to `.gnl-gutter`, and
 *               content-left gives up `shrink-0` so it — not the sidebar —
 *               absorbs the shortfall (700px at a 1280 viewport). The sidebar
 *               keeps its designed 380 because its cards are full of
 *               `whitespace-nowrap` labels sized for exactly that width.
 *               The pinned main heights are released here too: a narrower
 *               content-left wraps more copy and grows past 829 / 1610.
 *    <= 1024    one column, main first, sidebar under it. The breakpoint is
 *               written `max-[1024px]` rather than Tailwind's `max-lg`, which
 *               is EXCLUSIVE (< 1024): `.gnl-gutter`'s own ladder steps at
 *               `max-width: 1024px` inclusive, and letting the two disagree
 *               made 1024 itself the worst width on the page — a 476px
 *               content-left holding a two-column Actions card, beside a
 *               sidebar that runs out after 800px and leaves the rest of the
 *               column empty.
 *    < 768      `.gnl-gutter` is down to 24px and the cards run edge to edge.
 *
 * The title-badge-row is allowed to wrap below 1440 so the bell can drop to a
 * second line rather than push the row wider than its column.
 * ------------------------------------------------------------------------
 *
 * "use client" is required only because the page reads useDemoState().
 */

/**
 * main-container, shared by both states.
 *
 * The height is passed per state because the two frames differ (829 / 1610);
 * everything else — gutter, stacking, gap — is identical, so it lives here
 * once instead of being kept in sync in two places.
 */
const MAIN =
  "gnl-gutter [--gnl-gutter:80px] box-border flex w-full items-start gap-[40px] pt-[48px] pb-[80px] max-[1439px]:h-auto max-[1024px]:flex-col max-[1024px]:gap-[32px] max-md:pt-[32px] max-md:pb-[48px]";

/**
 * content-left. `shrink-0` at the design width, shrinkable below it, full
 * width once the columns stack.
 */
const CONTENT_LEFT =
  "flex w-[860px] shrink-0 flex-col items-start gap-[24px] max-[1439px]:min-w-px max-[1439px]:shrink max-[1024px]:w-full";

/** title-badge-row — wraps below the design width so the bell can fall to row 2. */
const TITLE_ROW =
  "flex w-full shrink-0 items-center gap-[16px] max-[1439px]:flex-wrap";

/** Every inline link in this frame: #004b87, Bold, underlined from-font. */
const LINK =
  "text-[14px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]";

/**
 * All four cards on this page share one chrome. The border is #d4d8da, NOT the
 * #e0e4e6 token.
 *
 * The stroke is painted with an inset box-shadow rather than `border`, as
 * TopNav and WizardCard do. Figma draws it INSIDE the frame, so a CSS border
 * made every card 2px taller than designed (measured: 283/66/506/95 against
 * 281/64/504/93).
 */
const CARD = "w-full rounded-[6px] bg-white shadow-[inset_0_0_0_1px_#d4d8da]";

/**
 * The horizontal rules inside data-privacy-card. Figma draws these as vectors,
 * not CSS borders: a zero-height box with the stroke pulled 1px above it. The
 * structure is reproduced so the rule contributes 0px to the card's height —
 * a `border-t` here would make the card 506px instead of 504px.
 */
function DividerLine({ nodeId }: { nodeId: string }) {
  return (
    <div className="relative h-0 w-full shrink-0" data-node-id={nodeId}>
      <div className="absolute inset-[-1px_0_0_0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="block size-full max-w-none" src={ASSETS.dividerLine} />
      </div>
    </div>
  );
}

function ContentLeft() {
  return (
    <div className={CONTENT_LEFT} data-node-id="6031:6247">
      {/* breadcrumb-row 6031:6248 */}
      <div className="flex shrink-0 items-center" data-node-id="6031:6248">
        <Link className={`${LINK} whitespace-nowrap`} href={BREADCRUMB.href} data-node-id={BREADCRUMB.nodeId}>
          {BREADCRUMB.label}
        </Link>
      </div>

      {/* title-badge-row 6031:6250 */}
      <div className={TITLE_ROW} data-node-id="6031:6250">
        <p
          className="shrink-0 whitespace-nowrap text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)]"
          data-node-id="6031:6251"
        >
          {SERVICE_HEADER.title}
        </p>

        {/* badge-confirmation 6031:6252 — pill on #e8706f, a colour with no token. */}
        <div
          className="flex shrink-0 items-center gap-[6px] rounded-[100px] bg-[#e8706f] px-[12px] py-[6px]"
          data-node-id="6031:6252"
        >
          <div className="relative size-[12px] shrink-0" data-node-id="6031:6253">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconLock} />
          </div>
          <p
            className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[1.5] text-[color:var(--gnl-surface,#ffffff)]"
            data-node-id="6031:6255"
          >
            {SERVICE_HEADER.badgeLabel}
          </p>
        </div>

        {/* notification-bell-container 6031:6256 — inert, there is no
            notifications screen in the demo. */}
        <div
          className="flex size-[32px] shrink-0 cursor-default flex-col items-center justify-center rounded-[100px] bg-[#eaecef] select-none"
          data-node-id="6031:6256"
          data-demo-inert="true"
          aria-disabled="true"
        >
          <div className="relative size-[16px] shrink-0" data-node-id="6031:6257">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconBellAlert} />
          </div>
        </div>
      </div>

      {/* service-subtitle 6031:6259 — #212326, the heading colour used as body copy. */}
      <p
        className="w-full shrink-0 text-[16px] font-normal leading-[1.5] text-[#212326] [word-break:break-word]"
        data-node-id="6031:6259"
      >
        {SERVICE_HEADER.subtitle}
      </p>

      {/* verification-card 6031:6260 — p-[48px], and a 2px/4px shadow, not the
          4px/12px card token. The 48px inset is a third of a 320px screen, so
          it steps to 32 below 768 and 24 below 480. */}
      <div
        className={`${CARD} box-border flex shrink-0 flex-col items-center justify-center gap-[32px] p-[48px] [filter:drop-shadow(0px_2px_4px_rgba(0,0,0,0.03))] max-md:gap-[24px] max-md:p-[32px] max-xs:p-[24px]`}
        data-node-id="6031:6260"
      >
        <p
          className="w-full shrink-0 text-center text-[24px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
          data-node-id="6031:6261"
        >
          {VERIFICATION_CARD.title}
        </p>
        <p
          className="w-full shrink-0 text-center text-[15px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]"
          data-node-id="6031:6262"
        >
          {VERIFICATION_CARD.body}
        </p>

        {/*
         * OnboardButton 6031:6263. NOT <BtnPrimary>: this button is px-[28px]
         * where the wizard's ContinueButton is px-[24px]. Reproduced as
         * designed rather than folded into the shared primitive.
         */}
        <Link
          className="box-border inline-flex shrink-0 items-center justify-center overflow-clip rounded-[4px] bg-[#243746] px-[28px] py-[10px] text-[14px] font-bold leading-[normal] text-white"
          href={VERIFICATION_CARD.ctaHref}
          data-node-id="6031:6263"
        >
          {VERIFICATION_CARD.ctaLabel}
        </Link>
      </div>
    </div>
  );
}

/**
 * sidebar-right. Keeps its designed 380px for as long as the two columns sit
 * side by side — its cards are sized around that width and full of
 * `whitespace-nowrap` labels — and goes full width once they stack at 1024.
 */
function SidebarRight() {
  return (
    <div
      className="flex w-[380px] shrink-0 flex-col items-start gap-[20px] max-[1024px]:w-full"
      data-node-id="6031:6265"
    >
      {/* favourite-card 6031:6266 — reads as a star toggle, but the design has
          no "favourited" state and the dashboard has no favourites list, so
          there is nothing to toggle to. Inert. */}
      <div
        className={`${CARD} box-border flex shrink-0 cursor-default items-center justify-between p-[20px] select-none`}
        data-node-id="6031:6266"
        data-demo-inert="true"
        aria-disabled="true"
      >
        <p
          className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[1.5] text-[#5f6368]"
          data-node-id="6031:6267"
        >
          {FAVOURITE_CARD.label}
        </p>
        <div className="relative size-[20px] shrink-0" data-node-id="6031:6268">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconStar} />
        </div>
      </div>

      {/* data-privacy-card 6031:6270 */}
      <div
        className={`${CARD} box-border flex shrink-0 flex-col items-start gap-[16px] p-[24px]`}
        data-node-id="6031:6270"
      >
        <p
          className="w-full shrink-0 text-[18px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
          data-node-id="6031:6271"
        >
          {DATA_PRIVACY_CARD.title}
        </p>
        {/* 14px on a 22px line-height — an off-ratio leading unique to this block. */}
        <p
          className="w-full shrink-0 text-[14px] font-normal leading-[22px] text-[#5f6368] [word-break:break-word]"
          data-node-id="6031:6272"
        >
          {DATA_PRIVACY_CARD.body}
        </p>

        <DividerLine nodeId="6031:6273" />

        <p
          className="w-full shrink-0 text-[14px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
          data-node-id="6031:6274"
        >
          {DATA_PRIVACY_CARD.scopesTitle}
        </p>

        {/* shared-data-list 6098:34115 */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[12px]" data-node-id="6098:34115">
          {SHARED_DATA_SCOPES.map((scope) => (
            <div
              key={scope.label}
              className="flex shrink-0 items-center gap-[10px]"
              data-node-id={scope.nodeId}
            >
              <div className="relative size-[16px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={scope.icon} />
              </div>
              <p className="shrink-0 whitespace-nowrap text-[14px] font-normal leading-[1.5] text-[#5f6368]">
                {scope.label}
              </p>
            </div>
          ))}
        </div>

        <DividerLine nodeId="6031:6292" />

        <a
          className={`${LINK} block shrink-0 whitespace-nowrap`}
          href={DATA_PRIVACY_CARD.termsHref}
          target="_blank"
          rel="noreferrer"
          data-node-id="6031:6293"
        >
          {DATA_PRIVACY_CARD.termsLabel}
        </a>
      </div>

      {/* contact-card 6031:6294 */}
      <div
        className={`${CARD} box-border flex shrink-0 flex-col items-start gap-[12px] p-[20px]`}
        data-node-id="6031:6294"
      >
        <p
          className="w-full shrink-0 text-[16px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
          data-node-id="6031:6295"
        >
          {CONTACT_CARD.title}
        </p>
        <div className="flex shrink-0 items-center gap-[8px]" data-node-id="6031:6296">
          <div className="relative size-[16px] shrink-0" data-node-id="6031:6297">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconPhone} />
          </div>
          <a
            className={`${LINK} block shrink-0 whitespace-nowrap`}
            href={CONTACT_CARD.phoneHref}
            data-node-id="6031:6299"
          >
            {CONTACT_CARD.phoneLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= *
 * VERIFIED state — Figma 6065:23367, 1440 x 1819.215.
 *
 * Geometry, verbatim from get_metadata / get_design_context on 6065:23369:
 *   top-nav actions    1440 x 69      at y=0
 *   main-container     1440 x 1610    at y=69
 *     content-left      860 x 1482    at x=80,  y=48   gap-[24px]
 *       breadcrumb-row  120 x 17      at y=0
 *       title-badge-row 860 x 48      at y=41
 *       service-subtitle 860 x 24     at y=113
 *       left-column     860 x 1321    at y=161          gap-[40px]
 *         Frame 11      860 x 387     (wraps actions-section-card 6076:24331)
 *         linked-items-section 860 x 894 at y=427       gap-[20px]
 *     sidebar-right     380 x 701     at x=980, y=48   gap-[20px]  (identical
 *                                     to the unverified frame — same three
 *                                     cards, same sizes, so SidebarRight is
 *                                     reused rather than duplicated)
 *   footer verified    1440 x 140.215 at y=1679
 *
 * Padding falls out of those offsets exactly as on the unverified frame:
 * pt-[48px] px-[80px] pb-[80px] (1610 - 48 - 1482 = 80) with a 40px gap.
 *
 * !! The plan (Task 19) described this frame as 1440 x 1671.215 with a
 * 380 x 227 `item-card-licence` (6095:32409) in the sidebar. That node no
 * longer exists: the frame has been redesigned since the plan was written.
 * Built against the live file. See design/token-exceptions-phase4.md.
 * ========================================================================= */

/** Action links in the Actions card: 15px, Figma "Lato:SemiBold" (no 600 → 700). */
const ACTION_LINK =
  "block w-full text-[15px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]";

/**
 * actions-section-card — Figma 6076:24331, 860 x 387.
 *
 * The link hrefs in Figma all point at `https://example.com/...`, which is
 * itself a placeholder. Rendering them as live anchors would walk the
 * presenter off the demo mid-story, so they render as styled, non-navigating
 * spans — the same reasoning as ServiceCard's no-href branch. Logged as a
 * deliberate deviation in design/token-exceptions-phase4.md.
 */
function ActionsSectionCard() {
  return (
    <div
      className={`${CARD} box-border flex flex-col items-start gap-[24px] p-[32px] max-xs:p-[20px]`}
      data-node-id="6076:24331"
    >
      {/* Figma: Lato:ExtraBold (800). Lato has no 800 — rendered 700. */}
      <p
        className="shrink-0 whitespace-nowrap text-[24px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
        data-node-id="6076:24332"
      >
        {ACTIONS_SECTION.title}
      </p>

      {/* actions-row 6076:24333 — two equal flex-1 columns, 382 each, 32px
          apart. `.gnl-stack-md` stacks them below 768: these are full
          sentences ("Notify Motor Registration when you no longer own a
          vehicle"), and two of them side by side on a phone is one word per
          line. Stacked they read as two labelled lists. */}
      <div className="gnl-stack-md flex w-full shrink-0 items-start gap-[32px] max-md:gap-[24px]" data-node-id="6076:24333">
        {ACTIONS_SECTION.columns.map((column) => (
          <div
            key={column.heading}
            className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[16px]"
            data-node-id={column.nodeId}
          >
            <p className="shrink-0 whitespace-nowrap text-[18px] font-bold leading-[1.5] text-[#5f6368]">
              {column.heading}
            </p>
            <div className="flex w-full shrink-0 flex-col items-start gap-[12px]">
              {column.links.map((link) => (
                <span
                  key={link.label}
                  className={`${ACTION_LINK} cursor-default select-none`}
                  data-node-id={link.nodeId}
                  data-demo-inert="true"
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/*
       * other-actions-box 6076:24348. The 1px top rule is an inset box-shadow,
       * not `border-t`: Figma strokes inside the frame, so a CSS border would
       * push this box to 71px against the 70px in the design.
       */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[12px] pt-[16px] shadow-[inset_0_1px_0_0_#d4d8da]"
        data-node-id="6076:24348"
      >
        <p
          className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
          data-node-id="6076:24349"
        >
          {ACTIONS_SECTION.otherTitle}
        </p>
        <div className="flex shrink-0 items-center gap-[6px]" data-node-id="6076:24350">
          <span
            className={`${ACTION_LINK} w-auto cursor-default whitespace-nowrap select-none`}
            data-node-id="6076:24351"
            data-demo-inert="true"
          >
            {ACTIONS_SECTION.otherLinkLabel}
          </span>
          <div className="relative size-[14px] shrink-0" data-node-id="6076:24352">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={ASSETS.iconExternalLink}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function VerifiedContentLeft() {
  return (
    <div className={CONTENT_LEFT} data-node-id="6065:23370">
      {/* breadcrumb-row 6065:23371 */}
      <div className="flex shrink-0 items-center" data-node-id="6065:23371">
        <Link className={`${LINK} whitespace-nowrap`} href={BREADCRUMB.href} data-node-id="6065:23372">
          {BREADCRUMB.label}
        </Link>
      </div>

      {/* title-badge-row 6065:23373 */}
      <div className={TITLE_ROW} data-node-id="6065:23373">
        <p
          className="shrink-0 whitespace-nowrap text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)]"
          data-node-id="6065:23374"
        >
          {SERVICE_HEADER.title}
        </p>

        {/* badge-confirmation 6065:23375 — green #45ab8e (Figma variable brand-2-500). */}
        <div
          className="flex shrink-0 items-center gap-[6px] rounded-[100px] bg-[#45ab8e] px-[12px] py-[6px]"
          data-node-id={SERVICE_HEADER_VERIFIED.nodeId}
        >
          {/* Success_check 6065:24184 — a 12px box whose leaf is pulled 1.13% left. */}
          <div className="relative size-[12px] shrink-0" data-node-id="6065:24184">
            <div className="absolute inset-[0_0_0_-1.13%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="block size-full max-w-none" src={ASSETS.iconSuccessCheck} />
            </div>
          </div>
          <p
            className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[1.5] text-white"
            data-node-id="6065:23378"
          >
            {SERVICE_HEADER_VERIFIED.badgeLabel}
          </p>
        </div>

        {/* notification-bell-container 6065:23379 — inert, as on the
            unverified frame. */}
        <div
          className="flex size-[32px] shrink-0 cursor-default flex-col items-center justify-center rounded-[100px] bg-[#eaecef] select-none"
          data-node-id="6065:23379"
          data-demo-inert="true"
          aria-disabled="true"
        >
          <div className="relative size-[16px] shrink-0" data-node-id="6065:23380">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconBellAlert} />
          </div>
        </div>
      </div>

      {/* service-subtitle 6065:23382 */}
      <p
        className="w-full shrink-0 text-[16px] font-normal leading-[1.5] text-[#212326] [word-break:break-word]"
        data-node-id="6065:23382"
      >
        {SERVICE_HEADER.subtitle}
      </p>

      {/* left-column 6076:24330 */}
      <div className="flex w-full shrink-0 flex-col items-start gap-[40px]" data-node-id="6076:24330">
        {/* Frame 11 6076:31314 — a redundant 860 x 387 wrapper in the design,
            reproduced so the node tree matches the file. */}
        <div className="w-full shrink-0" data-node-id="6076:31314">
          <ActionsSectionCard />
        </div>

        {/* linked-items-section 6076:24354 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[20px]"
          data-node-id="6076:24354"
        >
          {/*
           * Figma: Lato:ExtraBold (800) → 700.
           * Figma says `line-height: normal` and measures the line box at 26px.
           * The browser's own `normal` for Lato at 22px rounds to 27, which
           * pushed the section — and the whole page — 1px tall. Pinned to the
           * measured 26. Logged in design/token-exceptions-phase4.md.
           */}
          <p
            className="shrink-0 whitespace-nowrap text-[22px] font-bold leading-[26px] text-[#004b87] [word-break:break-word]"
            data-node-id="6076:24355"
          >
            {LINKED_ITEMS_TITLE}
          </p>
          {LINKED_ITEMS.map((item) => (
            <LinkedItemCard key={item.nodeId} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

function UnverifiedPage({ verified }: { verified: boolean }) {
  return (
    <div className="gnl-desktop-shell" data-verified={verified ? "1" : "0"}>
      <TopNav />

      {/* main-container 6031:6246 — see the RESPONSIVE block at the top of the
          file for what MAIN does below 1440. */}
      <main className={`${MAIN} h-[829px]`} data-node-id="6031:6246">
        <ContentLeft />
        <SidebarRight />
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}

function VerifiedPage() {
  return (
    <div className="gnl-desktop-shell" data-verified="1">
      <TopNav />

      {/* main-container 6065:23369 */}
      <main className={`${MAIN} h-[1610px]`} data-node-id="6065:23369">
        <VerifiedContentLeft />
        {/* sidebar-right 6065:23388 — byte-identical to the unverified frame. */}
        <SidebarRight />
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}

function ServicePageBody() {
  const { verified } = useDemoState();
  /*
   * ?verified=1 lets the presenter deep-link straight to the end state, and is
   * what the confirmation screen's primary button navigates to. Under static
   * export useSearchParams() forces client-side rendering up to the nearest
   * Suspense boundary, which is why the default export wraps this.
   */
  const searchParams = useSearchParams();
  const showVerified = verified || searchParams.get("verified") === "1";

  return showVerified ? <VerifiedPage /> : <UnverifiedPage verified={verified} />;
}

export default function DriverVehicleServicePage() {
  /*
   * The fallback is the unverified screen, not a spinner: that is the correct
   * first paint for /services/driver-vehicle/ with no query string, so the
   * prerendered HTML already matches what the visitor ends up seeing.
   */
  return (
    <Suspense fallback={<UnverifiedPage verified={false} />}>
      <ServicePageBody />
    </Suspense>
  );
}
