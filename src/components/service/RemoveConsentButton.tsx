import { SERVICE_PAGE_COMMON } from "@/lib/data/gnwt-services";

/*
 * "Remove Consent" — the last row of the Data & Privacy card, TRUSTED STATE
 * ONLY, on both service pages. GNWT style (Figma 44:83880 / 44:83878,
 * release-2): a 1px rule, then an OUTLINE button — white, 1.6px #005D8F
 * border, #005D8F Bold 16, about 160 x 35. Capital C, as drawn.
 *
 * Inert, like every out-of-scope control in this demo: `data-demo-inert` ->
 * "Not part of this demo" toast. It does NOT reset the service — removing
 * consent mid-demo would silently drop the presenter back to the locked page.
 */
export function RemoveConsentButton() {
  return (
    <>
      <div className="h-px w-full shrink-0 bg-[#e9ecef]" aria-hidden="true" />
      <button
        type="button"
        data-demo-inert="true"
        className="inline-flex shrink-0 items-center justify-center self-start rounded-[6px] border-[1.6px] border-solid border-[#005d8f] bg-white px-[12px] py-[5px] text-[16px] font-bold leading-[1.5] text-[#005d8f] hover:bg-[#f3f8fc] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#005d8f]"
      >
        {SERVICE_PAGE_COMMON.removeConsent}
      </button>
    </>
  );
}
