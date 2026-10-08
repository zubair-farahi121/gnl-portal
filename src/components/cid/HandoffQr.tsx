"use client";

/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { ASSETS } from "@/lib/assets";
import { useDemoState } from "@/lib/demo-state";
import { PHONE_PATH_COPY } from "@/lib/data/phone-path";
import { APP_ROUTES, type ServiceId } from "@/lib/data/service-config";
import { qrMatrix } from "@/lib/qr";
import { openHandoff, readIdv, watchRoom } from "@/lib/remote-sync";

/*
 * `image 13` (6156:60706) on CID_Redirect to mobile — the hand-off QR, and,
 * with the phone path, a REAL one. ADDED 2026-09-30 (docs/PHONE_PATH.md).
 *
 * STATIC BUILD: exactly the markup CidContinueOnMobileScreen always rendered
 * — the 220.4013671875 x 216.981201171875 box holding the placeholder <img> —
 * and nothing else, ever. This island's first render IS that markup, so the
 * prerendered HTML and the pixel gate's `cid-continue-on-mobile` frame do not
 * change by a byte.
 *
 * PHONE MODE (served by server/demo-server.mjs and switched on at
 * /demo/phone/): once the room is open, the same box holds a scannable QR for
 * `<base>/cid/mobile/?room=<room>&service=<service>` (exposed as
 * `data-qr-url` for tests), drawn 216.98 px square and centred, so nothing
 * around it moves. Under it, one quiet status line in the Flow 3 C1 state
 * line's treatment: "Waiting for your phone…", then "Continue on your
 * phone…" once the phone opens the link. When the phone reaches CID verified
 * the laptop does by itself exactly what CID verified's Continue does on a
 * laptop run — `markVerified(service)` and on to /auth/loading/, the
 * processing step, which then advances to this service's next screen. So the
 * presenter carries on here. "Continue on my computer" is untouched.
 *
 * NOT A CONTROL, as before: the QR is for a phone camera, not for a click.
 */
const BOX = 216.981201171875;

export function HandoffQr({ serviceId }: { serviceId: ServiceId }) {
  const router = useRouter();
  const { markVerified } = useDemoState();
  const [handoff, setHandoff] = useState<{ url: string; run: string } | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    let dead = false;
    let stop: (() => void) | undefined;
    void (async () => {
      const h = await openHandoff(serviceId);
      if (!h || dead) return;
      setHandoff(h);
      stop = watchRoom((st) => {
        const idv = readIdv(st.doc.idv);
        if (!idv || idv.run !== h.run || idv.service !== serviceId) return;
        if (idv.status === "started") setStarted(true);
        if (idv.status === "complete") {
          stop?.();
          /* Same two lines as CidVerifiedScreen's onContinue. */
          markVerified(serviceId);
          router.push(APP_ROUTES.processing);
        }
      });
    })();
    return () => {
      dead = true;
      stop?.();
    };
    // `markVerified` changes identity on every store write; run once per service.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceId, router]);

  const qr = useMemo(() => (handoff ? qrMatrix(handoff.url) : null), [handoff]);

  if (!handoff || !qr) {
    return (
      <div
        className="relative h-[216.981201171875px] w-[220.4013671875px] shrink-0"
        data-node-id="6156:60706"
      >
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSETS.qrMobileHandoff} />
      </div>
    );
  }

  const quiet = 4;
  const box = qr.size + quiet * 2;
  const status = started ? PHONE_PATH_COPY.handoffStarted : PHONE_PATH_COPY.handoffWaiting;
  return (
    <>
      <div
        className="relative flex h-[216.981201171875px] w-[220.4013671875px] shrink-0 items-center justify-center"
        data-node-id="6156:60706"
        data-qr-url={handoff.url}
        data-handoff-state={started ? "started" : "waiting"}
      >
        <svg
          viewBox={`${-quiet} ${-quiet} ${box} ${box}`}
          width={BOX}
          height={BOX}
          shapeRendering="crispEdges"
          role="img"
          aria-label={PHONE_PATH_COPY.handoffQrLabel}
          className="block"
          data-qr-modules={qr.size}
        >
          <rect x={-quiet} y={-quiet} width={box} height={box} fill="#ffffff" />
          <path d={qr.path} fill="#212326" />
        </svg>
      </div>
      <p
        className="w-full shrink-0 text-center text-[16px] font-light leading-[1.5] text-[#5f6368] [word-break:break-word]"
        role="status"
        aria-live="polite"
        data-handoff-status="true"
      >
        {status}
      </p>
    </>
  );
}
