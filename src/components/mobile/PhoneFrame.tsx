/*
 * The CID mobile shell.
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
