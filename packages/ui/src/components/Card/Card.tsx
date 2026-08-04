import { color, radius, shadow, spacing, textStyle, typography } from '@uiuxjoseph/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export type CardVariant = 'elevated' | 'outlined' | 'flat';
export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export type CardProps = {
  variant?: CardVariant;
  padding?: CardPadding;
  /** Heading rendered above the content, with a divider. */
  title?: ReactNode;
  /** Rendered opposite the title — actions, menus, counts. */
  extra?: ReactNode;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

const paddingValues: Record<CardPadding, number> = {
  none: 0,
  small: spacing.s,
  medium: spacing.m,
  large: spacing.l,
};

const variantStyles: Record<CardVariant, CSSProperties> = {
  elevated: {
    backgroundColor: color.main.white,
    border: `1px solid ${color.navbar.border}`,
    boxShadow: shadow.base,
  },
  outlined: {
    backgroundColor: color.main.white,
    border: `1px solid ${color.main.border}`,
    boxShadow: shadow.none,
  },
  flat: {
    backgroundColor: color.main.backgroundAlt,
    border: '1px solid transparent',
    boxShadow: shadow.none,
  },
};

/**
 * A surface container.
 *
 * `elevated` uses the single four-layer shadow defined in Figma; there is no
 * elevation scale, by design.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { variant = 'elevated', padding = 'medium', title, extra, children, ...rest },
  ref,
) {
  const pad = paddingValues[padding];

  const style: CSSProperties = {
    boxSizing: 'border-box',
    borderRadius: radius.m,
    fontFamily: typography.fontFamily.base,
    color: color.navbar.textActive,
    overflow: 'hidden',
    ...variantStyles[variant],
  };

  const hasHeader = title != null || extra != null;

  return (
    <div {...rest} ref={ref} style={style}>
      {hasHeader && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.s,
            padding: `${spacing.s}px ${pad || spacing.m}px`,
            borderBottom: `1px solid ${color.navbar.border}`,
            ...textStyle.lSemibold,
          }}
        >
          <span>{title}</span>
          {extra != null && <span style={{ ...textStyle.mRegular, color: color.main.description }}>{extra}</span>}
        </div>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </div>
  );
});
