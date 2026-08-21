import { component } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

const { inbox } = component;

/**
 * Which pane the screen is showing.
 *
 * On a phone only one is on screen at a time, so this is what the back button
 * moves between. On a desktop it is ignored — every pane is visible at once,
 * and there is nothing to navigate.
 */
export type InboxPane = 'list' | 'room' | 'details';

export type InboxScreenProps = {
  /** The room list. */
  list: ReactNode;
  /** The conversation. */
  room?: ReactNode;
  /** The client and job panel. */
  details?: ReactNode;
  /**
   * How much room there is.
   *
   * A prop rather than a media query, because this package ships no
   * stylesheet and the app already knows its own breakpoints. It also lets a
   * gallery draw both layouts side by side, which a media query cannot.
   *
   * @default 'desktop'
   */
  layout?: 'desktop' | 'mobile';
  /**
   * Which pane is showing, on mobile. Ignored on desktop.
   * @default 'list'
   */
  pane?: InboxPane;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The Inbox's three columns, and which of them a phone shows.
 *
 * Figma: the desktop screen at 1362:26728, the mobile flow at 10068:72153 in
 * the CRM file.
 *
 * On a phone the panes are a stack rather than a row: the list fills the
 * screen until a room is opened, then the room replaces it and its header's
 * back chevron returns. Rendering all three and hiding two with CSS would keep
 * three scroll positions alive and let a hidden pane's focus trap the keyboard,
 * so the ones not showing are simply not rendered.
 *
 * The panes themselves are unchanged between layouts — a room card is the same
 * card at either width. What differs is how many are on screen, which is why
 * this owns the decision rather than each pane checking its own width.
 */
export const InboxScreen = forwardRef<HTMLDivElement, InboxScreenProps>(function InboxScreen(
  { list, room, details, layout = 'desktop', pane = 'list', ...rest },
  ref,
) {
  if (layout === 'mobile') {
    const showing = pane === 'room' ? room : pane === 'details' ? details : list;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          minWidth: 0,
          overflow: 'hidden',
        }}
        {...rest}
      >
        {showing ?? list}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ display: 'flex', width: '100%', height: '100%', minWidth: 0 }}
      {...rest}
    >
      {/* The list holds its width; the conversation takes the slack. */}
      <div style={{ flexShrink: 0, width: inbox.list.width }}>{list}</div>
      {room != null && (
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{room}</div>
      )}
      {details != null && <div style={{ flexShrink: 0 }}>{details}</div>}
    </div>
  );
});
