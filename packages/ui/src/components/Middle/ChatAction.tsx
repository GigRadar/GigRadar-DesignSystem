import { color, component, shadow } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconDeleteTrashStroke,
  IconDownloadArrow,
  IconEditPencilArrow,
  IconRescheduleClockArrow,
  IconSendPlaneStroke,
  IconXClose,
} from '../../icons/defs.js';
import type { IconDef } from '../../icons/defs.js';

const { action } = component.middle.bubble;

/** Per-instance overrides for the bar's own metrics. */
export type ChatActionStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  gap?: CssLength;
  background?: string;
  boxShadow?: string;
};

export type ChatActionProps = {
  /** Edit the message. Omitted, the control is not drawn. */
  onEdit?: () => void;
  /** Delete the message — the one destructive control, drawn in the error red. */
  onDelete?: () => void;
  /** Download the file. Only an attachment or picture bubble offers this. */
  onDownload?: () => void;
  /** Send a scheduled message now, rather than waiting for its slot. */
  onSendNow?: () => void;
  /** Move a scheduled message to a different slot. */
  onReschedule?: () => void;
  /** Cancel a scheduled message, or deny a proposal. */
  onCancel?: () => void;
} & ChatActionStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One round control in the bar.
 *
 * Hovering fills the disc rather than changing the glyph — Figma nodes
 * 3523:40608 and 3523:40612. The destructive controls take the error wash and
 * everything else the nav hover, so the colour that appears under the pointer is
 * the same one that names what the control does.
 */
function ActionButton({
  icon,
  label,
  tone,
  hoverFill,
  onClick,
}: {
  icon: IconDef;
  label: string;
  tone: string;
  hoverFill: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: action.buttonSize,
        height: action.buttonSize,
        padding: 0,
        border: 'none',
        borderRadius: action.radius,
        backgroundColor: hovered ? hoverFill : color.main.white,
        cursor: 'pointer',
      }}
    >
      <Icon icon={icon} size={action.iconSize} color={tone} />
    </button>
  );
}

/**
 * The controls that appear on a message when it is hovered.
 *
 * Figma: node 3518:21085. Which controls appear is decided by which handlers are
 * passed rather than by a `variant`: a scheduled attachment can be downloaded,
 * rescheduled, and cancelled all at once, and a fixed set of variants would have
 * to name every combination the product turns out to need.
 *
 * Delete and cancel take the error red; everything else is the quiet nav text.
 * Only one control in the bar destroys anything, and it should not be reachable
 * by muscle memory alone.
 */
export const ChatAction = forwardRef<HTMLDivElement, ChatActionProps>(function ChatAction(
  {
    onEdit,
    onDelete,
    onDownload,
    onSendNow,
    onReschedule,
    onCancel,
    radius,
    padding,
    gap,
    background,
    boxShadow,
    ...rest
  },
  ref,
) {
  const quiet = color.navbar.text;
  const danger = color.status.error.main;
  const quietHover = color.navbar.hover;
  const dangerHover = color.status.error.hover;

  return (
    <div
      ref={ref}
      role="toolbar"
      aria-label="Message actions"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: len(gap) ?? action.gap,
        padding: len(padding) ?? action.padding,
        borderRadius: len(radius) ?? action.radius,
        backgroundColor: background ?? color.main.white,
        boxShadow: boxShadow ?? shadow.popup,
      }}
      {...rest}
    >
      {onSendNow && (
        <ActionButton icon={IconSendPlaneStroke} label="Send now" tone={quiet} hoverFill={quietHover} onClick={onSendNow} />
      )}
      {onReschedule && (
        <ActionButton
          icon={IconRescheduleClockArrow}
          label="Reschedule"
          tone={quiet}
          hoverFill={quietHover}
          onClick={onReschedule}
        />
      )}
      {onDownload && (
        <ActionButton icon={IconDownloadArrow} label="Download" tone={quiet} hoverFill={quietHover} onClick={onDownload} />
      )}
      {onEdit && (
        <ActionButton icon={IconEditPencilArrow} label="Edit" tone={quiet} hoverFill={quietHover} onClick={onEdit} />
      )}
      {onDelete && (
        <ActionButton
          icon={IconDeleteTrashStroke}
          label="Delete"
          tone={danger}
          hoverFill={dangerHover}
          onClick={onDelete}
        />
      )}
      {onCancel && (
        <ActionButton icon={IconXClose} label="Cancel" tone={danger} hoverFill={dangerHover} onClick={onCancel} />
      )}
    </div>
  );
});
