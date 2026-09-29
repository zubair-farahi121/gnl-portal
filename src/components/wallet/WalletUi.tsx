import { WALLET_COLOR, WALLET_SIZE, WALLET_TYPE } from "@/lib/data/wallet-tokens";
import { WALLET_ISSUER } from "@/lib/data/flow3";
import { SameDeviceBackLink } from "@/components/wallet/WalletClient";

/*
 * WALLET UI — the server-safe pieces W-01..W-09 share. ADDED 2026-09-29 with
 * Flow 3; REWORKED the same day to FLOW3_BRIEF.md §6. The pieces that hold
 * state or touch the store (header, screen wrapper, action buttons) are in
 * WalletClient.tsx.
 *
 * Every colour and size comes from wallet-tokens.ts, never typed here, so the
 * wallet can be re-skinned by editing that one file.
 *
 * INERT CONTROLS carry `data-wallet-inert` (not `data-demo-inert`): the
 * wallet's own toast picks them up, so the GNL toast — Lato, GNL navy — never
 * appears inside the wallet (brief §8: no GNL styles in the wallet).
 */

/* --------------------------------------------------------------- icons -- */

type IconProps = { size?: number; color?: string };

const strokeProps = (color: string, width = 1.5) => ({
  fill: "none",
  stroke: color,
  strokeWidth: width,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

/** arrow_backward — 16 px, 70 % ink (brief §6; frame layer `arrow_bakward`, rgba(8,16,16,0.7)). */
export function IconBack({ size = 16, color = WALLET_COLOR.textSecondary }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className="block">
      {/* The forward arrow of icon-arrow-forward.svg, mirrored — the frame rotates it 180°. */}
      <path
        transform="translate(16 0) scale(-1 1) translate(1.333 1.333)"
        d="M10.146 7.5L0 7.5L0 5.833L10.146 5.833L5.479 1.167L6.667 0L13.333 6.667L6.667 13.333L5.479 12.167L10.146 7.5Z"
        fill={color}
      />
    </svg>
  );
}

/** Close ✕ — 16 px, 2 px lines, 70 % ink on the wallet header (brief §6). */
export function IconClose({ size = 16, color = WALLET_COLOR.textSecondary, width = 2 }: IconProps & { width?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className="block">
      <path d="M2.5 2.5l11 11M13.5 2.5l-11 11" {...strokeProps(color, width)} />
    </svg>
  );
}

/** Chevron — 32 x 32, pointing right (list cards), down, or up. */
export function IconChevron({
  size = 32,
  color = WALLET_COLOR.text,
  dir = "right",
}: IconProps & { dir?: "right" | "down" | "up" }) {
  const d = dir === "right" ? "M13 9l7 7-7 7" : dir === "up" ? "M9 19l7-7 7 7" : "M9 13l7 7 7-7";
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true" className="block shrink-0">
      <path d={d} {...strokeProps(color, 1.8)} />
    </svg>
  );
}

/** The white → on W-08's button — design-reference/flow3/icons/icon-arrow-forward.svg, inlined. */
export function IconArrowRight({ size = 16, color = "#ffffff" }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} aria-hidden="true" className="block">
      <path
        transform="translate(1.333 1.333)"
        d="M10.146 7.5L0 7.5L0 5.833L10.146 5.833L5.479 1.167L6.667 0L13.333 6.667L6.667 13.333L5.479 12.167L10.146 7.5Z"
        fill={color}
      />
    </svg>
  );
}

/* --------------------------------------------------------- status bar -- */

/**
 * The status bar — "9:41" (Inter 600 15) with signal, wifi and battery.
 * Brief §6 / §10 item 5: real status-bar icons instead of the frames'
 * placeholder (`Icons/icon-mutual-growth`), and 9:41 everywhere (W-01's frame
 * says "11:34" in its `time` layer; the brief's value wins).
 *
 * Two geometries, as drawn:
 *   home     W-01 / W-09 `status-bar`: 56 tall, padding 12/32/24, sits inside
 *            the #F3F5FB top area
 *   default  W-02..W-08 `StatusBar`: 44 tall, 24 px sides
 * STICKY at the top of the phone's scroll area, on the screen's own
 * background, so it stays put when a long screen (W-05) scrolls.
 */
export function WalletStatusBar({
  variant = "default",
  background = WALLET_COLOR.background,
  children,
}: {
  variant?: "home" | "default";
  background?: string;
  /** Optional left-side extra — the same-device "◀ MyGovNL" link (brief §8). */
  children?: React.ReactNode;
}) {
  const home = variant === "home";
  return (
    <div
      className={`sticky top-0 z-20 flex w-full shrink-0 items-center justify-between ${
        home ? "h-[56px] px-[32px] pt-[12px] pb-[24px]" : "h-[44px] px-[24px]"
      }`}
      style={{ background }}
      data-wallet-statusbar="true"
    >
      <span className="flex items-center gap-[6px]">
        <span style={WALLET_TYPE.statusTime}>9:41</span>
        {children}
        <SameDeviceBackLink />
      </span>
      <span className="flex items-center gap-[6px]" aria-hidden="true">
        {/* signal */}
        <svg viewBox="0 0 17 11" width="17" height="11" className="block">
          <rect x="0" y="7" width="3" height="4" rx="0.8" fill={WALLET_COLOR.text} />
          <rect x="4.6" y="5" width="3" height="6" rx="0.8" fill={WALLET_COLOR.text} />
          <rect x="9.2" y="2.6" width="3" height="8.4" rx="0.8" fill={WALLET_COLOR.text} />
          <rect x="13.8" y="0" width="3" height="11" rx="0.8" fill={WALLET_COLOR.text} />
        </svg>
        {/* wifi */}
        <svg viewBox="0 0 16 11" width="16" height="11" className="block">
          <path d="M8 10.6 5.7 8.3a3.3 3.3 0 0 1 4.6 0L8 10.6Z" fill={WALLET_COLOR.text} />
          <path d="M3.6 6.2a6.2 6.2 0 0 1 8.8 0" {...strokeProps(WALLET_COLOR.text, 1.5)} />
          <path d="M1.2 3.8a9.6 9.6 0 0 1 13.6 0" {...strokeProps(WALLET_COLOR.text, 1.5)} />
        </svg>
        {/* battery */}
        <svg viewBox="0 0 25 12" width="25" height="12" className="block">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke={WALLET_COLOR.text} strokeOpacity="0.4" />
          <rect x="2" y="2" width="18" height="8" rx="1.6" fill={WALLET_COLOR.text} />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill={WALLET_COLOR.text} fillOpacity="0.4" />
        </svg>
      </span>
    </div>
  );
}

/* ------------------------------------------------------------- issuer -- */

/**
 * The issuer badge (brief §6; Frame 14680 6337:81835 on W-03, 6320:80342 on
 * W-04, 6345:12115 on W-05): an 80 px mint circle with the GNL crest flowers
 * (about 47 x 57 — the REAL mark from design-reference/flow3/brand), then
 * "Government of Newfoundland & Labrador", Inter 600 16, centred. 16 px
 * between them on W-03 / W-04, 12 on W-05.
 */
export function IssuerBlock({ gap = 16 }: { gap?: number }) {
  return (
    <div className="flex w-full flex-col items-center" style={{ gap }} data-wallet-issuer="true">
      <div
        className="flex size-[80px] items-center justify-center overflow-hidden rounded-full"
        style={{ background: WALLET_COLOR.mint }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, unoptimized images */}
        {/* gnl-crest-flowers.svg cropped to its drawn box (x 106–155 of a
            155 x 100 canvas) — public/assets/flow3/gnl-crest-flowers-badge.svg. */}
        <img
          src="/assets/flow3/gnl-crest-flowers-badge.svg"
          alt=""
          width={35}
          height={57}
          className="block h-[57px] w-[35px]"
        />
      </div>
      <p className="w-full text-center" style={{ ...WALLET_TYPE.cardTitle, color: WALLET_COLOR.text }}>
        {WALLET_ISSUER}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------ headings -- */

/**
 * The Black 900 headline — 36/110 % −0.03em everywhere except W-08's
 * 48/100 % (brief §6). An <h1>: each wallet screen has exactly one.
 */
export function WalletHeading({
  children,
  size = "default",
  align = "center",
}: {
  children: React.ReactNode;
  size?: "default" | "xl";
  align?: "center" | "left";
}) {
  return (
    <h1
      className="w-full [word-break:break-word]"
      style={{
        ...(size === "xl" ? WALLET_TYPE.headingXl : WALLET_TYPE.heading),
        color: WALLET_COLOR.text,
        textAlign: align,
      }}
    >
      {children}
    </h1>
  );
}

/** Supporting copy — Inter 300 18/150 %, 70 % ink, centred (brief §6). */
export function WalletLead({
  children,
  align = "center",
  width,
}: {
  children: React.ReactNode;
  align?: "center" | "left";
  /** W-06 / W-08 pin their body to 280 px (6293:46877, 6240:55237). */
  width?: number;
}) {
  return (
    <p
      className="[word-break:break-word]"
      style={{ ...WALLET_TYPE.lead, textAlign: align, width: width ? `min(${width}px, 100%)` : "100%" }}
    >
      {children}
    </p>
  );
}

/* ------------------------------------------------------------- buttons -- */

/**
 * Buttons (brief §6):
 *   primary    56 px, radius 8, #081010 fill, 1.5 px #081010 stroke, Inter 300 18 white
 *   secondary  56 px, radius 8, transparent, 1.5 px rgba(8,16,16,0.6) stroke, Inter 300 18 ink
 *   disabled   #E6E8EF fill and stroke, Inter 600 18 at 70 % ink, arrow icon
 */
export function walletButtonStyle(variant: "primary" | "secondary" | "disabled"): React.CSSProperties {
  const base: React.CSSProperties = {
    height: WALLET_SIZE.buttonHeight,
    borderRadius: WALLET_SIZE.radiusSmall,
    fontSize: "18px",
    fontWeight: 300,
    lineHeight: 1.5,
    borderStyle: "solid",
    borderWidth: WALLET_SIZE.border,
  };
  if (variant === "primary") {
    return { ...base, background: WALLET_COLOR.text, color: "#ffffff", borderColor: WALLET_COLOR.text };
  }
  if (variant === "disabled") {
    return {
      ...base,
      fontWeight: 600,
      background: WALLET_COLOR.line,
      color: WALLET_COLOR.textSecondary,
      borderColor: WALLET_COLOR.line,
      cursor: "not-allowed",
    };
  }
  return { ...base, background: "transparent", color: WALLET_COLOR.text, borderColor: WALLET_COLOR.textTertiary };
}

export const WALLET_BUTTON_CLASS =
  "relative box-border flex w-full shrink-0 cursor-pointer items-center justify-center gap-[8px] px-[24px] text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d]";

/** A button that does nothing in the demo — the wallet's toast answers it. */
export function WalletInertButton({
  children,
  variant = "secondary",
  width,
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  width?: number;
}) {
  return (
    <button
      type="button"
      data-wallet-inert="true"
      className={WALLET_BUTTON_CLASS}
      style={{ ...walletButtonStyle(variant), ...(width ? { width: `min(${width}px, 100%)` } : {}) }}
    >
      {children}
    </button>
  );
}

/**
 * The action area on W-03 / W-05 — two stacked buttons, gap 24, p-24
 * (6320:81738 / 6345:12881). AT THE END OF THE CONTENT, in the scroll flow,
 * as in Figma (brief §7 W-05: "so the user scrolls through the details
 * first") — never pinned over the content.
 */
export function WalletActions({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full shrink-0 flex-col gap-[24px] px-[24px] pt-[16px] pb-[24px]">{children}</div>;
}
