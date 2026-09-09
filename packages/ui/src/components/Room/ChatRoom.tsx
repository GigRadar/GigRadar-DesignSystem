import {
  borderWidth,
  color,
  component,
  radius as radiusToken,
  shadow,
  textStyle,
} from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useEffect,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { RoomBackdrop } from './RoomBackdrop.js';
import { Icon } from '../../icons/Icon.js';
import { IconBubbleCrossStroke, type IconDef } from '../../icons/defs.js';

const { room } = component.middle;

/**
 * Which shell the room is drawn in.
 *
 * Not a breakpoint the component measures: the CRM's own shell already knows
 * whether it is drawing mobile or desktop chrome, and the difference runs
 * through the header and composer too.
 */
export type ChatRoomLayout = 'desktop' | 'mobile';

/** Per-instance overrides for the room's own metrics. */
export type ChatRoomStyleProps = {
  width?: CssLength;
  paddingX?: CssLength;
  background?: string;
};

export type ChatRoomProps = {
  /** The band across the top — pass a `ChatHeader`. */
  header?: ReactNode;
  /** The messages, in order. */
  children?: ReactNode;
  /** The box at the foot — pass a `Composer`. */
  composer?: ReactNode;
  /**
   * @default 'desktop'
   */
  layout?: ChatRoomLayout;
  /**
   * Draws the room's own wash behind the thread.
   *
   * On by default because that is what the product does; off for a preview that
   * supplies its own surface, or a screen embedding the room in something that
   * already has one.
   * @default true
   */
  backdrop?: boolean;
  /**
   * Fixes the backdrop to the viewport rather than to the room.
   *
   * The room fills the window in the product, so the two are the same thing
   * there; they are not when the room is embedded in something smaller.
   * @default false
   */
  backdropFixed?: boolean;
  /**
   * Draws the empty state instead of the thread — Figma's "Empty or Not Found".
   *
   * Passed rather than inferred from `children` being absent: a room whose
   * messages have not loaded yet is not the same as one with none, and only the
   * screen knows which it is looking at. The composer is dropped along with the
   * thread, since there is no conversation to write into.
   * @default false
   */
  empty?: boolean;
  /** The empty state's heading. */
  emptyTitle?: ReactNode;
  /** The line under it, saying why the column is bare. */
  emptyDescription?: ReactNode;
  /** The glyph in the empty state's disc. */
  emptyIcon?: IconDef;
} & ChatRoomStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The conversation — a header, the messages, and the box they are written in.
 *
 * Figma: node 4210:33888.
 *
 * The three bands are passed rather than built: the header needs the room's
 * client and stage, the composer needs the draft and the sending account, and a
 * component that assembled both would have to take every prop of each. What it
 * owns instead is the thing neither can do alone — pinning the header and the
 * composer while only the messages between them scroll.
 *
 * The thread is a fixed column centred in whatever width it is given, so a wide
 * window leaves margins rather than stretching messages to an unreadable line.
 */
export const ChatRoom = forwardRef<HTMLDivElement, ChatRoomProps>(function ChatRoom(
  {
    header,
    children,
    composer,
    layout = 'desktop',
    backdrop = true,
    backdropFixed = false,
    empty = false,
    emptyTitle = 'No Chat Room Available',
    emptyDescription = 'There’s no conversation to show because no chats have started yet.',
    emptyIcon = IconBubbleCrossStroke,
    width,
    paddingX,
    background,
    ...rest
  },
  ref
) {
  const mobile = layout === 'mobile';
  const inset = len(paddingX) ?? (mobile ? room.mobilePaddingX : room.desktopPaddingX);

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 0,
        overflow: 'hidden',
        backgroundColor: background ?? (backdrop ? 'transparent' : color.main.background),
      }}
      {...rest}
    >
      {backdrop && <RoomBackdrop fixed={backdropFixed} />}

      {/* Everything above the backdrop. The header and composer are outside the
          scrolling element rather than sticky inside it: a sticky header inside
          an overflowing column still scrolls its own shadow, and the composer
          has to stay put while the thread moves under it.

          An empty room draws a bare band rather than whatever header it was
          given. There is no conversation, so there is nothing to name — a title
          and a row of controls would be describing a room that is not on
          screen. Figma draws the state the same way. */}
      {empty ? (
        <div
          style={{
            position: 'relative',
            zIndex: room.layer.chrome,
            flexShrink: 0,
            height: room.empty.headerHeight,
            borderBottom: `${borderWidth.thin}px solid ${color.navbar.hover}`,
            backgroundColor: color.main.white,
          }}
        />
      ) : (
        header != null && (
          <div style={{ position: 'relative', zIndex: room.layer.chrome }}>{header}</div>
        )
      )}

      {empty ? (
        <div
          style={{
            position: 'relative',
            zIndex: room.layer.thread,
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: room.empty.gap,
            paddingLeft: room.empty.paddingX,
            paddingRight: room.empty.paddingX,
            textAlign: 'center',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: room.empty.markSize,
              height: room.empty.markSize,
              borderRadius: radiusToken.round,
              backgroundColor: color.badge.background,
            }}
          >
            <Icon icon={emptyIcon} size={room.empty.iconSize} color={color.badge.foreground} />
          </span>
          <span
            style={{
              ...textStyle.lMedium,
              fontSize: room.empty.titleFontSize,
              color: color.main.black,
            }}
          >
            {emptyTitle}
          </span>
          <span
            style={{
              ...textStyle.mRegular,
              fontSize: room.empty.descriptionFontSize,
              color: color.main.description,
              maxWidth: room.empty.maxWidth,
            }}
          >
            {emptyDescription}
          </span>
        </div>
      ) : (
        <div
          style={{
            position: 'relative',
            zIndex: room.layer.thread,
            flex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: room.messageGap,
              boxSizing: 'border-box',
              width: '100%',
              maxWidth: len(width) ?? (mobile ? room.mobileWidth : room.desktopWidth),
              margin: '0 auto',
              paddingLeft: inset,
              paddingRight: inset,
              paddingTop: room.paddingY,
              paddingBottom: room.paddingY,
            }}
          >
            {children}
          </div>
        </div>
      )}

      {/* No composer on an empty room: there is no conversation to write into,
          and Figma draws the state as a bare header over the message. */}
      {!empty && composer != null && (
        <div
          style={{
            position: 'relative',
            zIndex: room.layer.chrome,
            boxSizing: 'border-box',
            width: '100%',
            maxWidth: len(width) ?? (mobile ? room.mobileWidth : room.desktopWidth),
            margin: '0 auto',
            paddingLeft: inset,
            paddingRight: inset,
            paddingBottom: room.paddingY,
          }}
        >
          {composer}
        </div>
      )}
    </div>
  );
});

/** Per-instance overrides for the divider's own metrics. */
export type RoomDividerStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  radius?: CssLength;
  background?: string;
  textColor?: string;
};

export type RoomDividerProps = {
  /** The day, already formatted. */
  children: ReactNode;
  /**
   * Whether the pill floats at the top of the thread while its day is on
   * screen, and is pushed out of the way by the next day's.
   *
   * On by default, which is what the room wants. Turn it off for a static
   * rendering — a printed transcript, or a gallery frame showing the pill on
   * its own, where sticking to a container it does not scroll in would park it
   * somewhere arbitrary.
   * @default true
   */
  sticky?: boolean;
} & RoomDividerStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The date separator breaking a thread into days.
 *
 * Figma: node 39:4464 — a white pill carrying the day in the brand blue.
 *
 * Sticky rather than scrolling away with its messages: the pill pins to the top
 * of the thread while its own day is being read, and the next day's pill pushes
 * it out as it arrives, so the column always names the day on screen. That is
 * `position: sticky` doing exactly what it was built for, and it needs no
 * scroll handler, no measurement, and no state.
 *
 * The pill is filled rather than bare text because of that float: it passes over
 * the bubbles on its way out, and grey text crossing a message would be
 * unreadable for the length of the scroll.
 */
export const RoomDivider = forwardRef<HTMLDivElement, RoomDividerProps>(function RoomDivider(
  { children, sticky = true, paddingX, paddingY, radius, background, textColor, ...rest },
  ref
) {
  // Whether the pill is currently pinned rather than sitting in the thread.
  //
  // CSS has no selector for "a sticky element is stuck", and the usual sentinel
  // trick does not work here: a sticky element can only slide within its own
  // parent's box, so wrapping the row in anything its own height stops it
  // sticking at all. The row has to stay a direct child of the thread column.
  //
  // What is left is arithmetic. A stuck row is one held at the top of the
  // scroller while its natural position has scrolled above that — so comparing
  // the row's top against the scroller's own top says exactly that, with no
  // extra element in the thread.
  // Held in state rather than a ref so attaching the listener waits for the
  // node: an effect keyed on a ref runs before the ref is filled, finds no
  // scrolling ancestor to walk up to, and gives up for good.
  const [row, setRow] = useState<HTMLDivElement | null>(null);
  const [stuck, setStuck] = useState(false);

  // Stable across renders: an inline callback ref is a new function every
  // render, so React detaches and reattaches it each time — which would reset
  // the node to null and undo the measurement on every state change it caused.
  const attach = useCallback(
    (node: HTMLDivElement | null) => {
      setRow(node);
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  useEffect(() => {
    if (!sticky || !row) {
      setStuck(false);
      return;
    }

    // The nearest scrolling ancestor is whatever the room made overflow; found
    // by walking up rather than passed in, so a divider still behaves in any
    // container that scrolls it.
    let scroller: HTMLElement | null = row.parentElement;
    while (scroller && !/(auto|scroll)/.test(getComputedStyle(scroller).overflowY)) {
      scroller = scroller.parentElement;
    }
    if (!scroller) return;

    const measure = () => {
      if (!scroller) return;
      // Held within a pixel of the scroller's top edge, and with thread above
      // it still to scroll through — the second half is what keeps the first
      // pill from reading as stuck before anything has moved.
      const top = row.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
      setStuck(top <= 1 && scroller.scrollTop > 0);
    };
    measure();

    scroller.addEventListener('scroll', measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(scroller);
    return () => {
      scroller?.removeEventListener('scroll', measure);
      observer.disconnect();
    };
  }, [sticky, row]);

  return (
    <div
      // Kept on one element: the row measures itself and is also what a caller
      // gets a handle on, so the callback fills both.
      ref={attach}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // The row has to span the column for `center` to centre against it —
        // without a width it shrinks to the pill and lands wherever the flex
        // parent puts it.
        width: '100%',
        paddingTop: room.divider.offsetTop,
        ...(sticky
          ? {
              position: 'sticky',
              top: 0,
              // Above the messages it floats over, below the header and the
              // composer, which frame the thread rather than sitting in it.
              zIndex: room.layer.divider,
            }
          : null),
      }}
      {...rest}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box',
          paddingLeft: len(paddingX) ?? room.divider.paddingX,
          paddingRight: len(paddingX) ?? room.divider.paddingX,
          paddingTop: len(paddingY) ?? room.divider.paddingY,
          paddingBottom: len(paddingY) ?? room.divider.paddingY,
          borderRadius: len(radius) ?? room.divider.radius,
          backgroundColor: background ?? color.main.white,
          ...textStyle.mMedium,
          fontSize: room.divider.fontSize,
          color: textColor ?? color.badge.foreground,
          whiteSpace: 'nowrap',
          // The lift only while it is actually floating: at rest the pill sits
          // among the messages and a shadow would make it a raised object in a
          // flat column, which is exactly the distinction being drawn.
          boxShadow: stuck ? shadow.base : undefined,
          transition: 'box-shadow 150ms ease',
        }}
      >
        {children}
      </span>
    </div>
  );
});

/** Per-instance overrides for the message group's own metrics. */
/** Per-instance overrides for the notice's own metrics. */
export type RoomNoticeStyleProps = {
  paddingY?: CssLength;
  textColor?: string;
};

export type RoomNoticeProps = {
  /** The line. */
  children?: ReactNode;
} & RoomNoticeStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * A line the room says about itself — "Chat started on…", "Maria added Di Maria
 * to the room".
 *
 * Figma: the centred grey lines in node 5086:36506.
 *
 * Not a `BubbleChat` with `tone="system"`: that one is a filled bubble a person
 * is being shown, addressed to them and carrying a time. This is the room
 * narrating, so it takes no surface, no avatar, and no timestamp — it is closer
 * to the date separator than to a message, and reads as an aside rather than as
 * something anyone said.
 */
export const RoomNotice = forwardRef<HTMLDivElement, RoomNoticeProps>(function RoomNotice(
  { children, paddingY, textColor, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        paddingTop: len(paddingY) ?? room.notice.paddingY,
        paddingBottom: len(paddingY) ?? room.notice.paddingY,
      }}
      {...rest}
    >
      <span
        style={{
          ...textStyle.sRegular,
          color: textColor ?? color.main.description,
          textAlign: 'center',
          maxWidth: room.notice.maxWidth,
        }}
      >
        {children}
      </span>
    </div>
  );
});

export type RoomMessageStyleProps = {
  inset?: CssLength;
};

export type RoomMessageProps = {
  /** The line naming who sent it — pass a `Sender`. */
  sender?: ReactNode;
  /** The bubbles themselves. */
  children?: ReactNode;
  /**
   * Whose message it is. `own` aligns the group to the trailing edge, matching
   * the way `Sender` and `BubbleChat` each mirror on the same prop.
   * @default 'other'
   */
  side?: 'own' | 'other';
} & RoomMessageStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One person's turn — the line naming them, and the bubbles under it.
 *
 * The bubbles are indented past the avatar rather than starting under it, so a
 * run of messages from one person reads as one block hanging off a single face
 * rather than as several unrelated rows.
 */
export const RoomMessage = forwardRef<HTMLDivElement, RoomMessageProps>(function RoomMessage(
  { sender, children, side = 'other', inset, ...rest },
  ref
) {
  const own = side === 'own';

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: room.senderGap,
        width: '100%',
      }}
      {...rest}
    >
      {sender}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: own ? 'flex-end' : 'flex-start',
          gap: room.senderGap,
          marginLeft: own ? 0 : len(inset) ?? room.bubbleInset,
          marginRight: own ? len(inset) ?? room.bubbleInset : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
});
