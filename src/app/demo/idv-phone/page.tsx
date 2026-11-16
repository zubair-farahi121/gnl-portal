import type { Metadata } from "next";

import { IdvPhoneHome } from "@/components/stage/IdvPhoneHome";

/*
 * /demo/idv-phone/ — the IDV presenter stage's phone home screen. ADDED
 * 2026-10-23. Loaded inside /demo/idv-stage/'s phone frame; see
 * src/components/stage/IdvPhoneHome.tsx. Hidden and `noindex`.
 */
export const metadata: Metadata = {
  title: "CertifiO ID",
  robots: { index: false, follow: false },
};

export default function IdvPhonePage() {
  return <IdvPhoneHome />;
}
