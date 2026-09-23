import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DemoStateProvider } from "@/lib/demo-state";
import { DemoNav } from "@/components/DemoNav";
import { DemoToast } from "@/components/ui/DemoToast";

/*
 * Lato, self-hosted from @fontsource/lato.
 * Google Fonts is unreachable from the build environment, and self-hosting
 * also means the deployed demo has no external font dependency on demo day.
 *
 * NOTE: Lato ships 100/300/400/700/900 — there is NO 500 (Medium). Figma
 * labels the stepper labels "Lato:Medium", which the real webfont cannot
 * provide. Mapped to 400 here; logged in design/token-exceptions.md.
 */
const lato = localFont({
  src: [
    { path: "./fonts/lato-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "./fonts/lato-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/lato-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-lato",
  display: "block",
});

/*
 * Montserrat, self-hosted from @fontsource/montserrat, exactly as Lato above.
 *
 * SIL Open Font License 1.1 (node_modules/@fontsource/montserrat/LICENSE) —
 * redistributable, so the woff2 files are committed under ./fonts/ and the
 * demo needs no network at all on stage. Same reason Lato is vendored: the
 * Google Fonts host is unreachable from the build environment, and an external
 * font request is a demo-day dependency nobody wants.
 *
 * THE YOTI ZONE ONLY — brief §11.1 and §11.9. This face must never reach the
 * MyGovNL / C1 chrome. It is not applied on <html>; it is exposed as the CSS
 * variable `--font-montserrat` and consumed by ONE rule, `.gnl-yoti-zone` in
 * globals.css, which `CidScreen` puts on the Yoti-owned body of NL-11..NL-19.
 * The top nav, wizard title, progress bar, sub-step pill and footer stay Lato,
 * which is the contrast §11.9 says to keep on purpose.
 *
 * ALL FOUR WEIGHTS ARE REAL, 400/500/600/700 — which is the point of doing
 * this. Lato ships no 500 and no 600, so until now every `Montserrat:Medium`
 * and `Montserrat:SemiBold` in the design collapsed to 400 / 700; those call
 * sites are restored to `font-medium` / `font-semibold` in the same change.
 * See design/token-exceptions.md §13.
 *
 * `display: block`, matching Lato: a swap would repaint the Yoti headings
 * mid-demo, and every frame in design/frames.json is measured after
 * `document.fonts.ready`.
 */
const montserrat = localFont({
  src: [
    { path: "./fonts/montserrat-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/montserrat-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/montserrat-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/montserrat-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-montserrat",
  display: "block",
});

export const metadata: Metadata = {
  title: "MyGovNL — Demo",
  description:
    "Interactive demo of CertifiO ID verification in the C1 service onboarding flow.",
  robots: { index: false, follow: false },
};

/*
 * width=device-width so a phone lays the page out at its real width instead of
 * the default 980px pretend-desktop. That is what makes the CSS breakpoints in
 * globals.css fire on a real device, not just in DevTools.
 *
 * maximumScale is deliberately left alone: pinch-to-zoom stays available,
 * which is an accessibility requirement.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/*
 * There is no scale script and no `suppressHydrationWarning` on <html>.
 *
 * Both existed to support the old scale-to-fit mechanism: an inline pre-paint
 * script set --gnl-scale / --gnl-mobile-scale as inline styles on <html>, the
 * server-rendered markup had no style attribute, and React reported a
 * mismatch. The layout is now plain CSS media queries (see globals.css), so
 * nothing mutates <html> before hydration and nothing needs suppressing —
 * which means a genuine hydration bug anywhere in the tree surfaces normally.
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lato.variable} ${montserrat.variable}`}>
      <body>
        <DemoStateProvider>
          <DemoNav />
          {children}
          {/*
           * "Not part of this demo" — brief §10.5 / §7.6 / §15.
           *
           * AT THE ROOT, AFTER `children`, ON PURPOSE. It is `position: fixed`
           * (globals.css), so it is out of flow and adds nothing to any page's
           * height — which is what lets ~30 inert controls across nineteen
           * frames become responsive without moving a single pixel of any of
           * them. Last in the DOM so its live-region announcement follows the
           * page content in reading order.
           *
           * It wires itself: one delegated listener on `[data-demo-inert]`,
           * no per-control handler and no markup change on the KEEP screens
           * that carry most of those controls. See DemoToast.
           */}
          <DemoToast />
        </DemoStateProvider>
      </body>
    </html>
  );
}
