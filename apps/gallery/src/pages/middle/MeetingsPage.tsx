import { spacing } from '@gigradar/theme';
import { MeetingBubble } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Surface } from './parts';

const noop = () => undefined;

const DATE = { label: 'Date:', value: 'December 3, 2025' };
const TIME = { label: 'Time:', value: '15:00 - 15:30 (Asia/Makassar)' };

/** A row of cards, wrapping rather than stretching to the page. */
function Cards({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: spacing.m,
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginBottom: spacing.m,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Mid ▸ Meetings — the meeting card in the thread.
 *
 * Filed beside the chat room and its outbox rather than under either: a meeting
 * outlives the message that proposed it.
 */
export function MeetingsPage() {
  return (
    <>
      <PageHeader
        title="Meetings (Mid)"
        description="A meeting in the thread — proposed, booked, moved, cancelled, or over. Figma node 2023:13923."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'Chat Room (Mid)', pageId: 'crm-mid' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Schedule Message (Mid)', pageId: 'crm-mid-scheduled' },
        ]}
      >
        Ringed green rather than filled, the same way a scheduled message is ringed purple: this is
        still a message in the conversation, and a filled card would read as a panel dropped into
        the thread.
      </CrossLink>

      <Section
        title="Proposing"
        description="What the composer's meeting control puts in the thread. Wider than the other cards because it carries a mark rather than a list, and clicking it opens the picker — the whole card is the control, since “waiting for others to pick” is not something you act on in the thread."
      >
        <Surface>
          <Cards>
            <MeetingBubble
              state="propose"
              description="Waiting for others to pick a date and time."
              time="08:30"
              onOpen={noop}
            />
          </Cards>
        </Surface>
        <CodeBlock
          code={`<MeetingBubble
  state="propose"
  description="Waiting for others to pick a date and time."
  time="08:30"
  onOpen={openPicker}
/>`}
        />
      </Section>

      <Section
        title="Booked"
        description="The rows are passed rather than derived from the state: a booked meeting and an ended one carry the same three lines, and which ones a given card has is a question about the meeting rather than about the kind of card. The Join button appears only once there is somewhere to go."
      >
        <Surface>
          <Cards>
            <MeetingBubble
              details={[DATE, TIME, { label: 'Link:', value: "We'll let you know when is ready." }]}
              time="08:30"
              onCancel={noop}
              onReschedule={noop}
            />
            <MeetingBubble
              details={[
                DATE,
                TIME,
                { label: 'Link:', value: 'https://zoom.us/j/1234567890', href: '#' },
              ]}
              time="08:30"
              onCancel={noop}
              onReschedule={noop}
              onJoin={noop}
            />
          </Cards>
        </Surface>
        <Caption>
          Left: booked, but the link has not arrived. Right: the same meeting once it has.
        </Caption>
        <CodeBlock
          code={`<MeetingBubble
  details={[
    { label: 'Date:', value: 'December 3, 2025' },
    { label: 'Time:', value: '15:00 - 15:30 (Asia/Makassar)' },
    { label: 'Link:', value: meeting.url, href: meeting.url },
  ]}
  time="08:30"
  onCancel={cancel}
  onReschedule={reschedule}
  onJoin={join}
/>`}
        />
      </Section>

      <Section
        title="Moved, cancelled, over"
        description="`struck` draws a value with a line through it — what a reschedule does to the old slot, and a cancellation does to both. The card keeps the crossed-out rows rather than dropping them, so the thread still says what the meeting was before it changed."
      >
        <Surface>
          <Cards>
            <MeetingBubble
              state="rescheduled"
              details={[
                { label: 'From:', value: 'Dec 3, 2025, 15:00 - 15:30', struck: true },
                { label: 'To:', value: 'Dec 3, 2025, 16:00 - 16:30' },
                { label: 'Link:', value: "We'll let you know when is ready." },
              ]}
              time="08:30"
            />
            <MeetingBubble
              state="cancelled"
              details={[
                { ...DATE, struck: true },
                { ...TIME, struck: true },
                { label: 'Reason:', value: 'Family Matters' },
              ]}
              time="08:30"
            />
            <MeetingBubble
              state="ended"
              details={[
                DATE,
                TIME,
                { label: 'Recording:', value: "We'll let you know.", wide: true },
              ]}
              time="08:30"
            />
          </Cards>
        </Surface>
        <CodeBlock
          code={`<MeetingBubble
  state="rescheduled"
  details={[
    { label: 'From:', value: oldSlot, struck: true },
    { label: 'To:', value: newSlot },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Recording"
        description="`expired` keeps the buttons but stops them working, so the card does not change shape when a recording lapses — a meeting that is over and one whose recording has gone should not be two different sizes in the same thread."
      >
        <Surface>
          <Cards>
            <MeetingBubble
              state="recording"
              details={[
                { label: 'Available Until:', value: 'December 4, 2025', wide: true },
                { label: 'Password:', value: 'EyIt1#0?', wide: true },
                {
                  label: 'Recording:',
                  value: 'https://zoom.us/j/1234567890',
                  href: '#',
                  wide: true,
                },
              ]}
              time="08:30"
              onJoin={noop}
              joinLabel="View Recording"
            />
            <MeetingBubble
              state="recording"
              expired
              details={[
                { label: 'Available Until:', value: 'December 4, 2025', wide: true },
                { label: 'Recording:', value: 'Expired', wide: true },
              ]}
              time="08:30"
              onJoin={noop}
              joinLabel="View Recording"
            />
          </Cards>
        </Surface>
        <Caption>
          `wide` widens the label column for the longer names, so the values still line up down the
          card instead of stepping in and out.
        </Caption>
        <CodeBlock
          code={`<MeetingBubble
  state="recording"
  expired={recording.expired}
  details={[{ label: 'Available Until:', value: date, wide: true }]}
  onJoin={open}
  joinLabel="View Recording"
/>`}
        />
      </Section>

      <Section
        title="Thirteen frames, six states"
        description="Figma draws thirteen cards. They are six outcomes crossed with details the meeting happens to have — whether a link has arrived, whether a recording has lapsed — so those are `details` and `expired` rather than states of their own. A thirteen-way union would make “an ended meeting whose recording expired” a fourteenth variant rather than the combination it is."
      >
        <Caption>
          Figma's “No Meetings” is deliberately not here. It is the meeting-info panel's empty
          state rather than anything the thread draws, and putting it in this component would make a
          card that says there is no card.
        </Caption>
      </Section>
    </>
  );
}
