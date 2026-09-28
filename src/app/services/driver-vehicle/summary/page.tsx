import { ServiceSummaryScreen } from "@/components/onboarding/screens/ServiceSummaryScreen";
import { getService } from "@/lib/data/service-config";

/*
 * /services/driver-vehicle/summary/ — FLOW A's binding of NL-04 Summary
 * (Figma 6031:6242, a pasted screenshot; wizard step 1 of 4, 25 %).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-28.
 *
 * All the markup, the derived geometry and the provenance notes (including
 * the Q-01 "is Notification Settings a step?" answer) moved to
 * src/components/onboarding/screens/ServiceSummaryScreen.tsx. This file exists
 * only to say WHICH SERVICE this URL renders, and it says it once, explicitly —
 * the same arrangement as every src/app/cid/<screen>/page.tsx.
 *
 * Its Flow B twin is /services/studentaid/summary/ (§9 PP-04), generated from
 * the SAME component by src/app/services/[serviceId]/summary/page.tsx.
 *
 * `"driver-vehicle"` IS A LITERAL, NOT `DEFAULT_SERVICE_ID`, as it always was
 * in this folder: the route directory fixes the service. Resolving it from the
 * default would make this page follow whatever the default happens to be.
 * ====================================================================
 */
export default function SummaryPage() {
  return <ServiceSummaryScreen service={getService("driver-vehicle")} />;
}
