import { ChooseMethodScreen } from "@/components/onboarding/screens/ChooseMethodScreen";
import { getService } from "@/lib/data/service-config";

/*
 * /services/driver-vehicle/onboard/ — FLOW A's binding of NL-07 "Choose
 * verification service" (Figma 6031:6304, `driver-vehicle-prerequisite-check`).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-28.
 *
 * The markup, the measured geometry, the responsive ladder and the history of
 * every re-pointed control moved to
 * src/components/onboarding/screens/ChooseMethodScreen.tsx. This file only
 * says WHICH SERVICE this URL renders.
 *
 * Its Flow B twin is /services/studentaid/onboard/ (§9 PP-07, Figma
 * 6206:27601 — three cards, a larger type scale, and a Continue that goes to
 * PP-08 first), generated from the SAME component by
 * src/app/services/[serviceId]/onboard/page.tsx.
 *
 * `"driver-vehicle"` IS A LITERAL, as it always was here: the route directory
 * fixes the service. Resolving it from `DEFAULT_SERVICE_ID` would make this
 * page silently follow whatever the default happens to be.
 * ====================================================================
 */
export default function PrerequisiteCheckPage() {
  return <ChooseMethodScreen service={getService("driver-vehicle")} />;
}
