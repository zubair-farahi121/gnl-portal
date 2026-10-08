# GNL demo

This is a clickable demo of MyGovNL. A signed-in user opens the Driver and Vehicle
service, proves who they are with CertifiO ID, and gets access. They can then add their
vehicle registration certificate to a digital wallet. A second service, StudentAidNL,
shows the same journey with a few differences.

There is no real backend and no real data. The user in the demo, Jason Moore, is
fictional. Everything runs from a small static website.

## Run it on your computer

You need Node.js 22.

```bash
npm install
npm run build
npm run serve
```

Open http://localhost:4173 and press **Esc** once to start clean.
Log in with `jason.moore@email.com` and any password.

That's it. Run `npm run build` again whenever the code changes.

## Run it with Docker

You need Docker with Compose. You don't need Node.

```bash
docker compose up --build -d
```

Open http://localhost:4173. To stop it, run `docker compose down`.

## Put it on a server

Use the same Docker command, plus three things:

1. **Tell it its address.** Create a `.env` file next to `docker-compose.yml`:
   ```
   PUBLIC_BASE_URL=https://gnl-demo.example.com
   ```
   The QR codes use this address, so a phone can open them.
2. **Use HTTPS.** Browsers only allow the camera on HTTPS. Without it, the capture
   screens show a still picture instead, and the demo still works. If a reverse proxy
   sits in front, it must forward the original Host header. For nginx:
   `proxy_set_header Host $http_host;`
3. **Keep it private.** It carries GNL branding. Put it behind a VPN, an IP allow-list
   or a password at the proxy.

`docker compose ps` should show `healthy`. More options, such as another port or a
certificate inside the container, are in [DEPLOY.md](DEPLOY.md).

## Using the demo

- **Esc** resets everything. You can also open `/reset`.
- **→** and **←** jump to the next or previous screen when you need to skip ahead.
- **Shift+W** shows the web page and the wallet phone side by side in one window.
  Use it if pop-ups are blocked.
- Each person's progress is saved in their own browser, so people testing at the same
  time don't affect each other.
- **Optional: a real phone.** Start with `npm run serve:phone` instead of
  `npm run serve`, then turn phone mode on at `/demo/phone/`. The phone needs to be on
  the same network. Details: [docs/PHONE_PATH.md](docs/PHONE_PATH.md).

## If something goes wrong

| Problem | Fix |
|---|---|
| Every page shows the login screen | The server is in "single page" mode. Use `npm run serve` (never `serve -s`). |
| Port 4173 is busy | Stop the other server. Or, with Docker, run `DEMO_PORT=8080 docker compose up -d`. |
| Old content after a change | Run `npm run build` again. With Docker, run `docker compose up --build -d`. |
| The wallet doesn't open when you click the QR | Allow pop-ups for the site, or press **Shift+W**. |
| The camera doesn't start | Close other apps using it (Teams, Zoom). On a server, check that it uses HTTPS. |

## For developers

- Built with Next.js 16 (static export), React 19, TypeScript and Tailwind 4.
- Code lives in `src/`. Screen text and settings live in `src/lib/data/`.
  - The wallet flow's switches, `CODE_MODE`, `WALLET_CONSENT` and
    `UPSELL_ADDED_STATE_ENABLED`, are in `src/lib/data/flow3.ts`.
- The fake credential issuer is `src/lib/mock-issuer.ts`. The phone-path server is
  `server/demo-server.mjs`.
- Checks (the test scripts are in the full repository, not in the deploy package):
  - `npm run shots && npm run diff`: pixel comparison with the designs.
  - `npm run clicks`: every click path.
  - `npm run camera`: the camera screens.
  - `npm run responsive`: every page at several widths (about 13 minutes).
  - `npm run phone`: the phone path.

  They expect the site on port 4173. Set `DEMO_BASE_URL` to test another address.
- The presenter script is in `DEMO_SCRIPT.md`. The design notes are in `DEMO_AUDIT.md`
  and `FLOW3_BRIEF.md`. Both are in the full repository only.
