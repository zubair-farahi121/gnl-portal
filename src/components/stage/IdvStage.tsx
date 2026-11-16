"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  BrowserFrame,
  DeviceLabel,
  DeviceSlot,
  ICON,
  PHONE_CONTENT_H,
  PHONE_OUTER,
  PhoneFrame,
  PresenterStage,
  StageConnector,
  fitStage,
  useViewport,
  type StageTone,
} from "@/components/stage/StageChrome";
import { useDemoState } from "@/lib/demo-state";
import { DEFAULT_SERVICE_ID, SERVICES, serviceRoutes, type ServiceId } from "@/lib/data/service-config";
import {
  STAGE_FRAME_NAME,
  STAGE_MSG,
  clearStage,
  isServiceIdValue,
  phoneHomeUrl,
  safeStagePath,
  serviceFromPath,
  watchStage,
  type StageRecord,
} from "@/lib/stage-sync";

/*
 * /demo/idv-stage/ — THE IDV PRESENTER STAGE. ADDED 2026-10-23.
 *
 * André-Claude's ask: show the identity verification with the same layout
 * as the VC flow — the portal and the phone side by side. Left: the portal,
 * on the page the presenter was on (`?from=`). Right: a phone that runs the
 * CertifiO ID screens once it "scans" the hand-off QR. The two talk through
 * src/lib/stage-sync.ts — same tab, no server — so this works on the shared
 * Vercel link too.
 *
 * Opened with Shift+W from any onboarding or CertifiO ID page (DemoNav).
 * Shift+W again, or Exit, returns to the portal page the left frame is on.
 * Esc anywhere, or Reset demo, clears the demo and starts both devices over.
 * Reopening it — another presenter, another time — resumes where it was:
 * the portal page comes from `?from=`, the phone from the stage record.
 */

const DESK = { w: 1440, h: 900 } as const;
const BAR = 52;

const STEPS = [
  { label: "Start on computer" },
  { label: "Scan QR code" },
  { label: "Verify on phone" },
  { label: "Verified" },
] as const;

function stateOf(rec: StageRecord | null, service: ServiceId): { active: number; tone: StageTone; icon: string; label: string } {
  const s = rec && rec.service === service ? rec.status : null;
  if (s === "waiting") return { active: 1, tone: "waiting", icon: ICON.qr, label: "Waiting for scan" };
  if (s === "started") return { active: 2, tone: "active", icon: ICON.phone, label: "Phone connected" };
  if (s === "complete") return { active: 3, tone: "done", icon: ICON.check, label: "Identity verified" };
  return { active: 0, tone: "idle", icon: ICON.link, label: "Not connected yet" };
}

export function IdvStage() {
  const { resetAll } = useDemoState();
  const view = useViewport();
  const [cfg, setCfg] = useState<{ service: ServiceId; from: string } | null>(null);
  const [nonce, setNonce] = useState(0);
  const [rec, setRec] = useState<StageRecord | null>(null);
  const [deskPath, setDeskPath] = useState("");
  const [host, setHost] = useState("");
  const desk = useRef<HTMLIFrameElement>(null);
  const phone = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const from = safeStagePath(q.get("from"));
    const s = q.get("service");
    const service = isServiceIdValue(s) ? s : (from && serviceFromPath(from)) || DEFAULT_SERVICE_ID;
    setCfg({ service, from: from ?? serviceRoutes(service).page });
    setHost(window.location.host);
  }, []);

  useEffect(() => watchStage(setRec), []);

  /* The left frame's address, for the address bar and for Exit. Client-side
     navigation inside the frame fires no event the parent can hear, so poll. */
  useEffect(() => {
    const t = setInterval(() => {
      try {
        const l = desk.current?.contentWindow?.location;
        if (l && l.href !== "about:blank") setDeskPath(`${l.pathname}${l.search}`);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearInterval(t);
  }, []);

  /* Keep `?from=` on the stage's own URL in step with the left frame, so a
     reload — or the link sent to the next presenter — reopens the portal on
     the page it has reached, not the page the stage was first opened on. */
  useEffect(() => {
    const path = safeStagePath(deskPath);
    if (!path) return;
    const u = new URL(window.location.href);
    if (u.searchParams.get("from") === path) return;
    u.searchParams.set("from", path);
    const s = serviceFromPath(path);
    if (s) u.searchParams.set("service", s);
    window.history.replaceState(window.history.state, "", u);
  }, [deskPath]);

  const service = (deskPath && serviceFromPath(deskPath)) || rec?.service || cfg?.service || DEFAULT_SERVICE_ID;

  const exit = useCallback(() => {
    window.location.assign(safeStagePath(deskPath) ?? cfg?.from ?? "/");
  }, [deskPath, cfg]);

  const reset = useCallback(() => {
    resetAll();
    clearStage();
    setCfg((c) => (c ? { ...c, from: serviceRoutes(service).page } : c));
    setDeskPath("");
    setNonce((n) => n + 1);
  }, [resetAll, service]);

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

  const { side, sDesk, sPhone } = fitStage(view, { w: DESK.w, h: DESK.h + BAR });
  const st = stateOf(rec, service);
  const deviceH = Math.max((DESK.h + BAR) * sDesk, PHONE_OUTER.h * sPhone);

  return (
    <PresenterStage
      eyebrow="Presenter view · Identity verification"
      title={
        (deskPath && serviceFromPath(deskPath)) || rec
          ? `${SERVICES[service].title} — CertifiO ID on a smartphone`
          : "MyGovNL — identity verification with CertifiO ID"
      }
      steps={STEPS}
      active={st.active}
      tone={st.tone}
      onReset={reset}
      onExit={exit}
      data-idv-stage="true"
      data-stage-service={service}
      data-stage-state={rec && rec.service === service ? rec.status : "idle"}
    >
      <div className={`flex flex-1 items-center justify-center ${side ? "flex-row" : "flex-col gap-[40px]"}`}>
        <DeviceSlot
          height={side ? deviceH : undefined}
          label={<DeviceLabel icon={ICON.monitor} title="Computer" subtitle="MyGovNL portal" />}
        >
          <BrowserFrame w={DESK.w} h={DESK.h} scale={sDesk} url={{ host, path: deskPath || cfg?.from || "" }}>
            {cfg ? (
              <iframe
                key={`desk-${nonce}`}
                ref={desk}
                name={STAGE_FRAME_NAME.desktop}
                src={cfg.from}
                title="MyGovNL portal (computer)"
                allow="camera"
                className="block border-0"
                style={{ width: DESK.w, height: DESK.h }}
                data-stage-frame="desktop"
              />
            ) : null}
          </BrowserFrame>
        </DeviceSlot>

        {side ? <StageConnector tone={st.tone} icon={st.icon} label={st.label} height={deviceH} /> : null}

        <DeviceSlot
          height={side ? deviceH : undefined}
          label={<DeviceLabel icon={ICON.phone} title="Phone" subtitle="CertifiO ID" />}
        >
          <PhoneFrame scale={sPhone} statusBar>
            {cfg ? (
              <iframe
                key={`phone-${nonce}`}
                ref={phone}
                name={STAGE_FRAME_NAME.phone}
                src={phoneHomeUrl(cfg.service)}
                title="CertifiO ID (phone)"
                allow="camera"
                className="block border-0"
                style={{ width: 393, height: PHONE_CONTENT_H.withStatusBar }}
                data-stage-frame="phone"
              />
            ) : null}
          </PhoneFrame>
        </DeviceSlot>
      </div>
    </PresenterStage>
  );
}
