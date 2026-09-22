import { ASSETS } from "@/lib/assets";
import type { LinkedItem, LinkedItemAction } from "@/lib/data/driver-vehicle";

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
    </div>
  );
}
