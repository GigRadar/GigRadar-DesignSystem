import { spacing } from '@gigradar/theme';
import {
  InboxList,
  InboxRoom,
  MarkAsReadButton,
  PlanBadge,
  SelectionBar,
  VStack,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { accounts, rooms } from '../../fixtures/inbox';
import { Caption, Column } from './parts';

/** The column at its real height, matching the other Inbox previews. */
const COLUMN_HEIGHT = 734;

/** The rooms carrying a queued message in the flow demo. */
const SCHEDULED = ['r1', 'r3'];

/**
 * Left ▸ Mark as read — Figma nodes 3935:31772 and 3980:25204, with the flow
 * documented at 8487:27438 in the CRM file.
 *
 * The bar and the button inside it are one page: the button is the only
 * control the bar has, and it is also what summons the bar in the first place.
 * Documenting them apart would put the two halves of one action on two pages.
 */
export function MarkAsReadPage() {
  const [ticked, setTicked] = useState<string[]>(['r2']);
  const [armed, setArmed] = useState(false);

  /** The live column, so the whole flow can be walked rather than just read. */
  const [selecting, setSelecting] = useState(true);
  const [picked, setPicked] = useState<string[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [sent, setSent] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        title="Mark as read"
        description="Selecting rooms and marking them read — the bar, and the button that arms it. Figma nodes 3935:31772 (bar) and 3980:25204 (button), flow at 8487:27438."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Cards', pageId: 'crm-inbox-cards' },
          { label: 'Left ▸ Advanced Searchbar', pageId: 'crm-inbox-searchbar' },
        ]}
      >
        The bar's confirm control is <strong>MarkAsReadButton</strong>, the same component the
        search row draws to arm selection mode — glyph-only there, labelled here. The cards it
        selects are <strong>InboxRoom</strong> in its `selecting` state.
      </CrossLink>

      <Section
        title="The flow"
        description="Arming selection puts a tick on the leading edge of every card and a bar above the list. The button that armed it becomes a ✕ in the same place, because it is the same control seen from the other side — putting the exit anywhere else leaves the person hunting for the way back."
      >
        <Frame height={COLUMN_HEIGHT} hug>
          <InboxList
            badge={<PlanBadge tone="pro" />}
            accounts={accounts}
            connection="online"
            selectionMode={selecting}
            onSelectionModeChange={(active) => {
              setSelecting(active);
              if (!active) setPicked([]);
            }}
            selectionBar={
              <SelectionBar
                selectedCount={picked.length}
                totalCount={rooms.length}
                onSelectAll={() => setPicked(rooms.map((room) => room.id))}
                onClearSelection={() => setPicked([])}
                onMarkAsRead={() => {
                  setRead((current) => [...current, ...picked]);
                  setPicked([]);
                  setSelecting(false);
                }}
              />
            }
          >
            {rooms.map((room) => (
              <InboxRoom
                key={room.id}
                title={room.title}
                sender={room.sender}
                preview={room.preview}
                timestamp={room.timestamp}
                stage={room.stage}
                name={room.name}
                avatarSrc={room.avatarSrc}
                unread={read.includes(room.id) ? 0 : room.unread}
                // Two rooms carry a queued message, to show that selecting and
                // marking read leave the schedule mark alone — only the message
                // actually going out clears it.
                scheduled={SCHEDULED.includes(room.id) && !sent.includes(room.id)}
                selecting={selecting}
                checked={picked.includes(room.id)}
                onClick={() =>
                  setPicked((current) =>
                    current.includes(room.id)
                      ? current.filter((id) => id !== room.id)
                      : [...current, room.id],
                  )
                }
              />
            ))}
          </InboxList>
        </Frame>
        <Caption>
          Live. Tick a card or two, then "Mark as read" — the unread badges clear and the column
          leaves selection mode. "Select all" flips to "Unselect all" once everything is ticked, and
          the ✕ beside the search field backs out without changing anything. Note the counters and
          the purple clocks stay put while a card is ticked: selecting a room is not reading it, and
          a queued message is still queued.
        </Caption>
        <CodeBlock
          code={`<InboxList
  selectionMode={selecting}
  onSelectionModeChange={setSelecting}
  selectionBar={
    <SelectionBar
      selectedCount={picked.length}
      totalCount={rooms.length}
      onSelectAll={selectAll}
      onMarkAsRead={markRead}
    />
  }
>
  {rooms.map((room) => (
    <InboxRoom key={room.id} {...room} selecting checked={picked.includes(room.id)} />
  ))}
</InboxList>`}
        />
      </Section>

      <Section
        title="What selection does not clear"
        description="A ticked card keeps its unread counter and its schedule mark. Selecting a room is not reading it — only “Mark as read” is — and a queued message stays queued until it actually goes out. The two have separate lifetimes and separate actions, so neither should vanish because the other happened."
      >
        <Frame height="auto" hug>
          <Column>
            <InboxRoom
              title={rooms[0].title}
              sender={rooms[0].sender}
              preview={rooms[0].preview}
              timestamp={rooms[0].timestamp}
              stage={rooms[0].stage}
              name={rooms[0].name}
              avatarSrc={rooms[0].avatarSrc}
              unread={3}
              scheduled
              selecting
              checked={false}
            />
            <InboxRoom
              title={rooms[0].title}
              sender={rooms[0].sender}
              preview={rooms[0].preview}
              timestamp={rooms[0].timestamp}
              stage={rooms[0].stage}
              name={rooms[0].name}
              avatarSrc={rooms[0].avatarSrc}
              unread={3}
              scheduled
              selecting
              checked
            />
            <InboxRoom
              title={rooms[1].title}
              sender={rooms[1].sender}
              preview={rooms[1].preview}
              timestamp={rooms[1].timestamp}
              stage={rooms[1].stage}
              name={rooms[1].name}
              avatarSrc={rooms[1].avatarSrc}
              unread={0}
              scheduled
            />
          </Column>
        </Frame>
        <Caption>
          Unticked and ticked with both marks intact. The counter inverts so it stays legible on
          the fill; the clock keeps its purple, because that purple is what identifies the
          scheduling flow wherever it appears. The last row is after marking read: the counter is
          gone because `unread` dropped to zero, and the clock remains because the message has not
          been sent.
        </Caption>
        <CodeBlock
          code={`// Selecting changes neither. Each is cleared by its own action:
<InboxRoom unread={read ? 0 : room.unread} scheduled={queued && !sent} selecting checked />`}
        />
      </Section>

      <Section
        title="The bar"
        description="Figma's three states — Unselected, Selected, Select all — are all derived from the count, so this takes `selectedCount` rather than a state prop. The count is what a consumer already has, and deriving beats duplicating it."
      >
        <Frame height="auto" hug>
          <Column>
            <VStack gap={16}>
              <SelectionBar
                selectedCount={0}
                totalCount={rooms.length}
                onSelectAll={() => undefined}
              />
              <SelectionBar
                selectedCount={ticked.length}
                totalCount={rooms.length}
                onSelectAll={() => setTicked(rooms.map((room) => room.id))}
                onClearSelection={() => setTicked([])}
                onMarkAsRead={() => setTicked([])}
              />
              <SelectionBar selectedCount={rooms.length} totalCount={rooms.length} />
            </VStack>
          </Column>
        </Frame>
        <Caption>
          Nothing selected, some selected, everything selected. The confirm button is dimmed at
          zero — there is nothing to mark — and the leading action flips to "Unselect all" at the
          bottom, since selecting all again would do nothing.
        </Caption>
        <CodeBlock
          code={`<SelectionBar
  selectedCount={ticked.length}
  totalCount={rooms.length}
  onSelectAll={selectAll}
  onMarkAsRead={markRead}
/>`}
        />
      </Section>

      <Section
        title="The button"
        description="Glyph-only in the search row, where the field needs the width; labelled inside the bar, where there is room. Figma's “Clicked” state fills the pill blue — that is the difference between offering the action and being mid-action — and `cancel` swaps the double-check for the ✕ that leaves selection mode."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', gap: spacing.m, padding: spacing.l, alignItems: 'center' }}>
            <MarkAsReadButton active={armed} onClick={() => setArmed(!armed)} />
            <MarkAsReadButton active cancel />
            <MarkAsReadButton label="Mark as read" />
            <MarkAsReadButton label="Mark as read" active />
            <MarkAsReadButton label="Mark as read" disabled />
          </div>
        </Frame>
        <Caption>
          Resting (click to arm), the armed ✕ that cancels, then the labelled forms: offered, armed,
          and disabled with nothing selected.
        </Caption>
        <CodeBlock
          code={`<MarkAsReadButton active={selecting} cancel={selecting} onClick={toggle} />
<MarkAsReadButton label="Mark as read" active onClick={confirm} />`}
        />
      </Section>
    </>
  );
}
