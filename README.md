# GNL demo — MyGovNL with CertifiO ID, and the wallet (Flow 3)

A static (`output: "export"`) Next.js demo. No server, no real API. The
presenter walk-through is in [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md); the design
audit is in [`DEMO_AUDIT.md`](DEMO_AUDIT.md).

## Run it

```bash
npm install
npm run build          # writes out/
npx serve out -l 4173  # NEVER `serve -s`: SPA mode sends every route to the login page
```

Open `http://localhost:4173/`. Reset everything with **Esc** on a portal page,
or open `/reset`.

## Flow 3 — add the vehicle registration certificate to a wallet

Spec: `FLOW3_BRIEF.md` (Figma section 6343:84884). Story: on the Trusted
Driver and Vehicle page, **Add to wallet** (the "Skip the paper copy" panel)
opens the C1 page with a QR code; a neutral wallet app on the "phone" scans
it, the user accepts, reviews, enters a code, and the certificate lands in
the wallet. The C1 page follows along live: *Waiting for scan → Adding to
your wallet → Added to your wallet*.

| Part | Where |
|---|---|
| C1 page (MyGovNL, Lato) | `/services/driver-vehicle/wallet/` — QR at ≥ 768 px (F3-02), two wallet buttons below (F3-03) |
| Wallet (Inter, its own tokens) | `/wallet/` W-01 home · `/wallet/scan/` W-02 · `/wallet/connect/` W-03 · `/wallet/offer/` W-04 · `/wallet/review/` W-05 · `/wallet/connecting/` W-06 · `/wallet/code/` W-07 · `/wallet/added/` W-08 · `/wallet/cards/` W-09 |
| QR / deep-link entry | `/wallet/start/?offer=<id>` — not a screen: selects the offer, marks it `scanned`, goes to W-03 |
| Mock issuer | `src/lib/mock-issuer.ts` — **DEMO MOCK**. Offer statuses `created → scanned → connected → viewed → accepted → code_verified → issued` (+ `declined`), 300–800 ms fake latency |
| Sync | the existing `gnl-demo:v1` localStorage store and its `storage` event: two windows (or two iframes) of one browser stay in step without reloads |
| Copy / persona | `src/lib/data/flow3.ts` (`CODE_MODE`, `WALLET_CONSENT`, `UPSELL_ADDED_STATE_ENABLED`), `WALLET_PERSONA` in `src/lib/data/driver-vehicle.ts` |
| Tokens | `src/lib/data/wallet-tokens.ts` (brief §6) |

**Ways to show it**

1. **Phone view window (default).** On the C1 page, click the QR code: the
   wallet opens in a ~400×860 pop-up at W-01. Put it beside the browser. Tap
   **Scan QR-code**; the scanner "finds" the code by itself. Allow pop-ups for
   localhost; if blocked, the wallet opens in a tab.
2. **Same device.** At phone width the C1 page has no QR; **Add to Apple
   Wallet** / **Add to Google Wallet** open the wallet at W-03. **◀ MyGovNL**
   in the wallet's status bar comes back with an "Added to your wallet" toast.
3. **Presenter stage.** Press **Shift+W** on any portal page (it is linked
   from nowhere else) or open `/demo/wallet-stage/`: the C1 page (left, scaled
   to fit) and the wallet phone (right) in two same-origin iframes, with a
   **Reset demo** button. Best on one big screen or a projector.
4. **Real phone** (P2, not built): the QR encodes
   `${PUBLIC_BASE_URL}/wallet/start/?offer=<id>`. Set `PUBLIC_BASE_URL` at
   build time (default `http://localhost:4173`). A real phone can open the
   wallet, but it cannot sync with the desktop without a server.

**The wallet phone.** One frame, 393×852, radius 48, with a 9:41 status bar and
a home indicator; long screens scroll inside it. At a viewport of 430 px or
less (a phone, the pop-up, the stage iframe) the frame is dropped and the
wallet fills the screen.

**Switches**

- `CODE_MODE` (`"sms"` | `"wallet_pin"`) — W-07's SMS code with the simulated
  Messages banner, or the wallet's own PIN (text not designed yet).
- `WALLET_CONSENT` — W-05's two consent lines, in one place.
- `UPSELL_ADDED_STATE_ENABLED` — after issuing, the Trusted page's "Add to
  wallet" becomes a disabled "Added to wallet ✓". **Off** until Tatyana
  confirms.

## Gates

`npm run build` · `npm run shots && npm run diff` (pixel diff, 25 frames) ·
`npm run clicks` · `npm run camera` · `npm run responsive` (≈ 13 min; set
`DEMO_BASE_URL` to run it against another port). All of them expect the build
served on port 4173.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
