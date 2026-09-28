"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ASSETS } from "@/lib/assets";
import { isTrusted, useDemoState } from "@/lib/demo-state";
import {
  BREADCRUMB,
  DATA_PRIVACY_CARD,
  FAVOURITE_CARD,
  SERVICE_HEADER,
  SERVICE_HEADER_VERIFIED,
  VERIFICATION_CARD,
} from "@/lib/data/driver-vehicle";
import {
  STUDENTAID_CONTACT,
  STUDENTAID_PORTAL_ROW,
  STUDENTAID_SCOPES,
  type StudentAidScope,
} from "@/lib/data/studentaid";
import {
  serviceRoutes,
  type ServiceConfig,
  type ServiceId,
} from "@/lib/data/service-config";

/* =========================================================================
 * THE STUDENTAIDNL SERVICE PAGE — PP-03 (Figma 6206:25424, 1440 x 1469.215)
 * and its derived Trusted state PP-23 (NOT IN FIGMA). ADDED 2026-09-28.
 *
 * Rendered by src/app/services/[serviceId]/page.tsx at /services/studentaid/.
 *
 * ====================================================================
 * WHY THIS IS NOT FLOW A's SERVICE PAGE WITH A PROP — THE ONE SCREEN THAT
 * DID NOT FOLLOW THE CID PATTERN, AND WHY.
 *
 * Every other Flow B desktop screen is Flow A's screen with the service as a
 * prop (src/components/onboarding/screens/). This one is a separate component,
 * because the two frames are not the same design with different strings:
 *
 *                     NL-03 / NL-25 (6031:6244 / 6257:72314)   PP-03 (6206:25424)
 *   left column       verification card                         + the locked portal row
 *   Trusted state     Actions card + four linked-item cards     portal row, unlocked (§9)
 *   scopes            4 rows, 16px icons, 14px text, gap 12     7 rows, 18px icons, 16px, gap 14
 *   scopes title      14px Bold                                 16px Bold
 *   contact card      one phone link                            division, postal block,
 *                                                               phone, email — 374px tall
 *
 * Flow A's page is two frozen baselines (`service`, `service-verified`) whose
 * Trusted half is 400 lines of Flow-A-only data. Threading PP-03 through it
 * would put both baselines at risk to add a fork at every block; the brief
 * asked for correctness over breadth. So what the two pages SHARE is shared
 * at the data level instead: every string that is the same on both frames —
 * breadcrumb, both badge labels, the verification card, Data & Privacy, the
 * favourite card — is imported from src/lib/data/driver-vehicle.ts, and the
 * card chrome / type classes below are the same literals Flow A's page uses.
 * Flow A's file is untouched.
 * ====================================================================
 *
 * Geometry, verbatim from get_metadata on 6206:25424 and get_design_context on
 * 6206:26628 / 6206:25474 (read 2026-09-28, read-only):
 *   top-nav actions    1440 x 69       at y=0
 *   main-container     1440 x 1260     at y=69       (6206:25426)
 *     content-left      860 x 528      at x=80, y=48   gap-[24px]
 *       breadcrumb-row  120 x 17       at y=0
 *       title-badge-row 860 x 48       at y=41   "StudentAidNL" 202 wide, badge at 218
 *       service-subtitle 860 x 24      at y=113
 *       verification-card 860 x 283    at y=161
 *       studentaid-portal-bar 860 x 60 at y=468  (6206:26615)
 *     sidebar-right     380 x 1132     at x=980, y=48  gap-[20px]
 *       favourite-card  380 x 64       at y=0
 *       data-privacy-card 380 x 654    at y=84
 *       contact-card    380 x 374      at y=758
 *   footer verified    1440 x 140.215  at y=1329
 * 48 + 1132 + 80 = 1260 — the SIDEBAR sets the height here, not content-left,
 * so the main is not pinned: its padding and the sidebar reproduce 1260.
 *
 * THE SUBTITLE IS §10.1's, NOT FIGMA's. 6206:25439 still says "View and manage
 * your driver and vehicle services" (a copy-paste leftover); the config
 * carries the fix.
 *
 * ------------------------------------------------------------------------
 * PP-23 — TRUSTED. NOT IN FIGMA; DERIVED FROM §9, and the highest invention
 * risk in the demo (DEMO_AUDIT.md PP-23): "PP-03 layout, badge '✓ Trusted', no
 * verification card. The portal row becomes an unlocked white link row:
 * #004b87 label + external-link icon, no 'Action locked'. Sidebar unchanged;
 * the row shows the toast."
 *
 * What was INVENTED to satisfy that, each the smallest step from a measured
 * value:
 *   badge      Flow A's green Trusted pill (6257:72322), unchanged.
 *   row        the SAME 860 x 60 box, radius and #d0d5dd stroke as the locked
 *              row, on white; label underlined like every other link in the
 *              portal; the 24px lock slot holds a 20px external-link glyph
 *              (the one "Book an appointment" uses on NL-25).
 *   node ids   none on the derived badge and row — claiming PP-03's ids for
 *              something PP-03 does not draw would be inventing provenance
 *              (ConfirmDetailsCard's rule for NL-06).
 * ------------------------------------------------------------------------
 *
 * STATE: "Confirmation required" until `onboarded`, then "Trusted" — §12.2,
 * read from the `gnl-demo:v1` store for THIS service (`studentaid`), so it
 * survives a refresh and is independent of Driver and Vehicle's state.
 * `?verified=1` is kept as the presenter deep-link, as on Flow A. Same
 * hydration rule as Flow A's page: the store is empty on first paint, so the
 * prerendered HTML is the unverified page and Trusted appears after mount.
 *
 * RESPONSIVE: Flow A's ladder, reused literally — `.gnl-gutter`, columns stack
 * at <= 1024, cards full width. Two additions for PP-03's own content: the
 * portal row lets its 24px label wrap and steps its type down below 768 (at
 * 320 "Access the StudentAid Portal" at 24px is wider than the whole row), and
 * the scope and contact rows wrap inside their 18px-icon hanging indent.
 * ========================================================================= */

/** The per-service content this layout needs. Only StudentAidNL has it. */
type ServicePageContent = {
  scopes: readonly StudentAidScope[];
  contact: typeof STUDENTAID_CONTACT;
  portalRow: typeof STUDENTAID_PORTAL_ROW;
};

const CONTENT: Partial<Record<ServiceId, ServicePageContent>> = {
  studentaid: {
    scopes: STUDENTAID_SCOPES,
    contact: STUDENTAID_CONTACT,
    portalRow: STUDENTAID_PORTAL_ROW,
  },
};

/**
 * Loud, like `toServiceId`: a service routed here without content would
 * otherwise prerender an empty page. At build time this is a failed build.
 */
function contentFor(id: ServiceId): ServicePageContent {
  const c = CONTENT[id];
  if (!c) throw new Error(`No service-page content for ${id}`);
  return c;
}

/* --- Class literals shared, character for character, with Flow A's page. --- */

/** main-container. Flow A's MAIN — see the RESPONSIVE block on that page. */
const MAIN =
  "gnl-gutter [--gnl-gutter:80px] box-border flex w-full items-start gap-[40px] pt-[48px] pb-[80px] max-[1439px]:h-auto max-[1024px]:flex-col max-[1024px]:gap-[32px] max-md:pt-[32px] max-md:pb-[48px]";
const CONTENT_LEFT =
  "flex w-[860px] shrink-0 flex-col items-start gap-[24px] max-[1439px]:min-w-px max-[1439px]:shrink max-[1024px]:w-full";
const TITLE_ROW =
  "flex w-full shrink-0 items-center gap-[16px] max-[1439px]:flex-wrap";
const LINK =
  "text-[14px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]";
/** Card chrome: #d4d8da stroke drawn INSIDE the box, as Figma draws it. */
const CARD = "w-full rounded-[6px] bg-white shadow-[inset_0_0_0_1px_#d4d8da]";

/**
 * The portal row's box. §9: "860x60, #eeeeee, border #d0d5dd, radius 6". The
 * stroke is an inset shadow for the same reason CARD's is. `min-h` rather than
 * `h`, so the label can wrap on a phone instead of overflowing.
 */
const PORTAL_ROW =
  "box-border flex min-h-[60px] w-full shrink-0 items-center justify-between gap-[16px] rounded-[6px] px-[16px] py-[8px] text-left shadow-[inset_0_0_0_1px_#d0d5dd]";

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

/** An 18px icon slot, as every row in PP-03's sidebar draws one. */
function Icon18({ src }: { src: string }) {
  return (
    <div className="relative size-[18px] shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img alt="" className="absolute inset-0 block size-full max-w-none" src={src} />
    </div>
  );
}

function TitleRow({ title, trusted }: { title: string; trusted: boolean }) {
  return (
    /* title-badge-row 6206:25430 */
    <div className={TITLE_ROW} data-node-id="6206:25430">
      <p
        className="shrink-0 whitespace-nowrap text-[32px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)]"
        data-node-id="6206:25431"
      >
        {title}
      </p>

      {trusted ? (
        /* PP-23: Flow A's green Trusted pill, unchanged (6257:72322's classes). */
        <div className="flex shrink-0 items-center gap-[6px] rounded-[100px] bg-[#45ab8e] px-[12px] py-[6px]">
          <div className="relative size-[12px] shrink-0">
            <div className="absolute inset-[0_0_0_-1.13%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="block size-full max-w-none" src={ASSETS.iconSuccessCheck} />
            </div>
          </div>
          <p className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[1.5] text-white">
            {SERVICE_HEADER_VERIFIED.badgeLabel}
          </p>
        </div>
      ) : (
        /* badge-confirmation 6206:25432 — the red pill, as NL-03's. */
        <div
          className="flex shrink-0 items-center gap-[6px] rounded-[100px] bg-[#e8706f] px-[12px] py-[6px]"
          data-node-id="6206:25432"
        >
          <div className="relative size-[12px] shrink-0" data-node-id="6206:25433">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconLock} />
          </div>
          <p
            className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[1.5] text-[color:var(--gnl-surface,#ffffff)]"
            data-node-id="6206:25435"
          >
            {SERVICE_HEADER.badgeLabel}
          </p>
        </div>
      )}

      {/* notification-bell-container 6206:25436 — inert -> toast, as on NL-03. */}
      <div
        className="flex size-[32px] shrink-0 cursor-default flex-col items-center justify-center rounded-[100px] bg-[#eaecef] select-none"
        data-node-id="6206:25436"
        data-demo-inert="true"
        aria-disabled="true"
      >
        <div className="relative size-[16px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconBellAlert} />
        </div>
      </div>
    </div>
  );
}

/**
 * studentaid-portal-bar 6206:26615 (locked) / derived (PP-23, unlocked).
 *
 * BOTH STATES ARE `data-demo-inert` -> "Not part of this demo". The locked row
 * because it is locked; the unlocked row because the StudentAid Portal is an
 * external system this demo does not contain — §9: "the row shows the toast".
 * The unlocked row is a real <button>, so it is keyboard-operable (the toast
 * listener is delegated on `click`, which Enter and Space dispatch).
 */
function PortalRow({ row, trusted }: { row: ServicePageContent["portalRow"]; trusted: boolean }) {
  /* §9: label Medium 24 #212326 / "Action locked" Medium 20 #5f6368. Lato ships
     no 500, so Medium renders at 400, as everywhere else in this build. Both
     step down below 768 — at 320 the 24px label alone is wider than the row. */
  const label = "min-w-px flex-1 text-[24px] font-normal leading-[normal] [word-break:break-word] max-md:text-[20px] max-xs:text-[18px]";

  if (trusted) {
    return (
      <button type="button" className={`${PORTAL_ROW} bg-white`} data-demo-inert="true">
        <span
          className={`${label} text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font]`}
        >
          {row.label}
        </span>
        <span className="relative size-[20px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconExternalLink} />
        </span>
      </button>
    );
  }

  return (
    <div
      className={`${PORTAL_ROW} cursor-default bg-[#eeeeee] select-none`}
      data-node-id={row.nodeId}
      data-demo-inert="true"
      aria-disabled="true"
    >
      <p className={`${label} text-[#212326]`} data-node-id="6206:26616">
        {row.label}
      </p>
      {/* lock-indicator 6206:26617 — gap 6 (121 + 6 = 127, the lock's x). */}
      <div className="flex shrink-0 items-center gap-[6px]" data-node-id="6206:26617">
        <p
          className="shrink-0 whitespace-nowrap text-[20px] font-normal leading-[normal] text-[#5f6368] max-md:text-[16px]"
          data-node-id="6206:26618"
        >
          {row.lockedLabel}
        </p>
        <div className="relative size-[24px] shrink-0" data-node-id="6206:26620">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconLock24} />
        </div>
      </div>
    </div>
  );
}

function ContentLeft({
  service,
  content,
  trusted,
}: {
  service: ServiceConfig;
  content: ServicePageContent;
  trusted: boolean;
}) {
  return (
    <div className={CONTENT_LEFT} data-node-id="6206:25427">
      {/* breadcrumb-row 6206:25428 — to the demo's dashboard, as on NL-03. */}
      <div className="flex shrink-0 items-center" data-node-id="6206:25428">
        <Link className={`${LINK} whitespace-nowrap`} href={BREADCRUMB.href} data-node-id="6206:25429">
          {BREADCRUMB.label}
        </Link>
      </div>

      <TitleRow title={service.title} trusted={trusted} />

      {/* service-subtitle 6206:25439 — §10.1 copy, from the config. */}
      <p
        className="w-full shrink-0 text-[16px] font-normal leading-[1.5] text-[#212326] [word-break:break-word]"
        data-node-id="6206:25439"
      >
        {service.subtitle}
      </p>

      {/* verification-card 6206:25440 — NL-03's card, same classes and copy.
          PP-23 drops it: §9 "no verification card". */}
      {trusted ? null : (
        <div
          className={`${CARD} box-border flex shrink-0 flex-col items-center justify-center gap-[32px] p-[48px] [filter:drop-shadow(0px_2px_4px_rgba(0,0,0,0.03))] max-md:gap-[24px] max-md:p-[32px] max-xs:p-[24px]`}
          data-node-id="6206:25440"
        >
          <p
            className="w-full shrink-0 text-center text-[24px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
            data-node-id="6206:25441"
          >
            {VERIFICATION_CARD.title}
          </p>
          <p
            className="w-full shrink-0 text-center text-[15px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]"
            data-node-id="6206:25442"
          >
            {VERIFICATION_CARD.body}
          </p>
          {/* OnboardButton 6206:25443 -> THIS service's Summary (PP-04). */}
          <Link
            className="box-border inline-flex shrink-0 items-center justify-center overflow-clip rounded-[4px] bg-[#243746] px-[28px] py-[10px] text-[14px] font-bold leading-[normal] text-white"
            href={serviceRoutes(service.id).summary}
            data-node-id="6206:25443"
          >
            {VERIFICATION_CARD.ctaLabel}
          </Link>
        </div>
      )}

      <PortalRow row={content.portalRow} trusted={trusted} />
    </div>
  );
}

function SidebarRight({ content }: { content: ServicePageContent }) {
  const { contact } = content;
  return (
    <div
      className="flex w-[380px] shrink-0 flex-col items-start gap-[20px] max-[1024px]:w-full"
      data-node-id="6206:25445"
    >
      {/* favourite-card 6206:25446 — inert, as on NL-03. */}
      <div
        className={`${CARD} box-border flex shrink-0 cursor-default items-center justify-between p-[20px] select-none`}
        data-node-id="6206:25446"
        data-demo-inert="true"
        aria-disabled="true"
      >
        <p className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[1.5] text-[#5f6368]">
          {FAVOURITE_CARD.label}
        </p>
        <div className="relative size-[20px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.iconStar} />
        </div>
      </div>

      {/* data-privacy-card 6206:25450 — 654 tall:
          24 + 27 + 16 + 176 + 16 + 0 + 16 + 48 + 16 + 242 + 16 + 0 + 16 + 17 + 24. */}
      <div
        className={`${CARD} box-border flex shrink-0 flex-col items-start gap-[16px] p-[24px]`}
        data-node-id="6206:25450"
      >
        <p className="w-full shrink-0 text-[18px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]">
          {DATA_PRIVACY_CARD.title}
        </p>
        <p className="w-full shrink-0 text-[14px] font-normal leading-[22px] text-[#5f6368] [word-break:break-word]">
          {DATA_PRIVACY_CARD.body}
        </p>

        <DividerLine nodeId="6206:25453" />

        {/* 16px here (48 = two 24px lines), where NL-03 draws the same
            sentence at 14px. Measured, not harmonised. */}
        <p
          className="w-full shrink-0 text-[16px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]"
          data-node-id="6206:25454"
        >
          {DATA_PRIVACY_CARD.scopesTitle}
        </p>

        {/* consent-list 6206:26628 — gap 14, 18px icons 12px from the text,
            16px Lato:Medium (-> 400). */}
        <ul className="flex w-full shrink-0 list-none flex-col items-start gap-[14px] p-0" data-node-id="6206:26628">
          {content.scopes.map((scope) => (
            <li
              key={scope.label}
              className={`flex w-full gap-[12px] ${scope.multiline ? "items-start" : "items-center"}`}
              data-node-id={scope.nodeId}
            >
              <Icon18 src={scope.icon} />
              <p
                className={`min-w-px flex-1 text-[16px] font-normal text-[#5f6368] [word-break:break-word] ${
                  scope.multiline ? "leading-[1.3]" : "leading-[normal]"
                }`}
              >
                {scope.label}
              </p>
            </li>
          ))}
        </ul>

        <DividerLine nodeId="6206:25472" />

        <a
          className={`${LINK} block shrink-0 whitespace-nowrap`}
          href={DATA_PRIVACY_CARD.termsHref}
          target="_blank"
          rel="noreferrer"
          data-node-id="6206:25473"
        >
          {DATA_PRIVACY_CARD.termsLabel}
        </a>
      </div>

      {/* contact-card 6206:25474 — 20 + 24 + 12 + 298 + 20 = 374. */}
      <div
        className={`${CARD} box-border flex shrink-0 flex-col items-start gap-[12px] p-[20px]`}
        data-node-id="6206:25474"
      >
        <p className="w-full shrink-0 text-[16px] font-bold leading-[1.5] text-[#5f6368] [word-break:break-word]">
          {contact.title}
        </p>

        {/* contact-details 6206:26684 — gap 18. Text is 16px Lato:Medium
            (-> 400) on a 1.4 line-height, #5f6368. */}
        <div className="flex w-full shrink-0 flex-col items-start gap-[18px]" data-node-id="6206:26684">
          {/* 6206:26685 — building icon + the division's name. */}
          <div className="flex w-full items-start gap-[12px]" data-node-id="6206:26685">
            <Icon18 src={ASSETS.iconBank} />
            <p
              className="min-w-px flex-1 text-[16px] font-normal leading-[1.4] text-[#5f6368] [word-break:break-word]"
              data-node-id={contact.division.nodeId}
            >
              {contact.division.text}
            </p>
          </div>

          {/* 6206:26689 — the postal block, five lines, gap 2. Figma's icon is
              `Dollar sign_envelope`; the vendored envelope stands in for it. */}
          <div className="flex w-full items-start gap-[12px]" data-node-id="6206:26689">
            <Icon18 src={ASSETS.iconMail} />
            <address
              className="flex min-w-px flex-1 flex-col items-start gap-[2px] text-[16px] font-normal not-italic leading-[1.4] text-[#5f6368] [word-break:break-word]"
              data-node-id="6206:26692"
            >
              {contact.addressLines.map((line) => (
                <span key={line.nodeId} className="w-full" data-node-id={line.nodeId}>
                  {line.text}
                </span>
              ))}
            </address>
          </div>

          {/* 6206:26698 — phone: Bold #004b87, NOT underlined in Figma. A real
              `tel:` link, as Flow A's contact card makes its number. */}
          <div className="flex w-full items-center gap-[12px]" data-node-id="6206:26698">
            <Icon18 src={ASSETS.iconPhone} />
            <a
              className="min-w-px flex-1 text-[16px] font-bold leading-[normal] text-[#004b87] [word-break:break-word]"
              href={contact.phoneHref}
              data-node-id="6206:26701"
            >
              {contact.phoneLabel}
            </a>
          </div>

          {/* 6206:26702 — email: underlined link in Figma (`mailto:`). Inert
              here -> toast; see STUDENTAID_CONTACT for why it is not a mailto. */}
          <div className="flex w-full items-center gap-[12px]" data-node-id="6206:26702">
            <Icon18 src={ASSETS.iconMail} />
            <button
              type="button"
              data-demo-inert="true"
              className="min-w-px flex-1 text-left text-[16px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-underline-position:from-font] [word-break:break-word]"
              data-node-id="6206:26705"
            >
              {contact.email}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Page({ service, trusted }: { service: ServiceConfig; trusted: boolean }) {
  const content = contentFor(service.id);
  return (
    <div className="gnl-desktop-shell" data-verified={trusted ? "1" : "0"}>
      <TopNav />
      {/* main-container 6206:25426 */}
      <main className={MAIN} data-node-id="6206:25426">
        <ContentLeft service={service} content={content} trusted={trusted} />
        <SidebarRight content={content} />
      </main>
      <SiteFooter variant="desktop" />
    </div>
  );
}

function ServicePageBody({ service }: { service: ServiceConfig }) {
  /* THIS service's record — `studentaid` — never Driver and Vehicle's. */
  const { service: stateOf } = useDemoState();
  const verified = isTrusted(stateOf(service.id));
  /* The presenter deep-link, as on Flow A. Under static export
     useSearchParams() needs the Suspense boundary below. */
  const searchParams = useSearchParams();
  const trusted = verified || searchParams.get("verified") === "1";
  return <Page service={service} trusted={trusted} />;
}

export function ServicePageScreen({ service }: { service: ServiceConfig }) {
  /* The fallback is the unverified page — the correct first paint, so the
     prerendered HTML already matches what a first-time visitor sees. */
  return (
    <Suspense fallback={<Page service={service} trusted={false} />}>
      <ServicePageBody service={service} />
    </Suspense>
  );
}
