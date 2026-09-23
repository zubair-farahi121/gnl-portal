import { CidCaptureBackScreen } from "@/components/cid/screens/CidCaptureBackScreen";
import { DEFAULT_SERVICE_ID, getService } from "@/lib/data/service-config";

/*
 * /cid/capture-back/ — FLOW A's binding of CID_ID1 6057:20924 (capture, back).
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN — 2026-09-23.
 *
 * All the markup, the Figma geometry and the provenance notes live in
 * src/components/cid/screens/CidCaptureBackScreen.tsx. This file exists only to
 * say WHICH SERVICE this URL renders, and it says it once, explicitly.
 *
 * THERE IS NO FLOW B TWIN. §9 says of PP-09..PP-19: "**no back capture**" —
 * a passport has one page — so `captureSides` on `studentaid` is `['front']`
 * and neither this route nor a link to it is produced for that service. See
 * `cidBackCaptureParams` in src/lib/data/service-config.ts.
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
export default function CidCaptureBackPage() {
  return <CidCaptureBackScreen service={getService(DEFAULT_SERVICE_ID)} />;
}
