import Link from "next/link";

import {
  YOTI_BAR_SHADOW,
  YOTI_COLOR,
  YOTI_SIZE,
  YOTI_TEXT,
} from "@/lib/data/yoti-tokens";

/**
 * YOTI CHROME — the parts that repeat on every Yoti screen.
 *
 * YOTI_BRIEF.md §13: "All Yoti buttons are 'Continue ›' in the pinned bar with
 * the shadow. The help icon is on Y1, Y3 and Y5."
 *
 * ====================================================================
 * WHY THESE THINGS LIVE TOGETHER
 *
 * The audit (DEMO_AUDIT.md, "Yoti zone audit") found the SAME defects on every
 * Yoti screen rather than a different defect on each:
 *
 *   1. the Continue button was 37px tall, radius 4, #27619b, with NO chevron,
 *      sitting in the normal page flow instead of a pinned bar;
 *   2. there was no help icon anywhere in the build;
 *   3. the type ran one step small throughout.
 *
 * All of it came from following Tatyana's recreation, which §6 says is "close
 * but smaller and lighter" than the real Yoti. Fixing it once here fixes all
 * eight screens and — just as important — makes it impossible for the next
 * screen to be built with a differently sized button.
 * ====================================================================
 *
 * EVERY COLOUR AND SIZE IS IMPORTED. Nothing here is a literal, so after
 * Zubair's real verification (§12) the whole zone changes by editing
 * yoti-tokens.ts alone. A hardcoded `#286cab` here would survive that edit and
 * be the one wrong blue on stage.
 */

/**
 * The circled "?" — Y1, Y3 and Y5.
 *
 * §6: "A circled '?' about 18 px, grey #546072, at the top right of the Yoti
 * content, aligned with the right edge, about 20 px above the heading… It
 * shows the 'Not part of this demo' toast."
 *
 * `data-demo-inert="true"` is the ENTIRE wiring. DemoToast attaches one
 * delegated listener to `document` and fires on any click inside that
 * attribute, so this needs no handler, no `onClick` and no client-component
 * boundary — which is what keeps the Yoti screens statically prerendered.
 *
 * Drawn as SVG rather than a text "?" in a bordered box: at 18px a glyph is
 * centred by the font's own metrics and sits visibly high in the circle.
 */
export function YotiHelpIcon({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      aria-label="Help"
      data-demo-inert="true"
      className={`block shrink-0 cursor-pointer border-0 bg-transparent p-0 ${className}`}
      style={{ width: YOTI_SIZE.helpIcon, height: YOTI_SIZE.helpIcon }}
    >
      <svg viewBox="0 0 18 18" width="100%" height="100%" aria-hidden="true">
        <circle cx="9" cy="9" r="8" fill="none" stroke={YOTI_COLOR.muted} strokeWidth="1.2" />
        <path
          d="M6.7 6.6a2.3 2.3 0 1 1 2.9 2.2c-.4.13-.6.42-.6.82v.6"
          fill="none"
          stroke={YOTI_COLOR.muted}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="9" cy="13.1" r="0.85" fill={YOTI_COLOR.muted} />
      </svg>
    </button>
  );
}

/**
 * The white chevron on the Continue button.
 *
 * §6: "a white chevron › (about 6×12 px) about 18 px from the right edge".
 * It is NOT part of the label — the label stays centred in the full button
 * width and the chevron is absolutely positioned, exactly as the real
 * screenshots show. Putting it in the flex flow beside the text would shift
 * the label off-centre.
 */
function YotiChevron() {
  return (
    <svg
      viewBox="0 0 6 12"
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 -translate-y-1/2"
      style={{
        width: YOTI_SIZE.chevronWidth,
        height: YOTI_SIZE.chevronHeight,
        right: YOTI_SIZE.chevronInset,
      }}
    >
      <path
        d="M0.75 0.75 L5.25 6 L0.75 11.25"
        fill="none"
        stroke={YOTI_COLOR.white}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The pinned action bar.
 *
 * ====================================================================
 * `position: sticky; bottom: 0` — AND WHY NOT `fixed`.
 *
 * §6: "In a white bar pinned to the bottom of the screen, with a soft shadow
 * above it… The Yoti content scrolls under it. Use `position: sticky;
 * bottom: 0` inside the Yoti container, so the bar stops above the MyGovNL
 * footer at the end of the page."
 *
 * That last clause is the whole reason. `fixed` pins to the VIEWPORT, so the
 * bar would float over the MyGovNL footer — our chrome — and break §13's
 * "Nothing outside the Yoti zone has changed". `sticky` pins it to the scroll
 * container while Yoti content is on screen, then lets it come to rest at the
 * end of the zone. That is what the real embed does: the bar belongs to Yoti's
 * box, not to the page.
 *
 * On a desktop viewport, where the card fits without scrolling, sticky simply
 * renders in place — so this one rule is correct at 390 and at 1440 with no
 * breakpoint, which is the same self-cancelling trick the GNL sticky footer
 * uses in globals.css.
 * ====================================================================
 */
export function YotiActionBar({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="sticky bottom-0 z-10 w-full"
      style={{
        background: YOTI_COLOR.white,
        boxShadow: YOTI_BAR_SHADOW,
        paddingTop: YOTI_SIZE.barPadding,
        paddingBottom: YOTI_SIZE.barPadding,
        paddingLeft: YOTI_SIZE.gutter,
        paddingRight: YOTI_SIZE.gutter,
      }}
    >
      {children}
    </div>
  );
}

/**
 * "Continue ›".
 *
 * Renders an <a> when `href` is given and a <button> otherwise, because two of
 * the screens advance IN PLACE rather than navigating: Y3 reveals the document
 * list on the same screen (§7 Y3), and Y6/Y7 move from the empty camera frame
 * to the captured image before going on (§7 Y6).
 *
 * §7 Y6: "Don't put a spinner in the button." There is no pending state here at
 * all — the audit marked the spinner MINE.
 */
export function YotiContinue({
  href,
  onClick,
  children = "Continue",
}: {
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const style = {
    height: YOTI_SIZE.buttonHeight,
    borderRadius: YOTI_SIZE.buttonRadius,
    background: YOTI_COLOR.button,
    color: YOTI_COLOR.white,
    fontSize: YOTI_TEXT.button,
    fontWeight: 700,
  } as const;

  const className =
    "relative flex w-full cursor-pointer items-center justify-center border-0 text-center";

  /*
   * `next/link`, NOT A BARE `<a>` — corrected 2026-09-27, when this component
   * actually replaced `BtnPrimary` on the seven Yoti screens.
   *
   * The rendered HTML is the same `<a href="…">`, so nothing about the pixel
   * gate or the accessible name changes. What changes is that the navigation is
   * CLIENT-SIDE again. A bare `<a>` is a full document load, and three things
   * in this build depend on it not being one:
   *
   *   1. `npm run camera` records every MediaStreamTrack on `window`, so it can
   *      prove that leaving a capture screen STOPS the camera. A full reload
   *      wipes that record, and the assertion "the front screen's track is
   *      ended" silently became "there is only one track and it is live" — the
   *      gate reporting a pass-shaped failure about the one thing it exists to
   *      check. That is how this was caught.
   *   2. the `gnl-demo:v1` store and the DemoNav key handler are re-mounted on
   *      every full load, which is work the presenter pays for on stage seven
   *      times in a row.
   *   3. the back/forward buttons stop restoring a warm page, which is what
   *      broke this gate's `goBack()` step outright.
   *
   * `BtnPrimary` has always used `next/link` for exactly these reasons; this
   * component simply had not been wired to a real route yet when it was
   * written.
   */
  if (href) {
    return (
      <Link href={href} className={className} style={style}>
        {children}
        <YotiChevron />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} style={style}>
      {children}
      <YotiChevron />
    </button>
  );
}

/**
 * The round badge on Y5 and Y8.
 *
 * §6: "Circle #eef6f8, about 110 px, with an outline icon in #333b40".
 * YOTI_OBSERVED.md records that it is LEFT-ALIGNED on both screens, not
 * centred — worth stating, because a 110px circle alone on a white screen
 * reads as though it ought to be centred, and centring it is the obvious
 * "tidy-up" a later reader would make.
 */
export function YotiBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: YOTI_SIZE.badge,
        height: YOTI_SIZE.badge,
        background: YOTI_COLOR.badge,
      }}
    >
      {children}
    </div>
  );
}
