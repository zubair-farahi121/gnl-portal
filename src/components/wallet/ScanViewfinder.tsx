"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useOfferStatus } from "@/components/wallet/WalletClient";
import { useDemoState } from "@/lib/demo-state";
import { WALLET_COPY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { WALLET_COLOR, WALLET_TIMING } from "@/lib/data/wallet-tokens";
import { isWaiting, peekCurrentOffer } from "@/lib/mock-issuer";
import { qrMatrix, walletOfferUrl } from "@/lib/qr";

/*
 * W-02's viewfinder — a SIMULATED scanner (FLOW3_BRIEF.md §7 W-02).
 * REWORKED 2026-09-29: this REPLACES the first build's live camera
 * (`CameraViewport` + getUserMedia). The wallet no longer asks for the
 * camera at all; the Yoti / CID screens still do, unchanged.
 *
 * Figma 6286:90672 "Camera Viewfinder": 260 x 260, radius 24, 4 px DASHED
 * rgba(8,16,16,0.4); a 240 x 2 #86CEBA scan line (6286:90673) that moves up
 * and down. The frame's fill is a stock photo of a QR on a laptop screen —
 * not exportable from a read-only file, and the brief wants THE SAME QR AS
 * ON THE DESKTOP anyway. So inside the viewfinder:
 *
 *   a dark "camera" view of a laptop screen showing the CURRENT offer's QR,
 *   slightly tilted, with a soft screen glow, and a little blur that clears
 *   (`gnl-wallet-focus`, ~1 s).
 *
 * DETECTION. After ~1.2 s (WALLET_TIMING.scanDetectMs), or at once on a tap /
 * Enter / Space, it "detects" the code: a short snap-pulse
 * (`gnl-wallet-snap`), the offer becomes `scanned` (the desktop changes to
 * "Adding to your wallet…" a beat later) and W-03 opens.
 *
 * AUTO-DETECT ONLY WHILE THE OFFER IS WAITING (`created` / `declined`). Back
 * from W-03, or the presenter's ArrowLeft, lands here with the offer already
 * `scanned`: the screen then stays put instead of bouncing forward — the same
 * Back-safety this project applies to every auto-advancing screen. A tap still
 * works. With no offer at all (the wallet opened without the C1 page), it
 * does not auto-detect either; a tap goes to W-03.
 *
 * prefers-reduced-motion: no sweep, no blur, no pulse (layout CSS); the
 * detection timer still runs — it is the story, not decoration.
 */
export function ScanViewfinder() {
  const router = useRouter();
  const { ready, walletOffer } = useDemoState();
  const { set } = useOfferStatus();
  const [snap, setSnap] = useState(false);
  const fired = useRef(false);

  const detect = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    setSnap(true);
    const cur = peekCurrentOffer();
    if (cur && isWaiting(cur.status)) set("scanned");
    setTimeout(() => router.push(FLOW3_ROUTES.connect), WALLET_TIMING.scanSnapMs);
  }, [router, set]);

  useEffect(() => {
    if (!ready) return;
    const cur = peekCurrentOffer();
    if (!cur || !isWaiting(cur.status)) return;
    const t = setTimeout(detect, WALLET_TIMING.scanDetectMs);
    return () => clearTimeout(t);
    // Once, when the store becomes readable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const offerId = walletOffer?.id ?? null;
  const qr = useMemo(() => qrMatrix(walletOfferUrl(offerId)), [offerId]);
  const quiet = 3;
  const box = qr.size + quiet * 2;

  return (
    <button
      type="button"
      aria-label={WALLET_COPY.scan.viewfinderLabel}
      data-wallet-scan="true"
      data-wallet-offer={offerId ?? ""}
      onClick={detect}
      className={`relative box-border flex size-[260px] max-w-full shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-[24px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1e404d] ${
        snap ? "gnl-wallet-snap" : ""
      }`}
      style={{ border: `4px dashed ${WALLET_COLOR.viewfinder}`, background: "#0d1417" }}
      data-node-id="6286:90672"
    >
      {/* The simulated camera image: a laptop screen, tilted, glowing, blur clearing. */}
      <span className="gnl-wallet-focus absolute inset-0 flex items-center justify-center" aria-hidden="true">
        <span
          className="flex items-center justify-center rounded-[6px] p-[10px]"
          style={{
            background: "#f4f8fb",
            transform: "perspective(420px) rotateX(9deg) rotateY(-7deg) rotateZ(-4deg)",
            boxShadow: "0 0 36px 6px rgba(170,205,255,0.45), 0 0 90px 20px rgba(120,170,255,0.18)",
          }}
        >
          <svg
            viewBox={`${-quiet} ${-quiet} ${box} ${box}`}
            width="150"
            height="150"
            shapeRendering="crispEdges"
            className="block"
            data-qr-modules={qr.size}
          >
            <rect x={-quiet} y={-quiet} width={box} height={box} fill="#f4f8fb" />
            <path d={qr.path} fill="#0d1417" />
          </svg>
        </span>
      </span>
      <span
        aria-hidden="true"
        className="gnl-wallet-scanline pointer-events-none relative block h-[2px] w-[240px] max-w-[92%]"
        style={{ background: WALLET_COLOR.mintBorder, boxShadow: "0 0 8px rgba(134,206,186,0.9)" }}
        data-node-id="6286:90673"
      />
    </button>
  );
}
