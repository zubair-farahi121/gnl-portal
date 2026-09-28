import { ReadyToUseScreen } from "@/components/onboarding/screens/ReadyToUseScreen";
import { getService } from "@/lib/data/service-config";

/*
 * /services/driver-vehicle/confirmation/ — FLOW A's binding of NL-23 Ready to
 * Use: Success! (Figma 6217:82446, 1440 x 1024).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-28.
 *
 * The markup, the re-sync geometry and the apostrophe notes moved to
 * src/components/onboarding/screens/ReadyToUseScreen.tsx. This file only says
 * WHICH SERVICE this URL renders — and therefore which service
 * `MarkOnboarded` promotes to Trusted when it opens.
 *
 * Its Flow B twin is /services/studentaid/confirmation/ (§9 PP-22), generated
 * from the SAME component by src/app/services/[serviceId]/confirmation/page.tsx.
 * ====================================================================
 */
export default function ConfirmationPage() {
  return <ReadyToUseScreen service={getService("driver-vehicle")} />;
}
