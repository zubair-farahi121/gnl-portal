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
 * 16 of 52 assets are now real. The remaining 36 are still placeholders,
 * pending the SharePoint logo folder and Tatyana's "Cards & lists" and
 * "Verification & status" batches.
 *
 * (The totals were stale — they still read "16 of 38" after several batches of
 * screens had been added. Recounted 2026-09-23 with the liveness assets.)
 */
export const ASSETS = {
  /** GNL crest, "Flowers" leaf. Figma I6011:775;6098:62280. */
  gnlCrestFlowers: "/assets/gnl-crest-flowers.svg",
  /** GNL crest, "Newfoundland & Labrador" wordmark leaf. Figma I6011:775;6098:99116. */
  gnlCrestWordmark: "/assets/gnl-crest-wordmark.svg",
  /** MyGovNL nav logo, 112 x 33.645. Figma I6031:6245;6022:2272. */
  mygovnlLogo: "/assets/mygovnl-logo.svg",
  /**
   * MyGovNL login-page header lockup, 293.328 x 74.010. Figma 4002:516.
   *
   * REAL ARTWORK — supplied by the user 2026-09-22, replacing the placeholder.
   * It is the full lockup: the GNL crest ("Newfoundland & Labrador" with the
   * pitcher-plant flowers) on the left, the MyGovNL wordmark on the right.
   *
   * A PNG, not an SVG — 1844 x 472 with a transparent background, which is
   * 6.3x the rendered width, so it downsamples cleanly on any display. "My" is
   * white and "GovNL" is #bebfbf, drawn for the dark #243746 header band; on a
   * white background the "My" disappears, which is correct, not a defect.
   *
   * Its aspect is 3.907 against the box's 3.963 — a 1.4% difference, so the
   * image is rendered `object-contain` at every width rather than stretched.
   * See LoginHeader.
   *
   * NOTE: this is NOT the nav logo. `mygovnlLogo` (112 x 33.645, aspect 3.329)
   * is the MyGovNL wordmark ALONE, with no crest, and is still a placeholder.
   */
  mygovnlHeaderLogo: "/assets/mygovnl-header-logo.png",
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

  /* --- 2026-09-28: StudentAidNL service page (PP-03, 6206:25424) --- */
  /**
   * Contact-card "government building", drawn at 18 x 18. Figma 6206:26687
   * `Icons/Government`. Bootstrap `bank` — a vendored stand-in, NOT the Figma
   * glyph, which is not fetched (see the note in the SVG).
   */
  iconBank: "/assets/icon-bank.svg",
  /**
   * The 24 x 24 lock beside "Action locked" on the StudentAid portal row.
   * Figma 6206:26620 `Lock`. Bootstrap `lock` outline in #5f6368 — a separate
   * file from `iconLock`, which is 12px, white, and a placeholder.
   */
  iconLock24: "/assets/icon-lock-24.svg",
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
  /**
   * `QR code` component instance in the `VRC VC upsell` block on the rebuilt
   * verified service page, 45 x 45 inside a 64px avatar-box (12px inset).
   * Figma 6259:73307 (inside 6257:73252).
   *
   * PLACEHOLDER. Added 2026-09-22 with the 6257:72314 re-sync. The same `QR
   * code` component is instanced once more at 6259:78159, in the mobile
   * counterpart 6097:23625, which this build does not render.
   *
   * NOTE FOR ANYONE READING THIS LATER: this QR is a DIGITAL-WALLET feature
   * ("Skip the paper copy" — add your vehicle registration certificate to your
   * wallet), NOT an identity-verification device hand-off. No mobile-handoff /
   * "continue on my computer" QR exists anywhere in the journey. See
   * design/verification-frame-map.md §5.
   */
  iconQrCode: "/assets/icon-qr-code.svg",

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

  /*
   * --- CID ID-document capture (6087:31396 / 6056:19118 / 6057:20924) ---
   *
   * These three frames are the Yoti/CertifiO vendor screens embedded in the
   * GNL wizard, so their radios are 20px on the Yoti palette rather than the
   * 16px GNL ones above. Both sets are live; neither replaces the other.
   */
  /** `radio-circle`, unselected, 20 x 20. Figma 6098:100406 (and 6087:32277 et al). */
  radioCircle20: "/assets/radio-circle-20.svg",
  /** `Group 7` — the SELECTED radio on the Driver's License row, 20 x 20. Figma 6098:100396. */
  radioCircle20Selected: "/assets/radio-circle-20-selected.svg",
  /**
   * `image 16` — the captured licence FRONT in the camera viewport.
   * Natural size 725.828125 x 450.30224609375. PNG in Figma. Figma 6056:19942.
   */
  idDocFront: "/assets/id-doc-front.svg",
  /**
   * `image 17` — the captured licence BACK in the camera viewport.
   * Natural size 288.001953125 x 181.80224609375. PNG in Figma. Figma 6088:32336.
   */
  idDocBack: "/assets/id-doc-back.svg",

  /*
   * --- The three screens located 2026-09-22 (6217:62059 / 66054 / 66055) ---
   *
   * All six entries below are PLACEHOLDERS: every one is a PNG or an
   * un-exportable crop in Figma, and the Figma host is blocked by this
   * environment's proxy. Each file carries the exact natural dimensions in its
   * own `width`/`height`, so swapping in a real export is a byte replacement
   * with no layout change.
   */
  /**
   * `image 13` — the mobile-handoff QR on CID_Redirect to mobile (6217:62059),
   * 220.4013671875 x 216.981201171875. Figma 6156:60706. PNG in Figma.
   *
   * NOT `iconQrCode`. That one is 45 x 45 (Figma 6259:73307) and belongs to the
   * digital-wallet "Skip the paper copy" upsell on the verified service page —
   * a wallet feature. THIS one is the identity-verification device hand-off:
   * scan it to continue IDV on a phone. Two different codes, two different
   * jobs, two different sizes. Do not merge or overwrite either with the other.
   *
   * The drawn pattern is deterministic noise around three real finder squares.
   * It is not scannable and is not meant to be.
   */
  qrMobileHandoff: "/assets/qr-mobile-handoff.svg",
  /**
   * `chevron-down` in the country select on CID_ID1_Country, 16 x 16.
   * Figma 6076:31358.
   *
   * YOTI-OWNED. Deliberately NOT `iconChevronDown` (Figma 6031:5962), which is
   * the GNL accordion chevron stroked in the GNL body grey #5f6368. This one is
   * stroked `Yoti gris` #546072 to match its own label. Same glyph today, two
   * owners, so two files — either can be re-exported without the other.
   */
  iconChevronDownYoti: "/assets/icon-chevron-down-yoti.svg",
  /**
   * `image 20` — the boxed YOTI wordmark in the `Your privacy and Yoti` card
   * on CID_ID1_Country, 33.701072692871094 x 16. Figma 6087:31390. PNG in Figma.
   *
   * YOTI-OWNED ARTWORK. Rendered `mix-blend-multiply` with the inner image at
   * 80% opacity, exactly as Figma draws it. Do not restyle to the GNL palette.
   */
  yotiBadge: "/assets/yoti-badge.svg",
  /**
   * The three `Guidelines Card` icons on CID_ID1_Front_instruction, 34 x 34
   * each. Figma 6088:32315 / 6088:32320 / 6088:32322.
   *
   * YOTI-OWNED. In Figma these are three crops of ONE pasted screenshot
   * (`Screenshot_20260302_102709_Firefox 5 / 4 / 2`), positioned by negative
   * offsets — they are not clean exports even in the design file. Split into
   * three single-purpose files here so a later real export is a per-icon byte
   * swap. Glyphs match the Figma render: eye, sun, viewfinder.
   */
  iconGuidelineClear: "/assets/icon-guideline-clear.svg",
  iconGuidelineLight: "/assets/icon-guideline-light.svg",
  iconGuidelineFramed: "/assets/icon-guideline-framed.svg",

  /*
   * --- THE LIVENESS CHECK, step 3 of 5 (6217:65268 / 6217:65271) ---
   *
   * Added 2026-09-23 with /cid/liveness/ and /cid/liveness-capture/, the two
   * frames that close the step-3 hole in the CID sub-step counter.
   *
   * All five are PLACEHOLDERS, and for the usual two reasons: every one is a
   * PNG or a negative-offset crop of a pasted screenshot in Figma, and the
   * Figma host is blocked by this environment's proxy. Each file carries the
   * exact rendered leaf dimensions in its own `width`/`height`, so swapping in
   * a real export is a byte replacement with no layout change.
   *
   * ALL FIVE ARE YOTI-OWNED. These two screens are the identity provider's own
   * liveness UI rendered inside GNL chrome: GNL supplies the top nav, wizard
   * header, stepper and footer; Yoti supplies everything below it.
   */
  /**
   * `Screenshot_20260909_103940_Firefox 2` — the "prepare to scan your face"
   * illustration inside `illustration-frame` (6056:13912) on 6217:65268.
   * 345 x 345.63043212890625, the leaf's RENDERED size at the 393 design width.
   * Figma 6076:31212.
   */
  livenessIllustration: "/assets/liveness-illustration.svg",
  /**
   * The three `InstructionRow` icons on 6217:65268, 34 x 34 each.
   * Figma 6076:31228 / 6076:31231 / 6076:31233.
   *
   * In Figma these are three crops of ONE pasted screenshot
   * (`Screenshot_20260909_103945_Firefox 5 / 4 / 2`), positioned by negative
   * offsets — the same arrangement as the `iconGuideline*` trio above, and
   * split into three single-purpose files here for the same reason.
   *
   * DELIBERATELY NOT the `iconGuideline*` files, even though two of the glyphs
   * (sun, eye) are the same shape. Those are cropped from a DIFFERENT pasted
   * screenshot (`Screenshot_20260302_102709_*`) on a different screen and are
   * stroked `Yoti gris` #546072; these render darker, on `Yoti app` #333b40.
   * Two sources, two files — either set can be re-exported without the other.
   */
  iconLivenessLighting: "/assets/icon-liveness-lighting.svg",
  iconLivenessBackground: "/assets/icon-liveness-background.svg",
  iconLivenessEyeLevel: "/assets/icon-liveness-eye-level.svg",
  /**
   * `image 19` — the chevron inside the `Yoti_back` component (6076:31385),
   * instanced as 6217:65270 on 6217:65271. 11.961 x 16.053 — note it is NOT
   * square. PNG in Figma, rendered `object-cover`.
   * Figma 6076:31257.
   *
   * NOT `iconChevronRight` (16 x 16, GNL) and NOT `iconChevronDownYoti` (16 x
   * 16, the country select). This one points LEFT and is its own leaf size.
   */
  iconYotiBack: "/assets/icon-yoti-back.svg",
  /**
   * `Group 6` — the face-position guide over the camera viewport on
   * 6217:65271. Figma 6076:31262.
   *
   * 197.25236 x 267.05634, which is NOT the group's box (193.27098083496094 x
   * 263.057861328125): Figma draws the stroke overflowing by ~2px on each
   * side, so the page places this file at `inset-[-0.76%_-1.03%]` inside a box
   * of the group's own size. Reproduced verbatim — see the file header.
   */
  livenessFaceGuide: "/assets/liveness-face-guide.svg",
} as const;

export type AssetKey = keyof typeof ASSETS;
