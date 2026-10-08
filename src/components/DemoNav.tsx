"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FLOW, FLOW_3, FLOW_B } from "@/lib/flow";
import { FLOW3_ROUTES } from "@/lib/data/service-config";
import { useDemoState } from "@/lib/demo-state";

/** Wallet paths whose own close ✕ answers Escape (see below). */
const WALLET_ESC_CLOSES: ReadonlySet<string> = new Set([
  FLOW3_ROUTES.scan,
  FLOW3_ROUTES.connect,
  FLOW3_ROUTES.offer,
  FLOW3_ROUTES.review,
  FLOW3_ROUTES.connecting,
  FLOW3_ROUTES.code,
  FLOW3_ROUTES.added,
]);

/**
 * True when the key event comes from a form field or editable text. Every
 * <input> counts, not only text boxes: on a radio the arrow keys belong to
 * the browser (they move through the group), so they are not the
 * presenter's there either.
 */
function isTypingTarget(t: EventTarget | null): t is HTMLElement {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
}

/**
 * Presenter aid. Renders nothing, so it cannot affect the pixel gate.
 *   ArrowRight / ArrowLeft — step through the flow
 *   Escape                 — reset to a clean unverified state (on wallet
 *                            screens with a close ✕: that ✕ — Flow 3)
 *   Shift+W                — the Flow 3 presenter stage (/demo/wallet-stage/)
 *
 * NONE of these fire while focus is in a text field (input, textarea, select
 * or contenteditable) — ADDED 2026-09-30 with the login page's real inputs.
 * An arrow key there moves the caret, and Escape only leaves the field
 * (blur); it does not reset the demo.
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
      /*
       * TYPING GUARD (2026-09-30). The presenter keys must not fire from a
       * text field: ArrowLeft in the login's Email Address box would
       * otherwise leave the page. Escape there just blurs the field.
       */
      if (isTypingTarget(e.target)) {
        if (e.key === "Escape") e.target.blur();
        return;
      }
      /*
       * WHICH FLOW — added 2026-09-28. FLOW_B only for a path that is in
       * FLOW_B and NOT in FLOW; every Flow A URL and every shared URL resolves
       * to FLOW exactly as before. See the FLOW_B note in src/lib/flow.ts.
       */
      const at = (list: readonly string[]) =>
        list.findIndex((r) => r.split("?")[0] === pathname);
      /*
       * FLOW_3 — added 2026-09-29, by the same rule: only for a path in
       * FLOW_3 and in NEITHER of the older lists, so no Flow A or Flow B URL
       * changes behaviour (the shared Trusted page resolves to FLOW, as it
       * always did). See the FLOW_3 note in src/lib/flow.ts.
       */
      const list: readonly string[] =
        at(FLOW) < 0 && at(FLOW_B) >= 0
          ? FLOW_B
          : at(FLOW) < 0 && at(FLOW_3) >= 0
            ? FLOW_3
            : FLOW;
      const i = at(list);
      if (e.key === "ArrowRight" && i >= 0 && i < list.length - 1) {
        router.push(list[i + 1]);
      }
      if (e.key === "ArrowLeft" && i > 0) {
        router.push(list[i - 1]);
      }
      /*
       * Shift+W — the Flow 3 PRESENTER STAGE (FLOW3_BRIEF.md §3, P1), added
       * 2026-09-29. The stage is hidden: this key is the only way in besides
       * typing the URL. Ignored while typing in a field, so it can never
       * steal a capital W from a form.
       */
      if (e.key === "W" && e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Typing is already ruled out by the guard at the top.
        router.push(FLOW3_ROUTES.stage);
        return;
      }
      /*
       * Wallet screens with a close ✕ (W-02..W-08) own Escape — FLOW3_BRIEF.md
       * §12 "Esc = close" (added 2026-09-29). Their header handles it: the
       * offer goes back to `created` and the wallet to W-01. On every other
       * page, including W-01 and W-09, Escape is still the presenter's reset.
       */
      if (e.key === "Escape" && WALLET_ESC_CLOSES.has(pathname)) return;
      if (e.key === "Escape") {
        resetAll();
        /*
         * IN THE WALLET WINDOW, stay in the wallet — added 2026-09-29. The
         * reset itself is the same everywhere (the whole `gnl-demo:v1` key,
         * including Flow 3's wallet status, so the C1 page in the OTHER
         * window drops back to "Waiting for scan…" via the `storage` event).
         * Only the destination differs: the wallet window is "the phone", and
         * sending it to the GNL login page would put the portal inside it.
         * Every non-wallet URL still goes to FLOW[0], exactly as before.
         */
        router.push(
          pathname.startsWith(FLOW3_ROUTES.walletHome)
            ? FLOW3_ROUTES.walletHome
            : FLOW[0],
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router, resetAll]);

  return null;
}
