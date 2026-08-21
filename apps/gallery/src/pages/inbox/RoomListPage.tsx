import { spacing } from '@gigradar/theme';
import {
  ConnectionIndicator,
  InboxScreen,
  InboxEmpty,
  InboxList,
  InboxLoading,
  InboxOnboarding,
  InboxRoom,
  PlanBadge,
  SelectionBar,
} from '@gigradar/ui';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { accounts, clients, rooms, stages } from '../../fixtures/inbox';
import { Caption } from './parts';

/** The column at its real height, so each state reads as the screen does. */
const COLUMN_HEIGHT = 734;

/**
 * The column, with only the props a given state needs.
 *
 * Every preview on this page is the same `InboxList` — that is the point of
 * the page — so the shared setup lives here rather than being repeated six
 * times with one line different each.
 */
function ColumnPreview({ children, ...rest }: ComponentProps<typeof InboxList>) {
  return (
    <Frame height={COLUMN_HEIGHT} hug>
      <InboxList badge={<PlanBadge tone="pro" />} accounts={accounts} {...rest}>
        {children}
      </InboxList>
    </Frame>
  );
}

/**
 * The sample rooms, filtered and highlighted the way the real screen does.
 *
 * Filtering lives here rather than in `InboxList` because the list takes its
 * rooms as children: which conversations exist is the consumer's data, and the
 * column only reports which account was picked.
 */
function SampleRooms({
  selected,
  onSelect,
  accountId = 'all',
  query = '',
}: {
  selected: string;
  onSelect: (id: string) => void;
  accountId?: string;
  query?: string;
}): ReactNode {
  const term = query.trim().toLowerCase();

  return rooms
    .filter((room) => accountId === 'all' || room.accountId === accountId)
    .filter(
      (room) =>
        term === '' ||
        room.title.toLowerCase().includes(term) ||
        room.preview.toLowerCase().includes(term),
    )
    .map((room) => {
      const account = accounts.find((item) => item.id === room.accountId);
      return (
        <InboxRoom
          key={room.id}
          title={room.title}
          query={query}
          sender={room.sender}
          preview={room.preview}
          timestamp={room.timestamp}
          stage={room.stage}
          name={room.name}
          avatarSrc={room.avatarSrc}
          unread={room.unread}
          account={account && { name: account.name, avatarSrc: account.avatarSrc }}
          selected={selected === room.id}
          onClick={() => onSelect(room.id)}
        />
      );
    });
}

/**
 * CRM ▸ Inbox ▸ List of Room (Left).
 *
 * The assembled column in each of the six states Figma draws for it (node
 * 382:3823). The card those states are made of has its own page, and each
 * control above the list has its own SubNav page — this one is about the
 * column as a whole: what fills it, and what it shows when nothing does.
 */
export function RoomListPage() {
  const [selected, setSelected] = useState('r1');
  const [query, setQuery] = useState('');
  const [account, setAccount] = useState('all');
  const [selectionMode, setSelectionMode] = useState(false);
  const [ticked, setTicked] = useState<string[]>([]);
  const [pane, setPane] = useState<'list' | 'room'>('list');

  return (
    <>
      <PageHeader
        title="List of Room (Left)"
        description="The inbox's left column — the room cards and the controls stacked above them, in each of its six states. Figma node 382:3823."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Cards', pageId: 'crm-inbox-cards' },
          { label: 'Inbox Selector', pageId: 'crm-inbox-selector' },
          { label: 'Mark as read', pageId: 'crm-inbox-markasread' },
          { label: 'Advanced Searchbar', pageId: 'crm-inbox-searchbar' },
          { label: 'Websocket indicators', pageId: 'crm-inbox-websocket' },
        ]}
      >
        <strong>InboxList</strong> draws the frame — header, account picker, search band, and the
        connection pill pinned to the foot — and takes whatever fills it as children. Each control
        above the list is a SubNav with its own page; the room card has one too.
      </CrossLink>

      <Section
        title="Default"
        description="The column doing its job: an account selected, rooms listed, one of them open. Figma's Default and “Load Rooms” differ only in how many rooms there are to scroll, so they are one state here — the list scrolls whenever its children outgrow it."
      >
        <ColumnPreview
          query={query}
          onQueryChange={setQuery}
          account={account}
          onAccountChange={setAccount}
          connection="online"
          searchPanel={{ clients, stages }}
          onConnectAccount={() => undefined}
          selectionMode={selectionMode}
          onSelectionModeChange={(active) => {
            setSelectionMode(active);
            if (!active) setTicked([]);
          }}
          selectionBar={
            <SelectionBar
              selectedCount={ticked.length}
              totalCount={rooms.length}
              onSelectAll={() => setTicked(rooms.map((room) => room.id))}
              onClearSelection={() => setTicked([])}
              onMarkAsRead={() => {
                setTicked([]);
                setSelectionMode(false);
              }}
            />
          }
        >
          <SampleRooms
            selected={selected}
            onSelect={setSelected}
            accountId={account}
            query={query}
          />
        </ColumnPreview>
        <Caption>
          Fully live. Pick an account and the list narrows to its rooms — the mini avatar on each
          card is the same fact read the other way, saying who handles that conversation when every
          account's rooms are interleaved. Type in the search field and matches highlight in the
          title and preview.
        </Caption>
        <CodeBlock
          code={`<InboxList
  accounts={accounts}
  query={query}
  onQueryChange={setQuery}
  connection="online"
  searchPanel={{ clients, stages }}
>
  {rooms.map((room) => (
    <InboxRoom key={room.id} {...room} selected={room.id === selected} />
  ))}
</InboxList>`}
        />
      </Section>

      <Section
        title="Empty or not found"
        description="One component for both “you have no conversations” and “your search matched none”: the card is identical and only the words differ. It centres in the list rather than sitting under the search field, because an empty state hugging the field reads as a result."
      >
        <ColumnPreview connection="online">
          <InboxEmpty />
        </ColumnPreview>
        <Caption>Pass `title` and `description` for the search-specific wording.</Caption>
        <CodeBlock
          code={`<InboxList accounts={accounts}>
  <InboxEmpty title="No matches" description="Nothing matched “webflow”." />
</InboxList>`}
        />
      </Section>

      <Section
        title="Searching"
        description="The list while a query narrows it. Nothing structural changes — the same rooms, filtered — which is why Figma's Searching frame is the default column with fewer cards in it."
      >
        <ColumnPreview query="Developer" connection="online" searchPanel={{ clients, stages }}>
          <SampleRooms selected="" onSelect={() => undefined} query="Developer" />
        </ColumnPreview>
        <Caption>
          Matches are marked with the highlight token wherever they fall — title or preview — so the
          card says why it survived the filter. Drawn as `&lt;mark&gt;`, which carries that to a
          screen reader too.
        </Caption>
        <CodeBlock code={`<InboxRoom title={room.title} preview={room.preview} query={query} />`} />
      </Section>

      <Section
        title="First load"
        description="`InboxLoading` greys out the whole column — controls included — because on a cold start there is no account name or unread count to put in them yet. Its rows reuse `InboxRoom`'s own loading state, so the placeholder and the real card cannot drift in height."
      >
        <ColumnPreview showSearch={false} connection="syncing">
          <InboxLoading includeControls />
        </ColumnPreview>
        <Caption>
          The list must not reflow when content lands, which is the whole reason the placeholder
          matches the card's height exactly.
        </Caption>
        <CodeBlock
          code={`<InboxList showSearch={false} connection="syncing">
  <InboxLoading includeControls />
</InboxList>`}
        />
      </Section>

      <Section
        title="Onboarding"
        description="The first run, while the workspace is still being built. Distinct from the loading state: that one waits on a request returning in a moment, this one waits on a job long enough to need its stages named. Skeleton rows here would promise rooms that are not coming yet."
      >
        <ColumnPreview connection="syncing">
          <InboxOnboarding />
        </ColumnPreview>
        <Caption>
          Pass `steps` to drive the track as each stage completes; the default run is Prepare,
          Import, Done.
        </Caption>
        <CodeBlock
          code={`<InboxOnboarding
  steps={[
    { label: 'Prepare', state: 'done' },
    { label: 'Import', state: 'active' },
    { label: 'Done' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="On a phone"
        description="One pane at a time. The list fills the screen until a room is opened, then the room replaces it and its header's back chevron returns. `InboxScreen` owns that decision rather than each pane checking its own width — the panes are identical at either size, and what differs is how many are on screen."
      >
        <Frame height={640} hug>
          <div style={{ width: 379, height: 620, display: 'flex' }}>
            <InboxScreen
              layout="mobile"
              pane={pane}
              list={
                <InboxList fluid accounts={accounts} connection="online">
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
                      unread={room.unread}
                      onClick={() => setPane('room')}
                    />
                  ))}
                </InboxList>
              }
              room={
                <div style={{ padding: spacing.m }}>
                  <button type="button" onClick={() => setPane('list')} style={{ font: 'inherit' }}>
                    ‹ Back to list
                  </button>
                  <p>The conversation goes here — see Chat Room (Mid).</p>
                </div>
              }
            />
          </div>
        </Frame>
        <Caption>
          Tap a room to move to it, then back. Rendering all three panes and hiding two with CSS
          would keep three scroll positions alive and let a hidden pane trap the keyboard, so the
          ones not showing are simply not rendered.
        </Caption>
        <CodeBlock
          code={`<InboxScreen
  layout={isPhone ? 'mobile' : 'desktop'}
  pane={pane}
  list={<InboxList fluid={isPhone}>{rooms}</InboxList>}
  room={<ChatRoom onBack={() => setPane('list')} />}
/>`}
        />
      </Section>

      <Section
        title="Connection"
        description="Four states rather than a boolean, because “not receiving messages” means three different things to the person reading it: offline is expected, error is not, and syncing is temporary. Only error asks for action."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', gap: spacing.m, padding: spacing.l, flexWrap: 'wrap' }}>
            <ConnectionIndicator state="online" />
            <ConnectionIndicator state="offline" />
            <ConnectionIndicator state="error" />
            <ConnectionIndicator state="syncing" />
          </div>
        </Frame>
        <Caption>Drawn here on its own; in the column it floats at the foot, over the list.</Caption>
        <CodeBlock code={`<InboxList connection="online">…</InboxList>`} />
      </Section>
    </>
  );
}
