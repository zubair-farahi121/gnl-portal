"use client";

import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { useDemoState } from "@/lib/demo-state";

/*
 * "top-nav actions" — Figma 6031:6245, 1440 x 69.
 *
 * Used by every authenticated desktop page. The login page uses the taller
 * `header` component (LoginHeader) instead — they are two distinct components
 * in Figma, so they are two distinct components here. Do not merge them.
 *
 * Height derivation: 16 (pt) + 37 (btn-signout) + 16 (pb) = 69.
 * The white bottom border is painted with an inset shadow rather than
 * `border-b` so it does not consume a pixel of the 69px box.
 *
 * INTERACTIVITY (2026-09-21). This component is now "use client" because
 * `Log Out` has to clear the demo state before it navigates. Nothing visual
 * changed: every wired control keeps its exact classes and only swaps its
 * wrapper element for a <Link>, which carries the same `display` once it is a
 * flex item. See design/interactivity-map.md.
 */

type NavLink = {
  label: string;
  icon: string;
  nodeId: string;
  /** The Gear is a 16px box wrapping a smaller inner group; the others fill the box. */
  innerInset?: string;
  /**
   * Demo destination. Only `Services` has one — the demo has no Account,
   * Notifications or Contact Us screen, so those three stay deliberately inert
   * rather than being pointed at a plausible-looking wrong route.
   */
  href?: string;
};

export const TOP_NAV_LINKS: readonly NavLink[] = [
  { label: "Services", icon: ASSETS.iconGear, nodeId: "6022:2282", innerInset: "inset-[8.56%_8.78%]", href: "/dashboard/" },
  { label: "Account", icon: ASSETS.iconUser, nodeId: "6022:2285" },
  { label: "Notifications", icon: ASSETS.iconBell, nodeId: "6022:2289" },
  { label: "Contact Us", icon: ASSETS.iconInfo, nodeId: "6022:2293" },
];

export function NavIcon({ icon, innerInset }: { icon: string; innerInset?: string }) {
  if (innerInset) {
    return (
      <div className="relative size-[16px] shrink-0">
        <div className={`absolute ${innerInset}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={icon} />
        </div>
      </div>
    );
  }
  return (
    <div className="relative size-[16px] shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="absolute inset-0 block size-full max-w-none" src={icon} />
    </div>
  );
}

/**
 * The nav row box. Identical on the wired link and on the inert ones.
 *
 * `gnl-touch` raises it to a 44px target below 768 — but only inside
 * `.gnl-desktop-shell`, so the same markup reused by MobileTopNav inside the
 * 393px CID shell keeps its designed height. See globals.css.
 */
const NAV_ROW = "gnl-touch flex shrink-0 items-center gap-[8px]";

/** Shared by TopNav and MobileTopNav — identical in both Figma variants. */
export function NavLinks({ className }: { className: string }) {
  return (
    <div className={className}>
      {TOP_NAV_LINKS.map((link) => {
        const inner = (
          <>
            <NavIcon icon={link.icon} innerInset={link.innerInset} />
            {/* Figma says Lato:Medium; the webfont has no 500. See token-exceptions.md. */}
            <p className="shrink-0 whitespace-nowrap text-[15px] font-normal leading-normal text-[#bfc4c8]">
              {link.label}
            </p>
          </>
        );

        if (link.href) {
          return (
            <Link key={link.label} className={NAV_ROW} href={link.href} data-node-id={link.nodeId}>
              {inner}
            </Link>
          );
        }

        /*
         * No screen exists behind these. They keep every visual value and are
         * marked inert instead of being wired somewhere arbitrary, so the
         * presenter gets an unresponsive label rather than a wrong screen.
         */
        return (
          <div
            key={link.label}
            className={`${NAV_ROW} cursor-default select-none`}
            data-node-id={link.nodeId}
            data-demo-inert="true"
            aria-disabled="true"
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/**
 * btn-signout — Figma calls this Lato:SemiBold; the webfont has no 600.
 *
 * Clears the demo's verified flag on the way out so the next run of the demo
 * starts from the unverified service page. `reset()` writes sessionStorage
 * synchronously, so it completes before the navigation.
 */
export function BtnSignOut() {
  const { reset } = useDemoState();
  return (
    <Link
      href="/"
      onClick={reset}
      className="gnl-touch flex shrink-0 items-center justify-center rounded-[6px] border border-solid border-white px-[20px] py-[10px]"
    >
      <p className="shrink-0 whitespace-nowrap text-[14px] font-bold leading-normal text-[#bfc4c8]">Log Out</p>
    </Link>
  );
}

/*
 * RESPONSIVE BEHAVIOUR (all of it below the 1440 design width, all CSS):
 *
 *   >= 1024   exactly as designed — 69px tall, px-[80px], one row.
 *    < 1024   gutters and gaps tighten (80 -> 32, 48 -> 24, 32 -> 20). The bar
 *             is still 69px and still one row; measured width at 768 is ~718.
 *    < 768    the bar wraps to two rows and grows. `max-md:contents` dissolves
 *             the nav-left box so the logo and the link row become direct flex
 *             items of the <nav>; `order` then puts the logo and Log Out on
 *             row one (justify-between spreads them) and the full-width link
 *             row underneath, centred and wrapping as needed. Each link is a
 *             44px touch target via `gnl-touch`.
 *
 * No hamburger: the four labels are short, they fit two rows at 320px, and a
 * disclosure button would mean JavaScript state for a nav whose entire content
 * is visible anyway.
 */
export function TopNav() {
  return (
    <nav
      /*
       * `gnl-bleed` + its two colour variables let the dark bar paint to the
       * edges of a monitor wider than the 1440 shell while its CONTENT stays
       * inside the 1440 cap. Above 1440 the bar used to stop at 1440 and sit
       * in white bands, which reads as a boxed-in page rather than a site
       * header. Inert at <= 1440; see .gnl-bleed in globals.css.
       */
      className="gnl-bleed [--gnl-bleed-bg:#2b3a4e] [--gnl-bleed-line:#ffffff] box-border flex h-[69px] w-full max-w-[1440px] items-center justify-between bg-[#2b3a4e] px-[80px] shadow-[inset_0_-1px_0_0_#ffffff] max-lg:px-[32px] max-md:h-auto max-md:flex-wrap max-md:gap-y-[12px] max-md:px-[16px] max-md:py-[12px]"
      data-node-id="6031:6245"
    >
      {/* nav-left 6022:2271 */}
      <div className="flex shrink-0 items-center gap-[48px] max-lg:gap-[24px] max-md:contents">
        <Link href="/dashboard/" className="relative h-[33.645px] w-[112px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="MyGovNL" className="absolute inset-0 block size-full max-w-none object-contain" src={ASSETS.mygovnlLogo} />
        </Link>
        <NavLinks className="flex shrink-0 items-center gap-[32px] max-lg:gap-[20px] max-md:order-3 max-md:w-full max-md:flex-wrap max-md:justify-center max-md:gap-x-[20px] max-md:gap-y-0" />
      </div>

      {/* nav-right 6022:2296 */}
      <div className="flex shrink-0 items-center max-md:order-2">
        <BtnSignOut />
      </div>
    </nav>
  );
}
