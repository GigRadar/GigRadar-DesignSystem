import { component } from '@gigradar/theme';
import { ClientJobDetails } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { clientDetails } from '../../fixtures/inbox';
import { Caption } from '../inbox/parts';

/** The card's width inside the pane — the column less its own padding. */
const CARD_WIDTH = component.details.width - component.details.padding * 2;

/**
 * CRM ▸ Inbox ▸ Details ▸ Client & Job Details.
 *
 * The pane's first section. Figma node 4408:31380.
 */
export function ClientJobDetailsPage() {
  return (
    <>
      <PageHeader
        title="Client & Job Details"
        description="Who the client is, whether they are awake, how many people they have already talked to, and what the money looks like. Figma node 4408:31380."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[
          { label: 'CRM ▸ Inbox ▸ Details (Right)', pageId: 'crm-details' },
          { label: 'Components ▸ Avatar', pageId: 'avatar' },
        ]}
      >
        The first section of the details pane, and the one that answers the question the pane
        exists for: is this lead worth the next hour.
      </CrossLink>

      <Section
        title="Default"
        description="The card answers top to bottom, in the order the question gets answered."
      >
        <Caption>
          The stat strip is the part that decides it — six interviews and no hires reads at a
          glance — which is why it sits above the rate table rather than inside it.
        </Caption>
        <Preview>
          <div style={{ width: CARD_WIDTH }}>
            <ClientJobDetails {...clientDetails} />
          </div>
        </Preview>
        <CodeBlock
          code={`<ClientJobDetails
  name="Floyd Miles"
  role="Client"
  clientTime="02:10"
  yourTime="09:00"
  utcOffset="UTC +1"
  gmtOffset="GMT +1"
  stats={[{ label: 'Interview', value: '6' }, …]}
  contractType="Hourly Rate"
  rows={[{ label: 'Rate', value: '$10.00' }, …]}
/>`}
        />
      </Section>

      <Section
        title="Loading, external, and error"
        description="Its other three states."
      >
        <Caption>
          <strong>external</strong> is not a failure — the room is about a job posted outside
          Upwork, so there is no client record to load and never will be, which is why it carries
          no stats and no table. <strong>error</strong> is a load that can be retried, and draws no
          name, because a card that failed to load has none to show.
        </Caption>
        <Preview>
          <div style={{ width: CARD_WIDTH }}>
            <ClientJobDetails state="loading" />
          </div>
          <div style={{ width: CARD_WIDTH }}>
            <ClientJobDetails state="external" />
          </div>
          <div style={{ width: CARD_WIDTH }}>
            <ClientJobDetails state="error" onRetry={() => undefined} />
          </div>
        </Preview>
      </Section>

      <Section title="Props">
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
            { name: 'avatarSrc', type: 'string', description: 'A photo. Falls back to initials.' },
            {
              name: 'clientTime',
              type: 'ReactNode',
              description: "The client's local time. The row exists for the gap between the two.",
            },
            { name: 'yourTime', type: 'ReactNode', description: "The reader's own local time." },
            { name: 'utcOffset', type: 'ReactNode', description: "The client's offset pill." },
            {
              name: 'gmtOffset',
              type: 'ReactNode',
              description: "The reader's, drawn in the quieter grey.",
            },
            {
              name: 'stats',
              type: 'ClientStat[]',
              description: 'The counter strip. Any number is accepted; Figma draws five.',
            },
            {
              name: 'contractType',
              type: 'ReactNode',
              description:
                "Drawn as the table's head row. Omitted, the table starts at its first row.",
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
    </>
  );
}
