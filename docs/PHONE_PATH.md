# Phone path — a real phone next to the laptop

**Why.** From the 1 Oct team meeting: show that "continue on a phone" is a real,
working step, not a slide. This is **opt-in**. With it off (the default), the demo
behaves exactly as before.

Setup, Docker, HTTPS and troubleshooting: [`DEPLOY.md` → "Phone path"](../DEPLOY.md#phone-path-a-real-phone-next-to-the-laptop).

## What it does

| QR | Phone | Laptop follows live |
|---|---|---|
| **Flow 3**, C1 page | Opens the wallet at W-03 "Allow connection?" and runs W-03 → W-09 | *Waiting for scan… → Adding to your wallet… → Added to your wallet* |
| **IDV**, "Continue on a smartphone" (Flow A and B) | `/cid/mobile/?room=…&service=…` → CertifiO ID terms → … → verified → "You can return to your computer" | *Waiting for your phone… → Continue on your phone…* → moves to the verified screen by itself |

The existing fallbacks keep working: click the QR on the laptop, **Shift+W**, and
"Continue on my computer".

## How to turn it on (presenter)

1. Laptop and phone on the **same Wi-Fi** (or a phone hotspot; guest and corporate
   Wi-Fi often block device-to-device traffic).
2. `npm run build && npm run serve:phone`. The server prints the address the QR codes use.
3. On the laptop open **`/demo/phone/`** and switch phone mode **on**. The setting is
   stored per laptop browser and survives Esc / Reset. Scan the check-QR on that page
   with the phone to prove it can reach the laptop **before** the meeting.
4. Run the demo as usual. **Esc** also drops the phone's session; the next run gets a
   fresh one.

## How it works

```
 laptop browser                    demo-server (Node)                    phone browser
 ──────────────                    ──────────────────                    ─────────────
 /demo/phone/ → phone mode "on"
 C1 / hand-off page  ── POST /api/rooms ──▶  room {version, doc, meta}
 QR = <public url>/…?room=<id>                                    ◀── scans QR, opens URL
                                              ◀── POST /api/rooms/<id> {by, patch} ── pushes status
 polls GET /api/rooms/<id> (1 s) ◀──
 writes into localStorage + STORE_CHANGED_EVENT → existing UI reacts
```

- **Server** — `server/demo-server.mjs`. Static files come through `serve-handler` 6.1.7 with
  the exact options `serve` 14.2.6 uses (never SPA mode), plus a small in-memory `/api/`.
  It is the default in Docker. `DEMO_SYNC=off` = static only.
- **Client** — `src/lib/remote-sync.ts`. It mirrors only two keys into a room:
  `wallet` (the current Flow 3 offer) and `idv` (`{status, service, run}`). A remote change is
  written to the local store and announced with the same event the mock issuer uses, so no
  screen needed new state logic.
- **No echo loops** — the server records, for each key, the version and device id that last
  wrote it (`meta[key] = {v, by}`). A client applies only newer changes from *another* device.
- **Polling, not SSE, on the client.** A held-open stream stops the page from ever being
  "network idle", which stalls the browser gates, and some proxies buffer streams. The server
  still offers SSE (`/events`).
- **Reset** — `resetAll` fires `ROOM_RESET_EVENT`; `RemoteSyncBridge` DELETEs the room, but
  only in the browser that created it (the laptop). A phone that resets only detaches.
  Turning phone mode off also drops the room.
- **Dead room** (server restart, 2 h expiry) — the laptop forgets it on the next 404, so
  "Get a new code" (or the 8-minute refresh) starts a fresh room without a reload.

## Security and privacy (internal demo)

- **Off by default**: before opt-in the client makes **no** `/api/` request (gate check `o4`).
- **What leaves the browser**: offer statuses and hand-off flags only. No persona, no
  onboarding data, no images. The persona is fake.
- **Rooms**: ids are 128-bit random, made by the server only; ids in URLs are validated
  (`/^[a-z0-9]{8,32}$/`). Rooms are dropped 2 h after last use, at most 500 at once, and at
  most 16 event streams per room.
- **Input**: JSON only (415), 16 KB body and doc limits (413), at most 8 keys per patch, keys
  validated. API input never touches the filesystem; nothing is written to disk.
- **Same origin only**: no CORS headers; a cross-origin `Origin` gets 403. A reverse proxy in
  front must keep the `Host` header.
- **No authentication.** Anyone on the same network who has a room id can read or write that
  room's two status keys. This is acceptable for a demo with fake data. **Do not expose the
  server to the internet.**
- **HTTPS** (`TLS_CERT` / `TLS_KEY`) is needed only for the live camera on the phone. On plain
  http the capture screens fall back to the still image.
- `serve-handler` 6.1.7 leaks one file descriptor per 304/HEAD response. demo-server closes
  each stream with its response (a long demo would otherwise end in `EMFILE`). The bytes on
  the wire are unchanged (gate part `p`).

## Gate

`npm run phone` (`scripts/phone-path-check.mjs`) drives two browser contexts (laptop + phone):

| Part | Checks |
|---|---|
| `o` | Opt-in: placeholder QR, today's C1 URL and no `/api/` request until `/demo/phone/` is on |
| `a` | Flow 3: the drawn QR encodes `…&room=…`; the phone walks W-03 → W-09 (2 → 3 cards); the laptop goes Waiting → Adding → Added with no reload |
| `r` | Decline on the phone returns the laptop to Waiting; Esc on the laptop deletes the room (404); a dead room is replaced by "Get a new code"; a phone reset never deletes the laptop's room; phone mode off drops the room |
| `b` | IDV hand-off, Flow A and B: the phone runs CertifiO to verified, the laptop moves on by itself; "Continue on my computer" still works |
| `c` | Static mode (`STATIC_BASE_URL`): placeholder stays, no API calls |
| `p` | Static parity (`STATIC_BASE_URL`): every file in `out/` byte-identical to `npx serve out` |
| `d` | API guard rails: 400/403/404/405/413/415, SSE, DELETE |

```bash
npm run build
PORT=4182 npm run serve:phone &          # phone-path server
npx serve out -l 4183 &                  # plain static server, for parts c and p
DEMO_BASE_URL=http://127.0.0.1:4182 STATIC_BASE_URL=http://127.0.0.1:4183 npm run phone
```

The other gates (`shots`/`diff`, `clicks`, `camera`) pass unchanged against `serve:phone`
with phone mode off.
