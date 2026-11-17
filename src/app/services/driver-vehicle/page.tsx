import { GnwtServicePage } from "@/components/service/GnwtServicePage";

/*
 * /services/driver-vehicle/ — "Driver and Vehicle Services", the GNWT back of
 * the service card (Figma 24:48887 unverified, 44:83880 Trusted).
 * release-2, 2026-11-16: the GNL page (sidebar on the right, linked items,
 * Actions card) is replaced by the shared GNWT layout. See
 * src/components/service/GnwtServicePage.tsx.
 */
export default function DriverVehicleServicePage() {
  return <GnwtServicePage id="driver-vehicle" />;
}
