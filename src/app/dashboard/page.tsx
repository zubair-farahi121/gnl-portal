import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ServiceCard } from "@/components/service/ServiceCard";
import { DEMO_USER, SERVICE_CARDS } from "@/lib/data/services";

/*
 * gnwt-services-dashboard — Figma 20:23087 (1920 x 1986). release-2,
 * 2026-11-16. Spec A §6.
 *
 *   header (authenticated, 99)            → <TopNav />
 *   main content, px-296 → 1328 wide      → .gnwt-container + max-w-[1328px]
 *     welcome-section      18:21615  pt 48 / pb 40, gap 24
 *     favourites-section   18:21622  pt 40 / pb 20, gap 12
 *     all-services-section 18:21625  pt 20, gap 24; 4-col grid, gap 40;
 *                                    pagination 24 below the grid
 *   footer (Need help → wave → navy)      → <SiteFooter variant="desktop" />
 *
 * Only the two demo service cards navigate. The search row, every other
 * card and the pagination are inert: they show the "Not part of this demo"
 * toast via `data-demo-inert`. No "use client" needed.
 *
 * RESPONSIVE: the grid is 4 columns from 1280, 3 from 1024, 2 from 640 and 1
 * below; the 44/34 headings step down on phones; the search field becomes
 * full width under 640 and the buttons wrap below it.
 */

const PRIMARY_BUTTON =
  "inline-flex h-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-[#333333] px-[12px] py-[8px] text-[16px] font-bold leading-[1.5] whitespace-nowrap text-white hover:bg-[#001f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]";
const SECONDARY_BUTTON =
  "inline-flex h-[40px] shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-transparent px-[12px] py-[8px] text-[16px] font-bold leading-[1.5] whitespace-nowrap text-[#333333] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]";

/** welcome-section 18:21615 — greeting and the (inert) search row. */
function WelcomeSection() {
  return (
    <section
      className="flex w-full flex-col items-start gap-[24px] pt-[48px] pb-[40px] max-md:pt-[32px] max-md:pb-[32px]"
      data-node-id="18:21615"
    >
      <h1 className="w-full text-[44px] font-bold leading-[1.5] text-[#333333] [word-break:break-word] max-md:text-[32px] max-xs:text-[28px]">
        {`Welcome ${DEMO_USER.name}!`}
      </h1>

      {/* search-row — a real (typeable) field; Search and Reset are inert
          because the demo has no results screen. */}
      <div className="flex w-full flex-wrap items-center gap-[16px]" role="search">
        <label htmlFor="dashboard-search" className="sr-only">
          Search services
        </label>
        <input
          id="dashboard-search"
          type="search"
          autoComplete="off"
          className="box-border h-[56px] w-[340px] max-w-full rounded-none border border-solid border-[rgba(51,51,51,0.75)] bg-white px-[12px] text-[16px] text-[#333333] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f] max-sm:w-full"
        />
        <div className="flex items-center gap-[24px]">
          <button type="button" className={PRIMARY_BUTTON} data-demo-inert="true">
            Search
          </button>
          <button type="button" className={SECONDARY_BUTTON} data-demo-inert="true">
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

/** favourites-section 18:21622 — explanation only; no list in the design. */
function FavouritesSection() {
  return (
    <section
      className="flex w-full flex-col items-start gap-[12px] pt-[40px] pb-[20px] text-[#333333]"
      data-node-id="18:21622"
    >
      <h2 className="w-full text-[34px] font-bold leading-[1.5] [word-break:break-word] max-md:text-[28px]">
        Favourite Services
      </h2>
      <p className="w-full text-[16px] font-normal leading-[22px] [word-break:break-word]">
        Favourite your commonly used services here for quick access. Select the
        star icon on the service card to add to your favourite services.
      </p>
    </section>
  );
}

function ArrowIcon({ direction }: { direction: "back" | "forward" }) {
  return (
    <svg viewBox="0 0 8 13" width="8" height="13" fill="none" stroke="#333333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="block">
      <path d={direction === "back" ? "M6.5 1 1.5 6.5 6.5 12" : "M1.5 1 6.5 6.5 1.5 12"} />
    </svg>
  );
}

/** Pagination 18:22956 — four 40x40 boxes, no gaps. Presentational (inert). */
function Pagination() {
  const BOX =
    "box-border flex size-[40px] cursor-pointer items-center justify-center text-[16px] font-bold leading-[16px] focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]";
  const IDLE = "border border-solid border-[#ededed] bg-white text-[#333333] hover:bg-[#f3f8fc]";
  return (
    <nav aria-label="Services pages" className="flex w-full justify-center" data-node-id="18:22956">
      <ul className="flex items-center" role="list">
        <li>
          <button type="button" className={`${BOX} ${IDLE} rounded-l-[6px]`} aria-label="Previous page" data-demo-inert="true">
            <ArrowIcon direction="back" />
          </button>
        </li>
        <li>
          <button type="button" className={`${BOX} bg-[#333333] text-white`} aria-current="page" aria-label="Page 1" data-demo-inert="true">
            1
          </button>
        </li>
        <li>
          <button type="button" className={`${BOX} ${IDLE} -ml-px`} aria-label="Page 2" data-demo-inert="true">
            2
          </button>
        </li>
        <li>
          <button type="button" className={`${BOX} ${IDLE} -ml-px rounded-r-[6px]`} aria-label="Next page" data-demo-inert="true">
            <ArrowIcon direction="forward" />
          </button>
        </li>
      </ul>
    </nav>
  );
}

/**
 * all-services-section 18:21625 — 12 cards, CSS grid in row order.
 * At 4 columns the column width is (1328 − 3×40) / 4 = 302 and the rows are
 * 232 / 285 / 285 tall (the card's `minHeight`).
 */
function AllServicesSection() {
  return (
    <section className="flex w-full flex-col items-start gap-[24px] pt-[20px]" data-node-id="18:21625">
      <h2 className="w-full text-[34px] font-bold leading-[1.5] text-[#333333] [word-break:break-word] max-md:text-[28px]">
        All Services
      </h2>

      <ul
        className="grid w-full grid-cols-1 gap-[24px] sm:grid-cols-2 sm:gap-[40px] lg:grid-cols-3 xl:grid-cols-4"
        role="list"
        data-name="services-grid"
      >
        {SERVICE_CARDS.map((card, index) => (
          <li key={card.title} className="flex min-w-0">
            <ServiceCard
              title={card.title}
              body={card.body}
              href={card.href}
              clampTitle={card.clampTitle}
              minHeight={index < 4 ? 232 : 285}
            />
          </li>
        ))}
      </ul>

      <Pagination />
    </section>
  );
}

export default function DashboardPage() {
  return (
    <div className="gnl-desktop-shell">
      <TopNav />
      <main className="gnwt-container">
        <div className="mx-auto w-full max-w-[1328px]">
          <WelcomeSection />
          <FavouritesSection />
          <AllServicesSection />
        </div>
      </main>
      <SiteFooter variant="desktop" />
    </div>
  );
}
