"use client";

import { useEffect } from "react";
import { useDemoState, type OnboardingStep } from "@/lib/demo-state";
import type { ServiceId } from "@/lib/data/service-config";

/**
 * Records "this service is part-way through onboarding, at this step" in the
 * `gnl-demo:v1` store — BUILD_BRIEF.md §12.2's `in_progress (with step)`.
 *
 * ====================================================================
 * IT RENDERS NOTHING, AND THAT IS THE POINT.
 *
 * The three new wizard screens are otherwise plain server components. Putting
 * the write in a `null`-rendering client child keeps them that way: no page
 * becomes a client component, no markup changes, and — because there is no DOM
 * node — no frame can move. `npm run diff` cannot see this.
 *
 * WRITES IN AN EFFECT, NEVER DURING RENDER. `src/app/layout.tsx` carries no
 * `suppressHydrationWarning`; anything that touches localStorage before the
 * server HTML has been matched is a hydration bug. See the long note in
 * src/lib/demo-state.tsx.
 * ====================================================================
 *
 * IT ONLY EVER MOVES FORWARD. Re-opening Summary after the journey is finished
 * must not drag an `onboarded` service back to `in_progress` — on stage the
 * presenter walks backwards through the wizard all the time. So the status is
 * promoted only from `not_started`, and the step is recorded regardless.
 */
export function TrackStep({
  service,
  step,
}: {
  service: ServiceId;
  step: OnboardingStep;
}) {
  const { ready, service: getService, patchService } = useDemoState();

  useEffect(() => {
    if (!ready) return;
    const current = getService(service);
    if (current.status === "not_started") {
      patchService(service, { status: "in_progress", step });
      return;
    }
    if (current.step !== step) patchService(service, { step });
    // `getService` closes over the store, so re-running on every store change
    // would loop; the dependency list is deliberately the identity of the
    // screen, not of the data.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, service, step]);

  return null;
}

/**
 * NL-23 / PP-22, BUILD_BRIEF.md §8.3: *"On open, mark the service
 * **onboarded**."* That transition is what flips the service page's badge from
 * "Confirmation required" to "Trusted" (§12.2), and it survives a refresh
 * because it is written to `gnl-demo:v1`, not to a `?verified=1` query param.
 *
 * Same shape and same reasons as `TrackStep`: renders nothing, so
 * `/services/:id/confirmation/` stays a server component with unmoved markup
 * and the `confirmation` baseline frame cannot drift; writes in an effect, so
 * it cannot produce a hydration mismatch.
 *
 * `markOnboarded` is idempotent — re-opening the screen writes nothing.
 */
export function MarkOnboarded({ service }: { service: ServiceId }) {
  const { ready, markOnboarded } = useDemoState();

  useEffect(() => {
    if (!ready) return;
    markOnboarded(service);
    // `markOnboarded` closes over the store and changes identity on every
    // write; listing it would re-run this against its own effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, service]);

  return null;
}
