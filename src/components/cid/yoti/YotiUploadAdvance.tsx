"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Y8's ONLY moving part: the hop to step 5 when the upload "finishes".
 *
 * ====================================================================
 * WHY THE PROGRESS BAR IS NOT IN THIS FILE.
 *
 * The bar fills in pure CSS — `.gnl-yoti-upload-fill` in globals.css, a
 * `width: 0 -> 100%` keyframe — and this component does nothing but count the
 * same interval and navigate. Two reasons, and the second is the important one:
 *
 *   1. The bar then renders identically in the static HTML, before any script
 *      runs, so the screen is never blank on a slow first paint on stage.
 *   2. PREFERS-REDUCED-MOTION IS A MEDIA QUERY, and a media query belongs in a
 *      stylesheet. YOTI_BRIEF asks Y8 to "jump straight to the full state" for
 *      those viewers; globals.css does that with `animation: none` over a base
 *      `width: 100%`. Driving the width from JavaScript would mean reading
 *      `matchMedia` after mount, i.e. a frame of the wrong state, and a second
 *      place for the preference to be honoured or forgotten.
 *
 * The NAVIGATION is deliberately NOT suppressed under reduced motion. The
 * preference is about animation, not about stranding the presenter on a screen
 * whose only control is the one the real Yoti does not draw.
 * ====================================================================
 *
 * A CLIENT COMPONENT, AND THE ONLY ONE ON THIS SCREEN. Everything else on Y8 is
 * static markup, so the route still prerenders to a real HTML file — which is
 * what keeps `/cid/upload/` individually addressable when the presenter types
 * it, the property DEMO_AUDIT.md §7 item 3.2 insists on.
 *
 * NOTHING IS UPLOADED. There is no backend in this demo and no network call is
 * made from this file or from anything it renders. The bar is a picture of an
 * upload; the timer is a picture of it finishing. Anyone extending this to do a
 * real upload needs a real privacy review first — see the same warning in
 * src/components/cid/CameraViewport.tsx.
 */
export function YotiUploadAdvance({
  href,
  ms,
}: {
  /** Step 5 for THIS service — `cidRoutes(service.id).verified`. */
  href: string;
  /** YOTI_SIZE.progressMs, so the hop lands as the bar reaches the end. */
  ms: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push(href), ms);
    // Cleared on unmount, so a presenter who leaves early with ArrowLeft or the
    // browser's back button is not yanked forward a moment later.
    return () => clearTimeout(t);
  }, [router, href, ms]);

  return null;
}
