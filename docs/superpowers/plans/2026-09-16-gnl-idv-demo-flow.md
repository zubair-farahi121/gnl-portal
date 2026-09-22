# GNL / C1 IDV Demo Flow — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pixel-exact, clickable web prototype of the GNL "Driver and Vehicle" service onboarding flow with CertifiO ID (CID) identity verification, hosted on a public URL for the client demo.

**Architecture:** A statically-exported Next.js App Router site. One route per Figma frame, all content hardcoded in a single data module, flow state held in a tiny React context persisted to `sessionStorage`. Visual fidelity is enforced by an automated pixel-diff gate that compares every built page against a PNG exported from Figma — that gate, not a human eyeball, is the definition of "looks exact like this".

**Tech Stack:** Next.js 15 (App Router, `output: 'export'`), React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Lato (Google Fonts), Playwright + pixelmatch for visual regression, Vercel for hosting.

**Source of truth:** Figma `C1 | GNL - R3`, file key `Dc1bPoXX1VoB9v1MtLvu8e`, page `6031:5860` ("CerifiO ID integration"), section `6145:58450` ("Driver's License - Integrating IDV into C1").

**Business context:** [Demo to GNL: IDV Integration to C1 / Trust Platform](https://portagecybertech.atlassian.net/wiki/spaces/IDV/pages/4917002375/Demo+to+GNL+IDV+Integration+to+C1+Trust+Platform) — demo day tentatively **Oct 9, 2026**; Figma mockups due from Tatyana Poirier **Sept 21, 2026**.

---

## Requirements Restatement

What we are building, in plain terms:

1. A website that reproduces **ten screen layouts** from the Figma flow so closely that a viewer cannot tell it apart from the mockup.
2. The screens are **clickable in sequence** — the presenter clicks through the story: sign in → find the service → try to onboard → verify identity with CID on a phone → come back verified → see their licence, vehicle and reminders.
3. **All data is hardcoded.** No backend, no database, no real IDV call, no real token.
4. It is **deployed to a public URL** the client can open on Oct 9.

What we are **not** building in this version (explicitly out of scope, per the scoping decision):

- The Yoti provider sub-section (`6088:32338`)
- `driver-vehicle-mobile` (`6097:23625`) and `digital-wallet-mobile` (`6107:27550`)
- Error, timeout and IDV-failure branches
- Responsive / tablet / mobile-browser layouts of the desktop screens
- Any real API, auth, or persistence

### Screen inventory (the happy path)

| # | Route | Figma node | Size (px) | What it shows |
|---|---|---|---|---|
| 1 | `/` | `6031:5865` `mygovnl-login-page` | 1440 × 1880 | Public MyGovNL landing: hero, "Things you can do here" 3-column grid, "How can we help?" accordion |
| 2 | `/dashboard` | `6031:5974` `mygovnl-services-dashboard` | 1440 × 1864 | "Welcome Jason Momoa!", search, Favourite Services, All Services 3-column grid |
| 3 | `/services/driver-vehicle` | `6031:6244` `driver-vehicle-service-page` | 1440 × 1038 | Service page, **unverified**: breadcrumb, title + badge, verification-card, right sidebar (favourite / data-privacy / contact) |
| 4 | `/services/driver-vehicle/onboard` | `6031:6304` `driver-vehicle-prerequisite-check` | 1440 × 1202 | Wizard card 820 wide: prerequisite check, stepper, actions row |
| 5 | `/cid/welcome` | `6039:6580` `CID_Welcome` | 393 × 1087 | Mobile: "Welcome to GNL Identity Verification Service" |
| 6 | `/cid/terms` | `6039:11307` `CID_TU` | 393 × 871 | Mobile: Terms of Use + Back / Continue |
| 7 | `/cid/biometric` | `6049:12226` `CID_Biometric` | 393 × 895 | Mobile: Biometric consent |
| 8 | `/cid/verified` | `6062:22540` `CID_ID1` | 393 × 1051 | Mobile: "Your identity has been verified" + Continue |
| 9 | `/auth/loading` | `6158:69596` `gnl-vc-login-loading` | 1440 × 1024 | Desktop: AuthLoadingCard 520 × 422 — spinner, message, security footer |
| 10 | `/services/driver-vehicle/confirmation` | `6102:101144` `driver-vehicle-confirmation` | 1440 × 1024 | Wizard card 820 × 370: "Success!" + "Go to Service Driver's License Renewal" |
| 11 | `/services/driver-vehicle?verified=1` | `6065:23367` `driver-vehicle-service-page` | 1440 × 1671 | Service page, **verified**: linked items in left column, licence card in sidebar |

Eleven routes, ten distinct layouts (#3 and #11 are two states of one page).

---

## Global Constraints

Every task's requirements implicitly include this section. Values below are **verbatim from Figma** (`get_design_context` on node `6102:101147`) — do not round, re-derive, or "improve" them.

**Typography — Lato only**

| Token | Value |
|---|---|
| Family | `Lato` — weights 400 (Regular), 500 (Medium), 700 (Bold) |
| Default line-height | `1.5` |
| Button line-height | `normal` |
| Section title | `28px` / Bold |
| Wizard title | `24px` / Bold |
| Outline button label | `16px` / Bold |
| Body copy | `15px` / Regular |
| Primary button label | `14px` / Bold |
| Stepper label | `12px` / Medium (Bold when active) |

**Colour**

| Token | Hex | Used for |
|---|---|---|
| `--gnl-primary` | `#243746` | Primary button fill, stepper bar, outline-button border and label |
| `--gnl-heading` | `#212326` | Headings (Figma variable: `GNL heading`) |
| `--gnl-text` | `#5f6368` | Body copy, stepper labels (already a CSS var in the Figma export) |
| `--gnl-border` | `#e0e4e6` | Card borders |
| `--gnl-surface` | `#ffffff` | Card and page background (Figma variable: `light-100`) |
| `--gnl-danger` | *extract in Task 19* | `red-dot` on expired-registration badges |

**Shape and elevation**

- Card radius `6px`; primary-button radius `4px`; outline-button radius `6px`; stepper bar radius `4px`
- Card shadow: `drop-shadow(0px 4px 12px rgba(0,0,0,0.03))`
- Card padding `40px`; card inner gaps `32px` / `24px`; text-block gap `8px`; stepper gap `12px`
- Figma spacing variables present: `space/4 = 24`, `space/5 = 32`

**Layout**

- Desktop canvas is a **fixed 1440px**. The Figma file defines no breakpoints, so **do not invent responsive behaviour.** Set `min-width: 1440px` on the desktop shell and let the browser scroll horizontally below that. Inventing a responsive layout is the single easiest way to fail the pixel gate.
- Desktop top nav: `1440 × 69`. Login-page header: `1440 × 128`. Desktop footer (`footer verified`): `1440 × 140.215`.
- Mobile CID canvas is `393px` wide (iPhone 14/15 Pro). Mobile top nav `393 × 145`, mobile footer `393 × 265.81`.
- Desktop wizard card is `820px` wide, positioned at `x = 310` inside the 1440 canvas.

**Stepper**

Four steps, in this order, with this exact copy: `Summary` → `Terms and Conditions` → `Prerequisite Check` → `Ready to Use`. Bar height `8px`, fill colour `#243746`.

**Copy**

All visible strings must be copied character-for-character from Figma, including the typographic apostrophe in `it's`, `Driver's` and `Driver's License Renewal` (U+2019, not `'`). A straight apostrophe is a pixel-gate failure.

**Known design inconsistency — reproduce, do not fix:** the outline button (`btn-back`) has radius `6px` while the primary button (`ContinueButton`) has radius `4px`. Reproduce both exactly and raise it with Tatyana separately. Never "harmonise" the design in code.

---

## File Structure

```
.
├── docs/superpowers/plans/2026-09-16-gnl-idv-demo-flow.md   ← this file
├── design/
│   ├── frames.json              # node-id → route → size manifest (the freeze record)
│   ├── baselines/               # PNGs exported from Figma, committed
│   ├── assets/                  # icons/images exported from Figma, committed
│   └── token-exceptions.md      # every deviation, for Tatyana
├── scripts/
│   ├── fetch-baselines.ts       # Figma REST → design/baselines/*.png
│   └── visual-diff.ts           # pixelmatch compare + report
├── tests/visual/
│   ├── screens.spec.ts          # one screenshot per route
│   └── copy.spec.ts             # verbatim-string assertions
├── src/
│   ├── app/
│   │   ├── layout.tsx           # <html>, Lato, token CSS, DemoStateProvider
│   │   ├── globals.css          # design tokens + base
│   │   ├── page.tsx                                      # screen 1
│   │   ├── dashboard/page.tsx                            # screen 2
│   │   ├── services/driver-vehicle/page.tsx              # screens 3 + 11
│   │   ├── services/driver-vehicle/onboard/page.tsx      # screen 4
│   │   ├── services/driver-vehicle/confirmation/page.tsx # screen 10
│   │   ├── cid/welcome/page.tsx                          # screen 5
│   │   ├── cid/terms/page.tsx                            # screen 6
│   │   ├── cid/biometric/page.tsx                        # screen 7
│   │   ├── cid/verified/page.tsx                         # screen 8
│   │   └── auth/loading/page.tsx                         # screen 9
│   ├── components/
│   │   ├── chrome/   TopNav.tsx  LoginHeader.tsx  SiteFooter.tsx
│   │   ├── mobile/   PhoneFrame.tsx  MobileTopNav.tsx
│   │   ├── wizard/   WizardCard.tsx  WizardHeader.tsx  ProgressStepper.tsx
│   │   ├── ui/       BtnPrimary.tsx  BtnOutline.tsx
│   │   ├── service/  ServiceCard.tsx  LinkedItemCard.tsx  ReminderCard.tsx
│   │   └── DemoNav.tsx
│   └── lib/
│       ├── demo-data.ts         # ALL hardcoded content
│       ├── demo-state.tsx       # verified flag + reset, sessionStorage-backed
│       ├── flow.ts              # ordered route list for prev/next
│       └── assets.ts            # local asset index
├── next.config.ts
├── playwright.config.ts
└── package.json
```

**Why this split:** files that change together live together. Each Figma frame maps to exactly one `page.tsx`, so a designer change to one frame touches one file. Shared chrome is extracted only where it is genuinely a reused instance in Figma (`top-nav actions`, `footer verified`, `wizard-header`) — do not invent abstractions Figma does not have.

---

## Patterns to Mirror

The target repo (`~/Documents/Devloper/GNL`) currently contains only `.git` and a 13-byte `README.md`. **There are no existing conventions to mirror — this is a greenfield repo.** Do not invent a pattern and claim it came from the codebase. The conventions established in Task 1 become the pattern for everything after it.

---

## Complexity

**MEDIUM–LARGE.** Ten distinct layouts, ~15 shared components, a visual-diff harness, and a deployment. Rough shape, assuming one developer working with `get_design_context` per screen:

| Phase | Effort |
|---|---|
| Phase 0 — Foundation | 6–8 h |
| Phase 1 — Shared chrome | 6–8 h |
| Phase 2 — Desktop screens | 10–14 h |
| Phase 3 — CID mobile screens | 6–8 h |
| Phase 4 — Return + end state | 8–10 h |
| Phase 5 — Flow + delivery | 5–7 h |
| **Total** | **41–55 h** |

Against an Oct 9 demo with designs landing Sept 21, this fits — but only if Phase 0 and Phase 1 are done **before** Sept 21 against the current draft, so that post-freeze work is screen content only.

---

## Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | **Figma is still being edited until Sept 21.** Pixel-exactness against a moving target means rework. | HIGH | HIGH | Do Phase 0–1 now; freeze on a dated version on Sept 21 and record it in `design/frames.json`; re-export baselines once, in one commit, and treat any later change as a scoped change request. |
| R2 | **Almost no Figma variables exist** (only five across the file), so tokens are raw hex scattered per-frame and may be inconsistent between frames. | HIGH | MEDIUM | Task 3 extracts tokens once into `globals.css`. When a frame uses an off-token value, reproduce it exactly with an arbitrary Tailwind value **and log it** in `design/token-exceptions.md` for Tatyana. |
| R3 | **Two competing "end state" frames exist:** `6065:23367` (service page, verified) on the flow page and `6076:24415` (`driver-vehicle-dashboard`) on page `0:1`. Building the wrong one wastes a day. | MEDIUM | MEDIUM | **Open question O1 below — resolve before Task 19.** Plan assumes `6065:23367`. |
| R4 | **The CID screens are 393px mobile** but the demo runs on a laptop. How the handoff is presented is undecided. | MEDIUM | MEDIUM | **Open question O2.** Plan assumes a centred 393px column, no invented bezel. |
| R5 | **Public URL + realistic GNL branding** could be mistaken for the real MyGovNL portal, or indexed by search engines. | MEDIUM | HIGH | Task 22: Vercel deployment protection (password), `noindex` meta + `robots.txt` disallow, and a persistent "DEMO — not a live government service" marker. **Open question O3** on the marker's visibility. |
| R6 | **The mockups contain realistic personal data** — `IAN B GARLAND`, licence `G470114011`, plate `JKM 026`, VIN `2G1125535F9268441`. If any of it is real or resembles a real record, publishing it is a problem. | MEDIUM | HIGH | Task 20 confirms with Tatyana / André-Claude that the data is synthetic before deploy. If unconfirmed, substitute clearly-fake values and note the deviation. |
| R7 | **Figma seat is View-only.** Design fixes must round-trip through Tatyana. | CERTAIN | LOW | Batch design questions into one list rather than pinging per screen. |
| R8 | **The GNL folder does not mount in the local device shell** (verified Sept 16 — `mnt/GNL failed to mount`). Builds must run in the cloud container and be committed back. | CERTAIN | LOW | Develop in the container; use `device_commit_files` to land results. Re-test the mount once; if it recovers, work locally instead. |
| R9 | Static export breaks if any screen needs a server feature. | LOW | MEDIUM | All data is hardcoded; `output: 'export'` is validated in Task 1, so a violation fails the build immediately rather than at deploy. |

---

## Open Questions — resolve before the marked task

- **O1 (before Task 19):** Is the verified end state `6065:23367` (service page with linked items in the left column) or `6076:24415` (`driver-vehicle-dashboard`, the tabbed Actions / Notifications / Terms of use / Unlink service layout on page `0:1`)? They are different designs. *Ask Tatyana.*
- **O2 (before Task 8):** How should the CID mobile step be presented on a laptop — a plain 393px column, a phone device mock on a dimmed desktop backdrop, or a QR-code handoff screen? *Ask Tatyana / André-Claude.*
- **O3 (before Task 22):** How prominent must the "this is a demo" marker be? A discreet corner badge protects the demo's realism; a full banner protects against misidentification. *Ask André-Claude / Bob.*
- **O4 (before Task 20):** Is the personal data in the mockups synthetic? *Ask Tatyana.*

---

# Phase 0 — Foundation

### Task 1: Scaffold the Next.js app with tokens and Lato

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`
- Create: `.gitignore`, `.env.local.example`

**Interfaces:**
- Consumes: nothing (first task)
- Produces: a working `npm run build` producing static output in `out/`; CSS custom properties `--gnl-primary`, `--gnl-heading`, `--gnl-text`, `--gnl-border`, `--gnl-surface`; the Lato font stack available globally

- [ ] **Step 1: Scaffold**

```bash
cd ~/Documents/Devloper/GNL
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-eslint --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Force static export**

Replace `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

- [ ] **Step 3: Write the design tokens**

Replace the top of `src/app/globals.css` (keep `@import "tailwindcss";` first):

```css
@import "tailwindcss";

:root {
  --gnl-primary: #243746;
  --gnl-heading: #212326;
  --gnl-text: #5f6368;
  --gnl-border: #e0e4e6;
  --gnl-surface: #ffffff;

  --gnl-radius-card: 6px;
  --gnl-radius-btn: 4px;
  --gnl-shadow-card: 0px 4px 12px rgba(0, 0, 0, 0.03);

  --gnl-space-4: 24px;
  --gnl-space-5: 32px;
}

@theme inline {
  --color-gnl-primary: var(--gnl-primary);
  --color-gnl-heading: var(--gnl-heading);
  --color-gnl-text: var(--gnl-text);
  --color-gnl-border: var(--gnl-border);
  --color-gnl-surface: var(--gnl-surface);
}

html, body {
  background: var(--gnl-surface);
  color: var(--gnl-text);
}

/* The Figma file has no breakpoints. Desktop screens are a fixed 1440 canvas. */
.gnl-desktop-shell {
  min-width: 1440px;
  width: 1440px;
  margin: 0 auto;
}
```

- [ ] **Step 4: Load Lato**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "MyGovNL — Demo",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={lato.variable}>
      <body style={{ fontFamily: "var(--font-lato), sans-serif", lineHeight: 1.5 }}>
        {children}
      </body>
    </html>
  );
}
```

> **Note on Lato Medium (500):** `next/font/google` exposes Lato at 100/300/400/700/900 — there is **no 500**. The stepper labels use Lato Medium. Task 21 Step 3 resolves this: if 400 is visibly too light against the baseline, self-host Lato Medium from the [Lato webfont package](https://www.latofonts.com/) into `public/fonts/` and register it with `next/font/local`. Do not fake it with `font-weight: 500` on a 400 face — synthetic weights will fail the pixel diff.

- [ ] **Step 5: Verify the build is genuinely static**

```bash
npm run build
ls out/index.html
```

Expected: build succeeds, `out/index.html` exists. If Next errors with "output: export does not support …", a server feature crept in — remove it, do not relax the config.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js static demo app with GNL design tokens and Lato"
```

---

### Task 2: Build the visual-diff harness

This is the task that makes "pixel-exact" a fact rather than an opinion. Everything after it is gated by it.

**Files:**
- Create: `design/frames.json`, `scripts/fetch-baselines.ts`, `scripts/visual-diff.ts`, `playwright.config.ts`, `tests/visual/screens.spec.ts`
- Modify: `package.json` (scripts + devDependencies), `.gitignore`

**Interfaces:**
- Consumes: Task 1's `npm run build`
- Produces: `npm run baselines` (Figma → `design/baselines/<id>.png`), `npm run visual` (build + screenshot + diff), and a non-zero exit when any route exceeds its pixel budget

- [ ] **Step 1: Install dependencies**

```bash
npm i -D @playwright/test pixelmatch pngjs serve tsx dotenv
npx playwright install chromium
```

- [ ] **Step 2: Write the frame manifest**

Create `design/frames.json`. This doubles as the **design freeze record** — `figmaVersion` is filled in at freeze time (Task 3).

```json
{
  "fileKey": "Dc1bPoXX1VoB9v1MtLvu8e",
  "figmaVersion": "UNFROZEN",
  "frames": [
    { "id": "login",            "node": "6031:5865",   "route": "/",                                      "width": 1440, "height": 1881, "budget": 0.008 },
    { "id": "dashboard",        "node": "6031:5974",   "route": "/dashboard/",                            "width": 1440, "height": 1865, "budget": 0.008 },
    { "id": "service",          "node": "6031:6244",   "route": "/services/driver-vehicle/",              "width": 1440, "height": 1039, "budget": 0.008 },
    { "id": "onboard",          "node": "6031:6304",   "route": "/services/driver-vehicle/onboard/",      "width": 1440, "height": 1203, "budget": 0.008 },
    { "id": "cid-welcome",      "node": "6039:6580",   "route": "/cid/welcome/",                          "width": 393,  "height": 1087, "budget": 0.008 },
    { "id": "cid-terms",        "node": "6039:11307",  "route": "/cid/terms/",                            "width": 393,  "height": 871,  "budget": 0.008 },
    { "id": "cid-biometric",    "node": "6049:12226",  "route": "/cid/biometric/",                        "width": 393,  "height": 895,  "budget": 0.008 },
    { "id": "cid-verified",     "node": "6062:22540",  "route": "/cid/verified/",                         "width": 393,  "height": 1051, "budget": 0.008 },
    { "id": "auth-loading",     "node": "6158:69596",  "route": "/auth/loading/",                         "width": 1440, "height": 1024, "budget": 0.008 },
    { "id": "confirmation",     "node": "6102:101144", "route": "/services/driver-vehicle/confirmation/", "width": 1440, "height": 1024, "budget": 0.008 },
    { "id": "service-verified", "node": "6065:23367",  "route": "/services/driver-vehicle/?verified=1",   "width": 1440, "height": 1672, "budget": 0.008 }
  ]
}
```

- [ ] **Step 3: Write the baseline fetcher**

Create `scripts/fetch-baselines.ts`:

```ts
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import "dotenv/config";

const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN) throw new Error("FIGMA_TOKEN missing. Put it in .env.local (never commit it).");

type Frame = { id: string; node: string };
const manifest = JSON.parse(readFileSync("design/frames.json", "utf8"));
const frames: Frame[] = manifest.frames;

async function main() {
  mkdirSync("design/baselines", { recursive: true });
  const ids = frames.map((f) => f.node).join(",");
  const url = `https://api.figma.com/v1/images/${manifest.fileKey}?ids=${encodeURIComponent(ids)}&format=png&scale=2`;

  const res = await fetch(url, { headers: { "X-Figma-Token": TOKEN! } });
  if (!res.ok) throw new Error(`Figma images API ${res.status}: ${await res.text()}`);
  const { images } = (await res.json()) as { images: Record<string, string | null> };

  for (const f of frames) {
    const src = images[f.node];
    if (!src) throw new Error(`No render returned for ${f.id} (${f.node})`);
    const png = await fetch(src);
    writeFileSync(`design/baselines/${f.id}.png`, Buffer.from(await png.arrayBuffer()));
    console.log(`baseline ${f.id} <- ${f.node}`);
  }
}

main();
```

> **Credentials:** the Figma personal access token is **yours to create and paste** into `.env.local` (Figma → Settings → Security → Personal access tokens, scope `file_content:read`). Add `.env.local` to `.gitignore` in this same commit. Never commit the token, never paste it into a plan or a chat.

- [ ] **Step 4: Write the diff script**

Create `scripts/visual-diff.ts`:

```ts
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const manifest = JSON.parse(readFileSync("design/frames.json", "utf8"));
mkdirSync("design/diffs", { recursive: true });

let failed = false;

for (const f of manifest.frames) {
  const basePath = `design/baselines/${f.id}.png`;
  const shotPath = `design/shots/${f.id}.png`;
  if (!existsSync(basePath) || !existsSync(shotPath)) {
    console.log(`SKIP  ${f.id} (missing baseline or shot)`);
    failed = true;
    continue;
  }

  const base = PNG.sync.read(readFileSync(basePath));
  const shot = PNG.sync.read(readFileSync(shotPath));

  // Compare on the intersection; a size mismatch is itself a failure signal.
  const w = Math.min(base.width, shot.width);
  const h = Math.min(base.height, shot.height);
  if (base.width !== shot.width || base.height !== shot.height) {
    console.log(`SIZE  ${f.id}: baseline ${base.width}x${base.height} vs build ${shot.width}x${shot.height}`);
    failed = true;
  }

  const diff = new PNG({ width: w, height: h });
  const differing = pixelmatch(base.data, shot.data, diff.data, w, h, { threshold: 0.1 });
  writeFileSync(`design/diffs/${f.id}.png`, PNG.sync.write(diff));

  const ratio = differing / (w * h);
  const verdict = ratio <= f.budget ? "PASS" : "FAIL";
  if (verdict === "FAIL") failed = true;
  console.log(`${verdict}  ${f.id}  ${(ratio * 100).toFixed(3)}% differing (budget ${(f.budget * 100).toFixed(1)}%)`);
}

process.exit(failed ? 1 : 0);
```

- [ ] **Step 5: Write the Playwright screenshot spec**

Create `playwright.config.ts`:

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "tests/visual",
  use: { baseURL: "http://localhost:4173", deviceScaleFactor: 2 },
  webServer: {
    command: "npx serve out -l 4173",
    url: "http://localhost:4173",
    reuseExistingServer: true,
  },
});
```

Create `tests/visual/screens.spec.ts`:

```ts
import { test } from "@playwright/test";
import { readFileSync, mkdirSync } from "node:fs";

const manifest = JSON.parse(readFileSync("design/frames.json", "utf8"));
mkdirSync("design/shots", { recursive: true });

for (const f of manifest.frames) {
  test(`shot ${f.id}`, async ({ page }) => {
    await page.setViewportSize({ width: f.width, height: Math.min(f.height, 2000) });
    await page.goto(f.route);
    await page.evaluate(() => document.fonts.ready);
    // Freeze animation so the spinner does not make the diff flaky,
    // and hide the demo marker so it does not alter every comparison.
    await page.addStyleTag({
      content: `*,*::before,*::after{animation:none!important;transition:none!important}
                [data-demo-marker]{display:none!important}`,
    });
    await page.waitForTimeout(300);
    await page.screenshot({ path: `design/shots/${f.id}.png`, fullPage: true });
  });
}
```

- [ ] **Step 6: Wire the scripts**

Add to `package.json`:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "baselines": "tsx scripts/fetch-baselines.ts",
  "shots": "playwright test tests/visual/screens.spec.ts",
  "diff": "tsx scripts/visual-diff.ts",
  "visual": "npm run build && npm run shots && npm run diff"
}
```

- [ ] **Step 7: Prove the harness fails loudly**

```bash
npm run visual; echo "exit: $?"
```

Expected: `SKIP` lines for every frame and `exit: 1`. **A harness that passes when nothing is built is broken** — confirm it fails before trusting it.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "test: add Figma baseline fetch and pixel-diff visual regression harness"
```

---

### Task 3: Freeze the design and capture baselines

**Files:**
- Modify: `design/frames.json` (set `figmaVersion`)
- Create: `design/baselines/*.png` (11 files), `design/token-exceptions.md`

**Interfaces:**
- Consumes: Task 2's `npm run baselines`
- Produces: eleven committed baseline PNGs at 2× scale; a recorded Figma version id that every later diff is measured against

- [ ] **Step 1: Agree the freeze with Tatyana**

Send one message: *"I'm freezing the C1 | GNL - R3 mockups for the demo build. Confirm the version I should build against, and let me know when a change needs to land after that."* Do not proceed on assumption — R1 is the top risk in this plan.

- [ ] **Step 2: Record the frozen version**

In Figma: File → **Show version history** → copy the id of the named version. Set it in `design/frames.json`:

```json
"figmaVersion": "<paste version id here>"
```

- [ ] **Step 3: Fetch baselines**

```bash
npm run baselines
ls -1 design/baselines | wc -l
```

Expected: `11`.

- [ ] **Step 4: Confirm the harness now fails for the right reason**

```bash
npm run visual; echo "exit: $?"
```

Expected: `exit: 1`, with `FAIL` or `SIZE` on every frame (nothing is built yet). This is the correct starting state.

- [ ] **Step 5: Start the exceptions log**

Create `design/token-exceptions.md`:

```markdown
# Token exceptions

Values found in Figma that do not match the token set in `globals.css`.
Reproduced exactly in code; listed here for Tatyana to reconcile in the design file.

| Frame | Node | Property | Figma value | Nearest token | Notes |
|---|---|---|---|---|---|
| confirmation | 6102:101190 | border-radius | 6px | --gnl-radius-btn (4px) | btn-back and ContinueButton disagree |
```

- [ ] **Step 6: Commit**

```bash
git add design .gitignore
git commit -m "chore: freeze Figma version and capture visual baselines"
```

---

### Task 4: Export design assets

**Files:**
- Create: `design/assets/**`, `public/assets/**`, `src/lib/assets.ts`

**Interfaces:**
- Consumes: the frozen file from Task 3
- Produces: every icon, logo and image referenced by the eleven frames, committed as local files under `public/assets/`, plus a typed `ASSETS` map

- [ ] **Step 1: Download assets from Figma**

Use the Figma MCP `download_assets` tool against section `6145:58450`, writing into `design/assets/`. Remote Figma asset URLs expire in about seven days — **the committed build must reference local files only.** A page that renders from an expiring URL will be blank on demo day.

- [ ] **Step 2: Copy into the public tree and index them**

```bash
mkdir -p public/assets && cp -R design/assets/* public/assets/
```

Create `src/lib/assets.ts`:

```ts
export const ASSETS = {
  mygovnlLogo: "/assets/mygovnl-logo.svg",
  certifioLogo: "/assets/certifio.svg",
  iconUser: "/assets/icon-user.svg",
  iconMapPin: "/assets/icon-map-pin.svg",
  iconTruck: "/assets/icon-truck.svg",
  iconAlertCircle: "/assets/icon-alert-circle.svg",
  iconExternalLink: "/assets/icon-external-link.svg",
  iconChevronDown: "/assets/icon-chevron-down.svg",
} as const;
```

Adjust the keys to the filenames actually returned — do not invent assets that did not download, and do not leave a key pointing at a file that is not there.

- [ ] **Step 3: Verify nothing remote remains**

```bash
ls -1 public/assets | wc -l
grep -r "figma.com" src/ public/ && echo "REMOTE URL FOUND - fix before committing" || echo "no remote figma URLs - good"
```

Expected: a non-zero file count and the "good" message.

- [ ] **Step 4: Commit**

```bash
git add design/assets public/assets src/lib/assets.ts
git commit -m "chore: export Figma assets and add local asset index"
```

---

# Phase 1 — Shared Chrome

Every screen task below follows the same rhythm, stated once here and referenced by each task:

> **The per-screen loop.**
> 1. Invoke the `figma-design-to-code` skill.
> 2. Call `get_design_context` with the task's `nodeId` and `fileKey=Dc1bPoXX1VoB9v1MtLvu8e`, passing `skillNames: "resource:figma-design-to-code"`.
> 3. Adapt the returned React+Tailwind reference into the project's component structure — reuse existing components from `src/components/`, map raw hex to the tokens in `globals.css`, and log any value that does not match a token in `design/token-exceptions.md`.
> 4. Render every icon from `ASSETS`, never redrawn or placeholdered, preserving both outer box and inner leaf dimensions.
> 5. Run the visual gate for that frame.
> 6. Commit.

### Task 5: SiteFooter ("footer verified")

**Files:**
- Create: `src/components/chrome/SiteFooter.tsx`

**Interfaces:**
- Consumes: `ASSETS` (Task 4), tokens (Task 1)
- Produces: `<SiteFooter variant="desktop" | "mobile" />` — desktop renders at exactly `1440 × 140.215`, mobile at `393 × 265.81`

- [ ] **Step 1: Pull the design context.** Follow the per-screen loop step 2 on node `6031:5972` (desktop `footer verified` instance), then repeat on `6039:9763` (the mobile instance) to capture the mobile variant.
- [ ] **Step 2: Implement both variants in one component** with a `variant` prop. Figma treats these as one component at two sizes; mirroring that keeps future design changes to one file.
- [ ] **Step 3: Set the height explicitly.** The footer is `140.215px` tall on desktop, not `140`. Use `h-[140.215px]`. Sub-pixel heights compound down an 1880px page and will push everything below out of alignment.
- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/SiteFooter.tsx
git commit -m "feat(chrome): add SiteFooter with desktop and mobile variants"
```

---

### Task 6: TopNav and LoginHeader

**Files:**
- Create: `src/components/chrome/TopNav.tsx`, `src/components/chrome/LoginHeader.tsx`

**Interfaces:**
- Consumes: `ASSETS`, tokens
- Produces: `<TopNav />` at exactly `1440 × 69`; `<LoginHeader />` at exactly `1440 × 128`

- [ ] **Step 1: Pull the design context** for node `6031:6245` (`top-nav actions`) and node `6031:5866` (`header`).
- [ ] **Step 2: Implement both.** These are two different components in Figma — the login page uses the taller `header`, every authenticated page uses `top-nav actions`. Do not merge them into one with a prop.
- [ ] **Step 3: Verify the heights** are exactly 69px and 128px in devtools before moving on.
- [ ] **Step 4: Commit**

```bash
git add src/components/chrome/
git commit -m "feat(chrome): add TopNav and LoginHeader"
```

---

### Task 7: Wizard primitives and buttons

**Files:**
- Create: `src/components/wizard/WizardCard.tsx`, `src/components/wizard/WizardHeader.tsx`, `src/components/wizard/ProgressStepper.tsx`
- Create: `src/components/ui/BtnPrimary.tsx`, `src/components/ui/BtnOutline.tsx`
- Create: `src/lib/demo-data.ts`

**Interfaces:**
- Consumes: tokens
- Produces:
  - `STEPPER_STEPS: readonly ["Summary", "Terms and Conditions", "Prerequisite Check", "Ready to Use"]`
  - `StepIndex = 0 | 1 | 2 | 3`
  - `<ProgressStepper current={StepIndex} />`
  - `<WizardHeader title={string} current={StepIndex} />`
  - `<WizardCard>{children}</WizardCard>` — 820px wide, `p-[40px]`, `gap-[32px]`, radius 6, border `#e0e4e6`, shadow `0px 4px 12px rgba(0,0,0,0.03)`
  - `<BtnPrimary onClick?>{label}</BtnPrimary>` — bg `#243746`, radius **4px**, `px-[24px] py-[10px]`, 14px Bold white
  - `<BtnOutline onClick?>{label}</BtnOutline>` — bg white, 1px border `#243746`, radius **6px**, `px-[20px] py-[10px]`, 16px Bold `#243746`

- [ ] **Step 1: Write the stepper data**

Create `src/lib/demo-data.ts`:

```ts
export const STEPPER_STEPS = [
  "Summary",
  "Terms and Conditions",
  "Prerequisite Check",
  "Ready to Use",
] as const;

export type StepIndex = 0 | 1 | 2 | 3;
```

- [ ] **Step 2: Implement ProgressStepper**

```tsx
import { STEPPER_STEPS, type StepIndex } from "@/lib/demo-data";

export function ProgressStepper({ current }: { current: StepIndex }) {
  const pct = ((current + 1) / STEPPER_STEPS.length) * 100;
  return (
    <div className="flex w-full flex-col items-start gap-[12px]">
      <div className="relative h-[8px] w-full overflow-clip rounded-[4px] bg-[#e0e4e6]">
        <div className="h-full bg-[#243746]" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex w-full items-start justify-between whitespace-nowrap text-[12px] leading-[1.5] text-[#5f6368]">
        {STEPPER_STEPS.map((label, i) => (
          <p key={label} className={i === current ? "font-bold" : "font-medium"}>
            {label}
          </p>
        ))}
      </div>
    </div>
  );
}
```

> Two values here are provisional and are corrected in Task 12 Step 2: the unfilled track colour (`#e0e4e6` is a placeholder borrowed from the border token) and the fill geometry. In the confirmation frame the fill is `555px` of a `740px` track, which is **75%** — consistent with step 4 of 4 under this formula. Confirm against the `driver-vehicle-prerequisite-check` frame before trusting it for every step.

- [ ] **Step 3: Implement the buttons with their mismatched radii**

```tsx
export function BtnPrimary({
  children, onClick,
}: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center overflow-clip rounded-[4px] bg-[#243746] px-[24px] py-[10px] text-[14px] font-bold leading-normal text-white"
    >
      {children}
    </button>
  );
}
```

```tsx
export function BtnOutline({
  children, onClick,
}: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-start rounded-[6px] border border-solid border-[#243746] bg-white px-[20px] py-[10px] text-[16px] font-bold leading-normal text-[#243746]"
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Implement WizardCard and WizardHeader** using the values in Global Constraints. `WizardHeader` stacks a 24px Bold centred title above `<ProgressStepper />` with `gap-[24px]`.
- [ ] **Step 5: Commit**

```bash
git add src/components/wizard src/components/ui src/lib/demo-data.ts
git commit -m "feat(wizard): add WizardCard, WizardHeader, ProgressStepper and button primitives"
```

---

### Task 8: Mobile shell

**Blocked by open question O2 — confirm the presentation before implementing.**

**Files:**
- Create: `src/components/mobile/PhoneFrame.tsx`, `src/components/mobile/MobileTopNav.tsx`

**Interfaces:**
- Consumes: `SiteFooter` (mobile variant), `ASSETS`
- Produces: `<PhoneFrame>{children}</PhoneFrame>` — a 393px-wide column with no padding of its own; `<MobileTopNav />` at `393 × 145`

- [ ] **Step 1: Confirm O2.** Default if unanswered when this task starts: a plain 393px column, **no decorative phone bezel** — a bezel is not in the Figma file, and inventing one would fail the pixel gate against the 393px baselines.
- [ ] **Step 2: Pull the design context** for node `6039:9699` (mobile `top-nav actions`).
- [ ] **Step 3: Implement.** `PhoneFrame` must render its child at exactly 393px so a full-page screenshot at viewport width 393 matches the baseline width exactly.
- [ ] **Step 4: Commit**

```bash
git add src/components/mobile
git commit -m "feat(mobile): add 393px CID shell components"
```

---

# Phase 2 — Desktop Screens

### Task 9: Login page (screen 1)

**Files:**
- Modify: `src/app/page.tsx`, `src/lib/demo-data.ts` (add `LANDING_SERVICES`, `FAQ_ITEMS`)

**Interfaces:**
- Consumes: `LoginHeader`, `SiteFooter`, `ASSETS`
- Produces: route `/` at 1440 × 1880; `LANDING_SERVICES: { title: string; body: string }[]`, `FAQ_ITEMS: { question: string }[]`

- [ ] **Step 1: Run the per-screen loop** on node `6031:5865`. Children: `HeroSection` (`6031:5867`, 1440 × 560); `ServicesSection` (`6031:5890`, 1440 × 676 — heading "Things you can do here" plus a 1100-wide three-column grid at x=170, columns 340px with 40px gutters and unequal heights 426 / 268 / 350); `FAQSection` (`6031:5957`, 1440 × 376 — heading "How can we help?" plus three 56px accordion rows in an 800-wide container at x=170).
- [ ] **Step 2: Extract the copy** into `LANDING_SERVICES` and `FAQ_ITEMS` rather than inlining strings in JSX — Task 21 checks copy against Figma and that is far easier against one data file.
- [ ] **Step 3: Accordions are closed and non-interactive.** Match the 56px collapsed row height exactly; do not add shadcn `Accordion` open/close behaviour the design does not show.
- [ ] **Step 4: The sign-in action links to `/dashboard`.**
- [ ] **Step 5: Run the gate**

```bash
npm run visual 2>&1 | grep " login"
```

Expected: `PASS  login  <0.8% differing`. If it fails, open `design/diffs/login.png` — the red regions show exactly where to look.

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/lib/demo-data.ts
git commit -m "feat(screens): implement MyGovNL login page"
```

---

### Task 10: Services dashboard (screen 2)

**Files:**
- Create: `src/app/dashboard/page.tsx`, `src/components/service/ServiceCard.tsx`
- Modify: `src/lib/demo-data.ts` (add `DEMO_USER`, `SERVICE_COLUMNS`)

**Interfaces:**
- Consumes: `TopNav`, `SiteFooter`
- Produces: route `/dashboard`; `DEMO_USER = { name: "Jason Momoa" }`; `SERVICE_COLUMNS: { title: string; body: string; href?: string }[][]` (exactly three arrays); `<ServiceCard title body href? />`

- [ ] **Step 1: Run the per-screen loop** on node `6031:5974`. Structure: `welcome-section` (1440 × 217 — "Welcome Jason Momoa!" 48px tall at x=120, plus a 340 × 57 search input at y=120); `favourites-section` (1440 × 130 — heading plus the explanatory line about the star icon); `all-services-section` (1440 × 1134 — "All Services" plus a 1200-wide grid at x=120 of three 384px columns with 24px gutters); `footer-section` (1440 × 314.27 — MyGovNL mark 150 × 45.06, a 175 × 33 "Tell us what you think" button, then the `footer verified` instance).
- [ ] **Step 2: Model the grid as three explicit arrays,** not one array auto-flowed into columns. The columns have different heights (906 / 730 / 974) because they hold different numbers of cards; auto-flow will not reproduce the breaks.
- [ ] **Step 3: Only the "Driver and Vehicle" card navigates** — set its `href` to `/services/driver-vehicle`. Every other card renders without an `href` and does not navigate, so the presenter cannot click into an unbuilt screen on stage.
- [ ] **Step 4: Run the gate**

```bash
npm run visual 2>&1 | grep " dashboard"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/dashboard src/components/service/ServiceCard.tsx src/lib/demo-data.ts
git commit -m "feat(screens): implement services dashboard"
```

---

### Task 11: Driver and Vehicle service page — unverified (screen 3)

**Files:**
- Create: `src/app/services/driver-vehicle/page.tsx`, `src/lib/demo-state.tsx`, `src/lib/flow.ts`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `TopNav`, `SiteFooter`
- Produces: route `/services/driver-vehicle`; `useDemoState(): { verified: boolean; setVerified(v: boolean): void; reset(): void }`; `FLOW: readonly string[]`

- [ ] **Step 1: Write the demo state**

Create `src/lib/demo-state.tsx`:

```tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";

type DemoState = { verified: boolean; setVerified: (v: boolean) => void; reset: () => void };
const Ctx = createContext<DemoState | null>(null);
const KEY = "gnl-demo-verified";

export function DemoStateProvider({ children }: { children: React.ReactNode }) {
  const [verified, setVerifiedState] = useState(false);

  useEffect(() => {
    try {
      setVerifiedState(sessionStorage.getItem(KEY) === "1");
    } catch {
      /* private mode — the demo still works, it just does not persist across reloads */
    }
  }, []);

  const setVerified = (v: boolean) => {
    setVerifiedState(v);
    try { sessionStorage.setItem(KEY, v ? "1" : "0"); } catch {}
  };

  return (
    <Ctx.Provider value={{ verified, setVerified, reset: () => setVerified(false) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useDemoState() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useDemoState must be used inside DemoStateProvider");
  return v;
}
```

Wrap `{children}` in `src/app/layout.tsx` with `<DemoStateProvider>`.

- [ ] **Step 2: Write the flow order**

Create `src/lib/flow.ts`:

```ts
export const FLOW = [
  "/",
  "/dashboard/",
  "/services/driver-vehicle/",
  "/services/driver-vehicle/onboard/",
  "/cid/welcome/",
  "/cid/terms/",
  "/cid/biometric/",
  "/cid/verified/",
  "/auth/loading/",
  "/services/driver-vehicle/confirmation/",
  "/services/driver-vehicle/?verified=1",
] as const;
```

- [ ] **Step 3: Run the per-screen loop** on node `6031:6244`. Structure: `content-left` at x=80, 860 wide (`breadcrumb-row` 120 × 17; `title-badge-row` 860 × 48 at y=41; `service-subtitle` 860 × 24 at y=113; `verification-card` 860 × 281 at y=161) and `sidebar-right` at x=980, 380 wide (`favourite-card` 380 × 64; `data-privacy-card` 380 × 504 at y=84; `contact-card` 380 × 93 at y=608).
- [ ] **Step 4: Render the unverified state only.** Read `verified` from `useDemoState()` and render the unverified branch unconditionally for now, with a `// TODO(task-19): verified branch` comment marking the insertion point. Task 19 fills it in.
- [ ] **Step 5: The verification-card's primary action links to `/services/driver-vehicle/onboard`.**
- [ ] **Step 6: Run the gate**

```bash
npm run visual 2>&1 | grep -E "  service  "
```

- [ ] **Step 7: Commit**

```bash
git add src/app/services src/lib/demo-state.tsx src/lib/flow.ts src/app/layout.tsx
git commit -m "feat(screens): implement Driver and Vehicle service page (unverified) with demo state"
```

---

### Task 12: Prerequisite check wizard (screen 4)

**Files:**
- Create: `src/app/services/driver-vehicle/onboard/page.tsx`
- Modify: `src/components/wizard/ProgressStepper.tsx` (correct the track colour if needed)

**Interfaces:**
- Consumes: `WizardCard`, `WizardHeader` with `current={2}`, `BtnPrimary`, `BtnOutline`
- Produces: route `/services/driver-vehicle/onboard`

- [ ] **Step 1: Run the per-screen loop** on node `6031:6304`. The wizard card is `820 × 689` at x=310, y=152 inside a 1440 × 993 main content area. Children at x=40: `wizard-header` 740 × 98 (y=40), `section-intro` 740 × 73 (y=170), the options block `6031:6321` 740 × 287 (y=275), `actions-row` 740 × 55 (y=594).
- [ ] **Step 2: Correct the stepper.** Read the unfilled track colour from this frame's design context. If it is not `#e0e4e6`, fix `ProgressStepper` (Task 7 Step 2) and add a row to `design/token-exceptions.md`. Also confirm the fill width for `current={2}` matches the baseline; if the design does not use even quarters, replace the percentage formula with an explicit per-step width map.
- [ ] **Step 3: Wire the IDV method selection.** This is the screen where CID is chosen. Render the options exactly as designed; make only the CID option clickable, linking to `/cid/welcome`.
- [ ] **Step 4: Run the gate**

```bash
npm run visual 2>&1 | grep " onboard"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/services/driver-vehicle/onboard src/components/wizard/ProgressStepper.tsx
git commit -m "feat(screens): implement prerequisite check wizard"
```

---

# Phase 3 — CID Mobile Screens

All four share a shape: `MobileTopNav` (393 × 145) → `Main content` → `SiteFooter variant="mobile"` (393 × 265.81), with an inner `wizard-header` at x=16 width 361 and a content block (`Frame 5`) also at x=16 width 361.

### Task 13: CID Welcome (screen 5)

**Files:**
- Create: `src/app/cid/welcome/page.tsx`

**Interfaces:**
- Consumes: `PhoneFrame`, `MobileTopNav`, `SiteFooter`, `ProgressStepper`
- Produces: route `/cid/welcome` at 393 × 1087

- [ ] **Step 1: Run the per-screen loop** on node `6039:6580`. `Main content` is 393 × 676 at y=145. Inside `Frame 5` (361 × 522 at y=130): title "Welcome to GNL Identity Verification Service" (361 × 144 — it wraps to three lines) at y=24, a `Progress Stepper` (361 × 50) at y=184, `card-description` (361 × 248) at y=250.
- [ ] **Step 2: Reproduce the doubled stepper.** This frame has a `progress-stepper` inside `wizard-header` **and** a separate `Progress Stepper` inside `Frame 5`. Render both — it is likely a design slip, so log it in `design/token-exceptions.md` and raise it with Tatyana, but do not silently drop one and diverge from the baseline.
- [ ] **Step 3: Link forward** to `/cid/terms`.
- [ ] **Step 4: Run the gate**

```bash
npm run visual 2>&1 | grep " cid-welcome"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/cid/welcome
git commit -m "feat(screens): implement CID welcome"
```

---

### Task 14: CID Terms of Use (screen 6)

**Files:**
- Create: `src/app/cid/terms/page.tsx`

**Interfaces:**
- Consumes: same as Task 13
- Produces: route `/cid/terms` at 393 × 871

- [ ] **Step 1: Run the per-screen loop** on node `6039:11307`. `Main content` is 393 × 460 at y=145. Inside `Frame 5` (361 × 259 at y=130): "Terms of Use" (361 × 48) at y=24, `Progress Stepper` (361 × 50) at y=88, `card-description` (361 × 81) at y=154. Then `Frame 6` (361 × 39) at y=397 holding **two buttons of equal width 176.5px with an 8px gap** — both are named `btn-back` in Figma, but the right-hand one is the forward action.
- [ ] **Step 2: Do not render the checkbox.** Instance `6049:12215` is `hidden="true"` in Figma. Hidden layers are not part of the design.
- [ ] **Step 3: Link** left button → `/cid/welcome`, right button → `/cid/biometric`.
- [ ] **Step 4: Run the gate**

```bash
npm run visual 2>&1 | grep " cid-terms"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/cid/terms
git commit -m "feat(screens): implement CID terms of use"
```

---

### Task 15: CID Biometric consent (screen 7)

**Files:**
- Create: `src/app/cid/biometric/page.tsx`

**Interfaces:**
- Consumes: same as Task 13
- Produces: route `/cid/biometric` at 393 × 895

- [ ] **Step 1: Run the per-screen loop** on node `6049:12226`. `Main content` is 393 × 484 at y=145. **The ordering differs from Task 14:** inside `Frame 5` (361 × 283 at y=130) the `Progress Stepper` (361 × 50) comes **first** at y=24, then the heading "Biometric consent" (361 × 48) at y=90, then `card-description` (361 × 105) at y=154. Reproduce that order — do not normalise it to match the other CID screens.
- [ ] **Step 2: Do not render the checkbox.** Instance `6049:12263` is hidden.
- [ ] **Step 3: Link** left → `/cid/terms`, right → `/cid/verified`.
- [ ] **Step 4: Run the gate**

```bash
npm run visual 2>&1 | grep " cid-biometric"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/cid/biometric
git commit -m "feat(screens): implement CID biometric consent"
```

---

### Task 16: CID Verified (screen 8)

**Files:**
- Create: `src/app/cid/verified/page.tsx`

**Interfaces:**
- Consumes: same as Task 13, plus `useDemoState`
- Produces: route `/cid/verified` at 393 × 1051; sets `verified = true` on Continue

- [ ] **Step 1: Run the per-screen loop** on node `6062:22540`. `Main content` is 393 × 640 at y=145. Inside `Frame 5` (361 × 394 at y=130): "Your identity has been verified" (361 × 96) at y=24, `Progress Stepper` (361 × 50) at y=136, then the description beginning "You can now securely access Driver and Vehicle services and complete transactions online…". Then `Frame 6` (361 × 84) at y=532 with a full-width `ContinueButton` (361 × 37) at y=0 above a full-width `btn-back` (361 × 39) at y=45.
- [ ] **Step 2: Flip the flow to verified here**

```tsx
"use client";
import { useRouter } from "next/navigation";
import { useDemoState } from "@/lib/demo-state";

// inside the component:
const router = useRouter();
const { setVerified } = useDemoState();
const onContinue = () => {
  setVerified(true);
  router.push("/auth/loading/");
};
```

- [ ] **Step 3: Do not render the checkbox.** Instance `6062:22581` is hidden.
- [ ] **Step 4: Run the gate**

```bash
npm run visual 2>&1 | grep " cid-verified"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/cid/verified
git commit -m "feat(screens): implement CID verified and set demo verified state"
```

---

# Phase 4 — Return and End State

### Task 17: Auth loading (screen 9)

**Files:**
- Create: `src/app/auth/loading/page.tsx`

**Interfaces:**
- Consumes: `TopNav`, `SiteFooter`
- Produces: route `/auth/loading` at 1440 × 1024; auto-advances to `/services/driver-vehicle/confirmation/` after a fixed delay

- [ ] **Step 1: Run the per-screen loop** on node `6158:69596`. The `AuthLoadingCard` is `520 × 422` at x=460, y=196.39 inside a 1440 × 814.78 container. Children: `LoadingGraphic` 100 × 100 at x=210 y=48; `MessageContainer` 424 × 130 at x=48 y=180; `SecurityFooter` 424 × 32 at x=48 y=342.
- [ ] **Step 2: Add the auto-advance**

```tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const DWELL_MS = 2600; // long enough to read, short enough not to stall the demo

export function useAutoAdvance() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.push("/services/driver-vehicle/confirmation/"), DWELL_MS);
    return () => clearTimeout(t);
  }, [router]);
}
```

- [ ] **Step 3: Make the spinner diff-safe.** The visual spec injects `animation: none`, which freezes the spinner at its 0% keyframe. Author the spinner so that **its 0% keyframe matches the Figma still** — if the baseline shows it rotated, apply that rotation as the base transform and animate from there. Otherwise this screen fails the gate for a reason unrelated to layout.
- [ ] **Step 4: Run the gate**

```bash
npm run visual 2>&1 | grep " auth-loading"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/auth
git commit -m "feat(screens): implement auth loading with timed auto-advance"
```

---

### Task 18: Onboarding confirmation (screen 10)

**Files:**
- Create: `src/app/services/driver-vehicle/confirmation/page.tsx`

**Interfaces:**
- Consumes: `WizardCard`, `WizardHeader` with `title="Driver and Vehicle"` and `current={3}`, `BtnPrimary`, `BtnOutline`
- Produces: route `/services/driver-vehicle/confirmation` at 1440 × 1024

This is the one screen whose design context is already captured verbatim, so the values below are exact and need no re-derivation.

- [ ] **Step 1: Implement from the captured context**

Card: `820 × 370` at x=310, y=152 — `bg-white border border-[#e0e4e6] rounded-[6px] p-[40px] gap-[32px]`, shadow `drop-shadow(0px 4px 12px rgba(0,0,0,0.03))`.

`wizard-header` (740 × 98, `gap-[24px]`): title `Driver and Vehicle`, 24px Bold `#212326`, centred, full width; then the stepper with `Ready to Use` in Bold and the other three in Medium, labels 12px `#5f6368`, bar 8px radius 4px.

`section-intro` (740 × 73, `gap-[8px]`): `Success!` at 28px Bold `#212326`; then `Service has been successfully onboarded, and it's ready to be used.` at 15px Regular `#5f6368`.

`actions-row` (740 × 55): `flex gap-[24px] items-center justify-end pt-[16px]` — `BtnOutline` labelled `Back`, then `BtnPrimary` labelled `Go to Service Driver's License Renewal`.

> Both apostrophes above are U+2019. Copy them from this document rather than retyping them.

- [ ] **Step 2: Wire the buttons.** Primary → `/services/driver-vehicle/?verified=1`. Back → `/services/driver-vehicle/onboard/`.
- [ ] **Step 3: Run the gate**

```bash
npm run visual 2>&1 | grep " confirmation"
```

- [ ] **Step 4: Commit**

```bash
git add src/app/services/driver-vehicle/confirmation
git commit -m "feat(screens): implement onboarding confirmation"
```

---

### Task 19: Driver and Vehicle service page — verified (screen 11)

**Blocked by open question O1 — confirm the target frame before starting.**

**Files:**
- Modify: `src/app/services/driver-vehicle/page.tsx`, `src/lib/demo-data.ts` (add `LINKED_ITEMS`)
- Create: `src/components/service/LinkedItemCard.tsx`, `src/components/service/ReminderCard.tsx`

**Interfaces:**
- Consumes: `useDemoState`, `ASSETS`
- Produces: the verified branch of `/services/driver-vehicle`; `LINKED_ITEMS: { kind: "licence" | "address" | "vehicle"; title: string; lines: string[]; warning?: string; actions: { label: string; variant: "primary" | "outline" }[] }[]`

- [ ] **Step 1: Confirm O1.** This plan assumes `6065:23367`. If the answer is `6076:24415` instead, the layout is materially different (a tab bar with Actions / Notifications / Terms of use / Unlink service, a left Actions card, and a right Reminders column) — re-scope this task before writing code rather than attempting both.
- [ ] **Step 2: Run the per-screen loop** on the confirmed node. For `6065:23367`: `content-left` stays 860 wide but grows to 1334 tall and gains `left-column` (`6076:24330`, 860 × 1173 at y=161); `sidebar-right` gains `item-card-licence` (`6095:32409`, 380 × 227) at y=84, pushing `data-privacy-card` to y=331 and `contact-card` to y=855.
- [ ] **Step 3: Extract the linked-item content** into `LINKED_ITEMS`, reproducing the strings exactly as designed — subject to O4.
- [ ] **Step 4: Branch on state.** Replace the `// TODO(task-19)` from Task 11:

```tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useDemoState } from "@/lib/demo-state";

// inside the component:
const { verified } = useDemoState();
const searchParams = useSearchParams();
// The ?verified=1 query param lets the presenter deep-link straight to the end state.
const showVerified = verified || searchParams.get("verified") === "1";
```

Wrap the page body in `<Suspense>` — `useSearchParams` requires it under static export.

- [ ] **Step 5: Run the gate on both states**

```bash
npm run visual 2>&1 | grep -E "service"
```

Expected: both `service` and `service-verified` pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/services/driver-vehicle src/components/service src/lib/demo-data.ts
git commit -m "feat(screens): implement verified Driver and Vehicle service page"
```

---

# Phase 5 — Flow and Delivery

### Task 20: Wire the flow and add presenter controls

**Files:**
- Create: `src/components/DemoNav.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `FLOW` (Task 11), `useDemoState`
- Produces: a keyboard-driven presenter aid that renders nothing and therefore cannot affect the pixel gate

- [ ] **Step 1: Confirm O4** — that the personal data in the mockups is synthetic — before anything is deployed. If it cannot be confirmed, replace the names, licence number, plate and VIN in `LINKED_ITEMS` with obviously-fake values and record the deviation in `design/token-exceptions.md`.

- [ ] **Step 2: Implement DemoNav**

```tsx
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FLOW } from "@/lib/flow";
import { useDemoState } from "@/lib/demo-state";

export function DemoNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { reset } = useDemoState();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = FLOW.findIndex((r) => r.split("?")[0] === pathname);
      if (e.key === "ArrowRight" && i >= 0 && i < FLOW.length - 1) router.push(FLOW[i + 1]);
      if (e.key === "ArrowLeft" && i > 0) router.push(FLOW[i - 1]);
      if (e.key === "Escape") { reset(); router.push(FLOW[0]); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, router, reset]);

  return null; // renders nothing — cannot affect the pixel gate
}
```

Mount `<DemoNav />` inside `DemoStateProvider` in `layout.tsx`.

- [ ] **Step 3: Verify the click-through end to end**

```bash
npm run build && npx serve out -l 4173
```

In a browser, click from `/` through to the verified service page **without touching the URL bar or the arrow keys**. Every step must be reachable by clicking the thing a real user would click. If any step needs the keyboard, the on-screen link is missing — fix it.

- [ ] **Step 4: Verify the reset.** Press Escape on the final screen; confirm you land on `/`, and that walking forward again shows the **unverified** service page. A demo that cannot be reset cannot be run twice.

- [ ] **Step 5: Commit**

```bash
git add src/components/DemoNav.tsx src/app/layout.tsx
git commit -m "feat(demo): wire click-through flow with presenter shortcuts and reset"
```

---

### Task 21: Full-flow verification gate

**Files:**
- Create: `tests/visual/copy.spec.ts`
- Modify: `design/token-exceptions.md` (finalise)

**Interfaces:**
- Consumes: everything above
- Produces: a single command that must exit 0 before deploy

- [ ] **Step 1: Run the full gate**

```bash
npm run visual; echo "exit: $?"
```

Expected: eleven `PASS` lines and `exit: 0`. Any `FAIL` is a blocker — open the matching `design/diffs/<id>.png` and fix the layout. **Do not raise a budget to make a failure go away.**

- [ ] **Step 2: Check the fonts actually loaded**

```bash
npx playwright test --grep "shot login" --debug
```

In the inspector console run `document.fonts.check('700 28px Lato')`. Expected `true`. A `false` here means every screen is being measured against a fallback font and the passing diffs are meaningless.

- [ ] **Step 3: Resolve the Lato Medium question** flagged in Task 1 Step 4. Compare a stepper-label crop from `design/baselines/confirmation.png` against `design/shots/confirmation.png` at 400% zoom. If the weights differ, self-host Lato Medium via `next/font/local` and re-run the gate.

- [ ] **Step 4: Accessibility smoke test.** A government-service demo that fails basic accessibility in front of a government client is an own goal. Run the `accesslint` audit against the built output and fix every error-level finding — contrast, missing `alt`, heading order, landmark structure. **Do not change a visual value to satisfy it**; if a real conflict exists between the design and an accessibility rule, log it in `design/token-exceptions.md` for Tatyana rather than silently deviating from the mockup.

- [ ] **Step 5: Add the copy assertions**

Create `tests/visual/copy.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("confirmation copy is verbatim", async ({ page }) => {
  await page.goto("/services/driver-vehicle/confirmation/");
  await expect(page.getByText("Success!")).toBeVisible();
  await expect(
    page.getByText("Service has been successfully onboarded, and it’s ready to be used.")
  ).toBeVisible();
  await expect(page.getByText("Go to Service Driver’s License Renewal")).toBeVisible();
});

test("stepper labels are verbatim", async ({ page }) => {
  await page.goto("/services/driver-vehicle/onboard/");
  for (const label of ["Summary", "Terms and Conditions", "Prerequisite Check", "Ready to Use"]) {
    await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
  }
});

test("dashboard greets the demo user", async ({ page }) => {
  await page.goto("/dashboard/");
  await expect(page.getByText("Welcome Jason Momoa!")).toBeVisible();
});
```

Run it:

```bash
npx playwright test tests/visual/copy.spec.ts
```

Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add tests design/token-exceptions.md
git commit -m "test: add copy assertions and finalise verification gate"
```

---

### Task 22: Deploy to a protected public URL

**Blocked by open question O3 — confirm the demo marker before deploying.**

**Files:**
- Create: `public/robots.txt`
- Modify: `src/app/layout.tsx` (demo marker)

**Interfaces:**
- Consumes: a green Task 21
- Produces: a password-protected public URL, not indexed, clearly marked as a demo

- [ ] **Step 1: Confirm O3** with André-Claude / Bob — how visible the "this is a demo" marker must be.

- [ ] **Step 2: Block indexing**

Create `public/robots.txt`:

```
User-agent: *
Disallow: /
```

`metadata.robots` was already set to `index: false` in Task 1.

- [ ] **Step 3: Add the demo marker** per O3's answer. Default if unanswered: a fixed bottom-left pill reading `DEMO — not a live government service`, `position: fixed`, `z-index: 9999`, small and unobtrusive. **Give it `data-demo-marker`** so the visual spec's existing rule (Task 2, Step 5) hides it during screenshots and it does not alter every baseline comparison.

- [ ] **Step 4: Deploy**

```bash
npx vercel --prod
```

- [ ] **Step 5: Turn on deployment protection.** Vercel dashboard → Project → Settings → Deployment Protection → enable password protection. **You set the password yourself** — do not put it in the repo, in this plan, or in a chat message. Share it with the client through whatever channel Bea / André-Claude normally use for client credentials.

- [ ] **Step 6: Verify the deployed build.** Open the URL in a private window. Confirm: the password prompt appears; after unlocking, `/` renders in Lato with the correct navy; the full click-through works; Escape resets.

- [ ] **Step 7: Rehearse.** Walk the whole flow twice at the resolution the demo will actually run at. If the presenting laptop is narrower than 1440px, the fixed canvas will scroll horizontally — decide then whether to present zoomed out or on an external display. Find this out now, not on Oct 9.

- [ ] **Step 8: Commit**

```bash
git add public/robots.txt src/app/layout.tsx
git commit -m "chore: deploy protected demo build with noindex and demo marker"
```

---

## Validation

The single command that decides whether this is done:

```bash
npm run visual && npx playwright test tests/visual/copy.spec.ts
```

## Acceptance

- [ ] All eleven routes render and pass the pixel gate at ≤0.8% differing pixels
- [ ] `document.fonts.check('700 28px Lato')` returns `true` on every screen
- [ ] The entire flow is reachable by clicking only — no URL editing, no keyboard
- [ ] Escape resets to a clean unverified state, twice in a row
- [ ] No remote Figma asset URLs remain in `src/` or `public/`
- [ ] `design/frames.json` records the frozen Figma version id
- [ ] `design/token-exceptions.md` lists every deviation, for Tatyana
- [ ] Open questions O1–O4 are answered and recorded
- [ ] The public URL is password-protected, `noindex`, and visibly marked as a demo
- [ ] The accessibility audit has no error-level findings
- [ ] The flow has been rehearsed end to end at the demo's real screen resolution

---

## Sources

- [Demo to GNL: IDV Integration to C1 / Trust Platform](https://portagecybertech.atlassian.net/wiki/spaces/IDV/pages/4917002375/Demo+to+GNL+IDV+Integration+to+C1+Trust+Platform)
- [Figma — C1 | GNL - R3, "CerifiO ID integration"](https://www.figma.com/design/Dc1bPoXX1VoB9v1MtLvu8e/C1-%7C-GNL---R3?node-id=6031-5860)
