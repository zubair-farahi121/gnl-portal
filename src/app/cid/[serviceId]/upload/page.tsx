import { CidUploadScreen } from "@/components/cid/screens/CidUploadScreen";
import { cidVariantParams, getService, toServiceId } from "@/lib/data/service-config";

/*
 * /cid/[serviceId]/upload/ — Y8 for every service that is not the default.
 * Today that is exactly one page: /cid/studentaid/upload/.
 *
 * ====================================================================
 * PRERENDERED, NOT RESOLVED AT RUNTIME — the same argument as every other page
 * under this segment: `generateStaticParams` runs at BUILD time and
 * `output: export` writes out/cid/studentaid/upload/index.html with
 * StudentAidNL's wizard title and its own document name ("Passport") already in
 * it. Nothing reads a store, a query param or a cookie on the client, so there
 * is no flash of the wrong service when the presenter opens this URL cold. The
 * long version is the seam note at the foot of src/lib/data/service-config.ts.
 *
 * `cidVariantParams()` UNFILTERED, unlike the back-capture route next door.
 * /cid/[serviceId]/capture-back/ uses `cidBackCaptureParams()` because §9 says
 * Flow B has "**no back capture**" — a passport has one page. The UPLOAD is not
 * conditional on that: whichever side or sides were photographed, they are
 * uploaded, so Y8 exists for every service and the forward link into it comes
 * from whichever capture screen the flow ends on.
 * ====================================================================
 */
export function generateStaticParams() {
  return cidVariantParams();
}

export default async function CidUploadVariantPage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <CidUploadScreen service={getService(toServiceId(serviceId))} />;
}
