import type { Metadata } from "next";

import { WalletStage } from "@/components/service/WalletStage";

/*
 * /demo/wallet-stage/ — THE PRESENTER STAGE (FLOW3_BRIEF.md §3, P1).
 * ADDED 2026-09-29.
 *
 * The C1 page (left, scaled to fit) and the wallet phone (right) side by
 * side, for one screen or a projector. Two SAME-ORIGIN iframes, so they share
 * localStorage and the `storage` event: the wallet's writes reach the C1
 * frame exactly as they reach a second window (the sync is not re-implemented
 * here — it is the same `gnl-demo:v1` store).
 *
 * HIDDEN: nothing in the portal links here. It is opened only from the
 * presenter controls — Shift+W (DemoNav) — or by typing the URL. `noindex`.
 */
export const metadata: Metadata = {
  title: "Presenter stage — Flow 3",
  robots: { index: false, follow: false },
};

export default function WalletStagePage() {
  return <WalletStage />;
}
