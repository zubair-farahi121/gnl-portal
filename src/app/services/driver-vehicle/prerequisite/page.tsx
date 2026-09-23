import Link from "next/link";
import { TopNav } from "@/components/chrome/TopNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { PREREQ_CONFIRM, WIZARD_ACTIONS, WIZARD_TITLE } from "@/lib/data/onboarding";

/*
 * Driver and Vehicle_Prerequisite confirmed — Figma 6217:81644,
 * 1440 x 996.2152099609375.
 *
 * ADDED 2026-09-22. Step 7 of the verification journey, and the last screen
 * the flow was missing: `/auth/loading/` used to hand straight to
 * `/services/driver-vehicle/confirmation/`.
 *
 * NOT A VARIANT OF THE CONFIRMATION FRAME. 6217:81644 and 6217:82446 sit side
 * by side on the same canvas row at x=23416.06 and x=25108.81, in that order,
 * and differ on everything: the stepper is on **Prerequisite Check** here and
 * **Ready to Use** there, the heading is "Confirm some details" against
 * "Success!", and the actions are Cancel/Back/Continue against Back/Go to
 * Service. A prior audit had them down as the same screen rebuilt; they are
 * not. See design/verification-frame-map.md §4.
 *
 * THIS IS A 1440 DESKTOP WIZARD FRAME, NOT A CID SCREEN. It does not use
 * CidScreen: there is a real desktop frame here, so nothing about this page is
 * invented chrome. It follows /services/driver-vehicle/onboard/ and
 * /services/driver-vehicle/confirmation/ instead, which are the same
 * wizard-card in the same well.
 *
 * ====================================================================
 * MEASURED (Figma). Geometry verbatim from get_metadata / get_design_context
 * on 6217:81644 and 6217:81647:
 *   top-nav actions    1440 x 69      at y=0        (6217:81645)
 *   Main Content       1440 x 787     at y=69       (6217:81646)
 *     wizard-card       820 x 483     at x=310, y=152   p-[40px] gap-[32px]
 *       wizard-header   740 x 118     at y=40       gap-[24px]
 *         wizard-title  740 x 42      at y=0        28px Bold, centred
 *         progress-stepper 740 x 52   at y=66       gap-[12px]
 *           step-bar      740 x 16    at y=0        fill 555  (= 75%)
 *           step-labels   740 x 24    at y=28       current = Prerequisite Check
 *       section-intro   740 x 54      at y=190      (6217:81658)
 *         section-title 740 x 54      36px Bold on --gnl-heading
 *       card-description 740 x 24     at y=276      16px Regular, leading 24
 *       Frame 1         740 x 24      at y=332      gap-[24px]
 *         card-description 448.189 x 24   SemiBold on --gnl-heading
 *         card-description 267.811 x 24   SemiBold #198754, right-aligned
 *       actions-row     740 x 55      at y=388      pt-[16px], justify-end
 *         Cancel         48 x 19      at x=455, y=26
 *         btn-back       75 x 39      at x=527, y=16
 *         ContinueButton 114 x 39     at x=626, y=16
 *   footer verified    1440 x 140.215 at y=856       (6217:81670)
 *
 * 40 + 118 + 32 + 54 + 32 + 24 + 32 + 24 + 32 + 55 + 40 = 483, and
 * 69 + 787 + 140.215 = 996.215 — the frame height, exactly.
 *
 * The card sits in a SYMMETRIC 152px well: 152 + 483 = 635 of a 787px main,
 * leaving 152 below. Same arrangement as the onboard frame.
 *
 * STEPPER. step-bar-fill is 555 of a 740px track — exactly 75%, which is
 * `current={2}` under the even-quarters formula, and the bold label is
 * `Prerequisite Check`, index 2. Identical to the onboard frame's stepper,
 * because it IS the same wizard step: onboarding has not advanced, the
 * prerequisite has just been satisfied. `size="lg"` is the rebuilt desktop
 * scale (28px title, 16px bar, 16px labels) that 6217:82446 introduced; this
 * frame measures the same numbers, so it takes the same variant.
 *
 * NO SUB-STEP PILL. Every CID mobile frame carries a `sub-step-readout`; no
 * desktop wizard frame does, this one included. `subStep` is not passed.
 *
 * THE BUTTON GEOMETRY IS THE `lg` PAIR. ContinueButton is 114 x 39 with its
 * 66 x 19 label at x=24, y=10 — px-[24px] py-[10px] on a 16px Bold label,
 * which is `BtnPrimary size="lg"`. btn-back is 75 x 39 with its 35 x 19 label
 * at x=20, y=10 — px-[20px] py-[10px] on 16px Bold, which is `BtnOutline`
 * unchanged. Cancel is a bare 16px Lato:SemiBold link in #004b87 (no 600 in
 * Lato → 700), vertically centred against the 39px buttons.
 *
 * COPY. Character-for-character from Figma, in `PREREQ_CONFIRM`. Both
 * apostrophes are U+2019 here, where the onboard frame uses U+0027 for the
 * same requirement sentence; the trailing space after the intro's colon is
 * the design's. See the note in src/lib/data/onboarding.ts.
 * ====================================================================
 *
 * ------------------------------------------------------------------------
 * EXITS — all three controls navigate; none is decorative.
 *   Cancel   -> /services/driver-vehicle/   leave onboarding, same target the
 *                                           onboard frame's Cancel uses
 *   Back     -> /auth/loading/              step 6, the provider IDV-status
 *                                           page, exactly as the frame order
 *                                           in Figma implies
 *   Continue -> /services/driver-vehicle/confirmation/   step 8
 *
 * Back pointing at /auth/loading/ is only usable because that page's 2.6s
 * auto-advance was removed in the same change — with the timer still in place
 * Back was a 2.6-second round trip back to this screen. See the note on
 * src/app/auth/loading/page.tsx.
 * ------------------------------------------------------------------------
 *
 * ------------------------------------------------------------------------
 * RESPONSIVE. Identical scheme to the onboard and confirmation frames next
 * door, which carry the full reasoning: `.gnl-gutter [--gnl-gutter:310px]`
 * plus `justify-center` replaces a centring value written as `pl-[310px]`,
 * the 152px well becomes real padding stepping 152 -> 96 -> 48 -> 32, and the
 * main's pinned height is released below the design width. All of it is inert
 * at 1440.
 *
 * `max-md` / `max-xs`, NEVER `max-[768px]`: Tailwind sorts arbitrary
 * max-width variants into a different group from the named ones, so the
 * arbitrary form loses to `max-xl` at phone widths. That bug has already been
 * found and fixed once in this repo.
 *
 * Two relaxations this frame needs that its neighbours do not:
 *   Frame 1      the label/status row is 740px of two nowrap-ish strings at
 *                the design width. Below 480 the card interior is ~240px, so
 *                the row stacks and the status loses its right alignment —
 *                a right-aligned "Confirmed" under a left-aligned label reads
 *                as an orphan. Above 480 it is the designed two-column row.
 *   actions-row  three controls, ~237px of content plus 48px of gaps, against
 *                ~240px of card interior at 320. Below 480 they become a
 *                full-width stack; `flex-col-reverse` puts the primary action
 *                on top while leaving the DOM (and the tab order) in its
 *                designed order. Copied from the onboard frame.
 * ------------------------------------------------------------------------
 *
 * No "use client": nothing on this page uses a hook.
 */
export default function PrerequisitePage() {
  return (
    <div className="gnl-desktop-shell">
      <TopNav />

      {/* Main Content 6217:81646 */}
      <main className="h-[787px] w-full max-[1439px]:h-auto" data-node-id="6217:81646">
        <div className="gnl-gutter [--gnl-gutter:310px] flex justify-center pt-[152px] max-[1439px]:pb-[152px] max-xl:pt-[96px] max-xl:pb-[96px] max-md:pt-[48px] max-md:pb-[48px] max-xs:pt-[32px] max-xs:pb-[32px]">
          {/* wizard-card 6217:81647 */}
          <WizardCard>
            <WizardHeader title={WIZARD_TITLE} current={2} size="lg" />

            {/* section-intro 6217:81658 — one child, so no gap is expressed. */}
            <div
              className="flex w-full shrink-0 flex-col items-start"
              data-node-id="6217:81658"
            >
              {/* 36px is the largest heading on any wizard frame. At 320 the
                  card interior is ~240px, where 36px type is two words a line,
                  so the scale steps down twice below the tablet breakpoint —
                  the same ladder /auth/loading/ uses on its 40px heading. */}
              <h1
                className="w-full shrink-0 text-[36px] font-bold leading-[1.5] text-[color:var(--gnl-heading,#212326)] [word-break:break-word] max-md:text-[30px] max-xs:text-[26px]"
                data-node-id="6217:81659"
              >
                {PREREQ_CONFIRM.title}
              </h1>
            </div>

            {/* card-description 6217:81660 — 16px on a 24px line-height. */}
            <p
              className="w-full shrink-0 text-[16px] font-normal leading-[24px] text-[#5f6368] [word-break:break-word]"
              data-node-id="6217:81660"
            >
              {PREREQ_CONFIRM.intro}
            </p>

            {/*
             * Frame 1 6217:81661 — the requirement row.
             *
             * Figma pins the label to 448.189px and gives the status the
             * remaining 267.811px with `text-right`. The label width is a
             * measured artefact of the string at 740px, not a designed
             * constraint, so it is expressed as `flex-1` on the status instead
             * — which produces the same two boxes at 1440 and lets the label
             * wrap rather than overflow as the card narrows.
             */}
            <div
              className="flex w-full shrink-0 items-start gap-[24px] text-[16px] leading-[24px] max-xs:flex-col max-xs:gap-[4px]"
              data-node-id="6217:81661"
            >
              {/* Figma: Lato:SemiBold. Lato ships no 600 — rendered 700. */}
              <p
                className="min-w-px flex-[1_0_0] font-bold text-[color:var(--gnl-heading,#212326)] [word-break:break-word]"
                data-node-id="6217:81662"
              >
                {PREREQ_CONFIRM.requirement.label}
              </p>
              {/* #198754 is the --gnl-success green. Lato:SemiBold → 700. */}
              <p
                className="shrink-0 text-right font-bold whitespace-nowrap text-[color:var(--gnl-success,#198754)] max-xs:text-left"
                data-node-id="6217:81663"
              >
                {PREREQ_CONFIRM.requirement.status}
              </p>
            </div>

            {/* actions-row 6217:81664 */}
            <div
              className="flex w-full shrink-0 items-center justify-end gap-[24px] pt-[16px] max-xs:flex-col-reverse max-xs:items-stretch max-xs:gap-[12px]"
              data-node-id="6217:81664"
            >
              {/* Cancel 6217:81665 — a bare link, not a button. Lato:SemiBold
                  → 700, `leading-[normal]` because Figma says normal (~1.2);
                  Tailwind's `leading-normal` is 1.5 and would move the row. */}
              <Link
                href="/services/driver-vehicle/"
                className="shrink-0 whitespace-nowrap text-[16px] font-bold leading-[normal] text-[#004b87] max-xs:py-[10px] max-xs:text-center"
                data-node-id="6217:81665"
              >
                {WIZARD_ACTIONS.cancelLabel}
              </Link>
              <BtnOutline
                href="/auth/loading/"
                className="max-xs:w-full max-xs:justify-center"
              >
                {WIZARD_ACTIONS.backLabel}
              </BtnOutline>
              <BtnPrimary
                href="/services/driver-vehicle/confirmation/"
                size="lg"
                nodeId="6217:81668"
                className="max-xs:w-full"
              >
                {WIZARD_ACTIONS.continueLabel}
              </BtnPrimary>
            </div>
          </WizardCard>
        </div>
      </main>

      <SiteFooter variant="desktop" />
    </div>
  );
}
