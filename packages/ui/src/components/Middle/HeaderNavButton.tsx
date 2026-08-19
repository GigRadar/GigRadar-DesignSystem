import { color, component } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconCollapseDoubleArrowLeft, IconDropdownArrowLeft } from '../../icons/defs.js';
import type { IconDef } from '../../icons/defs.js';

const { header } = component.middle;

/**
 * What the chevron does.
 *
 * `back` returns to the room list — the mobile header's leading control.
 * `collapse` closes the sidebar the scheduled queue opens in. Two directions of
 * "leave this surface", drawn with different glyphs.
 */
export type HeaderNavAction = 'back' | 'collapse';

const glyphs: Record<HeaderNavAction, IconDef> = {
  back: IconDropdownArrowLeft,
  collapse: IconCollapseDoubleArrowLeft,
};

const labels: Record<HeaderNavAction, string> = {
  back: 'Back to rooms',
  collapse: 'Close sidebar',
};

/** Per-instance overrides for the control's own metrics. */
export type HeaderNavButtonStyleProps = {
  size?: CssLength;
  /** The glyph's color. */
  iconColor?: string;
};

export type HeaderNavButtonProps = {
  /**
   * @default 'back'
   */
  action?: HeaderNavAction;
  /**
   * Overrides the accessible name. The default names the action — "Back to
   * rooms", "Close sidebar" — which is what it does in both places Figma draws
   * it.
   */
  label?: string;
  /** Overrides the glyph, for a third direction Figma has not drawn yet. */
  icon?: IconDef;
} & HeaderNavButtonStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * The chat header's leading chevron.
 *
 * Figma draws it in the mobile header (node 4209:32325) and in the scheduled
 * header's "Close Sidebar" slot (node 3523:37233). Bare — no ring, no fill —
 * which is what separates it from `MenuButton`: this one leaves the surface,
 * and the round buttons act on it.
 *
 * Its own component rather than inline markup in `ChatHeader` so a screen that
 * builds its own header band gets the same control at the same size.
 */
export const HeaderNavButton = forwardRef<HTMLButtonElement, HeaderNavButtonProps>(
  function HeaderNavButton({ action = 'back', label, icon, size, iconColor, ...rest }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-label={label ?? labels[action]}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: len(size) ?? header.backSize,
          height: len(size) ?? header.backSize,
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
        }}
        {...rest}
      >
        <Icon
          icon={icon ?? glyphs[action]}
          size={len(size) ?? header.backSize}
          color={iconColor ?? color.main.description}
        />
      </button>
    );
  },
);
