import { component } from '@gigradar/theme';
import { MeetingBubble } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { upcomingMeeting } from '../../fixtures/inbox';
import { Caption } from '../inbox/parts';

/** The card's width inside the pane — the column less its own padding. */
const CARD_WIDTH = component.details.width - component.details.padding * 2;

/**
 * CRM ▸ Inbox ▸ Details ▸ Upcoming Meetings.
 *
 * The pane's meeting section. It ships no component of its own: the card is
 * `MeetingBubble`, borrowed from the thread, and this page is about what the
 * pane does with it rather than about the card itself.
 */
export function UpcomingMeetingsPage() {
  return (
    <>
      <PageHeader
        title="Upcoming Meetings"
        description="What the room has booked, drawn in the pane with the same card the thread uses. Figma node 82:8753."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'CRM ▸ Inbox ▸ Details (Right)', pageId: 'crm-details' },
          { label: 'Mid ▸ Meetings (Mid)', pageId: 'crm-mid-meetings' },
        ]}
      >
        This section ships no component. The card is <strong>MeetingBubble</strong>, and every
        state it can be in — proposed, rescheduled, cancelled, ended, recorded — is documented on{' '}
        <strong>Meetings (Mid)</strong>. Redrawing it here would be a second meeting card to keep
        in step with the first.
      </CrossLink>

      <Section
        title="In the pane"
        description="The booked state, which is the one the pane is for: a meeting that is going to happen, with the link to join it."
      >
        <Caption>
          The pane shows what is coming, not what has been. A meeting that has ended belongs in the
          thread where it happened — the pane is read to decide what to do next.
        </Caption>
        <Preview>
          <div style={{ width: CARD_WIDTH }}>
            <MeetingBubble
              state="booked"
              time={upcomingMeeting.sentAt}
              details={[
                { label: 'Date', value: upcomingMeeting.date },
                { label: 'Time', value: upcomingMeeting.time },
                { label: 'Link', value: upcomingMeeting.link, href: upcomingMeeting.link },
              ]}
            />
          </div>
        </Preview>
        <CodeBlock
          code={`<InboxDetails
  meetings={[
    {
      state: 'booked',
      details: [
        { label: 'Date', value: 'December 3, 2025' },
        { label: 'Time', value: '15:00 - 15:30 (Asia/Makassar)' },
        { label: 'Link', value: joinUrl, href: joinUrl },
      ],
    },
  ]}
/>`}
        />
        <Caption>
          `InboxDetails` takes <strong>MeetingBubble</strong>&rsquo;s own props rather than a shape
          of its own, so a meeting shown in the thread and in the pane is described once.
        </Caption>
      </Section>

      <Section
        title="More than one"
        description="The section takes a list. A room with two meetings booked draws two cards, newest first."
      >
        <Preview>
          <div
            style={{ width: CARD_WIDTH, display: 'flex', flexDirection: 'column', gap: 10 }}
          >
            <MeetingBubble
              state="booked"
              time="08:30"
              details={[
                { label: 'Date', value: 'December 3, 2025' },
                { label: 'Time', value: '15:00 - 15:30 (Asia/Makassar)' },
              ]}
            />
            <MeetingBubble
              state="propose"
              time="09:15"
              description="Waiting for others to pick a time…"
              details={[{ label: 'Date', value: 'December 9, 2025' }]}
            />
          </div>
        </Preview>
      </Section>
    </>
  );
}
