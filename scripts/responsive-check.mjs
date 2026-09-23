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
  // THE FRONT OF THE WIZARD — added 2026-09-23 (Tier 1). NL-04 / NL-05 / NL-06,
  // the three screens between "Onboard" and the method step. All three are
  // DERIVED: their only Figma source is a pasted screenshot with no text layer,
  // so this gate and the pixel gate are the only mechanical checks they have.
  //
  // NL-05 is the one to watch here: it is the tallest wizard card in the demo
  // and the only one with a bordered scroll box and a checkbox row, both of
  // which are the kind of fixed-ish box that drags a 320px viewport sideways.
  ['summary', '/services/driver-vehicle/summary/'],
  ['terms', '/services/driver-vehicle/terms/'],
  ['confirm-details', '/services/driver-vehicle/confirm-details/'],
  ['onboard', '/services/driver-vehicle/onboard/'],
  // Step 7, added 2026-09-22 (Figma 6217:81644 "Confirm some details"). A 1440
  // desktop wizard frame, so it reflows like /onboard/ and /confirmation/
  // rather than like the 393-wide CID screens.
  ['prerequisite', '/services/driver-vehicle/prerequisite/'],
  ['confirmation', '/services/driver-vehicle/confirmation/'],
  ['auth-loading', '/auth/loading/'],
  // The end state, re-synced 2026-09-22 to 6257:72314. Query-string route, so
  // it exercises the Suspense/useSearchParams branch as well as the layout.
  ['service-verified', '/services/driver-vehicle/?verified=1'],
  // The mobile hand-off, added 2026-09-22 (Figma 6217:62059). A 1440 DESKTOP
  // frame despite its `CID_*` name and its /cid/ route, so it reflows like
  // /onboard/ and /auth/loading/ rather than like the 393-wide CID screens —
  // it is the one /cid/ route that does not go through CidScreen.
  ['cid-continue-on-mobile', '/cid/continue-on-mobile/'],
  ['cid-terms', '/cid/terms/'],
  ['cid-biometric', '/cid/biometric/'],
  // THE LIVENESS CHECK — step 3 of 5, added 2026-09-23 (Figma 6217:65268 /
  // 6217:65271). The two frames that close the hole in the sub-step counter.
  // /cid/liveness-capture/ is the THIRD screen in the build that mounts
  // CameraViewport, so like the two capture screens it is exercised here on a
  // headless Chromium with no capture device — i.e. this gate proves its
  // FALLBACK branch (the flat #e9ebe8 panel Figma draws, with the pill and the
  // face guide on it) reflows and stays console-clean. The LIVE branch is
  // `npm run camera`.
  ['cid-liveness', '/cid/liveness/'],
  ['cid-liveness-capture', '/cid/liveness-capture/'],
  // Document-type / country of issuance, added 2026-09-22 (Figma 6217:66054).
  ['cid-country', '/cid/country/'],
  // The ID-document step, added 2026-09-22 (Figma 6087:31396 / 6056:19118 /
  // 6057:20924). Listed in flow order so the saved screenshots in
  // design/responsive/ can be read as the sequence the presenter walks.
  ['cid-document', '/cid/document/'],
  // Capture instructions (step 4b), added 2026-09-22 (Figma 6217:66055) — the
  // screen the frame map knew existed but could not address.
  ['cid-capture-intro', '/cid/capture-intro/'],
  ['cid-capture-front', '/cid/capture-front/'],
  ['cid-capture-back', '/cid/capture-back/'],
  ['cid-verified', '/cid/verified/'],
  // ====================================================================
  // FLOW B's CertifiO ID run — added 2026-09-23.
  //
  // The SAME ten screen components as the block above, prerendered a second
  // time for `studentaid` by src/app/cid/[serviceId]/. They are listed here in
  // flow order, like Flow A's, so design/responsive/ reads as the sequence the
  // presenter walks, and they are in this gate for three reasons:
  //
  //   1. THE COPY IS LONGER IN PLACES and the layout has to survive it.
  //      "StudentAidNL" is a longer wizard title than "Driver and Vehicle" at
  //      the same 393px, the step-5 bullets are full sentences rather than
  //      fragments, and "Continue to StudentAidNL service" is a wider button
  //      label. Every one of those is a plausible 320px overflow, and nothing
  //      else in the build would catch it — there is no Figma baseline for
  //      these ten URLs, so the pixel gate cannot see them at all.
  //   2. THEY ARE REAL FILES, so a broken `generateStaticParams` shows up here
  //      as an immediate 404-shaped failure rather than on stage.
  //   3. /cid/studentaid/capture-front/ mounts CameraViewport, exactly as its
  //      Flow A twin does, so its FALLBACK branch is exercised here on a
  //      headless Chromium with no capture device.
  //
  // NOTE THERE IS NO `cid-b-capture-back`. §9: "**no back capture**" for
  // PP-09..PP-19. `captureSides: ['front']` means that route is never generated
  // and never linked; listing it here would assert a page that should not
  // exist. The click-through gate asserts the absence directly instead.
  // ====================================================================
  ['cid-b-continue-on-mobile', '/cid/studentaid/continue-on-mobile/'],
  ['cid-b-terms', '/cid/studentaid/terms/'],
  ['cid-b-biometric', '/cid/studentaid/biometric/'],
  ['cid-b-liveness', '/cid/studentaid/liveness/'],
  ['cid-b-liveness-capture', '/cid/studentaid/liveness-capture/'],
  ['cid-b-country', '/cid/studentaid/country/'],
  ['cid-b-document', '/cid/studentaid/document/'],
  ['cid-b-capture-intro', '/cid/studentaid/capture-intro/'],
  ['cid-b-capture-front', '/cid/studentaid/capture-front/'],
  ['cid-b-verified', '/cid/studentaid/verified/'],
  // THE GNL 404 — added 2026-09-23 (Tier 1 item 1.6, brief §7.6). `/nope/` is
  // an unknown path on purpose: the static export serves out/404.html for it,
  // which is the page under test. It is in this gate because §7.6 says the demo
  // link may be shared, so the 404 is a page strangers will actually see, and
  // because it is the only route here that nothing else navigates to.
  ['not-found', '/nope/'],
];

const WIDTHS = [320, 375, 393, 768, 1024, 1280, 1440, 1920];
const SHOT_WIDTHS = [320, 390, 768, 1024, 1280];

/*
 * THE FLAGS ARE A SPEED FIX, NOT A PREFERENCE — added 2026-09-23 (Tier 2).
 *
 * When Flow B's ten `/cid/studentaid/…` routes joined the list this gate went
 * from ~9 minutes to over 10 and was killed mid-run. The cause was not the
 * extra routes: a plain headless Chromium opens background connections of its
 * own (safebrowsing lists, component update, connectivity probes to
 * www.google.com). This container has no route to those hosts, so each attempt
 * sat until the egress proxy refused it — 522 refusals in one run — and because
 * every `goto` below waits for `networkidle`, the gate was waiting on
 * Chromium's own traffic on every one of the ~300 page loads.
 *
 * Nothing in the build requests Google: `grep -r google src/ out/` is empty,
 * the fonts are self-hosted under src/app/fonts/ via next/font/local. So this
 * was never a demo problem and these flags change nothing about what is
 * rendered — they only stop the browser making requests the page never asked
 * for. Keep them in step with scripts/click-through.mjs and camera-check.mjs.
 */
const QUIET_ARGS = [
  '--disable-background-networking',
  '--disable-component-update',
  '--disable-client-side-phishing-detection',
  '--disable-sync',
  '--disable-default-apps',
  '--no-first-run',
  '--no-default-browser-check',
];

const browser = await chromium.launch({ executablePath: EXEC, args: QUIET_ARGS });
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
    /*
     * `not-found` is the one route whose document is SUPPOSED to come back
     * 404 — that is the assertion, not a defect: Chromium logs the status of
     * the top-level response as a console error. The exemption is scoped to
     * that route by name, so a stray 404 on any OTHER route (a missing icon, a
     * missing font) still fails this gate the way it always has.
     */
    const real = msgs.filter(
      (t) =>
        !/favicon|Download the React DevTools/i.test(t) &&
        !(name === 'not-found' && /status of 404/i.test(t)),
    );
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
