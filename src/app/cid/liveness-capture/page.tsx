import { CidLivenessCaptureScreen } from "@/components/cid/screens/CidLivenessCaptureScreen";
import { DEFAULT_SERVICE_ID, getService } from "@/lib/data/service-config";

/*
 * /cid/liveness-capture/ — FLOW A's binding of CID_Biometric 6217:65271 (liveness, capture).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-23.
 *
 * All the markup, the Figma geometry and the provenance notes live in
 * src/components/cid/screens/CidLivenessCaptureScreen.tsx. This file exists only to
 * say WHICH SERVICE this URL renders, and it says it once, explicitly.
 *
 * Its Flow B twin is /cid/studentaid/liveness-capture/ (§9 PP-13, Figma 6217:66070),
 * generated from the SAME component by src/app/cid/[serviceId]/liveness-capture/page.tsx.
 *
 * WHY THE BARE PATH STAYS FLOW A's: these eleven /cid/ URLs are frozen
 * baseline frames (design/frames.json) and `npm run diff` measures them, and
 * BUILD_BRIEF.md §6 says to keep an existing path. Moving them under
 * /cid/driver-vehicle/ for symmetry would move nineteen frames and buy nothing.
 *
 * `getService(DEFAULT_SERVICE_ID)` is spelled out rather than left to
 * `getService()`'s default argument so that a reader of this file can see the
 * answer without opening another one.
 * ====================================================================
 */
export default function CidLivenessCapturePage() {
  return <CidLivenessCaptureScreen service={getService(DEFAULT_SERVICE_ID)} />;
}
