"use client";

import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { SiteFooter } from "@/components/chrome/SiteFooter";
import { TopNav } from "@/components/chrome/TopNav";
import { RemoveConsentButton } from "@/components/service/RemoveConsentButton";
import { isTrusted, useDemoState } from "@/lib/demo-state";
import {
  CONSENT_CARD,
  GNWT_SERVICE_PAGES,
  SERVICE_PAGE_COMMON as C,
  type ContactIcon,
  type GnwtServicePageContent,
  type ScopeIcon,
  type VcUpsellContent,
} from "@/lib/data/gnwt-services";
import type { ServiceId } from "@/lib/data/service-config";

/*
 * GNWT SERVICE PAGE — "back of the service card", release-2 (2026-11-16).
 *
 * One component for both GNWT services and both states (Figma 24:48887 /
 * 44:83880 Driver and Vehicle Services, 40:76851 / 44:83878 Student
 * Financial Assistance). It replaces the GNL pages' two separate layouts.
 *
 *   ← Back to Services
 *   [ sidebar 328 ]  [ main 984 ]                     (1336 container, gap 24)
 *     Favourite        Title (Bold 44)      [badge]
 *     Data & Privacy   intro paragraphs
 *     Contact card(s)  unverified: consent card ("Click to Proceed") +
 *                                  locked action card
 *                      Trusted:    unlocked action card with the wallet panel
 *
 * Below 1024px the columns stack with the main column first. TRUSTED is the
 * same rule as before: the store says onboarded, or `?verified=1` (the
 * presenter deep link). `data-verified` on the shell is what the tests read.
 */

/* ------------------------------------------------------------- icons -- */

function Svg({ size = 16, children, className = "" }: { size?: number; children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`block shrink-0 ${className}`}
    >
      {children}
    </svg>
  );
}

const ICON_PATHS: Record<ContactIcon | ScopeIcon | "star" | "lock" | "chevron" | "check", ReactNode> = {
  building: (
    <>
      <rect x="4" y="2" width="16" height="20" rx="1" />
      <path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </>
  ),
  mailbox: (
    <>
      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
      <path d="M15 9h3v2M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2M6 10h1" />
    </>
  ),
  phone: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
  envelope: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  link: (
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  ),
  person: (
    <>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="10" r="3" />
      <path d="M7 20.66V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.66" />
    </>
  ),
  star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" fill="currentColor" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  check: <path d="M20 6 9 17l-5-5" />,
};

function Icon({ name, size, className }: { name: keyof typeof ICON_PATHS; size?: number; className?: string }) {
  return (
    <Svg size={size} className={className}>
      {ICON_PATHS[name]}
    </Svg>
  );
}

/* ------------------------------------------------------------- parts -- */

const CARD = "rounded-[6px] border border-solid border-[#d4d8da] bg-white p-[16px]";

function Badge({ trusted }: { trusted: boolean }) {
  return trusted ? (
    <span className="flex shrink-0 items-center gap-[4px] rounded-full bg-[#d1e7dd] px-[12px] py-[6px] text-[14px] font-normal leading-[1.4] text-[#198754]" data-status-badge="trusted">
      <Icon name="check" size={12} />
      {C.badgeTrusted}
    </span>
  ) : (
    <span className="flex shrink-0 items-center gap-[6px] rounded-full bg-[#ffc3c9] px-[12px] py-[6px] text-[14px] font-normal leading-[1.4] text-[#b11721]" data-status-badge="unverified">
      <Icon name="lock" size={12} />
      {C.badgeUnverified}
    </span>
  );
}

function Sidebar({ page, trusted }: { page: GnwtServicePageContent; trusted: boolean }) {
  return (
    <aside className="flex w-[328px] shrink-0 flex-col gap-[16px] max-lg:order-2 max-lg:w-full" aria-label="Service information">
      <div className={`${CARD} flex items-center justify-between`}>
        <p className="text-[18px] font-normal leading-[1.5] text-[#333333]">{C.favourite}</p>
        <span className="cursor-default select-none text-[#333333]" data-demo-inert="true" aria-disabled="true" role="img" aria-label="Add to favourites">
          <Icon name="star" size={24} />
        </span>
      </div>

      <div className={`${CARD} flex flex-col gap-[16px] text-[16px] leading-[24px] text-[#333333]`}>
        <p className="text-[18px] leading-[1.5]">{C.dataPrivacyTitle}</p>
        <p>{C.dataPrivacyBody}</p>
        <p>{C.scopesTitle}</p>
        {page.scopes.length ? (
          <ul className="flex flex-col gap-[4px]">
            {page.scopes.map((s) => (
              <li key={s.label} className="flex items-center gap-[6px]">
                <Icon name={s.icon} size={16} />
                {s.label}
              </li>
            ))}
          </ul>
        ) : null}
        <a href={C.termsHref} target="_blank" rel="noreferrer" className="pl-[3px] text-[#333333] underline hover:text-[#001f30]">
          {C.termsLabel}
        </a>
        {trusted ? <RemoveConsentButton /> : null}
      </div>

      {page.contacts.map((card, ci) => (
        <div key={ci} className={`${CARD} flex flex-col gap-[16px] text-[16px] leading-[24px] text-[#333333]`}>
          {card.title ? <p className="text-[18px] leading-[1.5]">{card.title}</p> : null}
          <div className="flex flex-col">
            {card.rows.map((row, ri) => (
              <div key={ri} className={`flex items-start gap-[6px] ${row.icon === "link" || (!row.icon && ri > 0) ? "mt-[16px]" : ""}`}>
                {row.icon ? (
                  <span className="pt-[4px]">
                    <Icon name={row.icon} size={14} />
                  </span>
                ) : null}
                <div className="min-w-px flex-1 [word-break:break-word]">
                  {row.lines.map((l, li) => (
                    <div key={li}>{l}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}

function UpsellPanel({ upsell }: { upsell: VcUpsellContent }) {
  return (
    <div
      className="flex w-full max-w-[812px] items-center gap-[16px] rounded-[6px] bg-[rgba(196,218,241,0.5)] p-[16px] max-md:flex-col max-md:items-start"
      data-name="VRC VC upsell"
    >
      <div className="flex size-[64px] shrink-0 items-center justify-center p-[12px] text-[#005d8f]">
        <svg viewBox="0 0 24 24" width="45" height="45" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="block">
          <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM6 6h1v1H6zM17 6h1v1h-1zM6 17h1v1H6zM14 14h3v3h-3zM18 18h3v3h-3zM14 20h2M20 14v2" />
        </svg>
      </div>
      <div className="flex min-w-px flex-1 flex-col gap-[6px] text-[#005d8f]">
        <div className="flex items-start gap-[8px]">
          <p className="text-[14px] font-bold leading-[1.5]">{upsell.title}</p>
          <span className="rounded-[4px] bg-[#005d8f] px-[8px] py-[4px] text-[12px] font-bold leading-normal text-white">{upsell.badge}</span>
        </div>
        <p className="text-[14px] font-normal leading-[1.5]">{upsell.body}</p>
      </div>
      <Link
        href={upsell.actionHref}
        className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[6px] bg-[#333333] px-[12px] py-[8px] text-[16px] font-bold leading-[1.5] text-white hover:bg-[#001f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
      >
        {upsell.actionLabel}
      </Link>
    </div>
  );
}

function ActionCard({ page, trusted }: { page: GnwtServicePageContent; trusted: boolean }) {
  const body = <div className="flex flex-col gap-[16px] text-[16px] leading-normal text-[#5f6368]">{page.action.body}</div>;
  if (!trusted) {
    return (
      <div className={`${CARD} flex flex-col gap-[8px]`} data-action-card="locked">
        <div className="flex items-start justify-between gap-[16px] max-md:flex-col max-md:gap-[4px]">
          <p className="text-[24px] font-medium leading-[1.5] text-black">{page.action.title}</p>
          <p className="flex shrink-0 items-center gap-[6px] pt-[4px] text-[20px] font-bold leading-[1.5] text-[#333333]">
            {C.actionLocked}
            <Icon name="lock" size={20} />
          </p>
        </div>
        {body}
      </div>
    );
  }
  return (
    <div className={`${CARD} flex flex-col gap-[16px]`} data-action-card="unlocked">
      {/* The service itself is outside the demo: the row shows the toast. */}
      <button
        type="button"
        className="flex w-full cursor-pointer items-start gap-[16px] text-left text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
        data-demo-inert="true"
      >
        <span className="min-w-px flex-1 text-[24px] font-medium leading-[1.5] underline-offset-4 hover:underline">{page.action.title}</span>
        <Icon name="chevron" size={32} />
      </button>
      {body}
      <div className="pt-[16px]">
        <UpsellPanel upsell={page.upsell} />
      </div>
    </div>
  );
}

function ConsentCard({ page }: { page: GnwtServicePageContent }) {
  return (
    <div className={`${CARD} flex flex-col items-center gap-[16px] !p-[24px] text-center text-[#333333]`} data-consent-card="true">
      <h2 className="max-w-[760px] text-[32px] font-normal leading-[1.2] max-md:text-[26px]">{CONSENT_CARD.title}</h2>
      <p className="max-w-[860px] text-[16px] leading-[24px]">{CONSENT_CARD.body}</p>
      <Link
        href={page.proceedHref}
        className="inline-flex items-center justify-center rounded-[4px] bg-black px-[12px] py-[6px] text-[16px] font-bold leading-[1.5] text-white hover:bg-[#001f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
      >
        {CONSENT_CARD.ctaLabel}
      </Link>
    </div>
  );
}

function Page({ page, trusted }: { page: GnwtServicePageContent; trusted: boolean }) {
  return (
    <div className="gnl-desktop-shell" data-verified={trusted ? "1" : "0"} data-service={page.id}>
      <TopNav />
      <main className="gnwt-container pt-[20px]">
        <Link href={C.backHref} className="inline-flex items-center gap-[4px] text-[16px] font-normal text-[#005d8f] no-underline hover:underline">
          <span aria-hidden="true">←</span> {C.backLabel}
        </Link>
        <div className="mt-[29px] flex items-start gap-[24px] max-lg:flex-col">
          <Sidebar page={page} trusted={trusted} />
          <div className="flex min-w-px flex-1 flex-col gap-[16px] max-lg:order-1 max-lg:w-full">
            <div className="flex items-start justify-between gap-[16px] max-md:flex-col-reverse">
              <h1 className="text-[44px] font-bold leading-[1.5] text-[#333333] max-md:text-[32px]">{page.title}</h1>
              <span className="pt-[20px] max-md:pt-0">
                <Badge trusted={trusted} />
              </span>
            </div>
            <div className="flex flex-col gap-[16px] pt-[12px] text-[16px] leading-[24px] text-[#333333]">{page.intro}</div>
            {trusted ? null : <ConsentCard page={page} />}
            <ActionCard page={page} trusted={trusted} />
          </div>
        </div>
      </main>
      <SiteFooter variant="desktop" />
    </div>
  );
}

function Body({ id }: { id: ServiceId }) {
  const { service } = useDemoState();
  const searchParams = useSearchParams();
  const trusted = isTrusted(service(id)) || searchParams.get("verified") === "1";
  return <Page page={GNWT_SERVICE_PAGES[id]} trusted={trusted} />;
}

/** The unverified page is the first paint (and the prerendered HTML). */
export function GnwtServicePage({ id }: { id: ServiceId }) {
  return (
    <Suspense fallback={<Page page={GNWT_SERVICE_PAGES[id]} trusted={false} />}>
      <Body id={id} />
    </Suspense>
  );
}
