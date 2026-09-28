import { ServiceSummaryScreen } from "@/components/onboarding/screens/ServiceSummaryScreen";
import { getService, serviceVariantParams, toServiceId } from "@/lib/data/service-config";

/*
 * /services/[serviceId]/summary/ — PP-04 Summary (no Figma node; §9 "As NL-04").
 * Today this is exactly one page: /services/studentaid/summary/
 *
 * ====================================================================
 * PRERENDERED, NOT RESOLVED AT RUNTIME — the CID precedent
 * (src/app/cid/[serviceId]/), applied to the desktop wizard 2026-09-28.
 *
 * `generateStaticParams` runs at BUILD time and `output: export` writes one
 * static HTML file per param — out/services/studentaid/summary/index.html — with
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
 * Its Flow A twin is src/app/services/driver-vehicle/summary/page.tsx,
 * which binds the same component to `driver-vehicle` at the URL it has
 * always had.
 *
 * ====================================================================
 */
export function generateStaticParams() {
  return serviceVariantParams();
}

export default async function SummaryVariantPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <ServiceSummaryScreen service={getService(toServiceId(serviceId))} />;
}
