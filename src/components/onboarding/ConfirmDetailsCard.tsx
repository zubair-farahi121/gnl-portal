import { CancelLink } from "@/components/onboarding/CancelLink";
import { WizardCard } from "@/components/wizard/WizardCard";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { BtnPrimary } from "@/components/ui/BtnPrimary";
import { BtnOutline } from "@/components/ui/BtnOutline";
import { WIZARD_ACTIONS } from "@/lib/data/onboarding";
import {
  ACTIONS_ROW,
  BODY_TEXT,
  CANCEL_LINK,
  SECTION_TITLE,
} from "@/components/onboarding/gnwt-wizard";
import type { ServiceId } from "@/lib/data/service-config";

/* ====================================================================
 * GNWT RE-SKIN — release-2, 2026-11-16 (gnwt-specs/B-wizard.md §2.3, §2.7,
 * §5.8; Figma 24:49147 / 32:55012 / 42:77005 / 42:80944). Card 941 wide,
 * section title 29px Bold #333, intro #333, requirement label SemiBold #333,
 * status SemiBold #b11721 (Required) / #15870d (Confirmed), Cancel link
 * #005d8f, ghost Back, black Continue. No divider. The GNL geometry notes
 * below are history.
 * ====================================================================
 *
 * ConfirmDetailsCard — ONE COMPONENT, TWO STATES.
 *
 * BUILD_BRIEF.md §8.1 NL-06: *"**One component, two states** (Required NL-06 /
 * Confirmed NL-22)."*
 *
 *   Required   NL-06 / PP-06   `/services/:id/confirm-details/`
 *   Confirmed  NL-22 / PP-21   `/services/:id/prerequisite/`
 *
 * EXTRACTED, NOT DUPLICATED — 2026-09-23. Every line of markup below came out
 * of `src/app/services/driver-vehicle/prerequisite/page.tsx` unchanged, and
 * that page now renders this with `state="confirmed"`. The proof that the
 * extraction is faithful is mechanical: `prereq-confirm` is a frozen baseline
 * in design/frames.json and `npm run diff` must stay at 0.000% on it. If it
 * moves, the extraction is wrong — not the baseline.
 *
 * ====================================================================
 * MEASURED GEOMETRY — the CONFIRMED frame only.
 *
 * Figma 6217:81644 `Driver and Vehicle_Prerequisite confirmed`,
 * 1440 x 996.2152099609375. Verbatim from get_metadata / get_design_context on
 * 6217:81644 and 6217:81647:
 *   wizard-card       820 x 483   at x=310, y=152   p-[40px] gap-[32px]
 *     wizard-header   740 x 118   at y=40           gap-[24px]
 *       wizard-title  740 x 42                      28px Bold, centred
 *       progress-stepper 740 x 52                   step-bar 16, fill 555 (75%)
 *     section-intro   740 x 54    at y=190          36px Bold on --gnl-heading
 *     card-description 740 x 24   at y=276          16px Regular, leading 24
 *     Frame 1         740 x 24    at y=332          gap-[24px]
 *     actions-row     740 x 55    at y=388          pt-[16px], justify-end
 * 40 + 118 + 32 + 54 + 32 + 24 + 32 + 24 + 32 + 55 + 40 = 483, exactly.
 *
 * THE REQUIRED STATE'S GEOMETRY IS **DERIVED, NOT MEASURED**. Its only source,
 * Figma `6031:6301`, is a pasted SCREENSHOT of the live portal at 1440x980 —
 * an image with no text layer and no addressable child node. So the Required
 * state reuses this measured box exactly and changes only the four values
 * listed in PREREQ_REQUIRED. It carries NO `data-node-id` on the frame-specific
 * elements, because claiming 6217:81661 for a screen that frame does not draw
 * would be inventing provenance. The shared components keep their own ids.
 *
 * The 1440x980 screenshot also draws a hairline under the requirement row.
 * 6217:81644 — the redrawn frame, and the measured one — draws none, so none is
 * drawn here. See the note on PREREQ_REQUIRED.
 * ====================================================================
 *
 * STEPPER: both states are `current={2}` — Prerequisite Check, 75 %. §7.4:
 * *"Prerequisite Check covers all prerequisite sub-pages and all CertifiO ID
 * pages."* The requirement being unmet does not move the wizard back a step;
 * it is the same step, before and after.
 *
 * NO SUB-STEP PILL on either: every CID mobile frame carries one, no desktop
 * wizard frame does.
 *
 * RESPONSIVE — unchanged from the page this came out of, and inert at 1440:
 *   Frame 1      below 480 the card interior is ~240px, so the label/status row
 *                stacks and the status loses its right alignment; a right-
 *                aligned status under a left-aligned label reads as an orphan.
 *   actions-row  three controls, ~237px of content plus 48px of gaps, against
 *                ~240px of interior at 320. Below 480 they become a full-width
 *                stack; `flex-col-reverse` puts the primary action on top while
 *                leaving the DOM (and the tab order) in its designed order.
 * `max-md` / `max-xs`, NEVER `max-[768px]`: Tailwind sorts arbitrary max-width
 * variants into a different group from the named ones, so the arbitrary form
 * loses to `max-xl` at phone widths. Found and fixed once in this repo already.
 * ==================================================================== */

export type ConfirmDetailsState = "required" | "confirmed";

/**
 * The status word's colour is the ONLY thing the state changes about the box.
 *   Required   #d32f2f — §11.2 `danger`
 *   Confirmed  #198754 — §11.2 `success`
 * Both are written as the token with its literal fallback, the way every other
 * colour in this repo is.
 */
const STATUS_COLOUR: Record<ConfirmDetailsState, string> = {
  required: "text-[#b11721]",
  confirmed: "text-[#15870d]",
};

/** Per-frame node ids. Omitted entirely for the derived Required state. */
export type ConfirmDetailsNodeIds = {
  intro?: string;
  title?: string;
  description?: string;
  row?: string;
  rowLabel?: string;
  rowStatus?: string;
  actions?: string;
  cancel?: string;
  continue?: string;
};

export function ConfirmDetailsCard({
  state,
  wizardTitle,
  title,
  intro,
  requirementLabel,
  requirementStatus,
  service,
  cancelHref,
  backHref,
  continueHref,
  nodeIds = {},
}: {
  state: ConfirmDetailsState;
  /** Whose onboarding `Cancel` resets — §7.4. */
  service: ServiceId;
  /** The service title in the wizard header — "Driver and Vehicle". */
  wizardTitle: string;
  /** "Confirm Some Details" (Required) / "Confirm some details" (Confirmed). */
  title: string;
  intro: string;
  requirementLabel: string;
  /** "Required" / "Confirmed". */
  requirementStatus: string;
  /** §7.4 Cancel — the service page, in both states. */
  cancelHref: string;
  /** Required: back to Terms. Confirmed: back to the provider status screen. */
  backHref: string;
  /** Required: on to the method step. Confirmed: on to Ready to Use. */
  continueHref: string;
  nodeIds?: ConfirmDetailsNodeIds;
}) {
  return (
    <WizardCard>
      <WizardHeader title={wizardTitle} current={2} size="lg" />

      {/* section-intro — one child, so no gap is expressed. */}
      <div
        className="flex w-full shrink-0 flex-col items-start"
        data-node-id={nodeIds.intro}
      >
        <h1 className={SECTION_TITLE} data-node-id={nodeIds.title}
        >
          {title}
        </h1>
      </div>

      {/* card-description — 16px on a 24px line-height. */}
      <p
        className={`shrink-0 ${BODY_TEXT}`}
        data-node-id={nodeIds.description}
      >
        {intro}
      </p>

      {/*
       * Frame 1 — the requirement row.
       *
       * Figma pins the label to 448.189px and gives the status the remaining
       * 267.811px with `text-right`. The label width is a measured artefact of
       * the string at 740px, not a designed constraint, so it is expressed as
       * `flex-1` on the status instead — which produces the same two boxes at
       * 1440 and lets the label wrap rather than overflow as the card narrows.
       */}
      <div
        className="flex w-full shrink-0 items-start gap-[24px] text-[16px] leading-[24px] max-xs:flex-col max-xs:gap-[4px]"
        data-node-id={nodeIds.row}
      >
        {/* Noto Sans SemiBold 600, #333333. */}
        <p
          className="min-w-px flex-[1_0_0] font-semibold text-[#333333] [overflow-wrap:anywhere]"
          data-node-id={nodeIds.rowLabel}
        >
          {requirementLabel}
        </p>
        <p
          className={`shrink-0 text-right font-semibold whitespace-nowrap ${STATUS_COLOUR[state]} max-xs:text-left`}
          data-node-id={nodeIds.rowStatus}
        >
          {requirementStatus}
        </p>
      </div>

      {/* actions-row */}
      <div className={ACTIONS_ROW} data-node-id={nodeIds.actions}>
        {/* Cancel — a bare text link, not a button. */}
        <CancelLink
          service={service}
          href={cancelHref}
          className={CANCEL_LINK}
          nodeId={nodeIds.cancel}
        >
          {WIZARD_ACTIONS.cancelLabel}
        </CancelLink>
        <BtnOutline href={backHref} variant="ghost" className="max-xs:w-full">
          {WIZARD_ACTIONS.backLabel}
        </BtnOutline>
        <BtnPrimary
          href={continueHref}
          size="lg"
          tone="gnwt"
          nodeId={nodeIds.continue}
          className="max-xs:w-full"
        >
          {WIZARD_ACTIONS.continueLabel}
        </BtnPrimary>
      </div>
    </WizardCard>
  );
}
