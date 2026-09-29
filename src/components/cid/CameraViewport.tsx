"use client";

import { useEffect, useRef, useState } from "react";

/*
 * CameraViewport — a live camera PREVIEW for the two ID-capture screens
 * (/cid/capture-front/ and /cid/capture-back/), with a silent fallback to the
 * static Figma mock.
 *
 * ADDED 2026-09-22 at the user's request, for the 29 Sept dry run:
 *   "regrading the photo vierication and id, can we make open the camera so it
 *    will more attractive to show."
 *
 * ====================================================================
 * WHAT THIS IS NOT. It is a `<video>` element showing the local camera and
 * NOTHING ELSE. No frame is ever captured, read, drawn to a canvas, encoded,
 * stored or uploaded. There is no backend in this demo and no network call of
 * any kind is made from this file. Nothing leaves the browser. Continue still
 * just advances to the next route, exactly as it did when the viewport was a
 * flat picture. Anyone reading this later: this does not photograph or submit
 * an identity document, and it must not be extended to do so without a real
 * privacy review.
 *
 * VIDEO ONLY, NEVER AUDIO. `audio: false` is passed explicitly on every call,
 * so the microphone is never requested and no mic indicator appears.
 *
 * ONLY THESE THREE SCREENS (two until 2026-09-23). The component is imported
 * by the two capture pages and by /cid/liveness-capture/ — the liveness face
 * scan, Figma 6217:65271 — and by nothing else, and it asks for the camera in
 * an effect, so it asks only when one of those three screens MOUNTS. No other
 * route in the flow triggers a permission prompt.
 *
 * FOUR SINCE 2026-09-29: Flow 3's wallet QR scanner, /wallet/scan/ (W2, Figma
 * 6286:90660), mounts it too — inside its 260px viewfinder, rear camera, with
 * the real build-time QR as its mock. Same component, no change to it; tapping
 * the viewfinder navigates away and the unmount below stops the track
 * (asserted by `npm run camera`, section 5b).
 *
 * The liveness screen asks for the FRONT camera and the two capture screens
 * for the REAR one. That is the `facingMode` prop, not a second copy of this
 * file; see the prop's own note for why it is always `ideal`, never `exact`.
 * ====================================================================
 *
 * THE FALLBACK IS THE POINT — A BLACK BOX IS WORSE THAN THE MOCK.
 *
 * This runs live in front of a client, so every failure mode ends in the same
 * place: the static mock that shipped before this change, with no error text,
 * no empty box and nothing logged to the console. The paths that all converge
 * on "render `children` and stop":
 *
 *   1. mock forced         `?mock=1` in the URL, or the sticky localStorage
 *                          flag it sets (see below) — the camera is never
 *                          requested at all.
 *   2. unsupported         no `navigator.mediaDevices.getUserMedia` (old or
 *                          locked-down browser).
 *   3. insecure context    `getUserMedia` requires a SECURE CONTEXT. `http://`
 *                          on anything but localhost / 127.0.0.1 does not have
 *                          one: Chrome does not even define
 *                          `navigator.mediaDevices` there, so this reads as
 *                          case 2 and falls back silently. ANY DEPLOYMENT OF
 *                          THIS DEMO MUST BE HTTPS OR THE CAMERA WILL NEVER
 *                          START — it will show the mock instead, which is
 *                          safe but is not what the presenter asked for.
 *   4. permission denied   `NotAllowedError` — the user (or a policy) said no,
 *                          or dismissed the prompt.
 *   5. no camera present   `NotFoundError` / `OverconstrainedError` — e.g. a
 *                          desktop with no webcam, and every headless browser,
 *                          which is what the responsive gate exercises.
 *   6. CAMERA BUSY         `NotReadableError` / `TrackStartError` — another
 *                          application already owns the device. THIS IS THE
 *                          EXPECTED CASE ON DEMO DAY, not an edge case: a
 *                          presenter screen-sharing over Teams or Zoom has
 *                          already handed the camera to that application, and
 *                          on many systems the browser then gets nothing.
 *   7. lost mid-demo       the stream's track ends after it started (the OS
 *                          revokes it, the lid closes, Teams grabs it during
 *                          the run, the device is unplugged) — `onended` puts
 *                          the mock back, mid-screen, with no visible error.
 *   8. playback refused    `video.play()` rejects (an autoplay policy the
 *                          `muted` + `playsInline` combination normally
 *                          satisfies) — caught, mock restored.
 *
 * Every `getUserMedia` rejection is caught and DISCARDED rather than logged:
 * scripts/responsive-check.mjs fails the build on any console error or
 * warning, and — more to the point — the presenter's laptop must not print red
 * text into a devtools window that happens to be open on stage.
 *
 * ------------------------------------------------------------------------
 * FORCING THE MOCK WITHOUT TOUCHING CODE
 *
 *   /cid/capture-front/?mock=1      force the static mock, and REMEMBER it
 *   /cid/capture-back/?mock=1       (same — the flag is shared by all three)
 *   /cid/liveness-capture/?mock=1   (same again)
 *   /cid/capture-front/?mock=0      clear it and go back to the live camera
 *
 * The query parameter also writes `localStorage["gnl-demo-camera-mock"]`, so
 * one visit to `?mock=1` pins ALL THREE camera screens to the mock for the rest
 * of the rehearsal — the presenter walks liveness → front → back without the
 * parameter and the choice still holds. `?mock=0` (or clearing site data)
 * releases it. Reading the flag happens in an effect, never during render, so
 * it cannot produce a hydration mismatch.
 * ------------------------------------------------------------------------
 *
 * NO HYDRATION MISMATCH. layout.tsx deliberately carries no
 * `suppressHydrationWarning`, so a server/client divergence surfaces as a
 * console error and the responsive gate fails. This component therefore
 * renders EXACTLY `children` — the server-rendered static mock — on the first
 * client render too: `live` starts `false`, nothing reads `window`,
 * `localStorage` or `navigator` during render, and the `<video>` appears only
 * after a state update that a post-mount effect causes. The static export's
 * HTML for both screens is byte-for-byte what it was before this change.
 *
 * TRACK CLEANUP. The cleanup function stops every track in the stream and
 * clears the element's `srcObject`, and it runs on unmount — i.e. the moment
 * the presenter navigates away with Continue, the browser's back button or the
 * ArrowLeft demo nav. The camera light goes out with the screen. A stream that
 * arrives after the component has already unmounted (the `await` resolving
 * late) is stopped immediately and never attached.
 */

/** Shared by all three camera screens, so `?mock=1` on any one pins them all. */
const FORCE_MOCK_KEY = "gnl-demo-camera-mock";

/**
 * Is the static mock forced? Reads `?mock=` first — which also persists the
 * choice — then the sticky flag. Every access is wrapped: `localStorage`
 * throws outright in some privacy modes, and a demo must not die of that.
 *
 * MUST ONLY BE CALLED FROM AN EFFECT. Calling it during render would read
 * browser state the server does not have.
 */
function isMockForced(): boolean {
  try {
    const param = new URLSearchParams(window.location.search).get("mock");
    if (param !== null) {
      const on = param !== "0" && param !== "false";
      try {
        window.localStorage.setItem(FORCE_MOCK_KEY, on ? "1" : "0");
      } catch {
        /* storage unavailable — the parameter still governs this page view */
      }
      return on;
    }
    return window.localStorage.getItem(FORCE_MOCK_KEY) === "1";
  } catch {
    /* no URL, no storage, no problem: fall through to the live attempt */
    return false;
  }
}

export function CameraViewport({
  children,
  videoClassName = "",
  facingMode = "environment",
}: {
  /**
   * The static mock, authored in the page so its Figma provenance, its
   * `data-node-id` and its measured geometry all stay where they were. This is
   * what the server renders, what the first client render renders, and what
   * every fallback path renders.
   */
  children: React.ReactNode;
  /**
   * Extra classes for the `<video>`. The base classes already make it fill its
   * parent box exactly (`absolute inset-0 size-full object-cover`), which is
   * the same box — to the pixel — that the mock image occupies, so the frame's
   * geometry cannot move whichever branch renders.
   */
  videoClassName?: string;
  /**
   * Which camera to prefer — a PROP, not a second copy of this component.
   *
   * `environment` (the rear camera) is the default and is what the two
   * ID-capture screens want: they photograph a document held in front of the
   * phone. `user` (the front camera) is what the liveness screen
   * /cid/liveness-capture/ wants: it scans the holder's own face, and asking
   * for the rear camera there would point the preview at the ceiling.
   *
   * The design intent is the difference, and it comes straight from the frames:
   * 6217:65268 says "Hold your phone at eye level" and draws a selfie.
   *
   * ALWAYS `ideal`, NEVER `exact`, in both directions. On a laptop there is
   * only ONE camera, and `exact: "environment"` would reject with
   * OverconstrainedError and lose the feed for no reason — which is precisely
   * the machine the dry run happens on. `ideal` picks the best available and
   * falls back to whatever exists.
   */
  facingMode?: "environment" | "user";
}) {
  const [live, setLive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  /* Ask for the camera once, on mount. Nothing here runs on the server. */
  useEffect(() => {
    let cancelled = false;

    const stop = () => {
      const s = streamRef.current;
      streamRef.current = null;
      // Stopping every track is what turns the camera light off. Do it even
      // for tracks that already ended; `stop()` on an ended track is a no-op.
      s?.getTracks().forEach((t) => {
        try {
          t.stop();
        } catch {
          /* ignore */
        }
      });
      const v = videoRef.current;
      if (v) v.srcObject = null;
    };

    const md =
      typeof navigator === "undefined" ? undefined : navigator.mediaDevices;

    // Cases 1-3: mock forced, API absent, or an insecure context (where Chrome
    // leaves `mediaDevices` undefined anyway — both checks are kept because
    // other engines expose the API and reject instead).
    if (isMockForced() || !md?.getUserMedia || !window.isSecureContext) {
      return;
    }

    void (async () => {
      let stream: MediaStream | null = null;
      try {
        /*
         * Prefer the camera the screen is designed around — `environment` for
         * document capture, `user` for the liveness face scan; see the
         * `facingMode` prop. `ideal`, not `exact`: on a laptop there is only
         * one camera and `exact` would reject with OverconstrainedError and
         * lose the feed for no reason.
         * `audio: false` is explicit; the microphone is never requested.
         */
        stream = await md.getUserMedia({
          video: { facingMode: { ideal: facingMode } },
          audio: false,
        });
      } catch {
        // Cases 4-6. One retry with the loosest possible constraint, for the
        // engines that treat any `video` object as a hard constraint set.
        try {
          stream = await md.getUserMedia({ video: true, audio: false });
        } catch {
          stream = null;
        }
      }

      if (!stream) return; // silent: the mock is already on screen

      if (cancelled) {
        // The screen was left while the permission prompt was open. Stop the
        // tracks we were handed and attach nothing.
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      // Case 7: the device is taken away after it started (Teams claiming it
      // mid-demo is the realistic one). Put the mock back, quietly.
      stream.getTracks().forEach((t) => {
        t.addEventListener("ended", () => {
          if (cancelled) return;
          stop();
          setLive(false);
        });
      });

      setLive(true);
    })();

    return () => {
      cancelled = true;
      stop();
    };
    // `facingMode` is a literal at every call site, so this effect still runs
    // exactly once per mount — but it is read inside, so it belongs here.
  }, [facingMode]);

  /*
   * Attach the stream once the `<video>` actually exists — it is only rendered
   * on the `live` branch, so this cannot run in the same pass as the effect
   * above.
   */
  useEffect(() => {
    if (!live) return;
    const v = videoRef.current;
    const s = streamRef.current;
    if (!v || !s) return;
    v.srcObject = s;
    // Case 8: a rejected play() would otherwise surface as an unhandled
    // rejection, which the responsive gate counts as a page error.
    void v.play().catch(() => {
      setLive(false);
    });
  }, [live]);

  if (!live) return <>{children}</>;

  return (
    <video
      ref={videoRef}
      // Preview only — see the header. No capture, no recording, no upload.
      data-gnl-camera="live"
      autoPlay
      muted
      playsInline
      // Decorative: it carries no information the page does not already state
      // in the heading, and there is nothing to announce frame by frame.
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 block size-full max-w-none object-cover ${videoClassName}`}
      onError={() => setLive(false)}
    />
  );
}
