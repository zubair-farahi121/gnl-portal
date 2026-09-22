/*
 * Click-through gate.
 *
 * Twice in this project a control shipped looking perfect and doing nothing —
 * the wizard's Cancel / Back / Continue, then the whole top nav and Log Out —
 * and both times the user found it, not a test. This walks the demo's happy
 * path and asserts each control actually lands on the route it should.
 *
 * It runs at 1440, 768 and 390 because the responsive pass reorders and
 * rewraps the nav on small screens; a link can work at desktop width and be
 * covered or detached at phone width.
 *
 * Needs the static build served first (WITHOUT `serve -s`, which rewrites
 * every route to index.html):  npm run build && npm run serve
 * Then:                        npm run clicks
 */
import { chromium } from 'playwright';
const b = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_PATH ??
    '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
});
const BASE = process.env.DEMO_BASE_URL ?? 'http://127.0.0.1:4173';
const fails=[];
async function run(width){
  const ctx=await b.newContext({viewport:{width,height:900}});
  const p=await ctx.newPage();
  const step=async(label,action,expect)=>{
    await action(p);
    await p.waitForTimeout(400);
    const u=new URL(p.url()).pathname;
    if(!u.startsWith(expect)) fails.push(`@${width} ${label}: expected ${expect} got ${u}`);
  };
  await p.goto(BASE+'/',{waitUntil:'networkidle'});
  await step('Log in', pg=>pg.getByRole('link',{name:'Log in'}).click(), '/dashboard');
  await step('Driver and Vehicle card', pg=>pg.getByRole('link',{name:/Driver and Vehicle/}).first().click(), '/services/driver-vehicle');
  await step('Onboard', pg=>pg.getByRole('link',{name:'Onboard'}).click(), '/services/driver-vehicle/onboard');
  await step('Continue', pg=>pg.getByRole('link',{name:'Continue'}).click(), '/cid/terms');
  await step('I agree', pg=>pg.getByRole('link',{name:'I agree'}).click(), '/cid/biometric');
  await p.goto(BASE+'/services/driver-vehicle/onboard/',{waitUntil:'networkidle'});
  await step('Back', pg=>pg.getByRole('link',{name:'Back'}).click(), '/services/driver-vehicle');
  await p.goto(BASE+'/services/driver-vehicle/onboard/',{waitUntil:'networkidle'});
  await step('Cancel', pg=>pg.getByRole('link',{name:'Cancel'}).click(), '/services/driver-vehicle');
  await p.goto(BASE+'/dashboard/',{waitUntil:'networkidle'});
  await step('Log Out', pg=>pg.getByRole('link',{name:'Log Out'}).click(), '/');
  await p.goto(BASE+'/dashboard/',{waitUntil:'networkidle'});
  await step('Nav Services', pg=>pg.getByRole('link',{name:'Services'}).first().click(), '/dashboard');
  await ctx.close();
}
for(const w of [1440,768,390]) await run(w);
await b.close();
console.log(fails.length?'CLICK FAILURES:\n'+fails.join('\n'):'click-through: all links work at 1440 / 768 / 390');
if (fails.length) process.exit(1);
