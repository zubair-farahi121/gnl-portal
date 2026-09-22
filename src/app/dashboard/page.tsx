import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ServiceCard } from "@/components/service/ServiceCard";
import { ASSETS } from "@/lib/assets";
import { DEMO_USER, SERVICE_COLUMNS } from "@/lib/data/services";

/*
 * mygovnl-services-dashboard — Figma 6206:23559, 1440 x 1889.275.
 *
 * RESYNCED 2026-09: the designer deleted the old 6031:5974 frame and rebuilt
 * this screen as a main component. The child node ids survived; the type scale
 * and the search row did not. See design/resync-login-dashboard.md.
 *
 * Geometry, verbatim from get_design_context on 6031:5976 / 5983 / 5986 / 6228:
 *   top-nav actions       1440 x 69       at y=0     → <TopNav />
 *   welcome-section       1440 x 228      at y=69      (was 217)
 *   favourites-section    1440 x 136      at y=297     (was 130)
 *   all-services-section  1440 x 1142     at y=433     (was 1134)
 *   footer-section        1440 x 314.275  at y=1575    (unchanged)
 *   69 + 228 + 136 + 1142 + 314.275 = 1889.275
 *
 * welcome-section and favourites-section are pinned to their Figma heights —
 * both derivations close exactly (see each component) so a pin costs nothing
 * and stops a font-metric wobble from shifting all 1600px below it.
 * all-services-section is NOT pinned: its height falls out of the card content
 * exactly as Figma's auto-layout derives it, and pinning would clip.
 *
 * RESPONSIVE (2026-09-21, all below the 1440 design width, all CSS): the three
 * 120px section gutters became `.gnl-gutter [--gnl-gutter:120px]`, the search
 * row's 340px field became the flexible half of its row below 768, the
 * all-services grid goes 3 -> 2 -> 1 columns, and the two pinned section heights became
 * minimums (favourites from 1439 down, welcome from 768 down) because both
 * were designed around copy that only stays on one line at 1440. Detail is in
 * each section's own comment.
 *
 * Nothing here is interactive except the one navigable service card, so no
 * "use client". The search field is presentational (see SearchField).
 */

/**
 * welcome-section 6031:5976.
 *
 * Height: 48 (pt) + 60 (40px title) + 24 (gap) + 56 (search-row) + 40 (pb) = 228.
 * The title went 32px -> 40px in the rebuild, which is the whole of the +11px.
 * The bottom divider is an inset ring, not `border-b`: Figma draws the stroke
 * inside the 228px frame, and a real border would add a 229th pixel.
 *
 * RESPONSIVE: the 120px gutter moves to `.gnl-gutter [--gnl-gutter:120px]`
 * (120 verbatim above 1280, then 96 / 48 / 24 / 16). Below 768 the pinned
 * 228px becomes a minimum, because the search row stops being a single 56px
 * line there, and the 40px greeting steps down to 28 under 480 — at 288px of
 * usable width a 40px heading is most of the screen.
 */
function WelcomeSection() {
  return (
    <section
      className="gnl-gutter [--gnl-gutter:120px] flex min-h-[228px] w-full flex-col items-start gap-[24px] bg-white pt-[48px] pb-[40px] shadow-[inset_0_-1px_0_0_#d4d8da] max-md:pt-[32px] max-md:pb-[32px]"
      data-node-id="6031:5976"
    >
      <p
        className="w-full text-[40px] font-bold leading-[1.5] text-[#212326] [word-break:break-word] max-xs:text-[28px]"
        data-node-id="6031:5977"
      >
        {`Welcome ${DEMO_USER.name}!`}
      </p>
      {/* search-row 6031:5978 — 16px gap between the field and the button. */}
      <div
        className="flex w-full shrink-0 items-center gap-[16px]"
        data-node-id="6031:5978"
      >
        <SearchField />
        <SearchButton />
      </div>
    </section>
  );
}

/**
 * input-field 6031:5979 — 340 x 56, EMPTY.
 *
 * The rebuild hid the "Search services..." text layer (`hidden="true"` in
 * Figma) and moved the button out of the field, so this is now a bare box: no
 * placeholder, no children. Still no <input> — a real one would pull browser
 * placeholder metrics and a focus ring into the pixel diff, and the design has
 * no text to show anyway.
 *
 * The 1px stroke is an inset ring rather than a border, so the box is 56 tall
 * and not 58 and the 228px section closes.
 *
 * RESPONSIVE: 340 + 16 + the 80px button is 436, which does not fit a phone.
 * Below 768 the field gives up `shrink-0` and becomes the flexible half of the
 * row, so the button keeps its designed size and the field absorbs the
 * difference (191px at a 320px viewport). Nothing moves at or above 768, where
 * the row has room for the designed 340.
 */
function SearchField() {
  return (
    <div
      className="flex h-[56px] w-[340px] shrink-0 items-start rounded-[6px] bg-white px-[16px] py-[12px] shadow-[inset_0_0_0_1px_#d4d8da] max-md:w-full max-md:min-w-px max-md:shrink"
      data-node-id="6031:5979"
    />
  );
}

/**
 * OnboardButton 6217:35010 — 80 x 56, outside the field.
 *
 * New in the rebuild. The old search button lived INSIDE the input and was a
 * one-off green (#2a7d6f) at 14px with px-20/py-8; this one is the shared
 * `OnboardButton` component in the primary navy (#243746) at 16px with a flat
 * 16px pad, stretched to the 56px row height. The green is gone from the page.
 *
 * Width 80 = 16 + 48 ("Search" at 16px Bold) + 16, so it is left to size
 * itself rather than pinned.
 *
 * Inert: the design has no results screen behind it.
 */
function SearchButton() {
  return (
    <div className="flex shrink-0 self-stretch" data-node-id="6217:35010">
      <div
        className="flex h-full cursor-default items-center justify-center overflow-clip rounded-[4px] bg-[#243746] p-[16px] select-none"
        data-demo-inert="true"
        aria-disabled="true"
      >
        <p className="shrink-0 text-[16px] font-bold leading-[normal] whitespace-nowrap text-white [word-break:break-word]">
          Search
        </p>
      </div>
    </div>
  );
}

/**
 * favourites-section 6031:5983.
 *
 * Height: 40 (pt) + 42 (28px title) + 12 (gap) + 22 (one 16px/22px line) + 20
 * (pb) = 136. The title went 24px -> 28px and the body 15px -> 16px in the
 * rebuild; the padding and the 12px gap did not move. The explanatory line
 * still does not wrap at 1200px — if it ever does, the pinned height is what
 * will surface it.
 *
 * There is no favourites LIST in the design, only this explanation. The section
 * is empty state by design; do not invent cards for it.
 *
 * RESPONSIVE: the 136px pin assumes the explanatory line stays on ONE line,
 * which it only does at the design width — at 1024 it is already two lines and
 * the text was spilling out of the fixed box onto the grid below. So the pin
 * becomes a minimum everywhere under 1440, which is exactly the "if it ever
 * wraps, the pinned height is what will surface it" case the note above
 * predicted. At 1440 the line still fits and nothing moves.
 */
function FavouritesSection() {
  return (
    <section
      className="gnl-gutter [--gnl-gutter:120px] flex min-h-[136px] w-full flex-col items-start gap-[12px] pt-[40px] pb-[20px]"
      data-node-id="6031:5983"
    >
      <p
        className="w-full text-[28px] font-bold leading-[1.5] text-[#212326] [word-break:break-word]"
        data-node-id="6031:5984"
      >
        Favourite Services
      </p>
      <p
        className="w-full text-[16px] font-normal leading-[22px] text-[#5f6368] [word-break:break-word]"
        data-node-id="6031:5985"
      >
        Favourite your commonly used services here for quick access. Select the
        star icon on the service card to add to your favourite services.
      </p>
    </section>
  );
}

/**
 * all-services-section 6031:5986 — 1142 tall in Figma, derived here.
 *
 * services-grid 6031:5988 is 1200 wide at x=120: three 384px columns with 24px
 * gutters (3 x 384 + 2 x 24 = 1200). The columns are 872 / 716 / 976 tall
 * because they hold 4 / 3 / 3 cards, which is why SERVICE_COLUMNS is three
 * explicit arrays rather than one auto-flowed list.
 *
 * Padding and gaps are unchanged by the rebuild; the +8px is the heading going
 * 24px -> 28px (36 -> 42) plus the re-flowed grid (976 vs 974).
 *
 * RESPONSIVE: the 120px gutter moves to `.gnl-gutter`, and the grid goes
 * three columns -> two -> one rather than three -> one.
 *
 *   >= 1280  three columns, as designed (346px each at 1280, 384 at 1440).
 *   768..1279 two columns. Three would be ~198px wide at 769 — narrower than
 *             half the designed card, with a 28px title in it. Two gives 348px
 *             at 768 and 436px at 1024, within a few pixels of the 384px the
 *             card was drawn at.
 *    < 768    one column, full-width cards.
 *
 * HOW, and why it is not just `flex-wrap` on the columns. Wrapping the three
 * COLUMNS puts columns 1 and 2 on the first line and column 3 alone on the
 * second — and because the columns hold 4 / 3 / 3 cards of very different
 * heights, that leaves roughly a thousand pixels of empty right-hand column.
 * So below 1280 the column wrappers go `display: contents` instead: they stop
 * generating boxes, the ten cards become direct children of the grid, and they
 * flow two-up and wrap evenly with no hole in the layout. The wrappers' 24px
 * gap disappears with them, but the grid's own gap is also 24, so the rhythm
 * is unchanged.
 *
 * DOM order is untouched, so reading and tab order still run column 1, column
 * 2, column 3 — what is lost below 1280 is only the designer's visual grouping
 * into columns, which at 1440 exists to reproduce Figma's 872/716/976 column
 * heights and has no meaning once the grid is two-up.
 */
function AllServicesSection() {
  return (
    <section
      className="gnl-gutter [--gnl-gutter:120px] flex w-full flex-col items-start gap-[24px] pt-[20px] pb-[80px] max-md:pb-[48px]"
      data-node-id="6031:5986"
    >
      <p
        className="w-full text-[28px] font-bold leading-[1.5] text-[#212326] [word-break:break-word]"
        data-node-id="6031:5987"
      >
        All Services
      </p>

      <div
        className="flex w-full shrink-0 items-start gap-[24px] max-xl:flex-wrap"
        data-node-id="6031:5988"
      >
        {SERVICE_COLUMNS.map((column, index) => (
          <div
            key={index}
            className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[24px] max-xl:contents"
          >
            {column.map((card) => (
              <ServiceCard
                key={card.title}
                title={card.title}
                body={card.body}
                href={card.href}
                headerTop={card.headerTop}
                titleWraps={card.titleWraps}
                duplicateChevron={card.duplicateChevron}
              />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * footer-section 6031:6228 — 1440 x 314.275.
 *
 * A #512d6d purple band holding the wordmark and the feedback button, with the
 * shared grey `footer verified` instance beneath it.
 *
 * Height: 48 (pt) + 45.05972671508789 (wordmark) + 24 + 33 (button) + 24
 * + 140.215 (SiteFooter) = 314.275. Every one of those offsets is a measured
 * child position in the frame, so the band's padding is written out rather than
 * rounded.
 *
 * The feedback button is inert. There is no destination for it in this demo and
 * a dead link on stage is worse than an unclickable one.
 */
function FooterSection() {
  return (
    <div className="w-full bg-[#512d6d]" data-node-id="6031:6228">
      <div className="flex w-full flex-col items-center gap-[24px] pt-[48px] pb-[24px]">
        {/* MyGovNL 1 6031:6229 — 150 x 45.05972671508789 at x=645 (centred) */}
        <div
          className="relative h-[45.05972671508789px] w-[150px] shrink-0"
          data-node-id="6031:6229"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="MyGovNL"
            className="absolute inset-0 block size-full max-w-none"
            src={ASSETS.mygovnlWordmark}
          />
        </div>

        {/* feedback-button 6031:6237 — 175 x 33, label box 135 x 17 at 20/8 */}
        <div
          className="box-border flex h-[33px] w-[175px] shrink-0 cursor-default items-center justify-center overflow-clip rounded-[4px] bg-white px-[20px] py-[8px] select-none"
          data-node-id="6031:6237"
          data-demo-inert="true"
          aria-disabled="true"
        >
          <p className="shrink-0 text-[14px] font-bold leading-[normal] whitespace-nowrap text-[#512d6d] [word-break:break-word]">
            Tell us what you think
          </p>
        </div>
      </div>

      {/* footer verified 6031:6239 at y=174.05972290039062 */}
      <SiteFooter variant="desktop" />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="gnl-desktop-shell">
      <TopNav />
      <WelcomeSection />
      <FavouritesSection />
      <AllServicesSection />
      <FooterSection />
    </div>
  );
}
