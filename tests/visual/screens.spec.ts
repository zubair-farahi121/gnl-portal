import { test } from "@playwright/test";
import { readFileSync, mkdirSync } from "node:fs";

type Frame = {
  id: string;
  node: string;
  route: string;
  width: number;
  height: number;
  budget: number;
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
    });
  });
}
