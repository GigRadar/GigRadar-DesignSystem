import { borderWidth, color, component, radius, shadow, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

const { osNotification } = component.inbox;

/**
 * Which platform's notification chrome to draw.
 *
 * The browser decides the shape, not the app: a page can supply a title, a
 * body, and an icon, and every one of these renders that same payload
 * differently. They are drawn here so a designer can see what the copy looks
 * like where it actually lands — the words are the only part the product
 * controls, and a title that fits Safari can be truncated by Chrome.
 */
export type OsNotificationPlatform =
  | 'windows-chrome'
  | 'windows-firefox'
  | 'windows-edge'
  | 'mac-chrome'
  | 'mac-firefox'
  | 'mac-safari';

export type OsNotificationProps = {
  /** The notification's heading — "New Message from Floyd Miles". */
  title: ReactNode;
  /** The message body. Every platform truncates it at a different length. */
  body: ReactNode;
  /**
   * Which chrome to draw.
   * @default 'mac-chrome'
   */
  platform?: OsNotificationPlatform;
  /** The app icon. Falls back to a GigRadar-blue disc. */
  iconSrc?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/** How each platform labels the sender line under the body. */
function attribution(platform: OsNotificationPlatform) {
  switch (platform) {
    case 'windows-chrome':
    case 'mac-chrome':
      return 'Google Chrome · via gigradar.io';
    case 'windows-edge':
      return 'Microsoft Edge · via gigradar.io';
    case 'mac-safari':
      // Safari attributes in its own chrome rather than in the body.
      return null;
    default:
      return 'via gigradar.io';
  }
}

/**
 * A browser notification, as the operating system draws it.
 *
 * Figma: the platform set at 2452:9832 onward in the CRM file.
 *
 * Presentational only — the real thing is drawn by the OS and cannot be
 * styled. This exists so the copy can be reviewed where it lands: the title
 * and body are all the product controls, and the space they get differs by
 * platform. Anything that fits here fits in the real one.
 */
export const OsNotification = forwardRef<HTMLDivElement, OsNotificationProps>(
  function OsNotification({ title, body, platform = 'mac-chrome', iconSrc, ...rest }, ref) {
    const mac = platform.startsWith('mac');
    const note = attribution(platform);

    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${platform} notification preview`}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: osNotification.gap,
          boxSizing: 'border-box',
          width: osNotification.width,
          padding: osNotification.padding,
          // macOS draws a tighter, more rounded card than Windows.
          borderRadius: mac ? osNotification.radiusMac : osNotification.radiusWindows,
          backgroundColor: color.main.white,
          border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
          boxShadow: shadow.popup,
        }}
        {...rest}
      >
        <span
          aria-hidden
          style={{
            flexShrink: 0,
            width: osNotification.iconSize,
            height: osNotification.iconSize,
            borderRadius: radius.s,
            backgroundColor: color.badge.foreground,
            backgroundImage: iconSrc ? `url(${iconSrc})` : undefined,
            backgroundSize: 'cover',
          }}
        />

        <span style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
          <span
            style={{
              ...textStyle.sMedium,
              color: color.main.black,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </span>
          <span
            style={{
              ...textStyle.sRegular,
              color: color.main.description,
              // Two lines, then an ellipsis — what every one of these platforms
              // allows a body before it cuts.
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {body}
          </span>
          {note != null && (
            <span style={{ ...textStyle.sRegular, color: color.navbar.text, fontSize: osNotification.attributionFontSize }}>
              {note}
            </span>
          )}
        </span>
      </div>
    );
  },
);
