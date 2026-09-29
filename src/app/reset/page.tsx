"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDemoState } from "@/lib/demo-state";
import { APP_ROUTES } from "@/lib/data/service-config";

/*
 * /reset — BUILD_BRIEF.md §6, §7.5.
 *
 * *"`/reset` and the presenter controls clear it."* And §7.1, which this route
 * is the other half of: the header's **Log Out keeps onboarding progress**;
 * only "Reset demo" clears everything. Q-17 in DEMO_AUDIT.md recorded the build
 * doing the opposite; it was settled in the brief's favour on 2026-09-23 and
 * `TopNav`'s Log Out no longer resets.
 *
 * So this is now the ONLY route that empties `gnl-demo:v1`. (The presenter's
 * Escape key in `DemoNav` does the same thing without a navigation.)
 *
 * FLOW 3 (2026-09-29): that includes the wallet status. `resetAll` removes the
 * whole key, so a C1 wallet page open in another window receives the `storage`
 * event and drops back to "Waiting for scan…" with no code here — asserted by
 * `npm run clicks` (W-RESET).
 *
 * IT RENDERS A BLANK PAGE ON PURPOSE. It exists for a fraction of a second
 * between a keystroke and the login screen; a heading and a card would flash
 * up and be gone. Nothing here is a design decision — there is no Figma frame
 * for a reset route, and none is invented.
 *
 * `replace`, not `push`: the presenter pressing Back after a reset should land
 * wherever they were before, not bounce through the reset again.
 *
 * The clear happens in an effect, after mount — the same rule everything else
 * that touches localStorage follows, because layout.tsx has no
 * `suppressHydrationWarning`. See src/lib/demo-state.tsx.
 */
export default function ResetPage() {
  const router = useRouter();
  const { resetAll } = useDemoState();

  useEffect(() => {
    resetAll();
    router.replace(APP_ROUTES.login);
    // Run once. `resetAll` is stable for the life of the provider, but listing
    // it would re-run this on any provider re-render mid-navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="gnl-desktop-shell">
      {/* Announced, because visually there is nothing to see. */}
      <main className="w-full" role="status" aria-live="polite">
        <p className="sr-only">Demo reset. Returning to the login page.</p>
      </main>
    </div>
  );
}
