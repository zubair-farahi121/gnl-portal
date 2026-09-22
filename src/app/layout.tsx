import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { DemoStateProvider } from "@/lib/demo-state";
import { DemoNav } from "@/components/DemoNav";

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
    <html lang="en" className={lato.variable}>
      <body>
        <DemoStateProvider>
          <DemoNav />
          {children}
        </DemoStateProvider>
      </body>
    </html>
  );
}
