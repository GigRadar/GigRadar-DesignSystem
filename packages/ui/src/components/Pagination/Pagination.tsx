import { color, component, type PaginationSize } from '@gigradar/theme';
import { Fragment, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowLeft, IconDropdownArrowRight } from '../../icons/defs.js';
import { PageNumber } from './PageNumber.js';

export type { PaginationSize };

const { pagination } = component;

/** Per-instance overrides for the bar's own metrics. */
export type PaginationStyleProps = {
  /** Horizontal padding of the bar. */
  paddingX?: CssLength;
  /** Vertical padding of the bar. */
  paddingY?: CssLength;
  /** Corner radius. Figma draws a pill. */
  radius?: CssLength;
  /** Space between the arrows and the number row. */
  gap?: CssLength;
  /** Space between cells in the number row. */
  itemGap?: CssLength;
  /** Cell edge length. */
  itemSize?: CssLength;
  /** Page number type size. */
  fontSize?: CssLength;
  /** The arrow glyphs' edge length. */
  iconSize?: CssLength;
  /** The bar's fill. */
  background?: string;
};

export type PaginationProps = {
  /** The current page, 1-based. */
  page: number;
  /** How many pages there are in total. */
  pageCount: number;
  /** Called with the page the user picked. */
  onPageChange?: (page: number) => void;
  size?: PaginationSize;
  /**
   * How many cells the number row may use, ellipses included.
   *
   * The default of 6 is what Figma draws: at page 1 of 10 the bar reads
   * `‹ 1 2 3 4 … 10 ›`. The row is always exactly this wide once the range is
   * longer than it, so the bar does not change width as the user pages through.
   *
   * Clamped to a minimum of 5 — below that the row cannot hold a first page, a
   * last page, two ellipses, and the current page at once, and something the
   * user needs would have to be dropped.
   */
  siblingCount?: number;
  /** Hides the ‹ › arrows, leaving only the numbers. */
  hideArrows?: boolean;
  /** Renders the bar with no fill or padding, for placing on an existing surface. */
  bare?: boolean;
  /** Accessible name for the surrounding nav. */
  label?: string;
  /**
   * Replaces each page cell, keeping the slot maths — which pages show, where
   * the ellipses fall, how the arrows enable — and the nav landmark.
   *
   * The usual reason is a page number that has to carry something extra: a
   * link for SEO, a per-page tooltip, a loading marker. `page` is null for an
   * ellipsis slot, so a renderer can leave those to the default.
   *
   * Call `defaultRender()` to wrap rather than replace.
   */
  renderPage?: RenderProp<PageRenderProps>;
} & PaginationStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'onChange'>;

/** Marks a gap in the page range — rendered as the static "…" cell. */
const GAP = 'gap' as const;
type Slot = number | typeof GAP;

/**
 * The page numbers to draw, with gaps marked.
 *
 * Always keeps the first page, the last page, and a window around the current
 * one, so both ends of the range stay reachable however deep into it the user
 * is. Figma draws `‹ 1 2 3 4 … 10 ›` at page 1 of 10, which is what this
 * produces at the default of seven slots.
 *
 * The result is always EXACTLY `maxSlots` long whenever the range is longer
 * than that — the ellipses are counted against the budget, not added on top.
 * Getting that wrong makes the bar change width as the user pages through it,
 * which shifts everything beside it on the screen.
 *
 * Exported for testing and for callers building a bespoke bar from
 * `PageNumber`; `Pagination` calls it for you.
 */
export function pageSlots(page: number, pageCount: number, maxSlots = 6): Slot[] {
  // Five is the floor: first, last, two gaps, and the current page. Anything
  // less cannot show where you are AND how to get to either end.
  const slots = Math.max(5, maxSlots);

  if (pageCount <= slots) {
    return range(1, pageCount);
  }

  // How many NUMBERS fit once the first and last page are reserved. Which of
  // the remaining cells go to ellipses depends on where the window lands, so
  // both cases are worked out against this same budget.
  const inner = slots - 2;

  // Does the window reach far enough to touch either end? If it does, that side
  // needs no ellipsis and the window grows into the cell it would have used.
  const half = Math.floor((inner - 1) / 2);
  const nearStart = page - half <= 2;
  const nearEnd = page + half >= pageCount - 1;

  if (nearStart && !nearEnd) {
    // Flush left: 1 … n-2 numbers … GAP … last
    const end = 1 + (inner - 1);
    return [...range(1, end), GAP, pageCount];
  }

  if (nearEnd && !nearStart) {
    // Flush right — the mirror of the case above.
    const start = pageCount - (inner - 1);
    return [1, GAP, ...range(start, pageCount)];
  }

  if (nearStart && nearEnd) {
    // The window spans the whole range; nothing to truncate.
    return range(1, pageCount);
  }

  // Floating in the middle: both ellipses are present, so they take two of the
  // inner cells and the window gets what is left.
  const windowSize = inner - 2;
  const before = Math.floor((windowSize - 1) / 2);
  let start = page - before;
  let end = start + windowSize - 1;

  // Keep the window inside the range the ellipses stand for.
  if (start < 3) {
    start = 3;
    end = start + windowSize - 1;
  }
  if (end > pageCount - 2) {
    end = pageCount - 2;
    start = end - windowSize + 1;
  }

  return [1, GAP, ...range(start, end), GAP, pageCount];
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/**
 * A numbered pagination bar.
 *
 * Figma: node 189:504, a white pill holding a back arrow, a row of page number
 * cells with the current one on a brand-blue disc, and a forward arrow. Built
 * from `PageNumber` (node 189:701), which is the same cell in each of its
 * three states.
 *
 * The bar is stateless: it renders whatever `page` says and reports clicks
 * through `onPageChange`. That keeps the page number wherever it already lives
 * — a URL, a query cache, a parent's state — rather than duplicating it here
 * and having the two disagree.
 */
/**
 * What a `renderPage` function receives — one slot in the bar.
 *
 * `page` is null for an ellipsis. `selected` and `disabled` describe the cell
 * the default renderer would have drawn, so a replacement can style the same
 * states without re-deriving them from `page` and `pageCount`.
 */
export type PageRenderProps = WithDefaultRender & {
  /** The page number, or null for an ellipsis slot. */
  page: number | null;
  /** Whether this cell is the current page. */
  selected: boolean;
  /** True for the ellipsis, which is inert. */
  isGap: boolean;
  /** Position in the rendered bar, for keying. */
  index: number;
  /** Navigates to this page. A no-op for an ellipsis or the current page. */
  goTo: () => void;
};

export function Pagination({
  page,
  pageCount,
  onPageChange,
  size = 'medium',
  siblingCount = 6,
  hideArrows = false,
  bare = false,
  label = 'Pagination',
  renderPage,
  paddingX,
  paddingY,
  radius,
  gap,
  itemGap,
  itemSize,
  fontSize,
  iconSize,
  background,
  ...rest
}: PaginationProps) {
  // Guards the arrows and the slot maths against a count that has not loaded
  // yet, and against a page that has drifted outside the range — a filter
  // change can drop the page count while the page number is still high.
  const total = Math.max(1, Math.floor(pageCount) || 1);
  const current = Math.min(Math.max(1, Math.floor(page) || 1), total);

  const slots = pageSlots(current, total, siblingCount);
  const cellStyle = { itemSize, radius, fontSize };
  const glyph = len(iconSize) ?? `${pagination.iconSize[size]}px`;

  const go = (next: number) => {
    if (next < 1 || next > total || next === current) return;
    onPageChange?.(next);
  };

  const barStyle: CSSProperties = bare
    ? { display: 'inline-flex', alignItems: 'center', gap: len(gap) ?? `${pagination.gap[size]}px` }
    : {
        boxSizing: 'border-box',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: len(gap) ?? `${pagination.gap[size]}px`,
        paddingLeft: len(paddingX) ?? `${pagination.paddingX[size]}px`,
        paddingRight: len(paddingX) ?? `${pagination.paddingX[size]}px`,
        paddingTop: len(paddingY) ?? `${pagination.paddingY[size]}px`,
        paddingBottom: len(paddingY) ?? `${pagination.paddingY[size]}px`,
        borderRadius: len(radius) ?? `${pagination.radius}px`,
        backgroundColor: background ?? color.main.white,
      };

  return (
    <nav {...rest} aria-label={label} style={barStyle}>
      {!hideArrows && (
        <PageNumber
          {...cellStyle}
          size={size}
          disabled={current <= 1}
          aria-label="Previous page"
          onClick={() => go(current - 1)}
        >
          <Icon icon={IconDropdownArrowLeft} size={glyph} />
        </PageNumber>
      )}

      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: len(itemGap) ?? `${pagination.itemGap[size]}px`,
        }}
      >
        {slots.map((slot, index) => {
          const isGap = slot === GAP;
          // Keyed by position for the ellipsis: two can appear in one bar, and
          // they are interchangeable, so the index is the only stable identity.
          const key = isGap ? `gap-${index}` : slot;
          const defaultRender = () =>
            isGap ? (
              <PageNumber {...cellStyle} size={size} static>
                …
              </PageNumber>
            ) : (
              <PageNumber
                {...cellStyle}
                size={size}
                selected={slot === current}
                aria-label={`Page ${slot}`}
                onClick={() => go(slot)}
              >
                {slot}
              </PageNumber>
            );

          return (
            <Fragment key={key}>
              {renderPage
                ? renderPage({
                    page: isGap ? null : slot,
                    selected: !isGap && slot === current,
                    isGap,
                    index,
                    goTo: () => (isGap ? undefined : go(slot)),
                    defaultRender,
                  })
                : defaultRender()}
            </Fragment>
          );
        })}
      </span>

      {!hideArrows && (
        <PageNumber
          {...cellStyle}
          size={size}
          disabled={current >= total}
          aria-label="Next page"
          onClick={() => go(current + 1)}
        >
          <Icon icon={IconDropdownArrowRight} size={glyph} />
        </PageNumber>
      )}
    </nav>
  );
}
