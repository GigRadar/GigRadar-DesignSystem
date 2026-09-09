import { color, component } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';

const { iconButton } = component.middle.composer;

/** Per-instance overrides for the button's own metrics. */
export type ComposerIconButtonStyleProps = {
  size?: CssLength;
  radius?: CssLength;
  /** The glyph itself, apart from the button around it. */
  iconSize?: CssLength;
  iconColor?: string;
  /** The tint that appears under the pointer. */
  hoverBackground?: string;
};

export type ComposerIconButtonProps = {
  /** The glyph. */
  icon: IconDef;
  /**
   * What it does, for assistive tech. Required: these are icon-only controls
   * with no other name.
   */
  label: string;
  /**
   * Whether the thing it toggles is on — bold while bold is applied, the
   * attachment tray while it is open. Figma calls it "Clicked", and draws it
   * the same as hover but persisting after the pointer leaves.
   * @default false
   */
  active?: boolean;
  /** Whether the control can be used. */
  disabled?: boolean;
} & ComposerIconButtonStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * One small round control on the composer's toolbar.
 *
 * Figma: node 1637:31217 (attachment) and 3620:73190 (the rich-text marks). One
 * component for all of them — the shape and the three states are identical, and
 * the meeting button is the attachment button with a different glyph, as are
 * bold, italic, strike, and code.
 *
 * Transparent at rest rather than carrying a fill: a row of eight filled discs
 * under a text box would read as a second toolbar competing with the message
 * being written.
 */
export const ComposerIconButton = forwardRef<HTMLButtonElement, ComposerIconButtonProps>(
  function ComposerIconButton(
    {
      icon,
      label,
      active = false,
      disabled = false,
      size,
      radius,
      iconSize,
      iconColor,
      hoverBackground,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);
    // Hover and active are the same fill; what separates them is that active
    // outlives the pointer.
    const lit = !disabled && (active || hovered);

    return (
      <button
        ref={ref}
        type="button"
        aria-label={label}
        aria-pressed={active}
        disabled={disabled}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          width: len(size) ?? iconButton.size,
          height: len(size) ?? iconButton.size,
          padding: 0,
          border: 'none',
          borderRadius: len(radius) ?? iconButton.radius,
          backgroundColor: lit ? hoverBackground ?? color.navbar.hover : 'transparent',
          cursor: disabled ? 'default' : 'pointer',
          transition: 'background-color 120ms ease',
        }}
        {...rest}
      >
        <Icon
          icon={icon}
          size={len(iconSize) ?? iconButton.iconSize}
          color={
            iconColor ??
            color.disable.text
          }
        />
      </button>
    );
  },
);
