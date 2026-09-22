/**
 * Copy for the public login page — Figma `mygovnl-login-page` 6206:23558
 * (the 2026-09 rebuild; it was 6031:5865). Re-verified against the rebuilt
 * node: every string below is unchanged, including the apostrophe split noted
 * further down.
 *
 * Extracted here rather than inlined in JSX because Task 21 checks every visible
 * string against Figma, and that is far easier against one data file.
 *
 * Copy is character-for-character from Figma. NOTE the apostrophe split:
 * `HeroSection` uses a typographic apostrophe (`Don’t`, U+2019) while every
 * bullet in `ServicesSection` uses a STRAIGHT one (`driver's`, `learner's`,
 * U+0027). That is a real inconsistency in the design file. It is reproduced
 * verbatim, not harmonised — see design/token-exceptions-phase2a.md.
 *
 * The bullets carry their own "•  " prefix (bullet + TWO spaces) because Figma
 * bakes it into the text layer rather than using a list marker. The rendering
 * element therefore needs `whitespace-pre-wrap` to keep the second space.
 */

export type ServiceCategory = {
  /** 18px/24px Bold #004b87 category heading. */
  heading: string;
  /** 14px/22px Regular #5f6368 bullet lines, prefix included. */
  items: readonly string[];
};

/**
 * `ServicesGrid` 6031:5892 — three explicit columns.
 *
 * Modelled as three arrays rather than one auto-flowed list: the columns are
 * 426 / 268 / 350 tall in Figma because they hold different numbers of
 * categories, and auto-flow would not reproduce those breaks.
 */
export const LANDING_SERVICES: readonly (readonly ServiceCategory[])[] = [
  // GridColumn1 6031:5893
  [
    {
      heading: "Drivers", // 6031:5895
      items: [
        "•  Renew your driver's licence",
        "•  Change your address with Motor Registration",
        "•  Get your driving record",
        "•  Take your learner's permit test",
        "•  Pay for your road test",
      ],
    },
    {
      heading: "Organ and tissue donation", // 6031:5908
      items: ["•  Register to become an organ/tissue donor"],
    },
    {
      heading: "Early Learning Gateway", // 6031:5913
      items: [
        "•  Search for a list of regulated child care services",
        "•  Add your child(ren) to a waitlist(s) for regulated child care services",
      ],
    },
  ],
  // GridColumn2 6031:5919
  [
    {
      heading: "Vehicles", // 6031:5921
      items: [
        "•  Renew your vehicle registration",
        "•  Notify Motor Registration when you no longer own a vehicle",
        "•  Request a reprint of your vehicle registration",
      ],
    },
    {
      heading: "Forestry and wildlife", // 6031:5930
      items: [
        "•  Purchase a domestic wood cutting permit",
        "•  Manage your existing domestic wood cutting permit",
      ],
    },
  ],
  // GridColumn3 6031:5936
  [
    {
      heading: "MCP", // 6031:5938
      items: [
        "•  Renew your MCP card",
        "•  Renew your child's MCP card",
        "•  Change your address with MCP",
      ],
    },
    {
      heading: "Personal Health Record", // 6031:5947
      items: [
        "•  View laboratory results and medical imaging records",
        "•  View a list of medications received from your pharmacy",
        "•  Use the Health Library to learn about medical conditions and test results",
        "•  Access mental wellness resources",
      ],
    },
  ],
];

export type FaqItem = {
  /** 16px/1.5 Bold #5f6368 row label. */
  question: string;
  nodeId: string;
};

/**
 * `AccordionContainer` 6031:5959 — three CLOSED rows.
 *
 * The design shows no open state and no expanded panel copy, so there is no
 * `answer` field and the rows are non-interactive. Adding open/close behaviour
 * would invent a design that does not exist and change the 56px row height.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
  { question: "How to create an account", nodeId: "6031:5960" },
  { question: "How to find your services", nodeId: "6031:5964" },
  { question: "How to delete your account", nodeId: "6031:5968" },
];
