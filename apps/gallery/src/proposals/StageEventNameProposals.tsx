import { color, textStyle } from '@gigradar/theme';
import { RoomEvent, Tooltip } from '@gigradar/ui';
import type { HTMLAttributes, ReactNode } from 'react';

/**
 * Three proposals for what a stage event does when the name is too long.
 *
 * Figma node 8945:23018, state "Stage Transition - Max Width". Every other
 * state on that page is already drawn by the shipped `RoomEvent`; this is the
 * one it gets wrong. Today the sentence wraps, so a long name pushes "by" onto
 * a second line and the event grows to two rows in the middle of the thread.
 * Figma's note says the name "truncates with an ellipsis to fit the space".
 *
 * What is actually being chosen is what happens to the name that no longer
 * fits — whether the reader can still recover it, and at what cost. That is one
 * question, and it is the only thing these three disagree about. The ellipsis
 * itself is settled; who pays for it is not.
 *
 * Nothing below is a new primitive. All three are `RoomEvent` with its `by`
 * slot filled differently, because the sentence, the badges and the timestamp
 * are already right in every state including this one.
 */

/**
 * The event every proposal draws, so the comparison is between the three
 * treatments of the name rather than between three different sentences.
 *
 * The name is the one from the Figma frame — long enough to overflow the
 * desktop thread at 788px, which is the width the room actually draws at.
 */
const EVENT = {
  from: 'new' as const,
  to: 'interested' as const,
  time: '8:47',
  name: 'Christian Samuel Racing Tan Wijaya Winangun',
};

/**
 * A short name, drawn under every proposal.
 *
 * A truncation rule that is invisible until it fires is half the design: the
 * reviewer needs to see that the common case is untouched, or they are picking
 * a rule they have only seen in its failure state.
 */
const SHORT_NAME = 'Jane Cooper';

/**
 * The name at its cap, clipped with an ellipsis.
 *
 * Spreads whatever else it is handed onto the span. `Tooltip` anchors by
 * cloning its child with `onMouseEnter` and friends, so a component that takes
 * only its own props drops them without a word and the tooltip never opens.
 */
function TruncatedName({
  children,
  maxWidth,
  ...rest
}: { children: ReactNode; maxWidth: number } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      {...rest}
      style={{
        ...textStyle.mMedium,
        color: color.navbar.text2,
        display: 'inline-block',
        maxWidth,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        // The name sits in a sentence whose other words sit on the baseline;
        // an inline-block with hidden overflow drops to the bottom of its box
        // without this, so the name rides low against "by".
        verticalAlign: 'bottom',
      }}
    >
      {children}
    </span>
  );
}

export const PROPOSALS: {
  number: number;
  approach: string;
  rationale: string;
  render: () => ReactNode;
}[] = [
  {
    number: 1,
    approach: 'Ellipsis, and the name is gone',
    rationale:
      'Exactly what the Figma note specifies: one line, always, whatever the name. Cheapest to build and the only one with no interaction to get wrong. The cost is real — two clients called “Christian Samuel …” are the same string in the thread, and nothing recovers the rest. Fine if the reader already knows who is in the room, which on a two-person thread they usually do.',
    render: () => (
      <>
        <RoomEvent
          kind="stage"
          from={EVENT.from}
          to={EVENT.to}
          time={EVENT.time}
          by={<TruncatedName maxWidth={180}>{EVENT.name}</TruncatedName>}
        />
        <RoomEvent
          kind="stage"
          from={EVENT.from}
          to={EVENT.to}
          time={EVENT.time}
          by={<TruncatedName maxWidth={180}>{SHORT_NAME}</TruncatedName>}
        />
      </>
    ),
  },
  {
    number: 2,
    approach: 'Ellipsis, with the full name on hover',
    rationale:
      'Same single line, but the name is recoverable — hover or focus the clipped name and the tooltip carries it in full. Costs an interactive element in a row that is currently inert, and it is only discoverable by trying it; a touch reader gets the truncated name and nothing else. Worth it if threads regularly carry people whose names the reader does not already know.',
    render: () => (
      <>
        <RoomEvent
          kind="stage"
          from={EVENT.from}
          to={EVENT.to}
          time={EVENT.time}
          by={
            <Tooltip content={EVENT.name} placement="top">
              <TruncatedName maxWidth={180}>{EVENT.name}</TruncatedName>
            </Tooltip>
          }
        />
        {/* A name that fits gets no tooltip: a hover target on a string that is
            already fully visible promises information it does not have. */}
        <RoomEvent
          kind="stage"
          from={EVENT.from}
          to={EVENT.to}
          time={EVENT.time}
          by={<TruncatedName maxWidth={180}>{SHORT_NAME}</TruncatedName>}
        />
      </>
    ),
  },
  {
    number: 3,
    approach: 'Let it wrap, clamped at two lines',
    rationale:
      'Keeps the whole name, and gives up the one-line row for it — the event becomes two lines when a name is long, and only clips past the second. Nothing is hidden and there is nothing to hover, which is the only one of the three that works the same on a phone. The cost is the thread: a run of these breaks the rhythm of the message column, and “Multiple” stacks three of them.',
    render: () => (
      <>
        <RoomEvent
          kind="stage"
          from={EVENT.from}
          to={EVENT.to}
          time={EVENT.time}
          by={
            <span
              style={{
                ...textStyle.mMedium,
                color: color.navbar.text2,
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                maxWidth: 240,
              }}
            >
              {EVENT.name}
            </span>
          }
        />
        <RoomEvent
          kind="stage"
          from={EVENT.from}
          to={EVENT.to}
          time={EVENT.time}
          by={SHORT_NAME}
        />
      </>
    ),
  },
];
