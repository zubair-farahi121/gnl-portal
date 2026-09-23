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

  /* ===================== FORWARD — every on-screen control ================ */
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await step('1  Log in', click('Log in'), '/dashboard');
  await step(
    '2  Driver and Vehicle card',
    (pg) => pg.getByRole('link', { name: /Driver and Vehicle/ }).first().click(),
    '/services/driver-vehicle',
  );
  await step('3  Onboard', click('Onboard'), '/services/driver-vehicle/onboard');
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
  await step('B16 Onboard -> service (Back)', click('Back'), '/services/driver-vehicle');

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

  await ctx.close();
}

for (const w of [1440, 768, 390]) await run(w);
await b.close();

console.log(
  fails.length
    ? 'CLICK FAILURES:\n' + fails.join('\n')
    : 'click-through: forward + backward chain intact at 1440 / 768 / 390',
);
if (fails.length) process.exit(1);
