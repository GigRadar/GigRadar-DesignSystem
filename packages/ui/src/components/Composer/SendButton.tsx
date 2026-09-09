import { color, component } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconScheduleClockFill, IconSendPlaneFill } from '../../icons/defs.js';

const { sendButton } = component.middle.composer;

/**
 * What pressing it does.
 *
 * `send` posts the message now; `schedule` queues it for a slot chosen
 * elsewhere. The same control in two colours — the purple is the one that names
 * scheduled messages everywhere else in the product.
 */
export type SendAction = 'send' | 'schedule';

/** Per-instance overrides for the button's own metrics. */
export type SendButtonStyleProps = {
  size?: CssLength;
  radius?: CssLength;
  /** The filled background. Defaults to the action's own colour. */
  background?: string;
  iconColor?: string;
};

export type SendButtonProps = {
  /**
   * @default 'send'
   */
  action?: SendAction;
  /**
   * Whether there is anything to send. Empty, the button sits on the page
   * background with a grey glyph; filled, it takes the action's colour.
   * @default false
   */
  filled?: boolean;
  /** Whether the message can be sent at all. */
  disabled?: boolean;
  /** Names the button for assistive tech. Defaults to what the action does. */
  label?: string;
} & SendButtonStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * The composer's send control.
 *
 * Figma: nodes 99:4596 (send) and 2022:6907 (schedule). One component rather
 * than two — the shape, the size, and the four states are identical, and only
 * the glyph and the filled colour differ.
 *
 * `filled` is passed rather than derived from whether the field has text: the
 * composer owns the draft, and a button that inspected it would need to know
 * about attachments, mentions, and edits to get the answer right.
 */
export const SendButton = forwardRef<HTMLButtonElement, SendButtonProps>(function SendButton(
  {
    action = 'send',
    filled = false,
    disabled = false,
    label,
    size,
    radius,
    background,
    iconColor,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);
  const schedule = action === 'schedule';
  const accent = schedule ? color.accent.schedule.main : color.main.brand;
  const accentHover = schedule ? color.accent.schedule.hover : color.badge.hover;

  // Four fills across Figma's four states (nodes 99:4596 and 2022:6907):
  // disabled greys out; filled takes the action's colour and deepens to its
  // hover under the pointer; empty sits on the page background and tints.
  const surface = disabled
    ? color.disable.background
    : filled
      ? hovered
        ? accentHover
        : accent
      : hovered
        ? color.navbar.hover
        : color.main.background;

  // At rest the glyph is the disabled grey, the same tone the toolbar controls
  // carry: an empty composer has nothing to send, and the button says so by
  // matching the row of controls beside it rather than standing out from them.
  const glyph = filled ? color.main.white : color.disable.text;

  return (
    <button
      ref={ref}
      type="button"
      aria-label={label ?? (action === 'schedule' ? 'Schedule message' : 'Send message')}
      disabled={disabled}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onMouseLeave?.(event);
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxSizing: 'border-box',
        // Square at every size: `size` drives both edges, so the button is a
        // circle whatever it is set to. The composer measures its field and
        // passes the size that fills it, rather than the button growing itself —
        // a flexed height cannot pull a width after it, and `aspectRatio` loses
        // to the flex basis that set the height in the first place.
        width: len(size) ?? sendButton.size,
        height: len(size) ?? sendButton.size,
        padding: sendButton.padding,
        border: 'none',
        borderRadius: len(radius) ?? sendButton.radius,
        backgroundColor: background ?? surface,
        cursor: disabled ? 'default' : 'pointer',
        transition: 'background-color 120ms ease',
      }}
      {...rest}
    >
      <Icon
        icon={action === 'schedule' ? IconScheduleClockFill : IconSendPlaneFill}
        size={sendButton.iconSize}
        color={iconColor ?? glyph}
      />
    </button>
  );
});
