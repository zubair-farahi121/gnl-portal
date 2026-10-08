# GNL demo — container for INTERNAL TESTING only.
#
# It runs what you run on your laptop with the phone path:
#   npm ci  ->  npm run build  ->  npm run serve:phone  (server/demo-server.mjs)
# demo-server serves the static `out/` folder with serve-handler — the library
# `serve` 14.2.6 is built on, with the same options (never SPA mode) — and adds
# the small /api/ the phone path uses. Same Node major (22), same lockfile,
# same port 4173.
#
#   docker compose up --build        # then open http://localhost:4173/
#
# See DEPLOY.md for options (phone path, HTTPS, other port, rebuild).

# Base image. Override only if your network cannot reach Docker Hub
# (e.g. --build-arg NODE_IMAGE=<your-registry>/node:22-bookworm-slim).
ARG NODE_IMAGE=node:22-bookworm-slim

# ---------- 1. build: npm ci + next build (static export to /app/out) ----------
FROM ${NODE_IMAGE} AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# Dependencies first, so code changes do not re-download packages.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .

# Build-time default for the QR codes (src/lib/qr.ts). With demo-server the
# address can also be given at RUN time (PUBLIC_BASE_URL below), which wins.
ARG PUBLIC_BASE_URL=""
ENV PUBLIC_BASE_URL=${PUBLIC_BASE_URL}
RUN npm run build

# The server's only runtime packages, at the exact versions package.json pins
# (serve-handler 6.1.7, compression 1.8.1 — the ones serve 14.2.6 uses).
# Installed on their own, so the image does not carry Next.js or React.
RUN npm install --prefix /srv-deps --no-audit --no-fund --omit=dev --no-package-lock \
      "serve-handler@$(node -p "require('/app/package.json').dependencies['serve-handler']")" \
      "compression@$(node -p "require('/app/package.json').dependencies['compression']")" \
 && npm cache clean --force

# ---------- 2. run: the static files + demo-server ----------
FROM ${NODE_IMAGE} AS run
WORKDIR /app
ENV NODE_ENV=production \
    PORT=4173 \
    HOST=0.0.0.0

COPY --from=build /srv-deps/node_modules ./node_modules
COPY --from=build --chown=node:node /app/out ./out
COPY --from=build /app/server/demo-server.mjs ./server/demo-server.mjs

# Run as the unprivileged `node` user that ships with the official Node images.
USER node
EXPOSE 4173

# RUN-TIME settings (docker run -e … / docker-compose.yml):
#   PUBLIC_BASE_URL   the address a PHONE can reach, e.g. http://192.168.1.20:4173.
#                     Needed in Docker: inside the container the server only
#                     sees its own private address.
#   TLS_CERT/TLS_KEY  paths (inside the container) to a certificate and key —
#                     both set = HTTPS, which phones need for the camera.
#   DEMO_SYNC=off     static files only, exactly like `npm run serve`.

# Healthy = /api/health answers 200 (over HTTPS when TLS is on; a local
# certificate is fine). With DEMO_SYNC=off there is no /api/, so it checks the
# login page instead. Uses node itself (no curl/wget needed).
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "const t=!!(process.env.TLS_CERT&&process.env.TLS_KEY);const p=(process.env.DEMO_SYNC||'on').toLowerCase()==='off'?'/':'/api/health';require(t?'https':'http').get({host:'127.0.0.1',port:process.env.PORT,path:p,rejectUnauthorized:false},r=>{r.resume();process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

CMD ["node", "server/demo-server.mjs"]
