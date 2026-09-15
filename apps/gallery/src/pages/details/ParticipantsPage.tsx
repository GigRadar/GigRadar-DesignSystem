import { component } from '@gigradar/theme';
import { ParticipantList, ParticipantRow } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { notInRoom, participants } from '../../fixtures/inbox';
import { Caption } from '../inbox/parts';

/** The list's width inside the pane — the column less its own padding. */
const LIST_WIDTH = component.details.width - component.details.padding * 2;

/**
 * CRM ▸ Inbox ▸ Details ▸ Participants.
 *
 * Both lists on one page. Figma node 3600:24728.
 *
 * "Participant in this room" and "Not in this room" draw the same row in two
 * states, so splitting them across two pages would document one component
 * twice and invite the two copies to drift.
 */
export function ParticipantsPage() {
  return (
    <>
      <PageHeader
        title="Participants"
        description="Who is in the room, and who could be added to it — the same row in two states. Figma node 3600:24728."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[
          { label: 'CRM ▸ Inbox ▸ Details (Right)', pageId: 'crm-details' },
          { label: 'Components ▸ Avatar', pageId: 'avatar' },
        ]}
      >
        The pane draws two lists from one component. What differs between them is whether a row
        ends in an Add button, which is the state — not a second component.
      </CrossLink>

      <Section
        title="Participant in this room"
        description="The people the conversation already has."
      >
        <Caption>
          The role under the name is the reason the row exists. A name alone does not tell a reader
          whether the person typing is the client, their own BM, or a freelancer they have never
          met, and on a shared room that is the first thing worth knowing.
        </Caption>
        <Preview>
          <div style={{ width: LIST_WIDTH }}>
            <ParticipantList>
              {participants.map((person) => (
                <ParticipantRow key={person.id} {...person} />
              ))}
            </ParticipantList>
          </div>
        </Preview>
        <CodeBlock
          code={`<ParticipantList>
  {people.map((person) => (
    <ParticipantRow key={person.id} name={person.name} role={person.role} />
  ))}
</ParticipantList>`}
        />
      </Section>

      <Section
        title="Not in this room"
        description="Teammates who could be pulled in. Not an absence — the row carries the button that does it."
      >
        <Caption>
          The Add button sits on the list&rsquo;s right edge rather than against the name, so a
          column of them lines up however long the names are.
        </Caption>
        <Preview>
          <div style={{ width: LIST_WIDTH }}>
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
          </div>
        </Preview>
      </Section>

      <Section
        title="Badges, and loading"
        description="The mark in the avatar's corner says how a BM was reached — the GigRadar logo for one the product assigned, the blue API pill for one reached through the Upwork API."
      >
        <Preview>
          <div style={{ width: LIST_WIDTH }}>
            <ParticipantList>
              <ParticipantRow
                name="Maria Ovcharenko"
                role="Business Manager"
                avatarSrc={participants[1]?.avatarSrc}
                badge="gigradar"
              />
              <ParticipantRow
                name="Hermans"
                role="Business Manager"
                avatarSrc={notInRoom[1]?.avatarSrc}
                badge="upworkApi"
              />
              <ParticipantRow name="Jane Cooper" role="Freelancer" />
              <ParticipantRow state="loading" />
            </ParticipantList>
          </div>
        </Preview>
        <Caption>
          A person with no photo falls back to their initials, which is how Figma draws most of the
          room.
        </Caption>
      </Section>

      <Section title="Props">
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
            { name: 'avatarSrc', type: 'string', description: 'A photo. Falls back to initials.' },
            {
              name: 'badge',
              type: "'gigradar' | 'upworkApi' | ReactNode",
              description: "The mark in the avatar's corner — how this BM was reached.",
            },
            {
              name: 'onAdd',
              type: '() => void',
              description: 'Pulls them into the room. Only `notInRoom` draws it.',
            },
            {
              name: 'addLabel',
              type: 'ReactNode',
              description: 'The button\'s label. Defaults to "Add".',
            },
          ]}
        />
      </Section>
    </>
  );
}
