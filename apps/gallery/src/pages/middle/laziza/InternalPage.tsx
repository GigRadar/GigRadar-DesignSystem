import { spacing } from '@gigradar/theme';
import { AuthorBadge, BubbleChat } from '@gigradar/ui';
import { CodeBlock } from '../../../components/CodeBlock';
import { PageHeader, Section } from '../../../layout';
import { CrossLink } from '../../../navigation';
import { Caption, Surface } from '../parts';

/**
 * Laziza AI ▸ Internal only — the one colour that means "the client never sees
 * this".
 *
 * Filed under Laziza rather than under Bubble Chat because the wash is not a
 * fact about comments; it is a fact about the amber, and the amber is shared
 * with the AI badges on purpose.
 */
export function LazizaInternalPage() {
  return (
    <>
      <PageHeader
        title="Internal only"
        description="The Laziza wash marks everything the client never sees — a comment, an AI badge, an internal note. One colour to learn rather than two."
      />

      <CrossLink
        eyebrow="Shares its colour with"
        links={[
          { label: 'Laziza AI ▸ Author Badge', pageId: 'crm-laziza-badge' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Mid ▸ Composer', pageId: 'crm-mid-composer' },
        ]}
      >
        The composer's note mode writes into the same wash, so the thing you are typing looks like
        the thing it becomes. That is the rule worth holding: <strong>amber means internal</strong>,
        wherever it appears.
      </CrossLink>

      <Section
        title="The comment wash"
        description="A comment takes the same Laziza background as the AI badges. That is deliberate: both are things the client never sees, and sharing the wash makes “internal” one colour to learn rather than two."
      >
        <Surface>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
              alignItems: 'flex-start',
            }}
          >
            <BubbleChat tone="comment" time="08:30">
              A comment — the client never sees this.
            </BubbleChat>
            <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
          </div>
        </Surface>
        <Caption>
          The bubble and the badge are different components carrying the same wash. Read together
          they say one thing: this stayed inside the team.
        </Caption>
        <CodeBlock code={`<BubbleChat tone="comment" time="08:30">…</BubbleChat>`} />
      </Section>

      <Section
        title="Against a sent message"
        description="Side by side is the only way to check the rule holds — an internal note and a message that reached the client should never be mistakable for one another at a glance."
      >
        <Surface>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
              alignItems: 'flex-start',
            }}
          >
            <BubbleChat tone="comment" time="08:30">
              Internal — flagging that they asked about rates.
            </BubbleChat>
            <BubbleChat time="08:31">Happy to walk through pricing on a call.</BubbleChat>
          </div>
        </Surface>
        <Caption>
          Top stays in the team; bottom went to the client. The wash is doing all the work.
        </Caption>
      </Section>
    </>
  );
}
