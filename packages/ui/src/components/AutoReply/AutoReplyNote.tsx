import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconIndicatorUpFill, type IconDef } from '../../icons/defs.js';

const { autoReply } = component;

export type AutoReplyNoteProps = {
  /** The line. One sentence: what the open mode does, and where its result shows up. */
  children: ReactNode;
  /** A glyph ahead of the line. Omit for a plain note. */
  icon?: IconDef;
  /** The glyph's color. Defaults to the text color. */
  iconColor?: string;
  /** The text color. */
  textColor?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

/**
 * One line under the Auto Reply mode row — BF-4113.
 *
 * Says what the selected mode does once it is on and where the result shows
 * up ("Nothing sends until you press Send in the Inbox"). It changes with the
 * mode rather than sitting in each option: an option's description is one
 * truncated line on a desktop and is dropped on a phone, which is where a mode
 * most needs explaining.
 *
 * Pass it in `AutoReply`'s `details` slot.
 */
export const AutoReplyNote = forwardRef<HTMLDivElement, AutoReplyNoteProps>(function AutoReplyNote(
  { children, icon, iconColor, textColor, ...rest },
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: autoReply.details.noteGap,
        ...typography.textStyle.mRegular,
        fontFamily: typography.fontFamily.base,
        color: textColor ?? color.main.description,
      }}
    >
      {icon && (
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            flexShrink: 0,
            // Centres the glyph on the first line rather than the block.
            height: `${typography.textStyle.mRegular.lineHeight}em`,
            alignItems: 'center',
            color: iconColor ?? 'currentColor',
          }}
        >
          <Icon icon={icon} size={autoReply.details.noteIconSize} />
        </span>
      )}
      <span style={{ minWidth: 0 }}>{children}</span>
    </div>
  );
});

export type ReplyRateStatProps = {
  /** How often clients reply when the AI answers first, in percent. */
  aiRate: number;
  /** How often they reply when a person answers first, in percent. */
  humanRate: number;
  /** The AI's name in the sentence. */
  agentName?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

/**
 * The reply-rate line under the First reply modes — BF-4113.
 *
 * "Clients reply **68% of the time** when Laziza answers first, against 50%
 * when a person does." The AI figure carries the weight and the success color,
 * with an up marker; the human figure stays plain. It is the one number that
 * says why the first reply is worth handing over, so it sits under the modes
 * it argues for rather than in a help page.
 */
export const ReplyRateStat = forwardRef<HTMLDivElement, ReplyRateStatProps>(function ReplyRateStat(
  { aiRate, humanRate, agentName = 'Laziza', ...rest },
  ref,
) {
  return (
    <AutoReplyNote
      {...rest}
      ref={ref}
      icon={IconIndicatorUpFill}
      iconColor={color.status.success.main}
    >
      Clients reply{' '}
      <strong style={{ ...typography.textStyle.mSemibold, color: color.status.success.text }}>
        {aiRate}% of the time
      </strong>{' '}
      when {agentName} answers first, against {humanRate}% when a person does.
    </AutoReplyNote>
  );
});
