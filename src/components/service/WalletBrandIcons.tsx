/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
/*
 * Small pictures for the C1 wallet page (F3-02 6220:86445 / F3-03 6220:86488).
 * ADDED 2026-09-29 with Flow 3; REWORKED the same day to FLOW3_BRIEF.md.
 *
 * The Apple and Google Wallet marks are now the REAL ones from
 * design-reference/flow3/brand/ (copied, downscaled, to /public/assets/flow3/)
 * and are used directly by the page — the drawn stand-ins are gone. The lock
 * is the pack's icon-lock.svg. The ID and Eye glyphs are not in the pack and
 * stay drawn (the pack says "use the Bootstrap Icons equivalent"), sized to
 * their 40 x 40 Figma boxes.
 */

/** The three benefit glyphs, 40 x 40 inside the 64 x 64 avatar box (6220:86475 …). */
export function BenefitGlyph({ icon }: { icon: "lock" | "id" | "eye" }) {
  if (icon === "lock") {
    return <img src="/assets/flow3/icon-lock.svg" alt="" width={40} height={40} className="block size-[40px] shrink-0" />;
  }
  const stroke = {
    fill: "none",
    stroke: "#5f6368",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 40 40" width="40" height="40" aria-hidden="true" className="block shrink-0">
      {icon === "id" ? (
        <>
          <rect x="4" y="10" width="32" height="20" rx="3" {...stroke} />
          <circle cx="13" cy="18" r="3" {...stroke} />
          <path d="M8.5 26c.8-2.4 2.5-3.5 4.5-3.5s3.7 1.1 4.5 3.5" {...stroke} />
          <path d="M22 17h9M22 21h9M22 25h6" {...stroke} />
        </>
      ) : (
        <>
          <path d="M3 20s6-11 17-11 17 11 17 11-6 11-17 11S3 20 3 20Z" {...stroke} />
          <circle cx="20" cy="20" r="5" {...stroke} />
        </>
      )}
    </svg>
  );
}

/**
 * F3-03's "image 28" (6220:86497) — 143 x 131, bottom corners radius 24.
 *
 * A CLEARLY LABELLED STAND-IN. The Figma layer is a raster; exporting it
 * would need a figma.com asset URL, which this build container's proxy
 * blocks, and the design file is read-only. So this draws a vehicle
 * registration card in the wallet's certificate colours and says what it is
 * in its alt text and `data-standin`. Brief §5 asks to flag the image if it
 * still shows a driver's licence — it could not be looked at; open question
 * in DEMO_AUDIT.md "Flow 3".
 */
export function CertificateStandIn() {
  return (
    <svg
      viewBox="0 0 143 131"
      width="143"
      height="131"
      role="img"
      aria-label="Placeholder for Figma image 28: a vehicle registration certificate"
      className="block shrink-0"
      style={{ borderRadius: "0 0 24px 24px" }}
      data-standin="figma image 28"
      data-node-id="6220:86497"
    >
      <rect x="8" y="22" width="127" height="86" rx="10" fill="#1e404d" />
      <circle cx="71.5" cy="48" r="9" fill="none" stroke="#86ceba" strokeWidth="2" />
      <path d="M67.5 48l3 3 5-6" fill="none" stroke="#86ceba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="36" y="68" width="71" height="5" rx="2.5" fill="#ffffff" />
      <rect x="46" y="80" width="51" height="5" rx="2.5" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}
