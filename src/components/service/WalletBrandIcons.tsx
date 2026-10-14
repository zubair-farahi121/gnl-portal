/* eslint-disable @next/next/no-img-element -- static export, unoptimized images */
import type { BenefitIcon } from "@/lib/data/credentials";
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

/**
 * The three benefit glyphs, 40 x 40 inside the 64 x 64 avatar box (6220:86475 …).
 *
 * Flow 4 (2026-10-14) adds its three, 45 x 45 in the same 64 box (6412:85694
 * `Checkmark_magnifying glass_screen`, 6412:85698 `Graduation cap_screen`,
 * 6412:85702 `Eye` 45 x 43.59) and drawn in LINK BLUE where Flow 3's are grey
 * — that is how 6412:85690 renders them (get_screenshot). Drawn stand-ins for
 * the same reason as the ID and Eye glyphs: figma.com asset URLs are refused
 * by this container's proxy. The blue is the portal's #004b87, the nearest
 * token to the rendered colour (the frame binds no colour variable —
 * get_variable_defs on 6412:85690 returns spacing only).
 */
export function BenefitGlyph({ icon }: { icon: BenefitIcon }) {
  if (icon === "monitor-check" || icon === "laptop-cap" || icon === "eye-blue") return <NoaBenefitGlyph icon={icon} />;
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

/** Flow 4's benefit glyphs — see BenefitGlyph. 45 x 45, #004b87, 1.6 px lines. */
function NoaBenefitGlyph({ icon }: { icon: "monitor-check" | "laptop-cap" | "eye-blue" }) {
  const stroke = {
    fill: "none",
    stroke: "#004b87",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (icon === "eye-blue") {
    /* `Eye` 6412:85703 — 45 x 43.59. */
    return (
      <svg viewBox="0 0 45 43.59" width="45" height="43.59" aria-hidden="true" className="block shrink-0" data-glyph="eye">
        <path d="M3 21.8s7-12.3 19.5-12.3S42 21.8 42 21.8s-7 12.3-19.5 12.3S3 21.8 3 21.8Z" {...stroke} />
        <circle cx="22.5" cy="21.8" r="6" {...stroke} />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 45 45" width="45" height="45" aria-hidden="true" className="block shrink-0" data-glyph={icon}>
      {icon === "monitor-check" ? (
        <>
          {/* A desktop screen with a magnifier over a tick (insets 14 % / 4.5 %). */}
          <rect x="2.5" y="6.5" width="40" height="26" rx="2" {...stroke} />
          <path d="M17 38.5h11M22.5 32.5v6" {...stroke} />
          <circle cx="21" cy="17.5" r="6" {...stroke} />
          <path d="m18.4 17.6 1.9 1.9 3.3-3.4M25.4 21.9l4.4 4.4" {...stroke} />
        </>
      ) : (
        <>
          {/* A laptop with a mortarboard on its screen (insets 21.8 % / 4.4 %). */}
          <rect x="7" y="9.8" width="31" height="20.4" rx="1.6" {...stroke} />
          <path d="M2 35.2h41l-2.6-5H4.6L2 35.2Z" {...stroke} />
          <path d="m22.5 13.2-8 3.6 8 3.6 8-3.6-8-3.6Z" {...stroke} />
          <path d="M17.6 18.4v3.4c1.4 1.4 3.1 2 4.9 2s3.5-.6 4.9-2v-3.4M30.5 16.8v4.2" {...stroke} />
        </>
      )}
    </svg>
  );
}

/**
 * Flow 4's phone layout image card — NOT IN FIGMA (Flow 4 has no phone
 * frame). The same 143 x 131 box and dark card as Flow 3's CertificateStandIn,
 * with the notice of assessment's checklist instead of the check badge, and
 * labelled as a stand-in.
 */
export function NoticeOfAssessmentStandIn() {
  return (
    <svg
      viewBox="0 0 143 131"
      width="143"
      height="131"
      role="img"
      aria-label="Placeholder image: a notice of assessment"
      className="block shrink-0"
      style={{ borderRadius: "0 0 24px 24px" }}
      data-standin="flow 4 phone image (not in Figma)"
    >
      <rect x="8" y="22" width="127" height="86" rx="10" fill="#1e404d" />
      <path d="m48 46 3 3 5-6M48 61l3 3 5-6M48 76l3 3 5-6" fill="none" stroke="#86ceba" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="64" y="44" width="34" height="5" rx="2.5" fill="#ffffff" />
      <rect x="64" y="59" width="30" height="5" rx="2.5" fill="#ffffff" opacity="0.8" />
      <rect x="64" y="74" width="24" height="5" rx="2.5" fill="#ffffff" opacity="0.6" />
    </svg>
  );
}
