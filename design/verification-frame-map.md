# Driver and Vehicle — verification frame map

Read-only Figma audit of `Dc1bPoXX1VoB9v1MtLvu8e`, 2026-09-22.
No Figma node was created, edited, moved or deleted. Only `get_metadata` and
`get_screenshot` were called.

> **READ §12 FIRST.** Three frames this document reports as *not found* or
> *unaddressable* — G5 (mobile hand-off), G1 (country selection) and G2/C2
> (capture instructions) — have since been located and built. §12 is the
> addendum; §§1, 5, 9 and 10 below are the original audit and are stale on
> exactly those three points. §12 also records **two open questions for a
> human**: C7, the capture screens existing as components and instances at
> heights 48 px apart, and C4, the sub-step counter that still skips 3.

## Tooling limitation that shapes this document — read first

The file has two pages. `get_metadata` with no `nodeId` lists **only one**:

- `0:1` — **Current design** (enumerable; contains none of the CID work)
- `0:2` — **CertifiO ID integration** (exists, but **cannot be enumerated**)

Requesting `0:2` — by `get_metadata` *or* `get_screenshot` — returns
`"This is an invalid node selection. Ask the user to select a node from a visible
page on the canvas."` Requesting `0:3` returns a clean *not found*, so `0:2` is
real; the MCP server simply refuses page-level reads for any page that is not the
one currently open in the Figma desktop app.

Individual nodes on `0:2` resolve normally. So everything below was reached by
addressing node ids directly. **Nothing below is a complete listing of the page**,
and absence of evidence here is not proof of absence in Figma. Where I say
something "does not exist", I mean "no frame I could address is it, and the
surrounding evidence argues against one" — I flag the difference each time.

**To lift this limitation:** have someone open the *CertifiO ID integration* page
in the Figma desktop app and leave it as the active page. A re-run of
`get_metadata` on `0:2` would then enumerate the whole page in one call and settle
every open question in the last section.

### Canvas geography established

Three clusters carry verification work, all on page `0:2`:

| Cluster | y | x range | Service | Node kind |
|---|---|---|---|---|
| **Row A** | `2345.6357421875` | 19615 – 21596 | **StudentAidNL** | frames + instances |
| **Row B** | `3563` | 15130 – 29148 | **Driver and Vehicle** | components + frames |
| **Left cluster** | `779` | 1591 – 4645 | **Driver and Vehicle** | frames |

Row B is tightly packed — every neighbouring pair of frames is separated by
**60–450 px** — with one exception, a **4,924 px void** between `CID_Biometric`
(ends x=16043) and `CID_ID_success` (x=20967.3). That void is the single most
important unknown in this audit; see *Conflicts*.

---

## 1. Ordered Driver-and-Vehicle verification sequence

Service confirmed by reading the wizard header in a screenshot for every row
marked ✅. Sizes are the exact Figma floats; see *Height rounding* before pasting
into `frames.json`.

| # | Node id | Frame name | W×H (exact) | Sub-step pill (verbatim) | Heading (verbatim) | Buttons (verbatim) → destination |
|---|---|---|---|---|---|---|
| 1 | `6217:62834` | `CID_TU` | 393 × 810.810546875 | `Terms of use • step 1 of 5` | Terms of use | `I do not agree` → exit journey · `I agree` → step 2 |
| 2 | `6217:62835` | `CID_Biometric` | 393 × 834.810546875 | `Biometric consent • step 2 of 5` | Biometric consent | `I do not agree` → exit journey · `I agree` → step 3/4 |
| 3 | **not found** | — | — | *(no frame in the file carries `step 3 of 5`)* | — | — |
| 4a | `6087:31396` ✅ | `CID_ID1` | 393 × 1168.810546875 | `ID document selection • step 4 of 5` | Accepted documents: | `Continue` (Yoti, full-width filled) → 4b. `btn-back` present but `hidden="true"` |
| 3b | `6217:66054` ✅ | `CID_ID1_Country` | 393 × 1060.810546875 | `ID document selection • step 4 of 5` | Select the type of identity document you want to add | `Continue` (Yoti, full-width filled) → 4a. `btn-back` present but `hidden="true"` *(found 2026-09-22 — see §12)* |
| 4b | `6217:66055` ✅ | `CID_ID1_Front_instruction` | 393 × 994.810546875 | `ID document selection • step 4 of 5` | Prepare to take a photo of your identity document (front) | `Continue` (Yoti, full-width filled) → 4c *(found 2026-09-22 — see §12; the estimate of ~1007.81 below was taken from the StudentAidNL instance and is 13 px out)* |
| 4c | `6056:19118` ✅ | `CID_ID1` | 393 × 1174.810546875 | `ID document selection • step 4 of 5` | Capture ID document (front) | `Continue` (Yoti, full-width filled) → 4d |
| 4d | `6057:20924` ✅ | `CID_ID1` | 393 × 1174.810546875 | `ID document selection • step 4 of 5` | Capture ID document (back) | `Continue` (Yoti, full-width filled) → step 5 |
| 5 | `6217:66058` | `CID_ID_success` | 393 × 1014.810546875 | `Identity verified • step 5 of 5` | Your identity has been verified | `Continue to Driver and Vehicle service` → step 6 · `Log out` → `/` |
| 6 | `6217:80871` | `Provider page_IDV results status` | 1440 × 1078.1964111328125 | *(none — no sub-step readout)* | *(instance `Headings`; body: "Your identity verification is now being processed…")* | *(no buttons — "You can close this window.")* |
| 7 | `6217:81644` ✅ | `Driver and Vehicle_Prerequisite confirmed` | 1440 × 996.2152099609375 | *(none)* | **Confirm some details** | `Cancel` → exit · `Back` → step 6 · `Continue` → step 8 |
| 8 | `6217:82446` ✅ | `driver-vehicle-confirmation` | 1440 × 1024 | *(none)* | Success! | `Back` → step 7 · `Go to Service Driver's License Renewal` → step 9. `Cancel` present but `hidden="true"` |
| 9 | `6257:72314` | `driver-vehicle-service-page_verified` | 1440 × 1792.2152099609375 | *(none)* | Driver and Vehicle *(+ `Trusted` badge)* | `← Back to Services`, per-item actions |

Ordering evidence: on Row B the x-positions run **contiguously** in exactly this
order — 15130 → 15650 → *(void)* → 20967.3 → 21813.7 → 23416.1 → 25108.8 →
26621.8 → 27206.4 → 28754.8 — with each frame starting 60–450 px after the
previous one ends. Canvas order on Row B *is* flow order. Steps 4a/4c/4d are the
exception: they live in the left cluster at y=779, not on Row B.

### Mobile counterparts (same journey, narrow viewport)

| Pairs with | Node id | Frame name | W×H (exact) |
|---|---|---|---|
| step 8 | `6102:103451` ✅ | `CID_ID1` | 393 × 810.810546875 |
| step 9 | `6097:23625` | `driver-vehicle-mobile` | 393 × 2786.810546875 |

Both read "Driver and Vehicle". `6102:103451` is **not** a stale duplicate of
`6217:82446` — it is its 393-wide counterpart, same heading ("Success!"), same
CTA. It sits at x=26621.8, between the desktop confirmation and the desktop
verified page, which is where a responsive pair belongs on this canvas.

### Height rounding — decide before pasting

`frames.json` currently stores `auth-loading` (`6217:80871`) as **1079** against a
true height of **1078.1964…**. That is `ceil`, not round; every other existing
entry (810.81→811, 834.81→835, 1014.81→1015, 1168.81→1169, 1174.81→1175) is
identical under both rules, so `auth-loading` is the only discriminating sample.

Taking `ceil` as the house rule:

- `6217:81644` → **997** (the task brief said 996 — that is `round`)
- `6257:72314` → **1793** (the task brief said 1792 — that is `round`)

I have used `ceil` in the paste-ready block below for internal consistency, but
this is a 1 px decision that affects screenshot-diff baselines. **Confirm it.**

---

## 2. Frames examined and REJECTED

| Node id | Frame name | W×H | x, y | Reason |
|---|---|---|---|---|
| `6217:66072` | `CID_ID1` | 393 × 1197.810546875 | 19615.28, 2345.64 | **Wrong service.** Header reads **StudentAidNL** (screenshot-verified). Content-twin of our `6087:31396` but pre-selects **Passport**, not Driver's License. |
| `6217:66151` | `CID_ID1_Front_instruction` | 393 × 1007.810546875 | 20129.78, 2345.64 | **Wrong service.** Row A. An *instance*; its master is the Driver-and-Vehicle instruction screen (see gap G2). |
| `6217:76798` | `CID_ID1_Front camera` | 393 × 1187.810546875 | 20652.78, 2345.64 | **Wrong service.** Row A. (Already established by the prior audit.) |
| `6217:66154` | `CID_ID1` | 393 × 1187.810546875 | 21202.65, 2345.64 | **Wrong service.** Header reads **StudentAidNL** (screenshot-verified); document image is a **passport**, not a driver's licence. |
| `6065:23367` | *(was `service-verified`)* | — | — | **Deleted.** `get_metadata` returns *not found*. Confirmed superseded by `6257:72314`. |
| `0:2` page read | *CertifiO ID integration* | — | — | Not a frame — logged here because the page cannot be enumerated (see top). |
| `6217:62836`, `6217:62837`, `6217:66152`, `6217:66153`, `6217:66200`, `6056:19944`, `6257:68000`, `6257:69000` | — | — | — | **Do not exist.** Probed while trying to walk the id sequence into the Row B void. All returned *not found*. |

Row A (`y = 2345.6357421875`) is StudentAidNL end-to-end. Two of its four frames
were screenshot-verified by header text; the other two share the row's exact y and
the same 134 px two-line `wizard-header` (Driver and Vehicle frames use a 121 px
single-line header). **Do not build from any frame at y = 2345.6357421875.**

---

## 3. Duplicates and stale frames — `CID_ID1`

Six distinct nodes are named `CID_ID1`. Verdicts:

| Node id | Cluster | Verdict | Evidence |
|---|---|---|---|
| `6087:31396` | left, y=779 | **Current — ours** | Header "Driver and Vehicle". Carries the newest stepper (`6257:69636`), including the `sub-step-readout` sub-component that was rolled out across the file in one pass. A superseded frame would not have been given the new stepper. |
| `6056:19118` | left, y=779 | **Current — ours** | Header "Driver and Vehicle" (screenshot-verified). Newest stepper `6257:69707`. |
| `6057:20924` | left, y=779 | **Current — ours** | Header "Driver and Vehicle" (screenshot-verified). Newest stepper `6257:69735`. |
| `6217:66072` | Row A | **Not ours** | StudentAidNL. See rejects. |
| `6217:66154` | Row A | **Not ours** | StudentAidNL. See rejects. |
| `6102:103451` | Row B, x=26621.8 | **Current — ours, mobile** | Not a `CID_ID1` verification screen at all despite the name: it is the 393-wide "Success!" confirmation, the mobile twin of `6217:82446`. Its stepper is the older `6102:103456` with **no** `sub-step-readout` — but neither does `6217:82446`, because at "Ready to Use" there is no sub-step. Not stale. |

**The stepper-upgrade pass is the strongest dating evidence in the file.** The
designer walked the journey once, replacing each `progress-stepper` and adding a
`sub-step-readout`. The new ids landed in this order:

`6257:67855` (CID_TU) → `67917` (CID_Biometric) → `69636` (**6087:31396**) →
`69650` (**front-instruction master**) → `69707` (**6056:19118**) → `69735`
(**6057:20924**) → `69749` (CID_ID_success) → `72270`/`72283`/`72296` (Row A,
StudentAidNL, done last)

The three left-cluster frames are interleaved *inside* the Driver-and-Vehicle run,
between `CID_Biometric` and `CID_ID_success`, in exactly the order the flow needs
them. That is why I read them as current despite sitting 11,000 px away from Row
B — and it also pins the front-instruction master (id `…69650`) as **our** screen,
step 4b, sequenced between `6087:31396` and `6056:19118`.

---

## 4. Supersession checks

**`6257:72314` supersedes `6065:23367` — CONFIRMED.**
`6065:23367` is *not found* in the file; it has been deleted. `6257:72314`
(`driver-vehicle-service-page_verified`, 1440 × 1792.2152…, Row B x=27206.4) is
the current verified-service page. It is materially different from the stored
1440×1820 baseline: it adds a `Trusted` badge beside the title, a `Favourite
Service` card, a "Skip the paper copy" vehicle-registration wallet upsell with a
`New` pill, and changes the CHEV IMT from *expired* to *Expires on January 14,
2036*. **A rebuild, not a resize.**

**`6217:81644` supersedes `6217:82446` — CORRECTED: NO.**
They are **sequential screens, not variants**. `6217:81644` sits at x=23416.06 and
`6217:82446` at x=25108.81 on the same row, in that order, and their content
differs completely:

- `6217:81644` — stepper at 555/740 with **Prerequisite Check** bold; heading
  **"Confirm some details"**; body "To onboard to Driver and Vehicle, you need to
  confirm it's you by providing the following information:"; one requirement row
  "Must have a valid driver's license" → **Confirmed** (green); buttons
  `Cancel` / `Back` / `Continue`.
- `6217:82446` — stepper **full**, **Ready to Use** bold; heading **"Success!"**;
  body "Service has been successfully onboarded, and it's ready to be used.";
  buttons `Back` / `Go to Service Driver's License Renewal`.

Keep `6217:82446` exactly where it is, and insert `6217:81644` **before** it.

---

## 5. Mobile handoff — QR / "Continue on my computer"

**Not found.** No frame I could address shows a QR hand-off or a "Continue on my
computer" control.

The file does contain QR artwork, but it is unrelated: a `QR code` component
instance appears twice, at `6259:73307` (inside `6257:72314`) and `6259:78159`
(inside `6097:23625`), both in a **"Skip the paper copy" digital-wallet upsell**
for the vehicle registration certificate — "Add your verified vehicle registration
certificate to your wallet. Show proof instantly from your phone." with an `Add to
wallet` button. That is a wallet feature, not an IDV device hand-off.

Nothing in the Yoti/provider chrome references a second device either;
`6056:20793` says "We will try to get a clearer image this time **using your phone
camera**", which implies the capture already happens on the phone — consistent
with a journey that has no desktop→mobile hop.

**Confidence: medium.** I cannot enumerate page `0:2`, and the Row B void is large
enough to hide one. Treat as "no evidence for", not "proven absent".

---

## 6. "Confirm some details" — FOUND

**`6217:81644`**, frame name `Driver and Vehicle_Prerequisite confirmed`,
**1440 × 996.2152099609375**, Row B x=23416.06.

Screenshot-verified: wizard header **"Driver and Vehicle"**, heading
**"Confirm some details"**, stepper on **Prerequisite Check**. This is the screen
the audit said the build skips, and the build does skip it — `FLOW` goes
`/auth/loading/` → `/services/driver-vehicle/confirmation/` with nothing between.

Note the frame *name* says "Prerequisite **confirmed**" and the single requirement
already reads **Confirmed** in green, so this is the post-verification state. If a
pre-verification variant exists (same screen with the requirement unmet, leading
*into* the CID journey), it would live in the Row B void and I could not reach it.

---

## 7. Yoti / provider-owned frames

Nothing in the file is literally labelled "Yoti embed". The Yoti signal is a
component named **`Yoti ContinueButton`**, instanced on every ID-capture screen:

| Host frame | Yoti button instance | Service |
|---|---|---|
| `6087:31396` | `6087:31454` | D&V |
| *front-instruction master* | `6076:31370` | D&V |
| `6056:19118` | `6076:31376` | D&V |
| `6057:20924` | `6076:31382` | D&V |
| `6217:66072` | `6217:66147` | StudentAidNL |
| `6217:66151` | *(inherits `6076:31370`)* | StudentAidNL |
| `6217:66154` | `6217:66198` | StudentAidNL |
| `6217:76798` | `6217:76844` | StudentAidNL |

Reading: **steps 4a–4d are provider-rendered (Yoti) surfaces wrapped in GNL
chrome** — GNL supplies the top nav, wizard header, stepper and footer; Yoti
supplies the body and the primary action. Steps 1, 2, 5 use plain GNL buttons
(`ContinueButton` / `btn-back`) and are GNL-owned.

**`6217:80871` is explicitly provider-owned** — its frame name is
`Provider page_IDV results status`. Its body is provider copy ("Your identity
verification is now being processed… You can close this window.") and it has **no
buttons at all**, which matters: the build's `/auth/loading/` must not invent one.
It also contains a `Banner` instance (`6236:46388`) that is `hidden="true"` — an
error/delay state the design anticipates but does not currently show.

---

## 8. Copy inconsistencies

1. **StudentAidNL frames carry Driver-and-Vehicle sub-step copy.** All four Row A
   frames (`6217:66072`, `66151`, `76798`, `66154`) display the pill
   `ID document selection • step 4 of 5` under a **StudentAidNL** header. The
   `sub-step-readout` was copy-pasted across services without retitling.
   *(This is the inconsistency the flow audit suspected — confirmed.)*

2. **Our own pill is wrong on two of three capture screens.** `6056:19118`
   ("Capture ID document (front)") and `6057:20924` ("Capture ID document (back)")
   both show `ID document selection • step 4 of 5`, which describes `6087:31396`,
   not them. Three consecutive screens share one pill, so the pill cannot be used
   as a step discriminator in the build.

3. **`step 3 of 5` is displayed by nothing.** The stepper promises five sub-steps;
   the file shows 1, 2, 4, 4, 4, 5. Either step 3 is unbuilt or the numbering is
   stale.

4. **Service name drifts in the CTA.** `6217:82446` and `6102:103451` both say
   `Go to Service Driver's License Renewal` on the **Driver and Vehicle** service,
   while `6217:66058` says `Continue to Driver and Vehicle service`. Two different
   names for one destination.

5. **Missing punctuation in `6217:66058` body copy** (`6062:23365`): "…Available
   services include licence and registration renewals address changes driving
   record purchases road test payments, and more." — commas dropped between the
   list items.

6. **Retry wording on a first-pass screen.** The front-instruction subtitle
   (`6056:20793`) reads "We will try to get a clearer image **this time** using
   your phone camera." "This time" implies a previous failed attempt, but the
   screen sits in the happy path.

7. **`6087:31396` pre-selects Driver's License; `6217:66072` pre-selects
   Passport.** Correct per service (resident vs. non-resident), but worth a
   deliberate confirmation since the two frames are otherwise identical.

---

## 9. Gaps — expected by the audit, genuinely not in reach

| # | Expected | Status |
|---|---|---|
| G1 | Country / document selection | **Document selection exists** (`6087:31396`). A separate **country** selection screen: not found, and no frame displays `step 3 of 5`. If country selection is step 3, it is either unbuilt or inside the Row B void. |
| G2 | Capture instructions | **Exists, but I cannot give you its node id.** Proven via `6217:66151`, a StudentAidNL *instance* whose master has a 121 px single-line `wizard-header` (the Driver-and-Vehicle signature; StudentAidNL uses 134 px) and whose stepper is `6257:69650` — landing in the D&V half of the upgrade pass, between `6087:31396` (`…69636`) and `6056:19118` (`…69707`). Master children are `6056:19945`–`20006` plus `6056:20786`–`20810` ("Screen 7 - id-photo-instructions"). The master **root** id is not derivable from an instance and `6056:19944` does not exist. |
| G3 | Front / back capture | **Exists** — `6056:19118`, `6057:20924`. A *back*-instruction counterpart to G2: not found. |
| G4 | Provider completion | **Exists** — `6217:80871`. |
| G5 | Mobile handoff (QR, "Continue on my computer") | **Not found.** See §5. |
| G6 | Prerequisite "Confirm some details" | **Exists** — `6217:81644`. See §6. |
| G7 | Verified-service frame drift | **Resolved** — `6065:23367` deleted, `6257:72314` is current. See §4. |

---

## 10. Conflicts / needs a human decision

**C1 — The 4,924 px void on Row B. (highest priority)**
Row B packs frames 60–450 px apart everywhere except between `CID_Biometric`
(ends x=16043.0) and `CID_ID_success` (x=20967.3). Row A fits four frames into
that same x-band at a ~515 px pitch; nine frames would fit the void almost
exactly. Two readings:

- *(a)* The void is empty, the designer parked steps 4a–4d in the left cluster at
  y=779, and the build's current mapping is right.
- *(b)* The void holds newer Driver-and-Vehicle copies of document selection,
  instructions and capture that **supersede** `6087:31396` / `6056:19118` /
  `6057:20924`.

Evidence favours *(a)*: the stepper-upgrade pass visits the three left-cluster
frames in flow order inside the D&V run, which is not how a designer treats dead
frames. Evidence for *(b)*: the void is anomalous on an otherwise tight row, and
11,000 px of separation between steps 2 and 4 of one journey is odd.
**I did not pick. Someone must open page `0:2` and look.**

**C2 — Node id for step 4b (front instructions).** Confirmed to exist (G2) and
confirmed to be ours, but unaddressable. The build cannot add this screen until
someone reads the master's id off the canvas.

**C3 — Height rounding, `ceil` vs `round`.** `997` vs `996` for `6217:81644`;
`1793` vs `1792` for `6257:72314`. Existing `auth-loading` implies `ceil`, a
single sample that could equally be a typo. Affects diff baselines.

**C4 — Does step 3 of 5 exist?** Nothing displays it. Either a screen is missing
or the stepper should read "of 4". A copy decision, not just a build one.

**C5 — Route naming for `6217:81644`.** I propose
`/services/driver-vehicle/prerequisite/`. The frame name says "Prerequisite
confirmed"; the heading says "Confirm some details". Pick one vocabulary.

**C6 — Are the mobile counterparts in scope?** `6102:103451` and `6097:23625` are
current and ours, but the demo is desktop-first and `FLOW` has no mobile route.
Listed below as optional.

---

## 11. `design/frames.json` — exact entries to add or change

### Change — `service-verified` (node deleted; replace id, width, height)

```json
    {
      "id": "service-verified",
      "node": "6257:72314",
      "route": "/services/driver-vehicle/?verified=1",
      "width": 1440,
      "height": 1793,
      "budget": 0.008
    }
```

### Add — `prereq-confirm` (insert between `auth-loading` and `confirmation`)

```json
    {
      "id": "prereq-confirm",
      "node": "6217:81644",
      "route": "/services/driver-vehicle/prerequisite/",
      "width": 1440,
      "height": 997,
      "budget": 0.008
    }
```

### Optional — mobile counterparts (only if the demo grows a mobile track)

```json
    {
      "id": "confirmation-mobile",
      "node": "6102:103451",
      "route": "/services/driver-vehicle/confirmation/?viewport=mobile",
      "width": 393,
      "height": 811,
      "budget": 0.008
    },
    {
      "id": "service-verified-mobile",
      "node": "6097:23625",
      "route": "/services/driver-vehicle/?verified=1&viewport=mobile",
      "width": 393,
      "height": 2787,
      "budget": 0.008
    }
```

### Unchanged — verified correct, do not touch

`login` `6206:23558` · `dashboard` `6206:23559` · `service` `6031:6244` ·
`onboard` `6031:6304` · `cid-terms` `6217:62834` · `cid-biometric` `6217:62835` ·
`cid-document` `6087:31396` · `cid-capture-front` `6056:19118` ·
`cid-capture-back` `6057:20924` · `cid-verified` `6217:66058` ·
`auth-loading` `6217:80871` · `confirmation` `6217:82446`

*(`login`, `dashboard`, `service`, `onboard` were not re-verified in this pass —
they are outside the verification journey.)*

### Corresponding `src/lib/flow.ts` change

Insert one route, after `/auth/loading/` and before the confirmation route:

```ts
  "/auth/loading/",
  "/services/driver-vehicle/prerequisite/",   // 6217:81644 — "Confirm some details"
  "/services/driver-vehicle/confirmation/",
```

Still **not** representable in `FLOW`: step 3 of 5 (C4) and step 4b, the front
capture instructions (C2, G2).

---

## 12. ADDENDUM — 2026-09-22, the three located screens

The three frames this document listed as missing or unaddressable have been
found and built. Read-only audit as before: only `get_metadata`,
`get_design_context` and `get_screenshot` were called, and **no Figma node was
created, edited, moved or deleted**.

| Was | Now | Node id | W×H (exact) | Route built |
|---|---|---|---|---|
| **G5** "Mobile handoff — not found" | **Exists** | `6217:62059` `CID_Redirect to mobile` | 1440 × 1161.1964111328125 | `/cid/continue-on-mobile/` |
| **G1** "Country selection — not found" | **Exists** | `6217:66054` `CID_ID1_Country` | 393 × 1060.810546875 | `/cid/country/` |
| **G2 / C2** "Capture instructions — exists, id not derivable" | **Exists, id known** | `6217:66055` `CID_ID1_Front_instruction` | 393 × 994.810546875 | `/cid/capture-intro/` |

### C2 is closed, and §3's dating reasoning was vindicated

§9 inferred the front-instruction master from a StudentAidNL *instance* and
predicted four things about it. All four hold on `6217:66055`:

| Predicted in §3/§9 | Actual on `6217:66055` |
|---|---|
| `progress-stepper` is `6257:69650` | `6257:69650` ✅ |
| 121 px single-line `wizard-header` (D&V signature, not StudentAidNL's 134) | `6056:19947`, 361 × **121** ✅ |
| Yoti button instance `6076:31370` | `6076:31370` ✅ |
| Children `6056:19945`–`20006` plus `6056:20786`–`20810` | exactly that range ✅ |

Four independent predictions, four hits. The stepper-upgrade ordering is a
sound dating method for this file, which also strengthens reading **C1** as
option *(a)* — the left-cluster frames are current and the Row B void is empty.
C1 is still not proven; it still needs someone to open page `0:2`.

### G5 was a genuine miss, not a bad inference

§5 concluded "no mobile-handoff QR exists" at **medium** confidence and said
explicitly: *"Treat as 'no evidence for', not 'proven absent'."* That caveat was
correct and the hedge was load-bearing — `6217:62059` sits on Row B at
x=13340.17, inside the region the audit could not enumerate. The QR it carries
(`6156:60706` `image 13`, 220.4013671875 × 216.981201171875) is a **third** QR
in the file, distinct from the two wallet-upsell instances §5 catalogued.

`CID_Redirect to mobile` is a **1440 desktop frame** despite the `CID_` name:
desktop `top-nav actions` (`6156:58458`), desktop `footer verified`
(`6156:58507`), Lato on the GNL ramp, no `sub-step-readout`. It is the only
`/cid/` route in the build that does **not** go through `CidScreen`.

### Flow position — read off the canvas

`6217:62059` is at **x=13340.17** on Row B (y=3563), between `/onboard/`'s
neighbourhood (x=11662) and `CID_TU` (x=15130). §1 established that Row B's
x-order *is* flow order over nine consecutive frames, so the hand-off belongs
between the prerequisite-check wizard and Terms of use, and is wired there.

---

### ⚠ NEEDS A HUMAN — C7: the capture screens exist twice, at two heights

The two capture screens exist as **both components and instances**, and the two
sets do **not** agree on height:

| Kind | Node id | Name | W×H (exact) | `ceil` |
|---|---|---|---|---|
| **component** | `6217:66056` | `CID_ID1_Front camera` | 393 × 1222.810546875 | 1223 |
| **component** | `6217:66057` | `CID_ID1_back camera` | 393 × 1222.810546875 | 1223 |
| **instance** (built) | `6056:19118` | `CID_ID1` | 393 × 1174.810546875 | 1175 |
| **instance** (built) | `6057:20924` | `CID_ID1` | 393 × 1174.810546875 | 1175 |

**A 48 px difference per screen.** Heights verified 2026-09-22 by
`get_screenshot`, which reports `original_height: 1223` for both components
against the instances' 1175.

**The build uses the INSTANCES and was NOT switched.** Reasons, so the decision
can be re-litigated rather than re-derived:

- the instances sit in flow order in the left cluster at y=779, between
  `6087:31396` and `6057:20924`, which is where the journey needs them;
- their steppers (`6257:69707` / `6257:69735`) land inside the D&V half of the
  stepper-upgrade pass, between `6217:66055`'s `…69650` and CID_ID_success's
  `…69749` — the components are not part of that sequence;
- `frames.json` has held `cid-capture-front` / `cid-capture-back` at 1175 with a
  passing dH of +7 since they were built.

**What a human needs to settle:** is the extra 48 px on the components a newer
design the instances have not picked up (in which case both capture screens are
48 px short and the baselines must move), or is it an older/looser master the
instances deliberately override? Switching is a two-line change in
`frames.json` plus a re-measure — but it is a **design** decision, not a build
one, so nothing was changed. This is recorded, not acted on.

---

### ⚠ NEEDS A HUMAN — C4 restated: `step 3 of 5` is still displayed by nothing

`CID_ID1_Country` (`6217:66054`) was the obvious candidate for the missing step
3. **It is not.** Its `sub-step-readout` (`6257:72205`) reads
**`ID document selection • step 4 of 5`**, character for character the same as
the three ID-document frames after it.

So with the new screen in place the counter the presenter walks is:

| # | Screen | Pill |
|---|---|---|
| 1 | `/cid/terms/` | `Terms of use • step 1 of 5` |
| 2 | `/cid/biometric/` | `Biometric consent • step 2 of 5` |
| 3 | `/cid/country/` | `ID document selection • step **4** of 5` |
| 4 | `/cid/document/` | `ID document selection • step **4** of 5` |
| 5 | `/cid/capture-intro/` | `ID document selection • step **4** of 5` |
| 6 | `/cid/capture-front/` | `ID document selection • step **4** of 5` |
| 7 | `/cid/capture-back/` | `ID document selection • step **4** of 5` |
| 8 | `/cid/verified/` | `Identity verified • step 5 of 5` |

**The counter legitimately runs 1 → 2 → 4 → 4 → 4 → 4 → 4 → 5.** No frame
anywhere in the file carries `step 3 of 5`. **Reproduced verbatim; nothing was
renumbered.** Locating the two extra screens did not close this gap — it widened
it, because "4 of 5" now covers five consecutive screens instead of three.

Either a step-3 screen is unbuilt, or the counter should read "of 4" and the
`ID document selection` label should carry its own sub-numbering. **A copy
decision for the designer, not a build one.**

### Minor — heading scale disagrees across the five ID-document frames

Not a blocker, noted while building. Three of the five use a 22 px heading and
two use 32 px, on consecutive screens:

| Frame | Heading | Size |
|---|---|---|
| `6217:66054` | "Select the type of identity document you want to add" | 22 px |
| `6087:31396` | "Accepted documents:" | 22 px |
| `6217:66055` | "Prepare to take a photo of your identity document (front)" | 22 px |
| `6056:19118` | "Capture ID document (front)" | **32 px** |
| `6057:20924` | "Capture ID document (back)" | **32 px** |

All five are reproduced at their own measured size. The step from 22 to 32 is
now visible on stage because `/cid/capture-intro/` (22) sits immediately before
`/cid/capture-front/` (32).

---

## Confidence summary

| Claim | Confidence | Basis |
|---|---|---|
| `6217:81644` is "Confirm some details", 1440×996.215 | **High** | Screenshot, header + heading read directly |
| `6217:81644` precedes, not supersedes, `6217:82446` | **High** | Contiguous x-order + entirely different stepper state and copy |
| `6065:23367` deleted; `6257:72314` current | **High** | *not found* vs. full metadata |
| Row A (y=2345.6357421875) is StudentAidNL | **High** | Two headers screenshot-verified, other two share y and header geometry |
| `6087:31396`/`6056:19118`/`6057:20924` are ours and current | **High** for ours (screenshots), **Medium** for current (stepper-pass ordering, contested by C1) |
| Step 4b instruction screen exists and is ours | **Medium-high** | Master's 121 px header + stepper id `6257:69650` inside the D&V run — inferred, never seen as a root node |
| No mobile-handoff QR exists | **Medium** | Nothing found; page not enumerable |
| No `step 3 of 5` screen exists | **Medium** | Nothing found; page not enumerable |
| Row B x-order is flow order | **High** | Nine consecutive frames, contiguous, matching known journey order |
