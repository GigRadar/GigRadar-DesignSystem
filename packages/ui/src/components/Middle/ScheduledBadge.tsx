import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconAutoCancelShieldStroke,
  IconLazizaSparkleFill,
  IconScheduleClockStroke,
} from '../../icons/defs.js';

const { scheduledBadge } = component.middle;

/**
 * Which room the badge is sitting in.
 *
 * `room` is the chat room, and the badge offers the way out to the queue.
 * `queue` is the outbox, and it offers the way back. One component because it
 * is one bar pointing in whichever direction you are not.
 */
export type ScheduledBadgePlace = 'room' | 'queue';

/** Per-instance overrides for the badge's own metrics. */
export type ScheduledBadgeStyleProps = {
  radius?: CssLength;
  paddingX?: CssLength;
  paddingY?: CssLength;
  background?: string;
  borderColor?: string;
};

export type ScheduledBadgeProps = {
  /**
   * @default 'room'
   */
  place?: ScheduledBadgePlace;
  /**
   * Whether auto-cancel is on for the queued messages. Draws the shield beside
   * the clock — the clock says there are scheduled messages, the shield says
   * they will withdraw themselves if the client writes first.
   * @default false
   */
  autoCancel?: boolean;
  /**
   * Whether Laziza queued a follow-up. Draws the sparkle, the same mark that
   * names AI-written content everywhere else.
   * @default false
   */
  laziza?: boolean;
  /** Overrides the sentence. Defaults to what the place means. */
  children?: ReactNode;
  /** Overrides the link text at the end of the sentence. */
  linkLabel?: ReactNode;
  /** Follows the link. Without it the badge is a statement rather than a way out. */
  onNavigate?: () => void;
} & ScheduledBadgeStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

const copy: Record<ScheduledBadgePlace, { text: string; link: string }> = {
  room: { text: 'You have scheduled messages.', link: 'Go to schedule message chat room.' },
  queue: { text: 'You are in scheduled messages chat room.', link: 'Go back to main chat room.' },
};

/**
 * The bar linking a room to its outbox.
 *
 * Figma: node 2077:17394 — two states, one per side of the trip.
 *
 * The glyphs report what is waiting rather than decorating the bar: the clock is
 * always there because the badge only appears when something is scheduled, and
 * the other two appear only when they are true. Reading them left to right tells
 * you what kind of queue you are about to open.
 */
export const ScheduledBadge = forwardRef<HTMLDivElement, ScheduledBadgeProps>(
  function ScheduledBadge(
    {
      place = 'room',
      autoCancel = false,
      laziza = false,
      children,
      linkLabel,
      onNavigate,
      radius,
      paddingX,
      paddingY,
      background,
      borderColor,
      ...rest
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: scheduledBadge.gap,
          boxSizing: 'border-box',
          width: '100%',
          paddingLeft: len(paddingX) ?? scheduledBadge.paddingX,
          paddingRight: len(paddingX) ?? scheduledBadge.paddingX,
          paddingTop: len(paddingY) ?? scheduledBadge.paddingY,
          paddingBottom: len(paddingY) ?? scheduledBadge.paddingY,
          borderRadius: len(radius) ?? scheduledBadge.radius,
          border: `${borderWidth.thin}px solid ${borderColor ?? color.accent.schedule.main}`,
          backgroundColor: background ?? color.main.white,
        }}
        {...rest}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: scheduledBadge.iconGap }}>
          <Icon
            icon={IconScheduleClockStroke}
            size={scheduledBadge.iconSize}
            color={color.accent.schedule.main}
          />
          {autoCancel && (
            <Icon
              icon={IconAutoCancelShieldStroke}
              size={scheduledBadge.iconSize}
              color={color.accent.schedule.main}
            />
          )}
          {laziza && (
            <Icon
              icon={IconLazizaSparkleFill}
              size={scheduledBadge.iconSize}
              color={color.accent.laziza.main}
            />
          )}
        </span>
        <span style={{ ...textStyle.mRegular, flex: 1, minWidth: 0, color: color.main.black }}>
          {children ?? copy[place].text}{' '}
          {/* The way out is a link inside the sentence rather than a button
              beside it: the bar is one statement, and the second half is what
              to do about the first. */}
          <span
            role={onNavigate ? 'button' : undefined}
            tabIndex={onNavigate ? 0 : undefined}
            onClick={onNavigate}
            onKeyDown={(event) => {
              if (!onNavigate) return;
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onNavigate();
              }
            }}
            style={{
              color: color.badge.foreground,
              cursor: onNavigate ? 'pointer' : 'default',
            }}
          >
            {linkLabel ?? copy[place].link}
          </span>
        </span>
      </div>
    );
  },
);
