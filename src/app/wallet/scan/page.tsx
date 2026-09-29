import { ScanViewfinder } from "@/components/wallet/ScanViewfinder";
import { WalletScanClose, WalletScreen } from "@/components/wallet/WalletClient";
import { WalletInertButton, WalletStatusBar } from "@/components/wallet/WalletUi";
import { WALLET_COPY } from "@/lib/data/flow3";
import { WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-02 — "Scan QR Code". Figma 6286:90660 (390 x 844, `1. QR Scanner`).
 * ADDED 2026-09-29; REWORKED to FLOW3_BRIEF.md §7 W-02 (a simulated scanner,
 * no camera — see ScanViewfinder).
 *
 * The frame spreads three blocks with `justify-between` down the phone:
 *   top     status bar (44) + "Scan QR Code" (Inter 900 18/130 %) with a
 *           close ✕ (1.5 px, ink) -> W-01, pt-12 px-24
 *   middle  the 260 viewfinder and, 24 below, the hint (Inter 300 18/150 %,
 *           60 % ink, centred, 280 wide)
 *   bottom  "Enter Code Manually", an outline button 360 x 56 (HIDDEN in the
 *           frame — 6286:90676 — shown because the brief asks for it) -> toast
 *
 * The hint is the brief's deliberate copy fix: Figma says "the login QR code".
 */
export default function WalletScanPage() {
  const c = WALLET_COPY.scan;
  return (
    <WalletScreen screen="W2" nodeId="6286:90660" className="justify-between">
      <div className="flex w-full flex-col">
        <WalletStatusBar />
        {/* 6286:90668 — title + close */}
        <div className="flex w-full items-center justify-between px-[24px] pt-[12px]">
          <h1 style={WALLET_TYPE.screenTitle} data-node-id="6286:90669">
            {c.title}
          </h1>
          <WalletScanClose />
        </div>
      </div>

      {/* 6286:90671 — viewfinder + hint, gap 24 */}
      <div className="flex w-full flex-col items-center gap-[24px] px-[24px] py-[24px]">
        <ScanViewfinder />
        <p
          className="text-center"
          style={{ ...WALLET_TYPE.lead, color: "rgba(8,16,16,0.6)", width: "min(280px, 100%)" }}
          data-node-id="6286:90674"
        >
          {c.hint}
        </p>
      </div>

      {/* 6286:90675 — the (hidden) outline button, 360 x 56 */}
      <div className="flex w-full justify-center px-[15px] pb-[12px]">
        <WalletInertButton width={360}>{c.manual}</WalletInertButton>
      </div>
    </WalletScreen>
  );
}
