import { ChooseMethodScreen } from "@/components/onboarding/screens/ChooseMethodScreen";
import { getService, serviceVariantParams, toServiceId } from "@/lib/data/service-config";

/*
 * /services/[serviceId]/onboard/ — PP-07 Choose verification service, three cards (Figma 6206:27601).
 * Today this is exactly one page: /services/studentaid/onboard/
 *
 * ====================================================================
 * PRERENDERED, NOT RESOLVED AT RUNTIME — the CID precedent
 * (src/app/cid/[serviceId]/), applied to the desktop wizard 2026-09-28.
 *
 * `generateStaticParams` runs at BUILD time and `output: export` writes one
 * static HTML file per param — out/services/studentaid/onboard/index.html — with
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
 * Its Flow A twin is src/app/services/driver-vehicle/onboard/page.tsx,
 * which binds the same component to `driver-vehicle` at the URL it has
 * always had.
 *
 * ====================================================================
 */
export function generateStaticParams() {
  return serviceVariantParams();
}

export default async function ChooseMethodVariantPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <ChooseMethodScreen service={getService(toServiceId(serviceId))} />;
}
