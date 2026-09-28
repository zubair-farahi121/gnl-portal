import { ConfirmRequiredScreen } from "@/components/onboarding/screens/ConfirmRequiredScreen";
import { getService } from "@/lib/data/service-config";

/*
 * /services/driver-vehicle/confirm-details/ — FLOW A's binding of NL-06
 * Confirm Some Details: **Required** (Figma 6031:6301, a pasted screenshot;
 * step 3 of 4, 75 %).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-28.
 *
 * The markup and the derived-geometry notes moved to
 * src/components/onboarding/screens/ConfirmRequiredScreen.tsx, which renders
 * the shared ConfirmDetailsCard in its Required state. This file only says
 * WHICH SERVICE this URL renders.
 *
 * Its Flow B twin is /services/studentaid/confirm-details/ (§9 PP-06),
 * generated from the SAME component by
 * src/app/services/[serviceId]/confirm-details/page.tsx.
 * ====================================================================
 */
export default function ConfirmDetailsRequiredPage() {
  return <ConfirmRequiredScreen service={getService("driver-vehicle")} />;
}
