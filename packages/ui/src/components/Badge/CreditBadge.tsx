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
 * The GigRadar credit mark, exported from Figma: a dark disc holding a "G"
 * under the radar arc.
 *
 * The "G" is an outlined path rather than a `<text>` node, so the mark does not
 * depend on SF Pro being installed — the same reason the icon set ships
 * outlined paths.
 *
 * The arc keeps its own amber; it is the GigRadar mark rather than a themeable
 * surface, so only the disc and the "G" take `markBackground` / `markColor`.
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
      <rect
        width="16"
        height="16"
        rx="8"
        transform="matrix(1 0 0 -1 0 16)"
        fill={background ?? color.navbar.textActive}
      />
      <path d="M3.5 6.75C5 2.75 11 2.75 12.5 6.74999" stroke="#FFAC33" strokeLinecap="round" />
      <path
        d="M8.1123 12.3672C6.0957 12.3672 4.82617 10.9609 4.82617 8.69531V8.69043C4.82617 6.46875 6.0957 5.08691 8.09766 5.08691C9.74805 5.08691 10.7832 6.03906 11.0762 7.30859L11.0957 7.39648H9.97266L9.95801 7.34277C9.66016 6.52734 9.02051 6.05371 8.10254 6.05371C6.75488 6.05371 5.93945 7.03516 5.93945 8.68555V8.69043C5.93945 10.375 6.7793 11.4004 8.12207 11.4004C9.26465 11.4004 10.0557 10.6777 10.0703 9.6084V9.49121H8.21973V8.59766H11.1494V9.32031C11.1494 11.2295 10.0215 12.3672 8.1123 12.3672Z"
        fill={glyphColor ?? color.main.white}
      />
    </svg>
  );
}
