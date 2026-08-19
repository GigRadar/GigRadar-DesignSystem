import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Avatar } from '../Avatar/Avatar.js';
import { Spinner } from '../Spinner/Spinner.js';
import { Icon } from '../../icons/Icon.js';
import { IconPlus } from '../../icons/defs.js';

const { addBm } = component.middle;

/** Per-instance overrides for the band's own metrics. */
export type AddBmInfoStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  gap?: CssLength;
  background?: string;
  /** The prompt's text color. */
  textColor?: string;
};

export type AddBmInfoProps = {
  /** The manager being offered — the person the Add button adds to the room. */
  managerName: string;
  /** Their photo. Falls back to initials from `managerName`. */
  managerAvatar?: string;
  /**
   * The prompt. Overridable because the reason for adding a manager differs by
   * plan, but it says the same thing in the common case.
   */
  children?: ReactNode;
  /** The Add button's label. */
  actionLabel?: ReactNode;
  /**
   * Whether the add is in flight. Figma's "Adding" state: the button goes grey,
   * the glyph becomes a spinner, and it stops accepting clicks.
   * @default false
   */
  adding?: boolean;
  /** Whether the manager can be added at all. */
  disabled?: boolean;
  onAdd?: () => void;
} & AddBmInfoStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'children'>;

/**
 * The band offering to add GigRadar's Business Manager to the room.
 *
 * Figma: node 3541:29473 — Default and Adding. It also appears inline in the
 * chat header (node 3994:21968) under the "BM not in this room" toggle, which is
 * the same component on a bordered row; `ChatHeader` composes it rather than
 * redrawing it.
 *
 * `adding` is a prop rather than internal state: whether the add succeeded is
 * known by whatever owns the room, and a spinner that clears itself would
 * clear before the room actually changed.
 */
export const AddBmInfo = forwardRef<HTMLDivElement, AddBmInfoProps>(function AddBmInfo(
  {
    managerName,
    managerAvatar,
    children = 'Add our Business Manager to enable meetings and attachments.',
    actionLabel = 'Add',
    adding = false,
    disabled = false,
    onAdd,
    paddingX,
    paddingY,
    gap,
    background,
    textColor,
    ...rest
  },
  ref,
) {
  const busy = adding || disabled;

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: len(gap) ?? addBm.gap,
        boxSizing: 'border-box',
        paddingLeft: len(paddingX) ?? addBm.paddingX,
        paddingRight: len(paddingX) ?? addBm.paddingX,
        paddingTop: len(paddingY) ?? addBm.paddingY,
        paddingBottom: len(paddingY) ?? addBm.paddingY,
        backgroundColor: background ?? color.main.white,
      }}
      {...rest}
    >
      <span style={{ ...textStyle.sRegular, color: textColor ?? color.badge.foreground }}>
        {children}
      </span>
      {/* The manager's chip. Not a button — it names who is being added, and the
          Add button beside it is the only thing to press. */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          gap: addBm.chipGap,
          paddingLeft: addBm.chipPaddingX,
          paddingRight: addBm.chipPaddingX,
          paddingTop: addBm.chipPaddingY,
          paddingBottom: addBm.chipPaddingY,
          borderRadius: addBm.chipRadius,
          backgroundColor: color.main.white,
        }}
      >
        <Avatar
          size="small"
          diameter={addBm.avatarSize}
          name={managerName}
          src={managerAvatar}
          badge="upworkApi"
        />
        <span
          style={{
            ...textStyle.sMedium,
            color: color.navbar.text2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {managerName}
        </span>
      </span>
      <button
        type="button"
        disabled={busy}
        onClick={onAdd}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          gap: addBm.actionGap,
          paddingLeft: addBm.actionPaddingLeft,
          paddingRight: addBm.actionPaddingRight,
          paddingTop: addBm.actionPaddingY,
          paddingBottom: addBm.actionPaddingY,
          border: 'none',
          borderRadius: addBm.actionRadius,
          backgroundColor: busy ? color.disable.background : color.badge.foreground,
          cursor: busy ? 'default' : 'pointer',
        }}
      >
        {adding ? (
          <Spinner
            size="small"
            diameter={addBm.actionIconSize}
            headColor={color.disable.text}
            bodyColor={color.disable.text}
          />
        ) : (
          <Icon icon={IconPlus} size={addBm.actionIconSize} color={color.main.white} />
        )}
        <span
          style={{
            ...textStyle.sMedium,
            color: busy ? color.disable.text : color.main.white,
            whiteSpace: 'nowrap',
          }}
        >
          {adding ? 'Adding' : actionLabel}
        </span>
      </button>
    </div>
  );
});
