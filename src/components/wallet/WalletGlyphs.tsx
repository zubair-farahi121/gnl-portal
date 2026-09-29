/* eslint-disable @next/next/no-img-element -- static export with unoptimized images; plain <img> is the house pattern */
import { WALLET_COLOR, WALLET_SIZE } from "@/lib/data/wallet-tokens";

/*
 * The wallet's glyphs. ADDED 2026-09-29 with Flow 3; REWORKED the same day.
 *
 * REAL ICONS where FLOW3_BRIEF.md's design-reference pack has them
 * (design-reference/flow3/icons/, copied to /public/assets/flow3/): QR code
 * (recoloured white for the teal Scan card), User, Verifiable Credentials,
 * Digital ID. Rendered from the Figma file by Zubair (22 Sep) — no Figma call
 * was made to get them.
 *
 * DRAWN STAND-INS for the rest (Shield, Replace_switch, Truck_delivery,
 * Success_check, Loading, Trashcan, the menu lines): the pack says "use the
 * Bootstrap Icons equivalent", and each is drawn at its frame's box size so a
 * real export is a drop-in swap.
 */

const line = (color: string, width = 1.5) => ({
  fill: "none",
  stroke: color,
  strokeWidth: width,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/**
 * Menu button (brief §7 W-01): a white 48 px circle holding a black 44 px
 * rounded square (radius 16) with 3 white lines (6288:59119 / 6288:59120).
 * Inert: there is no wallet menu.
 */
export function WalletMenuButton() {
  return (
    <div className="flex size-[48px] items-center justify-center rounded-full p-[2px]" style={{ background: WALLET_COLOR.background }}>
      <button
        type="button"
        aria-label="Menu"
        data-wallet-inert="true"
        className="flex size-[44px] cursor-pointer items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d]"
        style={{
          background: WALLET_COLOR.text,
          border: `${WALLET_SIZE.border} solid ${WALLET_COLOR.text}`,
          borderRadius: WALLET_SIZE.radiusMain,
        }}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="block">
          <path d="M2 3.5h12M2 8h12M2 12.5h12" {...line("#ffffff", 1.6)} />
        </svg>
      </button>
    </div>
  );
}

/** "QR code" — 45 x 45, top right of W-01's Scan card (6288:59131). White on teal. */
export function WalletQrGlyph() {
  return <img src="/assets/flow3/icon-qr-code-white.svg" alt="" width={45} height={45} className="block size-[45px]" />;
}

/** "User" — 45 x 45 on W-01's Present card (6288:59150). The pack's icon is drawn at 18; scaled. */
export function WalletUserGlyph() {
  return <img src="/assets/flow3/icon-user.svg" alt="" width={45} height={45} className="block size-[45px]" />;
}

/** "Shield" with a check — 32 x 32 in the #86CEBA circle on W-03's verified card (6325:60916). */
export function WalletShieldGlyph() {
  const c = WALLET_COLOR.brand;
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" className="block">
      <path d="M16 5 7.5 8.5v6.2c0 5.6 3.6 9.7 8.5 11.3 4.9-1.6 8.5-5.7 8.5-11.3V8.5L16 5Z" {...line(c, 1.5)} />
      <path d="m12 15.8 2.8 2.8 5.4-5.4" {...line(c, 1.7)} />
    </svg>
  );
}

/** "Replace_switch" — 18 x 18 in the white circle on W-03's first-time card (6325:60970). */
export function WalletSwapGlyph() {
  const c = WALLET_COLOR.text;
  return (
    <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" className="block">
      <path d="M3 6h11l-3-3M15 12H4l3 3" {...line(c, 1.3)} />
    </svg>
  );
}

/** "Icons/Verifiable Credentials" — the ID card icon, 45 x 43 on W-04 (6320:79595), 24 x 23 on W-09. */
export function WalletVcGlyph({ width = 45 }: { width?: number }) {
  const h = Math.round((width * 23) / 24);
  return (
    <img
      src="/assets/flow3/icon-verifiable-credentials.svg"
      alt=""
      width={width}
      height={h}
      className="block"
      style={{ width, height: h }}
    />
  );
}

/** "Digital ID" — 32 x 32 on W-09's Photo ID card (6328:11351). */
export function WalletDigitalIdGlyph() {
  return <img src="/assets/flow3/icon-digital-id.svg" alt="" width={32} height={32} className="block size-[32px]" />;
}

/** "Truck_delivery" — 32 x 32 in W-09's mint icon box (6240:55272). */
export function WalletTruckGlyph() {
  const c = WALLET_COLOR.brand;
  return (
    <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" className="block">
      <path d="M2.5 9h17v13h-17zM19.5 13h5.5l4.5 4.5V22h-10" {...line(c, 1.3)} />
      <circle cx="8" cy="23" r="2.5" {...line(c, 1.3)} fill={WALLET_COLOR.mint} />
      <circle cx="24" cy="23" r="2.5" {...line(c, 1.3)} fill={WALLET_COLOR.mint} />
    </svg>
  );
}

/**
 * W-08's check — 5 px stroke, #2E8E74 (brief §7 W-08), in the 100 px mint
 * circle. DRAWN IN with `gnl-wallet-draw` (stroke-dashoffset), ~0.5 s.
 */
export function WalletSuccessGlyph() {
  return (
    <svg viewBox="0 0 48 48" width="48" height="48" aria-hidden="true" className="block" data-wallet-check="true">
      <path className="gnl-wallet-draw" d="m11 25 9 9 17-19" pathLength={40} {...line(WALLET_COLOR.check, 5)} />
    </svg>
  );
}

/** Backspace — the bottom-right key on W-07 (6322:60958, "Trashcan" in the frame). */
export function WalletBackspaceGlyph() {
  const c = WALLET_COLOR.text;
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" className="block">
      <path d="M8.5 5H20a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 20 19H8.5L2.5 12l6-7Z" {...line(c, 1.5)} />
      <path d="m11.5 9.5 5 5M16.5 9.5l-5 5" {...line(c, 1.5)} />
    </svg>
  );
}

/**
 * "Loading" — W-06's 8 dots (6293:46874), 80 x 80 in a 120 px mint circle:
 * one green (#45AB8E) and seven ink (brief §7 W-06). ROTATES SMOOTHLY
 * (`gnl-wallet-spin`, linear); still under prefers-reduced-motion.
 */
export function WalletLoadingDots() {
  const dots = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return {
      cx: 40 + Math.cos(a) * 26,
      cy: 40 + Math.sin(a) * 26,
      r: 4.5,
      fill: i === 0 ? WALLET_COLOR.green : WALLET_COLOR.text,
    };
  });
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" aria-hidden="true" className="gnl-wallet-spin block" data-wallet-loader="true">
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx.toFixed(2)} cy={d.cy.toFixed(2)} r={d.r} fill={d.fill} />
      ))}
    </svg>
  );
}
