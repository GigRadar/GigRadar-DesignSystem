import { borderWidth as borderWidthToken, color, component, radius, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconBubbleCrossFill } from '../../icons/defs.js';
import { useScrollbar } from '../Scrollbar/Scrollbar.js';

const { details } = component;

/** Per-instance overrides for the pane's own metrics. */
export type DetailsPaneStyleProps = {
  width?: CssLength;
  padding?: CssLength;
  /** Space between one section and the next. */
  sectionGap?: CssLength;
  background?: string;
  /** The rule against the thread. */
  borderColor?: string;
};

export type DetailsPaneProps = {
  /** The sections, top to bottom. */
  children?: ReactNode;
  /**
   * Draws the empty state instead of the sections — no room is open, so there
   * is nothing to describe.
   * @default false
   */
  empty?: boolean;
  /** The empty state's heading and explanation. */
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
} & DetailsPaneStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style'>;

/**
 * The Inbox's right column — everything known about the room that is open.
 *
 * Figma: node 82:8753, in its Default, 1st Loading, Empty, and External
 * states.
 *
 * A scrolling stack of foldable sections rather than a fixed panel. The pane
 * is taller than any screen once a room has a client, a meeting, an AI
 * configuration and eight participants, and which of those a given reader
 * cares about changes by the hour — so the fold is the pane's main control,
 * and this component's job is mostly to stack and scroll.
 *
 * It holds no section of its own. What goes in it is the caller's, because a
 * room with no meeting should not render a "Upcoming Meetings" header with
 * nothing under it, and only the caller knows.
 */
export const DetailsPane = forwardRef<HTMLElement, DetailsPaneProps>(function DetailsPane(
  {
    children,
    empty = false,
    emptyTitle = 'No Details Available',
    emptyDescription = "Chat details can't be shown because there's no active conversation.",
    width,
    padding,
    sectionGap,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  const scrollbar = useScrollbar();

  return (
    <aside
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        boxSizing: 'border-box',
        width: len(width) ?? `${details.width}px`,
        height: '100%',
        padding: len(padding) ?? `${details.padding}px`,
        backgroundColor: background ?? color.main.white,
        /*
         * The mirror of the room list's own rule, in the same colour: the two
         * fixed columns each draw the edge they present to the thread, so the
         * seam is one line either side rather than a border on one column and
         * a bare edge on the other.
         */
        borderLeft: `${borderWidthToken.thin}px solid ${borderColor ?? color.main.backgroundAlt}`,
        overflowY: 'auto',
        ...scrollbar,
      }}
      {...rest}
    >
      {empty ? (
        <div
          style={{
            display: 'flex',
            flex: '1 0 0',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: `${details.emptyGap}px`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${details.emptyMarkSize}px`,
              height: `${details.emptyMarkSize}px`,
              borderRadius: `${radius.round}px`,
              backgroundColor: color.badge.background,
            }}
          >
            <Icon
              icon={IconBubbleCrossFill}
              size={details.emptyIconSize}
              color={color.badge.foreground}
            />
          </div>
          <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>{emptyTitle}</span>
          <span
            style={{
              ...textStyle.sRegular,
              color: color.navbar.text,
              maxWidth: `${details.emptyWidth}px`,
            }}
          >
            {emptyDescription}
          </span>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: len(sectionGap) ?? `${details.sectionGap}px`,
          }}
        >
          {children}
        </div>
      )}
    </aside>
  );
});
