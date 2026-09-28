/*
 * scripts/baseline.mjs — regenerate design/baselines/ from design/shots/.
 *
 * ====================================================================
 * THESE ARE SELF-BASELINES. THEY ARE NOT FIGMA EXPORTS.
 *
 * design/frames.json names a Figma node for every frame, and the intended
 * baseline for each is a 1x PNG export of that node — exactly what
 * `design-reference/screens/` was supposed to deliver (BUILD_BRIEF.md §3).
 * That pack was never delivered, and figma.com is blocked by this container's
 * egress proxy, so no export can be produced here. See DEMO_AUDIT.md §6 and
 * open question Q-18.
 *
 * What this script does instead is FREEZE TODAY'S VERIFIED BUILD. Read that
 * literally, because it decides what the gate is worth:
 *
 *   IT CATCHES   drift from the state the build was in when the baselines
 *                were taken. That is precisely what the service-config
 *                refactor (BUILD_BRIEF.md §12.1) needs, because that refactor
 *                touches KEEP screens the brief forbids restyling and the
 *                only available proof is "the output did not move".
 *
 *   IT CANNOT    catch a mismatch that ALREADY EXISTS against Figma. If a
 *   CATCH        screen is wrong today, these baselines make it wrong
 *                forever and call it PASS. A green `npm run diff` is
 *                therefore NOT evidence that a screen matches its Figma
 *                node — only `design/token-exceptions.md` and the per-node
 *                measurements recorded there speak to that.
 *
 * WHEN REAL EXPORTS ARRIVE, drop them straight into design/baselines/ under
 * the frame ids in design/frames.json and delete PROVENANCE.md. Do not run
 * this script again after that: it would overwrite the real reference with a
 * picture of the build, which is the one failure mode this whole file exists
 * to prevent.
 * ====================================================================
 *
 * WHY THIS IS A SCRIPT AND NOT `cp design/shots/* design/baselines/`.
 *
 * Re-baselining is how a visual gate gets quietly switched off: a screen
 * regresses, `npm run diff` goes red, and the fastest way to green is to copy
 * the new shots over the baselines. Then the gate passes forever and the
 * regression ships. So this refuses to run without an explicit `--yes`, and
 * before it does anything it prints every frame whose bytes would change and
 * by how much — i.e. exactly the regressions that are about to be blessed.
 *
 * Usage:
 *   node scripts/baseline.mjs          # dry run: report, change nothing
 *   node scripts/baseline.mjs --yes    # actually write design/baselines/
 */
import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
  existsSync,
} from "node:fs";

const APPLY = process.argv.includes("--yes");

const manifest = JSON.parse(readFileSync("design/frames.json", "utf8"));
mkdirSync("design/baselines", { recursive: true });

/** PNG header: bytes 16-20 are width, 20-24 are height, both big-endian. */
function pngSize(path) {
  const buf = readFileSync(path);
  return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
}

const rows = [];
let missing = 0;
let changing = 0;

for (const f of manifest.frames) {
  const shot = `design/shots/${f.id}.png`;
  const base = `design/baselines/${f.id}.png`;

  if (!existsSync(shot)) {
    rows.push(`MISSING SHOT  ${f.id.padEnd(24)} run \`npm run shots\` first`);
    missing++;
    continue;
  }

  const s = pngSize(shot);

  if (!existsSync(base)) {
    rows.push(`NEW           ${f.id.padEnd(24)} ${s.w}x${s.h}`);
    changing++;
  } else {
    const b = pngSize(base);
    const same = readFileSync(base).equals(readFileSync(shot));
    if (same) {
      rows.push(`unchanged     ${f.id.padEnd(24)} ${s.w}x${s.h}`);
    } else {
      const size =
        b.w === s.w && b.h === s.h
          ? "same size, pixels differ"
          : `SIZE ${b.w}x${b.h} -> ${s.w}x${s.h}`;
      rows.push(`OVERWRITE     ${f.id.padEnd(24)} ${size}`);
      changing++;
    }
  }

  if (APPLY) copyFileSync(shot, base);
}

console.log(rows.join("\n"));

if (missing) {
  console.log(`\n${missing} shot(s) missing. Run \`npm run shots\` first.`);
  process.exit(1);
}

if (!APPLY) {
  console.log(
    `\n${changing} baseline(s) would change. DRY RUN — nothing written.` +
      `\nEvery line above marked NEW or OVERWRITE is a difference this gate will` +
      `\nstop reporting once you accept it. Read them, then re-run with --yes.`,
  );
  process.exit(0);
}

const stamp = new Date().toISOString().slice(0, 10);
writeFileSync(
  "design/baselines/PROVENANCE.md",
  `# design/baselines/ — SELF-BASELINES, NOT FIGMA EXPORTS

**Generated:** ${stamp} by \`npm run baseline\` (\`scripts/baseline.mjs\`)
**Source:** \`design/shots/\` — screenshots of this repo's own static export,
taken by \`npm run shots\` against \`serve out\`.

## Read this before trusting a green \`npm run diff\`

These PNGs are **a picture of the build**, not a picture of the design.

The intended baseline for each frame is a 1x PNG export of the Figma node named
in \`design/frames.json\` — the \`design-reference/screens/\` pack of
\`BUILD_BRIEF.md\` §3. That pack was never delivered, and \`figma.com\` is blocked
by this container's egress proxy, so no export could be produced. See
\`DEMO_AUDIT.md\` §6 and open question **Q-18**.

| | |
|---|---|
| **Catches** | drift from the verified state of ${stamp} — which is what the \`SERVICES\` config refactor (§12.1) needs, since it touches KEEP screens and the only available proof is that their output did not move |
| **Cannot catch** | a mismatch that already existed against Figma on ${stamp}. Anything wrong then is frozen as correct now. |

So \`GATE: PASS\` means *"nothing moved"*. It does **not** mean *"matches Figma"*.
The per-node Figma measurements in \`design/token-exceptions.md\` are the only
thing that speaks to fidelity.

## Frozen state

Taken **after** Montserrat was self-hosted for the Yoti zone (\`BUILD_BRIEF.md\`
§11.1 / §11.9), so the seven Yoti-zone frames are baselined in Montserrat
400/500/600/700 and the rest of the portal in Lato. Baselining before that
change would have frozen the wrong typeface into the reference.

Also taken **after** the 2026-09-27 Yoti-zone pass (\`DEMO_AUDIT.md\` →
"Yoti zone audit"), which replaced the in-flow Continue with the pinned
\`YotiActionBar\`, raised the type to the \`YOTI_TEXT\` scale, and rebuilt the Y2
camera window. All **seven** Yoti frames moved in that pass and were
re-baselined deliberately; the other fifteen did not move at all, and that —
not the seven — is what proves the change stayed inside the zone. If a
non-Yoti frame ever needs re-baselining after a Yoti change, something has
leaked and the right fix is in the markup, not here.

## When the real exports arrive

Drop them into this folder under the frame ids in \`design/frames.json\`, delete
this file, and **do not run \`npm run baseline\` again** — it would overwrite the
real reference with a picture of the build.
`,
);

console.log(
  `\n${changing} baseline(s) written to design/baselines/.` +
    `\nWrote design/baselines/PROVENANCE.md — these are SELF-baselines, not Figma` +
    `\nexports: they catch drift from today, not a mismatch that already exists.`,
);
