import Link from "next/link";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { BREADCRUMB } from "@/lib/data/driver-vehicle";

/*
 * THE 404 — BUILD_BRIEF.md §7.6.
 *
 * *"Unknown routes -> friendly 404 with '← Back to Services'."*
 *
 * ADDED 2026-09-23 (Tier 1 item 1.6). DEMO_AUDIT.md X-08(b): *"The 404 is the
 * stock Next.js page — plain '404 / This page could not be found.', no GNL
 * chrome, no '← Back to Services'; confirmed by fetching /nope/."* §7.6 also
 * says the demo link may be shared, and §14 puts "no dead ends" at P0: a stock
 * framework 404 is the one page in a demo that says "unfinished".
 *
 * ====================================================================
 * IT IS A REAL 404 IN A STATIC EXPORT.
 *
 * `output: "export"` renders this file to `out/404.html`, which is the file
 * every static host — `serve`, S3, Netlify, GitHub Pages — serves with a 404
 * status for a path it does not have. Nothing else is needed and no server is
 * involved. Verified against the built export with `curl -o /dev/null -w
 * '%{http_code}' .../nope/` -> 404.
 *
 * (`serve -s out` would rewrite every unknown path to `index.html` and this
 * page would never appear. That is the same mistake `npm run serve` and
 * scripts/responsive-check.mjs already warn about.)
 * ====================================================================
 *
 * GEOMETRY IS DERIVED. There is no 404 frame in Figma — §7.6 describes the
 * screen in one sentence and nothing draws it. So the page is assembled from
 * parts that ARE measured: the real `TopNav` (6031:6245) and the real desktop
 * `SiteFooter`, with the body using the wizard screens' own type scale — 36px
 * Bold heading on `--gnl-heading`, 16/24 Regular on `#5f6368` — and the
 * breadcrumb link exactly as the service page draws it (14px Bold #004b87,
 * underlined from-font, with the U+2190 arrow as part of the string).
 *
 * BREADCRUMB, NOT A BUTTON. §7.6 asks for "← Back to Services", which is the
 * same control and the same string the service page already uses, so it reuses
 * `BREADCRUMB` rather than restating it — one source, and it follows if the
 * dashboard route ever moves.
 *
 * No "use client": nothing here uses a hook.
 */
export default function NotFound() {
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      <main className="w-full">
        {/*
         * The same 152px well the wizard frames sit in, stepping
         * 152 -> 96 -> 48 -> 32 down the ladder, so a 404 reached mid-demo
         * looks like part of the same site rather than a different product.
         * `.gnl-desktop-shell` keeps the footer at the bottom of what is a
         * deliberately short page.
         */}
        <div className="gnl-gutter [--gnl-gutter:80px] flex flex-col items-start gap-[24px] pt-[152px] pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          <p className="text-[16px] font-bold leading-[24px] text-[#5f6368]">
            404
          </p>
          <h1 className="w-full text-[36px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-md:text-[30px] max-xs:text-[26px]">
            We can&#x2019;t find that page
          </h1>
          <p className="w-full max-w-[740px] text-[16px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]">
            The page you were looking for may have moved, or the address may
            have been typed incorrectly. Your onboarding progress has been
            saved.
          </p>
          {/* 44px touch target below 768 via `gnl-touch`, like every other
              control in the desktop shell. */}
          <Link
            href={BREADCRUMB.href}
            className="gnl-touch inline-flex items-center text-[14px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]"
          >
            {BREADCRUMB.label}
          </Link>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
