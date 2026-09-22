# Token exceptions — Phase 3 (CID mobile screens)

Tasks 13-16: `/cid/welcome`, `/cid/terms`, `/cid/biometric`, `/cid/verified`.

Everything listed here is **reproduced exactly as designed** in the build. This
file exists so Tatyana can reconcile the design file, not so the code can
diverge from it.

Source: `C1 | GNL - R3`, file key `Dc1bPoXX1VoB9v1MtLvu8e`.
Captured: 2026-09-18. Re-synced against the reworked frames 2026-09-22.

---

## RE-SYNC 2026-09-22 — the dot stepper is gone

Tatyana: *"when I reworked the mobile pages, I removed the CID stepper and
replaced it with a pill."* Re-read from Figma and re-implemented on the three
live frames (`6217:62834`, `6217:62835`, `6217:66058`). The six-dot
`Progress Stepper` inside `Frame 5` no longer exists anywhere in the file; in
its place `wizard-header` → `progress-stepper` gained a third child,
`sub-step-readout` (`6257:72178` / `6257:67925` / `6257:72248`) — a 26px pill,
`bg-[rgba(233,235,240,0.5)]`, `rounded-[16px]`, `px-[8px] py-[4px]`,
`gap-[4px]`, `Lato:Regular` 12px/1.5 on `#5f6368`, holding a label, a `•` and a
step counter as three separate text nodes.

**Closed by the rework — no longer exceptions:**

| Was | Now |
|---|---|
| **1. Duplicated stepper** — two indicators stacked ~50px apart | One bar plus one sub-caption pill under it. Resolved as asked. |
| **3. `step-bar` track is the fill colour on CID_ID_success** | `6257:69750` is the ordinary `#e9ebf0` track with the same 278.869 fill and the same bold `Prerequisite Check` as the other two. All three frames now render `current={2}` + `CID_STEPPER_FILL`. |
| **4. Heading colour differs between CID frames** | All three headings are `--gnl-heading` (`#212326`). CID_TU and CID_Biometric were `#5f6368`. |
| **5. Content order differs on CID_Biometric** | Heading is first on all three, like CID_TU. |
| **7. Dot-stepper labels are hand-placed** | The dot rail and its `pl-[34px]` / `pl-[72px]` / `pl-[229px]` insets are gone with it. |

**Still open:** 2 (`step-bar-fill` 278.869 vs the desktop 555/740), 6
(both buttons named `btn-back`), 8 (the ~7px `card-description` measurement
gap — still exactly +7 on CID_TU and CID_Biometric, see below), 10-13.

**New, minor:** the pill counts *"step 1 of 5"* / *"2 of 5"* / *"5 of 5"* while
the four-step bar directly above it counts four. They track different
processes — the pill counts CID's own IDV sub-steps, the bar counts the GNL
onboarding wizard — but they sit 8px apart, so a reader sees "5 of 5" under a
bar that is three-quarters full. Reproduced as designed. **Action for Tatyana:**
confirm that reads correctly, or relabel one of the two.

Other geometry that moved with the rework:

- `wizard-header` 98 → **128** on all three (`progress-stepper` 38 → 68).
- `progress-stepper` column gap **12px → 8px** on the CID/mobile scale only.
  The desktop `6031:6310` is still 12px, so the gap is now size-keyed in code.
- `step-labels` current label is now `Lato:Bold` on `#212326`, was bold on
  `#5f6368`. The mobile scale now agrees with the desktop scale on this.
- `Frame 5` dropped its top padding on CID_TU and CID_Biometric
  (`py-[24px]` → `pt-[0] pb-[24px]`). CID_ID_success kept `py-[24px]`.
- Frame heights: **871 → 811**, **895 → 835**, **1051 → 1015**.
- `CID_TU`'s heading is now sentence case, **"Terms of use"**. The inline link
  inside its `card-description` is still title case, **"Terms of Use"**. Both
  reproduced verbatim; they genuinely differ in the file.
- The `footer verified` mobile variant (`6039:9695`) is **unchanged** by the
  rework — re-checked node for node against the build, nothing moved.

Deleted as dead: `src/components/mobile/CidStepper.tsx`, the `stepDotActive` /
`stepDotComplete` / `stepDotInactive` entries in `src/lib/assets.ts`, and
`public/assets/step-dot-{active,complete,inactive}.svg`. These are the three
icons Tatyana crossed off the outstanding request list. Section 10's asset
table below still lists them; they are no longer wanted.

---

## 0. The plan's node ids no longer resolve

The four node ids in the plan return "node not found". The frames were
re-published as **symbols** with new ids. Matched by name **and** by exact frame
size (all four match to the 1/1000 px), and every inner node id quoted in the
plan — `Frame 5`, `Frame 6`, the hidden `Check box` instances — is still present
at the documented offset, so these are the same frames.

| Screen | Plan node | Node actually used | Size |
|---|---|---|---|
| CID Welcome | `6039:6580` | **`6217:62833`** `CID_Welcome` | 393 x 1086.810546875 |
| CID Terms of Use | `6039:11307` | **`6217:62834`** `CID_TU` | 393 x 870.810546875 |
| CID Biometric | `6049:12226` | **`6217:62835`** `CID_Biometric` | 393 x 894.810546875 |
| CID Verified | `6062:22540` | **`6217:66058`** `CID_ID_success` | 393 x 1050.810546875 |

**Action for Tatyana:** `design/frames.json` still points at the dead ids, so
`npm run baselines` will fail for these four frames until they are updated.

---

## 1. Duplicated stepper (plan Task 13 Step 2 — confirmed)

All four frames carry **two different progress indicators at once**:

- the 8px `progress-stepper` bar inside `wizard-header` (`Summary` / `Terms and
  Conditions` / `Prerequisite Check` / `Ready to Use`), and
- a six-dot `Progress Stepper` inside `Frame 5` (`Welcome` / `Terms of Use` /
  `Biometric consent` / ... / `Identity verified`).

They track two different processes with two different step counts and are
stacked ~50px apart. Almost certainly a design slip. **Both are rendered** — the
plan is explicit that neither may be silently dropped.

**Action for Tatyana:** decide which indicator the CID screens should keep.

---

## 2. `step-bar-fill` disagrees with the desktop frames

| Frame | Node | Track | Fill | As % |
|---|---|---|---|---|
| `driver-vehicle-prerequisite-check` (desktop) | 6031:6312 | 740 | 555 | 75.00% |
| CID_Welcome / CID_TU / CID_Biometric | 6039:8146 etc. | 361 | **278.869** | **77.25%** |

Same wizard step (`Prerequisite Check` bold, `current={2}`), two different fill
ratios. Reproduced literally via a new optional `fillWidth` prop on
`ProgressStepper` / `WizardHeader`; the prop defaults to the `(current + 1) / 4`
formula, so no desktop screen changes.

---

## 3. `step-bar` track is the fill colour on CID_ID_success

`6062:22546` sets the track background to `#243746` — the **fill** colour — while
still carrying a 278.869px fill child and bolding `Ready to Use`. A dark fill on
a dark track is indistinguishable from a 100%-filled bar, which is exactly what
`current={3}` renders, so the component is used unmodified. The design file
itself is inconsistent: the other three CID frames use `#e9ebf0` for the track.

---

## 4. Heading colour differs between CID frames

| Frame | Node | Size / weight | Colour |
|---|---|---|---|
| CID_Welcome | 6039:8155 | 32px Bold | `#5f6368` (body grey) |
| CID_TU | 6039:11321 | 32px Bold | `#5f6368` |
| CID_Biometric | 6049:12240 | 32px Bold | `#5f6368` |
| **CID_ID_success** | 6062:22554 | 32px Bold | **`#212326`** (`--gnl-heading`) |

Three screen headings are painted with the body-text token and the fourth with
the heading token. Reproduced, not harmonised.

**Action for Tatyana:** headings should presumably all be `#212326`.

---

## 5. Content order differs on CID_Biometric (plan Task 15 Step 1 — confirmed)

`Frame 5` on CID_Biometric (`6049:12239`) puts the dot stepper **before** the
heading; CID_TU and CID_ID_success put the heading first. Reproduced as
designed.

---

## 6. `Frame 6` buttons are both named `btn-back`

On CID_TU (`6049:12216`) and CID_Biometric (`6049:12264`) the two buttons are
both named `btn-back` and styled identically (white, 1px `#243746`, radius 6,
16px Bold). Only their labels distinguish them — `I do not agree` (back) and
`I agree` (forward). A forward action rendered as a secondary button is a
usability problem as well as a naming one.

---

## 7. The dot-stepper labels are hand-placed, not aligned to their dots

`welcome-label-container` carries a literal left inset instead of being centred
under its active dot:

| Frame | Node | Inset | Active dot centre | Label centre |
|---|---|---|---|---|
| CID_TU | 6039:11339 | `pl-[34px]` | 79.4 | 68.5 |
| CID_Biometric | 6049:12260 | `pl-[72px]` | 146.8 | 121.0 |
| CID_ID_success | 6062:22578 | `pl-[229px]` + `justify-end` on the row | 349.0 | 318.5 |

Every label sits left of its dot, by a different amount each time. Reproduced
literally.

---

## 8. `card-description` height: Figma measures ~7px less than CSS renders

| Frame | Node | Figma height | Height from the returned CSS |
|---|---|---|---|
| CID_TU | 6039:11341 | 81 | 88 (2 x 24 + 16 + 24) |
| CID_Biometric | 6049:12262 | 105 | 112 (3 x 24 + 16 + 24) |
| CID_Welcome | 6039:8156 | 248 | 248 — matches |

The two blocks that end in the underlined `Terms of Use` run are each 7px
shorter in Figma than the `leading-[24px]` / `mb-[16px]` the design context
itself returns. The CSS from Figma is reproduced verbatim; the resulting page is
7px taller than the frame. Not reconcilable from the MCP output.

---

## 9. CID_Welcome has no forward control

`CID_Welcome` contains no button of any kind, but the flow must continue to
`/cid/terms/`. `Main content` is therefore wrapped in an unstyled `Link` — no
visual change, so the pixel gate is unaffected — and the deviation is recorded
here.

**Action for Tatyana:** the screen needs a real `ContinueButton`.

---

## 10. Missing assets — placeholders in use

`figma.com` is blocked by this environment's network proxy (403), so no asset
could be downloaded. Three new files are **dimension-exact placeholders**; the
root `width`/`height`/`viewBox` match the design slot, so swapping in the real
export is a byte replacement with no layout change.

| File | Figma node | Size | Placeholder drawn |
|---|---|---|---|
| `public/assets/step-dot-active.svg` | 6056:13968 (`active-step-dot`) | 24 x 24 | `#243746` disc with a 9.333px white centre |
| `public/assets/step-dot-complete.svg` | 6056:13947 (`Group 1`) | 18.667 x 18.667 | `#243746` disc with a white check |
| `public/assets/step-dot-inactive.svg` | 6056:13971 (`inactive-step-dot-4`) | 18.667 x 18.667 | flat `#c2c8d6` disc |

Colours and shapes were read off a `get_screenshot` render of `6049:12241`, so
they are visually correct; only the exact vector paths are approximated.

---

## 11. Lato weights the webfont cannot provide

Lato ships 100 / 300 / 400 / 700 / 900 — **no 500 (Medium), no 600 (SemiBold)**.
These four screens introduce no new occurrence of either: every `Lato:Bold` maps
to 700 and every `Lato:Regular` to 400. The two pre-existing substitutions are
reached through shared components and are already logged in
`design/token-exceptions.md`:

| Component | Node | Figma says | Rendered as |
|---|---|---|---|
| `progress-stepper` step labels | 6039:8148-8151, 6056:13075-13078, 6062:22549-22552 | `Lato:Medium` (500) | 400 |
| `top-nav actions` nav links | I6039:9699;6039:8944 etc. | `Lato:Medium` (500) | 400 |
| `top-nav actions` `btn-signout` | I6039:9699;6039:8940 | `Lato:SemiBold` (600) | 700 |

---

## 12. Off-token colours used by these screens

| Value | Used for | Nearest token |
|---|---|---|
| `#c2c8d6` | dot-stepper pending dots and pending connectors | *(none)* |
| `#004b87` | the inert `Terms of Use` link text | *(none)* — same link blue as the prerequisite-check card title |
| `#e9ebf0` | wizard step-bar track | already logged in `design/token-exceptions.md` |

---

## 13. Apostrophes

None of the four CID frames contains an apostrophe of either kind, so the
U+0027 / U+2019 split recorded for the prerequisite-check and confirmation
frames does not arise here. Nothing to normalise, nothing to reproduce.

---

## 14. Scope

Happy path only, per the demo owner. No error, failure, timeout,
`not_verified`, `inconclusive` or `manual_review_required` state is built, and
the `I do not agree` buttons route backwards through the flow rather than into
a rejection branch.
