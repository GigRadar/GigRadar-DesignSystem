import { color, component, textStyle, type StageName } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconAutoCancelShieldFill, IconScheduleClockFill } from '../../icons/defs.js';
import { LeadStageButton } from '../Middle/LeadStageButton.js';

const { roomEvent } = component.middle;

/**
 * What happened to the room, rather than in it.
 *
 * `stage` and `autoReply` both report a setting changing; `schedule` reports a
 * queued message reaching one of its moments.
 */
export type RoomEventKind = 'stage' | 'autoReply' | 'schedule';

/** Which moment a scheduled message has reached. */
export type ScheduleEventState = 'scheduled' | 'sent' | 'cancelled';

/** Per-instance overrides for the row's own metrics. */
export type RoomEventStyleProps = {
  textColor?: string;
};

export type RoomEventProps = {
  /**
   * @default 'stage'
   */
  kind?: RoomEventKind;
  /** Who made the change. Omitted, the "by …" clause is not drawn. */
  by?: ReactNode;
  /** When it happened. */
  time?: ReactNode;
  /** The stages moved between. Only meaningful with `kind="stage"`. */
  from?: StageName;
  to?: StageName;
  /** The auto-reply modes moved between, as already-built badges. */
  fromMode?: ReactNode;
  toMode?: ReactNode;
  /**
   * Which moment a scheduled message reached. Only meaningful with
   * `kind="schedule"`.
   * @default 'scheduled'
   */
  scheduleState?: ScheduleEventState;
  /** Overrides the sentence entirely. */
  children?: ReactNode;
} & RoomEventStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const scheduleCopy: Record<ScheduleEventState, string> = {
  scheduled: 'Scheduled for today',
  sent: 'Scheduled message sent',
  cancelled: 'Auto-cancelled trigger because the client replied',
};

/**
 * A line in the thread reporting something that happened to the room.
 *
 * Figma: nodes 4224:41684 (stage), 4494:30072 (auto-reply), 4512:26977
 * (scheduled message).
 *
 * One component for all three: they are the same centred sentence with the same
 * trailing timestamp, and what differs is only which words and badges fill it.
 * Figma files each with a "Multiple" variant, which is not a variant at all —
 * it is several of these stacked, so a thread renders a list rather than asking
 * for a different component.
 *
 * Centred and unboxed, unlike a message. These are not things anyone said, and
 * giving them a bubble would put them in the conversation rather than beside it.
 */
export const RoomEvent = forwardRef<HTMLDivElement, RoomEventProps>(function RoomEvent(
  {
    kind = 'stage',
    by,
    time,
    from,
    to,
    fromMode,
    toMode,
    scheduleState = 'scheduled',
    children,
    textColor,
    ...rest
  },
  ref,
) {
  const schedule = kind === 'schedule';
  const tone = textColor ?? (schedule ? color.accent.schedule.main : color.navbar.text2);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: roomEvent.gap,
        padding: roomEvent.padding,
        width: '100%',
      }}
      {...rest}
    >
      <span
        style={{
          ...textStyle.mRegular,
          display: 'inline-flex',
          alignItems: 'center',
          gap: roomEvent.innerGap,
          color: tone,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {children ?? (
          <>
            {schedule ? (
              <>
                <Icon
                  icon={
                    scheduleState === 'cancelled' ? IconAutoCancelShieldFill : IconScheduleClockFill
                  }
                  size={roomEvent.iconSize}
                  color={tone}
                />
                {scheduleCopy[scheduleState]}
                {/* The time is part of the sentence here rather than a trailing
                    stamp: "scheduled for today at 08:47" is one statement, and
                    splitting it would leave "scheduled for today" hanging. */}
                {scheduleState !== 'cancelled' && time != null && <>&nbsp;at {time}</>}
              </>
            ) : (
              <>
                {kind === 'stage' ? 'Stage changed from' : 'Auto-reply mode changed from'}
                {kind === 'stage'
                  ? from && <LeadStageButton stage={from} size="m" interactive={false} />
                  : fromMode}
                to
                {kind === 'stage'
                  ? to && <LeadStageButton stage={to} size="m" interactive={false} />
                  : toMode}
                {by != null && (
                  <>
                    by <strong style={{ ...textStyle.mMedium, color: tone }}>{by}</strong>
                  </>
                )}
              </>
            )}
          </>
        )}
      </span>
      {/* Cancelled keeps its trailing stamp; the other two spent theirs inside
          the sentence. */}
      {time != null && (!schedule || scheduleState === 'cancelled') && (
        <span style={{ ...textStyle.sRegular, color: color.disable.backgroundAlt, flexShrink: 0 }}>
          {time}
        </span>
      )}
    </div>
  );
});
