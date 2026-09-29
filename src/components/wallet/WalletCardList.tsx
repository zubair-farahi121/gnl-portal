"use client";

import { useEffect, useState } from "react";

import { WalletCardCount } from "@/components/wallet/WalletClient";
import { WalletDigitalIdGlyph, WalletTruckGlyph, WalletVcGlyph } from "@/components/wallet/WalletGlyphs";
import { IconChevron } from "@/components/wallet/WalletUi";
import { useDemoState } from "@/lib/demo-state";
import { WALLET_COPY, issuedLabel } from "@/lib/data/flow3";
import { WALLET_COLOR, WALLET_SIZE, WALLET_TIMING, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * W-09's credentials panel (6348:12403). ADDED 2026-09-29 (brief §7 W-09).
 *
 * BEFORE the certificate is added: the two older cards, "2 cards total".
 * AFTER (`cardIssuedAt` set by W-07 / W-08): the Vehicle Registration
 * Certificate on TOP, expanded, "Issued <today>", and "3 cards total".
 *
 * The new card slides in and carries a soft mint highlight for ~3 s — once
 * per issued card per tab (sessionStorage), so going back and forth does not
 * replay it. Every card is a button that shows the wallet toast.
 *
 * Prerendered in the BEFORE state (store empty at build); the real state
 * arrives after mount, like every other store reader in this demo.
 */

const CARD: React.CSSProperties = {
  background: WALLET_COLOR.background,
  border: `1px solid ${WALLET_COLOR.line}`,
  borderRadius: WALLET_SIZE.radiusMain,
};

const SEEN_KEY = "gnl-demo:wallet-card-seen";

export function WalletCardList() {
  const c = WALLET_COPY.cards;
  const { walletCardIssuedAt } = useDemoState();
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    if (!walletCardIssuedAt) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === walletCardIssuedAt;
      sessionStorage.setItem(SEEN_KEY, walletCardIssuedAt);
    } catch {
      /* ignore */
    }
    if (seen) return;
    setHighlight(true);
    const t = setTimeout(() => setHighlight(false), WALLET_TIMING.newCardHighlightMs);
    return () => clearTimeout(t);
  }, [walletCardIssuedAt]);

  return (
    <section
      className="flex w-full flex-col items-start gap-[16px] p-[16px]"
      style={{ background: WALLET_COLOR.tint05, border: `1px solid ${WALLET_COLOR.line}`, borderRadius: WALLET_SIZE.radiusMain }}
      aria-label={c.credentialsTitle}
      data-node-id="6348:12403"
    >
      <div className="flex w-full items-center justify-between">
        <div className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[4px]">
          <h2 style={WALLET_TYPE.cardTitle}>{c.credentialsTitle}</h2>
          <WalletCardCount style={WALLET_TYPE.cardDesc} />
        </div>
        <IconChevron dir="up" />
      </div>

      <div className="flex w-full flex-col gap-[12px]" data-wallet-cards="true">
        {walletCardIssuedAt ? (
          /* 6328:13004 — the new certificate, expanded */
          <button
            type="button"
            data-wallet-inert="true"
            className={`gnl-wallet-newcard flex w-full cursor-pointer flex-col items-start gap-[16px] p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d] ${
              highlight ? "gnl-wallet-highlight" : ""
            }`}
            style={{ ...CARD, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
            data-wallet-card="vehicle-registration-certificate"
            data-node-id="6328:13004"
          >
            <span className="flex w-full items-center justify-between">
              <span className="flex min-w-px flex-[1_0_0] items-center gap-[12px]">
                <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px]" style={{ background: WALLET_COLOR.mint }}>
                  <WalletTruckGlyph />
                </span>
                <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px]">
                  <span style={WALLET_TYPE.cardTitle}>{c.vrc.title}</span>
                  <span style={WALLET_TYPE.cardDesc} data-wallet-issued="true">
                    {issuedLabel(walletCardIssuedAt)}
                  </span>
                </span>
              </span>
              <IconChevron dir="down" />
            </span>
            <span
              className="flex w-full flex-col gap-[8px] p-[12px]"
              style={{ background: WALLET_COLOR.soft, borderRadius: WALLET_SIZE.radiusSmall, fontSize: "14px", lineHeight: 1.2 }}
              data-node-id="6328:13005"
            >
              {c.vrc.rows.map((r) => (
                <span key={r.label} className="flex w-full items-start justify-between gap-[12px]">
                  <span style={{ fontWeight: 300, color: WALLET_COLOR.textSecondary }}>{r.label}</span>
                  <span className="text-right" style={{ fontWeight: 900 }}>
                    {r.value}
                  </span>
                </span>
              ))}
            </span>
          </button>
        ) : null}

        {/* 6328:13015 / 6328:13076 — collapsed */}
        {c.others.map((o) => (
          <button
            key={o.nodeId}
            type="button"
            data-wallet-inert="true"
            className="flex w-full cursor-pointer items-center gap-[12px] p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d]"
            style={CARD}
            data-wallet-card={o.kind}
            data-node-id={o.nodeId}
          >
            <span
              className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px]"
              style={{ background: o.kind === "photo-id" ? WALLET_COLOR.tilePhotoId : WALLET_COLOR.tileProofOfAge }}
            >
              {o.kind === "photo-id" ? <WalletDigitalIdGlyph /> : <WalletVcGlyph width={24} />}
            </span>
            <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px]">
              <span style={WALLET_TYPE.cardTitle}>{o.title}</span>
              <span style={WALLET_TYPE.cardDesc}>{o.issued}</span>
            </span>
            <IconChevron dir="down" />
          </button>
        ))}
      </div>
    </section>
  );
}
