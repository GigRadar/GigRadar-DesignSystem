import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { useScrollbar } from '../Scrollbar/Scrollbar.js';
import { AdvancedSearch, type AdvancedSearchProps } from './AdvancedSearch.js';
import { ConnectionIndicator, type ConnectionState } from './ConnectionIndicator.js';
import { InboxSearchField, MarkAsReadButton } from './InboxSearch.js';
import { InboxSelector, type InboxAccount } from './InboxSelector.js';
import { PushNotificationToggle, type PushPermission } from './PushNotificationToggle.js';

const { inbox } = component;
const { list, search, connection: connectionMetrics } = inbox;

/** Per-instance overrides for the column's own metrics. */
export type InboxListStyleProps = {
  width?: CssLength;
  background?: string;
  borderColor?: string;
};

export type InboxListProps = {
  /** The rooms — a stack of `<InboxRoom>`. */
  children?: ReactNode;
  /** The heading. @default 'Inbox' */
  title?: ReactNode;
  /** A badge beside the title — the plan the workspace is on. */
  badge?: ReactNode;
  /** The accounts the picker offers. */
  accounts?: InboxAccount[];
  /** Which account is showing. See `InboxSelector`. */
  account?: string;
  onAccountChange?: (value: string) => void;
  onConnectAccount?: () => void;
  /** The search query. Controlled. */
  query?: string;
  onQueryChange?: (query: string) => void;
  /** Whether push notifications are on. */
  notificationsEnabled?: boolean;
  onNotificationsChange?: (enabled: boolean) => void;
  /** Reports what the browser's permission prompt decided. */
  onNotificationPermissionChange?: (permission: PushPermission) => void;
  /**
   * Fills the width it is given instead of holding the column's 328px.
   *
   * On a phone the list is the whole screen rather than one of three panes,
   * and a fixed-width column would leave a gap down one side.
   *
   * @default false
   */
  fluid?: boolean;
  /**
   * Suppresses the toggle's hover explainer — for someone who has already
   * granted permission or dismissed it.
   * @default false
   */
  hideNotificationTooltip?: boolean;
  /** Whether the socket is live. Drawn at the column's foot. */
  connection?: ConnectionState;
  /**
   * Hides the search band — the state the list falls back to while its first
   * page is still loading, when there is nothing to search yet.
   * @default true
   */
  showSearch?: boolean;
  /** Filters for the advanced panel. Passing this opens the panel on focus. */
  searchPanel?: Omit<AdvancedSearchProps, 'ref'>;
  /**
   * Selection mode — the state the mark-as-read control puts the list into.
   * Drawing the bar is left to the consumer via `selectionBar`.
   */
  selectionMode?: boolean;
  onSelectionModeChange?: (active: boolean) => void;
  /** The select-all / count / confirm row, shown while selecting. */
  selectionBar?: ReactNode;
} & InboxListStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * The inbox's left column — the room list and its controls.
 *
 * Figma: node 382:3823, whose six states are the list's whole lifecycle
 * (default, loading, first load, empty, searching, onboarding). Those states
 * are the consumer's to supply as `children`; what this owns is the frame
 * around them — the header, the account picker, the search band, and the
 * connection indicator pinned to the foot.
 *
 * The advanced search panel is absolutely positioned over the list rather than
 * pushing it down: it is opened by focusing the field, and a panel that shoved
 * the rooms out of view would make filtering feel like navigating away.
 */
export const InboxList = forwardRef<HTMLDivElement, InboxListProps>(function InboxList(
  {
    children,
    title = 'Inbox',
    badge,
    accounts = [],
    account,
    onAccountChange,
    onConnectAccount,
    query,
    onQueryChange,
    fluid = false,
    notificationsEnabled = false,
    onNotificationsChange,
    onNotificationPermissionChange,
    hideNotificationTooltip = false,
    connection = 'online',
    showSearch = true,
    searchPanel,
    selectionMode = false,
    onSelectionModeChange,
    selectionBar,
    width,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  const [panelOpen, setPanelOpen] = useState(false);
  const scrollbar = useScrollbar();

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        width: len(width) ?? (fluid ? '100%' : list.width),
        height: '100%',
        backgroundColor: background ?? color.main.white,
        borderRight: `${borderWidth.thin}px solid ${borderColor ?? color.main.backgroundAlt}`,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: list.controlsGap,
          boxSizing: 'border-box',
          height: list.headerHeight,
          padding: `${list.headerPaddingY}px ${list.headerPaddingX}px`,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: list.controlsGap, flex: 1, minWidth: 0 }}>
          <span style={{ ...textStyle.h4, color: color.main.black }}>{title}</span>
          {badge}
        </span>

        <PushNotificationToggle
          checked={notificationsEnabled}
          onCheckedChange={onNotificationsChange}
          onPermissionChange={onNotificationPermissionChange}
          hideTooltip={hideNotificationTooltip}
        />
      </div>

      {showSearch && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: list.controlsGap,
            padding: list.controlsPadding,
            position: 'relative',
          }}
        >
          <InboxSelector
            accounts={accounts}
            value={account}
            onValueChange={onAccountChange}
            onConnectAccount={onConnectAccount}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: search.rowGap }}>
            <InboxSearchField
              value={query}
              onValueChange={onQueryChange}
              onFocusChange={(focused) => {
                if (focused && searchPanel) setPanelOpen(true);
              }}
            />
            {/* The same button in the same place, flipping between the
                double-check that enters selection and the ✕ that leaves it —
                putting the exit anywhere else leaves the person hunting for
                the way back. */}
            <MarkAsReadButton
              active={selectionMode}
              cancel={selectionMode}
              onClick={() => onSelectionModeChange?.(!selectionMode)}
            />
          </div>

          {selectionMode && selectionBar}

          {searchPanel && panelOpen && (
            <>
              {/* Clicking anywhere else closes the panel. A transparent sheet
                  behind it is the cheapest way to catch that without wiring a
                  document listener whose cleanup can be missed. */}
              <div
                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                onClick={() => setPanelOpen(false)}
              />
              <div style={{ position: 'absolute', top: '100%', left: list.controlsPadding, zIndex: 11 }}>
                <AdvancedSearch {...searchPanel} />
              </div>
            </>
          )}
        </div>
      )}

      <div
        {...scrollbar.props}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: list.chatGap,
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          padding: list.chatPadding,
          ...scrollbar.style,
        }}
      >
        {scrollbar.styleTag}
        {children}
      </div>

      <div style={{ position: 'absolute', left: connectionMetrics.offsetLeft, bottom: connectionMetrics.offsetBottom }}>
        <ConnectionIndicator state={connection} />
      </div>
    </div>
  );
});
