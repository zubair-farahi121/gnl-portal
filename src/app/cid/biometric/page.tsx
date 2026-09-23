import { CidBiometricScreen } from "@/components/cid/screens/CidBiometricScreen";
import { DEFAULT_SERVICE_ID, getService } from "@/lib/data/service-config";

/*
 * /cid/biometric/ — FLOW A's binding of CID_Biometric 6217:62835.
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-23.
 *
 * All the markup, the Figma geometry and the provenance notes live in
 * src/components/cid/screens/CidBiometricScreen.tsx. This file exists only to
 * say WHICH SERVICE this URL renders, and it says it once, explicitly.
 *
 * Its Flow B twin is /cid/studentaid/biometric/ (§9 PP-11, Figma 6217:66061),
 * generated from the SAME component by src/app/cid/[serviceId]/biometric/page.tsx.
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
export default function CidBiometricPage() {
  return <CidBiometricScreen service={getService(DEFAULT_SERVICE_ID)} />;
}
