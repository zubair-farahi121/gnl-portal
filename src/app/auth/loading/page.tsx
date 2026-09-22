"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { IDV_STATUS } from "@/lib/data/driver-vehicle";

/*
 * Provider page_IDV results status — Figma 6217:80871, 1440 x 1078.196.
 *
 * RE-SYNCED 2026-09-21. This frame REPLACES the deleted `gnl-vc-login-loading`
 * (6158:69596), which had no readable source and was reconstructed from notes.
 * Everything below is now read directly from Figma, so the whole "invented"
 * caveat that used to sit here is gone.
 *
 * THE SCREEN IS NO LONGER A SPINNER. There is no LoadingGraphic, no progress
 * ring, no progress bar and no animation of any kind in 6217:80871 — it is a
 * static message card that tells the user they may close the window. The
 * `.gnl-spinner` rule and its `@keyframes gnl-spin` were removed from
 * globals.css with this change; nothing else referenced them.
 *
 * Geometry, verbatim from get_design_context on 6217:80871:
 *   top-nav actions   1440 x 69        at y=0        (6217:79257)
 *   main-content      1440 x 868.981   at y=69       (6217:79258)
 *                     px-[120px] py-[152px], items-center
 *     card             824 x content   p-[40px] gap-[32px]   (6236:46385)
 *       block                          gap-[32px], items-start (6236:46386)
 *         Headings                     40px Lato REGULAR      (6236:46387)
 *         body                         16px, 3 p, mb-[12px]   (6236:46389)
 *       footnote                       16px                   (6236:46390)
 *   footer verified   1440 x 140.215   at y=938.981  (6217:79267)
 *   69 + 868.981 + 140.215 = 1078.196 — the frame height, exactly.
 *
 * CARD WIDTH IS 824, NOT 820. Every other desktop card in this file is the
 * 820px wizard-card. This one is 824. Reproduced, not harmonised.
 *
 * FONT WEIGHTS. Figma marks every string on this frame `Lato:Regular` — so the
 * 40px heading is font-weight 400, NOT bold. The only `Lato:Medium` and
 * `Lato:SemiBold` on the frame are in the shared top-nav, which already maps
 * them to 400 / 700 (Lato ships no 500 or 600).
 *
 * APOSTROPHES ARE STRAIGHT (U+0027) HERE — "We've", "don't", "We'll", "it's".
 * The confirmation frame 6217:82446 uses U+2019 for the same contraction. The
 * file disagrees with itself; both are reproduced verbatim. Copy lives in
 * `IDV_STATUS` in src/lib/data/driver-vehicle.ts.
 *
 * BEHAVIOURAL MISMATCH — DELIBERATE. The copy says the user can close the
 * window and will be notified later, i.e. the design describes a terminal
 * screen with no client-side transition. The demo still auto-advances to the
 * confirmation screen after DWELL_MS so the presenter reaches the success
 * state without a second machine sending the notification. Nothing on screen
 * hints at the auto-advance, which is exactly the design's intent — but it
 * does mean the implemented behaviour is not the designed behaviour. Logged
 * in design/resync-loading-confirmation.md.
 */

/** Long enough to read the card, short enough not to stall the demo. */
const DWELL_MS = 2600;

export default function AuthLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(
      () => router.push("/services/driver-vehicle/confirmation/"),
      DWELL_MS,
    );
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      {/*
       * main-content.
       *
       * RESPONSIVE: the 120px gutter moves to `.gnl-gutter`, the 152px
       * vertical well halves below 768, and the pinned height is released
       * below the design width — the card's copy wraps to more lines as it
       * narrows and would otherwise push out of the fixed box. Inert at 1440.
       */}
      <main
        className="gnl-gutter [--gnl-gutter:120px] box-border flex h-[868.981px] w-full flex-col items-center py-[152px] max-[1439px]:h-auto max-md:py-[64px]"
        data-node-id="6217:79258"
      >
        {/*
         * The 1px stroke is painted with an inset box-shadow, the same way
         * WizardCard does it: Figma strokes INSIDE the frame, so a CSS border
         * would make this card 826 wide instead of 824.
         *
         * `max-w-full` caps the designed 824 at the main's content box, so the
         * card stops being clipped on both edges below ~1064. It is a no-op at
         * 1440, where that box is 1200. The 40px inset steps to 24 under 480.
         */}
        <div
          className="box-border flex w-[824px] max-w-full shrink-0 flex-col items-center gap-[32px] rounded-[6px] bg-white p-[40px] shadow-[inset_0_0_0_1px_#e0e4e6] [filter:drop-shadow(0px_4px_12px_rgba(0,0,0,0.03))] max-md:gap-[24px] max-xs:p-[24px]"
          data-node-id="6236:46385"
        >
          <div
            className="flex w-full shrink-0 flex-col items-start gap-[32px]"
            data-node-id="6236:46386"
          >
            {/*
             * Headings. Figma maps this to a design-system `CocHeadings`
             * component at level="H4"; that is a type-scale token (40px), not
             * document structure, so it renders as the page's <h1>.
             */}
            <div className="flex w-full items-start" data-node-id="6236:46387">
              {/* 40px is the design's H4 token. On a phone the card interior
                  is ~240px, where 40px type is three words a line, so the
                  scale steps down twice below the tablet breakpoint. */}
              <h1
                className="max-w-[825px] min-w-px flex-[1_0_0] text-[40px] font-normal leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-md:text-[32px] max-xs:text-[26px]"
                data-node-id="I6236:46387;9411:3313"
              >
                {IDV_STATUS.heading}
              </h1>
            </div>

            {/*
             * One Figma text node holding three paragraphs. The inter-paragraph
             * 12px is `mb-[12px]` on all but the last, not a flex gap — that is
             * how Figma lays out paragraph spacing inside a single node.
             */}
            <div
              className="w-full shrink-0 text-[16px] font-normal text-[#5f6368] [word-break:break-word]"
              data-node-id="6236:46389"
            >
              {IDV_STATUS.paragraphs.map((text, i) => (
                <p
                  key={text}
                  className={
                    i === IDV_STATUS.paragraphs.length - 1
                      ? "leading-[1.5]"
                      : "mb-[12px] leading-[1.5]"
                  }
                >
                  {text}
                </p>
              ))}
            </div>
          </div>

          <p
            className="w-full shrink-0 text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]"
            data-node-id="6236:46390"
          >
            {IDV_STATUS.footnote}
          </p>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
