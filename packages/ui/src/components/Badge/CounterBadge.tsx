import { color, component, typography, type BadgeSize } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { badge } = component;

export type CounterBadgeStyleProps = {
  /** Circle diameter. Overrides the `size` step. */
  diameter?: CssLength;
  fontSize?: CssLength;
  fontWeight?: number;
  background?: string;
  textColor?: string;
};

export type CounterBadgeProps = {
  /**
   * The count. Values above `max` render as "max+".
   *
   * Passed as a number rather than free text so the overflow rule can apply —
   * a counter showing "1,204" would burst the circle it is drawn in.
   */
  count?: number;
  /**
   * Counts above this render as "{max}+".
   * @default 99
   */
  max?: number;
  /**
   * Render an empty dot instead of a number — the "unread, count unknown"
   * state. Figma models this with its `counter` toggle.
   */
  dot?: boolean;
  size?: BadgeSize;
  /**
   * Accessible description, e.g. "3 unread messages". Without it the badge is
   * a bare number to a screen reader, which does not say what is being counted.
   */
  label?: string;
} & CounterBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The counter badge — a filled circle holding a count.
 *
 * Figma: node 313:6469. A 24px brand-blue disc with semibold 12px white text.
 *
 * The circle is sized rather than padded, so a two-digit count keeps the same
 * outline as a one-digit one; anything longer would distort it, which is why
 * `max` exists.
 */
export const CounterBadge = forwardRef<HTMLSpanElement, CounterBadgeProps>(function CounterBadge(
  {
    count,
    max = 99,
    dot = false,
    size = 'medium',
    label,
    diameter,
    fontSize,
    fontWeight,
    background,
    textColor,
    ...rest
  },
  ref,
) {
  const edge = len(diameter) ?? `${badge.counter.size[size]}px`;
  const shown = count == null ? '' : count > max ? `${max}+` : String(count);

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    // A fixed square with a full radius, so the badge is a circle at one digit
    // and a pill at "99+" rather than an oval.
    minWidth: edge,
    height: edge,
    padding: dot ? 0 : '0 4px',
    borderRadius: `${badge.radius}px`,
    backgroundColor: background ?? color.main.brand,
    color: textColor ?? color.main.white,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${badge.counter.fontSize[size]}px`,
    fontWeight: fontWeight ?? typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  const dotStyle: CSSProperties = dot
    ? { ...style, minWidth: `calc(${edge} / 2)`, height: `calc(${edge} / 2)` }
    : style;

  return (
    <span
      {...rest}
      ref={ref}
      style={dotStyle}
      role={label ? 'status' : undefined}
      aria-label={label}
    >
      {!dot && shown}
    </span>
  );
});
