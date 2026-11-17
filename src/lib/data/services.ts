import { serviceRoutes } from "@/lib/data/service-config";

/**
 * Copy for the GNWT services dashboard — Figma `gnwt-services-dashboard`
 * 20:23087 (release-2, 2026-11-16). Spec A §6.
 *
 * Copy is character-for-character from Figma, including its inconsistencies:
 * the straight apostrophes in "driver's", and no full stop after "fish in the
 * NWT" or "pay related fees online".
 */

export type ServiceCardData = {
  /** Noto Sans Medium 20/30, black, underlined. Wraps. */
  title: string;
  /** The card body: ONE paragraph, Regular 16/22 #333 (not a bullet list). */
  body: string;
  /**
   * Only "Driver and Vehicle Services" and "Student Financial Assistance"
   * have one. Every other card is inert on purpose (it shows the "Not part
   * of this demo" toast).
   */
  href?: string;
  /** Clamp the title to 2 lines with "…" — ATOC only, as in the design. */
  clampTitle?: boolean;
};

/**
 * `welcome-section` — "Welcome Jason Moore!"
 *
 * The wallet's holder / owner (driver-vehicle.ts, flow4.ts) is built from this,
 * so it follows.
 */
export const DEMO_USER = { name: "Jason Moore" } as const;

/**
 * `services-grid` — the 12 cards in VISUAL ROW ORDER (row 1 left to right,
 * then row 2, then row 3). The dashboard lays them out with CSS grid, so the
 * DOM, reading and tab order match the rows at every column count. Figma
 * builds the grid as 4 flex columns of 3; the result at 4 columns is the same.
 */
export const SERVICE_CARDS: readonly ServiceCardData[] = [
  // row 1
  {
    title: "Apprenticeship, Trade and Occupation Certification (ATOC)",
    body: "Update your files, view status and results, and download transcripts.",
    clampTitle: true,
  },
  {
    title: "Driver and Vehicle Services",
    body: "Renew a driver's licence, get a driver's abstract, renew vehicle registration, renew general identification card.",
    href: serviceRoutes("driver-vehicle").page,
  },
  {
    title: "Electrical/Mechanical Safety Inspections Dashboard",
    body: "Submit permit applications, qualified worker registrations, and stamped engineered drawings.",
  },
  {
    title: "Fishing Licence",
    body: "Get an NWT Sport Fishing Licence to fish in the NWT",
  },
  // row 2
  {
    title: "Health Care Card for Newborn",
    body: "Apply for Health Care for a newborn child of NWT residents. A valid NT health care card is required to receive health care services.",
  },
  {
    title: "Health Care Card (new)",
    body: "Apply to start health care coverage for NWT residents. A valid NT health care card is required to receive health care benefits.",
  },
  {
    title: "Health Care Card (Renewal)",
    body: "Apply to renew Health Care coverage. Renewal is not automatic. Health Care Cards are valid for a maximum of three years and expire on your birthdate.",
  },
  {
    title: "Insurance Licence Dashboard",
    body: "Submit applications for Insurance licences for Agent, Adjuster, Sales-person, Insurance Travel agent or Insurer (Insurance Company) for licencing to conduct insurance business in the NWT.",
  },
  // row 3
  {
    title: "Leases, licences, permits and other land authorizations",
    body: "Use the Lands Dashboard to submit, monitor, and pay for land authorizations in one place.",
  },
  {
    title: "Liquor Licences & Permits Dashboard",
    body: "Submit applications and pay related fees online",
  },
  {
    title: "MACA Consumer Affairs Dashboard",
    body: "Submit applications and pay for the licences online.",
  },
  {
    title: "Student Financial Assistance",
    body: "Apply for full-time student financial assistance to help supplement the cost of obtaining a post-secondary education.",
    href: serviceRoutes("studentaid").page,
  },
];
