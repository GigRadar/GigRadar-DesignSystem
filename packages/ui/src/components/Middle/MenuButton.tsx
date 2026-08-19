import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';

const { menuButton } = component.middle;

/** Per-instance overrides for the button's own metrics. */
export type MenuButtonStyleProps = {
  size?: CssLength;
  radius?: CssLength;
  /** Fill while resting. Hover and selected are derived, not overridden here. */
  background?: string;
  borderColor?: string;
  /** The glyph's color while resting. */
  iconColor?: string;
};

export type MenuButtonProps = {
  /** The glyph. The button carries nothing else — it is a circle. */
  icon: IconDef;
  /**
   * What the button does, for assistive tech. Required: an icon-only control
   * has no other name.
   */
  label: string;
  /**
   * Whether the surface this button opens is showing. Figma calls it
   * "Selected or clicked" and fills the circle.
   * @default false
   */
  selected?: boolean;
  /**
   * A count overhanging the top-right corner — how many filters are applied,
   * how many messages are unread. Omitted, no badge is drawn; `0` is treated as
   * nothing to report rather than as a badge reading zero.
   */
  count?: number;
  /**
   * The quieter tone. Figma draws the mobile header's info button in the nav
   * text rather than the brand, because there is only one control there and it
   * should not read as the room's primary action.
   * @default false
   */
  muted?: boolean;
  /** Whether the button can be used. */
  disabled?: boolean;
} & MenuButtonStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * One round control in the chat header.
 *
 * Figma: node 3523:37499 — Default, Hover, and "Selected or clicked", with an
 * optional dot badge. The same button draws filter-chat, view-message, and
 * view-job-posting; they differ only by glyph and by what they open.
 *
 * Hover is tracked in state rather than left to CSS: the component styles
 * inline, so there is no rule to hang `:hover` on, and the filled hover is a
 * drawn state in Figma rather than a tint the browser could approximate.
 */
export const MenuButton = forwardRef<HTMLButtonElement, MenuButtonProps>(function MenuButton(
  {
    icon,
    label,
    selected = false,
    count,
    muted = false,
    disabled = false,
    size,
    radius,
    background,
    borderColor,
    iconColor,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  // Hover and selected are the same fill in Figma — the brand — so they collapse
  // to one branch. What separates them is that selected outlives the pointer.
  const filled = !disabled && (selected || hovered);
  const accent = muted ? color.navbar.text : color.badge.foreground;
  const edge = borderColor ?? (disabled ? color.disable.text : accent);
  const glyph = filled ? color.main.white : iconColor ?? (disabled ? color.disable.text : accent);

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      aria-pressed={selected}
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
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: len(size) ?? menuButton.size,
        height: len(size) ?? menuButton.size,
        padding: `${menuButton.paddingY}px ${menuButton.paddingX}px`,
        borderRadius: len(radius) ?? menuButton.radius,
        border: `${borderWidth.thin}px solid ${edge}`,
        backgroundColor: filled ? accent : background ?? 'transparent',
        cursor: disabled ? 'default' : 'pointer',
      }}
      {...rest}
    >
      {/* Wrapped in a non-shrinking span: the button's padding leaves less
          interior than the glyph asks for, and a bare `<svg>` in a flex row
          shrinks to fit rather than overflowing — which silently pins the icon
          to the leftover space instead of the size it was given. */}
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>
        <Icon icon={icon} size={menuButton.iconSize} color={glyph} />
      </span>
      {/* The badge overhangs the circle, so it sits outside the flow. Its own
          white ring is what keeps it legible against a filled button. */}
      {count != null && count > 0 && (
        <span
          aria-hidden
          style={{
            ...textStyle.sMedium,
            position: 'absolute',
            top: menuButton.badgeOffsetTop,
            right: menuButton.badgeOffsetRight,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            width: menuButton.badgeSize,
            height: menuButton.badgeSize,
            borderRadius: menuButton.badgeRadius,
            border: `${borderWidth.thin}px solid ${color.main.white}`,
            backgroundColor: color.badge.foreground,
            color: color.main.white,
            fontSize: menuButton.badgeFontSize,
            lineHeight: 1,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
});
