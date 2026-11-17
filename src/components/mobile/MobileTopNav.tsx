import { GnwtHeader } from "@/components/chrome/TopNav";

/*
 * The GNWT header at phone width (Figma 26:68888, 393 x 65): logo 150 wide,
 * "FR", a search icon and "Menu". ALWAYS the phone layout, whatever the
 * window's width — the CertifiO ID screens are a phone-width column even on a
 * laptop. release-2, 2026-11-16; it replaces the GNL mobile nav.
 */
export function MobileTopNav() {
  return <GnwtHeader authenticated compact />;
}
