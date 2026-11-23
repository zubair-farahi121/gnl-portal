import type { ReactNode } from "react";

import { FLOW3_ROUTES, serviceRoutes, type ServiceId } from "@/lib/data/service-config";
import { NOA_UPSELL } from "@/lib/data/flow4";

/*
 * GNWT SERVICE PAGES — "back of the service card", release-2 (2026-11-16).
 *
 * The copy of the two GNWT service pages, verbatim from the Figma file
 * `Hfj015MPSmeRPYg72vZxTI`:
 *
 *   Driver and Vehicle Services    24:48887 (unverified) / 44:83880 (Trusted)
 *   Student Financial Assistance   40:76851 (unverified) / 44:83878 (Trusted)
 *
 * Rendered by src/components/service/GnwtServicePage.tsx. Copy notes kept on
 * purpose, as drawn:
 *   - the D&V intro uses typographic ’; the D&V action line a straight '
 *   - the support e-mail is "eservices_support" on D&V but
 *     "eservice_support" on SFA (two different strings in the design)
 *   - the SFA Data & Privacy card lists no data items
 */

export type ContactIcon = "building" | "mailbox" | "phone" | "envelope" | "link";

export type ContactRow = {
  icon?: ContactIcon;
  /** One or more lines; later lines are indented to the text column. */
  lines: readonly ReactNode[];
};

export type ContactCard = {
  /** Absent = an untitled card (SFA's programme card). */
  title?: string;
  rows: readonly ContactRow[];
};

export type ScopeIcon = "envelope" | "person";

export type VcUpsellContent = {
  title: string;
  badge: string;
  body: string;
  actionLabel: string;
  actionHref: string;
};

export type GnwtServicePageContent = {
  id: ServiceId;
  title: string;
  intro: ReactNode;
  /** The unverified page's "Click to Proceed" — the onboarding summary. */
  proceedHref: string;
  action: { title: string; body: ReactNode };
  scopes: readonly { icon: ScopeIcon; label: string }[];
  contacts: readonly ContactCard[];
  upsell: VcUpsellContent;
};

const A = "font-normal text-[#005d8f] underline hover:text-[#001f30]";
const AB = "font-bold text-[#005d8f] underline hover:text-[#001f30]";
const ADARK = "font-normal text-[#333333] underline hover:text-[#001f30]";
const EXT = { target: "_blank", rel: "noreferrer" } as const;

/** Both pages share this card's title and body (Figma 24:48887 / 40:76851). */
export const CONSENT_CARD = {
  title: "To Use This Service We Require Consent to Collect and Share Personal Information",
  body: 'To safeguard your personal information, the NWT eServices Portal complies with territorial privacy legislation. After selecting the "Click to Proceed" button, you will be guided through a consent process that explains what personal information is collected and how it is used.',
  ctaLabel: "Click to Proceed",
} as const;

export const SERVICE_PAGE_COMMON = {
  backLabel: "Back to Services",
  backHref: "/dashboard/",
  favourite: "Favourite Service",
  dataPrivacyTitle: "Data & Privacy",
  dataPrivacyBody:
    "At any time, you can change your preferences and remove consent for your personal details to be shared with this service. By doing so you will no longer be able to use the service. Removing consent will stop new data from being shared from your profile. However, previously shared data will continue to be stored within the service.",
  scopesTitle: "This service receives the following data from your profile:",
  termsLabel: "Terms of Use",
  termsHref: "https://gnwt.ca/terms-use",
  badgeUnverified: "Confirmation required",
  badgeTrusted: "Trusted",
  actionLocked: "Action locked",
  removeConsent: "Remove Consent",
} as const;

const SUPPORT_PROMPT = "For any technical support or inquiries related to the NWT eService Portal:";

export const GNWT_SERVICE_PAGES: Record<ServiceId, GnwtServicePageContent> = {
  "driver-vehicle": {
    id: "driver-vehicle",
    title: "Driver and Vehicle Services",
    intro: (
      <>
        <p>
          Persons with existing driver’s licences or vehicle registrations may renew or replace their driver’s licence
          or vehicle registration, or obtain a driver’s abstract.
        </p>
        <p>Persons may schedule a Driver’s Exam and manage various commercial permits.</p>
        <p>Persons with existing GNWT General Identification Cards may renew their cards.</p>
      </>
    ),
    proceedHref: serviceRoutes("driver-vehicle").summary,
    action: {
      title: "Driver and Vehicle Services",
      body: (
        <p>
          <strong className="font-bold text-[#333333]">Renew</strong> a driver&apos;s licence, get a driver&apos;s
          abstract, renew vehicle registration, renew general identification card.
        </p>
      ),
    },
    scopes: [
      { icon: "envelope", label: "Your email address" },
      { icon: "person", label: "Your username" },
    ],
    contacts: [
      {
        title: "Contact Information",
        rows: [
          { icon: "building", lines: ["Registrar of Motor Vehicles", "Compliance and Licensing Division", "Department of Infrastructure"] },
          { icon: "mailbox", lines: ["P.O. Box 1320", "Yellowknife, NT X1A 2L9"] },
          { icon: "phone", lines: [<strong key="t" className="font-bold">Toll Free 1-844-368-4698</strong>] },
          { icon: "envelope", lines: [<a key="m" href="mailto:dvlicensing@gov.nt.ca" className={AB}>dvlicensing@gov.nt.ca</a>] },
          { icon: "link", lines: [<a key="i" href="https://www.inf.gov.nt.ca/en/services/driver-and-vehicle-services" {...EXT} className={AB}>Information</a>] },
          { lines: [<strong key="s" className="font-bold">{SUPPORT_PROMPT}</strong>] },
          { icon: "phone", lines: ["1-833-223-1133"] },
          { icon: "envelope", lines: [<a key="e" href="mailto:eservices_support@gov.nt.ca" className={A}>eservices_support@gov.nt.ca</a>] },
        ],
      },
    ],
    upsell: {
      title: "Skip the paper copy",
      badge: "New",
      body: "Add your verified vehicle registration certificate to your wallet. Show proof instantly from your phone.",
      actionLabel: "Add to wallet",
      actionHref: FLOW3_ROUTES.c1,
    },
  },

  studentaid: {
    id: "studentaid",
    title: "Student Financial Assistance",
    intro: (
      <>
        <p>Apply for full-time student financial assistance to help supplement the cost of obtaining a post-secondary education.</p>
        <p>
          The MyECE portal is currently not available in French. Forms are available in French in pdf format, found at{" "}
          <a href="https://www.gov.nt.ca/afe" {...EXT} className={A}>
            www.gov.nt.ca/afe
          </a>
          . Questions can be directed to Services TNO.
        </p>
        <div>
          <p className="font-bold">Services TNO</p>
          <div className="pl-[12px]">
            <p>Phone: (867) 767-9348</p>
            <p>Toll Free: (866) 561-1664</p>
            <p>
              Email:{" "}
              <a href="mailto:servicestno@gov.nt.ca" className={A}>
                servicestno@gov.nt.ca
              </a>
            </p>
          </div>
        </div>
      </>
    ),
    proceedHref: serviceRoutes("studentaid").summary,
    action: {
      title: "Apply for Full Time Student Financial Assistance",
      body: (
        <>
          <p>
            Student Financial Assistance (SFA) offers full-time financial assistance to NWT residents attending
            accredited, postsecondary institutions and programs.
          </p>
          <p>
            The purpose of the SFA Program is to help supplement the cost of obtaining a postsecondary education, not to
            cover all expenses.
          </p>
          <p>Full-time assistance is available to students who maintain enrolment during each semester in at least 60% of a 100% full course load.</p>
        </>
      ),
    },
    scopes: [],
    contacts: [
      {
        rows: [
          { icon: "building", lines: ["Student Financial Assistance | Income Security Programs Division | Dept. of Education, Culture and Employment"] },
          { icon: "mailbox", lines: ["P.O. Box 1320", "4501 - 50th Avenue", "Yellowknife, NT X1A 2L9"] },
          {
            icon: "phone",
            lines: [
              <strong key="p" className="font-bold">
                Toll Free/Sans frais: 1-800-661-0793 | Office/Tél: 867-767-9355 | Fax/Télécopieur: 800-661-0893 or 867-873-033
              </strong>,
            ],
          },
          { icon: "envelope", lines: [<a key="m" href="mailto:nwtsfa@gov.nt.ca" className={ADARK}>nwtsfa@gov.nt.ca</a>] },
          { icon: "link", lines: [<a key="i" href="https://www.gov.nt.ca/afe" {...EXT} className={ADARK}>Information</a>] },
        ],
      },
      {
        title: "Contact Information",
        rows: [
          { lines: [<strong key="s" className="font-bold">{SUPPORT_PROMPT}</strong>] },
          { icon: "phone", lines: ["1-833-223-1133"] },
          { icon: "envelope", lines: [<a key="e" href="mailto:eservice_support@gov.nt.ca" className={A}>eservice_support@gov.nt.ca</a>] },
        ],
      },
    ],
    upsell: {
      title: NOA_UPSELL.title,
      badge: NOA_UPSELL.badge,
      body: NOA_UPSELL.body,
      actionLabel: NOA_UPSELL.actionLabel,
      actionHref: NOA_UPSELL.actionHref,
    },
  },
};
