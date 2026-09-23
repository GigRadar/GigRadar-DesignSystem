import { borderWidth, color, component, lineHeight, spacing, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconCheckmarkCircleFill, IconXCirlceRoundFill } from '../../icons/defs.js';
import { len, type CssLength } from '../../internal/length.js';
import { StageIcon, type TaskStage } from './StageIcon.js';
import { TaskFeedButton } from './TaskFeedButton.js';

const { card } = component.taskFeed;

/**
 * Where the card is in its own life.
 *
 * `snoozed` and `completed` are the moment just after the button is pressed,
 * not a resting state — the card covers itself to say what it did, then
 * leaves. `unread` is a resting state and only marks the card as new.
 */
export type TaskCardState = 'default' | 'unread' | 'snoozed' | 'completed';

/** Per-instance overrides for a card's own metrics. */
export type TaskFeedCardStyleProps = {
  width?: CssLength;
  padding?: CssLength;
  radius?: CssLength;
  gap?: CssLength;
};

export type TaskFeedCardProps = {
  /** What happened — "Closed Deal with John Smith". One line, then clipped. */
  title: ReactNode;
  /** Why it matters and what to do about it. Two lines, then clipped. */
  description?: ReactNode;
  /** How long ago, already formatted — "10m ago". */
  time?: ReactNode;
  /** Which stage the task came from. @default 'fallback' */
  stage?: TaskStage;
  /** @default 'default' */
  state?: TaskCardState;
  /**
   * Whether the task can be completed from the feed.
   *
   * Some tasks are notices rather than work — being mentioned, or a deal
   * closing — and have nothing to mark done. They keep Snooze, so the card can
   * still be cleared.
   *
   * @default true
   */
  completable?: boolean;
  onComplete?: () => void;
  onSnooze?: () => void;
  onClick?: () => void;
} & TaskFeedCardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/** What the card says about itself once it has been acted on. */
const CONFIRMATIONS = {
  snoozed: { icon: IconXCirlceRoundFill, tone: color.navbar.text2, label: 'Snoozed for 1 Minute' },
  completed: {
    icon: IconCheckmarkCircleFill,
    tone: color.status.success.text,
    label: 'Marked as Completed',
  },
} as const;

/**
 * One task in the feed.
 *
 * Figma: node 733:4475 ("Task Feed - Card").
 *
 * The border is what carries state. Figma draws five bordered variants over
 * one body, so the card's content is written once here and only its edge and
 * its cover change — a variant per state would be five copies of the same
 * three lines of text.
 *
 * `snoozed` and `completed` cover the card rather than replacing it. The card
 * is about to leave the column, and swapping its content would make it change
 * height on the way out, shifting every card below it while the confirmation
 * is still being read.
 */
export const TaskFeedCard = forwardRef<HTMLDivElement, TaskFeedCardProps>(function TaskFeedCard(
  {
    title,
    description,
    time,
    stage = 'fallback',
    state = 'default',
    completable = true,
    onComplete,
    onSnooze,
    onClick,
    width,
    padding,
    radius,
    gap,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const confirmation = state === 'snoozed' || state === 'completed' ? CONFIRMATIONS[state] : undefined;

  const border = confirmation
    ? confirmation.tone
    : hovered
      ? color.main.brand
      : state === 'unread'
        ? card.unreadBorder
        : 'transparent';

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: len(gap ?? card.gap),
        // Fills the list's padded width, capped at what Figma draws. Fixed at
        // 304 the card had no slack for a scrollbar and lost its right gap.
        width: '100%',
        // A card keeps its full height in a column that has run out of room.
        // The feed is a bounded flex column, so without this it shrinks every
        // card by the overflow divided between them — slicing the actions off
        // the bottom of each one instead of scrolling the last one out of
        // view.
        flexShrink: 0,
        maxWidth: len(width ?? card.maxWidth),
        padding: len(padding ?? card.padding),
        borderRadius: len(radius ?? card.radius),
        // A transparent border rather than none, so the card does not move by
        // a pixel when a state gives it one.
        border: `${borderWidth.thin}px solid ${border}`,
        backgroundColor: card.background,
        cursor: onClick ? 'pointer' : 'default',
        overflow: 'hidden',
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: len(card.markGap) }}>
        <StageIcon stage={stage} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: len(card.textGap),
            flex: 1,
            minWidth: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: len(spacing.xs) }}>
            <span
              style={{
                ...textStyle.mMedium,
                color: color.main.black,
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>

            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: len(spacing.xxs),
                flexShrink: 0,
              }}
            >
              {time && (
                <span
                  style={{
                    ...textStyle.sRegular,
                    // 10px: below the smallest type token, and deliberately so
                    // — the timestamp is the one thing on the card that is
                    // never read on purpose.
                    fontSize: card.timeFontSize,
                    color: color.main.description,
                    opacity: card.timeOpacity,
                  }}
                >
                  {time}
                </span>
              )}
              {state === 'unread' && (
                <span
                  aria-label="Unread"
                  role="img"
                  style={{
                    width: card.newDotSize,
                    height: card.newDotSize,
                    borderRadius: '50%',
                    backgroundColor: color.main.brand,
                  }}
                />
              )}
            </span>
          </div>

          {description && (
            <span
              style={{
                ...textStyle.sRegular,
                color: color.main.description,
                // Fixed, so the column does not jump as tasks of different
                // lengths arrive and leave. In `em` of this text's own size
                // and leading, so the box is exactly the lines it clamps to.
                height: `${card.descriptionLines * lineHeight.paragraph}em`,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: card.descriptionLines,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {description}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: len(card.actionGap) }}>
        {completable && (
          <TaskFeedButton
            onClick={(event) => {
              event.stopPropagation();
              onComplete?.();
            }}
          >
            Mark as Complete
          </TaskFeedButton>
        )}
        <TaskFeedButton
          onClick={(event) => {
            event.stopPropagation();
            onSnooze?.();
          }}
        >
          Snooze
        </TaskFeedButton>
      </div>

      {confirmation && (
        <div
          aria-live="polite"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: len(spacing.xs),
            backgroundColor: card.background,
          }}
        >
          <Icon icon={confirmation.icon} size={32} color={confirmation.tone} />
          <span style={{ ...textStyle.lMedium, color: confirmation.tone }}>
            {confirmation.label}
          </span>
        </div>
      )}
    </div>
  );
});
