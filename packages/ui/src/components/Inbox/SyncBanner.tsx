import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconInfoFill, IconWarning } from '../../icons/defs.js';

const { sync } = component.inbox;

/**
 * What the banner is saying.
 *
 * `info` explains something the person did not ask about — how far back the
 * import reaches. `warning` says the import has stopped and needs them.
 */
export type SyncBannerTone = 'info' | 'warning';

export type SyncBannerStyleProps = {
  padding?: number;
  radius?: number;
  background?: string;
  textColor?: string;
  /** The glyph disc's fill. */
  markBackground?: string;
  /** The glyph's color. */
  iconColor?: string;
};

export type SyncBannerProps = {
  /** The note itself. Inline links are the caller's to supply. */
  children: ReactNode;
  /**
   * Which kind of note.
   * @default 'info'
   */
  tone?: SyncBannerTone;
} & SyncBannerStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The note under the sync tracker.
 *
 * Figma: node 3312:24083.
 *
 * Takes its message as children rather than a string, because every variant
 * Figma draws carries an inline link — "contact our team", "dismiss it now" —
 * and a component that owned the copy would have to own those handlers too.
 */
export const SyncBanner = forwardRef<HTMLDivElement, SyncBannerProps>(function SyncBanner(
  { children, tone = 'info', padding, radius, background, textColor, markBackground, iconColor, ...rest },
  ref,
) {
  const warn = tone === 'warning';

  return (
    <div
      ref={ref}
      role={warn ? 'alert' : 'note'}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: sync.bannerGap,
        boxSizing: 'border-box',
        width: '100%',
        padding: padding ?? sync.bannerPadding,
        borderRadius: radius ?? sync.bannerRadius,
        backgroundColor:
          background ?? (warn ? color.status.warning.background : color.accent.notice.background),
      }}
      {...rest}
    >
      <span
        aria-hidden
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: sync.bannerMarkSize,
          height: sync.bannerMarkSize,
          borderRadius: sync.bannerMarkRadius,
          backgroundColor:
            markBackground ??
            (warn ? color.status.warning.main : color.accent.notice.markBackground),
        }}
      >
        <Icon
          icon={warn ? IconWarning : IconInfoFill}
          size={sync.bannerIconSize}
          color={iconColor ?? (warn ? color.main.white : color.badge.foreground)}
        />
      </span>

      <span
        style={{
          ...textStyle.sRegular,
          flex: 1,
          minWidth: 0,
          color: textColor ?? color.accent.notice.text,
        }}
      >
        {children}
      </span>
    </div>
  );
});
