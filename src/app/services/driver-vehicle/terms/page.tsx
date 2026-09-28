import { ServiceTermsScreen } from "@/components/onboarding/screens/ServiceTermsScreen";
import { getService } from "@/lib/data/service-config";

/*
 * /services/driver-vehicle/terms/ — FLOW A's binding of NL-05 Terms and
 * Conditions (Figma 6031:6243, a pasted screenshot; step 2 of 4, 50 %).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-28.
 *
 * All the markup, the §7.4 checkbox rule, the 184px scroll-box reasoning and
 * the provenance notes moved to
 * src/components/onboarding/screens/ServiceTermsScreen.tsx, which is where
 * "use client" now lives too. This file only says WHICH SERVICE this URL
 * renders.
 *
 * Its Flow B twin is /services/studentaid/terms/ (§9 PP-05), generated from
 * the SAME component by src/app/services/[serviceId]/terms/page.tsx.
 *
 * The consent paragraph used to be hardcoded for this service in
 * `TERMS.consentBody`; it now comes from `terms.consent` in the service config,
 * character for character, because Flow B's paragraph is a different text.
 * ====================================================================
 */
export default function TermsPage() {
  return <ServiceTermsScreen service={getService("driver-vehicle")} />;
}
