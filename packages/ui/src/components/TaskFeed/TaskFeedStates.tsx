import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconLazizaSparkleFill, IconThumbsUpFill } from '../../icons/defs.js';
import { len } from '../../internal/length.js';
import { Skeleton } from '../Skeleton/Skeleton.js';

const { empty, endDivider, list, card } = component.taskFeed;

type StateProps = {
  title?: ReactNode;
  description?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * The shared body of the feed's two message states.
 *
 * A glyph on a tinted disc rather than a drawn illustration. Figma reaches for
 * 64px spot art here, but the rail is 328px wide and both of these moments are
 * ordinary — a caught-up feed is the good outcome — so an illustration gives
 * them more ceremony than they earn, and a second art style to keep in step
 * with the icon set. The disc is the badge pair used wherever else a glyph
 * needs a ground, so these states look like the rest of the product.
 */
function TaskFeedMessage({
  icon,
  title,
  description,
  ...rest
}: { icon: typeof IconThumbsUpFill } & StateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: len(empty.gap),
        // Centred in whatever height is left, rather than sitting under the
        // filter row: a message pinned to the top reads as a first result.
        flex: 1,
        padding: len(empty.padding),
        textAlign: 'center',
      }}
      {...rest}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: len(empty.markSize),
          height: len(empty.markSize),
          borderRadius: '50%',
          backgroundColor: color.badge.background,
        }}
      >
        <Icon icon={icon} size={len(empty.iconSize)} color={color.badge.foreground} />
      </span>
      <span style={{ ...textStyle.lMedium, color: color.main.black }}>{title}</span>
      <span
        style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: len(empty.width) }}
      >
        {description}
      </span>
    </div>
  );
}

export type TaskFeedEmptyProps = StateProps;

/**
 * What the feed shows when there is nothing left to do.
 *
 * Figma: node 473:7699 ("Empty or Error").
 *
 * One component for both "you are done" and "the tasks could not be loaded",
 * following Figma, which draws them as one frame. The words differ and that is
 * what `title` and `description` are for.
 */
export const TaskFeedEmpty = forwardRef<HTMLDivElement, TaskFeedEmptyProps>(
  function TaskFeedEmpty(
    {
      title = 'You’re All Caught Up!',
      description = 'Great work! There’s nothing left to do right now, or something went wrong while loading tasks. Make sure everything’s up to date.',
      ...rest
    },
    ref,
  ) {
    return (
      <div ref={ref} style={{ display: 'contents' }}>
        <TaskFeedMessage
          icon={IconThumbsUpFill}
          title={title}
          description={description}
          {...rest}
        />
      </div>
    );
  },
);

export type TaskFeedComingSoonProps = StateProps;

/**
 * The feed before the feature is switched on for this account.
 *
 * Figma: node 1658:17348 ("Coming Soon").
 *
 * Distinct from `TaskFeedEmpty`: that one means there is nothing to do, this
 * one means there is nothing yet to do it with. It draws no filter row either,
 * because there is nothing to filter.
 */
export const TaskFeedComingSoon = forwardRef<HTMLDivElement, TaskFeedComingSoonProps>(
  function TaskFeedComingSoon(
    {
      title = 'A New Feature is On The Way!',
      description = 'This feature allows you to see all updates from your leads in one Task Feed.',
      ...rest
    },
    ref,
  ) {
    return (
      <div ref={ref} style={{ display: 'contents' }}>
        <TaskFeedMessage
          icon={IconLazizaSparkleFill}
          title={title}
          description={description}
          {...rest}
        />
      </div>
    );
  },
);

export type TaskFeedLoadingProps = {
  /** How many placeholder cards to draw. @default 4 */
  count?: number;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The feed's first load.
 *
 * Figma: node 473:8038 ("Loading 1st"), which greys the whole column — title
 * and filters included — because on a cold start there is no open-task count
 * to put in them yet.
 *
 * The cards are plain blocks at the real card's height rather than skeletons
 * of its parts. A task's shape is three short lines and two buttons; drawn as
 * greyed strips it reads as a card that failed to load rather than one still
 * loading.
 */
export const TaskFeedLoading = forwardRef<HTMLDivElement, TaskFeedLoadingProps>(
  function TaskFeedLoading({ count = 4, ...rest }, ref) {
    return (
      <div
        ref={ref}
        aria-busy
        aria-label="Loading tasks"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: len(list.gap),
          padding: len(list.padding),
        }}
        {...rest}
      >
        {Array.from({ length: count }, (_, index) => (
          <Skeleton
            key={index}
            variant="block"
            width="100%"
            height={112}
            radius={card.radius}
          />
        ))}
      </div>
    );
  },
);

export type TaskFeedEndProps = {
  /** @default 'No More Task' */
  label?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The rule closing the list once every task has been worked.
 *
 * Figma: node 802:13536.
 *
 * A rule either side of the words rather than a heading: it marks the end of
 * the run, and a heading would read as the start of another section. It sits
 * under the last card, so the column still scrolls — unlike `TaskFeedEmpty`,
 * which replaces the list entirely.
 */
export const TaskFeedEnd = forwardRef<HTMLDivElement, TaskFeedEndProps>(function TaskFeedEnd(
  { label = 'No More Task', ...rest },
  ref,
) {
  const rule = (
    <span aria-hidden style={{ flex: 1, height: 1, backgroundColor: color.main.backgroundAlt }} />
  );

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: len(endDivider.gap),
        height: len(endDivider.height),
        paddingLeft: len(endDivider.paddingX),
        paddingRight: len(endDivider.paddingX),
        width: '100%',
      }}
      {...rest}
    >
      {rule}
      <span
        style={{
          ...textStyle.sRegular,
          color: color.navbar.text,
          opacity: endDivider.opacity,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      {rule}
    </div>
  );
});
