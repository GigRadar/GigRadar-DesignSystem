import { borderWidth, color, component, radius, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { useScrollbar } from '../Scrollbar/Scrollbar.js';
import { Icon } from '../../icons/Icon.js';
import { IconDashboardStroke, IconSearch } from '../../icons/defs.js';

const { board } = component.dashboard;

/** Per-instance overrides for a board's own metrics. */
export type KanbanBoardStyleProps = {
  width?: CssLength;
  padding?: CssLength;
  radius?: CssLength;
  background?: string;
  minHeight?: CssLength;
};

/**
 * What a column is showing instead of cards.
 *
 *   `default`   the cards themselves
 *   `empty`     the stage is real but holds nothing — no message, just space
 *   `error`     the board's data could not be fetched
 *   `notFound`  a search or filter excluded everything in this stage
 *
 * `empty` deliberately draws nothing. An empty stage in a pipeline is ordinary
 * — most pipelines have one — and six columns each explaining their emptiness
 * would bury the columns that have leads in them.
 */
export type KanbanBoardState = 'default' | 'empty' | 'error' | 'notFound';

export type KanbanBoardProps = {
  /** The stage's name — "Unassigned", "Interested", "Booked". */
  title: ReactNode;
  /** The stage's total value, already formatted — "$1500". */
  total?: ReactNode;
  /** How many leads are in it — "3 Deals". */
  count?: ReactNode;
  /** The cards — a stack of `<KanbanCard>`. */
  children?: ReactNode;
  /** @default 'default' */
  state?: KanbanBoardState;
  /** Replaces the built-in copy of the error and not-found states. */
  errorMessage?: ReactNode;
  notFoundMessage?: ReactNode;
  /** Draws the column as the drop target under a dragged card. @default false */
  dropTarget?: boolean;
} & KanbanBoardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** The glyph, heading and sentence a non-default state draws in place of cards. */
function BoardState({
  icon,
  title,
  children,
}: {
  icon: typeof IconSearch;
  title: ReactNode;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: board.stateGap,
        padding: `${board.statePaddingY}px ${board.statePaddingX}px`,
        textAlign: 'center',
      }}
    >
      <Icon icon={icon} size={board.stateIconSize} color={color.disable.background} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: board.stateTextGap }}>
        <span style={{ ...textStyle.sMedium, color: color.navbar.text2 }}>{title}</span>
        <span
          style={{
            ...textStyle.sRegular,
            fontSize: board.stateBodyFontSize,
            color: color.main.description,
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
}

/**
 * One stage of the pipeline, with its leads stacked inside it.
 *
 * Figma: "Kanban Board" (node 2010:2069), which draws the four states as
 * variants of one component.
 *
 * The header's summary is 9px — below every step on the type scale, like the
 * prompt field's character counter. It is a running total glanced at while
 * scanning the cards, not a line to read, and at the stage name's size it
 * would compete with the name itself.
 */
export const KanbanBoard = forwardRef<HTMLDivElement, KanbanBoardProps>(function KanbanBoard(
  {
    title,
    total,
    count,
    children,
    state = 'default',
    errorMessage,
    notFoundMessage,
    dropTarget = false,
    width,
    padding,
    radius: boardRadius,
    background,
    minHeight,
    ...rest
  },
  ref,
) {
  const scrollbar = useScrollbar();

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: board.gap,
        boxSizing: 'border-box',
        // An equal share of the pipeline's width. The stages are ordered and
        // end at Closed, so they shrink together on one row rather than
        // wrapping a stage out of sequence.
        flex: `1 1 ${len(width) ?? `${board.width}px`}`,
        minWidth: board.minWidth,
        // Fills the height the band gives it — the band owns the floor, so a
        // board can also shrink when the screen is short. A stage is a
        // container the pipeline shares, so every board is the same height;
        // the cards inside keep their own size and scroll.
        alignSelf: 'stretch',
        ...(minHeight != null ? { minHeight: len(minHeight) } : null),
        padding: len(padding) ?? board.padding,
        borderRadius: len(boardRadius) ?? board.radius,
        backgroundColor: background ?? color.main.backgroundAlt,
        // The drop target is an inset ring rather than a border: a border
        // would add a pixel to the column's width and shove the boards to its
        // right along by one as a card passes over it.
        boxShadow: dropTarget
          ? `inset 0 0 0 ${borderWidth.thick}px ${color.main.brand}`
          : undefined,
        overflow: 'hidden',
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          padding: `${board.headerPaddingY}px ${board.headerPaddingX}px`,
        }}
      >
        <span
          style={{ ...textStyle.mRegular, color: color.navbar.text, opacity: board.titleOpacity }}
        >
          {title}
        </span>
        {(total != null || count != null) && (
          <span style={{ display: 'flex', alignItems: 'center', gap: board.summaryGap }}>
            {total != null && (
              <span
                style={{
                  ...textStyle.sSemibold,
                  fontSize: board.summaryFontSize,
                  color: color.main.brand,
                }}
              >
                {total}
              </span>
            )}
            {total != null && count != null && (
              <span
                aria-hidden
                style={{
                  width: board.summaryDotSize,
                  height: board.summaryDotSize,
                  borderRadius: radius.round,
                  backgroundColor: color.main.description,
                }}
              />
            )}
            {count != null && (
              <span
                style={{
                  ...textStyle.sRegular,
                  fontSize: board.summaryFontSize,
                  color: color.main.description,
                }}
              >
                {count}
              </span>
            )}
          </span>
        )}
      </div>

      {state === 'error' && (
        <BoardState icon={IconDashboardStroke} title="Unable to Load Leads">
          {errorMessage ?? 'Leads pipeline board data couldn’t be retrieved. Please try again.'}
        </BoardState>
      )}

      {state === 'notFound' && (
        <BoardState icon={IconSearch} title="No Leads Match Your Search">
          {notFoundMessage ??
            'We couldn’t find any leads based on your keywords. Try adjusting your search or clearing your filters.'}
        </BoardState>
      )}

      {state === 'default' && (
        <div
          {...scrollbar.props}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: board.gap,
            // `minHeight: 0` is what makes the scroll work at all: a flex child
            // defaults to its content's height as its minimum, so without it
            // the list grows past the board's max and the board clips it
            // instead of the list scrolling.
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            // A card's worth of room under the last one, so a column that
            // scrolls ends on white rather than on a card sliced through the
            // middle — which reads as a rendering fault, not as more content.
            paddingBottom: board.gap,
            ...scrollbar.style,
          }}
        >
          {scrollbar.styleTag}
          {children}
        </div>
      )}
    </div>
  );
});
