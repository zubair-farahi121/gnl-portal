import type { Metadata } from "next";

import { IdvStage } from "@/components/stage/IdvStage";

/*
 * /demo/idv-stage/ — THE IDV PRESENTER STAGE. ADDED 2026-10-23.
 *
 * The portal (left) and a phone running CertifiO ID (right), side by side,
 * for one screen or a projector — the identity-verification twin of
 * /demo/wallet-stage/. See src/components/stage/IdvStage.tsx and
 * src/lib/stage-sync.ts.
 *
 * HIDDEN: nothing in the portal links here. It is opened with Shift+W from an
 * onboarding or CertifiO ID page (DemoNav), or by typing the URL. `noindex`.
 */
export const metadata: Metadata = {
  title: "Presenter view — Identity verification",
  robots: { index: false, follow: false },
};

export default function IdvStagePage() {
  return <IdvStage />;
}
