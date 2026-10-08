/*
 * Phone-path gate — `npm run phone`. ADDED 2026-09-30 (docs/PHONE_PATH.md).
 *
 * Proves the two-device demo against server/demo-server.mjs with TWO browser
 * contexts = two devices with SEPARATE storage, like a real laptop and phone,
 * so only the server sync can make it pass: a laptop at 1440 wide and a phone
 * at 390 x 844 (mobile emulation, touch).
 *
 *   (o) OPT-IN — on the server, before phone mode is on, the laptop makes no
 *       /api request and the hand-off screen is today's placeholder.
 *       /demo/phone/ switches it on.
 *   (a) FLOW 3 — laptop C1 page; the QR's URL is read from the DOM AND the
 *       drawn modules are checked against that URL re-encoded here; the
 *       phone (W-09 shows 2 cards first) opens it and walks W-03…W-08; the
 *       laptop must go Waiting -> Adding -> Added WITHOUT a reload; the
 *       phone's W-09 then shows 3 cards.
 *   (r) DECLINE + RESET — the phone opens a fresh code and declines on W-03:
 *       the laptop goes back to "Waiting for scan…". Then Esc on the laptop
 *       deletes the room on the server (GET -> 404) and forgets it locally.
 *       Then (2026-10-04): a dead room is replaced by "Get a new code", a
 *       PHONE reset never deletes the laptop's room, and phone mode off
 *       drops the room here and on the server.
 *   (b) IDV HAND-OFF, Flow A and Flow B — laptop on "Continue on a
 *       smartphone"; the phone opens the hand-off QR and runs the CertifiO
 *       screens (camera screens forced to the still image, `?mock=1`'s
 *       sticky flag) to verified; the laptop moves on BY ITSELF to the
 *       processing step and then that service's next screen; the phone ends
 *       on "You can return to your computer".
 *   (c) STATIC MODE — only when STATIC_BASE_URL is set (a plain
 *       `npx serve out`): the placeholder, no room, no /api request, clean
 *       console; and even with phone mode on, the placeholder stays.
 *   (p) STATIC PARITY — also with STATIC_BASE_URL: every file in out/, the
 *       route forms a browser asks for and a few edge cases (404s, gzip,
 *       HEAD, 304, range) answer with the same status, headers and bytes
 *       from demo-server as from `npx serve out`.
 *   (d) API — health, bad room id 400, oversize 413, unknown route 404, and
 *       the other guard rails; SSE; DELETE.
 *
 *   npm run build && npm run serve:phone           # one terminal
 *   npm run phone                                  # another
 *   DEMO_BASE_URL=http://127.0.0.1:4182 STATIC_BASE_URL=http://127.0.0.1:4183 npm run phone
 *   PHONE_PARTS=a,d npm run phone                  # a subset
 */
import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import QRCode from 'qrcode';
import { chromium } from 'playwright';

const EXEC = process.env.PLAYWRIGHT_CHROMIUM_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const BASE = (process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:4173').replace(/\/+$/, '');
const STATIC_BASE = (process.env.STATIC_BASE_URL ?? '').replace(/\/+$/, '');
const PARTS = new Set((process.env.PHONE_PARTS ?? 'o,a,r,b,c,p,d').split(',').map((s) => s.trim()));
const ROOM = '[a-z0-9]{32}';

const results = [];
const ok = (cond, msg) => {
  results.push([Boolean(cond), msg]);
  console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`);
  return Boolean(cond);
};

const b = await chromium.launch({
  executablePath: EXEC,
  args: ['--disable-background-networking', '--disable-component-update', '--no-first-run'],
});

const LAPTOP = { viewport: { width: 1440, height: 900 } };
const PHONE = { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };

const realErrors = (list) =>
  list.filter((t) => !/favicon|Download the React DevTools|preloaded using link preload/i.test(t));

async function device(opts, { cameraMock = false } = {}) {
  const ctx = await b.newContext({ ...opts, ignoreHTTPSErrors: true });
  /* The phone's camera screens: the same sticky flag `?mock=1` writes
     (src/components/cid/CameraViewport.tsx), so they show the still image. */
  if (cameraMock) await ctx.addInitScript(() => localStorage.setItem('gnl-demo-camera-mock', '1'));
  const page = await ctx.newPage();
  const errors = [];
  const api = [];
  page.on('console', (m) => {
    if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('request', (r) => {
    if (new URL(r.url()).pathname.startsWith('/api/')) api.push(`${r.method()} ${new URL(r.url()).pathname}`);
  });
  return { ctx, page, errors, api };
}

/** Turn phone mode on in this (laptop) context, through the presenter page. */
async function optIn(pg, base = BASE) {
  await pg.goto(base + '/demo/phone/', { waitUntil: 'load' });
  await pg.waitForSelector('[data-phone-mode-panel="present"]', { timeout: 8000 });
  await pg.locator('[data-phone-mode-toggle]').click();
  await pg.waitForSelector('[data-phone-mode="on"]', { timeout: 3000 });
}

/** A link or a button, by its exact accessible name — the same helper click-through.mjs uses. */
const click = async (pg, name) => {
  const link = pg.getByRole('link', { name, exact: true }).first();
  if (await link.count()) return link.click();
  return pg.getByRole('button', { name, exact: true }).first().click();
};
const path = (pg) => new URL(pg.url()).pathname;

async function hop(pg, label, name, want) {
  await click(pg, name);
  await pg.waitForURL((u) => u.pathname === want, { timeout: 8000 }).catch(() => {});
  ok(path(pg) === want, `${label}: -> ${want} (at ${path(pg)})`);
}

/** The path the page draws for `text`, computed the way src/lib/qr.ts does. */
function expectedQrPath(text) {
  const { size, data } = QRCode.create(text, { errorCorrectionLevel: 'M' }).modules;
  let d = '';
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (data[y * size + x]) d += `M${x} ${y}h1v1h-1z`;
  return d;
}

const roomStatus = async (room) => (await fetch(`${BASE}/api/rooms/${room}`)).status;

/* ------------------------------------------------------------- (o) -- */
async function optInCheck() {
  console.log('\n(o) Opt-in — the server changes nothing until phone mode is on');
  const lap = await device(LAPTOP);
  const d = lap.page;
  await d.goto(BASE + '/cid/continue-on-mobile/', { waitUntil: 'networkidle' });
  await d.waitForTimeout(1200);
  ok(await d.locator('[data-node-id="6156:60706"] img[src="/assets/qr-mobile-handoff.svg"]').count(), 'o1 placeholder QR on the hand-off screen');
  ok(!(await d.locator('[data-qr-url], [data-handoff-status]').count()), 'o2 no real QR, no status line');
  await d.goto(BASE + '/services/driver-vehicle/wallet/', { waitUntil: 'networkidle' });
  await d.waitForTimeout(1200);
  const u = (await d.locator('[data-wallet-qr]').getAttribute('data-qr-url')) ?? '';
  ok(/\/wallet\/start\/\?offer=[^&]+$/.test(u), `o3 the C1 QR is today's URL (${u})`);
  ok(lap.api.length === 0, `o4 no /api request at all before opt-in (${lap.api.join(', ') || 'none'})`);
  await optIn(d);
  ok(await d.evaluate(() => localStorage.getItem('gnl-demo:phone-mode') === 'on'), 'o5 /demo/phone/ turns phone mode on');
  const base = (await d.locator('[data-phone-base]').textContent())?.trim();
  ok(base === BASE, `o6 /demo/phone/ shows the address phones will open (${base})`);
  ok(!realErrors(lap.errors).length, `o7 console clean ${realErrors(lap.errors).join(' ;; ')}`);
  await lap.ctx.close();
}

/* ------------------------------------------------------------- (a) -- */
async function flow3() {
  console.log('\n(a) Flow 3 — the C1 QR scanned by a phone');
  const lap = await device(LAPTOP);
  const phone = await device(PHONE);
  const d = lap.page;
  const p = phone.page;
  const status = () => d.locator('[data-wallet-status]').first().getAttribute('data-wallet-status');
  const waitStatus = async (key, ms = 12000) =>
    d
      .waitForFunction((k) => document.querySelector('[data-wallet-status]')?.getAttribute('data-wallet-status') === k, key, { timeout: ms })
      .then(() => true)
      .catch(() => false);

  await p.goto(BASE + '/wallet/cards/', { waitUntil: 'load' });
  await p.waitForTimeout(600);
  const before = await p.locator('[data-wallet-cards] > *').count();
  ok(before === 2, `a0 the phone's W-09 starts with ${before} cards (expected 2)`);

  await optIn(d);
  await d.goto(BASE + '/services/driver-vehicle/?verified=1', { waitUntil: 'networkidle' });
  await d.getByRole('link', { name: 'Add to wallet', exact: true }).first().click();
  await d.waitForURL('**/services/driver-vehicle/wallet/');
  await d
    .waitForFunction(() => /&room=/.test(document.querySelector('[data-wallet-qr]')?.getAttribute('data-qr-url') ?? ''), null, { timeout: 10000 })
    .catch(() => {});
  const qr = d.locator('[data-wallet-qr]');
  const url = (await qr.getAttribute('data-qr-url')) ?? '';
  const offer = (await qr.getAttribute('data-offer-id')) ?? '';
  ok(
    offer && new RegExp(`^${BASE}/wallet/start/\\?offer=${offer}&room=${ROOM}$`).test(url),
    `a1 the C1 QR targets <public url>/wallet/start/?offer=<id>&room=<room> (${url})`,
  );
  const drawn = await qr.locator('svg path').first().getAttribute('d');
  ok(drawn === expectedQrPath(url), 'a2 the drawn QR modules encode exactly that URL');
  ok((await status()) === 'waiting', 'a3 the laptop starts on "Waiting for scan…"');
  await d.evaluate(() => {
    window.__phoneNoReload = 'still-here';
  });
  let navs = 0;
  d.on('framenavigated', (f) => {
    if (f === d.mainFrame()) navs++;
  });

  await p.goto(url, { waitUntil: 'load' });
  await p.waitForURL('**/wallet/connect/', { timeout: 10000 }).catch(() => {});
  ok(path(p) === '/wallet/connect/', `a4 the phone lands on W-03 "Allow connection?" (at ${path(p)})`);
  ok(await waitStatus('adding'), 'a5 the laptop hears the scan: "Adding to your wallet…"');
  const adding = (await d.locator('[data-wallet-status]').textContent())?.trim();
  ok(adding === 'Adding to your wallet…', `a6 state line reads "${adding}"`);

  await hop(p, 'a7 W-03 Yes, connect', 'Yes, connect', '/wallet/offer/');
  await hop(p, 'a8 W-04 View offer', 'View offer', '/wallet/review/');
  await click(p, 'Add to wallet');
  await p.waitForURL('**/wallet/code/', { timeout: 10000 }).catch(() => {});
  ok(path(p) === '/wallet/code/', `a9 W-05 Add to wallet -> W-06 -> W-07 (at ${path(p)})`);
  ok((await status()) === 'adding', 'a10 the laptop still reads "Adding" mid-flow');
  const sms = p.locator('[data-wallet-sms]');
  await sms.waitFor({ timeout: 5000 }).catch(() => {});
  await sms.click();
  await p.getByRole('button', { name: /Continue/ }).click();
  await p.waitForURL('**/wallet/added/', { timeout: 8000 }).catch(() => {});
  ok(path(p) === '/wallet/added/', `a11 W-07 code -> W-08 (at ${path(p)})`);
  ok(await waitStatus('added'), 'a12 the laptop hears the issue: "Added to your wallet"');
  const added = (await d.locator('[data-wallet-status]').textContent())?.trim();
  ok(added === 'Added to your wallet', `a13 state line reads "${added}"`);
  ok(
    (await d.evaluate(() => window.__phoneNoReload)) === 'still-here' && navs === 0,
    `a14 the laptop never reloaded or navigated (${navs} navigation(s))`,
  );

  await p.getByRole('link', { name: /Go to Wallet/ }).click();
  await p.waitForURL('**/wallet/cards/', { timeout: 5000 }).catch(() => {});
  await p.waitForTimeout(500);
  const cards = await p.locator('[data-wallet-cards] > *').count();
  ok(cards === 3, `a15 the phone's W-09 now shows ${cards} cards (expected 3)`);
  const top = await p.locator('[data-wallet-cards] > *').first().getAttribute('data-wallet-card');
  ok(top === 'vehicle-registration-certificate', 'a16 the new certificate is the top card');

  ok(!realErrors(lap.errors).length, `a17 laptop console clean ${realErrors(lap.errors).join(' ;; ')}`);
  ok(!realErrors(phone.errors).length, `a18 phone console clean ${realErrors(phone.errors).join(' ;; ')}`);
  await lap.ctx.close();
  await phone.ctx.close();
}

/* ------------------------------------------------------------- (r) -- */
async function declineAndReset() {
  console.log('\n(r) Decline on the phone, then Esc on the laptop');
  const lap = await device(LAPTOP);
  const phone = await device(PHONE);
  const d = lap.page;
  const p = phone.page;
  const waitStatus = async (key, ms = 12000) =>
    d
      .waitForFunction((k) => document.querySelector('[data-wallet-status]')?.getAttribute('data-wallet-status') === k, key, { timeout: ms })
      .then(() => true)
      .catch(() => false);

  await optIn(d);
  await d.goto(BASE + '/services/driver-vehicle/wallet/', { waitUntil: 'load' });
  await d
    .waitForFunction(() => /&room=/.test(document.querySelector('[data-wallet-qr]')?.getAttribute('data-qr-url') ?? ''), null, { timeout: 10000 })
    .catch(() => {});
  const url = (await d.locator('[data-wallet-qr]').getAttribute('data-qr-url')) ?? '';
  const room = new URL(url).searchParams.get('room') ?? '';
  ok(new RegExp(`^${ROOM}$`).test(room), `r1 the laptop has a room (${room})`);

  await p.goto(url, { waitUntil: 'load' });
  await p.waitForURL('**/wallet/connect/', { timeout: 10000 }).catch(() => {});
  ok(await waitStatus('adding'), 'r2 scan -> laptop "Adding to your wallet…"');
  await click(p, 'Decline');
  await p.waitForURL((u) => u.pathname === '/wallet/', { timeout: 8000 }).catch(() => {});
  ok(path(p) === '/wallet/', `r3 W-03 Decline -> W-01 on the phone (at ${path(p)})`);
  ok(await waitStatus('waiting'), 'r4 the laptop goes back to "Waiting for scan…"');

  ok((await roomStatus(room)) === 200, 'r5 the room exists before the reset');
  await d.locator('body').click({ position: { x: 5, y: 5 } }).catch(() => {});
  await d.keyboard.press('Escape');
  await d.waitForURL((u) => u.pathname === '/', { timeout: 8000 }).catch(() => {});
  let gone = false;
  for (let i = 0; i < 20 && !gone; i++) {
    gone = (await roomStatus(room)) === 404;
    if (!gone) await d.waitForTimeout(150);
  }
  ok(gone, 'r6 Esc on the laptop deletes the room on the server (GET -> 404)');
  /*
   * r7: the OLD room must be gone locally. The key may already hold a NEW
   * room: Esc resets the store while C1 is still mounted for a moment, C1
   * makes a fresh offer (Flow 3 behaviour) and, in phone mode, a fresh room
   * for it before the router reaches "/". That room is new (no phone has its
   * id) and the next C1 visit reuses it, so the race is harmless — what
   * matters is that the previous run's phone can no longer reach the laptop.
   */
  const stored = await d.evaluate(() => localStorage.getItem('gnl-demo:room'));
  ok(stored !== room, `r7 …and forgets it locally (now ${stored ?? 'none'})`);
  ok(await d.evaluate(() => localStorage.getItem('gnl-demo:phone-mode') === 'on'), 'r8 phone mode itself stays on (a presenter setting)');

  /* A next run gets a NEW room. */
  await d.goto(BASE + '/services/driver-vehicle/wallet/', { waitUntil: 'load' });
  await d
    .waitForFunction(() => /&room=/.test(document.querySelector('[data-wallet-qr]')?.getAttribute('data-qr-url') ?? ''), null, { timeout: 10000 })
    .catch(() => {});
  const next = new URL((await d.locator('[data-wallet-qr]').getAttribute('data-qr-url')) ?? BASE).searchParams.get('room');
  ok(next && next !== room, `r9 the next run opens a new room (${next})`);

  ok(!realErrors(lap.errors).length, `r10 laptop console clean ${realErrors(lap.errors).join(' ;; ')}`);
  ok(!realErrors(phone.errors).length, `r11 phone console clean ${realErrors(phone.errors).join(' ;; ')}`);
  const lapErrBefore = realErrors(lap.errors).length;
  const phoneErrBefore = realErrors(phone.errors).length;

  /* r12–r14 — review fixes, added 2026-10-04 (src/lib/remote-sync.ts). */
  // r12: a dead room (server restart / expiry, simulated by a DELETE from
  // here) is noticed by the laptop's poll, and "Get a new code" opens a fresh
  // room instead of resuming the dead one.
  await fetch(`${BASE}/api/rooms/${next}`, { method: 'DELETE' });
  await d
    .waitForFunction((r) => localStorage.getItem('gnl-demo:room') !== r, next, { timeout: 6000 })
    .catch(() => {});
  await click(d, 'Get a new code');
  await d
    .waitForFunction(
      (r) => {
        const u = document.querySelector('[data-wallet-qr]')?.getAttribute('data-qr-url') ?? '';
        return /&room=/.test(u) && !u.includes(`room=${r}`);
      },
      next,
      { timeout: 10000 },
    )
    .catch(() => {});
  const freshUrl = (await d.locator('[data-wallet-qr]').getAttribute('data-qr-url')) ?? BASE;
  const fresh = new URL(freshUrl).searchParams.get('room');
  ok(fresh && fresh !== next && (await roomStatus(fresh)) === 200, `r12 dead room replaced after "Get a new code" (${fresh})`);

  // r13: a PHONE reset only detaches — it must not delete the laptop's room.
  await p.goto(freshUrl, { waitUntil: 'load' });
  await p.waitForURL('**/wallet/connect/', { timeout: 10000 }).catch(() => {});
  await p.goto(BASE + '/reset/', { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  ok((await roomStatus(fresh)) === 200, 'r13 a phone reset does not delete the laptop\'s room');

  // r14: turning phone mode OFF drops the room here and on the server.
  await d.goto(BASE + '/demo/phone/', { waitUntil: 'load' });
  await d.waitForSelector('[data-phone-mode="on"]', { timeout: 8000 }).catch(() => {});
  await d.locator('[data-phone-mode-toggle]').click();
  await d.waitForSelector('[data-phone-mode="off"]', { timeout: 3000 }).catch(() => {});
  let dropped = false;
  for (let i = 0; i < 20 && !dropped; i++) {
    dropped = (await roomStatus(fresh)) === 404;
    if (!dropped) await d.waitForTimeout(150);
  }
  const left = await d.evaluate(() => localStorage.getItem('gnl-demo:room'));
  ok(dropped && !left, `r14 phone mode off deletes the room and forgets it (${dropped ? '404' : 'still there'}, local ${left ?? 'none'})`);
  // r15: r12 deletes a room on purpose, so the laptop's next poll logs ONE
  // kind of console line — a 404 for that room. Anything else is a failure.
  const extra = [...realErrors(lap.errors).slice(lapErrBefore), ...realErrors(phone.errors).slice(phoneErrBefore)].filter(
    (e) => !/status of 404/.test(e),
  );
  ok(!extra.length, `r15 consoles clean apart from the dead room's 404 ${extra.join(' ;; ')}`);

  await lap.ctx.close();
  await phone.ctx.close();
}

/* ------------------------------------------------------------- (b) -- */
const CID = {
  'driver-vehicle': {
    prefix: '/cid/',
    handoff: '/cid/continue-on-mobile/',
    captures: ['capture-front/', 'capture-back/'],
    next: '/services/driver-vehicle/prerequisite/',
  },
  studentaid: {
    prefix: '/cid/studentaid/',
    handoff: '/cid/studentaid/continue-on-mobile/',
    captures: ['capture-front/'],
    next: '/services/studentaid/prerequisite/',
  },
};

async function idv(service) {
  const c = CID[service];
  console.log(`\n(b) IDV hand-off — ${service}`);
  const lap = await device(LAPTOP);
  const phone = await device(PHONE, { cameraMock: true });
  const d = lap.page;
  const p = phone.page;
  const tag = service === 'driver-vehicle' ? 'bA' : 'bB';
  const QR = '[data-node-id="6156:60706"]';

  await optIn(d);
  await d.goto(BASE + c.handoff, { waitUntil: 'load' });
  await d.waitForSelector(`${QR}[data-qr-url]`, { timeout: 10000 }).catch(() => {});
  const url = (await d.locator(QR).getAttribute('data-qr-url')) ?? '';
  ok(
    new RegExp(`^${BASE}/cid/mobile/\\?room=${ROOM}&service=${service}$`).test(url),
    `${tag}1 the hand-off QR targets <public url>/cid/mobile/?room=<room>&service=${service} (${url})`,
  );
  ok((await d.locator(`${QR} svg path`).first().getAttribute('d')) === expectedQrPath(url), `${tag}2 the drawn QR encodes exactly that URL`);
  const box = await d.locator(QR).boundingBox();
  ok(box && Math.round(box.width) === 220 && Math.round(box.height) === 217, `${tag}3 the QR box keeps the placeholder's 220 x 217`);
  const line = d.locator('[data-handoff-status]');
  ok((await line.textContent())?.trim() === 'Waiting for your phone…', `${tag}4 laptop: "Waiting for your phone…"`);
  await d.evaluate(() => {
    window.__phoneNoReload = 'still-here';
  });

  await p.goto(url, { waitUntil: 'load' });
  await p.waitForURL((u) => u.pathname === `${c.prefix}terms/`, { timeout: 10000 }).catch(() => {});
  ok(path(p) === `${c.prefix}terms/`, `${tag}5 the phone lands on ${c.prefix}terms/ (at ${path(p)})`);
  await d
    .waitForFunction(() => document.querySelector('[data-handoff-status]')?.textContent?.trim() === 'Continue on your phone…', null, { timeout: 6000 })
    .catch(() => {});
  ok((await line.textContent().catch(() => ''))?.trim() === 'Continue on your phone…', `${tag}6 laptop: "Continue on your phone…"`);

  await hop(p, `${tag}7 terms`, 'I agree', `${c.prefix}biometric/`);
  await hop(p, `${tag}8 biometric consent`, 'I agree', `${c.prefix}liveness/`);
  await hop(p, `${tag}9 liveness`, 'Continue', `${c.prefix}liveness-capture/`);
  await hop(p, `${tag}10 liveness capture`, 'Continue', `${c.prefix}country/`);
  await hop(p, `${tag}11 country`, 'Continue', `${c.prefix}document/`);
  await hop(p, `${tag}12 document`, 'Continue', `${c.prefix}capture-intro/`);
  await hop(p, `${tag}13 capture intro`, 'Continue', `${c.prefix}${c.captures[0]}`);
  ok((await p.locator('video').count()) === 0, `${tag}14 the camera screen shows the still image (mock)`);
  if (c.captures[1]) await hop(p, `${tag}15 capture front`, 'Continue', `${c.prefix}${c.captures[1]}`);
  await hop(p, `${tag}16 last capture`, 'Continue', `${c.prefix}upload/`);
  ok(path(d) === c.handoff, `${tag}17 the laptop waits on the hand-off screen until the phone is verified`);
  await p.waitForURL((u) => u.pathname === `${c.prefix}verified/`, { timeout: 8000 }).catch(() => {});
  ok(path(p) === `${c.prefix}verified/`, `${tag}18 the phone reaches ${c.prefix}verified/ (at ${path(p)})`);
  await p.waitForSelector('[data-handoff-done]', { timeout: 6000 }).catch(() => {});
  ok(
    (await p.locator('[data-handoff-done]').textContent().catch(() => ''))?.includes('You can return to your computer.'),
    `${tag}19 the phone says "Verification complete. You can return to your computer."`,
  );

  await d.waitForURL((u) => u.pathname === '/auth/loading/', { timeout: 8000 }).catch(() => {});
  ok(path(d) === '/auth/loading/', `${tag}20 the laptop moves on BY ITSELF to the processing step (at ${path(d)})`);
  ok((await d.evaluate(() => window.__phoneNoReload).catch(() => null)) === 'still-here', `${tag}21 …without a reload`);
  await d.waitForURL((u) => u.pathname === c.next, { timeout: 10000 }).catch(() => {});
  ok(path(d) === c.next, `${tag}22 …and then to ${c.next}, as after "Continue on my computer" (at ${path(d)})`);
  const st = await d.evaluate((s) => JSON.parse(localStorage.getItem('gnl-demo:v1') ?? '{}').services?.[s]?.status, service);
  ok(st === 'verified' || st === 'onboarded', `${tag}23 the laptop's store has ${service} verified (${st})`);

  await p.getByRole('button', { name: /^Continue/ }).first().click();
  await p.waitForURL((u) => u.pathname === '/cid/mobile/', { timeout: 8000 }).catch(() => {});
  await p.waitForSelector('[data-phone-done]', { timeout: 5000 }).catch(() => {});
  ok(
    (await p.locator('[data-phone-done] h1').textContent().catch(() => ''))?.trim() === 'You can return to your computer',
    `${tag}24 the phone ends on "You can return to your computer" (at ${path(p)})`,
  );
  const phoneStatus = await p.evaluate((s) => JSON.parse(localStorage.getItem('gnl-demo:v1') ?? '{}').services?.[s]?.status, service);
  ok(phoneStatus !== 'verified' && phoneStatus !== 'onboarded', `${tag}25 the phone did not run the portal's own steps (${phoneStatus})`);

  ok(!realErrors(lap.errors).length, `${tag}26 laptop console clean ${realErrors(lap.errors).join(' ;; ')}`);
  ok(!realErrors(phone.errors).length, `${tag}27 phone console clean ${realErrors(phone.errors).join(' ;; ')}`);
  await lap.ctx.close();
  await phone.ctx.close();
}

async function continueOnComputer() {
  console.log('\n(b) "Continue on my computer" still works in phone mode');
  const lap = await device(LAPTOP);
  const d = lap.page;
  await optIn(d);
  await d.goto(BASE + '/cid/continue-on-mobile/', { waitUntil: 'load' });
  await d.waitForSelector('[data-node-id="6156:60706"][data-qr-url]', { timeout: 10000 }).catch(() => {});
  ok(await d.locator('[data-node-id="6156:60706"][data-qr-url]').count(), 'bC1 the real QR is up');
  await hop(d, 'bC2 Continue on my computer', 'Continue on my computer', '/cid/terms/');
  ok(!realErrors(lap.errors).length, `bC3 console clean ${realErrors(lap.errors).join(' ;; ')}`);
  await lap.ctx.close();
}

/* ------------------------------------------------------------- (c) -- */
async function staticMode() {
  console.log(`\n(c) Static mode — ${STATIC_BASE}`);
  const lap = await device(LAPTOP);
  const d = lap.page;
  await d.goto(STATIC_BASE + '/cid/continue-on-mobile/', { waitUntil: 'networkidle' });
  await d.waitForTimeout(1200);
  ok(await d.locator('[data-node-id="6156:60706"] img[src="/assets/qr-mobile-handoff.svg"]').count(), 'c1 the placeholder QR is shown');
  ok(!(await d.locator('[data-qr-url], [data-handoff-status]').count()), 'c2 no real QR, no status line');
  await d.goto(STATIC_BASE + '/services/driver-vehicle/wallet/', { waitUntil: 'networkidle' });
  await d.waitForFunction(() => document.querySelector('[data-wallet-qr]')?.getAttribute('data-offer-id'), null, { timeout: 5000 }).catch(() => {});
  await d.waitForTimeout(800);
  const u = (await d.locator('[data-wallet-qr]').getAttribute('data-qr-url')) ?? '';
  ok(/\/wallet\/start\/\?offer=[^&]+$/.test(u), `c3 the C1 QR is today's URL, no room (${u})`);
  ok(!(await d.evaluate(() => localStorage.getItem('gnl-demo:room'))), 'c4 no room stored');
  ok(lap.api.length === 0, `c5 no /api request (${lap.api.join(', ') || 'none'})`);
  ok(!realErrors(lap.errors).length, `c6 console clean ${realErrors(lap.errors).join(' ;; ')}`);

  /* Phone mode left ON in this browser, but the build served statically. */
  await d.evaluate(() => localStorage.setItem('gnl-demo:phone-mode', 'on'));
  await d.goto(STATIC_BASE + '/cid/continue-on-mobile/', { waitUntil: 'networkidle' });
  await d.waitForTimeout(1500);
  ok(await d.locator('[data-node-id="6156:60706"] img[src="/assets/qr-mobile-handoff.svg"]').count(), 'c7 phone mode on + static server: still the placeholder');
  await d.goto(STATIC_BASE + '/demo/phone/', { waitUntil: 'networkidle' });
  await d.waitForSelector('[data-phone-mode-panel="absent"]', { timeout: 5000 }).catch(() => {});
  ok(await d.locator('[data-phone-mode-panel="absent"]').count(), 'c8 /demo/phone/ explains the server is needed');
  await lap.ctx.close();
}

/* ------------------------------------------------------------- (p) -- */
/** Every file in out/ as a URL path, plus the route forms a browser asks for. */
function staticPaths() {
  const root = new URL('../out/', import.meta.url).pathname;
  const out = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else out.push('/' + relative(root, full).split(sep).join('/'));
    }
  };
  walk(root);
  const extra = [];
  for (const f of out) {
    if (f.endsWith('/index.html')) {
      const dir = f.slice(0, -'index.html'.length);
      extra.push(dir, dir === '/' ? '/' : dir.slice(0, -1));
    } else if (f.endsWith('.html')) extra.push(f.slice(0, -5));
  }
  return [...new Set([...out, ...extra, '/nope', '/nope/', '/cid/nope/', '/wallet/start/?offer=x&room=y', '/%2e%2e/package.json', '/_next/', '/assets/'])];
}

const IGNORED_HEADERS = new Set(['date', 'connection', 'keep-alive']);
async function snap(base, p, init = {}) {
  const r = await fetch(base + p, { redirect: 'manual', ...init });
  const body = Buffer.from(await r.arrayBuffer());
  const headers = [...r.headers].filter(([k]) => !IGNORED_HEADERS.has(k)).sort().map(([k, v]) => `${k}: ${v}`).join('\n');
  return { status: r.status, headers, body: createHash('sha256').update(body).digest('hex') };
}

async function parity() {
  console.log(`\n(p) Static parity — demo-server vs serve, every file in out/ and edge cases`);
  const paths = staticPaths();
  const diffs = [];
  let n = 0;
  for (const p of paths) {
    const a = await snap(STATIC_BASE, p);
    const s = await snap(BASE, p);
    n++;
    if (a.status !== s.status || a.headers !== s.headers || a.body !== s.body) diffs.push(`${p} (${a.status} vs ${s.status})`);
  }
  ok(!diffs.length, `p1 ${n} paths: identical status, headers and bytes (${diffs.slice(0, 5).join(', ') || 'no difference'})`);
  const variants = [
    ['p2 gzip', '/', { headers: { 'accept-encoding': 'gzip, deflate, br' } }],
    ['p3 HEAD', '/dashboard/', { method: 'HEAD' }],
    ['p4 conditional GET (304)', '/', null],
    ['p5 range', '/assets/qr-mobile-handoff.svg', { headers: { range: 'bytes=0-9' } }],
    ['p6 404 page gzip', '/nope/', { headers: { 'accept-encoding': 'gzip' } }],
  ];
  for (const [label, p, init] of variants) {
    let opts = init;
    if (!opts) opts = { headers: { 'if-none-match': (await fetch(STATIC_BASE + p)).headers.get('etag') ?? '' } };
    const a = await snap(STATIC_BASE, p, opts);
    const s = await snap(BASE, p, opts);
    ok(a.status === s.status && a.headers === s.headers && a.body === s.body, `${label}: identical (${a.status})`);
  }
}

/* ------------------------------------------------------------- (d) -- */
async function api() {
  console.log('\n(d) API');
  const j = (r) => r.json().catch(() => null);
  const post = (p, body, headers = { 'content-type': 'application/json' }) =>
    fetch(BASE + p, { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });

  const h = await fetch(BASE + '/api/health');
  const hj = await j(h);
  ok(h.status === 200 && hj?.ok === true && typeof hj.publicUrl === 'string', `d1 /api/health -> {ok:true, publicUrl:"${hj?.publicUrl}"}`);
  ok((await fetch(BASE + '/api/rooms/NOT-A-ROOM')).status === 400, 'd2 bad room id -> 400');
  ok((await fetch(BASE + '/api/rooms/abc')).status === 400, 'd3 too-short room id -> 400');
  ok((await fetch(BASE + '/api/rooms/' + 'a'.repeat(33))).status === 400, 'd4 too-long room id -> 400');
  ok((await fetch(BASE + '/api/rooms/' + '0'.repeat(32))).status === 404, 'd5 unknown room -> 404');
  ok((await fetch(BASE + '/api/nope')).status === 404, 'd6 unknown /api route -> 404');
  ok((await fetch(BASE + '/api/rooms/' + '0'.repeat(32) + '/nope')).status === 404, 'd7 unknown room sub-route -> 404');
  ok((await fetch(BASE + '/api/rooms/x/y/z/w')).status === 404, 'd8 deep unknown path -> 404');
  ok((await fetch(BASE + '/api/rooms/..%2F..%2Fpackage.json')).status === 400, 'd9 traversal-looking id -> 400 (never touches files)');

  const made = await fetch(BASE + '/api/rooms', { method: 'POST' });
  const mj = await j(made);
  ok(made.status === 201 && new RegExp(`^${ROOM}$`).test(mj?.id ?? ''), 'd10 POST /api/rooms -> 201 + 128-bit hex id');
  const id = mj.id;
  ok((await post(`/api/rooms/${id}`, { patch: { x: 'a'.repeat(17 * 1024) } })).status === 413, 'd11 body over 16 KB -> 413');
  ok((await post(`/api/rooms/${id}`, 'x=1', { 'content-type': 'text/plain' })).status === 415, 'd12 non-JSON body -> 415');
  ok((await post(`/api/rooms/${id}`, '{bad', { 'content-type': 'application/json' })).status === 400, 'd13 invalid JSON -> 400');
  ok((await post(`/api/rooms/${id}`, { patch: { 'bad key!': 1 } })).status === 400, 'd14 invalid patch key -> 400');
  ok((await post(`/api/rooms/${id}`, { patch: [1] })).status === 400, 'd15 non-object patch -> 400');
  ok(
    (await post(`/api/rooms/${id}`, { patch: { a: 1 } }, { 'content-type': 'application/json', origin: 'http://evil.example' })).status === 403,
    'd16 cross-origin POST -> 403',
  );
  ok((await fetch(BASE + `/api/rooms/${id}`, { method: 'PUT' })).status === 405, 'd17 wrong method -> 405');
  const hh = (await fetch(BASE + '/api/health')).headers;
  ok(!hh.get('access-control-allow-origin') && hh.get('x-content-type-options') === 'nosniff' && hh.get('cache-control') === 'no-store', 'd18 no CORS; nosniff + no-store');
  ok((await post('/api/rooms/' + '0'.repeat(32), { patch: { a: 1 } })).status === 404, 'd19 POST to an unknown room -> 404 (rooms are only made by the server)');

  /* SSE: initial snapshot, then a pushed change, then the reset closes it. */
  const ctl = new AbortController();
  const es = await fetch(BASE + `/api/rooms/${id}/events`, { signal: ctl.signal });
  ok(es.status === 200 && (es.headers.get('content-type') ?? '').startsWith('text/event-stream'), 'd20 /events is text/event-stream');
  const reader = es.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  const nextEvent = async () => {
    const until = Date.now() + 4000;
    while (Date.now() < until) {
      const i = buf.indexOf('\n\n');
      if (i >= 0) {
        const chunk = buf.slice(0, i);
        buf = buf.slice(i + 2);
        const data = chunk.split('\n').find((l) => l.startsWith('data: '));
        if (data) return JSON.parse(data.slice(6));
        continue;
      }
      const { value, done } = await reader.read();
      if (done) return 'closed';
      buf += dec.decode(value, { stream: true });
    }
    return null;
  };
  const first = await nextEvent();
  ok(first?.version === 0, 'd21 SSE sends the current snapshot on connect');
  const pr = await post(`/api/rooms/${id}`, { by: 'checker-0001', patch: { idv: { status: 'waiting' } } });
  const prj = await j(pr);
  ok(pr.status === 200 && prj?.version === 1 && prj?.meta?.idv?.by === 'checker-0001', 'd22 POST patch bumps version and records meta {v, by}');
  const second = await nextEvent();
  ok(second?.version === 1 && second?.doc?.idv?.status === 'waiting', 'd23 SSE pushes the change');
  const nulled = await j(await post(`/api/rooms/${id}`, { patch: { idv: null } }));
  ok(nulled?.version === 2 && !('idv' in (nulled?.doc ?? {})), 'd24 null deletes a key');
  await nextEvent();
  ok((await fetch(BASE + `/api/rooms/${id}`, { method: 'DELETE' })).status === 204, 'd25 DELETE -> 204');
  ok((await nextEvent()) === 'closed', 'd26 DELETE closes the room\'s event stream');
  ok((await roomStatus(id)) === 404, 'd27 the deleted room is gone (404)');
  ctl.abort();
}

try {
  if (PARTS.has('d')) await api();
  if (PARTS.has('o')) await optInCheck();
  if (PARTS.has('a')) await flow3();
  if (PARTS.has('r')) await declineAndReset();
  if (PARTS.has('b')) {
    await idv('driver-vehicle');
    await idv('studentaid');
    await continueOnComputer();
  }
  if (PARTS.has('c')) {
    if (STATIC_BASE) await staticMode();
    else console.log('\n(c) SKIP — set STATIC_BASE_URL to a plain `npx serve out` to run the static-mode check');
  }
  if (PARTS.has('p')) {
    if (STATIC_BASE) await parity();
    else console.log('\n(p) SKIP — set STATIC_BASE_URL to a plain `npx serve out` to run the parity check');
  }
} catch (e) {
  ok(false, `crashed: ${e?.stack ?? e}`);
} finally {
  await b.close();
}

const failed = results.filter(([pass]) => !pass);
console.log(`\n${results.length - failed.length}/${results.length} checks passed against ${BASE}${STATIC_BASE ? ` (+ static ${STATIC_BASE})` : ''}`);
console.log(failed.length ? 'PHONE: FAIL' : 'PHONE: PASS');
process.exit(failed.length ? 1 : 0);
