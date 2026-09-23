"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * DemoToast — "Not part of this demo".
 *
 * ====================================================================
 * WHY IT EXISTS
 *
 * BUILD_BRIEF.md §10.5: non-demo links show a short toast, "Not part of this
 * demo". §7.6: "Nothing may do nothing; out of scope -> toast." §15 makes it a
 * Definition-of-Done line: "Every button, link and card navigates or shows the
 * toast."
 *
 * Before this, roughly thirty controls across the portal were silently inert —
 * eight dashboard cards, the Account / Notifications / Contact Us nav labels,
 * "Forgot password?", "Create account", every Actions link and linked-item
 * button on the Trusted service page including "Add to wallet", the Yoti
 * "Privacy Policy" and the "Terms of Use" links on the CID screens. On stage a
 * click on any of them looked like the demo had frozen.
 * ====================================================================
 *
 * ====================================================================
 * HOW IT IS WIRED — ONE DELEGATED LISTENER, NOT THIRTY HANDLERS
 *
 * This component attaches a single listener to `document` and fires on any
 * click inside `[data-demo-inert="true"]`. That attribute is a convention this
 * repo already had on every inert control, so wiring the toast required NO
 * markup change on any of them.
 *
 * That is not a shortcut, it is the constraint. Most of those controls live on
 * screens BUILD_BRIEF.md §1.4 marks KEEP and forbids refactoring or restyling,
 * and §15 requires "KEEP screens unchanged — compare screenshots before and
 * after". Thirty `onClick` props would have meant thirty edits to KEEP markup
 * and a client-component boundary on pages that are static today. A delegated
 * listener adds exactly one DOM node to the whole app — this overlay — and it
 * paints nothing until something is clicked, so `npm run diff` stays at 0.000%
 * on all 19 frames.
 *
 * The side benefit: a control marked inert in the future is wired the moment
 * it is written, with nothing to remember.
 *
 * KEYBOARD. Delegation is on `click`, which native <button> elements also
 * dispatch for Enter and Space — so the linked-item buttons and the wallet
 * upsell on the Trusted page are keyboard-operable for free. The inert
 * controls that are <div>/<p>/<span> (nav labels, dashboard cards, the two
 * login links) are not focusable, and making them focusable means turning
 * them into real buttons — a markup change on KEEP screens, which belongs in
 * its own pass with the pixel gate green. Recorded in DEMO_AUDIT.md X-06.
 * ====================================================================
 *
 * ====================================================================
 * IT IS AN OVERLAY. IT MUST NOT MOVE A SINGLE FRAME.
 *
 * `position: fixed` takes the region out of flow, so it contributes nothing to
 * `document.documentElement.scrollHeight` and cannot change any frame's
 * rendered height — which is the whole reason it is rendered at the root
 * rather than inside a page.
 *
 * The region is ALWAYS in the DOM, even with nothing to show. An `aria-live`
 * region has to exist before content is inserted into it or assistive
 * technology will not announce the insertion; mounting the region only when a
 * toast fires would announce nothing. With no toasts it renders an empty box
 * with no background, no border and no padding, so it paints nothing.
 * ====================================================================
 */

const MESSAGE = "Not part of this demo";

/*
 * ====================================================================
 * THE PROGRAMMATIC CHANNEL — added for BUILD_BRIEF.md §8.3 / §10.6.
 *
 * §8.3 wants "Identity verification complete" shown when /auth/loading/
 * auto-advances to the Confirmed screen. That is a toast with a DIFFERENT
 * message, raised by code rather than by a click on `[data-demo-inert]`, and
 * raised on the screen the user is LEAVING so it is still on screen when the
 * next one paints.
 *
 * A DOM CustomEvent, not a context method, for two reasons:
 *   1. The toast region lives at the root and outlives every page, so a caller
 *      does not need to be inside a provider or a client boundary that owns
 *      state — `src/app/services/.../prerequisite/page.tsx` stays a server
 *      component.
 *   2. It survives the `router.push` that follows it: the root layout does not
 *      remount on a client-side navigation, so the toast raised just before the
 *      push is still counting down when the destination renders.
 *
 * Nothing about the appearance changes, so the overlay still paints nothing
 * until something fires and `npm run diff` is still unaffected.
 * ====================================================================
 */
const TOAST_EVENT = "gnl-demo:toast";

/** Raise a toast from anywhere. No-op during SSR. */
export function showDemoToast(message: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<string>(TOAST_EVENT, { detail: message }),
  );
}

/** §8.3 / §10.6 — the one programmatic message the demo raises today. */
export const TOAST_VERIFICATION_COMPLETE = "Identity verification complete";

/** How long a toast stays up. Long enough to read on stage, short enough not
 *  to sit over the next click. */
const DISMISS_MS = 3200;

/** At most three at once. A fourth drops the oldest rather than growing a
 *  column that could cover the control the presenter is about to click. */
const MAX_VISIBLE = 3;

type Toast = { id: number; message: string };

export function DemoToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const show = useCallback(
    (message: string) => {
      setToasts((prev) => {
        /*
         * CLICKED TWICE. Every inert control carries the same message, so a
         * second click would otherwise stack two identical toasts, which reads
         * as a bug rather than as feedback. Instead the existing one is
         * REPLACED: it is removed and re-added with a fresh id, so the timer
         * restarts, the live region sees a real insertion and announces again,
         * and the count on screen stays at one.
         *
         * Two DIFFERENT messages do stack — the mechanism is general, even
         * though today every call site sends the same string.
         */
        const id = nextId.current++;
        const existing = prev.find((t) => t.message === message);
        if (existing) {
          const old = timers.current.get(existing.id);
          if (old) {
            clearTimeout(old);
            timers.current.delete(existing.id);
          }
        }
        const kept = prev.filter((t) => t.message !== message);
        const next = [...kept, { id, message }];

        // Drop the oldest beyond the cap, cancelling its timer as it goes.
        while (next.length > MAX_VISIBLE) {
          const dropped = next.shift();
          if (!dropped) break;
          const t = timers.current.get(dropped.id);
          if (t) {
            clearTimeout(t);
            timers.current.delete(dropped.id);
          }
        }

        timers.current.set(
          id,
          setTimeout(() => dismiss(id), DISMISS_MS),
        );
        return next;
      });
    },
    [dismiss],
  );

  useEffect(() => {
    /*
     * The delegated listener. `closest` walks up from the click target, so it
     * catches a click on the label or the icon inside an inert card, not just
     * on the card's own box.
     *
     * Bubble phase, not capture: a control that is inert today but gains a
     * real destination later can `stopPropagation` and this never fires. It
     * also means a live <Link> nested inside an inert wrapper keeps working.
     */
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target || typeof target.closest !== "function") return;
      if (!target.closest('[data-demo-inert="true"]')) return;
      show(MESSAGE);
    };
    document.addEventListener("click", onClick);

    /* The programmatic channel — see showDemoToast above. */
    const onToast = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      if (typeof message === "string" && message) show(message);
    };
    window.addEventListener(TOAST_EVENT, onToast);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener(TOAST_EVENT, onToast);
    };
  }, [show]);

  // Cancel every outstanding timer if the tree unmounts mid-demo.
  useEffect(() => {
    const pending = timers.current;
    return () => {
      for (const t of pending.values()) clearTimeout(t);
      pending.clear();
    };
  }, []);

  return (
    <div
      className="gnl-toast-region"
      /*
       * `polite`, per BUILD_BRIEF.md §7.8 — it waits for the screen reader to
       * finish whatever it is saying instead of interrupting the page the
       * presenter just navigated to.
       *
       * `role="status"` alongside it: Safari + VoiceOver announce a `status`
       * region reliably where a bare `aria-live` container is sometimes
       * missed, and the two together are the standard belt-and-braces pairing.
       */
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((t) => (
        /*
         * Clicking the toast dismisses it — §10.5 wants a SHORT toast, and on
         * stage the presenter may want it gone before the 3.2 s is up. It is
         * a <button> so this works from the keyboard too, and it is the only
         * focusable thing this component adds.
         */
        <button
          key={t.id}
          type="button"
          className="gnl-toast"
          onClick={() => dismiss(t.id)}
        >
          {t.message}
        </button>
      ))}
    </div>
  );
}
