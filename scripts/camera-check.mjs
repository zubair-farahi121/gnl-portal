/*
 * Live-camera gate for the THREE camera screens (added 2026-09-22 with
 * src/components/cid/CameraViewport.tsx, for the two ID-capture screens;
 * extended 2026-09-23 with /cid/liveness-capture/, Figma 6217:65271).
 *
 * THE THIRD SCREEN IS NOT A COPY OF THE OTHER TWO, and section 0 exists
 * because of the differences:
 *   - it asks for the FRONT camera (`facingMode="user"`) where the ID screens
 *     ask for the rear one. That is a PROP on the shared component, and the
 *     constraint handed to getUserMedia is asserted on the wire.
 *   - it has NO mock image. Figma draws a flat #e9ebe8 panel with an
 *     instruction pill and a face guide on it, so `children` is null and the
 *     panel IS the fallback; what has to be proven instead is that the pill and
 *     the guide paint ABOVE the feed and keep their measured boxes.
 *   - it is the only camera screen with a visible Back control, so it is the
 *     only one a viewer can leave without pressing Continue. Both exits are
 *     checked to tear the camera down.
 *
 * WHY IT EXISTS. `npm run responsive` and `npm run clicks` run on a headless
 * Chromium with no capture device, so they exercise the camera's FALLBACK —
 * which is the branch that must stay pixel-identical, and the one that matters
 * most on demo day. Nothing in either gate ever reaches the live branch. This
 * script launches Chromium WITH a fake capture device and proves the other
 * half: the <video> appears, plays real frames, fills the Figma viewport box
 * exactly, asks for video and never audio, is torn down on unmount so no
 * camera light survives navigation, and can be forced back to the mock with
 * `?mock=1`.
 *
 * Needs the static build served first (WITHOUT `serve -s`):
 *   npm run build && npm run serve
 * Then:
 *   npm run camera
 *
 * PLAYWRIGHT_CHROMIUM_PATH overrides the browser, same as the other two gates.
 */
import { chromium } from 'playwright';

const EXEC =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ??
  '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:4173';

const fails = [];
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) fails.push(msg); };

const browser = await chromium.launch({
  executablePath: EXEC,
  args: [
    '--use-fake-device-for-media-stream',
    '--use-fake-ui-for-media-stream',
    '--allow-file-access-from-files',
  ],
});

const ctx = await browser.newContext({ viewport: { width: 390, height: 900 }, permissions: ['camera'] });

// Record every track handed out, so "did unmount stop them" is observable
// across client-side navigations (same document, so window state survives).
await ctx.addInitScript(() => {
  window.__gnlTracks = [];
  const md = navigator.mediaDevices;
  if (md && md.getUserMedia) {
    const orig = md.getUserMedia.bind(md);
    md.getUserMedia = async (c) => {
      const s = await orig(c);
      s.getTracks().forEach((t) => window.__gnlTracks.push(t));
      window.__gnlConstraints = (window.__gnlConstraints || []).concat([JSON.stringify(c)]);
      return s;
    };
  }
});

const page = await ctx.newPage();
const consoleMsgs = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') consoleMsgs.push(`${m.type()}: ${m.text()}`); });
page.on('pageerror', (e) => consoleMsgs.push(`pageerror: ${e.message}`));

const liveCount = () => page.evaluate(() => (window.__gnlTracks || []).filter((t) => t.readyState === 'live').length);
const trackStates = () => page.evaluate(() => (window.__gnlTracks || []).map((t) => `${t.kind}:${t.readyState}`));

/* ---------- 0. LIVENESS: the third camera screen, FRONT-facing ----------
 *
 * Added 2026-09-23 with /cid/liveness-capture/ (Figma 6217:65271), which reuses
 * CameraViewport rather than reimplementing it. Three things are specific to it
 * and are asserted here and nowhere else:
 *
 *   - it asks for the USER camera, where the two ID screens ask for the
 *     ENVIRONMENT one. That is the whole reason `facingMode` became a prop
 *     instead of a second copy of the component, so it is checked on the wire
 *     (the real constraint object handed to getUserMedia), not inferred.
 *   - its fallback has NO mock image. Figma draws a flat #e9ebe8 panel with the
 *     instruction pill and the face guide on it, so `children` is null and the
 *     panel itself IS the fallback. "The mock <img> is replaced" is therefore
 *     not a meaningful check here; "the pill and the guide survive the live
 *     branch" is, because they must paint ABOVE the absolutely-positioned
 *     video, and a stacking mistake would hide them behind the feed.
 *   - leaving it must stop its track, which is checked at the end of this
 *     block AND again in section 3a after the walk continues.
 */
await page.goto(BASE + '/cid/liveness-capture/', { waitUntil: 'networkidle' });
await page.waitForSelector('video[data-gnl-camera="live"]', { timeout: 10000 });
await page.waitForTimeout(700);

const live0 = await page.evaluate(() => {
  const v = document.querySelector('video[data-gnl-camera="live"]');
  const panel = document.querySelector('[data-name="liveness-viewport"]');
  const pill = document.querySelector('[data-node-id="6076:31260"]');
  const guide = document.querySelector('[data-name="Group 6"]');
  const vb = v.getBoundingClientRect();
  const pb = panel.getBoundingClientRect();
  const pillR = pill.getBoundingClientRect();
  const guideR = guide.getBoundingClientRect();
  /*
   * Is the pill / guide painted ABOVE the feed?
   *
   * Checked structurally, not with elementFromPoint: the <video> is
   * `pointer-events-none`, so hit-testing would skip it and the check would
   * pass no matter what the stacking actually was. The real invariant is the
   * CSS one — both the video and these two are POSITIONED with `z-index:
   * auto`, so paint order is DOM order, and the video must come first.
   * DOCUMENT_POSITION_FOLLOWING (4) means "argument follows the node".
   */
  const above = (el) =>
    getComputedStyle(el).position !== 'static' &&
    !!(v.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING);
  return {
    paused: v.paused,
    readyState: v.readyState,
    videoWidth: v.videoWidth,
    videoHeight: v.videoHeight,
    audioTracks: v.srcObject ? v.srcObject.getAudioTracks().length : -1,
    videoTracks: v.srcObject ? v.srcObject.getVideoTracks().length : -1,
    objectFit: getComputedStyle(v).objectFit,
    v: [Math.round(vb.x), Math.round(vb.y), Math.round(vb.width), Math.round(vb.height)],
    p: [Math.round(pb.x), Math.round(pb.y), Math.round(pb.width), Math.round(pb.height)],
    panelH: Math.round(pb.height),
    videoPosition: getComputedStyle(v).position,
    pillPosition: getComputedStyle(pill).position,
    guidePosition: getComputedStyle(guide).position,
    pillOnTop: above(pill),
    guideOnTop: above(guide),
    // The guide must also still be its measured size while the feed runs.
    guideBox: [Math.round(guideR.width), Math.round(guideR.height)],
    pillBox: [Math.round(pillR.width), Math.round(pillR.height)],
    mockImgs: document.querySelectorAll('[data-name="liveness-viewport"] img').length,
  };
});
console.log('liveness video:', JSON.stringify(live0));
ok(!live0.paused && live0.readyState >= 2, `liveness: <video> is playing (readyState ${live0.readyState})`);
ok(live0.videoWidth > 0 && live0.videoHeight > 0, `liveness: real frames ${live0.videoWidth}x${live0.videoHeight}`);
ok(live0.audioTracks === 0 && live0.videoTracks === 1, `liveness: video only (v=${live0.videoTracks} a=${live0.audioTracks})`);
ok(live0.objectFit === 'cover', `liveness: object-fit ${live0.objectFit}`);
ok(JSON.stringify(live0.v) === JSON.stringify(live0.p), `liveness: video fills the viewport panel ${JSON.stringify(live0.v)} vs ${JSON.stringify(live0.p)}`);
ok(live0.panelH === 522, `liveness: Frame 9 still 522px tall while live (${live0.panelH})`);
ok(live0.pillOnTop, `liveness: the instruction pill paints ABOVE the live feed (video ${live0.videoPosition}, pill ${live0.pillPosition}, after it in DOM)`);
ok(live0.guideOnTop, `liveness: the face guide paints ABOVE the live feed (guide ${live0.guidePosition}, after it in DOM)`);
// 193.27098 x 263.05786, the Figma group — rounds to 193 x 263.
ok(
  JSON.stringify(live0.guideBox) === JSON.stringify([193, 263]),
  `liveness: face guide keeps its measured box while live (${live0.guideBox.join('x')}, want 193x263)`,
);
// Frame 7 is 321 x 51 at the 393 design width; this run is 390 wide, so the
// w-full pill is 3px narrower. Height is what must not move.
ok(live0.pillBox[1] === 51, `liveness: instruction pill still 51px tall while live (${live0.pillBox.join('x')})`);
// The face guide is the only <img> in the panel — there is no mock photo here.
ok(live0.mockImgs === 1, `liveness: no mock photo in the panel, just the face guide (${live0.mockImgs} img)`);

const constraints0 = await page.evaluate(() => window.__gnlConstraints || []);
console.log('liveness constraints:', JSON.stringify(constraints0));
ok(
  constraints0.length > 0 && /"facingMode":\s*\{"ideal":"user"\}/.test(constraints0[0]),
  `liveness: asked for the FRONT camera, ideal not exact (${constraints0[0]})`,
);
ok(await liveCount() === 1, `liveness: exactly 1 live track (${(await trackStates()).join(',')})`);

/* ---------- 0a. leaving the liveness screen stops its track ---------- */
await page.getByRole('link', { name: 'Continue', exact: true }).first().click();
await page.waitForURL('**/cid/country/**', { timeout: 10000 });
await page.waitForTimeout(800);
ok(await liveCount() === 0, `after liveness: ZERO live tracks (${(await trackStates()).join(',')})`);
ok((await page.locator('video').count()) === 0, 'country: no <video> on the next screen');

/* ---------- 0b. the Back control also tears the camera down ----------
 * /cid/liveness-capture/ is the only camera screen with a visible Back, so it
 * is the only one where a viewer can leave WITHOUT using Continue. Same
 * unmount, but worth proving rather than assuming.
 */
await page.goto(BASE + '/cid/liveness-capture/', { waitUntil: 'networkidle' });
await page.waitForSelector('video[data-gnl-camera="live"]', { timeout: 10000 });
await page.waitForTimeout(600);
const beforeBack = await liveCount();
await page.getByRole('link', { name: 'Back', exact: true }).first().click();
await page.waitForURL('**/cid/liveness/**', { timeout: 10000 });
await page.waitForTimeout(800);
ok(beforeBack === 1, `liveness Back: camera was live before leaving (${beforeBack})`);
ok(await liveCount() === 0, `liveness Back: ZERO live tracks after Back (${(await trackStates()).join(',')})`);
ok((await page.locator('video').count()) === 0, 'liveness prepare: no <video> — it is a drawing, not a camera');

/* ---------- 1. FRONT: the live feed ---------- */
await page.goto(BASE + '/cid/capture-front/', { waitUntil: 'networkidle' });
await page.waitForSelector('video[data-gnl-camera="live"]', { timeout: 10000 });
await page.waitForTimeout(700);

const front = await page.evaluate(() => {
  const v = document.querySelector('video[data-gnl-camera="live"]');
  const box = document.querySelector('[data-name="image 16"]');
  const vb = v.getBoundingClientRect();
  const bb = box.getBoundingClientRect();
  return {
    paused: v.paused,
    readyState: v.readyState,
    videoWidth: v.videoWidth,
    videoHeight: v.videoHeight,
    muted: v.muted,
    hasStream: !!v.srcObject,
    audioTracks: v.srcObject ? v.srcObject.getAudioTracks().length : -1,
    videoTracks: v.srcObject ? v.srcObject.getVideoTracks().length : -1,
    objectFit: getComputedStyle(v).objectFit,
    v: [Math.round(vb.x), Math.round(vb.y), Math.round(vb.width), Math.round(vb.height)],
    b: [Math.round(bb.x), Math.round(bb.y), Math.round(bb.width), Math.round(bb.height)],
    imgLeft: !!document.querySelector('[data-name="image 16"] img'),
  };
});
console.log('front video:', JSON.stringify(front));
ok(front.hasStream && !front.paused, 'front: <video> is playing (not paused, has srcObject)');
ok(front.readyState >= 2, `front: readyState ${front.readyState} >= 2 (has current data)`);
ok(front.videoWidth > 0 && front.videoHeight > 0, `front: real frames ${front.videoWidth}x${front.videoHeight}`);
ok(front.audioTracks === 0 && front.videoTracks === 1, `front: video only (v=${front.videoTracks} a=${front.audioTracks})`);
ok(front.objectFit === 'cover', `front: object-fit ${front.objectFit}`);
ok(JSON.stringify(front.v) === JSON.stringify(front.b), `front: video fills the image box ${JSON.stringify(front.v)} vs ${JSON.stringify(front.b)}`);
ok(!front.imgLeft, 'front: the static mock <img> is replaced while live');
console.log('constraints:', await page.evaluate(() => window.__gnlConstraints));
ok(await liveCount() === 1, `front: exactly 1 live track (${(await trackStates()).join(',')})`);

/* ---------- 2. panel geometry unchanged vs the mock ---------- */
const panel = await page.evaluate(() => {
  const p = document.querySelector('[data-node-id="6088:32330"]');
  const r = p.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
});
ok(panel[1] === 400, `front: Frame 14 still 400px tall while live (${panel.join('x')})`);

/* ---------- 3. client-side nav to BACK: front tracks must be stopped ---------- */
await page.getByRole('link', { name: 'Continue', exact: true }).first().click();
await page.waitForURL('**/cid/capture-back/**', { timeout: 10000 });
await page.waitForSelector('video[data-gnl-camera="live"]', { timeout: 10000 });
await page.waitForTimeout(700);
const states1 = await trackStates();
ok(states1.filter((s) => s.endsWith('ended')).length === 1, `back: the front screen's track is ended (${states1.join(',')})`);
ok(await liveCount() === 1, 'back: exactly 1 live track — the back screen\'s own');

const back = await page.evaluate(() => {
  const v = document.querySelector('video[data-gnl-camera="live"]');
  const box = document.querySelector('[data-name="image 17"]');
  const vb = v.getBoundingClientRect(); const bb = box.getBoundingClientRect();
  return {
    paused: v.paused, readyState: v.readyState, videoWidth: v.videoWidth,
    v: [Math.round(vb.x), Math.round(vb.y), Math.round(vb.width), Math.round(vb.height)],
    b: [Math.round(bb.x), Math.round(bb.y), Math.round(bb.width), Math.round(bb.height)],
  };
});
console.log('back video:', JSON.stringify(back));
ok(!back.paused && back.readyState >= 2 && back.videoWidth > 0, 'back: <video> is playing');
ok(JSON.stringify(back.v) === JSON.stringify(back.b), `back: video fills the image box ${JSON.stringify(back.v)} vs ${JSON.stringify(back.b)}`);

/* ---------- 4. leave the capture screens entirely ---------- */
await page.getByRole('link', { name: 'Continue', exact: true }).first().click();
await page.waitForURL('**/cid/verified/**', { timeout: 10000 });
await page.waitForTimeout(800);
const states2 = await trackStates();
ok(await liveCount() === 0, `verified: ZERO live tracks after leaving (${states2.join(',')})`);
ok((await page.locator('video').count()) === 0, 'verified: no <video> on the next screen');

/* ---------- 5. back-button return, then away again ---------- */
await page.goBack();
await page.waitForSelector('video[data-gnl-camera="live"]', { timeout: 10000 });
await page.waitForTimeout(600);
ok(await liveCount() === 1, 'back-button return: camera restarts, 1 live track');
await page.goto(BASE + '/dashboard/', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
ok((await page.locator('video').count()) === 0, 'dashboard: no <video>, no camera requested elsewhere');

/* ---------- 6. ?mock=1 forces the mock, and is sticky ---------- */
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 900 }, permissions: ['camera'] });
const p2 = await ctx2.newPage();
await p2.goto(BASE + '/cid/capture-front/?mock=1', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
ok((await p2.locator('video').count()) === 0, '?mock=1: no <video> — the static mock is forced');
ok((await p2.locator('[data-name="image 16"] img').count()) === 1, '?mock=1: the mock <img> is on screen');
await p2.goto(BASE + '/cid/capture-back/', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
ok((await p2.locator('video').count()) === 0, 'sticky: no <video> on capture-back without any parameter');
await p2.goto(BASE + '/cid/capture-back/?mock=0', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
ok((await p2.locator('video[data-gnl-camera="live"]').count()) === 1, '?mock=0: the live feed comes back');
await p2.goto(BASE + '/cid/capture-front/', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
ok((await p2.locator('video[data-gnl-camera="live"]').count()) === 1, 'after ?mock=0: live again on the other screen too');
/*
 * The flag is ONE key shared by all three screens, so a presenter who pins the
 * mock on a capture screen must get the mock on the liveness screen too — and
 * there the "mock" is the flat #e9ebe8 panel Figma draws, with the pill and the
 * face guide still on it. A blank box would be worse than the mock, which is
 * the whole premise of the fallback, so the panel's contents are checked as
 * well as the absence of a <video>.
 */
await p2.goto(BASE + '/cid/liveness-capture/?mock=1', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
ok((await p2.locator('video').count()) === 0, '?mock=1: no <video> on the liveness screen either');
ok(
  (await p2.locator('[data-name="liveness-viewport"] [data-name="Group 6"]').count()) === 1 &&
    (await p2.locator('[data-node-id="6076:31260"]').count()) === 1,
  '?mock=1: the liveness panel still shows its pill and face guide',
);
await p2.goto(BASE + '/cid/capture-front/', { waitUntil: 'networkidle' });
await p2.waitForTimeout(1500);
ok((await p2.locator('video').count()) === 0, 'sticky both ways: ?mock=1 set on the liveness screen holds on the capture screens');
await ctx2.close();

/*
 * PRE-EXISTING NOISE, FILTERED. Chrome's "preloaded using link preload but not
 * used within a few seconds" warning fires on EVERY route in this build —
 * Next prefetches the next route's assets and this run lingers long enough
 * (>5s per screen) to hear about it. Measured on /, /dashboard/ and
 * /cid/terms/ with no camera involved: 5, 4 and 12 of them respectively. The
 * responsive gate never sees them because it dwells 250ms. Nothing to do with
 * getUserMedia; anything else here is a real failure.
 */
const noisy = consoleMsgs.filter(
  (t) => !/favicon|React DevTools|preloaded using link preload/i.test(t),
);
ok(noisy.length === 0, `console clean on the live path (${noisy.join(' ;; ') || 'none'})`);

await browser.close();
console.log(fails.length ? `\nCAMERA FAILURES:\n- ${fails.join('\n- ')}` : '\ncamera gate: live path OK, tracks cleaned up, mock forceable');
process.exit(fails.length ? 1 : 0);
