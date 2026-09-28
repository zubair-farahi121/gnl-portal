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
 * EXTENDED AGAIN 2026-09-28 with FLOW B END TO END (`runFlowB`, at the foot of
 * this file): dashboard -> StudentAidNL card -> PP-03 … PP-23 Trusted, every
 * Flow B Back / Cancel, the shared processing screen routing to FLOW B's
 * Confirmed screen, and the two isolation checks — finishing Flow B does not
 * make Flow A Trusted (G-ISO) and finishing Flow A does not make Flow B
 * Trusted (D3b). `runFlowBCid`'s F1b now FOLLOWS the decline link instead of
 * reading its href, because the page it points at exists.
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
  /*
   * Y8, THE UPLOAD SCREEN — inserted 2026-09-27 between the last capture and
   * step 5. design/YOTI_OBSERVED.md "Y8 — Upload (6127:50651)"; there is no
   * Figma frame for it, so this gate and `npm run responsive` are the only
   * mechanical checks it has.
   *
   * IT IS THE ONLY SCREEN IN THE CHAIN WITH NO ON-SCREEN CONTROL — "No button,
   * no help icon, no pinned bar" — so the hop INTO it is a click and the hop
   * OUT of it is not. That makes it the same shape as the /auth/loading/
   * auto-advance (D1 below) and it is asserted the same way: the arrival first,
   * then a wait LONGER than YOTI_SIZE.progressMs (2000), then the destination.
   * A shorter wait would pass against the very bug it exists to catch — a
   * timer that never fires leaves the presenter stranded on a screen with
   * nothing to click.
   */
  await step('14 Capture back -> upload', click('Continue'), '/cid/upload');
  await p.waitForTimeout(2800);
  at('14b Upload advances to CID verified on its own', '/cid/verified');
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
  /*
   * B5 / B5b — THE UPLOAD SCREEN, BACKWARDS. Added 2026-09-27 with Y8.
   *
   * It has no Back control (it has no control at all), so ArrowLeft is the only
   * reverse move both into it and out of it. Note that arriving here backwards
   * re-arms its 2s advance: the presenter who stops on this screen on the way
   * back WILL be carried forward again. That is a known behaviour, logged as an
   * open question in DEMO_AUDIT.md — the real Yoti has no back path into this
   * screen at all, so there is nothing to reproduce and nothing to copy. The
   * two steps below leave it well inside 2s, so this chain is not racing it.
   */
  await step('B5 CID verified -> upload (ArrowLeft)', arrow('ArrowLeft'), '/cid/upload');
  await step('B5b Upload -> capture back (ArrowLeft)', arrow('ArrowLeft'), '/cid/capture-back');
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
   * D3b — FINISHING FLOW A DOES NOT MAKE FLOW B TRUSTED. Added 2026-09-28.
   * The store is keyed per service; this is the mirror of G-ISO in
   * runFlowB below, which asserts the other direction.
   */
  await p.goto(BASE + '/services/studentaid/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  {
    const trusted = await p.evaluate(
      () => document.querySelector('.gnl-desktop-shell')?.getAttribute('data-verified'),
    );
    if (trusted === '1') {
      fails.push(`@${width} D3b: completing Flow A made StudentAidNL Trusted — the store leaked across services`);
    }
  }

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
 * THE DECLINE PATH IS NOW FOLLOWED (F1b). Until 2026-09-28 it was checked as
 * an href only, because /services/studentaid/onboard/ did not exist; Flow B's
 * desktop wizard now does, so the click is made and the landing asserted.
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

  /*
   * F1b — THE DECLINE PATH, NOW FOLLOWED. Changed 2026-09-28.
   *
   * This used to read the HREF instead of clicking, "so this gate tests this
   * pass's work and does not fail on someone else's unfinished route" —
   * /services/studentaid/onboard/ did not exist. It does now (PP-07,
   * src/app/services/[serviceId]/onboard/), so the link is clicked and the
   * landing page is asserted to be FLOW B's method step, not Flow A's and not
   * the 404. Then back to Flow B's Terms of use to carry on the chain.
   */
  await step('F1b B terms -> B method step (I do not agree)', click('I do not agree'), '/services/studentaid/onboard');
  await sees('F1b B method step is StudentAidNL\'s', 'Medical Care Plan (MCP)');
  await p.goto(BASE + '/cid/studentaid/terms/', { waitUntil: 'networkidle' });

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
    /*
     * READ OFF `data-selected`, NOT OFF THE CLASS NAME — changed 2026-09-27.
     *
     * This used to look for the Tailwind class `inset_0_0_0_2px`, which told
     * the two states apart only because the UNSELECTED row had a 1px border.
     * YOTI_OBSERVED.md Y4 measures the real unselected row at "2 px muted
     * blue-grey border", so both are 2px now and that filter would have matched
     * all seven rows — a check that keeps passing while measuring nothing.
     * CidDocumentScreen marks the selected row explicitly instead.
     */
    const selected = await p.evaluate(() =>
      [...document.querySelectorAll('[data-name="RadioRow"][data-selected="true"]')]
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

  /*
   * THE HOP THAT PROVES `captureSides`. Front capture -> the UPLOAD screen,
   * not -> a back capture.
   *
   * RE-POINTED 2026-09-27 with Y8. The assertion is unchanged in substance —
   * if this ever lands on a back-capture screen, `captureSides` has stopped
   * driving the link and Flow B has grown a screen §9 says it does not have —
   * but the destination is now the screen where the two flows rejoin.
   */
  await step('F9 B capture front -> upload (NO back capture)', click('Continue'), '/cid/studentaid/upload');
  /*
   * F9a — AND THE UPLOAD SCREEN NAMES *THIS FLOW'S* DOCUMENT. `yotiUploadCopy`
   * takes the label from `defaultDocument`, so Flow B must say "Passport" here
   * and must not say "Driver's License". This is the only place either string
   * is asserted on a rendered page, and it is what proves the real card type
   * from the photographs was not reproduced.
   */
  await sees('F9a B upload names the passport', 'your Passport');
  await p.waitForTimeout(2800);
  if (!new URL(p.url()).pathname.startsWith('/cid/studentaid/verified')) {
    fails.push(`@${width} F9b: B upload did not advance to step 5 on its own (at ${new URL(p.url()).pathname})`);
  }
  await sees('FA B step-5 copy is §10.1’s', 'Apply for student financial assistance');
  await sees('FA B step-5 names the service', 'securely access StudentAidNL services');

  /* The primary CTA names the service, and it still reaches the processing screen. */
  await step(
    'FB B verified -> processing',
    click('Continue to StudentAidNL service'),
    '/auth/loading',
  );

  /*
   * F9c — the back-capture route is NOT GENERATED for this service, so the
   * static export answers with out/404.html. Asserted on the 404 page's own
   * heading rather than on a status code, because `serve` returns 404.html with
   * a 404 and Playwright's `goto` does not throw on it.
   */
  await p.goto(BASE + '/cid/studentaid/capture-back/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  if (!(await p.getByText('We can’t find that page', { exact: false }).count())) {
    fails.push(`@${width} F9c: /cid/studentaid/capture-back/ resolved to a real page; it must not be generated`);
  }

  await ctx.close();
}

/*
 * ======================================================================
 * FLOW B END TO END — StudentAidNL — added 2026-09-28.
 *
 * The whole §9 chain, from the dashboard card to the Trusted service page,
 * clicked control by control at each width — the Flow B twin of `run` above:
 *
 *   dashboard -> StudentAidNL card -> PP-03 -> Onboard -> PP-04 Summary ->
 *   PP-05 Terms (unticked refuses, ticked consents) -> PP-06 Required ->
 *   PP-07 method (3 cards, GNL IDV selected, MCP inert) -> PP-08 Other
 *   verification -> PP-09 hand-off -> PP-10..PP-19 (no back capture) ->
 *   PP-20 processing AUTO-ADVANCES TO FLOW B's PP-21 -> PP-22 Success ->
 *   "Go to Service StudentAidNL" -> PP-23 Trusted, surviving a reload.
 *
 * FOUR ASSERTIONS HERE EXIST BECAUSE THE FAILURE IS INVISIBLE ELSEWHERE:
 *
 *   G14b  THE SHARED PROCESSING SCREEN ROUTES PER SERVICE. /auth/loading/ is
 *         one page for both flows. Before 2026-09-28 its advance was wired to
 *         `driver-vehicle` only, so Flow B's armed flag was ignored and the
 *         screen sat still. It must now land on /services/studentaid/
 *         prerequisite/ — NOT Flow A's — with the completion toast.
 *   G-ISO FINISHING FLOW B DOES NOT MAKE FLOW A TRUSTED. The store is keyed per
 *         service; Driver and Vehicle's page must still read
 *         "Confirmation required" after StudentAidNL is onboarded, and its
 *         stored record must not be `onboarded`.
 *   GB    EVERY Back / Cancel ON A FLOW B SCREEN LANDS ON A FLOW B SCREEN (or
 *         on the one SHARED processing screen, which is where PP-21's Back
 *         points by design). A Flow B control that forgot its service would
 *         land on /services/driver-vehicle/… and fail here.
 *   GH    HYDRATION WITH A POPULATED FLOW B STORE — `run`'s D6 for the eight
 *         new routes.
 * ======================================================================
 */
async function runFlowB(width) {
  const ctx = await b.newContext({ viewport: { width, height: 900 } });
  const p = await ctx.newPage();
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
  const click = (name) => async (pg) => {
    const link = pg.getByRole('link', { name, exact: true }).first();
    if (await link.count()) return link.click();
    return pg.getByRole('button', { name, exact: true }).first().click();
  };
  const arrow = (key) => (pg) => pg.keyboard.press(key);
  const at = (label, expect) => {
    const u = new URL(p.url()).pathname;
    if (!u.startsWith(expect)) fails.push(`@${width} ${label}: expected ${expect} got ${u}`);
  };
  const sees = async (label, text) => {
    if (!(await p.getByText(text, { exact: false }).count())) {
      fails.push(`@${width} ${label}: expected to see "${text}"`);
    }
  };
  const verifiedAttr = () =>
    p.evaluate(() => document.querySelector('.gnl-desktop-shell')?.getAttribute('data-verified'));

  /* ===================== FORWARD ======================================== */
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await step('G1  Log in', click('Log in'), '/dashboard');
  /* PP-02: the whole card is the link, like Driver and Vehicle's. */
  await step(
    'G2  StudentAidNL card -> PP-03',
    (pg) => pg.getByRole('link', { name: /StudentAidNL/ }).first().click(),
    '/services/studentaid',
  );
  if ((await verifiedAttr()) !== '0') fails.push(`@${width} G2b: PP-03 should open unverified`);
  await sees('G2c PP-03 badge', 'Confirmation required');
  await sees('G2d PP-03 subtitle is §10.1\'s', 'View and manage your StudentAidNL services');
  await sees('G2e PP-03 locked portal row', 'Action locked');
  await sees('G2f PP-03 contact block', 'P.O. Box 8700');

  await step('G3  Onboard -> PP-04 summary', click('Onboard'), '/services/studentaid/summary');
  await sees('G3b PP-04 heading', 'Welcome to StudentAidNL');
  await step('G4  Summary -> PP-05 terms', click('Continue'), '/services/studentaid/terms');
  await sees('G4b PP-05 version', 'Version 7');
  await sees('G4c PP-05 date', 'Last modified: 2026-08-26');
  await sees('G4d PP-05 consent is Flow B\'s paragraph', 'I hereby consent to the Government of Newfoundland and Labrador');
  await sees('G4e PP-05 has the seven scopes', 'View when your phone number has been verified');

  /* The §7.4 checkbox rule, negative then positive — as 3b / 3c in `run`. */
  await p.getByRole('button', { name: 'I Consent', exact: true }).first().click();
  await p.waitForTimeout(400);
  at('G5  PP-05 I Consent unticked must not navigate', '/services/studentaid/terms');
  await sees('G5b PP-05 validation message', 'To continue, you must agree to the terms and conditions.');
  await step(
    'G6  Terms -> PP-06 confirm details (ticked)',
    async (pg) => {
      await pg.getByLabel('I have read and accept terms and condition').check();
      await pg.getByRole('button', { name: 'I Consent', exact: true }).first().click();
    },
    '/services/studentaid/confirm-details',
  );
  await sees('G6b PP-06 requirement', 'Must have a valid driver license, health card');
  await sees('G6c PP-06 status', 'Required');

  await step('G7  PP-06 -> PP-07 method step', click('Continue'), '/services/studentaid/onboard');
  /*
   * G7b — THREE cards from `config.methods`, in order, GNL IDV the only
   * selected one. Read off the radio image each card draws.
   */
  {
    const cards = await p.evaluate(() =>
      [...document.querySelectorAll('[data-node-id="6217:30593"] > *')].map((el) => ({
        title: el.querySelector('p')?.textContent?.trim(),
        selected: !!el.querySelector('img[src*="radio-selected"]'),
        link: el.tagName === 'A',
      })),
    );
    const titles = cards.map((c) => c.title);
    const want = ['Medical Care Plan (MCP)', 'Motor Registration Division (MRD)', 'GNL Identity Verification Service'];
    if (JSON.stringify(titles) !== JSON.stringify(want)) {
      fails.push(`@${width} G7b: PP-07 cards are ${JSON.stringify(titles)}, expected ${JSON.stringify(want)}`);
    }
    const sel = cards.filter((c) => c.selected).map((c) => c.title);
    if (sel.length !== 1 || sel[0] !== 'GNL Identity Verification Service') {
      fails.push(`@${width} G7c: PP-07 selected card(s) ${JSON.stringify(sel)}, expected GNL IDV only`);
    }
    const links = cards.filter((c) => c.link).map((c) => c.title);
    if (links.length !== 1 || links[0] !== 'GNL Identity Verification Service') {
      fails.push(`@${width} G7d: PP-07 navigable card(s) ${JSON.stringify(links)}, expected GNL IDV only`);
    }
  }
  /* G7e — MCP is not in the demo: it must show the toast and stay put. */
  await p.locator('[data-node-id="6217:30594"]').click();
  await p.waitForTimeout(400);
  at('G7e PP-07 MCP card must not navigate', '/services/studentaid/onboard');
  await sees('G7f PP-07 MCP card shows the toast', 'Not part of this demo');

  await step('G8  PP-07 -> PP-08 other verification', click('Continue'), '/services/studentaid/other-verification');
  await sees('G8b PP-08 option', 'This option is for users who do not have a valid MCP number or MRD-issued ID.');
  if (await p.getByRole('link', { name: 'Cancel', exact: true }).count()) {
    fails.push(`@${width} G8c: PP-08 draws a Cancel — Figma hides it (6217:35241)`);
  }
  await step('G9  PP-08 -> PP-09 hand-off', click('Continue'), '/cid/studentaid/continue-on-mobile');
  await step('G10 hand-off -> terms', click('Continue on my computer'), '/cid/studentaid/terms');
  await step('G11 terms -> consent', click('I agree'), '/cid/studentaid/biometric');
  await step('G11b consent -> liveness', click('I agree'), '/cid/studentaid/liveness');
  await step('G11c liveness -> liveness capture', click('Continue'), '/cid/studentaid/liveness-capture');
  await step('G11d liveness capture -> country', click('Continue'), '/cid/studentaid/country');
  await step('G11e country -> documents', click('Continue'), '/cid/studentaid/document');
  await step('G11f documents -> capture instructions', click('Continue'), '/cid/studentaid/capture-intro');
  await step('G11g instructions -> capture front', click('Continue'), '/cid/studentaid/capture-front');
  await step('G12 capture front -> upload (no back capture)', click('Continue'), '/cid/studentaid/upload');
  await p.waitForTimeout(2800);
  at('G12b upload advances to step 5', '/cid/studentaid/verified');
  await step('G13 step 5 -> processing', click('Continue to StudentAidNL service'), '/auth/loading');

  /* G14 — THE TRAP. The shared screen must advance, and to FLOW B's PP-21. */
  await p.waitForTimeout(4200);
  at('G14b processing auto-advances to FLOW B\'s Confirmed screen', '/services/studentaid/prerequisite');
  await sees('G14c completion toast', 'Identity verification complete');
  await sees('G14d PP-21 requirement', 'or have neither because out of province.');
  await sees('G14e PP-21 status', 'Confirmed');

  await step('G15 PP-21 -> PP-22 success', click('Continue'), '/services/studentaid/confirmation');
  await step('G16 PP-22 -> PP-23 Trusted', click('Go to Service StudentAidNL'), '/services/studentaid');
  {
    const q = new URL(p.url()).search;
    if (q !== '?verified=1') fails.push(`@${width} G16b: expected ?verified=1 got "${q}"`);
  }

  /* G17 — Trusted SURVIVES A RELOAD with no query string: it is in the store. */
  await p.goto(BASE + '/services/studentaid/', { waitUntil: 'networkidle' });
  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  if ((await verifiedAttr()) !== '1') fails.push(`@${width} G17: StudentAidNL is not Trusted after a reload`);
  await sees('G17b Trusted badge', 'Trusted');
  if (await p.getByText('Action locked', { exact: true }).count()) {
    fails.push(`@${width} G17c: the Trusted page still shows "Action locked"`);
  }
  /* G17d — the unlocked portal row is external to the demo -> toast. */
  await p.getByRole('button', { name: 'Access the StudentAid Portal' }).click();
  await p.waitForTimeout(400);
  at('G17d unlocked portal row must not navigate', '/services/studentaid');
  await sees('G17e unlocked portal row shows the toast', 'Not part of this demo');

  /* G-ISO — and Driver and Vehicle is NOT Trusted. Both the page and the store. */
  await p.goto(BASE + '/services/driver-vehicle/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  if ((await verifiedAttr()) === '1') {
    fails.push(`@${width} G-ISO: completing Flow B made Driver and Vehicle Trusted`);
  }
  {
    const dv = await p.evaluate(() => {
      try {
        return JSON.parse(localStorage.getItem('gnl-demo:v1') || '{}').services?.['driver-vehicle']?.status ?? null;
      } catch {
        return 'unreadable';
      }
    });
    if (dv === 'onboarded') fails.push(`@${width} G-ISO b: driver-vehicle is "onboarded" in the store after Flow B`);
  }

  /* ===================== BACKWARD — every Flow B reverse control ========= */
  await p.goto(BASE + '/services/studentaid/', { waitUntil: 'networkidle' });
  await step('GB1 PP-23 -> dashboard (breadcrumb)', click('← Back to Services'), '/dashboard');
  await p.goto(BASE + '/services/studentaid/confirmation/', { waitUntil: 'networkidle' });
  await step('GB2 PP-22 -> PP-21 (Back)', click('Back'), '/services/studentaid/prerequisite');
  await step('GB3 PP-21 -> processing (Back)', click('Back'), '/auth/loading');
  /* The flag was spent at G14: arriving by Back must NOT bounce forward. */
  await p.waitForTimeout(4200);
  at('GB3b processing must STAY PUT when reached by Back', '/auth/loading');

  await p.goto(BASE + '/services/studentaid/other-verification/', { waitUntil: 'networkidle' });
  await step('GB4 PP-08 -> PP-07 (Back)', click('Back'), '/services/studentaid/onboard');
  await step('GB5 PP-07 -> PP-06 (Back)', click('Back'), '/services/studentaid/confirm-details');
  await step('GB6 PP-06 -> PP-05 (Back)', click('Back'), '/services/studentaid/terms');
  await step('GB7 PP-05 -> PP-04 (Back)', click('Back'), '/services/studentaid/summary');
  await step('GB8 PP-04 -> PP-03 (Cancel)', click('Cancel'), '/services/studentaid');

  for (const [label, route, control] of [
    ['GB9  PP-07 Cancel', '/services/studentaid/onboard/', 'Cancel'],
    ['GB10 PP-05 Cancel', '/services/studentaid/terms/', 'Cancel'],
    ['GB11 PP-05 I Do Not Consent', '/services/studentaid/terms/', 'I Do Not Consent'],
    ['GB12 PP-06 Cancel', '/services/studentaid/confirm-details/', 'Cancel'],
    ['GB13 PP-21 Cancel', '/services/studentaid/prerequisite/', 'Cancel'],
  ]) {
    await p.goto(BASE + route, { waitUntil: 'networkidle' });
    await step(label, click(control), '/services/studentaid');
  }
  /* A Cancel on an ONBOARDED service must not un-onboard it (§7.4). */
  await p.goto(BASE + '/services/studentaid/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  if ((await verifiedAttr()) !== '1') fails.push(`@${width} GB14: a Cancel un-onboarded StudentAidNL`);

  /*
   * GB15 — THE PRESENTER'S ARROWS ON FLOW B URLS (FLOW_B in src/lib/flow.ts).
   * Until today these URLs were in no list and both arrows did nothing. The
   * hand-off has no Back control; the Yoti country screen has none either.
   */
  await p.goto(BASE + '/cid/studentaid/continue-on-mobile/', { waitUntil: 'networkidle' });
  await step('GB15 B hand-off -> PP-08 (ArrowLeft)', arrow('ArrowLeft'), '/services/studentaid/other-verification');
  await p.goto(BASE + '/cid/studentaid/country/', { waitUntil: 'networkidle' });
  await step('GB16 B country -> B liveness capture (ArrowLeft)', arrow('ArrowLeft'), '/cid/studentaid/liveness-capture');
  await p.goto(BASE + '/services/studentaid/onboard/', { waitUntil: 'networkidle' });
  await step('GB17 PP-07 -> PP-08 (ArrowRight)', arrow('ArrowRight'), '/services/studentaid/other-verification');

  /* GB18 — PP-08 exists ONLY for services with the step: no Flow A copy. */
  await p.goto(BASE + '/services/driver-vehicle/other-verification/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(300);
  if (!(await p.getByText('We can’t find that page', { exact: false }).count())) {
    fails.push(`@${width} GB18: /services/driver-vehicle/other-verification/ resolved to a real page`);
  }

  /* ===================== GH — hydration with a populated Flow B store ===== */
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem(
        'gnl-demo:v1',
        JSON.stringify({
          v: 1,
          services: {
            studentaid: {
              status: 'onboarded',
              step: 'ready',
              method: 'gnl_idv',
              otherVerificationConfirmed: true,
              termsAcceptedAt: '2026-09-28T10:00:00.000Z',
              verifiedAt: '2026-09-28T10:05:00.000Z',
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
    '/services/studentaid/',
    '/services/studentaid/summary/',
    '/services/studentaid/terms/',
    '/services/studentaid/confirm-details/',
    '/services/studentaid/onboard/',
    '/services/studentaid/other-verification/',
    '/services/studentaid/prerequisite/',
    '/services/studentaid/confirmation/',
    '/auth/loading/',
  ]) {
    await p.goto(BASE + r, { waitUntil: 'networkidle' });
    await p.waitForTimeout(350);
  }
  {
    const real = consoleErrors.filter((t) => !/favicon|Download the React DevTools/i.test(t));
    if (real.length) fails.push(`@${width} GH hydration/console with a populated Flow B store: ${real.join(' ;; ')}`);
  }
  await p.goto(BASE + '/services/studentaid/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(400);
  if ((await verifiedAttr()) !== '1') fails.push(`@${width} GH: the seeded Flow B store was not read back`);

  await ctx.close();
}

for (const w of [1440, 768, 390]) await run(w);
for (const w of [1440, 768, 390]) await runFlowBCid(w);
for (const w of [1440, 768, 390]) await runFlowB(w);
await b.close();

console.log(
  fails.length
    ? 'CLICK FAILURES:\n' + fails.join('\n')
    : 'click-through: Flow A forward + backward chain, Flow B CID chain and Flow B full chain (dashboard -> Trusted) intact at 1440 / 768 / 390',
);
if (fails.length) process.exit(1);
