import { color, component } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconInternetBrowserFill,
  IconSlackFill,
  IconTelegramFill,
  type IconDef,
} from '../../icons/defs.js';

const { notification } = component;

/**
 * A delivery channel a notification can be sent through.
 *
 * A closed list: these are the three integrations the CRM notification screen
 * offers, and each is a distinct connection flow rather than a display option.
 */
export type NotificationChannel = 'telegram' | 'slack' | 'browser';

/** Per-instance overrides for the tile's own metrics. */
export type ChannelLogoStyleProps = {
  /** The tile's edge length. */
  size?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** The glyph's edge length. */
  iconSize?: CssLength;
  /** Fill. Overrides the channel's own tint. */
  background?: string;
  /** Glyph color. Overrides the channel's brand color. */
  iconColor?: string;
};

export type ChannelLogoProps = {
  /** Which channel's mark to draw. */
  channel: NotificationChannel;
  /** Replaces the glyph. The tile's tint and metrics are kept. */
  icon?: IconDef;
} & ChannelLogoStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The palette and glyph per channel — Figma's "Social Media Logo"
 * (node 4101:28355).
 *
 * Slack and Telegram take their own brand colors from `color.integration`,
 * which is where external services are kept precisely so they are not mistaken
 * for semantic tokens. The browser is not somebody else's brand, so it takes
 * the GigRadar badge blue.
 */
const channels: Record<NotificationChannel, { background: string; color: string; icon: IconDef }> =
  {
    telegram: {
      background: color.integration.telegram.background,
      color: color.integration.telegram.main,
      icon: IconTelegramFill,
    },
    slack: {
      background: color.integration.slack.background,
      color: color.integration.slack.main,
      icon: IconSlackFill,
    },
    browser: {
      background: color.badge.background,
      color: color.badge.foreground,
      icon: IconInternetBrowserFill,
    },
  };

/**
 * The rounded tile carrying a channel's mark — Figma node 4101:28355.
 *
 * One component for all three because they are one shape holding different
 * art: a 36px tile at an 8px radius, tinted with the channel's pale background
 * and a 20px glyph in its main color. Only the palette and the glyph change,
 * which is what makes this a lookup table rather than three components.
 */
export const ChannelLogo = forwardRef<HTMLSpanElement, ChannelLogoProps>(function ChannelLogo(
  { channel, icon, size, radius, iconSize, background, iconColor, ...rest },
  ref,
) {
  const spec = channels[channel];

  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: len(size) ?? `${notification.logo.size}px`,
    height: len(size) ?? `${notification.logo.size}px`,
    borderRadius: len(radius) ?? `${notification.logo.radius}px`,
    backgroundColor: background ?? spec.background,
    color: iconColor ?? spec.color,
  };

  return (
    <span {...rest} ref={ref} style={style}>
      <Icon icon={icon ?? spec.icon} size={len(iconSize) ?? notification.logo.iconSize} />
    </span>
  );
});

/** The channel palettes, for components that tint themselves to match a channel. */
export const channelPalette = channels;
