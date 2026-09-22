import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import { BtnSignOut, NavLinks } from "@/components/chrome/TopNav";

/*
 * "top-nav actions", mobile variant — Figma 6039:9699, 393 x 145.
 *
 * Same Figma component as the desktop nav at a different size, so the link row
 * and sign-out button are reused from TopNav rather than re-authored.
 *
 * Height derivation: 16 (pt) + 37 (row 1, btn-signout) + 24 (gap)
 *                  + 52 (row 2 — nav links wrap to two 18px lines, 16px gap)
 *                  + 16 (pb) = 145.
 * The white bottom border is painted with an inset shadow so it does not
 * consume a pixel of the 145px box.
 *
 * RESPONSIVE. This is no longer a 393-only component: it is the narrow-width
 * nav for the CID screens at whatever width the phone column happens to be.
 * `w-[393px]` -> `w-full`, so it fills the shell (which caps the column at
 * 480) and shrinks with a narrower phone.
 *
 * Its design width is 393, so that is the width that must not move; it relaxes
 * at `max-xxs:` (< 384) rather than `max-md:`, for the reason set out in the
 * breakpoint note in globals.css. Below 384 the pinned 145px height is
 * released — the link row can take a third line on a 320px screen — with the
 * design height kept as a floor so nothing shrinks.
 */
export function MobileTopNav() {
  return (
    <nav
      className="box-border flex h-[145px] w-full flex-col items-start gap-[24px] bg-[#2b3a4e] px-[16px] py-[16px] shadow-[inset_0_-1px_0_0_#ffffff] max-xxs:h-auto max-xxs:min-h-[145px]"
      data-node-id="6039:9699"
    >
      {/* 6039:8929 — logo and sign-out */}
      <div className="flex w-full shrink-0 items-start justify-between">
        <Link href="/dashboard/" className="relative h-[33.645px] w-[112px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="MyGovNL" className="absolute inset-0 block size-full max-w-none" src={ASSETS.mygovnlLogo} />
        </Link>
        <div className="flex shrink-0 items-center">
          <BtnSignOut />
        </div>
      </div>

      {/* nav-links 6039:8941 — wraps to two lines at 393px */}
      <NavLinks className="flex w-full shrink-0 flex-wrap content-center items-center justify-center gap-[16px]" />
    </nav>
  );
}
