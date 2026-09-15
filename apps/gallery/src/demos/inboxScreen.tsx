import {
  BubbleChat,
  ChatHeader,
  ChatRoom,
  Composer,
  defaultChatFilters,
  InboxList,
  InboxRoom,
  InboxScreen,
  MeetingBubble,
  PlanBadge,
  RoomDivider,
  RoomEvent,
  RoomMessage,
  RoomNotice,
  ScheduledBadge,
  ScheduleMessageModal,
  Sender,
  type InboxPane,
  type StageName,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { accounts, chatRoom, clientDetails, rooms, upcomingMeeting } from '../fixtures/inbox';
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
  // The composer's own two modes, and the scheduler it can open. Held here
  // rather than left undriven: an inert Message/Note pair and a missing clock
  // are the difference between the room the product ships and a picture of it.
  const [composerMode, setComposerMode] = useState<'message' | 'note'>('message');
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleAt, setScheduleAt] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleZone, setScheduleZone] = useState('you');
  const [autoCancel, setAutoCancel] = useState(true);

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
          mode={composerMode}
          onModeChange={setComposerMode}
          hasDraft={draft.length > 0}
          chooseBm={{ name: 'Marina Ovcharenko', tone: 'volcano' }}
          onSend={noop}
          // Passing this is what draws the clock beside send. The Inbox is the
          // Chat Room in its third column, so it gets the whole composer —
          // both modes and both send actions — not a reduced one.
          onSchedule={() => setScheduleOpen(true)}
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
        {/* The call that came out of that message. A meeting is a thing the room
            arranged, so it belongs in the thread beside the message proposing
            it — the right pane lists it again as a booking, which is a
            different question ("what is coming up") than this one ("what did we
            agree to"). */}
        <MeetingBubble
          side="own"
          state="booked"
          time={upcomingMeeting.sentAt}
          details={[
            { label: 'Date', value: upcomingMeeting.date },
            { label: 'Time', value: upcomingMeeting.time },
            { label: 'Link', value: upcomingMeeting.link, href: upcomingMeeting.link },
          ]}
        />
      </RoomMessage>
      {/* The room says it has messages waiting to go out. Drawn at the foot of
          the thread rather than in the header: it is about this conversation's
          queue, and the header already carries what the room *is*. */}
      <ScheduledBadge place="room" autoCancel={autoCancel} onNavigate={noop} />
    </ChatRoom>
  );

  return (
    <>
      <InboxScreen
        layout={layout}
        pane={pane}
        list={list}
        room={room}
        details={<DetailsColumn />}
      />
      {/* Outside the screen rather than inside the room: the picker is a modal
          over the whole window in the product, and nesting it in a column would
          trap it in that column's stacking context. */}
      <ScheduleMessageModal
        open={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        date={scheduleAt}
        onDateChange={setScheduleAt}
        time={scheduleTime}
        onTimeChange={setScheduleTime}
        timezones={[
          { id: 'you', label: 'You', offset: '(UTC+08:00)', avatar: { initials: 'MO', tone: 'purple' } },
          { id: 'client', label: 'Client', offset: '(UTC+06:00)', avatar: { initials: 'FM', tone: 'purple' } },
        ]}
        timezoneId={scheduleZone}
        onTimezoneChange={setScheduleZone}
        autoCancel={autoCancel}
        onAutoCancelChange={setAutoCancel}
        onSchedule={() => setScheduleOpen(false)}
      />
    </>
  );
}
