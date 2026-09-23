/*
 * Click-through gate.
 *
 * Twice in this project a control shipped looking perfect and doing nothing —
 * the wizard's Cancel / Back / Continue, then the whole top nav and Log Out —
 * and both times the user found it, not a test. This walks the demo's whole
 * chain, FORWARD and then BACKWARD, and asserts every control actually lands
 * on the route it should.
 *
 * It runs at 1440, 768 and 390 because the responsive pass reorders and
 * rewraps the nav on small screens, and because the eight 393-wide CID screens
 * swap their entire chrome at 768: a link can work at desktop width and be
 * covered or detached at phone width.
 *
 * REWRITTEN 2026-09-22 with step 7 (/services/driver-vehicle/prerequisite/,
 * Figma 6217:81644). Before this the script stopped at /cid/verified/ going
 * forward and walked back only three steps; the tail of the journey
 * (verified -> loading -> prerequisite -> confirmation -> verified service)
 * was never exercised in either direction.
 *
 * EXTENDED AGAIN 2026-09-22 with the three screens located that day:
 *   /cid/continue-on-mobile/  6217:62059  the mobile hand-off (1440 DESKTOP)
 *   /cid/country/             6217:66054  document type / country of issuance
 *   /cid/capture-intro/       6217:66055  capture instructions (step 4b)
 *
 * All three have exactly ONE on-screen control, so all three are single points
 * of failure for the whole chain. Note that /cid/continue-on-mobile/ is the one
 * /cid/ route that is NOT a CidScreen — it is a 1440 desktop frame — so at 390
 * it reflows through `.gnl-desktop-shell`, not through the CID chrome switch.
 *
 * EXTENDED AGAIN 2026-09-23 with the liveness check, the missing step 3:
 *   /cid/liveness/          6217:65268  "Prepare to scan your face"
 *   /cid/liveness-capture/  6217:65271  "Position your face within the frame."
 *
 * Both are CidScreens. The forward chain grew by two hops and every number
 * after them shifted; the backward chain grew by three, because
 * /cid/liveness-capture/ carries the ONLY visible Back control in the whole
 * Yoti run (`Yoti_back` 6217:65270) and it is clicked rather than arrowed past.
 * /cid/biometric/'s "I agree" was re-pointed from /cid/country/ to
 * /cid/liveness/ in the same change, which hop 7 now asserts.
 *
 * EXTENDED AGAIN 2026-09-23 (Tier 1) with the three screens at the FRONT of
 * the wizard and with the state model:
 *   /services/driver-vehicle/summary/          NL-04  Summary          25 %
 *   /services/driver-vehicle/terms/            NL-05  Terms            50 %
 *   /services/driver-vehicle/confirm-details/  NL-06  Required         75 %
 *
 * "Onboard" was re-pointed from the method step to NL-04 in the same change
 * (brief §5), so hop 3 asserts the NEW destination; if it ever reads
 * /onboard/ again, the first two steps of the wizard have been skipped.
 *
 * FOUR THINGS HERE ARE NOT NAVIGATION ASSERTIONS, and each exists because the
 * failure it catches is invisible to every other gate:
 *
 *   3b  The terms checkbox rule (§7.4). "I Consent" with the box unticked must
 *       show the red message AND NOT NAVIGATE. A validation message that
 *       appears while the page changes underneath it is the same defect class
 *       as a control that does nothing.
 *   D1  The NL-21 auto-advance FIRES on the way forward, 3 s after the IDV
 *       result, with the "Identity verification complete" toast.
 *   D2  The NL-21 auto-advance DOES NOT FIRE on the way back. This is the
 *       regression that got the original 2.6 s timer deleted on 2026-09-22 —
 *       step 7's Back pointed at that screen and the timer bounced straight
 *       back, i.e. a control that looks right and does nothing. D2 waits
 *       LONGER than the 3 s advance on purpose; a shorter wait would pass
 *       against the very bug it exists to catch.
 *   D3/D4  The store survives a reload, and the header's Log Out KEEPS
 *       onboarding progress (§7.1, Q-17 settled in the brief's favour). The
 *       old build cleared it on Log Out and carried Trusted in a `?verified=1`
 *       query param, so neither property held.
 *
 * Needs the static build served first (WITHOUT `serve -s`, which rewrites
 * every route to index.html and would make every assertion below pass while
 * testing only the login page):  npm run build && npm run serve
 * Then:                          npm run clicks
 */
import { chromium } from 'playwright';

const b = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_PATH ??
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const BASE = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:4173';
const fails = [];

async function run(width) {
  const ctx = await b.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();

  /*
   * Console capture, for D6 only.
   *
   * `npm run responsive` already asserts a clean console on every route — but
   * it does so with an EMPTY localStorage, because it opens a fresh context per
   * route. The hydration bug this project has already hit once needs the
   * opposite: a store with something in it, so the server-rendered HTML and the
   * first client render can disagree. Nothing else in either gate reaches that
   * state, so it is asserted here, where a full journey has filled the store.
   */
  const consoleErrors = [];
  p.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') consoleErrors.push(m.text());
  });
  p.on('pageerror', (e) => consoleErrors.push(`pageerror: ${e.message}`));

  const step = async (label, action, expect) => {
    await action(p);
    await p.waitForTimeout(400);
    const u = new URL(p.url()).pathname;
    if (!u.startsWith(expect)) fails.push(`@${width} ${label}: expected ${expect} got ${u}`);
  };
  /*
   * An on-screen control, matched on its full accessible name.
   *
   * Links and buttons both, because the flow genuinely uses both: most steps
   * navigate with a Link, but /cid/verified/'s "Continue to Driver and Vehicle
   * service" is a <button> — it has to set the demo's `verified` flag before
   * routing, so it cannot be a bare anchor. Asserting only `role=link` here
   * silently skipped it, which is exactly the class of gap this gate exists to
   * close.
   */
  const click = (name) => async (pg) => {
    const link = pg.getByRole('link', { name, exact: true }).first();
    if (await link.count()) return link.click();
    return pg.getByRole('button', { name, exact: true }).first().click();
  };
  /** The presenter's arrow-key nav (DemoNav, driven by src/lib/flow.ts). */
  const arrow = (key) => (pg) => pg.keyboard.press(key);

  /** Assert the CURRENT path, without performing an action first. */
  const at = (label, expect) => {
    const u = new URL(p.url()).pathname;
    if (!u.startsWith(expect)) fails.push(`@${width} ${label}: expected ${expect} got ${u}`);
  };
  /** Assert a string is visible on the page right now. */
  const sees = async (label, text) => {
    if (!(await p.getByText(text, { exact: false }).count())) {
      fails.push(`@${width} ${label}: expected to see "${text}"`);
    }
  };

  /* ===================== FORWARD — every on-screen control ================ */
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await step('1  Log in', click('Log in'), '/dashboard');
  await step(
    '2  Driver and Vehicle card',
    (pg) => pg.getByRole('link', { name: /Driver and Vehicle/ }).first().click(),
    '/services/driver-vehicle',
  );
  /*
   * RE-POINTED 2026-09-23. "Onboard" now opens NL-04 Summary, not the method
   * step — brief §5 and §8.1 NL-03 ("'Onboard' -> NL-04"). It went straight to
   * the method step only because NL-04..NL-06 did not exist.
   */
  await step('3  Onboard -> summary', click('Onboard'), '/services/driver-vehicle/summary');
  await step('3a Summary -> terms', click('Continue'), '/services/driver-vehicle/terms');

  /*
   * 3b — THE CHECKBOX RULE, NEGATIVE CASE (§7.4). Click "I Consent" with the
   * box UNTICKED: the red message must appear and the page must NOT change.
   * Both halves are asserted; either one alone would pass against a real bug.
   */
  await p.getByRole('button', { name: 'I Consent', exact: true }).first().click();
  await p.waitForTimeout(400);
  at('3b terms: I Consent with the box unticked must not navigate', '/services/driver-vehicle/terms');
  await sees('3b terms: validation message', 'To continue, you must agree to the terms and conditions.');

  /* 3c — the positive case. Tick, then consent. */
  await step(
    '3c Terms -> confirm details (ticked)',
    async (pg) => {
      await pg.getByLabel('I have read and accept terms and condition').check();
      await pg.getByRole('button', { name: 'I Consent', exact: true }).first().click();
    },
    '/services/driver-vehicle/confirm-details',
  );
  await step('3d Confirm details -> method step', click('Continue'), '/services/driver-vehicle/onboard');
  /*
   * THE MOBILE HAND-OFF (Figma 6217:62059 `CID_Redirect to mobile`), inserted
   * 2026-09-22 between the prerequisite-check wizard and Terms of use, where
   * Row B's x-order puts it.
   *
   * It is a 1440 DESKTOP frame with exactly ONE control — "Continue on my
   * computer". No Back, no Cancel, no second-device path: the QR is an image,
   * there is no scanning and no camera anywhere in this demo. So if that single
   * link is dead the whole journey stops dead at step 4, which is precisely the
   * failure this gate exists to catch. Asserted at all three widths because the
   * link is centred in a shrink-to-fit box that reflows.
   */
  await step('4  Onboard -> mobile hand-off', click('Continue'), '/cid/continue-on-mobile');
  await step(
    '5  Mobile hand-off -> terms',
    click('Continue on my computer'),
    '/cid/terms',
  );
  await step('6  Terms -> consent', click('I agree'), '/cid/biometric');
  /*
   * THE ID-DOCUMENT STEP — now FIVE screens, not three (Figma 6217:66054 /
   * 6087:31396 / 6217:66055 / 6056:19118 / 6057:20924).
   *
   * NONE of them has a Back button: `btn-back` is hidden="true" on 6217:66054,
   * 6087:31396 and 6217:66055, and the two capture frames have no such layer at
   * all. So Continue is the ONLY control on each, and if any one of them is
   * dead the flow stops with nowhere to go but the browser chrome. Every one of
   * those Continues is a `Yoti ContinueButton` instance — provider-owned in
   * production, GNL chrome around it. See design/verification-frame-map.md §7.
   *
   * Five consecutive screens whose only control carries the same accessible
   * name is exactly the shape in which a mis-wired link hides, so each hop is
   * asserted separately rather than looped.
   *
   * SINCE 2026-09-23 IT IS SEVEN, not five: /cid/liveness/ and
   * /cid/liveness-capture/ sit in front of them and their Continues are the
   * same `Yoti ContinueButton` with the same accessible name. Seven identical
   * labels in a row — all the more reason every hop stays separate.
   */
  /*
   * THE LIVENESS CHECK — step 3 of 5 (Figma 6217:65268 / 6217:65271), added
   * 2026-09-23 between biometric consent and the country picker.
   *
   * These two closed the hole that made the pill run 1 → 2 → 4 → … on stage,
   * and they are where the consent taken on the previous screen is actually
   * exercised. Consent's "I agree" was RE-POINTED here from /cid/country/, so
   * hop 7 below is asserting the new destination, not the old one — if it ever
   * reads /cid/country/ again the liveness step has been silently skipped.
   */
  await step('7  Consent -> liveness prepare', click('I agree'), '/cid/liveness');
  await step('8  Liveness prepare -> liveness capture', click('Continue'), '/cid/liveness-capture');
  await step('9  Liveness capture -> country / document type', click('Continue'), '/cid/country');
  await step('10 Country -> accepted documents', click('Continue'), '/cid/document');
  await step('11 Documents -> capture instructions', click('Continue'), '/cid/capture-intro');
  await step('12 Capture instructions -> capture front', click('Continue'), '/cid/capture-front');
  await step('13 Capture front -> capture back', click('Continue'), '/cid/capture-back');
  await step('14 Capture back -> verified', click('Continue'), '/cid/verified');
  await step(
    '15 CID verified -> provider status',
    click('Continue to Driver and Vehicle service'),
    '/auth/loading',
  );
  /*
   * 6217:80871 HAS NO BUTTONS IN FIGMA — its closing line is "You can close
   * this window." — and none is invented here. ArrowRight is the forward move
   * on this one screen, and the 2.6s auto-advance that used to stand in for a
   * button was removed on 2026-09-22 so that step 7's Back could point back
   * here without bouncing. Asserted rather than assumed, because it is now
   * the single point where the forward chain depends on DemoNav.
   */
  await step('16 Provider status -> prerequisite (ArrowRight)', arrow('ArrowRight'), '/services/driver-vehicle/prerequisite');
  await step('17 Prerequisite -> confirmation', click('Continue'), '/services/driver-vehicle/confirmation');
  await step(
    '18 Confirmation -> verified service',
    click('Go to Service Driver’s License Renewal'),
    '/services/driver-vehicle',
  );
  {
    const q = new URL(p.url()).search;
    if (q !== '?verified=1') fails.push(`@${width} 18 confirmation CTA: expected ?verified=1 got "${q}"`);
  }

  /* ===================== BACKWARD — every reverse path ==================== */
  /*
   * The verified service page is the end of the chain and has no control that
   * returns to the confirmation screen — the design draws none. Its only
   * backward control is the breadcrumb, which goes to the dashboard, so that
   * is asserted on its own and the reverse chain proper starts one step back.
   *
   * (ArrowLeft is not the reverse move here either: DemoNav resolves a route
   * by pathname, and "/services/driver-vehicle/" appears in FLOW twice — at
   * index 2 and again as the ?verified=1 tail — so findIndex matches the
   * first. ArrowLeft from the end state therefore goes to /dashboard/. That
   * is a known DemoNav limitation, recorded here rather than worked around.)
   */
  await step('B1 Verified service -> dashboard (breadcrumb)', click('← Back to Services'), '/dashboard');

  await p.goto(BASE + '/services/driver-vehicle/confirmation/', { waitUntil: 'networkidle' });
  await step('B2 Confirmation -> prerequisite (Back)', click('Back'), '/services/driver-vehicle/prerequisite');
  await step('B3 Prerequisite -> provider status (Back)', click('Back'), '/auth/loading');
  // No control on 6217:80871, forward or back. ArrowLeft is the reverse move.
  await step('B4 Provider status -> CID verified (ArrowLeft)', arrow('ArrowLeft'), '/cid/verified');
  /*
   * The FIVE ID-document screens and CID_ID_success carry no Back control, so
   * ArrowLeft is the reverse move across the whole run. Walking every hop of it
   * matters more than it looks: FLOW is the only thing that orders these
   * screens, and a route inserted in the wrong slot there produces a forward
   * chain that still passes while the reverse chain silently skips a screen.
   */
  await step('B5 CID verified -> capture back (ArrowLeft)', arrow('ArrowLeft'), '/cid/capture-back');
  await step('B6 Capture back -> capture front (ArrowLeft)', arrow('ArrowLeft'), '/cid/capture-front');
  await step('B7 Capture front -> capture instructions (ArrowLeft)', arrow('ArrowLeft'), '/cid/capture-intro');
  await step('B8 Capture instructions -> documents (ArrowLeft)', arrow('ArrowLeft'), '/cid/document');
  await step('B9 Documents -> country (ArrowLeft)', arrow('ArrowLeft'), '/cid/country');
  /*
   * THE LIVENESS CHECK, BACKWARDS. The two screens differ here and the
   * difference is the design's, so they are asserted differently:
   *
   *   B10  /cid/country/ has no Back at all, so ArrowLeft is the only reverse
   *        move into the liveness capture screen.
   *   B11  /cid/liveness-capture/ has a REAL, VISIBLE `Yoti_back` (6217:65270)
   *        — the ONLY visible Back anywhere in the Yoti run. It is clicked
   *        rather than arrowed past, because a dead Back that ArrowLeft papers
   *        over is exactly the failure this gate exists to catch, and because
   *        it is the one on-screen control that reaches /cid/liveness/.
   *   B12  /cid/liveness/ has no Back, so ArrowLeft again.
   */
  await step('B10 Country -> liveness capture (ArrowLeft)', arrow('ArrowLeft'), '/cid/liveness-capture');
  await step('B11 Liveness capture -> liveness prepare (Back)', click('Back'), '/cid/liveness');
  await step('B12 Liveness prepare -> consent (ArrowLeft)', arrow('ArrowLeft'), '/cid/biometric');
  // Terms and Biometric DO have a reverse control: "I do not agree".
  await step('B13 Consent -> terms (I do not agree)', click('I do not agree'), '/cid/terms');
  /*
   * "I do not agree" is DECLINE / EXIT THE JOURNEY, not "go back one screen" —
   * design/verification-frame-map.md §1 records it that way for both CID_TU and
   * CID_Biometric. So it still leaves for the onboarding wizard and does NOT
   * detour through the mobile hand-off, even though that screen now sits
   * between the two. The hand-off's own reverse path is asserted at B13.
   */
  await step('B14 Terms -> onboard (I do not agree)', click('I do not agree'), '/services/driver-vehicle/onboard');

  /*
   * The mobile hand-off has no Back control of any kind — its only layer
   * besides the content is a hidden `Banner` — so ArrowLeft is its reverse
   * move, and because the decline path above bypasses the screen entirely this
   * is the ONLY place the reverse chain touches it. Asserted on its own rather
   * than folded into the run above.
   */
  await p.goto(BASE + '/cid/continue-on-mobile/', { waitUntil: 'networkidle' });
  await step('B15 Mobile hand-off -> onboard (ArrowLeft)', arrow('ArrowLeft'), '/services/driver-vehicle/onboard');
  /*
   * B16 — RE-POINTED 2026-09-23. The method step's Back used to go to the
   * service page, which was correct only while there was nothing between them.
   * §7.4 is "Back -> previous page", and the previous page is now NL-06. The
   * reverse chain therefore walks the whole wizard back rather than dumping
   * the presenter out of it in one hop.
   */
  await step('B16 Method step -> confirm details (Back)', click('Back'), '/services/driver-vehicle/confirm-details');
  await step('B17 Confirm details -> terms (Back)', click('Back'), '/services/driver-vehicle/terms');
  await step('B18 Terms -> summary (Back)', click('Back'), '/services/driver-vehicle/summary');
  await step('B19 Summary -> service (Cancel)', click('Cancel'), '/services/driver-vehicle');

  /* ===================== Remaining controls ============================== */
  await p.goto(BASE + '/services/driver-vehicle/onboard/', { waitUntil: 'networkidle' });
  await step('C1 Onboard Cancel', click('Cancel'), '/services/driver-vehicle');
  await p.goto(BASE + '/services/driver-vehicle/prerequisite/', { waitUntil: 'networkidle' });
  await step('C2 Prerequisite Cancel', click('Cancel'), '/services/driver-vehicle');
  await p.goto(BASE + '/cid/verified/', { waitUntil: 'networkidle' });
  await step('C3 CID verified Log out', click('Log out'), '/');
  await p.goto(BASE + '/dashboard/', { waitUntil: 'networkidle' });
  await step('C4 Log Out', click('Log Out'), '/');
  await p.goto(BASE + '/dashboard/', { waitUntil: 'networkidle' });
  await step('C5 Nav Services', click('Services'), '/dashboard');
  await p.goto(BASE + '/services/driver-vehicle/terms/', { waitUntil: 'networkidle' });
  await step('C6 Terms Cancel', click('Cancel'), '/services/driver-vehicle');
  await p.goto(BASE + '/services/driver-vehicle/terms/', { waitUntil: 'networkidle' });
  // §7.4: "'I Do Not Consent' -> service page." A decline, not a step back.
  await step('C7 Terms I Do Not Consent', click('I Do Not Consent'), '/services/driver-vehicle');
  await p.goto(BASE + '/services/driver-vehicle/confirm-details/', { waitUntil: 'networkidle' });
  await step('C8 Confirm details Cancel', click('Cancel'), '/services/driver-vehicle');
  /*
   * THE 404 (§7.6). `/nope/` is an unknown path; the static export serves
   * out/404.html for it. The one control on it must reach the dashboard, or
   * the page a shared link lands a stranger on is itself a dead end.
   */
  await p.goto(BASE + '/nope/', { waitUntil: 'networkidle' });
  await sees('C9 404 heading', 'We can');
  await step('C9 404 -> dashboard', click('← Back to Services'), '/dashboard');

  /* ============ STATE — §7.1, §7.5, §8.3, §12.2 ========================= */
  /*
   * D1 — THE NL-21 AUTO-ADVANCE FIRES ON THE WAY FORWARD.
   *
   * /cid/verified/'s Continue arms a ONE-SHOT flag in `gnl-demo:v1`; the
   * provider-status screen consumes it on mount and moves on after
   * `processingMinMs` (3000). The wait below is deliberately longer.
   */
  await p.goto(BASE + '/cid/verified/', { waitUntil: 'networkidle' });
  await step('D1a CID verified -> provider status', click('Continue to Driver and Vehicle service'), '/auth/loading');
  await p.waitForTimeout(4200);
  at('D1b Provider status auto-advances to the Confirmed screen', '/services/driver-vehicle/prerequisite');
  // §8.3 / §10.6: the advance carries a toast, raised before the navigation so
  // it is already on screen when the Confirmed page paints.
  await sees('D1c completion toast', 'Identity verification complete');

  /*
   * D2 — AND IT DOES NOT FIRE ON THE WAY BACK. The regression that deleted the
   * original timer. The flag was spent by D1, so arriving here from step 7's
   * Back must leave the screen alone; the wait is longer than the advance.
   */
  await p.goto(BASE + '/services/driver-vehicle/prerequisite/', { waitUntil: 'networkidle' });
  await step('D2a Confirmed -> provider status (Back)', click('Back'), '/auth/loading');
  await p.waitForTimeout(4200);
  at('D2b Provider status must STAY PUT when reached by Back', '/auth/loading');

  /*
   * D3 — THE STORE SURVIVES A RELOAD, WITH NO QUERY STRING.
   *
   * §12.2: "Confirmation required" until `onboarded`, then "Trusted". The old
   * build carried this in `sessionStorage` plus a `?verified=1` param, so it
   * survived neither a browser restart nor a clean URL.
   *
   * THE JOURNEY IS FINISHED HERE RATHER THAN RELIED ON FROM THE FORWARD CHAIN.
   * C3 above clicks the CertifiO ID session's own "Log out", which DOES clear
   * the store — that control abandons the verification, and it is deliberately
   * not the same thing as the header's Log Out (§7.1). So at this point the
   * service is `verified`, not `onboarded`, and the badge should still read
   * "Confirmation required". Opening the Ready-to-Use screen is what promotes
   * it (§8.3 NL-23, "On open, mark the service onboarded").
   */
  await p.goto(BASE + '/services/driver-vehicle/prerequisite/', { waitUntil: 'networkidle' });
  await step('D3a Confirmed -> Ready to Use', click('Continue'), '/services/driver-vehicle/confirmation');
  await p.goto(BASE + '/services/driver-vehicle/', { waitUntil: 'networkidle' });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  {
    const trusted = await p.evaluate(
      () => document.querySelector('.gnl-desktop-shell')?.getAttribute('data-verified'),
    );
    if (trusted !== '1') {
      fails.push(`@${width} D3 service page after reload: expected the Trusted state, got data-verified="${trusted}"`);
    }
  }
  await sees('D3 Trusted badge', 'Trusted');

  /*
   * D4 — LOG OUT KEEPS ONBOARDING PROGRESS (§7.1, Q-17).
   *
   * The build used to call reset() from the header's Log Out, which is the
   * opposite of what §7.1 says. Only /reset and the presenter's Escape clear
   * the store now, so logging out and back in must leave the service Trusted.
   */
  await step('D4a Log Out', click('Log Out'), '/');
  await p.goto(BASE + '/services/driver-vehicle/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  {
    const trusted = await p.evaluate(
      () => document.querySelector('.gnl-desktop-shell')?.getAttribute('data-verified'),
    );
    if (trusted !== '1') {
      fails.push(`@${width} D4 after Log Out: progress was cleared (data-verified="${trusted}") — §7.1 says Log Out KEEPS it`);
    }
  }

  /*
   * D5 — /reset IS THE THING THAT CLEARS IT (§6, §7.5). It empties the store
   * and returns to the login page; the service page must then be back to
   * "Confirmation required".
   */
  await p.goto(BASE + '/reset/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  at('D5a /reset returns to the login page', '/');
  await p.goto(BASE + '/services/driver-vehicle/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  {
    const trusted = await p.evaluate(
      () => document.querySelector('.gnl-desktop-shell')?.getAttribute('data-verified'),
    );
    if (trusted === '1') {
      fails.push(`@${width} D5 after /reset: the store was not cleared — service page is still Trusted`);
    }
  }

  /*
   * D6 — HYDRATION WITH A POPULATED STORE.
   *
   * src/app/layout.tsx deliberately carries NO `suppressHydrationWarning`, and
   * says so: a genuine mismatch anywhere in the tree is meant to surface. The
   * `gnl-demo:v1` store is the one thing in this app that could produce one,
   * because every page is prerendered at build time with an EMPTY store and
   * then hydrated in a browser that may have a full one.
   *
   * So: seed a complete, finished journey, then hard-load every route that
   * reads the store and assert React logged nothing. A mismatch shows up as a
   * console error ("Hydration failed…" / "server rendered HTML didn't match"),
   * which is what the listener above is collecting.
   *
   * `addInitScript` puts the value in place BEFORE any page script runs, which
   * is what makes this a real first-paint test rather than a post-hoc one.
   */
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem(
        'gnl-demo:v1',
        JSON.stringify({
          v: 1,
          services: {
            'driver-vehicle': {
              status: 'onboarded',
              step: 'ready',
              method: 'gnl_idv',
              termsAcceptedAt: '2026-09-23T10:00:00.000Z',
              verifiedAt: '2026-09-23T10:05:00.000Z',
            },
          },
        }),
      );
    } catch {
      /* ignore */
    }
  });

  consoleErrors.length = 0;
  for (const r of [
    '/services/driver-vehicle/',
    '/services/driver-vehicle/summary/',
    '/services/driver-vehicle/terms/',
    '/services/driver-vehicle/confirm-details/',
    '/services/driver-vehicle/onboard/',
    '/services/driver-vehicle/prerequisite/',
    '/services/driver-vehicle/confirmation/',
    '/auth/loading/',
    '/cid/verified/',
    '/dashboard/',
  ]) {
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    await p.waitForTimeout(350);
  }
  {
    const real = consoleErrors.filter(
      (t) => !/favicon|Download the React DevTools/i.test(t),
    );
    if (real.length) {
      fails.push(`@${width} D6 hydration/console with a populated store: ${real.join(' ;; ')}`);
    }
  }
  // And the seeded store must actually be read: the service page is Trusted.
  await p.goto(BASE + '/services/driver-vehicle/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  {
    const trusted = await p.evaluate(
      () => document.querySelector('.gnl-desktop-shell')?.getAttribute('data-verified'),
    );
    if (trusted !== '1') {
      fails.push(`@${width} D6 seeded store was not read back (data-verified="${trusted}")`);
    }
  }

  await ctx.close();
}

/*
 * ======================================================================
 * FLOW B's CertifiO ID run — added 2026-09-23.
 *
 * The same ten screen components, prerendered for `studentaid` under
 * /cid/studentaid/ by src/app/cid/[serviceId]/. They have NO Figma baseline in
 * design/frames.json, so `npm run diff` cannot see them at all; this and
 * `npm run responsive` are the only mechanical checks they have, which is
 * exactly why the chain is walked control by control rather than sampled.
 *
 * FIVE THINGS ARE ASSERTED THAT FLOW A CANNOT ASSERT:
 *
 *   F0  THE SERVICE IS IN THE SERVER-RENDERED HTML. The wizard title must read
 *       "StudentAidNL" in the raw markup, before any script runs. That is the
 *       whole point of prerendering the variant instead of reading a store on
 *       mount: if this ever fails, the seam has been re-cut the flashing way.
 *   F8  CONTINUE ON THE CAPTURE SCREEN SKIPS THE BACK CAPTURE. §9:
 *       "**no back capture**" for PP-09..PP-19, i.e. `captureSides: ['front']`.
 *       If this hop ever lands on a back-capture screen, `captureSides` has
 *       stopped driving the link and Flow B has grown a screen the brief says
 *       it does not have.
 *   F9  /cid/studentaid/capture-back/ DOES NOT EXIST. The route is not
 *       generated (`cidBackCaptureParams`), so the static export serves the GNL
 *       404 for it. Asserted positively, because "nothing links to it" and "it
 *       is not there" are different claims and only the second one survives a
 *       presenter typing a URL.
 *   FA  THE STEP-5 COPY IS §10.1's, not Flow A's. One bullet is enough to tell
 *       the two lists apart, and it proves `availableServices` reached the
 *       rendered page rather than just the config.
 *   FB  THE TWO RUNS DO NOT LEAK INTO EACH OTHER. Every hop above asserts a
 *       path that starts /cid/studentaid/, so a single link that forgot its
 *       service would land on Flow A's copy of the next screen and fail here.
 *
 * NOT ASSERTED, ON PURPOSE: the decline path. "I do not agree" on Flow B's
 * terms screen points at /services/studentaid/onboard/, which is correct by
 * construction (`serviceRoutes(service.id)`) but is a Flow B desktop screen
 * another pass is building. The HREF is checked instead of the navigation, so
 * this gate tests this pass's work and does not fail on someone else's
 * unfinished route.
 * ======================================================================
 */
async function runFlowBCid(width) {
  const ctx = await b.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();

  const step = async (label, action, expect) => {
    await action(p);
    await p.waitForTimeout(400);
    const u = new URL(p.url()).pathname;
    if (!u.startsWith(expect)) fails.push(`@${width} ${label}: expected ${expect} got ${u}`);
  };
  const click = (name) => async (pg) => {
    const link = pg.getByRole('link', { name, exact: true }).first();
    if (await link.count()) return link.click();
    return pg.getByRole('button', { name, exact: true }).first().click();
  };
  const sees = async (label, text) => {
    if (!(await p.getByText(text, { exact: false }).count())) {
      fails.push(`@${width} ${label}: expected to see "${text}"`);
    }
  };

  /*
   * F0 — the title is in the HTML the SERVER wrote, not in something a hook
   * filled in afterwards. Fetched with `fetch`, not read off the live DOM, so
   * a client-side flip could not make it pass.
   */
  {
    /*
     * Fetched through the CONTEXT's request API rather than `page.evaluate` +
     * `fetch`. The intent is unchanged — this reads what the SERVER wrote, not
     * the live DOM, so a client-side flip still could not make it pass — but at
     * this point the page is `about:blank`, an opaque origin with no base URL,
     * so an in-page `fetch` threw "TypeError: Failed to fetch" and killed the
     * whole gate before it reached a single assertion. `ctx.request` issues the
     * GET from the browser context itself and needs no document, which is what
     * lets F0 stay FIRST — before any navigation could have populated a DOM.
     */
    const html = await ctx.request
      .get(BASE + '/cid/studentaid/terms/')
      .then((r) => r.text());
    if (!html.includes('StudentAidNL')) {
      fails.push(`@${width} F0: "StudentAidNL" is not in the prerendered HTML of /cid/studentaid/terms/`);
    }
    if (html.includes('Driver and Vehicle')) {
      fails.push(`@${width} F0: Flow A's title leaked into /cid/studentaid/terms/`);
    }
  }

  await p.goto(BASE + '/cid/studentaid/continue-on-mobile/', { waitUntil: 'networkidle' });
  await step(
    'F1 B hand-off -> terms',
    click('Continue on my computer'),
    '/cid/studentaid/terms',
  );

  /* The decline destination, checked as an href — see the note above. */
  {
    const href = await p
      .getByRole('link', { name: 'I do not agree', exact: true })
      .first()
      .getAttribute('href');
    if (href !== '/services/studentaid/onboard/') {
      fails.push(`@${width} F1b: decline href is "${href}", expected /services/studentaid/onboard/`);
    }
  }

  await step('F2 B terms -> consent', click('I agree'), '/cid/studentaid/biometric');
  await step('F3 B consent -> liveness prepare', click('I agree'), '/cid/studentaid/liveness');
  await step('F4 B liveness prepare -> liveness capture', click('Continue'), '/cid/studentaid/liveness-capture');
  await step('F5 B liveness capture -> country', click('Continue'), '/cid/studentaid/country');
  await step('F6 B country -> accepted documents', click('Continue'), '/cid/studentaid/document');

  /*
   * PP-15 (6217:66072) is "the same frame with a different row filled" —
   * DEMO_AUDIT.md §8's whole argument for counting eleven of Flow B's rows as
   * zero new screens. `defaultDocument: PASSPORT` is what fills it, and the
   * selected row carries the 2px #27619b inset shadow.
   */
  {
    const selected = await p.evaluate(() =>
      [...document.querySelectorAll('[data-name="RadioRow"]')]
        .filter((el) => el.className.includes('inset_0_0_0_2px'))
        .map((el) => el.textContent.trim()),
    );
    if (selected.length !== 1 || selected[0] !== 'Passport') {
      fails.push(`@${width} F6b: expected exactly one selected row "Passport", got ${JSON.stringify(selected)}`);
    }
  }

  await step('F7 B documents -> capture instructions', click('Continue'), '/cid/studentaid/capture-intro');
  await step('F8 B capture instructions -> capture front', click('Continue'), '/cid/studentaid/capture-front');
  await sees('F8b B capture heading drops "(front)"', 'Capture ID document');
  {
    const heading = await p.evaluate(
      () => document.querySelector('[data-node-id="6088:32304"]')?.textContent,
    );
    if (heading !== 'Capture ID document') {
      fails.push(`@${width} F8c: capture heading is "${heading}", expected "Capture ID document" (§10.1 drops "(front)")`);
    }
  }

  /* THE HOP THAT PROVES `captureSides`. Front capture -> step 5, not -> back. */
  await step('F9 B capture front -> verified (NO back capture)', click('Continue'), '/cid/studentaid/verified');
  await sees('FA B step-5 copy is §10.1’s', 'Apply for student financial assistance');
  await sees('FA B step-5 names the service', 'securely access StudentAidNL services');

  /* The primary CTA names the service, and it still reaches the processing screen. */
  await step(
    'FB B verified -> processing',
    click('Continue to StudentAidNL service'),
    '/auth/loading',
  );

  /*
   * F9b — the back-capture route is NOT GENERATED for this service, so the
   * static export answers with out/404.html. Asserted on the 404 page's own
   * heading rather than on a status code, because `serve` returns 404.html with
   * a 404 and Playwright's `goto` does not throw on it.
   */
  await p.goto(BASE + '/cid/studentaid/capture-back/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  if (!(await p.getByText('We can’t find that page', { exact: false }).count())) {
    fails.push(`@${width} F9b: /cid/studentaid/capture-back/ resolved to a real page; it must not be generated`);
  }

  await ctx.close();
}

for (const w of [1440, 768, 390]) await run(w);
for (const w of [1440, 768, 390]) await runFlowBCid(w);
await b.close();

console.log(
  fails.length
    ? 'CLICK FAILURES:\n' + fails.join('\n')
    : 'click-through: Flow A forward + backward chain and Flow B CID chain intact at 1440 / 768 / 390',
);
if (fails.length) process.exit(1);
