# MyGovNL portal — measured values for the Figma deck

**For:** Tatyana Poirier
**From:** Zubair
**Date:** 2026-09-16
**File:** `C1 | GNL - R3`, page `CerifiO ID integration`

You said you reconstructed the portal frames from appearance because there were no
wireframes. I measured the live production portal (`my.gov.nl.ca/en/sign_in`) in a
browser and cross-checked it against the `auth_GNL.css` you sent. Below is what the
real portal actually uses, so the deck and the demo build can converge on the same
target.

QA (`gnl.qa.citizenone.ca`) is behind a password prompt, so production was measured
instead. Same theme.

---

## First: what you already got right

These were exact, from appearance alone. No change needed.

| Value | Yours | Real |
|---|---|---|
| Typeface | Lato | Lato ✅ |
| Body text | `#5f6368` | `#5f6368` ✅ |
| Heading text | `#212326` | `#212326` ✅ |
| Border grey | `#e0e4e6` / `#d4d8da` | both real ✅ |
| Header height | 128px | 128px ✅ |
| Header background | `#243746` | `rgb(36,55,70)` = `#243746` ✅ |

---

## Changes that matter most

Ordered by how visible they are.

### 1. Footer height — 140px → **184px**

The real `.gnl-site-footer` is **1440 × 184**, background `#64717c`, white text.
Internally: a menu row 1376 × 64, then a links row 1376 × 40 with `8px 16px` padding.

This affects every frame, since the footer sits on all of them.

### 2. Buttons

The portal has **two different button systems**, which is probably why this was hard to
read from screenshots:

**A — the login form button** (Bootstrap `.btn-primary`, what you see on the sign-in page):

| Property | Value |
|---|---|
| Background | `#243746` |
| Border | `1px solid #243746` |
| Radius | **6px** (not 4px) |
| Font | Lato **16px, weight 400** (not 14px bold) |
| Padding | `6.4px 11.2px 4.8px` |
| Height | 37.2px |

**B — the GNL design-system button** (`.gnl-button--contained`, used elsewhere in the product):

| Property | Value |
|---|---|
| Background | **`#004b87`** |
| Radius | 6px |
| Font | Lato 16px, **weight 700** |
| Padding | `6px 16px` |
| Min height | 40px |

`#004b87` is the single most-used colour in `auth_GNL.css` — 75 occurrences. It is
worth deciding which of the two the IDV screens should use, and being consistent.

### 3. Text inputs

| Property | Value |
|---|---|
| Height | **40px** |
| Radius | 6px |
| Border | `1px solid #ced4da` |
| Padding | `6px 12px` |
| Font | Lato 16px |

### 4. Accordion rows — 56px → **53.59px**

Background white, padding `16px`, radius `5px 5px 0 0` on the first row,
line-height `19.2px`. Container is 1024 wide.

### 5. Headings

| Style | Size | Weight | Line-height |
|---|---|---|---|
| `.gnl-header-4` | 24px | **900** (Black) | 36px |
| `.gnl-header-5` | 20px | 700 (Bold) | 30px |

Weight 900 is worth noting — the real portal uses Lato Black for section headings,
which reads noticeably heavier than Bold.

### 6. Links

Link colour is **`#003b6a`**. The deck currently has links in several different blues.

---

## Layout skeleton

| Element | Value |
|---|---|
| Page width | 1440 |
| Content container | 1120 wide, padding `0 48px` |
| Section vertical padding | `24px 0 64px` |
| Alt / grey section background | `#f1f3f4` |
| Login section background | `#f1f3f4` |
| Base line-height | 24px (1.5) everywhere |

**Login page total height at 1440 wide: 2313px.** The deck's login frame is 1880px —
the real page simply has more content below the fold.

---

## Three colours to remove

These appear in the deck but exist nowhere in the real stylesheet. They look like
artefacts of matching against a screenshot:

| Colour | Where it is in the deck | Should be |
|---|---|---|
| `#2b3a4e` | top-nav background | `#243746` |
| `#263854` | login button | `#243746` |
| `#e9ebf0` | stepper track | needs a real value — not in the stylesheet |

---

## Two things the real font cannot do

Worth knowing before the deck goes further:

1. **Lato has no Medium (500).** The family ships 100 / 300 / 400 / 700 / 900 only.
   Several layers in the deck are set to "Lato Medium" — Figma synthesises that, but no
   browser can reproduce it. It needs to become 400 or 700.
2. **Lato has no SemiBold (600)** either. Same situation on the sign-out button.

---

## Smaller inconsistencies found in the deck

Not urgent, but they make the file harder to build from:

- **Apostrophes are mixed.** The hero uses a curly `'` (U+2019); six other possessives
  across the portal frames use a straight `'`; the whole `driver-vehicle` frame family
  uses straight quotes. Picking one would help.
- **Two wordings for one service:** "Add your child(ren) to a waitlist(s)" on the login
  frame vs "Add your child to a waitlist(s)" on the dashboard. Also `drivers licence`
  is missing its apostrophe on the dashboard.
- **Section heading colour differs between frames** — `#5f6368` on login, `#212326` on
  the dashboard.
- **Button radii disagree** — `btn-back` is 6px, `ContinueButton` is 4px, on the same
  row. (6px is the real value.)
- **Four card radii in use** (4 / 5 / 6 / 8) and **three different card shadows.**
- **`CID_Welcome` has two progress steppers** — one in `wizard-header` and another in
  `Frame 5`. Likely a duplicate.

---

## Where this leaves us

The demo build is being rebuilt against these measured values. If the deck moves to the
same numbers, the deck, the demo and GNL's real portal all agree — which is what we want
in front of Cynthia's team, since they know what their own portal looks like.

The CertifiO ID / IDV screens are new design, so the deck stays authoritative for those.
The only ask there is that they borrow the portal's real button, input and heading styles
so the new screens look native to the product.

Full measurements, including the raw CSS, are in the repo at
`design/real-portal-reference.md`.
