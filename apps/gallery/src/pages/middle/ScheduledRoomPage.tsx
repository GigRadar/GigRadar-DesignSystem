import { color, spacing } from '@gigradar/theme';
import {
  AuthorBadge,
  AttachmentBubble,
  BubbleChat,
  ChatHeader,
  ChatRoom,
  Composer,
  RoomDivider,
  ScheduledBadge,
  RoomEvent,
  RoomMessage,
  ScheduleMessageModal,
  Sender,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { chatRoom } from '../../fixtures/inbox';
import { Caption } from './parts';

const noop = () => undefined;

function RoomFrame({ children, width = 760, height = 520 }: { children: React.ReactNode; width?: number; height?: number }) {
  return (
    <div
      style={{
        width,
        maxWidth: '100%',
        height,
        borderRadius: spacing.xs,
        overflow: 'hidden',
        marginBottom: spacing.m,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Mid ▸ Schedule Message Room — the queue of messages waiting to go out.
 *
 * Its own page rather than a state of the chat room: the surface answers a
 * different question. A chat room shows what was said; this shows what has not
 * been sent yet, and everything in it is still editable.
 */
export function ScheduledRoomPage() {
  const [autoCancel, setAutoCancel] = useState(true);

  // One picker serves both openings: the composer's schedule button, which
  // starts with no date, and a queued message's reschedule control, which starts
  // on the slot it already has.
  const [picking, setPicking] = useState(false);
  const [scheduleAt, setScheduleAt] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleZone, setScheduleZone] = useState('you');

  // Every queued bubble keeps its controls: nothing here has been sent, so
  // there is no window to have missed. Two more than a sent message gets —
  // sending early, and moving the slot — because those are the only two things
  // you can do to a message that has not gone yet.
  const actions = {
    onEdit: noop,
    onDelete: noop,
    onDownload: noop,
    onSendNow: noop,
    onReschedule: () => {
      // Reschedule opens on the slot the message already has — the day, the
      // time, and the clock it was set against — so moving it is an adjustment
      // rather than answering the same three questions again.
      setScheduleAt(new Date(2025, 0, 12));
      setScheduleTime('14:00');
      setScheduleZone('you');
      setPicking(true);
    },
  };
  const [draft, setDraft] = useState('');

  // The queue's composer is the room's composer: same tabs, same controls. What
  // makes it a queue is that no `onSend` is passed — there is nowhere to send
  // from here, only somewhere to schedule to — and the status badge says so.
  //
  // The badge sits above the composer rather than inside it. It is about which
  // room you are in, not about the message being written, so it belongs outside
  // the white card — `banner` is for bands that belong to the draft, like the
  // "add a Business Manager" prompt.
  const composer = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
      <ScheduledBadge place="queue" onNavigate={noop} />
      <Composer
        mode="schedule"
        chooseBm={{ name: 'Marina Ovcharenko', tone: 'volcano' }}
        hasDraft={draft.length > 0}
        onSchedule={() => {
          setScheduleAt(null);
          setPicking(true);
        }}
        field={{
          value: draft,
          onValueChange: setDraft,
          placeholder: 'Write a message or paste text and files here…',
          marks: [],
          maxLength: 5000,
          onAttach: noop,
          onMeeting: noop,
          onDraftAi: noop,
        }}
      />
    </div>
  );

  return (
    <>
      <PageHeader
        title="Schedule Message Room"
        description="The queue of messages waiting to go out, and what became of them. Figma nodes 3523:37230 (the header) and 4512:26977 (the events)."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Chat Room (Mid)', pageId: 'crm-mid' },
          { label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
        ]}
      >
        The same <strong>ChatRoom</strong> and the same <strong>Composer</strong>, with a different
        header and no send button. It is filed separately because the surface answers a different
        question: a chat room shows what was said, and this shows what has not been sent yet.
      </CrossLink>

      <Section
        title="The queue"
        description="`ChatHeader` with `scheduled` swaps the room's controls for the auto-cancel switch — the room's own controls have no role over a queue. The composer is the room's own, tabs and all: what makes it a queue is that no `onSend` is passed, so the only way out is the schedule button, and `mode=“schedule”` names that in the status badge."
      >
        <RoomFrame>
          <ChatRoom
            header={
              <ChatHeader
                title={chatRoom.title}
                scheduled
                autoCancel={autoCancel}
                onAutoCancelChange={setAutoCancel}
              />
            }
            composer={composer}
          >
            <RoomDivider>Today</RoomDivider>
            <RoomMessage
              side="own"
              sender={
                <Sender
                  side="own"
                  name="Marina Ovcharenko"
                  avatar={{ tone: 'volcano', badge: 'upworkApi' }}
                  badges={<AuthorBadge kind="schedule">Scheduled for 12 Jan 2025 at 14:00</AuthorBadge>}
                />
              }
            >
              <BubbleChat side="own" scheduled time="14:00" actions={actions}>
                Hi Floyd, let me introduce my team, and send you our team
              </BubbleChat>
              <AttachmentBubble side="own" scheduled name="Team.pdf" type="PDF" time="14:00" actions={actions} />
            </RoomMessage>

            <RoomMessage
              side="own"
              sender={
                <Sender
                  side="own"
                  name="Marina Ovcharenko"
                  avatar={{ tone: 'volcano', badge: 'upworkApi' }}
                  badges={
                    <>
                      <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
                      <AuthorBadge kind="schedule">Scheduled for 13 Jan 2025 at 09:00</AuthorBadge>
                    </>
                  }
                />
              }
            >
              <BubbleChat side="own" scheduled tone="comment" time="09:00" actions={actions}>
                Just checking in once more before we close this out.
              </BubbleChat>
            </RoomMessage>

            <RoomMessage
              side="own"
              sender={
                <Sender
                  side="own"
                  name="Marina Ovcharenko"
                  avatar={{ tone: 'volcano', badge: 'upworkApi' }}
                  badges={
                    <AuthorBadge kind="schedule">
                      Scheduled for 12 Jan 2025 (14:00) by rafaelsamuel@email.com
                    </AuthorBadge>
                  }
                />
              }
            >
              <BubbleChat side="own" scheduled time="14:00" actions={actions}>
                Hi Floyd, thanks for meeting with us. I am excited to see the project, let me
                re-send the document
              </BubbleChat>
              <AttachmentBubble
                side="own"
                scheduled
                name="Draft Design.pdf"
                type="PDF"
                time="14:00"
                actions={actions}
              />
              <AttachmentBubble
                side="own"
                scheduled
                kind="picture"
                name="Screenshot 2022-06-21.png"
                time="14:00"
                actions={actions}
              />
            </RoomMessage>
          </ChatRoom>
        </RoomFrame>
        {/* Reschedule reopens the picker on the slot the message already has, so
            moving it is an adjustment rather than starting over. */}
        <ScheduleMessageModal
          open={picking}
          onClose={() => setPicking(false)}
          date={scheduleAt}
          onDateChange={setScheduleAt}
          timezones={[
            { id: 'you', label: 'You', offset: '(UTC+08:00)', avatar: { initials: 'MO', tone: 'purple' } },
            { id: 'client', label: 'Client', offset: '(UTC+06:00)', avatar: { initials: 'FM', tone: 'purple' } },
          ]}
          time={scheduleTime}
          onTimeChange={setScheduleTime}
          timezoneId={scheduleZone}
          onTimezoneChange={setScheduleZone}
          autoCancel={autoCancel}
          onAutoCancelChange={setAutoCancel}
          onSchedule={() => setPicking(false)}
        />
        <Caption>
          Hover a queued message for its controls — edit, delete, send now, and reschedule. Toggle
          auto-cancel in the header. The switch is outlined in the schedule purple rather than
          the brand blue — it belongs to the scheduling surface, not to the room.
        </Caption>
        <CodeBlock
          code={`<ChatRoom header={<ChatHeader title={room.title} scheduled autoCancel={on} … />}>
  <RoomMessage side="own" sender={<Sender … badges={<AuthorBadge kind="schedule">…</AuthorBadge>} />}>
    <BubbleChat side="own" scheduled time="14:00" actions={actions}>…</BubbleChat>
  </RoomMessage>
</ChatRoom>`}
        />
      </Section>

      <Section
        title="Mobile"
        description="The mobile queue is a whole screen rather than a sidebar, so its chevron goes back the way every other mobile header's does — the double-chevron that closes a sidebar would be pointing at something that is not there."
      >
        <RoomFrame width={402} height={420}>
          <ChatRoom
            layout="mobile"
            header={
              <ChatHeader
                layout="mobile"
                title={chatRoom.title}
                scheduled
                autoCancel={autoCancel}
                onAutoCancelChange={setAutoCancel}
              />
            }
          >
            <RoomDivider>Today</RoomDivider>
            <RoomMessage
              side="own"
              sender={
                <Sender
                  side="own"
                  name="Marina Ovcharenko"
                  avatar={{ tone: 'volcano', badge: 'upworkApi' }}
                />
              }
            >
              <BubbleChat side="own" scheduled time="14:00" actions={actions}>
                Following up on the proposal.
              </BubbleChat>
            </RoomMessage>
          </ChatRoom>
        </RoomFrame>
        <CodeBlock code={`<ChatRoom layout="mobile" header={<ChatHeader layout="mobile" scheduled … />} />`} />
      </Section>

      <Section
        title="Scheduled message events"
        description="Three moments a queued message reaches. They are drawn in the `chat room`, not here — the queue shows what is waiting, and the room is where a message being queued, sent, or cancelled is news. `scheduled` and `sent` fold their time into the sentence, since “scheduled for today at 08:47” is one statement; `cancelled` keeps a trailing stamp, because when it was cancelled is separate from why."
      >
        <div style={{ background: color.main.white, padding: spacing.s, marginBottom: spacing.m }}>
          <RoomEvent kind="schedule" scheduleState="scheduled" time="08:47" />
          <RoomEvent kind="schedule" scheduleState="sent" time="17:45" />
          <RoomEvent kind="schedule" scheduleState="cancelled" time="08:47" />
        </div>
        <CodeBlock
          code={`<RoomEvent kind="schedule" scheduleState="scheduled" time="08:47" />
<RoomEvent kind="schedule" scheduleState="sent" time="17:45" />
<RoomEvent kind="schedule" scheduleState="cancelled" time="08:47" />`}
        />
      </Section>
    </>
  );
}
