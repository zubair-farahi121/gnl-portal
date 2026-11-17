/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { ASSETS } from "@/lib/assets";

/*
 * THE GNWT FOOTER — release-2 (2026-11-16).
 *
 * Replaces the GNL footer. Source: Figma file `Hfj015MPSmeRPYg72vZxTI`,
 * component `gnwt-footer` 11:22247 (desktop) and 27:69061 (mobile, 393),
 * cross-checked with GNWT's own design-system markup. Three parts, top to
 * bottom, with no gap between them:
 *
 *   1. the "Need help?" strip   #F3F8FC, 1px #E7F0F9, padding 16, in a block
 *                               with 48px above and below
 *   2. the wave                 gnwt-curve-in-motion, full width, 148 tall,
 *                               stretched (preserveAspectRatio="none")
 *   3. the navy band  #001F30   row 1: four bold links + the white logo,
 *                               1px white rule under it; row 2: copyright
 *                               (bold), Privacy Policy, eService Account Help
 *                               page (underlined)
 *
 * `variant` is kept from the GNL build so no caller changes: "desktop" is the
 * responsive footer (rows from 768px, stacked below), "mobile" is ALWAYS the
 * stacked layout, for the phone-width CertifiO ID column.
 *
 * The class strings are written out in full for both layouts (no string
 * building): Tailwind only generates the classes it can read in the source.
 *
 * The links are GNWT's real ones and open in a new tab — a footer link that
 * leaves the demo should not replace it.
 */

type Variant = "desktop" | "mobile";

const HELP_URL = "https://www.gov.nt.ca/en/nwt-eservices-portal-help";

const LINKS = [
  { label: "Phone Directory", href: "https://rdirectory.gov.nt.ca/rDirectory.aspx" },
  { label: "Terms of use", href: "https://gnwt.ca/terms-use" },
  { label: "Accessibility", href: "https://gnwt.ca/design-system/getting-started/accessibility" },
  { label: "News", href: "https://gnwt.ca/newsroom" },
] as const;

const EXT = { target: "_blank", rel: "noreferrer" } as const;

/** [responsive (rows from 768px), always stacked] */
const CLS = {
  container: ["gnwt-container", "gnwt-container !px-[16px]"],
  help: ["leading-none max-md:leading-[24px]", "leading-[24px]"],
  row1: [
    "flex-row items-center justify-between gap-[32px] pr-[16px] max-md:flex-col max-md:items-stretch max-md:gap-0 max-md:pr-0",
    "flex-col items-stretch",
  ],
  links: ["max-md:border-b max-md:border-solid max-md:border-white max-md:pb-[32px]", "border-b border-solid border-white pb-[32px]"],
  logo: [
    "h-[27.71px] w-[175.98px] max-md:mt-[32px] max-md:h-[30.23px] max-md:w-[191.99px] max-md:self-end",
    "mt-[32px] h-[30.23px] w-[191.99px] self-end",
  ],
  row2: ["gap-[24px] text-[16px] max-md:gap-x-[48px] max-md:gap-y-[16px] max-md:text-[14px]", "gap-x-[48px] gap-y-[16px] text-[14px]"],
} as const;

export function SiteFooter({ variant }: { variant: Variant }) {
  const i = variant === "mobile" ? 1 : 0;

  return (
    <footer className="w-full shrink-0" data-gnwt-footer={variant}>
      <div className={`${CLS.container[i]} py-[48px]`}>
        <p
          className={`border border-solid border-[#e7f0f9] bg-[#f3f8fc] p-[16px] text-[16px] font-normal text-[#4e5760] ${CLS.help[i]}`}
          data-gnwt-need-help="true"
        >
          Need help?{" "}
          <a href={HELP_URL} {...EXT} className="text-[#005d8f] underline hover:text-[#001f30]">
            Find your answers at the Northwest Territories eService Account Help
          </a>
          <span className="text-[#005d8f]">.</span>
        </p>
      </div>

      <img alt="" src={ASSETS.gnwtWave} className="-mb-px block h-[148px] w-full max-w-none" />

      <div className="bg-[#001f30] py-[32px] text-white">
        <div className={CLS.container[i]}>
          <div className={`flex border-b border-solid border-white pb-[32px] ${CLS.row1[i]}`}>
            <nav aria-label="Footer" className={`flex flex-wrap gap-x-[48px] gap-y-[16px] text-[16px] font-bold leading-none ${CLS.links[i]}`}>
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} {...EXT} className="whitespace-nowrap text-white no-underline hover:underline">
                  {l.label}
                </a>
              ))}
            </nav>
            <img alt="Government of Northwest Territories" src={ASSETS.gnwtFooterLogo} className={`block max-w-none shrink-0 ${CLS.logo[i]}`} />
          </div>
          <div className={`flex flex-wrap items-center pt-[32px] pr-[16px] leading-none ${CLS.row2[i]}`}>
            <span className="font-bold">© 2026 Portage CyberTech. All rights reserved.</span>
            <a href="https://www.portagecybertech.com/en/privacy-policy" {...EXT} className="font-normal text-white no-underline hover:underline">
              Privacy Policy
            </a>
            <a href="https://www.gov.nt.ca/en/nwt-eservices-portal-help-page" {...EXT} className="font-normal text-white underline">
              eService Account Help page
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
