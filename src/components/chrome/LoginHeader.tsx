import Link from "next/link";
import { ASSETS } from "@/lib/assets";

/*
 * "header" — Figma 6031:5866 (component 4002:514), 1440 x 128.
 *
 * The public login page only. Authenticated pages use the 69px
 * `top-nav actions` component (TopNav) instead.
 *
 * The wordmark is positioned with Figma's percentage insets verbatim, which
 * resolve to a 293.328 x 74.010 box centred in the 1440 x 128 bar. Keeping the
 * percentages (rather than baking in the pixels) means the box stays correct if
 * the header is ever re-measured.
 *
 * RESPONSIVE. The bar is `w-full` capped by the shell, and shortens below 768
 * (128 -> 96 -> 80) so a phone does not spend a quarter of its screen on a
 * logo. At >= 768 it is the designed 128.
 *
 * The percentage insets do NOT survive a narrower bar, which is worth
 * spelling out: the two horizontal insets are ~39.8% each, so the wordmark box
 * is ~20.4% of the width but a flat 57.8% of the height. At 1440 that is the
 * designed 293.3 x 74.0 (3.96:1); at 768 the same percentages give 156 x 74
 * (2.1:1) and the wordmark is visibly squashed. So below the design width the
 * box switches to the measured pixel size, centred with `inset-x-0` + auto
 * margins, and the image gets `object-contain` — which is a no-op while the
 * box holds its designed ratio and letterboxes cleanly once `max-w` or the
 * shorter phone bar changes it.
 */
export function LoginHeader() {
  return (
    <header
      /*
       * `gnl-bleed` carries the dark bar to the edges of a monitor wider than
       * the 1440 shell, so the login page does not open with a header boxed
       * in white. Inert at <= 1440 — see .gnl-bleed in globals.css.
       *
       * Its `clip-path` trims only horizontally (0 vertical inset), and the
       * wordmark is centred well inside the bar, so nothing here is clipped.
       */
      className="gnl-bleed [--gnl-bleed-bg:#243746] relative h-[128px] w-full max-w-[1440px] bg-[#243746] max-md:h-[96px] max-xs:h-[80px]"
      data-node-id="6031:5866"
    >
      {/* gnl-header gnl-header--mygovnl-external 4002:515 */}
      <div className="absolute inset-0 bg-[#243746]" />
      {/* ff028a175e9f6f68eaa2ca8cca717859 4002:516 — the wordmark is the
          login page's "home" affordance; it points back at this page itself.
          The box is absolutely positioned, so swapping the <div> for a <Link>
          changes no geometry. */}
      <Link
        href="/"
        className="absolute inset-[21.09%_39.84%_21.09%_39.79%] max-[1440px]:inset-x-0 max-[1440px]:top-1/2 max-[1440px]:bottom-auto max-[1440px]:mx-auto max-[1440px]:h-[74.01px] max-[1440px]:w-[293.328px] max-[1440px]:max-w-[calc(100%-32px)] max-[1440px]:-translate-y-1/2 max-xs:h-[52px]"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="MyGovNL"
            className="absolute top-0 left-0 block size-full max-w-none max-[1440px]:object-contain"
            src={ASSETS.mygovnlHeaderLogo}
          />
        </div>
      </Link>
    </header>
  );
}
