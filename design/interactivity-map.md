# Interactivity map

Every control on the eleven demo screens, sorted into **wired** (it has a real
destination) and **inert** (it does not, and is deliberately marked so).

Written 2026-09-21 after a single full pass over the app. The trigger was the
presenter hitting dead controls one at a time mid-demo:

> "also on the main page, the Logout button, and all the menuse services,
> account, notification contact us, are not working ? why?"

The cause was systemic, not per-button: `TopNav.tsx`, `LoginHeader.tsx`,
`MobileTopNav.tsx`, `SiteFooter.tsx` and `LinkedItemCard.tsx` rendered every
control as a plain `<p>` / `<div>` / handler-less `<button>` with no
`next/link` import anywhere in the file.

## The eleven screens that exist

These are the only valid destinations. Nothing in this app may link anywhere
else, and no new screen was invented to give a control somewhere to go.

```
/                                        login
/dashboard/                              services dashboard
/services/driver-vehicle/                service page (unverified)
/services/driver-vehicle/?verified=1     service page (verified end state)
/services/driver-vehicle/onboard/        prerequisite check / IDV choice
/services/driver-vehicle/confirmation/   success
/cid/welcome/  /cid/terms/  /cid/biometric/  /cid/verified/   CID mobile
/auth/loading/                           IDV status
```

`src/lib/flow.ts` holds the intended click-through order.

## How an inert control is marked

Markup and every visual value are byte-identical to before. The only additions
are:

- `data-demo-inert="true"` — the machine-readable marker, on every one
- `cursor-default` and `select-none` — so it does not behave like a link
- `aria-disabled="true"` — on anything that is semantically a button or a row
  that reads as a disclosure control

`aria-disabled`, never the native `disabled` attribute: `disabled` repaints a
button's label in the UA's grey and would fail the pixel gate. Playwright's
actionability check already refuses to click these, which is the behaviour we
want and a useful regression signal.

---

# 1. Wired controls

**⇢ = newly wired in this pass.** Everything else already worked and was left
untouched.

## Chrome (appears on many screens)

| Control | Appears on | Destination |
|---|---|---|
| ⇢ MyGovNL logo (desktop top nav) | dashboard, service, service verified, onboard, confirmation, auth loading | `/dashboard/` |
| ⇢ MyGovNL logo (mobile top nav) | all four CID screens | `/dashboard/` |
| ⇢ `Services` nav item | every screen with a top nav | `/dashboard/` |
| ⇢ `Log Out` button (top nav) | every screen with a top nav | `/` **and** `reset()` |
| ⇢ `Services` (mobile footer) | all four CID screens | `/dashboard/` |
| `Contact us` / `Visit gov.nl.ca` / `Disclaimer / Copyright / Privacy statement` | every footer | real `gov.nl.ca` URLs, new tab |
| `Terms and Conditions` | mobile footer | real `gnl.qa.citizenone.ca` URL, new tab |
| `digitalgovernment@gov.nl.ca` | desktop footer | `mailto:` |

`Log Out` clears the demo's `verified` flag before navigating, so the next run
of the demo starts from the unverified service page. This is the one place a
`next/link` carries an `onClick` — state has to change first. It is why
`TopNav.tsx` is now a client component.

## `/` login

| Control | Destination |
|---|---|
| ⇢ MyGovNL wordmark (header) | `/` |
| `Log in` | `/dashboard/` |

## `/dashboard/`

| Control | Destination |
|---|---|
| `Driver and Vehicle` service card | `/services/driver-vehicle/` |

## `/services/driver-vehicle/` (both states)

| Control | Destination |
|---|---|
| `← Back to Services` breadcrumb | `/dashboard/` |
| `Onboard` (unverified only) | `/services/driver-vehicle/onboard/` |
| `Terms of Use` (Data & Privacy card) | `https://www.gov.nl.ca/disclaimer/`, new tab |
| `1-877-636-6867` (Contact Information) | `tel:` |

## `/services/driver-vehicle/onboard/`

| Control | Destination |
|---|---|
| GNL Identity Verification Service option card | `/cid/welcome/` |
| `Cancel` | `/services/driver-vehicle/` |
| `Back` | `/services/driver-vehicle/` |
| `Continue` | `/cid/welcome/` |

## CID mobile screens

| Control | Screen | Destination |
|---|---|---|
| whole `Main content` block | `/cid/welcome/` | `/cid/terms/` |
| `I do not agree` | `/cid/terms/` | `/cid/welcome/` |
| `I agree` | `/cid/terms/` | `/cid/biometric/` |
| `I do not agree` | `/cid/biometric/` | `/cid/terms/` |
| `I agree` | `/cid/biometric/` | `/cid/verified/` |
| `Continue to Driver and Vehicle service` | `/cid/verified/` | `setVerified(true)` then `/auth/loading/` |
| ⇢ `Log out` | `/cid/verified/` | `/` **and** `reset()` |

`/cid/welcome/` has no button in the design at all — the whole content block is
the forward affordance, which is an existing documented deviation, not
something this pass introduced. **The design needs a real Continue button here.**

## `/auth/loading/`

No controls. The screen auto-advances to
`/services/driver-vehicle/confirmation/` after 2.6s.

## `/services/driver-vehicle/confirmation/`

| Control | Destination |
|---|---|
| `Back` | `/services/driver-vehicle/onboard/` |
| `Go to Service Driver's License Renewal` | `/services/driver-vehicle/?verified=1` |

---

# 2. Inert controls, by screen

**This is the list for the designer.** Each of these looks clickable and has no
screen behind it. Either a screen needs drawing, or the control should come out
of the design.

## `/` login — 5

- `Create account`
- `Forgot password?`
- the three **accordion rows** under "How can we help?" — the design only ever
  draws the closed state, so there is no open state to expand into

Not marked, but worth raising: the **Email Address / Password fields** and the
**eye icon** are presentational. Figma draws empty boxes with a zero-width
space, so there is no real `<input>` to disable.

## `/dashboard/` — 14

- top nav: `Account`, `Notifications`, `Contact Us`
- the **nine service cards other than Driver and Vehicle**:
  `Accessible parking permit`, `Early Learning Gateway`, `MyHealthNL`,
  `Tickets and fines`, `Domestic wood cutting permits`,
  `Learner's permit and off-road vehicle tests`, `Personal Health Record`,
  `MCP`, `StudentAidNL`
- `Search` button — there is no results screen
- `Tell us what you think`

Not marked: the search field is a presentational box, and each card's footer
**star** is the design's `star-off` glyph with no "on" state drawn anywhere.
There is also no favourites list for a star to add to — "Favourite Services" is
an empty-state explanation only.

## `/services/driver-vehicle/` unverified — 5

- top nav: `Account`, `Notifications`, `Contact Us`
- the round grey **notification bell** beside the title badge
- the `Favourite Service` card and its star

## `/services/driver-vehicle/?verified=1` — 24

- top nav: `Account`, `Notifications`, `Contact Us`
- **notification bell**
- `Favourite Service` card
- Actions → **Driver**: `Renew your driver's licence`,
  `Change your address with Motor Registration`,
  `Purchase your driving record (abstract)`, `Pay for your road test`
- Actions → **Vehicle**: `Renew your vehicle registration`,
  `Notify Motor Registration when you no longer own a vehicle`,
  `Request a reprint of your vehicle registration`,
  `Complete your vehicle ownership transfer`
- Actions → **Other**: `Book an appointment`
- **Your linked items**, all ten buttons: `Update` (wallet promo),
  `View demerit points`, `Update` (address), `Renew` + `No longer have?` +
  `Lost your registration?` + `Add to your digital wallet` (2015 CHEV IMT),
  `Renew` + `No longer have?` + `Lost your registration?` (utility trailer)

This is the worst screen by a distance: **21 of its controls go nowhere.** The
eight Actions links point at `https://example.com/...` in Figma, which is
itself a placeholder.

## `/services/driver-vehicle/onboard/` — 4

- top nav: `Account`, `Notifications`, `Contact Us`
- the **MRD (Motor Registration Division) IDV option card** — the unselected
  radio option. Only the GNL/CID option has a screen behind it.

## `/cid/welcome/` — 5

- mobile nav: `Account`, `Notifications`, `Contact Us`
- mobile footer: `Notifications`, `Account`

## `/cid/terms/` — 6

- mobile nav: `Account`, `Notifications`, `Contact Us`
- mobile footer: `Notifications`, `Account`
- the `Terms of Use` **link text inside the body copy** — no destination in the
  design

## `/cid/biometric/` — 6

Same as `/cid/terms/`, including the body-copy `Terms of Use` link.

## `/cid/verified/` — 5

- mobile nav: `Account`, `Notifications`, `Contact Us`
- mobile footer: `Notifications`, `Account`

## `/auth/loading/` — 3

- top nav: `Account`, `Notifications`, `Contact Us`

## `/services/driver-vehicle/confirmation/` — 3

- top nav: `Account`, `Notifications`, `Contact Us`

---

# 3. Summary for the designer

Four things account for nearly every dead control:

1. **`Account`, `Notifications` and `Contact Us`** appear on all eleven screens
   and none of the three has a screen. That is 33 of the dead controls on its
   own, and it is what the presenter hit first.
2. **The verified service page** has 21 dead controls — every Actions link and
   every linked-item button.
3. **Nine of the ten dashboard service cards** go nowhere. Only Driver and
   Vehicle is built, which is correct for this demo's story, but the cards do
   not look any different from the one that works.
4. **`/cid/welcome/` has no button in the design.** The whole content block is
   currently the forward affordance.

`View details` was named as a control to make inert. It does not exist anywhere
in this codebase — no such string appears in any component, page or data file.

---

# 4. Verification

Zero visual change, checked rather than assumed. All eleven screens were
captured before and after the pass and compared with `pixelmatch` at
`threshold: 0`:

```
OK    auth-loading.png      1440x1079   differing=0
OK    cid-biometric.png      393x902    differing=0
OK    cid-terms.png          393x878    differing=0
OK    cid-verified.png       393x1051   differing=0
OK    cid-welcome.png        393x1087   differing=0
OK    confirmation.png      1440x1024   differing=0
OK    dashboard.png         1440x1890   differing=0
OK    login.png             1440x1881   differing=0
OK    onboard.png           1440x1254   differing=0
OK    service-verified.png  1440x1820   differing=0
OK    service.png           1440x1073   differing=0
```

Every dimension matches `design/frames.json`, except the two already-known
`+7px` deltas on `cid-terms` (871 → 878) and `cid-biometric` (895 → 902), which
this pass did not change.

The reason swapping a `<p>` or `<div>` for a `<Link>` moves nothing: Tailwind's
preflight resets `a { color: inherit; text-decoration: inherit }` and zeroes
margin, padding and border on every element, and each wired control is a flex
item or absolutely positioned, so `inline` blockifies to exactly the `block` /
`flex` the old element had. No `display` override was needed anywhere.
