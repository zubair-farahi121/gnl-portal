import { CidUploadScreen } from "@/components/cid/screens/CidUploadScreen";
import { DEFAULT_SERVICE_ID, getService } from "@/lib/data/service-config";

/*
 * /cid/upload/ — FLOW A's binding of Y8, the upload screen.
 *
 * ====================================================================
 * THIS FILE IS A BINDING, NOT A SCREEN. All the markup, the provenance and the
 * reasoning live in src/components/cid/screens/CidUploadScreen.tsx. This file
 * exists only to say WHICH SERVICE this URL renders, and it says it once,
 * explicitly — the same shape as every other page under src/app/cid/.
 *
 * THERE IS NO FIGMA FRAME behind this route and no baseline in
 * design/frames.json, so `npm run diff` cannot see it. Its mechanical cover is
 * scripts/responsive-check.mjs (overflow and a clean console at eight widths)
 * and scripts/click-through.mjs (it is reached from /cid/capture-back/ and it
 * advances to /cid/verified/ on its own). Both were extended in the same pass
 * that added this file; a route with neither would be a screen nothing checks.
 *
 * IT IS IN BOTH FLOWS. Unlike /cid/capture-back/, which Flow B skips, the
 * upload happens whatever document was photographed — so the twin under
 * src/app/cid/[serviceId]/upload/ is generated for `studentaid` in the normal
 * way, with no `captureSides` filter.
 * ====================================================================
 */
export default function CidUploadPage() {
  return <CidUploadScreen service={getService(DEFAULT_SERVICE_ID)} />;
}
