"use client";

import { useEffect, useState } from "react";

import { useDemoState } from "@/lib/demo-state";
import { C1_CONTENT, C1_ROUTE } from "@/lib/data/credentials";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_SIZE } from "@/lib/data/wallet-tokens";
import { isCredentialKind, offerKind, peekCurrentOffer, type CredentialKind } from "@/lib/mock-issuer";

/*
 * The presenter stage's two frames (see src/app/demo/wallet-stage/page.tsx).
 *
 *   left   the C1 page (F3-02) rendered at its design size, 1440 x 1024, and
 *          SCALED to fit what is left of the screen
 *   right  the wallet at the brief's phone size, 393 x 852 (at 393 wide the
 *          wallet is full screen, so the stage draws the phone's outline:
 *          radius 48, 1 px #E6E8EF), scaled down only if the screen is short
 *
 * "Reset demo" clears the shared store (brief §9) and reloads both frames:
 * the C1 frame makes a new offer, the wallet goes back to W-01.
 *
 * The scale is computed after mount (window size is unknown at build time);
 * the first paint uses scale 0.5 so the static HTML is sane.
 *
 * WHICH C1 PAGE — FLOW 4, 2026-10-14. The stage shows the C1 page of the
 * credential being demoed: `?c=studentaid` (DemoNav's Shift+W adds it when
 * pressed on a StudentAidNL page — see `stageRoute`), else the current
 * offer's kind (Shift+W pressed in the wallet mid-Flow-4), else Flow 3's
 * vehicle certificate, as before. Decided after mount, and the two frames are
 * only mounted once it is decided: a C1 frame that loaded as Flow 3's and was
 * then swapped would have minted a vehicle offer on the way.
 */
const C1 = { w: 1440, h: 1024 };
const PHONE = { w: WALLET_SIZE.phoneWidth, h: WALLET_SIZE.phoneHeight };
const GAP = 40;
const PAD = 32;
const HEADER = 44;

export function WalletStage() {
  const { resetAll } = useDemoState();
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [nonce, setNonce] = useState(0);
  const [kind, setKind] = useState<CredentialKind | null>(null);

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    setKind(isCredentialKind(c) ? c : offerKind(peekCurrentOffer()));
  }, []);

  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);

  /* Side by side on a presenter screen; on a narrow one (never the stage's
     purpose, but it must not scroll sideways) the two stack and each scales
     to the full width. */
  const vw = size ? size.w - PAD * 2 : 1000;
  const availH = size ? size.h - PAD * 2 - HEADER : 800;
  const sPhone = Math.min(1, availH / PHONE.h, (vw - 2) / PHONE.w);
  const sideBySide = vw - GAP - PHONE.w * sPhone >= 480;
  const availW = sideBySide ? vw - GAP - PHONE.w * sPhone : vw;
  const sC1 = Math.min(availW / C1.w, sideBySide ? availH / C1.h : 1);

  return (
    <div className="box-border flex min-h-[100dvh] w-full flex-col bg-[#e9ecef]" style={{ padding: PAD }} data-wallet-stage="true">
      <div className="flex items-center justify-between" style={{ height: HEADER }}>
        <p className="text-[14px] font-bold text-[#5f6368]">
          {kind === "studentaid" ? "Presenter stage — Flow 4 (StudentAidNL + wallet)" : "Presenter stage — Flow 3 (MyGovNL + wallet)"}
        </p>
        <button
          type="button"
          onClick={() => {
            resetAll();
            setNonce((n) => n + 1);
          }}
          className="cursor-pointer rounded-[6px] bg-[#243746] px-[16px] py-[6px] text-[14px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004b87]"
          data-stage-reset="true"
        >
          Reset demo
        </button>
      </div>
      <div className="flex flex-1 flex-wrap items-center justify-center" style={{ gap: GAP }}>
        <div
          className="overflow-hidden rounded-[6px] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          style={{ width: C1.w * sC1, height: C1.h * sC1 }}
        >
          {kind ? (
            <iframe
              key={`c1-${nonce}`}
              src={C1_ROUTE[kind]}
              title={`MyGovNL — ${C1_CONTENT[kind].copy.heading}`}
              className="block origin-top-left border-0"
              style={{ width: C1.w, height: C1.h, transform: `scale(${sC1})` }}
              data-stage-frame="c1"
              data-stage-credential={kind}
            />
          ) : null}
        </div>
        <div
          className="overflow-hidden border border-solid border-[#e6e8ef] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
          style={{ width: PHONE.w * sPhone + 2, height: PHONE.h * sPhone + 2, borderRadius: WALLET_SIZE.phoneRadius * sPhone }}
        >
          {kind ? (
            <iframe
              key={`w-${nonce}`}
              src={FLOW3_ROUTES.walletHome}
              title="Wallet (phone)"
              className="block origin-top-left border-0"
              style={{ width: PHONE.w, height: PHONE.h, transform: `scale(${sPhone})` }}
              data-stage-frame="wallet"
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
