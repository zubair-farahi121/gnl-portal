# DEMO_AUDIT.md — Step 1 of the build brief

**Audited:** 2026-09-23 · **Auditor:** Claude (agent pass) · **Against:** `BUILD_BRIEF.md` (22 Sep), Appendix A
**Dry run:** Tue 29 Sep 16:00 · **Code complete target:** Mon 28 Sep
**Figma:** `Dc1bPoXX1VoB9v1MtLvu8e`, page "CerifiO ID integration" (`6031:5860`). **Read-only throughout — no Figma write tool was called, no asset was downloaded.**

---

## 1. Summary

| Verdict | Count |
|---|---|
| **KEEP** | 16 |
| **IMPROVE** | 9 |
| **BUILD** | 24 |
| **Total (NL-01..26 + PP-01..23)** | **49** |

Plus 11 cross-cutting rows (section 3): 5 KEEP, 1 IMPROVE, 5 BUILD.

Flow A splits 15 KEEP / 8 IMPROVE / 3 BUILD across its 26 rows; Flow B splits 1 / 1 / 21 across its 23.

**The brief's section 4 table is out of date in both directions, and the errors are large.**

- It marks **NL-04 Summary, NL-05 Terms and NL-06 Confirm Required as KEEP**. *None of the three exists.* There is no route, no component and no copy for any of them. They are the first three screens after "Onboard" — the demo currently cannot get from the service page to the verification step by clicking.
- It marks **NL-08, NL-11..NL-19 and NL-22 as BUILD**. *All of them are built*, verified against their Figma nodes, and passing the two gates that can run. The whole CertifiO ID session — "the central piece" — is done.

So the work left is not where the brief says it is. It is at the **front of the wizard** (NL-04/05/06), in **cross-cutting plumbing** (toast, state, 404, service config), and in **Flow B**.

### Single biggest risk to 28 Sept

**The visual regression gate does not run, and the next change is a refactor that touches all 19 verified screens.**

`design/baselines/` is empty. `npx tsx scripts/visual-diff.ts` returns `SKIP … missing baseline` for all 19 frames and exits `GATE: FAIL`. Baselines are Figma PNG exports — exactly what `design-reference/screens/` would have supplied — and `figma.com` is blocked by this container's egress proxy, so they cannot be regenerated here.

Meanwhile, Flow B is impossible without parameterising the wizard by service (brief §12.1). That refactor touches **19 files containing `driver-vehicle` and 40 hardcoded route literals**, most of them inside screens the brief marks KEEP and forbids restyling (§1.4, §15 "KEEP screens unchanged — compare screenshots before and after").

We are about to make the riskiest change in the project with the regression detector switched off. **Fix this first, before any Flow B work**: someone with Figma access exports the 19 frames as 1× PNGs into `design/baselines/` (a 20-minute manual job) — or, if that is not possible by Thursday, we freeze today's build as a self-baseline (`npm run shots` → copy `design/shots/` → `design/baselines/`) so at least *drift from today* is detected, even though it cannot detect drift *from Figma*.

The two gates that do work — `npm run responsive` and `npm run clicks` — both pass clean right now (no horizontal scroll at 320/390/768/1024/1280 on any route, no console errors, forward + backward chain intact at 1440/768/390).

---

## 2. Main table

`ID | Screen / feature | Route in app | KEEP / IMPROVE / BUILD | Gaps found | Fix done`

**How each row was judged** — the tag in the "Gaps found" cell:
`[fig-shot]` Figma `get_screenshot` compared this session ·
`[fig-meta]` Figma `get_metadata` compared this session ·
`[app-shot]` app screenshot taken this session at 1440 and/or 393 ·
`[app-dom]` served build's rendered DOM / link graph inspected this session ·
`[prior]` reusing a screenshot-verified record from `design/page-inventory.md`, `design/verification-frame-map.md` or `design/token-exceptions*.md` ·
`[name]` judged from frame name, size and canvas position only — a hypothesis, not a fact.

> **Copy confirmation is limited everywhere.** `design-reference/copydeck.txt` does not exist (section 6). Copy on built screens was taken verbatim from `get_design_context` at build time and is recorded in `src/lib/data/*.ts`; copy on unbuilt screens is known only from the brief and from Figma screenshots. Wherever a row says *"copy unconfirmed"*, that is the missing copydeck, not a Figma read that failed.

### Flow A — NL resident, driver's licence (Driver and Vehicle)

| ID | Screen / feature | Route in app | Verdict | Gaps found | Fix done |
|---|---|---|---|---|---|
| NL-01 | Login (`6206:23558`) | `/` | **KEEP** | Matches at 1440 and 393. "Forgot password?" and "Create account" are inert — brief §7.1 wants a toast; no toast system exists (see X-06). Nothing else. `[app-dom]` `[prior]` | |
| NL-02 | Dashboard (`6206:23559`) | `/dashboard/` | **IMPROVE** | Masonry is correct — three explicit columns, 4/3/3, per §7.2 `[app-shot 1440+393]`. **StudentAidNL card has no `href`** and is inert (deliberate safeguard in `src/lib/data/services.ts`: "the presenter must not be able to click into an unbuilt screen"). Must become clickable once PP-03 exists. Other 8 cards inert with no toast. Favourite star and search are presentational (P2, correctly deferred). `[app-shot]` `[prior]` | |
| NL-03 | Service page, pre-verification (`6031:6244`) | `/services/driver-vehicle/` | **KEEP** | No gaps. Badge, bell, sidebar, Onboard → `/onboard/` all present. Sidebar scope icons for "first name"/"last name" render as blank placeholder boxes (see X-05). `[app-dom]` `[prior]` | **Tier 1 (2026-09-23):** "Onboard" re-pointed from `/onboard/` (NL-07) to `/summary/` (NL-04), per §5 and §8.1 NL-03. Destination only — `service` still diffs at 0.000%. Scope-icon placeholders remain (X-05). |
| NL-04 | Summary | **none** | **BUILD** | **Brief says KEEP — the brief is wrong. No route, no component, no copy.** Source is a pasted screenshot only (`6031:6242`, `image 4`, 1440×1155.75) — there is no Figma *frame*, so there is nothing to diff a baseline against. Copy is in brief §8.1 but unconfirmed without the copydeck. `[app-dom]` `[prior — seen]` | **BUILT 2026-09-23** — `/services/driver-vehicle/summary/`, frame `summary` in `frames.json`. Copy verbatim from §8.1; progress **25 %**; four-step bar with item 3 in the body copy (Q-01 answered in the brief's favour, not by inventing a step). **Geometry derived from the brief, not measured.** |
| NL-05 | Terms and Conditions | **none** | **BUILD** | **Brief says KEEP — wrong.** Screenshot only (`6031:6243`, 1440×1400.25). Longest copy block in the demo; includes the checkbox + the §7.4 validation rule (X-11), neither of which exists anywhere. `[app-dom]` `[prior — seen]` | **BUILT 2026-09-23** — `/services/driver-vehicle/terms/`, frame `terms`. Copy verbatim from §8.1 including the full consent paragraph, "Last modified: 2025-04-29" and "Version 4"; progress **50 %**; fixed 184px scroll box; the four scopes reuse `SHARED_DATA_SCOPES`. **X-11 closed** — the §7.4 checkbox rule is implemented and gated. **Geometry derived from the brief, not measured.** |
| NL-06 | Confirm Some Details: Required | **none** | **BUILD** | **Brief says K/B — it is B.** Screenshot only (`6031:6301`, 1440×979.5). The *Confirmed* twin (NL-22) is built at `/services/driver-vehicle/prerequisite/`; this is its Required state. Cheapest of the three — a variant of an existing page, not a new one. `[app-dom]` `[prior — seen]` | **BUILT 2026-09-23** — `/services/driver-vehicle/confirm-details/`, frame `prereq-required`. **One component, two states**: `ConfirmDetailsCard` was EXTRACTED out of the NL-22 page, which now renders it with `state="confirmed"`; `prereq-confirm` still diffs at 0.000%, which is the proof the extraction was faithful. **Geometry derived from the brief, not measured.** |
| NL-07 | Choose verification service (`6031:6304`) | `/services/driver-vehicle/onboard/` | **KEEP** | **Continue → `/cid/continue-on-mobile/` (NL-08) confirmed.** GNL IDV selected by default; MRD card inert by design. `[app-dom]` Two brief expectations are *not* met and the build is right, not the brief: (a) **no Back button** — `btn-back` is `hidden="true"` in Figma (`design/token-exceptions.md` §9.6); (b) **no arrow-key radio movement** — the radios are static images, there is one fixed selection. Flow B needs (b) to become real (see PP-07). `[prior]` | **Tier 1 (2026-09-23):** Back re-pointed from the service page to NL-06 `/confirm-details/`, per §7.4 "Back -> previous page" — it skipped three steps only because they did not exist. Cancel now performs the §7.4 reset. Destinations only; `onboard` still diffs at 0.000%. (b) arrow-key radio movement still open, for PP-07. |
| NL-08 | Continue on a smartphone, QR (`6217:62059`) | `/cid/continue-on-mobile/` | **IMPROVE** | **Brief says BUILD — it is built** (2026-09-22) and matches the frame. Real gaps: the QR is `qr-mobile-handoff.svg`, a **dimension-exact non-scannable placeholder** (deterministic noise around three finder squares) — §10.3 wants a real QR of the hand-off URL; no session is created and no `handoffUrl` exists; the QR is not clickable (no phone-view window, P1); no `aria-live` waiting line. "Continue on my computer" → `/cid/terms/` works. `[app-dom]` `[prior]` | |
| NL-09 | Terms of use, step 1 (`6217:62834`) | `/cid/terms/` | **KEEP** | Pill "Terms of use • step 1 of 5" verbatim. Both buttons outline, as Figma draws them. "I agree" → `/cid/biometric/`; "I do not agree" → `/onboard/`. "Terms of Use" link inert (needs toast, X-06). `[app-dom]` `[prior]` | |
| NL-10 | Biometric consent, step 2 (`6217:62835`) | `/cid/biometric/` | **KEEP** | "I agree" → `/cid/liveness/` (re-pointed 2026-09-23 when the liveness screens were found). `[app-dom]` `[prior]` | |
| NL-11 | Prepare to scan your face, step 3 (`6217:65268`) | `/cid/liveness/` | **KEEP** | **Brief says BUILD — built 2026-09-23.** Pill "Liveness check • step 3 of 5" verbatim. Three tip icons are placeholder boxes (X-05). Renders in **Lato, not Montserrat** (X-07). No Back in Figma; ArrowLeft is the reverse path. `[prior]` | |
| NL-12 | Position your face, step 3 (`6217:65271`) | `/cid/liveness-capture/` | **KEEP** | **Brief says BUILD — built 2026-09-23.** Live front camera (`facingMode="user"`) with a silent fallback to the flat `#e9ebe8` Figma panel; `?mock=1` pins the mock. Has the only visible `Yoti_back` in the run → `/cid/liveness/`. Missing: the §13.1 face-scan animation and auto-advance (P1). `[prior]` | |
| NL-13 | Country of issuance, step 4 (`6217:66054`) | `/cid/country/` | **KEEP** | Matches. **The select is not a `<select>`** — a static reproduction, no interaction (`src/app/cid/country/page.tsx`). Acceptable for a click-through; needs to become real only if someone will pick a country on stage. "Privacy Policy" inert (toast). Pill reads "ID document selection • step 4 of 5" — verbatim, and *not* "Country of issuance"; see Q-04. `[app-dom]` `[prior]` | |
| NL-14 | Accepted documents (`6087:31396`) | `/cid/document/` | **KEEP** | Driver's License pre-selected, as Figma. Rows are static images with a fixed `selected` flag — fine for Flow A; Flow B needs the flag driven by service config (PP-15). `[app-dom]` `[prior]` | |
| NL-15 | Photo instructions, front (`6217:66055`) | `/cid/capture-intro/` | **KEEP** | Matches. Three "Don't forget" icons are placeholders (X-05). Retains the odd "this time" wording from Figma — reproduced deliberately, raised as Q-07. `[prior]` | |
| NL-16 | Capture front, **empty** (`6217:66056`) | folded into `/cid/capture-front/` | **IMPROVE** | **No separate empty state exists as a route or a state.** `/cid/capture-front/` renders the *captured* instance (`6056:19118`) with a live camera over it. The brief wants empty → Continue → captured → NL-18. Also: `6217:66056` is the **master at 393×1222.81**, 48 px taller than the built instance at 1174.81 — unresolved design question **Q-02**. `[app-shot 390]` `[prior]` | |
| NL-17 | Capture front, **captured** (`6056:19118`) | `/cid/capture-front/` | **KEEP** | Matches the instance. Specimen image `id-nl-drivers-licence-front` is a **wireframe placeholder** — clearly visible on stage (X-05). `[app-shot 390]` `[prior]` | |
| NL-18 | Capture back, **empty** (`6217:66057`) | folded into `/cid/capture-back/` | **IMPROVE** | As NL-16. Same 48 px master/instance question (Q-02). Also missing: the §8.2 ~1.5 s button loading state on the last capture's Continue. `[prior]` | |
| NL-19 | Capture back, **captured** (`6057:20924`) | `/cid/capture-back/` | **KEEP** | Matches. Placeholder specimen image. → `/cid/verified/`. `[app-dom]` `[prior]` | |
| NL-20 | Identity verified, step 5 (`6217:66058`) | `/cid/verified/` | **KEEP** | **Verified against Figma metadata this session** — `ContinueButton` "Continue to Driver and Vehicle service" + `btn-back` "Log out", stacked, exactly as built. Continue sets `verified` and pushes `/auth/loading/`; Log out → `/` and resets. Body copy reproduces Figma's **missing commas** in the services list — deliberate, raised as Q-06. `[fig-meta]` `[app-shot 1440+393]` | |
| NL-21 | We've received your information (`6217:80871`) | `/auth/loading/` | **IMPROVE** | **The one true dead end in Flow A.** Figma gives this frame no button ("You can close this window."), and the 2.6 s auto-advance was *removed* on 2026-09-22 for Figma fidelity. Today the only way forward is the presenter's ArrowRight. Brief §8.3 requires auto-advance to NL-22 after `processingMinMs` (3 s) with an "Identity verification complete" toast. Also missing: `aria-live="polite"` (§7.8). `[app-shot 1440]` `[app-dom]` `[prior]` | **FIXED 2026-09-23.** §8.3 auto-advance restored after `processingMinMs` (3000 ms) with the toast "Identity verification complete", plus `role="status" aria-live="polite"` on the existing status block (attribute only — `auth-loading` diffs at 0.000%). **It is a ONE-SHOT, armed by `/cid/verified/` and consumed on mount**, so step 7's Back still works; `npm run clicks` D1 asserts it fires forward and D2 asserts it does NOT fire on Back. A deliberate reversal of the 2026-09-22 removal — see `design/token-exceptions.md` §10.10. |
| NL-22 | Confirm some details: **Confirmed** (`6217:81644`) | `/services/driver-vehicle/prerequisite/` | **KEEP** | **Brief says BUILD — it is built.** Copy, Confirmed badge (#198754) and Continue → `/confirmation/` all present `[app-dom]`. No Back button (hidden in Figma), so the brief's "Back → NL-07 keeping the verified result" is not implementable without inventing a control. Height rounding 996 vs 997 unresolved (Q-03). | |
| NL-23 | Ready to Use: Success! (`6217:82446`) | `/services/driver-vehicle/confirmation/` | **KEEP** | 100 % progress, CTA → `/services/driver-vehicle/?verified=1`, Back → `/prerequisite/`. `[app-dom]` `[prior]` | **Tier 1 (2026-09-23):** now marks the service **onboarded** on open (§8.3), via a null-rendering client child — `confirmation` diffs at 0.000%. |
| NL-24 | Success, mobile (`6102:103451`) | `/…/confirmation/` at 393 | **IMPROVE** | No dedicated mobile route; the desktop frame reflows. Never compared against `6102:103451` (393×810.81). Low risk *if* no phone is shown — decide with the presenter (Q-08). `[app-shot 393]` `[prior — name]` | |
| NL-25 | Service page: **Trusted** (`6257:72314`) | `/services/driver-vehicle/?verified=1` | **IMPROVE** | Content is right — Actions two-column, four linked items, wallet upsell, expired trailer pill `[app-shot 1440]`. Two real gaps: (a) **state is `sessionStorage` + a `?verified=1` query param**, so the Trusted state does *not* survive a browser restart and the URL leaks the trick on stage — brief §7.5/§12.2 wants `localStorage` under `gnl-demo:v1` keyed per service (X-04); (b) every action link and item button is inert with no toast (X-06). Linked-item 64 px icon boxes are blank placeholders (X-05). | **(a) FIXED 2026-09-23.** Trusted now comes from `gnl-demo:v1` in `localStorage`, per service, and survives a reload and a browser restart; `?verified=1` is kept only as a presenter deep-link and as the pinned route for the `service-verified` baseline. Gated by `npm run clicks` D3/D4. (b) toast closed in Tier 0. Placeholder icons remain (X-05). |
| NL-26 | Trusted, mobile (`6097:23625`) | same route at 393 | **IMPROVE** | Reflows correctly: main then sidebar, **same data as desktop** — §10.2 already satisfied (IAN B GARLAND at all widths) `[app-shot 393]`. Never compared against `6097:23625` (393×2786.81). Placeholder icons are most visible here. | |

### Flow B — non-resident, passport (StudentAidNL)

Nothing in Flow B is built. **21 of the 23 rows are BUILD.** See section 7 for why "21 rows" is not "21 screens".

| ID | Screen / feature | Route in app | Verdict | Gaps found | Fix done |
|---|---|---|---|---|---|
| PP-01 | Login instance (`6206:23560`) | `/` | **KEEP** | Same built screen as NL-01. Flow B adds nothing. `[prior — name]` | |
| PP-02 | Dashboard, StudentAidNL clickable (`6206:23561`) | `/dashboard/` | **IMPROVE** | Same fix as NL-02: give the StudentAidNL card an `href`. One line, blocked on PP-03 existing. `[app-shot]` | |
| PP-03 | StudentAidNL service page (`6206:25424`, 1440×1469.22) | `/services/studentaid/` | **BUILD** | Largest single Flow B screen: NL-03 layout + the locked "Access the StudentAid Portal" row (860×60, `#eeeeee`) + **7 sidebar scopes** instead of 4 + a full postal contact block. `[prior — seen]` | |
| PP-04 | Summary, StudentAidNL | `/services/studentaid/…/summary` | **BUILD** | Depends on NL-04 existing first. Screenshot-only source (`6206:26558`). `[prior — name]` | |
| PP-05 | Terms, StudentAidNL | `.../terms` | **BUILD** | Depends on NL-05. Different consent text, "Last modified 2026-08-26", "Version 7", 7 scopes. `[prior — name]` | |
| PP-06 | Confirm Required (`6206:27501`) | `.../prerequisites` | **BUILD** | Brief is right that this node is a cropped screenshot; build from the NL-06 component. `[prior — name]` | |
| PP-07 | Choose verification service, 3 options (`6206:27601`) | `.../prerequisites/method` | **BUILD** | **Screenshot-verified this session.** Three radio cards — MCP, MRD, **GNL IDV selected** — and, unlike the D&V twin, **Cancel *and* Back are both visible**. That confirms NL-07's missing Back is a hidden layer, not an oversight, and that the shared component needs an optional Back. `[fig-shot]` | |
| PP-08 | Other verification (`6217:35183`) | `.../prerequisites/other` | **BUILD** | **Screenshot-verified this session.** Simple: wizard card, heading "Other verification", one pre-checked radio with a sub-line, Back + Continue, **no Cancel**. Matches brief §9 exactly. Cheapest new screen in Flow B. `[fig-shot]` | |
| PP-09 | QR hand-off (`6217:62060`) | `/cid/continue-on-mobile/` (service-aware) | **BUILD** | Instance of the built NL-08. Needs service title only. `[prior — name]` | |
| PP-10 | Step 1, Terms of use (`6217:66060`) | `/cid/terms/` | **BUILD** | Instance of built. Title → "StudentAidNL". `[prior — name]` | |
| PP-11 | Step 2, Biometric consent (`6217:66061`) | `/cid/biometric/` | **BUILD** | Instance of built. `[prior — name]` | |
| PP-12 | Step 3, Prepare (`6217:66069`) | `/cid/liveness/` | **BUILD** | Instance of the now-built liveness screen. `[prior — name]` | |
| PP-13 | Step 3, Position face (`6217:66070`) | `/cid/liveness-capture/` | **BUILD** | Instance of the now-built liveness capture. `[prior — name]` | |
| PP-14 | Step 4, Country (`6217:66071`) | `/cid/country/` | **BUILD** | Instance of built. `[prior — name]` | |
| PP-15 | Step 4, Accepted documents, **Passport** (`6217:66072`) | `/cid/document/` | **BUILD** | Same frame, **Passport pre-selected** instead of Driver's License. Needs `defaultDocument` in service config. `[prior — seen]` | |
| PP-16 | Step 4, Instructions (`6217:66151`) | `/cid/capture-intro/` | **BUILD** | Instance of built. `[prior — seen]` | |
| PP-17 | Step 4, Capture ID document (`6217:76798`) | `/cid/capture-front/` | **BUILD** | Heading drops "(front)" per §10.1. `[prior — seen]` | |
| PP-18 | Step 4, Passport captured (`6217:66154`) | `/cid/capture-front/` | **BUILD** | Portrait passport specimen (274×384) — a *new* placeholder asset is needed. **No back capture** in Flow B. `[prior — seen]` | |
| PP-19 | Step 5, verified (`6217:66062`) | `/cid/verified/` | **BUILD** | §10.1 copy: StudentAidNL services, 4 different bullets, CTA "Continue to StudentAidNL service". `[prior — name]` | |
| PP-20 | Processing (`6217:80873`) | `/auth/loading/` | **BUILD** | Instance of built. `[prior — name]` | |
| PP-21 | Confirmed (`6217:80071`) | `.../prerequisites/confirmed` | **BUILD** | Twin of built NL-22, different requirement copy. `[prior — name]` | |
| PP-22 | Success, "Go to Service StudentAidNL" (`6217:82447`) | `.../ready` | **BUILD** | ⚠ **The Figma node is an unchanged instance of the *Driver and Vehicle* confirmation** — name and content both say Driver and Vehicle. Either the StudentAidNL confirmation was never drawn or nobody swapped the placeholder. Build to brief §10.1 and flag (Q-09). `[prior — name]` | |
| PP-23 | StudentAidNL Trusted | `/services/studentaid/` verified | **BUILD** | **Not in Figma at all** — Row A has no post-verification service page. Must be derived from PP-03 + NL-25. Highest invention risk in the whole demo; nothing to diff against. `[prior]` | |

---

## 3. Cross-cutting items (brief §4 and §7)

| # | Item | Verdict | Status found |
|---|---|---|---|
| X-01 | **Sticky footer everywhere** | **KEEP** | **Done.** `globals.css` gives all three shells (`.gnl-desktop-shell`, `.gnl-mobile-shell`, `.gnl-cid-shell`) `display:flex; flex-direction:column; min-height:100dvh` with `margin-top:auto` on the footer. Self-cancelling on tall pages, so the visual gate is unaffected. Verified at 320/390/768/1024/1280 on all 19 routes. |
| X-02 | **Responsive layout** | **KEEP** | **Done and gated.** Desktop-first ladder 1440/1280/1024/768/480/384, documented in `globals.css`. `npm run responsive` passes: no horizontal scroll at any width on any route, console clean. 1440 and 393 checked by hand this session on 6 routes. |
| X-03 | **Dashboard masonry (§7.2)** | **KEEP** | **Done.** Three explicit column arrays (4/3/3) in `src/lib/data/services.ts`, not an auto-flowed grid, collapsing 3→2→1. The `titleWraps` / `duplicateChevron` Figma quirks are reproduced deliberately. Only the two "working" cards were meant to be clickable and only one is (see NL-02). |
| X-04 | **State persistence and reset (§7.5, §12.2)** | **BUILD → DONE (Tier 1, 2026-09-23)** | **Was substantially missing.** `src/lib/demo-state.tsx` is a single boolean `verified` in **`sessionStorage`** under `gnl-demo-verified`. Brief wants one `localStorage` store under `gnl-demo:v1` with per-service onboarding state (`not_started → in_progress → verified → onboarded`, plus `termsAcceptedAt`, `method`, `idvSessionId`…). No `BroadcastChannel`, no cross-tab sync, no `/reset` route. Reset exists only as the hidden **Escape** key in `DemoNav`. **Direct conflict with §7.1:** the header **Log Out clears the demo state** (`TopNav.tsx` → `onClick={reset}`), and §7.1 says Log Out must *keep* onboarding progress. Pick one; I'd follow the brief. **DONE 2026-09-23:** one `localStorage` store under `gnl-demo:v1`, per service, with the full §12.2 shape (`not_started → in_progress(step) → verified → onboarded`, `termsAcceptedAt`, `method`, `idvSessionId`, `otherVerificationConfirmed`, `verifiedAt`). Cross-window sync is the **`storage` event only** — `BroadcastChannel` was cut with the rest of P1, and `storage` already fires across windows (~15 lines). `/reset` added. **Q-17 settled in the brief's favour: the header Log Out now KEEPS progress**; only `/reset` and the presenter's Escape clear the store. Every read happens after mount, so nothing changes server-rendered markup — asserted by `npm run clicks` D6, which seeds a full store and hard-loads ten stateful routes looking for a hydration error. |
| X-05 | **Logos and icons** | **IMPROVE** | **36 of 52 assets are blank placeholder rectangles.** 16 are real (the Bootstrap Icons nav set Tatyana confirmed, plus the login lockup PNG). The missing ones are the ones the audience looks at: the driver's-licence and passport specimens, the face-scan illustration, the face outline, the Yoti logo, the hand-off QR, the three liveness tip icons, the three "Don't forget" icons, and every linked-item icon box on the Trusted page. Visible as empty outlined squares in `design/responsive/cid-capture-front-390.png` and on NL-25/26. **This is the single most visible polish defect**, and it is exactly what `design-reference/assets/` would have closed (section 6). |
| X-06 | **Toast for out-of-scope links (§10.5)** | **BUILD** | **No toast component exists anywhere in `src/`.** Every out-of-scope control is currently silently inert: "Forgot password?", "Create account", 8 dashboard cards, Account/Notifications/Contact Us, every Actions link and item button on NL-25, "Add to wallet", "Terms of Use" and "Privacy Policy" in the Yoti zone. Brief §15: "Every button, link and card navigates or shows the toast." One small component unblocks ~30 controls — highest value-per-hour item in the whole list. |
| X-07 | **Fonts — is Montserrat actually loaded?** | **BUILD** | **No. Montserrat is not loaded at all.** `layout.tsx` self-hosts **Lato only** (300/400/700 from `@fontsource/lato`); `globals.css` has no `@font-face` or `@import` for Montserrat; `grep` finds the word only in source comments explaining the substitution. **The entire Yoti zone renders in Lato.** Two consequences already measured (`token-exceptions.md` §11.8): guideline row 3 wraps to two lines in Figma and one in Lato, and row 1 wraps a word later. Also, **Lato has no 500 or 600**, so every `Medium` and `SemiBold` in the design maps to 400 or 700. Root cause: the Google Fonts host is blocked by this container's proxy. Fix is to vendor Montserrat 400/500/600/700 woff2 the way Lato is vendored — needs the files brought in from outside this container. Brief §15 names this in the Definition of Done. |
| X-08 | **No dead ends (§7.6)** | **BUILD → (a) and (b) DONE (Tier 1)** | Three holes. (a) **`/auth/loading/` cannot be left by clicking** — Figma gives it no control and the auto-advance was removed; ArrowRight only. (b) **The 404 is the stock Next.js page** — plain "404 / This page could not be found.", no GNL chrome, no "← Back to Services"; confirmed by fetching `/nope/`. (c) **No route guards**: every CID page renders standalone regardless of state, and `/cid/:step` for a user who never started is reachable and looks fine. (a) is the only one a presenter will hit. **DONE 2026-09-23:** (a) the §8.3 auto-advance is back as a one-shot, so the screen leaves itself after 3 s on the way forward while step 7's Back still works; (b) `src/app/not-found.tsx` is a GNL 404 — TopNav, desktop footer, "← Back to Services" — exported to `out/404.html`, verified returning a real 404 status, and gated by `npm run responsive` and `npm run clicks` C9. **(c) route guards remain open** and were not in Tier 1 scope. |
| X-09 | **Wizard progress percentages (§7.4)** | **KEEP → SEAM CLOSED (Tier 1)** | `STEPPER_STEPS` is the right four labels; `ProgressStepper` computes `(current+1)/4`, so **Prerequisite Check = 75 %** and **Ready to Use = 100 %** are correct and verified on `/onboard/`, `/prerequisite/`, `/confirmation/` and all ten CID screens. **25 % and 50 % are never rendered because NL-04 and NL-05 do not exist.** The bar on the built screens names two steps the demo cannot show — the visible seam `page-inventory.md` P2 warned about. **CLOSED 2026-09-23:** NL-04 renders 25 % and NL-05 renders 50 %, so all four labels are now reachable by clicking. Verified side by side at 1440 and 393 in `design/responsive/_tier1-wizard-*.png`: the bar advances 25 / 50 / 75 / 75 across Summary, Terms, Confirm Required and Choose verification service. |
| X-10 | **Sub-step pill / no dot stepper (§10.4)** | **KEEP** | **Done.** `SubStepReadout` renders the pill as the third child of `progress-stepper`. No dot stepper, no `CID_Welcome`. The counter runs **1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 5** with no number skipped — every value verbatim from Figma, nothing renumbered. (Conflict C4 in `verification-frame-map.md` is closed: two frames *do* display "step 3 of 5"; they were simply missing.) |
| X-11 | **Terms checkbox validation rule (§7.4)** | **BUILD → DONE (Tier 1)** | Shipped with NL-05 on 2026-09-23. "I Consent" is a `<button>`, not a link, precisely so it can refuse: with the box unticked it shows "To continue, you must agree to the terms and conditions." in `#d32f2f` under the checkbox and **does not navigate**. `role="alert"` on the message, `aria-invalid` + `aria-describedby` on the input, and ticking the box clears it. `npm run clicks` 3b asserts BOTH halves — the message appears AND the URL does not change — because either one alone would pass against a real bug. |

---

## 4. Deliberate changes from Figma (brief §10) — current status

| § | Change | Status |
|---|---|---|
| 10.1 | Flow B copy fixes (subtitle, step-5 copy and bullets, CTA, "Capture ID document" without "(front)") | **Not started** — Flow B is unbuilt. All of it belongs in the service config (§12.1), which also does not exist. |
| 10.2 | One mock data source; use desktop values at all sizes | **Done.** `src/lib/data/driver-vehicle.ts` is the single source and the 393 render shows IAN B GARLAND / G470114011 / January 14 2026 — the desktop values — not the mobile frame's JANE GARLAND. Verified `[app-shot 393]`. |
| 10.3 | Real QR encoding the hand-off URL, 220×217 | **Not done.** `qr-mobile-handoff.svg` is a dimension-exact, deliberately non-scannable placeholder. Needs a QR generator **and** a hand-off URL, which needs a session, which needs the mock provider (§12.3). |
| 10.4 | Sub-step pill replaces the dot stepper | **Done** — see X-10. |
| 10.5 | Non-demo links show "Not part of this demo" | **Not done** — see X-06. No toast exists. |
| 10.6 | Small additions: verification-complete toast, capture loading state, NL-08 waiting line, "Demo — fictitious data" footer note, presenter controls | **Partly.** Presenter controls exist in reduced form: `DemoNav` gives ArrowRight / ArrowLeft / Escape (reset). There is no Shift+D panel, no `?demo=1`, no delay controls. None of the other four exists. The one adjacent thing that *does* exist and is worth keeping is `?mock=1`, which pins the camera screens to their static Figma mock and persists in `localStorage` — genuinely useful on stage. |
| 10.7 | Keep Figma persona values, record them, list as open questions | **Done** — values are in `src/lib/data/driver-vehicle.ts` and carried into section 5 below as Q-10/Q-11/Q-12. |

**Additional deliberate deviations found in the build that §10 does not list** — each is documented in `design/token-exceptions.md` and each should be added to §10 rather than "fixed":

- **Montserrat → Lato substitution** across the whole Yoti zone (X-07). Forced by the environment, not chosen.
- **Lato has no 500/600**, so every `Medium` and `SemiBold` renders at 400/700.
- **Hidden Figma layers are not rendered**, which is why NL-07 and NL-22 have no Back button and five CID screens have no control but Continue.
- **An invented desktop layout for the CID screens** (`.gnl-cid-shell` at ≥768). Figma has 393-only frames; without this the flow reads desktop page → 480 px strip → desktop page.
- **`/auth/loading/`'s 2.6 s auto-advance was removed** for Figma fidelity — which the brief now asks to be put back (§8.3). Note this is a *reversal*, so whoever does it should say so in the commit rather than appear to re-introduce a bug.
- **Copy defects reproduced verbatim**: the missing commas in NL-20's service list, and "this time" on the first-pass capture instructions (Q-06, Q-07).

---

## 5. Open questions for André / Tatyana

Brief §10.7 items first, then everything carried forward from `design/page-inventory.md` and `design/verification-frame-map.md` (**none of these has been lost**), then what this pass added.

### From brief §10.7 — persona values, keep as-is unless told otherwise

- **Q-10** — The portal greets "**Welcome Jason Momoa!**" but the licence holder on the same journey is "**IAN B GARLAND**". Intentional, or should they be one person? One-line change in `src/lib/data/`.
- **Q-11** — The licence "**Expires on January 14, 2026**" is already in the past. Roll it forward?
- **Q-12** — Specimen ID images show "**MICHAEL R. HOWARD**" and "**SARAH MARTIN**", a third and fourth name. Fine as sample documents?

### Carried forward from `design/page-inventory.md`

- **Q-01 (was U1) — Is "Notification Settings" a wizard step?** `6102:101142` shows a **five**-step bar including it, and the Summary screen lists it as item 3. Every built screen and all three image-only steps show a **four**-step bar. The designer's own label is a question ("Notifications preference page - IIRC GNL?") and its header says "Driver's License Renewal", not "Driver and Vehicle". **This is now urgent**, because NL-04 (Summary) is on the build list and its copy either does or does not mention it. Do **not** build the step on a guess. **ANSWERED FOR THE BUILD, 2026-09-23 — still open as a design question.** The brief settles it: §8.1 NL-04, last line, *"The wizard has 4 steps; there is no Notification Settings step in this demo."* So NL-04 renders **four** steps in the bar and keeps item 3 in the body copy, which is exactly what §8.1's own copy block does. No fifth step was invented. The contradiction in the file is unchanged and still needs Tatyana; the code comment on `SUMMARY` in `src/lib/data/onboarding.ts` records it at the call site.
- **Q-02 (was U2) — The capture screens exist twice, 48 px apart.** Masters `6217:66056` / `6217:66057` are 393×1222.81; the built instances `6056:19118` / `6057:20924` are 1174.81. Newer design the instances have not picked up, or an older master they deliberately override? The build uses the instances and was not switched. Two lines in `frames.json` either way. **Also decides what NL-16/NL-18's empty state should look like.**
- **Q-03 (was U5 / C3) — Height rounding, `ceil` vs `round`.** 997 vs 996 for `6217:81644`; 1793 vs 1792 for `6257:72314`. One pixel, but it moves every diff baseline — and we are about to create baselines from scratch (section 1). **Decide before the baselines are exported.**
- **Q-05 (was U3) — Is the StudentAidNL journey finished in Figma?** Row A's last frame `6217:82447` is an unchanged instance of the *Driver and Vehicle* confirmation, and Row A has **no post-verification service page at all** where Row B has one plus a mobile twin. PP-23 therefore has to be invented. (See also Q-09.)
- **Q-13 (was U4) — Is `6076:24415` `driver-vehicle-dashboard` dead?** Read as superseded reference (reference page, no portal chrome, older id block), confidence medium-high, not certain. If it is live, the Trusted page is missing a whole tab bar — Actions / Notifications / Terms of use / **Unlink service** — and "Unlink service" is a capability nothing else in the file shows.

### Carried forward from `design/verification-frame-map.md`

- **Q-04 — The pill is wrong on five consecutive screens.** `ID document selection • step 4 of 5` is displayed by `/cid/country/`, `/cid/document/`, `/cid/capture-intro/`, `/cid/capture-front/` and `/cid/capture-back/` — it describes only the second of them. Reproduced verbatim. Should country selection and capture get their own sub-labels?
- **Q-06 — Missing commas in `6217:66058`** (`6062:23365`): "…licence and registration renewals address changes driving record purchases road test payments, and more." Reproduced as designed. Fix in Figma, or fix in the build?
- **Q-07 — "We will try to get a clearer image *this time*"** on the front-instruction screen implies a previous failed attempt, but the screen is on the happy path.
- **Q-14 — Service name drifts in the CTA.** `6217:82446` says "Go to Service **Driver's License Renewal**"; `6217:66058` says "Continue to **Driver and Vehicle** service". Two names for one destination, three screens apart.
- **Q-15 — Heading scale disagrees across consecutive Yoti screens**: 22 px on country / accepted-documents / instructions, then **32 px** on both capture screens. Now visible on stage because `/cid/capture-intro/` (22) sits immediately before `/cid/capture-front/` (32).
- **Q-16 (was C1) — The 4,924 px void on Row B.** Between `CID_Biometric` and `CID_ID_success` there is a gap that would fit nine frames at Row A's pitch. Evidence favours "the designer parked steps 4a–4d in the Yoti cluster and the build's mapping is right", but it was never confirmed by eye. **Someone with the file open should look once and say.** If newer D&V copies live there, five built screens are wrong.

### New from this pass

- **Q-17 — Log Out: keep progress or clear it?** ~~The build clears the demo state on Log Out; brief §7.1 says Log Out must keep onboarding progress and only "Reset demo" clears.~~ **SETTLED 2026-09-23 in the brief's favour.** The header's Log Out is now a plain navigation and keeps progress; `/reset` and the presenter's Escape are the only things that clear `gnl-demo:v1`. Note the CertifiO ID session's own "Log out" on `/cid/verified/` still resets — that control abandons a verification in progress, on what is drawn as the provider's screen, and is deliberately not the same thing. `npm run clicks` D4 asserts the header case.
- **Q-18 — Where do the visual baselines come from?** `design/baselines/` is empty and figma.com is unreachable from the build container, so the pixel gate cannot run (section 1). We need 19 frames exported at 1× as PNG named per `frames.json`, or a decision to self-baseline.
- **Q-19 — Can we have Montserrat?** X-07. Either licence and vendor the woff2 files, or restyle the Yoti zone to Lato in the design file — but §11.9 explicitly says *do not* restyle the Yoti zone, so the first is the brief-compliant answer.
- **Q-20 — Will a real phone be on stage on Tuesday?** Decides NL-24/NL-26 (mobile twins, never compared to their own frames) and whether P2 real-phone mode matters at all. The app is a static export, so §12.4 says skip P2 — confirm nobody is expecting to scan the QR with a phone.
- **Q-22 — The three derived screens need a copy review, and the apostrophes disagree.** NL-04, NL-05 and NL-06 were typed from BUILD_BRIEF.md §8.1, whose apostrophes are all STRAIGHT (U+0027) — "you'll", "Division's", "You're", "driver's" — while the measured CONFIRMED frame 6217:81644 uses the typographic U+2019 for the same words. Both are reproduced as their own source writes them, so the demo now shows *"confirm it is you"* with U+0027 on NL-06 and *"confirm it's you"* with U+2019 on NL-22, three clicks apart. That is the design file disagreeing with itself, not a build error, but it is the kind of thing a client reads. `copydeck.txt` would settle it (§6).
- **Q-23 — Two derived type values need a designer's yes.** The three new screens use a 36px Bold page heading (matching the measured NL-22) and an 18px Bold sub-heading for NL-04's numbered items and NL-05's "By Accepting This Policy…". §11.3's scale jumps 16 → 24 with nothing between, so 18 is the nearest value the brief uses anywhere (§8.1 NL-01's "category titles Bold 18"). Related: the wizard's own headings are inconsistent in Figma — 36px on both Confirm-some-details frames, 28px on NL-07 "Services" and NL-23 "Success!" — which is now visible as a step down between two consecutive screens.
- **Q-21 — The three liveness guideline icons are a *screenshot* in Figma**, cropped three ways by negative offsets (`Screenshot_20260302_102709_Firefox`). They need a proper per-icon export regardless of what else happens.

---

## 6. Impact of the missing `design-reference/` pack

`design-reference/` **does not exist in this repo** — confirmed, `ls` returns "No such file or directory". So `screens/*.png`, `copydeck.txt`, `assets/logos/`, `assets/idv/` and `README.md` are all unavailable. Compounding it, **figma.com is blocked by this container's egress proxy**, so nothing in the pack can be substituted by fetching it directly; only the read-only MCP tools reach the design.

Brief §3 puts Figma at priority 1 and the pack at priority 4, so for *design intent* the pack is not load-bearing — every built screen was measured from `get_design_context` against the real nodes. But the pack is load-bearing for three things Figma reads cannot supply:

**1. The visual regression gate cannot run — this is the serious one.**
`design/baselines/` is empty, so `scripts/visual-diff.ts` SKIPs all 19 frames and exits FAIL. The baselines are 1× PNG exports of the Figma frames — precisely `design-reference/screens/`, which the brief says are "prefixed with the IDs here". Without them:
- the brief's Definition of Done "every screen matches its Figma node at 1440 and 393" is unverifiable mechanically;
- the rule "KEEP screens unchanged — compare screenshots before and after" cannot be enforced;
- and next week's service-config refactor touches all 19 of them.
`npm run responsive` and `npm run clicks` still pass and still catch overflow, console errors and broken links — but neither can see a layout drift that stays inside the viewport.

**2. 36 of 52 assets stay as blank placeholder rectangles (X-05).**
`assets/logos/` and `assets/idv/` are the specimen licence and passport, the face-scan illustration, the face outline, the Yoti logo, the GNL crests, the hero background and the QR reference. Today they render as outlined empty boxes — clearly visible on the two capture screens, both liveness screens, the hand-off, and all four linked items on the Trusted page. Every placeholder is dimension-exact, so **swapping in the real export is a byte replacement with no layout change** — this is not rework, it is a blocked hand-off. It does not block the build; it blocks the build *looking finished*.

**3. Exact copy on the three unbuilt Flow A screens cannot be confirmed.**
NL-04, NL-05 and NL-06 exist in Figma only as **pasted screenshots**, not frames — there is no text layer to read with `get_design_context`. `copydeck.txt` is described as "exact text of new screens" and is the only non-OCR source for NL-05's long consent paragraph and NL-04's numbered list. Without it, those two screens must be typed from the brief's §8.1 prose and from reading a screenshot, and they will need a copy review before Tuesday. The same applies to PP-04/PP-05.

**What it does *not* block:** the flow, the routing, the state model, the components, Flow B's structure, or any screen that exists as a real Figma frame. Do not wait for the pack to start building.

**Ask, in priority order:** (a) the 19 baseline PNGs, (b) `assets/idv/` — the two specimen IDs and the face-scan illustration carry the story, (c) `copydeck.txt`, (d) `assets/logos/`.

---

## 7. Prioritised BUILD list for Monday 28 Sept

Ordered by value to the demo. Effort is my own estimate in developer-hours **for this codebase**, which holds an unusually high per-screen bar (every value measured from Figma, every deviation logged in `token-exceptions.md`). A screen here costs 3–4 h, not 45 minutes. **Budget available: ~4 working days, roughly 28–32 h for one developer.**

### Tier 0 — do first, everything else depends on it (≈ 7 h)

| # | Item | Est. | Why first |
|---|---|---|---|
| 0.1 | **Get baselines into `design/baselines/`** (export, or self-baseline today's build) | 1 h + an ask | Without it, nothing below can be verified not to break the 19 working screens. Blocking risk, not a feature. |
| 0.2 | **Toast component** (X-06, §10.5) | 2 h | Unblocks ~30 inert controls across every screen, including screens already marked KEEP. Highest value per hour in the project. |
| 0.3 | **Service config object** (§12.1) + route parameterisation | 4 h | The prerequisite for all of Flow B. Today `WIZARD_TITLE = "Driver and Vehicle"` is a constant; 19 files mention the service and there are 40 hardcoded route literals. **Do it before Flow B, not during.** |

### Tier 1 — P0 in the brief, and I agree (≈ 12 h)

| # | Item | Est. | Note |
|---|---|---|---|
| 1.1 | **NL-06 Confirm Required** | 1.5 h | Cheapest of the three missing wizard screens — a second state of the built NL-22. |
| 1.2 | **NL-04 Summary** | 3 h | Closes the "bar says 4 steps, demo starts at step 3" seam. Blocked on Q-01 (Notification Settings). |
| 1.3 | **NL-05 Terms + checkbox validation** (X-11) | 4 h | Longest copy; needs the copydeck or a copy review. |
| 1.4 | **State model: `localStorage` `gnl-demo:v1`, per-service, survives refresh** (X-04) | 2.5 h | Replaces `?verified=1`. See the cost note below. Also settle Q-17 (Log Out). |
| 1.5 | **NL-21 auto-advance + "Identity verification complete" toast** | 0.5 h | Removes the one real dead end in Flow A. Needs 0.2. |
| 1.6 | **GNL 404 with "← Back to Services"** (X-08b) | 1 h | The link may be shared; a stock Next.js 404 is the one page that says "unfinished". |

### Tier 2 — Flow B (≈ 17 h, and see section 8)

| # | Item | Est. | Note |
|---|---|---|---|
| 2.1 | **PP-03 StudentAidNL service page** | 4 h | Biggest single new screen. |
| 2.2 | **PP-06 / PP-07 / PP-08** prerequisite trio | 4 h | PP-07 needs the shared method card to grow a 3rd option and an optional Back; PP-08 is ~1 h. |
| 2.3 | **PP-09..PP-19 via service config** | 4 h | *Eleven rows, zero new screens* — passport default, no back capture, StudentAidNL titles, §10.1 copy. This is the payoff from 0.3. |
| 2.4 | **PP-20 / PP-21 / PP-22 + dashboard card `href`** (PP-02) | 2 h | |
| 2.5 | **PP-23 Trusted (derived)** | 3 h | Not in Figma. Highest invention risk; nothing to diff. |
| 2.6 | **PP-04 / PP-05** Summary + Terms for StudentAidNL | 2 h | Only if 1.2/1.3 shipped parameterised. **First thing I would cut.** |

### Tier 3 — P1 in the brief, and I would cut most of it (≈ 9 h if all done)

| # | Item | Est. | My view |
|---|---|---|---|
| 3.1 | **Real QR from a hand-off URL** (§10.3) | 2 h | Do it *only if* a real phone is on stage (Q-20). Otherwise the placeholder reads identically from three metres and the presenter clicks through. |
| 3.2 | **Mock IDV provider interface** (§12.3) | 4 h | See the cost note below. **I would not build the full interface.** |
| 3.3 | **Phone-view window + `BroadcastChannel` sync** (§5, P1) | 3 h | The best moment in the demo if it works and the worst if it doesn't. Only with time to spare. |
| 3.4 | **Face-scan and capture animations** (§13) | 4 h | PM called it "nice to have". Cut. A live camera already runs on three screens — that is the realism beat, and it is free. |
| 3.5 | **NL-16 / NL-18 empty capture states** | 2 h | Blocked on Q-02 (the 48 px). Cut unless the answer arrives. |
| 3.6 | **Shift+D presenter panel** (§13.3) | 2 h | `DemoNav`'s arrows + Escape already cover the presenter's real needs. Cut. |

### Where I disagree with the brief's P0/P1/P2 split

1. **The brief has no P0 line for the toast, and it should be the first thing built.** §14 lists "no dead ends" as P0 and §10.5 puts the toast under "deliberate changes", but the toast *is* how ~30 controls stop being dead ends. It is 2 h and it improves screens that are otherwise already finished.
2. **"Flow B complete" as P0 is not achievable alongside everything else.** See section 8.
3. **The mock IDV provider (P1) is over-specified for a static export.** §12.3 asks for `createSession / getSession / update / submit / subscribe` with 300–800 ms fake latency, `localStorage` + `BroadcastChannel` + a 1 s polling fallback. In a statically-exported Next.js app with no server, all of that machinery exists to serve exactly one visible behaviour: *the desktop advances itself while the phone window drives*. **Cost:** ~4 h to build, plus it makes every CID page stateful where today they are static and individually addressable — which is what makes the presenter's ArrowRight recovery work if something goes wrong on stage. **Cheap version that still satisfies the demo:** keep the pages static; put one `gnl-demo:v1` object in `localStorage`; add a ~15-line `useStorageSync` hook listening to the `storage` event (which already fires cross-window, no `BroadcastChannel` needed) so the desktop hand-off page can watch for `status: submitted` and move on. That is ~1 h, delivers the same visible moment, and keeps the escape hatch. Build the full provider interface only if this becomes a real integration.
4. **`BroadcastChannel` specifically is unnecessary.** The `storage` event already covers the two windows the demo uses and needs no channel lifecycle. `BroadcastChannel` earns its place only for same-window-same-origin messaging the demo does not do.
5. **Animations (P1) should drop below Flow B's remainder.** A live camera already ships on three screens. That is more convincing than a simulated one, and it is done.

---

## 8. Flow B: does it fit before Monday?

**Not as 21 screens. As roughly 7 new screens plus a config, yes — but only if Tier 0 is done first and Tier 3 is cut.**

The number to correct: **21 BUILD rows is not 21 screens.** Eleven of them (PP-09..PP-19) are the *same ten routes* the demo already has, with different copy and two behaviour flags (`defaultDocument: PASSPORT`, `captureSides: ['front']`). `page-inventory.md` reached the same conclusion from the Figma side — ten of the twenty StudentAidNL frames are *instances* of Driver-and-Vehicle masters. The genuinely new screens are **PP-03, PP-06, PP-07, PP-08, PP-21, PP-22, PP-23** — seven — of which PP-06/PP-21/PP-22 are variants of components that already exist.

**Arithmetic.** Tier 0 (7 h) + Tier 1 (12 h) + Tier 2 (17 h) = **36 h** against ~28–32 h available. It is over by roughly a day, and that assumes no surprises in a refactor that touches 19 verified files with no pixel gate. **I do not believe all three tiers land by Monday.**

**What I would cut, in order:**

1. **All of Tier 3 (9 h).** Nothing in it changes whether the story lands. This alone is most of the gap.
2. **PP-04 / PP-05 (2 h)** — StudentAidNL Summary and Terms. Flow B can enter at the prerequisite check; the presenter has already shown those two screens in Flow A minutes earlier, and the script's Flow B leg is explicitly "same-device", i.e. faster.
3. **NL-04 / NL-05 (7 h)** if it comes to it. Painful, because the progress bar names them — but `page-inventory.md` already offered the defensible fallback: *"leave them and have the presenter enter the journey at the prerequisite check without drawing attention to the bar."* Cutting these two buys a whole day and lets Flow B finish. **I would cut these before I would cut Flow B**, because Flow B is a second *narrative* the client asked for, while NL-04/05 are existing-product boilerplate the audience has seen in every government portal.
4. **PP-23 (3 h)** last resort — end Flow B on PP-22 "Success!" rather than on a Trusted page. It weakens the ending and it is the one screen with no Figma reference, so it is also the one most likely to overrun.

**What I would not cut:** Tier 0 in full, NL-06, the state model, the NL-21 auto-advance, the 404, and PP-03/PP-07/PP-08. That set is ~20 h, fits comfortably, and produces a demo where both flows run end to end with no dead ends and nothing silently inert.

**Sequencing note.** Tier 0.3 (the service config) is the one irreversible decision. Done on Wednesday it makes Flow B cheap; started on Friday it becomes the reason Flow B does not ship. If it has not begun by end of Thursday, cut Flow B to a walkthrough of the Figma frames and say so in the presentation — which is also what `page-inventory.md` recommended, and I agree with it as the fallback, not as the plan.

---

## 9. Method and limits

- The running app was served from a real static export (`npm run build` clean, 19 routes, exit 0) with **`serve out`**, not `serve -s` — single-page-app mode rewrites every route to `index.html` and makes every route look like the login page. That mistake has been made here once already and is flagged in `scripts/responsive-check.mjs`.
- Screenshots this session: 6 routes × {1440, 393} with Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. `design/responsive/` (119 files, 320/390/768/1024/1280 for every route) was reused rather than regenerated. Rows judged by DOM/link inspection or by a prior pass's screenshot-verified record say so.
- Figma calls this session: `get_metadata` ×1 (`6217:66058`), `get_screenshot` ×2 (`6217:35183`, `6206:27601`). **Read-only. No write tool was called and no asset was downloaded.** Prior passes' reads were reused rather than repeated, per `page-inventory.md` and `verification-frame-map.md`.
- Gates run: `npm run responsive` **pass**, `npm run clicks` **pass**, `npx tsx scripts/visual-diff.ts` **FAIL (19/19 missing baseline)**.
- **Rows marked `[name]` are hypotheses.** That is most of Flow B — eleven StudentAidNL frames have never been rendered by anyone, and their contents are inferred from names, sizes and canvas position by analogy with the Driver-and-Vehicle row. If Flow B is confirmed for Tuesday, the first hour of that work should be screenshotting those frames, not coding them.

---

## Tier 0 — COMPLETE (2026-09-23)

All four foundation items shipped and verified. Scope decision taken by the user
this day: **cut all P1 work, keep both flows.** Nothing from the brief's P1 list
was built — no mock IDV provider, no phone-view window, no `BroadcastChannel`,
no animations, no presenter panel.

| # | Item | Status | Evidence |
|---|---|---|---|
| 0.1 | **Montserrat in the Yoti zone** | done | `@fontsource/montserrat` vendored via `next/font/local`, same pattern as Lato. Computed `font-family` sampled live at 393: `/cid/liveness/` and `/cid/country/` render **lato + montserrat**; `/cid/terms/` renders **lato only**. Correctly scoped per §11.9 — the Yoti zone uses Montserrat, GNL chrome does not. Closes Q-19 and a Definition-of-Done item. |
| 0.2 | **Self-baselines** | done | 20 files in `design/baselines/`, `npm run baseline` regenerates deliberately. `npm run diff` now reports **GATE: PASS**, 0.000% differing on every frame against a 0.8% budget — it previously exited `GATE: FAIL` with `SKIP … missing baseline` ×19. Header in `scripts/baseline.mjs` states plainly these are **self-baselines, not Figma exports**: they catch drift from today's verified state, not a pre-existing mismatch against Figma. Q-18 answered pragmatically, not closed. |
| 0.3 | **Toast — "Not part of this demo"** | done | `src/components/ui/DemoToast.tsx`. Overlay only — every frame holds its delta, so the gate stays green. Addresses §10.5 and §7.6. |
| 0.4 | **Service config + route parameterisation** | done | `src/lib/data/service-config.ts` with both `SERVICES` entries per §12.1, plus `getService()` and `serviceRoutes()`. Consumed by the onboard and confirmation pages. Flow A output unchanged — proved by the diff gate at 0.000%. |

### Gate results after Tier 0

| Gate | Result |
|---|---|
| `npm run build` | clean, 19 routes |
| `npm run shots` | 19 passed |
| **`npm run diff`** | **GATE: PASS** — 0.000% on every frame (was FAIL) |
| `npm run responsive` | exit 0 — no horizontal scroll at any width on any route; console clean |
| `npm run clicks` | exit 0 — forward + backward chain intact at 1440 / 768 / 390 |
| `npm run camera` | exit 0 — live path OK, tracks cleaned up, mock forceable |

### Note on the `driver-vehicle` literals

`serviceRoutes("driver-vehicle")` is passed as a **literal**, not resolved from a
default, in the pages under `src/app/services/driver-vehicle/`. That is
deliberate and documented at each call site: the route directory already fixes
the service, and resolving it from a default would make those pages silently
follow whatever the CertifiO ID screens happen to be running. Flow B gets its
own `src/app/services/studentaid/` directory (or the folder becomes a
`[serviceId]` segment) passing `"studentaid"`; everything else reads from config.

### What is next

Tier 1 (NL-04 Summary, NL-05 Terms, NL-06 Confirm Required, state model,
NL-21 auto-advance, 404) then Tier 2 (Flow B). The audit's estimate stands:
~29 h of work against the time to Monday 28 Sept, with Tier 3 already cut.

---

## Tier 1 — COMPLETE (2026-09-23)

All six items shipped and verified. The scope decision from Tier 0 still holds:
**all P1 work is cut, both flows are kept.** Nothing from the brief's P1 list was
built in this pass either — no mock IDV provider, no phone-view window, no
`BroadcastChannel`, no animations, no presenter panel.

The gap this pass closed is the one the audit called the most visible hole:
**NL-04, NL-05 and NL-06 did not exist.** They are the first three screens after
"Onboard", so until today the demo could not get from the service page to the
verification step by clicking, and the four-step progress bar named two steps
that were unreachable (X-09).

| # | Item | Status | Evidence |
|---|---|---|---|
| 1.1 | **NL-06 Confirm Some Details — Required** | done | `/services/driver-vehicle/confirm-details/`. **One component, two states**, as §8.1 requires: `src/components/onboarding/ConfirmDetailsCard.tsx` was *extracted* from the built NL-22 page, which now renders it with `state="confirmed"`. The file was not forked. Two proofs the extraction is faithful: `prereq-confirm` still diffs at **0.000%**, and the two baselines are pinned to the same 1440x997 so they can be diffed against **each other** — every differing pixel falls inside one box, x 489–1089 / y 425–574, i.e. the heading, the intro sentence and the requirement row. Chrome, card, stepper and actions row are pixel-identical. See `design/responsive/_tier1-confirm-two-states-1440.png`. |
| 1.2 | **NL-04 Summary** | done | `/services/driver-vehicle/summary/`. Copy verbatim from §8.1, progress **25 %**, four-step bar. **Q-01 answered in the brief's favour** — item 3 "Notification Settings" stays in the body copy, no fifth step invented; the tension is recorded in a comment on `SUMMARY`. |
| 1.3 | **NL-05 Terms and Conditions + checkbox validation** | done | `/services/driver-vehicle/terms/`. Full §8.1 copy including the consent paragraph, "Last modified: 2025-04-29" and "Version 4"; progress **50 %**; fixed 184px scroll box; the four scopes reuse `SHARED_DATA_SCOPES`. §7.4 rule implemented: "I Consent" with the box unticked shows the red message and **does not navigate**. **X-11 closed.** |
| 1.4 | **State model** | done | One `localStorage` store under **`gnl-demo:v1`**, per service, with the full §12.2 shape. Survives refresh and browser restart. Cross-window sync is the **`storage` event only** (~15 lines) — `BroadcastChannel` cut with P1, and `storage` already fires across windows. `/reset` added. **Q-17 settled in the brief's favour: Log Out keeps progress.** |
| 1.5 | **NL-21 auto-advance + completion toast** | done | 3000 ms (`processingMinMs`), then NL-22 with the toast "Identity verification complete", plus `aria-live` on the status block. **Armed as a one-shot by `/cid/verified/` and consumed on mount**, so it cannot fire on the Back path. |
| 1.6 | **GNL 404** | done | `src/app/not-found.tsx` → `out/404.html`, real 404 status, GNL chrome, "← Back to Services". |

### How the NL-21 advance was kept off the Back path

This is a **reversal** of a deliberate removal, and it is written down as one.
A 2.6 s auto-advance was deleted from `/auth/loading/` on 2026-09-22 because step
7's **Back** points at that screen and the timer turned Back into a round trip —
a control that looks right and does nothing, which is the exact failure the user
has caught by hand twice. `design/token-exceptions.md` §10.10 has the record.

The advance is now a **one-shot flag in the store**, not a timer on the screen:

* `/cid/verified/`'s Continue — the only forward entry — calls `markVerified()`,
  which sets `pendingAdvance: <serviceId>`.
* `ProcessingAdvance` calls `takePendingAdvance()` **on mount**, which reads and
  clears the flag in one step, and starts the 3 s timer only if it was armed.
* Arriving any other way — step 7's Back, ArrowLeft, a direct URL, `npm run
  shots`, `npm run responsive` — finds nothing armed and the screen stays put.
* The flag is consumed at mount rather than when the timer fires, so leaving
  early (the presenter's ArrowRight) also disarms it. There is no second firing.

`npm run clicks` asserts both directions, at all three widths:
**D1** the advance fires forward and the toast appears; **D2** it does **not**
fire when the screen is reached by Back — and D2 waits 4.2 s, longer than the
3 s advance, because a shorter wait would pass against the very bug it exists to
catch. The pre-existing **ArrowRight hop (step 16) still passes unchanged.**

### How the state model avoids a hydration mismatch

`src/app/layout.tsx` deliberately carries no `suppressHydrationWarning`, and one
hydration bug has already been reported here from exactly this cause. So:

* The provider starts at an **empty store** — the same value the server renders —
  and reads `localStorage` in an effect, i.e. after mount and after React has
  matched the server HTML. `ready` is false for that first paint and every
  consumer renders the `not_started` view then, which is also the correct first
  paint for a visitor who has never run the demo.
* There is no lazy `useState(() => read())` anywhere: that runs during render, on
  the client only, and is precisely the mismatch being avoided.
* **NL-06 Required and NL-22 Confirmed are two routes, not one store-driven
  route.** A single route would have rendered Required first and flipped to
  Confirmed a frame later on every load — a visible flash on stage and a race in
  the pixel gate. Two routes mean each one's server-rendered HTML is already the
  right state and no client read is involved. The *component* is still one.
* Writes only ever happen in effects or in click handlers, never during render.
  The screens that record progress do so through null-rendering client children
  (`TrackStep`, `MarkOnboarded`, `ProcessingAdvance`), which is also why four
  pages that would otherwise have become client components did not.
* **Gated, not asserted:** `npm run clicks` **D6** seeds a complete finished
  journey with `addInitScript` — so the value is in place before any page script
  runs — then hard-loads ten stateful routes with a console listener attached and
  fails on any React error. Clean at 1440, 768 and 390.

### Gate results after Tier 1

| Gate | Result |
|---|---|
| `npm run build` | clean, **23 route rows** (22 addressable + `/_not-found`), up from the 19 rows Tier 0 froze — **4 new routes**: `/services/driver-vehicle/{summary,terms,confirm-details}/` and `/reset/` |
| `npm run shots` | **22 passed** (19 + 3 new frames) |
| **`npm run diff`** | **GATE: PASS — 0.000% on all 22 frames**, including all 19 pre-existing ones |
| `npm run responsive` | exit 0 — no horizontal scroll at 320/375/393/768/1024/1280/1440/1920 on any of **23 routes** (19 + the 3 new wizard screens + the 404); console clean |
| `npm run clicks` | exit 0 — forward + backward chain intact at 1440 / 768 / 390, including the new front of the wizard, the checkbox error path, the auto-advance in both directions, reload survival, Log Out, `/reset` and hydration |
| `npm run camera` | exit 0 — live path OK, tracks cleaned up, mock forceable |

Per-frame diff, every frame at **0.000% differing** against a 0.8 % budget:
`login` · `dashboard` · `service` · **`summary`** · **`terms`** ·
**`prereq-required`** · `onboard` · `cid-continue-on-mobile` · `cid-terms` ·
`cid-biometric` · `cid-liveness` · `cid-liveness-capture` · `cid-country` ·
`cid-document` · `cid-capture-intro` · `cid-capture-front` · `cid-capture-back` ·
`cid-verified` · `auth-loading` · `prereq-confirm` · `confirmation` ·
`service-verified`.

**Baselines taken this pass:** the three new frames only. `terms` was then
re-taken **once**, inside the same pass that created it, when its consent box
became a fixed 184px scroll region — a design fix found by looking at the 393
render, recorded in `frames.json`. **No pre-existing frame was re-baselined**,
and none moved: all 19 read 0.000% before and after every step of this work.

### Derived geometry — say this out loud when the screens are reviewed

NL-04, NL-05 and NL-06 exist in Figma **only as pasted screenshots of the live
portal** — `6031:6242`, `6031:6243` and `6031:6301`. They are images: no text
layer, no addressable child node, nothing `get_design_context` can read and
nothing to measure. All three were read this session to confirm *structure* and
the progress percentages, and all three agree with §8.1 on every word.

So their **geometry is derived from the brief, not measured from a node**: the
copy is §8.1 verbatim, the box is the measured wizard (`6031:6304` /
`6217:81644`), and the type scale is §11's. Their `frames.json` rows say so, and
so does the header block on each page. Two values are genuinely invented and
need a designer's yes — see **Q-23**.

### Design read of the four wizard screens, side by side

`design/responsive/_tier1-wizard-1440.png` and `_tier1-wizard-393.png` place
Summary, Terms, Confirm Required and Choose verification service in a row at
both widths.

* They read as **one wizard**. Same 820px card, same 40px padding, same centred
  28px title, same right-aligned actions row, same 152px well. The bar advances
  **25 / 50 / 75 / 75** and the bold label tracks it.
* At 393 all four stack identically — full-width controls, primary on top —
  which is the ladder the built screens already used.
* **One real inconsistency, and it is the design file's.** The page heading is
  36px on Summary, Terms and Confirm Required (matching the measured NL-22) but
  **28px** on NL-07 "Services" and NL-23 "Success!". That step down between two
  consecutive screens is now visible on stage. NL-07 is a KEEP screen with a
  frozen baseline, so nothing was changed; raised as **Q-23**.
* **The most visible defect on the new screens is X-05, not the layout.** On
  NL-05 the "View your first name" and "View your last name" scope icons are the
  blank placeholder rectangles, and they sit four rows above a real checkbox — so
  at a glance the list reads as three unticked checkboxes. `icon-user-scope.svg`
  is a placeholder; the real Bootstrap `person-fill` is already vendored for the
  nav at a different colour. It is a one-file fix, but it moves the `service` and
  `service-verified` baselines, so it belongs in an assets pass and not here.

### What Tier 2 (Flow B) inherits — and what got harder

The audit's estimate for Tier 2 still stands at roughly 17 h, and three things
are now **easier** than it assumed:

* `ConfirmDetailsCard` already takes every per-service string as a prop, so
  **PP-06 and PP-21 are a page file each** — no new markup.
* NL-04 and NL-05 read `title`, `terms.name`, `lastModified` and `version` from
  the service config, so **PP-04 and PP-05 are mostly a directory copy**. The
  audit named these as "the first thing I would cut"; they are now cheap enough
  that cutting them buys very little.
* The store is keyed per service from the start, so Flow B needs no state work.

Three things are **harder or newly exposed**, and none of them was visible before
this pass:

1. **The Terms consent paragraph is still hardcoded for `driver-vehicle`.** Every
   other per-service string moved into `SERVICES`, but `TERMS.consentBody` did
   not, because Flow B's paragraph (§9 PP-05) is a *different text*, not a
   substitution. Add a `consent` field to `ServiceConfig` before building PP-05,
   or that screen will fork.
2. **The `/cid/` seam is now load-bearing in one more place.** `/auth/loading/`
   joined the list of screens that resolve their service from a literal —
   `ProcessingAdvance` has to know *whose* advance is armed, and `/cid/verified/`
   has to know *whose* verification succeeded. That is two more call sites for
   the single resolution point the service-config file warns about. It is still
   one function to change, but the cost of getting it wrong went up: arming the
   flag for the wrong service means the advance silently never fires.
3. **Seven routes now live under `src/app/services/driver-vehicle/` that Flow B
   must mirror, up from four.** If Tier 2 takes the `[serviceId]` segment route
   rather than a second directory, that is **seven page files** to move, three
   of which are new and none of which has a real Figma frame — so the
   `npm run diff` safety net covers less of that move than it did for Tier 0.
   Doing it as a copy of the directory is the lower-risk option and costs one
   duplicate file per screen.

One thing the audit flagged as a Tier 2 dependency is now closed: **PP-07's
"optional Back"** is no longer hypothetical — the method step has a visible Back
and it points at NL-06, which is exactly the arrangement PP-07 draws.
