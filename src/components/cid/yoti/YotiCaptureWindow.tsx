"use client";

import { useEffect, useState } from "react";
import { CameraViewport } from "@/components/cid/CameraViewport";
import { YOTI_CAPTURE } from "@/lib/data/yoti-tokens";

/*
 * YotiCaptureWindow — the camera window on /cid/capture-front/ and
 * /cid/capture-back/ (both flows). ADDED 2026-11-16 for the GNWT frames.
 *
 * GNWT Figma draws each capture step twice: an EMPTY camera frame (29:72004
 * front, 29:72219 back — grey panel, four corner brackets, no document) and
 * the CAPTURED frame (26:54303 / 26:54328 — the specimen, no brackets). Both
 * live on the SAME route here, as two phases of the existing animation, so no
 * route, link, flow step or sub-step count changes:
 *
 *   0 .. emptyMs   empty viewfinder: brackets on the grey panel. The specimen
 *                  is in the DOM but held at its invisible first keyframe by
 *                  the inline `animation-delay` the screens set on it.
 *   emptyMs ..     the specimen slides in (`gnl-yoti-specimen`) and the
 *                  brackets fade out.
 *
 * LIVE CAMERA: the brackets STAY over the live feed — a live preview is the
 * empty viewfinder, and nothing is ever captured from it.
 *
 * REDUCED MOTION: globals.css switches the specimen animation off, so the
 * document is visible at once; the brackets are dropped at once too, rather
 * than sitting on top of it for `emptyMs`.
 *
 * The brackets are plain bordered boxes (not an <img>), aria-hidden and
 * pointer-events-none, so the camera checks that look for the mock <img>
 * inside the box, and the box geometry, are unaffected.
 */
export function YotiCaptureWindow({ children }: { children: React.ReactNode }) {
  const [live, setLive] = useState(false);
  const [captured, setCaptured] = useState(false);

  useEffect(() => {
    let reduce = false;
    try {
      reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduce = false;
    }
    const t = window.setTimeout(() => setCaptured(true), reduce ? 0 : YOTI_CAPTURE.emptyMs);
    return () => window.clearTimeout(t);
  }, []);

  const showBrackets = live || !captured;

  return (
    <>
      <CameraViewport onLiveChange={setLive}>{children}</CameraViewport>
      <Brackets visible={showBrackets} />
    </>
  );
}

const CORNERS = [
  { key: "tl", pos: { top: 0, left: YOTI_CAPTURE.bracketInsetX }, sides: ["Top", "Left"] },
  { key: "tr", pos: { top: 0, right: YOTI_CAPTURE.bracketInsetX }, sides: ["Top", "Right"] },
  { key: "bl", pos: { bottom: 0, left: YOTI_CAPTURE.bracketInsetX }, sides: ["Bottom", "Left"] },
  { key: "br", pos: { bottom: 0, right: YOTI_CAPTURE.bracketInsetX }, sides: ["Bottom", "Right"] },
] as const;

function Brackets({ visible }: { visible: boolean }) {
  return (
    <div
      aria-hidden="true"
      data-name="capture-brackets"
      data-state={visible ? "empty" : "captured"}
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{
        opacity: visible ? 1 : 0,
        transition: `opacity ${YOTI_CAPTURE.fadeMs}ms ease-out`,
      }}
    >
      {CORNERS.map(({ key, pos, sides }) => {
        const style: React.CSSProperties = {
          ...pos,
          position: "absolute",
          width: YOTI_CAPTURE.bracketArm,
          height: YOTI_CAPTURE.bracketArm,
          borderStyle: "solid",
          borderColor: YOTI_CAPTURE.bracketColor,
          borderWidth: 0,
          [`border${sides[0]}${sides[1]}Radius`]: YOTI_CAPTURE.bracketRadius,
        };
        for (const side of sides) {
          (style as Record<string, string>)[`border${side}Width`] = YOTI_CAPTURE.bracketStroke;
        }
        return <span key={key} className="block" style={style} />;
      })}
    </div>
  );
}
