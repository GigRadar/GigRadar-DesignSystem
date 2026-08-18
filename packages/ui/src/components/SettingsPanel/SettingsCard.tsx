import { color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';

const { settingsPanel } = component;

/** Per-instance overrides for the card's own metrics. */
export type SettingsCardStyleProps = {
  /** Horizontal padding. */
  paddingX?: CssLength;
  /** Vertical padding. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Space between the icon and the label. */
  gap?: CssLength;
  /** Icon slot edge length. */
  iconSize?: CssLength;
  /** Fill at rest. */
  background?: string;
  /** Label and icon color at rest. */
  textColor?: string;
  /** Fill while selected. */
  selectedBackground?: string;
  /** Label and icon color while selected. */
  selectedTextColor?: string;
  /** Fill on hover. */
  hoverBackground?: string;
};

/**
 * Which level of the rail the row sits at.
 *
 * `setting` is a top-level screen — transparent at rest, so the panel's own
 * white shows through. `subSetting` is a screen nested under one, which Figma
 * draws indented to 32px AND filled with the page background: the fill is what
 * groups the sub-list visually, and the indent alone is too weak to read at a
 * glance. Both share every other metric.
 */
export type SettingsCardLevel = 'setting' | 'subSetting';

export type SettingsCardProps = {
  /**
   * Top-level entry or a nested one.
   *
   * @default 'setting'
   */
  level?: SettingsCardLevel;
  /** The row's label. */
  label?: string;
  /** The glyph, from the icon set. Omit for a label-only row. */
  icon?: IconDef;
  /**
   * Hides the label, leaving the icon centred.
   *
   * What the collapsed rail draws. The label still reaches assistive tech
   * through the button's `title`, so a collapsed rail stays navigable.
   */
  iconOnly?: boolean;
  /** Draws the selected (filled brand) palette. */
  selected?: boolean;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
} & SettingsCardStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * A row in a settings rail — Figma's "Settings Card" (node 2104:18385, listed
 * at 2104:19145).
 *
 * Three states, exactly as drawn: Default is white with dark text, Hover fills
 * the pale badge blue, and Selected fills brand blue with white text.
 *
 * Deliberately NOT the design system's Button. Figma models this as its own
 * component and the two disagree on nearly everything that defines a button —
 * a 16px radius against Button's 6, 12px vertical padding against 8, a 24px
 * icon against 16, 16px type against 14, left-aligned content against centred,
 * and no minimum height. What "selected" means differs too: this row is
 * marking the route you are on, where a button marks a press. Reusing Button
 * here would mean overriding every one of those and still needing a new
 * alignment prop — at which point nothing of Button is left.
 */
export const SettingsCard = forwardRef<HTMLButtonElement, SettingsCardProps>(function SettingsCard(
  {
    level = 'setting',
    label,
    icon,
    iconOnly = false,
    selected = false,
    hovered,
    paddingX,
    paddingY,
    radius,
    fontSize,
    gap,
    iconSize,
    background,
    textColor,
    selectedBackground,
    selectedTextColor,
    hoverBackground,
    onPointerEnter,
    onPointerLeave,
    disabled,
    ...rest
  },
  ref,
) {
  const [pointerInside, setPointerInside] = useState(false);
  const isHovered = (hovered ?? pointerInside) && !disabled && !selected;

  const isSub = level === 'subSetting';

  // A collapsed rail draws icons only, so the sub-level indent would just
  // push the glyph off-centre — every row sits at the top-level inset there.
  const resolvedPaddingX =
    len(paddingX) ??
    `${isSub && !iconOnly ? settingsPanel.item.subPaddingX : settingsPanel.item.paddingX}px`;

  /**
   * The resting fill. Figma gives a sub-setting the page background so the
   * nested group reads as one block; a top-level row is transparent and shows
   * the panel's own surface.
   */
  const restingBackground =
    background ?? (isSub ? color.main.background : 'transparent');

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    // Left-aligned, not centred: the icon anchors the row and the label runs
    // from it, which is what makes a column of these scannable.
    justifyContent: iconOnly ? 'center' : 'flex-start',
    gap: len(gap) ?? `${settingsPanel.item.gap}px`,
    boxSizing: 'border-box',
    width: '100%',
    padding: `${len(paddingY) ?? `${settingsPanel.item.paddingY}px`} ${resolvedPaddingX}`,
    borderRadius: len(radius) ?? `${settingsPanel.item.radius}px`,
    border: 'none',
    backgroundColor: selected
      ? (selectedBackground ?? color.main.brand)
      : isHovered
        ? (hoverBackground ?? color.badge.background)
        : restingBackground,
    color: selected
      ? (selectedTextColor ?? color.main.white)
      : (textColor ?? color.navbar.text2),
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${settingsPanel.item.fontSize}px`,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.l,
    lineHeight: 1,
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
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
      title={rest.title ?? (iconOnly ? label : undefined)}
      onPointerEnter={(event) => {
        setPointerInside(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setPointerInside(false);
        onPointerLeave?.(event);
      }}
    >
      {icon && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: len(iconSize) ?? settingsPanel.item.iconSize,
            height: len(iconSize) ?? settingsPanel.item.iconSize,
          }}
        >
          <Icon icon={icon} size="100%" />
        </span>
      )}
      {!iconOnly && (
        <span
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
});
