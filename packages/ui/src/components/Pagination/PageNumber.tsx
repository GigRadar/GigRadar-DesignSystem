import { color, component, typography, type PaginationSize } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';

export type { PaginationSize };

const { pagination } = component;

/** Per-instance overrides for one cell's own metrics. */
export type PageNumberStyleProps = {
  /** Cell edge length. Overrides the `size` step. */
  itemSize?: CssLength;
  /** Corner radius. Figma draws a circle. */
  radius?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Fill of the selected cell. */
  selectedBackground?: string;
  /** Fill the cell takes on hover. */
  hoverBackground?: string;
  /** Label color when selected. */
  selectedTextColor?: string;
  /** Label color at rest. */
  textColor?: string;
};

export type PageNumberProps = {
  /**
   * What the cell shows — usually the page number.
   *
   * Takes a `ReactNode` rather than a number so the same cell can draw the
   * arrows and the ellipsis, which is what Figma does: every cell in the bar is
   * this component with different contents.
   */
  children?: ReactNode;
  /** Draws the brand-blue disc with white text. */
  selected?: boolean;
  size?: PaginationSize;
  /**
   * Renders as plain text rather than a button — no hover fill, no pointer, not
   * focusable. This is the ellipsis, which is a gap marker rather than a
   * destination.
   */
  static?: boolean;
} & PageNumberStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

/**
 * One cell of a pagination bar.
 *
 * Figma: node 189:701, which draws three states — Default (12px `#525F7B`
 * semibold on nothing), Hover (the same text on the `#E4EAF5` nav hover), and
 * Selected (white text on a brand-blue disc).
 *
 * Exported because `Pagination` composes it, and because a caller building a
 * bespoke bar needs the same cell. Most code should reach for `Pagination`.
 *
 * Hover is tracked in state rather than written as a `:hover` rule, because
 * this package styles inline and ships no stylesheet — the same reason the
 * button does it.
 */
export const PageNumber = forwardRef<HTMLButtonElement, PageNumberProps>(function PageNumber(
  {
    children,
    selected = false,
    size = 'medium',
    static: isStatic = false,
    disabled = false,
    type = 'button',
    itemSize,
    radius,
    fontSize,
    selectedBackground,
    hoverBackground,
    selectedTextColor,
    textColor,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const inert = disabled || isStatic;
  const hovering = hovered && !inert && !selected;

  const edge = len(itemSize) ?? `${pagination.itemSize[size]}px`;

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
    borderRadius: len(radius) ?? `${pagination.radius}px`,
    backgroundColor: selected
      ? (selectedBackground ?? color.main.brand)
      : hovering
        ? (hoverBackground ?? color.navbar.hover)
        : 'transparent',
    color: selected
      ? (selectedTextColor ?? color.main.white)
      : (textColor ?? color.main.description),
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${pagination.fontSize[size]}px`,
    // Semibold in Figma, and it stays semibold when selected — the disc is what
    // marks the current page, so the weight does not also have to change.
    fontWeight: typography.fontWeight.semibold,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    cursor: isStatic ? 'default' : disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    appearance: 'none',
    // Figma draws no disabled cell; the arrows at the ends of the range are the
    // only ones that take it, so they fade rather than getting a third palette.
    opacity: disabled && !isStatic ? 0.4 : undefined,
    transition: 'background-color 120ms ease',
  };

  // The ellipsis is not a destination, so it is a span rather than a button —
  // otherwise it lands in the tab order and announces itself as pressable.
  if (isStatic) {
    return (
      <span aria-hidden style={style}>
        {children}
      </span>
    );
  }

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={disabled}
      // `aria-current` is what tells a screen reader which page it is on. The
      // blue disc alone is purely visual.
      aria-current={selected ? 'page' : undefined}
      style={style}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onMouseLeave?.(event);
      }}
    >
      {children}
    </button>
  );
});
