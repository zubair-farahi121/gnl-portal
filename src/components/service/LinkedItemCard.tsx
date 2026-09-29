import Link from "next/link";
import { ASSETS } from "@/lib/assets";
import type { LinkedItem, LinkedItemAction } from "@/lib/data/driver-vehicle";
import { UpsellAddedAction } from "@/components/service/UpsellAddedAction";
import { UPSELL_ADDED_STATE_ENABLED } from "@/lib/data/flow3";

/*
 * `item-card-*` — Figma 6076:24356 / 6220:86386 / 6076:24368 / 6076:24378 /
 * 6076:24396, all five children of `linked-items-section` 6076:24354 on the
 * VERIFIED service page 6065:23367. One component, five instances.
 *
 * Geometry, verbatim from get_design_context on 6076:24354:
 *   card            w-full (860) p-[24px] r-[6px] 1px #d4d8da, white, NO shadow
 *   icon-box        64 x 64, bg #e9ecef, r-[6px], child centred
 *                     - wallet promo: 58 x 58 leaf → 3px inset
 *                     - every other card: 32 x 32 leaf → 16px inset
 *   item-details    flex-1, gap-[6px] inline cards / gap-[4px] stacked cards
 *   actions         inline: one button beside the details, vertically centred
 *                   stacked: a second row, gap-[12px], under the identity row
 *
 * The 1px stroke is painted with an inset box-shadow, not `border`, the same
 * way WizardCard and the sidebar cards do it. Figma draws the stroke INSIDE
 * the frame: with a CSS border the inner content box would be 810 instead of
 * the 812 the design specifies for `card-identity-row`, and every card would
 * come out 2px taller than designed.
 *
 * FONT WEIGHTS: Figma asks for Lato:SemiBold (600) on "IAN B GARLAND" and on
 * every outline-button label. Lato has no 600 — rendered at 700. Logged in
 * design/token-exceptions-phase4.md.
 *
 * LEADING: the two 12px pills ("New", "Expired on March 31, 2022") say
 * `line-height: normal` in Figma and measure a 14px line box there. The
 * browser's own `normal` for Lato at 12px rounds to 15, which made both pills
 * 23px instead of 22 and the trailer card 187 instead of 186. Pinned to the
 * measured 14px. Also logged.
 */

/** btn-primary — 6220:86430 et al. min-h-[40px] so short labels still measure 40 tall. */
const BTN_PRIMARY =
  "gnl-touch box-border inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-[6px] bg-[#243746] px-[16px] py-[6px] text-[14px] font-bold leading-[normal] text-white";

/**
 * btn-outline — 6220:86396 et al. NOT the shared BtnOutline: that one is
 * 16px Bold #243746 on a #243746 stroke with px-[20px] py-[10px]. These are
 * 14px on a #d4d8da stroke with px-[16px] py-[6px].
 */
const BTN_OUTLINE =
  "gnl-touch box-border inline-flex shrink-0 items-center justify-center rounded-[6px] bg-white px-[16px] py-[6px] text-[14px] font-bold leading-[normal] text-[#5f6368] shadow-[inset_0_0_0_1px_#d4d8da]";

/*
 * NONE of these buttons has a destination: the design draws no Renew, demerit
 * points, registration-replacement or digital-wallet screen. They keep every
 * visual value and are marked inert rather than wired somewhere arbitrary.
 * `aria-disabled` rather than `disabled`, because the native disabled state
 * would repaint the label and fail the pixel gate.
 */
function ActionButton({ action }: { action: LinkedItemAction }) {
  const button = (
    <button
      type="button"
      className={`${action.variant === "primary" ? BTN_PRIMARY : BTN_OUTLINE} cursor-default select-none ${
        action.badge ? "mr-[-8px] h-full" : ""
      }`}
      data-node-id={action.nodeId}
      data-demo-inert="true"
      aria-disabled="true"
    >
      {action.label}
    </button>
  );

  if (!action.badge) return button;

  /*
   * 6220:86443 — the "New" pill overlaps the button's right edge by 8px
   * (Figma: button 187 wide, pill at x=179 inside a 221-wide box). The
   * negative right margin on the button reproduces that overlap exactly.
   */
  return (
    <div className="flex shrink-0 items-start self-stretch" data-node-id="6220:86443">
      {button}
      <div
        className="flex shrink-0 items-center rounded-[4px] bg-[#d1e7dd] px-[8px] py-[4px]"
        data-node-id="6220:86438"
      >
        <p
          className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[14px] text-[color:var(--gnl-success,#198754)]"
          data-node-id="6220:86440"
        >
          {action.badge}
        </p>
      </div>
    </div>
  );
}

function IconBox({ item }: { item: LinkedItem }) {
  return (
    <div className="flex size-[64px] shrink-0 items-center justify-center rounded-[6px] bg-[#e9ecef]">
      <div
        className={`relative shrink-0 ${item.iconSize === 58 ? "size-[58px]" : "size-[32px]"}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={item.icon} />
      </div>
    </div>
  );
}

function ItemDetails({ item }: { item: LinkedItem }) {
  return (
    <div
      className={`flex min-w-px flex-[1_0_0] flex-col items-start text-[#5f6368] [word-break:break-word] ${
        item.layout === "inline" ? "gap-[6px]" : "gap-[4px]"
      }`}
    >
      {/*
        The design's `whitespace-nowrap` is what keeps each detail on one line
        at 860px — and 860 is the card's width at the design viewport ONLY.
        The service page's content-left starts shrinking the moment the
        viewport drops below 1440, so the release is at `max-[1439px]`, not at
        768 as it first was: at 1025 the column is ~445px and the wallet-promo
        title ("Add your driver's licence to your digital wallet?") was running
        out through the right-hand edge of its own card. It still fits on one
        line wherever there is room, so this changes nothing above ~1200.
      */}
      <p className="shrink-0 text-[18px] font-bold leading-[1.5] whitespace-nowrap max-[1439px]:whitespace-normal">
        {item.title}
      </p>
      {item.lines.map((line) => (
        <p
          key={line.text}
          className={`shrink-0 text-[14px] leading-[1.5] ${
            /* Figma: Lato:SemiBold — no 600 in Lato, rendered 700. */
            line.emphasis ? "font-bold" : "font-normal"
          } ${item.kind === "wallet-promo" && !line.text.startsWith("Expires") ? "min-w-full" : "whitespace-nowrap max-[1439px]:whitespace-normal"}`}
        >
          {line.text}
        </p>
      ))}

      {/* warning-badge 6098:34981 — the only red on this frame. */}
      {item.warning ? (
        <div
          className="flex shrink-0 items-center gap-[6px] rounded-[4px] bg-[#fdf2f2] px-[8px] py-[4px]"
          data-node-id="6098:34981"
        >
          <div className="relative size-[6px] shrink-0" data-node-id="6098:34982">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={ASSETS.iconRedDot}
            />
          </div>
          <p
            className="shrink-0 whitespace-nowrap text-[12px] font-bold leading-[14px] text-[#d32f2f]"
            data-node-id="6098:34983"
          >
            {item.warning}
          </p>
        </div>
      ) : null}
    </div>
  );
}

const CARD =
  "box-border w-full shrink-0 rounded-[6px] bg-white p-[24px] shadow-[inset_0_0_0_1px_#d4d8da] max-xs:p-[16px]";

/*
 * VRC VC upsell — Figma 6257:73252, 812 x 102. ADDED 2026-09-22 with the
 * 6257:72314 re-sync; only the CHEV card carries one.
 *
 * ====================================================================
 * MEASURED. Every offset below is read off the node tree, and each one is
 * produced by the box model rather than hardcoded:
 *   panel        812 x 102   r-[6px] #e9ecef, p-[16px], gap-[16px], items-center
 *     avatar-box  64 x 64    at x=16, y=19   ((102 - 64) / 2 = 19 — centred)
 *       QR code   45 x 45    p-[12px] inside the 64 box   (6259:73307)
 *     item-details 569 x 70  at x=96, y=16   gap-[6px]
 *       Frame 14676 173 x 22 at y=0          gap-[8px], items-start
 *         "Skip the paper copy" 123 x 21     14px Bold #004b87
 *         New_pill   42 x 22                 px-[8px] py-[4px] r-[4px] #004b87
 *       body       569 x 42  at y=28         14px Regular #004b87, two lines
 *     actions-box 115 x 40   at x=681, y=31  ((102 - 40) / 2 = 31 — centred)
 *       btn-primary 115 x 40                 the same btn-primary as the cards
 *
 * 16 + 64 + 16 + 569 + 16 + 115 + 16 = 812. The details column is `flex-1`,
 * so the 569 is what is left over, not a fixed width.
 *
 * THE AVATAR BOX IS THE SAME #e9ecef AS THE PANEL, so it is invisible against
 * it. That is what the design file says (both fills read #e9ecef) and it is
 * reproduced rather than "corrected" to the #ffffff a card icon-box would
 * normally take.
 *
 * NEW_PILL LEADING. Figma says `line-height: normal` and measures the pill at
 * 22px (4 + 14 + 4). The browser's own `normal` for Lato at 12px rounds to 15,
 * which makes the pill 23 and the panel 103. Pinned to the measured 14px —
 * the same correction the green `New` and red `Expired` pills above already
 * carry. Logged in design/token-exceptions.md.
 *
 * THIS PILL IS BLUE (#004b87 on white), NOT the green #d1e7dd/#198754 pill the
 * hidden `VC - Add to your wallet` button used. Two different `New` pills in
 * one file; reproduced as drawn.
 * ====================================================================
 *
 * RESPONSIVE. Three boxes across at the design width. The details column is
 * flexible and the other two are `shrink-0`, so at 320 the QR (64) plus the
 * button (115) plus 48px of padding and gaps leaves ~90px for two lines of
 * copy. Below 768 it becomes a column, matching how the `inline` card above
 * reflows, and the button goes full width so it does not sit orphaned.
 *
 * THE BUTTON WAS INERT until 2026-09-29, like every other button on a
 * linked-item card, because the design drew no digital-wallet screen. Flow 3
 * (Figma section 6343:84884) now draws one, so "Add to wallet" is a link to it
 * — see the note on the link itself. Every OTHER button on these cards is
 * still inert.
 */
function VcUpsellPanel({ upsell }: { upsell: NonNullable<LinkedItem["upsell"]> }) {
  return (
    <div
      className="flex w-full shrink-0 items-center gap-[16px] rounded-[6px] bg-[#e9ecef] p-[16px] max-md:flex-col max-md:items-start"
      data-node-id={upsell.nodeId}
      data-name="VRC VC upsell"
    >
      {/* avatar-box 6257:73253 */}
      <div
        className="flex size-[64px] shrink-0 items-center justify-center rounded-[6px] bg-[#e9ecef] p-[12px]"
        data-node-id="6257:73253"
      >
        <div className="relative size-[45px] shrink-0" data-node-id="6259:73307">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            src={ASSETS.iconQrCode}
          />
        </div>
      </div>

      {/* item-details 6257:73255 */}
      <div
        className="flex min-w-px flex-[1_0_0] flex-col items-start gap-[6px] max-md:w-full"
        data-node-id="6257:73255"
      >
        {/* Frame 14676 6259:73327 */}
        <div className="flex shrink-0 items-start gap-[8px]" data-node-id="6259:73327">
          <p
            className="shrink-0 text-[14px] font-bold leading-[1.5] whitespace-nowrap text-[#004b87]"
            data-node-id="6257:73256"
          >
            {upsell.title}
          </p>
          {/* New_pill 6259:73324 */}
          <div
            className="flex shrink-0 items-center rounded-[4px] bg-[#004b87] px-[8px] py-[4px]"
            data-node-id="6259:73324"
          >
            <p
              className="shrink-0 text-[12px] font-bold leading-[14px] whitespace-nowrap text-white"
              data-node-id="6259:73325"
            >
              {upsell.badge}
            </p>
          </div>
        </div>
        <p
          className="min-w-full shrink-0 text-[14px] font-normal leading-[1.5] text-[#004b87] [word-break:break-word]"
          data-node-id="6257:73257"
        >
          {upsell.body}
        </p>
      </div>

      {/* actions-box 6257:73259 */}
      <div
        className="flex shrink-0 flex-col items-start max-md:w-full max-md:items-stretch"
        data-node-id="6257:73259"
      >
        {/*
          FLOW 3's ENTRY POINT — CHANGED 2026-09-29 from an inert <button>
          (the "Not part of this demo" toast) to a real link to the C1 wallet
          page, Figma 6220:86445. User: "start implmenting workflow 3".

          BEHAVIOUR ONLY. Same BTN_PRIMARY classes, same label, same node id,
          so the `service-verified` frame must still diff at 0.000% — and it is
          the gate that proves it. `<a>` vs `<button>` renders the same box
          here because Tailwind's preflight already resets the button's UA font,
          colour, padding and border, and BTN_PRIMARY sets every one of them
          explicitly. Only the cursor changes (default -> pointer), which the
          screenshot does not paint, because the control now does something.

          `next/link`, not a bare `<a>`: a full document load would drop the
          warm `gnl-demo:v1` provider and DemoNav's key handler, the same
          reason YotiContinue switched (DEMO_AUDIT.md, Yoti zone pass).
        */}
        {/* FLOW3_BRIEF.md §10 item 7 — the "added" state, behind a flag that
            is OFF: with it off this is the original <Link>, unchanged. */}
        {UPSELL_ADDED_STATE_ENABLED ? (
          <UpsellAddedAction
            href={upsell.actionHref}
            label={upsell.actionLabel}
            className={BTN_PRIMARY}
            nodeId="6257:73260"
          />
        ) : (
          <Link
            href={upsell.actionHref}
            className={`${BTN_PRIMARY} cursor-pointer select-none`}
            data-node-id="6257:73260"
          >
            {upsell.actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

/*
 * RESPONSIVE. Both layouts are rows of icon + details + actions at the design
 * width and both reflow the same way below 768:
 *
 *   inline   the three-across row (icon | details | button) becomes a column.
 *            The action button, which is `shrink-0` beside a flexible details
 *            column, has nowhere to go on a 320px screen otherwise. Once
 *            stacked it is left-aligned under the details, at its 44px
 *            `gnl-touch` height.
 *   stacked  the identity row keeps the icon beside the details (64px + text
 *            still fits at 320), and only the button row wraps, so two
 *            actions become two full lines rather than two squeezed halves.
 *
 * `items-start` on the stacked identity row below 768: with the detail lines
 * now allowed to wrap, centring the 64px icon against three lines of text
 * leaves it floating; top-aligned reads as one block.
 */
export function LinkedItemCard({ item }: { item: LinkedItem }) {
  if (item.layout === "inline") {
    return (
      <div
        className={`${CARD} flex items-center gap-[20px] max-md:flex-col max-md:items-start max-md:gap-[16px]`}
        data-node-id={item.nodeId}
      >
        <IconBox item={item} />
        <ItemDetails item={item} />
        <div className="flex shrink-0 flex-col items-start max-md:w-full max-md:items-stretch">
          {item.actions.map((action) => (
            <ActionButton key={action.label} action={action} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${CARD} flex flex-col items-start gap-[20px] max-md:gap-[16px]`}
      data-node-id={item.nodeId}
    >
      {/* card-identity-row */}
      <div className="flex w-full shrink-0 items-center gap-[20px] rounded-[6px] max-md:items-start max-md:gap-[16px]">
        <IconBox item={item} />
        <ItemDetails item={item} />
      </div>

      {/* card-buttons-row — gap-[12px], items-start so the "New" pill sits
          top-aligned. The four buttons on the vehicle card are ~656px of
          `shrink-0` content: they fit the designed 812px interior with room to
          spare, so wrapping is inert at 1440, but at 1025 the interior is
          ~397px and they were running straight out through the card's right
          edge. Wrapping is therefore allowed anywhere below the design width,
          not just on phones. */}
      <div className="flex w-full shrink-0 items-start gap-[12px] rounded-[6px] max-[1439px]:flex-wrap">
        {item.actions.map((action) => (
          <ActionButton key={action.label} action={action} />
        ))}
      </div>

      {/* VRC VC upsell 6257:73252 — the third child of the CHEV card only, on
          the card's own 20px gap. 24 + 77 + 20 + 40 + 20 + 102 + 24 = 307,
          which is the card height in the design. */}
      {item.upsell ? <VcUpsellPanel upsell={item.upsell} /> : null}
    </div>
  );
}
