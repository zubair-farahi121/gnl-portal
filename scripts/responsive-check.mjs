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
 * playwright.config.ts uses. The default is Playwright's installed Chromium.
 */
import { chromium } from 'playwright';

const EXEC =
  process.env.PLAYWRIGHT_CHROMIUM_PATH;
const BASE = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:4173';

const ROUTES = [
  ['login', '/'],
  ['dashboard', '/dashboard/'],
  ['service', '/services/driver-vehicle/'],
  ['service-verified', '/services/driver-vehicle/?verified=1'],
  ['onboard', '/services/driver-vehicle/onboard/'],
  ['confirmation', '/services/driver-vehicle/confirmation/'],
  ['auth-loading', '/auth/loading/'],
  ['cid-terms', '/cid/terms/'],
  ['cid-biometric', '/cid/biometric/'],
  ['cid-verified', '/cid/verified/'],
];

const WIDTHS = [320, 375, 390, 393, 480, 600, 767, 768, 820, 1023, 1024, 1280, 1440, 1920];
const SHOT_WIDTHS = [320, 390, 768, 1024, 1440, 1920];
const VIEWPORTS = [
  ...WIDTHS.map(width => ({ width, height: 900, label: `${width}`, scale: 1 })),
  { width: 667, height: 375, label: 'landscape-667', scale: 1 },
  { width: 844, height: 390, label: 'landscape-844', scale: 1 },
  { width: 720, height: 450, label: '200-percent-reflow', scale: 2 },
];

const browser = await chromium.launch({ executablePath: EXEC });
const fails = [];
const consoleIssues = [];

for (const [name, route] of ROUTES) {
  for (const { width, height, label, scale } of VIEWPORTS) {
    const w = label;
    const ctx = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: scale });
    const page = await ctx.newPage();
    const msgs = [];
    page.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') msgs.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', e => msgs.push(`pageerror: ${e.message}`));
    const response = await page.goto(BASE + route, { waitUntil: 'networkidle' });
    if (!response?.ok()) fails.push(`${name} @${w}: HTTP ${response?.status()}`);
    await page.addStyleTag({ content: '.gnl-desktop-shell, .gnl-mobile-shell, .gnl-cid-shell { overflow: visible !important; }' });
    await page.evaluate(() => document.fonts.ready);
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
      const smallTargets = [...document.querySelectorAll(':is(.gnl-desktop-shell, .gnl-mobile-shell, .gnl-cid-shell) :is(a, button)')]
        .filter(el => d.clientWidth <= 768 || el.closest('.gnl-mobile-shell'))
        .filter(el => {
          const rect = el.getBoundingClientRect();
          return rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44);
        })
        .map(el => el.textContent.trim() || el.querySelector('img')?.alt);
      const escapedText = [...document.querySelectorAll('p')].filter(el => {
        const rect = el.getBoundingClientRect();
        const parent = el.parentElement.getBoundingClientRect();
        return rect.width > 0 && parent.width > 0 &&
          (rect.right > parent.right + 1 || rect.bottom > parent.bottom + 1);
      }).map(el => el.textContent.slice(0, 80));
      const brokenImages = [...document.images].filter(img => !img.complete || !img.naturalWidth).map(img => img.src);
      return { scrollWidth: d.scrollWidth, clientWidth: d.clientWidth, wide, smallTargets, escapedText, brokenImages };
    });
    if (m.scrollWidth > m.clientWidth) {
      fails.push(`${name} @${w}: scrollWidth ${m.scrollWidth} > clientWidth ${m.clientWidth} :: ${m.wide.join(' | ')}`);
    }
    if (m.smallTargets.length) {
      fails.push(`${name} @${w}: targets below 44px: ${m.smallTargets.join(', ')}`);
    }
    if (m.escapedText.length) fails.push(`${name} @${w}: text outside parent: ${m.escapedText.join(', ')}`);
    if (m.brokenImages.length) fails.push(`${name} @${w}: broken images: ${m.brokenImages.join(', ')}`);
    if (name === 'dashboard') {
      await page.locator('[data-node-id="6031:5977"]').evaluate(el => {
        el.textContent = 'Welcome Alexandra Catherine Montgomery-Sutherland!';
      });
      const fits = await page.locator('[data-node-id="6031:5976"]').evaluate(el => el.scrollHeight <= el.clientHeight);
      if (!fits) fails.push(`${name} @${w}: long greeting exceeds section height`);
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

console.log('\n=== LAYOUT AND ACCESSIBILITY FAILURES ===');
console.log(fails.length ? fails.join('\n') : `none - ${ROUTES.length * VIEWPORTS.length} route/viewport checks passed`);
console.log('\n=== CONSOLE ISSUES ===');
console.log(consoleIssues.length ? consoleIssues.join('\n') : 'none');

// Non-zero exit so `npm run check` actually fails instead of printing and
// carrying on.
if (fails.length || consoleIssues.length) process.exit(1);
