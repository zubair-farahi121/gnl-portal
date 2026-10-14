import { WalletOfferPage } from "@/components/service/WalletOfferPage";
import { toServiceId, walletOfferParams } from "@/lib/data/service-config";

/*
 * /services/[serviceId]/wallet/ — FLOW 4's C1 page, "Add your notice of
 * assessment to your wallet" (Figma 6412:85663; "Adding…" 6415:90752 /
 * 6415:91577). ADDED 2026-10-14. Today exactly one page:
 * /services/studentaid/wallet/ (FLOW4_ROUTES.c1).
 *
 * Reached from "Add to wallet" on the Trusted StudentAidNL page — the "Skip
 * retyping your funding details" panel (6412:85602).
 *
 * PRERENDERED for `walletOfferParams()` only — the CID / service-page
 * precedent (src/app/services/[serviceId]/page.tsx): one static file per
 * service, its copy already in the HTML. Driver and Vehicle's C1 page is the
 * STATIC sibling src/app/services/driver-vehicle/wallet/, which wins its exact
 * path and is not in the param list, so Flow 3 is served by exactly the file
 * that served it before. Both render the same WalletOfferPage.
 *
 * `toServiceId` throws on an unknown segment rather than falling back.
 */
export function generateStaticParams() {
  return walletOfferParams();
}

export default async function ServiceWalletOfferPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  const id = toServiceId(serviceId);
  if (id !== "studentaid") throw new Error(`No wallet credential for ${id}`);
  return <WalletOfferPage kind={id} />;
}
