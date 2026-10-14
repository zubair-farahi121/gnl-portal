import { test } from "@playwright/test";
import { readFileSync, mkdirSync } from "node:fs";

type Frame = {
  id: string;
  node: string;
  route: string;
  width: number;
  height: number;
  budget: number;
  /**
   * OPTIONAL selectors to paint over before comparing — ADDED 2026-09-29 for
   * Flow 3's `wallet-c1`, whose QR encodes a per-offer id minted in the
   * browser and whose expiry line counts down. Frames without `mask` take
   * exactly the screenshot they always did.
   */
  mask?: string[];
  /**
   * OPTIONAL demo state to load before the page — ADDED 2026-10-14 for Flow
   * 4. The wallet screens W-03..W-09 pick their copy from the CURRENT
   * offer's credential (src/lib/data/credentials.ts), which lives in the
   * `gnl-demo:v1` store, not in the URL; a Flow 4 frame seeds a notice-of-
   * assessment offer here. Values are written as given (objects as JSON).
   * Frames without `seed` start from an empty store, exactly as before.
   */
  seed?: {
    localStorage?: Record<string, unknown>;
    sessionStorage?: Record<string, string>;
  };
};

const manifest = JSON.parse(readFileSync("design/frames.json", "utf8")) as {
  frames: Frame[];
};

mkdirSync("design/shots", { recursive: true });

for (const f of manifest.frames) {
  test(`shot ${f.id}`, async ({ page }) => {
    await page.setViewportSize({
      width: f.width,
      height: Math.min(f.height, 2000),
    });
    if (f.seed) {
      await page.addInitScript((seed) => {
        try {
          for (const [k, v] of Object.entries(seed.localStorage ?? {})) {
            localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
          }
          for (const [k, v] of Object.entries(seed.sessionStorage ?? {})) sessionStorage.setItem(k, v);
        } catch {
          /* ignore */
        }
      }, f.seed);
    }
    await page.goto(f.route);

    // Wait for the self-hosted Lato to be ready before measuring anything.
    await page.evaluate(() => document.fonts.ready);

    // Freeze animation so the spinner cannot make the diff flaky, and hide
    // the demo marker so it does not alter every comparison.
    await page.addStyleTag({
      content: `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}
                [data-demo-marker]{display:none!important}`,
    });

    await page.waitForTimeout(300);
    await page.screenshot({
      path: `design/shots/${f.id}.png`,
      fullPage: true,
      ...(f.mask ? { mask: f.mask.map((sel) => page.locator(sel)), maskColor: "#ff00ff" } : {}),
    });
  });
}
