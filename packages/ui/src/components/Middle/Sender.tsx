import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Avatar, type AvatarProps, type AvatarToneName } from '../Avatar/Avatar.js';
import { Skeleton } from '../Skeleton/Skeleton.js';

const { sender } = component.middle;

/** Per-instance overrides for the row's own metrics. */
export type SenderStyleProps = {
  gap?: CssLength;
  avatarSize?: CssLength;
  textColor?: string;
};

export type SenderProps = {
  /** Who sent it. */
  name?: ReactNode;
  /** Their photo, or a service mark for a system message. */
  avatar?: Pick<AvatarProps, 'src' | 'service' | 'badge'> & { tone?: AvatarToneName };
  /**
   * Whose message it is. `own` mirrors the row — the avatar moves to the
   * trailing edge and the name reads right-to-left — so a thread scans as two
   * columns without either side needing its own component.
   * @default 'other'
   */
  side?: 'own' | 'other';
  /**
   * Badges after the name — who it was sent on behalf of, whether the AI wrote
   * it, when it is scheduled for. Pass `AuthorBadge`s.
   */
  badges?: ReactNode;
  /**
   * Draws the unread rule across the row — "New Message", or "New Comment" on a
   * comment. The rule fills the space the name does not, so it reads as a
   * divider rather than a label.
   */
  divider?: ReactNode;
  /** Tints the divider for a comment, which is amber rather than brand blue. */
  dividerTone?: 'message' | 'comment';
  /**
   * The skeleton drawn while the first page loads.
   * @default false
   */
  loading?: boolean;
} & SenderStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The line above a message naming who sent it.
 *
 * Figma: node 3523:40493, fourteen states.
 *
 * Those fourteen are three independent things Figma had to enumerate: which side
 * the message is on, what kind of sender it is (a person, Upwork, Zoom, the AI),
 * and which badges follow the name. Built as `side` + `avatar` + `badges`, they
 * compose — so "my scheduled message written by the AI" is a combination rather
 * than a fifteenth variant nobody drew.
 */
export const Sender = forwardRef<HTMLDivElement, SenderProps>(function Sender(
  {
    name,
    avatar,
    side = 'other',
    badges,
    divider,
    dividerTone = 'message',
    loading = false,
    gap,
    avatarSize,
    textColor,
    ...rest
  },
  ref,
) {
  const own = side === 'own';
  const size = len(avatarSize) ?? sender.avatarSize;

  if (loading) {
    return (
      <div
        ref={ref}
        style={{ display: 'flex', alignItems: 'center', gap: len(gap) ?? sender.gap }}
        {...rest}
      >
        <Skeleton variant="circle" width={size} height={size} />
        <Skeleton width={sender.loadingWidth} height={sender.loadingHeight} />
      </div>
    );
  }

  const mark = avatar && (
    <Avatar
      size="medium"
      diameter={size}
      name={typeof name === 'string' ? name : undefined}
      src={avatar.src}
      service={avatar.service}
      tone={avatar.tone}
      badge={avatar.badge}
    />
  );

  const label = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: sender.badgeGap,
        minWidth: 0,
        // Own messages read right-to-left, so the badges precede the name in the
        // source and the row reverses them back into place.
        flexDirection: own ? 'row-reverse' : 'row',
      }}
    >
      {name != null && (
        <span
          style={{
            ...textStyle.lMedium,
            color: textColor ?? color.main.black,
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </span>
      )}
      {badges}
    </div>
  );

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: len(gap) ?? sender.gap,
        flexDirection: own ? 'row-reverse' : 'row',
      }}
      {...rest}
    >
      {mark}
      {label}
      {/* The divider takes the leftover width, so the rule runs from the name to
          the far edge of the thread rather than being a fixed length. */}
      {divider != null && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: sender.divider.gap,
            flex: 1,
            minWidth: 0,
            height: sender.divider.height,
            flexDirection: own ? 'row-reverse' : 'row',
          }}
        >
          <span
            aria-hidden
            style={{
              flex: 1,
              minWidth: 0,
              borderTop: `${borderWidth.thin}px solid ${
                dividerTone === 'comment' ? color.accent.laziza.backgroundAlt : color.badge.foreground
              }`,
            }}
          />
          <span
            style={{
              ...textStyle.sSemibold,
              flexShrink: 0,
              fontSize: sender.divider.fontSize,
              color:
                dividerTone === 'comment'
                  ? color.accent.laziza.backgroundAlt
                  : color.badge.foreground,
            }}
          >
            {divider}
          </span>
        </div>
      )}
    </div>
  );
});
