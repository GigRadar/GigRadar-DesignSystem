import { color, spacing } from '@gigradar/theme';
import { AuthorBadge, BubbleChat, Sender } from '@gigradar/ui';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Surface } from './parts';

/** A row of examples, wrapped so a wide set stays on the page. */
function Examples({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.m,
        alignItems: 'flex-start',
      }}
    >
      {children}
    </div>
  );
}

/**
 * Laziza AI (Mid) — the AI's presence in the Inbox, gathered.
 *
 * A sibling of the chat room rather than one of its pieces. The pages under
 * `crm-mid` are the parts a room is assembled from; Laziza is a thing that runs
 * across all of them — it sends messages, it drafts for people, it writes
 * comments — and reading it as one of the room's parts would scatter a single
 * rule across three pages.
 *
 * The rule: **amber means the AI, or the client never sees it.** Everything in
 * this section is that rule applied somewhere.
 */
export function LazizaAiPage() {
  return (
    <>
      <PageHeader
        title="Laziza AI (Mid)"
        description="How the AI appears in a conversation — the badge beside a name, the amber avatar when it sends, and the wash that marks everything the client never sees. Figma node 3523:40585."
      />

      <CrossLink
        eyebrow="The three pages"
        links={[
          { label: 'Author Badge', pageId: 'crm-laziza-badge' },
          { label: 'In the thread', pageId: 'crm-laziza-thread' },
          { label: 'Internal only', pageId: 'crm-laziza-internal' },
        ]}
      >
        Laziza is <strong>not a component</strong>. It is a set of marks the ordinary chat components
        take on when the AI is what acted — a badge beside the name, an amber avatar on the sender, a
        wash behind an internal note. This section gathers them so the rule for when the amber
        appears lives in one place rather than being restated on every page that happens to draw it.
      </CrossLink>

      <Section
        title="The whole set, at a glance"
        description="Three surfaces, one colour. A badge saying the AI acted; the AI sending under its own name; a comment the client never sees. Each has its own page — this is the shape of the thing before you open them."
      >
        <Surface>
          <Examples>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
              <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
              <AuthorBadge kind="aiActivated">activated by vadym@email.com</AuthorBadge>
              <AuthorBadge kind="aiDeactivated">deactivated by vadym@email.com</AuthorBadge>
            </div>
            <Sender name="Laziza AI" avatar={{ tone: 'orange' }} textColor={color.accent.laziza.main} />
            <BubbleChat tone="comment" time="08:30">
              A comment — the client never sees this.
            </BubbleChat>
          </Examples>
        </Surface>
        <Caption>
          Left: the badges. Middle: the AI as a sender. Right: the internal wash. All three carry the
          same amber, which is the point — it is one thing to learn, not three.
        </Caption>
      </Section>

      <Section
        title="Where the AI is not"
        description="Two surfaces mention the AI but are documented elsewhere, because on both of them the AI is a control rather than a mark. The composer's Draft AI Response is a button in a toolbar, and AI Configuration is a settings screen. Splitting either out would leave the thing it belongs to incomplete."
      >
        <CrossLink
          eyebrow="Filed under"
          links={[
            { label: 'Mid ▸ Composer', pageId: 'crm-mid-composer' },
            { label: 'CRM ▸ Settings ▸ AI Configuration', pageId: 'crm-settings-ai' },
          ]}
        >
          The test for what belongs here: if it is a mark an ordinary component wears, it is Laziza.
          If it is a control that happens to invoke the AI, it belongs to the surface it sits on.
        </CrossLink>
      </Section>
    </>
  );
}
