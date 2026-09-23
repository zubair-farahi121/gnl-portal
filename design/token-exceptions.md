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

---

# 9. The CID ID-document step — added 2026-09-22

The three `CID_ID1` frames on the Driver-and-Vehicle row (y=779) were built as
`/cid/document/`, `/cid/capture-front/` and `/cid/capture-back/`:

| Route | Node | Frame size | Pill |
|---|---|---|---|
| `/cid/document/` | `6087:31396` | 393 x 1168.81 | ID document selection • step 4 of 5 |
| `/cid/capture-front/` | `6056:19118` | 393 x 1174.81 | ID document selection • step 4 of 5 |
| `/cid/capture-back/` | `6057:20924` | 393 x 1174.81 | ID document selection • step 4 of 5 |

Three further frames share the name `CID_ID1` on the y=2341 row
(`6217:66072`, `6217:76798`, `6217:66154`). Their `wizard-title` reads
**StudentAidNL**, so they belong to a different service journey and are **not**
built here. `6102:103451`, also named for this row in the hand-off notes, is the
Driver-and-Vehicle **"Success!"** frame — the already-built
`/services/driver-vehicle/confirmation/`.

## 9.1 The sub-step counter skips 3 — ASK FOR TATYANA

All **six** `CID_ID1` frames — ours and StudentAidNL's — carry the pill
`ID document selection • step 4 of 5`. **No frame anywhere in the file reads
"step 3 of 5."** So the demo's sub-step counter now runs:

| Screen | Pill |
|---|---|
| `/cid/terms/` | step **1** of 5 |
| `/cid/biometric/` | step **2** of 5 |
| `/cid/document/` | step **4** of 5 |
| `/cid/capture-front/` | step **4** of 5 |
| `/cid/capture-back/` | step **4** of 5 |
| `/cid/verified/` | step **5** of 5 |

Reproduced verbatim rather than renumbered, per the rule that the build matches
the design file. **This is visible on stage** — the pill jumps 2 → 4 and then
repeats 4 three times. Two things are needed from the design file: what step 3
is (a selfie / liveness capture is the obvious candidate, and `CID_Biometric`
only takes *consent*), and whether the three ID-document screens are really all
meant to be one step or should read 4a/4b/4c.

## 9.2 Montserrat cannot be rendered

These three frames are the **Yoti / CertifiO vendor UI** embedded in the GNL
wizard, and every text node on them is **Montserrat**, not Lato. Montserrat is
not self-hosted in this project, and `figma.com` *and* the Google Fonts host are
both blocked by this environment's proxy, so no face could be fetched. The type
renders in the project's Lato.

| Node | Figma says | Rendered as |
|---|---|---|
| `6087:32268` "Accepted documents:" (22px) | `Montserrat:Bold` | **Lato 700** |
| `6087:32275` et al, row labels (16px) | `Montserrat:SemiBold` (600) | **Lato 700** |
| `6087:32280` "Issued on or after 01/2010" (12px) | `Montserrat:Regular` | **Lato 400** |
| `6088:32304` / `6088:32306` capture headings (32px) | `Montserrat:Bold` | **Lato 700** |
| `6056:13940` `Yoti ContinueButton` label (14px) | `Montserrat:Bold` | **Lato 700** |

Lato has no 600, so `Montserrat:SemiBold` maps to 700 the same way
`Lato:SemiBold` already does elsewhere in this file. **Ask for Tatyana:** should
the vendor screens be restyled to Lato in the design file, or should Montserrat
be licensed and self-hosted the way Lato is? Advancing metrics differ between
the two families, so line *wraps* inside the radio rows may not match the frame
exactly until this is settled.

## 9.3 Yoti colours are NOT in the GNL token set

Reproduced verbatim, not mapped onto the GNL ramp.

| Role | Figma variable | Value | Nearest GNL token |
|---|---|---|---|
| Headings on these frames | `Yoti app` | `#333b40` | `--gnl-heading` (`#212326`) |
| Radio row labels | `Yoti gris` | `#546072` | `--gnl-text` (`#5f6368`) |
| Primary button, selected radio and its 2px row border | `Yoti CTA` | `#27619b` | `--gnl-primary` (`#243746`) |
| Radio row border, unselected | *(none)* | `#d1d5db` | `--gnl-border` (`#e0e4e6`) |
| "Issued on or after 01/2010" note | *(none)* | `#4b5563` | *(none)* |
| Camera viewport panel | *(none)* | `rgba(17,22,37,0.05)` | *(none)* |

`Yoti ContinueButton` (`6076:31361`) is a **second primary button** in the file:
box for box identical to `ContinueButton` (`6031:6352`) — `rounded-[4px]`,
`px-[24px] py-[10px]`, 14px Bold white at `leading-[normal]` — and differing
only in fill. It is expressed as a `tone="yoti"` variant on `BtnPrimary` rather
than a `className` override, because two arbitrary `bg-[…]` utilities on one
element are resolved by stylesheet order, not by class-attribute order.

## 9.4 Leading

The capture headings are `leading-[normal]` (≈1.2 — the measured 39px lines and
78px two-line block), where the three GNL-ramp CID headings on `/cid/terms/`,
`/cid/biometric/` and `/cid/verified/` are `leading-[1.5]`. Both are verbatim.
`leading-[normal]`, never Tailwind's `leading-normal` (which is 1.5).

## 9.5 Row box model

Figma draws the `RadioRow` stroke **inside** the 52px frame (content at x=16
from the outer edge). A CSS `border` would make the rows 54 and the selected one
56, so the stroke is painted with an inset `box-shadow`, the same technique
`WizardCard`, `TopNav` and the onboard option cards already use.

## 9.6 Hidden layers not rendered — and therefore no Back button

| Node | Layer | Frame |
|---|---|---|
| `6087:31452` | `Check box`, 286 x 27 | `6087:31396` |
| `6087:31455` | **`btn-back`, 361 x 39** | `6087:31396` |
| `6056:19164` | `Check box` | `6056:19118` |
| `6057:20965` | `Check box` | `6057:20924` |

All are `hidden="true"`. Hidden layers are not part of the design — the same
rule the other CID frames' `Check box` instances already follow. The
consequence is that **Continue is the only on-screen control on all three new
screens**: the design gives them no Back. Reverse navigation is the presenter's
ArrowLeft (`DemoNav` over `src/lib/flow.ts`, asserted in
`scripts/click-through.mjs`) and the browser's own back button. If a visible
Back is wanted for the dry run, un-hiding `6087:31455` in Figma — or one line
per page here — is all it takes.

## 9.7 New placeholder assets

`figma.com` is blocked, so these follow the existing placeholder convention:
dimension-exact stand-ins, so swapping in a real export is a byte replacement
with **no layout change**.

| Placeholder file | Figma node | Exact dimensions | Used by |
|---|---|---|---|
| `radio-circle-20.svg` | `6098:100406` (and `6087:32277` et al) | 20 x 20 | `/cid/document/`, unselected rows |
| `radio-circle-20-selected.svg` | `6098:100396` (`Group 7`) | 20 x 20 | `/cid/document/`, the Driver's License row |
| `id-doc-front.svg` | `6056:19942` (`image 16`) | 725.828125 x 450.30224609375 (**PNG in Figma**) | `/cid/capture-front/` |
| `id-doc-back.svg` | `6088:32336` (`image 17`) | 288.001953125 x 181.80224609375 (**PNG in Figma**) | `/cid/capture-back/` |

The two ID images are the only ones whose *content* is load-bearing for the
demo — they are the document the presenter is supposedly photographing — so
they are the highest-priority re-export of the whole set.

## 9.8 Copy reproduced as-is

"Driver's **License**" (`6087:32300`) uses the American spelling and a U+0027
apostrophe, where the rest of the portal says "licence". Verbatim, not
harmonised — same rule as the `Terms of use` / `Terms of Use` split on
`/cid/terms/`.

## 9.9 Invented desktop layout

Figma has **mobile frames only** for these three screens, as for every CID
screen, so everything at and above 768 is a decision made in code (see
`CidScreen`). Specific to these three:

| Element | Invented rule | Why |
|---|---|---|
| `accepted-documents` / `Frame 5` | `md:pt-0` / `md:py-0` | The mobile pads space the block away from the header and the button; inside the card the 32px card gap does that and the two would stack. |
| `Frame 14` (camera viewport) | `md:items-center` plus `md:max-w-[644px]` (front) / `md:max-w-[633px]` (back) on the image | The panel keeps its **measured** 400px height at every width, so the image has to be stopped from outgrowing it: at 1440 the panel's content box is 708px, which at these aspects would make the picture 439px / 447px tall and burst it. The caps are 400 × each image's own aspect, rounded down, which is why the two numbers differ. |
| `Frame 6` | `md:flex-row md:items-center md:justify-end md:pt-[16px]`, button `md:w-auto` | A full-width 740px button in an 820px card reads as a stretched phone screen; it becomes the onboard actions-row. |

---

# 10. Step 7 + verified-page re-sync — 2026-09-22

Covers `6217:81644` (`/services/driver-vehicle/prerequisite/`, "Confirm some
details") and the re-sync of the verified service page from the **deleted**
`6065:23367` to `6257:72314`. Source audit: `design/verification-frame-map.md`.

## 10.1 Font weights — Lato has no 500 or 600

Unchanged rule, new call sites. Self-hosted Lato ships 300 / 400 / 700 only.

| Frame | Node | Figma weight | Rendered | Element |
|---|---|---|---|---|
| `6217:81644` | `6217:81654` / `81655` / `81657` | `Lato:Medium` (500) | **400** | inactive step-labels |
| `6217:81644` | `6217:81662` | `Lato:SemiBold` (600) | **700** | "Must have a valid driver’s license" |
| `6217:81644` | `6217:81663` | `Lato:SemiBold` (600) | **700** | "Confirmed" |
| `6217:81644` | `6217:81665` | `Lato:SemiBold` (600) | **700** | "Cancel" |

No new *kinds* of mapping — `Medium → 400` and `SemiBold → 700` were both
already in use. Nothing on `6257:72314`'s new `VRC VC upsell` needs a mapping:
it is `Lato:Bold` and `Lato:Regular` throughout.

## 10.2 `line-height: normal` pinned to the measured box

| Frame | Node | Figma | Browser `normal` | Pinned to | Effect if unpinned |
|---|---|---|---|---|---|
| `6257:72314` | `6259:73325` (`New_pill` label) | `normal`, measured 14px | 15px at 12px Lato | `leading-[14px]` | pill 23px not 22, upsell panel 103px not 102, page +1px |

Same correction the green `New` and red `Expired on March 31, 2022` pills on
this page already carry. Note `leading-[normal]` (~1.2) is used everywhere
Figma says `normal`; Tailwind's `leading-normal` is 1.5 and is never correct
for these.

## 10.3 The file disagrees with itself about apostrophes — again

`6217:81644` uses the **typographic U+2019** in both of its strings:

- `6217:81660` "you need to confirm it**’**s you"
- `6217:81662` "Must have a valid driver**’**s license"

The prerequisite-check frame `6031:6304`, one step earlier in the same wizard,
writes the *same requirement sentence* with a **straight U+0027**
("Must have a valid driver's license", `IDV_OPTIONS` bullets). Same words, two
apostrophes, one file. Both reproduced verbatim — a straight quote on
`6217:81644` is a pixel-gate failure and vice versa.

`6217:81660` also ends with a **trailing space** after its colon. Kept.

"driver’s **license**" is the American spelling on this frame, where the
linked-items cards say "licence". Verbatim, not harmonised.

## 10.4 Height rounding — `ceil` CONFIRMED by measurement

`design/verification-frame-map.md` C3 left this open: `frames.json` stores
`auth-loading` as 1079 against a true 1078.196, which is `ceil`, but that was a
single sample. Both new entries were pasted with `ceil` and both render
**exactly**, which settles it:

| Frame | Figma height | `ceil` | `round` | Rendered |
|---|---|---|---|---|
| `6217:81644` | 996.2152099609375 | **997** | 996 | **997** |
| `6257:72314` | 1792.2152099609375 | **1793** | 1792 | **1793** |

`round` would have left both 1px short. The task brief quoted 996 / 1792; the
manifest and the build use 997 / 1793.

## 10.5 Hidden layers not rendered

Three on these two frames, all `hidden="true"`, none rendered — the same rule
every CID `Check box` and `6087:31396`'s `btn-back` already follow.

| Frame | Node | Layer | Size |
|---|---|---|---|
| `6217:80871` | `6236:46388` | `Banner` — an error/delay state | — |
| `6257:72314` | `6257:72356` | `item-card-licence`, the digital-wallet promo card | 860 × 129 |
| `6257:72314` | `6257:72404` | `VC - Add to your wallet` button + green `New` pill | 221 × 40 |

The last two are the whole −27px between the old frame (1819.215) and the new
one (1792.215): −129−20 for the card, +102+20 for the `VRC VC upsell` that
replaced it inside the CHEV card.

## 10.6 Two different `New` pills

`6259:73324` (the new upsell) is **white on `#004b87`**. `6220:86438`, the pill
on the now-hidden wallet button, was **`#198754` on `#d1e7dd`**. Different pill,
same word, same page. Reproduced as drawn.

## 10.7 The upsell's avatar-box is invisible

`6257:73253` is filled `#e9ecef` — the same fill as the `6257:73252` panel it
sits on — so the 64px box around the QR code cannot be seen. That is what the
file says; not "corrected" to the white an icon-box would normally take.

## 10.8 Invented — responsive only

Nothing about `6217:81644` is invented chrome: it is a real 1440 desktop frame,
so unlike the CID screens it needs no made-up desktop layout. Only the
below-1440 ladder is a decision, and it is copied from `/onboard/` and
`/confirmation/` next door.

| Element | Invented rule | Why |
|---|---|---|
| `section-title` `6217:81659` | `max-md:text-[30px] max-xs:text-[26px]` | 36px is the largest heading on any wizard frame; at 320 the card interior is ~240px, where it is two words a line. Same ladder `/auth/loading/`'s 40px heading uses. |
| `Frame 1` `6217:81661` | `max-xs:flex-col max-xs:gap-[4px]`, status loses `text-right` | A right-aligned "Confirmed" under a left-aligned label reads as an orphan once the row stacks. |
| `actions-row` `6217:81664` | `max-xs:flex-col-reverse max-xs:items-stretch` | ~237px of controls + 48px of gaps against ~240px of card interior at 320. `flex-col-reverse` puts the primary action on top while leaving the DOM (and tab order) as designed. Lifted from `/onboard/`. |
| `VRC VC upsell` `6257:73252` | `max-md:flex-col max-md:items-start`, button full width | Three boxes across leaves ~90px for two lines of copy at 320. Matches how the `inline` linked-item cards above already reflow. |
| label width `6217:81662` | `flex-1` instead of Figma's pinned `448.189px` | The 448.189 is a measured artefact of the string at 740px, not a designed constraint. Identical at 1440; lets the label wrap instead of overflow below it. |

## 10.9 Missing assets — one new placeholder

`figma.com` is blocked by this environment's proxy, so no real export could be
downloaded. Dimension-exact neutral stand-in, so swapping in the real export is
a byte replacement with **no layout change**.

| Placeholder file | Figma node | Dimensions (px) | Used by |
|---|---|---|---|
| `icon-qr-code.svg` | `6259:73307` (`QR code`) | 45 × 45, inside a 64px avatar-box at a 12px inset | `VRC VC upsell` on the verified service page |

This QR is a **digital-wallet** feature ("Skip the paper copy" — add your
vehicle registration certificate to your wallet). It is **not** an IDV device
hand-off; no mobile-handoff screen exists anywhere in this journey.

## 10.10 Behaviour change — `/auth/loading/`'s auto-advance was removed

Not a token, but it belongs in the record. `6217:80871` has **no buttons** in
Figma ("You can close this window."), and none is invented. The build used to
paper over that with a 2.6s `setTimeout` pushing to the confirmation screen.
That timer was removed when step 7 was inserted, because step 7's `Back` points
at `/auth/loading/` — with the timer running, `Back` was a 2.6-second round
trip straight back to step 7, i.e. a control that looks right and does nothing.

Cost, stated plainly: `/auth/loading/` is now the one screen in the flow with no
on-screen forward control. The forward move there is the presenter's
**ArrowRight** (`DemoNav` / `src/lib/flow.ts`), which the click-through gate
asserts explicitly. To revert, restore the `setTimeout` targeting
`/services/driver-vehicle/prerequisite/` **and** re-point step 7's `Back`.

## 10.11 Still open — not resolved by this pass

- **`step 3 of 5`** is displayed by no frame in the file. The sub-step counter
  runs 1 → 2 → 4 → 4 → 4 → 5. Not renumbered. (Frame map C4.)
- **Step 4b**, the front-capture instruction screen, exists but its master's
  node id is not derivable from an instance, so it cannot be built.
  `/cid/document/` goes straight to `/cid/capture-front/`. (Frame map C2 / G2.)
- **The 4,924px void on Row B** between `CID_Biometric` and `CID_ID_success`
  could hold newer copies of 4a/4c/4d. Page `0:2` cannot be enumerated by the
  MCP server, so this is unresolved. (Frame map C1.)
- **Route naming.** `6217:81644` is named "Prerequisite confirmed" but its
  heading is "Confirm some details"; the route built is
  `/services/driver-vehicle/prerequisite/`, as the frame map proposed.
  (Frame map C5.)

---

# 11. The three screens located 2026-09-22

`/cid/continue-on-mobile/` (6217:62059), `/cid/country/` (6217:66054) and
`/cid/capture-intro/` (6217:66055). See design/verification-frame-map.md §12 for
the audit record; this section is only the token and asset exceptions.

## 11.1 Font-weight mappings — no new rules, three new call sites

Self-hosted Lato ships 300 / 400 / 700 only. The existing mapping is unchanged
and is simply applied to more nodes:

| Figma weight | Rendered | New nodes using it |
|---|---|---|
| `Lato:Regular` | 400 | `6156:60703` (the 40 px heading — **not** bold, like /auth/loading/'s), `6156:60705`, `6156:60707` |
| `Lato:Bold` | 700 | `6156:60708` "Continue on my computer" |
| `Montserrat:Regular` | Lato 400 | `6076:31357`, `6056:15808`, `6056:20793` |
| `Montserrat:Bold` | Lato 700 | `6056:15797`, `6056:15807`, `6056:15810`, `6056:15811`, `6056:20792`, `6056:20795` |
| `Montserrat:SemiBold` | Lato **700** | `6056:15798`, `6056:20800`, `6056:20805`, `6056:20810` |

No `Lato:Medium` and no weight 500 or 600 appears on any of the three frames, so
**no new mapping was needed**. Montserrat still renders in Lato throughout — it
is not self-hosted here and both the Figma and Google font hosts are blocked by
the proxy. Pre-existing; unchanged.

## 11.2 Line-height — `leading-[normal]`, not `leading-normal`

Figma says `line-height: normal` (~1.2) on `6156:60708`, `6056:15797`,
`6056:15807`, `6056:15810`, `6056:15811`, `6056:20792`, `6056:20795` and
`6076:31357`. Tailwind's `leading-normal` is **1.5**; all of these use
`leading-[normal]`. Using the wrong one would have added ~5 px per node and
moved every box below it. Same trap already logged in phase 2b.

Explicit numeric leadings reproduced verbatim where Figma gives one:
`leading-[1.4]` (`6056:15798`, `6056:15808`), `leading-[20px]` (`6056:20793`),
`leading-[18px]` (the three guideline labels), `leading-[1.5]` (all four GNL
nodes on the hand-off frame).

## 11.3 Colours — verbatim, including the Yoti ramp

Nothing was harmonised. `6217:66054` and `6217:66055` are Yoti/CertifiO vendor
surfaces inside GNL chrome and carry the Yoti palette:

| Token | Hex | Used for |
|---|---|---|
| `Yoti app` | `#333b40` | the 22 px headings and the country body |
| `Yoti gris` | `#546072` | select label, privacy card, guideline labels, chevron |
| `Yoti gris pâle` | `#f3f4f6` | `PrivacyInfoCard` and `Guidelines Card` fills |
| `Yoti CTA` | `#27619b` | `Privacy Policy` link and both Continue buttons |
| *(no token)* | `#d1d5db` | the select's 1 px stroke |
| *(no token)* | `#4b5563` | the capture-intro subtitle |

`6217:62059` is the opposite: a GNL frame, so `--gnl-heading`, `--gnl-text`
`#5f6368`, link `#004b87` and the `#e0e4e6` card stroke — no Yoti colour on it
at all. **Do not unify the two ramps.** Every Yoti-owned box carries a comment
saying so at its call site.

## 11.4 Box model — the select's stroke is an inset box-shadow

Figma draws `select-dropdown` (`6076:31356`) as 361 × 52 with its label at
x=16, y=16 **from the outer edge** — i.e. the 1 px stroke is inside the frame. A
CSS `border` would make the control 54 tall and push everything below it down 2,
so the stroke is painted with `shadow-[inset_0_0_0_1px_#d1d5db]`. Identical
treatment to the RadioRows on `/cid/document/`, `WizardCard` and `TopNav`.

Same reasoning for the hand-off card (`6156:60701`): 824 wide with its content
at x=40, so `shadow-[inset_0_0_0_1px_#e0e4e6]`, not `border`.

## 11.5 The hand-off card is 824, not the 820 `wizard-card`

`6156:60701` measures **824 × 647.9812** with a 744 px interior, where every
wizard frame in the file uses the 820 × 740 `wizard-card` (`6031:6307`). It is
the same 824 `/auth/loading/`'s card (`6236:46385`) uses. Reproduced, not
harmonised — which is why `/cid/continue-on-mobile/` does **not** use the
`WizardCard` component. Visible as a 4 px width step between consecutive
desktop screens; that step is in the design file.

## 11.6 Missing assets — six new placeholders

`figma.com` is blocked by this environment's proxy, so no real export could be
downloaded. Every file below is a **dimension-exact** neutral stand-in: the
outer box is the exact Figma float and the page pins the box to those literals,
so swapping in the real export is a byte replacement with **no layout change**.

| Placeholder file | Figma node | Dimensions (px) | Used by |
|---|---|---|---|
| `qr-mobile-handoff.svg` | `6156:60706` `image 13` | 220.4013671875 × 216.981201171875 | the mobile hand-off QR |
| `icon-chevron-down-yoti.svg` | `6076:31358` `chevron-down` | 16 × 16 | the country select |
| `yoti-badge.svg` | `6087:31390` `image 20` | 33.701072692871094 × 16 | "Powered by YOTI" |
| `icon-guideline-clear.svg` | `6088:32315` | 34 × 34 | guideline row 1 (eye) |
| `icon-guideline-light.svg` | `6088:32320` | 34 × 34 | guideline row 2 (sun) |
| `icon-guideline-framed.svg` | `6088:32322` | 34 × 34 | guideline row 3 (viewfinder) |

Three notes worth keeping:

- **`qr-mobile-handoff.svg` is NOT `icon-qr-code.svg`.** The existing 45 × 45
  entry (`6259:73307`) is the *digital-wallet* upsell QR on the verified service
  page. This one is the *identity-verification device hand-off*. Different
  nodes, different sizes, different features. Neither was overwritten. The
  drawn pattern is deterministic noise around three real finder squares — **it
  is not scannable and is not meant to be.**
- **`icon-chevron-down-yoti.svg` is a deliberate near-duplicate** of the GNL
  `icon-chevron-down.svg` (`6031:5962`). Same glyph today, but the two belong to
  different design systems and are stroked differently (`#546072` vs `#5f6368`);
  either can be re-exported without the other, so they do not share a file.
- **The three guideline icons are one screenshot in Figma.** They are crops of a
  single pasted image (`Screenshot_20260302_102709_Firefox 5 / 4 / 2`)
  positioned by negative offsets — not clean exports even in the design file.
  Split into three single-purpose SVGs here so a later real export is a per-icon
  byte swap. **Worth telling the designer:** these three need a proper export.

## 11.7 Invented — desktop layout and the responsive ladder only

| Element | Invented rule | Why |
|---|---|---|
| everything ≥ 768 on `/cid/country/` and `/cid/capture-intro/` | `CidScreen`'s desktop chrome | Both frames are 393-only in Figma. Same invention already carried by the other six CID screens; see `CidScreen`. |
| `document-type-select` / `Screen 7` | `md:pt-0 md:pb-0` | The 24 px pads are the mobile frame's spacing to `wizard-header` and `Frame 6`. Inside the card the 32 px card gap does both jobs; the two would stack. |
| both `Frame 6`s | `md:flex-row md:items-center md:justify-end md:pt-[16px]` + `md:w-auto` | A full-width 740 px button in an 820 px card reads as a phone screen stretched. Lifted verbatim from `/cid/document/` so all four ID-document screens put Continue in the same place. |
| `6156:60703` (hand-off heading) | `max-md:text-[32px] max-xs:text-[26px]` | Same ladder `/auth/loading/` applies to its own 40 px H4. At 320 the card interior is ~240 px, where 40 px type is three words a line. |
| `6076:31357` (select label) | `max-xxs:whitespace-normal` | Figma pins the label `whitespace-nowrap` at 240 px, which with the 16 px chevron exactly fills the 256 px interior at 393. At 320 that interior is 224. **`max-xxs`, not `max-xs`** — 393 is these screens' untouchable design width and a `max-xs:` rule (< 480) would fire on it. |
| `/cid/continue-on-mobile/` below 1440 | the 152 → 96 → 48 → 32 well and `.gnl-gutter [--gnl-gutter:308px]` | Copied verbatim from `/onboard/` and `/prerequisite/` so three consecutive desktop frames reflow identically. Inert at 1440. |

Nothing else was invented. No control, no copy and no step number was added.

## 11.8 Typeface substitution is visible in two places

Consequences of Montserrat rendering in Lato (Lato is narrower), both cosmetic
and both left alone rather than forced:

- **`6056:20806` guideline row 3** — "Make sure the document is properly framed"
  wraps to **two** lines in Figma and fits on **one** in Lato, so the row
  measures 34 instead of 36 and the card 190 instead of 192. Forcing a wrap
  would be inventing a line break the design does not specify.
- **`6056:20796` guideline row 1** wraps in both, but one word later.

Both disappear the moment Montserrat can be self-hosted.

## 11.9 Still open — carried forward, not resolved by this pass

- ~~**`step 3 of 5`** is *still* displayed by nothing.~~ **RESOLVED 2026-09-23
  — see §12 below.** Two frames display it. The counter no longer skips.
- **The capture screens exist twice, 48 px apart.** Components `6217:66056` /
  `6217:66057` are 393 × 1222.810546875; the built instances `6056:19118` /
  `6057:20924` are 393 × 1174.810546875. The build uses the instances and was
  **not** switched. (Frame map C7 / §12 — needs a human.)
- **Heading scale disagrees** across the five ID-document frames: 22 px on
  `6217:66054` / `6087:31396` / `6217:66055`, 32 px on `6056:19118` /
  `6057:20924`. All reproduced at their own measured size.
- **"We will try to get a clearer image *this time*"** (`6056:20793`) implies a
  previous failed attempt on a screen that sits in the happy path. Verbatim.
  (Frame map §8 item 6.)
- **The 4,924 px void on Row B** is still unresolved, but the evidence for
  reading it as empty is now stronger — see frame map §12.

---

# 12. The liveness check — added 2026-09-23

Two frames, both named `CID_Biometric`, both in the `Yoti` section at y=779:

| Route | Node | Size (exact) | x |
|---|---|---|---|
| `/cid/liveness/` | `6217:65268` | 393 × 1282.44091796875 | 44.87 |
| `/cid/liveness-capture/` | `6217:65271` | 393 × 1231.810546875 | 553.87 |

## 12.1 C4 IS CLOSED — the counter no longer skips 3

`§11.9` and frame map `C4` asked whether a screen displaying `step 3 of 5` was
missing or whether the stepper should read "of 4". **It was a missing screen,
twice over.** These two frames carry `Liveness check • step 3 of 5`
(`6257:72187` / `6257:72196`) and they are the **only** two nodes in the file
that display it.

The pill across the ten CID screens now reads:

| # | Route | Pill |
|---|---|---|
| 1 | `/cid/terms/` | Terms of use • **step 1 of 5** |
| 2 | `/cid/biometric/` | Biometric consent • **step 2 of 5** |
| 3 | `/cid/liveness/` | Liveness check • **step 3 of 5** |
| 4 | `/cid/liveness-capture/` | Liveness check • **step 3 of 5** |
| 5 | `/cid/country/` | ID document selection • **step 4 of 5** |
| 6 | `/cid/document/` | ID document selection • **step 4 of 5** |
| 7 | `/cid/capture-intro/` | ID document selection • **step 4 of 5** |
| 8 | `/cid/capture-front/` | ID document selection • **step 4 of 5** |
| 9 | `/cid/capture-back/` | ID document selection • **step 4 of 5** |
| 10 | `/cid/verified/` | Identity verified • **step 5 of 5** |

`1 → 2 → 3 → 3 → 4 → 4 → 4 → 4 → 4 → 5`. **No number is skipped.** Every value
is verbatim; nothing was renumbered.

> **Still worth saying to Tatyana:** a *sub-step* number that repeats across
> consecutive screens is the design's own choice (step 3 twice, step 4 five
> times), and it is not a defect — the pill counts CID's five sub-steps, not
> screens. The **gap** was the defect, and it is gone.

## 12.2 Why four earlier audits missed them

They are named `CID_Biometric` — the same name as the built consent screen
`6217:62835`. A name-based search returns the consent screen and stops. They are
told apart by size (1282.441 / 1231.811 vs 834.811), by canvas position (the
`Yoti` section at y=779, not Row B at y=3563) and by their headings.

They are **current, not abandoned sketches**: both have live instances in the
parallel StudentAidNL journey in the matching slot (`6217:66069` / `6217:66070`),
and the master/instance height delta matches the other CID screens on that row.

## 12.3 Montserrat again — and a THIRD weight this time

Same substitution as §9.2 and §11: Montserrat is not self-hosted and both font
hosts are blocked by the proxy, so all type renders in Lato. Colours verbatim.

These two frames introduce **Montserrat:Medium**, which had not appeared before.
Lato ships 300/400/700 only, so the mapping table gains a row:

| Figma | Rendered | Where |
|---|---|---|
| Montserrat:Bold | Lato 700 | both headings, the "Back" label |
| Montserrat:Medium | **Lato 400** | the three `InstructionRow` labels on `6217:65268` |

(For the record, the full set now in use: `Lato:Medium` → 400,
`Lato:SemiBold`/`ExtraBold` → 700, `Montserrat:Regular`/`Medium` → 400,
`Montserrat:SemiBold`/`Bold` → 700.)

## 12.4 Typeface substitution is visible in ONE place here

Exactly the §11.8 consequence, on one row, and measured rather than estimated:

- **`6056:13919`, InstructionRow 1** — "Find a well-lit area with a clear
  background" in a 295 px label box. In Lato 14 px/400 the string measures
  **297.33 px** unwrapped and renders on **one** line (label 295 × 19.59, row
  34 px). Figma's Montserrat wraps it to **two** (label 295 × 40, row 40 px).
- Rows 2 and 3 match Figma exactly: row 2 wraps in both (39.19 vs 40), row 3
  fits on one line in both (34 vs 34).

The margin is **~1 %** — 297 px of text in a 295 px box. A real Montserrat wraps
it; Lato does not. **Not forced**, because forcing it means inventing a line
break the design does not specify, which is the same call §11.8 made.

Net effect: `instructions-list` measures 139.19 instead of 146, and `Frame 5`
642.81 instead of 649.63 — i.e. the body is **6.8 px short**. It disappears the
moment Montserrat can be self-hosted.

## 12.5 Box-model — everything else is exact

Measured in the browser at 393 against the Figma values:

| Node | Figma | Rendered |
|---|---|---|
| `6056:13105` heading | 345 × 78 | 345 × 78 |
| `6076:31212` illustration | 345 × 345.630 | 345 × 345.625 |
| `6056:14036` Frame 5 | 361 × 599 | 361 × 599 |
| `6076:31255` Frame 10 | 361 × 551 | 361 × 551 |
| `6076:31259` viewport | 345 × 522 | 345 × 522 |
| `6076:31260` pill | 321 × 51 | 321 × 51 |
| `6076:31262` face guide | 193.271 × 263.058 | 193.266 × 263.047 |
| `6076:31257` back chevron | 11.961 × 16.053 | 11.953 × 16.047 |
| both Continue buttons | 361 × 37 | 361 × 37 |

The two offsets inside the viewport are **produced by the centring, not
hardcoded**: the pill lands at y = 71.469 and the guide at y = 187.469 against
Figma's 71.471 / 187.471.

`sub-step-readout` renders 162.83 wide against Figma's 167. The pill is pure
content width and is not pinned anywhere (see `SubStepReadout`), and every other
CID frame shows the same Lato-vs-Montserrat width difference. Not a deviation.

## 12.6 Frame deltas

| Frame | Design | Rendered | dH |
|---|---|---|---|
| `cid-liveness` | 393 × 1283 | 393 × 1283 | **0** |
| `cid-liveness-capture` | 393 × 1232 | 393 × 1239 | **+7** |

`+7` is the established CID wizard-header line-box delta — `cid-terms`,
`cid-biometric`, `cid-capture-front` and `cid-capture-back` all carry exactly it.

**`cid-liveness`'s 0 is a coincidence, not a better result.** Its header carries
the same +7 and its body is 6.8 px short for the §12.4 reason; the two nearly
cancel. Recorded here so nobody later reads the 0 as evidence that screen is
more accurate than its neighbours.

## 12.7 The camera — reused, not reimplemented

`/cid/liveness-capture/` mounts the existing `CameraViewport`. Three differences
from the two ID-capture screens, all handled as props/data rather than a second
implementation:

1. **Front camera.** `facingMode="user"` (the ID screens use `environment`).
   Added as a **prop**, always `ideal` and never `exact` — the dry-run laptop
   has only a front camera and an `exact` constraint in either direction throws
   `OverconstrainedError` and loses the feed.
2. **No mock image.** Figma draws a flat `#e9ebe8` panel with the instruction
   pill and the face guide on it, so `children` is `null` and **the panel is the
   fallback**. The other two screens need a mock because Figma draws a captured
   document in their panel.
3. **A visible Back.** It is the only camera screen a viewer can leave without
   pressing Continue, so both exits are gated.

`scripts/camera-check.mjs` gained a section 0 covering all of it — including
that the pill and the guide paint **above** the feed (checked structurally, via
`position` + DOM order, because the `<video>` is `pointer-events-none` and
hit-testing would skip it and pass regardless).

## 12.8 Deliberate non-invention: the preview is NOT mirrored

A selfie preview is conventionally flipped horizontally and would probably read
better on stage. **Figma does not draw a mirror and this build does not invent
one.** One line of CSS (`scale-x-[-1]`) if Tatyana wants it. Flagged, not decided.

## 12.9 New placeholder assets (5)

All five are PNGs or negative-offset screenshot crops in Figma, and the Figma
host is blocked by the proxy. Each carries its exact rendered leaf size, so a
real export is a byte swap with no layout change. **All five are Yoti-owned.**

| Key | File | Size | Figma |
|---|---|---|---|
| `livenessIllustration` | `liveness-illustration.svg` | 345 × 345.63043212890625 | `6076:31212` |
| `iconLivenessLighting` | `icon-liveness-lighting.svg` | 34 × 34 | `6076:31228` |
| `iconLivenessBackground` | `icon-liveness-background.svg` | 34 × 34 | `6076:31231` |
| `iconLivenessEyeLevel` | `icon-liveness-eye-level.svg` | 34 × 34 | `6076:31233` |
| `iconYotiBack` | `icon-yoti-back.svg` | 11.961 × 16.053 | `6076:31257` |
| `livenessFaceGuide` | `liveness-face-guide.svg` | 197.252 × 267.056 | `6076:31262` |

Two notes:

- **`livenessFaceGuide`'s size is NOT its group's box.** `Group 6` measures
  193.271 × 263.058; Figma draws the SVG overflowing it by half a stroke on
  every side, which is why the page places the file at `inset-[-0.76%_-1.03%]`
  inside a box of the group's own size. Reproduced verbatim, exactly as
  `/cid/capture-front/` reproduces its own oversized image placement.
- **The sun and eye glyphs are deliberately NOT the `iconGuideline*` files**,
  despite being the same shapes. Those are cropped from a different pasted
  screenshot (`Screenshot_20260302_102709_*`) on a different screen and stroked
  `Yoti gris` #546072; these render on `Yoti app` #333b40. Two sources, two
  sets — either can be re-exported without disturbing the other.

## 12.10 Invented at ≥ 768 — nothing below it

Everything at and above 768 is `CidScreen`'s invented desktop chrome, as on the
other eight CID screens. Specific to these two:

| Element | Invented | Why |
|---|---|---|
| both `Frame 5` | `md:py-0` | The 24 px pads are the mobile frame's spacing to `wizard-header` and the button; the card's own 32 px gap does both. Same as every CID sibling. |
| `6056:13912` illustration | `md:max-w-[480px]` | It is `w-full` at a fixed aspect, so in an 820 px card it would render **741 px tall** — a decorative drawing taller than the whole phone frame, pushing Continue below the fold. The problem `/cid/capture-front/` solved with `md:max-w-[644px]`. Inert at 393. |
| `6076:31260` pill | `md:max-w-[321px]` | Keeps its measured width instead of stretching to a 716 px interior. `Frame 9` is already `items-center`, so the cap centres it. Inert at 393. |
| `6076:31364` Continue | `md:mt-[16px] md:w-auto md:self-end` | The onboard actions-row position. `self-end` rather than a parent `justify-end` because this frame uniquely gives the button **no `Frame 6` wrapper** — it is a direct child of `Main content` at y=760. |

One relaxation below the design width: `6076:31261` (the pill label) is
`whitespace-nowrap` in Figma, where 264 px of text sits in a 305 px interior at
393. At 320 that interior is 232 px, so it is released at **`max-xxs:`** —
below 384, never at 393. `max-xxs`, **not** `max-xs`: 393 is these screens'
untouchable design width and a `max-xs:` rule (< 480) would fire on it. Same
relaxation and same reasoning as the select label on `/cid/country/`.

No control, no copy and no step number was invented.

---

# 13. Tier 0 — Montserrat, self-baselines, the toast, the service config (2026-09-23)

Four changes, in this order. Everything in §9.2, §11.1 and §11.8 about the
typeface substitution is **superseded by 13.1**; those sections are left in
place as the record of why the substitution existed.

## 13.1 Montserrat is self-hosted — the substitution is over

`@fontsource/montserrat` 5.3.0, **SIL Open Font License 1.1**
(`node_modules/@fontsource/montserrat/LICENSE`), so the woff2 files are
redistributable and are committed under `src/app/fonts/`:

| File | Weight |
|---|---|
| `montserrat-latin-400-normal.woff2` | 400 Regular |
| `montserrat-latin-500-normal.woff2` | 500 Medium |
| `montserrat-latin-600-normal.woff2` | 600 SemiBold |
| `montserrat-latin-700-normal.woff2` | 700 Bold |

Vendored exactly as Lato already was — `next/font/local` in `layout.tsx`,
`display: "block"`, exposed as `--font-montserrat`. The demo still needs no
network on stage.

**Q-19 in `DEMO_AUDIT.md` is answered: yes, and it cost nothing.** The Google
Fonts *host* is blocked by this container's proxy, which is what earlier passes
hit; the npm registry is not, and `@fontsource` ships the same files.

### Scope — the Yoti zone and nothing else

Brief §11.1 says Montserrat **only** inside the Yoti zone, and §11.9 forbids
restyling that zone into GNL style. Both directions are now enforced in code:

- `globals.css` defines exactly one rule, `.gnl-yoti-zone { font-family:
  var(--font-montserrat), sans-serif }`. The face is **not** on `<html>`.
- `CidScreen` takes a `yotiZone` prop and puts that class on a `display:
  contents` wrapper around its `children` — which is precisely the boundary
  Figma's own note draws ("Yoti app (embed code) below the stepper and above
  the footer starts here"). `contents` generates no box, so nothing moved; only
  the inherited `font-family` changed.
- `yotiZone` is set on the **seven** NL-11..NL-19 routes: `/cid/liveness/`,
  `/cid/liveness-capture/`, `/cid/country/`, `/cid/document/`,
  `/cid/capture-intro/`, `/cid/capture-front/`, `/cid/capture-back/`.
- It is **not** set on the four CID routes that are GNL frames on the GNL ramp:
  `/cid/continue-on-mobile/` (NL-08), `/cid/terms/` (NL-09), `/cid/biometric/`
  (NL-10), `/cid/verified/` (NL-20). Those stay Lato, as their nodes specify.
- The MyGovNL header, wizard title, progress bar, step labels, sub-step pill
  and footer stay Lato on **all eleven** CID screens.

Verified by computed style, not by eye —
`design/responsive/cid-*-390-after-montserrat.png` were taken alongside a
`getComputedStyle` probe showing `lato` on every chrome node and `montserrat`
on every Yoti node of the same page.

### The collapsed weights are restored

Lato ships no 500 and no 600, so every `Montserrat:Medium` mapped to 400 and
every `Montserrat:SemiBold` to 700. Four call sites carried that compromise and
now carry the real weight:

| Call site | Figma | Was | Now |
|---|---|---|---|
| `/cid/liveness/` `InstructionRow` label, 14px | `Montserrat:Medium` | `font-normal` (400) | **`font-medium` (500)** |
| `/cid/country/` body `6056:15798`, 14px | `Montserrat:SemiBold` | `font-bold` (700) | **`font-semibold` (600)** |
| `/cid/capture-intro/` `GuidelineRow` label, 13px | `Montserrat:SemiBold` | `font-bold` (700) | **`font-semibold` (600)** |
| `/cid/document/` `RadioRow` label `6087:32275` et al, 16px | `Montserrat:SemiBold` | `font-bold` (700) | **`font-semibold` (600)** |

No other weight changed. `Montserrat:Bold` was already 700 and
`Montserrat:Regular` already 400.

### What §11.8 predicted, measured

§11.8 said two wraps were consequences of Lato being narrower and *"both
disappear the moment Montserrat can be self-hosted."* They did. Measured by
A/B-ing the family in one browser session:

| Node | Figma | Lato | Montserrat | Verdict |
|---|---|---|---|---|
| `6056:20806` guideline row 3 | 36 | **34** (1 line) | **36** (2 lines) | **RESOLVED** — the row wraps where the design wraps |
| `6056:20794` Guidelines Card | 192 | **190** | **193** | from 2 px under to 1 px over; the residual 1 px is `leading-[normal]` rounding on the 15 px title, not a wrap |
| `6056:20796` guideline row 1 | 36 | 36 (2 lines) | 36 (2 lines) | **RESOLVED** — it wrapped in both, "one word later" in Lato; the break is now the design's |

**A third one was never documented and is now mostly closed too.** §12 of this
file records the liveness rows as "40 / 40 / 34… the first two labels wrap to
two lines and the third does not". In Lato only the *second* did:

| Node | Figma | Lato | Montserrat |
|---|---|---|---|
| `6056:13915` `InstructionRow` 1 | 40 | **34** (1 line) | **39.188** (2 lines) |
| `6056:13920` `InstructionRow` 2 | 40 | 39.188 | 39.188 |
| `6056:13925` `InstructionRow` 3 | 34 | 34 | 34 |
| `6056:13914` `instructions-list` | 146 | 139.188 | **144.375** |

The residual 0.812 px per wrapped row is leading arithmetic, not a wrap:
14 px × 1.4 = 19.6 per line, so two lines are 39.2 where Figma rounds to 40.
Nothing is forced.

### Frame heights moved, and that is the correct outcome

These screens had been rendering in the wrong family, so their rendered heights
were wrong. Measured from the PNG headers, Lato → Montserrat:

| Frame | Lato | Montserrat | Δ | Δ vs `frames.json` before → after |
|---|---|---|---|---|
| `cid-liveness` | 1283 | 1289 | +6 | 0 → **+6** |
| `cid-liveness-capture` | 1239 | 1241 | +2 | +7 → **+9** |
| `cid-country` | 1065 | 1066 | +1 | +4 → **+5** |
| `cid-document` | 1173 | 1174 | +1 | +4 → **+5** |
| `cid-capture-intro` | 1000 | 1004 | +4 | +5 → **+9** |
| `cid-capture-front` | 1182 | 1183 | +1 | +7 → **+8** |
| `cid-capture-back` | 1182 | 1183 | +1 | +7 → **+8** |
| **all 12 non-Yoti frames** | — | — | **0** | unchanged |

That last row is the important one: the four GNL-ramp CID frames
(`cid-terms` +7, `cid-biometric` +7, `cid-verified` 0,
`cid-continue-on-mobile` 0) did not move by a single pixel, which is the proof
that the scoping is right and Montserrat did not leak into the portal.

### `design/frames.json` was NOT changed, on purpose

Every height in `frames.json` is the **Figma frame's own height**, rounded up —
`cid-liveness` 1283 ← 1282.44091796875, `cid-document` 1169 ← 1168.810546875,
and so on for all 19. It is a record of the design, not of the build.

Montserrat changed how the build renders. It did not change the Figma frames.
Overwriting those numbers with the new rendered heights would erase the only
reference the deltas are measured against and turn the table into all-zeros
that prove nothing. The deltas are recorded here instead.

The heights are also not load-bearing for the gate: `scripts/visual-diff.ts`
compares baseline PNG against shot PNG and never reads `frames.json` heights.
They set the screenshot viewport (`Math.min(f.height, 2000)`) and document the
target.

## 13.2 `design/baselines/` — SELF-baselines, not Figma exports

The folder was empty, so `npm run diff` reported `SKIP … missing baseline` for
all 19 frames and exited `GATE: FAIL` (`DEMO_AUDIT.md` §1, Q-18). Real exports
are still impossible here: `figma.com` is proxy-blocked and the
`design-reference/` pack was never delivered.

**Today's verified build is frozen as the baseline** — captured *after*
Montserrat, so the right typeface is baked into the reference. `npm run diff`
now returns **PASS on all 19 frames at 0.000 % differing**, and does so
repeatably: two independent `npm run shots` runs produced byte-identical PNGs,
including the three screens that fall back from a live camera.

**What the gate is now worth, stated plainly:**

- **It catches** drift from the verified state of 2026-09-23. That is exactly
  what 13.4 needed.
- **It cannot catch** a mismatch that already existed against Figma on
  2026-09-23. Anything wrong then is frozen as correct now. A green
  `npm run diff` means *"nothing moved"*, **not** *"matches Figma"*. Only the
  per-node measurements in this file speak to fidelity.

`npm run baseline` (`scripts/baseline.mjs`) regenerates them **deliberately**:
it is a dry run by default, prints every frame whose bytes would change before
it writes anything, and only writes with `--yes`. That exists because
re-baselining is how a visual gate gets quietly switched off — a screen
regresses, the diff goes red, and copying the shots over the baselines is the
fastest way back to green. Each run also rewrites
`design/baselines/PROVENANCE.md` with the same warning, so the folder explains
itself to whoever opens it next.

When real exports arrive: drop them in under the `frames.json` frame ids,
delete `PROVENANCE.md`, and **do not run `npm run baseline` again**.

## 13.3 The toast — one overlay, ~30 controls, zero pixels

Brief §10.5 / §7.6 / §15. `DemoToast` (`src/components/ui/DemoToast.tsx`) is
mounted once at the root of `layout.tsx`.

**Styled from the brief's own tokens**, not invented: `#243746` (§11.2
`primary`), white Bold 14 (§11.7's primary-button label scale), radius 6 (§11.4
`card`), shadow `0 4px 16px rgba(0,0,0,.10)` (§11.4, the login card's). Bottom
centre, clearing `env(safe-area-inset-bottom)`. `role="status"` +
`aria-live="polite"` (§7.8) on a region that is **always** in the DOM, because
a live region has to exist before content is inserted or nothing is announced.
Auto-dismisses after 3.2 s; clicking it dismisses it early. A 150 ms rise-and-
fade in — §13.2's ceiling for page transitions — removed entirely under
`prefers-reduced-motion`. No external dependency.

**Clicked twice, it replaces rather than stacks.** Every inert control sends
the same string, so a second click removes the existing toast and re-adds it
with a fresh id: the timer restarts, the live region sees a real insertion and
announces again, and exactly one toast is on screen. Different messages do
stack, capped at three, oldest dropped — the mechanism is general even though
today there is one message.

**Wired by ONE delegated listener on `[data-demo-inert="true"]`**, not by ~30
`onClick` props. That is the constraint, not a shortcut: most of those controls
are on screens §1.4 marks KEEP, and thirty handlers would have meant thirty
edits to KEEP markup plus a client-component boundary on pages that are static
today. **No markup on any control changed.** The only CSS added for them is
`[data-demo-inert="true"] { cursor: pointer }`, which is unlayered so it
outranks the Tailwind `cursor-default` utilities — and a cursor is not painted
into a screenshot.

**Proved to move nothing.** 147 inert controls across all 19 routes were
clicked programmatically: 147 fired the toast, the on-screen count stayed at 1
every time, and `document.documentElement.scrollHeight` was identical before
and after on every route with a toast up. `npm run diff` stayed at 0.000 % on
all 19 frames. Screenshots: `design/responsive/_toast-*.png`.

**Residual, recorded not hidden:** the inert controls that are `<div>` /
`<p>` / `<span>` (nav labels, dashboard cards, the two login links) are not
focusable, so they are mouse-only. The ones that are native `<button>`s (every
linked-item action and the wallet upsell) get Enter/Space for free, because
delegation is on `click`. Making the rest keyboard-operable means turning them
into real buttons — a markup change on KEEP screens, which belongs in its own
pass with the gate green.

## 13.4 `SERVICES` — the config, and the proof Flow A did not move

`src/lib/data/service-config.ts`, brief §12.1, both entries, every field the
brief lists. **No Flow B screen and no Flow B route was built.**

**Two fields for one brief field, deliberately.** §12.1 lists `requirement`
once. The design file spells that sentence two ways — U+0027 on the
prerequisite-check frame `6031:6304`, U+2019 on the prerequisite-**confirmed**
frame `6217:81644`, same words, same file (already logged in
`token-exceptions-phase2b.md`). Collapsing them would be a visible glyph change
and a gate failure in whichever direction it was done, so the config carries
`requirement` and `requirementConfirmed`. Flow B's sentence has no apostrophe,
so both fields hold the same string there.

**Routes are the app's existing paths**, per §6's own "if the app already has a
path for a screen, keep the existing one". `serviceRoutes(id)` reproduces
`/services/<id>/`, `…/onboard/`, `…/prerequisite/`, `…/confirmation/` and
`…/?verified=1`; `CID_ROUTES` and `APP_ROUTES` collect the rest. `?verified=1`
is reproduced, not fixed — `DEMO_AUDIT.md` X-04 is right that it belongs in the
persisted store, but that is a behaviour change and this pass was a refactor.

**Where a service is resolved, and why it differs by file:**

| Consumer | Resolves via | Why |
|---|---|---|
| pages under `src/app/services/driver-vehicle/` | the literal `"driver-vehicle"` | the route directory *is* the service; Flow B gets its own directory or a `[serviceId]` segment |
| `src/lib/data/driver-vehicle.ts`, `onboarding.ts` | `getService("driver-vehicle")` | Flow-A-only content modules for those routes |
| the ten shared `/cid/` screens and `cid.ts` | `CID_SERVICE` | one seam, documented in the config; Flow B replaces this single call |

**Proof that `driver-vehicle` output is unchanged — three independent checks:**

1. **Pixels.** `npm run diff` PASS, **0.000 % differing on all 19 frames**,
   against baselines frozen before the refactor.
2. **Destinations.** Every `href` in the built static export was extracted and
   compared: all 19 pages resolve character-for-character to the literals they
   spelled before, trailing slash and query string included.
3. **Copy.** `Go to Service Driver’s License Renewal` still carries U+2019;
   `Capture ID document (front)` / `(back)` unchanged; the step-5 sentence
   still reads "securely access Driver and Vehicle services"; the selected
   `RadioRow` is still row 7, Driver's License, with the 2 px `#27619b` ring.

**Proof the parameterisation is real, not cosmetic.** Flipping the single
constant `DEFAULT_SERVICE_ID` to `"studentaid"` and rebuilding turned all ten
CertifiO ID screens into Flow B with no other edit: wizard title
"StudentAidNL"; capture headings "Capture ID document" with "(front)" dropped
per §10.1; the selected `RadioRow` moved from row 7 (Driver's License) to
row 1 (**Passport**) with its 2 px ring and filled radio; the step-5 sentence
and all four bullets replaced. That is `DEMO_AUDIT.md` §8's "eleven rows, zero
new screens" demonstrated. The flip was reverted; it is a test, not a feature.

**Still holding `driver-vehicle` literals, and why:**

| Where | Why it stays |
|---|---|
| `src/app/services/driver-vehicle/**` (4 page files) | the App Router needs a literal directory. Flow B adds `studentaid/` or converts to `[serviceId]`. |
| `@/lib/data/driver-vehicle` imports (3 files) | a module path, not a value — Flow-A persona, licence and vehicle data |
| `service-config.ts` | the `ServiceId` union, the `SERVICES` key, `DEFAULT_SERVICE_ID` — declarations, which is where the name belongs |
| `services.ts` dashboard card | Flow A's card is the only one with an `href`; StudentAidNL's stays inert until PP-03 exists (the safeguard in `DEMO_AUDIT.md` NL-02) |
| `assets.ts`, `globals.css` and page headers | comments and Figma frame names |

No route-literal `"/services/driver-vehicle/…"` string survives anywhere
outside `serviceRoutes()`.
