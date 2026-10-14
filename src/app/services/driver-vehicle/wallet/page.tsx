import { WalletOfferPage } from "@/components/service/WalletOfferPage";

/*
 * C1 — "Add your vehicle registration certificate to your wallet".
 * F3-02 desktop: Figma 6220:86445 / 6289:45276 / 6289:46104 (1440 x 1024, the
 * same layout in three states). F3-03 phone: 6220:86488 (393 x 1471).
 * ADDED 2026-09-29; REWORKED the same day to FLOW3_BRIEF.md §5.
 *
 * Reached from "Add to wallet" on the Trusted Driver and Vehicle page (the
 * "Skip the paper copy" upsell, F3-01 6285:87154 / 6257:73252).
 *
 * 2026-10-14 (Flow 4): the page body moved to
 * src/components/service/WalletOfferPage.tsx, shared with StudentAidNL's
 * notice-of-assessment page (src/app/services/[serviceId]/wallet/). This
 * route renders it for the vehicle certificate, with the strings and node ids
 * this file used to hold — read the layout notes there.
 */
export default function AddToWalletPage() {
  return <WalletOfferPage kind="driver-vehicle" />;
}
