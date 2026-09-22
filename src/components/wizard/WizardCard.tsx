/*
 * wizard-card — Figma 6031:6307, 820 x 689 at x=310 inside the 1440 canvas.
 *
 * Padding and gap are read off the child offsets rather than assumed:
 *   children start at x=40 and y=40, and the last child (actions-row) ends at
 *   y=649 against a 689px frame → padding 40 on every side.
 *   wizard-header 40..138, section-intro at 170  → 32
 *   section-intro 170..243,  Frame 1 at 275      → 32
 *   Frame 1 275..562,        actions-row at 594  → 32
 * So: w-[820px], p-[40px], gap-[32px]. Height is content-driven.
 *
 * The 1px stroke is painted with an inset box-shadow rather than `border`,
 * the same way TopNav paints its bottom rule. Figma draws the stroke INSIDE
 * the 820px frame, so a CSS border would make the inner width 738 instead of
 * 740 and the card 691 instead of 689 — measured, not assumed.
 *
 * RESPONSIVE:
 *   >= 1024   the designed 820px box. `max-w-full` is a no-op here — the
 *             parent's content box is wider than 820 at the design width.
 *    < 1024   `w-full` with 820 as the cap, so the card fills whatever room
 *             the page gives it and never exceeds its designed width.
 *    < 768    padding 40 -> 32, and 40 -> 24 below 480. At phone width a 40px
 *             inset costs a quarter of the screen; 24 keeps the card readable
 *             while still reading as a card. The 32px child gap tightens to 24
 *             at phone width for the same reason.
 */
export function WizardCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="box-border flex w-[820px] max-w-full flex-col items-start gap-[32px] rounded-[6px] bg-white p-[40px] shadow-[inset_0_0_0_1px_#e0e4e6] [filter:drop-shadow(0px_4px_12px_rgba(0,0,0,0.03))] max-lg:w-full max-md:p-[32px] max-xs:gap-[24px] max-xs:p-[24px]"
      data-node-id="6031:6307"
    >
      {children}
    </div>
  );
}
