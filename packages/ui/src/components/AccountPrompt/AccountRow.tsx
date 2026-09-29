import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown, IconDropdownArrowUp } from '../../icons/defs.js';

const { accountPrompt } = component;

/** Per-instance overrides for the list's own metrics. */
export type AccountListStyleProps = {
  radius?: CssLength;
  borderColor?: string;
};

export type AccountListProps = {
  /** The rows — a stack of `<AccountRow>`. */
  children: ReactNode;
} & AccountListStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The panel the account rows sit in.
 *
 * A bordered card rather than bare rows: the list is one object on a settings
 * page that has other blocks on it, and rows without an edge read as part of
 * whatever is above them.
 */
export const AccountList = forwardRef<HTMLDivElement, AccountListProps>(function AccountList(
  { children, radius: listRadius, borderColor, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: '100%',
        borderRadius: len(listRadius) ?? accountPrompt.radius,
        border: `${borderWidth.thin}px solid ${borderColor ?? color.navbar.border}`,
        backgroundColor: color.main.white,
        overflow: 'hidden',
      }}
      {...rest}
    >
      {children}
    </div>
  );
});

/** Per-instance overrides for a row's own metrics. */
export type AccountRowStyleProps = {
  padding?: CssLength;
  gap?: CssLength;
};

export type AccountRowProps = {
  /** The account's face, name and status — whatever the screen puts in the row. */
  children: ReactNode;
  /**
   * What the row opens: the prompt field, the auto-reply card, whatever this
   * screen is setting per account.
   *
   * A slot rather than a prop per screen: the row's job is which account is
   * being edited, and what "edited" means differs per settings page.
   */
  panel?: ReactNode;
  /** @default false */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Suppresses the divider under the row — for the last one in the list, where
   * the panel's own border already closes the card.
   * @default false
   */
  last?: boolean;
} & AccountRowStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One connected account, and what it opens.
 *
 * BF-4280. A team running several Upwork profiles in unrelated niches needs
 * its AI settings scoped to one profile at a time, and this is the row that
 * scopes them: click an account and its settings unfold directly underneath,
 * so the account being edited stays in view above the field.
 *
 * A list rather than tabs or a side panel. Tabs do not survive fifty accounts —
 * they cannot wrap, and a scrolling strip hides the one being looked for — and
 * a side panel spends width the settings page does not have once it has to
 * stack on a narrow screen. The cost of the list is height: with a long panel
 * open the accounts below are pushed off the fold, which is the accepted trade
 * because the screen is used one account at a time.
 *
 * The whole row is the control rather than a button inside it. A button beside
 * the name implies a second thing to hit, and its label has to change to say
 * what the chevron already says by pointing.
 */
export const AccountRow = forwardRef<HTMLDivElement, AccountRowProps>(function AccountRow(
  { children, panel, open = false, onOpenChange, last = false, padding, gap, ...rest },
  ref,
) {
  const pad = len(padding) ?? accountPrompt.padding;
  // While a row is open its divider moves to the foot of the panel, so the
  // line closes the whole account rather than cutting between a row and its
  // own settings.
  const divider = last || open ? undefined : `${borderWidth.thin}px solid ${color.navbar.border}`;

  return (
    <div ref={ref} {...rest}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={open}
        onClick={() => onOpenChange?.(!open)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onOpenChange?.(!open);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: len(gap) ?? accountPrompt.gap,
          padding: pad,
          borderBottom: divider,
          cursor: onOpenChange ? 'pointer' : undefined,
        }}
      >
        {children}
        {panel != null && (
          <Icon
            icon={open ? IconDropdownArrowUp : IconDropdownArrowDown}
            size={accountPrompt.chevronSize}
            color={color.main.description}
          />
        )}
      </div>

      {open && panel != null && (
        <div
          style={{
            padding: `0 ${len(pad)} ${len(pad)}`,
            borderBottom: last
              ? undefined
              : `${borderWidth.thin}px solid ${color.navbar.border}`,
          }}
        >
          {panel}
        </div>
      )}
    </div>
  );
});

/** Per-instance overrides for the identity block's own metrics. */
export type AccountIdentityStyleProps = {
  stackGap?: CssLength;
};

export type AccountIdentityProps = {
  /** The account's avatar. */
  avatar?: ReactNode;
  /** The profile's name — one line, then clipped. */
  name: ReactNode;
  /** What the account is currently running on, under the name. */
  status?: ReactNode;
  /** The badge on the row's trailing edge. */
  badge?: ReactNode;
} & AccountIdentityStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The face, the name, and what the account inherits — the part of the row that
 * is the same whatever the row opens.
 *
 * Shared rather than written per settings screen: the prompt page and the
 * auto-reply page list the same accounts, and two copies would drift the moment
 * one gained a line.
 */
export const AccountIdentity = forwardRef<HTMLDivElement, AccountIdentityProps>(
  function AccountIdentity({ avatar, name, status, badge, stackGap, ...rest }, ref) {
    return (
      <>
        {avatar}
        <div
          ref={ref}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: len(stackGap) ?? accountPrompt.stackGap,
            flex: 1,
            minWidth: 0,
          }}
          {...rest}
        >
          <span
            style={{
              ...textStyle.mMedium,
              color: color.main.black,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </span>
          {status != null && (
            <span style={{ ...textStyle.sRegular, color: color.main.description }}>{status}</span>
          )}
        </div>
        {badge}
      </>
    );
  },
);
