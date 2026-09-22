# Re-sync: `/auth/loading` and `/services/driver-vehicle/confirmation`

Date: 2026-09-21. File key `Dc1bPoXX1VoB9v1MtLvu8e`.
Source: `get_design_context` / `get_metadata` only. **Nothing was written to Figma.**

| Route | Old node | New node | New frame name | Size |
|---|---|---|---|---|
| `/auth/loading` | `6158:69596` (deleted) | `6217:80871` | `Provider page_IDV results status` | 1440 x 1078.196 |
| `/services/driver-vehicle/confirmation` | `6102:101144` (deleted) | `6217:82446` | `driver-vehicle-confirmation` | 1440 x 1024 |

---

## 1. `/auth/loading` — materially redesigned

The old frame was a 520 x 422 centred card with a 100 x 100 CSS spinner and
invented copy (the node had been deleted and was reconstructed from notes).
The new frame is a **static message card with no spinner, no progress ring, no
progress bar and no animation of any kind**.

### Structure (verbatim)

```
top-nav actions   1440 x 69       y=0        6217:79257
main-content      1440 x 868.981  y=69       6217:79258
                  px-[120px] py-[152px], flex-col items-center
  card             824 x content  p-[40px] gap-[32px]   6236:46385
    block                         gap-[32px] items-start 6236:46386
      Headings                    40px Lato Regular      6236:46387
      body                        16px, 3 paragraphs     6236:46389
    footnote                      16px                   6236:46390
footer verified   1440 x 140.215  y=938.981  6217:79267

69 + 868.981 + 140.215 = 1078.196  (frame height, exactly)
```

### Copy — character-for-character from Figma

- Heading: `We've received your information`
- `Your identity verification is now being processed. Depending on your request, this can take anywhere from a few minutes to longer.`
- `You don't need to stay on this page. We'll let you know as soon as it's ready.`
- `You can close this window.`
- Footnote (separate node): `Your progress will be automatically saved and transferred.`

**Correction to the task brief.** The brief quoted the second sentence as
"Depending on **our volume**". The frame says "Depending on **your request**".
The frame wins; the implemented string is the frame's.

Copy now lives in `IDV_STATUS` in `src/lib/data/driver-vehicle.ts`.

### BEHAVIOURAL MISMATCH — deliberate, unresolved

The design describes a **terminal** screen: the user is told the check is
asynchronous, that they need not stay, that they will be notified, and that
they may close the window. There is no control and no indicator on the frame
that implies any client-side transition.

The implementation **keeps the 2600 ms auto-advance** to
`/services/driver-vehicle/confirmation/` so the presenter still reaches the
success screen in a single-machine demo. Nothing on screen hints at it, so the
render matches the design pixel-for-pixel — but the *behaviour* does not match
the design's intent, and a viewer reading the card is being told something the
build does not do.

If the demo is ever shown as a fidelity reference rather than a walkthrough,
this is the one thing to call out. A truthful alternative would be a presenter-
only advance (keypress or a hidden hotspot) rather than a timer.

### Spinner removal

`.gnl-spinner` and `@keyframes gnl-spin` were removed from
`src/app/globals.css`. Verified with grep first: the only references were the
loading page itself and the now-stale note in
`design/token-exceptions-phase4.md` (left untouched — it is another agent's
file and is a historical record). `design/auth_GNL.css` is a reference dump of
the designer's export, not a build input, and was not edited.

---

## 2. `/services/driver-vehicle/confirmation` — rebuilt, layout unchanged

The frame was deleted and rebuilt, but **every child node id survived**
(`6102:101146` main-content, `6102:101147` wizard-card, `6102:101158`
section-intro, `6102:101188` actions-row). Only the wizard-header subtree got
new ids (`6217:82431`-`6217:82440`).

Copy is unchanged. The structure, the two buttons, their targets and their
order are unchanged.

### What actually changed — a type-scale bump

| Element | Node | Was | Now |
|---|---|---|---|
| wizard-title | `6217:82432` | 24px Bold | **28px** Bold |
| step-bar height | `6217:82434` | 8px | **16px** |
| step-labels | `6217:82436` | 12px | **16px** |
| current step label colour | `6217:82440` | `#5f6368` | **`#212326`** |
| section-subtitle | `6102:101160` | 15px | **16px** |
| ContinueButton label | `6102:101193` | 14px | **16px** (box 106 x 37 -> 324 x 39) |

Card height follows: 820 x 370 -> **820 x 391**.
Arithmetic: 40 + 118 + 32 + 74 + 32 + 55 + 40 = 391. ✅

### Why this is a variant and not a global restyle

The same bump is present on `driver-vehicle-prerequisite-check` (`6031:6304`,
header `6031:6308`), which is why that frame grew 1203 -> 1254.

But the **four CID mobile frames were NOT rebuilt**. `CID_TU` (`6217:62834`)
still has `wizard-title` 36px tall (24px font), `step-bar` 8px and
`step-labels` 18px tall (12px font). The design file therefore now carries
**two scales of the same component**.

So `WizardHeader`, `ProgressStepper` and `BtnPrimary` gained an opt-in
`size?: "sm" | "lg"` prop, defaulting to `"sm"`:

- `sm` is byte-identical to the pre-resync output — CID and onboard render
  exactly as before, so nothing outside this task's two screens moved.
- `"lg"` is passed only from the confirmation page.

The shared `WizardHeader` keeps `data-node-id="6031:6308"` (the component's own
id, still valid); this frame's instance of it is `6217:82431`.

---

## Token exceptions raised by these two frames

### Lato weight mapping (Lato ships no 500 and no 600)

| Figma style | Where | Mapped to |
|---|---|---|
| `Lato:Regular` | loading heading `I6236:46387;9411:3313` (40px) | `font-normal` (400) |
| `Lato:Regular` | loading body `6236:46389`, footnote `6236:46390` | `font-normal` (400) |
| `Lato:Medium` | confirmation step-labels `6217:82437/38/39` | **400** (`font-normal`) |
| `Lato:Medium` | top-nav links (shared) | **400** |
| `Lato:Bold` | confirmation title, `Ready to Use`, both buttons | 700 |
| `Lato:SemiBold` | top-nav `Log Out` (shared) | **700** |

Note the loading screen's 40px heading is **Regular, not Bold** — it is the
only large heading in the build that is not bold. That is what the frame says.

### Line height

Every text node on both frames specifies `line-height: 1.5`, so
`leading-[1.5]` is literal throughout. The only `line-height: normal` in play
is on the two buttons, which already use `leading-[normal]` (not Tailwind's
`leading-normal`, which is 1.5). `leading-[normal]` at 16px gives the 19px
label box Figma measures, and hence the 39px button.

### Apostrophes — the file disagrees with itself

| Frame | Glyph | Strings |
|---|---|---|
| `6217:80871` (loading) | **U+0027** straight | `We've`, `don't`, `We'll`, `it's` |
| `6217:82446` (confirmation) | **U+2019** typographic | `it’s`, `Driver’s` |

Both reproduced verbatim, not harmonised. Verified in the built HTML: the
loading page emits `&#x27;` at all four sites, the confirmation page emits
U+2019 at both.

### Card width — 824 vs 820

The IDV status card `6236:46385` is **824px** wide. Every other desktop card in
this file, including the confirmation wizard-card, is 820px. Reproduced as-is.

### Step-bar track colour — per-frame disagreement

`6031:6311` (onboard) paints the track `#e9ebf0` with a `#243746` fill.
`6217:82434` (confirmation) paints the **track itself** `#243746`, with a
`#243746` fill of 555 / 740. Because the current step is the last one the fill
is 100% either way, so the two produce an identical fully-dark bar. The code
keeps the `#e9ebf0` track and a 100% fill — pixel-identical output, one code
path. Noted here rather than encoded as a prop.

### Stroke inset

Both cards carry a 1px `#e0e4e6` stroke drawn **inside** the frame. Painted
with `shadow-[inset_0_0_0_1px_#e0e4e6]` per the `WizardCard` pattern; a CSS
`border` would render the IDV card 826 wide instead of 824.

---

## Assets

**None needed.** Neither frame introduces an icon, image or vector of its own.
Every asset on both frames belongs to the shared `TopNav` and `SiteFooter`,
which already resolve through `src/lib/assets.ts`. `src/lib/assets.ts` was
**not modified**.

`figma.com` does not appear anywhere in `src/` or `public/`. ✅

---

## `design/frames.json` — three stale heights corrected

| id | was | now | live Figma |
|---|---|---|---|
| `service` | 1039 | **1073** | 1072.215 |
| `onboard` | 1203 | **1254** | 1253.215 |
| `service-verified` | 1672 | **1820** | 1819.215 |

`auth-loading` (1079 vs 1078.196) and `confirmation` (1024) were already
correct and were left alone.

---

## Not reproducible / out of scope

1. **No pixel run.** The Playwright chromium binary is not installed in this
   container (`npx playwright install` needs the network), so `npm run visual`
   could not be executed. Geometry was verified arithmetically against
   `get_metadata` instead; both cards reconcile exactly (391 and 348).
2. **`figma.com` is blocked by the proxy (403).** No asset could have been
   downloaded — but see above, none was needed.
3. **`/services/driver-vehicle/onboard/` is now stale.** Its Figma frame
   (`6031:6304`) received the same type-scale bump and grew to 1253.215, but it
   was out of scope for this task, so its page still renders the `sm` scale.
   The `size="lg"` prop is in place; the fix is passing it plus re-checking the
   two `service-item-card` blocks. `frames.json` now records the true height,
   so the next visual run **will** flag it. That is intentional — the row was
   wrong before and silently passing.
4. **Pre-existing, out of scope: `TopNav` nav links use `leading-normal`.**
   Figma says `line-height: normal` on `I…;6022:2283/2287/2291/2295`, which is
   `leading-[normal]` (~1.2), not Tailwind's `leading-normal` (1.5). Benign in
   practice — the links sit in an `items-center` flex row whose height is set
   by the taller `btn-signout`, so the glyphs centre identically and the nav is
   69px either way. Noted, not altered: `TopNav` is shared chrome well outside
   these two screens.
5. **`CocHeadings` Code Connect.** The loading heading maps to
   `stonehenge-webapp/.../CocHeadings.tsx` at `level="H4"`. That component is
   not in this repo and `H4` is a type-scale token (40px), not document
   structure, so the heading renders as the page's `<h1>` with the frame's
   exact typography.
