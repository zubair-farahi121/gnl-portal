import { GnwtHeader } from "@/components/chrome/TopNav";

/*
 * The signed-OUT GNWT header (Figma 11:24816): the same bar as the signed-in
 * one without the user button — logo, "Français", search, "Menu". Used by the
 * login page. release-2, 2026-11-16; it replaces the GNL login header
 * (Newfoundland and Labrador + MyGovNL logos on a navy band).
 */
export function LoginHeader() {
  return <GnwtHeader authenticated={false} />;
}
