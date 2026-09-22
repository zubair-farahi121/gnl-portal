/*
 * The CID mobile shell.
 *
 * SUPERSEDED 2026-09-22 — nothing imports this any more.
 *
 * The three CID routes were its only consumers and they now render through
 * `@/components/cid/CidScreen`, which uses `.gnl-cid-shell`: this same 480px
 * column below 768, and the desktop wizard chrome at and above it, so the demo
 * stops going full desktop page -> 480px strip -> full desktop page. Below 768
 * CidScreen reproduces what this file produced, box for box.
 *
 * Kept, together with `.gnl-mobile-shell` in globals.css, because the desktop
 * CID layout is INVENTED — Figma has mobile frames only for those screens — and
 * if Tatyana rejects it, reverting is a one-line import swap per page rather
 * than a rebuild. Delete both if she signs the desktop chrome off.
 *
 * It used to drop the 393px screen into a drawn iPhone bezel on a dark stage
 * whenever the viewport was 600px or wider. That is a picture of a phone on a
 * web page — the exact thing this design pass exists to remove. The bezel,
 * the stage and the three `.gnl-phone-*` rules behind them are gone.
 *
 * What is left is a plain centred column: full width on a phone, capped by
 * `.gnl-mobile-shell` (max-width 480px) on anything wider so the CID steps
 * read as a narrow form rather than stretching across a monitor. At exactly
 * 393px the column is 393px, so the mobile visual baselines are untouched.
 *
 * Pure CSS, no layout JavaScript, so there is nothing to mismatch on hydrate.
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="gnl-mobile-shell flex flex-col items-stretch">{children}</div>
  );
}
