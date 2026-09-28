import { OtherVerificationScreen } from "@/components/onboarding/screens/OtherVerificationScreen";
import { getService, otherVerificationParams, toServiceId } from "@/lib/data/service-config";

/*
 * /services/[serviceId]/other-verification/ — PP-08 Other verification (Figma 6217:35183).
 * Today this is exactly one page: /services/studentaid/other-verification/
 *
 * ====================================================================
 * PRERENDERED, NOT RESOLVED AT RUNTIME — the CID precedent
 * (src/app/cid/[serviceId]/), applied to the desktop wizard 2026-09-28.
 *
 * `generateStaticParams` runs at BUILD time and `output: export` writes one
 * static HTML file per param — out/services/studentaid/other-verification/index.html — with
 * StudentAidNL's title, copy and links already in it. Nothing reads a store, a
 * query param or a cookie to decide the service, so there is no flash of the
 * wrong service when the presenter opens this URL cold, and the screen is
 * individually addressable by URL — the presenter's on-stage recovery.
 *
 * WHY A DYNAMIC SIBLING OF A STATIC FOLDER IS SAFE: src/app/services/
 * driver-vehicle/ is a static segment, and a static segment wins an exact
 * match over `[serviceId]`. The param list excludes `driver-vehicle` anyway
 * (see `serviceVariantParams`), so Flow A's frozen URLs are served by exactly
 * the files that served them before.
 *
 * `toServiceId` throws on an unknown segment rather than falling back — a
 * silent fallback would prerender Flow A's copy at a Flow B URL.
 *
 * GENERATED ONLY FOR SERVICES THAT HAVE THE STEP. `otherVerificationParams`
 * filters on `otherVerificationStep`, so Flow A — which has no such screen —
 * gets no page here, and there is no Flow A twin of this file.
 *
 * ====================================================================
 */
export function generateStaticParams() {
  return otherVerificationParams();
}

export default async function OtherVerificationVariantPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <OtherVerificationScreen service={getService(toServiceId(serviceId))} />;
}
