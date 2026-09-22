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
  const { reset } = useDemoState();

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
        reset();
        router.push(FLOW[0]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router, reset]);

  return null;
}
