import QRCode from "qrcode";

import { FLOW3_ROUTES } from "@/lib/data/service-config";

/**
 * A REAL, SCANNABLE QR CODE, rendered as one inline SVG `<path>`.
 * ADDED 2026-09-29 for Flow 3 (F3-02 6220:86445 and the W-02 scanner mock
 * 6286:90660). REWORKED the same day to FLOW3_BRIEF.md §3.
 *
 * ====================================================================
 * WHY IT NOW RUNS IN THE BROWSER. The first build computed the QR at build
 * time, because it encoded a fixed address. The brief's QR encodes an OFFER
 * ID that the mock issuer creates when the C1 page opens — i.e. in the
 * browser, after the static HTML exists. So the `qrcode` package now ships to
 * the client (only on the two Flow 3 pages that import this) and the matrix
 * is computed from the offer id after mount.
 *
 * WHY `create()` AND NOT `toString({ type: "svg" })`: `create()` hands back
 * the module matrix, which the caller draws as a React `<path>` — no
 * `dangerouslySetInnerHTML`, and the colours stay in the caller's hands.
 * ====================================================================
 */

/**
 * WHAT THE QR ENCODES — `${PUBLIC_BASE_URL}/wallet/start/?offer=<id>`.
 *
 * STATIC-EXPORT-SAFE, ON PURPOSE. The brief suggests `/wallet/offer/:offerId`.
 * This demo is `output: "export"` with no server: a dynamic segment can only
 * be prerendered for ids known at BUILD time, and offer ids are minted in the
 * browser. It would also collide with W-04, which already lives at
 * `/wallet/offer/`. So the id travels in the QUERY STRING of one fixed,
 * prerendered entry route, `/wallet/start/`, which reads it client-side,
 * points the wallet at that offer, marks it `scanned` and continues to W-03
 * (src/app/wallet/start/page.tsx). Documented in DEMO_AUDIT.md "Flow 3".
 *
 * A REAL ISSUER would not encode a web link. It would encode an OpenID for
 * Verifiable Credential Issuance (OpenID4VCI) offer —
 * `openid-credential-offer://?credential_offer_uri=https://…` — which the
 * phone's OS hands to whichever wallet app is installed. For the demo an
 * https link is used instead, so a real phone's camera can open the WEB
 * wallet mock (brief §3; "Real phone" mode is P2 and not built).
 *
 * `PUBLIC_BASE_URL` is read at BUILD time (next.config.ts `env`); unset, it
 * is `http://localhost:4173`, the port every gate in this repo serves on.
 *
 * THE PHONE PATH (2026-09-30, docs/PHONE_PATH.md). When the build is served
 * by server/demo-server.mjs and phone mode is on, the C1 page passes `sync`:
 * the QR then encodes `<base>/wallet/start/?offer=<id>&room=<room>`, where
 * `base` is the server's public address (DEMO_PUBLIC_URL, or the laptop's LAN
 * IP), so a real phone can open it and its progress reaches the laptop.
 * Without `sync` the URL is exactly what it always was.
 */
export function walletOfferUrl(
  offerId: string | null,
  sync?: { base: string; room: string } | null,
): string {
  const base = (sync?.base || process.env.PUBLIC_BASE_URL || "http://localhost:4173").replace(/\/+$/, "");
  const path = FLOW3_ROUTES.start;
  if (!offerId) return `${base}${path}`;
  const query = `?offer=${encodeURIComponent(offerId)}`;
  return sync ? `${base}${path}${query}&room=${encodeURIComponent(sync.room)}` : `${base}${path}${query}`;
}

export type QrMatrix = {
  /** Modules per side, EXCLUDING the quiet zone. */
  size: number;
  /** One SVG path, a 1x1 square per dark module, in module units. */
  path: string;
};

/**
 * The QR as a single path in a `size x size` coordinate space.
 *
 * Error correction `M` (~15%): the code is shown on a laptop screen and read
 * at arm's length, where `H` would only make the modules smaller for no gain.
 */
export function qrMatrix(text: string): QrMatrix {
  const qr = QRCode.create(text, { errorCorrectionLevel: "M" });
  const { size, data } = qr.modules;
  let path = "";
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[y * size + x]) path += `M${x} ${y}h1v1h-1z`;
    }
  }
  return { size, path };
}
