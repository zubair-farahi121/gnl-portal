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

## Responsive Checks

The app uses Next.js 16.3.5, the App Router, Tailwind CSS 4, and self-hosted Lato.
Build with `npm run build`, then run `npm run serve` in a separate terminal.
The static preview is at http://localhost:4173. Run:

```bash
npm run responsive
npm run clicks
npm run shots
```

Playwright uses its installed Chromium by default. Set `PLAYWRIGHT_CHROMIUM_PATH`
for a custom executable or `DEMO_BASE_URL` for another server when running the
responsive and click-through scripts.

The responsive gate covers all nine pages and both service states at 320, 375,
390, 393, 480, 600, 767, 768, 820, 1023, 1024, 1280, 1440, and 1920 CSS pixels,
plus 667x375 and 844x390 landscape. It checks overflow without shell clipping,
mobile tap targets, text containment, long greetings, image loading, and console
errors. Screenshots are written to `design/responsive/`.

The 720x450 case models the reflow viewport of a 1440x900 browser at 200% zoom;
it does not exercise the native browser zoom control. Physical-device testing
and native zoom remain manual checks. The click-through gate covers the full
verification flow, persistent verified state, Back, Cancel, navigation, and
logout reset at 320, 390, 768, and 1440 pixels.

Known demo limitations are preserved: login fields, search, FAQ rows, and some
service actions are intentionally inert; some artwork is still placeholder
art. There are no interactive dialogs, tables, or charts to test. The loading
page still automatically advances after 2.6 seconds. `npm run diff` requires
the missing Figma baselines and currently reports a failed gate without them.

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
