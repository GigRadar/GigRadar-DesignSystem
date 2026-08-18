import { borderWidth, color, component, typography } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown, IconDropdownArrowUp } from '../../icons/defs.js';
import { StatusBadge } from '../Badge/StatusBadge.js';
import { Toggle } from '../Toggle/Toggle.js';
import { ChannelLogo, channelPalette, type NotificationChannel } from './ChannelLogo.js';

const { notification } = component;

/** Per-instance overrides for the card's own metrics. */
export type NotificationCardStyleProps = {
  /** Corner radius. */
  radius?: CssLength;
  /** Padding inside the header row. */
  padding?: CssLength;
  /** Border thickness. */
  borderWidth?: CssLength;
  /** Space between the logo, the text stack, and the controls. */
  gap?: CssLength;
  /** Fill. */
  background?: string;
  /** Border color. */
  borderColor?: string;
  /** The channel name's color. */
  textColor?: string;
  /** The supporting line's color. */
  descriptionColor?: string;
};

/** What a `renderControls` function receives — the header's trailing controls. */
export type NotificationControlsRenderProps = WithDefaultRender & {
  /** Whether the channel is switched on. */
  enabled: boolean;
  /** Whether the body is open. */
  expanded: boolean;
  /** Switches the channel, reporting through `onEnabledChange`. */
  toggle: (next: boolean) => void;
};

export type NotificationCardProps = {
  /** Which channel this card is for. Sets the logo, the tint, and the defaults. */
  channel: NotificationChannel;
  /** The channel's name. Defaults to the channel's own — "Slack", "Telegram". */
  title?: ReactNode;
  /** The line under the name. Defaults to "Notifications via {name}". */
  description?: ReactNode;
  /**
   * Whether the channel is connected, which is what the status pill reports.
   *
   * @default false
   */
  connected?: boolean;
  /** Overrides the status pill's label. */
  statusLabel?: ReactNode;
  /** Whether the channel is switched on. Controlled. */
  enabled?: boolean;
  /** The starting position when the card manages the toggle itself. */
  defaultEnabled?: boolean;
  onEnabledChange?: (enabled: boolean) => void;
  /**
   * Whether the body below the header is open. Controlled.
   *
   * Left uncontrolled, the card opens itself when the channel is switched on
   * and closes when it is switched off, which is the behaviour Figma draws.
   */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * The body — the connection walkthrough, or the settings once connected.
   * Only drawn while the card is expanded.
   */
  children?: ReactNode;
  /** Replaces the toggle and chevron. Call `defaultRender()` to decorate. */
  renderControls?: RenderProp<NotificationControlsRenderProps>;
} & NotificationCardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title' | 'children'>;

/** The name and supporting line each channel carries by default. */
const channelLabels: Record<NotificationChannel, string> = {
  telegram: 'Telegram',
  slack: 'Slack',
  browser: 'Browser',
};

/**
 * One channel's card on the CRM notifications screen — Figma node 4102:3182.
 *
 * A header that is always drawn, and a body that appears once the channel is
 * switched on. The header carries the channel's logo, its name and connection
 * status, the on/off toggle, and the chevron that folds the body away.
 *
 * The toggle and the fold are separate axes on purpose. Switching a channel
 * off is a real change to where notifications go; collapsing the card only
 * tidies the screen. Figma draws a connected channel that has been folded shut
 * ("ON - Minimized") precisely because those two are not the same act — so the
 * card opens itself when switched on, but a caller who has folded it stays
 * folded.
 */
export const NotificationCard = forwardRef<HTMLDivElement, NotificationCardProps>(
  function NotificationCard(
    {
      channel,
      title,
      description,
      connected = false,
      statusLabel,
      enabled,
      defaultEnabled = false,
      onEnabledChange,
      expanded,
      onExpandedChange,
      children,
      renderControls,
      radius,
      padding,
      borderWidth: borderWidthProp,
      gap,
      background,
      borderColor,
      textColor,
      descriptionColor,
      ...rest
    },
    ref,
  ) {
    const [uncontrolledEnabled, setUncontrolledEnabled] = useState(defaultEnabled);
    const isEnabled = enabled ?? uncontrolledEnabled;

    // Follows the toggle unless a caller is driving it: switching a channel on
    // is what opens its walkthrough, and switching it off puts it away.
    const [uncontrolledExpanded, setUncontrolledExpanded] = useState(defaultEnabled);
    const isExpanded = expanded ?? uncontrolledExpanded;

    const { header, card } = notification;
    const accent = channelPalette[channel].color;
    const showBody = isExpanded && children != null;

    const setEnabled = (next: boolean) => {
      if (enabled === undefined) setUncontrolledEnabled(next);
      if (expanded === undefined) setUncontrolledExpanded(next);
      onEnabledChange?.(next);
    };

    const setExpanded = (next: boolean) => {
      if (expanded === undefined) setUncontrolledExpanded(next);
      onExpandedChange?.(next);
    };

    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      borderRadius: len(radius) ?? `${card.radius}px`,
      border: `${len(borderWidthProp) ?? `${card.borderWidth}px`} solid ${
        borderColor ?? color.navbar.hover
      }`,
      backgroundColor: background ?? color.main.white,
      fontFamily: typography.fontFamily.base,
      overflow: 'hidden',
    };

    const name = title ?? channelLabels[channel];

    const defaultControls = () => (
      <>
        <Toggle
          checked={isEnabled}
          onCheckedChange={setEnabled}
          label={`${channelLabels[channel]} notifications`}
        />
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${channelLabels[channel]}`}
          onClick={() => setExpanded(!isExpanded)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: 0,
            border: 'none',
            background: 'none',
            color: color.navbar.text,
            cursor: 'pointer',
          }}
        >
          <Icon
            icon={isExpanded ? IconDropdownArrowUp : IconDropdownArrowDown}
            size={header.chevronSize}
          />
        </button>
      </>
    );

    return (
      <div {...rest} ref={ref} style={style}>
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: len(gap) ?? `${header.gap}px`,
            width: '100%',
            padding: len(padding) ?? `${header.padding}px`,
            // The rule under the header only exists while something is below it.
            borderBottom: showBody
              ? `${borderWidth.thin}px solid ${borderColor ?? color.navbar.hover}`
              : undefined,
          }}
        >
          <ChannelLogo channel={channel} />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: `${header.textGap}px`,
              flex: '1 1 auto',
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: `${header.titleGap}px`,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  ...typography.textStyle.mMedium,
                  color: textColor ?? color.navbar.text2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {name}
              </span>
              <StatusBadge tone={connected ? 'connected' : 'notConnected'}>
                {statusLabel}
              </StatusBadge>
            </div>
            <span
              style={{
                ...typography.textStyle.sRegular,
                color: descriptionColor ?? color.navbar.text,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: '100%',
              }}
            >
              {description ?? `Notifications via ${channelLabels[channel]}`}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: `${header.controlGap}px`,
              flexShrink: 0,
            }}
          >
            {renderControls
              ? renderControls({
                  enabled: isEnabled,
                  expanded: isExpanded,
                  toggle: setEnabled,
                  defaultRender: defaultControls,
                })
              : defaultControls()}
          </div>
        </div>
        {showBody && (
          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: `${notification.body.gap}px`,
              width: '100%',
              padding: `${notification.body.padding}px`,
              // Exposed so a body can tint itself to its channel without
              // re-deriving which channel it is in.
              ['--gr-notification-accent' as string]: accent,
            }}
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);
