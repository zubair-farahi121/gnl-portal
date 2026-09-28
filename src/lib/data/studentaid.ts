import { ASSETS } from "@/lib/assets";
import type { ScopeItem } from "@/lib/data/driver-vehicle";

/**
 * Content for the StudentAidNL service page — Figma 6206:25424
 * `StudentAidNL-service-page` (PP-03), 1440 x 1469.215 — and its derived
 * Trusted state (PP-23, not in Figma).
 *
 * ADDED 2026-09-28 with Flow B's desktop screens. Everything on PP-03 that is
 * the SAME as Flow A's service page (breadcrumb, badge labels, verification
 * card copy, Data & Privacy body, "Favourite Service", "Terms of Use") is
 * imported from src/lib/data/driver-vehicle.ts rather than repeated — the
 * strings in 6206:25424 are identical to 6031:6244's. This file holds only
 * what PP-03 has and NL-03 does not.
 *
 * Copy is character-for-character from get_metadata / get_design_context on
 * 6206:25424, 6206:26628 (consent-list) and 6206:25474 (contact-card), read
 * 2026-09-28 — and agrees with BUILD_BRIEF.md §9 PP-03 word for word. The one
 * apostrophe, "St. John's", is U+0027 in Figma.
 *
 * NOT FROM FIGMA: the subtitle. 6206:25439 still reads "View and manage your
 * driver and vehicle services" — a copy-paste leftover — and §10.1 replaces it
 * with "View and manage your StudentAidNL services", which is `subtitle` in
 * the service config.
 */

/**
 * One row of PP-03's consent-list. `multiline` marks the two rows Figma lays
 * out differently: `items-start` with a 1.3 line-height instead of `items-center`
 * on `normal` — "View when your email has been verified" (21px) and "View when
 * your phone number has been verified" (42px, two lines at 332px).
 */
export type StudentAidScope = ScopeItem & { multiline?: boolean };

/**
 * consent-list — Figma 6206:26628, 332 x 242, gap 14. SEVEN rows, not Flow A's
 * four (§9: "View your email; View when your email has been verified; View your
 * phone number; View when your phone number has been verified; View your full
 * name; View your first name; View your last name").
 *
 * ICONS ARE THE REPO'S VENDORED BOOTSTRAP GLYPHS, NOT FIGMA'S. Figma draws
 * outline `Envelope`, `Phone_call` and `User` components; figma.com is blocked
 * by this container's egress proxy, so those SVGs cannot be fetched, and the
 * standing rule for this demo is that no Figma asset is downloaded. The three
 * glyphs already used for the same meanings on Flow A's Data & Privacy card
 * (icon-mail, icon-phone, icon-user-scope — Bootstrap Icons, confirmed by
 * Tatyana 2026-09-22) are reused, so the two service pages read as one portal.
 * Logged in DEMO_AUDIT.md.
 *
 * Also used by PP-05's scope list (§9: "Plus the 7 scopes").
 */
export const STUDENTAID_SCOPES: readonly StudentAidScope[] = [
  { label: "View your email", icon: ASSETS.iconMail, nodeId: "6206:26629" },
  {
    label: "View when your email has been verified",
    icon: ASSETS.iconMail,
    nodeId: "6206:26633",
    multiline: true,
  },
  { label: "View your phone number", icon: ASSETS.iconPhone, nodeId: "6206:26637" },
  {
    label: "View when your phone number has been verified",
    icon: ASSETS.iconPhone,
    nodeId: "6206:26641",
    multiline: true,
  },
  { label: "View your full name", icon: ASSETS.iconUserScope, nodeId: "6206:26645" },
  { label: "View your first name", icon: ASSETS.iconUserScope, nodeId: "6206:26649" },
  { label: "View your last name", icon: ASSETS.iconUserScope, nodeId: "6206:26653" },
];

/**
 * contact-card — Figma 6206:25474, 380 x 374. Four rows in `contact-details`
 * 6206:26684, gap 18:
 *
 *   6206:26685  Icons/Government      the division's name, one 3-line paragraph
 *   6206:26689  Dollar sign_envelope  the postal block, five lines, gap 2
 *   6206:26698  Phone_call            1-888-657-0800, Bold #004b87, no underline
 *   6206:26702  Envelope              studentaidenquiry@gov.nl.ca, underlined link
 *
 * THE ADDRESS IS NOT A MAILTO. Figma marks the email `mailto:`; on stage that
 * opens the presenter's mail client over the demo, which is exactly why the
 * Terms screen's `digitalgovernment@gov.nl.ca` is an inert button. Same here:
 * §7.6 / §10.5, out of scope -> toast.
 *
 * THE PHONE NUMBER IS A `tel:` LINK, because Flow A's contact card makes its
 * phone number one (CONTACT_CARD.phoneHref) and the two cards should behave
 * the same way. Figma draws it as bold link-blue text either way.
 */
export const STUDENTAID_CONTACT = {
  title: "Contact Information",
  division: {
    text: "Department of Education and Early Childhood Development Student Financial Services Division",
    nodeId: "6206:26688",
  },
  /** address-lines 6206:26692 — five separate text nodes, in this order. */
  addressLines: [
    { text: "Department of Education and Early Childhood Development", nodeId: "6206:26693" },
    { text: "Student Financial Services Division", nodeId: "6206:26694" },
    { text: "P.O. Box 8700", nodeId: "6206:26695" },
    { text: "St. John's, NL", nodeId: "6206:26696" },
    { text: "A1B 4J6", nodeId: "6206:26697" },
  ],
  phoneLabel: "1-888-657-0800",
  phoneHref: "tel:1-888-657-0800",
  email: "studentaidenquiry@gov.nl.ca",
} as const;

/**
 * studentaid-portal-bar — Figma 6206:26615, 860 x 60, 24px under the
 * verification card. §9 PP-03: "#eeeeee, border #d0d5dd, radius 6;
 * 'Access the StudentAid Portal' (Medium 24 #212326) left; 'Action locked'
 * (Medium 20 #5f6368) + 24 px lock right."
 *
 * PP-23 (Trusted, NOT IN FIGMA): §9 — "The portal row becomes an unlocked white
 * link row: #004b87 label + external-link icon, no 'Action locked'. … the row
 * shows the toast." Same label; only the state changes.
 */
export const STUDENTAID_PORTAL_ROW = {
  label: "Access the StudentAid Portal",
  lockedLabel: "Action locked",
  nodeId: "6206:26615",
} as const;
