# Token exceptions — Phase 4 (Tasks 17 and 19)

Everything the build does that the design file does not literally say, and
everything the design file says that the build could not reproduce.
Reproduced **exactly as designed** wherever it was possible; this file exists
so Tatyana can reconcile the Figma file, not so the code can drift from it.

Source: `C1 | GNL - R3`, file key `Dc1bPoXX1VoB9v1MtLvu8e`, read 2026-09-18.
Scope: Task 17 (`/auth/loading`) and Task 19 (`/services/driver-vehicle`,
verified end state). Phases 0–2 are in `design/token-exceptions.md`; do not
merge the two files without checking with whoever owns that one.

---

## 1. BLOCKER — the auth-loading frame no longer exists

`6158:69596` (`gnl-vc-login-loading`, 1440 × 1024) returns **"node not
found"** from `get_design_context` *and* from `get_screenshot`. A full
`get_metadata` walk of section `6145:58450` finds no frame with that name, and
the document has exactly one page (`0:1`) — the plan's page `6031:5860` is gone
too. The Figma REST image API is blocked by this environment's proxy, so there
is no baseline PNG to fall back on either.

`design/frames.json` still lists `auth-loading → 6158:69596`. **That row will
fail `npm run baselines` until Tatyana confirms the replacement node.**

What was built, and on what authority:

| Element | Size / position | Source |
|---|---|---|
| `main-container` | 1440 × 814.785 at y=69 | plan, recorded while the node existed |
| `AuthLoadingCard` | 520 × 422 at x=460, y=196.392 | plan |
| `LoadingGraphic` | 100 × 100 at x=210, y=48 | plan |
| `MessageContainer` | 424 × 130 at x=48, y=180 | plan |
| `SecurityFooter` | 424 × 32 at x=48, y=342 | plan |
| card padding / gaps | `p-[48px]`, `gap-[32px]` | derived from the offsets above — they are self-consistent |

**Invented, because it could not be read from anywhere.** Every item below is a
placeholder to be replaced once the frame is restored:

| Property | Value used | Note |
|---|---|---|
| Card border | `#e0e4e6` (`--gnl-border`), 1px inset | house card chrome, same as `WizardCard` |
| Card shadow | `drop-shadow(0px 4px 12px rgba(0,0,0,0.03))` | `--gnl-shadow-card` |
| Card radius | `6px` | `--gnl-radius-card` |
| Spinner form | 6px ring, track `#e0e4e6`, head `#243746` | pure CSS — no asset was fabricated for a node that does not exist |
| Title copy | `Signing you in securely` | 24px Bold `#212326` |
| Body copy | `We are confirming your verified identity with MyGovNL and preparing your Driver and Vehicle service. This will only take a moment.` | 15px Regular `#5f6368` / 24px leading. Deliberately contains **no apostrophes**, so the straight-vs-typographic question does not have to be guessed. |
| Security footer copy | `Your information is encrypted and protected.` | 12px Regular `#5f6368`. The 32px height suggests an icon sits beside the text in the real design; none was invented. |

`MessageContainer` and `SecurityFooter` are pinned to `h-[130px]` / `h-[32px]`
and centre their content, so the card still measures exactly 520 × 422 no
matter what the real copy turns out to be. Swapping the strings will not move
anything.

**Spinner is diff-safe by construction.** `.gnl-spinner` in `globals.css`
carries `transform: rotate(0deg)` as its base and animates `0% → 100%` from
that same value, so the harness's injected `animation: none` freezes it on the
untransformed still. Measured: document 1440 × 1024, `main` 1440 × 814.781,
`LoadingGraphic` at x=670 (card x=460 + 210).

---

## 2. O1 IS STILL OPEN — and `6065:23367` has been redesigned

**`6065:23367` was built, per the plan's assumption. This is NOT confirmed.**
The competing frame `6076:24415` (`driver-vehicle-dashboard`, the tabbed
Actions / Notifications / Terms of use / Unlink service layout) is still sitting
on page `0:1` and is still a different design. *Ask Tatyana before the freeze.*

Separately, `6065:23367` itself has changed since the plan was written. The
build follows the **live file**, not the plan:

| | Plan (Task 19) | Live file, 2026-09-18 | Built |
|---|---|---|---|
| Frame | 1440 × 1671.215 | 1440 × **1819.215** | live |
| `main-container` | 1440 × 1462 | 1440 × **1610** | live |
| `content-left` | 860 × 1334 | 860 × **1482** | live |
| `left-column` `6076:24330` | 860 × 1173 | 860 × **1321** | live |
| `footer verified` | y=1531 | y=**1679** | live |
| Sidebar `item-card-licence` `6095:32409` (380 × 227 at y=84) | present | **does not exist** | omitted |
| `sidebar-right` | 380 × 948 | 380 × **701** — favourite 64, data-privacy 504 at y=84, contact 93 at y=608 | live |
| Title badge | (unstated) | **`Trusted`**, green `#45ab8e`, `Success_check` 12 × 12 — not the red `Confirmation required` lock pill | live |

Because `sidebar-right` in the verified frame is identical to the unverified
one (same three cards, same sizes, same copy), `SidebarRight` is reused rather
than duplicated. Its `data-node-id`s are therefore the unverified frame's
(`6031:6266` etc.), not `6065:23389` etc.

**`ReminderCard.tsx` was NOT created.** `6065:23367` has no reminders section —
`reminders-section` (`6076:24515`) exists only in the competing frame
`6076:24415`. Building it now would be an unused component written against an
unconfirmed design, which the plan explicitly warns against ("re-scope this
task rather than attempting both"). If O1 resolves to `6076:24415`, Task 19
needs re-scoping, not a patch.

### Also stale: the UNVERIFIED frame (out of scope, not touched)

`6031:6244` is now 1440 × **1072.215** with `main-container` 1440 × **863**;
the build renders 1038.215 / 829 from the Sept-16 read. `/services/driver-vehicle/`
was left alone because it is outside Tasks 17 and 19 — flagging it so it is not
mistaken for a Task 19 regression.

---

## 3. Colour values on `6065:23367`

| Element | Node | Property | Figma value | Token | Note |
|---|---|---|---|---|---|
| `red-dot` + expired label | 6098:34982 / 6098:34983 | fill / color | **`#d32f2f`** | *(none)* | **This is the `--gnl-danger` the Global Constraints table asks Task 19 to extract.** Promote it to a token. |
| expired badge | 6098:34981 | background | `#fdf2f2` | *(none)* | the tint that goes with `#d32f2f` |
| `badge-confirmation` (verified) | 6065:23375 | background | `#45ab8e` | Figma variable **`brand-2-500`** | one of only five variables in the file |
| `New` pill label | 6220:86440 | color | `#198754` | Figma variable **`GNL Success`** | written as `var(--gnl-success,#198754)`; the CSS var is not defined in `globals.css`, so the literal applies |
| `New` pill | 6220:86438 | background | `#d1e7dd` | *(none)* | |
| icon boxes (avatar / pin / truck / trailer) | 6220:86399 et al. | background | `#e9ecef` | *(none)* | a **third** near-identical light grey, alongside `#eaecef` (notification bell) and `#e0e4e6` (`--gnl-border`). Worth collapsing to one token. |
| all cards on this frame | 6076:24331, 6076:24356 … | border | `#d4d8da` | `--gnl-border` (`#e0e4e6`) | same mismatch already logged for the unverified frame |
| action links, "Your linked items" | 6076:24337 et al. | color | `#004b87` | *(none)* | the portal link blue, still not a token |

## 4. Font weights Lato cannot provide

Lato ships 100 / 300 / 400 / 700 / 900. The project self-hosts 300 / 400 / 700.
Synthesising a weight smears the glyphs and fails the pixel diff, so each
missing weight is mapped to the nearest real one.

| Element | Node | Figma says | Rendered as |
|---|---|---|---|
| `Actions` card heading | 6076:24332 | **Lato:ExtraBold (800)** | 700 |
| `Your linked items` | 6076:24355 | **Lato:ExtraBold (800)** | 700 |
| every action link (`Renew your driver's licence` …) | 6076:24337–24347, 6076:24351 | **Lato:SemiBold (600)** | 700 |
| `IAN B GARLAND` | 6220:86392 | **Lato:SemiBold (600)** | 700 |
| every `btn-outline` label | 6220:86396, 6076:24392/24394/24410/24412, 6220:86433 | **Lato:SemiBold (600)** | 700 |

ExtraBold is a *new* gap — Phases 0–2 only hit Medium (500) and SemiBold (600).
Three of the five Lato weights the file asks for do not exist in the family.

## 5. Line-height: Figma `normal` vs the browser's `normal`

Figma reports `line-height: normal` but lays the line box out at its own
computed value. For Lato the browser's `normal` rounds differently at two
sizes, and both errors compounded into the page height:

| Element | Node | Figma line box | Browser `normal` | Pinned to | Effect if left alone |
|---|---|---|---|---|---|
| `Your linked items` | 6076:24355 | 26px | 27px | `leading-[26px]` | `linked-items-section` 895, page +1 |
| `New` pill label | 6220:86440 | 14px | 15px | `leading-[14px]` | pill 23 instead of 22 |
| `Expired on March 31, 2022` | 6098:34983 | 14px | 15px | `leading-[14px]` | pill 23, `item-card-trailer` 187 instead of 186, page +1 |

Every other `line-height: normal` on this frame (15px links → 18, 14px button
labels → 17, 12px badge → 18 at 1.5) matches the browser exactly and is left
as `leading-[normal]`.

**After pinning, every box on the verified page measures its Figma size exactly:**
`main-container` 1610, `content-left` 1482, `left-column` 1321,
`actions-section-card` 387, `other-actions-box` 70, `linked-items-section` 894,
cards 129 / 156 / 112 / 185 / 186, document 1440 × 1819.

### Residual sub-pixel text widths (not fixable without hardcoding)

Figma's text shaper and the browser's disagree by under 2px on a few
`whitespace-nowrap` runs. Nothing is clipped and nothing reflows:

| Element | Figma | Rendered |
|---|---|---|
| `badge-confirmation` | 83 | 83.047 |
| `btn-primary` "Update" | 78 | 78.328 |
| `btn-outline` "View demerit points" | 157 | 158.531 |
| `New` pill | 42 | 40.984 |
| expired badge | 173 | 171.813 |

## 6. Strokes drawn inside the frame

Figma strokes on the inside edge; CSS `border` adds to the box. Every bordered
element on this frame therefore paints its stroke with an inset box-shadow, as
`WizardCard`, `TopNav` and the sidebar cards already do:

- all five `item-card-*` and `actions-section-card` — with a real border the
  inner content box would be 810 instead of the 812 the design specifies for
  `card-identity-row`, and every card would come out 2px tall.
- `other-actions-box` `6076:24348` — its top rule is `shadow-[inset_0_1px_0_0_#d4d8da]`,
  not `border-t`, which would make the box 71px against Figma's 70.
- `btn-outline` — `shadow-[inset_0_0_0_1px_#d4d8da]`, so `px-[16px] py-[6px]`
  survives and the button still measures 29 tall.

## 7. Apostrophes — the frame contradicts itself

The Global Constraints say the `driver-vehicle` family uses the straight
apostrophe (U+0027). **One string on this frame does not.** Reproduced as
found, not normalised:

| String | Node | Apostrophe |
|---|---|---|
| `Add your driver’s licence to your digital wallet?` | 6076:24361 | **U+2019 (typographic)** |
| `Your driver's licence is verified. Add it to your digital wallet…` | 6076:24363 | U+0027 |
| `Driver's licence` | 6220:86391 | U+0027 |
| `Renew your driver's licence` | 6076:24337 | U+0027 |

Two spellings of the same word, 33px apart in the same card. Worth a single
pass over the file.

## 8. Deliberate behavioural deviations

| What | Figma | Build | Why |
|---|---|---|---|
| Actions-card links | `href="https://example.com/renew-license"` etc. — eight of them, plus "Book an appointment" | styled, non-navigating `<span>` | `example.com` is itself a placeholder; a live anchor walks the presenter off the demo mid-story. Same reasoning as `ServiceCard`'s no-href branch. |
| Linked-item buttons | frames, no link | `<button type="button">` with no handler | this is the terminal screen of the flow; there is nowhere further to go |
| `/auth/loading` | static frame | `setTimeout` → `/services/driver-vehicle/confirmation/` after 2600 ms, cleared on unmount | the plan's Task 17 Step 2 |

## 9. Missing assets — placeholders, all dimension-exact

`figma.com` is blocked by this environment's proxy (403), so nothing could be
downloaded. Each file below is a **placeholder** whose root `width`/`height`
and `viewBox` match the Figma leaf exactly, so replacing it is a byte swap with
no layout change. `grep -r "figma.com" src/ public/` is clean.

| File | Figma node | Dimensions | Used by |
|---|---|---|---|
| `public/assets/icon-success-check.svg` | 6065:24184 | 12 × 12 box, leaf 12.135 × 12 (offset `inset-[0_0_0_-1.13%]`) | `Trusted` badge |
| `public/assets/icon-digital-id.svg` | 6220:86400 | 58 × 58 | wallet-promo card |
| `public/assets/icon-user-32.svg` | 6220:86388 | 32 × 32 | driver's-licence card — **not** the 16px nav `user` |
| `public/assets/icon-map-pin.svg` | 6076:24370 | 32 × 32 | address card |
| `public/assets/icon-truck.svg` | 6076:24381 | 32 × 32 | 2015 CHEV IMT card |
| `public/assets/icon-circle-x.svg` | 6076:24399 | 32 × 32 | utility-trailer card |
| `public/assets/icon-external-link.svg` | 6076:24352 | 14 × 14 | "Book an appointment" |
| `public/assets/icon-red-dot.svg` | 6098:34982 | 6 × 6, filled `#d32f2f` | expired-registration badge |

`Digital ID` (`6220:86400`) is the one to watch: the real export is a six-leaf
nested group, and the placeholder is a single flat SVG at the same 58 × 58.

Note also that `avatar-box`/`pin-box`/`truck-box`/`trailer-box` are exported by
Figma as `p-[12px]` but actually contain a 58px or 32px child in a 64px box —
i.e. a 3px or 16px inset. The build centres the child instead of using the
exported padding, which reproduces the metadata offsets exactly.

## 10. Structural oddity reproduced, not cleaned up

`Frame 11` (`6076:31314`, 860 × 387) wraps `actions-section-card` and does
nothing else — it is exactly the size of its only child. Reproduced as a
pass-through `<div>` so the node tree matches the file. Safe to delete in
Figma.
