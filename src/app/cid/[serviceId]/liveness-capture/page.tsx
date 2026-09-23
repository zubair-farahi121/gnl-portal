import { CidLivenessCaptureScreen } from "@/components/cid/screens/CidLivenessCaptureScreen";
import { cidVariantParams, getService, toServiceId } from "@/lib/data/service-config";

/*
 * /cid/[serviceId]/liveness-capture/ — the SAME screen for every service that is not the
 * default. Today that is exactly one page: /cid/studentaid/liveness-capture/,
 * §9 PP-13, Figma 6217:66070.
 *
 * ====================================================================
 * PRERENDERED, NOT RESOLVED AT RUNTIME.
 *
 * `generateStaticParams` runs at BUILD time and `output: export` writes one
 * static HTML file per param — out/cid/studentaid/liveness-capture/index.html — with
 * StudentAidNL's wizard title, copy and links already in it. Nothing reads a
 * store, a query param or a cookie on the client, so there is no flash of the
 * wrong service when the presenter opens this URL cold. That is the whole
 * argument; the long version is the seam note at the foot of
 * src/lib/data/service-config.ts.
 *
 * EACH SCREEN IS STILL INDIVIDUALLY ADDRESSABLE, which is what DEMO_AUDIT.md §7
 * item 3.2 insists on: the presenter's ArrowRight recovery and typing a URL on
 * stage both need a real page at a real path, and a dynamic segment under
 * `output: export` produces exactly that.
 *
 * THE PARAM LIST IS DECLARED ONCE, in `cidVariantParams`, so adding a third
 * service is a config edit rather than ten route edits. `toServiceId` throws on
 * anything unknown instead of falling back — a silent fallback here would
 * prerender Flow A's copy at a Flow B URL and no gate would catch it.
 * ====================================================================
 */
export function generateStaticParams() {
  return cidVariantParams();
}

export default async function CidLivenessCaptureVariantPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <CidLivenessCaptureScreen service={getService(toServiceId(serviceId))} />;
}
