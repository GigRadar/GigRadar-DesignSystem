import { color, component, typography, type BadgeSize } from '@uiuxjoseph/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';

export type { BadgeSize };

const { badge } = component;

export type CreditBadgeStyleProps = {
  /** Horizontal padding. Overrides the `size` step. */
  paddingX?: CssLength;
  /** Vertical padding. Overrides the `size` step. */
  paddingY?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Space between the number and the credit mark. */
  gap?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Credit mark diameter. */
  markSize?: CssLength;
  /** Pill fill. */
  background?: string;
  /** Number color. */
  textColor?: string;
  /** Credit mark fill. */
  markBackground?: string;
  /** Credit mark glyph color. */
  markColor?: string;
};

export type CreditBadgeProps = {
  /**
   * The credit amount. A number is rendered as-is; format it yourself if you
   * want grouping or a unit, since the badge does not know your locale.
   */
  children?: React.ReactNode;
  size?: BadgeSize;
} & CreditBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The GigRadar credits badge — an amount followed by the circular credit mark.
 *
 * Figma: node 1282:28608. A light blue pill (the NavBar hover token) holding a
 * regular-weight number and a 16px dark disc with a "G" in it.
 *
 * The mark is drawn here rather than pulled from the icon set: it is a piece
 * of this badge's anatomy — it scales with the badge's size step and takes its
 * colors from the badge's own props — not a glyph an app would place on its
 * own.
 */
export const CreditBadge = forwardRef<HTMLSpanElement, CreditBadgeProps>(function CreditBadge(
  {
    children,
    size = 'medium',
    paddingX,
    paddingY,
    fontSize,
    gap,
    radius,
    markSize,
    background,
    textColor,
    markBackground,
    markColor,
    ...rest
  },
  ref,
) {
  const mark = len(markSize) ?? `${badge.credit.markSize[size]}px`;

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    gap: len(gap) ?? `${badge.gap[size]}px`,
    padding: `${len(paddingY) ?? `${badge.paddingY[size]}px`} ${len(paddingX) ?? `${badge.paddingX[size]}px`}`,
    borderRadius: len(radius) ?? `${badge.radius}px`,
    backgroundColor: background ?? color.navbar.hover,
    color: textColor ?? color.main.black,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${badge.fontSize[size]}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  return (
    <span {...rest} ref={ref} style={style}>
      {children}
      <CreditMark size={mark} background={markBackground} glyphColor={markColor} />
    </span>
  );
});

/**
 * The credit mark: a dark disc with a "G" and an underline beneath it.
 *
 * Drawn as an SVG rather than text so the glyph does not depend on SF Pro
 * being installed — the same reason the icon set ships outlined paths.
 */
function CreditMark({
  size,
  background,
  glyphColor,
}: {
  size: string;
  background?: string;
  glyphColor?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, display: 'block' }}
    >
      <circle cx="8" cy="8" r="8" fill={background ?? color.navbar.textActive} />
      <text
        x="8"
        y="8"
        textAnchor="middle"
        dominantBaseline="central"
        fill={glyphColor ?? color.main.white}
        fontFamily={typography.fontFamily.base}
        fontSize="9"
        fontWeight={typography.fontWeight.medium}
      >
        G
      </text>
      <rect x="3.5" y="11" width="9" height="1.5" rx="0.75" fill={glyphColor ?? color.main.white} />
    </svg>
  );
}
