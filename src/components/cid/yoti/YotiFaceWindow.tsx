import { YOTI_MASK } from "@/lib/data/yoti-tokens";

/**
 * THE Y2 CAMERA WINDOW — the head-with-ears cut-out on /cid/liveness-capture/.
 *
 * ====================================================================
 * WHAT THE REAL YOTI SHOWS (design/YOTI_OBSERVED.md, "Y2 — Face capture"):
 *
 *   "A head-shaped window sits slightly above the middle. The shape is a head
 *    WITH EARS — an egg narrowing at the chin, with a small bump each side at
 *    about eye level.
 *      - INSIDE: the camera image is sharp and full colour.
 *      - OUTSIDE: the same image is washed toward white and blurred — the room
 *        is still readable but flattened and pale.
 *      - The edge is a dark outline (~2-3 px) with a thin lighter band just
 *        inside it, following the same shape."
 *
 * The build before this pass had NONE of that. It had one flat `<img>`
 * (public/assets/liveness-face-guide.svg) drawing two nested strokes over an
 * untreated panel, and the inner band was BEIGE (#d6cfcb) because that is what
 * Tatyana's recreation draws. YOTI_BRIEF.md §7 Y2 is explicit: "make it white."
 * YOTI_MASK.bandColor is that white, and it is the only place the colour is
 * written down.
 * ====================================================================
 *
 * ====================================================================
 * WHY THE WASH IS ONE MASKED ELEMENT AND NOT TWO COPIES OF THE PICTURE.
 *
 * The obvious way to get "sharp inside, blurred outside" is two copies of the
 * same image — a blurred one underneath, a sharp one clipped to the window on
 * top. That works for a still. It does NOT work here, because the thing being
 * treated is a LIVE `<video>`: a second copy means either a second
 * `getUserMedia` call (two camera tracks, two camera lights, and
 * `npm run camera` asserts "exactly 1 live track") or plumbing one MediaStream
 * into two elements, which would mean rewriting CameraViewport — the component
 * whose whole job is the eight silent failure paths listed in its header.
 *
 * So the media stays exactly ONE element, untouched and sharp, and everything
 * happens in a single overlay painted on top of it:
 *
 *     background        rgba(255,255,255, YOTI_MASK.washWhite)  — the wash
 *     backdrop-filter   blur(YOTI_MASK.blurPx)                  — the blur
 *     mask-image        opaque everywhere EXCEPT the head        — the window
 *
 * `backdrop-filter` blurs what is already painted behind the element, so it
 * blurs the video without owning it, and the mask punches the window out of
 * both the wash and the blur at once. Whatever renders behind — the live
 * `<video>`, or the flat #e9ebe8 panel that IS the `?mock=1` fallback — gets
 * the same treatment with no branch in this file. That is the "works for both"
 * requirement, satisfied by not knowing which one is there.
 *
 * Both features were verified in THIS container's Chromium
 * (/opt/pw-browsers/chromium-1194) before the component was written, because a
 * silently-dropped `mask-image` fails open: the panel would simply look washed
 * edge to edge and nothing would go red.
 * ====================================================================
 *
 * ====================================================================
 * THE MASK IS THREE LAYERS, AND THE REASON IS THE RESPONSIVE PANEL.
 *
 * `Frame 9` is `w-full` — 345px at the 393 design width, 272 at 320, 716 inside
 * the desktop card — but the window itself is a FIXED 193.271 x 263.058 box
 * (Figma `Group 6`, 6076:31262) centred in it. A single mask image sized
 * `100% 100%` would therefore stretch the head horizontally with the viewport,
 * which is the one thing a face outline must not do.
 *
 * So the mask is composed, and every layer is `add` (the default), i.e. their
 * opaque areas union:
 *
 *   1. the head-hole SVG, sized EXACTLY 193.271px wide and centred — a filled
 *      rectangle minus the head, `fill-rule: evenodd`. Fixed px width, so the
 *      head cannot scale.
 *   2. a flat gradient covering the left flank,  `calc(50% - 95.635px)` wide.
 *   3. the same for the right flank.
 *
 * 95.635 is HALF THE WINDOW WIDTH MINUS ONE PIXEL, not half of it: the flanks
 * deliberately overlap the SVG column by 1px on each side. At an exact seam the
 * two layers' antialiased edges sum to 0.996 rather than 1 and a hairline of
 * un-washed panel shows down the full height. The overlap costs nothing — the
 * head never comes within 13px of the column edge — and removes the line.
 *
 * The SVG's height is the panel's own 522, so layer 1 is `100%` tall and does
 * not stretch vertically either.
 * ====================================================================
 */

/**
 * The window's geometry, PRODUCED rather than hardcoded.
 *
 * `Frame 9` is a 522px column with `justify-center` holding
 * 51 + 65 + 263.058 = 379.058 of content, so the pill lands at 71.471 and the
 * window at 187.471 — the values measured off 6217:65271. The mask needs that
 * second number as a literal offset inside its own SVG, so it is COMPUTED from
 * the same three inputs the flex box uses. Change the pill height or the gap in
 * CidLivenessCaptureScreen and the hole moves with it; write 187.471 here by
 * hand and it silently would not.
 */
const PANEL_H = 522;
const PILL_H = 51;
const STACK_GAP = 65;
/** Figma `Group 6` 6076:31262 — the window box, not the artwork box. */
export const FACE_GROUP_W = 193.27098083496094;
export const FACE_GROUP_H = 263.057861328125;

const WINDOW_TOP =
  (PANEL_H - (PILL_H + STACK_GAP + FACE_GROUP_H)) / 2 + PILL_H + STACK_GAP;

/**
 * The artwork box is BIGGER than the window box, and that is Figma's doing.
 *
 * 6076:31262 measures 193.271 x 263.058, but the strokes overflow it by half a
 * stroke on every side, so the page places the drawing at
 * `inset-[-0.76%_-1.03%]` inside a box of the group's own size — the same
 * arrangement /cid/capture-front/ uses for its own oversized image. Those two
 * percentages are reproduced here as numbers so the MASK's hole lands on the
 * same pixels as the OUTLINE's stroke; if the two disagreed, the window would
 * have a bright or dark rim on one side only.
 */
const ART_INSET_X = FACE_GROUP_W * 0.0103; // 1.99069
const ART_INSET_Y = FACE_GROUP_H * 0.0076; // 1.99924
const ART_W = FACE_GROUP_W + 2 * ART_INSET_X; // 197.25236
const ART_H = FACE_GROUP_H + 2 * ART_INSET_Y; // 267.05634

/**
 * The head-with-ears contour, lifted verbatim from
 * public/assets/liveness-face-guide.svg (Figma `Vector 2` 6076:31263).
 *
 * Only the opening `M` is absolute; every other command is relative. That is
 * what lets the SAME string be re-used at two different origins below — the
 * outline draws it at (0,0) of the artwork box, the mask draws it translated
 * into the panel's coordinates — with no path maths and no chance of the two
 * drifting apart.
 */
const HEAD_BODY =
  "c25 0 43 9 54 26c10 16 14 39 13 64c11-3 21 5 19 25c-2 21-11 30-20 28" +
  "c-9 53-39 116-66 116c-27 0-57-63-66-116c-9 2-18-7-20-28c-2-20 8-28 19-25" +
  "c-1-25 3-48 13-64c11-17 29-26 54-26Z";
/** The contour's own start point inside the 197.252 x 267.056 artwork box. */
const HEAD_X = 98.6;
const HEAD_Y = 3.5;

/** The contour at the artwork box's origin — what the outline strokes. */
const HEAD_PATH = `M${HEAD_X} ${HEAD_Y}${HEAD_BODY}`;

/**
 * The same contour placed in the PANEL's coordinates, for the mask.
 *
 * The artwork box sits at x = -ART_INSET_X inside the 193.271-wide mask column
 * and at y = WINDOW_TOP - ART_INSET_Y inside the 522-tall panel, so the start
 * point moves by exactly that much and the relative body is unchanged.
 */
const HOLE_PATH =
  `M${HEAD_X - ART_INSET_X} ${HEAD_Y + WINDOW_TOP - ART_INSET_Y}${HEAD_BODY}`;

/**
 * Opaque rectangle, head-shaped hole. `fill-rule="evenodd"` is what makes the
 * second subpath a hole rather than a second filled blob.
 *
 * Encoded with `encodeURIComponent` at module scope — i.e. once, at BUILD time,
 * since every Yoti route is prerendered. `#` in a data URI would otherwise
 * start a fragment and silently truncate the image.
 */
const MASK_SVG =
  `<svg xmlns="http://www.w3.org/2000/svg" width="${FACE_GROUP_W}" height="${PANEL_H}"` +
  ` viewBox="0 0 ${FACE_GROUP_W} ${PANEL_H}">` +
  `<path fill="#fff" fill-rule="evenodd" d="M0 0H${FACE_GROUP_W}V${PANEL_H}H0Z ${HOLE_PATH}"/>` +
  `</svg>`;
const MASK_URL = `url('data:image/svg+xml,${encodeURIComponent(MASK_SVG)}')`;

/** Half the window, less the 1px seam overlap. See the header. */
const FLANK = `calc(50% - ${FACE_GROUP_W / 2 - 1}px)`;

const MASK_STYLE = {
  maskImage: `${MASK_URL},linear-gradient(#000,#000),linear-gradient(#000,#000)`,
  maskSize: `${FACE_GROUP_W}px 100%, ${FLANK} 100%, ${FLANK} 100%`,
  maskPosition: "center top, left top, right top",
  maskRepeat: "no-repeat, no-repeat, no-repeat",
  WebkitMaskImage: `${MASK_URL},linear-gradient(#000,#000),linear-gradient(#000,#000)`,
  WebkitMaskSize: `${FACE_GROUP_W}px 100%, ${FLANK} 100%, ${FLANK} 100%`,
  WebkitMaskPosition: "center top, left top, right top",
  WebkitMaskRepeat: "no-repeat, no-repeat, no-repeat",
} as const;

/**
 * The wash: everything OUTSIDE the window, paled and softened.
 *
 * `absolute inset-0`, so it is out of `Frame 9`'s flex flow and cannot move the
 * pill or the window — the measured 522px column and its produced offsets are
 * untouched. It must come AFTER `CameraViewport` in DOM order and BEFORE the
 * outline: everything here has `z-index: auto`, so paint order is DOM order,
 * which is the same rule `npm run camera` asserts for the pill and the guide.
 *
 * `pointer-events-none` because it covers the whole viewport box and there is
 * nothing to click underneath — but a stray hit-test target over a camera
 * preview is the kind of thing that only shows up on stage.
 */
export function YotiFaceWash() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      data-name="yoti-face-wash"
      style={{
        background: `rgba(255,255,255,${YOTI_MASK.washWhite})`,
        backdropFilter: `blur(${YOTI_MASK.blurPx}px)`,
        WebkitBackdropFilter: `blur(${YOTI_MASK.blurPx}px)`,
        ...MASK_STYLE,
      }}
    />
  );
}

/**
 * The window's edge: a dark outline with a thin semi-transparent WHITE band
 * just inside it.
 *
 * REPLACES THE `<img>`. The band cannot be a second stroke on a scaled copy of
 * the path — that is what the placeholder SVG did, and it is why the band was
 * the wrong width at the chin and the wrong width at the crown. Instead the
 * band is ONE thick stroke on the SAME path, clipped to the path's INTERIOR:
 *
 *   - a stroke of width `outlineWidth + 2 x bandWidth` centred on the contour
 *     reaches `outlineWidth/2 + bandWidth` inward;
 *   - clipping it to the interior throws away the outer half;
 *   - the dark outline is then drawn ON TOP, covering the innermost
 *     `outlineWidth/2`.
 *
 * What is left is exactly `bandWidth` of band, hard against the inside of the
 * outline, at every point on the contour. Change either token and the geometry
 * still holds.
 *
 * The box is Figma's `Group 6` (6076:31262) and the `inset-[-0.76%_-1.03%]`
 * wrapper is the design's own overflow; both are kept so the rest of the frame
 * does not move and so `npm run camera` can still find the element by name.
 */
export function YotiFaceOutline() {
  return (
    <div
      className="relative shrink-0"
      style={{ width: FACE_GROUP_W, height: FACE_GROUP_H }}
      data-node-id="6076:31262"
      data-name="Group 6"
    >
      <div className="absolute inset-[-0.76%_-1.03%]">
        <svg
          viewBox={`0 0 ${ART_W} ${ART_H}`}
          width="100%"
          height="100%"
          fill="none"
          aria-hidden="true"
          className="block size-full max-w-none"
        >
          <defs>
            <clipPath id="yoti-face-inside">
              <path d={HEAD_PATH} />
            </clipPath>
          </defs>
          {/* The band, clipped to the inside of the contour. */}
          <path
            d={HEAD_PATH}
            stroke={YOTI_MASK.bandColor}
            strokeWidth={YOTI_MASK.outlineWidth + 2 * YOTI_MASK.bandWidth}
            strokeLinejoin="round"
            clipPath="url(#yoti-face-inside)"
          />
          {/* The dark edge itself. */}
          <path
            d={HEAD_PATH}
            stroke={YOTI_MASK.outline}
            strokeWidth={YOTI_MASK.outlineWidth}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
