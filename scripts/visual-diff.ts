import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

type Frame = { id: string; node: string; route: string; budget: number };

const manifest = JSON.parse(readFileSync("design/frames.json", "utf8")) as {
  frames: Frame[];
};

mkdirSync("design/diffs", { recursive: true });

let failed = false;
const rows: string[] = [];

for (const f of manifest.frames) {
  const basePath = `design/baselines/${f.id}.png`;
  const shotPath = `design/shots/${f.id}.png`;

  if (!existsSync(basePath) || !existsSync(shotPath)) {
    rows.push(
      `SKIP  ${f.id.padEnd(18)} missing ${!existsSync(basePath) ? "baseline" : "shot"}`,
    );
    failed = true;
    continue;
  }

  const base = PNG.sync.read(readFileSync(basePath));
  const shot = PNG.sync.read(readFileSync(shotPath));

  // Compare on the intersection; a size mismatch is itself a failure signal.
  const w = Math.min(base.width, shot.width);
  const h = Math.min(base.height, shot.height);

  // Figma frame heights are fractional (e.g. 1880.215), so the exported PNG
  // and the browser screenshot can legitimately differ by a rounding pixel.
  // Anything beyond that tolerance is a real layout error.
  const SIZE_TOLERANCE_PX = 2;
  const dw = Math.abs(base.width - shot.width);
  const dh = Math.abs(base.height - shot.height);
  if (dw > SIZE_TOLERANCE_PX || dh > SIZE_TOLERANCE_PX) {
    rows.push(
      `SIZE  ${f.id.padEnd(18)} baseline ${base.width}x${base.height} vs build ${shot.width}x${shot.height}  (off by ${dw}x${dh})`,
    );
    failed = true;
  }

  // pixelmatch needs both buffers to describe the same WxH, so crop first.
  const crop = (src: PNG) => {
    if (src.width === w && src.height === h) return src;
    const out = new PNG({ width: w, height: h });
    PNG.bitblt(src, out, 0, 0, w, h, 0, 0);
    return out;
  };

  const a = crop(base);
  const b = crop(shot);
  const diff = new PNG({ width: w, height: h });
  const differing = pixelmatch(a.data, b.data, diff.data, w, h, {
    threshold: 0.1,
  });
  writeFileSync(`design/diffs/${f.id}.png`, PNG.sync.write(diff));

  const ratio = differing / (w * h);
  const verdict = ratio <= f.budget ? "PASS" : "FAIL";
  if (verdict === "FAIL") failed = true;
  rows.push(
    `${verdict}  ${f.id.padEnd(18)} ${(ratio * 100).toFixed(3).padStart(7)}% differing  (budget ${(f.budget * 100).toFixed(1)}%)`,
  );
}

console.log(rows.join("\n"));
console.log(failed ? "\nGATE: FAIL" : "\nGATE: PASS");
process.exit(failed ? 1 : 0);
