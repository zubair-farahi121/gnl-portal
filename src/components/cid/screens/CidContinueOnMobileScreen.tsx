import Link from "next/link";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { ASSETS } from "@/lib/assets";
import { getCidCopy } from "@/lib/data/cid";
import { cidRoutes, type ServiceConfig } from "@/lib/data/service-config";

/*
 * CID_Redirect to mobile — Figma 6217:62059, 1440 x 1161.1964111328125.
 *
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-23. /cid/continue-on-mobile/ (Flow A) and
 * /cid/studentaid/continue-on-mobile/ (Flow B, §9 PP-09 = 6217:62060, an
 * instance of this master marked "reuse").
 *
 * NOTHING ON THIS FRAME IS SERVICE-DEPENDENT — it carries no wizard title and
 * no service name — so the only thing the service changes is where its single
 * link goes: on to the Terms of use screen OF THE SAME SERVICE. It still takes
 * the prop rather than defaulting, because a hand-off that silently dropped the
 * presenter into Flow A's CertifiO run would be the exact bug this refactor
 * exists to make impossible.
 * ====================================================================
 *
 * ADDED 2026-09-22. The mobile hand-off: the point where the journey offers to
 * move identity verification onto a phone. design/verification-frame-map.md §5
 * had this down as "Not found… Confidence: medium. Treat as 'no evidence for',
 * not 'proven absent'." That caveat was right — the frame exists. G5 is closed.
 *
 * THIS IS A 1440 DESKTOP FRAME, NOT A CID SCREEN. It does NOT use CidScreen.
 * Every other `CID_*` frame in the file is 393 wide; this one is 1440, carries
 * the desktop `top-nav actions` (6156:58458) and the desktop `footer verified`
 * (6156:58507), and every string on it is Lato on the GNL ramp rather than
 * Montserrat on the Yoti ramp. It is a GNL page, so it follows
 * /services/driver-vehicle/prerequisite/ and /auth/loading/, not /cid/terms/.
 *
 * WHERE IT SITS IN THE FLOW — read off the canvas, not guessed. On Row B
 * (y=3563) this frame is at x=13340.17, between `/onboard/`'s neighbourhood
 * (x=11662) and `CID_TU` (x=15130). Row B's x-order is flow order — the frame
 * map establishes that over nine consecutive frames — so it belongs between the
 * prerequisite-check wizard and Terms of use, which is where it is wired.
 *
 * NO SUB-STEP PILL, so it does not disturb the CID counter. Like every other
 * 1440 frame in the file it has no `sub-step-readout`; the counter still runs
 * 1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 5 over the ten 393-wide CID screens.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata on 6217:62059 and
 * get_design_context on 6156:60701:
 *   top-nav actions  1440 x 69            at y=0          (6156:58458)
 *   main-content     1440 x 951.9812      at y=69         (6156:58459)
 *     Frame 2          824 x 647.9812     at x=308, y=152   p-[40px] gap-[32px]
 *                                                           items-center
 *       Frame 1        744 x 212          at y=40           gap-[32px]
 *         Headings     744 x  60          at y=0            40px Lato REGULAR
 *         Banner       536 x  59          at y=63           hidden="true"
 *         paragraphs   744 x 120          at y=92           16px, 3 p, mb-[12px]
 *       image 13   220.4014 x 216.9812    at x=301.799, y=284
 *       footnote       744 x  24          at y=532.9812     16px, leading 1.5
 *       link           186 x  19          at x=319, y=588.9812
 *   footer verified  1440 x 140.2152      at y=1020.9812   (6156:58507)
 *
 * 40 + 212 + 32 + 216.9812 + 32 + 24 + 32 + 19 + 40 = 647.9812, and
 * 69 + 951.9812 + 140.2152 = 1161.1964 — the frame height, exactly.
 *
 * The card sits in a SYMMETRIC 152px well (152 + 647.9812 = 799.9812 of a
 * 951.9812px main, leaving 152) and is centred horizontally: x=308 with
 * width 824 is (1440 - 824) / 2 on both sides. Same arrangement as every other
 * desktop wizard frame, which is why `.gnl-gutter [--gnl-gutter:308px]` plus
 * `justify-center` reproduces it exactly at 1440 and still centres below.
 *
 * THE CARD IS 824 WIDE, NOT THE 820 `wizard-card`. Same as /auth/loading/'s
 * card (6236:46385), and for the same reason: these two frames use a slightly
 * wider box than the 820px `wizard-card` the onboarding wizard uses. Reproduced,
 * not harmonised — which is also why this page does NOT use `WizardCard`.
 *
 * `items-center` IS THE CARD'S, AND IT ONLY MOVES TWO CHILDREN. `Frame 1` and
 * the footnote are `w-full`, so centring cannot move them and their text stays
 * left-aligned exactly as the frame shows. Only `image 13` (x=301.799 = the
 * centre of 824) and the link (x=319 = the centre of 824) are shrink-to-fit,
 * and those are the two the design centres.
 *
 * FONT WEIGHTS. Figma marks the heading `Lato:Regular`, so 40px at weight 400,
 * NOT bold — identical to /auth/loading/'s 40px heading and deliberately unlike
 * the 32/36px BOLD headings on the wizard frames. The link is `Lato:Bold` (700).
 * Lato ships no 500 or 600 and neither weight appears on this frame.
 *
 * HIDDEN LAYER NOT RENDERED: `Banner` (6156:60704, 536 x 59 at y=63) is
 * hidden="true" in Figma — the same anticipated-but-unshown error state
 * 6217:80871 carries. Hidden layers are not part of the design.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * EXITS — the frame has exactly ONE control, and it navigates.
 *   "Continue on my computer" (6156:60708) -> this service's /…/terms/
 *
 * The QR is an image, not a link: there is no second device in this demo and a
 * clickable QR would be a control the design does not have. There is no Back,
 * Cancel or "Continue on my phone" on this frame either — `Banner` is the only
 * other layer and it is hidden. So the reverse move is the presenter's
 * ArrowLeft (DemoNav, driven by src/lib/flow.ts) and the browser's own back
 * button, exactly as on the four Yoti ID-document screens.
 *
 * NO QR SCANNING, NO SECOND DEVICE, NO CAMERA. The demo is a faithful static
 * reproduction: the presenter clicks "Continue on my computer" and the journey
 * carries on in the same window.
 * ------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------
 * RESPONSIVE. The ladder is copied verbatim from
 * /services/driver-vehicle/prerequisite/ and /onboard/ next door, so three
 * consecutive desktop frames reflow identically: `.gnl-gutter` with the design
 * gutter as its custom property, the 152px well stepping 152 -> 96 -> 48 -> 32,
 * and the main's pinned height released below the design width.
 *
 * `max-md` / `max-xs` — NAMED breakpoints only. Tailwind sorts arbitrary
 * max-width variants into a different group from the named ones, so an
 * arbitrary one loses to `max-xl` at phone widths; that bug has already been
 * found and fixed once in this repo.
 *
 * Invented here, and only here:
 *   Headings  `max-md:text-[32px] max-xs:text-[26px]` — the same ladder
 *             /auth/loading/ applies to its own 40px H4. At 320 the card
 *             interior is ~240px, where 40px type is three words a line.
 * The QR box is NOT relaxed: 220.401px fits inside the ~240px card interior at
 * 320, so it never needs to shrink and its measured size stays exact at every
 * width — which is the whole point of a dimension-exact placeholder.
 * ------------------------------------------------------------------------
 *
 * No "use client": nothing on this screen uses a hook.
 */
export function CidContinueOnMobileScreen({ service }: { service: ServiceConfig }) {
  const { mobileHandoff: copy } = getCidCopy(service);
  const routes = cidRoutes(service.id);

  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      {/* main-content 6156:58459 */}
      <main className="h-[951.981px] w-full max-[1439px]:h-auto" data-node-id="6156:58459">
        <div className="gnl-gutter [--gnl-gutter:308px] flex justify-center pt-[152px] max-[1439px]:pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          {/*
           * Frame 2 6156:60701 — the 824px card.
           *
           * Class string lifted from /auth/loading/'s card (6236:46385), which
           * is the same 824 x p-[40px] x gap-[32px] box with the same 1px
           * #e0e4e6 stroke and the same drop shadow. The stroke is painted with
           * an inset box-shadow rather than `border`, the way WizardCard and
           * TopNav do it: Figma strokes INSIDE the frame, so a CSS border would
           * make the card 826 wide and its interior 742 instead of 744.
           */}
          <div
            className="box-border flex w-[824px] max-w-full shrink-0 flex-col items-center gap-[32px] rounded-[6px] bg-white p-[40px] shadow-[inset_0_0_0_1px_#e0e4e6] [filter:drop-shadow(0px_4px_12px_rgba(0,0,0,0.03))] max-md:gap-[24px] max-xs:p-[24px]"
            data-node-id="6156:60701"
          >
            {/* Frame 1 6156:60702 */}
            <div
              className="flex w-full shrink-0 flex-col items-start gap-[32px]"
              data-node-id="6156:60702"
            >
              {/*
               * Headings 6156:60703. Figma maps this to a design-system
               * `CocHeadings` component at level="H4" — a type-scale token
               * (40px Lato Regular), not document structure, so it renders as
               * the page's <h1>. Identical treatment to /auth/loading/.
               */}
              <div className="flex w-full items-start" data-node-id="6156:60703">
                <h1
                  className="min-w-px flex-[1_0_0] text-[40px] font-normal leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-md:text-[32px] max-xs:text-[26px]"
                  data-node-id="I6156:60703;9411:3313"
                >
                  {copy.heading}
                </h1>
              </div>

              {/*
               * 6156:60705 — ONE Figma text node holding three paragraphs, so
               * the 12px between them is `mb-[12px]` on all but the last and
               * not a flex gap. That is how Figma lays out paragraph spacing
               * inside a single node, and it is why the block measures 120 and
               * not 144.
               */}
              <div
                className="w-full shrink-0 text-[16px] font-normal text-[#5f6368] [word-break:break-word]"
                data-node-id="6156:60705"
              >
                {copy.paragraphs.map((text, i) => (
                  <p
                    key={text}
                    className={
                      i === copy.paragraphs.length - 1
                        ? "leading-[1.5]"
                        : "mb-[12px] leading-[1.5]"
                    }
                  >
                    {text}
                  </p>
                ))}
              </div>
            </div>

            {/*
             * image 13 6156:60706 — the mobile-handoff QR, 220.4013671875 x
             * 216.981201171875.
             *
             * PLACEHOLDER ARTWORK (see src/lib/assets.ts). The box is pinned to
             * the exact Figma floats and the image fills it, so dropping in the
             * real export is a byte swap with no layout change.
             *
             * NOT A CONTROL. It is a plain <img> with no href and no handler:
             * the demo has no second device, no camera and no scanning, and a
             * clickable QR would be interactivity the design does not have.
             */}
            <div
              className="relative h-[216.981201171875px] w-[220.4013671875px] shrink-0"
              data-node-id="6156:60706"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={ASSETS.qrMobileHandoff}
              />
            </div>

            {/* 6156:60707 — w-full, so the card's `items-center` cannot move it
                and the line stays left-aligned as the frame shows. */}
            <p
              className="w-full shrink-0 text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]"
              data-node-id="6156:60707"
            >
              {copy.footnote}
            </p>

            {/*
             * 6156:60708 — the frame's only control. Shrink-to-fit, so the
             * card's `items-center` DOES centre it: 186 wide at x=319 is
             * (824 - 186) / 2, which is what the measurement shows.
             *
             * `leading-[normal]` because Figma says normal (~1.2, giving the
             * measured 19px box). Tailwind's `leading-normal` is 1.5 and would
             * make it 24 and move the card's bottom edge.
             */}
            <Link
              href={routes.terms}
              className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[normal] text-[#004b87] underline decoration-solid decoration-from-font [text-decoration-skip-ink:none] [text-underline-position:from-font] max-xs:py-[10px] max-xs:text-center"
              data-node-id="6156:60708"
            >
              {copy.continueOnComputer}
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
