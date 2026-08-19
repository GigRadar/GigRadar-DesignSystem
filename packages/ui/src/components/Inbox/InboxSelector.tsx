import { borderWidth, color, component, shadow, textStyle } from '@gigradar/theme';
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown, IconDropdownArrowUp, IconPlus } from '../../icons/defs.js';
import { Avatar } from '../Avatar/Avatar.js';
import { CounterBadge } from '../Badge/CounterBadge.js';
import { SignalIcon, type ConnectionState } from './ConnectionIndicator.js';

const { inbox } = component;
const { selector, panel } = inbox;

/** The glyph inside the connect-account disc, shared with the panel's rows. */
const panelIconSize = panel.rowIconSize;

/**
 * One connected Upwork account, as the picker lists it.
 *
 * `unread` and `connection` are separate because they answer different
 * questions: how much is waiting, and whether more will arrive.
 */
export type InboxAccount = {
  /** Identifies the account. Returned by `onAccountChange`. */
  id: string;
  /** The account holder's name. */
  name: string;
  /** Photo URL. Falls back to initials from `name`. */
  avatarSrc?: string;
  /** Unread messages on this account. */
  unread?: number;
  /**
   * Whether this account's socket is live. `error` and `offline` gray the row
   * out — its messages are stale, and saying so is more use than hiding it.
   */
  connection?: ConnectionState;
  /**
   * Why the account cannot be used, if it cannot. Replaces the unread count
   * with a "Reconnect" prompt, since a count is meaningless once the token is
   * dead.
   */
  problem?: 'suspended' | 'tokenExpired';
};

/** Per-instance overrides for the picker's own metrics. */
export type InboxSelectorStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  /** Fill of the closed trigger. */
  background?: string;
  /** Border color while open. */
  borderColor?: string;
  /** The account name's color. */
  textColor?: string;
  /** The supporting line's color. */
  descriptionColor?: string;
};

export type InboxSelectorProps = {
  /** The accounts to choose between. */
  accounts?: InboxAccount[];
  /**
   * Which account is showing, by id, or `'all'` for the combined inbox.
   * Controlled. Omit to let the picker track its own selection.
   */
  value?: string;
  /** The starting selection when the picker manages its own state. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /**
   * Whether the dropdown is open. Controlled. Omit to let the picker manage it.
   */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Called when "Connect another account" is picked. The row is only drawn
   * when this is set — there is no point offering it with nothing behind it.
   */
  onConnectAccount?: () => void;
  /** Overrides the label on the combined row. */
  allLabel?: ReactNode;
} & InboxSelectorStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onChange'>;

/** The blue "All" disc that stands in for an avatar on the combined row. */
function AllMark({ size = selector.markSize }: { size?: number }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: color.badge.foreground,
        ...textStyle.sSemibold,
        fontSize: selector.markFontSize,
        color: color.main.white,
      }}
    >
      All
    </span>
  );
}

/** The two-line label used by both the trigger and every row. */
function Label({
  title,
  description,
  align = 'center',
  muted = false,
}: {
  title: ReactNode;
  description: ReactNode;
  align?: CSSProperties['alignItems'];
  muted?: boolean;
}) {
  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: align,
        minWidth: 0,
        opacity: muted ? 0.3 : 1,
      }}
    >
      <span
        style={{
          ...textStyle.mMedium,
          color: color.navbar.text2,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          maxWidth: '100%',
        }}
      >
        {title}
      </span>
      <span style={{ ...textStyle.sRegular, color: color.navbar.text, opacity: inbox.mutedOpacity }}>
        {description}
      </span>
    </span>
  );
}

/**
 * One row in the open dropdown.
 *
 * Exported so a screen can list accounts outside the picker — the Figma file
 * treats it as its own component (node 2138:7095) for that reason.
 */
export type InboxAccountRowProps = {
  /** The account to draw. Omit for the combined "All accounts" row. */
  account?: InboxAccount;
  /** Total accounts, shown on the combined row. */
  accountCount?: number;
  selected?: boolean;
  onSelect?: () => void;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'onSelect'>;

export const InboxAccountRow = forwardRef<HTMLButtonElement, InboxAccountRowProps>(
  function InboxAccountRow({ account, accountCount = 0, selected = false, onSelect, ...rest }, ref) {
    const [hover, setHover] = useState(false);
    // A dead account is still listed, but nothing about it is actionable
    // except reconnecting — so the row reads as disabled and the count goes.
    const broken = account?.problem != null;

    return (
      <button
        ref={ref}
        type="button"
        role="option"
        aria-selected={selected}
        onClick={onSelect}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: selector.itemGap,
          width: '100%',
          boxSizing: 'border-box',
          padding: `${selector.itemPaddingY}px ${selector.itemPaddingX}px`,
          borderRadius: selector.itemRadius,
          border: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          font: 'inherit',
          backgroundColor: selected || hover ? color.navbar.hover : color.main.white,
        }}
        {...rest}
      >
        {account ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: selector.itemGap, flexShrink: 0 }}>
            <Avatar size="medium" name={account.name} src={account.avatarSrc} badge="gigradar" />
            {/* The signal sits with the avatar rather than the count: it
                qualifies who this is, not how much is waiting. */}
            {account.connection && account.connection !== 'online' && (
              <SignalIcon state={account.connection} />
            )}
          </span>
        ) : (
          <AllMark />
        )}

        <span style={{ flex: 1, minWidth: 0, display: 'flex' }}>
          <Label
            align="flex-start"
            muted={broken}
            title={account ? account.name : 'All accounts'}
            description={
              account
                ? account.problem === 'suspended'
                  ? 'Suspended'
                  : account.problem === 'tokenExpired'
                    ? 'Token Expired'
                    : `${account.unread ?? 0} new messages`
                : `${accountCount} accounts connected`
            }
          />
        </span>

        {broken ? (
          <span
            style={{
              ...textStyle.sRegular,
              color: color.main.white,
              backgroundColor: color.navbar.text,
              borderRadius: selector.counterRadius,
              padding: `${selector.promptPaddingY}px ${selector.promptPaddingX}px`,
              flexShrink: 0,
            }}
          >
            Reconnect
          </span>
        ) : (
          (account?.unread ?? 0) > 0 && <CounterBadge count={account?.unread} label="unread messages" />
        )}
      </button>
    );
  },
);

/**
 * The account picker above the room list.
 *
 * Figma: trigger at node 2138:6491, dropdown at 2138:6490, rows at 2138:7095.
 *
 * The combined "All accounts" view is a real option rather than the absence of
 * a filter, which is why it appears in the list alongside the accounts: reading
 * every inbox at once is the common case, and it should be as easy to return
 * to as any single account.
 */
export const InboxSelector = forwardRef<HTMLDivElement, InboxSelectorProps>(function InboxSelector(
  {
    accounts = [],
    value,
    defaultValue = 'all',
    onValueChange,
    open,
    onOpenChange,
    onConnectAccount,
    allLabel,
    radius,
    padding,
    background,
    borderColor,
    textColor,
    descriptionColor,
    ...rest
  },
  ref,
) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [connectHovered, setConnectHovered] = useState(false);
  const wrapper = useRef<HTMLDivElement>(null);

  const selected = value ?? uncontrolledValue;
  const isOpen = open ?? uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const pick = (next: string) => {
    if (value === undefined) setUncontrolledValue(next);
    onValueChange?.(next);
    setOpen(false);
  };

  // A dropdown that only closes by picking something traps anyone who opened
  // it to look. Escape and an outside click both let them back out.
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const onPointer = (event: MouseEvent) => {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onPointer);
    };
  }, [isOpen]);

  const account = accounts.find((item) => item.id === selected);
  const isAll = account == null;

  return (
    <div
      ref={wrapper}
      style={{ position: 'relative', width: '100%' }}
      {...(rest as HTMLAttributes<HTMLDivElement>)}
    >
      <div
        ref={ref}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => setOpen(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(!isOpen);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
          width: '100%',
          cursor: 'pointer',
          // The open state trades a pixel of padding for a border, so the
          // control does not grow as it opens. `box-sizing: border-box` on a
          // fixed width would do the same, but the trigger is content-sized.
          padding: len(padding) ?? selector.padding,
          border: `${borderWidth.thin}px solid ${
            isOpen ? borderColor ?? color.badge.foreground : 'transparent'
          }`,
          borderRadius: len(radius) ?? selector.radius,
          backgroundColor: background ?? color.main.backgroundAlt,
        }}
      >
        {isAll ? <AllMark /> : <Avatar size="medium" name={account.name} src={account.avatarSrc} badge="gigradar" />}
        <Label
          title={isAll ? allLabel ?? 'All accounts' : account.name}
          description={
            isAll
              ? `${accounts.length} accounts connected`
              : `${account.unread ?? 0} new messages`
          }
        />
        <Icon
          icon={isOpen ? IconDropdownArrowUp : IconDropdownArrowDown}
          size={selector.chevronSize}
          color={color.navbar.text}
        />
      </div>

      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            top: `calc(100% + ${selector.menuOffset}px)`,
            left: 0,
            right: 0,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: selector.menuGap,
            boxSizing: 'border-box',
            padding: selector.itemPaddingY,
            borderRadius: selector.radius,
            backgroundColor: color.main.white,
            boxShadow: shadow.popup,
            border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
          }}
        >
          <InboxAccountRow
            accountCount={accounts.length}
            selected={isAll}
            onSelect={() => pick('all')}
          />
          {accounts.map((item) => (
            <InboxAccountRow
              key={item.id}
              account={item}
              selected={item.id === selected}
              onSelect={() => pick(item.id)}
            />
          ))}
          {onConnectAccount && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onConnectAccount();
              }}
              onMouseEnter={() => setConnectHovered(true)}
              onMouseLeave={() => setConnectHovered(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: selector.itemGap,
                width: '100%',
                boxSizing: 'border-box',
                padding: `${selector.itemPaddingY}px ${selector.itemPaddingX}px`,
                borderRadius: selector.itemRadius,
                border: 'none',
                // The same nav tint the account rows above it take: it is the
                // last row of that list, not a separate control.
                backgroundColor: connectHovered ? color.navbar.hover : 'transparent',
                cursor: 'pointer',
                font: 'inherit',
                textAlign: 'left',
              }}
            >
              <span
                aria-hidden
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: selector.markSize,
                  height: selector.markSize,
                  borderRadius: '50%',
                  backgroundColor: color.badge.foreground,
                }}
              >
                <Icon icon={IconPlus} size={panelIconSize} color={color.main.white} />
              </span>
              <span style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ ...textStyle.mMedium, color: color.badge.foreground }}>
                  Connect another account
                </span>
                <span style={{ ...textStyle.sRegular, color: color.navbar.text, opacity: inbox.mutedOpacity }}>
                  Unlock more message notifications!
                </span>
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});
