import { ConfirmedScreen } from "@/components/onboarding/screens/ConfirmedScreen";
import { getService } from "@/lib/data/service-config";

/*
 * /services/driver-vehicle/prerequisite/ — FLOW A's binding of NL-22 Confirm
 * some details: **Confirmed** (Figma 6217:81644, 1440 x 996.215).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-28.
 *
 * The markup, the measured geometry, the node ids and the long note on why
 * Back points at /auth/loading/ (and why that screen's auto-advance is a
 * one-shot) moved to src/components/onboarding/screens/ConfirmedScreen.tsx.
 * This file only says WHICH SERVICE this URL renders.
 *
 * Its Flow B twin is /services/studentaid/prerequisite/ (§9 PP-21, Figma
 * 6217:80071), generated from the SAME component by
 * src/app/services/[serviceId]/prerequisite/page.tsx — and it is where the
 * shared processing screen now sends Flow B.
 * ====================================================================
 */
export default function PrerequisitePage() {
  return <ConfirmedScreen service={getService("driver-vehicle")} />;
}
