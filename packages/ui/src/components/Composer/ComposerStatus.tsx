import { color, component } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import {
  IconEditPencilArrow,
  IconEyeCrossViewStroke,
  IconEyeViewStroke,
  IconScheduleClockFill,
} from '../../icons/defs.js';

const { status } = component.middle.composer;

/**
 * What the composer is about to do.
 *
 * `message` reaches everyone in the room; `note` is private to the team;
 * `schedule` will be queued rather than sent; `edit` is changing something
 * already sent.
 */
export type ComposerMode = 'message' | 'note' | 'schedule' | 'edit';

/** Per-instance overrides for the badge's own metrics. */
export type ComposerStatusStyleProps = {
  background?: string;
  textColor?: string;
};

export type ComposerStatusProps = {
  /**
   * @default 'message'
   */
  mode?: ComposerMode;
  /** Overrides the wording. Defaults to what the mode means. */
  children?: ReactNode;
  /**
   * Drops the wording and keeps the mark.
   *
   * What mobile draws: the badge sits opposite two tabs in roughly half the
   * width, and "Private to members of your team" is the longest string in the
   * composer. The glyph carries the same distinction — an open eye against a
   * crossed one — and the tab beside it already names the mode.
   * @default false
   */
  compact?: boolean;
} & ComposerStatusStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

// Read by assistive tech but not drawn: the compact badge keeps its wording for
// a screen reader, since the glyph alone does not say "private to your team".
const visuallyHidden = {
  position: 'absolute' as const,
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden' as const,
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap' as const,
  border: 0,
};

/** What each mode says, and the mark that goes with it. */
const modeCopy: Record<ComposerMode, string> = {
  message: 'Visible to all participants',
  note: 'Private to members of your team',
  schedule: 'Schedule message room',
  edit: 'Edit message mode',
};

/**
 * The badge naming who will see what is being written.
 *
 * Figma: node 4189:22033.
 *
 * It states the consequence rather than the mode — "Visible to all
 * participants", not "Message". The tabs above already say which mode is
 * chosen; what the writer needs before pressing send is who ends up reading it,
 * and that is the one thing a mode name does not tell them.
 *
 * Each mode takes the colour it carries elsewhere: the brand for a message,
 * Laziza for a private note, the schedule purple for a queued send.
 */
export const ComposerStatus = forwardRef<HTMLSpanElement, ComposerStatusProps>(
  function ComposerStatus(
    { mode = 'message', children, compact = false, background, textColor, ...rest },
    ref,
  ) {
    const tone =
      textColor ??
      (mode === 'note'
        ? color.accent.laziza.main
        : mode === 'schedule'
          ? color.accent.schedule.main
          : mode === 'edit'
            ? color.disable.text
            : color.badge.foreground);

    const fill =
      background ??
      (mode === 'note'
        ? color.accent.laziza.backgroundStrong
        : mode === 'schedule'
          ? color.accent.schedule.background
          : mode === 'edit'
            ? color.main.background
            : // Figma draws the message wash as the brand at 25% rather than a
              // flat tint, so it sits lighter than the badge background does.
              status.messageBackground);

    const glyph =
      mode === 'note'
        ? IconEyeCrossViewStroke
        : mode === 'schedule'
          ? IconScheduleClockFill
          : mode === 'edit'
            ? IconEditPencilArrow
            : IconEyeViewStroke;

    return (
      <span
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexShrink: 0,
          gap: status.gap,
          // A label-less badge is a disc around its mark, so the side inset
          // drops to the vertical one rather than leaving a stretched pill.
          paddingLeft: compact ? status.paddingY : status.paddingX,
          paddingRight: compact ? status.paddingY : status.paddingX,
          paddingTop: status.paddingY,
          paddingBottom: status.paddingY,
          borderRadius: status.radius,
          backgroundColor: fill,
          fontSize: status.fontSize,
          color: tone,
          whiteSpace: 'nowrap',
        }}
        {...rest}
      >
        {compact ? <span style={visuallyHidden}>{children ?? modeCopy[mode]}</span> : (children ?? modeCopy[mode])}
        <Icon icon={glyph} size={status.iconSize} color={tone} />
      </span>
    );
  },
);
