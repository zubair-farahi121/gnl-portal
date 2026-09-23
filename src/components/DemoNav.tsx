"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FLOW } from "@/lib/flow";
import { useDemoState } from "@/lib/demo-state";

/**
 * Presenter aid. Renders nothing, so it cannot affect the pixel gate.
 *   ArrowRight / ArrowLeft — step through the flow
 *   Escape                 — reset to a clean unverified state
 */
export function DemoNav() {
  const router = useRouter();
  const pathname = usePathname();
  /*
   * Escape is "Reset demo" (§7.5): it is now one of only two things that clear
   * `gnl-demo:v1`, the other being the `/reset` route. The header's Log Out
   * deliberately does NOT — see §7.1 and BtnSignOut.
   */
  const { resetAll } = useDemoState();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = FLOW.findIndex((r) => r.split("?")[0] === pathname);
      if (e.key === "ArrowRight" && i >= 0 && i < FLOW.length - 1) {
        router.push(FLOW[i + 1]);
      }
      if (e.key === "ArrowLeft" && i > 0) {
        router.push(FLOW[i - 1]);
      }
      if (e.key === "Escape") {
        resetAll();
        router.push(FLOW[0]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router, resetAll]);

  return null;
}
