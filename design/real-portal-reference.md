# Real MyGovNL portal — measured reference

Source: **https://www.my.gov.nl.ca/en/sign_in** (production), measured live in a browser
at an emulated 1440 x 1000 viewport, 2026-09-16. Values are `getComputedStyle` /
`getBoundingClientRect` readings from the running site, not estimates.

Why this file exists: Tatyana Poirier confirmed on 2026-09-16 that the Figma frames for
the MyGovNL portal screens are a **reconstruction** — she had no wireframes and rebuilt
them from appearance. For the portal screens the live site is the authority. The
CertifiO ID / IDV screens are genuinely new design and Figma remains their authority.

GNL QA (`https://gnl.qa.citizenone.ca`) sits behind HTTP Basic Auth and could not be
measured. Production is public and was used instead.

---

## Stylesheets the real site loads

| URL | Role |
|---|---|
| `https://www.my.gov.nl.ca/theme_styling.css` | 317 bytes — tenant theme variables only |
| `https://prod-cdn.citizenone.ca/assets/application-*.css` | The CitizenOne application stylesheet |
| `https://www.my.gov.nl.ca/custom_font.css` | Font loading |

`theme_styling.css` in full:

```css
:root {
  --primary-color: #191a1a;
  --primary-color-hover: #131414;
  --primary-color-active: #989898;
  --menu-color-hover: #f4f4f4;
  --menu-color-active: #dfdfdf;
  --footer-background-color: #495057;
  --footer-text-color: #ffffff;
  --navigation-background-color: #191a1a;
  --navigation-text-color: #fcfcfc;
}
```

Note these tenant variables are **not** what the rendered page uses for the header or
footer — the measured values below win. Do not build from this file alone.

---

## Base

| Property | Value |
|---|---|
| Font family | `Lato, sans-serif` |
| Base size | `16px` |
| Base line-height | `24px` (= 1.5) |
| Body colour | `rgb(95, 99, 104)` = `#5f6368` |
| Body background | `#ffffff` |
| Document height at 1440 wide | **2313px** |

---

## Measured elements

| Element | Selector | Size | Key values |
|---|---|---|---|
| Header | `.gnl-header` | 1440 × **128** | bg `rgb(36,55,70)` = **`#243746`**, text `#ffffff` |
| Header logo | `.gnl-header__logo` | 249 × 128 | — |
| Login section | `.co-login-section` | 1440 × 519.99 | bg `rgb(241,243,244)` = `#f1f3f4`, padding `24px 0 64px` |
| Content container | `.gnl-container` | 1120 wide | padding `0 48px` |
| Alt section | `.gnl-section--alt` | 1440 × 344.78 | bg `#f1f3f4`, padding `24px 0 64px` |
| Accordion | `.gnl-accordion` | 1024 × 164.78 | — |
| Accordion heading | `.gnl-accordion__heading` | 1022 × **53.59** | bg white, padding `16px`, radius `5px 5px 0 0`, line-height `19.2px` |
| Site footer | `.gnl-site-footer` | 1440 × **184** | bg `rgb(100,113,124)` = **`#64717c`**, text white |
| Footer menu | `.gnl-footer__menu` | 1376 × 64 | — |
| Footer links | `.gnl-footer__links` | 1376 × 40 | padding `8px 16px` |
| Heading 4 | `.gnl-header-4` | — | `24px` / weight **900** / line-height `36px` / `#212326` |
| Heading 5 | `.gnl-header-5` | — | `20px` / weight 700 / line-height `30px` / `#212326` |
| Link | `.gnl-link` | — | colour `rgb(0,59,106)` = **`#003b6a`** |
| Text input | `input.form-control` | 414 × **40** | radius `6px`, border `1px solid #ced4da`, padding `6px 12px`, 16px |
| Submit button | `input[type=submit].btn-primary` | — × **37.2** | bg `#243746`, radius **`6px`**, border `1px solid #243746`, padding `6.4px 11.2px 4.8px`, **16px / weight 400** |

---

## From `auth_GNL.css` (the file Tatyana supplied)

The GNL design-system button, which is a **different** component from the Bootstrap
`.btn-primary` used on the login form:

```css
.gnl-button {
  display: inline-flex; align-items: center;
  min-height: 40px;
  border: 1px solid transparent; border-radius: 6px;
  background: transparent; padding: 6px 16px;
  font-family: Lato, sans-serif; font-size: 16px; line-height: 1.5;
  text-align: center; vertical-align: middle;
}
.gnl-button--contained { padding: 6px 16px; background: #004b87; color: #fff; font-weight: 700 }
.gnl-card { max-width: 352px; flex-basis: 352px; border: 0; padding: 16px 32px }
.gnl-stepper { display: flex; flex-flow: row wrap; max-width: 600px; margin: 8px auto; padding: 0 4% }
```

Most-used colours in `auth_GNL.css`, by frequency:

| Hex | Count | Note |
|---|---|---|
| `#004b87` | 75 | GNL design-system primary — **not present in the Figma file** |
| `#212326` | 61 | heading — matches Figma ✓ |
| `#e8f0fe` | 58 | |
| `#3e861f` | 54 | |
| `#e0e4e6` | 52 | border — matches Figma ✓ |
| `#d32f2f` | 52 | |
| `#d4d8da` | 51 | border — matches Figma ✓ |
| `#5f6368` | 42 | body text — matches Figma ✓ |

Colours from the Figma reconstruction that appear **nowhere** in the real stylesheet:
`#2b3a4e`, `#263854`, `#e9ebf0`.

---

## Verdict per value

| Value | Figma said | Reality | |
|---|---|---|---|
| Font | Lato | Lato | ✅ correct |
| Body text `#5f6368` | ✔ | ✔ | ✅ correct |
| Heading `#212326` | ✔ | ✔ | ✅ correct |
| Border `#e0e4e6` / `#d4d8da` | ✔ | ✔ | ✅ correct |
| Header height 128px | ✔ | 128px | ✅ correct |
| Header bg `#243746` | ✔ | `rgb(36,55,70)` | ✅ correct |
| Footer height | 140.215px | **184px** | ❌ wrong |
| Button radius | 4px (primary) | **6px** | ❌ wrong |
| Button font | 14px / bold | **16px / weight 400** | ❌ wrong |
| Button padding | `10px 24px` | **`6.4px 11.2px 4.8px`** | ❌ wrong |
| Input height | — | **40px**, radius 6px | ⚠️ unverified in build |
| Accordion row | 56px | **53.59px** | ❌ wrong |
| Page height | 1880.215 | **2313px** | ❌ different content entirely |
| `#2b3a4e`, `#263854`, `#e9ebf0` | used | do not exist | ❌ invented |

**The greys and the header were right. The buttons, footer, accordion and overall page
height were not.**

---

## The consequence for the pixel gate

The two sources of truth are **mutually exclusive**. The build cannot be pixel-exact to
both Tatyana's Figma frames and the live portal — at 1440 wide they are 432px different
in height on the login page alone. A decision is required per screen family:

- **Portal screens** (login, dashboard, service page, verified service page) — the live
  site should win, and the gate should measure against captures of the live site.
- **CID / IDV screens** (welcome, terms, biometric, verified, loading, confirmation) —
  Figma is the only source and remains authoritative.
