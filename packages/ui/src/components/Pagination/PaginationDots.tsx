import { color, component, type PaginationSize } from '@gigradar/theme';
import { type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { pagination } = component;

/** Per-instance overrides for the dot row's own metrics. */
export type PaginationDotsStyleProps = {
  /** Dot diameter. */
  dotSize?: CssLength;
  /** Space between dots. */
  gap?: CssLength;
  /** Horizontal padding of the surrounding pill. */
  paddingX?: CssLength;
  /** Vertical padding of the surrounding pill. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** The pill's fill. */
  background?: string;
  /** The active dot's fill. */
  activeColor?: string;
  /** The inactive dots' fill. */
  dotColor?: string;
};

export type PaginationDotsProps = {
  /** The current page, 1-based. */
  page: number;
  /** How many pages there are in total. */
  pageCount: number;
  /**
   * Called with the page the user picked. Passing this makes the dots
   * interactive — buttons rather than decoration.
   */
  onPageChange?: (page: number) => void;
  size?: PaginationSize;
  /** Renders with no fill or padding, for placing on an existing surface. */
  bare?: boolean;
  /** Accessible name for the surrounding nav. */
  label?: string;
} & PaginationDotsStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'onChange'>;

/**
 * The dot pagination indicator.
 *
 * Figma: node 527:13264, named "Pagination Auto" — a white pill holding 8px
 * dots, the current one brand blue and the rest the `#E4EAF5` nav hover.
 *
 * A separate component from `Pagination` rather than a size step of it, because
 * it answers a different question. The numbered bar is for navigating a list
 * you are reading through — it tells you which page you are on out of how many,
 * and lets you jump. This shows position in a short sequence you are being
 * carried through, like a carousel or an onboarding flow, where the page
 * NUMBERS are not meaningful and there are only a handful of them.
 *
 * That difference is why it does not truncate: past roughly ten dots the row
 * stops reading as a position and starts reading as a smear, which is the point
 * at which the numbered bar is the right control instead.
 *
 * Interactive only when `onPageChange` is passed. A carousel indicator is often
 * purely a readout, and a row of buttons that do nothing is worse than a row of
 * divs — it puts stops in the tab order that lead nowhere.
 */
export function PaginationDots({
  page,
  pageCount,
  onPageChange,
  size = 'medium',
  bare = false,
  label = 'Pagination',
  dotSize,
  gap,
  paddingX,
  paddingY,
  radius,
  background,
  activeColor,
  dotColor,
  ...rest
}: PaginationDotsProps) {
  // Same guard as the numbered bar: a count that has not loaded, or a page that
  // has drifted past the end, should not throw or render an empty row.
  const total = Math.max(1, Math.floor(pageCount) || 1);
  const current = Math.min(Math.max(1, Math.floor(page) || 1), total);

  const interactive = onPageChange != null;
  const diameter = len(dotSize) ?? `${pagination.dot.size[size]}px`;

  const rowStyle: CSSProperties = bare
    ? {
        display: 'inline-flex',
        alignItems: 'center',
        gap: len(gap) ?? `${pagination.dot.gap[size]}px`,
      }
    : {
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: len(gap) ?? `${pagination.dot.gap[size]}px`,
        paddingLeft: len(paddingX) ?? `${pagination.dot.paddingX[size]}px`,
        paddingRight: len(paddingX) ?? `${pagination.dot.paddingX[size]}px`,
        paddingTop: len(paddingY) ?? `${pagination.dot.paddingY[size]}px`,
        paddingBottom: len(paddingY) ?? `${pagination.dot.paddingY[size]}px`,
        borderRadius: len(radius) ?? `${pagination.radius}px`,
        backgroundColor: background ?? color.main.white,
      };

  return (
    <nav {...rest} aria-label={label} style={rowStyle}>
      {Array.from({ length: total }, (_, i) => {
        const index = i + 1;
        const active = index === current;
        const dot: CSSProperties = {
          boxSizing: 'border-box',
          display: 'block',
          flexShrink: 0,
          width: diameter,
          height: diameter,
          padding: 0,
          border: 'none',
          borderRadius: pagination.radius,
          backgroundColor: active
            ? (activeColor ?? color.main.brand)
            : (dotColor ?? color.navbar.hover),
          transition: 'background-color 120ms ease',
        };

        if (!interactive) {
          return <span key={index} aria-hidden style={dot} />;
        }

        return (
          <button
            key={index}
            type="button"
            aria-label={`Page ${index}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => {
              if (index !== current) onPageChange?.(index);
            }}
            style={{ ...dot, cursor: 'pointer', appearance: 'none' }}
          />
        );
      })}
    </nav>
  );
}
