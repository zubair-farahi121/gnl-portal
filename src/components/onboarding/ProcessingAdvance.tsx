"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDemoState } from "@/lib/demo-state";
import {
  showDemoToast,
  TOAST_VERIFICATION_COMPLETE,
} from "@/components/ui/DemoToast";
import { serviceRoutes } from "@/lib/data/service-config";

/* ====================================================================
 * NL-21 AUTO-ADVANCE — BUILD_BRIEF.md §8.3.
 *
 * *"When `verified`, stay at least `processingMinMs` (3 s), then -> NL-22 with
 * the toast 'Identity verification complete'."*
 *
 * ====================================================================
 * READ THE HISTORY BEFORE CHANGING ANY OF THIS.
 *
 * THIS IS A REVERSAL, AND IT IS DELIBERATE. A 2.6 s auto-advance used to live
 * on `/auth/loading/`. It was **removed** on 2026-09-22, and
 * design/token-exceptions.md §10.10 records exactly why:
 *
 *   step 7 (`/services/driver-vehicle/prerequisite/`, Figma 6217:81644) points
 *   its **Back** at `/auth/loading/`. With a timer running unconditionally,
 *   Back was a 2.6-second round trip straight back to step 7 — a control that
 *   looks right and does nothing.
 *
 * That is the exact failure class `npm run clicks` exists to catch, and the
 * one the user has caught by hand twice. Re-introducing the advance naively
 * would re-introduce the bug.
 *
 * ====================================================================
 * HOW IT IS KEPT OFF THE BACK PATH: A ONE-SHOT, ARMED ON THE WAY FORWARD.
 *
 * `/cid/verified/`'s Continue (and Flow B's `/cid/studentaid/verified/`) — the
 * ONLY forward entries to this screen — call `markVerified(serviceId)`, which
 * sets `pendingAdvance: serviceId` in the `gnl-demo:v1` store. This component
 * calls `takePendingAdvance()` on mount, which **reads and clears** it in one
 * step and says which service armed it, and starts the timer only if one did.
 *
 * So:
 *   forward   /cid/verified/ -> arm -> /auth/loading/ -> consume -> 3 s -> NL-22
 *   backward  NL-22 -> Back -> /auth/loading/ -> nothing armed -> STAYS PUT
 *
 * The flag is consumed at MOUNT, not when the timer fires, so even leaving the
 * screen early (the presenter's ArrowRight, which the click-through gate
 * asserts on this screen) disarms it. There is no second firing to come back to.
 *
 * DIRECT VISITS DO NOTHING EITHER. Opening `/auth/loading/` from the URL bar —
 * which is what `npm run shots`, `npm run responsive` and the presenter's
 * deep-link all do — finds nothing armed and leaves the screen alone. The frame
 * is a frozen baseline; a navigation mid-screenshot would be a flaky gate.
 * ====================================================================
 *
 * IT RENDERS NOTHING. `/auth/loading/` stays a server component with its
 * measured markup untouched, so `auth-loading` cannot move in `npm run diff`.
 * The screen's own copy already says "Your identity verification is now being
 * processed", which is the status; the page marks that block `role="status"
 * aria-live="polite"` (§7.8) and the completion is announced by the toast's own
 * live region.
 *
 * `processingMinMs` is §12.3's value, 3000. The brief calls it a MINIMUM: the
 * IDV result is already `verified` by the time this screen opens in the
 * same-device flow, so the wait is a floor, not a poll interval. Presenter
 * controls that would make it adjustable are P1 and were cut.
 * ==================================================================== */

/* ====================================================================
 * ONE SHARED SCREEN, TWO FLOWS — THE DESTINATION FOLLOWS THE ARMING SERVICE.
 * 2026-09-28, with Flow B's desktop wizard.
 *
 * /auth/loading/ is shared: PP-20 is an instance of NL-21, and both flows'
 * step-5 Continue lands here. Until today this component took a fixed
 * `service="driver-vehicle"` and a fixed `to` from the page, so:
 *
 *   Flow B  /cid/studentaid/verified/ arms `studentaid`
 *           -> /auth/loading/ asks "armed for driver-vehicle?" -> no
 *           -> the screen never advanced. The presenter's ArrowRight would
 *              then have jumped to FLOW A's prerequisite screen.
 *
 * Now it asks the store WHO armed it (`takePendingAdvance()` returns the
 * service) and routes to THAT service's Confirmed screen:
 *
 *   driver-vehicle  -> /services/driver-vehicle/prerequisite/   NL-22, unchanged
 *   studentaid      -> /services/studentaid/prerequisite/       PP-21
 *
 * The URL cannot carry the service — it is one prerendered page for both —
 * and a query param was rejected for the whole CID seam (it shows on stage and
 * forces a client render; see the seam note in service-config.ts). The store
 * already knew: `markVerified(service.id)` wrote it one screen earlier. The
 * destination is still decided by `serviceRoutes`, the one table of routes.
 *
 * Everything else below is unchanged: one-shot, consumed on mount, off the
 * Back path, renders nothing.
 * ==================================================================== */

/** §12.3 `processingMinMs`. */
export const PROCESSING_MIN_MS = 3000;

export function ProcessingAdvance() {
  const router = useRouter();
  const { ready, takePendingAdvance } = useDemoState();
  /* Effects can run twice in development Strict Mode; the flag is consumed
   * once by the store, and this guards the timer itself. */
  const armed = useRef(false);

  useEffect(() => {
    if (!ready || armed.current) return;
    const service = takePendingAdvance();
    if (!service) return;
    armed.current = true;
    /* NL-22 / PP-21 for the service that armed the advance. */
    const to = serviceRoutes(service).prerequisite;

    const t = setTimeout(() => {
      /*
       * The toast is raised BEFORE the push, on purpose. The toast region
       * lives in the root layout, which does not remount on a client-side
       * navigation, so the message is already on screen as NL-22 paints —
       * which is what §8.3 asks for ("-> NL-22 with the toast"). Raising it
       * after the push would need the destination page to know about it.
       */
      showDemoToast(TOAST_VERIFICATION_COMPLETE);
      router.push(to);
    }, PROCESSING_MIN_MS);

    return () => clearTimeout(t);
    // `takePendingAdvance` closes over the store and changes identity on every
    // write; re-running on that would re-arm. The screen is the dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, router]);

  return null;
}
