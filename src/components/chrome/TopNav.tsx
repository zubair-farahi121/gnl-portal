"use client";

/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import { ASSETS } from "@/lib/assets";

/*
 * THE GNWT HEADER — release-2 (2026-11-16).
 *
 * Replaces the GNL "MyGovNL" top nav. Source: Figma file
 * `Hfj015MPSmeRPYg72vZxTI`, component `gnwt-header` 11:22211 (desktop) and
 * 26:68888 (mobile, 393), cross-checked with GNWT's own design-system markup.
 *
 *   desktop  white bar, 1px #333 bottom rule, 99 tall (16 + 66 + 16 + 1);
 *            inner row 1440 wide, centred: logo 304 x 66, then, right-aligned
 *            with 32px gaps: "Français", a 256px search box, the user button
 *            (signed-in pages only) and "Menu".
 *   mobile   65 tall, padding 8/16: logo 150 x 32.566, then "FR", a search
 *            icon and "Menu". No user button, as drawn.
 *
 * ONE COMPONENT, three exports, so every page that already renders
 * <TopNav />, <LoginHeader /> or <MobileTopNav /> gets the new header with no
 * change of its own:
 *
 *   TopNav         signed in; desktop layout from 1024px up, mobile below
 *   LoginHeader    the same without the user button (see LoginHeader.tsx)
 *   MobileTopNav   signed in, ALWAYS the mobile layout — the CertifiO ID
 *                  screens are a phone-width column even on a laptop
 *
 * WHAT IS REAL. The logo goes to the dashboard (or the login page when signed
 * out). The user button opens a one-item menu, "Sign out", which goes to the
 * login page WITHOUT clearing the demo — the same rule the GNL build's "Log
 * Out" had (brief §7.1): only Esc and /reset clear it. "Français", the search
 * box and "Menu" are out of scope for the demo: `data-demo-inert` -> the "Not
 * part of this demo" toast.
 */

const TEXT = "text-[#333333]";

function SearchIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="block shrink-0">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="block shrink-0">
      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="block shrink-0">
      <path fillRule="evenodd" clipRule="evenodd" d="M1.5 19.6023C1.5 19.0751 1.92736 18.6477 2.45455 18.6477H21.5455C22.0726 18.6477 22.5 19.0751 22.5 19.6023C22.5 20.1295 22.0726 20.5568 21.5455 20.5568H2.45455C1.92736 20.5568 1.5 20.1295 1.5 19.6023Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M1.5 11.9659C1.5 11.4387 1.92736 11.0114 2.45455 11.0114H21.5455C22.0726 11.0114 22.5 11.4387 22.5 11.9659C22.5 12.4931 22.0726 12.9205 21.5455 12.9205H2.45455C1.92736 12.9205 1.5 12.4931 1.5 11.9659Z" fill="currentColor" />
      <path fillRule="evenodd" clipRule="evenodd" d="M1.5 4.32955C1.5 3.80236 1.92736 3.375 2.45455 3.375H21.5455C22.0726 3.375 22.5 3.80236 22.5 4.32955C22.5 4.85673 22.0726 5.28409 21.5455 5.28409H2.45455C1.92736 5.28409 1.5 4.85673 1.5 4.32955Z" fill="currentColor" />
    </svg>
  );
}

/** The demo persona's name, as the header's user button shows it. */
const USER_NAME = "Jason Moore";

/**
 * The signed-in user button and its one-item menu. A real <button> with
 * `aria-expanded`; the menu closes on a click elsewhere or when focus leaves.
 */
function UserMenu() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: Event) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", away);
    document.addEventListener("focusin", away);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("focusin", away);
    };
  }, [open]);

  return (
    <div ref={root} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex cursor-pointer items-center gap-[8px] rounded-[6px] border-[1.6px] border-solid border-[#005d8f] bg-white px-[11.2px] py-[6.4px] text-[#005d8f] hover:bg-[#f3f8fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
        data-user-menu="true"
      >
        <PersonIcon />
        <span className="whitespace-nowrap text-[14px] font-bold leading-[1.5] tracking-[0.42px]">{USER_NAME}</span>
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-[calc(100%+6px)] right-0 z-30 min-w-full rounded-[6px] border border-solid border-[#c2c4c6] bg-white py-[6px] shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
        >
          <Link
            role="menuitem"
            href="/"
            className="block whitespace-nowrap px-[16px] py-[8px] text-[16px] font-normal leading-[1.5] text-[#333333] no-underline hover:bg-[#f3f8fc] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#005d8f]"
            data-sign-out="true"
          >
            Sign out
          </Link>
        </div>
      ) : null}
    </div>
  );
}

const INERT = { "data-demo-inert": "true", "aria-disabled": true } as const;

export function GnwtHeader({ authenticated, compact = false }: { authenticated: boolean; compact?: boolean }) {
  /* `compact` forces the phone layout at every width; otherwise it applies below 1024px. */
  const wide = compact ? "hidden" : "max-lg:hidden";
  const narrow = compact ? "" : "lg:hidden";
  const home = authenticated ? "/dashboard/" : "/";

  return (
    <header
      className={`w-full shrink-0 border-b border-solid border-[#333333] bg-white ${compact ? "px-[16px] py-[8px]" : "px-[16px] py-[16px] max-lg:py-[8px]"}`}
      data-gnwt-header={authenticated ? "authenticated" : "unauthenticated"}
    >
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-[16px]">
        <Link href={home} className="block shrink-0" aria-label="Government of Northwest Territories — home">
          <img alt="" src={ASSETS.gnwtLogo} className={`block h-[66px] w-[304px] max-w-none ${wide}`} />
          <img alt="" src={ASSETS.gnwtLogo} className={`block h-[32.566px] w-[150px] max-w-none ${narrow}`} />
        </Link>

        {/* desktop cluster */}
        <div className={`flex min-w-0 flex-1 items-center justify-end gap-[32px] ${wide}`}>
          <span className={`cursor-default select-none text-[16px] font-bold leading-none ${TEXT}`} {...INERT}>
            Français
          </span>
          <div
            className={`flex w-[256px] shrink-0 cursor-default select-none items-center border border-solid border-[#8b8d90] p-[12px] ${TEXT}`}
            {...INERT}
          >
            {/* Review 2026-11-23 (Tatyana): 1rem, 75 % opacity. */}
            <span className="flex-1 text-[1rem] font-normal leading-none opacity-75">Search</span>
            <SearchIcon />
          </div>
          {authenticated ? <UserMenu /> : null}
          <span className={`flex cursor-default select-none items-center gap-[8px] px-[7px] py-[12px] ${TEXT}`} {...INERT}>
            <MenuIcon />
            <span className="text-[18px] font-bold leading-none">Menu</span>
          </span>
        </div>

        {/* phone cluster */}
        <div className={`flex flex-1 items-center justify-end gap-[16px] ${narrow}`}>
          <span className={`cursor-default select-none text-[16px] font-bold leading-none ${TEXT}`} {...INERT}>
            FR
          </span>
          <span className={`flex w-[32px] cursor-default select-none justify-center px-[8px] py-[12px] ${TEXT}`} aria-label="Search" role="img" {...INERT}>
            <SearchIcon />
          </span>
          <span className={`flex cursor-default select-none items-center gap-[8px] py-[12px] ${TEXT}`} {...INERT}>
            <MenuIcon />
            <span className="text-[18px] font-bold leading-none">Menu</span>
          </span>
        </div>
      </div>
    </header>
  );
}

/** The signed-in header. Desktop layout from 1024px, phone layout below. */
export function TopNav() {
  return <GnwtHeader authenticated />;
}
