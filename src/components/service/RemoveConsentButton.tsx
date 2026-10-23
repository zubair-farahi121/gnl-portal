import { DATA_PRIVACY_CARD } from "@/lib/data/driver-vehicle";
import { ASSETS } from "@/lib/assets";

/*
 * "Remove consent" — the last row of the Data & Privacy card, TRUSTED STATE
 * ONLY, on both service pages. ADDED 2026-10-23 from Tatyana's "nice-to-have"
 * mock-ups. Measured on Figma 6408:84644 (Trusted StudentAidNL, read-only):
 * a rule 16px under "Terms of Use", then "OnboardButton" 6408:83752 —
 * 174 x 39, #5f6368, text inset 28 / 10, 16px. The same shape as the
 * "Onboard" button (px 28, py 10, radius 4), only grey and 16px.
 *
 * Inert, like every out-of-scope control in this demo: `data-demo-inert` ->
 * "Not part of this demo" toast. It does NOT reset the service — removing
 * consent mid-demo would silently drop the presenter back to the locked page.
 * A real <button>, so it is keyboard-operable (the toast listener is
 * delegated on `click`, which Enter and Space dispatch).
 */
export function RemoveConsentButton() {
  return (
    <>
      {/* Same rule the card already draws above "Terms of Use": zero height,
          stroke pulled 1px up, so it adds nothing to the card's height. */}
      <div className="relative h-0 w-full shrink-0">
        <div className="absolute inset-[-1px_0_0_0]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="" className="block size-full max-w-none" src={ASSETS.dividerLine} />
        </div>
      </div>
      <button
        type="button"
        data-demo-inert="true"
        className="box-border inline-flex shrink-0 items-center justify-center overflow-clip rounded-[4px] bg-[#5f6368] px-[28px] py-[10px] text-[16px] font-bold leading-[normal] text-white hover:bg-[#4b4f54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#004b87]"
      >
        {DATA_PRIVACY_CARD.removeConsentLabel}
      </button>
    </>
  );
}
