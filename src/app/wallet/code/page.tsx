"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { WalletHeader, WalletScreen, useOfferStatus } from "@/components/wallet/WalletClient";
import { WalletBackspaceGlyph } from "@/components/wallet/WalletGlyphs";
import {
  IconArrowRight,
  WALLET_BUTTON_CLASS,
  WalletHeading,
  WalletStatusBar,
  walletButtonStyle,
} from "@/components/wallet/WalletUi";
import { useDemoState } from "@/lib/demo-state";
import { CODE_MODE, WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_PROGRESS, WALLET_SIZE, WALLET_TIMING, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-07 — enter the code. Figma 6322:60882 (393 x 874,
 * `transactional-code-entry`), progress 80 %. ADDED 2026-09-29; REWORKED to
 * FLOW3_BRIEF.md §7 W-07.
 *
 * ====================================================================
 * BEHAVIOUR
 *   boxes      six, 48 x 56, radius 8, gap 8 — filled (#F3F5FB, 1 px
 *              rgba(8,16,16,0.6), Inter 700 24), active (white, 2 px #45AB8E,
 *              blinking caret), empty (white, 1.5 px #E6E8EF). The frame shows
 *              "4 8 2" mid-typing; the screen STARTS EMPTY.
 *   keypad     1–9 and 0, 130 x 54 keys, white, 1 px #E6E8EF lines (the grid's
 *              own background showing through 1 px gaps), Inter 500 24; the
 *              bottom-left key is empty (#F3F5FB) and the bottom-right is
 *              backspace (#F3F5FB). A physical keyboard works too: 0–9,
 *              Backspace, Enter.
 *   button     DISABLED (#E6E8EF, Inter 600 18 at 70 %, arrow) until six
 *              digits are in, then PRIMARY. Any six digits are accepted.
 *   continue   `code_verified`, ~0.6 s, `issued` (the wallet stores the card
 *              at the same moment), W-08.
 *   CODE_MODE  "sms" (default, as in Figma): a simulated SMS banner slides
 *              down at the top of the phone — "Messages · Your GNL code is
 *              482 915" — and tapping it fills the code. "wallet_pin": no
 *              banner, placeholder text until Tatyana's design exists.
 * ====================================================================
 *
 * Back -> W-05, NOT W-06: W-06 is a one-shot transition (see its note) and
 * would sit there spinning. Esc = close (WalletHeader).
 */
export default function WalletCodePage() {
  const router = useRouter();
  const { storeWalletCard } = useDemoState();
  const { set } = useOfferStatus();
  const c = WALLET_COPY.code;
  const text = c[CODE_MODE];
  const [digits, setDigits] = useState("");
  const [banner, setBanner] = useState(false);
  const [busy, setBusy] = useState(false);
  const complete = digits.length === c.length;
  const busyRef = useRef(false);

  const press = useCallback(
    (d: string) => setDigits((prev) => (prev.length >= c.length ? prev : prev + d)),
    [c.length],
  );
  const del = useCallback(() => setDigits((prev) => prev.slice(0, -1)), []);

  const submit = useCallback(() => {
    if (digits.length !== c.length || busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    set("code_verified");
    setTimeout(() => {
      storeWalletCard();
      set("issued");
      router.push(FLOW3_ROUTES.added);
    }, WALLET_TIMING.codeIssueMs);
  }, [digits, c.length, set, storeWalletCard, router]);

  /* The physical keyboard. Arrow keys and Escape stay with DemoNav / the header. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (/^[0-9]$/.test(e.key)) press(e.key);
      else if (e.key === "Backspace") del();
      else if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press, del, submit]);

  /* The SMS banner arrives a moment after the screen (sms mode only). */
  useEffect(() => {
    if (CODE_MODE !== "sms") return;
    const t = setTimeout(() => setBanner(true), WALLET_TIMING.smsBannerDelayMs);
    return () => clearTimeout(t);
  }, []);

  const keyStyle: React.CSSProperties = { ...WALLET_TYPE.keypadDigit, color: WALLET_COLOR.text, background: WALLET_COLOR.background };
  const keyClass =
    "flex h-[54px] cursor-pointer items-center justify-center focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#1e404d]";

  return (
    <WalletScreen screen="W7" nodeId="6322:60882" padBottom={false}>
      <WalletStatusBar />
      <WalletHeader back={FLOW3_ROUTES.review} progress={WALLET_PROGRESS.code} />

      {/* The simulated SMS (brief §7) — positioned against the phone frame. */}
      {banner && !complete ? (
        <button
          type="button"
          onClick={() => {
            setDigits(c.smsCode);
            setBanner(false);
          }}
          aria-label={c.smsLabel}
          data-wallet-sms="true"
          className="gnl-wallet-sms absolute inset-x-[8px] top-[8px] z-30 flex cursor-pointer items-start gap-[10px] rounded-[20px] px-[14px] py-[12px] text-left focus-visible:outline-2 focus-visible:outline-[#1e404d]"
          style={{
            background: "rgba(245,246,250,0.97)",
            boxShadow: "0 10px 30px rgba(8,16,16,0.18)",
            border: `1px solid ${WALLET_COLOR.line}`,
          }}
        >
          <span
            aria-hidden="true"
            className="mt-[2px] flex size-[28px] shrink-0 items-center justify-center rounded-[7px]"
            style={{ background: "#34c759" }}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" className="block">
              <path d="M8 2.5c-3.6 0-6.5 2.3-6.5 5.2 0 1.6.9 3 2.3 4-.1.9-.5 1.7-1.1 2.3 1.3 0 2.5-.5 3.3-1.2.6.1 1.3.2 2 .2 3.6 0 6.5-2.3 6.5-5.3S11.6 2.5 8 2.5Z" fill="#fff" />
            </svg>
          </span>
          <span className="flex min-w-px flex-1 flex-col">
            <span style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1.3 }}>{c.smsApp}</span>
            <span style={{ fontSize: "15px", fontWeight: 400, lineHeight: 1.35 }}>{c.smsText}</span>
          </span>
        </button>
      ) : null}

      {/* Content Area 6322:60900 */}
      <div className="flex w-full flex-1 flex-col items-start gap-[24px] px-[24px] pt-[32px] pb-[24px]">
        <div className="flex w-full flex-col items-start gap-[12px]">
          <WalletHeading align="left">{text.heading}</WalletHeading>
          <p className="w-full [word-break:break-word]" style={WALLET_TYPE.body} data-node-id="6322:60904">
            {text.bodyBefore}
            {text.phone ? <strong style={{ fontWeight: 700 }}>{text.phone}</strong> : null}
            {text.bodyAfter}
          </p>
        </div>

        {/* Code Input Grid 6322:60905 */}
        <div
          className="flex w-full items-start justify-center gap-[8px] py-[8px]"
          data-wallet-code="true"
          data-digits={digits}
          data-node-id="6322:60905"
          aria-hidden="true"
        >
          {Array.from({ length: c.length }, (_, i) => {
            const filled = i < digits.length;
            const active = i === digits.length;
            return (
              <span
                key={i}
                className="box-border flex h-[56px] w-[48px] shrink items-center justify-center"
                style={{
                  borderRadius: WALLET_SIZE.radiusSmall,
                  background: filled ? WALLET_COLOR.soft : WALLET_COLOR.background,
                  border: filled
                    ? `1px solid ${WALLET_COLOR.codeFilled}`
                    : active
                      ? `2px solid ${WALLET_COLOR.green}`
                      : `1.5px solid ${WALLET_COLOR.line}`,
                  ...WALLET_TYPE.codeDigit,
                }}
                data-box={filled ? "filled" : active ? "active" : "empty"}
              >
                {filled ? (
                  digits[i]
                ) : active ? (
                  <span className="gnl-wallet-caret block h-[24px] w-[2px]" style={{ background: WALLET_COLOR.green }} />
                ) : null}
              </span>
            );
          })}
        </div>
        {/* brief §12: aria-live on W-07's status text. */}
        <p className="sr-only" role="status" aria-live="polite">
          {`${digits.length} of ${c.length} digits entered`}
        </p>
      </div>

      {/* Keypad and Button Area 6322:60921 — #F3F5FB to the bottom of the phone */}
      <div
        className="flex w-full flex-col items-start gap-[16px] pt-[24px]"
        style={{ background: WALLET_COLOR.soft, paddingBottom: WALLET_SIZE.homeIndicatorArea }}
      >
        <div className="flex w-full px-[24px]">
          <button
            type="button"
            onClick={submit}
            disabled={!complete || busy}
            className={WALLET_BUTTON_CLASS}
            style={walletButtonStyle(complete ? "primary" : "disabled")}
            data-wallet-action="continue"
          >
            <span>{c.action}</span>
            <IconArrowRight color={complete ? "#ffffff" : WALLET_COLOR.textSecondary} />
          </button>
        </div>

        {/* Numeric Keypad Grid 6322:60931 — 1 px gaps show the #E6E8EF behind. */}
        <div className="grid w-full grid-cols-3 gap-px" style={{ background: WALLET_COLOR.line }} data-wallet-keypad="true">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button key={d} type="button" onClick={() => press(d)} className={keyClass} style={keyStyle}>
              {d}
            </button>
          ))}
          <span className="h-[54px]" style={{ background: WALLET_COLOR.soft }} />
          <button type="button" onClick={() => press("0")} className={keyClass} style={keyStyle}>
            0
          </button>
          <button
            type="button"
            onClick={del}
            aria-label={c.deleteLabel}
            className={keyClass}
            style={{ background: WALLET_COLOR.soft }}
          >
            <WalletBackspaceGlyph />
          </button>
        </div>
      </div>
    </WalletScreen>
  );
}
