import { component } from '@gigradar/theme';
import { InboxDetails, RelevanceButtons, type RelevanceVerdict } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PropsTable } from '../../components/PropsTable';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import {
  aiConfiguration,
  clientDetails,
  notInRoom,
  participants,
  upcomingMeeting,
} from '../../fixtures/inbox';
import { Caption } from './parts';

/** A section's width inside the pane — the column less its own padding. */
const SECTION_WIDTH = component.details.width - component.details.padding * 2;

/** The pane at the height the real screen gives it. */
const PANE_HEIGHT = 734;

/** The meeting the room has booked, as `MeetingBubble` takes it. */
const MEETINGS = [
  {
    state: 'booked' as const,
    time: upcomingMeeting.sentAt,
    details: [
      { label: 'Date', value: upcomingMeeting.date },
      { label: 'Time', value: upcomingMeeting.time },
      { label: 'Link', value: upcomingMeeting.link, href: upcomingMeeting.link },
    ],
  },
];

/**
 * The pane with every section, as the screen draws it.
 *
 * One `InboxDetails` rather than a hand-stacked `DetailsPane`, because that is
 * what an app would write — a demo that composes the sections by hand would be
 * showing a screen the product does not build.
 *
 * Exported so the assembled Inbox page draws the same thing without rebuilding
 * it.
 */
export function DetailsColumn() {
  const [verdict, setVerdict] = useState<RelevanceVerdict | undefined>('relevant');

  return (
    <InboxDetails
      client={clientDetails}
      meetings={MEETINGS}
      ai={{ ...aiConfiguration, onEdit: () => undefined }}
      relevance={verdict}
      onRelevanceChange={setVerdict}
      participants={participants}
      notInRoom={notInRoom}
      onAddParticipant={() => undefined}
    />
  );
}

/**
 * CRM ▸ Inbox ▸ Details (Right).
 *
 * The third column of the Inbox — who the client is, what meeting is booked,
 * what the AI is doing, and who is in the room. Figma node 82:8753.
 *
 * This page is the column as a whole. Each section it stacks has its own page
 * beneath it, which is where that section's states are documented.
 */
export function DetailsPage() {
  return (
    <>
      <PageHeader
        title="Details (Right)"
        description="The Inbox's right column — the client and job card, the booked meeting, the AI configuration, the relevance verdict, and the two participant lists. Figma node 82:8753."
      />

      <CrossLink
        eyebrow="The sections it stacks"
        links={[
          { label: 'Details ▸ Client & Job Details', pageId: 'crm-details-client' },
          { label: 'Details ▸ Upcoming Meetings', pageId: 'crm-details-meetings' },
          { label: 'Details ▸ CRM AI Configuration', pageId: 'crm-details-ai' },
          { label: 'Details ▸ Participants', pageId: 'crm-details-participants' },
        ]}
      >
        <strong>InboxDetails</strong> is the screen-level component: give it the room&rsquo;s data
        and it draws the whole pane. <strong>DetailsPane</strong> and{' '}
        <strong>DetailsSection</strong> are underneath it for screens that need to compose the
        sections themselves.
      </CrossLink>

      <Section
        title="The column"
        description="The pane as the screen assembles it, at its real 328px. Every header is a hit target: click a label and the section folds."
      >
        <Caption>
          A section is drawn when it has something to say — a room with no meeting gets no{' '}
          <strong>Upcoming Meetings</strong> header over an empty space. Relevance is the one
          exception: it carries no data, so the handler is what says the product collects a verdict
          at all.
        </Caption>
        <Preview>
          <Frame height={PANE_HEIGHT}>
            <DetailsColumn />
          </Frame>
        </Preview>
        <CodeBlock
          code={`<InboxDetails
  client={{ name: 'Floyd Miles', role: 'Client', stats, rows }}
  meetings={[{ state: 'booked', details }]}
  ai={{ version, modes, onEdit: editPrompt }}
  relevance={verdict}
  onRelevanceChange={setVerdict}
  participants={inRoom}
  notInRoom={candidates}
  onAddParticipant={addToRoom}
/>`}
        />
      </Section>

      <Section
        title="Decorating one section"
        description="`renderSection` replaces a section's body while keeping its header and its fold. Call `defaultRender()` to wrap rather than replace."
      >
        <CodeBlock
          code={`<InboxDetails
  {...room}
  renderSection={({ name, defaultRender }) =>
    name === 'client' ? (
      <>
        {defaultRender()}
        <OpenInCrmLink id={room.clientId} />
      </>
    ) : (
      defaultRender()
    )
  }
/>`}
        />
        <Caption>
          Reach past it to <strong>DetailsPane</strong> when a screen genuinely differs — a pane
          with a section this does not know about, or one whose folds are driven from outside.
        </Caption>
      </Section>

      <Section
        title="Relevance"
        description="Was this lead worth surfacing. The pair the scanner learns from — the one section with no page of its own, because it is two buttons rather than a surface."
      >
        <Caption>
          At rest the labels are drawn in the border grey rather than black — unusual, and
          deliberate: this is feedback the product asks for, not work the reader came to do, so it
          stays quiet until pointed at and only commits to a colour once it holds the answer. The
          two are equally wide because they are a choice between equals.
        </Caption>
        <Preview>
          <div style={{ width: SECTION_WIDTH }}>
            <RelevanceButtons />
          </div>
          <div style={{ width: SECTION_WIDTH }}>
            <RelevanceButtons value="relevant" />
          </div>
          <div style={{ width: SECTION_WIDTH }}>
            <RelevanceButtons value="notRelevant" />
          </div>
        </Preview>
      </Section>

      <Section
        title="The empty pane"
        description="No room is open, so there is nothing to describe."
      >
        <Preview>
          <Frame height={400}>
            <InboxDetails empty />
          </Frame>
        </Preview>
      </Section>

      <Section title="Props" description="`InboxDetails` — the whole column from the room's data.">
        <PropsTable
          rows={[
            {
              name: 'sections',
              type: 'DetailsSectionName[]',
              description:
                'Which sections to draw, in order. Defaults to every section that has data.',
            },
            {
              name: 'client',
              type: 'ClientJobDetailsProps',
              description: 'The client and job card. Omit to drop the section.',
            },
            {
              name: 'meetings',
              type: 'MeetingBubbleProps[]',
              description:
                "`MeetingBubble`'s own props — the card is the one the thread draws, so a meeting shown twice is not described two ways.",
            },
            {
              name: 'ai',
              type: 'CrmAiConfigurationProps',
              description: 'The AI configuration card. Omit to drop the section.',
            },
            {
              name: 'relevance',
              type: "'relevant' | 'notRelevant'",
              description: 'The recorded verdict. The section needs `onRelevanceChange` to appear.',
            },
            {
              name: 'participants',
              type: 'DetailsParticipant[]',
              description: 'Who is in the room.',
            },
            {
              name: 'notInRoom',
              type: 'DetailsParticipant[]',
              description: 'Who could be added to it. Pair with `onAddParticipant`.',
            },
            {
              name: 'collapsed',
              type: 'DetailsSectionName[]',
              description: 'Which sections start folded.',
            },
            {
              name: 'onSectionToggle',
              type: '(name, open) => void',
              description: 'Called when a section is folded or unfolded.',
            },
            {
              name: 'renderSection',
              type: 'RenderProp<DetailsSectionRenderProps>',
              description: "Replaces one section's body, keeping its header and fold.",
            },
            { name: 'empty', type: 'boolean', description: 'Draws the empty state instead.' },
          ]}
        />
      </Section>
    </>
  );
}
