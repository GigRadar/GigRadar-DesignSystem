import { color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconLockFill, IconPlus } from '../../icons/defs.js';
import { Avatar } from '../Avatar/Avatar.js';
import { StatusBadge, type StatusTone } from '../Badge/StatusBadge.js';
import { Checkbox } from '../Checkbox/Checkbox.js';

const { upworkAccounts } = component;

/**
 * What a slot in the account grid is showing.
 *
 * `account` is a connected account. The other three are all empty slots that
 * differ by what the user can do with them: `authorize` is the next slot they
 * can fill, `available` is a slot beyond that one, and `upgrade` is past the
 * plan's limit. Splitting them keeps the click target honest — only `authorize`
 * and `upgrade` do anything.
 */
export type AccountSlotVariant = 'account' | 'authorize' | 'available' | 'upgrade';

/** Per-instance overrides for the card's own metrics. */
export type AccountCardStyleProps = {
  /** Corner radius. */
  radius?: CssLength;
  /** Padding on all sides. */
  padding?: CssLength;
  /** Border thickness. */
  borderWidth?: CssLength;
  /** Space between the avatar and the text stack. */
  gap?: CssLength;
  /** Name type size. */
  fontSize?: CssLength;
  /** Minimum height. Keeps a row of empty slots level. */
  minHeight?: CssLength;
  /** Fill. */
  background?: string;
  /** Border color. */
  borderColor?: string;
  /** Name color. */
  textColor?: string;
};

export type AccountCardProps = {
  /**
   * Which of the four slots to draw.
   *
   * @default 'account'
   */
  variant?: AccountSlotVariant;
  /** The account holder's name. */
  name?: string;
  /** Their profile photo. Falls back to initials derived from `name`. */
  avatarSrc?: string;
  /** The connection state, drawn as the pill under the name. */
  status?: StatusTone;
  /** Overrides the status pill's label. */
  statusLabel?: ReactNode;
  /**
   * Overrides the label on an empty slot. Each variant has its own default —
   * "Authorize Account", "Available Slot", "Upgrade to unlock more".
   */
  label?: ReactNode;
  /**
   * Whether the account is ticked. Only an `account` slot draws a checkbox;
   * omitting this prop drops it entirely, which is what an unselectable list
   * wants.
   */
  selected?: boolean;
  /** Called when the checkbox is toggled. */
  onSelectedChange?: (selected: boolean) => void;
  /**
   * Makes the whole card a button. Empty `authorize` and `upgrade` slots are
   * clickable in the design; an `available` slot is not.
   */
  onClick?: () => void;
  /** Dims the card and blocks interaction. */
  disabled?: boolean;
  /**
   * Replaces the avatar on an `account` slot, keeping the row's layout.
   *
   * `muted` is already resolved from the suspended state, so a replacement
   * does not have to re-derive which accounts are drawn greyed.
   *
   * Call `defaultRender()` to wrap rather than replace.
   */
  renderAvatar?: RenderProp<AccountAvatarRenderProps>;
  /**
   * Replaces the status pill under the name.
   *
   * The usual reason is a status that has to carry more than a tone — a
   * reconnect link on a suspended account, a tooltip explaining a limit.
   */
  renderStatus?: RenderProp<AccountStatusRenderProps>;
  /**
   * Replaces the selection checkbox. Not called when `selected` is undefined,
   * since an unselectable list draws no checkbox at all.
   *
   * `toggle` reports through `onSelectedChange`, so a replacement keeps the
   * card's contract with the grid above it.
   */
  renderSelection?: RenderProp<AccountSelectionRenderProps>;
  /**
   * Replaces the icon and label of the three empty slots. Not called on an
   * `account` slot.
   *
   * `label` arrives resolved against the per-variant defaults, and `isAction`
   * says whether this slot does anything when clicked.
   */
  renderEmptyContent?: RenderProp<AccountEmptyRenderProps>;
} & AccountCardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onClick'>;

/** What a `renderAvatar` function receives — the head of an account slot. */
export type AccountAvatarRenderProps = WithDefaultRender & {
  /** The account holder's name, as passed. */
  name?: string;
  /** Their photo, as passed. Not drawn while `muted`. */
  avatarSrc?: string;
  /** True on a suspended account, which is drawn greyed with a placeholder. */
  muted: boolean;
};

/** What a `renderStatus` function receives — the pill under the name. */
export type AccountStatusRenderProps = WithDefaultRender & {
  /** The connection state the pill is drawing. */
  status: StatusTone;
  /** The pill's label override, if the caller passed one. */
  statusLabel: ReactNode;
  /** True on a suspended account. */
  muted: boolean;
};

/** What a `renderSelection` function receives — the card's trailing checkbox. */
export type AccountSelectionRenderProps = WithDefaultRender & {
  /** Whether the account is ticked. */
  selected: boolean;
  /** Whether the whole card is blocked. */
  disabled: boolean;
  /** The account holder's name, which names the control for a screen reader. */
  name?: string;
  /** Reports a new selection through `onSelectedChange`. */
  toggle: (next: boolean) => void;
};

/** What a `renderEmptyContent` function receives — the body of an empty slot. */
export type AccountEmptyRenderProps = WithDefaultRender & {
  /** Which empty slot this is. Never `account`. */
  variant: Exclude<AccountSlotVariant, 'account'>;
  /** The label, resolved against the per-variant default. */
  label: ReactNode;
  /** True for `authorize` and `upgrade` — the two slots that do something. */
  isAction: boolean;
  /** Whether the card is actually taking clicks right now. */
  clickable: boolean;
};

/** The default label per empty variant. */
const emptyLabels: Record<Exclude<AccountSlotVariant, 'account'>, string> = {
  authorize: 'Authorize Account',
  available: 'Available Slot',
  upgrade: 'Upgrade to unlock more',
};

/**
 * A slot in the connected-account grid — Figma's "Container" component
 * (node 2117:9909), which draws all four variants.
 *
 * The variants share one box and differ only in border and fill: a connected
 * account gets a solid pale-blue edge on white, an available slot a dashed
 * grey edge on nothing, and the two action slots a dashed brand edge on the
 * badge blue. That is why they are one component rather than four — the
 * difference between them is a palette and a label, not a shape.
 *
 * A suspended account is drawn greyed: Figma dims the name to the disabled
 * grey and swaps the avatar for the placeholder, since the account is present
 * but unusable.
 */
export const AccountCard = forwardRef<HTMLDivElement, AccountCardProps>(function AccountCard(
  {
    variant = 'account',
    name,
    avatarSrc,
    status = 'active',
    statusLabel,
    label,
    selected,
    onSelectedChange,
    onClick,
    disabled = false,
    renderAvatar,
    renderStatus,
    renderSelection,
    renderEmptyContent,
    radius,
    padding,
    borderWidth,
    gap,
    fontSize,
    minHeight,
    background,
    borderColor,
    textColor,
    onPointerEnter,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);

  const isAccount = variant === 'account';
  const isAction = variant === 'authorize' || variant === 'upgrade';
  // Only the action slots respond to a click; an available slot is inert even
  // if a handler is passed, which keeps the design's affordance honest.
  const clickable = !disabled && isAction && onClick != null;

  // A suspended account is drawn as present-but-unusable: Figma greys the name
  // and drops the avatar to the placeholder, so the row still reads as an
  // account rather than as an empty slot.
  const muted = isAccount && status === 'suspended';

  const resolvedBackground =
    background ??
    (isAction ? color.badge.background : isAccount ? color.main.white : 'transparent');

  const resolvedBorderColor =
    borderColor ??
    (isAction ? color.main.brand : isAccount ? color.navbar.disabledBackground : color.navbar.border);

  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: isAccount ? 'flex-start' : 'center',
    gap: len(gap) ?? `${upworkAccounts.card.gap}px`,
    width: '100%',
    minHeight: len(minHeight) ?? `${upworkAccounts.card.minHeight}px`,
    padding: len(padding) ?? `${upworkAccounts.card.padding}px`,
    borderRadius: len(radius) ?? `${upworkAccounts.card.radius}px`,
    // Dashed on every empty slot, solid on a filled one — the border alone is
    // what separates "an account is here" from "one could be".
    border: `${len(borderWidth) ?? `${upworkAccounts.card.borderWidth}px`} ${
      isAccount ? 'solid' : 'dashed'
    } ${resolvedBorderColor}`,
    backgroundColor: resolvedBackground,
    fontFamily: typography.fontFamily.base,
    textAlign: 'left',
    cursor: clickable ? 'pointer' : 'default',
    opacity: disabled ? 0.5 : 1,
    transition: 'background-color 120ms ease, border-color 120ms ease',
    ...(clickable && hovered ? { borderStyle: 'solid' } : null),
  };

  const defaultAvatar = () => (
    <Avatar
      size="medium"
      name={name}
      src={muted ? undefined : avatarSrc}
      type={muted ? 'placeholder' : undefined}
    />
  );

  const defaultStatus = () => <StatusBadge tone={status}>{statusLabel}</StatusBadge>;

  // Takes the tick as an argument rather than closing over `selected`, so the
  // call site's `selected !== undefined` guard is what narrows it — the
  // checkbox is only ever drawn on a list that can be selected.
  const defaultSelection = (checked: boolean) => () => (
    <Checkbox
      checked={checked}
      disabled={disabled}
      label={name ? `Select ${name}` : 'Select account'}
      onCheckedChange={(next) => onSelectedChange?.(next)}
    />
  );

  const defaultEmptyContent = () => (
    <>
      {isAction && (
        <span
          style={{
            display: 'inline-flex',
            flexShrink: 0,
            width: upworkAccounts.card.iconSize,
            height: upworkAccounts.card.iconSize,
            color: color.main.brand,
          }}
        >
          <Icon icon={variant === 'upgrade' ? IconLockFill : IconPlus} size="100%" />
        </span>
      )}
      <span
        style={{
          ...typography.textStyle.mMedium,
          color: textColor ?? (isAction ? color.main.brand : color.navbar.text),
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label ?? emptyLabels[variant as Exclude<AccountSlotVariant, 'account'>]}
      </span>
    </>
  );

  const content = isAccount ? (
    <>
      <div style={{ display: 'flex', flex: '1 1 auto', minWidth: 0, gap: upworkAccounts.card.gap }}>
        {renderAvatar
          ? renderAvatar({ name, avatarSrc, muted, defaultRender: defaultAvatar })
          : defaultAvatar()}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: upworkAccounts.card.textGap,
            flex: '1 1 auto',
            minWidth: 0,
          }}
        >
          <span
            style={{
              ...typography.textStyle.mMedium,
              color: textColor ?? (muted ? color.disable.text : color.navbar.textActive),
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
          {renderStatus
            ? renderStatus({ status, statusLabel, muted, defaultRender: defaultStatus })
            : defaultStatus()}
        </div>
      </div>
      {selected !== undefined &&
        (renderSelection
          ? renderSelection({
              selected,
              disabled,
              name,
              toggle: (next) => onSelectedChange?.(next),
              defaultRender: defaultSelection(selected),
            })
          : defaultSelection(selected)())}
    </>
  ) : renderEmptyContent ? (
    renderEmptyContent({
      variant: variant as Exclude<AccountSlotVariant, 'account'>,
      label: label ?? emptyLabels[variant as Exclude<AccountSlotVariant, 'account'>],
      isAction,
      clickable,
      defaultRender: defaultEmptyContent,
    })
  ) : (
    defaultEmptyContent()
  );

  return (
    <div
      {...rest}
      ref={ref}
      style={style}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              // A div with a button role has to bring its own keyboard
              // activation — Enter and Space are what a real button responds to.
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      onPointerEnter={(event) => {
        setHovered(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setHovered(false);
        onPointerLeave?.(event);
      }}
    >
      {content}
    </div>
  );
});
