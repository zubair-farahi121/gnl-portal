"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { ICON, Icon } from "@/components/stage/StageChrome";
import { MOBILE_ROUTE } from "@/lib/data/phone-path";
import { cidRoutes } from "@/lib/data/service-config";
import { qrMatrix } from "@/lib/qr";
import { phoneDoneUrl, stageQrUrl, watchStage, type StageRecord } from "@/lib/stage-sync";

/*
 * /demo/idv-phone/ — THE STAGE PHONE's home screen. ADDED 2026-10-23.
 *
 * What the phone shows before and around the CertifiO ID screens, inside
 * the IDV presenter stage (src/components/stage/IdvStage.tsx). It follows the
 * stage record (src/lib/stage-sync.ts), for whichever service it names:
 *
 *   no hand-off yet  "Ready when you are" — what to do on the computer
 *   `waiting`        the camera: "Scan the QR code", with the computer's
 *                    own QR in the viewfinder. Tap "Scan QR code" — or
 *                    click the QR on the computer — and it is detected,
 *                    then /cid/mobile/ starts CertifiO ID on this phone
 *   `started`        straight back to the CertifiO ID screen it was on
 *   `complete`       straight to "You can return to your computer"
 *
 * The CertifiO ID screens themselves are the demo's existing ones.
 */

type Mode = "idle" | "scan" | "detected";

const DETECT_MS = 900;

function Corner({ className, d }: { className: string; d: string }) {
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" className={`absolute ${className}`} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Viewfinder({ url, detected }: { url: string; detected: boolean }) {
  const qr = useMemo(() => qrMatrix(url), [url]);
  const q = 2;
  const box = qr.size + q * 2;
  return (
    <div className="relative size-[264px]" data-phone-viewfinder="true">
      {/* the computer's screen, seen through the camera */}
      <div className="absolute inset-[18px] overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_50%_40%,#2a3a4d,#141c26_75%)]">
        <div className="gnl-stage-focus absolute inset-[26px] rounded-[10px] bg-white p-[8px] shadow-[0_0_40px_rgba(140,190,255,0.35)]">
          <svg viewBox={`${-q} ${-q} ${box} ${box}`} className="block size-full" shapeRendering="crispEdges" aria-hidden="true">
            <path d={qr.path} fill="#1b222b" />
          </svg>
        </div>
      </div>
      <div className={`absolute inset-0 transition-colors duration-300 ${detected ? "text-[#3fcf8e]" : "text-white"}`}>
        <Corner className="top-0 left-0" d="M3 22V9a6 6 0 0 1 6-6h13" />
        <Corner className="top-0 right-0" d="M18 3h13a6 6 0 0 1 6 6v13" />
        <Corner className="bottom-0 left-0" d="M3 18v13a6 6 0 0 0 6 6h13" />
        <Corner className="right-0 bottom-0" d="M18 37h13a6 6 0 0 0 6-6V18" />
      </div>
      {detected ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="gnl-stage-pop flex size-[84px] items-center justify-center rounded-full bg-[#3fcf8e] text-white shadow-[0_0_0_10px_rgba(63,207,142,0.25)]">
            <Icon d={ICON.check} size={42} width={3} />
          </span>
        </div>
      ) : (
        <span className="gnl-stage-scanline absolute top-[16px] right-[22px] left-[22px] h-[3px] rounded-full bg-[linear-gradient(90deg,transparent,#5be0b5,transparent)] shadow-[0_0_14px_#5be0b5]" />
      )}
    </div>
  );
}

function Step({ n, icon, title, body }: { n: number; icon: string; title: string; body: string }) {
  return (
    <li className="gnl-stage-rise flex items-start gap-[14px]" style={{ animationDelay: `${120 + n * 90}ms` }}>
      <span className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] bg-[#eaf2fb] text-[#286cab]">
        <Icon d={icon} size={20} />
      </span>
      <span className="pt-[1px]">
        <span className="block text-[15px] font-bold text-[#212326]">{title}</span>
        <span className="block text-[13px] leading-[1.45] text-[#5f6368]">{body}</span>
      </span>
    </li>
  );
}

export function IdvPhoneHome() {
  const router = useRouter();
  const [rec, setRec] = useState<StageRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [detected, setDetected] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const mountedAt = useRef(0);
  const leaving = useRef(false);

  useEffect(() => {
    mountedAt.current = Date.now();
    return watchStage((r) => {
      setRec(r);
      setReady(true);
    });
  }, []);

  /* Resume: a verification already under way goes straight back to it. */
  useEffect(() => {
    if (!rec || leaving.current) return;
    if (rec.status === "started") {
      leaving.current = true;
      router.replace(rec.phoneRoute ?? cidRoutes(rec.service).terms);
    } else if (rec.status === "complete") {
      leaving.current = true;
      router.replace(phoneDoneUrl(rec.service));
    } else {
      setQrUrl(stageQrUrl(rec.service));
    }
  }, [rec, router]);

  const mode: Mode = detected ? "detected" : rec?.status === "waiting" ? "scan" : "idle";

  const scan = () => {
    if (!rec || rec.status !== "waiting" || detected) return;
    setDetected(true);
    const service = rec.service;
    setTimeout(() => {
      leaving.current = true;
      router.push(`${MOBILE_ROUTE}?service=${service}`);
    }, DETECT_MS);
  };

  /* The presenter clicked the QR on the computer: scan it from here. */
  useEffect(() => {
    if (rec?.status === "waiting" && rec.scan && rec.scan >= mountedAt.current - 1000) scan();
    // `scan` closes over `rec`; it is re-created with it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rec?.scan, rec?.status]);

  if (!ready) return <main className="h-[100dvh] w-full bg-[#001f30]" />;

  if (mode !== "idle") {
    return (
      <main
        className="relative flex h-[100dvh] w-full flex-col items-center overflow-hidden bg-[radial-gradient(120%_80%_at_50%_30%,#1d2733_0%,#0b1015_70%)] px-[28px] pt-[44px] pb-[36px] text-white"
        data-phone-home={mode}
      >
        <div className="gnl-stage-rise text-center">
          <h1 className="text-[26px] font-bold leading-[1.25]">{mode === "detected" ? "QR code detected" : "Scan the QR code"}</h1>
          <p className="mt-[10px] text-[15px] leading-[1.5] text-[#aab6c3]">
            {mode === "detected" ? "Opening CertifiO ID…" : "Point your camera at the code on your computer screen."}
          </p>
        </div>
        <div className="flex flex-1 items-center justify-center">
          {qrUrl ? <Viewfinder url={qrUrl} detected={mode === "detected"} /> : null}
        </div>
        <button
          type="button"
          onClick={scan}
          disabled={mode === "detected"}
          className="flex h-[56px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-full bg-white text-[17px] font-bold text-[#0b1015] shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform active:scale-[0.98] disabled:opacity-60"
          data-phone-scan="true"
        >
          <Icon d={ICON.qr} size={20} />
          Scan QR code
        </button>
        <p className="mt-[14px] text-center text-[13px] text-[#7f8c99]">Tip: you can also click the QR code on the computer.</p>
      </main>
    );
  }

  return (
    <main className="flex h-[100dvh] w-full flex-col overflow-y-auto bg-white" data-phone-home="idle">
      <div className="relative flex flex-col items-center bg-[linear-gradient(180deg,#001f30_0%,#005d8f_100%)] px-[28px] pt-[36px] pb-[56px] text-center text-white">
        <span className="gnl-stage-pop flex size-[78px] items-center justify-center rounded-[24px] bg-[linear-gradient(145deg,#4b9be6,#286cab)] shadow-[0_14px_34px_rgba(20,60,110,0.55),inset_0_1px_0_rgba(255,255,255,0.35)]">
          <Icon d={ICON.shield} size={40} width={1.9} />
        </span>
        <p className="mt-[18px] text-[26px] font-bold leading-[1.2]">CertifiO ID</p>
        <p className="mt-[6px] text-[14px] text-[#c4d3e2]">Secure identity verification for the NWT eServices Portal</p>
      </div>
      <div className="relative -mt-[28px] flex flex-1 flex-col rounded-t-[28px] bg-white px-[24px] pt-[28px] pb-[28px]">
        <h1 className="text-[22px] font-bold leading-[1.3] text-[#212326]">Ready when you are</h1>
        <p className="mt-[8px] text-[15px] leading-[1.5] text-[#5f6368]">
          On your computer, choose <span className="font-bold text-[#212326]">“Continue on a smartphone”</span>. Then scan
          the QR code with this phone.
        </p>
        <div className="mt-[18px] flex items-center gap-[12px] rounded-[16px] bg-[#f3f6f9] px-[16px] py-[14px]" role="status" aria-live="polite">
          <span className="gnl-stage-breathe size-[10px] shrink-0 rounded-full bg-[#f5b544]" />
          <span className="text-[14px] font-bold text-[#33404d]">Waiting for your computer…</span>
        </div>
        <p className="mt-[26px] text-[12px] font-bold uppercase tracking-[0.12em] text-[#8a939d]">What happens next</p>
        <ol className="mt-[14px] flex flex-col gap-[16px]">
          <Step n={1} icon={ICON.qr} title="Scan the QR code" body="It links this phone to your session on the computer." />
          <Step n={2} icon="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0" title="Take a quick selfie" body="A short liveness check proves it is really you." />
          <Step n={3} icon="M3 6h18v12H3zM7 10h4M7 14h6M15 10h2v4h-2z" title="Photograph your ID" body="Your driver’s licence or passport." />
        </ol>
        <p className="mt-auto pt-[24px] text-center text-[12px] text-[#8a939d]">Your photos are used only to verify your identity.</p>
      </div>
    </main>
  );
}
