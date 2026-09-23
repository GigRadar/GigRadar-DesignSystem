import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Avatar } from '../Avatar/Avatar.js';
import { StagePill } from '../Inbox/StagePill.js';

const { card } = component.dashboard;

/** Per-instance overrides for a card's own metrics. */
export type KanbanCardStyleProps = {
  padding?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  background?: string;
};

/** Someone on the lead's conversation, as the card stacks them. */
export type KanbanCardParticipant = {
  id: string;
  name: string;
  avatarSrc?: string;
};

export type KanbanCardProps = {
  /** The job the lead came from. Wraps to two lines, then clips. */
  title: ReactNode;
  /** The last thing that happened — "Proposal viewed 6 days ago". */
  activity?: ReactNode;
  /**
   * Who is on the conversation. The avatars overlap and the names run beside
   * them as one line, clipped — the row says "these people", and a card 158px
   * wide cannot say more than that.
   */
  participants?: KanbanCardParticipant[];
  /** The lead's stage — the pill on the card's foot. */
  stage?: { label: ReactNode; tone: string };
  /** The deal's value, already formatted. */
  amount?: ReactNode;
  /** Marks the card as the one being dragged. @default false */
  dragging?: boolean;
  onClick?: () => void;
} & KanbanCardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One lead, as it sits in a pipeline column.
 *
 * Figma: "Card Kanban" (node 1994:5317).
 *
 * Built by hand rather than from the inbox's room card: the two show the same
 * lead but answer different questions. A room card is about a conversation —
 * who wrote last, when, whether it is unread — and this card is about a deal:
 * what it is worth and which stage it is in. They share the stage pill and the
 * avatars, which is exactly what is reused here.
 *
 * The type scale is a step below the rest of the CRM (12px title, 11px
 * activity) because six of these columns sit side by side; at the inbox's
 * sizes a board would hold two cards before scrolling.
 */
export const KanbanCard = forwardRef<HTMLDivElement, KanbanCardProps>(function KanbanCard(
  {
    title,
    activity,
    participants = [],
    stage,
    amount,
    dragging = false,
    onClick,
    padding,
    gap,
    radius: cardRadius,
    background,
    ...rest
  },
  ref,
) {
  const names = participants.map((person) => person.name).join(', ');

  return (
    <div
      ref={ref}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: len(gap) ?? card.gap,
        boxSizing: 'border-box',
        width: '100%',
        // A card keeps its full height inside a board that has run out of
        // room. Without this the column's flex shrinks every card by the
        // overflow divided between them, which cuts the stage and the amount
        // off the bottom of each one rather than scrolling the last one out
        // of view.
        flexShrink: 0,
        padding: len(padding) ?? card.padding,
        borderRadius: len(cardRadius) ?? card.radius,
        backgroundColor: background ?? color.main.white,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : undefined,
        // The dragged card lifts and fades rather than leaving a hole: the
        // column keeps its height while the card is in the air, so the boards
        // either side do not reflow under the pointer.
        opacity: dragging ? card.draggingOpacity : 1,
        transform: dragging ? `rotate(${card.draggingTilt})` : undefined,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: card.tightGap }}>
        <span
          style={{
            ...textStyle.sMedium,
            color: color.main.black,
            display: '-webkit-box',
            WebkitLineClamp: card.titleLines,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </span>

        {activity != null && (
          <span
            style={{
              ...textStyle.sRegular,
              fontSize: card.activityFontSize,
              color: color.navbar.text2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {activity}
          </span>
        )}

        {participants.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: card.avatarGap, minWidth: 0 }}>
            <span style={{ display: 'inline-flex', flexShrink: 0 }}>
              {/* The overlap is a margin on the wrapper rather than on the
                  avatar itself: `Avatar` takes style props for its own
                  metrics, not for how it is placed, and a component that
                  positioned itself could not be stacked any other way. */}
              {participants.map((person, index) => (
                <span
                  key={person.id}
                  style={{
                    display: 'inline-flex',
                    marginRight: index < participants.length - 1 ? card.avatarOverlap : undefined,
                  }}
                >
                  <Avatar
                    name={person.name}
                    src={person.avatarSrc}
                    diameter={card.avatarSize}
                  />
                </span>
              ))}
            </span>
            <span
              title={names}
              style={{
                ...textStyle.sRegular,
                color: color.navbar.text,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {names}
            </span>
          </div>
        )}
      </div>

      {(stage != null || amount != null) && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: card.tightGap }}>
          {stage != null && (
            <StagePill
              tone={stage.tone}
              fontSize={card.stagePillFontSize}
              paddingX={card.stagePillPaddingX}
              paddingY={card.stagePillPaddingY}
            >
              {stage.label}
            </StagePill>
          )}
          {amount != null && (
            <span
              style={{
                ...textStyle.mSemibold,
                color: color.main.brand,
                marginLeft: 'auto',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {amount}
            </span>
          )}
        </div>
      )}
    </div>
  );
});
