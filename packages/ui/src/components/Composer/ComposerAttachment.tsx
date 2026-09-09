import { borderWidth, color, component, radius } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { Spinner } from '../Spinner/Spinner.js';
import { IconNotesDocumentFill, IconXClose } from '../../icons/defs.js';

const { attachment } = component.middle.composer;

/** Per-instance overrides for the chip's own metrics. */
export type ComposerAttachmentStyleProps = {
  background?: string;
  borderColor?: string;
};

export type ComposerAttachmentProps = {
  /**
   * The picture's source. Passing it draws the image chip; without it the chip
   * is a file card, since a picture with nothing to show is just a file.
   */
  src?: string;
  /** The file's name. Truncates — the card is a fixed width. */
  name?: ReactNode;
  /** The file's type, under the name — "PDF". */
  type?: ReactNode;
  /** Removes the attachment before it is sent. */
  onRemove?: () => void;
  /**
   * The file is still being uploaded.
   *
   * Dims the chip and covers it with a spinner, and drops the remove control —
   * an upload in flight has nothing to take back yet. This is the only place a
   * spinner belongs: once the message is sent the bubble in the thread reports
   * delivery with a tick, not with a wait.
   * @default false
   */
  uploading?: boolean;
} & ComposerAttachmentStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One attachment waiting to be sent, drawn inside the composer.
 *
 * Figma: nodes 1595:15215 (image) and 1595:15279 (file), assembled at
 * 5071:26875. One component rather than two — they are the same chip at the same
 * height, and the only difference is whether the thing can show itself.
 *
 * A picture is its own label, so it carries no name; a file has nothing to show,
 * so it carries one. Both stand 72px so a row mixing them reads as one strip
 * rather than as two kinds of thing.
 */
export const ComposerAttachment = forwardRef<HTMLDivElement, ComposerAttachmentProps>(
  function ComposerAttachment(
    {
      src,
      name,
      type,
      onRemove,
      uploading = false,
      background,
      borderColor,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);
    const isImage = src != null;

    return (
      <div
        ref={ref}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          gap: attachment.fileGap,
          width: isImage ? attachment.imageWidth : attachment.fileWidth,
          height: attachment.height,
          paddingLeft: isImage ? 0 : attachment.filePaddingX,
          paddingRight: isImage ? 0 : attachment.filePaddingX,
          paddingTop: isImage ? 0 : attachment.filePaddingY,
          paddingBottom: isImage ? 0 : attachment.filePaddingY,
          borderRadius: attachment.radius,
          border: `${attachment.borderWidth}px solid ${borderColor ?? color.navbar.border}`,
          backgroundColor: background ?? color.main.white,
          overflow: 'hidden',
        }}
        {...rest}
      >
        {isImage ? (
          <img
            src={src}
            alt={typeof name === 'string' ? name : ''}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <>
            <Icon
              icon={IconNotesDocumentFill}
              size={attachment.fileIconSize}
              color={color.badge.foreground}
            />
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minWidth: 0,
                color: color.main.description,
              }}
            >
              <span
                style={{
                  fontSize: attachment.fileNameSize,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </span>
              {type != null && <span style={{ fontSize: attachment.fileTypeSize }}>{type}</span>}
            </span>
          </>
        )}

        {/* The remove control appears on hover rather than sitting there: an
            attachment that is about to be sent is the normal case, and a
            permanent cross on every chip reads as a warning. */}
        {uploading && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: attachment.uploadingScrim,
            }}
          >
            <Spinner size="small" />
          </span>
        )}

        {onRemove && hovered && !uploading && (
          <button
            type="button"
            aria-label="Remove attachment"
            onClick={onRemove}
            style={{
              position: 'absolute',
              top: attachment.removeOffset,
              right: attachment.removeOffset,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: attachment.removeSize,
              height: attachment.removeSize,
              padding: 0,
              border: `${borderWidth.thin}px solid ${color.main.white}`,
              borderRadius: radius.round,
              backgroundColor: color.main.black,
              cursor: 'pointer',
            }}
          >
            <Icon icon={IconXClose} size={10} color={color.main.white} />
          </button>
        )}
      </div>
    );
  },
);
