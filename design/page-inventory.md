# Figma page inventory — every top-level frame, with build status

**File:** `Dc1bPoXX1VoB9v1MtLvu8e`
**Compiled:** 2026-09-22, for the dry run on Tuesday 29 Sept, 16:00.
**Method:** read-only. `get_metadata` (full tree of both pages) + 8 targeted
`get_screenshot` calls. Nothing in Figma was changed.

Purpose: so that on Tuesday nothing in the design is a surprise. Work top to
bottom. Buckets 1–6 are the inventory; the **prioritised gap list** is the part
to act on; the **unresolved** section is the part to take to the designer.

---

## Summary

The file has **two pages**, and both are readable — contrary to the note in the
brief, `0:1 Current design` *did* return its full tree on this run.

| Page | id | What it is |
|---|---|---|
| `CerifiO ID integration` | `6031:5860` | The design work. Both journeys live here. |
| `Current design` | `0:1` | **Reference only.** Screenshots of the *existing live* portal, taken 2024-03-12, plus one redrawn frame. Nothing here is a screen to build. |

### Counts

| | Count |
|---|---|
| Top-level objects ≥300×300 on `6031:5860` | 68 |
| — of which are designed screens | 43 |
| — of which are pasted screenshots standing in for a screen | 6 |
| — of which are containers, banners, notes, asset-export scratch | 19 |
| Designed screens, Driver and Vehicle journey | 23 |
| Designed screens, StudentAidNL journey | 20 |
| Designed screens on page `0:1` | 1 (reference — see bucket 6) |
| **Designed screens in the file, total** | **44** |
| **Built** (routes in `src/lib/flow.ts`) | **19** |
| **Not built, Driver and Vehicle** | **2 screens + 4 image-only steps** |
| **Not built, StudentAidNL** | **20** |
| **Reference / stale / never-to-be-built** | the remainder, incl. ~45 screenshots on `0:1` |

> The "442 frames" figure from the earlier pass is a count of every `<frame>`
> element at every nesting depth — buttons, rows, icon boxes. It is not 442
> pages. The page-level count is the 68 above.

### About the coordinates in these tables

Figma reports child coordinates **relative to the enclosing section**, not to the
canvas. Three different frames of reference are in play, so every table below
names the parent. The three rows referred to in conversation are:

| Row | y | Parent | Contents |
|---|---|---|---|
| Yoti cluster | 779 | section `6088:32338` `Yoti` | The 9 CID/Yoti capture screens of the D&V journey |
| Row A | 2341 / 2345.64 | section `6218:83241` `Non-residents: Passport` | StudentAidNL, end to end |
| Row B | 3563 | section `6145:58450` `NL residents: Driver's License` | Driver and Vehicle main row |

On Row B **canvas x-order is flow order** (established over nine consecutive
frames in `verification-frame-map.md` §1, and reconfirmed here). The Yoti section
sits at x=16157–20847 *inside* Row B's x-range, between `CID_Biometric` (15650)
and `CID_ID_success` (20967) — i.e. the Yoti cluster is the inline expansion of
the middle of Row B, and its internal x-order is flow order too.

### Confidence marking

Every row is marked:

- **[seen]** — I rendered it this session and describe what I saw.
- **[seen-prev]** — screenshot-verified in `design/verification-frame-map.md`;
  reused, not redone.
- **[name]** — judged from name, size and canvas position only. Treat as a
  hypothesis, not a fact.

---

## Bucket 1 — Driver and Vehicle, BUILT (19)

All 19 match `design/frames.json` and `src/lib/flow.ts`. Verified by
cross-checking every node id, width and height against the metadata tree; all 19
agree. No action needed on any of these.

**Updated 2026-09-23:** rows 8 and 9 are the two liveness-check screens, moved
up from bucket 2a. They were **P1** on the gap list below and are now built as
`/cid/liveness/` and `/cid/liveness-capture/`. **The step-3 gap is closed** — see
"P1 — DONE" below and `design/token-exceptions.md` §12.

Parent: section `6145:58450` unless the row says `Yoti`.

| # | Node id | Name | W×H (exact) | x | y | Route |
|---|---|---|---|---|---|---|
| 1 | `6206:23558` | `mygovnl-login-page` | 1440 × 1880.2152099609375 | 310 | 3563 | `/` |
| 2 | `6206:23559` | `mygovnl-services-dashboard` | 1440 × 1889.2730712890625 | 2124 | 3563 | `/dashboard/` |
| 3 | `6031:6244` | `driver-vehicle-service-page` | 1440 × 1072.2152099609375 | 4432.06 | 3563 | `/services/driver-vehicle/` |
| 4 | `6031:6304` | `driver-vehicle-prerequisite-check` | 1440 × 1253.2152099609375 | 11662.58 | 3563 | `/services/driver-vehicle/onboard/` |
| 5 | `6217:62059` | `CID_Redirect to mobile` | 1440 × 1161.1964111328125 | 13340.17 | 3563 | `/cid/continue-on-mobile/` |
| 6 | `6217:62834` | `CID_TU` | 393 × 810.810546875 | 15130 | 3563 | `/cid/terms/` |
| 7 | `6217:62835` | `CID_Biometric` | 393 × 834.810546875 | 15650 | 3563 | `/cid/biometric/` |
| 8 | `6217:65268` | `CID_Biometric` | 393 × 1282.44091796875 | 44.87 *(Yoti)* | 779 | `/cid/liveness/` |
| 9 | `6217:65271` | `CID_Biometric` | 393 × 1231.810546875 | 553.87 *(Yoti)* | 779 | `/cid/liveness-capture/` |
| 10 | `6217:66054` | `CID_ID1_Country` | 393 × 1060.810546875 | 1076.87 *(Yoti)* | 779 | `/cid/country/` |
| 11 | `6087:31396` | `CID_ID1` | 393 × 1168.810546875 | 1591.37 *(Yoti)* | 779 | `/cid/document/` |
| 12 | `6217:66055` | `CID_ID1_Front_instruction` | 393 × 994.810546875 | 2105.87 *(Yoti)* | 779 | `/cid/capture-intro/` |
| 13 | `6056:19118` | `CID_ID1` | 393 × 1174.810546875 | 3178.74 *(Yoti)* | 779 | `/cid/capture-front/` |
| 14 | `6057:20924` | `CID_ID1` | 393 × 1174.810546875 | 4251.62 *(Yoti)* | 779 | `/cid/capture-back/` |
| 15 | `6217:66058` | `CID_ID_success` | 393 × 1014.810546875 | 20967.30 | 3604 | `/cid/verified/` |
| 16 | `6217:80871` | `Provider page_IDV results status` | 1440 × 1078.1964111328125 | 21813.71 | 3563 | `/auth/loading/` |
| 17 | `6217:81644` | `Driver and Vehicle_Prerequisite confirmed` | 1440 × 996.2152099609375 | 23416.06 | 3563 | `/services/driver-vehicle/prerequisite/` |
| 18 | `6217:82446` | `driver-vehicle-confirmation` | 1440 × 1024 | 25108.81 | 3563 | `/services/driver-vehicle/confirmation/` |
| 19 | `6257:72314` | `driver-vehicle-service-page_verified` | 1440 × 1792.2152099609375 | 27206.39 | 3563 | `/services/driver-vehicle/?verified=1` |

---

## Bucket 2 — Driver and Vehicle, NOT BUILT

### 2a. Missing designed screens (2)

> **BUILT 2026-09-23 — the two liveness-check screens have moved to bucket 1.**
> `6217:65268` → `/cid/liveness/` and `6217:65271` → `/cid/liveness-capture/`.
> They were **P1** on the gap list below and were the significant find of the
> previous pass. **The step-3 gap in the sub-step counter is now closed**: the
> pill runs 1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 5 across ten CID screens, with
> no number skipped, and every value verbatim. Open conflict **C4** from
> `verification-frame-map.md` ("nothing in the file displays `step 3 of 5`") is
> **resolved**: two frames display it, and it was a missing screen — twice over
> — not wrong stepper copy. Full write-up in `design/token-exceptions.md` §12.
>
> Both frames were invisible to four earlier audits because they are named
> `CID_Biometric`, the same name as the built consent screen `6217:62835`.

These are the real, designed frames in the D&V journey that still have no route.

| Node id | Name | W×H (exact) | x | y | Parent | What it is |
|---|---|---|---|---|---|---|
| `6102:103451` | `CID_ID1` | 393 × 810.810546875 | 26621.83 | 3563 | `6145:58450` | Mobile (393) twin of the desktop confirmation `6217:82446` — same "Success!" heading, same CTA. Not a CID verification screen despite the name. **[seen-prev]** (`verification-frame-map.md` §3) |
| `6097:23625` | `driver-vehicle-mobile` | 393 × 2786.810546875 | 28754.83 | 3563 | `6145:58450` | Mobile (393) twin of the verified service page `6257:72314`, including the "Skip the paper copy" digital-wallet upsell. **[seen-prev]** (§1, §3) |

Both remaining entries are **mobile twins of desktop screens that are already
built**, so neither is a hole in the journey — see **P3** below.

### 2b. Journey steps that exist ONLY as pasted screenshots (4)

These are `rounded-rectangle` image fills, not frames. They sit in flow order on
Row B between the service page (4432.06) and the built prerequisite check
(11662.58), and the designer labelled each one with a text node above it. There
is **no designed frame for any of them** — anyone building them works from the
image.

All four are steps of the *same* onboarding wizard whose progress bar reads
`Summary › Terms and Conditions › Prerequisite Check › Ready to Use` — the bar
that is already visible on the built `/onboard/` screen.

| Node id | Name | W×H | x | y | Designer's label | What it is |
|---|---|---|---|---|---|---|
| `6031:6242` | `image 4` | 1440 × 1155.75 | 6352.06 | 3563 | "Summary" (`6206:26604`) | **Wizard step 1.** Modal card, "Welcome to Driver and Vehicle", a numbered list (1. Terms and Conditions, 2. Verification, 3. Notification Settings), `Cancel` / `Continue`. **[seen]** |
| `6031:6243` | `image 5` | 1440 × 1400.25 | 8204.36 | 3563 | "Terms and Conditions" (`6206:26562`) | **Wizard step 2.** "Terms and Conditions — Driver and Vehicle Services", version 4 dated 2025-04-29, scrollable consent text, "By Accepting This Policy You're Allowing To:" data list, an "I have read and accept" checkbox, `Cancel` / `Back` / `I Consent`, and an `I Do Not Consent` link. **[seen]** |
| `6031:6301` | `image 6` | 1440 × 979.5 | 9900.73 | 3563 | "Prerequisite check" (`6206:26561`) | **Wizard step 3, pre-verification state.** "Confirm Some Details", one requirement row "Must have a valid driver's license" marked **Required** in red, `Cancel` / `Back` / `Continue`. The built `/onboard/` (`6031:6304`, 1253 tall) is the *next* state of this same step. **[seen]** |
| `6102:101142` | `image 23` | 993 × 510 | 25108.81 | 2864.86 | "Notifications preference page - IIRC GNL?" (`6098:101130`) | **A proposed extra wizard step: "Notification Settings".** Its stepper reads `Summary › Terms and Conditions › Prerequisite Check › Notification Settings › Ready to Use` — five steps, not four. "Please select how you would like to receive notifications from this service", By Email / By SMS toggles, `Cancel` / `Back` / `Continue`. Header reads "Driver's License Renewal", not "Driver and Vehicle". **[seen]** — **do not build without a decision; see unresolved U1.** |

### 2c. Component masters — NOT separate screens (2)

Listed so nobody re-discovers them and files them as gaps. Already investigated
and settled as duplicates in `verification-frame-map.md` **C7**.

| Node id | Name | W×H | x | y | Status |
|---|---|---|---|---|---|
| `6217:66056` | `CID_ID1_Front camera` | 393 × 1222.810546875 | 2628.87 *(Yoti)* | 779 | Master of the built `6056:19118` (1174.81). **48 px taller.** Build uses the instance. **[seen-prev]** |
| `6217:66057` | `CID_ID1_back camera` | 393 × 1222.810546875 | 3701.74 *(Yoti)* | 779 | Master of the built `6057:20924` (1174.81). Same 48 px delta. **[seen-prev]** |

The 48 px question is a design decision, not a build one — carried forward as
unresolved **U2**.

---

## Bucket 3 — StudentAidNL journey (20 screens + 2 image steps)

The second service: the non-resident / passport path. **Nothing here is built.**
Parent for every row: section `6218:83241` `Non-residents: Passport - Integrating
IDV into C1`. Row A, y = 2341 (chrome) / 2345.64 (CID screens).

It mirrors the D&V row step for step. Ten of the twenty are *instances* of D&V
masters — meaning much of it is already built in substance and would mostly need
copy and routing, not new layout.

| Node id | Name | W×H (exact) | x | y | What it is |
|---|---|---|---|---|---|
| `6206:23560` | `mygovnl-login-page` | 1440 × 1880.2152099609375 | 310 | 2341 | Instance of the built login. **[name]** |
| `6206:23561` | `mygovnl-services-dashboard` | 1440 × 1889.2730712890625 | 2124 | 2341 | Instance of the built dashboard. **[name]** |
| `6206:25424` | `StudentAidNL-service-page` | 1440 × 1469.2152099609375 | 4432.06 | 2341 | Service page, pre-verification. "Confirmation required" badge, "To Use This Service We Need to Verify It Is You" card with an `Onboard` button, a locked "Access the StudentAid Portal" row, Data & Privacy and Contact panels naming the Dept. of Education and Early Childhood Development. Structurally the twin of the built `6031:6244`. **[seen]** |
| `6206:26558` | `image 31` | 1440 × 925.5 | 6388.26 | 2341 | Pasted screenshot. Labelled "Summary" (`6206:26611`). StudentAidNL twin of `6031:6242`. **[name]** |
| `6206:26722` | `image 32` | 1440 × 1186.5 | 8298.51 | 2341 | Pasted screenshot. Labelled "Terms and Conditions" (`6206:26610`). Twin of `6031:6243`. **[name]** |
| `6206:27501` | `StudentAidNL_Prerequisite check_01` | 1440 × 888.019287109375 | 9962.62 | 2341 | Prerequisite check, state 1. **[name]** |
| `6206:27601` | `StudentAidNL_Prerequisite check_02` | 1440 × 1468.2152099609375 | 11709 | 2341 | Prerequisite check, state 2 — the tall one; by analogy with D&V (`6031:6304`, 1253) this is the verification-method chooser. **[name]** |
| `6217:35183` | `StudentAidNL_Prerequisite check_03` | 1440 × 1030.2152099609375 | 13398.39 | 2341 | Prerequisite check, state 3. The D&V row has no third state. **[name]** |
| `6217:62060` | `CID_Redirect to mobile` | 1440 × 1161.1964111328125 | 15087.78 | 2341 | Instance of the built `6217:62059`. **[name]** |
| `6217:66060` | `CID_TU` | 393 × 816.810546875 | 17039.78 | 2345.64 | Instance of built `/cid/terms/`. **[name]** |
| `6217:66061` | `CID_Biometric` | 393 × 840.810546875 | 17559.78 | 2345.64 | Instance of built `/cid/biometric/`. **[name]** |
| `6217:66069` | `CID_Biometric` | 393 × 1295.44091796875 | 18068.78 | 2345.64 | Instance of the **unbuilt liveness screen 1** (`6217:65268`). **[name]** |
| `6217:66070` | `CID_Biometric` | 393 × 1244.810546875 | 18577.78 | 2345.64 | Instance of the **unbuilt liveness screen 2** (`6217:65271`). **[name]** |
| `6217:66071` | `CID_ID1_Country` | 393 × 1073.810546875 | 19100.78 | 2345.64 | Instance of built `/cid/country/`. **[name]** |
| `6217:66072` | `CID_ID1` | 393 × 1197.810546875 | 19615.28 | 2345.64 | Document selection, **passport pre-selected** rather than driver's licence. **[seen-prev]** (§2) |
| `6217:66151` | `CID_ID1_Front_instruction` | 393 × 1007.810546875 | 20129.78 | 2345.64 | Instance of built `/cid/capture-intro/`. **[seen-prev]** (§2) |
| `6217:76798` | `CID_ID1_Front camera` | 393 × 1187.810546875 | 20652.78 | 2345.64 | Passport capture, front. **[seen-prev]** (§2) |
| `6217:66154` | `CID_ID1` | 393 × 1187.810546875 | 21202.65 | 2345.64 | Passport capture; document image is a **passport**. **[seen-prev]** (§2) |
| `6217:66062` | `CID_ID_success` | 393 × 1020.810546875 | 21764.63 | 2345.64 | Instance of built `/cid/verified/`. **[name]** |
| `6217:80873` | `Provider page_IDV results status` | 1440 × 1078.1964111328125 | 22544.15 | 2347 | Instance of built `/auth/loading/`. **[name]** |
| `6217:80071` | `StudentAidNL_Prerequisite confirmed` | 1440 × 1020.2152099609375 | 24309.55 | 2341 | Twin of the built `6217:81644`. **[name]** |
| `6217:82447` | `driver-vehicle-confirmation` | 1440 × 1024 | 25918.53 | 2337.22 | **An instance of the *Driver and Vehicle* confirmation, reused unchanged on the StudentAidNL row.** Name and content both say Driver and Vehicle. See unresolved **U3**. **[name]** |

Note: the StudentAidNL row has **no** post-verification service page — Row B ends
with `driver-vehicle-service-page_verified` (`6257:72314`) and a mobile twin;
Row A stops at the confirmation. The journey is designed one screen shorter.

**Not a dry-run hazard as things stand:** the built dashboard's StudentAidNL card
is deliberately inert — `src/lib/data/services.ts` gives an `href` to the Driver
and Vehicle card only, "so the presenter must not be able to click into an
unbuilt screen on stage". That safeguard already exists; leave it in place.

---

## Bucket 4 — Portal & account: registration, password, 2FA, notifications

**There are no designed screens for any of this, in either page.** This bucket is
empty of build work, and that is a finding rather than an omission.

Evidence:

1. I pattern-matched every node name in the `6031:5860` tree (all depths) against
   `registr|password|2fa|two-factor|notif|account|recover|sign-up|mfa|otp|email`.
   The only hits are navigation chrome ("Account", "Notifications" links in the
   top-nav and footer), service-card copy about *vehicle* registration, and the
   one annotation about a notifications preference page (bucket 2b,
   `6102:101142`).
2. Page `0:1 Current design` — which is where this material lives — is entirely
   **pasted screenshots of the existing live portal**, every one named
   `Screenshot 2024-03-12 at 12.xx` and sized 1970 × 1161 (a retina browser
   capture, not a 1440 design frame). They are grouped under banner headings the
   designer typed:

   | Banner | Node | y | Screenshots |
   |---|---|---|---|
   | `Account creation` | `1:64` | −6266 | `1:2`, `1:3`, `1:4`, `1:5`, `1:6`, `1:7`, `1:8`, `1:55`, `1:56` |
   | `Add service` | `1:66` | −4009 | `1:9`, `1:10`, `1:11` |
   | `Driver and Vehicle` | `1:70` | 1118 | `1:16`, `1:17`, `1:18` + the one real frame `6076:24415` (bucket 6) |
   | `MCP` | `1:72` | 4077 | `1:19`, `1:20`, `1:21`, `1:60`, `1:61` |
   | `Learner's permit` | `1:74` | 6827 | `1:22`, `1:23`, `1:24`, `1:25`, `1:26` |
   | `Wood cutting` | `1:76` | 9352 | `1:27`, `1:28` |
   | `PHR` | `1:78` | 11555 | *(banner only)* |
   | `Account - email` | `1:80` | 14462 | `1:29`–`1:38` (10) |
   | `Account - change password` | `1:82` | 17316 | `1:39`, `1:40`, `1:41` |
   | `Account - 2FA` | `1:84` | 19823 | `1:42`–`1:48` (7) |
   | `Notificaitons` *(sic)* | `1:86` | 22127 | `1:49`, `1:50` |

The page is called **"Current design"** in the sense of *the current live
product* — as-is material gathered for context, not to-be design. Nobody designed
a registration, password-recovery, 2FA or notifications screen for this project.

**I agree with the owner's scoping: all of this is out of scope, and it is out of
scope because it was never designed, which is a stronger reason than "we decided
to cut it."** Nothing can go missing from the presentation here.

---

## Bucket 5 — Alternate dashboards / service pages

| Node id | Name | W×H | x | y | Parent | Verdict |
|---|---|---|---|---|---|---|
| `6247:73618` | `mygovnl-services-dashboard` | 1440 × 1818 | 3570.00 | 7116.45 | canvas `6031:5860` | **Not a competing design — a pasted screenshot.** **[seen]** |
| `6206:23559` | `mygovnl-services-dashboard` | 1440 × 1889.2730712890625 | 2124 | 3563 | `6145:58450` | **Current.** This is the one that is built. |

`6247:73618` renders as a complete services dashboard ("Welcome Jason Momoa!",
ten service cards, purple "Tell us what you think" band), which is why it reads
as an alternate design. It is not one. Its entire content is a single full-bleed
image: child `6247:73619` `image 2`, 1440 × 1818, at exactly the parent's
position and size. Its only other child is `6247:73620` `Frame 27`, a comment box
containing the text "**Jason Momoa!**" — the designer flagging the placeholder
name in the screenshot.

It also sits alone at y = 7116, ~3,500 px below Row B and outside both sections,
which is where reference material is parked on this canvas, not where journey
screens live.

**Current dashboard for the build: `6206:23559`.** No change needed.

---

## Bucket 6 — Reference / stale / duplicate

| Node id | Name | W×H | x | y | Parent | Evidence it is not a screen to build |
|---|---|---|---|---|---|---|
| `6076:24415` | `driver-vehicle-dashboard` | 1440 × 1388 | −3104 | 1755 | canvas `0:1` | A designed frame — tabs (Actions / Notifications / Terms of use / Unlink service), linked items (licence, address, 2015 CHEV IMT, utility trailer), Reminders, Recently updated. **Superseded reference.** It sits on the reference page under the `Driver and Vehicle` banner, surrounded by 2024 screenshots of the live product; it has **no MyGovNL top-nav and no footer**, unlike every frame in the journey; its `6076:*` id block predates the `6217:*`/`6257:*` journey work. The journey's own post-verification screen is `6257:72314`, which uses the content-left + sidebar-right layout, not this tab bar. Reads as the live product redrawn for reference. **[seen]** — see unresolved **U4** |
| `6151:58451` | `Context` | 1440 × 1024 | −1025 | 3771 | canvas `6031:5860` | Meeting notes. Two text nodes describing GNL's problem statement. Not a screen. **[name]** |
| `6119:45417` | `Frame 22` | 27616 × 610 | 310.39 | 1062 | `6145:58450` | Row title banner: "NL residents: Driver's License - Integrating IDV into C1". **[name]** |
| `6206:26241` | `Frame 26` | 27616 × 610 | 310.39 | 854.17 | `6218:83241` | Row title banner: "Non-residents: Passport - Integrating IDV into C1". **[name]** |
| `6238:48483`, `6241:47291`, `6244:64027`, `6257:72311`–`72313`, `6245:66574`, `6246:66575`–`66577`, `6259:78188`, `6257:72309`–`72310` | `image 39`, `Rectangle 6`–`15`, `Line 6`–`7` | various | −3833 … −2810 | 3905 … 5628 | canvas `6031:5860` | **Asset-request scratch pad.** Crop boxes and callout lines drawn over a screenshot of the frame list, annotated by `6241:47290` ("Three to watch: #3 and #11 are both called driver-vehicle-service-page… PNG at 1× please, frame name as the filename"). Working notes for an export hand-off. **[name]** |
| `6259:78191`, `6259:78194`, `6259:78197`, `6260:78440`–`78479` | `image 41`–`43`, `Rectangle 16`–`23`, `Line 8`–`9`, `Vector 4`–`5`, two `✅` | various | −3829 … −1849 | 5866 … 7168 | canvas `6031:5860` | **Icon/logo export scratch pad.** Text node `6259:78189` lists 33 assets by name (Logos/brand 6, Nav & chrome 8, Cards & lists 9, Verification & status 7, CID stepper dots 3) with crop marks and two ticks. Working notes. **[name]** |
| `6088:32338` | `Yoti` *(section)* | 4690 × 2774 | 16157.43 | 2825 | `6145:58450` | Container, not a screen. Holds the nine CID capture screens; annotated by `6217:66247` "Yoti app (embed code) below the stepper and above the footer starts here… We have no control over its look and feel." **[name]** |
| `6065:23367` | *(was `service-verified`)* | — | — | — | — | **Deleted from the file.** `get_metadata` returns not-found. Superseded by `6257:72314`. **[seen-prev]** (§2) |
| ~45 nodes `1:2`–`1:62` | `Screenshot 2024-03-12 at 12.xx` | 1970 × 1161 each | various | various | canvas `0:1` | Screenshots of the existing live portal. See bucket 4. **[seen]** (page structure) |

---

## Prioritised gap list for the dry run

My judgement, most valuable first. Criterion: does its absence break a journey the
presenter will actually walk on Tuesday? Scope taken as given — happy path only,
desktop, no backend, simulated verification.

### P1 — The two liveness-check screens. ✅ **DONE — built 2026-09-23.**

`6217:65268` → **`/cid/liveness/`** ("Prepare to scan your face")
`6217:65271` → **`/cid/liveness-capture/`** ("Position your face within the frame.")
Inserted in `FLOW` between `/cid/biometric/` and `/cid/country/`, exactly as
this entry called for. `/cid/biometric/`'s "I agree" was re-pointed from
`/cid/country/` to `/cid/liveness/` in the same change.

(The route name suggested here was `/cid/liveness-intro/`; it shipped as
`/cid/liveness/`, which reads better in a URL bar on stage. The second is
unchanged.)

What the build settled, against each reason this was ranked first:

- **It is on the walked path.** Both screens are in `FLOW`, and
  `scripts/click-through.mjs` asserts every hop through them **forward and
  backward** at 1440 / 768 / 390.
- **The step counter is no longer wrong.** It runs
  1 → 2 → **3** → **3** → 4 → 4 → 4 → 4 → 4 → 5 — no number skipped. Note it is
  **3 twice**, not once: *both* frames carry `step 3 of 5`, verbatim, exactly as
  five consecutive screens carry `step 4 of 5`. The pill counts CID's five
  sub-steps, not screens. Nothing was renumbered. **C4 is closed.**
- **Liveness is now demonstrated.** `/cid/liveness-capture/` opens the **front**
  camera (`facingMode="user"`) over the Figma viewport, reusing the existing
  `CameraViewport` rather than a second implementation, with the flat `#e9ebe8`
  panel Figma draws as its silent fallback when the camera is denied, missing,
  busy or forced off with `?mock=1`. `npm run camera` gates the live path.
- **Cheap, as predicted.** Two 393-wide `CidScreen` pages, the same stepper
  component, five new placeholder assets, no new pattern and no backend.

Gates after the change: `npm run build` clean (17 → 19 routes),
`npm run responsive` exit 0, `npm run clicks` exit 0, `npm run camera` exit 0,
and **no existing frame moved** — every one holds its previous dH.

### P2 — Onboarding wizard steps 1 and 2 (Summary, Terms and Conditions).

`6031:6242` (Summary) and `6031:6243` (Terms and Conditions).

Why second: they are the first thing after the presenter clicks `Onboard`, and
the built `/onboard/` screen *displays the progress bar that names them*. A
viewer sees a four-step bar and watches the demo start at step 3. It is a visible
seam, early, in front of everyone.

Why not first: they exist **only as pasted screenshots**, so they must be rebuilt
from an image rather than from a frame — materially more work than P1, and with
no frame there is nothing to diff a baseline against. Their content is also
existing-product boilerplate (a welcome list, a consent form), not the IDV story
the demo is about. If time is short, a defensible alternative is to leave them
and have the presenter enter the journey at the prerequisite check without
drawing attention to the bar.

### P3 — Mobile counterparts, only if a phone will be shown.

`6102:103451` (mobile confirmation) and `6097:23625` (mobile verified page).

The demo is desktop-first and `FLOW` has no mobile route. These matter only if
the presenter intends to show the hand-off landing on a phone. **Ask the
presenter; do not build speculatively.** Note the asymmetry if they do: the
journey already renders six 393-wide CID screens, so a viewer may reasonably
expect the *end* of the journey to exist on mobile too.

### P4 — StudentAidNL journey (20 screens).

A whole second service, currently zero built. Ten of the twenty are instances of
masters the build already has, so it is less work than 20 screens implies — but
it is still the largest item on this list by a wide margin, and it is a *second*
narrative rather than a gap in the first.

The dashboard card is already inert, so nothing breaks if it is skipped. Out of
scope for Tuesday in my judgement. Worth a sentence in the presentation ("the
same flow covers the non-resident passport path, designed here") rather than a
build.

### P5 — The Notification Settings wizard step. Do NOT build; get a decision.

`6102:101142`. The designer's own annotation is a question — "Notifications
preference page - IIRC GNL?" — and this step would make the wizard five steps
where the built `/onboard/` bar shows four. Building it on a guess makes the
progress bar wrong in a *new* way. See U1.

### Explicitly out of scope — and I agree

**Account management, 2FA, password change, password recovery, registration,
notifications preferences.** Not because they were cut, but because **no designed
screen for any of them exists in this file** (bucket 4). Everything under those
headings is a 2024 screenshot of the live product, gathered as context. There is
nothing here that can go missing on Tuesday. I would not spend a minute of the
remaining time on this, and I would not put it on the list at all except to say
so plainly.

---

## Cannot be resolved from Figma alone

Five items. Each needs a person, not another read.

**U1 — Is "Notification Settings" a step in the onboarding wizard, or not?**
The evidence is contradictory and the designer flagged it as a question.
*For:* `6102:101142` shows a five-step bar including it, and the wizard's own
step 1 (`6031:6242`) lists "3. Notification Settings" as something the user will
be asked for. *Against:* the built `/onboard/` (`6031:6304`) and the three
image-only steps all show a four-step bar without it, and the annotation
`6098:101130` is literally a question ("IIRC GNL?"). Also, the screenshot's header
says "**Driver's License Renewal**", not "Driver and Vehicle" — it may be lifted
from a different service entirely. **Ask the designer.** Affects whether the
progress bar reads four steps or five, which is visible on a screen already
built.

**U2 — The capture screens' 48 px.** Carried over from
`verification-frame-map.md` **C7**, unchanged and still open. `6217:66056` /
`6217:66057` (masters, 1222.81) vs `6056:19118` / `6057:20924` (instances, built,
1174.81). Is the extra 48 px a newer design the instances have not picked up, or
an older master the instances deliberately override? A design decision. The build
uses the instances and was not switched.

**U3 — The StudentAidNL row ends with a Driver and Vehicle confirmation.**
`6217:82447` at x=25918.53 on Row A is an instance of `driver-vehicle-confirmation`,
name and content both. Either the StudentAidNL journey is meant to end on its own
confirmation that has not been drawn yet, or this is a placeholder nobody
swapped. Related: Row A has **no** post-verification service page at all, where
Row B has one plus a mobile twin. **Ask the designer whether the StudentAidNL
journey is finished.** No consequence for Tuesday if StudentAidNL stays out of
scope.

**U4 — Is `6076:24415` `driver-vehicle-dashboard` dead, or is it a screen the
journey is missing?** I read it as superseded reference (bucket 6) and the
evidence is decent — reference page, no portal chrome, older id block, different
layout from the built verified page. But it is a *designed frame*, not a
screenshot, and it is the only one on that page, which is odd for pure reference.
If it is live, the verified service page is missing a tab bar (Actions /
Notifications / Terms of use / **Unlink service**) that the built `6257:72314`
does not have — and "Unlink service" is a capability nothing else in the file
shows. **Worth one question to the designer.** My confidence it is stale:
medium-high, not certain.

**U5 — Height rounding, `ceil` vs `round`.** Carried over from
`verification-frame-map.md` **C3**, still unsettled. `997` vs `996` for
`6217:81644`; `1793` vs `1792` for `6257:72314`. One pixel, but it moves
screenshot-diff baselines. Whoever owns the baselines should just decide.

---

## Method, and what this inventory does not cover

- Enumeration is from the complete `get_metadata` tree of `6031:5860` (parsed
  from the spill at
  `/root/.claude/projects/-home-claude/3ed50276-51d6-59f2-80ba-a7bedde778f7/tool-results/mcp-Figma-get_metadata-1790086652254.txt`,
  which closes cleanly on `</canvas>` and is not truncated) plus a live read of
  `0:1`. Top-level enumeration is complete for both pages.
- **One real limit:** `get_metadata` does not expand the internals of `symbol`
  nodes (component masters). Fourteen symbols on `6031:5860` returned no
  children. This does not affect the page inventory — masters are placed at top
  level and are all listed — but a screen that existed *only* nested inside a
  master would not appear here. I have no evidence any does.
- Eight frames were rendered this session: `6217:65268`, `6217:65271`,
  `6247:73618`, `6206:25424`, `6031:6242`, `6031:6243`, `6031:6301`,
  `6102:101142`, `6076:24415`. Everything else is marked `[seen-prev]` (reused
  from `verification-frame-map.md`) or `[name]` (judged from name, size and
  canvas position). **Anything marked `[name]` is a hypothesis.** The
  StudentAidNL prerequisite-check states in particular are named by analogy with
  the D&V row, not by looking at them.
- No Figma write tool was called. No assets were downloaded.
