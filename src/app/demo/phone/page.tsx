import type { Metadata } from "next";

import { PhoneModePanel } from "@/components/service/PhoneModePanel";

/*
 * /demo/phone/ — THE PRESENTER'S SWITCH FOR THE PHONE PATH. ADDED 2026-09-30
 * (docs/PHONE_PATH.md).
 *
 * Phone mode is OPT-IN per laptop browser, so that serving the build with
 * server/demo-server.mjs changes nothing — not a pixel, not a request — until
 * the presenter asks for it here. Same presenter-only treatment as
 * /demo/wallet-stage/: nothing in the portal links here, `noindex`.
 */
export const metadata: Metadata = {
  title: "Presenter — phone mode",
  robots: { index: false, follow: false },
};

export default function PhoneModePage() {
  return <PhoneModePanel />;
}
