import Link from "next/link";
import { ASSETS } from "@/lib/assets";

/*
 * "footer verified" — one Figma component at two sizes.
 *   desktop  6031:5972  1440 x 140.215
 *   mobile   6039:9695   393 x 265.81   (the `Device=Mobile` variant)
 *
 * RE-CHECKED 2026-09-22 against 6039:9695 while re-syncing the CID frames. The
 * mobile variant is unchanged by that rework and already matches this code
 * node for node: crest (99.214 x 49.811) → Services / Notifications / Account
 * at gap-[24px] → the wrapping utility row at gap-[8px] px-[16px], all inside
 * bg-[#64717c] px-[16px] pt-[24px] pb-[32px] gap-[24px], items-center,
 * justify-end. It carries NO "Need help? … digitalgovernment@gov.nl.ca" line —
 * that belongs to the desktop variant only, and always has here. Nothing moved.
 *
 * Heights are pinned explicitly. The desktop footer is 140.215px, not 140 —
 * sub-pixel heights compound down an 1880px page and push everything below it
 * out of alignment against the baseline.
 *
 * Height derivations (both match the Figma frame exactly):
 *   desktop  24 (pt) + 36.215 (crest) + 24 (gap) + 24 (links) + 32 (pb) = 140.215
 *   mobile   24 + 49.811 + 24 + 24 + 24 + 88 (3 wrapped link lines) + 32 = 265.81
 */

type Variant = "desktop" | "mobile";

/**
 * The GNL crest. Two stacked SVG leaves inside one box, positioned with the
 * exact percentage insets from Figma so the composite scales correctly between
 * the desktop (72.134 x 36.215) and mobile (99.214 x 49.811) sizes.
 */
function GnlCrest({ className }: { className: string }) {
  return (
    <div className={`relative shrink-0 overflow-clip ${className}`} data-node-id="6011:775">
      <div className="absolute inset-[0_36.61%_18.23%_0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.gnlCrestFlowers} />
      </div>
      <div className="absolute inset-[30.74%_0_0.72%_0.08%]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.gnlCrestWordmark} />
      </div>
    </div>
  );
}

const UTILITY_LINK =
  "block whitespace-nowrap text-center text-[12px] leading-[24px] text-[#e0e4e6] underline [text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid decoration-from-font";

/** 6039:8960 row. One class string, so the wired and inert rows are identical. */
const MOBILE_PRIMARY_LINK =
  "shrink-0 whitespace-nowrap text-center text-[12px] font-bold leading-[24px] text-white";

/**
 * Only `Services` has a demo screen behind it. The other two keep their
 * markup and are marked inert rather than pointed at a route that does not
 * exist.
 */
const MOBILE_PRIMARY_LINKS: readonly { label: string; href?: string }[] = [
  { label: "Services", href: "/dashboard/" },
  { label: "Notifications" },
  { label: "Account" },
];

function ContactUs() {
  return (
    <a className={UTILITY_LINK} href="https://www.gov.nl.ca/feedback/mygovnl-contact-form/" target="_blank" rel="noreferrer">
      Contact us
    </a>
  );
}

function VisitGovNl() {
  return (
    <a className={UTILITY_LINK} href="https://gov.nl.ca" target="_blank" rel="noreferrer">
      Visit gov.nl.ca
    </a>
  );
}

function Disclaimer() {
  return (
    <a className={UTILITY_LINK} href="https://www.gov.nl.ca/disclaimer/" target="_blank" rel="noreferrer">
      Disclaimer / Copyright / Privacy statement
    </a>
  );
}

/*
 * RESPONSIVE (desktop variant):
 *   >= 768   exactly as designed — one 140.215px row, two centred lines.
 *    < 768   the pinned height is released (`h-auto`, with the design height
 *            kept as `min-h`) and both inner rows wrap. The crest/help line
 *            becomes a centred column, the utility links wrap to as many lines
 *            as they need, and their design `whitespace-nowrap` is released so
 *            the long Disclaimer label can break rather than push the page
 *            wider than the screen.
 */
function DesktopFooter() {
  return (
    <footer
      /*
       * `gnl-bleed` carries the grey band to the edges of a monitor wider
       * than the 1440 shell; the content stays inside the cap. Without it the
       * footer ended at 1440 with white to either side, so the page looked
       * boxed. Inert at <= 1440 — see .gnl-bleed in globals.css. No
       * `--gnl-bleed-line`: this footer has no bottom rule.
       */
      className="gnl-bleed [--gnl-bleed-bg:#64717c] flex h-[140.215px] w-full max-w-[1440px] flex-col items-center justify-center gap-[24px] bg-[#64717c] pt-[24px] pb-[32px] pl-px max-md:h-auto max-md:min-h-[140.215px] max-md:gap-[16px] max-md:px-[16px]"
      data-node-id="6031:5972"
    >
      {/* UL 4002:483 — crest and help links, bottom-aligned */}
      <div className="flex shrink-0 items-end gap-[12px] max-md:flex-col max-md:items-center max-md:gap-[8px] max-md:text-center">
        <GnlCrest className="h-[36.215px] w-[72.134px]" />
        <p className="shrink-0 whitespace-nowrap text-center text-[12px] font-bold leading-[24px] text-white">
          Need help?
        </p>
        <p className="shrink-0 text-center text-[12px] leading-[24px] font-normal whitespace-nowrap text-white max-md:whitespace-normal">
          {"Contact us at "}
          <a
            className="underline decoration-solid decoration-from-font [text-underline-position:from-font]"
            href="mailto:digitalgovernment@gov.nl.ca"
            target="_blank"
            rel="noreferrer"
          >
            digitalgovernment@gov.nl.ca
          </a>
        </p>
      </div>

      {/* 6011:2216 — utility links */}
      <div className="flex shrink-0 items-center gap-[32px] max-md:w-full max-md:flex-wrap max-md:justify-center max-md:gap-x-[16px] max-md:gap-y-[4px] max-md:[&_a]:whitespace-normal">
        <ContactUs />
        <VisitGovNl />
        <Disclaimer />
      </div>
    </footer>
  );
}

/*
 * RESPONSIVE (mobile variant). This one's design width is 393, not 1440, so
 * 393 is the width that must not move — `max-xxs:` (< 384) is its equivalent
 * of `max-md:` on a desktop component. See the breakpoint note in globals.css.
 *   >= 384   exactly as designed, pinned to 265.81px.
 *    < 384   height released to `auto` (design height kept as `min-h`) and the
 *            utility labels allowed to break, so a 320px phone gets a fourth
 *            link line instead of a horizontal scrollbar.
 * `w-[393px]` -> `w-full`: the shell caps the column at 480.
 */
function MobileFooter() {
  return (
    <footer
      className="flex h-[265.81px] w-full flex-col items-center justify-end gap-[24px] bg-[#64717c] px-[16px] pt-[24px] pb-[32px] max-xxs:h-auto max-xxs:min-h-[265.81px]"
      data-node-id="6039:9695"
    >
      {/* UL 6039:8958 */}
      <div className="flex w-full shrink-0 items-start justify-center">
        <GnlCrest className="h-[49.811px] w-[99.214px]" />
      </div>

      {/* 6039:8960 — primary links */}
      <div className="flex shrink-0 items-start gap-[24px]">
        {MOBILE_PRIMARY_LINKS.map(({ label, href }) =>
          href ? (
            <Link key={label} href={href} className={MOBILE_PRIMARY_LINK}>
              {label}
            </Link>
          ) : (
            /* No Notifications or Account screen exists in the demo. */
            <p
              key={label}
              className={`${MOBILE_PRIMARY_LINK} cursor-default select-none`}
              data-demo-inert="true"
              aria-disabled="true"
            >
              {label}
            </p>
          ),
        )}
      </div>

      {/* 6039:8967 — utility links, wrap to three lines at 393px */}
      <div className="flex w-full shrink-0 flex-wrap content-center items-center justify-center gap-[8px] px-[16px] max-xxs:px-0 max-xxs:[&_a]:whitespace-normal">
        <ContactUs />
        <VisitGovNl />
        <Disclaimer />
        <a
          className={UTILITY_LINK}
          href="https://gnl.qa.citizenone.ca/en/global_policy"
          target="_blank"
          rel="noreferrer"
        >
          Terms and Conditions
        </a>
      </div>
    </footer>
  );
}

export function SiteFooter({ variant }: { variant: Variant }) {
  return variant === "desktop" ? <DesktopFooter /> : <MobileFooter />;
}
