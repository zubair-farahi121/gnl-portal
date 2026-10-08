import { defineConfig } from "@playwright/test";

// Same env var as scripts/click-through.mjs, camera-check.mjs and
// responsive-check.mjs, so two builds can be tested side by side.
// Default unchanged: http://localhost:4173.
const BASE = (process.env.DEMO_BASE_URL ?? "http://localhost:4173").replace(/\/+$/, "");
const PORT = new URL(BASE).port || "4173";

export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: BASE,
    // 1x. Figma renders baselines at natural frame size, so matching that
    // avoids an upscale step on either side of the comparison.
    deviceScaleFactor: 1,
    // Force light rendering: the design has no dark mode, and a dark-mode
    // browser would fail every diff for the wrong reason.
    colorScheme: "light",
    // This environment ships Chromium build 1194 at PLAYWRIGHT_BROWSERS_PATH
    // and forbids `playwright install`. Point at it explicitly so the version
    // the npm package expects does not matter.
    launchOptions: {
      executablePath:
        process.env.PLAYWRIGHT_CHROMIUM_PATH ??
        "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    },
  },
  webServer: {
    command: `npx serve out -l ${PORT}`,
    url: BASE,
    reuseExistingServer: true,
    timeout: 60000,
  },
});
