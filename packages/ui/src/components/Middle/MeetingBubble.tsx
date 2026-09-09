import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCalendarFill,
  IconLockFill,
  IconMeetingsFill,
  IconSelectTimeClockFill,
  type IconDef,
} from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { ChatAction, type ChatActionProps } from './ChatAction.js';
import { SendIndicator, type SendState } from './SendIndicator.js';

const { meetingBubble } = component.middle;

/**
 * What became of the meeting.
 *
 * Figma draws thirteen cards; these are the six things that actually happened.
 * The rest of Figma's list is those six crossed with details the card is given —
 * whether there is a link yet, whether a recording has expired — which are
 * `link` and `expired` here rather than states of their own.
 */
export type MeetingState =
  | 'propose'
  | 'booked'
  | 'rescheduled'
  | 'cancelled'
  | 'ended'
  | 'recording';

/** One line of the card — a glyph, a label, and its value. */
export type MeetingDetail = {
  /** The glyph. Defaults to the one that suits the label. */
  icon?: IconDef;
  label: ReactNode;
  value: ReactNode;
  /** Draws the value as a link. */
  href?: string;
  /** Strikes the value through — what a reschedule does to the old slot. */
  struck?: boolean;
  /** Widens the label column, for "Available Until:" and the like. */
  wide?: boolean;
};

/** Per-instance overrides for the card's own metrics. */
export type MeetingBubbleStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  width?: CssLength;
  background?: string;
  borderColor?: string;
};

export type MeetingBubbleProps = {
  /**
   * @default 'booked'
   */
  state?: MeetingState;
  /** The heading. Defaults to what the state means. */
  title?: ReactNode;
  /**
   * The lines under it — date, time, link, password, reason. Passed rather than
   * derived from the state: a booked meeting and an ended one carry the same
   * rows, and which of them a given card has is a question about the meeting
   * rather than about the kind of card.
   */
  details?: MeetingDetail[];
  /** The line under the title on a proposal — "Waiting for others to pick…". */
  description?: ReactNode;
  /** The time under the card, and what became of it. */
  time?: ReactNode;
  /**
   * @default 'sent'
   */
  sendState?: SendState;
  /** Cancels the meeting. Drawn in the error tone — it is the destructive one. */
  onCancel?: () => void;
  /** Moves the meeting. */
  onReschedule?: () => void;
  /** Joins it, or opens the recording. Only drawn once there is somewhere to go. */
  onJoin?: () => void;
  /** The label on that last button. Defaults to "Join". */
  joinLabel?: ReactNode;
  /**
   * Whether the meeting can still be acted on. An ended meeting keeps its
   * buttons so the card does not change shape, but none of them do anything.
   * @default false
   */
  expired?: boolean;
  /** Opens the proposal. Only meaningful with `state="propose"`. */
  onOpen?: () => void;
  /** The hover controls — send now, reschedule, cancel. */
  actions?: ChatActionProps;
} & MeetingBubbleStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const titles: Record<MeetingState, string> = {
  propose: 'Schedule a 30-minutes Meeting',
  booked: 'Meeting Booked',
  rescheduled: 'Meeting Rescheduled',
  cancelled: 'Meeting Canceled',
  ended: 'Meeting Ended',
  recording: 'View Zoom Recording',
};

/**
 * Guesses a row's glyph from its label, so the common rows need no icon.
 *
 * A date row always gets the calendar and a time row always the clock; spelling
 * that out at every call site would be four words of noise per line.
 */
function detailIcon(label: ReactNode): IconDef {
  const text = typeof label === 'string' ? label.toLowerCase() : '';
  if (text.startsWith('date') || text.startsWith('available')) return IconCalendarFill;
  if (text.startsWith('time') || text.startsWith('from') || text.startsWith('to'))
    return IconSelectTimeClockFill;
  if (text.startsWith('password')) return IconLockFill;
  return IconMeetingsFill;
}

/**
 * A meeting in the thread — proposed, booked, moved, cancelled, or over.
 *
 * Figma: node 2023:13923, which draws thirteen cards. They are six outcomes
 * crossed with details the meeting happens to have, so they are built as
 * `state` plus the rows and buttons the caller passes. A union of thirteen would
 * make "an ended meeting whose recording expired" a fourteenth variant rather
 * than the combination it is.
 *
 * Ringed green rather than filled: this is still a message in the conversation,
 * and a filled card would read as a panel dropped into the thread.
 *
 * Figma's "No Meetings" is not here. It is the meeting-info panel's empty state
 * rather than anything the thread draws, and putting it in this component would
 * make a card that says there is no card.
 */
export const MeetingBubble = forwardRef<HTMLDivElement, MeetingBubbleProps>(
  function MeetingBubble(
    {
      state = 'booked',
      title,
      details = [],
      description,
      time,
      sendState = 'sent',
      onCancel,
      onReschedule,
      onJoin,
      joinLabel = 'Join',
      expired = false,
      onOpen,
      actions,
      radius,
      padding,
      width,
      background,
      borderColor,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);
    const propose = state === 'propose';
    const hasButtons = Boolean(onCancel || onReschedule || onJoin);
    const showActions = Boolean(actions) && hovered;

    return (
      <div
        ref={ref}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          position: 'relative',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: meetingBubble.gap,
          boxSizing: 'border-box',
          width: len(width) ?? (propose ? meetingBubble.proposeWidth : meetingBubble.width),
          padding: len(padding) ?? meetingBubble.padding,
          borderRadius: len(radius) ?? meetingBubble.radius,
          border: `${meetingBubble.borderWidth}px solid ${
            borderColor ?? color.accent.meetings.main
          }`,
          // The card tints under the pointer like every other bubble, so a
          // thread of mixed messages and meetings responds the same way.
          backgroundColor: background ?? (hovered ? color.navbar.hover : color.main.white),
          transition: 'background-color 120ms ease',
          cursor: onOpen ? 'pointer' : undefined,
        }}
        onClick={onOpen}
        {...rest}
      >
        {propose ? (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: meetingBubble.proposeGap,
              width: '100%',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: meetingBubble.proposeGap,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: meetingBubble.proposeMarkSize,
                  height: meetingBubble.proposeMarkSize,
                  borderRadius: meetingBubble.proposeMarkRadius,
                  backgroundColor: color.accent.meetings.main,
                }}
              >
                <Icon icon={IconMeetingsFill} size={20} color={color.main.white} />
              </span>
              <span
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: meetingBubble.proposeStackGap,
                  minWidth: 0,
                }}
              >
                <span style={{ ...textStyle.lMedium, color: color.main.description }}>
                  {title ?? titles.propose}
                </span>
                {description != null && (
                  <span style={{ ...textStyle.mRegular, color: color.main.description }}>
                    {description}
                  </span>
                )}
              </span>
            </span>
          </span>
        ) : (
          <span style={{ display: 'flex', flexDirection: 'column', gap: meetingBubble.gap, width: '100%' }}>
            <span style={{ ...textStyle.lMedium, color: color.main.black }}>
              {title ?? titles[state]}
            </span>
            {details.length > 0 && (
              <span
                style={{ display: 'flex', flexDirection: 'column', gap: meetingBubble.rowGap }}
              >
                {details.map((detail, index) => (
                  <DetailRow key={index} detail={detail} />
                ))}
              </span>
            )}
            {hasButtons && (
              <span style={{ display: 'flex', gap: meetingBubble.buttonGap, width: '100%' }}>
                {onCancel && (
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Button
                      size="small"
                      variant="secondary"
                      tone="danger"
                      fullWidth
                      disabled={expired}
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>
                  </span>
                )}
                {onReschedule && (
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Button
                      size="small"
                      variant="secondary"
                      fullWidth
                      disabled={expired}
                      onClick={onReschedule}
                    >
                      Reschedule
                    </Button>
                  </span>
                )}
                {onJoin && (
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Button
                      size="small"
                      tone="meeting"
                      fullWidth
                      disabled={expired}
                      onClick={onJoin}
                    >
                      {joinLabel}
                    </Button>
                  </span>
                )}
              </span>
            )}
          </span>
        )}

        {time != null && <SendIndicator time={time} state={sendState} />}

        {showActions && actions && (
          <span
            style={{
              position: 'absolute',
              bottom: component.middle.bubble.action.offsetBottom,
              left: component.middle.bubble.action.offsetLeft,
            }}
          >
            <ChatAction {...actions} />
          </span>
        )}
      </div>
    );
  },
);

/** One detail line. */
function DetailRow({ detail }: { detail: MeetingDetail }) {
  const { icon, label, value, href, struck, wide } = detail;

  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: meetingBubble.detailGap,
        minWidth: 0,
      }}
    >
      <Icon
        icon={icon ?? detailIcon(label)}
        size={meetingBubble.iconSize}
        color={color.accent.meetings.main}
      />
      <span
        style={{
          ...textStyle.mRegular,
          color: color.main.description,
          // A minimum rather than a fixed width: the short labels share a column
          // so their values line up, and a longer one — "Reason:",
          // "Available Until:" — takes the room it needs instead of running
          // into its own value.
          minWidth: wide ? meetingBubble.wideLabelWidth : meetingBubble.labelWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <span
        style={{
          ...textStyle.mRegular,
          flex: 1,
          minWidth: 0,
          color: href ? color.badge.foreground : color.main.black,
          textDecoration: struck ? 'line-through' : undefined,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {value}
      </span>
    </span>
  );
}
