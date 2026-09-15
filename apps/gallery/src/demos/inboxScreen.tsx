import {
  BubbleChat,
  ChatHeader,
  ChatRoom,
  Composer,
  defaultChatFilters,
  InboxList,
  InboxRoom,
  InboxScreen,
  PlanBadge,
  RoomDivider,
  RoomEvent,
  RoomMessage,
  RoomNotice,
  Sender,
  type InboxPane,
  type StageName,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { accounts, chatRoom, clientDetails, rooms } from '../fixtures/inbox';
import { DetailsColumn } from '../pages/inbox/DetailsPage';

const noop = () => undefined;

/**
 * The Inbox with all three columns, from the same fixtures.
 *
 * The point of the demo is that the three describe one conversation: the room
 * selected in the left column is the thread in the middle and the client in the
 * right. Built from the shipped components — `InboxScreen` decides how many
 * columns are on screen, and the columns themselves are the same at either
 * width.
 *
 * A single export rather than a page-local helper because both the Inbox page
 * and the Details page draw it, and two copies would drift the moment one of
 * them gained a section.
 */
export function AssembledInbox({
  layout = 'desktop',
  events,
  previewOverrides,
}: {
  layout?: 'desktop' | 'mobile';
  /**
   * Replaces the stage event in the middle of the thread.
   *
   * Passed rather than built here because the states page draws the same screen
   * five times and only this line differs between them. Omitted, the thread
   * keeps the single event it has always drawn, so the Inbox page is unchanged.
   */
  events?: ReactNode;
  /**
   * Replaces a room's last-message preview in the left column, keyed by room id.
   *
   * The list is built from one fixture shared by every page; a state that needs
   * one row to read differently overrides that row rather than forking the
   * fixture, so the other rows stay identical across the five frames.
   */
  previewOverrides?: Record<string, ReactNode>;
}) {
  const [selected, setSelected] = useState('r1');
  const [query, setQuery] = useState('');
  const [pane, setPane] = useState<InboxPane>('list');
  const [stage, setStage] = useState<StageName>('interested');
  const [stageOpen, setStageOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [shownFilters, setShownFilters] = useState<string[]>([
    'customEvents',
    'roomEvents',
    'notesAndAiReplies',
  ]);
  const [draft, setDraft] = useState('');

  const actions = { onEdit: noop, onDelete: noop, onDownload: noop };

  const list = (
    <InboxList
      badge={<PlanBadge tone="pro" />}
      accounts={accounts}
      query={query}
      onQueryChange={setQuery}
      connection="online"
    >
      {rooms.map((room) => {
        const account = accounts.find((item) => item.id === room.accountId);
        return (
          <InboxRoom
            key={room.id}
            title={room.title}
            sender={room.sender}
            preview={previewOverrides?.[room.id] ?? room.preview}
            timestamp={room.timestamp}
            stage={room.stage}
            name={room.name}
            avatarSrc={room.avatarSrc}
            unread={room.unread}
            account={account && { name: account.name, avatarSrc: account.avatarSrc }}
            selected={selected === room.id}
            onClick={() => {
              setSelected(room.id);
              // On a phone, picking a room is what moves to it. On a desktop
              // every column is already on screen and this is ignored.
              setPane('room');
            }}
          />
        );
      })}
    </InboxList>
  );

  const room = (
    <ChatRoom
      header={
        <ChatHeader
          layout={layout}
          title={chatRoom.title}
          topic={chatRoom.topic}
          clientName={chatRoom.clientName}
          clientTone={chatRoom.clientTone}
          preset={chatRoom.preset}
          assignee={chatRoom.assignee}
          stage={stage}
          stageOpen={stageOpen}
          onStageClick={() => setStageOpen((open) => !open)}
          onStageChange={(next) => {
            setStage(next);
            setStageOpen(false);
          }}
          filters={defaultChatFilters}
          shownFilters={shownFilters}
          onFiltersChange={setShownFilters}
          filterOpen={filterOpen}
          onFilterClick={() => setFilterOpen((open) => !open)}
          onBack={layout === 'mobile' ? () => setPane('list') : undefined}
        />
      }
      composer={
        <Composer
          layout={layout}
          hasDraft={draft.length > 0}
          chooseBm={{ name: 'Marina Ovcharenko', tone: 'volcano' }}
          onSend={noop}
          field={{ value: draft, onValueChange: setDraft, maxLength: 5000 }}
        />
      }
    >
      <RoomNotice>
        Chat started on April 25, 2025, at 18:20. Marina Ovcharenko has accepted the job offer.
      </RoomNotice>
      <RoomDivider>Today</RoomDivider>
      <RoomMessage
        sender={<Sender name="Floyd Miles" avatar={{ src: clientDetails.avatarSrc }} />}
      >
        <BubbleChat time="08:30" actions={actions}>
          We were really impressed with your portfolio and how your expertise in Product UI/UX will
          be a great fit for our project.
        </BubbleChat>
      </RoomMessage>
      {events ?? (
        <RoomEvent kind="stage" from="new" to="interested" by="Jane Cooper" time="08:47" />
      )}
      {/* Jane carries initials rather than a photo, in the thread and in the
          details pane alike — the six sample faces are already spoken for, and
          giving her one of them would put the same face on two people in one
          screen. It is also the fallback worth seeing in a demo. */}
      <RoomMessage side="own" sender={<Sender side="own" name="Jane Cooper" avatar={{}} />}>
        <BubbleChat side="own" time="08:52" actions={actions}>
          Thank you! I&rsquo;d be glad to walk you through the flows I have in mind — is Wednesday
          still good for a call?
        </BubbleChat>
      </RoomMessage>
    </ChatRoom>
  );

  return (
    <InboxScreen
      layout={layout}
      pane={pane}
      list={list}
      room={room}
      details={<DetailsColumn />}
    />
  );
}
