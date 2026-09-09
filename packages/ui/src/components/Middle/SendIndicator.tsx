import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import {
  IconCheckRead,
  IconDoubleCheckRead,
  IconFailedErrorFill,
  IconScheduleClockStroke,
} from '../../icons/defs.js';

const { indicator } = component.middle.bubble;

/**
 * What happened to the message.
 *
 * `sending` is in flight and `sent` has reached the server — both draw one
 * tick, because a message on its way is a message that has left. `read` has
 * reached the other person and draws two. `offline` is queued until the
 * connection returns, and is the only state that draws a clock: it is the one
 * case where the message has not gone anywhere. `error` did not go at all.
 *
 * Five states rather than a boolean, because "not delivered" means different
 * things to the person who wrote it: offline resolves itself, error asks for
 * action.
 */
export type SendState = 'sending' | 'sent' | 'read' | 'offline' | 'error';

/** Per-instance overrides for the indicator's own metrics. */
export type SendIndicatorStyleProps = {
  /** The time and the glyph beside it. */
  textColor?: string;
  iconColor?: string;
};

export type SendIndicatorProps = {
  /** The time the message was sent, already formatted. */
  time: ReactNode;
  /**
   * @default 'sent'
   */
  state?: SendState;
  /**
   * Prefixes "Edited at" — the message was changed after it was sent, and the
   * time now reports the edit rather than the original.
   * @default false
   */
  edited?: boolean;
} & SendIndicatorStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The time under a message, and what became of it.
 *
 * Figma: node 3523:40843.
 *
 * Only the sender's own messages carry a delivery glyph — a received message
 * has nothing to report about its delivery — so `state` is what decides whether
 * a glyph is drawn at all rather than a separate prop.
 */
export const SendIndicator = forwardRef<HTMLSpanElement, SendIndicatorProps>(
  function SendIndicator({ time, state = 'sent', edited = false, textColor, iconColor, ...rest }, ref) {
    const tone = textColor ?? color.disable.backgroundAlt;

    return (
      <span
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: indicator.gap,
          height: indicator.height,
          flexShrink: 0,
        }}
        {...rest}
      >
        {edited && (
          <span style={{ ...textStyle.sMedium, color: tone, whiteSpace: 'nowrap' }}>Edited at</span>
        )}
        <span style={{ ...textStyle.sMedium, color: tone, whiteSpace: 'nowrap' }}>{time}</span>
        {/* One tick until the other person has it, two once they do.
            `sending` shares the single tick with `sent`: a message on its way
            is a message that has left, and the clock is reserved for the one
            case where it has not — no connection to leave over. */}
        {(state === 'sending' || state === 'sent' || state === 'read') && (
          <Icon
            icon={state === 'read' ? IconDoubleCheckRead : IconCheckRead}
            size={indicator.iconSize}
            color={iconColor ?? tone}
          />
        )}
        {state === 'offline' && (
          <Icon
            icon={IconScheduleClockStroke}
            size={indicator.iconSize}
            color={iconColor ?? tone}
          />
        )}
        {state === 'error' && (
          <Icon
            icon={IconFailedErrorFill}
            size={indicator.iconSize}
            color={iconColor ?? color.status.error.main}
          />
        )}
      </span>
    );
  },
);
