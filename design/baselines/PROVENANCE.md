# design/baselines/ — SELF-BASELINES, NOT FIGMA EXPORTS

**Generated:** 2026-09-27 by `npm run baseline` (`scripts/baseline.mjs`)
**Source:** `design/shots/` — screenshots of this repo's own static export,
taken by `npm run shots` against `serve out`.

## Read this before trusting a green `npm run diff`

These PNGs are **a picture of the build**, not a picture of the design.

The intended baseline for each frame is a 1x PNG export of the Figma node named
in `design/frames.json` — the `design-reference/screens/` pack of
`BUILD_BRIEF.md` §3. That pack was never delivered, and `figma.com` is blocked
by this container's egress proxy, so no export could be produced. See
`DEMO_AUDIT.md` §6 and open question **Q-18**.

| | |
|---|---|
| **Catches** | drift from the verified state of 2026-09-27 — which is what the `SERVICES` config refactor (§12.1) needs, since it touches KEEP screens and the only available proof is that their output did not move |
| **Cannot catch** | a mismatch that already existed against Figma on 2026-09-27. Anything wrong then is frozen as correct now. |

So `GATE: PASS` means *"nothing moved"*. It does **not** mean *"matches Figma"*.
The per-node Figma measurements in `design/token-exceptions.md` are the only
thing that speaks to fidelity.

## Frozen state

Taken **after** Montserrat was self-hosted for the Yoti zone (`BUILD_BRIEF.md`
§11.1 / §11.9), so the seven Yoti-zone frames are baselined in Montserrat
400/500/600/700 and the rest of the portal in Lato. Baselining before that
change would have frozen the wrong typeface into the reference.

Also taken **after** the 2026-09-27 Yoti-zone pass (`DEMO_AUDIT.md` →
"Yoti zone audit"), which replaced the in-flow Continue with the pinned
`YotiActionBar`, raised the type to the `YOTI_TEXT` scale, and rebuilt the Y2
camera window. All **seven** Yoti frames moved in that pass and were
re-baselined deliberately; the other fifteen did not move at all, and that —
not the seven — is what proves the change stayed inside the zone. If a
non-Yoti frame ever needs re-baselining after a Yoti change, something has
leaked and the right fix is in the markup, not here.

## When the real exports arrive

Drop them into this folder under the frame ids in `design/frames.json`, delete
this file, and **do not run `npm run baseline` again** — it would overwrite the
real reference with a picture of the build.

## Added 2026-09-29 — Flow 3 (three NEW frames, nothing overwritten)

`wallet-c1` (C1 page, 6220:86445, 1440x1024), `wallet-connect` (W3,
6325:60170, 390x881) and `wallet-cards` (W9, 6240:55253, 390x844) were copied
from `design/shots/` **one file each, by name** — `npm run baseline --yes` was
NOT run, because it rewrites every baseline and this file. The 22 existing
baselines were not touched and still diff at 0.000%. Same caveat as above:
these freeze the build of 2026-09-29; they do not prove a match with Figma
(the wallet's glyphs and the C1 page's wallet icons are drawn stand-ins).

## Re-baselined 2026-09-30 — feedback round (branch `feedback-ui`), five frames

Copied from `design/shots/` **one file each, by name** (`npm run baseline --yes`
was NOT run). Each one moved for a named reason; the other 20 frames stayed at
0.000% throughout. Differing % against the old baseline, before the copy:

| Frame | Before | Why it moved |
|---|---|---|
| `dashboard` | 0.037% | Bootstrap `star` on every card footer, Bootstrap `chevron-right` on Personal Health Record, "Welcome Jason Moore!" |
| `service` | 0.026% | Bootstrap `lock` in the red badge, `bell-fill` beside the title, `star-fill` in the favourite card |
| `service-verified` | 0.015% | Bootstrap `check-lg` in the green Trusted badge, `bell-fill` beside the title |
| `onboard` | 0.002% | Native `<input type="radio">` (accent #004b87) in place of the radio images |
| `wallet-c1` | 0.083% | Subtitle "…Scan the code with your digital wallet to add it." |

`login` did not move: the real inputs draw the same boxes at rest.

## Re-baselined 2026-10-01 — real logos (branch `feedback-ui`), 23 frames

The designer's SharePoint logos replaced three placeholders: `mygovnl-logo.svg`
(top nav, both sizes, and the dashboard's purple footer band), `gnl-crest.svg`
(grey site footer, desktop and mobile) and `gnl-crest-grey.svg` (the white
verification-service option cards). Every frame with a top nav or a site footer
moved, and nothing else in them: a per-frame bounding-box check of the
differing pixels found ONLY the logo boxes (112x33.6 nav logo at 80,18 or
16,16; 72x36 / 99x50 footer crest; 150x45 purple-band logo; 72x36 card
crests). Copied one file each, by name (`npm run baseline --yes` NOT run):

`auth-loading`, `cid-biometric`, `cid-capture-back`, `cid-capture-front`,
`cid-capture-intro`, `cid-continue-on-mobile`, `cid-country`, `cid-document`,
`cid-liveness`, `cid-liveness-capture`, `cid-terms`, `cid-verified`,
`confirmation`, `dashboard`, `login`, `onboard`, `prereq-confirm`,
`prereq-required`, `service`, `service-verified`, `summary`, `terms`,
`wallet-c1`. Before the copy they differed by 0.06%–1.19% (the mobile CID
frames above the 0.8% budget, because the 99x50 crest and the nav logo are a
larger share of a 393px frame). `wallet-connect` and `wallet-cards` (phone
frames with no portal chrome) stayed at 0.000%.

## Re-baselined 2026-10-01 — Yoti liveness illustration, one frame

`cid-liveness` (3.558% before the copy): Yoti's real "Prepare to scan your
face" drawing (`yoti-prepare-to-scan-face.png`, from the designer's SharePoint
folder) replaced the placeholder SVG. The differing pixels are confined to the
illustration box (24,444 → 369,789); nothing else on the frame moved.

## Re-baselined 2026-10-01 — lock-fill, one frame

`service` (0.002% before the copy): the 12px white lock in the red
"Confirmation required" badge is now Bootstrap `lock-fill`, as the feedback
brief lists, instead of the outline `lock` chosen on 2026-09-30. Differing
pixels: the 8x7 glyph at 374,181 only.
