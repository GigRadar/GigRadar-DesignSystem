import { color, component, textStyle, type StageName } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown } from '../../icons/defs.js';

const { leadStage } = component.middle;

/**
 * The two sizes.
 *
 * `l` is what Figma draws in the chat header (node 3523:37527). `m` is the same
 * pill one step down, for rows that cannot spend 30px on it — a compact room
 * card, a table cell. The type size does not change between them: 12px is
 * already the smallest step the label reads at, so `m` trims the box instead.
 */
export type LeadStageSize = 'l' | 'm';

/**
 * The label Figma writes for each stage.
 *
 * Exported so the stage picker writes the same words: two copies would let the
 * pill and the menu that sets it drift apart, which is the one place a mismatch
 * would be most confusing.
 */
export const stageLabels: Record<StageName, string> = {
  new: 'New',
  contactLater: 'Contact Later',
  interested: 'Interested',
  booked: 'Booked',
  happened: 'Happened',
  qualified: 'Qualified',
  converted: 'Converted',
  unreachable: 'Unreachable',
  notInterested: 'Not Interested',
  wrongTarget: 'Wrong Target',
  alreadyEquipped: 'Already Equipped',
};

/** Per-instance overrides for the pill's own metrics. */
export type LeadStageButtonStyleProps = {
  height?: CssLength;
  radius?: CssLength;
  paddingX?: CssLength;
  gap?: CssLength;
  /** Fill. Defaults to the stage's tint from `color.stageFlat`. */
  background?: string;
  textColor?: string;
};

export type LeadStageButtonProps = {
  /** Which stage the lead is in. Picks both the label and the tint. */
  stage: StageName;
  /**
   * @default 'l'
   */
  size?: LeadStageSize;
  /**
   * Overrides the stage's own label — for a stage the product has renamed
   * without the pipeline itself changing.
   */
  children?: ReactNode;
  /**
   * Draws the trailing chevron, the affordance that says the stage can be
   * changed from here. Off, the pill is a read-only badge.
   * @default true
   */
  interactive?: boolean;
  /** Whether the stage menu is open. Rotates the chevron. */
  open?: boolean;
  /** Whether the stage can be changed. */
  disabled?: boolean;
} & LeadStageButtonStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

/**
 * The lead's stage, and the control that changes it.
 *
 * Figma: node 3523:37527 (Lead Stage Badge - L), eleven stages. Figma files it
 * as a badge, but every instance carries a chevron and opens the stage menu, so
 * it is built as a button — `interactive={false}` is the badge.
 *
 * Rendered as a `<button>` even when non-interactive would allow a `<span>`:
 * the pill is the same element in both cases, and swapping the tag on a prop
 * would move focus around as a screen toggled it.
 */
export const LeadStageButton = forwardRef<HTMLButtonElement, LeadStageButtonProps>(
  function LeadStageButton(
    {
      stage,
      size = 'l',
      children,
      interactive = true,
      open = false,
      disabled = false,
      height,
      radius,
      paddingX,
      gap,
      background,
      textColor,
      ...rest
    },
    ref,
  ) {
    const tone = textColor ?? color.main.black;

    return (
      <button
        ref={ref}
        type="button"
        // The pill opens a menu when it is interactive; otherwise it is a label
        // and should not announce itself as expandable.
        aria-expanded={interactive ? open : undefined}
        aria-disabled={interactive ? undefined : true}
        disabled={disabled}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          gap: len(gap) ?? leadStage.gap,
          height: len(height) ?? leadStage.height[size],
          paddingLeft: len(paddingX) ?? leadStage.paddingX[size],
          paddingRight: len(paddingX) ?? leadStage.paddingX[size],
          paddingTop: leadStage.paddingY,
          paddingBottom: leadStage.paddingY,
          border: 'none',
          borderRadius: len(radius) ?? leadStage.radius,
          backgroundColor: background ?? color.stageFlat[stage],
          cursor: !interactive || disabled ? 'default' : 'pointer',
          opacity: disabled ? 0.5 : 1,
        }}
        {...rest}
      >
        <span
          style={{
            ...textStyle.sRegular,
            color: tone,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {children ?? stageLabels[stage]}
        </span>
        {interactive && (
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              transform: open ? 'rotate(180deg)' : undefined,
            }}
          >
            <Icon
              icon={IconDropdownArrowDown}
              size={leadStage.chevronSize[size]}
              color={color.main.description}
            />
          </span>
        )}
      </button>
    );
  },
);
