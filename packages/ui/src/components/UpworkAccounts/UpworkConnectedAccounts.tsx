import { color, component, radius as radiusToken, typography } from '@gigradar/theme';
import {
  Fragment,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
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

/**
 * What a `renderAccount` function receives — one connected account in the grid.
 *
 * Not called for the empty slots after it; those are `renderEmptySlot`.
 */
export type AccountRenderProps = WithDefaultRender & {
  /** The account this card is drawing. */
  account: UpworkAccount;
  /** Whether it is ticked. Always false on a list that cannot be selected. */
  selected: boolean;
  /** Whether the list takes selections at all. */
  selectable: boolean;
  /** Its position among the connected accounts, for keying. */
  index: number;
  /** Flips this account's tick and reports through `onSelectionChange`. */
  toggle: () => void;
};

/** What a `renderEmptySlot` function receives — one unfilled slot in the grid. */
export type EmptySlotRenderProps = WithDefaultRender & {
  /**
   * Which kind of empty slot. Only the first is `authorize` — the rest are
   * inert `available` slots, which is what keeps the next step unambiguous.
   */
  variant: 'authorize' | 'available';
  /** Its position among the empty slots. */
  index: number;
  /** True for the one slot that is the call to action. */
  isFirstEmpty: boolean;
  /** Starts an authorization. Only present on the first slot. */
  onActivate?: () => void;
};

/** What a `renderUpgradeSlot` function receives — the past-the-limit slot. */
export type UpgradeSlotRenderProps = WithDefaultRender & {
  /** Opens the upgrade route. */
  onUpgrade: () => void;
};

/** What a `renderEmptyState` function receives — the left column with nothing in it. */
export type AccountsEmptyStateRenderProps = WithDefaultRender & {
  /** Whether the Upwork API is connected. The panel's fork. */
  apiConnected: boolean;
  /**
   * The call to action, already routed: `onAuthorize` when the API is
   * connected, `onConnectApi` when it is not.
   */
  connect?: () => void;
  /** The panel's heading for this fork. */
  heading: string;
  /** The line under it. */
  description: string;
  /** The button's label. */
  actionLabel: string;
};

/** What a `renderSelectionActions` function receives — the header's selection row. */
export type SelectionActionsRenderProps = WithDefaultRender & {
  /** How many accounts there are. */
  total: number;
  /** How many are ticked. */
  selectedCount: number;
  /** Whether every account is ticked. */
  allSelected: boolean;
  /** Ticks all of them. */
  selectAll: () => void;
  /** Unticks all of them. */
  clear: () => void;
  /** Removes the ticked ones, if the caller wired it. */
  remove?: () => void;
};

/** What a `renderColumnHeader` function receives — the band above either column. */
export type ColumnHeaderRenderProps = WithDefaultRender & {
  /** Which of the two columns this header sits above. */
  column: 'list' | 'side';
  /** The title, or null while loading. */
  title: ReactNode;
  /** The subtitle, or null while loading. */
  description: ReactNode;
  /** How many accounts are connected. */
  count: number;
  /** How many the plan allows. */
  capacity: number;
  /** Whether the skeleton is drawn in place of the text. */
  loading: boolean;
  /** Goes back, if the caller drew the arrow. */
  back?: () => void;
};

/** What a `renderSide` function receives — the right column's stack of cards. */
export type AccountsSideRenderProps = WithDefaultRender & {
  /** Whether the API is connected. The banner's authorize action is dead without it. */
  apiConnected: boolean;
  /** Starts an authorization. */
  authorize?: () => void;
  /** Opens Upwork's settings, which the safety notice links to. */
  openUpworkSettings?: () => void;
};

/**
 * Which of the screen's two columns to draw.
 *
 * `both` is the screen as the product ships it. The single-column values exist
 * because each column is a coherent unit on its own — the account grid and the
 * explanatory cards are documented and reviewed separately — and rendering one
 * of them should not mean rendering the other and cropping it.
 */
export type UpworkColumns = 'both' | 'list' | 'side';

export type UpworkConnectedAccountsProps = {
  /**
   * Which columns to draw.
   *
   * @default 'both'
   */
  show?: UpworkColumns;
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
  /**
   * Replaces the account grid whole — the connected cards, the empty slots,
   * and the upgrade slot together.
   *
   * Prefer the per-slot props below when only one part has to change: they
   * keep the grid's columns and the selection wiring, which this replaces
   * along with everything else.
   */
  renderAccounts?: RenderProp<AccountListRenderProps>;
  /**
   * Replaces one connected account's card, keeping the grid around it.
   *
   * The usual reason is a card that has to carry more than the design system's
   * — a per-account menu, a last-synced time, a link to the profile.
   *
   * Not called when `renderAccounts` has replaced the grid.
   */
  renderAccount?: RenderProp<AccountRenderProps>;
  /**
   * Replaces an unfilled slot. `isFirstEmpty` marks the one that is the call
   * to action; the rest are inert by design.
   *
   * Not called when `renderAccounts` has replaced the grid.
   */
  renderEmptySlot?: RenderProp<EmptySlotRenderProps>;
  /**
   * Replaces the past-the-limit upgrade slot. Not called unless `onUpgrade` is
   * wired, since the slot is dropped entirely without it.
   */
  renderUpgradeSlot?: RenderProp<UpgradeSlotRenderProps>;
  /**
   * Replaces the panel shown when there is no API connection or no account
   * yet. The payload's `connect` is already routed to whichever of the two
   * the state calls for.
   */
  renderEmptyState?: RenderProp<AccountsEmptyStateRenderProps>;
  /**
   * Replaces the Select all / Clear selection / Remove row in the left
   * column's header. Not called on a list that cannot be selected, or one with
   * no accounts in it.
   */
  renderSelectionActions?: RenderProp<SelectionActionsRenderProps>;
  /**
   * Replaces either column's header band. `column` says which one, so a single
   * function can handle both or defer one to `defaultRender()`.
   */
  renderColumnHeader?: RenderProp<ColumnHeaderRenderProps>;
  /**
   * Replaces the right column's stack — the authorize banner, the safety
   * notice, and the walkthrough. Not called while loading, which draws its own
   * skeleton.
   */
  renderSide?: RenderProp<AccountsSideRenderProps>;
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
      renderAccount,
      renderEmptySlot,
      renderUpgradeSlot,
      renderEmptyState,
      renderSelectionActions,
      renderColumnHeader,
      renderSide,
      listWidth,
      sideWidth,
      listBackground,
      borderColor,
      show = 'both',
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
        {accounts.map((account, index) => {
          const isSelected = selectable && selectedIds.includes(account.id);
          const defaultRender = () => (
            <AccountCard
              name={account.name}
              avatarSrc={account.avatarSrc}
              status={account.status}
              statusLabel={account.statusLabel}
              selected={selectable ? isSelected : undefined}
              onSelectedChange={() => toggle(account.id)}
            />
          );

          return (
            <Fragment key={account.id}>
              {renderAccount
                ? renderAccount({
                    account,
                    selected: isSelected,
                    selectable,
                    index,
                    toggle: () => toggle(account.id),
                    defaultRender,
                  })
                : defaultRender()}
            </Fragment>
          );
        })}

        {Array.from({ length: emptyCount }, (_, index) => {
          const isFirstEmpty = index === 0;
          const variant = isFirstEmpty ? ('authorize' as const) : ('available' as const);
          const onActivate = isFirstEmpty ? onAuthorize : undefined;
          const defaultRender = () => <AccountCard variant={variant} onClick={onActivate} />;

          return (
            <Fragment key={`empty-${index}`}>
              {renderEmptySlot
                ? renderEmptySlot({ variant, index, isFirstEmpty, onActivate, defaultRender })
                : defaultRender()}
            </Fragment>
          );
        })}

        {onUpgrade &&
          (() => {
            const defaultRender = () => <AccountCard variant="upgrade" onClick={onUpgrade} />;
            return renderUpgradeSlot
              ? renderUpgradeSlot({ onUpgrade, defaultRender })
              : defaultRender();
          })()}
      </div>
    );

    const selectAll = () => onSelectionChange?.(accounts.map((a) => a.id));
    const clearSelection = () => onSelectionChange?.([]);
    const removeSelected = onRemove ? () => onRemove(selectedIds) : undefined;

    const defaultSelectionActions = () => (
      <SelectionActions
        total={accounts.length}
        selectedCount={selectedIds.length}
        onSelectAll={selectAll}
        onClear={clearSelection}
        onRemove={removeSelected}
      />
    );

    const showSelectionActions = !loading && selectable && accounts.length > 0;

    const listTitle = loading ? null : (
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
    );
    const listDescription = loading ? null : 'All upwork connected account list';

    const sideTitle = loading ? null : (
      <span style={{ ...typography.textStyle.lMedium, color: color.main.black }}>
        Connect Upwork Account
      </span>
    );
    const sideDescription = loading ? null : 'Connect and authorize your account to proceed';

    const defaultListHeader = () => (
      <ColumnHeader
        backButton={backButton}
        onBack={onBack}
        title={listTitle}
        description={listDescription}
        loading={loading}
        actions={
          showSelectionActions &&
          (renderSelectionActions
            ? renderSelectionActions({
                total: accounts.length,
                selectedCount: selectedIds.length,
                allSelected: selectedIds.length === accounts.length,
                selectAll,
                clear: clearSelection,
                remove: removeSelected,
                defaultRender: defaultSelectionActions,
              })
            : defaultSelectionActions())
        }
      />
    );

    const defaultSideHeader = () => (
      <ColumnHeader
        backButton={backButton}
        onBack={onBack}
        loading={loading}
        title={sideTitle}
        description={sideDescription}
      />
    );

    const defaultEmptyState = () => (
      <EmptyState apiConnected={apiConnected} onConnectApi={onConnectApi} onAuthorize={onAuthorize} />
    );

    const defaultSide = () => (
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
    );

    const showList = show !== 'side';
    const showSide = show !== 'list';

    return (
      <div {...rest} ref={ref} style={style}>
        {showList && (
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            // A column shown on its own takes the full width; beside the other
            // it holds the fixed width Figma draws.
            flexShrink: showSide ? 0 : 1,
            flexGrow: showSide ? 0 : 1,
            width: showSide ? (len(listWidth) ?? `${upworkAccounts.listColumn.width}px`) : '100%',
            backgroundColor: listBackground ?? upworkAccounts.listColumn.background,
            // The divider belongs to the split, so it goes when the split does.
            borderRight: showSide ? `1px solid ${borderColor ?? color.main.backgroundAlt}` : undefined,
          }}
        >
          {renderColumnHeader
            ? renderColumnHeader({
                column: 'list',
                title: listTitle,
                description: listDescription,
                count: accounts.length,
                capacity,
                loading,
                back: onBack,
                defaultRender: defaultListHeader,
              })
            : defaultListHeader()}

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
              renderEmptyState ? (
                renderEmptyState({
                  apiConnected,
                  connect: apiConnected ? onAuthorize : onConnectApi,
                  ...(apiConnected ? emptyCopy.connected : emptyCopy.disconnected),
                  defaultRender: defaultEmptyState,
                })
              ) : (
                defaultEmptyState()
              )
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
        )}

        {showSide && (
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minWidth: 0,
          }}
        >
          {renderColumnHeader
            ? renderColumnHeader({
                column: 'side',
                title: sideTitle,
                description: sideDescription,
                count: accounts.length,
                capacity,
                loading,
                back: onBack,
                defaultRender: defaultSideHeader,
              })
            : defaultSideHeader()}

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
            ) : renderSide ? (
              renderSide({
                apiConnected,
                authorize: onAuthorize,
                openUpworkSettings: onOpenUpworkSettings,
                defaultRender: defaultSide,
              })
            ) : (
              defaultSide()
            )}
          </div>
        </div>
        )}
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
 * The empty panel's copy, per fork.
 *
 * Held here rather than inline in `EmptyState` because `renderEmptyState`
 * hands the same three strings to a replacement — one table so the panel and
 * the render payload cannot drift apart.
 */
const emptyCopy = {
  connected: {
    heading: 'No Connected Accounts',
    description: 'Authorize your first Upwork account to get started',
    actionLabel: 'Authorize Account',
  },
  disconnected: {
    heading: 'No API Connection Yet',
    description:
      'Start by connecting Upwork API first, then authorizing your account to access more',
    actionLabel: 'Connect Upwork API',
  },
} as const;

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
  const copy = apiConnected ? emptyCopy.connected : emptyCopy.disconnected;

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
            {copy.heading}
          </span>
          <span style={{ ...typography.textStyle.sRegular, color: color.navbar.text }}>
            {copy.description}
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
        {copy.actionLabel}
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
