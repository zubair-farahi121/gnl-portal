/*
 * Responsive gate.
 *
 * The visual gate next door (tests/visual/screens.spec.ts + visual-diff.ts)
 * answers "does this match Figma at the design width". This answers the other
 * half: "does it still hold together at every other width".
 *
 * For each route x width it asserts the page does not scroll sideways
 * (scrollWidth <= clientWidth) and that the console is clean, then saves a
 * full-page screenshot at the review widths into design/responsive/ so the
 * result can be looked at rather than just trusted.
 *
 * Needs the static build served first:  npm run build && npm run serve
 * Then:                                 npm run responsive
 *
 * SERVE IT WITHOUT `-s`. `serve -s out` is single-page-app mode and rewrites
 * every path to index.html, so all ten routes render the login page and this
 * script passes while testing nothing. `npm run serve` is correct.
 *
 * PLAYWRIGHT_CHROMIUM_PATH overrides the browser, the same env var
 * playwright.config.ts uses. The default is the build this container ships.
 */
import { chromium } from 'playwright';

const EXEC =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:4173';

const ROUTES = [
  ['login', '/'],
  ['dashboard', '/dashboard/'],
  ['service', '/services/driver-vehicle/'],
  ['onboard', '/services/driver-vehicle/onboard/'],
  ['confirmation', '/services/driver-vehicle/confirmation/'],
  ['auth-loading', '/auth/loading/'],
  ['cid-terms', '/cid/terms/'],
  ['cid-biometric', '/cid/biometric/'],
  ['cid-verified', '/cid/verified/'],
];

const WIDTHS = [320, 375, 393, 768, 1024, 1280, 1440, 1920];
const SHOT_WIDTHS = [320, 390, 768, 1024, 1280];

const browser = await chromium.launch({ executablePath: EXEC });
const fails = [];
const consoleIssues = [];

for (const [name, route] of ROUTES) {
  for (const w of WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const msgs = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') msgs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => msgs.push(`pageerror: ${e.message}`));
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    const m = await page.evaluate(() => {
      const d = document.documentElement;
      const wide = [...document.querySelectorAll('*')]
        .filter(el => el.getBoundingClientRect().right > d.clientWidth + 1)
        .slice(0, 4)
        .map(el => {
          const c = el.className;
          const s = typeof c === 'string' ? c : (c && c.baseVal) || '';
          return `${el.tagName}.${s.slice(0, 70)}`;
        });
      return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, wide };
    });
    if (m.scrollWidth > m.clientWidth) {
      fails.push(`${name} @${w}: scrollWidth ${m.scrollWidth} > clientWidth ${m.clientWidth} :: ${m.wide.join(' | ')}`);
    }
    const real = msgs.filter(t => !/favicon|Download the React DevTools/i.test(t));
    if (real.length) consoleIssues.push(`${name} @${w}: ${real.join(' ;; ')}`);
    await ctx.close();
  }
  for (const w of SHOT_WIDTHS) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);
    await page.screenshot({ path: `design/responsive/${name}-${w}.png`, fullPage: true });
    await ctx.close();
  }
  process.stdout.write(`. ${name}\n`);
}

await browser.close();

console.log('\n=== OVERFLOW FAILURES ===');
console.log(fails.length ? fails.join('\n') : 'none — no horizontal scroll at any width on any route');
console.log('\n=== CONSOLE ISSUES ===');
console.log(consoleIssues.length ? consoleIssues.join('\n') : 'none');

// Non-zero exit so `npm run check` actually fails instead of printing and
// carrying on.
if (fails.length || consoleIssues.length) process.exit(1);
