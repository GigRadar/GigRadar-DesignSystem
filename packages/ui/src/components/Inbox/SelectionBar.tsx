import { color, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes } from 'react';
import { MarkAsReadButton } from './InboxSearch.js';

export type SelectionBarProps = {
  /** How many rooms are ticked. */
  selectedCount?: number;
  /** How many there are in total — what "select all" would reach. */
  totalCount?: number;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  /** Called when the confirm button is used. */
  onMarkAsRead?: () => void;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The bar shown while the list is in selection mode.
 *
 * Figma: node 3935:31772, whose three states — Unselected, Selected, Select
 * all — are the same row reading off the count. It is modelled here as one
 * component taking `selectedCount` rather than a `state` prop, because the
 * count is what the consumer already has and the states are derived from it.
 *
 * The leading action flips to "Unselect all" once everything is ticked: at
 * that point selecting all again does nothing, and the only move left is
 * back out.
 */
export const SelectionBar = forwardRef<HTMLDivElement, SelectionBarProps>(function SelectionBar(
  { selectedCount = 0, totalCount = 0, onSelectAll, onClearSelection, onMarkAsRead, ...rest },
  ref,
) {
  const allSelected = totalCount > 0 && selectedCount >= totalCount;

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        boxSizing: 'border-box',
      }}
      {...rest}
    >
      <button
        type="button"
        onClick={allSelected ? onClearSelection : onSelectAll}
        style={{
          ...textStyle.mRegular,
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: color.badge.foreground,
          cursor: 'pointer',
        }}
      >
        {allSelected ? 'Unselect all' : 'Select all'}
      </button>

      <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
        {selectedCount} Selected
      </span>

      <MarkAsReadButton
        active={selectedCount > 0}
        label="Mark as read"
        onClick={onMarkAsRead}
        disabled={selectedCount === 0}
      />
    </div>
  );
});
