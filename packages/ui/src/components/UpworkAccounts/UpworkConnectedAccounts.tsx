import { color, component, radius as radiusToken, typography } from '@gigradar/theme';
import { forwardRef, useState, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconGoToExternal, IconKeyFill, IconLeftArrow, IconRightArrow } from '../../icons/defs.js';
import type { StatusTone } from '../Badge/StatusBadge.js';
import { Button } from '../Button/Button.js';
import { IconButton } from '../Button/IconButton.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { AccountCard } from './AccountCard.js';
import { AccountSafetyNotice } from './AccountSafetyNotice.js';
import { AuthorizationSteps } from './AuthorizationSteps.js';
import { AuthorizeBanner } from './AuthorizeBanner.js';

const { upworkAccounts } = component;

/** One connected Upwork account. */
export type UpworkAccount = {
  /** React key, and what `onSelectionChange` reports. */
  id: string;
  name: string;
  /** Profile photo. Initials are derived from `name` when absent. */
  avatarSrc?: string;
  status?: StatusTone;
  /** Overrides the status pill's label. */
  statusLabel?: ReactNode;
};

/** Per-instance overrides for the screen's own metrics. */
export type UpworkConnectedAccountsStyleProps = {
  /** The account column's width. */
  listWidth?: CssLength;
  /** The right column's width. */
  sideWidth?: CssLength;
  /** The account column's fill. */
  listBackground?: string;
  /** The divider between the columns. */
  borderColor?: string;
  /** How many slots per row in the account grid. */
  columns?: number;
};

/** What the account grid gets when a caller replaces it. */
export type AccountListRenderProps = WithDefaultRender & {
  accounts: UpworkAccount[];
  selected: string[];
};

export type UpworkConnectedAccountsProps = {
  /** The connected accounts. An empty list draws the empty state. */
  accounts?: UpworkAccount[];
  /**
   * How many accounts the plan allows. Drives the `(3/10)` counter and how
   * many empty slots are drawn after the connected ones.
   */
  capacity?: number;
  /**
   * Whether the Upwork API is connected.
   *
   * The screen's first fork. Without it the left column offers "Connect Upwork
   * API" and the right column's authorize action is dead — there is nothing to
   * authorize against yet.
   *
   * @default true
   */
  apiConnected?: boolean;
  /** Ids of the ticked accounts. Omit to render a list that cannot be selected. */
  selected?: string[];
  /** Called with the new selection whenever a tick changes. */
  onSelectionChange?: (selected: string[]) => void;
  /** Draws the skeleton placeholder in both columns. */
  loading?: boolean;
  /** Draws a back arrow left of each column title. */
  backButton?: boolean;
  /** Called when that arrow is pressed. */
  onBack?: () => void;
  /** Called when the authorize action is pressed, in either column. */
  onAuthorize?: () => void;
  /** Called when "Connect Upwork API" is pressed. */
  onConnectApi?: () => void;
  /** Called when an upgrade slot is pressed. Omit to drop the slot. */
  onUpgrade?: () => void;
  /** Called when the safety notice's link is pressed. */
  onOpenUpworkSettings?: () => void;
  /** Called when the selection's Remove action is pressed. */
  onRemove?: (selected: string[]) => void;
  /** Replaces the account grid. Call `defaultRender()` to decorate. */
  renderAccounts?: RenderProp<AccountListRenderProps>;
} & UpworkConnectedAccountsStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * CRM ▸ Settings ▸ Upwork Connected Account — Figma node 2105:34594, which
 * draws seven states.
 *
 * Two columns: the left lists every account slot the plan allows, and the
 * right holds the authorize banner, the safety notice, and the walkthrough.
 * The right column never changes between states — it is the same three cards
 * throughout, with only the authorize button's enabled-ness moving — so all
 * seven of Figma's states are differences in the left column alone.
 *
 * Those seven are not seven props. Six of them fall out of the data: no API
 * connection, no accounts, some accounts, some selected, all selected, and a
 * full list are all `apiConnected` plus `accounts` plus `selected`. Only
 * `loading` is genuinely its own thing, since nothing in the data says whether
 * it has arrived yet.
 */
export const UpworkConnectedAccounts = forwardRef<HTMLDivElement, UpworkConnectedAccountsProps>(
  function UpworkConnectedAccounts(
    {
      accounts = [],
      capacity = 10,
      apiConnected = true,
      selected,
      onSelectionChange,
      loading = false,
      backButton = false,
      onBack,
      onAuthorize,
      onConnectApi,
      onUpgrade,
      onOpenUpworkSettings,
      onRemove,
      renderAccounts,
      listWidth,
      sideWidth,
      listBackground,
      borderColor,
      columns = upworkAccounts.card.columns,
      ...rest
    },
    ref,
  ) {
    const selectable = selected !== undefined;
    const selectedIds = selected ?? [];

    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'stretch',
      width: '100%',
      backgroundColor: color.main.white,
      fontFamily: typography.fontFamily.base,
      overflow: 'hidden',
    };

    const toggle = (id: string) => {
      const next = selectedIds.includes(id)
        ? selectedIds.filter((entry) => entry !== id)
        : [...selectedIds, id];
      onSelectionChange?.(next);
    };

    /**
     * The empty slots drawn after the connected accounts.
     *
     * The first one is the call to action and the rest are inert, which is
     * what makes the next step unambiguous — a grid where every empty slot
     * invited a click would have the user picking one arbitrarily.
     */
    const emptyCount = Math.max(0, capacity - accounts.length);

    const defaultAccounts = () => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          columnGap: upworkAccounts.card.columnGap,
          rowGap: upworkAccounts.card.rowGap,
          width: '100%',
        }}
      >
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            name={account.name}
            avatarSrc={account.avatarSrc}
            status={account.status}
            statusLabel={account.statusLabel}
            selected={selectable ? selectedIds.includes(account.id) : undefined}
            onSelectedChange={() => toggle(account.id)}
          />
        ))}

        {Array.from({ length: emptyCount }, (_, index) => (
          <AccountCard
            key={`empty-${index}`}
            variant={index === 0 ? 'authorize' : 'available'}
            onClick={index === 0 ? onAuthorize : undefined}
          />
        ))}

        {onUpgrade && <AccountCard variant="upgrade" onClick={onUpgrade} />}
      </div>
    );

    return (
      <div {...rest} ref={ref} style={style}>
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            width: len(listWidth) ?? `${upworkAccounts.listColumn.width}px`,
            backgroundColor: listBackground ?? upworkAccounts.listColumn.background,
            borderRight: `1px solid ${borderColor ?? color.main.backgroundAlt}`,
          }}
        >
          <ColumnHeader
            backButton={backButton}
            onBack={onBack}
            title={
              loading ? null : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ ...typography.textStyle.h4, color: color.main.black }}>
                    Upwork Connected Account
                  </span>
                  <span
                    style={{
                      ...typography.textStyle.mRegular,
                      color: color.navbar.text,
                      opacity: 0.7,
                    }}
                  >
                    ({accounts.length}/{capacity})
                  </span>
                </span>
              )
            }
            description={loading ? null : 'All upwork connected account list'}
            loading={loading}
            actions={
              !loading &&
              selectable &&
              accounts.length > 0 && (
                <SelectionActions
                  total={accounts.length}
                  selectedCount={selectedIds.length}
                  onSelectAll={() => onSelectionChange?.(accounts.map((a) => a.id))}
                  onClear={() => onSelectionChange?.([])}
                  onRemove={onRemove ? () => onRemove(selectedIds) : undefined}
                />
              )
            }
          />

          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: upworkAccounts.gap,
              width: '100%',
              padding: `0 ${upworkAccounts.bodyPaddingX}px`,
            }}
          >
            {loading ? (
              <SkeletonGrid columns={columns} rows={3} />
            ) : !apiConnected || accounts.length === 0 ? (
              <EmptyState
                apiConnected={apiConnected}
                onConnectApi={onConnectApi}
                onAuthorize={onAuthorize}
              />
            ) : renderAccounts ? (
              renderAccounts({
                accounts,
                selected: selectedIds,
                defaultRender: defaultAccounts,
              })
            ) : (
              defaultAccounts()
            )}
          </div>
        </div>

        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minWidth: 0,
          }}
        >
          <ColumnHeader
            backButton={backButton}
            onBack={onBack}
            loading={loading}
            title={
              loading ? null : (
                <span style={{ ...typography.textStyle.lMedium, color: color.main.black }}>
                  Connect Upwork Account
                </span>
              )
            }
            description={loading ? null : 'Connect and authorize your account to proceed'}
          />

          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: upworkAccounts.sideGap,
              width: '100%',
              padding: `0 ${upworkAccounts.bodyPaddingX}px`,
            }}
          >
            {loading ? (
              <SkeletonSide />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: upworkAccounts.sideGap,
                  width: len(sideWidth) ?? `${upworkAccounts.sideWidth}px`,
                  maxWidth: '100%',
                }}
              >
                <AuthorizeBanner disabled={!apiConnected} onAuthorize={onAuthorize} />
                <AccountSafetyNotice onAction={onOpenUpworkSettings} />
                <AuthorizationSteps />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

/** The band above either column — a title, a subtitle, and any actions. */
function ColumnHeader({
  title,
  description,
  actions,
  backButton,
  onBack,
  loading,
}: {
  title: ReactNode;
  description: ReactNode;
  actions?: ReactNode;
  backButton?: boolean;
  onBack?: () => void;
  loading?: boolean;
}) {
  const { header } = upworkAccounts;

  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        gap: header.gap,
        width: '100%',
        padding: `${header.paddingY}px ${header.paddingX}px`,
      }}
    >
      {backButton && (
        <IconButton
          icon={IconLeftArrow}
          aria-label="Back"
          size="small"
          onClick={onBack}
          textColor={color.navbar.textActive}
        />
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: header.titleGap,
          flex: '1 1 auto',
          minWidth: 0,
        }}
      >
        {loading ? (
          <>
            <Skeleton width={205} height={22} />
            <Skeleton variant="text" width={205} />
          </>
        ) : (
          <>
            {title}
            {description && (
              <span style={{ ...typography.textStyle.lRegular, color: color.main.description }}>
                {description}
              </span>
            )}
          </>
        )}
      </div>

      {actions}
    </div>
  );
}

/**
 * The header's Select all / Clear selection / Remove row.
 *
 * Each button disables rather than disappears when it has nothing to act on —
 * a row whose buttons came and went as the selection changed would shift the
 * ones beside it under the pointer.
 */
function SelectionActions({
  total,
  selectedCount,
  onSelectAll,
  onClear,
  onRemove,
}: {
  total: number;
  selectedCount: number;
  onSelectAll: () => void;
  onClear: () => void;
  onRemove?: () => void;
}) {
  const allSelected = selectedCount === total;

  /*
    Figma's "Reset Button All" is the design system's secondary button at the
    small step — a white 6px-radius box with a pale border and grey label. The
    only divergence is the resting label color, which Figma draws in the navbar
    grey rather than the button's own, so that one value is passed through.
  */
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: upworkAccounts.header.titleGap * 2,
        flexShrink: 0,
      }}
    >
      <Button
        variant="secondary"
        size="small"
        onClick={onSelectAll}
        disabled={allSelected}
        textColor={color.navbar.text}
        borderColor={color.navbar.hover}
      >
        Select all
      </Button>
      <Button
        variant="secondary"
        size="small"
        onClick={onClear}
        disabled={selectedCount === 0}
        textColor={color.navbar.text}
        borderColor={color.navbar.hover}
      >
        Clear selection
      </Button>
      {onRemove && selectedCount > 0 && (
        <Button variant="secondary" tone="danger" size="small" onClick={onRemove}>
          Remove ({selectedCount})
        </Button>
      )}
    </div>
  );
}

/**
 * The left column before anything exists — Figma's "No Connected/API"
 * (node 2130:2470) and its API-connected sibling.
 *
 * The two differ in what the user is being asked to do: connect the API, or
 * authorize the first account. Same panel, different call to action.
 */
function EmptyState({
  apiConnected,
  onConnectApi,
  onAuthorize,
}: {
  apiConnected: boolean;
  onConnectApi?: () => void;
  onAuthorize?: () => void;
}) {
  const { empty } = upworkAccounts;

  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: empty.actionGap,
        width: '100%',
        padding: `${empty.paddingY}px`,
        borderRadius: empty.radius,
        border: `${empty.borderWidth}px solid ${color.navbar.disabledBackground}`,
        backgroundColor: color.main.white,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: empty.gap }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: empty.iconPlateSize,
            height: empty.iconPlateSize,
            borderRadius: '50%',
            backgroundColor: color.main.background,
            color: color.main.brand,
          }}
        >
          <Icon icon={IconKeyFill} size={empty.iconSize} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <span style={{ ...typography.textStyle.mMedium, color: color.main.black }}>
            {apiConnected ? 'No Connected Accounts' : 'No API Connection Yet'}
          </span>
          <span style={{ ...typography.textStyle.sRegular, color: color.navbar.text }}>
            {apiConnected
              ? 'Authorize your first Upwork account to get started'
              : 'Start by connecting Upwork API first, then authorizing your account to access more'}
          </span>
        </div>
      </div>

      {/*
        Two different actions, drawn as the same button: Figma gives the
        API-connected state an external-link arrow and the unconnected one a
        plain right arrow, since connecting the API stays inside the product
        while authorizing leaves for Upwork.
      */}
      <Button
        size="large"
        radius={radiusToken.m}
        fontSize={typography.fontSize.m}
        onClick={apiConnected ? onAuthorize : onConnectApi}
        endIcon={
          <Icon icon={apiConnected ? IconGoToExternal : IconRightArrow} size={apiConnected ? 12.5 : 14} />
        }
      >
        {apiConnected ? 'Authorize Account' : 'Connect Upwork API'}
      </Button>
    </div>
  );
}

/** The account grid's loading placeholder — one bar per slot. */
function SkeletonGrid({ columns, rows }: { columns: number; rows: number }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        columnGap: upworkAccounts.card.columnGap,
        rowGap: upworkAccounts.card.rowGap,
        width: '100%',
      }}
    >
      {Array.from({ length: columns * rows }, (_, index) => (
        <Skeleton
          key={index}
          height={upworkAccounts.card.minHeight}
          radius={upworkAccounts.card.radius}
        />
      ))}
    </div>
  );
}

/** The right column's loading placeholder. */
function SkeletonSide() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: upworkAccounts.sideGap,
        width: upworkAccounts.sideWidth,
        maxWidth: '100%',
      }}
    >
      {/* The banner and the notice, then the steps heading and its four rows. */}
      <Skeleton height={148} radius={upworkAccounts.banner.radius} />
      <Skeleton height={148} radius={upworkAccounts.notice.radius} />
      <Skeleton variant="text" width={110} />
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} height={upworkAccounts.step.size} />
      ))}
    </div>
  );
}
