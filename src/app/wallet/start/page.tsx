"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { WalletScreen } from "@/components/wallet/WalletClient";
import { WalletStatusBar } from "@/components/wallet/WalletUi";
import { useDemoState } from "@/lib/demo-state";
import { SAME_DEVICE_KEY } from "@/lib/data/flow3";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { createOffer, isWaiting, peekCurrentOffer, selectOffer, updateOffer } from "@/lib/mock-issuer";

/*
 * /wallet/start/?offer=<id>[&from=mygovnl] — THE QR CODE'S TARGET, and the
 * same-device deep link. ADDED 2026-09-29 (FLOW3_BRIEF.md §3).
 *
 * NOT A SCREEN (brief §8: no screens beyond W-01..W-09). It is the static-
 * export-safe stand-in for the brief's `/wallet/offer/:offerId`: one
 * prerendered route that reads the id from the QUERY STRING in the browser
 * (see walletOfferUrl in src/lib/qr.ts for why), then:
 *
 *   1. points the wallet at that offer (`selectOffer`); if the id is missing
 *      or unknown in this browser, it uses the current offer, or — with none
 *      at all — asks the mock issuer for a new one, so the path never dead-ends;
 *   2. marks it `scanned` ("the wallet opened the offer … or a deep link");
 *   3. remembers `from=mygovnl` for this tab (the same-device "◀ MyGovNL"
 *      link in the status bar, brief §8);
 *   4. REPLACES itself with W-03, so Back from W-03 never lands here again.
 *
 * It renders the phone's empty status bar for the fraction of a second it
 * exists, so the phone never flashes white-without-chrome.
 */
export default function WalletStartPage() {
  const router = useRouter();
  const { ready } = useDemoState();
  const done = useRef(false);

  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("offer");
    try {
      if (params.get("from") === "mygovnl") sessionStorage.setItem(SAME_DEVICE_KEY, "1");
    } catch {
      /* ignore */
    }
    void (async () => {
      if (!(id && selectOffer(id)) && !peekCurrentOffer()) await createOffer();
      const cur = peekCurrentOffer();
      if (cur && isWaiting(cur.status)) void updateOffer(cur.id, { status: "scanned" });
      router.replace(FLOW3_ROUTES.connect);
    })();
  }, [ready, router]);

  return (
    <WalletScreen screen="start" nodeId="">
      <WalletStatusBar />
      <p className="sr-only" role="status" aria-live="polite">
        Opening the certificate offer…
      </p>
    </WalletScreen>
  );
}
