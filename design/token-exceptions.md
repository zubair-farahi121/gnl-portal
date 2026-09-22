# Token exceptions — consolidated

Every place the build deviates from the Figma file, or where the Figma file
contradicts itself. Reproduced in code as designed; listed here for Tatyana.

Last updated: 2026-09-16 (Phases 0-2).

---

# Token exceptions

Values found in Figma that do not match the token set in `src/app/globals.css`,
or that could not be reproduced faithfully in code. Everything here is
reproduced **exactly as designed** in the build — this file exists so Tatyana
can reconcile the design file, not so the code can diverge from it.

Source: `C1 | GNL - R3`, file key `Dc1bPoXX1VoB9v1MtLvu8e`.

## Value mismatches

| Frame / component | Node | Property | Figma value | Nearest token | Notes |
|---|---|---|---|---|---|
| confirmation | 6102:101190 | border-radius | 6px | `--gnl-radius-btn` (4px) | `btn-back` and `ContinueButton` disagree. Reproduced, not harmonised — see below. |
| `btn-back` (outline button) | 6031:6350 | border-radius | 6px | `--gnl-radius-btn` (4px) | Same inconsistency as above, on the prerequisite-check frame. |
| `ContinueButton` (primary button) | 6031:6352 | border-radius | 4px | `--gnl-radius-btn` (4px) | Matches the token. Listed for contrast with the row above. |
| `step-bar` (stepper track) | 6031:6311 | background | `#e9ebf0` | `--gnl-border` (`#e0e4e6`) | **Corrects the plan.** Task 7 provisionally used the border token for the unfilled track; the real value is `#e9ebf0`. Not a token — a one-off hex. Worth promoting to a token if it recurs. |
| `top-nav actions` | 6031:6245 | background | `#2b3a4e` | `--gnl-primary` (`#243746`) | The nav bar is a different dark blue from the primary/header blue. Two near-identical darks in one file. |
| `header` (login) | 6031:5866 | background | `#243746` | `--gnl-primary` | Matches. |
| `footer verified` | 6031:5972 | background | `#64717c` | *(none)* | Footer grey is not in the token set. |
| nav link / sign-out label | I6031:6245;6022:2283 | color | `#bfc4c8` | *(none)* | Muted nav foreground; not in the token set. |
| footer utility links | 4002:504 | color | `#e0e4e6` | `--gnl-border` | The border token is being reused as a text colour. Probably unintentional. |

## Font weights that the webfont cannot provide

Lato ships 100 / 300 / 400 / 700 / 900. It has **no 500 (Medium) and no 600
(SemiBold)**. Synthesising them would smear the glyphs and fail the pixel diff,
so each is mapped to the nearest real weight.

| Component | Node | Figma says | Rendered as | Notes |
|---|---|---|---|---|
| Stepper labels (inactive) | 6031:6314 / 6315 / 6317 | `Lato:Medium` (500) | **400** | Active label is `Lato:Bold` and renders at 700 as designed. |
| Stepper labels (inactive), CID mobile | 6257:67907-910 / 67921-924 / 69753-756 | `Lato:Medium` (500) | **400** | Same mapping, re-confirmed on the reworked CID frames 2026-09-22. The active label there is now `Lato:Bold` on `#212326` (it used to be bold on `#5f6368`). |
| `sub-step-readout` pill, CID mobile | 6257:72178 / 67925 / 72248 | `Lato:Regular` (400) | **400** | No mapping needed — listed so the pill's type is on the record with the rest of the CID stepper rework. |
| Top-nav link labels | I6031:6245;6022:2283 | `Lato:Medium` (500) | **400** | Desktop and mobile nav. |
| `btn-signout` label | I6031:6245;6022:2298 | `Lato:SemiBold` (600) | **700** | 700 is the nearer available weight; 400 read far too light against the design. |

**Ask for Tatyana:** can the design move these to Regular (400) or Bold (700)?
If Medium is genuinely wanted, Lato Medium must be licensed and self-hosted as a
real face, and Task 21 re-checked against the baseline.

## Box-model deltas

| Component | Node | Issue |
|---|---|---|
| `btn-back` (BtnOutline) | 6031:6350 | Figma frame is 75 x 39 with the 1px stroke drawn *inside* and the label at x=20 / y=10. CSS `box-border` adds the border outside the padding, so the mandated `px-[20px] py-[10px]` renders **77 x 41**. The plan fixes those padding values, so they are what is in the code. Exact-fit alternative if the pixel gate flags it in Task 12: `px-[19px] py-[9px]`. `ContinueButton` has no border and is exact at 106 x 37. |
| `top-nav actions` (TopNav, MobileTopNav) | 6031:6245, 6039:9699 | Figma puts a 1px white bottom border inside the 69px / 145px frame. `border-b` would push the content off-centre by 0.5px, so the border is painted with `shadow-[inset_0_-1px_0_0_#ffffff]` instead. Visually identical, and the outer box stays exactly 69px / 145px. |

## Missing assets

`figma.com` is blocked by this environment's network proxy (403 on every asset
URL), so **no real export could be downloaded**. Every file below is a
dimensionally-correct neutral placeholder committed under `public/assets/` and
indexed in `src/lib/assets.ts`. Outer box and inner leaf geometry are reproduced
exactly, so replacing a placeholder with the real export is a byte swap with
**no layout change**.

| Placeholder file | Figma node | Expected dimensions (px) | Used by |
|---|---|---|---|
| `gnl-crest-flowers.svg` | `I6011:775;6098:62280` | 45.723 x 29.613 leaf, inset `0 36.61% 18.23% 0` of the crest box | SiteFooter (both variants) |
| `gnl-crest-wordmark.svg` | `I6011:775;6098:99116` | 72.076 x 24.820 leaf, inset `30.74% 0 0.72% 0.08%` of the crest box | SiteFooter (both variants) |
| `mygovnl-logo.svg` | `I6031:6245;6022:2272` | 112 x 33.645 | TopNav, MobileTopNav |
| `mygovnl-header-logo.svg` | `4002:516` | 293.328 x 74.010 (**PNG in Figma**, placeholder is SVG) | LoginHeader |
| `icon-gear.svg` | `I6031:6245;6022:2282;9661:4172` | 13.190 x 13.261 inner leaf inside a 16 x 16 box, inset `8.56% 8.78%` | TopNav, MobileTopNav |
| `icon-user.svg` | `I6031:6245;6022:2285` | 16 x 16 | TopNav, MobileTopNav |
| `icon-bell.svg` | `I6031:6245;6022:2289` | 16 x 16 | TopNav, MobileTopNav |
| `icon-info.svg` | `I6031:6245;6022:2293` | 16 x 16 | TopNav, MobileTopNav |

The crest box itself is **72.134 x 36.215** in the desktop footer and
**99.214 x 49.811** in the mobile footer; the two leaves are positioned by
percentage inset so both sizes come out correct from the same files.

Placeholder icons are stroked `#bfc4c8` (the nav foreground) rather than
`currentColor`, because an SVG referenced through `<img src>` cannot inherit
colour from the page. If the real exports are monochrome and need to follow
text colour, switch them to inline SVG at that point.

**Every one of these must be re-exported before the demo.** None of them is
fit to show a client.

## Deliberate non-reproductions

| What | Why |
|---|---|
| Phone bezel around the CID screens | No device mock exists in the Figma file and the 393px baselines are of the bare frame. `PhoneFrame` is a plain 393px column. (Plan open question O2 — this is the documented default.) |
| Responsive behaviour | The file defines no breakpoints. No `sm:` / `md:` / `lg:` classes anywhere. |
| Dark mode | The file defines one appearance. A `prefers-color-scheme` rule would silently fail the gate on any machine set to dark. |

---

# Token exceptions — Phase 2a (Task 9 login page, Task 10 services dashboard)

Companion to `design/token-exceptions.md` (Phase 0–1). Everything listed here is
reproduced **exactly as designed** in the build — this file exists so Tatyana can
reconcile the design file, not so the code can diverge from it.

Source: `C1 | GNL - R3`, file key `Dc1bPoXX1VoB9v1MtLvu8e`.
Frames: `mygovnl-login-page` `6031:5865` (1440 x 1880.215),
`mygovnl-services-dashboard` `6031:5974` (1440 x 1864.275).

---

## 1. Colours that are not in the token set

`globals.css` defines five colours. These two frames use nine more. None is a
Figma variable — every one is a raw per-frame hex.

| Frame / component | Node | Property | Figma value | Nearest token | Notes |
|---|---|---|---|---|---|
| `LoginCard` heading | 6031:5869 | color | `#212326` | `--gnl-heading` | Matches. Exposed as `var(--gnl-heading)` in Figma — the only token-backed colour on either frame. |
| `LoginButton` | 6031:5888 | background | `#263854` | `--gnl-primary` (`#243746`) | **Third dark blue in the file.** Header is `#243746`, top-nav is `#2b3a4e`, this is `#263854`. Three near-identical darks, no variable behind any of them. |
| Link / category / card-title blue | 6031:5884, 6031:5895, 6031:5992 | color | `#004b87` | *(none)* | The file's link blue. Used on the login page for "Create account" / "Forgot password?", on both grids for headings. Strong candidate for a token. |
| Input and card borders | 6031:5873, 6031:5959, 6031:5979, 6031:5990 | border | `#d4d8da` | `--gnl-border` (`#e0e4e6`) | **A second, darker border grey.** Every input, accordion and service card on these two frames uses `#d4d8da`, not the `#e0e4e6` border token. The token is only used by the wizard cards. |
| `FAQSection` | 6031:5957 | background | `#f0f2f5` | *(none)* | Page-section tint. Not a token. |
| Hero scrim | 6031:5867 | background | `rgba(122,134,144,0.35)` | *(none)* | Translucent grey over the hero photograph. |
| `SearchButton` | 6031:5981 | background | `#2a7d6f` | *(none)* | A one-off green, used nowhere else in the flow. |
| `footer-section` band | 6031:6228 | background | `#512d6d` | *(none)* | Purple band above the shared grey footer. Also the `feedback-button` label colour. |
| `feedback-button` | 6031:6237 | background | `var(--light-100, white)` | `--gnl-surface` | Matches. The only other variable-backed value on either frame. |

## 2. Radii that do not match the token set

| Component | Node | Figma value | Nearest token | Notes |
|---|---|---|---|---|
| `AccordionContainer` | 6031:5959 | `8px` | `--gnl-radius-card` (6px) | **A fourth radius.** The file already has 4px (primary button) and 6px (card / outline button); this adds 8px for one container. |
| `LoginCard`, `InputContainer`, `service-card-*` | 6031:5868, 6031:5873, 6031:5990 | `6px` | `--gnl-radius-card` | Matches. |
| `LoginButton`, `SearchButton`, `feedback-button` | 6031:5888, 6031:5981, 6031:6237 | `4px` | `--gnl-radius-btn` | Matches. |
| `card-header`, `card-footer` | 6031:5991, 6031:6004 | `6px` | — | A radius on a **transparent, unfilled, unstroked** flex row. Harmless but meaningless — it renders nothing. Reproduced anyway. |

## 3. Shadow

| Component | Node | Figma value | Token | Notes |
|---|---|---|---|---|
| `LoginCard` | 6031:5868 | `drop-shadow(0px 4px 8px rgba(0,0,0,0.1))` | `--gnl-shadow-card` is `0px 4px 12px rgba(0,0,0,0.03)` | Different blur **and** different opacity from the wizard-card shadow. Two card shadows in one file. |
| `service-card-*` | 6031:5990 et al. | *(none)* | — | The dashboard service cards have **no** shadow at all, only the `#d4d8da` border. A third card treatment. |

## 4. Font weights the webfont cannot provide

Lato ships 100 / 300 / 400 / 700 / 900 — **no 500 (Medium), no 600 (SemiBold)**.
Per the standing rule: Figma `Lato:Medium` → 400, `Lato:SemiBold` → 700.

**Neither of these two frames requests Medium or SemiBold.** Every text layer on
`6031:5865` and `6031:5974` is `Lato:Regular` (400) or `Lato:Bold` (700), so
there is nothing to map and no glyph is synthesised on either page. Logged
explicitly because the instruction was to log every instance — the count is zero.

(The `Lato:Medium` instances already recorded in `token-exceptions.md` are in
`TopNav` / `MobileTopNav` / the stepper, which these pages consume unchanged.)

## 5. Apostrophes — the design file is inconsistent

The standing rule is that `it's` / `Driver's` use U+2019. On these two frames
that is true in exactly one place and false everywhere else. Copy is reproduced
**character-for-character as found**, so the build now contains both forms.

| Where | Node | Character | Text |
|---|---|---|---|
| `HeroSection` | 6125:46292 | **U+2019** (typographic) | `Don’t have an account? ` |
| `ServicesSection` bullet | 6031:5898 | **U+0027** (straight) | `•  Renew your driver's licence` |
| `ServicesSection` bullet | 6031:5904 | **U+0027** | `•  Take your learner's permit test` |
| `ServicesSection` bullet | 6031:5943 | **U+0027** | `•  Renew your child's MCP card` |
| `service-card-c2-1` title | 6031:6087 | **U+0027** | `Learner's permit and off-road vehicle tests` |
| `service-card-c2-1` bullet | 6031:6094 | **U+0027** | `Take your 5I learner's permit test` |
| `service-card-c3-1` bullet | 6031:6185 | **U+0027** | `Renew your child's MCP card` |

**Ask for Tatyana:** should the whole file be normalised to U+2019? If so this
is a one-pass find-and-replace in Figma and a matching one in
`src/lib/data/landing.ts` and `src/lib/data/services.ts`.

### Related copy defects, reproduced verbatim

| Node | Text as designed | Issue |
|---|---|---|
| 6031:6139 | `Renew your vehicle or drivers licence` | Missing apostrophe in `drivers`. Every other reference in the file writes `driver's`. |
| 6031:5916 vs 6031:6017 | `Search for a list of regulated child care services` | Identical bullet, but the login page writes `Add your child(ren) to a waitlist(s)` (6031:5918) while the dashboard card writes `Add your child to a waitlist(s)` (6031:6021). Two wordings for one service. |
| 6031:6167 | `Take your commercial driver test (Class 1-4 & 9)` | Literal `&` rather than `and`; hyphen rather than en dash in `1-4`. Reproduced. |
| 6031:5980 | `Search services...` | Three ASCII periods, not U+2026. Reproduced. |
| 6031:5891, 6031:5958 | `Things you can do here`, `How can we help?` | Section headings are `#5f6368` (**body** grey), while every heading on the dashboard is `#212326`. Inconsistent heading colour between the two frames. |

## 6. Box-model deltas — strokes drawn inside the frame

Three containers on these frames have a 1px stroke that Figma draws **inside**
the frame, so it contributes no height. CSS `border` (even with `box-border`)
would, and the error compounds down an 1880px page. Each is painted as an inset
ring instead — the same trick `TopNav` already uses for its white underline.
Visually identical; outer box stays exact.

| Component | Node | Figma frame | Why a real border fails |
|---|---|---|---|
| `AccordionContainer` | 6031:5959 | 800 x 168 | 3 rows x 56 = 168 exactly. A 1px border would make it 170 and push the footer 2px down. Rows keep a real `border-b` inside an explicit `h-[56px]`. |
| `input-field` (search) | 6031:5979 | 340 x 57 | 12 + 33 (SearchButton) + 12 = 57. A border makes it 59, which breaks the 217px `welcome-section`. |
| `welcome-section` | 6031:5976 | 1440 x 217 | Bottom divider. A `border-b` would make the section 218. |

Note the accordion row padding: Figma specifies `px-[24px] py-[16px]`, which with
a 16px/1.5 (= 24px) line box gives 16 + 24 + 16 = 56. The code pins `h-[56px]`
with `items-center` instead of the vertical padding, so the row's own `border-b`
lands inside the 56px rather than adding a 57th pixel.

## 7. Structural deviations from the plan

| Plan said | Figma shows | Resolution |
|---|---|---|
| Task 10: `SERVICE_COLUMNS: { title, body, href? }[][]` where `body` is a paragraph | Each `service-card-*` body is a `bullet-list` of 1–8 rows, each with its own 5 x 13 marker and a 10px gap | Signature kept exactly as specified. `body` is **newline-separated**; `ServiceCard` splits on `\n` and renders one `bullet-row` per line. Documented on `ServiceCardData`. |
| Task 9: "three columns at x=0/380/760, each 340 wide" | Columns are `flex-[1_0_0]` inside an 1100px row with `gap-[40px]` — 3 x 340 + 2 x 40 = 1100 | Implemented as flex-1 (as designed), which resolves to the same 340px. Not hard-coded. |
| Task 9: grid column heights 426 / 268 / 350 | Derived by auto-layout from content | Not pinned. 426 is load-bearing and verified: 80 + 42 + 48 + **426** + 80 = 676, the frame height. |
| Task 10: grid column heights 906 / 730 / 974 | Derived by auto-layout from content | Not pinned, for the same reason. Pinning a content-derived height clips the longest card. `all-services-section` (1134) is likewise left to flow; `welcome-section` (217) and `favourites-section` (130) ARE pinned because both derivations close exactly. |
| — | `favourites-section` has a heading and an explanation but **no favourites list** | Rendered as designed. There is no empty-state card and no placeholder — do not invent one. |
| — | `card-footer` 6031:6004 contains a `placeholder-space` frame that is literally 1 x 20 | Reproduced as a 1 x 20 spacer `div`. It is what holds the footer row open on cards with no left-hand action. |

## 8. Interaction the design does not specify

| Element | Node | Decision |
|---|---|---|
| Accordion rows | 6031:5960 / 5964 / 5968 | **Closed and inert.** No open state, no panel copy and no expanded variant exists in the file, so no open/close behaviour was added. Adding one would invent a design and change the 56px row height. |
| Email / Password inputs | 6031:5873, 6031:5880 | Presentational `div`s, not `<input>`. Figma fills the value slot with a zero-width space (U+200B) to hold the 21px line box open; that is reproduced literally. A real input would drag focus rings, placeholder metrics and autofill styling into the pixel diff. |
| Search field | 6031:5979 | Same — `Search services...` is a text layer, not a placeholder attribute. |
| `Create account`, `Forgot password?` | 6031:5884, 6125:46293 | Styled as links, rendered inert. No destination exists in this demo. |
| `Log in` | 6031:5888 | **Live** → `/dashboard/`. |
| `feedback-button` | 6031:6237 | Inert. No destination; a dead link on stage is worse than an unclickable one. |
| `service-card-*` | all ten | **Only `Driver and Vehicle` (6031:6130) navigates**, to `/services/driver-vehicle/`. The other nine render as plain `div`s — not disabled links, not no-op buttons. Nothing to click means nothing can strand the presenter on an unbuilt screen. |
| `star-off` | 6031:6006 et al. | Decorative. Favouriting is not part of the demo flow. |

## 9. Missing assets

`figma.com` is blocked by this environment's network proxy (403 on every asset
URL), so **no real export could be downloaded**. Each file below is a
dimensionally-exact placeholder committed under `public/assets/` and indexed in
`src/lib/assets.ts`. Outer box and inner leaf geometry are reproduced exactly, so
replacing a placeholder with the real export is a byte swap with **no layout
change**.

| Placeholder file | Figma node | Expected dimensions (px) | Used by |
|---|---|---|---|
| `hero-background.svg` | `6031:5867` (fill) | 1440 x 560, `object-cover` (**PNG in Figma**, placeholder is SVG) | Login page hero |
| `icon-eye.svg` | `6031:5882` | 16 x 16 | Login page, password field |
| `icon-chevron-down.svg` | `6031:5962` / `5966` / `5970` | 16 x 16 | Login page, 3 accordion rows |
| `icon-chevron-right.svg` | `6031:5993` + 9 siblings | 16 x 16 | `ServiceCard` header, 10 instances |
| `bullet-marker.svg` | `6031:5997` + 30 siblings | **5 x 13** — deliberately not square | `ServiceCard` bullet rows |
| `icon-star-off.svg` | `6031:6006` + 9 siblings | 20 x 20 | `ServiceCard` footer, 10 instances |
| `mygovnl-wordmark.svg` | `6031:6229` | 150 x **45.05972671508789** | Dashboard purple footer band |

**Every one of these must be re-exported before the demo.** The hero background
in particular is a photograph standing in as a flat gradient; it is not fit to
show a client.

Placeholder icons are stroked with the colour the design uses at that position
(`#5f6368`, or `#004b87` for the card chevron) rather than `currentColor`,
because an SVG referenced through `<img src>` cannot inherit colour from the
page. If the real exports are monochrome and need to follow text colour, switch
them to inline SVG at that point.

## 10. Frame arithmetic — verified

Both frames close to the pixel with the values above.

```
login     128 + 560 + 676 + 376 + 140.215                = 1880.215   ✓ (Figma 1880.215)
dashboard  69 + 217 + 130 + 1134 + 314.275               = 1864.275   ✓ (Figma 1864.275)

ServicesSection    80 + 42 + 48 + 426 + 80               =  676       ✓
FAQSection         60 + 36 + 32 + 168 + 80               =  376       ✓
welcome-section    48 + 48 + 24 + 57 + 40                =  217       ✓
favourites-section 40 + 36 + 12 + 22 + 20                =  130       ✓
footer-section     48 + 45.05972671508789 + 24 + 33 + 24
                      + 140.21519470214844               =  314.2749  ✓
```

---

# Token exceptions — Phase 2b (Tasks 11 & 12)

Deviations found while building the two Driver and Vehicle desktop screens:

- **Task 11** — `/services/driver-vehicle` — Figma `6031:6244` `driver-vehicle-service-page` (unverified)
- **Task 12** — `/services/driver-vehicle/onboard` — Figma `6031:6304` `driver-vehicle-prerequisite-check`

Everything listed is **reproduced exactly as designed** in the build. This file
exists so Tatyana can reconcile the design file, not so the code can diverge
from it. Companion to `design/token-exceptions.md` (Phase 0/1) and
`design/token-exceptions-phase2a.md` (Tasks 9/10).

Source: `C1 | GNL - R3`, file key `Dc1bPoXX1VoB9v1MtLvu8e`.

---

## 1. Stepper values verified — no change needed

Task 7 flagged two provisional values for correction in Task 12. Both were
already correct and `src/components/wizard/ProgressStepper.tsx` was **not
modified**.

| Value | Provisional | Read from `6031:6304` | Verdict |
|---|---|---|---|
| Unfilled track colour (`step-bar`, `6031:6311`) | `#e9ebf0` | `#e9ebf0` | **Correct** — confirmed. Still a one-off hex, not a token; it is NOT `--gnl-border` (`#e0e4e6`). |
| Fill width at `current={2}` (`step-bar-fill`, `6031:6312`) | 75% via `(current + 1) / 4` | `555px` of a `740px` track = **exactly 75%** | **Correct** — the even-quarters formula is real, not a coincidence. |

Label weights on this frame also confirm the Task 7 reading: steps 1, 2 and 4
are `Lato:Medium`, step 3 (`Prerequisite Check`, the active one) is `Lato:Bold`.

---

## 2. Colour values with no token

| Frame / node | Property | Figma value | Nearest token | Notes |
|---|---|---|---|---|
| All four cards on `6031:6244`, both option cards on `6031:6304` (`6031:6260`, `6031:6266`, `6031:6270`, `6031:6294`, `6031:6322`, `6031:6335`) | border | `#d4d8da` | `--gnl-border` (`#e0e4e6`) | **Significant.** Every card on both of these frames uses `#d4d8da`, while `wizard-card` (`6031:6307`) on the *same* frame as the option cards uses `#e0e4e6`. Two card-border greys coexist inside one wizard screen. Worth a decision: one of the two should win. |
| `badge-confirmation` `6031:6252` | background | `#e8706f` | *(none)* | Salmon/red "Confirmation required" pill. Likely the same family as the `--gnl-danger` value Task 19 still has to extract — check they agree before adding the token. |
| `notification-bell-container` `6031:6256` | background | `#eaecef` | *(none)* | A third near-identical light grey, alongside `#e0e4e6` and `#e9ebf0`. The file now has three. |
| Breadcrumb, "Terms of Use", phone link, `Cancel`, GNL/CID option title (`6031:6249`, `6031:6293`, `6031:6299`, `6031:6349`, `6031:6340`) | color | `#004b87` | *(none)* | The link blue. Used consistently across both frames — this one clearly deserves a token (`--gnl-link`). |
| `service-subtitle` `6031:6259`, `section-subtitle` `6031:6320` | color | `#212326` | `--gnl-heading` | Body copy painted with the **heading** colour rather than `--gnl-text` (`#5f6368`). Inconsistent with every other body string on both frames. |
| `badge-confirmation` label `6031:6255` | color | `var(--light-100, white)` | `--gnl-surface` | Figma variable `light-100`. Mapped to `--gnl-surface` in code, which is also `#ffffff`. |

---

## 3. Shape, spacing and elevation mismatches

| Frame / node | Property | Figma value | Token | Notes |
|---|---|---|---|---|
| `verification-card` `6031:6260` | box-shadow | `drop-shadow(0px 2px 4px rgba(0,0,0,0.03))` | `--gnl-shadow-card` = `0px 4px 12px rgba(0,0,0,0.03)` | **A second card shadow.** Same opacity, different blur and offset from the wizard-card shadow. |
| `verification-card` `6031:6260` | padding | `48px` | card padding `40px` | A third card padding on top of the `24px` / `20px` used by the sidebar cards. Card padding on these two frames is `48` / `40` / `24` / `20` — four values. |
| `OnboardButton` `6031:6263` | padding-x | `28px` | `ContinueButton` uses `24px` | Same 14px Bold label, same `#243746` fill, same `4px` radius, different horizontal padding. `OnboardButton` is therefore **not** rendered through `<BtnPrimary>`; it is written out inline so the 28px survives. |
| `badge-confirmation` `6031:6252`, `notification-bell-container` `6031:6256` | border-radius | `100px` | `--gnl-radius-card` (6px) | Pill radius; expected for pills, listed for completeness. |
| `data-privacy-card` body `6031:6272` | line-height | `22px` on a `14px` size (≈1.571) | default `1.5` | Every other 14px string on these frames is `1.5` (21px). This one block is 22px. |
| `verification-card` body `6031:6262` | line-height | `24px` on a `15px` size (1.6) | default `1.5` | Same kind of off-ratio one-off. |
| `Frame 1` `6031:6321` | gap | `24px` | `--gnl-space-4` (24px) | Matches. Listed for contrast with the `20px` sidebar gap below. |
| `sidebar-right` `6031:6265` | gap | `20px` | *(none)* | `content-left` on the same frame uses `24px`. Two column gaps side by side. |

---

## 4. Design inconsistency reproduced, not harmonised

**The two `service-item-card` titles on `6031:6304` are styled differently.**

| | MRD card `6031:6322` | GNL / CID card `6031:6335` |
|---|---|---|
| Title node | `6031:6327` | `6031:6340` |
| Colour | `#5f6368` (body grey) | `#004b87` (link blue) |
| Line-height | `1.5` → row 24px tall | `normal` → row 19px tall |
| Radio (`radio-inner`) | `hidden="true"` — unselected | visible — selected |
| Resulting card height | **134px** | **129px** |

The 5px height difference between two otherwise identical cards is entirely
caused by the line-height disagreement. Both are reproduced exactly. **Ask
Tatyana:** is the blue title meant to signal "this one is clickable/selected",
or is it a leftover? If it is intentional, the MRD title should probably also
move to `normal` leading so the two cards match in height.

---

## 5. Apostrophes — this frame family uses STRAIGHT quotes

The Global Constraints section of the plan mandates the typographic apostrophe
(U+2019), on the evidence of the confirmation frame (`Driver&#x2019;s License
Renewal`). **That does not hold across the file.**

| String | Node | Character in Figma |
|---|---|---|
| `Must have a valid driver's license` | `6031:6332`, `6031:6345` | **U+0027** straight apostrophe |
| `Once you click the "Onboard" button …` | `6031:6262` | **U+0022** straight double quotes, not curly |
| `Service has been successfully onboarded, and it&#x2019;s ready…` | `6102:101160` (confirmation) | U+2019 typographic |

Both are reproduced as found, so the two frames now disagree in the build
exactly as they disagree in the design. **Ask Tatyana to pick one convention
and apply it file-wide**; until then the copy tests must assert per-frame, not
globally.

---

## 6. Two code defects found by measurement, and fixed

Both pages were measured in Chromium against the Figma frame values. Two
systematic faults showed up; both are now fixed and re-measured exact.

### 6a. `leading-normal` is not `line-height: normal`

`BtnPrimary` and `BtnOutline` used the Tailwind class **`leading-normal`**
where Figma specifies **`line-height: normal`**. They are different:

- Tailwind `leading-normal` → `line-height: 1.5`
- `leading-[normal]` → `line-height: normal` (≈1.2 for Lato)

**Fixed** in `src/components/ui/BtnPrimary.tsx` and
`src/components/ui/BtnOutline.tsx` (`leading-normal` → `leading-[normal]`).

> **Still outstanding elsewhere:** `TopNav.tsx` and `SiteFooter.tsx` use
> `leading-normal` in the same way. Not touched here — they are shared with
> screens being built concurrently. **Owner: Task 21.**

### 6b. Figma strokes are inside the frame; CSS borders are not

Figma draws a 1px stroke *inside* the frame box, so content sits 24px from the
outer edge. A CSS `border` plus `box-border` puts content at 25px and adds 2px
to the outer box. Every bordered element on these two frames was therefore 2px
too big. `TopNav` already solved this with an inset box-shadow; that pattern is
now applied consistently.

| Element | Figma | With CSS `border` | With inset ring |
|---|---|---|---|
| `verification-card` `6031:6260` | 860 × **281** | 860 × 283 | 860 × **281** ✓ |
| `favourite-card` `6031:6266` | 380 × **64** | 380 × 66 | 380 × **64** ✓ |
| `data-privacy-card` `6031:6270` | 380 × **504** | 380 × 506 | 380 × **504** ✓ |
| `contact-card` `6031:6294` | 380 × **93** | 380 × 95 | 380 × **93** ✓ |
| `service-item-card` (MRD) `6031:6322` | 740 × **134** | 738 × 136 | 740 × **134** ✓ |
| `service-item-card` (CID) `6031:6335` | 740 × **129** | 738 × 131 | 740 × **129** ✓ |
| `wizard-card` `6031:6307` | **820** × 689, inner **740** | 820 × 701.5, inner **738** | 820 × 688.5, inner **740** ✓ |
| `btn-back` `6031:6350` | **75 × 39** | 77 × 43 | **75 × 39** ✓ |
| `ContinueButton` `6031:6352` | **106 × 37** | 106 × 41 | **106 × 37** ✓ |

**Changed:** `src/components/wizard/WizardCard.tsx`,
`src/components/ui/BtnOutline.tsx`, and the card chrome in both new pages.
This also retires the "KNOWN 2px BOX-MODEL DELTA" caveat recorded against
`btn-back` in `design/token-exceptions.md` — `px-[20px] py-[10px]` now render
at exactly 75 × 39, so the `px-[19px]/py-[9px]` workaround suggested there is
no longer needed.

`WizardCard`, `BtnPrimary` and `BtnOutline` are consumed only by the two wizard
screens (`/services/driver-vehicle/onboard`, `/services/driver-vehicle/confirmation`),
so the confirmation screen gains the same corrections. No page owned by another
agent uses them.

### Residual sub-pixel deltas (accepted)

| Element | Figma | Rendered | Cause |
|---|---|---|---|
| Page shell, both frames | 1038.215 / 1202.215 | 1038.203 / 1202.203 | 0.012px, from the footer's 140.215px. Pre-existing. |
| `wizard-card` `6031:6307` | 689 | 688.5 | `section-subtitle` is 15px × 1.5 = 22.5px; Figma rounds its text box to 23. |
| `breadcrumb-row` `6031:6248` | 120 wide | 118.594 | Hug-content text row; text-measurement difference only. Left-aligned, so nothing downstream shifts. |

---

## 7. Missing assets — placeholders

`figma.com` is blocked by this environment's network proxy (403 on every asset
URL), so **no real export could be downloaded**. Each file below is a
dimension-exact neutral placeholder committed under `public/assets/` and indexed
in `src/lib/assets.ts`. Outer box and inner leaf geometry are exact, so
replacing a placeholder with the real export is a byte swap with **no layout
change**. `grep -r "figma.com" src/ public/` returns nothing.

| Placeholder file | Figma node | Dimensions (px) | Used by |
|---|---|---|---|
| `icon-lock.svg` | `6031:6253` | 12 × 12 | `badge-confirmation`. Stroked `#ffffff` — it sits on the `#e8706f` pill. |
| `icon-bell-alert.svg` | `6031:6257` | 16 × 16 | Bell inside the 32px `#eaecef` circle. Distinct from the nav `icon-bell.svg`, which is stroked for a dark bar. |
| `icon-star.svg` | `6031:6268` | 20 × 20 | `favourite-card`. Filled/active star; distinct from Task 10's `icon-star-off.svg`. |
| `icon-home.svg` | `6098:34117` | 16 × 16 | "View your address" scope row. |
| `icon-mail.svg` | `6098:34121` | 16 × 16 | "View your email" scope row. |
| `icon-user-scope.svg` | `6098:34125`, `6098:34129` | 16 × 16 | "View your first name" **and** "View your last name" — one asset, two rows, as in Figma. |
| `icon-phone.svg` | `6031:6297` | 16 × 16 | `contact-card`. |
| `divider-line.svg` | `6031:6273`, `6031:6292` | 332 × 1 | The two rules in `data-privacy-card`. **Stroke colour is a guess** (`#d4d8da`, matching the card border) — a 1px vector returns no hex through the MCP. Confirm with Tatyana. |
| `radio-unselected.svg` | `6031:6325` | 16 × 16 | MRD option. Ring only; `radio-inner` is `hidden="true"`. |
| `radio-selected.svg` | `6031:6338` | 16 × 16 | GNL/CID option. Ring plus the 8 × 8 dot inset 4px. Ring/dot **colours are a guess** (`#004b87`, matching the title). |
| `bullet-dot.svg` | `6031:6331`, `6031:6344` | 4 × 4 | Verification-list bullets; one asset shared by both cards, as in Figma. |

The `GNL Logo` in both option cards (`6098:100409`, `6098:60395`) is **72.134 ×
36.215** — the same component and the same size as the desktop footer crest, so
it reuses the existing `gnl-crest-flowers.svg` / `gnl-crest-wordmark.svg` leaves
at the same percentage insets. No new asset was needed.

**Every placeholder must be re-exported before the demo. None is fit to show a
client.**

---

## 8. Deliberate deviations

| What | Figma | In the build | Why |
|---|---|---|---|
| "← Back to Services" breadcrumb `6031:6249` | `href="https://www.gov.nl.ca"` | `/dashboard/` | An external link would throw the presenter out of the demo mid-story. Purely behavioural — no pixel effect. |
| `Cancel` / `Back` / `Continue` on `6031:6348` | rendered as controls | rendered, but inert (no href, no handler) | Task 12 mandates that **only** the CertifiO ID option is clickable, so the presenter cannot reach an unbuilt screen. |
| Verified state of `6031:6244` | frame `6065:23367` | not built | Blocked on plan open question **O1**. Marked in `src/app/services/driver-vehicle/page.tsx` with `// TODO(task-19)`; `verified` is already read from `useDemoState()` and surfaced as a non-visual `data-verified` attribute on the shell. |
| `Terms of Use` `6031:6293`, phone link `6031:6299` | external `gov.nl.ca` / `tel:` | kept as designed | Genuinely external destinations; left alone. |
