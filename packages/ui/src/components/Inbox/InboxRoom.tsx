import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Avatar } from '../Avatar/Avatar.js';
import { HighlightedText } from './HighlightedText.js';
import { CounterBadge } from '../Badge/CounterBadge.js';
import { Skeleton } from '../Skeleton/Skeleton.js';
import { ScheduleMark } from './ScheduleMark.js';
import { SelectTick } from './SelectTick.js';
import { StagePill } from './StagePill.js';

const { inbox } = component;
const { room } = inbox;

/** What a `renderTrailing` function receives — the card's trailing slot. */
export type InboxRoomTrailingRenderProps = WithDefaultRender & {
  /** Unread messages in this room. */
  unread: number;
  /** Whether the list is selecting, and whether this row is ticked. */
  selecting: boolean;
  checked: boolean;
  /** Whether the room carries a queued message. */
  scheduled: boolean;
};

/** Per-instance overrides for the room card's own metrics. */
export type InboxRoomStyleProps = {
  height?: CssLength;
  radius?: CssLength;
  paddingX?: CssLength;
  paddingY?: CssLength;
  gap?: CssLength;
  /** Fill while unselected. */
  background?: string;
  /** Fill while selected. */
  selectedBackground?: string;
  borderColor?: string;
};

export type InboxRoomProps = {
  /** The job or thread title. */
  title: ReactNode;
  /**
   * The active search query. Occurrences of it in the title and preview are
   * marked, so a match found by searching is visible on the card that matched.
   *
   * Only applies where `title` and `preview` are plain strings — a caller
   * passing rich nodes has already decided how they render.
   */
  query?: string;
  /** Who sent the last message. Rendered before the preview, in medium. */
  sender?: ReactNode;
  /** The last message, truncated to one line. */
  preview?: ReactNode;
  /** When it arrived — "Now", "13:10", "Yesterday". */
  timestamp?: ReactNode;
  /** The lead's stage. Drawn as a tinted pill before the title. */
  stage?: { label: ReactNode; tone: string };
  /** The client's name, for the avatar's initials and alt text. */
  name?: string;
  /** The client's photo. */
  avatarSrc?: string;
  /**
   * Which connected account — the BM — is handling this room, drawn as a mini
   * avatar in the client avatar's bottom-right corner.
   *
   * This is what makes the combined "All accounts" inbox readable: with every
   * account's rooms interleaved in one list, the mini avatar is the only thing
   * saying who owns a conversation. Filtering the list to one account by way of
   * the selector is the other half of the same question, asked the other way
   * round.
   *
   * An object rather than a bare URL so the mark carries a name — a photo with
   * no alt text tells a screen reader nothing about who is handling the room.
   */
  account?: { name: string; avatarSrc?: string };
  /** Unread messages in this room. */
  unread?: number;
  /**
   * Whether this room is the one being read. The selected card takes the
   * brand blue and inverts its text.
   * @default false
   */
  selected?: boolean;
  /**
   * Puts the card in selection mode: the unread counter gives way to a round
   * checkbox, and clicking ticks rather than opens.
   *
   * Omit for the reading list. Only the mark-as-read flow selects rooms today
   * — scheduling a message to several rooms at once is not something the
   * column can start, so there is no second mode to distinguish.
   *
   * @default false
   */
  selecting?: boolean;
  /** Whether this room is ticked. Only meaningful while `selecting`. */
  checked?: boolean;
  /**
   * Marks the room as already carrying a scheduled message — a purple clock
   * beside the preview.
   * @default false
   */
  scheduled?: boolean;
  /**
   * Greys the card out and stops it responding. Figma's "[S-M] Disable": a
   * room that cannot receive the scheduled message.
   * @default false
   */
  disabled?: boolean;
  /**
   * Draws the card in the error outline — the scheduled send failed for this
   * room. Kept legible rather than hidden, since it is the one the person has
   * to act on.
   * @default false
   */
  error?: boolean;
  /**
   * Renders a placeholder instead of content, for the list's first load.
   * Every other prop is ignored.
   * @default false
   */
  loading?: boolean;
  /**
   * Replaces the card's trailing slot — the counter, the schedule mark, and
   * anything else that sits after the preview.
   *
   * This is the part products genuinely differ on: a screen may want its own
   * action there, or a different badge, while keeping the card's truncation,
   * its selection behaviour, and its states. Call `defaultRender()` to
   * decorate rather than replace.
   */
  renderTrailing?: RenderProp<InboxRoomTrailingRenderProps>;
} & InboxRoomStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'title'>;

/**
 * One room in the inbox list.
 *
 * Figma: node 43:3835, whose ten states are three axes rather than ten
 * layouts — how the card is being read (default, hover, selected), whether
 * the list is selecting and for what (read, schedule), and whether the room
 * is unavailable (disabled, error, loading). Modelled as props on those axes,
 * because a `state` union of ten would make "selected and scheduled" or
 * "ticked while erroring" unrepresentable when both really occur.
 *
 * Every line is clamped to one row and the card's height is fixed, so a long
 * job title and a long message do not push the next room down the list.
 * Scanning the list depends on the rows staying where the eye expects them.
 */
export const InboxRoom = forwardRef<HTMLButtonElement, InboxRoomProps>(function InboxRoom(
  {
    title,
    query,
    sender,
    preview,
    timestamp,
    stage,
    name,
    avatarSrc,
    account,
    unread = 0,
    selected = false,
    selecting = false,
    checked = false,
    scheduled = false,
    disabled = false,
    error = false,
    loading = false,
    renderTrailing,
    height,
    radius,
    paddingX,
    paddingY,
    gap,
    background,
    selectedBackground,
    borderColor,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);

  // The first load draws the card's footprint and nothing else. Matching its
  // height exactly is what stops the list reflowing as rooms arrive.
  if (loading) {
    return (
      <Skeleton
        variant="block"
        width="100%"
        height={len(height) ?? room.height}
        radius={len(radius) ?? room.radius}
      />
    );
  }

  // Hover is tracked rather than written as CSS because this package styles
  // inline and ships no stylesheet — the same reason Button and Checkbox do it.
  const hoverable = !disabled && !error;

  // Selection mode moves the emphasis to the tick, so the card stops drawing
  // itself as "the one being read" — two different highlights at once would
  // leave neither meaning anything.
  // A ticked card fills brand blue, the same as the open one: both mean "this
  // is the row you are acting on", and giving selection its own fill would put
  // two competing highlights in one list.
  const highlighted = selecting ? checked : selected;

  const edge = error
    ? color.status.error.main
    : hovered && hoverable
        ? // Figma's hover fills the card with the badge tint and drops the
          // border; matching the border to the fill keeps the 71px height
          // rather than letting the card shift by a pixel as it lights up.
          color.badge.background
        : borderColor ?? color.badge.background;

  const titleColor = disabled || error
    ? color.disable.background
    : highlighted
      ? color.main.white
      : color.main.black;
  const bodyColor = disabled || error
    ? color.disable.background
    : highlighted
      ? color.main.background
      : color.main.description;

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      aria-current={highlighted ? 'true' : undefined}
      aria-pressed={selecting ? checked : undefined}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: len(gap) ?? room.gap,
        width: '100%',
        boxSizing: 'border-box',
        height: len(height) ?? room.height,
        padding: `${len(paddingY) ?? `${room.paddingY}px`} ${len(paddingX) ?? `${room.paddingX}px`}`,
        borderRadius: len(radius) ?? room.radius,
        border: `${borderWidth.thin}px solid ${highlighted ? 'transparent' : edge}`,
        backgroundColor: highlighted
          ? selectedBackground ?? color.badge.foreground
          : hovered && hoverable
            ? color.badge.background
            : background ?? color.main.white,
        textAlign: 'left',
        font: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        overflow: 'hidden',
      }}
      {...rest}
    >
      {/* The tick leads the row rather than trailing it: in selection mode the
          question is "which of these", and a column of ticks down the left edge
          is scannable in a way one tucked behind each preview is not. It also
          leaves the unread counter where it always sits, so nothing else in the
          card moves as the mode changes. */}
      {selecting && (
        <SelectTick
          checked={checked}
          disabled={disabled}
          // On the filled card the tick inverts: a brand-blue tick on a
          // brand-blue card would vanish.
          tone={highlighted ? color.main.white : undefined}
          checkColor={highlighted ? color.badge.foreground : undefined}
        />
      )}

      <Avatar
        size="large"
        name={name}
        src={avatarSrc}
        // Figma nests an `Avatar(S)` at 20px inside this 40px one. Sizing the
        // slot rather than the avatar inside it is what leaves room for the
        // white ring separating the two circles — an inner avatar pinned to
        // 20px would cover it.
        badgeSize={room.accountMarkSize}
        badge={
          account ? (
            <Avatar
              // The S step, as Figma's "Avatar(S)" names it. `diameter` then
              // fills the badge slot, which is a step smaller than S's own
              // 24px — the initials keep S's type size, which is what makes
              // them legible at 18px rather than scaling down with the circle.
              size="small"
              diameter="100%"
              name={account.name}
              src={account.avatarSrc}
              aria-label={`Handled by ${account.name}`}
            />
          ) : undefined
        }
      />

      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: room.stackGap,
          flex: 1,
          minWidth: 0,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: room.rowGap }}>
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: room.titleGap,
              flex: 1,
              minWidth: 0,
            }}
          >
            {/* The stage pill goes with the room's own state, so it drops out
                once the room is unavailable — a stage on a greyed card reads
                as still actionable. */}
            {stage && !disabled && !error && (
              <StagePill tone={stage.tone}>{stage.label}</StagePill>
            )}
            <span
              style={{
                ...textStyle.lMedium,
                flex: 1,
                minWidth: 0,
                color: titleColor,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {typeof title === 'string' ? (
                <HighlightedText query={query}>{title}</HighlightedText>
              ) : (
                title
              )}
            </span>
          </span>
          {timestamp != null && (
            <span style={{ ...textStyle.sRegular, flexShrink: 0, color: bodyColor }}>
              {timestamp}
            </span>
          )}
        </span>

        <span style={{ display: 'flex', alignItems: 'center', gap: room.rowGap }}>
          <span
            style={{
              ...textStyle.mRegular,
              display: 'flex',
              gap: room.senderGap,
              flex: 1,
              minWidth: 0,
              color: bodyColor,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {/* The sender is dropped in selection mode: the row is about which
                rooms are picked, not who spoke last, and Figma drops it too. */}
            {sender != null && (
              <span style={{ ...textStyle.mMedium, flexShrink: 0, color: bodyColor }}>
                {sender}:
              </span>
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {typeof preview === 'string' ? (
                <HighlightedText query={query}>{preview}</HighlightedText>
              ) : (
                preview
              )}
            </span>
          </span>

          {/* The schedule mark outlives selection: it says a message is queued
              to send, which stays true while the room is ticked and stops being
              true only once that message has gone out. Nothing the selection
              flow does should clear it. */}
          {/* Keeps its purple on a selected card, unlike the counter beside
              it. The purple is what identifies the scheduling flow wherever it
              appears, and recolouring it per card state would make the mark
              mean "scheduled, on a blue row" rather than simply "scheduled". */}
          {(() => {
            const defaultRender = () => (
              <>
                {/* Keeps its purple on a selected card, unlike the counter
                    beside it. The purple is what identifies the scheduling
                    flow wherever it appears. */}
                {scheduled && !disabled && <ScheduleMark />}

                {/* The counter survives being ticked: selecting a room is not
                    reading it — only marking it read is, and that is what
                    drops `unread` to zero. Hiding it on selection would say
                    the messages had been dealt with before anyone confirmed. */}
                {unread > 0 && (
                  <CounterBadge
                    count={unread}
                    // On the filled card the badge inverts, or the brand-blue
                    // disc disappears into the brand-blue card.
                    background={highlighted ? color.main.white : undefined}
                    textColor={highlighted ? color.badge.foreground : undefined}
                    label="unread messages"
                  />
                )}
              </>
            );

            return renderTrailing
              ? renderTrailing({ unread, selecting, checked, scheduled, defaultRender })
              : defaultRender();
          })()}
        </span>
      </span>
    </button>
  );
});
