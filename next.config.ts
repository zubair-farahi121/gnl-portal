import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  /*
   * Flow 3 (2026-09-29): the C1 page's QR code is drawn in the BROWSER from
   * the offer id, so the base URL it encodes has to reach client code. `env`
   * inlines it at build time; unset, src/lib/qr.ts falls back to
   * http://localhost:4173. Referenced nowhere else.
   */
  env: { PUBLIC_BASE_URL: process.env.PUBLIC_BASE_URL ?? "" },
};

export default nextConfig;
