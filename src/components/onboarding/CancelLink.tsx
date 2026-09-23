"use client";

import Link from "next/link";
import { useDemoState } from "@/lib/demo-state";
import type { ServiceId } from "@/lib/data/service-config";

/**
 * The wizard's `Cancel` link — BUILD_BRIEF.md §7.4.
 *
 * *"Cancel -> service page, onboarding resets to not started unless already
 * onboarded."*
 *
 * ====================================================================
 * IT RENDERS THE SAME `<Link>`, WITH THE SAME CLASSES.
 *
 * Three of the four screens that carry a Cancel are frozen baseline frames
 * (`onboard`, `prereq-confirm`) or share a component with one. So this does not
 * introduce any markup: it takes `className` and `data-node-id` from the caller
 * and passes them through unchanged. An `onClick` handler is not serialized
 * into the DOM, so the rendered HTML is byte-identical to the bare `<Link>` it
 * replaces — which `npm run diff` checks rather than takes on trust.
 *
 * The reset is the whole reason it exists as a component: `cancelOnboarding`
 * needs the store, the store needs a client boundary, and putting that boundary
 * on the LINK keeps four otherwise-static server pages static.
 * ====================================================================
 *
 * The "unless already onboarded" guard lives in `cancelOnboarding` itself, so
 * every caller gets it and none of them has to remember: cancelling out of the
 * wizard on a service that has already been onboarded must not un-onboard it.
 */
export function CancelLink({
  service,
  href,
  className,
  nodeId,
  children,
}: {
  service: ServiceId;
  /** The service page — the same target on every screen that has a Cancel. */
  href: string;
  className: string;
  nodeId?: string;
  children: React.ReactNode;
}) {
  const { cancelOnboarding } = useDemoState();
  return (
    <Link
      href={href}
      className={className}
      data-node-id={nodeId}
      onClick={() => cancelOnboarding(service)}
    >
      {children}
    </Link>
  );
}
