# Run the GNL demo in Docker (internal testing)

One container that runs the demo **like your laptop does with the phone path**:
`npm ci` → `npm run build` → `npm run serve:phone` (`server/demo-server.mjs`).
The server serves `out/` with `serve-handler` — the library inside `serve` 14.2.6,
with the same options (never `-s`) — and adds a small in-memory `/api/` so a real
phone can take part (see [Phone path](#phone-path-a-real-phone-next-to-the-laptop)).
Same Node 22, same `package-lock.json`, same port 4173.

> For **internal testing only**. There is no login and no real data (the persona is
> fake), but the pages carry GNL branding. Do not put it on the public internet.

## 1. What you need

- **Docker Desktop** (Mac or Windows), or Docker Engine + the Compose plugin (Linux).
- Works on Intel and Apple Silicon (the lockfile has both sets of binaries).
- The first build downloads the `node:22-bookworm-slim` image and the npm packages, so it
  needs internet once. Later builds reuse the cache.

## 2. Start it (3 steps)

```bash
cd GNL                              # the project folder
docker compose up --build -d        # build + start in the background (first time ~2–4 min)
open http://localhost:4173/         # Windows: start http://localhost:4173/
```

Then press **Esc** once on the login page, as usual.

## 3. Everyday commands

| I want to… | Command |
|---|---|
| See if it is running | `docker compose ps` (look for `healthy`) |
| See the server log | `docker compose logs -f` |
| Stop it | `docker compose down` |
| Start it again (no code change) | `docker compose up -d` |
| **Use my latest code changes** | `docker compose up --build -d` (always rebuild; the site is baked into the image) |
| Reset the demo | Press **Esc** in the browser, or open `/reset` (same as localhost; the demo state lives in your browser) |

> Don't run `npm run serve` at the same time: both use port 4173.

## 4. Options

Put these in front of the command (`DEMO_PORT=8080 docker compose up --build -d`) or in a
`.env` file next to `docker-compose.yml`.

| Setting | Default | When to change it |
|---|---|---|
| `DEMO_PORT` | `4173` | Port 4173 is busy on this machine. **Also set `PUBLIC_BASE_URL`** to the new address, or the QR codes still point to `:4173`. |
| `PUBLIC_BASE_URL` | empty | The address a **phone** (or another tester) can reach, e.g. `http://192.168.1.20:4173` or `http://gnl-test.internal:4173`. Read at **run** time by the server (no rebuild needed); it is also passed to the build as the static fallback. |
| `TLS_CERT`, `TLS_KEY` | empty | Serve **HTTPS** (phones only allow the camera on HTTPS). Paths *inside* the container, e.g. `/certs/cert.pem` and `/certs/key.pem`; put the files in `./certs` next to `docker-compose.yml` (mounted read-only at `/certs`). |
| `DEMO_SYNC` | `on` | `off` = static files only, exactly like `npm run serve` (no `/api/`, no phone path). |
| `NODE_IMAGE` | `node:22-bookworm-slim` | Your network blocks Docker Hub. Point it at your internal mirror: `NODE_IMAGE=<your-registry>/node:22-bookworm-slim docker compose up --build -d` |

## 5. Without Compose

```bash
docker build -t gnl-demo:test .
docker run -d --name gnl-demo -p 4173:4173 --restart unless-stopped \
  -e PUBLIC_BASE_URL=http://<laptop-ip>:4173 gnl-demo:test
# stop and remove:
docker rm -f gnl-demo
```

## 6. Prove it runs the same as localhost

The project's own gates test whatever answers on `DEMO_BASE_URL` (default port 4173):

```bash
npm run clicks      # Flow A, Flow B and Flow 3 click paths
npm run camera      # CertifiO / Yoti camera checks
npm run shots && npm run diff   # pixel gate, expect "GATE: PASS"
npm run phone       # the phone path: two devices, Flow 3 scan + IDV hand-off
```

The first three pass unchanged against the default container: until the presenter
turns phone mode on at `/demo/phone/`, the pages make no `/api/` request and look
exactly like the static build. `npm run phone` is the gate for phone mode (set
`STATIC_BASE_URL` to a plain `npx serve out` as well, to run its byte-for-byte parity check).

## 7. What is different from localhost (read before sharing a server)

| Topic | On `http://localhost:4173` | On a shared server `http://<server>:4173` |
|---|---|---|
| Camera (CertifiO/Yoti capture) | Live camera, same as today | Browsers **block the camera on plain http** (except localhost). The screens fall back to the still image by themselves; the flow still works. For the live camera you need HTTPS: set `TLS_CERT` / `TLS_KEY` (see [Phone path](#phone-path-a-real-phone-next-to-the-laptop)), or put a reverse proxy with a certificate in front. |
| Flow 3 QR / hand-off QR on a real phone | Encodes the laptop's LAN address (the container only knows its private one, so set `PUBLIC_BASE_URL`) | With `PUBLIC_BASE_URL` set to an address the phone can reach, the phone takes part and the laptop follows live (see [Phone path](#phone-path-a-real-phone-next-to-the-laptop)). |
| Demo progress | Kept in your browser | The same: each tester's browser has its own progress. Only a laptop and the phone that scanned its QR share a session (the offer and the hand-off status). |

## 8. How the image is built (for reviewers)

- `Dockerfile`, two stages:
  1. **build**: `npm ci` from the lockfile, then `npm run build` (static export to `/app/out`),
     then the server's two runtime packages on their own (`serve-handler` 6.1.7 and
     `compression` 1.8.1, the versions `package.json` pins).
  2. **run**: only `out/`, `server/demo-server.mjs` and those two packages — no Next.js,
     no React. Runs as the non-root `node` user, listens on `0.0.0.0:4173`.
     Health check = `/api/health` answers 200 (over HTTPS when TLS is on; the login page
     when `DEMO_SYNC=off`).
- Static serving vs `npm run serve`: the same `serve-handler` call with the same options
  `serve` 14.2.6 builds (`public: out`, `etag: true`, behind `compression()`), so the same
  trailing-slash handling, 404 page and headers. **No SPA rewrite** (what `-s` adds).
- `.dockerignore` keeps `node_modules`, `out`, `.git`, screenshots, PNG baselines, `.env*`
  and `certs` out of the image. Build context is about 3 MB.

**Verified on 29 Sep 2026** (Docker 29.4, a Node 22.22.2 base): build OK with 57 pages; container
`healthy`, runs as `node`; every route is its own page and unknown routes return 404 (not SPA
mode); `npm run clicks`, `npm run camera` and the pixel gate (25/25 screens at 0.000 %) all
passed **against the container**. The sandbox could not pull `node:22-bookworm-slim` (registry
blocked there), so the test used a stand-in base built from the same Node 22. The first real
pull happens on your machine.

**Phone path verified on 4 Oct 2026** (same stand-in base): image built; a container with
`PUBLIC_BASE_URL=http://127.0.0.1:4195` is `healthy`, runs as `node`, `/api/health` answers
`{"ok":true,"publicUrl":"http://127.0.0.1:4195"}`, and `npm run phone` passed **120/120**
against it. A second container with `DEMO_SYNC=off` is `healthy` too (`/api/health` is then a
plain 404 and the health check uses the login page). Against `npm run serve:phone` on the
laptop build: `npm run phone` **134/134** (including byte-for-byte parity with `npx serve out`),
pixel gate 25/25 at 0.000 %, `clicks` and `camera` pass.

## Phone path: a real phone next to the laptop

From the team meeting: show that continuing on a phone is a real, existing workflow. With
`server/demo-server.mjs` (local: `npm run build && npm run serve:phone`; Docker: the default),
two QR codes become real:

- **Flow 3** — the C1 page's QR ("Add your vehicle registration certificate to your wallet").
  The phone opens the wallet at "Allow connection?" and the laptop follows live: *Waiting for
  scan → Adding to your wallet → Added to your wallet*.
- **Identity verification** — "Continue on a smartphone" (Flow A and Flow B). The phone runs
  the CertifiO ID screens; the laptop shows *Waiting for your phone… → Continue on your
  phone…* and, when the phone is verified, moves on to the verified screen by itself. The
  phone says "Verification complete. You can return to your computer."

Clicking the QR on the laptop (the pop-up wallet), **Shift+W** and **Continue on my computer**
all still work exactly as before.

**On a laptop (LAN)**

1. Put the laptop and the phone on the **same Wi-Fi**.
2. `npm run build && npm run serve:phone`. The server prints the address the QR codes use —
   the laptop's LAN IP, e.g. `http://192.168.1.20:4173`. Allow incoming connections if the
   firewall asks.
3. On the laptop, open **`http://localhost:4173/demo/phone/`** and press the switch to turn
   phone mode **on** (once per laptop browser; it survives Esc / Reset). The page also shows
   a QR of the address: scan it with the phone first to check the phone can reach the laptop.
4. Run the demo from `http://localhost:4173/` and scan the QR codes with the phone's camera.

Phone mode off (the default) = today's demo, unchanged.

**In Docker** the container cannot see the laptop's LAN IP, so give it:
`PUBLIC_BASE_URL=http://<laptop-ip>:4173 docker compose up -d` (run time, no rebuild).
Find the IP with `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows, "IPv4 Address").

**HTTPS for the phone camera.** Phones block the camera on plain `http://` (only `localhost`
is exempt). Without HTTPS the capture screens fall back to the still image and the flow still
works. For the live camera, make a certificate with [mkcert](https://github.com/FiloSottile/mkcert):

```bash
mkcert -install                                    # once, on the laptop
mkdir -p certs && mkcert -cert-file certs/cert.pem -key-file certs/key.pem <laptop-ip> localhost
# local:
TLS_CERT=certs/cert.pem TLS_KEY=certs/key.pem npm run serve:phone
# Docker:
TLS_CERT=/certs/cert.pem TLS_KEY=/certs/key.pem PUBLIC_BASE_URL=https://<laptop-ip>:4173 docker compose up -d
```

The phone must trust mkcert's root CA: AirDrop / e-mail the file from `mkcert -CAROOT`
(`rootCA.pem`) to the phone and install it (iOS: also enable it under *Settings → General →
About → Certificate Trust Settings*). `certs/` and `*.pem` are git-ignored and never baked
into the image.

**Limits**

- **Corporate / guest Wi-Fi often isolates devices** (the phone cannot reach the laptop). Use
  a phone hotspot or a small travel router instead. Plan B on stage is always there: click the
  QR on the laptop, or **Shift+W**.
- **State is in memory.** A server restart clears all sessions: reload the laptop page and
  scan again. Sessions expire 2 h after their last use; at most 500 at once.
- **Same origin only**: the API sends no CORS headers and refuses cross-origin requests. A
  reverse proxy in front must keep the `Host` header.
- What is shared: only the Flow 3 offer status and the hand-off status (`waiting / started /
  complete`). No personal data — the persona is fake and stays in each browser.

## 9. Troubleshooting

| Symptom | Fix |
|---|---|
| `port is already allocated` | Something else uses 4173 (often `npm run serve`). Stop it, or use `DEMO_PORT`. |
| `Forbidden` / `denied` pulling `node:22-bookworm-slim` | Your network blocks Docker Hub. Set `NODE_IMAGE` to your internal registry (section 4). |
| Page shows old content | You changed code but did not rebuild: `docker compose up --build -d`. Then hard-refresh the browser. |
| Every page shows the login screen | Someone added `-s` to the serve command. Remove it. |
| The phone cannot open the QR link | Not on the same Wi-Fi, the Wi-Fi isolates devices, the laptop firewall blocks port 4173, or (Docker) `PUBLIC_BASE_URL` is not set. Open `/api/health` on the laptop to see the address the QR uses. |
| The phone opens the link but the laptop does not move | The server was restarted (sessions are in memory): click **Get a new code** on the laptop (or reload the page) and scan the new QR. |
