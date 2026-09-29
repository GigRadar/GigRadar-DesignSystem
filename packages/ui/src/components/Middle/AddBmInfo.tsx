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
  /**
   * The manager being offered — the person the button adds to the room, or the
   * one the new room is created with.
   *
   * Omit it when there is nobody to offer: a team with no Business Manager
   * connected. The chip is dropped rather than drawn empty, and the prompt is
   * what says why the button cannot run.
   */
  managerName?: string;
  /** Their photo. Falls back to initials from `managerName`. */
  managerAvatar?: string;
  /**
   * The prompt. Overridable because the reason for adding a manager differs by
   * plan, but it says the same thing in the common case.
   */
  children?: ReactNode;
  /** The button's label. "Create BM room" for a one-to-one room. */
  actionLabel?: ReactNode;
  /**
   * The button's label while `adding`. A one-to-one room is not adding anyone —
   * it is creating a new room — so it passes "Creating".
   * @default 'Adding'
   *
   * @experimental In development (BF-3481): may change in a minor release before the design is signed off.
   */
  busyLabel?: ReactNode;
  /**
   * Whether the add is in flight. Figma's "Adding" state: the button goes grey,
   * the glyph becomes a spinner, and it stops accepting clicks.
   * @default false
   */
  adding?: boolean;
  /** Whether the manager can be added at all. */
  disabled?: boolean;
  onAdd?: () => void;
  /**
   * The narrow layout — what the mobile header draws.
   *
   * At 402px the prompt, the manager's name, and the button do not fit at their
   * natural widths, and the row was letting the button shrink rather than the
   * text. Compact truncates the prompt instead, and shortens the manager to
   * their first name, so the one thing that must stay pressable does.
   * @default false
   */
  compact?: boolean;
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
 * The same band carries a one-to-one room's offer to start a Business Manager
 * room (BF-3481): `actionLabel="Create BM room"`, `busyLabel="Creating"`, and no
 * `managerName` when the team has nobody to create it with.
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
    busyLabel = 'Adding',
    adding = false,
    disabled = false,
    onAdd,
    compact = false,
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
      {/* The prompt is what gives way when the row runs out of room: it explains
          the offer, but the manager's name and the button are the offer itself. */}
      <span
        style={{
          ...textStyle.sRegular,
          color: textColor ?? color.badge.foreground,
          minWidth: 0,
          ...(compact
            ? { flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
            : null),
        }}
      >
        {children}
      </span>
      {/* The manager's chip. Not a button — it names who is being added, and the
          Add button beside it is the only thing to press. */}
      {managerName != null && (
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
          {/* Compact keeps only the first name. The avatar beside it already
              identifies the person, and a surname truncated to "Maria Ovcha…"
              spends the room without adding anything the reader can use. The full
              name stays as the title, so it is still reachable. */}
          <span
            title={compact ? managerName : undefined}
            style={{
              ...textStyle.sMedium,
              color: color.navbar.text2,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: compact ? addBm.compactNameMaxWidth : undefined,
            }}
          >
            {compact ? managerName.split(' ')[0] : managerName}
          </span>
        </span>
      )}
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
          {adding ? busyLabel : actionLabel}
        </span>
      </button>
    </div>
  );
});
