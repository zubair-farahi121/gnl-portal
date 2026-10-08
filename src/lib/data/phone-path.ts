/**
 * THE PHONE PATH — copy and routes. ADDED 2026-09-30 (docs/PHONE_PATH.md).
 * Only shown when the build is served by server/demo-server.mjs
 * (`npm run serve:phone`) AND the presenter turned phone mode on at
 * /demo/phone/; a static build never renders any of it.
 *
 * None of these strings is in Figma: the design has no second device. They
 * are written to sit quietly beside the designed copy — the laptop's two
 * lines use the same Lato Light 16 #5f6368 centred treatment as the Flow 3
 * C1 state line ("Waiting for scan…"), and end in U+2026 the way it does.
 */
export const PHONE_PATH_COPY = {
  /** Laptop, "Continue on a smartphone", under the real QR: nobody has scanned yet. */
  handoffWaiting: "Waiting for your phone…",
  /** Laptop, same line, once the phone has opened the hand-off link. */
  handoffStarted: "Continue on your phone…",
  /** Laptop, accessible name of the real hand-off QR. */
  handoffQrLabel: "QR code to continue your identity verification on a smartphone",
  /** Phone, /cid/mobile/ — announced for the moment it exists. */
  handoffOpening: "Opening identity verification…",
  /** Phone, CID verified, once the laptop has been told. */
  phoneVerified: "Verification complete. You can return to your computer.",
  /** Phone, the last screen (/cid/mobile/?done=1). */
  phoneDoneTitle: "You can return to your computer",
  phoneDoneBody:
    "Your identity has been verified. Your computer has moved on to the next step. You can close this page.",
} as const;

/**
 * The hand-off QR's target: `/cid/mobile/?room=<room>&service=<serviceId>`.
 * Not a screen — it joins the room, arms the service and replaces itself
 * with that service's CertifiO ID Terms of use (src/app/cid/mobile/page.tsx).
 * With `?done=1&service=…` it is the phone's last screen instead.
 */
export const MOBILE_ROUTE = "/cid/mobile/";

/** The presenter's switch for phone mode (src/app/demo/phone/page.tsx). */
export const PHONE_MODE_ROUTE = "/demo/phone/";
