"use client";

import Link from "next/link";

import { useDemoState } from "@/lib/demo-state";
import { UPSELL_ADDED_LABEL } from "@/lib/data/flow3";

/*
 * FLOW3_BRIEF.md §10 item 7 (P1) — the "Skip the paper copy" upsell after the
 * certificate is in the wallet: "Add to wallet" becomes a DISABLED "Added to
 * wallet ✓". A PROPOSAL, Tatyana to confirm — so it is only ever rendered
 * when UPSELL_ADDED_STATE_ENABLED (src/lib/data/flow3.ts) is true. It is
 * FALSE, and LinkedItemCard then renders its original <Link> directly, so the
 * Trusted page's markup does not change at all (`service-verified` 0.000 %).
 *
 * Reads the WALLET's record (`cardIssuedAt`) after mount, like every store
 * reader: the prerendered page always shows "Add to wallet".
 */
export function UpsellAddedAction({
  href,
  label,
  className,
  nodeId,
}: {
  href: string;
  label: string;
  className: string;
  nodeId: string;
}) {
  const { walletCardIssuedAt } = useDemoState();
  if (walletCardIssuedAt) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className={`${className} cursor-not-allowed opacity-60`}
        data-node-id={nodeId}
        data-upsell-added="true"
      >
        {UPSELL_ADDED_LABEL}
      </button>
    );
  }
  return (
    <Link href={href} className={`${className} cursor-pointer select-none`} data-node-id={nodeId}>
      {label}
    </Link>
  );
}
