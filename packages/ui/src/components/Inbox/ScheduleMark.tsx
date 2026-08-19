import { color, component } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconSelectTimeClockFill } from '../../icons/defs.js';

const { room } = component.inbox;

/** Per-instance overrides for the mark's own metrics. */
export type ScheduleMarkStyleProps = {
  size?: CssLength;
  iconSize?: CssLength;
  background?: string;
  iconColor?: string;
};

export type ScheduleMarkProps = {
  /**
   * Names the mark for a screen reader.
   * @default 'Has a scheduled message'
   */
  label?: string;
} & ScheduleMarkStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * A purple clock disc — this room has a message queued to send.
 *
 * Figma: the "Schedule Message" container inside the chat card (node
 * 2240:10527).
 *
 * Takes the schedule accent rather than a status color: a queued message is
 * not a warning or a success, it is a pending action, and the purple is what
 * ties it to the scheduling flow elsewhere in the column.
 */
export const ScheduleMark = forwardRef<HTMLSpanElement, ScheduleMarkProps>(function ScheduleMark(
  { label = 'Has a scheduled message', size, iconSize, background, iconColor, ...rest },
  ref,
) {
  return (
    <span
      ref={ref}
      aria-label={label}
      role="img"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: len(size) ?? room.scheduleSize,
        height: len(size) ?? room.scheduleSize,
        borderRadius: '50%',
        backgroundColor: background ?? color.accent.schedule.main,
      }}
      {...rest}
    >
      <Icon
        icon={IconSelectTimeClockFill}
        size={len(iconSize) ?? room.scheduleIconSize}
        color={iconColor ?? color.main.white}
      />
    </span>
  );
});
