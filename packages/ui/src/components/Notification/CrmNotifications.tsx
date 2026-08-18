import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { SettingsHeader } from '../SettingsSection/SettingsHeader.js';
import { NotificationCard } from './NotificationCard.js';
import type { NotificationChannel } from './ChannelLogo.js';

const { notification, settingsHeader } = component;

/** One channel's row on the notifications screen. */
export type NotificationChannelConfig = {
  /** Which channel this is. Doubles as the React key. */
  channel: NotificationChannel;
  /** Overrides the channel's own name. */
  title?: ReactNode;
  /** Overrides the line under the name. */
  description?: ReactNode;
  /** Whether the channel is connected, which the status pill reports. */
  connected?: boolean;
  /** Whether the channel is switched on. */
  enabled?: boolean;
  /** Whether the card's body is open. */
  expanded?: boolean;
  /**
   * The card's body — the connection walkthrough while connecting, the two
   * settings cards once connected. Only drawn while the card is expanded.
   */
  children?: ReactNode;
};

/** What a `renderChannel` function receives — one card on the screen. */
export type NotificationChannelRenderProps = WithDefaultRender & {
  /** The channel being drawn, as declared. */
  config: NotificationChannelConfig;
  /** Its position in the list. */
  index: number;
};

/** Per-instance overrides for the screen's own metrics. */
export type CrmNotificationsStyleProps = {
  /** Space between the cards. */
  gap?: CssLength;
  /** Horizontal inset of the card column. */
  paddingX?: CssLength;
  /** Fill. */
  background?: string;
};

export type CrmNotificationsProps = {
  /** The channels, in the order they are stacked. */
  channels: NotificationChannelConfig[];
  /** The screen's heading. Pass `null` to drop the header entirely. */
  title?: ReactNode;
  /** The line under the heading. */
  description?: ReactNode;
  /** Shows a back chevron in the header, and fires when it is pressed. */
  onBack?: () => void;
  /** Reports a channel being switched on or off. */
  onEnabledChange?: (channel: NotificationChannel, enabled: boolean) => void;
  /** Reports a card being folded open or shut. */
  onExpandedChange?: (channel: NotificationChannel, expanded: boolean) => void;
  /** Replaces one card. Call `defaultRender()` to decorate rather than replace. */
  renderChannel?: RenderProp<NotificationChannelRenderProps>;
} & CrmNotificationsStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * CRM ▸ Settings ▸ CRM Notifications — the whole screen. Figma node 4102:3182.
 *
 * A heading over a stack of channel cards, one per delivery route. The screen
 * owns almost nothing: it is the header, the column, and the spacing between
 * cards, because everything that varies is inside a card and belongs to it.
 *
 * Each channel's body is passed in rather than derived from its name. The
 * three connection flows genuinely differ — Slack authorizes an app, Telegram
 * runs a bot command, the browser asks for a permission — and a screen that
 * tried to own all three would be a switch statement over copy that nothing
 * else could reuse. `NotificationWalkthrough` is what makes each of them short
 * to write.
 */
export const CrmNotifications = forwardRef<HTMLDivElement, CrmNotificationsProps>(
  function CrmNotifications(
    {
      channels,
      title = 'CRM Notifications',
      description = 'Set up your CRM notifications easily for Telegram, Slack, and browser alerts.',
      onBack,
      onEnabledChange,
      onExpandedChange,
      renderChannel,
      gap,
      paddingX,
      background,
      ...rest
    },
    ref,
  ) {
    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      backgroundColor: background ?? color.main.white,
      fontFamily: typography.fontFamily.base,
    };

    const renderDefault = (config: NotificationChannelConfig) => (
      <NotificationCard
        channel={config.channel}
        title={config.title}
        description={config.description}
        connected={config.connected}
        enabled={config.enabled}
        expanded={config.expanded}
        onEnabledChange={(next) => onEnabledChange?.(config.channel, next)}
        onExpandedChange={(next) => onExpandedChange?.(config.channel, next)}
      >
        {config.children}
      </NotificationCard>
    );

    return (
      <div {...rest} ref={ref} style={style}>
        {title != null && (
          <SettingsHeader title={title} description={description} onBack={onBack} />
        )}
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: len(gap) ?? `${notification.card.gap}px`,
            width: '100%',
            padding: `0 ${len(paddingX) ?? `${settingsHeader.paddingX}px`}`,
          }}
        >
          {channels.map((config, index) => (
            <div key={config.channel} style={{ width: '100%' }}>
              {renderChannel
                ? renderChannel({
                    config,
                    index,
                    defaultRender: () => renderDefault(config),
                  })
                : renderDefault(config)}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
