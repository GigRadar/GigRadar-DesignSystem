import { color, component, typography, type SwitchSize } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';

export type { SwitchSize };

const { switchControl } = component;

/**
 * Per-instance overrides for a segment's own metrics.
 *
 * The same narrow set the other components expose — the segment's dimensions
 * and colors, not a general style system.
 */
export type SwitchButtonStyleProps = {
  /** Segment height. Overrides the `size` step. */
  height?: CssLength;
  /** Horizontal padding. */
  paddingX?: CssLength;
  /** Vertical padding. */
  paddingY?: CssLength;
  /** Corner radius. Figma draws a pill. */
  radius?: CssLength;
  /** Space between the label and the badge. */
  gap?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Leading icon edge length. */
  iconSize?: CssLength;
  /** Fill of the selected segment. */
  background?: string;
  /** Label color. */
  textColor?: string;
  /** Fill of the discount badge. */
  badgeBackground?: string;
  /** Discount badge text color. */
  badgeTextColor?: string;
};

export type SwitchButtonProps = {
  /**
   * Whether this segment is the chosen one. The parent `Switch` sets it; set
   * it yourself only when driving segments outside a `Switch`.
   */
  selected?: boolean;
  /**
   * Whether the segment paints its own white pill. Defaults to `selected`.
   *
   * `Switch` sets this to `false` on the selected segment once its sliding
   * thumb has been measured — the thumb draws the pill then, and a second one
   * underneath would clip it. Split from `selected` so the label still reads as
   * chosen (medium weight, `aria-selected`) while the fill comes from elsewhere.
   */
  raised?: boolean;
  /** Pins the hover wash on. Useful for documenting the state; `Switch` never sets it. */
  hovered?: boolean;
  size?: SwitchSize;
  /** The segment's label. */
  children?: ReactNode;
  /**
   * A pill drawn after the label — "Save 20%" in Figma. Its brand-blue fill is
   * the one bit of color in the control, so it stays legible on both the plain
   * track and the white selected segment.
   */
  badge?: ReactNode;
  /** An optional glyph before the label. Not drawn in Figma, but the slot costs nothing. */
  icon?: IconDef;
} & SwitchButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'type'>;

/**
 * One segment of a segmented switch.
 *
 * Figma: node 3913:24775, which draws three states — "Default" (transparent,
 * regular-weight label), "Hover" (an `E4EAF5` wash), and "Selected" (a white
 * pill, medium-weight label).
 *
 * Exported on its own so a caller can compose a switch by hand, but the usual
 * path is to let `Switch` render these from an `items` array.
 *
 * Rendered as a real `<button>` with `role="tab"` rather than a styled `<div>`:
 * that is what gives it keyboard focus and a click target for free. Hover and
 * focus are tracked in state rather than written as CSS rules, because this
 * package styles inline and ships no stylesheet — the same reason the button
 * does it.
 */
export const SwitchButton = forwardRef<HTMLButtonElement, SwitchButtonProps>(function SwitchButton(
  {
    selected = false,
    raised,
    hovered: hoveredProp,
    size = 'medium',
    children,
    badge,
    icon,
    disabled = false,
    height,
    paddingX,
    paddingY,
    radius,
    gap,
    fontSize,
    iconSize,
    background,
    textColor,
    badgeBackground,
    badgeTextColor,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // Standalone, the segment paints its own pill. Inside a `Switch` the sliding
  // thumb takes that over and passes `raised={false}`.
  const paintsPill = raised ?? selected;

  // Hover only reads on an idle segment: the selected one is already a white
  // pill, and washing it would read as a second selection.
  const showHover = (hoveredProp ?? hovered) && !selected && !disabled;

  const rootStyle: CSSProperties = {
    // Lifts the label above the parent's sliding thumb, which is painted at
    // z-index 0. Harmless when the segment stands alone.
    position: 'relative',
    zIndex: 1,
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    gap: len(gap) ?? `${switchControl.gap[size]}px`,
    height: len(height) ?? `${switchControl.height[size]}px`,
    padding: `${len(paddingY) ?? `${switchControl.paddingY[size]}px`} ${
      len(paddingX) ?? `${switchControl.paddingX[size]}px`
    }`,
    border: 'none',
    borderRadius: len(radius) ?? `${switchControl.radius}px`,
    backgroundColor: paintsPill
      ? (background ?? color.main.white)
      : showHover
        ? color.navbar.hover
        : 'transparent',
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${switchControl.fontSize[size]}px`,
    // The weight is the quiet half of the selected state — Figma draws the
    // same color at Regular when idle and Medium when chosen.
    fontWeight: selected ? typography.fontWeight.medium : typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.m,
    lineHeight: 1,
    color: textColor ?? (disabled ? color.disable.text : color.navbar.text),
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    // The focus ring is drawn with `outline` so it sits outside the pill and
    // does not disturb the track's spacing. Only shown for keyboard focus.
    outline: focused ? `2px solid ${color.main.brand}` : 'none',
    outlineOffset: 2,
    // Figma has no disabled state for this component; the segment is dimmed
    // rather than given a third palette, which fades label and badge together
    // and stays correct if the drawn colors change.
    opacity: disabled ? 0.4 : undefined,
    transition: 'background-color 120ms ease, color 120ms ease',
  };

  const badgeStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    padding: `${switchControl.badge.paddingY[size]}px ${switchControl.badge.paddingX[size]}px`,
    borderRadius: `${switchControl.badge.radius}px`,
    backgroundColor: badgeBackground ?? color.badge.foreground,
    fontSize: `${switchControl.badge.fontSize[size]}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    color: badgeTextColor ?? color.main.white,
    whiteSpace: 'nowrap',
  };

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="tab"
      aria-selected={selected}
      disabled={disabled}
      style={rootStyle}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        // `:focus-visible` is what distinguishes a keyboard tab from a click,
        // and it is readable from the element even though the styles are
        // inline — so a mouse click does not leave a ring behind.
        setFocused(event.currentTarget.matches(':focus-visible'));
        onFocus?.(event);
      }}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
    >
      {icon && (
        <Icon icon={icon} size={len(iconSize) ?? `${switchControl.iconSize[size]}px`} />
      )}
      {children}
      {badge !== undefined && badge !== null && badge !== false && (
        <span style={badgeStyle}>{badge}</span>
      )}
    </button>
  );
});
