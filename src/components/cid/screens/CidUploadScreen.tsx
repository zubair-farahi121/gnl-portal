import { CidScreen } from "@/components/cid/CidScreen";
import { YotiBadge } from "@/components/cid/yoti/YotiChrome";
import { YotiUploadAdvance } from "@/components/cid/yoti/YotiUploadAdvance";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";
import {
  YOTI_COLOR,
  YOTI_SIZE,
  YOTI_TEXT,
  yotiUploadCopy,
} from "@/lib/data/yoti-tokens";

/*
 * Y8 — UPLOAD. /cid/upload/ and /cid/studentaid/upload/.
 *
 * ====================================================================
 * THE ONE CID SCREEN WITH NO FIGMA FRAME BEHIND IT.
 *
 * Every other screen in this directory reproduces a node in
 * Dc1bPoXX1VoB9v1MtLvu8e and carries its measurements in a block like this one.
 * This screen has none: Tatyana's recreation goes straight from the last
 * capture to step 5, and the step in between only turned up when a REAL
 * verification was photographed. So the whole of its provenance is
 * design/YOTI_OBSERVED.md, "Y8 — Upload (6127:50651)", which is the highest
 * authority available and says, in full:
 *
 *   - "Round badge, LEFT-ALIGNED: the same pale circle (~110 px) holding a thin
 *      dark upload icon — an open tray with an arrow pointing up out of it."
 *   - "After a clear gap, a large bold dark block of text, 5 lines, well above
 *      body size and tightly leaded."
 *   - "After another clear gap, a thin progress bar the full content width:
 *      rounded ends, only a few px tall, dark fill … on a light grey track."
 *   - "No button, no help icon, no pinned bar. The rest is empty white."
 *
 * THAT LAST LINE IS A SPECIFICATION, NOT A FOOTNOTE. It is the reason this file
 * imports neither YotiActionBar nor YotiHelpIcon, both of which every screen
 * either side of it uses. If a later pass "finishes" this screen by giving it a
 * Continue button, it has stopped matching the only evidence there is.
 *
 * WHAT IS DELIBERATELY NOT REPRODUCED. The real frame names a real person's
 * health card. YOTI_BRIEF.md §10 and YOTI_OBSERVED.md's own PRIVACY note forbid
 * copying it, so the document named here is the FLOW's own — "Driver's License"
 * in Flow A, "Passport" in Flow B — read from `defaultDocument` in the service
 * config. Never a literal, and never the real one.
 * ====================================================================
 *
 * WHERE IT SITS, AND WHY THAT DIFFERS BY FLOW.
 *
 *   Flow A  /cid/capture-back/  -> HERE -> /cid/verified/
 *   Flow B  /cid/capture-front/ -> HERE -> /cid/studentaid/verified/
 *
 * The fork is `captureSides` in §12.1 — the same field that already decided
 * whether /cid/capture-front/ links onward to a back capture — so no screen
 * tests a service id and a third service would work with no edit here. This
 * screen itself is symmetric: it always goes to step 5 of whichever service
 * rendered it.
 *
 * THE SUB-STEP PILL STAYS "ID document selection • step 4 of 5". It is GNL
 * chrome, OUTSIDE the Yoti zone, and it reads exactly what the four screens
 * around it read. The counter therefore still runs
 * 1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 4 → 5 with no number skipped and no
 * number renumbered — Y8 simply makes "step 4" one screen longer. See the note
 * on `cidUpload` in src/lib/data/cid.ts for why its `nodeId` is not a Figma id.
 *
 * ------------------------------------------------------------------------
 * DESKTOP LAYOUT — INVENTED; NOT IN FIGMA, like every other CID screen's. At
 * and above 768 CidScreen drops this content into the onboard page's wizard
 * chrome. Only two `md:` rules are needed:
 *   the column  `md:py-0`      — the 24px pads are the mobile frame's spacing
 *                                to the wizard header; the card's own 32px gap
 *                                does that job and the two would stack to 56.
 *   the text    `md:max-w-[560px]` — the copy is set at 27px and would run to
 *                                the full 716px interior of an 820px card,
 *                                which is a 12-word line. Capped and left
 *                                aligned, where `items-start` already puts it,
 *                                so nothing moves at 393.
 * The badge, the type and the bar are UNCHANGED at every width.
 * ------------------------------------------------------------------------
 */

/**
 * The upload glyph — "an open tray with an arrow pointing up out of it",
 * drawn thin and dark.
 *
 * INLINE SVG, NOT AN ENTRY IN `ASSETS`. Every placeholder under public/assets/
 * exists to be swapped for a real Figma export at a known node id; this icon
 * has no node to export from, because the screen it belongs to is not in the
 * file. A file in that folder would look like something that is waiting for an
 * export when nothing is coming. `YotiHelpIcon` in YotiChrome.tsx is drawn
 * inline for the same reason.
 *
 * 48 units inside the 110px badge, i.e. the glyph occupies a little under half
 * the circle, which is how the real badge reads. The stroke is
 * `YOTI_COLOR.ink`, never a literal.
 */
function YotiUploadIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      aria-hidden="true"
      className="block"
    >
      <g
        stroke={YOTI_COLOR.ink}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* The arrow, pointing up and out of the tray. */}
        <path d="M24 30V10" />
        <path d="M16 18l8-8 8 8" />
        {/* The tray: open at the top, so the arrow leaves through it. */}
        <path d="M10 28v7a3 3 0 0 0 3 3h22a3 3 0 0 0 3-3v-7" />
      </g>
    </svg>
  );
}

export function CidUploadScreen({ service }: { service: ServiceConfig }) {
  const { upload: copy } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <CidScreen service={service} mainNodeId="derived:y8-upload-main" subStep={copy.subStep} yotiZone>
      {/*
       * The whole screen. `gap-[32px]` is YOTI_OBSERVED's "a clear gap" twice
       * over — there is no measurement to quote, and a smaller value makes the
       * badge and the copy read as one block, which the photograph does not.
       *
       * `px-[8px]` is the inner padding every other Yoti screen's top-level
       * column carries (Frame 13 on Y1, Frame 10 on Y2, Screen 7 on Y5). With
       * the mobile <main>'s own 16px that puts the content 24px from the screen
       * edge — inside the 20-24px side gutter YOTI_OBSERVED measures for the
       * zone, and identical to the screens either side, which matters more than
       * hitting YOTI_SIZE.gutter exactly on the one screen with no frame.
       */}
      <div
        className="flex w-full shrink-0 flex-col items-start gap-[32px] px-[8px] py-[24px] md:py-0"
        data-name="yoti-upload"
      >
        {/*
         * LEFT-ALIGNED, NOT CENTRED. `items-start` on the column does it, and
         * YotiBadge's own note says why it is worth stating out loud: a 110px
         * circle alone on a white screen reads as though it ought to be
         * centred, and centring it is the obvious tidy-up a later reader makes.
         * The photograph shows it hard against the left gutter.
         */}
        <YotiBadge>
          <YotiUploadIcon />
        </YotiBadge>

        {/*
         * THE COPY IS ONE CONSTANT, AND IT IS NOT IN THIS FILE.
         *
         * §7 Y8: "The English text is our translation of the French screenshot.
         * It will be replaced by the real English text after Zubair's
         * verification. Keep it in one constant." That constant is
         * `yotiUploadCopy` in yoti-tokens.ts; this screen supplies only the
         * document name, from the service config.
         *
         * `headingLarge` rather than `heading`: YOTI_OBSERVED calls it "well
         * above body size" and §6 puts Y1 and Y8 a step above every other
         * heading in the zone. Leaded at `headingLeading` (1.2) — "tightly
         * leaded" in the transcription, and the same leading the other Yoti
         * headings use.
         */}
        <p
          className="w-full shrink-0 font-bold [word-break:break-word] md:max-w-[560px]"
          style={{
            fontSize: YOTI_TEXT.headingLarge,
            lineHeight: YOTI_TEXT.headingLeading,
            color: YOTI_COLOR.ink,
          }}
        >
          {yotiUploadCopy(copy.documentLabel)}
        </p>

        {/*
         * The progress bar. Track and fill both `rounded-full`, so the ends are
         * round at every width and at every fill position — including 0%, where
         * a square-ended fill would flash as a 5px block before it moved.
         *
         * The FILL is animated by CSS (`.gnl-yoti-upload-fill` in globals.css),
         * not by this component and not by JavaScript: that is what makes it
         * honour `prefers-reduced-motion` in a stylesheet, where the preference
         * lives, and what makes the static HTML show a finished bar rather than
         * an empty one. See YotiUploadAdvance for the full reasoning.
         */}
        <div
          className="w-full shrink-0 overflow-hidden rounded-full"
          style={{
            height: YOTI_SIZE.progressHeight,
            background: YOTI_COLOR.track,
          }}
          role="progressbar"
          aria-label="Uploading"
          data-name="yoti-upload-progress"
        >
          <div
            className="gnl-yoti-upload-fill h-full rounded-full"
            style={{
              background: YOTI_COLOR.ink,
              animationDuration: `${YOTI_SIZE.progressMs}ms`,
            }}
          />
        </div>
      </div>

      {/*
       * The hop to step 5. Renders nothing; see YotiUploadAdvance for why the
       * bar and the timer are deliberately separate.
       */}
      <YotiUploadAdvance href={routes.verified} ms={YOTI_SIZE.progressMs} />
    </CidScreen>
  );
}
