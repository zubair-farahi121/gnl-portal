"use client";

import { useRouter } from "next/navigation";

/*
 * MethodRadio — a real <input type="radio"> for the GNL wizard screens.
 * ADDED 2026-09-30 (branch feedback-ui). Tatyana: "radio buttons seem to be
 * regular native html elements". It replaces the 16px radio-selected /
 * radio-unselected <img>s on NL-07 / PP-07 (ChooseMethodScreen) and PP-08
 * (OtherVerificationScreen). The Yoti document radios (CidDocumentScreen) are
 * NOT this component and are unchanged.
 *
 * The caller wraps it in a <label> (the whole option card), so a click
 * anywhere on the card activates the radio.
 *
 * CONTROLLED, ON PURPOSE. `checked` comes from the data and never changes:
 * only GNL IDV is part of the demo. When the user clicks (or arrows onto) an
 * inert option, the browser checks it for a moment and fires `change`; React
 * then restores every radio in the group to its controlled value, so the
 * inert radio does not stay checked and GNL IDV stays selected. The inert
 * card's `data-demo-inert` still raises the "Not part of this demo" toast
 * through DemoToast's delegated click listener.
 *
 * `href` is set only on the option that leads on. A click on it (mouse, or
 * Space on the focused radio, which the browser turns into a click) and Enter
 * both navigate — what the old <Link> card did.
 *
 * 16px, no margin, `accent-color` #004b87: the old selected image's colour.
 */
export function MethodRadio({
  name,
  checked,
  href,
  labelledBy,
  nodeId,
}: {
  name: string;
  checked: boolean;
  href?: string;
  labelledBy?: string;
  nodeId?: string;
}) {
  const router = useRouter();
  const go = href ? () => router.push(href) : undefined;
  return (
    <input
      type="radio"
      name={name}
      checked={checked}
      // Controlled and fixed: see the note above. The no-op keeps React from
      // warning about a `checked` prop without a handler.
      onChange={() => {}}
      onClick={go}
      onKeyDown={
        go
          ? (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                go();
              }
            }
          : undefined
      }
      aria-labelledby={labelledBy}
      aria-disabled={href || checked ? undefined : true}
      className="m-0 block size-[16px] shrink-0 cursor-[inherit] accent-[#004b87]"
      data-node-id={nodeId}
    />
  );
}
