import Link from "next/link";

import { WalletCardCount, WalletScreen } from "@/components/wallet/WalletClient";
import { WalletMenuButton, WalletQrGlyph, WalletUserGlyph } from "@/components/wallet/WalletGlyphs";
import { IconChevron, WalletStatusBar } from "@/components/wallet/WalletUi";
import { WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_SIZE, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-01 — wallet home, "Hello, Jason!". Figma 6288:59109 (393 x 874,
 * `wallet-home-wireframe`). ADDED 2026-09-29; REWORKED to FLOW3_BRIEF.md §7.
 *
 * Where the phone-view window starts (clicking the QR on F3-02 opens it).
 *
 * GEOMETRY (flow3_style_reference.txt, W-01):
 *   top-content      #F3F5FB, bottom corners r-40, pb-24
 *     status-bar     56 tall, 12/32/24 — the "home" variant
 *     menu-row       px-16 pb-16: the menu button, then the greeting (900 36)
 *     greeting-group px-16, gap 24: subtitle (300 16, 70 %), the two quick-
 *                    action cards (140 tall, gap 16), the help link
 *   credentials      py-40 px-24, gap 24: two 77 px list cards
 *
 * WHAT EACH CONTROL DOES (brief §7 W-01 — no dead ends):
 *   Scan card        -> W-02
 *   Present card     -> wallet toast
 *   help link        -> wallet toast
 *   "Today" card     -> wallet toast (HIDDEN in the frame; the brief asks for
 *                       two list cards — see WALLET_COPY.home.todaySubtitle)
 *   "Your credentials" -> W-09; its count is live (2 before, 3 after)
 */

const LIST_CARD: React.CSSProperties = {
  background: WALLET_COLOR.tint05,
  border: `1px solid ${WALLET_COLOR.line}`,
  borderRadius: WALLET_SIZE.radiusMain,
};

const LIST_CARD_CLASS =
  "flex h-[77px] w-full cursor-pointer items-center justify-between p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d]";

export default function WalletHomePage() {
  const c = WALLET_COPY.home;
  return (
    <WalletScreen screen="W1" nodeId="6288:59109">
      {/* top-content 6288:59111 */}
      <div
        className="flex w-full flex-col items-start pb-[24px]"
        style={{ background: WALLET_COLOR.soft, borderRadius: "0 0 40px 40px" }}
      >
        <WalletStatusBar variant="home" background={WALLET_COLOR.soft} />

        {/* menu-row 6288:59118 */}
        <div className="flex w-full flex-col items-start px-[16px] pb-[16px]">
          <WalletMenuButton />
          <h1 className="w-full text-center" style={WALLET_TYPE.heading} data-node-id="6346:87250">
            {c.greeting}
          </h1>
        </div>

        {/* greeting-group 6288:59125 */}
        <div className="flex w-full flex-col items-center gap-[24px] px-[16px]">
          <p className="w-full text-center" style={WALLET_TYPE.body} data-node-id="6288:59127">
            {c.subtitle}
          </p>

          {/* quick-actions 6288:59128 */}
          <div className="flex w-full items-start gap-[16px]">
            {/* scan-card 6288:59129 — THE control on this screen. */}
            <Link
              href={FLOW3_ROUTES.scan}
              className="flex h-[140px] min-w-px flex-[172_0_0] flex-col items-start justify-between p-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d]"
              style={{ background: WALLET_COLOR.brand, borderRadius: WALLET_SIZE.radiusMain, color: "#ffffff" }}
              data-wallet-scan-card="true"
              data-node-id="6288:59129"
            >
              <span className="flex w-full justify-end">
                <WalletQrGlyph />
              </span>
              <span className="w-full" style={WALLET_TYPE.actionLabel}>
                <span className="mb-[12px] block">{c.scan[0]}</span>
                <span className="block">{c.scan[1]}</span>
              </span>
            </Link>

            {/* present-card 6288:59148 — toast */}
            <button
              type="button"
              data-wallet-inert="true"
              className="flex h-[140px] min-w-px flex-[174_0_0] cursor-pointer flex-col items-start justify-between p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d]"
              style={{
                background: WALLET_COLOR.background,
                border: `1px solid ${WALLET_COLOR.line}`,
                borderRadius: WALLET_SIZE.radiusMain,
                color: WALLET_COLOR.text,
              }}
              data-node-id="6288:59148"
            >
              <span className="flex w-full justify-end">
                <WalletUserGlyph />
              </span>
              <span className="w-full" style={WALLET_TYPE.actionLabel}>
                <span className="mb-[12px] block">{c.present[0]}</span>
                <span className="block">{c.present[1]}</span>
              </span>
            </button>
          </div>

          {/* help-link 6288:59158 — toast */}
          <button
            type="button"
            data-wallet-inert="true"
            className="cursor-pointer underline decoration-solid decoration-from-font [text-underline-position:from-font]"
            style={WALLET_TYPE.link}
            data-node-id="6288:59158"
          >
            {c.help}
          </button>
        </div>
      </div>

      {/* credentials-list-section 6288:59160 */}
      <div className="flex w-full flex-col items-center gap-[24px] px-[24px] py-[40px]">
        {/* today-card 6288:59161 — toast */}
        <button type="button" data-wallet-inert="true" className={LIST_CARD_CLASS} style={LIST_CARD} data-node-id="6288:59161">
          <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[4px]">
            <span style={WALLET_TYPE.cardTitle}>{c.todayTitle}</span>
            <span style={WALLET_TYPE.cardDesc}>{c.todaySubtitle}</span>
          </span>
          <IconChevron />
        </button>

        {/* all-cards-card 6288:59167 — W-09 */}
        <Link href={FLOW3_ROUTES.cards} className={LIST_CARD_CLASS} style={LIST_CARD} data-wallet-all-cards="true" data-node-id="6288:59167">
          <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[4px]">
            <span style={WALLET_TYPE.cardTitle}>{c.credentialsTitle}</span>
            <WalletCardCount style={WALLET_TYPE.cardDesc} />
          </span>
          <IconChevron />
        </Link>
      </div>
    </WalletScreen>
  );
}
