import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Spinner } from '../Spinner/Spinner.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconFailedErrorFill,
  IconImageStroke,
  IconRightArrow,
  IconNotesDocumentFill,
} from '../../icons/defs.js';
import { ChatAction, type ChatActionProps } from './ChatAction.js';
import { withinEditWindow } from './editWindow.js';
import { SendIndicator, type SendState } from './SendIndicator.js';

const { bubble } = component.middle;
const { attachment } = bubble;

/**
 * What was sent.
 *
 * `file` is a document — the name is followed by its type. `picture` is an
 * image, which needs no type line because the glyph already says what it is.
 */
export type AttachmentKind = 'file' | 'picture';

/** Per-instance overrides for the bubble's own metrics. */
export type AttachmentBubbleStyleProps = {
  width?: CssLength;
  radius?: CssLength;
  padding?: CssLength;
  background?: string;
};

export type AttachmentBubbleProps = {
  /** The file's name. Truncates rather than wrapping — the bubble is fixed. */
  name: ReactNode;
  /**
   * The file's type, drawn under the name — "PDF". Ignored for a picture, which
   * does not carry one.
   */
  type?: ReactNode;
  /**
   * @default 'file'
   */
  kind?: AttachmentKind;
  /** The time under the file, and what became of it. */
  time?: ReactNode;
  /**
   * @default 'sent'
   */
  state?: SendState;
  /**
   * The upload did not complete. Washes the bubble red and drops the controls:
   * there is nothing to open, and nothing to download.
   * @default false
   */
  failed?: boolean;
  /** Opens the file. */
  onOpen?: () => void;
  /**
   * The hover controls.
   *
   * `onDownload` is offered on both sides — a file someone sent you is still a
   * file you can keep. `onEdit` and `onDelete` are kept only on your own
   * attachment inside the edit window: see `side` and `sentAt`.
   */
  actions?: ChatActionProps;
  /**
   * Whose attachment it is.
   * @default 'other'
   */
  side?: 'own' | 'other';
  /**
   * When it was sent, as a `Date` or an epoch millisecond count. An hour after
   * sending, Upwork refuses a change or a withdrawal, so the bar keeps only the
   * download. Omitted, the attachment is treated as still editable.
   */
  sentAt?: Date | number;
  /**
   * Rings the bubble in the schedule purple — a file attached to a message that
   * has not gone out yet. Matches `BubbleChat`'s own `scheduled`.
   * @default false
   */
  scheduled?: boolean;
} & AttachmentBubbleStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * A file or a picture in the thread.
 *
 * Figma: nodes 3523:40358 (attachment) and 3523:40410 (picture). One component
 * rather than two: the layout, the states, and the controls are identical, and
 * the only difference is which glyph leads and whether a type line follows.
 *
 * Fixed at 258px rather than sized by the filename. A column of attachments
 * whose widths follow their names reads as ragged noise, so the name truncates
 * and the bubble holds its shape.
 */
export const AttachmentBubble = forwardRef<HTMLDivElement, AttachmentBubbleProps>(
  function AttachmentBubble(
    {
      name,
      type,
      kind = 'file',
      time,
      state = 'sent',
      failed = false,
      onOpen,
      actions,
      side = 'other',
      sentAt,
      scheduled = false,
      width,
      radius,
      padding,
      background,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);
    const [openHovered, setOpenHovered] = useState(false);
    // The file can always be kept; changing or withdrawing it is yours to do,
    // and only for an hour. Same rule as `BubbleChat`, applied to the same two
    // controls.
    // Same rule as the message bubble: a queued file is still ours to change.
    const editable = side === 'own' && (scheduled || withinEditWindow(sentAt));
    const allowed = actions && {
      onDownload: actions.onDownload,
      ...(editable ? { onEdit: actions.onEdit, onDelete: actions.onDelete } : null),
      // Same rule as the message bubble: only a queued file can be sent early
      // or moved to another slot.
      ...(scheduled
        ? { onSendNow: actions.onSendNow, onReschedule: actions.onReschedule }
        : null),
    };
    const showActions =
      Boolean(allowed && Object.values(allowed).some(Boolean)) && hovered && !failed;
    // A failed upload has no target to open.
    const quiet = failed;

    const tone = failed ? color.status.error.main : color.main.description;

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
          width: len(width) ?? attachment.width,
          padding: len(padding) ?? bubble.padding,
          borderRadius: len(radius) ?? bubble.radius,
          backgroundColor:
            background ??
            (hovered && !failed ? color.navbar.hover : color.main.white),
          // Figma layers a 15% red over white rather than tinting the surface
          // flat. Kept as a layer so the wash composites the same way over
          // whatever the bubble's own fill turns out to be.
          backgroundImage: failed
            ? `linear-gradient(${attachment.failedTint}, ${attachment.failedTint})`
            : undefined,
          // The queued ring, drawn the same way the message bubble draws it.
          border: scheduled
            ? `${borderWidth.medium}px solid ${color.accent.schedule.main}`
            : undefined,
          // Matches the message bubble's fade, so a run of files and messages
          // responds the same way under the pointer.
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: attachment.gap,
            width: '100%',
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: attachment.markGap,
              flex: 1,
              minWidth: 0,
            }}
          >
            <Icon
              icon={kind === 'picture' ? IconImageStroke : IconNotesDocumentFill}
              size={attachment.markSize}
              color={quiet ? tone : color.badge.foreground}
            />
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
              <span
                style={{
                  ...textStyle.mRegular,
                  color: tone,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </span>
              {kind === 'file' && type != null && (
                <span style={{ fontSize: attachment.typeFontSize, color: tone }}>{type}</span>
              )}
            </div>
          </div>

          {/* The trailing affordance reports the file's own state: an arrow to
              open it, a spinner while it uploads, an error mark if it did not.
              All three are drawn at one size, so the row's height and the
              filename's width do not shift as an upload progresses. */}
          {failed ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: attachment.actionSize,
                height: attachment.actionSize,
              }}
            >
              <Icon
                icon={IconFailedErrorFill}
                size={attachment.actionSize}
                color={color.status.error.main}
              />
            </span>
          ) : (
            <button
              type="button"
              aria-label="Open file"
              onClick={onOpen}
              onMouseEnter={() => setOpenHovered(true)}
              onMouseLeave={() => setOpenHovered(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: attachment.actionSize,
                height: attachment.actionSize,
                padding: 0,
                border: 'none',
                borderRadius: bubble.action.radius,
                // The disc carries the state, not the arrow: it goes from the
                // disabled grey to the brand on hover while the mark stays white
                // throughout, so the control reads as one object waking up
                // rather than as a glyph changing colour.
                backgroundColor: openHovered
                  ? color.main.brand
                  : color.disable.backgroundAlt,
                cursor: 'pointer',
                transition: 'background-color 120ms ease',
              }}
            >
              {/* The arrow turns toward the upper-right on hover — the direction
                  the file opens in. Rotating rather than swapping the glyph keeps
                  the motion continuous instead of reading as two icons.
                  -45° from a right-pointing arrow, since negative is
                  anticlockwise and the glyph starts horizontal. */}
              <span
                style={{
                  display: 'inline-flex',
                  transform: openHovered ? 'rotate(-45deg)' : undefined,
                  transition: 'transform 120ms ease',
                }}
              >
                <Icon
                  icon={IconRightArrow}
                  size={attachment.actionIconSize}
                  color={color.main.white}
                />
              </span>
            </button>
          )}
        </div>

        {time != null && !failed && (
          <SendIndicator time={time} state={state} />
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
  },
);
