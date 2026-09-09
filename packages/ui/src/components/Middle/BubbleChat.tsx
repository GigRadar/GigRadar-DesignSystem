import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconLockFill } from '../../icons/defs.js';
import { ChatAction, type ChatActionProps } from './ChatAction.js';
import { withinEditWindow } from './editWindow.js';
import { SendIndicator, type SendState } from './SendIndicator.js';

const { bubble } = component.middle;

/**
 * Which surface the bubble is drawn on.
 *
 * `message` is an ordinary message. `comment` is an internal note — visible to
 * the team, never sent to the client — and takes the Laziza wash so the
 * difference is impossible to miss at a glance. `system` is the room telling you
 * something, rather than a person.
 */
export type BubbleTone = 'message' | 'comment' | 'system';

/** Per-instance overrides for the bubble's own metrics. */
export type BubbleChatStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  maxWidth?: CssLength;
  background?: string;
  textColor?: string;
};

export type BubbleChatProps = {
  /** The message. */
  children?: ReactNode;
  /**
   * Whose message it is. `own` is the sender's, and is what carries a delivery
   * state and an edit control; `other` is the person they are talking to.
   * @default 'other'
   */
  side?: 'own' | 'other';
  /**
   * @default 'message'
   */
  tone?: BubbleTone;
  /** The time under the message, and what became of it. */
  time?: ReactNode;
  /**
   * @default 'sent'
   */
  state?: SendState;
  /** Whether the message was changed after it was sent. */
  edited?: boolean;
  /**
   * Draws the italic placeholder instead of the message. A deleted message keeps
   * its place in the thread rather than vanishing, so the conversation around it
   * still reads in order.
   * @default false
   */
  deleted?: boolean;
  /** Grays the bubble out — a message that cannot be acted on yet. */
  disabled?: boolean;
  /**
   * A short code chip after the message — the variable a preset filled in.
   */
  code?: ReactNode;
  /**
   * The hover controls. Passing them makes the bubble draw its own action bar on
   * hover; without them it is inert.
   *
   * `onEdit` and `onDelete` are used on your own message inside the edit window —
   * see `sentAt`. `onSendNow` and `onReschedule` are used only while
   * `scheduled`, since a sent message has nowhere left to go. `onDownload` is
   * ignored: a text bubble has no file, and that control belongs to
   * `AttachmentBubble`.
   */
  actions?: ChatActionProps;
  /**
   * When the message was sent, as a `Date` or an epoch millisecond count.
   *
   * Drives the edit window: an hour after sending, Upwork refuses a change or a
   * withdrawal, so the bar stops offering them. Omitted, the message is treated
   * as still editable — a screen that does not track send times gets the
   * controls, which is better than silently hiding them.
   *
   * Ignored while `scheduled`: a queued message has not reached Upwork at all,
   * so nothing has started counting.
   */
  sentAt?: Date | number;
  /**
   * Draws the lock glyph before the message — the room telling you a Business
   * Manager is needed. Only meaningful with `tone="system"`.
   * @default false
   */
  locked?: boolean;
  /**
   * Rings the bubble in the schedule purple — a message written but not yet
   * sent.
   *
   * Figma: node 2077:17400, the scheduled queue. An outline rather than a fill
   * because the bubble still has to read as the message it will become: the
   * queue is the same conversation seen before it happens, and recolouring the
   * surface would make it look like a different kind of thing.
   * @default false
   */
  scheduled?: boolean;
} & BubbleChatStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One message in the thread.
 *
 * Figma: node 3523:40393 — ten states across two axes plus the hover bar.
 *
 * Built as `side` × `tone` × `state` rather than a ten-way union: a comment can
 * be the sender's or the other person's, can be delivered or failed, and every
 * combination occurs. A union would make "my comment that failed to send"
 * unrepresentable while listing three variants that mean parts of it.
 *
 * Hover is tracked in state rather than left to CSS, because the action bar is a
 * real element that has to mount rather than a style that can be toggled — and
 * because it must stay up while the pointer is on the bar itself, which a
 * `:hover` on the bubble alone would not do.
 */
export const BubbleChat = forwardRef<HTMLDivElement, BubbleChatProps>(function BubbleChat(
  {
    children,
    side = 'other',
    tone = 'message',
    time,
    state = 'sent',
    edited = false,
    deleted = false,
    disabled = false,
    code,
    actions,
    sentAt,
    locked = false,
    scheduled = false,
    radius,
    padding,
    maxWidth,
    background,
    textColor,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);

  // What this bubble can actually offer, whatever it was handed.
  //
  // A text bubble has no file, so `onDownload` is dropped on both sides — that
  // control belongs to `AttachmentBubble`. Someone else's message cannot be
  // rewritten or withdrawn, so an incoming bubble keeps nothing at all. And an
  // hour after sending, neither can your own.
  //
  // Filtered here rather than left to each caller because these are rules about
  // the messages themselves: a bar offering a download with no file, or a delete
  // the server will refuse, is lying about what is possible.
  // A queued message has not gone anywhere, so Upwork's edit window does not
  // apply: it is still on our own server, and can be changed or withdrawn right
  // up until it sends.
  const editable = side === 'own' && (scheduled || withinEditWindow(sentAt));
  const allowed =
    actions && editable
      ? {
          onEdit: actions.onEdit,
          onDelete: actions.onDelete,
          // Only a queued message can be sent early or moved to a different
          // slot — a sent one has already gone, and there is no slot left to
          // move. So these two ride along with `scheduled` rather than being
          // offered everywhere and refused most of the time.
          ...(scheduled
            ? { onSendNow: actions.onSendNow, onReschedule: actions.onReschedule }
            : null),
        }
      : undefined;
  const showActions =
    Boolean(allowed && Object.values(allowed).some(Boolean)) && hovered && !disabled && !deleted;
  // A system row is one sentence, so its time sits at the end of that sentence
  // rather than on a line of its own.
  const inlineTime = tone === 'system' && time != null && !deleted;

  const fill =
    background ??
    (disabled
      ? color.disable.background
      : tone === 'comment'
        ? color.accent.laziza.background
        : tone === 'system'
          ? color.navbar.hover
          : // Both sides tint under the pointer. The fill says "this is the
            // message you are pointing at", which is as true of theirs as of
            // yours — what differs is what the hover then offers, and an
            // incoming message answering with nothing is the point.
            hovered
            ? color.navbar.hover
            : color.main.white);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: bubble.gap,
        boxSizing: 'border-box',
        maxWidth: len(maxWidth) ?? bubble.maxWidth,
        padding: len(padding) ?? bubble.padding,
        borderRadius: len(radius) ?? bubble.radius,
        backgroundColor: fill,
        // The ring is the only thing that marks a queued message, so it is drawn
        // even when a caller has overridden the fill.
        border: scheduled
          ? `${borderWidth.medium}px solid ${color.accent.schedule.main}`
          : undefined,
        // The tint fades in rather than snapping, so moving down a thread reads
        // as the pointer passing over messages instead of them flashing.
        transition: 'background-color 120ms ease',
      }}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onMouseLeave?.(event);
      }}
      {...rest}
    >
      {deleted ? (
        <span
          style={{
            ...textStyle.mRegular,
            fontStyle: 'italic',
            color: textColor ?? color.main.description,
            opacity: bubble.deletedOpacity,
            whiteSpace: 'nowrap',
          }}
        >
          This Message was Deleted
        </span>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: bubble.inlineGap,
            width: '100%',
            minWidth: 0,
          }}
        >
          {locked && (
            <Icon
              icon={IconLockFill}
              size={bubble.indicator.iconSize}
              color={color.main.description}
            />
          )}
          <span style={{ ...textStyle.mRegular, color: textColor ?? color.main.description }}>
            {children}
          </span>
          {/* The system row keeps its time on the same line. It is a single
              sentence with no second line to sit under, and dropping the time
              below would leave the bubble twice as tall as the thing it says. */}
          {inlineTime && (
            <span style={{ marginLeft: 'auto', display: 'inline-flex', flexShrink: 0 }}>
              <SendIndicator time={time} state={state} edited={edited} />
            </span>
          )}
          {/* The code chip sits inline with the text rather than under it: it is
              a value inside the sentence, not a block quoted after it. */}
          {code != null && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
                padding: bubble.codePadding,
                borderRadius: bubble.codeRadius,
                backgroundColor: color.navbar.disabledBackground,
                fontFamily: 'Menlo, ui-monospace, monospace',
                fontSize: bubble.codeFontSize,
                color: color.main.description,
              }}
            >
              {code}
            </span>
          )}
        </div>
      )}

      {time != null && !deleted && !inlineTime && (
        <SendIndicator time={time} state={state} edited={edited} />
      )}

      {showActions && allowed && (
        <div
          style={{
            position: 'absolute',
            bottom: bubble.action.offsetBottom,
            left: bubble.action.offsetLeft,
            zIndex: 1,
          }}
        >
          <ChatAction {...allowed} />
        </div>
      )}
    </div>
  );
});
