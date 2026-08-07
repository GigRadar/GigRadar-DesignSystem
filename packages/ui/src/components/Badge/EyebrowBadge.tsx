import { color, component, typography, type BadgeSize } from '@uiuxjoseph/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { badge } = component;

export type EyebrowBadgeStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  fontSize?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  /** Sparkle glyph edge length. */
  iconSize?: CssLength;
  background?: string;
  textColor?: string;
  /** Sparkle color. Defaults to the brand blue. */
  iconColor?: string;
};

export type EyebrowBadgeProps = {
  children?: ReactNode;
  size?: BadgeSize;
  /**
   * Which sparkles to draw. Figma flanks the label with one on each side;
   * `start` or `end` keeps a single one when the badge sits in a tight row.
   *
   * @default 'both'
   */
  sparkles?: 'both' | 'start' | 'end' | 'none';
} & EyebrowBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The eyebrow badge — a label flanked by sparkles, for AI and onboarding.
 *
 * Figma: node 163:10 ("Badge AI"). A pale blue pill with semibold 12px text
 * and an 18px sparkle on each side.
 *
 * Figma fills the label with a radial gradient from #5DADFD to #378AFA. That
 * is a two-stop gradient across roughly 47px of text, which reads as flat at
 * this size, so the label takes the solid brand token instead — one less
 * value that cannot be themed. Set `textColor` if a gradient is ever wanted
 * back.
 */
export const EyebrowBadge = forwardRef<HTMLSpanElement, EyebrowBadgeProps>(function EyebrowBadge(
  {
    children,
    size = 'medium',
    sparkles = 'both',
    paddingX,
    paddingY,
    fontSize,
    gap,
    radius,
    iconSize,
    background,
    textColor,
    iconColor,
    ...rest
  },
  ref,
) {
  const glyph = len(iconSize) ?? `${badge.eyebrow.iconSize[size]}px`;

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    gap: len(gap) ?? `${badge.eyebrow.gap[size]}px`,
    padding: `${len(paddingY) ?? `${badge.eyebrow.paddingY[size]}px`} ${
      len(paddingX) ?? `${badge.eyebrow.paddingX[size]}px`
    }`,
    borderRadius: len(radius) ?? `${badge.radius}px`,
    backgroundColor: background ?? color.badge.background,
    color: textColor ?? color.main.brand,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${badge.eyebrow.fontSize[size]}px`,
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  const showStart = sparkles === 'both' || sparkles === 'start';
  const showEnd = sparkles === 'both' || sparkles === 'end';

  return (
    <span {...rest} ref={ref} style={style}>
      {showStart && <Sparkle size={glyph} fill={iconColor ?? color.main.brand} />}
      {children}
      {showEnd && <Sparkle size={glyph} fill={iconColor ?? color.main.brand} />}
    </span>
  );
});

/** The heroicons "sparkles" glyph, as drawn in Figma. */
function Sparkle({ size, fill }: { size: string; fill: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width={size}
      height={size}
      fill={fill}
      aria-hidden
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path d="M5 2a1 1 0 0 1 .967.744L6.5 4.75l2.006.533a1 1 0 0 1 0 1.934L6.5 7.75l-.533 2.006a1 1 0 0 1-1.934 0L3.5 7.75l-2.006-.533a1 1 0 0 1 0-1.934L3.5 4.75l.533-2.006A1 1 0 0 1 5 2ZM13 6a1 1 0 0 1 .967.744l.902 3.387 3.387.902a1 1 0 0 1 0 1.934l-3.387.902-.902 3.387a1 1 0 0 1-1.934 0l-.902-3.387-3.387-.902a1 1 0 0 1 0-1.934l3.387-.902.902-3.387A1 1 0 0 1 13 6Z" />
    </svg>
  );
}
