"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  BrowserFrame,
  DeviceLabel,
  DeviceSlot,
  ICON,
  PHONE_OUTER,
  PhoneFrame,
  PresenterStage,
  StageConnector,
  fitStage,
  useViewport,
  type StageTone,
} from "@/components/stage/StageChrome";
import { useDemoState } from "@/lib/demo-state";
import { C1_ROUTE } from "@/lib/data/credentials";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_SIZE } from "@/lib/data/wallet-tokens";
import { STAGE_MSG, WALLET_STAGE_FRAME_NAME, safeStagePath } from "@/lib/stage-sync";
import {
  isCredentialKind,
  offerKind,
  peekCurrentOffer,
  type CredentialKind,
  type CredentialOffer,
} from "@/lib/mock-issuer";

/*
 * The presenter stage's two frames (see src/app/demo/wallet-stage/page.tsx).
 *
 *   left   the C1 page (F3-02) rendered at its design size, 1440 x 1024, in a
 *          browser window, SCALED to fit what is left of the screen
 *   right  the wallet at the brief's phone size, 393 x 852, in a phone,
 *          scaled down only if the screen is short
 *
 * RESTYLED 2026-10-23 with the IDV presenter stage
 * (src/components/stage/StageChrome.tsx): the same dark stage, presenter
 * header, device frames and live link between the devices, so the two
 * stages look like one product. The header's steps and the link follow the
 * current offer. The frames, their URLs and every `data-stage-*` hook are
 * unchanged. It also no longer wraps the phone under the browser at
 * 1440 x 900 (the old sizing came out exactly one gap too wide there).
 *
 * "Reset demo" clears the shared store (brief §9) and reloads both frames:
 * the C1 frame makes a new offer, the wallet goes back to W-01.
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
const BAR = 52;

const STEPS = [
  { label: "Scan QR code" },
  { label: "Connect wallet" },
  { label: "Review & accept" },
  { label: "Confirm code" },
  { label: "Added" },
] as const;

const TITLES: Record<CredentialKind, string> = {
  "driver-vehicle": "Driver and Vehicle Services — vehicle registration certificate",
  studentaid: "Student Financial Assistance — notice of assessment",
};

function stateOf(offer: CredentialOffer | null): { active: number; tone: StageTone; icon: string; label: string } {
  switch (offer?.status) {
    case "scanned":
      return { active: 1, tone: "active", icon: ICON.phone, label: "Wallet connecting" };
    case "connected":
    case "viewed":
      return { active: 2, tone: "active", icon: ICON.wallet, label: "Reviewing the offer" };
    case "accepted":
      return { active: 3, tone: "active", icon: ICON.lock, label: "Confirming the code" };
    case "code_verified":
      return { active: 4, tone: "active", icon: ICON.wallet, label: "Adding to wallet" };
    case "issued":
      return { active: 4, tone: "done", icon: ICON.check, label: "Added to wallet" };
    default:
      return { active: 0, tone: "waiting", icon: ICON.qr, label: "Waiting for scan" };
  }
}

export function WalletStage() {
  const { resetAll, walletOffer } = useDemoState();
  const view = useViewport();
  const [nonce, setNonce] = useState(0);
  const [kind, setKind] = useState<CredentialKind | null>(null);
  const [host, setHost] = useState("");

  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("c");
    setKind(isCredentialKind(c) ? c : offerKind(peekCurrentOffer()));
    setHost(window.location.host);
  }, []);

  const desk = useRef<HTMLIFrameElement>(null);
  const phone = useRef<HTMLIFrameElement>(null);

  /* Shift+W = leave the stage (fix 2026-11-23): full screen on the page the
     computer frame shows now (same origin), else the credential's C1 page. */
  const exit = useCallback(() => {
    let to: string | null = null;
    try {
      const l = desk.current?.contentWindow?.location;
      if (l) to = safeStagePath(`${l.pathname}${l.search}`);
    } catch {
      /* ignore */
    }
    window.location.assign(to ?? (kind ? C1_ROUTE[kind] : "/dashboard/"));
  }, [kind]);

  /* Esc on the stage page (DemoNav) = Reset demo. */
  const reset = useCallback(() => {
    resetAll();
    setNonce((n) => n + 1);
  }, [resetAll]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      /* Only the stage's own two frames may ask. */
      if (e.source !== desk.current?.contentWindow && e.source !== phone.current?.contentWindow) return;
      const type = (e.data as { gnlStage?: string } | null)?.gnlStage;
      if (type === STAGE_MSG.exit) exit();
      if (type === STAGE_MSG.reset) reset();
    };
    window.addEventListener("message", onMsg);
    window.addEventListener(STAGE_MSG.exit, exit);
    window.addEventListener(STAGE_MSG.reset, reset);
    return () => {
      window.removeEventListener("message", onMsg);
      window.removeEventListener(STAGE_MSG.exit, exit);
      window.removeEventListener(STAGE_MSG.reset, reset);
    };
  }, [exit, reset]);

  const { side, sDesk, sPhone } = fitStage(view, { w: C1.w, h: C1.h + BAR });
  const offer = kind && walletOffer && offerKind(walletOffer) === kind ? walletOffer : null;
  const st = stateOf(offer);
  const deviceH = Math.max((C1.h + BAR) * sDesk, PHONE_OUTER.h * sPhone);

  return (
    <PresenterStage
      eyebrow="Presenter view · Digital wallet"
      title={kind ? TITLES[kind] : "Digital wallet"}
      steps={STEPS}
      active={st.active}
      tone={st.tone}
      onReset={() => {
        resetAll();
        setNonce((n) => n + 1);
      }}
      data-wallet-stage="true"
    >
      <div className={`flex flex-1 items-center justify-center ${side ? "flex-row" : "flex-col gap-[40px]"}`}>
        <DeviceSlot
          height={side ? deviceH : undefined}
          label={<DeviceLabel icon={ICON.monitor} title="Computer" subtitle="NWT eServices Portal" />}
        >
          <BrowserFrame w={C1.w} h={C1.h} scale={sDesk} url={{ host, path: kind ? C1_ROUTE[kind] : "" }}>
            {kind ? (
              <iframe
                ref={desk}
                name={WALLET_STAGE_FRAME_NAME.desktop}
                key={`c1-${nonce}`}
                src={C1_ROUTE[kind]}
                title="NWT eServices Portal — add to your wallet (computer)"
                className="block border-0"
                style={{ width: C1.w, height: C1.h }}
                data-stage-frame="c1"
                data-stage-credential={kind}
              />
            ) : null}
          </BrowserFrame>
        </DeviceSlot>

        {side ? <StageConnector tone={st.tone} icon={st.icon} label={st.label} height={deviceH} /> : null}

        <DeviceSlot
          height={side ? deviceH : undefined}
          label={<DeviceLabel icon={ICON.phone} title="Phone" subtitle="Digital wallet" />}
        >
          <PhoneFrame scale={sPhone} statusBar={false}>
            {kind ? (
              <iframe
                ref={phone}
                name={WALLET_STAGE_FRAME_NAME.phone}
                key={`w-${nonce}`}
                src={FLOW3_ROUTES.walletHome}
                title="Wallet (phone)"
                className="block border-0"
                style={{ width: WALLET_SIZE.phoneWidth, height: WALLET_SIZE.phoneHeight }}
                data-stage-frame="wallet"
              />
            ) : null}
          </PhoneFrame>
        </DeviceSlot>
      </div>
    </PresenterStage>
  );
}
