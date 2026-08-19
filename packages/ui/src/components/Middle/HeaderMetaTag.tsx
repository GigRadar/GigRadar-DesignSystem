import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';

const { header } = component.middle;

/**
 * The two treatments Figma draws.
 *
 * `brand` is filled and blue — the reply preset, which is a setting the room
 * carries. `outline` is a bare ring in the nav text — the assignee, which names
 * a person rather than a configuration.
 */
export type HeaderMetaTagVariant = 'brand' | 'outline';

/** Per-instance overrides for the tag's own metrics. */
export type HeaderMetaTagStyleProps = {
  radius?: CssLength;
  paddingX?: CssLength;
  paddingY?: CssLength;
  gap?: CssLength;
  background?: string;
  borderColor?: string;
  textColor?: string;
};

export type HeaderMetaTagProps = {
  /** The glyph. Always drawn — it is what survives when the label does not. */
  icon: IconDef;
  /**
   * The label. Omitted, the tag collapses to its glyph, which is what the
   * mobile header draws: there is room for the mark but not for the name.
   */
  children?: ReactNode;
  /**
   * @default 'outline'
   */
  variant?: HeaderMetaTagVariant;
  /**
   * Names the tag for assistive tech. Required with no label — a glyph-only tag
   * has nothing else to read.
   */
  label?: string;
  /**
   * Makes the tag a button. Both tags open a picker in the product; without a
   * handler the tag is a static label and is rendered as one.
   */
  onClick?: () => void;
} & HeaderMetaTagStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'children' | 'onClick'>;

/**
 * A tag on the chat header's meta row — the reply preset, or the assignee.
 *
 * Figma: nodes 3523:37250 (preset) and 3523:37253 (assignee). One component
 * because they are one pill in two tones, and the mobile header collapses both
 * the same way.
 *
 * Renders as a `<button>` with `onClick` and a `<span>` without: the tag is a
 * label until something can be done with it, and a focusable element that does
 * nothing is worse than a plain one.
 */
export const HeaderMetaTag = forwardRef<HTMLElement, HeaderMetaTagProps>(function HeaderMetaTag(
  {
    icon,
    children,
    variant = 'outline',
    label,
    onClick,
    radius,
    paddingX,
    paddingY,
    gap,
    background,
    borderColor,
    textColor,
    ...rest
  },
  ref,
) {
  const brand = variant === 'brand';
  const tone = textColor ?? (brand ? color.badge.foreground : color.navbar.text);
  const edge = borderColor ?? (brand ? color.badge.foreground : color.navbar.text);

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    flexShrink: 0,
    boxSizing: 'border-box' as const,
    gap: len(gap) ?? header.tag.gap,
    paddingLeft: len(paddingX) ?? header.tag.paddingX,
    paddingRight: len(paddingX) ?? header.tag.paddingX,
    paddingTop: len(paddingY) ?? header.tag.paddingY,
    paddingBottom: len(paddingY) ?? header.tag.paddingY,
    borderRadius: len(radius) ?? header.tag.radius,
    // Figma draws the brand tag's edge thinner than the hairline step; at 12px
    // type the difference from 1px is visible, so it keeps its own value.
    border: `${brand ? header.tag.brandBorderWidth : borderWidth.thin}px solid ${edge}`,
    backgroundColor: background ?? (brand ? color.navbar.disabledBackground : 'transparent'),
    cursor: onClick ? 'pointer' : 'default',
  };

  const content = (
    <>
      <Icon icon={icon} size={header.tag.iconSize} color={tone} />
      {children != null && (
        <span
          style={{
            ...textStyle.sRegular,
            color: tone,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {children}
        </span>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
        aria-label={children == null ? label : undefined}
        onClick={onClick}
        style={style}
        {...rest}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      ref={ref as Ref<HTMLSpanElement>}
      aria-label={children == null ? label : undefined}
      style={style}
      {...rest}
    >
      {content}
    </span>
  );
});
