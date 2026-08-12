import { color, component, type IconButtonSize } from '@gigradar/theme';
import { forwardRef, useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';

export type { IconButtonSize };

const { iconButton } = component;

/**
 * How much chrome the button carries.
 *
 * `ghost` is the default and the common case — a bare glyph that fills only on
 * hover, which is what a close or back control wants. `subtle` sits on the
 * pale badge fill at rest, and `solid` is the filled brand disc.
 */
export type IconButtonVariant = 'ghost' | 'subtle' | 'solid';

export type IconButtonStyleProps = {
  /** The button's edge. Overrides the `size` step. */
  buttonSize?: CssLength;
  /** The glyph inside. */
  iconSize?: CssLength;
  /** Corner radius. Round by default. */
  radius?: CssLength;
  /** Fill at rest. */
  background?: string;
  /** Glyph color. */
  textColor?: string;
  /** Fill on hover. */
  hoverBackground?: string;
};

export type IconButtonProps = {
  /** The glyph, from the icon set. */
  icon: IconDef;
  /**
   * Accessible name. Required — a button with no text is unnamed to a screen
   * reader, and the glyph carries no name of its own.
   */
  'aria-label': string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
} & IconButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

/** Fill and glyph color per variant, at rest and on hover. */
const variants: Record<
  IconButtonVariant,
  { background: string; color: string; hover: string }
> = {
  ghost: {
    background: 'transparent',
    color: color.navbar.text,
    hover: color.navbar.hover,
  },
  subtle: {
    background: color.badge.background,
    color: color.badge.foreground,
    hover: color.badge.border,
  },
  solid: {
    background: color.main.brand,
    color: color.main.white,
    hover: color.badge.hover,
  },
};

/**
 * A square button holding one glyph and no label — close, back, overflow.
 *
 * Not drawn in Figma as its own component; it is here because `Button` cannot
 * express this shape without being dismantled. Getting a bare round glyph out
 * of `Button` meant passing `paddingX`, `radius`, `background`, and
 * `borderColor` on every instance purely to suppress the box it draws, at
 * which point four override props were doing the work of one component.
 *
 * Square by construction rather than by padding: the edge comes from
 * `controlHeight`, so an icon button sits level with a text button beside it
 * however large the glyph inside happens to be.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  {
    icon,
    variant = 'ghost',
    size = 'medium',
    buttonSize,
    iconSize,
    radius,
    background,
    textColor,
    hoverBackground,
    disabled = false,
    onPointerEnter,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const palette = variants[variant];
  const edge = len(buttonSize) ?? `${iconButton.size[size]}px`;

  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: edge,
    height: edge,
    padding: 0,
    border: 'none',
    borderRadius: len(radius) ?? `${iconButton.radius}px`,
    backgroundColor:
      hovered && !disabled
        ? (hoverBackground ?? palette.hover)
        : (background ?? palette.background),
    color: textColor ?? palette.color,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    appearance: 'none',
    transition: 'background-color 120ms ease',
  };

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      disabled={disabled}
      style={style}
      onPointerEnter={(event) => {
        setHovered(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setHovered(false);
        onPointerLeave?.(event);
      }}
    >
      <Icon icon={icon} size={len(iconSize) ?? iconButton.iconSize[size]} />
    </button>
  );
});
