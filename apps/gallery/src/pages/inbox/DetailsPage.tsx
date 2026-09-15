import { component } from '@gigradar/theme';
import {
  ClientJobDetails,
  CrmAiConfiguration,
  DetailsPane,
  DetailsSection,
  IconLazizaSparkleFill,
  MeetingBubble,
  ParticipantList,
  ParticipantRow,
  RelevanceButtons,
  type RelevanceVerdict,
} from '@gigradar/ui';
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

/** The pane at the height the real screen gives it. */
const PANE_HEIGHT = 734;

/**
 * The pane with every section, as the screen draws it.
 *
 * Exported so the assembled Inbox page can show the same thing without
 * rebuilding it — the details column is one arrangement, and two copies would
 * drift.
 */
export function DetailsColumn() {
  const [verdict, setVerdict] = useState<RelevanceVerdict | undefined>('relevant');

  return (
    <DetailsPane>
      <DetailsSection title="Client & Job Details">
        <ClientJobDetails {...clientDetails} />
      </DetailsSection>

      <DetailsSection title="Upcoming Meetings">
        <MeetingBubble
          state="booked"
          time={upcomingMeeting.sentAt}
          details={[
            { label: 'Date', value: upcomingMeeting.date },
            { label: 'Time', value: upcomingMeeting.time },
            { label: 'Link', value: upcomingMeeting.link, href: upcomingMeeting.link },
          ]}
        />
      </DetailsSection>

      <DetailsSection title="CRM AI Configuration" icon={IconLazizaSparkleFill}>
        <CrmAiConfiguration
          version={aiConfiguration.version}
          modes={aiConfiguration.modes}
          onEdit={() => undefined}
        />
      </DetailsSection>

      <DetailsSection title="Relevance">
        <RelevanceButtons value={verdict} onChange={setVerdict} />
      </DetailsSection>

      <DetailsSection title="Participant in this room">
        <ParticipantList>
          {participants.map((person) => (
            <ParticipantRow key={person.id} {...person} />
          ))}
        </ParticipantList>
      </DetailsSection>

      <DetailsSection title="Not in this room">
        <ParticipantList>
          {notInRoom.map((person) => (
            <ParticipantRow
              key={person.id}
              state="notInRoom"
              {...person}
              onAdd={() => undefined}
            />
          ))}
        </ParticipantList>
      </DetailsSection>
    </DetailsPane>
  );
}

/**
 * CRM ▸ Inbox ▸ Details (Right).
 *
 * The third column of the Inbox — who the client is, what meeting is booked,
 * what the AI is doing, and who is in the room. Figma node 82:8753.
 */
export function DetailsPage() {
  return (
    <>
      <PageHeader
        title="Details (Right)"
        description="The Inbox's right column — the client and job card, the booked meeting, the AI configuration, the relevance verdict, and the two participant lists. Figma node 82:8753."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'CRM ▸ Inbox', pageId: 'crm-inbox' },
          { label: 'Mid ▸ Meeting Bubble', pageId: 'crm-mid-meeting' },
          { label: 'Components ▸ Avatar', pageId: 'avatar' },
        ]}
      >
        Every section folds. The pane holds no section of its own — what goes in it is the
        caller's, because a room with no meeting should not draw a{' '}
        <strong>Upcoming Meetings</strong> header with nothing under it, and only the app knows.
        The meeting card is <strong>MeetingBubble</strong>, borrowed from the thread rather than
        redrawn here.
      </CrossLink>

      <Section
        title="The column"
        description="The pane as the screen assembles it, at its real 328px. Every header is a hit target: click a label and the section folds."
      >
        <Preview>
          <Frame height={PANE_HEIGHT}>
            <DetailsColumn />
          </Frame>
        </Preview>
        <CodeBlock
          code={`<DetailsPane>
  <DetailsSection title="Client & Job Details">
    <ClientJobDetails {...client} />
  </DetailsSection>

  <DetailsSection title="CRM AI Configuration" icon={IconLazizaSparkleFill}>
    <CrmAiConfiguration version={version} modes={modes} onEdit={editPrompt} />
  </DetailsSection>

  <DetailsSection title="Participant in this room">
    <ParticipantList>
      {people.map((p) => <ParticipantRow key={p.id} {...p} />)}
    </ParticipantList>
  </DetailsSection>
</DetailsPane>`}
        />
      </Section>

      <Section
        title="ClientJobDetails"
        description="Who the client is, whether they are awake, how many people they have already talked to, and what the money looks like — in that order, because that is the order the question is answered in."
      >
        <Caption>
          The stat strip is the part that decides it. Six interviews and no hires is a client worth
          reading twice, and that reads at a glance only because the counters sit above the table
          rather than inside it.
        </Caption>
        <Preview>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <ClientJobDetails {...clientDetails} />
          </div>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <ClientJobDetails state="loading" />
          </div>
        </Preview>
        <Caption>
          Its other two states. <strong>external</strong> is not a failure — the room is about a job
          posted outside Upwork, so there is no client record to load and never will be, which is
          why it carries no stats and no table. <strong>error</strong> is a load that can be retried.
        </Caption>
        <Preview>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <ClientJobDetails state="external" />
          </div>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <ClientJobDetails state="error" onRetry={() => undefined} />
          </div>
        </Preview>
        <PropsTable
          rows={[
            {
              name: 'state',
              type: "'default' | 'loading' | 'error' | 'external'",
              default: "'default'",
              description:
                'What the card has to show. `external` is a job posted outside Upwork — no client record, rather than a failed load.',
            },
            { name: 'name', type: 'ReactNode', description: "The client's name." },
            { name: 'role', type: 'ReactNode', description: 'The line under it — "Client".' },
            {
              name: 'clientTime',
              type: 'ReactNode',
              description: "The client's local time. The row exists for the gap between the two.",
            },
            { name: 'yourTime', type: 'ReactNode', description: "The reader's own local time." },
            {
              name: 'stats',
              type: 'ClientStat[]',
              description: 'The counter strip. Any number is accepted; Figma draws five.',
            },
            {
              name: 'contractType',
              type: 'ReactNode',
              description: 'Drawn as the table\'s head row. Omitted, the table starts at its first row.',
            },
            { name: 'rows', type: 'ClientDetailRow[]', description: 'The rate rows under the head.' },
            {
              name: 'onRetry',
              type: '() => void',
              description: 'Retries the load. Only the error state draws it.',
            },
          ]}
        />
      </Section>

      <Section
        title="CrmAiConfiguration"
        description="What the AI is doing in this room, and on which prompt. The one card on the pane drawn in the Laziza orange."
      >
        <Caption>
          That colour is deliberate. Everything else on the pane is something the reader looks up;
          this is the only thing acting on the conversation on its own, so it should be findable
          without reading. <strong>off</strong> keeps the badges and greys them, so the reader can
          see what would happen if they turned it back on.
        </Caption>
        <Preview>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <CrmAiConfiguration
              version={aiConfiguration.version}
              modes={aiConfiguration.modes}
              onEdit={() => undefined}
            />
          </div>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <CrmAiConfiguration
              state="off"
              version={aiConfiguration.version}
              modes={aiConfiguration.modes}
            />
          </div>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <CrmAiConfiguration state="error" onRetry={() => undefined} />
          </div>
        </Preview>
        <PropsTable
          rows={[
            {
              name: 'state',
              type: "'default' | 'off' | 'error'",
              default: "'default'",
              description:
                'Switched off is not the same as failed to load — `off` keeps the badges, greyed.',
            },
            {
              name: 'version',
              type: 'ReactNode',
              description:
                'Which revision the room runs on. Shown, not chosen — the choice lives in AI settings.',
            },
            {
              name: 'modes',
              type: 'AiMessageMode[]',
              description:
                'The badges. Each pairs a message type with what the AI does with it — "First • Full Auto".',
            },
            {
              name: 'onEdit',
              type: '() => void',
              description: 'Opens the prompt. Draws the pencil when set.',
            },
          ]}
        />
      </Section>

      <Section
        title="RelevanceButtons"
        description="Was this lead worth surfacing. The pair the scanner learns from."
      >
        <Caption>
          At rest the labels are drawn in the border grey rather than in black — unusual, and
          deliberate: this is feedback the product asks for, not work the reader came to do, so it
          stays quiet until pointed at and only commits to a colour once it holds the answer. The
          two are equally wide because they are a choice between equals.
        </Caption>
        <Preview>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <RelevanceButtons />
          </div>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <RelevanceButtons value="relevant" />
          </div>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <RelevanceButtons value="notRelevant" />
          </div>
        </Preview>
        <PropsTable
          rows={[
            {
              name: 'value',
              type: "'relevant' | 'notRelevant'",
              description: 'Which verdict is recorded, if any.',
            },
            {
              name: 'onChange',
              type: '(verdict: RelevanceVerdict) => void',
              description: 'Called with the verdict the reader picked.',
            },
            { name: 'disabled', type: 'boolean', description: 'Turns both buttons inert.' },
          ]}
        />
      </Section>

      <Section
        title="ParticipantRow"
        description="One person, with their role under their name — and, for someone not yet in the room, the button that pulls them in."
      >
        <Caption>
          The role is the reason the row exists. A name alone does not tell a reader whether the
          person typing is the client, their own BM, or a freelancer they have never met, and on a
          shared room that is the first thing worth knowing.
        </Caption>
        <Preview>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <ParticipantList>
              <ParticipantRow {...participants[0]} />
              <ParticipantRow {...participants[1]} />
              <ParticipantRow state="notInRoom" {...notInRoom[0]} onAdd={() => undefined} />
              <ParticipantRow state="notInRoom" {...notInRoom[1]} onAdd={() => undefined} />
              <ParticipantRow state="loading" />
            </ParticipantList>
          </div>
        </Preview>
        <PropsTable
          rows={[
            {
              name: 'state',
              type: "'inRoom' | 'notInRoom' | 'loading'",
              default: "'inRoom'",
              description:
                '`notInRoom` is not an absence — it is a teammate who could be pulled in, and the row carries the button that does it.',
            },
            { name: 'name', type: 'ReactNode', description: 'Their name.' },
            {
              name: 'role',
              type: 'ReactNode',
              description: 'What they are to this room — "Client", "Business Manager".',
            },
            {
              name: 'badge',
              type: "'gigradar' | 'upworkApi' | ReactNode",
              description:
                "The mark in the avatar's corner — how this BM was reached.",
            },
            {
              name: 'onAdd',
              type: '() => void',
              description: 'Pulls them into the room. Only `notInRoom` draws it.',
            },
          ]}
        />
      </Section>

      <Section
        title="DetailsSection"
        description="The fold. Every block of the pane is one, which is what makes the pane one thing to learn rather than six."
      >
        <Caption>
          The whole header is the hit target, not just the chevron — the label is the larger thing
          to aim at, and a reader who has decided to close a section is aiming at its name. A closed
          section unmounts its body rather than hiding it, so a folded "Not in this room" does not
          leave four Add buttons in the tab order.
        </Caption>
        <Preview>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <DetailsSection title="Relevance">
              <RelevanceButtons value="relevant" />
            </DetailsSection>
          </div>
          <div style={{ width: component.details.width - component.details.padding * 2 }}>
            <DetailsSection title="Relevance" defaultOpen={false}>
              <RelevanceButtons />
            </DetailsSection>
          </div>
        </Preview>
        <PropsTable
          rows={[
            { name: 'title', type: 'ReactNode', description: "The section's name." },
            {
              name: 'icon',
              type: 'IconDef',
              description:
                'A glyph before the label. Only the AI section has one, which is what makes it read as the loud one.',
            },
            {
              name: 'open',
              type: 'boolean',
              description: 'Drives the fold from the caller. Leave unset to let the section keep its own state.',
            },
            { name: 'defaultOpen', type: 'boolean', default: 'true', description: 'Which way an uncontrolled section starts.' },
            {
              name: 'onToggle',
              type: '(open: boolean) => void',
              description:
                'Fires for controlled and uncontrolled alike, so an app that only wants to remember the fold does not also have to own it.',
            },
          ]}
        />
      </Section>

      <Section
        title="The empty pane"
        description="No room is open, so there is nothing to describe."
      >
        <Preview>
          <Frame height={400}>
            <DetailsPane empty />
          </Frame>
        </Preview>
      </Section>
    </>
  );
}
