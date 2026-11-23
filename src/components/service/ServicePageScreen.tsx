import { GnwtServicePage } from "@/components/service/GnwtServicePage";
import type { ServiceConfig } from "@/lib/data/service-config";

/*
 * The service page for every service the `[serviceId]` segment builds —
 * today Student Financial Assistance (Figma 40:76851 unverified, 44:83878
 * Trusted). release-2, 2026-11-16: it renders the shared GNWT layout, the
 * same component as Driver and Vehicle Services. See GnwtServicePage.tsx.
 */
export function ServicePageScreen({ service }: { service: ServiceConfig }) {
  return <GnwtServicePage id={service.id} />;
}
