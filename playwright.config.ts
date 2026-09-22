import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  fullyParallel: false,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4173",
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
    command: "npx serve out -l 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 60000,
  },
});
