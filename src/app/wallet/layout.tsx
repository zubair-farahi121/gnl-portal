import localFont from "next/font/local";

import { WalletToast } from "@/components/wallet/WalletToast";
import { WALLET_COLOR, WALLET_SIZE } from "@/lib/data/wallet-tokens";

/*
 * THE WALLET ZONE — every route under /wallet/ (W-01..W-09 of Flow 3, Figma
 * section 6343:84884). ADDED 2026-09-29; REWORKED the same day to
 * FLOW3_BRIEF.md §6 ("ONE PHONE FRAME").
 *
 * ====================================================================
 * INTER, SELF-HOSTED, AND ONLY HERE (brief §6 / §12 "works offline").
 * Vendored from @fontsource/inter (SIL OFL 1.1) into src/app/fonts/ and
 * loaded with next/font/local in THIS layout only, so Inter is only ever
 * downloaded on /wallet/ routes and no GNL page's CSS or preload list changes
 * — which is what keeps the 22 Flow A / Flow B baselines untouched.
 * Weights 300, 400, 500, 600, 700, 800, 900 (the brief lists 300/500/600/
 * 700/800/900; 400 is kept for the toast). `display: block`, as for the GNL
 * faces: a swap would repaint the Black headlines mid-demo.
 * ====================================================================
 */
const inter = localFont({
  src: [
    { path: "../fonts/inter-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/inter-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/inter-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/inter-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/inter-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/inter-latin-800-normal.woff2", weight: "800", style: "normal" },
    { path: "../fonts/inter-latin-900-normal.woff2", weight: "900", style: "normal" },
  ],
  display: "block",
});

/*
 * The wallet's only CSS rules — keyframes cannot be inline styles. Emitted
 * HERE so they exist only on wallet routes; every selector `gnl-wallet-`
 * prefixed. The brief's §8 "creative freedom" list, kept subtle and short:
 *
 *   push       screen enters from the right (~250 ms); `-back` the reverse
 *   scanline   W-02's mint line sweeping the viewfinder
 *   focus      W-02's simulated camera: a little blur that clears
 *   snap       W-02's "detected" pulse
 *   spin       W-06's 8-dot loader, rotating smoothly
 *   draw       W-08's check drawing in
 *   sms        W-07's notification banner sliding down
 *   newcard    W-09's new card sliding in + a soft highlight (~3 s)
 *   caret      W-07's blinking caret in the active code box
 *   toast      the wallet toast's rise-in
 *
 * `prefers-reduced-motion: reduce` (brief §8): every animation is removed,
 * so each element shows its END state at once. Timers that NAVIGATE (W-02
 * detect, W-06, W-07) still run — they are the story, not decoration.
 */
const WALLET_CSS = `
@keyframes gnl-wallet-push { from { transform: translateX(28px); opacity: .01; } to { transform: none; opacity: 1; } }
@keyframes gnl-wallet-push-back { from { transform: translateX(-28px); opacity: .01; } to { transform: none; opacity: 1; } }
.gnl-wallet-push { animation: gnl-wallet-push 250ms cubic-bezier(.2,.7,.2,1) both; }
.gnl-wallet-push[data-dir="back"] { animation-name: gnl-wallet-push-back; }
@keyframes gnl-wallet-scanline { 0%, 100% { transform: translateY(-110px); } 50% { transform: translateY(110px); } }
.gnl-wallet-scanline { animation: gnl-wallet-scanline 2s ease-in-out infinite; }
@keyframes gnl-wallet-focus { from { filter: blur(3px); } to { filter: blur(0); } }
.gnl-wallet-focus { animation: gnl-wallet-focus 1s ease-out both; }
@keyframes gnl-wallet-snap { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(134,206,186,.9); } 60% { transform: scale(1.04); box-shadow: 0 0 0 14px rgba(134,206,186,0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(134,206,186,0); } }
.gnl-wallet-snap { animation: gnl-wallet-snap 350ms ease-out both; }
@keyframes gnl-wallet-spin { to { transform: rotate(360deg); } }
.gnl-wallet-spin { animation: gnl-wallet-spin 1.1s linear infinite; }
@keyframes gnl-wallet-draw { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }
.gnl-wallet-draw { stroke-dasharray: 40; animation: gnl-wallet-draw 500ms 150ms ease-out both; }
@keyframes gnl-wallet-sms { from { transform: translateY(-120%); } to { transform: none; } }
.gnl-wallet-sms { animation: gnl-wallet-sms 350ms cubic-bezier(.2,.8,.2,1) both; }
@keyframes gnl-wallet-newcard { from { transform: translateY(-16px); opacity: 0; } to { transform: none; opacity: 1; } }
.gnl-wallet-newcard { animation: gnl-wallet-newcard 400ms ease-out both; }
.gnl-wallet-highlight { box-shadow: 0 0 0 3px #86ceba, 0 2px 8px rgba(0,0,0,0.07) !important; transition: box-shadow 600ms ease; }
@keyframes gnl-wallet-caret { 50% { opacity: 0; } }
.gnl-wallet-caret { animation: gnl-wallet-caret 1s steps(1) infinite; }
@keyframes gnl-wallet-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
.gnl-wallet-toast { animation: gnl-wallet-toast-in 150ms ease-out; }
@media (prefers-reduced-motion: reduce) {
  .gnl-wallet-push, .gnl-wallet-scanline, .gnl-wallet-focus, .gnl-wallet-snap, .gnl-wallet-spin,
  .gnl-wallet-draw, .gnl-wallet-sms, .gnl-wallet-newcard, .gnl-wallet-caret, .gnl-wallet-toast { animation: none; }
  .gnl-wallet-draw { stroke-dasharray: none; }
  .gnl-wallet-highlight { transition: none; }
}
`;

/*
 * ====================================================================
 * ONE PHONE FRAME (brief §6) — 393 x 852, radius 48, 1px #E6E8EF.
 *
 * The Figma frames mix widths (390 / 393), radii (32 / 48) and heights (long
 * screens drawn tall). The brief settles it: ONE frame for every screen; long
 * content scrolls INSIDE it (`data-wallet-scroll`). Brief §10 item 4.
 *
 * AT A VIEWPORT OF 430 px OR LESS the frame is dropped and the wallet goes
 * full screen (brief §6) — a real phone, the ~400 px phone-view popup, the
 * presenter stage's iframe. So the frame styles are all `min-[431px]:`; the
 * unprefixed styles ARE the full-screen phone. The status bar and home
 * indicator stay at every width: they are part of every Figma screen.
 *
 * A NOTE ON THE EARLIER DECISION. Earlier in this project the user rejected
 * drawing a phone bezel around the whole PORTAL, and the first Flow 3 build
 * extended that to the wallet ("two windows, no drawn phone"). FLOW3_BRIEF.md
 * is newer and asks for a frame around the WALLET MOCK only; the portal is
 * still never framed. Logged in DEMO_AUDIT.md "Flow 3".
 *
 * `relative` + `overflow-hidden` on the frame: the wallet toast and W-07's SMS
 * banner are positioned against THE PHONE, not the browser window.
 * ====================================================================
 */
export default function WalletLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${inter.className} flex h-[100dvh] w-full justify-center min-[431px]:items-center min-[431px]:py-[16px]`}
      style={{ background: WALLET_COLOR.backdrop, color: WALLET_COLOR.text, lineHeight: 1.5 }}
      data-wallet-zone="true"
    >
      <style>{WALLET_CSS}</style>
      <div
        className="relative flex h-[100dvh] w-full flex-col overflow-hidden min-[431px]:h-[min(852px,calc(100dvh-32px))] min-[431px]:w-[393px] min-[431px]:rounded-[48px] min-[431px]:border min-[431px]:border-solid"
        style={{ background: WALLET_COLOR.background, borderColor: WALLET_COLOR.line }}
        data-wallet-phone="true"
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain" data-wallet-scroll="true">
          {children}
        </div>

        {/* Home indicator — 140 x 5, #081010, radius 100, in a 34px strip at
            the bottom of the phone (every frame's HomeIndicatorWrap). Floats
            over the content, as on iOS; every screen reserves 34px for it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center"
          style={{ height: WALLET_SIZE.homeIndicatorArea }}
        >
          <span
            className="block rounded-[100px]"
            style={{
              width: WALLET_SIZE.homeIndicatorWidth,
              height: WALLET_SIZE.homeIndicatorHeight,
              background: WALLET_COLOR.text,
            }}
          />
        </div>

        <WalletToast />
      </div>
    </div>
  );
}
