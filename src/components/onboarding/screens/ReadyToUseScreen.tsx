import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { MarkOnboarded } from "@/components/onboarding/TrackStep";
import { serviceRoutes, type ServiceConfig } from "@/lib/data/service-config";

/*
 * ====================================================================
 * ONE COMPONENT, TWO ROUTES — 2026-09-28.
 *
 *   /services/driver-vehicle/confirmation/  NL-23  Figma 6217:82446
 *   /services/studentaid/confirmation/      PP-22  Figma 6217:82447
 *
 * MOVED here from the Flow A page unchanged, with the service as a prop; the
 * `confirmation` baseline must stay at 0.000%.
 *
 * PP-22 (6217:82447) IS AN UNCHANGED INSTANCE OF THE DRIVER-AND-VEHICLE FRAME —
 * name and content both still say Driver and Vehicle (DEMO_AUDIT.md PP-22,
 * Q-09). So Flow B's copy is built to §9 / §10.1 rather than read off it: the
 * wizard title and the primary CTA ("Go to Service StudentAidNL") come from
 * the config; "Success!" and the sentence under it are the same in both.
 *
 * THIS SCREEN IS WHAT MAKES A SERVICE TRUSTED. `<MarkOnboarded service=… />`
 * records `onboarded` for THIS service only — the store is keyed per service
 * (src/lib/demo-state.tsx) — so finishing Flow B marks `studentaid` Trusted and
 * leaves `driver-vehicle` exactly as it was. `npm run clicks` asserts that.
 * ====================================================================
 */

/*
 * driver-vehicle-confirmation — Figma 6217:82446, 1440 x 1024.
 *
 * RE-SYNCED 2026-09-21. The designer deleted 6102:101144 and rebuilt this
 * frame as 6217:82446. The layout survived the rebuild unchanged — every
 * child node id below is the one the old frame used — but the wizard header
 * and the two type sizes marked (*) were scaled up.
 *
 * Geometry, verbatim from get_metadata on 6217:82446:
 *   top-nav            1440 x 69      at y=0
 *   main-content       1440 x 814.785 at y=69      (6102:101146)
 *     wizard-card       820 x 391     at x=310, y=152   (was 370)
 *       wizard-header   740 x 118     gap-[24px]   (was 98) (*)
 *       section-intro   740 x 74      gap-[8px]    (was 73) (*)
 *       actions-row     740 x 55      pt-[16px], justify-end, gap-[24px]
 *   footer verified    1440 x 140.215 at y=883.785
 *
 * (*) WHAT ACTUALLY CHANGED:
 *   wizard-title      24px -> 28px Bold                (6217:82432)
 *   step-bar           8px -> 16px tall                (6217:82434)
 *   step-labels       12px -> 16px, current now #212326 (6217:82436)
 *   section-subtitle  15px -> 16px Regular             (6102:101160)
 *   ContinueButton label 14px -> 16px, box 106 -> 324 x 39 (6102:101192)
 * All five are opt-in `size="lg"` on the shared components, because the four
 * CID mobile frames were NOT rebuilt and still use the smaller scale.
 *
 * The shared WizardHeader keeps data-node-id 6031:6308 (the component's own
 * id); this frame's instance of it is 6217:82431.
 *
 * RESPONSIVE (2026-09-21) — identical to the onboard frame next door, which
 * carries the full reasoning: `pl-[310px]` was a centring value written as a
 * left offset and only centred at 1440, so it is replaced by
 * `.gnl-gutter [--gnl-gutter:310px]` + `justify-center`, the 152px well
 * becomes real bottom padding, and the main's pinned height is released below
 * the design width. All of it is inert at 1440.
 *
 * The one thing this frame needs that onboard does not: its primary button is
 * a 324px box ("Go to Service Driver's License Renewal" at 16px), which is
 * wider than the whole card interior on a phone. Below 480 the actions row
 * becomes a full-width stack and the label wraps inside the button instead of
 * being clipped by its `overflow-clip`.
 *
 * Copy is character-for-character from Figma and is UNCHANGED by the rebuild.
 * The apostrophes in "it's" and "Driver's" are U+2019, not U+0027 — a
 * straight quote is a pixel-gate failure. Note that the rebuilt /auth/loading
 * frame uses U+0027 for the same contraction; the file disagrees with itself
 * and both are reproduced.
 */
export function ReadyToUseScreen({ service }: { service: ServiceConfig }) {
  const routes = serviceRoutes(service.id);
  return (
    <div className="gnl-desktop-shell">
      <TopNav />
      {/*
       * §8.3 NL-23: "On open, mark the service onboarded." Renders nothing, so
       * this frame's measured markup is untouched. It is what makes the service
       * page show "Trusted" from here on — and keep showing it after a refresh,
       * which the old `?verified=1` query param could not (DEMO_AUDIT.md X-04).
       */}
      <MarkOnboarded service={service.id} />

      <main className="h-[814.785px] w-full max-[1439px]:h-auto" data-node-id="6102:101146">
        {/*
         * Padding ladder 152 -> 96 -> 48 -> 32, mirroring the onboard frame.
         * `max-md`, NOT `max-[768px]`: Tailwind sorts arbitrary max-width
         * variants into a different group from named ones, so the arbitrary
         * form emitted before `max-xl` and lost to it on every phone. See the
         * fuller note on the same wrapper in ChooseMethodScreen.tsx.
         */}
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] max-[1439px]:pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          <WizardCard>
            {/*
             * WAS the literal "Driver and Vehicle" — the one wizard title in
             * the desktop flow that did not come from the config. It is
             * `service.title` now, which is the same string for Flow A.
             */}
            <WizardHeader title={service.title} current={3} size="lg" />

            <div
              className="flex w-full shrink-0 flex-col items-start gap-[8px]"
              data-node-id="6102:101158"
            >
              <p
                className="w-full text-[28px] font-bold leading-[1.5] text-[#212326] [word-break:break-word]"
                data-node-id="6102:101159"
              >
                Success!
              </p>
              <p
                className="w-full text-[16px] font-normal leading-[1.5] text-[#5f6368] [word-break:break-word]"
                data-node-id="6102:101160"
              >
                Service has been successfully onboarded, and it&#x2019;s ready to
                be used.
              </p>
            </div>

            <div
              className="flex w-full shrink-0 items-center justify-end gap-[24px] pt-[16px] max-xs:flex-col-reverse max-xs:items-stretch max-xs:gap-[12px]"
              data-node-id="6102:101188"
            >
              {/*
               * Back -> step 7, /services/driver-vehicle/prerequisite/
               * (Figma 6217:81644, "Confirm some details"). Retargeted
               * 2026-09-22: it used to point at /onboard/, which was correct
               * only while step 7 did not exist in the build. 6217:81644 sits
               * immediately before this frame on the canvas row, so this is
               * the screen the design's Back means.
               */}
              <BtnOutline
                href={routes.prerequisite}
                className="max-xs:w-full max-xs:justify-center"
              >
                Back
              </BtnOutline>
              <BtnPrimary
                href={routes.pageVerified}
                size="lg"
                className="max-md:min-w-px max-md:shrink max-md:text-center max-xs:w-full"
              >
                {service.goToServiceLabel}
              </BtnPrimary>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
