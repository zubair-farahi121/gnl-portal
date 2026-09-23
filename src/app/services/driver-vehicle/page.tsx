"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { LinkedItemCard } from "@/components/service/LinkedItemCard";
import { ASSETS } from "@/lib/assets";
import { isTrusted, useDemoState } from "@/lib/demo-state";
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
 * VERIFIED state — Figma 6257:72314 `driver-vehicle-service-page_verified`,
 * 1440 x 1792.2152099609375.
 *
 * RE-SYNCED 2026-09-22. The frame this state used to be built from,
 * 6065:23367, has been DELETED from the file — `get_metadata` returns not
 * found — and 6257:72314 (Row B, x=27206.39) replaces it. A REBUILD, not a
 * resize.
 *
 * Geometry, verbatim from get_metadata on 6257:72314:
 *   top-nav actions    1440 x 69      at y=0            (6257:72315)
 *   main-container     1440 x 1583    at y=69           (6257:72316)
 *     content-left      860 x 1455    at x=80,  y=48   gap-[24px]
 *       breadcrumb-row  120 x 17      at y=0
 *       title-badge-row 860 x 48      at y=41
 *         Driver and Vehicle 260 x 48 at x=0
 *         badge-confirmation  83 x 30 at x=276   green, `Trusted`
 *         notification-bell   32 x 32 at x=375
 *       service-subtitle 860 x 24     at y=113
 *       left-column     860 x 1294    at y=161          gap-[40px]
 *         Frame 11      860 x 387     at y=0    (wraps 6257:72331)
 *         linked-items-section 860 x 867 at y=427       gap-[20px]
 *           "Your linked items"  171 x 26  at y=0
 *           item-card-licence    860 x 129 at y=46   HIDDEN — not rendered
 *           item-card-licence    860 x 156 at y=46
 *           item-card-address    860 x 112 at y=222
 *           item-card-chev       860 x 307 at y=354
 *           item-card-trailer    860 x 186 at y=681
 *     sidebar-right     380 x 701     at x=980, y=48   gap-[20px]
 *                                     (6257:72427 — same three cards at the
 *                                     same sizes as the unverified frame's
 *                                     6031:6265, so SidebarRight is still
 *                                     shared rather than duplicated)
 *   footer verified    1440 x 140.215 at y=1652         (6257:72462)
 *
 * 161 + 1294 = 1455, and 48 + 1455 + 80 = 1583, and 69 + 1583 + 140.215 =
 * 1792.215 — the frame height, exactly. Padding falls out of those offsets as
 * on the unverified frame: pt-[48px] px-[80px] pb-[80px], 40px column gap.
 *
 * WHAT THE REBUILD CHANGED — the -27px, itemised:
 *   -149  `item-card-licence` 6257:72356, the 129px digital-wallet promo
 *         card, is hidden="true" and is NOT rendered (129 + its 20px gap).
 *   +122  `VRC VC upsell` 6257:73252, a new 102px panel INSIDE the CHEV card
 *         (102 + its 20px gap). See LinkedItemCard.
 *   +-0   `VC - Add to your wallet` 6257:72404, the "Add to your digital
 *         wallet" button + green `New` pill on the CHEV button row, is
 *         hidden="true" and is NOT rendered — it sat inside the 40px row, so
 *         dropping it costs no height.
 * Hidden layers are not part of the design. Same rule every CID `Check box`
 * and the document screen`s `btn-back` already follow.
 *
 * WHAT DID NOT CHANGE, despite the frame map listing them as additions: the
 * green `Trusted` badge and the sidebar `Favourite Service` card were already
 * here (from 6065:23375 / 6031:6266), and the CHEV IMT already read "Expires
 * on January 14, 2036". Only their node ids moved. The still-expired
 * registration is the TRAILER`s, "Expired on March 31, 2022".
 *
 * !! The plan (Task 19) described this frame as 1440 x 1671.215 with a
 * 380 x 227 `item-card-licence` (6095:32409) in the sidebar. That node has not
 * existed for two rebuilds. Built against the live file. See
 * design/token-exceptions-phase4.md and design/verification-frame-map.md.
 * ========================================================================= */

/** Action links in the Actions card: 15px, Figma "Lato:SemiBold" (no 600 → 700). */
const ACTION_LINK =
  "block w-full text-[15px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]";

/**
 * actions-section-card — Figma 6257:72331, 860 x 387.
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
      data-node-id="6257:72331"
    >
      {/* Figma: Lato:ExtraBold (800). Lato has no 800 — rendered 700. */}
      <p
        className="shrink-0 whitespace-nowrap text-[24px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
        data-node-id="6257:72332"
      >
        {ACTIONS_SECTION.title}
      </p>

      {/* actions-row 6257:72333 — two equal flex-1 columns, 382 each, 32px
          apart. `.gnl-stack-md` stacks them below 768: these are full
          sentences ("Notify Motor Registration when you no longer own a
          vehicle"), and two of them side by side on a phone is one word per
          line. Stacked they read as two labelled lists. */}
      <div className="gnl-stack-md flex w-full shrink-0 items-start gap-[32px] max-md:gap-[24px]" data-node-id="6257:72333">
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
       * other-actions-box 6257:72348. The 1px top rule is an inset box-shadow,
       * not `border-t`: Figma strokes inside the frame, so a CSS border would
       * push this box to 71px against the 70px in the design.
       */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[12px] pt-[16px] shadow-[inset_0_1px_0_0_#d4d8da]"
        data-node-id="6257:72348"
      >
        <p
          className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
          data-node-id="6257:72349"
        >
          {ACTIONS_SECTION.otherTitle}
        </p>
        <div className="flex shrink-0 items-center gap-[6px]" data-node-id="6257:72350">
          <span
            className={`${ACTION_LINK} w-auto cursor-default whitespace-nowrap select-none`}
            data-node-id="6257:72351"
            data-demo-inert="true"
          >
            {ACTIONS_SECTION.otherLinkLabel}
          </span>
          <div className="relative size-[14px] shrink-0" data-node-id="6257:72352">
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
    <div className={CONTENT_LEFT} data-node-id="6257:72317">
      {/* breadcrumb-row 6257:72318 */}
      <div className="flex shrink-0 items-center" data-node-id="6257:72318">
        <Link className={`${LINK} whitespace-nowrap`} href={BREADCRUMB.href} data-node-id="6257:72319">
          {BREADCRUMB.label}
        </Link>
      </div>

      {/* title-badge-row 6257:72320 */}
      <div className={TITLE_ROW} data-node-id="6257:72320">
        <p
          className="shrink-0 whitespace-nowrap text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)]"
          data-node-id="6257:72321"
        >
          {SERVICE_HEADER.title}
        </p>

        {/* badge-confirmation 6065:23375 — green #45ab8e (Figma variable brand-2-500). */}
        <div
          className="flex shrink-0 items-center gap-[6px] rounded-[100px] bg-[#45ab8e] px-[12px] py-[6px]"
          data-node-id={SERVICE_HEADER_VERIFIED.nodeId}
        >
          {/* Success_check 6257:72323 — a 12px box whose leaf is pulled 1.13% left. */}
          <div className="relative size-[12px] shrink-0" data-node-id="6257:72323">
            <div className="absolute inset-[0_0_0_-1.13%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="block size-full max-w-none" src={ASSETS.iconSuccessCheck} />
            </div>
          </div>
          <p
            className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[1.5] text-white"
            data-node-id="6257:72324"
          >
            {SERVICE_HEADER_VERIFIED.badgeLabel}
          </p>
        </div>

        {/* notification-bell-container 6257:72325 — inert, as on the
            unverified frame. */}
        <div
          className="flex size-[32px] shrink-0 cursor-default flex-col items-center justify-center rounded-[100px] bg-[#eaecef] select-none"
          data-node-id="6257:72325"
          data-demo-inert="true"
          aria-disabled="true"
        >
          <div className="relative size-[16px] shrink-0" data-node-id="6257:72326">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconBellAlert} />
          </div>
        </div>
      </div>

      {/* service-subtitle 6257:72328 */}
      <p
        className="w-full shrink-0 text-[16px] font-normal leading-[1.5] text-[#212326] [word-break:break-word]"
        data-node-id="6257:72328"
      >
        {SERVICE_HEADER.subtitle}
      </p>

      {/* left-column 6257:72329 */}
      <div className="flex w-full shrink-0 flex-col items-start gap-[40px]" data-node-id="6257:72329">
        {/* Frame 11 6257:72330 — a redundant 860 x 387 wrapper in the design,
            reproduced so the node tree matches the file. */}
        <div className="w-full shrink-0" data-node-id="6257:72330">
          <ActionsSectionCard />
        </div>

        {/* linked-items-section 6257:72354 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[20px]"
          data-node-id="6257:72354"
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
            data-node-id="6257:72355"
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

      {/* main-container 6257:72316 */}
      <main className={`${MAIN} h-[1583px]`} data-node-id="6257:72316">
        <VerifiedContentLeft />
        {/* sidebar-right 6257:72427 — byte-identical to the unverified frame. */}
        <SidebarRight />
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}

function ServicePageBody() {
  /*
   * "Confirmation required" until `onboarded`, then "Trusted" — BUILD_BRIEF.md
   * §12.2, last line. Read from the persisted `gnl-demo:v1` store, which is
   * what DEMO_AUDIT.md X-04 / NL-25(a) asked for: the old source of truth was a
   * `sessionStorage` boolean, so Trusted did not survive a browser restart.
   *
   * HYDRATION: `useDemoState()` returns the empty store until its effect has
   * run, i.e. the first client render matches the server HTML exactly and the
   * Trusted state appears a frame later. That is why `ready` exists and why
   * `isTrusted` on an empty store must answer false. See src/lib/demo-state.tsx
   * — layout.tsx has no `suppressHydrationWarning` and a mismatch here would
   * surface as a real error.
   */
  const { service } = useDemoState();
  const verified = isTrusted(service("driver-vehicle"));
  /*
   * ?verified=1 is KEPT as a presenter deep-link to the end state, and it is
   * what the confirmation screen's primary button still navigates to — it is
   * also the route `design/frames.json` pins the `service-verified` baseline
   * to. It is no longer the STORE: the store now carries the real transition,
   * and the query param is a shortcut on top of it. Under static export
   * useSearchParams() forces client-side rendering up to the nearest Suspense
   * boundary, which is why the default export wraps this.
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
