"use client";

/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { useEffect, useState, type ReactNode } from "react";

import { ASSETS } from "@/lib/assets";

/*
 * THE PRESENTER STAGE's look — shared by /demo/idv-stage/ and
 * /demo/wallet-stage/. ADDED 2026-10-23.
 *
 * A dark "stage" with the portal in a browser window on the left and the
 * phone on the right, a presenter header (what is being shown, where the
 * story is, Reset / Exit), and a live connection between the two devices.
 * Everything here is chrome AROUND the two iframes: the screens inside them
 * are the demo's real pages, untouched.
 *
 * SIZES are the devices' real ones — the portal at 1440 wide, the phone at
 * the brief's 393 x 852 — drawn at full size and SCALED to fit the window,
 * so what the audience sees is the same page the presenter would show
 * full-screen, only smaller.
 */

export const PHONE_SCREEN = { w: 393, h: 852 } as const;
const BEZEL = 14;
export const PHONE_OUTER = { w: PHONE_SCREEN.w + BEZEL * 2, h: PHONE_SCREEN.h + BEZEL * 2 } as const;
/** The browser window's title bar, at 1:1. */
export const BROWSER_BAR = 52;
const STATUS_BAR = 44;
export const PHONE_CONTENT_H = { withStatusBar: PHONE_SCREEN.h - STATUS_BAR, bare: PHONE_SCREEN.h } as const;

const PAD = 28;
const HEADER = 84;
const LABEL = 60;
const GAP = 156;

export type StageTone = "idle" | "waiting" | "active" | "done";

export const TONE: Record<StageTone, { color: string; soft: string }> = {
  idle: { color: "#8fa3b8", soft: "rgba(143,163,184,0.18)" },
  waiting: { color: "#f5b544", soft: "rgba(245,181,68,0.22)" },
  active: { color: "#5aa9ff", soft: "rgba(90,169,255,0.24)" },
  done: { color: "#3fcf8e", soft: "rgba(63,207,142,0.24)" },
};

export function useViewport() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return size;
}

/**
 * Scales for a desktop of `desk` (outer size, title bar included) beside the
 * phone. Side by side when the desktop can still be drawn at 36 % or more;
 * otherwise the two stack and each fills the width (a narrow window is never
 * the stage's purpose, but it must not scroll sideways).
 */
export function fitStage(view: { w: number; h: number } | null, desk: { w: number; h: number }) {
  const vw = view ? view.w : 1440;
  const vh = view ? view.h : 900;
  const availH = Math.max(240, vh - HEADER - PAD * 2 - LABEL);
  let sPhone = Math.min(1, availH / PHONE_OUTER.h);
  let sDesk = Math.min((vw - PAD * 2 - GAP - PHONE_OUTER.w * sPhone - 2) / desk.w, availH / desk.h);
  const side = sDesk >= 0.36;
  if (!side) {
    const w = vw - PAD * 2;
    sDesk = Math.min(1, w / desk.w);
    sPhone = Math.min(0.9, w / PHONE_OUTER.w);
  }
  return { side, sDesk, sPhone };
}

/* ------------------------------------------------------------- icons -- */

export function Icon({ d, size = 16, width = 2 }: { d: string; size?: number; width?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className="block shrink-0">
      <path d={d} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const ICON = {
  reset: "M3 12a9 9 0 1 0 3-6.7M3 4v5h5",
  exit: "M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7",
  check: "m5 12.5 4.5 4.5L19 7.5",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2M18 14h2v2M14 18h2v2M18 18h2v2",
  phone: "M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM11 18h2",
  monitor: "M3 4h18v12H3zM8 20h8M12 16v4",
  link: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1",
  shield: "M12 3l8 3v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V6l8-3zM8.5 12l2.5 2.5 4.5-5",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  wallet: "M3 7h15a3 3 0 0 1 3 3v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM3 7l12-4v4M16 14h2",
} as const;

/* ------------------------------------------------------------ header -- */

export type StageStep = { label: string };

function Stepper({ steps, active, tone }: { steps: readonly StageStep[]; active: number; tone: StageTone }) {
  const t = TONE[tone];
  return (
    <ol className="flex items-center gap-[6px]" aria-label="Demo progress" data-stage-steps="true">
      {steps.map((s, i) => {
        const done = i < active || (i === active && tone === "done");
        const current = i === active && !done;
        return (
          <li key={s.label} className="flex items-center gap-[6px]" aria-current={current ? "step" : undefined}>
            <span className="flex items-center gap-[8px]">
              <span
                className={`flex size-[24px] shrink-0 items-center justify-center rounded-full text-[12px] font-bold transition-colors duration-500 ${current ? "gnl-stage-pulse" : ""}`}
                style={{
                  background: done ? TONE.done.color : current ? t.soft : "transparent",
                  color: done ? "#0b1522" : current ? t.color : "rgba(255,255,255,0.45)",
                  boxShadow: done ? "none" : `inset 0 0 0 1.5px ${current ? t.color : "rgba(255,255,255,0.22)"}`,
                  ["--gnl-pulse" as string]: t.soft,
                }}
              >
                {done ? <Icon d={ICON.check} size={14} width={3} /> : i + 1}
              </span>
              <span
                className={`whitespace-nowrap text-[13px] font-bold transition-colors duration-500 ${current || (tone === "done" && i === active) ? "max-[1023px]:hidden" : "max-[1599px]:hidden"}`}
                style={{ color: done || current ? "#ffffff" : "rgba(255,255,255,0.5)" }}
              >
                {s.label}
              </span>
            </span>
            {i < steps.length - 1 ? (
              <span
                className="mx-[4px] h-[2px] w-[28px] shrink-0 rounded-full transition-colors duration-500"
                style={{ background: i < active || tone === "done" ? TONE.done.color : "rgba(255,255,255,0.16)" }}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-[6px] border border-solid border-white/15 bg-white/[0.07] px-[7px] py-[2px] font-sans text-[11px] font-bold text-white/80">
      {children}
    </kbd>
  );
}

function StageButton({
  onClick,
  icon,
  children,
  ...data
}: {
  onClick: () => void;
  icon: string;
  children: ReactNode;
  [k: `data-${string}`]: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-[8px] rounded-[10px] bg-white/[0.08] px-[14px] py-[9px] text-[13px] font-bold text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] transition-colors hover:bg-white/[0.15] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5aa9ff]"
      {...data}
    >
      <Icon d={icon} size={15} />
      {children}
    </button>
  );
}

/* ------------------------------------------------------------- stage -- */

export function PresenterStage({
  eyebrow,
  title,
  steps,
  active,
  tone,
  onReset,
  onExit,
  children,
  ...data
}: {
  eyebrow: string;
  title: string;
  steps?: readonly StageStep[];
  active?: number;
  tone: StageTone;
  onReset: () => void;
  onExit?: () => void;
  children: ReactNode;
  [k: `data-${string}`]: string;
}) {
  return (
    <div
      className="gnl-stage relative box-border flex min-h-[100dvh] w-full flex-col overflow-x-hidden text-white"
      style={{ padding: `0 ${PAD}px ${PAD}px` }}
      {...data}
    >
      <header
        className="relative z-10 flex flex-wrap items-center justify-between gap-x-[24px] gap-y-[12px] py-[18px]"
        style={{ minHeight: HEADER }}
      >
        <div className="flex min-w-0 items-center gap-[16px]">
          <img alt="MyGovNL" src={ASSETS.mygovnlLogo} className="block h-[28px] w-auto shrink-0" />
          <span className="h-[30px] w-px shrink-0 bg-white/20" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8fb2d6]">{eyebrow}</p>
            <p className="truncate text-[17px] font-bold leading-[1.3] text-white" data-stage-title="true">
              {title}
            </p>
          </div>
        </div>
        {steps && active !== undefined ? <Stepper steps={steps} active={active} tone={tone} /> : null}
        <div className="flex items-center gap-[10px]">
          <span className="mr-[6px] flex items-center gap-[6px] text-[12px] text-white/55 max-[1699px]:hidden">
            <Kbd>Esc</Kbd> reset
            {onExit ? (
              <>
                <span className="ml-[6px]" />
                <Kbd>Shift W</Kbd> exit
              </>
            ) : null}
          </span>
          <StageButton onClick={onReset} icon={ICON.reset} data-stage-reset="true">
            Reset demo
          </StageButton>
          {onExit ? (
            <StageButton onClick={onExit} icon={ICON.exit} data-stage-exit="true">
              Exit
            </StageButton>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}

/* ----------------------------------------------------------- devices -- */

/**
 * One device and its label. Side by side, every slot is as tall as the
 * tallest device, so the two labels line up on one baseline.
 */
export function DeviceSlot({ height, label, children }: { height?: number; label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center" style={height ? { height } : undefined}>
        {children}
      </div>
      {label}
    </div>
  );
}

export function DeviceLabel({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-center justify-center gap-[10px] pt-[16px] text-white/90">
      <span className="flex size-[30px] items-center justify-center rounded-[9px] bg-white/[0.08] text-[#8fb2d6] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]">
        <Icon d={icon} size={16} />
      </span>
      <span className="text-[14px] font-bold">{title}</span>
      <span className="text-[13px] text-white/50">{subtitle}</span>
    </div>
  );
}

/** A browser window around a `w` x `h` page, drawn at `scale`. */
export function BrowserFrame({
  w,
  h,
  scale,
  url,
  children,
}: {
  w: number;
  h: number;
  scale: number;
  url: { host: string; path: string };
  children: ReactNode;
}) {
  const H = h + BROWSER_BAR;
  return (
    <div className="relative shrink-0" style={{ width: w * scale, height: H * scale }}>
      <div
        className="absolute top-0 left-0 overflow-hidden rounded-[16px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ width: w, height: H, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        <div
          className="flex items-center gap-[18px] border-b border-solid border-[#d7dce2] bg-gradient-to-b from-[#f4f6f8] to-[#e9edf1] px-[22px]"
          style={{ height: BROWSER_BAR }}
          aria-hidden="true"
        >
          <span className="flex gap-[9px]">
            <span className="size-[14px] rounded-full bg-[#ff5f57]" />
            <span className="size-[14px] rounded-full bg-[#febc2e]" />
            <span className="size-[14px] rounded-full bg-[#28c840]" />
          </span>
          <span className="flex gap-[14px] text-[#9aa3ad]">
            <Icon d="M15 6l-6 6 6 6" size={20} />
            <Icon d="M9 6l6 6-6 6" size={20} />
          </span>
          <span className="mx-auto flex h-[34px] w-[760px] max-w-[70%] items-center gap-[10px] rounded-full bg-white px-[16px] text-[15px] shadow-[inset_0_0_0_1px_#d7dce2]">
            <span className="text-[#1a7f37]">
              <Icon d={ICON.lock} size={15} />
            </span>
            <span className="truncate" data-stage-url="true">
              <span className="font-bold text-[#212326]">{url.host}</span>
              <span className="text-[#6b7480]">{url.path}</span>
            </span>
          </span>
          <span className="w-[86px]" />
        </div>
        <div className="relative" style={{ width: w, height: h }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function PhoneStatusBar() {
  return (
    <div
      className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-[#2b3a4e] px-[30px] pt-[4px] text-white"
      style={{ height: STATUS_BAR }}
      aria-hidden="true"
    >
      <span className="text-[15px] font-bold tracking-[-0.01em]">9:41</span>
      <span className="flex items-center gap-[6px]">
        <svg viewBox="0 0 17 11" width="17" height="11" className="block">
          <rect x="0" y="7" width="3" height="4" rx="0.8" fill="#fff" />
          <rect x="4.6" y="5" width="3" height="6" rx="0.8" fill="#fff" />
          <rect x="9.2" y="2.6" width="3" height="8.4" rx="0.8" fill="#fff" />
          <rect x="13.8" y="0" width="3" height="11" rx="0.8" fill="#fff" />
        </svg>
        <svg viewBox="0 0 16 11" width="16" height="11" className="block">
          <path d="M8 10.6 5.7 8.3a3.3 3.3 0 0 1 4.6 0L8 10.6Z" fill="#fff" />
          <path d="M3.6 6.2a6.2 6.2 0 0 1 8.8 0M1.2 3.8a9.6 9.6 0 0 1 13.6 0" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 25 12" width="25" height="12" className="block">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" fill="none" stroke="#fff" strokeOpacity="0.45" />
          <rect x="2" y="2" width="18" height="8" rx="1.6" fill="#fff" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="#fff" fillOpacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

/**
 * A phone around a 393 x 852 screen, drawn at `scale`. `statusBar` draws the
 * iOS status bar above the page (the portal's pages have none of their own;
 * the wallet's screens draw theirs, so the wallet stage passes false).
 */
export function PhoneFrame({ scale, statusBar, children }: { scale: number; statusBar: boolean; children: ReactNode }) {
  const { w, h } = PHONE_OUTER;
  return (
    <div className="relative shrink-0" style={{ width: w * scale, height: h * scale }}>
      <div
        className="absolute top-0 left-0"
        style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {/* side buttons */}
        <span className="absolute top-[150px] -left-[3px] h-[34px] w-[4px] rounded-l-[3px] bg-[#252b33]" />
        <span className="absolute top-[210px] -left-[3px] h-[62px] w-[4px] rounded-l-[3px] bg-[#252b33]" />
        <span className="absolute top-[284px] -left-[3px] h-[62px] w-[4px] rounded-l-[3px] bg-[#252b33]" />
        <span className="absolute top-[240px] -right-[3px] h-[96px] w-[4px] rounded-r-[3px] bg-[#252b33]" />
        <div
          className="absolute inset-0 rounded-[64px] shadow-[0_40px_100px_rgba(0,0,0,0.6),inset_0_0_0_1.5px_rgba(255,255,255,0.12)]"
          style={{ background: "linear-gradient(150deg,#3a414b 0%,#12161c 30%,#0b0e12 70%,#2a3038 100%)", padding: BEZEL }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[50px] bg-white">
            {statusBar ? <PhoneStatusBar /> : null}
            {/* Dynamic Island */}
            <span className="absolute top-[11px] left-1/2 z-20 h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black" aria-hidden="true" />
            <div className="absolute inset-x-0 bottom-0" style={{ top: statusBar ? STATUS_BAR : 0 }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Between the two devices: an animated link and a badge for where the
 * hand-off is. Only drawn side by side.
 */
export function StageConnector({ tone, icon, label, height }: { tone: StageTone; icon: string; label: string; height: number }) {
  const t = TONE[tone];
  const moving = tone === "waiting" || tone === "active";
  return (
    <div className="relative flex shrink-0 flex-col items-center justify-center" style={{ width: GAP, height }} data-stage-link={tone}>
      <svg className="absolute top-1/2 left-0 -translate-y-1/2" width={GAP} height="4" aria-hidden="true">
        <line
          x1="6"
          y1="2"
          x2={GAP - 6}
          y2="2"
          stroke={t.color}
          strokeOpacity={tone === "idle" ? 0.35 : 0.9}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={tone === "done" ? "0" : "2 10"}
          className={moving ? "gnl-stage-flow" : undefined}
        />
      </svg>
      <span
        className={`relative z-10 flex size-[58px] items-center justify-center rounded-full transition-all duration-500 ${moving ? "gnl-stage-pulse" : ""}`}
        style={{
          background: "#0f1c2c",
          color: t.color,
          boxShadow: `0 0 0 1.5px ${t.color}, 0 0 30px ${t.soft}`,
          ["--gnl-pulse" as string]: t.soft,
        }}
      >
        <Icon d={icon} size={24} width={2} />
      </span>
      <span
        className="absolute top-1/2 mt-[42px] w-[140%] text-center text-[12px] font-bold tracking-[0.02em] transition-colors duration-500"
        style={{ color: t.color }}
        role="status"
        aria-live="polite"
        data-stage-status="true"
      >
        {label}
      </span>
    </div>
  );
}
