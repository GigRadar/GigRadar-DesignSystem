import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import {
  IconLazizaSparkleFill,
  IconMeetingsFill,
  IconScheduleClockFill,
} from '../../icons/defs.js';

const { authorBadge } = component.middle;

/**
 * What the badge is reporting.
 *
 * `author` names the person a message was sent on behalf of. `ai` marks it as
 * Laziza's work. `aiActivated` / `aiDeactivated` report someone turning the AI
 * on or off. `meeting` and `schedule` name a proposal and a queued send.
 */
export type AuthorBadgeKind = 'author' | 'ai' | 'aiActivated' | 'aiDeactivated' | 'meeting' | 'schedule';

/** Per-instance overrides for the badge's own metrics. */
export type AuthorBadgeStyleProps = {
  textColor?: string;
  background?: string;
};

export type AuthorBadgeProps = {
  /**
   * @default 'author'
   */
  kind?: AuthorBadgeKind;
  /**
   * The text. Defaults to nothing — every form of this badge names a person or a
   * time the caller has, and there is no sensible placeholder for either.
   */
  children?: ReactNode;
} & AuthorBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * A badge beside the sender's name — who acted, and on whose behalf.
 *
 * Figma: node 3523:40585.
 *
 * The plain forms carry no fill: they are a footnote to the name they follow,
 * and a tint would give them equal weight. `ai`, `meeting`, and `schedule` do
 * take one, because each names a system rather than a person, and the colour is
 * the fastest way to tell a queued send from a proposed call.
 *
 * The Reasoning states Figma files under the same component are not built here —
 * the expanded AI trace is its own component, not a badge.
 */
export const AuthorBadge = forwardRef<HTMLSpanElement, AuthorBadgeProps>(function AuthorBadge(
  { kind = 'author', children, textColor, background, ...rest },
  ref,
) {
  // The three tinted forms. `ai` fills its pill; meeting and schedule carry a
  // filled disc for the mark and leave the pill itself bare.
  const tinted = kind === 'ai';
  const marked = kind === 'meeting' || kind === 'schedule';

  const tone =
    textColor ??
    (kind === 'meeting'
      ? color.accent.meetings.main
      : kind === 'schedule'
        ? color.accent.schedule.main
        : kind === 'ai' || kind === 'aiActivated'
          ? color.accent.laziza.main
          : color.navbar.text);

  const markFill = kind === 'schedule' ? color.accent.schedule.main : color.accent.meetings.main;

  return (
    <span
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        gap: tinted ? authorBadge.tintGap : authorBadge.gap,
        paddingTop: authorBadge.paddingY,
        paddingBottom: authorBadge.paddingY,
        paddingLeft: tinted ? authorBadge.tintPaddingLeft : undefined,
        paddingRight: tinted ? authorBadge.tintPaddingRight : undefined,
        borderRadius: authorBadge.tintRadius,
        backgroundColor: background ?? (tinted ? color.accent.laziza.background : undefined),
      }}
      {...rest}
    >
      {tinted && <Icon icon={IconLazizaSparkleFill} size={authorBadge.iconSize} color={tone} />}
      {/* The mark is a filled disc rather than a bare glyph: at 12px beside grey
          text, an outline would not carry the colour that distinguishes a
          meeting from a scheduled send. */}
      {marked && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: authorBadge.markSize,
            height: authorBadge.markSize,
            borderRadius: authorBadge.tintRadius,
            backgroundColor: markFill,
          }}
        >
          <Icon
            icon={kind === 'schedule' ? IconScheduleClockFill : IconMeetingsFill}
            size={authorBadge.markFontSize}
            color={color.main.white}
          />
        </span>
      )}
      <span
        style={{
          ...textStyle.sRegular,
          color: tone,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </span>
    </span>
  );
});
