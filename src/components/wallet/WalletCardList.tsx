"use client";

import { useEffect, useState } from "react";

import { WalletCardCount } from "@/components/wallet/WalletClient";
import { WalletDigitalIdGlyph, WalletTasksGlyph, WalletTruckGlyph, WalletVcGlyph } from "@/components/wallet/WalletGlyphs";
import { IconChevron } from "@/components/wallet/WalletUi";
import { useDemoState } from "@/lib/demo-state";
import { WALLET_CREDENTIALS, type WalletCredential } from "@/lib/data/credentials";
import { WALLET_COPY, issuedLabel } from "@/lib/data/flow3";
import type { CredentialKind } from "@/lib/mock-issuer";
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
 *
 * FLOW 4 (2026-10-14) — Figma 6412:86648, "4 cards total". Every credential on
 * the phone is a card, NEWEST FIRST (decision 5): the most recently issued
 * one on top and EXPANDED, any other issued credential COLLAPSED below it
 * (6412:86685 — the vehicle certificate after Flow 4: the mint truck tile,
 * title, "Issued …", a chevron), then Photo ID and Proof of age. Flow 3 alone
 * is the old list exactly: the vehicle certificate is then the newest card,
 * rendered by the same markup as before.
 */

const CARD: React.CSSProperties = {
  background: WALLET_COLOR.background,
  border: `1px solid ${WALLET_COLOR.line}`,
  borderRadius: WALLET_SIZE.radiusMain,
};

const SEEN_KEY = "gnl-demo:wallet-card-seen";

export function WalletCardList() {
  const c = WALLET_COPY.cards;
  const { walletIssued } = useDemoState();
  const [highlight, setHighlight] = useState(false);
  /* The newest credential — the one that slides in, highlighted, expanded. */
  const top = walletIssued[0] ?? null;
  const topIssuedAt = top?.issuedAt ?? null;

  useEffect(() => {
    if (!topIssuedAt) return;
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === topIssuedAt;
      sessionStorage.setItem(SEEN_KEY, topIssuedAt);
    } catch {
      /* ignore */
    }
    if (seen) return;
    setHighlight(true);
    const t = setTimeout(() => setHighlight(false), WALLET_TIMING.newCardHighlightMs);
    return () => clearTimeout(t);
  }, [topIssuedAt]);

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
        {top && top.kind !== "driver-vehicle" ? (
          <ExpandedCard cred={WALLET_CREDENTIALS[top.kind]} issuedAt={top.issuedAt} highlight={highlight} />
        ) : null}
        {top?.kind === "driver-vehicle" ? (
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
                    {issuedLabel(top.issuedAt)}
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

        {/* Flow 4: the older issued credentials, collapsed (6412:86685). */}
        {walletIssued.slice(1).map((card) => (
          <CollapsedCard key={card.kind} cred={WALLET_CREDENTIALS[card.kind]} issuedAt={card.issuedAt} />
        ))}

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

/* ------------------------------------------------- Flow 4 (2026-10-14) -- */

function CredentialTile({ kind }: { kind: CredentialKind }) {
  return (
    <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[8px]" style={{ background: WALLET_COLOR.mint }}>
      {WALLET_CREDENTIALS[kind].card.glyph === "tasks" ? (
        <WalletTasksGlyph size={32} color={WALLET_COLOR.brand} />
      ) : (
        <WalletTruckGlyph />
      )}
    </span>
  );
}

/**
 * The newest credential when it is NOT the vehicle certificate — Flow 4's
 * notice of assessment, 6412:86666: the mint tile with `Tasks_list`, three
 * lines 4 px apart (title 600 16; "StudentAidNL, MyGovNL" 300 14 in FULL
 * ink; "Issued <today>" 300 14 at 70 %), the chevron, then the #F3F5FB box of
 * label / value rows (300 70 % / 900, 14/120 %). The vehicle certificate keeps
 * its own markup above, unchanged.
 */
function ExpandedCard({ cred, issuedAt, highlight }: { cred: WalletCredential; issuedAt: string; highlight: boolean }) {
  return (
    <button
      type="button"
      data-wallet-inert="true"
      className={`gnl-wallet-newcard flex w-full cursor-pointer flex-col items-start gap-[16px] p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d] ${
        highlight ? "gnl-wallet-highlight" : ""
      }`}
      style={{ ...CARD, boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}
      data-wallet-card={cred.card.dataCard}
      data-node-id="6412:86666"
    >
      <span className="flex w-full items-center justify-between">
        <span className="flex min-w-px flex-[1_0_0] items-center gap-[12px]">
          <CredentialTile kind={cred.kind} />
          <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[4px]">
            <span style={WALLET_TYPE.cardTitle}>{cred.card.title}</span>
            {cred.card.subline ? <span style={{ ...WALLET_TYPE.cardDesc, color: WALLET_COLOR.text }}>{cred.card.subline}</span> : null}
            <span style={WALLET_TYPE.cardDesc} data-wallet-issued="true">
              {cred.card.issuedLabel(issuedAt)}
            </span>
          </span>
        </span>
        <IconChevron dir="down" />
      </span>
      <span
        className="flex w-full flex-col gap-[8px] p-[12px]"
        style={{ background: WALLET_COLOR.soft, borderRadius: WALLET_SIZE.radiusSmall, fontSize: "14px", lineHeight: 1.2 }}
        data-node-id="6412:86675"
      >
        {cred.card.rows.map((r) => (
          <span key={r.label} className="flex w-full items-start justify-between gap-[12px]">
            <span style={{ fontWeight: 300, color: WALLET_COLOR.textSecondary }}>{r.label}</span>
            <span className="text-right" style={{ fontWeight: 900 }}>
              {r.value}
            </span>
          </span>
        ))}
      </span>
    </button>
  );
}

/**
 * An issued credential that is no longer the newest — 6412:86685 (the
 * vehicle certificate under Flow 4's notice of assessment): the mint tile,
 * title 600 16 and "Issued …" 300 14 at 70 %, 2 px apart, the chevron.
 */
function CollapsedCard({ cred, issuedAt }: { cred: WalletCredential; issuedAt: string }) {
  return (
    <button
      type="button"
      data-wallet-inert="true"
      className="flex w-full cursor-pointer items-center gap-[12px] p-[16px] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e404d]"
      style={CARD}
      data-wallet-card={cred.card.dataCard}
      data-wallet-collapsed="true"
    >
      <CredentialTile kind={cred.kind} />
      <span className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[2px]">
        <span style={WALLET_TYPE.cardTitle}>{cred.card.title}</span>
        <span style={WALLET_TYPE.cardDesc} data-wallet-issued="true">
          {cred.card.issuedLabel(issuedAt)}
        </span>
      </span>
      <IconChevron dir="down" />
    </button>
  );
}
