import Link from "next/link";
import { LoginHeader } from "@/components/chrome/LoginHeader";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ASSETS } from "@/lib/assets";
import { FAQ_ITEMS, LANDING_SERVICES } from "@/lib/data/landing";

/*
 * mygovnl-login-page — Figma 6206:23558, 1440 x 1880.215.
 *
 * RESYNCED 2026-09: the designer deleted the old 6031:5865 frame and rebuilt
 * this screen as a main component. Re-read against the rebuilt node, every
 * section, size, colour, weight and string is IDENTICAL — the frame changed
 * identity, not content. Only the root id above moved; the child node ids
 * below all survived the rebuild. See design/resync-login-dashboard.md.
 *
 * Geometry, verbatim from get_design_context on 6031:5867 / 5890 / 5957:
 *   header            1440 x 128     at y=0        → <LoginHeader />
 *   HeroSection       1440 x 560     at y=128
 *   ServicesSection   1440 x 676     at y=688
 *   FAQSection        1440 x 376     at y=1364
 *   footer verified   1440 x 140.215 at y=1740     → <SiteFooter variant="desktop" />
 *   128 + 560 + 676 + 376 + 140.215 = 1880.215
 *
 * Every section height is derived, not pinned, because Figma derives them the
 * same way from auto-layout. ServicesSection checks out: 80 (pt) + 42 (28px
 * heading) + 48 (gap) + 426 (tallest column) + 80 (pb) = 676. FAQSection:
 * 60 + 36 + 32 + 168 (3 x 56) + 80 = 376.
 *
 * RESPONSIVE (2026-09-21, all of it below the 1440 design width, all CSS):
 * the two 170px section gutters became `.gnl-gutter [--gnl-gutter:170px]`, the
 * 440px login card and the 800px FAQ panel became capped fluid boxes, and the
 * three-column services grid goes 3 -> 2 -> 1. Each section carries the detail
 * in its own comment. At >= 1440 every one of those is a no-op, which is what
 * keeps the geometry above true.
 *
 * Nothing on this page is interactive except the Log in button. The inputs are
 * empty presentational boxes (Figma fills them with a zero-width space) and the
 * accordion rows are CLOSED and inert — the design shows no open state, so
 * adding one would invent a design that does not exist and break the 56px row.
 * That is also why this file needs no "use client".
 */

/**
 * HeroSection 6031:5867 — full-bleed image, grey scrim, centred 440px LoginCard.
 *
 * RESPONSIVE:
 *   >= 480  exactly as designed — a 560px band with a 440px card centred in it.
 *    < 480  the card is wider than the screen, so the band gains a 16px gutter
 *           and the card becomes `max-w-full` (see below). The pinned 560px
 *           height is released to `min-h` at the same time: once the card's
 *           title and labels start wrapping it can outgrow the band, and a
 *           fixed height would let it spill over ServicesSection.
 */
function HeroSection() {
  return (
    <section
      className="relative flex min-h-[560px] w-full flex-col items-center justify-center px-[16px] py-[40px]"
      data-node-id="6031:5867"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="absolute size-full max-w-none object-cover"
          src={ASSETS.heroBackground}
        />
        <div className="absolute inset-0 bg-[rgba(122,134,144,0.35)]" />
      </div>

      {/* LoginCard 6031:5868 — 440 wide by design; `max-w-full` is a no-op at
          every width above ~472 and hands the card the band's content box
          below that, so it stops being clipped on BOTH edges on a phone.
          The 32px inset costs a fifth of a 320px screen, so it drops to 24
          under 480. */}
      <div
        className="relative flex w-[440px] max-w-full shrink-0 flex-col items-start gap-[24px] rounded-[6px] bg-white p-[32px] drop-shadow-[0px_4px_8px_rgba(0,0,0,0.1)] max-xs:p-[24px]"
        data-node-id="6031:5868"
      >
        <p
          className="w-full text-center text-[22px] font-bold leading-[1.5] text-[#212326] [word-break:break-word]"
          data-node-id="6031:5869"
        >
          Welcome to MyGovNL QA
        </p>

        {/* 6125:46291 — the two spans sit on a 0px parent so only their own
            22px line boxes contribute height. Note the 15px/14px size split. */}
        <div className="flex w-full shrink-0 items-center" data-node-id="6125:46291">
          <p className="min-w-0 text-[0px] leading-[0] font-normal text-[#5f6368] [word-break:break-word]">
            <span className="text-[15px] leading-[22px]">
              Don&#x2019;t have an account?{" "}
            </span>
            {/* No account-creation screen exists in the demo — inert, not wired. */}
            <span
              className="cursor-default text-[14px] font-bold leading-[22px] text-[#004b87] underline decoration-solid decoration-from-font select-none [text-underline-position:from-font]"
              data-demo-inert="true"
            >
              Create account
            </span>
          </p>
        </div>

        {/* FormFields 6031:5870 */}
        <div
          className="flex w-full shrink-0 flex-col items-start gap-[16px]"
          data-node-id="6031:5870"
        >
          <InputField label="Email Address" nodeId="6031:5871" />
          <InputField label="Password" nodeId="6031:5878" withEye />
        </div>

        {/* No password-reset screen exists in the demo — inert, not wired. */}
        <p
          className="w-full cursor-default text-[14px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font select-none [text-underline-position:from-font] [word-break:break-word]"
          data-node-id="6031:5884"
          data-demo-inert="true"
        >
          Forgot password?
        </p>

        {/* ActionButtons 6031:5885 — the one live control on this page. */}
        <div
          className="flex w-full shrink-0 items-center justify-end"
          data-node-id="6031:5885"
        >
          <Link
            className="flex min-w-px flex-[1_0_0] items-center justify-center overflow-clip rounded-[4px] bg-[#263854] px-[24px] py-[10px]"
            href="/dashboard/"
            data-node-id="6031:5888"
          >
            <p className="shrink-0 text-[14px] font-bold leading-[normal] whitespace-nowrap text-white [word-break:break-word]">
              Log in
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * InputField 6031:5871 / 6031:5878.
 *
 * Presentational only — no <input>, because the design shows an empty box and a
 * real input would drag focus rings, placeholder metrics and browser autofill
 * styling into the pixel diff. Figma fills the value slot with a zero-width
 * space (U+200B) to hold the 21px line box open; that is reproduced literally.
 */
function InputField({
  label,
  nodeId,
  withEye = false,
}: {
  label: string;
  nodeId: string;
  withEye?: boolean;
}) {
  return (
    <div
      className="flex w-full shrink-0 flex-col items-start gap-[6px]"
      data-node-id={nodeId}
    >
      <p className="w-full text-[14px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]">
        {label}
      </p>
      <div className="box-border flex h-[40px] w-full shrink-0 items-center rounded-[6px] border border-solid border-[#d4d8da] bg-white px-[12px]">
        <p className="min-w-px flex-[1_0_0] text-[14px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]">
          {"​"}
        </p>
        {withEye ? (
          <div className="relative size-[16px] shrink-0" data-node-id="6031:5882">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={ASSETS.iconEye}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

/**
 * ServicesSection 6031:5890.
 *
 * Three explicit columns from LANDING_SERVICES — see that file for why this is
 * not one auto-flowed list. Bullets carry their own "•  " prefix from Figma, so
 * the line needs `whitespace-pre-wrap` to keep the second space.
 *
 * RESPONSIVE:
 *   the 170px design gutter moves to `.gnl-gutter`, which honours 170 verbatim
 *   above 1280 and steps it down from there (96 / 64 / 24 / 16). That also
 *   takes the section out of the OVERFLOW CONTAINMENT block in globals.css,
 *   which only ever existed to cap gutters that had not been converted yet.
 *
 *   the grid goes three columns -> two -> one, the same way the dashboard's
 *   services grid does (that file carries the long version of the reasoning):
 *     >= 1280   three columns, as designed (340px each at the design width).
 *     768..1279 two columns — 340px at 768, i.e. exactly the designed column
 *               width. Three columns here would be ~213px of 14px bullet copy,
 *               which is the "squashed" failure mode this pass exists to
 *               remove.
 *      < 768    one column.
 *
 *   Below 1280 the three column wrappers go `display: contents` and the seven
 *   CATEGORY blocks become the grid's own children, so they flow and wrap
 *   evenly rather than leaving the short middle column's slot empty. The
 *   wrappers' 40px gap goes with them and the grid's own 40px gap takes over,
 *   so the rhythm does not change. DOM order — and therefore reading order —
 *   is untouched.
 */
function ServicesSection() {
  return (
    <section
      className="gnl-gutter [--gnl-gutter:170px] flex w-full flex-col items-start gap-[48px] py-[80px] max-md:gap-[32px] max-md:py-[48px]"
      data-node-id="6031:5890"
    >
      <p
        className="w-full text-[28px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
        data-node-id="6031:5891"
      >
        Things you can do here
      </p>

      {/* ServicesGrid 6031:5892 — 1100 wide at x=170, three 340px columns, 40px
          gutters. Wraps to two columns below 1280 and one below 768. */}
      <div
        className="flex w-full shrink-0 items-start gap-[40px] max-xl:flex-wrap"
        data-node-id="6031:5892"
      >
        {LANDING_SERVICES.map((column, index) => (
          <div
            key={index}
            className="relative flex min-w-px flex-[1_0_0] flex-col items-start gap-[40px] max-xl:contents"
          >
            {column.map((category) => (
              <div
                key={category.heading}
                className="flex w-full shrink-0 flex-col items-start gap-[12px] max-xl:grow-0 max-xl:basis-[calc(50%-20px)] max-md:basis-full"
              >
                <p className="w-full text-[18px] font-bold leading-[24px] text-[#004b87] [word-break:break-word]">
                  {category.heading}
                </p>
                <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                  {category.items.map((item) => (
                    <div key={item} className="flex w-full shrink-0 items-center">
                      {/*
                       * The "•  " prefix is baked into the string by Figma
                       * rather than being a list marker, so a wrapped line has
                       * nothing to hang from and its continuation runs back to
                       * the left margin. At 1440 none of these wrap; from 1280
                       * down — where the grid goes two-up and the columns get
                       * narrower than 340 — many do, so a hanging indent the
                       * width of the prefix is added there. Purely a
                       * wrapped-line rule: it cannot move a line that fits.
                       */}
                      <p className="min-w-px flex-[1_0_0] text-[14px] font-normal leading-[22px] whitespace-pre-wrap text-[#5f6368] [word-break:break-word] max-xl:pl-[14px] max-xl:-indent-[14px]">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * FAQSection 6031:5957 — three CLOSED, non-interactive rows.
 *
 * The container's 1px stroke is painted as an inset ring rather than a border.
 * Figma draws it inside the 168px box (3 x 56 = 168 exactly), and a real
 * `border` would add 2px of layout and push the footer off the baseline. Same
 * trick TopNav uses for its white underline.
 *
 * RESPONSIVE: the 170px gutter moves to `.gnl-gutter` (as ServicesSection
 * above), and the 800px panel becomes `w-full max-w-[800px]` so it stops
 * running off the right edge from 816px downwards.
 */
function FaqSection() {
  return (
    <section
      className="gnl-gutter [--gnl-gutter:170px] flex w-full flex-col items-start gap-[32px] bg-[#f0f2f5] pt-[60px] pb-[80px] max-md:pt-[48px] max-md:pb-[48px]"
      data-node-id="6031:5957"
    >
      <p
        className="w-full text-[24px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
        data-node-id="6031:5958"
      >
        How can we help?
      </p>

      {/* AccordionContainer 6031:5959 */}
      <div
        className="flex w-full max-w-[800px] shrink-0 flex-col items-start overflow-clip rounded-[8px] shadow-[inset_0_0_0_1px_#d4d8da]"
        data-node-id="6031:5959"
      >
        {FAQ_ITEMS.map((item) => (
          /* Below 480 the 56px row height is released to a minimum and the
             label is allowed to wrap: the design's `whitespace-nowrap` is what
             holds the row to one line at 800px, and a question that cannot
             break is the classic cause of a sideways-scrolling phone page. */
          <div
            key={item.question}
            className="box-border flex h-[56px] w-full shrink-0 cursor-default items-center justify-between border-b border-solid border-[#d4d8da] bg-white px-[24px] select-none max-xs:h-auto max-xs:min-h-[56px] max-xs:gap-[12px] max-xs:px-[16px] max-xs:py-[12px]"
            data-node-id={item.nodeId}
            data-demo-inert="true"
            aria-disabled="true"
          >
            <p className="shrink-0 text-[16px] font-bold leading-[1.5] whitespace-nowrap text-[#5f6368] [word-break:break-word] max-xs:min-w-px max-xs:shrink max-xs:whitespace-normal">
              {item.question}
            </p>
            <div className="relative size-[16px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={ASSETS.iconChevronDown}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <div className="gnl-desktop-shell">
      <LoginHeader />
      <HeroSection />
      <ServicesSection />
      <FaqSection />
      <SiteFooter variant="desktop" />
    </div>
  );
}
