"use client";

import { useEffect, useRef, useState } from "react";

import { WALLET_COPY } from "@/lib/data/flow3";
import { WALLET_COLOR, WALLET_TIMING, WALLET_TYPE } from "@/lib/data/wallet-tokens";

/*
 * The WALLET's "Not part of this demo" — ADDED 2026-09-29 with Flow 3.
 *
 * WHY NOT THE GNL DemoToast. That one is Lato on GNL navy #243746 with GNL
 * radius 6, styled by `.gnl-toast` in globals.css. Inside the wallet it would
 * be the one GNL object on a Portage screen — the leak the wallet's isolation
 * exists to prevent. So the wallet answers its own inert controls, in its own
 * tokens, and marks them `data-wallet-inert` so the GNL listener (which only
 * looks for `data-demo-inert`) never fires here.
 *
 * SAME WIRING AS DemoToast, deliberately: one delegated `click` listener on
 * `document`, bubble phase, `closest('[data-wallet-inert="true"]')` — so W3's
 * and W5's "Cancel" (was "Decline"), W1's "Present", the menu buttons and the collapsed
 * dashboard cards need no handler and the static screens need no client
 * boundary of their own. Native <button>s dispatch `click` for Enter/Space,
 * so all of them work from the keyboard.
 *
 * ONE AT A TIME. Every inert control says the same thing; a second click
 * restarts the timer instead of stacking a second copy.
 *
 * Mounted by src/app/wallet/layout.tsx INSIDE THE PHONE FRAME (absolute, not
 * fixed — brief §6: the toast belongs to the phone, not the browser window),
 * so it only exists on wallet routes and inherits the zone's Inter.
 */
export function WalletToast() {
  const [message, setMessage] = useState<string | null>(null);
  /* Bumped on every show so a repeat click re-announces and restarts. */
  const [nonce, setNonce] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t || typeof t.closest !== "function") return;
      if (!t.closest('[data-wallet-inert="true"]')) return;
      setMessage(WALLET_COPY.inert);
      setNonce((n) => n + 1);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!message) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(null), WALLET_TIMING.toastMs);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [message, nonce]);

  return (
    /*
     * Always in the DOM (an aria-live region must exist before text is put in
     * it), fixed and out of flow so it adds nothing to any wallet screen's
     * height. `pointer-events: none` on the region so it never blocks a tap
     * on the buttons it floats above.
     */
    <div
      role="status"
      aria-live="polite"
      data-wallet-toast="true"
      className="pointer-events-none absolute inset-x-0 bottom-[48px] z-50 flex justify-center px-[16px]"
    >
      {message ? (
        <button
          key={nonce}
          type="button"
          onClick={() => setMessage(null)}
          className="gnl-wallet-toast pointer-events-auto max-w-[361px] cursor-pointer px-[20px] py-[12px] text-center"
          style={{
            background: WALLET_COLOR.toast,
            color: WALLET_COLOR.toastText,
            borderRadius: "999px",
            ...WALLET_TYPE.toast,
            boxShadow: "0 8px 24px rgba(8,16,16,0.18)",
          }}
        >
          {message}
        </button>
      ) : null}
    </div>
  );
}
