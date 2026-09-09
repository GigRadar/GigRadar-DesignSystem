import { color, spacing } from '@gigradar/theme';
import {
  AttachmentBubble,
  AuthorBadge,
  AutoCancelSwitch,
  BubbleChat,
  ChatHeader,
  ChatRoom,
  defaultChatFilters,
  Composer,
  HeaderMetaTag,
  HeaderNavButton,
  IconSearch,
  ModeBadge,
  RoomDivider,
  RoomEvent,
  RoomMessage,
  RoomNotice,
  ScheduleMessageModal,
  Sender,
  type StageName,
  type TextMark,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PageHeader, Section } from '../layout';
import { CrossLink } from '../navigation';
import { chatRoom } from '../fixtures/inbox';
import { Caption, Row, Surface } from './middle/parts';

const noop = () => undefined;

/** A fixed-height frame, since the room fills whatever it is given. */
function RoomFrame({
  children,
  width = 760,
  height = 620,
}: {
  children: React.ReactNode;
  width?: number;
  height?: number;
}) {
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
 * CRM ▸ Inbox ▸ Chat Room (Mid).
 *
 * The middle column — Figma's "Middle - Chat Room", node 426:23179, assembled.
 * Each band is documented on its own page beneath this one; what this page shows
 * is the thing none of them can show alone.
 */
export function MiddlePage() {
  const [autoCancel, setAutoCancel] = useState(true);
  const [mode, setMode] = useState<'message' | 'note'>('message');
  const [draft, setDraft] = useState('');
  const [marks, setMarks] = useState<TextMark[]>([]);

  // Passed to every bubble: the bubble itself drops what the side cannot do, so
  // an incoming message keeps only the download and an outgoing one keeps all
  // three. Real screens would omit `onEdit` once a message is over an hour old.
  const actions = { onEdit: noop, onDelete: noop, onDownload: noop };

  // The header's two popovers. `ChatHeader` draws each itself once it is given
  // the data — `filters` for the filter panel, `onStageChange` for the stage
  // menu — so the page only has to own which one is open and what is chosen.
  const [filterOpen, setFilterOpen] = useState(false);
  const [shownFilters, setShownFilters] = useState<string[]>([
    'customEvents',
    'roomEvents',
    'notesAndAiReplies',
  ]);
  const [stageOpen, setStageOpen] = useState(false);
  const [stage, setStage] = useState<StageName>('interested');

  // The composer's schedule button opens the picker rather than queueing
  // straight away: a message needs a slot before it can be scheduled, and the
  // button is the only place to ask for one.
  const [scheduling, setScheduling] = useState(false);
  const [scheduleAt, setScheduleAt] = useState<Date | null>(null);
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [scheduleZone, setScheduleZone] = useState('you');

  const buildHeader = (layout: 'desktop' | 'mobile') => (
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
    />
  );

  // Two ages, so the thread shows the rule rather than describing it: the last
  // exchange is minutes old and still editable, everything above it is past the
  // hour and keeps only what a file can offer.
  const justNow = Date.now() - 5 * 60 * 1000;
  const longAgo = Date.now() - 26 * 60 * 60 * 1000;

  const thread = (
    <>
      <RoomNotice>
        Chat started on April 25, 2025, at 18:20. Marina Ovcharenko has accepted the job offer.
      </RoomNotice>
      <RoomDivider>Today</RoomDivider>
      <RoomMessage sender={<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />}>
        <BubbleChat time="08:30" actions={actions}>
          We were really impressed with your portfolio and how your expertise in Product UI/UX will
          be a great fit for our project.
        </BubbleChat>
      </RoomMessage>

      <RoomEvent kind="stage" from="new" to="interested" by="Jane Cooper" time="08:47" />

      <RoomMessage
        side="own"
        sender={
          <Sender
            side="own"
            name="Marina Ovcharenko"
            avatar={{ tone: 'volcano', badge: 'upworkApi' }}
            badges={<AuthorBadge>by janecooper@email.com</AuthorBadge>}
          />
        }
      >
        <BubbleChat side="own" time="08:52" state="read" sentAt={longAgo} actions={actions}>
          Sorry, currently jane cooper it&rsquo;s on vacation but here&rsquo;s the draft she&rsquo;s
          preparing for
        </BubbleChat>
      </RoomMessage>

      <RoomEvent
        kind="autoReply"
        fromMode={<ModeBadge mode="off" />}
        toMode={<ModeBadge mode="fullAuto" />}
        by="Jane Cooper"
        time="09:47"
      />

      <RoomMessage
        sender={<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />}
      >
        <BubbleChat time="10:02" actions={actions}>Thanks, that works.</BubbleChat>
      </RoomMessage>

      <RoomNotice>Maria Ovcharenko added Di Maria to the room</RoomNotice>

      <RoomMessage sender={<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />}>
        {/* No actions: the room is speaking, so there is nothing to edit or delete. */}
        <BubbleChat tone="system" locked time="10:14">
          View meetings, files with GigRadar Business Manager in this room
        </BubbleChat>
      </RoomMessage>

      {/* One sender, three bubbles: the message and the two files it refers to
          are a single turn, so they share a name row rather than repeating it. */}
      <RoomMessage
        side="own"
        sender={
          <Sender
            side="own"
            name="Marina Ovcharenko"
            avatar={{ tone: 'volcano', badge: 'upworkApi' }}
            badges={<AuthorBadge>by rafaelsamuel@email.com</AuthorBadge>}
          />
        }
      >
        <BubbleChat side="own" time="10:20" state="read" sentAt={longAgo} actions={actions}>
          Here is the draft she was preparing, plus the screenshot you asked about.
        </BubbleChat>
        <AttachmentBubble side="own" name="Draft Design.pdf" type="PDF" time="10:20" state="read" sentAt={longAgo} actions={actions} />
        <AttachmentBubble
          side="own"
          kind="picture"
          name="Screenshot 2022-06-21 at 09.41.13.png"
          time="10:20"
          state="read"
          sentAt={longAgo}
          actions={actions}
        />
      </RoomMessage>

      <RoomDivider>Yesterday</RoomDivider>

      <RoomMessage
        sender={
          <Sender
            name="kulusevski@email.com"
            avatar={{ tone: 'default' }}
          />
        }
      >
        <BubbleChat tone="comment" time="11:05" actions={actions}>
          @rafaelsamuel@email.com Could you please take care with this out? Jane is on vacation, I
          think she will be back again in 3 days.
        </BubbleChat>
      </RoomMessage>

      <RoomMessage
        side="own"
        sender={
          <Sender side="own" name="rafaelsamuel@email.com" avatar={{ tone: 'geekBlue' }} />
        }
      >
        <BubbleChat side="own" tone="comment" time="11:07" state="read" actions={actions}>
          Alright, I will take a look.
        </BubbleChat>
      </RoomMessage>

      <RoomEvent kind="schedule" time="12 Jan 2025 (14:00)" by="rafaelsamuel@email.com" />

      <RoomMessage
        side="own"
        sender={
          <Sender
            side="own"
            name="Marina Ovcharenko"
            avatar={{ tone: 'volcano', badge: 'upworkApi' }}
            badges={<AuthorBadge>by rafaelsamuel@email.com</AuthorBadge>}
          />
        }
      >
        <BubbleChat side="own" time="11:30" state="read" sentAt={longAgo} actions={actions}>
          Hi Floyd, thanks for meeting with us. I am excited to see the project, let me re-send the
          document.
        </BubbleChat>
        <AttachmentBubble side="own" name="Draft Design.pdf" type="PDF" time="11:30" state="read" sentAt={longAgo} actions={actions} />
      </RoomMessage>

      <RoomMessage sender={<Sender name="Jane Cooper" avatar={{ tone: 'magenta' }} />}>
        <BubbleChat time="11:52" actions={actions}>
          Thank you for considering me for your project. I am excited about the opportunity to
          collaborate and confident in my ability to deliver exceptional UX/UI design.
        </BubbleChat>
      </RoomMessage>

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
        <BubbleChat side="own" time="12:04" state="read" sentAt={longAgo} actions={actions}>
          Hi Floyd! I&rsquo;d love to schedule a 30-minute discovery call to discuss your project.
          Would any of these times work?
        </BubbleChat>
      </RoomMessage>

      <RoomMessage sender={<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />}>
        <BubbleChat time="12:20" actions={actions}>
          Yes, could you send me the first drafts of the designs?
        </BubbleChat>
      </RoomMessage>

      <RoomMessage
        side="own"
        sender={
          <Sender
            side="own"
            name="Marina Ovcharenko"
            avatar={{ tone: 'volcano', badge: 'upworkApi' }}
            badges={<AuthorBadge>by rafaelsamuel@email.com</AuthorBadge>}
          />
        }
      >
        <BubbleChat side="own" time="12:26" state="read" sentAt={longAgo} actions={actions}>
          Of course — the first pass covers secure login, onboarding, and the core feed. I have
          attached both the deck and a screenshot of the current build.
        </BubbleChat>
        <AttachmentBubble side="own" name="Draft Design.pdf" type="PDF" time="12:26" state="read" sentAt={longAgo} actions={actions} />
        <AttachmentBubble
          kind="picture"
          name="Screenshot 2022-06-21 at 09.41.13.png"
          time="12:26"
          state="read"
        actions={actions} />
      </RoomMessage>

      <RoomMessage sender={<Sender name="Jane Cooper" avatar={{ tone: 'magenta' }} />}>
        <BubbleChat time="13:02" actions={actions}>
          These look great. One question on the onboarding step — are we keeping the progress bar at
          the top, or moving it under the title?
        </BubbleChat>
      </RoomMessage>

      <RoomNotice>Maria Ovcharenko added Jane Cooper to the room</RoomNotice>

      <RoomMessage
        sender={
          <Sender
            name="kulusevski@email.com"
            avatar={{ tone: 'default' }}
          />
        }
      >
        <BubbleChat tone="comment" time="13:10" actions={actions}>
          @laziza follow up this client if there is no reply by tomorrow morning.
        </BubbleChat>
      </RoomMessage>

      <RoomMessage
        side="own"
        sender={<Sender side="own" name="rafaelsamuel@email.com" avatar={{ tone: 'geekBlue' }} />}
      >
        <BubbleChat side="own" tone="comment" time="13:12" state="read" actions={actions}>
          Noted — I will keep an eye on it.
        </BubbleChat>
      </RoomMessage>

      <RoomEvent
        kind="autoReply"
        fromMode={<ModeBadge mode="fullAuto" />}
        toMode={<ModeBadge mode="off" />}
        by="rafaelsamuel@email.com"
        time="13:15"
      />

      <RoomMessage
        side="own"
        sender={
          <Sender side="own" name="Marina Ovcharenko" avatar={{ tone: 'volcano', badge: 'upworkApi' }} />
        }
      >
        <BubbleChat side="own" time="13:40" state="read" sentAt={longAgo} actions={actions}>
          Happy to break it down — milestone one covers secure login, onboarding, and the core feed,
          roughly two weeks. I would scope that phase at $2,400, ending with a build you can test on
          your phone.
        </BubbleChat>
      </RoomMessage>

      <RoomMessage sender={<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />}>
        <BubbleChat time="14:05" actions={actions}>
          That works for us. Send the scope doc over and I will get it signed off this week.
        </BubbleChat>
      </RoomMessage>

      <RoomMessage
        side="own"
        sender={
          <Sender
            side="own"
            name="Marina Ovcharenko"
            avatar={{ tone: 'volcano', badge: 'upworkApi' }}
            badges={<AuthorBadge>by rafaelsamuel@email.com</AuthorBadge>}
          />
        }
      >
        <BubbleChat side="own" time="14:12" state="sending" sentAt={justNow} actions={actions}>
          Perfect — sending it across now.
        </BubbleChat>
        <AttachmentBubble
          side="own"
          name="Scope of Work.pdf"
          type="PDF"
          time="14:12"
          state="sending"
          sentAt={justNow}
          actions={actions}
        />
      </RoomMessage>

      {/* The unread rule, where it can honestly go: on the first message that
          arrived after the last one you sent. Anything above this you have
          answered, so it cannot be new. */}
      <RoomMessage
        sender={
          <Sender name="Floyd Miles" avatar={{ tone: 'purple' }} divider="New Message" />
        }
      >
        <BubbleChat time="14:18" actions={actions}>
          Got it, thanks — I will read it over tonight and come back with any questions.
        </BubbleChat>
      </RoomMessage>
    </>
  );

  // Built per layout: the mobile room draws the same composer with its own
  // `layout`, which drops the character count and shortens the status badge to
  // its mark.
  const buildComposer = (layout: 'desktop' | 'mobile') => (
    <Composer
      layout={layout}
      mode={mode}
      onModeChange={setMode}
      hasDraft={draft.length > 0}
      chooseBm={{ name: 'Marina Ovcharenko', tone: 'volcano' }}
      onSend={noop}
      onSchedule={() => setScheduling(true)}
      field={{
        value: draft,
        onValueChange: setDraft,
        marks,
        onMarkToggle: (mark) =>
          setMarks((current) =>
            current.includes(mark) ? current.filter((m) => m !== mark) : [...current, mark],
          ),
        maxLength: 5000,
        onAttach: noop,
        onMeeting: noop,
        onDraftAi: noop,
      }}
    />
  );

  const composer = buildComposer('desktop');

  return (
    <>
      {/* Mounted once for the page rather than per room: the picker is a modal
          over everything, and both room frames share the one composer state. */}
      <ScheduleMessageModal
        open={scheduling}
        onClose={() => setScheduling(false)}
        date={scheduleAt}
        onDateChange={setScheduleAt}
        timezones={[
          {
            id: 'you',
            label: 'You',
            offset: '(UTC+08:00)',
            avatar: { initials: 'MO', tone: 'purple' },
          },
          {
            id: 'client',
            label: 'Client',
            offset: '(UTC+06:00)',
            avatar: { initials: 'FM', tone: 'purple' },
          },
        ]}
        time={scheduleTime}
        onTimeChange={setScheduleTime}
        timezoneId={scheduleZone}
        onTimezoneChange={setScheduleZone}
        onSchedule={() => setScheduling(false)}
      />

      <PageHeader
        title="Chat Room (Mid)"
        description="The conversation itself — the column between the room list and the client panel. Figma nodes 426:23179 and 4210:33888."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Mid ▸ Chat Header', pageId: 'crm-mid-header' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Mid ▸ Sender', pageId: 'crm-mid-sender' },
          { label: 'Mid ▸ Composer', pageId: 'crm-mid-composer' },
          { label: 'Schedule Message (Mid)', pageId: 'crm-mid-scheduled' },
        ]}
      >
        Each band is documented on its own page beneath this one. The three are passed into{' '}
        <strong>ChatRoom</strong> rather than built by it: the header needs the room&rsquo;s client
        and stage, the composer needs the draft and the sending account, and a component that
        assembled both would have to take every prop of each. What the room owns is the thing neither
        can do alone — pinning the header and composer while only the messages scroll.
      </CrossLink>

      <Section
        title="Desktop"
        description="The thread is a fixed 724px column centred in whatever width it is given, so a wide window leaves margins rather than stretching messages to an unreadable line. Scroll the messages — the header and composer stay put."
      >
        <RoomFrame>
          <ChatRoom
            header={
              buildHeader('desktop')
            }
            composer={composer}
          >
            {thread}
          </ChatRoom>
        </RoomFrame>
        <CodeBlock
          code={`<ChatRoom header={<ChatHeader … />} composer={<Composer … />}>
  <RoomDivider>Today</RoomDivider>
  <RoomMessage sender={<Sender … />}>
    <BubbleChat time="08:30" actions={actions}>…</BubbleChat>
  </RoomMessage>
  <RoomEvent kind="stage" from="new" to="interested" by="Jane Cooper" time="08:47" />
</ChatRoom>`}
        />
      </Section>

      <Section
        title="Mobile"
        description="`layout=“mobile”` narrows the column to 402px and tightens its inset. The bands it contains take the same prop, so the header swaps its controls for a back chevron — the room does not have to know about either."
      >
        <RoomFrame width={402} height={620}>
          <ChatRoom
            layout="mobile"
            header={
              buildHeader('mobile')
            }
            composer={buildComposer('mobile')}
          >
            {thread}
          </ChatRoom>
        </RoomFrame>
        <CodeBlock code={`<ChatRoom layout="mobile" header={<ChatHeader layout="mobile" … />} …>`} />
      </Section>

      <Section
        title="Empty"
        description="Figma's “Empty or Not Found” state, node 426:20575 — the room with nothing in it. `empty` is passed rather than inferred from having no children: a thread that has not loaded yet is not the same as one with no messages, and only the screen knows which it is looking at."
      >
        <RoomFrame>
          <ChatRoom empty />
        </RoomFrame>
        <Caption>
          The header and composer both go with the thread. There is no conversation to write into,
          and nothing to name — a title and a row of controls would be describing a room that is not
          on screen.
        </Caption>
        <CodeBlock
          code={`<ChatRoom empty />

// Or with your own wording:
<ChatRoom
  empty
  emptyTitle="Nothing here yet"
  emptyDescription="Pick a room from the list to see its messages."
  emptyIcon={IconBubbleCrossStroke}
/>`}
        />
      </Section>

      <Section
        title="Room events"
        description="A line reporting something that happened to the room rather than in it. Centred and unboxed, unlike a message — these are not things anyone said, and giving them a bubble would put them in the conversation rather than beside it."
      >
        <div style={{ background: color.main.white, padding: spacing.s, marginBottom: spacing.m }}>
          <RoomEvent kind="stage" from="new" to="interested" by="Jane Cooper" time="08:47" />
          <RoomEvent
            kind="stage"
            from="interested"
            to="contactLater"
            by="Jane Cooper"
            time="10:47"
          />
          <RoomEvent
            kind="autoReply"
            fromMode={<ModeBadge mode="off" />}
            toMode={<ModeBadge mode="fullAuto" />}
            by="Jane Cooper"
            time="08:47"
          />
          <RoomEvent
            kind="autoReply"
            fromMode={<ModeBadge mode="fullAuto" />}
            toMode={<ModeBadge mode="coPilot" />}
            by="Jane Cooper"
            time="09:47"
          />
        </div>
        <Caption>
          Figma files a “Multiple” variant of each. That is not a variant — it is several of these
          stacked, so a thread renders a list rather than asking for a different component.
        </Caption>
        <CodeBlock
          code={`<RoomEvent kind="stage" from="new" to="interested" by="Jane Cooper" time="08:47" />
<RoomEvent
  kind="autoReply"
  fromMode={<ModeBadge mode="off" />}
  toMode={<ModeBadge mode="fullAuto" />}
  by="Jane Cooper"
  time="08:47"
/>`}
        />
      </Section>

      <Section
        title="The backdrop"
        description="Figma's own export, kept verbatim — four blurred colour fields, a faint grid, and a few crosshair marks. Reproducing it in CSS would mean approximating five blur filters and thirty-odd gradients, and the result would drift from the frame the first time either was touched."
      >
        <Caption>
          Pinned to the room rather than scrolling with the thread: it is a backdrop the conversation
          sits on, not a texture the messages carry. `backdropFixed` pins it to the viewport instead,
          which is what the product wants — the room fills the window there, but not when it is
          embedded in a preview this size.
        </Caption>
        <CodeBlock code={`<ChatRoom backdropFixed …>   // in the product, where the room fills the window`} />
      </Section>

      <Section
        title="The smaller shared parts"
        description="Three controls the header composes that Figma does not file separately, exported anyway because they are the same decision wherever a header band is drawn: the leading chevron, the meta tags, and the scheduled queue's auto-cancel switch."
      >
        <Surface>
          <Row>
            <HeaderNavButton action="back" />
            <HeaderNavButton action="collapse" />
            <HeaderMetaTag icon={IconSearch} variant="brand">
              V1 Jane - UI UX
            </HeaderMetaTag>
            <HeaderMetaTag icon={IconSearch} variant="brand" label="Reply preset" />
            <AutoCancelSwitch checked={autoCancel} onCheckedChange={setAutoCancel} />
            <AutoCancelSwitch checked={autoCancel} onCheckedChange={setAutoCancel} label={null} />
          </Row>
        </Surface>
        <Caption>
          The chevron in both directions, a meta tag with and without its label, and the switch in
          both widths.
        </Caption>
        <CodeBlock
          code={`<HeaderNavButton action="back" onClick={goBack} />
<HeaderMetaTag icon={IconSearch} variant="brand">V1 Jane - UI UX</HeaderMetaTag>
<AutoCancelSwitch checked={autoCancel} onCheckedChange={setAutoCancel} />`}
        />
      </Section>
    </>
  );
}
