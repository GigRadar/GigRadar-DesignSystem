import { color, spacing, textStyle } from '@gigradar/theme';
import { InboxList, InboxRoom, PlanBadge, SelectionBar } from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Frame } from '../components/Frame';
import { PageHeader, Section } from '../layout';
import { CrossLink } from '../navigation';
import { accounts, clients, rooms, stages } from '../fixtures/inbox';

/** A caption under a demo, matching the other gallery pages. */
function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/**
 * CRM ▸ Inbox.
 *
 * The screen as it is assembled, with the pieces documented on their own under
 * the children of this page. The left column is what exists today; the message
 * thread and the client panel beside it are still to be built.
 */
export function InboxPage() {
  const [selected, setSelected] = useState('r1');
  const [query, setQuery] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [ticked, setTicked] = useState<string[]>([]);

  return (
    <>
      <PageHeader
        title="Inbox"
        description="The CRM's conversation screen — the room list, its filters, and the connection indicator. Figma node 1362:26728."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'CRM ▸ Inbox ▸ List of Room (Left)', pageId: 'crm-inbox-left' },
          { label: 'Left ▸ Inbox Selector', pageId: 'crm-inbox-selector' },
          { label: 'Left ▸ Searchbar', pageId: 'crm-inbox-searchbar' },
          { label: 'Components ▸ Main ▸ Date picker', pageId: 'date-picker' },
        ]}
      >
        This page shows the screen assembled. <strong>List of Room (Left)</strong> is the column, and
        SubNav Figma draws inside it — the account picker, mark as read, the searchbar, and the
        websocket indicator — is documented beneath it, nested the way Figma nests them.
      </CrossLink>

      <Section
        title="The column"
        description="`InboxList` draws the frame — header, account picker, search band, and the connection pill pinned to the foot — and takes the rooms as children. The six states Figma draws (loading, empty, searching, onboarding) are what the consumer passes in, not variants of the frame."
      >
        <Frame height={734} hug>
          <InboxList
            badge={<PlanBadge tone="pro" />}
            accounts={accounts}
            query={query}
            onQueryChange={setQuery}
            connection="online"
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
            searchPanel={{ clients, stages }}
            onConnectAccount={() => undefined}
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
                unread={room.unread}
                selected={selectionMode ? ticked.includes(room.id) : selected === room.id}
                onClick={() =>
                  selectionMode
                    ? setTicked((current) =>
                        current.includes(room.id)
                          ? current.filter((id) => id !== room.id)
                          : [...current, room.id],
                      )
                    : setSelected(room.id)
                }
              />
            ))}
          </InboxList>
        </Frame>
        <Caption>
          Click the double-check to enter selection mode; focus the search field to open the filter
          panel.
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
    </>
  );
}
