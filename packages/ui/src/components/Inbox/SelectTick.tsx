import { color, component } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconCheck } from '../../icons/defs.js';

const { room, panel } = component.inbox;

/**
 * The tick's outline. Round is the room card's; square is the filter panel's.
 *
 * Two shapes because they stand in for different things: on a room card the
 * tick takes the unread counter's place, and the counter is round; in the
 * filter panel it is an ordinary checkbox in a list of options.
 */
export type SelectTickShape = 'round' | 'square';

/** Per-instance overrides for the tick's own metrics. */
export type SelectTickStyleProps = {
  size?: CssLength;
  iconSize?: CssLength;
  borderWidth?: CssLength;
  /** Fill and border while ticked. Defaults to the brand blue. */
  tone?: string;
  /** Border while unticked. Defaults to `tone`. */
  borderColor?: string;
  /** The checkmark's color. */
  checkColor?: string;
};

export type SelectTickProps = {
  /** Whether the tick is filled. */
  checked?: boolean;
  /**
   * Which outline to draw.
   * @default 'round'
   */
  shape?: SelectTickShape;
  /** Greys the outline out. The tick itself stays drawn if `checked`. */
  disabled?: boolean;
} & SelectTickStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * A drawn checkbox — not an input.
 *
 * Figma: "Chat Checkbox" (node 2240:10564) and the filter panel's tick.
 *
 * Deliberately presentational, and deliberately not `Checkbox`. Every place it
 * appears, the whole row is already a `<button>` that toggles: a real
 * `<input type="checkbox">` nested inside a button is invalid markup, and the
 * nested control swallows the click its own row is trying to handle. The row
 * carries `aria-pressed`, so the state still reaches a screen reader — this
 * only has to show it.
 *
 * Use `Checkbox` instead wherever the tick is the control, rather than a mark
 * on something else that is.
 */
export const SelectTick = forwardRef<HTMLSpanElement, SelectTickProps>(function SelectTick(
  {
    checked = false,
    shape = 'round',
    disabled = false,
    size,
    iconSize,
    borderWidth,
    tone,
    borderColor,
    checkColor,
    ...rest
  },
  ref,
) {
  const round = shape === 'round';
  const fill = tone ?? color.badge.foreground;
  const edge = disabled ? color.disable.background : borderColor ?? fill;

  return (
    <span
      ref={ref}
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: len(size) ?? (round ? room.checkSize : panel.tickSize),
        height: len(size) ?? (round ? room.checkSize : panel.tickSize),
        borderRadius: round ? '50%' : panel.tickRadius,
        backgroundColor: checked ? fill : 'transparent',
        border: `${len(borderWidth) ?? `${room.checkBorderWidth}px`} solid ${
          checked ? fill : edge
        }`,
      }}
      {...rest}
    >
      {checked && (
        <Icon
          icon={IconCheck}
          size={len(iconSize) ?? (round ? room.checkIconSize : panel.tickIconSize)}
          color={checkColor ?? color.main.white}
        />
      )}
    </span>
  );
});
