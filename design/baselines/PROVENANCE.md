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
