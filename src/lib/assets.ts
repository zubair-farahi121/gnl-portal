/**
 * Local asset index.
 *
 * Every entry MUST point at a file committed under `public/assets/`. Figma's
 * MCP asset URLs expire after ~7 days, so a remote URL here would render a
 * blank logo on demo day. The build is grepped for the Figma host for exactly
 * this reason — a hit is a release blocker.
 *
 * NOTE: the Figma host is blocked by this environment's network proxy, so the
 * real exports could not be downloaded. Files still marked PLACEHOLDER below
 * are dimension-exact stand-ins — the outer box and inner leaf geometry are
 * reproduced exactly, so swapping in the real export is a byte replacement
 * with no layout change. See design/token-exceptions.md → "Missing assets".
 *
 * REAL ARTWORK — 2026-09-22. Tatyana confirmed the portal uses Bootstrap
 * Icons and named the exact glyph behind each of the eight "Nav & chrome"
 * entries, so those are now the real thing, taken from the `bootstrap-icons`
 * npm package (MIT) rather than a SharePoint export:
 *
 *   icon-user  person-fill        icon-bell           bell-fill
 *   icon-gear  gear-fill          icon-info           info-circle-fill
 *   icon-home  house-door-fill    icon-mail           envelope-at-fill
 *   icon-phone telephone-fill     icon-external-link  box-arrow-up-right
 *
 * Two deliberate edits to each file, both required by how they are consumed:
 *   - Bootstrap ships `fill="currentColor"`. These render through <img src>,
 *     where `currentColor` has no inherited context and resolves to black, so
 *     the colour is baked in: #bfc4c8 on the dark nav bar, #5f6368 for body
 *     icons, #004b87 for the external-link glyph.
 *   - width/height are set to the Figma leaf size while viewBox stays
 *     "0 0 16 16", so the 16-unit artwork SCALES into a smaller box rather
 *     than being cropped. Only icon-gear needs this (13.190 x 13.261).
 *
 * 16 of 38 assets are now real. The remaining 22 are still placeholders,
 * pending the SharePoint logo folder and Tatyana's "Cards & lists" and
 * "Verification & status" batches.
 */
export const ASSETS = {
  /** GNL crest, "Flowers" leaf. Figma I6011:775;6098:62280. */
  gnlCrestFlowers: "/assets/gnl-crest-flowers.svg",
  /** GNL crest, "Newfoundland & Labrador" wordmark leaf. Figma I6011:775;6098:99116. */
  gnlCrestWordmark: "/assets/gnl-crest-wordmark.svg",
  /** MyGovNL nav logo, 112 x 33.645. Figma I6031:6245;6022:2272. */
  mygovnlLogo: "/assets/mygovnl-logo.svg",
  /** MyGovNL login-page header wordmark, 293.328 x 74.010. Figma 4002:516. */
  mygovnlHeaderLogo: "/assets/mygovnl-header-logo.svg",
  /** Gear, inner group leaf 13.190 x 13.261. Figma I6031:6245;6022:2282;9661:4172. */
  iconGear: "/assets/icon-gear.svg",
  /** User, 16 x 16. Figma I6031:6245;6022:2285. */
  iconUser: "/assets/icon-user.svg",
  /** Bell, 16 x 16. Figma I6031:6245;6022:2289. */
  iconBell: "/assets/icon-bell.svg",
  /** Info, 16 x 16. Figma I6031:6245;6022:2293. */
  iconInfo: "/assets/icon-info.svg",

  /* --- Task 9: login page (6031:5865) --- */
  /** HeroSection background photograph, 1440 x 560, object-cover. Figma 6031:5867. PNG in Figma. */
  heroBackground: "/assets/hero-background.svg",
  /** Password reveal eye, 16 x 16. Figma 6031:5882. */
  iconEye: "/assets/icon-eye.svg",
  /** Accordion chevron, 16 x 16. Figma 6031:5962 / 5966 / 5970. */
  iconChevronDown: "/assets/icon-chevron-down.svg",

  /* --- Task 10: services dashboard (now 6206:23559) --- */
  /**
   * Service-card header chevron, 16 x 16. Figma 6031:5993 et al.
   *
   * The 2026-09 redesign replaced this with the 32px `Chevron` component on
   * every card EXCEPT `service-card-c2-2` (Personal Health Record), which kept
   * this one AND gained the 32px one. Both are rendered there — see
   * design/resync-login-dashboard.md.
   */
  iconChevronRight: "/assets/icon-chevron-right.svg",
  /**
   * `Chevron` component instance in every service-card header, 32 x 32.
   * Figma 6217:35028 et al. The source glyph points DOWN; the design rotates
   * the instance -90deg to point it right, and so does `ServiceCard`.
   */
  iconChevron32: "/assets/icon-chevron-32.svg",
  /** Service-card bullet marker, 5 x 13 (note: NOT square). Figma 6031:5997 et al. */
  bulletMarker: "/assets/bullet-marker.svg",
  /** Unfilled favourite star, 20 x 20. Figma 6031:6006 et al. */
  iconStarOff: "/assets/icon-star-off.svg",
  /** MyGovNL wordmark on the purple footer band, 150 x 45.05972671508789. Figma 6031:6229. */
  mygovnlWordmark: "/assets/mygovnl-wordmark.svg",

  /* --- Task 11: driver-vehicle service page, unverified (6031:6244) --- */
  /** Lock in the "Confirmation required" badge, 12 x 12. Stroked white — it sits on #e8706f. Figma 6031:6253. */
  iconLock: "/assets/icon-lock.svg",
  /** Bell in the 32px #eaecef circle beside the page title, 16 x 16. Figma 6031:6257. */
  iconBellAlert: "/assets/icon-bell-alert.svg",
  /** Filled favourite star in the sidebar favourite-card, 20 x 20. Figma 6031:6268. */
  iconStar: "/assets/icon-star.svg",
  /** "View your address" scope icon, 16 x 16. Figma 6098:34117. */
  iconHome: "/assets/icon-home.svg",
  /** "View your email" scope icon, 16 x 16. Figma 6098:34121. */
  iconMail: "/assets/icon-mail.svg",
  /** "View your first/last name" scope icon, 16 x 16. Used twice. Figma 6098:34125 / 6098:34129. */
  iconUserScope: "/assets/icon-user-scope.svg",
  /** Contact-card phone icon, 16 x 16. Figma 6031:6297. */
  iconPhone: "/assets/icon-phone.svg",
  /**
   * Horizontal rule inside data-privacy-card. Figma draws it as a vector, not a
   * CSS border: a zero-height box with the stroke offset 1px above it. 332 x 1,
   * `preserveAspectRatio="none"` so it stretches to the card's inner width.
   * Figma 6031:6273 / 6031:6292.
   */
  dividerLine: "/assets/divider-line.svg",

  /* --- Task 12: prerequisite check wizard (6031:6304) --- */
  /** Radio, unselected — ring only (radio-inner is hidden="true" in Figma). 16 x 16. Figma 6031:6325. */
  radioUnselected: "/assets/radio-unselected.svg",
  /** Radio, selected — ring plus an 8 x 8 dot inset 4px. 16 x 16. Figma 6031:6338. */
  radioSelected: "/assets/radio-selected.svg",
  /** Verification-list bullet, 4 x 4. Same asset in both option cards. Figma 6031:6331 / 6031:6344. */
  bulletDot: "/assets/bullet-dot.svg",

  /* --- Task 19: driver-vehicle service page, VERIFIED (6065:23367) --- */
  /** "Success_check" in the green `Trusted` badge. Leaf renders 12.135 x 12 inside a 12 x 12 box. Figma 6065:24184. */
  iconSuccessCheck: "/assets/icon-success-check.svg",
  /** "Digital ID" glyph in the digital-wallet promo card, 58 x 58. Figma 6220:86400. */
  iconDigitalId: "/assets/icon-digital-id.svg",
  /** `user` in the driver's-licence linked-item card, 32 x 32. NOT the 16px nav `user`. Figma 6220:86388. */
  iconUserLarge: "/assets/icon-user-32.svg",
  /** `map-pin` in the address linked-item card, 32 x 32. Figma 6076:24370. */
  iconMapPin: "/assets/icon-map-pin.svg",
  /** `truck` in the vehicle linked-item card, 32 x 32. Figma 6076:24381. */
  iconTruck: "/assets/icon-truck.svg",
  /** `circle-x` in the trailer linked-item card, 32 x 32. Figma 6076:24399. */
  iconCircleX: "/assets/icon-circle-x.svg",
  /** `external-link` beside "Book an appointment", 14 x 14. Figma 6076:24352. */
  iconExternalLink: "/assets/icon-external-link.svg",
  /** `Ellipse` red dot in the expired-registration badge, 6 x 6, filled #d32f2f. Figma 6098:34982. */
  iconRedDot: "/assets/icon-red-dot.svg",

  /*
   * --- Tasks 13-16: CID mobile screens (6217:62834 / 62835 / 66058) ---
   *
   * REMOVED 2026-09-22. `stepDotActive` / `stepDotComplete` / `stepDotInactive`
   * (Figma 6056:13968 / 13947 / 13971) backed the six-dot CID stepper rail.
   * Tatyana removed that rail from the mobile frames and replaced it with the
   * `sub-step-readout` pill, which is pure CSS and needs no artwork, so all
   * three entries and their files under public/assets/ are deleted. The
   * designer also crossed them off the outstanding icon request list.
   */
} as const;

export type AssetKey = keyof typeof ASSETS;
