# design/baselines/ — SELF-BASELINES, NOT FIGMA EXPORTS

**Generated:** 2026-09-23 by `npm run baseline` (`scripts/baseline.mjs`)
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
| **Catches** | drift from the verified state of 2026-09-23 — which is what the `SERVICES` config refactor (§12.1) needs, since it touches KEEP screens and the only available proof is that their output did not move |
| **Cannot catch** | a mismatch that already existed against Figma on 2026-09-23. Anything wrong then is frozen as correct now. |

So `GATE: PASS` means *"nothing moved"*. It does **not** mean *"matches Figma"*.
The per-node Figma measurements in `design/token-exceptions.md` are the only
thing that speaks to fidelity.

## Frozen state

Taken **after** Montserrat was self-hosted for the Yoti zone (`BUILD_BRIEF.md`
§11.1 / §11.9), so the seven Yoti-zone frames are baselined in Montserrat
400/500/600/700 and the rest of the portal in Lato. Baselining before that
change would have frozen the wrong typeface into the reference.

## When the real exports arrive

Drop them into this folder under the frame ids in `design/frames.json`, delete
this file, and **do not run `npm run baseline` again** — it would overwrite the
real reference with a picture of the build.
