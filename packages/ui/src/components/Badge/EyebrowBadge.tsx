import { color, component, typography, type BadgeSize } from '@gigradar/theme';
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

/**
 * The three-point sparkle, exported from Figma.
 *
 * Kept local rather than added to the icon set: it is this badge's anatomy —
 * it scales with the size step and takes the badge's own `iconColor` — the same
 * call as the credit mark in [CreditBadge].
 */
function Sparkle({ size, fill }: { size: string; fill: string }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width={size}
      height={size}
      fill={fill}
      aria-hidden
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.71429 3.28571C6.96942 3.28571 7.19364 3.45484 7.26373 3.70016L7.88331 5.86869C8.1545 6.81785 8.89644 7.55979 9.8456 7.83098L12.0141 8.45056C12.2594 8.52065 12.4286 8.74487 12.4286 9C12.4286 9.25513 12.2594 9.47935 12.0141 9.54944L9.8456 10.169C8.89644 10.4402 8.1545 11.1822 7.88331 12.1313L7.26373 14.2998C7.19364 14.5452 6.96942 14.7143 6.71429 14.7143C6.45915 14.7143 6.23493 14.5452 6.16484 14.2998L5.54526 12.1313C5.27407 11.1822 4.53214 10.4402 3.58297 10.169L1.41445 9.54944C1.16913 9.47935 1 9.25513 1 9C1 8.74487 1.16913 8.52065 1.41445 8.45056L3.58297 7.83098C4.53214 7.55979 5.27408 6.81785 5.54527 5.86868L6.16484 3.70016C6.23493 3.45484 6.45915 3.28571 6.71429 3.28571Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.5714 1C13.8336 1 14.0622 1.17846 14.1258 1.43284L14.323 2.22176C14.5022 2.93833 15.0617 3.49783 15.7782 3.67697L16.5672 3.8742C16.8215 3.9378 17 4.16636 17 4.42857C17 4.69078 16.8215 4.91934 16.5672 4.98294L15.7782 5.18017C15.0617 5.35931 14.5022 5.91881 14.323 6.63538L14.1258 7.42431C14.0622 7.67869 13.8336 7.85714 13.5714 7.85714C13.3092 7.85714 13.0807 7.67869 13.0171 7.42431L12.8198 6.63538C12.6407 5.91881 12.0812 5.35931 11.3646 5.18017L10.5757 4.98294C10.3213 4.91934 10.1429 4.69078 10.1429 4.42857C10.1429 4.16636 10.3213 3.9378 10.5757 3.8742L11.3646 3.67697C12.0812 3.49783 12.6407 2.93833 12.8198 2.22176L13.0171 1.43284C13.0807 1.17846 13.3092 1 13.5714 1Z"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.4286 11.2857C12.6745 11.2857 12.8929 11.4431 12.9707 11.6764L13.2711 12.5776C13.3848 12.9188 13.6526 13.1866 13.9939 13.3004L14.895 13.6008C15.1283 13.6785 15.2857 13.8969 15.2857 14.1429C15.2857 14.3888 15.1283 14.6072 14.895 14.685L13.9939 14.9853C13.6526 15.0991 13.3848 15.3669 13.2711 15.7081L12.9707 16.6093C12.8929 16.8426 12.6745 17 12.4286 17C12.1826 17 11.9642 16.8426 11.8865 16.6093L11.5861 15.7081C11.4723 15.3669 11.2045 15.0991 10.8633 14.9853L9.96216 14.685C9.72882 14.6072 9.57143 14.3888 9.57143 14.1429C9.57143 13.8969 9.72882 13.6785 9.96216 13.6008L10.8633 13.3004C11.2045 13.1866 11.4723 12.9188 11.5861 12.5776L11.8865 11.6764C11.9642 11.4431 12.1826 11.2857 12.4286 11.2857Z"
      />
    </svg>
  );
}
