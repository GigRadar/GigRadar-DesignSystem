import { color, radius, shadow, spacing, textStyle, typography } from '@gigradar/theme';
import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'small' | 'medium' | 'large';

export type ButtonProps = {
  /** Visual style. Additive — new variants may be added in a minor release. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Renders a spinner and blocks interaction. */
  loading?: boolean;
  /** Stretches the button to fill its container. */
  block?: boolean;
  /** Icon rendered before the label. */
  icon?: ReactNode;
  children?: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

const sizeStyles: Record<ButtonSize, CSSProperties> = {
  small: {
    ...textStyle.sMedium,
    height: 28,
    padding: `0 ${spacing.s}px`,
    gap: spacing.xxs,
  },
  medium: {
    ...textStyle.mMedium,
    height: 36,
    padding: `0 ${spacing.m}px`,
    gap: spacing.xs,
  },
  large: {
    ...textStyle.lMedium,
    height: 44,
    padding: `0 ${spacing.l}px`,
    gap: spacing.xs,
  },
};

type VariantPalette = {
  background: string;
  color: string;
  border: string;
  hoverBackground: string;
  hoverBorder: string;
};

const variantPalettes: Record<ButtonVariant, VariantPalette> = {
  primary: {
    background: color.main.brand,
    color: color.main.white,
    border: color.main.brand,
    hoverBackground: color.badge.hover,
    hoverBorder: color.badge.hover,
  },
  secondary: {
    background: color.main.white,
    color: color.main.brand,
    border: color.main.border,
    hoverBackground: color.badge.background,
    hoverBorder: color.main.brand,
  },
  ghost: {
    background: 'transparent',
    color: color.main.description,
    border: 'transparent',
    hoverBackground: color.navbar.hover,
    hoverBorder: 'transparent',
  },
  danger: {
    background: color.status.error.main,
    color: color.main.white,
    border: color.status.error.main,
    hoverBackground: color.status.error.text,
    hoverBorder: color.status.error.text,
  },
};

/**
 * The GigRadar button.
 *
 * Every value below reads from `@gigradar/theme`. No literals.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'medium', loading = false, block = false, icon, children, disabled, ...rest },
  ref,
) {
  const isDisabled = disabled || loading;
  const palette = variantPalettes[variant];

  const style: CSSProperties = {
    // Layout
    display: block ? 'flex' : 'inline-flex',
    width: block ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    ...sizeStyles[size],

    // Identity
    fontFamily: typography.fontFamily.base,
    borderRadius: radius.s,
    borderWidth: 1,
    borderStyle: 'solid',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 120ms ease, border-color 120ms ease, color 120ms ease',
    whiteSpace: 'nowrap',

    // Palette
    backgroundColor: isDisabled ? color.disable.background : palette.background,
    color: isDisabled ? color.disable.text : palette.color,
    borderColor: isDisabled ? color.disable.background : palette.border,
  };

  return (
    <button
      {...rest}
      ref={ref}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      style={style}
      onMouseEnter={(event) => {
        if (!isDisabled) {
          event.currentTarget.style.backgroundColor = palette.hoverBackground;
          event.currentTarget.style.borderColor = palette.hoverBorder;
        }
        rest.onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        if (!isDisabled) {
          event.currentTarget.style.backgroundColor = palette.background;
          event.currentTarget.style.borderColor = palette.border;
        }
        rest.onMouseLeave?.(event);
      }}
      onFocus={(event) => {
        if (!isDisabled) {
          event.currentTarget.style.boxShadow = `0 0 0 3px ${color.badge.background}`;
        }
        rest.onFocus?.(event);
      }}
      onBlur={(event) => {
        event.currentTarget.style.boxShadow = shadow.none;
        rest.onBlur?.(event);
      }}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  );
});

function Spinner() {
  return (
    <span
      aria-hidden
      style={{
        width: '1em',
        height: '1em',
        border: '2px solid currentColor',
        borderTopColor: 'transparent',
        borderRadius: radius.round,
        display: 'inline-block',
        animation: 'gr-spin 600ms linear infinite',
      }}
    />
  );
}
