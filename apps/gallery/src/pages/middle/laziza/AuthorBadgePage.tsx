import { spacing } from '@gigradar/theme';
import { AuthorBadge } from '@gigradar/ui';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { PageHeader, Section } from '../../../layout';
import { CrossLink } from '../../../navigation';
import { Caption, Surface } from '../parts';

/** The badges, stacked so the tinted and untinted forms read as two groups. */
function Badges({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-start' }}
    >
      {children}
    </div>
  );
}

/**
 * Laziza AI ▸ Author Badge — the mark after a sender's name.
 *
 * The one real component in the Laziza set. Everything else under this section
 * is an ordinary chat component wearing the amber; this is a thing of its own.
 */
export function LazizaAuthorBadgePage() {
  return (
    <>
      <PageHeader
        title="Author Badge"
        description="The badge after a sender's name saying who acted, and on whose behalf. Six kinds across two groups — footnotes to a name, and systems that acted. Figma node 3523:40585."
      />

      <CrossLink
        eyebrow="Used by"
        links={[
          { label: 'Mid ▸ Sender', pageId: 'crm-mid-sender' },
          { label: 'Laziza AI ▸ In the thread', pageId: 'crm-laziza-thread' },
          { label: 'Schedule Message (Mid)', pageId: 'crm-mid-scheduled' },
        ]}
      >
        `Sender` takes these in its <code>badges</code> slot, and they stack in the order passed. The
        kind is what decides whether the badge is a footnote or a mark in its own right.
      </CrossLink>

      <Section
        title="The two groups"
        description="The plain “by …” forms carry no fill — they are a footnote to the name they follow, and a tint would give them equal weight. The AI, meeting and schedule forms do take one, because each names a system rather than a person, and the colour is the fastest way to tell a queued send from a proposed call."
      >
        <Surface>
          <Badges>
            <AuthorBadge>by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="aiActivated">activated by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="aiDeactivated">deactivated by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
            <AuthorBadge kind="meeting">meeting proposed by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="schedule">Scheduled for 12 Jan 2025 at 14:00</AuthorBadge>
          </Badges>
        </Surface>
        <Caption>
          Activated is amber and deactivated is grey: turning the AI on is the state worth noticing,
          and turning it off returns the room to its ordinary condition.
        </Caption>
        <CodeBlock
          code={`<AuthorBadge>by vadym@email.com</AuthorBadge>
<AuthorBadge kind="ai">Laziza AI</AuthorBadge>
<AuthorBadge kind="schedule">Scheduled for 12 Jan 2025 at 14:00</AuthorBadge>`}
        />
      </Section>

      <Section
        title="Props"
        description="`kind` is the only prop that changes what the badge means; the rest are per-instance overrides for a caller drawing it somewhere the defaults do not suit."
      >
        <PropsTable
          rows={[
            {
              name: 'kind',
              type: `'author' | 'ai' | 'aiActivated' | 'aiDeactivated' | 'meeting' | 'schedule'`,
              default: `'author'`,
              description:
                'Who acted. `author` is the untinted footnote; the rest name a system and carry a fill.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'The label. Written out in full — the badge does not abbreviate.',
            },
            {
              name: 'background / textColor',
              type: 'string',
              description: "Overrides the kind's own palette, for a surface it was not drawn on.",
            },
          ]}
        />
      </Section>
    </>
  );
}
