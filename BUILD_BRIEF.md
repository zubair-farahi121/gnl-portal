# Build brief: GNL demo, CertifiO ID identity verification inside C1 (MyGovNL)

**From:** Zubair Farahi · **Written:** 22 Sep 2026
**Internal dry run:** Tuesday 29 Sep 2026, 4:00 PM · **Target:** code complete Monday 28 Sep 2026

> Saved verbatim into the repo 2026-09-23 so every agent works from one spec.
> Referenced elsewhere as "the brief". Section numbers below are authoritative.

## 0. The job

Two big parts are missing from the clickable demo:
1. **The CertifiO ID identity-verification session** — QR hand-off, consents, Yoti face scan, ID document capture, result.
2. **The second flow**, non-residents verifying with a **passport** (StudentAidNL).

Connect every screen of the Figma page **"CerifiO ID integration"** into one realistic end-to-end demo with mock data, both flows, desktop and mobile. For each existing screen choose: **KEEP** (matches — do not touch), **IMPROVE** (fix only the listed differences), **BUILD** (missing).

## 1. Step 1: audit before you code (required)

1. Explore the repo: stack, router, styling, components, assets, routes, state.
2. For every screen in Appendix A compare the running app against the Figma node and the reference PNG in `design-reference/screens/`, at **1440 px** and **393 px**.
3. Create `DEMO_AUDIT.md`: `ID | Screen / feature | Route in app | KEEP / IMPROVE / BUILD | Gaps found | Fix done`. Include the cross-cutting items from section 4.
4. Rules: a KEEP screen must not be refactored or restyled; an IMPROVE screen gets only its listed gaps fixed; build every BUILD item; re-check all KEEP screens at the end.
5. Fill in "Fix done". Add **"Open questions for André / Tatyana"** (10.7).

## 2. Context

Customer: Government of Newfoundland and Labrador. Portal **MyGovNL** on Portage's **C1 (CitizenOne)**.
Problem (Figma frame "Context"): people *without* an NL driver's licence or MCP health card — students, new residents — cannot onboard. Large senior population, many MFA support calls.
Proposal: plug **CertifiO ID** (Portage IDV) into C1 onboarding at the "Prerequisite Check" step. Inside it, face scan and document capture are an embedded **Yoti** widget. First use case of Portage's "trust platform".
- **Flow A** — NL resident, **driver's licence**, onboarding **Driver and Vehicle**.
- **Flow B** — non-resident, **passport**, onboarding **StudentAidNL**. PM: "basically the same flow".

It is a **demo, not an integration**: fake data, mocked IDV provider, no real CertifiO ID / Yoti / C1 calls. Must still feel real. **No dead ends** — presented live and the link may be shared. Polish over breadth.

## 3. Sources of truth, in priority order

1. **Figma "C1 | GNL - R3", page "CerifiO ID integration"** (spelled that way). Sections: "NL residents: Driver's License - Integrating IDV into C1" = Flow A; "Non-residents: Passport - Integrating IDV into C1" = Flow B; frame "Context" = business context. Node IDs in Appendix A are real.
2. **This brief**, including the deliberate changes in section 10.
3. **Figma page "Current design"** — March 2024 screenshots of today's MyGovNL. Use for existing C1 patterns (form layout, validation messages, headers, footers). **Not the flow spec.**
4. **`design-reference/`** (repo root): `screens/` (PNG per screen, 1x, flow order, prefixed with the IDs here), `assets/logos/`, `assets/idv/`, `copydeck.txt` (exact text of new screens), `README.md`. **If Figma and a PNG differ, Figma wins.**

Do not use as spec: pages "Exploration", "Inspiration", "VC flows", "Internal Only Canvas".

**Obsolete:** `CID_Welcome` (6217:62833) and the old **dot stepper**; the old tall verified page **6065:23367** (use **6257:72314**); the name `gnl-vc-login-loading` (now **`Provider page_IDV results status`**).

## 4. What probably exists already (verify every item)

| Item | Expected | Check |
|---|---|---|
| Login (NL-01) | KEEP | 8.1 checks. "Log in" works with empty fields. |
| Dashboard (NL-02) | KEEP + IMPROVE | StudentAidNL card clickable. Masonry per 7.2. |
| Driver and Vehicle, pre-verification (NL-03) | KEEP | Badge, bell, sidebar, "Onboard". |
| Summary / Terms / Confirm Required (NL-04..06) | KEEP | Copy, progress %, Cancel/Back, terms checkbox rule. |
| Choose verification service (NL-07) | KEEP or IMPROVE | GNL IDV default. **Continue must lead to NL-08.** |
| Old CertifiO ID mobile screens | IMPROVE | Drop `CID_Welcome`; dot stepper -> sub-step pill (11.6). |
| "We've received your information" (NL-21) | KEEP | Async message, no spinner. Add auto-advance (8.3). |
| Success / Ready to Use (NL-23) | KEEP | CTA opens NL-25. |
| Trusted page (NL-25, NL-26) | IMPROVE | Match 6257:72314 (1440x1793), not the 1820 version. |
| Responsive layout | KEEP | PM said keep the existing responsive CSS. |
| **Footer floats up on short pages** | IMPROVE | Sticky footer everywhere (7.7). |
| **Logos and icons placeholders** | IMPROVE | Use `design-reference/assets/` + icon map 11.8, unless final SVGs exist. |
| **CertifiO ID session (NL-08..NL-20)** | **BUILD** | PM: "the central piece". 8.2. |
| **Confirm some details Confirmed (NL-22)** | **BUILD** | 8.3. |
| **Flow B (PP-03..PP-22 + Trusted)** | **BUILD** | Section 9. |
| State persistence, reset, no dead ends | BUILD/IMPROVE | 7.5, 7.6, 12. |
| Face-scan and capture animation | BUILD (P1) | PM: "nice to have". Section 13. |

## 5. End-to-end flow

Login -> Dashboard -> (Driver and Vehicle | StudentAidNL) service page -> Onboard -> Summary -> Terms -> Confirm some details (Required) -> Choose verification service -> [Flow B only: Other verification] -> Continue on a smartphone (QR) -> **CertifiO ID session** -> We've received your information -> Confirm some details (Confirmed) -> Ready to Use -> Service page (Trusted).

CertifiO ID session, mobile first:
`1 Terms of use` -> `2 Biometric consent` -> `3 Prepare to scan your face` -> `3 Position your face` -> `4 Country of issuance` -> `4 Accepted documents` -> `4 Photo instructions` -> `4 Capture front` -> [licence only: `4 Capture back`] -> `5 Your identity has been verified`.

### Two devices, one story
Desktop shows the QR (NL-08); the user continues on the phone (NL-09..NL-20). When the phone submits, the desktop switches to NL-21, then NL-22, NL-23, NL-25. The phone can also finish alone: step 5 -> mobile Confirmed -> NL-24 -> NL-26.

| Mode | Priority | How |
|---|---|---|
| Same device | P0 | "Continue on my computer" runs the steps in the same tab. |
| Phone view window | P1 | Clicking the QR opens the phone steps in a ~400x860 window; the desktop listens and advances itself. Best for a live demo on one laptop. |
| Real phone | P2 | QR opens the demo on a real phone. Needs the tiny mock server (12.4). |

Provider sequence: `createSession(serviceId)` -> `sessionId + handoffUrl` (the QR) -> phone opens it (`opened`) -> consents / liveness / document -> `submit` (`submitted`) -> desktop shows NL-21 -> `verified` -> phone shows step 5, and the desktop goes to NL-22 after at least 3 s.

## 6. Routes

Suggestions. **If the app already has a path for a screen, keep the existing one.**

Login `/login` · Dashboard `/services` · Service page `/services/:serviceId` (`driver-vehicle` | `studentaid`, Confirmation required or Trusted from state) · Summary `/services/:serviceId/onboarding/summary` · Terms `.../terms` · Confirm Required `.../prerequisites` · Choose method `.../prerequisites/method` · Other verification `.../prerequisites/other` (Flow B) · QR hand-off `.../prerequisites/handoff` · CertifiO ID steps `/idv/:sessionId/{terms,biometric-consent,liveness,liveness/scan,document,document/type,document/front,document/front/capture,document/back/capture,verified}` · Processing `.../prerequisites/processing` · Confirmed `.../prerequisites/confirmed` · Ready `.../ready` · Reset `/reset`.

## 7. Global behaviour

**7.1 Login / logout.** "Log in" -> `/services` with any input including empty; no validation errors. "Forgot password?" / "Create account" -> toast. Header **Log Out** -> `/login`, **keeps** onboarding progress; only "Reset demo" clears everything.

**7.2 Dashboard cards.** 3 masonry columns, not a row grid. Col 1: Accessible parking permit, Early Learning Gateway, MyHealthNL, Tickets and fines. Col 2: Domestic wood cutting permits, Learner's permit and off-road vehicle tests (title truncated to 1 line with ellipsis), Personal Health Record. Col 3: Driver and Vehicle, MCP, StudentAidNL. Only **Driver and Vehicle** and **StudentAidNL** work; for those the whole card is clickable. The other 8 keep the same look (do not grey them out) and show the toast. P2: favourite star toggles into "Favourite Services"; search filters client-side.

**7.3 Header nav.** Services -> `/services`. Account / Notifications / Contact Us -> toast (P2: light pages copying "Current design"). Mobile header: logo + "Log Out" on row 1, links centred on two rows below.

**7.4 Wizard rules.** Steps: Summary 25 %, Terms and Conditions 50 %, Prerequisite Check 75 %, Ready to Use 100 %. Prerequisite Check covers all prerequisite sub-pages **and all CertifiO ID pages**. Active label Bold #212326, others Medium #5f6368. Cancel -> service page, onboarding resets to not started unless already onboarded. Back -> previous page. "I Do Not Consent" -> service page. Terms: checkbox "I have read and accept terms and condition" must be ticked; otherwise show red text under it: "To continue, you must agree to the terms and conditions." Method page: GNL IDV selected by default, whole card is the click target, arrow keys move between options.

**7.5 State.** One store persisted in `localStorage` under `gnl-demo:v1`. Survives refresh; syncs across tabs and windows (`BroadcastChannel` + `storage`). `/reset` and the presenter controls clear it.

**7.6 Guards, no dead ends.** Every route renders from state. A step opened without its state redirects to that service page. `/idv/:sessionId/...` for an unknown session creates a new session. Unknown routes -> friendly 404 with "← Back to Services". Nothing may do nothing; out of scope -> toast.

**7.7 Responsive.** Reference 1440 and 393; test 1440, 1024, 768, 393, 360. **Sticky footer** everywhere: header, `main` with `flex: 1`, footer, in a `min-height: 100vh` column. CertifiO ID pages are mobile first; on desktop centre content in a ~480 px column under the desktop header, footer full width. Service pages: desktop 860 px main + 380 px sidebar, 40 px gap; mobile stacks main then sidebar (NL-26).

**7.8 Accessibility.** Semantic landmarks. Every input labelled, every icon button named. Visible focus ring, full keyboard operation. Alt text ("Sample driver's licence, front"). WCAG AA contrast. `aria-live="polite"` on NL-08 and NL-21. Respect `prefers-reduced-motion`.

## 8. Flow A: Driver and Vehicle

### 8.1 Before the ID session

**NL-01 Login — 6206:23558 — KEEP.** Header 128 px #243746, combined logo `gnl-mygovnl-header-logo.png` (293x74) centred. Hero 560 px, `login-hero-background.png`, overlay #7a8690 at 35 %. Card 440 px white radius 6 shadow `0 4px 16px rgba(0,0,0,.10)` padding 32 gap 24: "Welcome to MyGovNL QA" (Bold 22); "Don't have an account? Create account"; "Email Address" / "Password" (Bold 14) with 40 px inputs, border #d4d8da, radius 6, eye icon; "Forgot password?" (Bold 14 underlined); full-width "Log in" (#263854, radius 4, Bold 14, white). Below hero: "Things you can do here" (Bold 28 #5f6368), category titles Bold 18 #004b87, bullets, 3 columns; "How can we help?" with 3 accordions; footer.

**NL-02 Dashboard — 6206:23559 — KEEP + IMPROVE.** Welcome section, bottom border #d4d8da, padding 48/120. "Welcome Jason Momoa!" Bold 40/60. Search 340x56 + "Search" (#243746, radius 4). "Favourite Services" (Bold 28) + helper 16/22. "All Services" (Bold 28) + masonry (7.2). Cards white, 1 px #d4d8da, radius 6, padding 16; title Bold 28 link #004b87 underlined; 32 px chevron #004b87; bullets Regular 16; outline star bottom right. Purple band #512d6d with `mygovnl-wordmark-white` and a white "Tell us what you think"; then grey footer.

**NL-03 Service page, pre-verification — 6031:6244 — KEEP.** "← Back to Services" (Bold 14 #004b87 underlined). Title "Driver and Vehicle" (Bold 32/48 #212326); pill "Confirmation required" (#e8706f, radius 100, white Bold 12, lock 12, padding 6/12); bell in a 32 px #eaecef circle. Subtitle "View and manage your driver and vehicle services" (16). Verification card padding 48, radius 6, border #d4d8da, shadow `0 2px 8px rgba(0,0,0,.03)`, centred: "To Use This Service We Need to Verify It Is You" (Bold 24); 'Once you click the "Onboard" button you will be directed to the verification process which involves providing some information about yourself.' (16/24 #5f6368); "Onboard" (#243746, radius 4, Bold 16, white, padding 10/28) -> NL-04.
Sidebar 380 px gap 20: "Favourite Service" with a star. "Data & Privacy" — Bold 18 title; 16/22 "At any time, you can change your preferences and remove consent for your personal details to be shared with this service. By doing so you will no longer be able to use the service. Removing consent will stop new data from being shared from your profile. However, previously shared data will continue to be stored within the service."; divider; "This service receives the following data from your profile:" (Bold 14); scopes with 16 px icons — View your address, View your email, View your first name, View your last name; divider; "Terms of Use". "Contact Information" with a phone icon and "1-877-636-6867".

**NL-04 Summary — KEEP.** "Driver and Vehicle"; "Welcome to Driver and Vehicle"; "Here is what you'll need and what to expect when onboarding this service. Note: you may opt out of service onboarding at any time."; "1. Terms and Conditions: Read and accept our Terms and Conditions to understand your rights and our commitment to your privacy."; "2. Verification: Before providing access to the service we need to verify it is you. Have your information ready for this quick check."; "3. Notification Settings: Choose your preferred method of communication to receive important alerts and updates." Buttons Cancel, Continue. The wizard has 4 steps; there is **no** Notification Settings step in this demo.

**NL-05 Terms and Conditions — KEEP.** "Terms and Conditions", "Driver and Vehicle Services", "Last modified: 2025-04-29", "Version 4". Scrollable consent: "I consent to Government of Newfoundland and Labrador checking the information that I provide against the Motor Registration Division's system to make sure that I am who I say I am, validate my access to new services as they become available in MyGovNL, and receive personalized notifications regarding my upcoming renewals. For any questions related to how your information is being handled, please contact digitalgovernment@gov.nl.ca". Then "By Accepting This Policy You're Allowing To:" + the 4 scopes with icons. Checkbox "I have read and accept terms and condition". Buttons Cancel, Back, "I Consent", link "I Do Not Consent" (rules 7.4).

**NL-06 Confirm Some Details: Required — KEEP or BUILD as a reusable component.** "Confirm Some Details"; "To onboard to Driver and Vehicle, you need to confirm it is you by providing the following information:"; row "Must have a valid driver's license" + "**Required**" red #d32f2f. Buttons Cancel, Back, Continue -> NL-07. **One component, two states** (Required NL-06 / Confirmed NL-22).

**NL-07 Choose verification service — 6031:6304 — KEEP or IMPROVE.** Card 820 px, padding 40, gap 32, radius 6, border #e0e4e6, shadow `0 4px 24px rgba(0,0,0,.03)`. Title "Driver and Vehicle" (Bold 28), progress 75 %. "Services" (Bold 36/54); "The following services will help us to confirm it is you:" (16). Two radio cards 740 px, padding 24, radius 6, border #d4d8da, gap 24: "Motor Registration Division (MRD)" unselected (ring #081010 at 70 %, title Bold 18 #5f6368); "**GNL Identity Verification Service**" **selected by default** (ring #004b87 + 8 px dot, title Bold 18 #004b87). Each has "This verification service is able to verify:" + bullet "Must have a valid driver's license" and a 72x36 GNL crest on the right. Buttons Cancel (SemiBold 16 link), Back (outline), Continue (primary). Continue: GNL IDV -> create session -> **NL-08**; MRD (P2) -> MRD details form ("Your details": Driver's licence/photo ID number, Expiry date Year/Month/Day, Last name, Postal code; Cancel / Confirm) -> NL-22, or without the form -> NL-22 after a 1 s button loading state.

### 8.2 CertifiO ID session — BUILD (the central piece)

**NL-08 Continue on a smartphone — 6217:62059 — BUILD.** Desktop header and footer. Card 824 px, padding 40, radius 6, border #e0e4e6, shadow as NL-07. **No progress bar.** In order: "Continue on a smartphone" (Lato **Regular 40/60** #212326); "For an optimal experience, we recommend continuing your identity verification on a smartphone."; "Although the process is also accessible from a computer, the mobile interface is specially designed to simplify the steps and speed up validation."; "Scan the QR code to continue on a smartphone."; QR 220x217 centred, **generated** from the hand-off URL (`qr-code-demo.png` is only a visual reference); "Your progress will be automatically saved and transferred."; "Continue on my computer" (Bold 16 link #004b87 underlined, centred).
Behaviour: on mount create or reuse the session. **Clicking the QR** is a presenter shortcut: `window.open(handoffUrl, 'gnl-phone', 'width=400,height=860')`. "Continue on my computer" opens `/idv/:id/terms` in the same tab. Listen to the session; `submitted` or later -> **NL-21**. Optional subtle `aria-live` line: "Waiting for your phone…" -> "Continuing on your phone…" (deviation, list in 10).

**Shared layout for NL-09..NL-20, at 393 px, top to bottom:**
1. MyGovNL mobile header — #2b3a4e, 145 px; row 1 logo (`mygovnl-logo-white`) + "Log Out"; links centred on two rows below.
2. Wizard header — service title (Bold 24/36 #212326; "StudentAidNL" in Flow B); progress bar 8 px radius 4, track #e9ebf0, fill #243746 at 75 %; step labels Medium 12 with "Prerequisite Check" Bold #212326; **sub-step pill** — background #e9ebf0 at 50 %, radius 16, padding 4/8, Regular 12, #5f6368, text `<sub-step name> • step N of 5`.
3. Page content, 16 px side padding.
4. Mobile footer (11.5).

The **Yoti zone** (11.9) starts **below the pill** and ends **above the footer**, on NL-11..NL-19.

**NL-09 Terms of use (step 1) — 6217:62834.** Pill "Terms of use • step 1 of 5". Heading "Terms of use" (Bold 32/48). Text (16/24 #5f6368): "Your identity documents will be used only to verify your identity and will be deleted after verification." Link "Terms of Use" -> toast. Two **outline** buttons side by side (177x39, border 1 px #243746, radius 6, Bold 16, #243746): "I do not agree" and "I agree" — both outline in Figma, do not make "I agree" filled. "I agree" -> NL-10; "I do not agree" cancels the session -> NL-07.

**NL-10 Biometric consent (step 2) — 6217:62835.** Pill "Biometric consent • step 2 of 5". Heading "Biometric consent". Text: "A photo or video of your face will be used to verify your identity. It will be deleted after the verification process is complete." Same link and two outline buttons. "I agree" -> NL-11.

**NL-11 Prepare to scan your face (step 3, Yoti) — 6217:65268 — BUILD.** Pill "Liveness check • step 3 of 5". Heading "Prepare to scan your face" (Montserrat Bold 32 #333b40). Illustration `face-scan-illustration.png` (345x346, radius 16). Three tips, ~32 px line icon each, Montserrat Medium 14 (1.4, #546072): sun — "Find a well-lit area with a clear background"; face — "Be aware that your upper body and background will be visible"; eye — "Hold your phone at eye level". Full-width Yoti "Continue" -> NL-12.

**NL-12 Position your face (step 3, Yoti) — 6217:65271 — BUILD.** "‹ Back" (Montserrat Bold 14 #546072) -> NL-11. Camera area 345x522, background #e9ebe8; white instruction chip at the top (radius 8, padding 8, Montserrat Bold 14 #546072): "Position your face within the frame."; `face-outline.svg` centred. "Continue" -> NL-13. P1: face-scan animation (13.1), auto-advance.

**NL-13 Country of issuance (step 4, Yoti) — 6217:66054 — BUILD.** Pill "ID document selection • step 4 of 5". Heading "Select the type of identity document you want to add" (Montserrat Bold 22 #333b40). Text (Montserrat SemiBold 14, 1.4): "You will need to take a photo of your identity document at the next step. We will ask you to activate camera access for this." Select placeholder "Select the country of issuance" (Montserrat Regular 16 #546072, border #d1d5db, radius 8, chevron-down); Canada first; nothing selected -> Continue uses Canada. Panel #f3f4f6 radius 8 padding 16: "Your privacy and Yoti" (Montserrat Bold 16 #546072); "Review the information below to learn more about this process and how Yoti uses and securely handles the information you provide." (Regular 13, 1.4); footer row "Privacy Policy" (Bold 13 #27619b underlined -> toast) left, "Powered by" (Bold 11) + `yoti-logo.png` right. "Continue" -> NL-14.

**NL-14 Accepted documents (step 4, Yoti) — 6087:31396 — BUILD.** Heading "Accepted documents:" (Montserrat Bold 22). Radio rows 361 px, 10 px gap, white, border 1 px #d1d5db, radius 8, padding 16, Montserrat SemiBold 16 #546072: Passport; Indian Status Card (SCIS) with sub-line "Issued on or after 01/2010" (Regular 12 #4b5563); Permanent Resident Card; NEXUS Card; Provincial or Territorial Identity Document; Health Insurance Card; Driver's License. Selected row: **2 px #27619b** border + filled radio. **Flow A default: Driver's License.** "Continue" -> NL-15.

**NL-15 Photo instructions, front (step 4, Yoti) — 6217:66055 — BUILD.** Heading "Prepare to take a photo of your identity document (front)" (Montserrat Bold 22). Text: "We will try to get a clearer image this time using your phone camera." (Regular 14/20 #4b5563). "Don't forget:" card (#f3f4f6, radius 8, padding 16; title Bold 15; items SemiBold 13/18, 20 px icon): eye — "Make sure the information is clear and nothing is obscured"; sun — "Find a well-lit area"; frame — "Make sure the document is properly framed". "Continue" -> NL-16.

**NL-16 / NL-17 Capture front — 6217:66056 (empty) / 6056:19118 (captured) — BUILD.** Heading "Capture ID document (front)" (Montserrat Bold 32 #333b40). Camera area 361x400, light grey, four dark corner brackets. Captured shows `id-nl-drivers-licence-front.png` (329x204, radius 2). "Continue": empty -> captured (P1 animation 13.2) -> NL-18.

**NL-18 / NL-19 Capture back — 6217:66057 / 6057:20924 — BUILD.** Same with "Capture ID document (back)" and `id-nl-drivers-licence-back.png`. "Continue" on the captured back: ~1.5 s spinner in the button, session `submitted` then `verified`, -> NL-20.

**NL-20 Identity verified (step 5) — 6217:66058.** Pill "Identity verified • step 5 of 5". Heading "Your identity has been verified" (Bold 32/48). Text (14/21 #5f6368): "You can now securely access Driver and Vehicle services and complete transactions online." "Available services include" + bullets: licence and registration renewals; address changes; driving record purchases; road test payments, and more. Two stacked full-width buttons: primary "Continue to Driver and Vehicle service" (#243746, 37 px, Bold 14); outline "Log out" (39 px). Same-device: Continue -> NL-21. Phone view / real phone: Continue -> mobile Confirmed -> NL-24 -> NL-26.

### 8.3 After the ID session

**NL-21 We've received your information — 6217:80871 — KEEP + auto-advance.** "We've received your information" (Lato Regular 40/60); "Your identity verification is now being processed. Depending on your request, this can take anywhere from a few minutes to longer."; "You don't need to stay on this page. We'll let you know as soon as it's ready."; "You can close this window."; "Your progress will be automatically saved and transferred." No buttons. When `verified`, stay at least `processingMinMs` (3 s), then -> NL-22 with the toast "Identity verification complete".

**NL-22 Confirm some details: Confirmed — 6217:81644 — BUILD (NL-06 component, Confirmed state).** "Confirm some details" (Bold 36); "To onboard to Driver and Vehicle, you need to confirm it's you by providing the following information:"; row "Must have a valid driver's license" (SemiBold 16 #212326) + "**Confirmed**" (SemiBold 16 **#198754**). Buttons Cancel, Back, Continue. Continue -> NL-23. Back -> NL-07 keeping the verified result; Continue on NL-07 again goes straight back to NL-22.

**NL-23 Ready to Use: Success! — 6217:82446 — KEEP.** Progress 100 %. "Success!" and "Service has been successfully onboarded, and it's ready to be used." Buttons Back (outline) and "Go to Service Driver's License Renewal" (primary). On open, mark the service **onboarded**. CTA -> NL-25.

**NL-24 Success, mobile — 6102:103451.** Same content; buttons full width stacked, primary first then "Back".

**NL-25 Service page: Trusted — 6257:72314 (1440x1793) — IMPROVE to this exact frame.** Badge "✓ Trusted" (#45ab8e, white check 12 px, Bold 12). Actions card (padding 32, radius 6, border #d4d8da): "Actions" (ExtraBold 24 #5f6368); two columns — Driver: Renew your driver's licence; Change your address with Motor Registration; Purchase your driving record (abstract); Pay for your road test. Vehicle: Renew your vehicle registration; Notify Motor Registration when you no longer own a vehicle; Request a reprint of your vehicle registration; Complete your vehicle ownership transfer. Links SemiBold 15 #004b87 underlined. Divider, then "Other": "Book an appointment" + external-link icon.
"Your linked items" (ExtraBold 22 #004b87); cards padding 24, radius 6, border #d4d8da, 64 px icon box:
1. Driver's licence — IAN B GARLAND / G470114011 / Expires on January 14, 2026 + "View demerit points" (outline).
2. Address — 15 PRINCESS ANNE PL + "Update" (primary).
3. 2015 CHEV IMT — Plate JKM 026 • VIN 2G1125535F9268441 / Expires on January 14, 2036. Buttons Renew (primary), "No longer have?", "Lost your registration?" (outline). **Wallet upsell** #e9ecef radius 6: QR icon, "Skip the paper copy" (Bold 14 #004b87), "New" pill (#004b87, white Bold 12, radius 4), "Add your verified vehicle registration certificate to your wallet. Show proof instantly from your phone.", "Add to wallet" (primary).
4. 0 UTILITY TRAILER — circle-x icon, Plate TDH 578 • VIN HM00000000036027, red pill "Expired on March 31, 2022" (bg #fdf2f2, text #d32f2f, Bold 12, radius 4), same three buttons.
Sidebar as NL-03. **No tabs.** All action links and item buttons show the toast, including "Add to wallet".

**NL-26 Trusted, mobile — 6097:23625.** Stacked as in Figma. **Same data as desktop** (10.2).

## 9. Flow B: StudentAidNL (non-resident, passport)

Reuse every Flow A component; differences live in the service config (12.1).

**PP-03 StudentAidNL service page — 6206:25424 — BUILD.** As NL-03, title "StudentAidNL", badge and bell, subtitle per 10.1. Below the verification card a locked row: 860x60, #eeeeee, border #d0d5dd, radius 6; "Access the StudentAid Portal" (Medium 24 #212326) left; "Action locked" (Medium 20 #5f6368) + 24 px lock right.
Sidebar scopes: View your email; View when your email has been verified; View your phone number; View when your phone number has been verified; View your full name; View your first name; View your last name. Then "Terms of Use".
Contact: building icon + "Department of Education and Early Childhood Development Student Financial Services Division"; postal block — Department of Education and Early Childhood Development / Student Financial Services Division / P.O. Box 8700 / St. John's, NL / A1B 4J6; phone "1-888-657-0800"; "studentaidenquiry@gov.nl.ca".

**PP-04 Summary.** As NL-04 with "Welcome to StudentAidNL".

**PP-05 Terms.** "StudentAidNL", "Last modified: 2026-08-26", "Version 7". Consent: "I hereby consent to the Government of Newfoundland and Labrador collecting, using, and verifying the information I provide by comparing it with records maintained by the Motor Registration Division and the Medical Care Plan (MCP). This verification is conducted for the purposes of confirming my identity and delivering personalized notifications where required. Any questions regarding the collection, use, or handling of my personal information may be directed to digitalgovernment@gov.nl.ca." Plus the 7 scopes.

**PP-06 Confirm Required — 6206:27501 is a cropped screenshot; build with the NL-06 component.** "To onboard to StudentAidNL, you need to confirm it is you by providing the following information:"; requirement "Must have a valid driver license, health card, or have neither because out of province", **Required**.

**PP-07 Choose verification service — 6206:27601 — 3 cards.** Medical Care Plan (MCP) and GNL IDV both verify "Must have a valid driver's license, health card, or have neither because out of province"; MRD verifies "Must have a valid driver's license". **GNL IDV selected by default.** Continue: GNL IDV -> PP-08; MCP (P2) -> MCP form (MCP Number, Valid Date, Expiry Date, Last name) -> PP-21; MRD -> as Flow A.

**PP-08 Other verification — 6217:35183.** Heading "Other verification" (Bold 36). Pre-checked radio "This option is for users who do not have a valid MCP number or MRD-issued ID.", below it "By continuing, you confirm that this applies to you." Buttons Back and Continue (no Cancel). Continue -> PP-09.

**PP-09..PP-19.** As NL-08..NL-20 with: wizard title **"StudentAidNL"**; accepted documents defaults to **Passport** (PP-15, 6217:66072); capture heading **"Capture ID document"** without "(front)" (PP-17, 6217:76798); captured image `id-canadian-passport.png` (274x384 portrait; PP-18, 6217:66154); **no back capture**; step 5 (PP-19) uses the 10.1 copy.

**PP-20..PP-22.** PP-20 as NL-21. PP-21 (6217:80071): "To onboard to StudentAidNL, you need to confirm it's you by providing the following information:" and "Must have a valid driver's license, health card, or have neither because out of province." **Confirmed**. PP-22 Success with "**Go to Service StudentAidNL**".

**PP-23 StudentAidNL Trusted (not in Figma; derive).** PP-03 layout, badge "✓ Trusted", no verification card. The portal row becomes an unlocked white link row: #004b87 label + external-link icon, no "Action locked". Sidebar unchanged; the row shows the toast.

## 10. Deliberate changes from Figma (list each in DEMO_AUDIT.md)

**10.1 Flow B copy fixes.** Service subtitle -> "View and manage your StudentAidNL services". Step 5 -> "You can now securely access StudentAidNL services and complete transactions online."; bullets Apply for student financial assistance; Check your application status; Receive messages about your application; Download tax documents; button "Continue to StudentAidNL service". Passport capture heading -> "Capture ID document" on both states.

**10.2 One mock data source.** NL-26 shows different data from NL-25 (JANE GARLAND / C4T614511 / Expired on September 30, 2026 vs IAN B GARLAND / G470114011 / Expired on March 31, 2022). **Use the desktop values at all sizes.**

**10.3 Real QR code** encoding the hand-off URL, 220x217.

**10.4 Sub-step pill** replaces the dot stepper on every CertifiO ID page.

**10.5 Non-demo links** show a short toast, "Not part of this demo".

**10.6 Small additions (subtle).** "Identity verification complete" toast on NL-22; loading state on the last capture Continue; optional waiting line on NL-08; a small "Demo — fictitious data" note in the footer; hidden presenter controls (13.3).

**10.7 Keep as in Figma but record in the persona file and list under Open questions.** "Welcome Jason Momoa!" vs licence holder "IAN B GARLAND"; "Expires on January 14, 2026" already past; specimen IDs show "MICHAEL R. HOWARD" and "SARAH MARTIN". Do not change without approval; each is a one-line change in the persona file.

## 11. Design tokens and shared components

**11.1 Fonts.** **Lato** 400/500/600/700/800 for all MyGovNL / C1 UI. **Montserrat** 400/500/600/700 **only inside the Yoti zone**. Self-host both so the demo works offline.

**11.2 Colours.** nav-bg #2b3a4e · login-header-bg #243746 · primary #243746 · login-button #263854 · link #004b87 · heading #212326 · text #5f6368 · border #d4d8da · border-wizard #e0e4e6 · divider #eaecef · track #e9ebf0 · badge-required #e8706f · badge-trusted #45ab8e · success #198754 · danger #d32f2f · danger-bg #fdf2f2 · upsell-bg #e9ecef · locked-bg #eeeeee (border #d0d5dd) · footer-bg #64717c (text white, links #e0e4e6) · band-purple #512d6d · hero-overlay #7a8690 at 35 % · yoti-cta #27619b · yoti-text #333b40 · yoti-text-2 #546072 · yoti-muted #4b5563 · yoti-panel #f3f4f6 · yoti-border #d1d5db · yoti-camera #e9ebe8.

**11.3 Type scale (Lato unless noted).** Dashboard welcome 40/60 Bold · hand-off and processing heading 40/60 **Regular** · service page title 32/48 Bold · wizard step heading 36/54 Bold · section title 28/42 Bold · dashboard card title 28 Bold underlined #004b87 · card heading 24/36 Bold · mobile wizard title 24/36 Bold · mobile CertifiO ID heading 32/48 Bold · body 16/24 Regular · small 14/21 · labels, pills, badges 12/18 · header nav Medium 15 white · footer 12/24.

**11.4 Radii, shadows, spacing.** Radius: card 6, primary button 4, outline button 6, pill 16, badge 100, Yoti rows 8, Yoti buttons 4. Shadows: service cards `0 2px 8px rgba(0,0,0,.03)`; wizard and hand-off cards `0 4px 24px rgba(0,0,0,.03)`; login card `0 4px 16px rgba(0,0,0,.10)`. Spacing: 80 px page padding on service pages, 120 px on the dashboard; wizard 152 px top padding, card centred; mobile side padding 16 px.

**11.5 Header and footer.** Desktop header 69 px #2b3a4e padding 16/80; left `mygovnl-logo-white` (112x34) then nav links gap 32 — Services (gear), Account (user), Notifications (bell), Contact Us (info), icons 16 px, 8 px from text; right "Log Out" outline, white 1 px border, radius 6, padding 10/20, SemiBold 14. Desktop footer 140 px #64717c: row 1 crest and wordmark (`gnl-crest-wordmark-white`, 72x36), "Need help?" (Bold 12), "Contact us at digitalgovernment@gov.nl.ca"; row 2 underlined Contact us · Visit gov.nl.ca · Disclaimer / Copyright / Privacy statement. Mobile footer: crest centred; "Services · Notifications · Account"; stacked Contact us, Visit gov.nl.ca, Disclaimer / Copyright / Privacy statement, Terms and Conditions.

**11.6 Wizard.** Card 820 px desktop, padding 40, gap 32. Title Bold 28 centred. Progress bar 16 px desktop / 8 px mobile, radius 4. Step labels spread across the width: Medium 16 desktop, 12 mobile. Actions row right-aligned: Cancel link, Back outline, primary.

**11.7 Buttons and links.** Primary #243746, white Bold 16, padding 10/24, radius 4. Outline white, 1 px #243746, #243746 text, radius 6, padding 10/20. On service cards: small outline (#d4d8da border, SemiBold 14, #5f6368, 40 px). Links #004b87 underlined; Bold 14 for "← Back" and standalone links, SemiBold 15 for action lists.

**11.8 Icons.** Keep final SVGs already in the repo; otherwise lucide-react (or the existing set) with `strokeWidth={2}`. Header nav Settings/User/Bell/Info 16 white · dashboard ChevronRight 32 #004b87 · favourites Star outline 16–20 #5f6368 · badge Lock 12 white · service Bell 16 #243746 · Star 20 · scopes Home/Mail/User/User 16 #5f6368 · contact Phone 16 #004b87 · linked items User/MapPin/Truck/XCircle/QrCode · ExternalLink · Trusted Check 12 white · Yoti tips Sun/ScanFace/Eye ~32 #546072 · "Don't forget" Eye/Sun/ScanLine 20 #546072 · ChevronLeft, ChevronDown.

**11.9 Yoti zone.** Figma note: "Yoti app (embed code) below the stepper and above the footer starts here. Action buttons are part of it. We have no control over its look and feel." **Keep the contrast on purpose:** Montserrat; headings #333b40; body #546072 and #4b5563; panels #f3f4f6; borders #d1d5db; buttons full width **#27619b**, 37 px, radius 4, Montserrat Bold 14, white. The MyGovNL header, service title, progress bar and pill stay in GNL style. **Do not restyle the Yoti zone into GNL style.**

## 12. Mock data and mock IDV provider

**12.1 Service config.** One object per service holding everything that differs: `title`, `subtitle`, `requirement`, `methods` (gnl_idv default), `otherVerificationStep`, `defaultDocument` (`DRIVERS_LICENCE` | `PASSPORT`), `captureSides` (`['front','back']` | `['front']`), `captureTitles`, `successServiceLabel`, `availableServices`, `goToServiceLabel`, `terms` ({ name, lastModified, version }).
- driver-vehicle: subtitle "View and manage your driver and vehicle services"; requirement "Must have a valid driver's license"; methods mrd, gnl_idv; no other-verification step; sides front+back; CTA "Go to Service Driver's License Renewal"; terms "Driver and Vehicle Services" 2025-04-29 v4; services: licence and registration renewals; address changes; driving record purchases; road test payments, and more.
- studentaid: subtitle "View and manage your StudentAidNL services"; requirement "Must have a valid driver's license, health card, or have neither because out of province"; methods mcp, mrd, gnl_idv; other-verification step; sides front only, title "Capture ID document"; CTA "Go to Service StudentAidNL"; terms "StudentAidNL" 2026-08-26 v7; services: Apply for student financial assistance; Check your application status; Receive messages about your application; Download tax documents.

**12.2 Onboarding state per service.** `not_started` -> `in_progress` (with `step`) -> `verified` -> `onboarded`. Also `termsAcceptedAt`, `method`, `idvSessionId`, `otherVerificationConfirmed`, `verifiedAt`. Service page shows "Confirmation required" until `onboarded`, then "Trusted".

**12.3 Mock IDV provider (demo only).** Shaped like a provider API; C1 is the client, CertifiO ID the provider. **Label it clearly as a mock — it is not the real CertifiO ID API.**
`IdvStatus = created | opened | consented | liveness_passed | document_captured | submitted | verified | cancelled`.
`IdvSession { id, serviceId, mode: 'same_device'|'phone', status, country?, documentType?, createdAt, updatedAt, result? { outcome:'VERIFIED', liveness:'PASS', documentAuthenticity:'PASS', faceMatch:'PASS', verifiedAt } }`.
`IdvProvider { createSession(serviceId) -> session + handoffUrl; getSession(id); update(id, patch); submit(id) // submitted -> verified after verifyDelayMs; subscribe(id, cb) -> unsubscribe }`.
Fake latency 300–800 ms per call. `verifyDelayMs` 1500, `processingMinMs` 3000, both changeable in the presenter controls. Default implementation: browser, `localStorage` + `BroadcastChannel('gnl-demo')`, 1 s polling fallback. Keep all IDV calls behind this interface.

**12.4 Hand-off URL and modes.** `handoffUrl = ${PUBLIC_BASE_URL || window.location.origin}/idv/${id}/terms`. Same device (P0) same tab. Phone view window (P1) narrow window, shared state via `BroadcastChannel`. Real phone (P2) only if quick: a tiny mock HTTP server (`POST /api/idv/sessions`, `GET`/`PATCH /api/idv/sessions/:id`, polling), in-memory, `PUBLIC_BASE_URL` reachable from the phone. **If hosted as a static site, skip P2**; the other two must work without a server.

**12.5 Persona (Figma values; see 10.7).** user Jason Momoa. driverVehicle: licence holder IAN B GARLAND, number G470114011, "Expires on January 14, 2026"; address 15 PRINCESS ANNE PL; vehicles 2015 CHEV IMT (plate JKM 026, VIN 2G1125535F9268441, "Expires on January 14, 2036", walletUpsell true) and 0 UTILITY TRAILER (plate TDH 578, VIN HM00000000036027, "Expired on March 31, 2022", expired true); contactPhone 1-877-636-6867. studentAid contact: org "Department of Education and Early Childhood Development Student Financial Services Division"; address lines as PP-03; phone 1-888-657-0800; email studentaidenquiry@gov.nl.ca.

## 13. Realism (P1)

**13.1 Face scan (NL-12, PP-13).** Simulated feed: soft grey gradient, slight vignette. A head silhouette moves into the oval. Aligned -> oval stroke green, progress ring fills over ~3 s. Chip text: "Position your face within the frame." -> "Hold still…" -> "Face captured". Then auto-advance or enable Continue. Optional `?camera=1`: real webcam via `getUserMedia`, mirrored. **Never record or upload.** Stop the stream on leave; denied permission falls back to the simulation.

**13.2 Document capture (NL-16, NL-18, PP-17).** ~2 s: the specimen image slides and tilts into the frame; blurred -> sharp; corner brackets turn green; a white flash (optional shutter sound, muted by default); then the captured state. With `prefers-reduced-motion` jump to the end state. No other heavy animation; page transitions ≤150 ms fade.

**13.3 Presenter controls (hidden).** Open with **Shift+D** or `?demo=1`; never visible by default. Reset demo; jump to any screen of either flow; open phone view; processing and verify delays; show/hide the "fictitious data" note.

## 14. Priorities (Monday 28 Sep)

**P0:** the audit; Flow A complete including the whole ID session (static states + click-through, same-device); Flow B complete; sticky footer; state persistence and reset; no dead ends; responsive at 1440/1024/768/393/360; `DEMO_SCRIPT.md`.
**P1:** mock provider with cross-window sync and auto-advance; phone view window; generated QR; animations; presenter controls.
**P2:** real phone mode; MRD and MCP legacy forms; light Account and Notifications pages; favourites and search; "Add to wallet" teaser.
**Out of scope:** real APIs; failure and retry paths (not designed); account registration; the VC flows page.

## 15. Definition of done

- `DEMO_AUDIT.md` lists every Appendix A item as KEEP / IMPROVE / BUILD, and every IMPROVE and BUILD item is done.
- Flow A works end to end on desktop, same-device: login, dashboard, NL-03..NL-26; every screen matches its Figma node at 1440 and 393.
- Flow A works with the phone view window; the desktop moves on by itself NL-08 -> NL-21 -> NL-22.
- Flow B works end to end: passport by default, no back capture, StudentAidNL copy (10.1), Trusted page at the end.
- After each flow the service page shows "Trusted", and still does after refresh, until "Reset demo".
- Every button, link and card navigates or shows the toast. No console errors.
- CertifiO ID pages use the sub-step pill with the right "step N of 5". No dot stepper, no `CID_Welcome`.
- Yoti zone uses Montserrat and Yoti colours; GNL parts use Lato.
- Footer sits at the bottom on short pages at every width.
- Keyboard navigation works, focus visible, reduced motion respected.
- KEEP screens unchanged (compare screenshots before and after).
- The build passes and the app runs from a clean clone per the README.

## 16. What to deliver

1. Code on a branch, PR description, before/after screenshots.
2. `DEMO_AUDIT.md` including "Open questions for André / Tatyana".
3. Updated `README.md`: run, build, host (static), env vars (`PUBLIC_BASE_URL`), how to reset.
4. `DEMO_SCRIPT.md`: a 5–7 minute click path — login; dashboard; Driver and Vehicle then Onboard; Summary and Terms; prerequisite with GNL IDV; click the QR for phone view; on the phone consents, face scan, licence front and back, verified; desktop advances itself to Confirmed, Success!, Trusted (show the wallet upsell); back to Services then the StudentAidNL passport flow same-device ending on Trusted; reset.
5. `screenshots/`: every route at 1440 and 393, named like the reference PNGs.

## Appendix A: Screen inventory

Node IDs from "C1 | GNL - R3", page "CerifiO ID integration". K = KEEP, I = IMPROVE, B = BUILD; verify each in the audit.

### Flow A — NL resident, driver's licence (Driver and Vehicle)

| ID | Node | Frame name | What it is | Expected |
|---|---|---|---|---|
| NL-01 | 6206:23558 | mygovnl-login-page | Login | K |
| NL-02 | 6206:23559 | mygovnl-services-dashboard | Dashboard | K + I |
| NL-03 | 6031:6244 | driver-vehicle-service-page | Service page, pre-verification (1440x1073) | K |
| NL-04 | screenshot | (image in flow) | Summary | K |
| NL-05 | screenshot | (image in flow) | Terms and Conditions | K |
| NL-06 | screenshot | (image in flow) | Confirm Some Details, Required | K / B |
| NL-07 | 6031:6304 | driver-vehicle-prerequisite-check | Choose verification service | K / I |
| NL-08 | 6217:62059 | CID_Redirect to mobile | Continue on a smartphone (QR) | **B** |
| NL-09 | 6217:62834 | CID_TU | Step 1, Terms of use | I / B |
| NL-10 | 6217:62835 | CID_Biometric | Step 2, Biometric consent | I / B |
| NL-11 | 6217:65268 | CID_Biometric | Step 3, Prepare to scan your face | **B** |
| NL-12 | 6217:65271 | CID_Biometric | Step 3, Position your face | **B** |
| NL-13 | 6217:66054 | CID_ID1_Country | Step 4, Country of issuance | **B** |
| NL-14 | 6087:31396 | CID_ID1 | Step 4, Accepted documents (Driver's License) | **B** |
| NL-15 | 6217:66055 | CID_ID1_Front_instruction | Step 4, Photo instructions | **B** |
| NL-16 | 6217:66056 | CID_ID1_Front camera | Step 4, Capture front (empty) | **B** |
| NL-17 | 6056:19118 | CID_ID1 | Step 4, Front captured | **B** |
| NL-18 | 6217:66057 | CID_ID1_back camera | Step 4, Capture back (empty) | **B** |
| NL-19 | 6057:20924 | CID_ID1 | Step 4, Back captured | **B** |
| NL-20 | 6217:66058 | CID_ID_success | Step 5, Your identity has been verified | I / B |
| NL-21 | 6217:80871 | Provider page_IDV results status | We've received your information | K + auto-advance |
| NL-22 | 6217:81644 | Driver and Vehicle_Prerequisite confirmed | Confirm some details, Confirmed | **B** |
| NL-23 | 6217:82446 | driver-vehicle-confirmation | Ready to Use, Success! | K |
| NL-24 | 6102:103451 | CID_ID1 | Success, mobile | K / I |
| NL-25 | 6257:72314 | driver-vehicle-service-page_verified | Service page, Trusted (1440x1793) | I |
| NL-26 | 6097:23625 | driver-vehicle-mobile | Service page, Trusted, mobile | I |

### Flow B — non-resident, passport (StudentAidNL)

| ID | Node | Frame name | What it is | Expected |
|---|---|---|---|---|
| PP-01 | 6206:23560 | mygovnl-login-page (instance) | Login | K |
| PP-02 | 6206:23561 | mygovnl-services-dashboard (instance) | Dashboard, StudentAidNL clickable | I |
| PP-03 | 6206:25424 | StudentAidNL-service-page | Service page, pre-verification | **B** |
| PP-04 | screenshot | (image in flow) | Summary, StudentAidNL | **B** (reuse) |
| PP-05 | screenshot | (image in flow) | Terms, StudentAidNL | **B** (reuse) |
| PP-06 | 6206:27501 | StudentAidNL_Prerequisite check_01 | Confirm Some Details, Required | **B** (reuse) |
| PP-07 | 6206:27601 | StudentAidNL_Prerequisite check_02 | Choose verification service (3 options) | **B** (reuse) |
| PP-08 | 6217:35183 | StudentAidNL_Prerequisite check_03 | Other verification | **B** |
| PP-09 | 6217:62060 | CID_Redirect to mobile (instance) | QR hand-off | **B** (reuse) |
| PP-10 | 6217:66060 | CID_TU (instance) | Step 1 | reuse |
| PP-11 | 6217:66061 | CID_Biometric (instance) | Step 2 | reuse |
| PP-12 | 6217:66069 | CID_Biometric (instance) | Step 3, Prepare | reuse |
| PP-13 | 6217:66070 | CID_Biometric (instance) | Step 3, Position face | reuse |
| PP-14 | 6217:66071 | CID_ID1_Country (instance) | Step 4, Country | reuse |
| PP-15 | 6217:66072 | CID_ID1 | Step 4, Accepted documents (Passport) | reuse |
| PP-16 | 6217:66151 | CID_ID1_Front_instruction (instance) | Step 4, Instructions | reuse |
| PP-17 | 6217:76798 | CID_ID1_Front camera | Step 4, Capture ID document | reuse |
| PP-18 | 6217:66154 | CID_ID1 | Step 4, Passport captured | reuse |
| PP-19 | 6217:66062 | CID_ID_success (instance) | Step 5, verified (10.1 copy) | reuse |
| PP-20 | 6217:80873 | Provider page_IDV results status (instance) | Processing | reuse |
| PP-21 | 6217:80071 | StudentAidNL_Prerequisite confirmed | Confirmed | reuse |
| PP-22 | 6217:82447 | driver-vehicle-confirmation (instance) | Success, "Go to Service StudentAidNL" | reuse |
| PP-23 | not in Figma | (derive from PP-03) | StudentAidNL Trusted | **B** |

### Assets expected in `design-reference/assets/`

`logos/mygovnl-logo-white.svg` (nav 112x34) · `logos/gnl-mygovnl-header-logo.png` (login header) · `logos/gnl-crest-wordmark-white.svg` (footer crest) · `logos/gnl-crest-flowers.svg` (method cards) · `logos/mygovnl-wordmark-white.svg` (purple band) · `logos/login-hero-background.png` · `idv/face-scan-illustration.png` (NL-11) · `idv/face-outline.svg` (NL-12) · `idv/id-nl-drivers-licence-front.png` (NL-17) · `idv/id-nl-drivers-licence-back.png` (NL-19) · `idv/id-canadian-passport.png` (PP-18) · `idv/yoti-logo.png` (NL-13) · `idv/qr-code-demo.png` (visual reference only).

Specimen ID images come from the Figma file and are marked as samples. Demo use only.
