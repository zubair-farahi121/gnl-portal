# Resync: login page + services dashboard (2026-09)

The designer deleted the two old frames and rebuilt both screens as Figma **main
components** (`symbol`, not `frame`). Node ids and one page height moved:

| Route | File | Old node | New node | Size |
|---|---|---|---|---|
| `/` | `src/app/page.tsx` | `6031:5865` | `6206:23558` | 1440 x 1880.215 (unchanged) |
| `/dashboard` | `src/app/dashboard/page.tsx` | `6031:5974` | `6206:23559` | 1440 x **1889.275** (was 1864.275) |

Only the ROOT ids changed. Every child node id (`6031:*`) survived the rebuild,
which is why the `data-node-id` attributes inside both files are untouched.

Read-only Figma access throughout: `get_metadata`, `get_design_context`,
`get_screenshot`, `get_variable_defs`. Nothing was written to the file.

---

## 1. Login page `/` — NO design change

Re-read node by node against the rebuilt component. Every section height, every
size, weight, colour and string is identical to what was already built:

```
header           1440 x 128      y=0
HeroSection      1440 x 560      y=128
ServicesSection  1440 x 676      y=688
FAQSection       1440 x 376      y=1364
footer verified  1440 x 140.215  y=1740
```

Specifically re-verified as UNCHANGED:

- `HeroSection` / `LoginCard` — 440 wide, `p-[32px]`, `gap-[24px]`, 22px card
  title, the 15px/14px span split on "Don't have an account? Create account",
  both 40px input boxes, the U+200B value slot, the 16px eye.
- `ServicesSection` — 28px heading, `gap-[48px]`, three 340px columns at
  426 / 268 / 350, 18px/24px `#004b87` category headings, 14px/22px bullets.
- The bullets still carry their own **`•` + TWO spaces** prefix baked into the
  text layer, so `whitespace-pre-wrap` is still required.
- The apostrophe split still exists: `Don’t` (U+2019) in the hero vs
  `driver's` / `learner's` / `child's` (U+0027) in the bullets. Reproduced, not
  harmonised.
- `FAQSection` — 24px heading, 800px accordion, three closed 56px rows, no open
  state anywhere in the design.

The only edits to `/` were the root node id in the header comment and the
`leading-[normal]` fix below.

---

## 2. Dashboard `/dashboard` — what the designer actually changed

### 2.1 The search row was rebuilt (the biggest visible change)

| | Before | After |
|---|---|---|
| Layout | button INSIDE the input | input and button are **siblings**, 16px gap |
| Input | 340 x 57, "Search services..." placeholder text | 340 x **56**, **empty** — the text layer is `hidden="true"` in Figma |
| Button | one-off green `#2a7d6f`, 14px, `px-[20px] py-[8px]`, 33 tall | shared `OnboardButton` `6217:35010`, primary navy **`#243746`**, **16px**, flat `p-[16px]`, stretched to the full **56** row height |

The one-off green is now gone from the page entirely.

### 2.2 Type scale went up across the board

| Element | Node | Before | After |
|---|---|---|---|
| "Welcome Jason Momoa!" | `6031:5977` | 32px | **40px** |
| "Favourite Services" | `6031:5984` | 24px | **28px** |
| Favourites body copy | `6031:5985` | 15px | **16px** |
| "All Services" | `6031:5987` | 24px | **28px** |
| Service-card title | `6031:5992` et al | 20px/30px | **28px**/30px |
| Service-card bullet | `6031:5999` et al | 15px/22px | **16px**/22px |

### 2.3 Service cards were re-spaced

- Card padding **24px -> 16px**.
- `bullet-list` gained a **32px left indent** (`pl-[32px]`) it did not have
  before, so the bullets now sit inboard of the title.
- Header chevron: the flat 16 x 16 `chevron-right` was replaced by a **32 x 32
  `Chevron` component instance**, rotated `-90deg` by the design (the source
  glyph points down).

### 2.4 Section heights, all derived and all verified in-browser

```
top-nav actions       1440 x 69        y=0
welcome-section       1440 x 228       y=69      (was 217)  +11 = 40px title
favourites-section    1440 x 136       y=297     (was 130)  +6  = 28px title
all-services-section  1440 x 1142      y=433     (was 1134) +8
footer-section        1440 x 314.275   y=1575    (unchanged)
                             = 1889.275
```

Grid columns re-flowed from 906 / 730 / 974 to **872 / 716 / 976**.

### 2.5 Unchanged on the dashboard

`TopNav`, the purple `footer-section` band, the wordmark, the feedback button,
`px-[120px]` page gutters, the 1200px / three-384px-column grid with 24px
gutters, and **every string** — no copy changed anywhere on either screen.

---

## 3. Design problems found — recorded, NOT fixed in Figma

Figma is read-only by standing instruction. These are reproduced verbatim in
code; do not "tidy" them.

1. **`service-card-c2-2` (Personal Health Record) has TWO chevrons.**
   `card-header` `6031:6104` contains a leftover 16 x 16 `chevron-right`
   (`6031:6106`) AND the new 32 x 32 `Chevron` (`6217:35163`). Both render, side
   by side. It also squeezes that card's title box to 304px where every other
   card gets 320. Carried as `duplicateChevron` in `SERVICE_COLUMNS`.

2. **Two cards use a different header alignment for no reason.**
   `service-card-c1-0` (`6031:5991`) and `service-card-c2-0` (`6031:6068`) are
   `items-start`; the other eight are `items-center justify-between`. Worth 1px
   of title offset. Carried as `headerTop`.

3. **One card title wraps, the rest truncate.**
   `service-card-c2-0` ("Domestic wood cutting permits") has a 60px header — two
   30px lines. Every other `card-header` in the file measures 32, so every other
   title is single-line and ellipsised, including
   `service-card-c2-1` ("Learner's permit and off-road vehicle tests"), which is
   visibly cut off at 320px. Carried as `titleWraps`.

4. **The search input has no visible affordance.** Its placeholder layer is
   hidden, so it renders as an empty grey-stroked box with no label, no icon and
   no text. Reproduced as an empty box.

These are worth raising with the designer alongside the existing list in
`design/figma-corrections-for-tatyana.md`.

---

## 4. Font-weight log (Lato has no 500 or 600)

Both rebuilt frames use **only** `Lato:Bold` and `Lato:Regular`. No
`Lato:Medium`, `SemiBold`, `ExtraBold` or `Black` appears anywhere in
`6206:23558` or `6206:23559`, so **no weight remapping was required** on this
pass. Bold -> 700, Regular -> 400, both already bundled.

---

## 5. `line-height: normal` correction (in-scope fix)

Four text layers on these two screens were using Tailwind's `leading-normal`,
which is **1.5**, where Figma says `line-height: normal`, which is **~1.2**.
The house convention (`BtnPrimary`, `BtnOutline`, `LinkedItemCard`) is
`leading-[normal]`; these four had been missed.

Figma proves the 1.2: `Forgot password?` (`6031:5884`) measures **17** tall at
14px, not 21, and `LoginButton` (`6031:5888`) measures **37**, not 41.

Corrected in `src/app/page.tsx` ("Forgot password?", "Log in") and
`src/app/dashboard/page.tsx` ("Search", "Tell us what you think"). This brought
`LoginCard` from 428 to 420 against Figma's 419.

---

## 6. Known deviations

| # | Deviation | Why |
|---|---|---|
| 1 | **"Accessible parking permit" shows an ellipsis; Figma does not.** | Figma fits that title on one line at exactly 320px (`card-header` = 32, card = 170). Chromium's Lato measures it at **323px** — 3px, ~1% wider — so it would wrap and make the card 198. Single-line was chosen because the 170px height is what Figma measured and what `grid-column-1`'s 872px depends on. Do not "fix" this by letting it wrap; it would push the column 28px long. |
| 2 | Shared footer is 140.203 tall vs Figma 140.215 (login) and the dashboard shell is 1889.25 vs 1889.275. | 0.025px, entirely inside the shared `SiteFooter` instance. Pre-existing and out of scope for this resync. |
| 3 | Search button renders 80.8 wide vs Figma 80. | Natural width from `p-[16px]` + "Search" at 16px Lato Bold. Pinning it would fight the shared `OnboardButton` and hide future copy changes. |
| 4 | `icon-chevron-32.svg` glyph geometry is approximate. | See below. |

### Verified in-browser (Chromium 1194, 1440 canvas)

All ten card heights match Figma exactly: 170, 214, 278, 138 / 198, 170, 300 /
428, 266, 234. Columns 872 / 716 / 976. Grid 1200 x 976. Sections
69 / 228 / 136 / 1142 / 314.25.

---

## 7. Assets

`figma.com` is blocked by this environment's proxy (403 on CONNECT), so no real
export could be downloaded.

**New placeholder:** `public/assets/icon-chevron-32.svg` — 32 x 32, registered
as `ASSETS.iconChevron32`. The root `width`/`height` are dimension-exact, so
layout is correct and swapping in the real export is a byte replacement. The
glyph is drawn pointing **down** because the design rotates the instance -90deg;
its stroke colour `#004b87` and its proportions were read off a 704px render of
`6031:5991`, but the exact path is approximate.

**Reused unchanged:** `bulletMarker` (5 x 13), `iconStarOff` (20 x 20),
`iconChevronRight` (16 x 16, now used only on the double-chevron card),
`heroBackground`, `iconEye`, `iconChevronDown`, `mygovnlWordmark`.

`grep -r "figma.com" src/ public/` returns nothing.

---

## 8. Files modified

- `src/app/page.tsx` — root node id in the header comment; `leading-[normal]` x2.
- `src/app/dashboard/page.tsx` — header comment and geometry; `WelcomeSection`
  228/40px; `SearchField` rewritten as an empty 340x56 box; new `SearchButton`;
  `FavouritesSection` 136/28px/16px; `AllServicesSection` heading 28px; new
  card props threaded through; `leading-[normal]` x2.
- `src/components/service/ServiceCard.tsx` — padding, type scale, 32px chevron,
  bullet indent, inset-ring stroke, three new optional props.
- `src/lib/data/services.ts` — node reference, column heights, and the
  `headerTop` / `titleWraps` / `duplicateChevron` flags. **No copy changed.**
- `src/lib/data/landing.ts` — node reference only. **No copy changed.**
- `src/lib/assets.ts` — added `iconChevron32` (targeted edit).
- `public/assets/icon-chevron-32.svg` — new.

`npm run build` succeeds, zero TypeScript errors, `/` and `/dashboard` both
still emitted as static routes.
