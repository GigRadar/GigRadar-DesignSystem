import { borderWidth, color, component, radius, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import {
  TaskFeedComingSoon,
  TaskFeedEmpty,
  TaskFeedEnd,
  TaskFeedLoading,
} from './TaskFeedStates.js';

const { width, header, filters, list } = component.taskFeed;

/** Which tasks the feed is showing. */
export type TaskFeedFilter = 'open' | 'snoozed';

/**
 * What the whole column is doing.
 *
 * `ready` covers both a feed with tasks and a feed that has run out — the
 * difference is whether any cards were passed, not a different column.
 */
export type TaskFeedState = 'ready' | 'loading' | 'empty' | 'comingSoon';

/** Per-instance overrides for the rail's own metrics. */
export type TaskFeedStyleProps = {
  width?: CssLength;
};

export type TaskFeedProps = {
  /** The cards, already ordered. */
  children?: ReactNode;
  /** @default 'Task Feed' */
  title?: ReactNode;
  /**
   * How many tasks are open. Drawn as the badge beside the title, and hidden
   * at zero — a count of nothing is not news.
   */
  count?: number;
  /** @default 'ready' */
  state?: TaskFeedState;
  /** @default 'open' */
  filter?: TaskFeedFilter;
  onFilterChange?: (filter: TaskFeedFilter) => void;
  onMarkAllComplete?: () => void;
  /**
   * Closes the list with a rule saying there is nothing further down.
   *
   * Separate from `state`, because a feed can hold tasks and still be at its
   * end — the rule sits under the last card rather than replacing it.
   *
   * @default false
   */
  atEnd?: boolean;
} & TaskFeedStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'title'>;

/** One of the two list filters, drawn as a quiet pill. */
function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: `${len(filters.buttonPaddingY)} ${len(filters.buttonPaddingX)}`,
        borderRadius: len(filters.buttonRadius),
        border: 'none',
        backgroundColor: active ? color.navbar.hover : 'transparent',
        color: color.navbar.text,
        cursor: 'pointer',
        ...textStyle.sMedium,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

/**
 * The CRM dashboard's right-hand column — everything waiting on the user, in
 * the order it arrived.
 *
 * Figma: node 473:6454 ("Right - Task Feed").
 *
 * A rail at a fixed width rather than a panel sharing the dashboard's: the
 * feed sits beside the numbers, and a column that grew with the window would
 * take width from the funnel it is meant to accompany.
 *
 * The cards come in as children rather than as a `tasks` array. What a task is
 * differs per stage — some can be completed, some only snoozed — and a prop
 * would have to describe every one of those shapes before the column could
 * draw it.
 */
export const TaskFeed = forwardRef<HTMLElement, TaskFeedProps>(function TaskFeed(
  {
    children,
    title = 'Task Feed',
    count,
    state = 'ready',
    filter = 'open',
    onFilterChange,
    onMarkAllComplete,
    atEnd = false,
    width: widthProp,
    ...rest
  },
  ref,
) {
  const loading = state === 'loading';
  // Coming Soon draws no filters: there is nothing yet to filter.
  const showFilters = state !== 'comingSoon';

  return (
    <aside
      ref={ref}
      aria-label="Task feed"
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        width: len(widthProp ?? width),
        borderLeft: `${borderWidth.thin}px solid ${color.main.backgroundAlt}`,
        backgroundColor: color.main.white,
        overflow: 'hidden',
      }}
      {...rest}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: len(header.gap),
          height: len(header.height),
          paddingLeft: len(header.paddingX),
          paddingRight: len(header.paddingX),
          flexShrink: 0,
        }}
      >
        {loading ? (
          <span
            aria-hidden
            style={{
              width: 120,
              height: 28,
              borderRadius: radius.s,
              backgroundColor: color.disable.background,
            }}
          />
        ) : (
          <>
            <span style={{ ...textStyle.h4, color: color.main.black }}>{title}</span>
            {count != null && count > 0 && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: len(header.counterSize),
                  height: len(header.counterSize),
                  borderRadius: '50%',
                  backgroundColor: color.main.brand,
                  color: color.main.white,
                  ...textStyle.sSemibold,
                }}
              >
                {count}
              </span>
            )}
          </>
        )}
      </header>

      {showFilters && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: len(filters.padding),
            flexShrink: 0,
          }}
        >
          {loading ? (
            <>
              <span style={{ display: 'flex', gap: len(filters.gap) }}>
                <Placeholder width={53} />
                <Placeholder width={53} />
              </span>
              <Placeholder width={136} />
            </>
          ) : (
            <>
              <span style={{ display: 'flex', gap: len(filters.gap) }}>
                <FilterPill active={filter === 'open'} onClick={() => onFilterChange?.('open')}>
                  Open
                </FilterPill>
                <FilterPill
                  active={filter === 'snoozed'}
                  onClick={() => onFilterChange?.('snoozed')}
                >
                  Snoozed
                </FilterPill>
              </span>
              <FilterPill active={false} onClick={onMarkAllComplete}>
                Mark all as complete
              </FilterPill>
            </>
          )}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // Stretch, not flex-end: the cards take the padded width and cap
          // themselves, so the padding shows on both sides.
          alignItems: 'stretch',
          gap: len(list.gap),
          flex: 1,
          minHeight: 0,
          padding: state === 'ready' ? len(list.padding) : 0,
          overflowY: 'auto',
        }}
      >
        {state === 'loading' && <TaskFeedLoading />}
        {state === 'empty' && <TaskFeedEmpty />}
        {state === 'comingSoon' && <TaskFeedComingSoon />}
        {state === 'ready' && (
          <>
            {children}
            {atEnd && <TaskFeedEnd />}
          </>
        )}
      </div>
    </aside>
  );
});

/** A greyed stand-in for a control that has nothing to say yet. */
function Placeholder({ width: w }: { width: number }) {
  return (
    <span
      aria-hidden
      style={{
        width: w,
        height: 22,
        borderRadius: radius.s,
        backgroundColor: color.disable.background,
      }}
    />
  );
}
