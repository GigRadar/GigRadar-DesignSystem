import { color, spacing } from '@gigradar/theme';
import { AuthorBadge, BubbleChat, Sender } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Surface } from './parts';

function Stack({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s }}>{children}</div>
  );
}

/**
 * Mid ▸ Laziza AI — the AI's presence in the thread.
 *
 * Not a component of its own: Laziza is a set of marks the ordinary chat
 * components take on when the AI is what acted. Gathered here because the rule
 * for when the amber appears is one decision, and scattering it across the
 * bubble, sender, and badge pages would leave it written down nowhere.
 */
export function LazizaAiPage() {
  return (
    <>
      <PageHeader
        title="Laziza AI"
        description="How the AI appears in a conversation — the author badges, the sender's mark, and the states a message takes when Laziza wrote it. Figma node 3523:40585."
      />

      <CrossLink
        eyebrow="Appears in"
        links={[
          { label: 'Mid ▸ Sender', pageId: 'crm-mid-sender' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'CRM ▸ Settings ▸ AI Tools', pageId: 'crm-ai-tools' },
        ]}
      >
        Laziza is not a component. It is a set of marks the ordinary chat components take on when
        the AI is what acted — an <strong>Author Badge</strong> beside the name, an amber avatar on
        the <strong>Sender</strong>. This page gathers them so the rule for when the amber appears
        lives in one place.
      </CrossLink>

      <Section
        title="Author badges"
        description="A badge after the sender's name saying who acted, and on whose behalf. The plain “by …” forms carry no fill — they are a footnote to the name they follow, and a tint would give them equal weight. The AI, the meeting, and the schedule forms do take one, because each names a system rather than a person, and the colour is the fastest way to tell a queued send from a proposed call."
      >
        <Surface>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-start' }}>
            <AuthorBadge>by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="aiActivated">activated by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="aiDeactivated">deactivated by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
            <AuthorBadge kind="meeting">meeting proposed by vadym@email.com</AuthorBadge>
            <AuthorBadge kind="schedule">Scheduled for 12 Jan 2025 at 14:00</AuthorBadge>
          </div>
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
        title="The AI as a sender"
        description="When Laziza writes a message it is the sender, not a badge on someone else's. Its avatar takes the Laziza amber; deactivated, it goes grey — the same distinction the badges make."
      >
        <Surface>
          <Stack>
            <Sender
              name="Laziza AI"
              avatar={{ tone: 'orange' }}
              textColor={color.accent.laziza.main}
            />
            <Sender
              name="Laziza AI"
              avatar={{ tone: 'default' }}
              badges={<AuthorBadge kind="aiDeactivated">deactivated by vadym@email.com</AuthorBadge>}
            />
          </Stack>
        </Surface>
        <CodeBlock
          code={`<Sender name="Laziza AI" avatar={{ tone: 'orange' }} textColor={color.accent.laziza.main} />`}
        />
      </Section>

      <Section
        title="On someone else's message"
        description="More often Laziza acts on behalf of a person — it drafts, and the message still goes out under their name. The badge is what says so."
      >
        <Surface>
          <Stack>
            <div>
              <Sender
                side="own"
                name="Marina Ovcharenko"
                avatar={{ tone: 'volcano', badge: 'upworkApi' }}
                badges={
                  <>
                    <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
                    <AuthorBadge>by rafaelsamuel@email.com</AuthorBadge>
                  </>
                }
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: spacing.xs }}>
                <BubbleChat side="own" time="08:30" state="read">
                  Lorem Ipsum dolor sit amet
                </BubbleChat>
              </div>
            </div>
          </Stack>
        </Surface>
        <CodeBlock
          code={`<Sender
  side="own"
  name="Marina Ovcharenko"
  avatar={{ src: photo }}
  badges={<AuthorBadge kind="ai">Laziza AI</AuthorBadge>}
/>`}
        />
      </Section>

      <Section
        title="The comment wash"
        description="A comment takes the same Laziza background as the AI badges. That is deliberate: both are things the client never sees, and sharing the wash makes “internal” one colour to learn rather than two."
      >
        <Surface>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-start' }}>
            <BubbleChat tone="comment" time="08:30">
              A comment — the client never sees this.
            </BubbleChat>
            <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
          </div>
        </Surface>
        <CodeBlock code={`<BubbleChat tone="comment" time="08:30">…</BubbleChat>`} />
      </Section>

      <Section
        title="Still to build"
        description="Figma's Author component also carries a Reasoning state — the AI's expanded trace, with a step rail, tool calls, and monospace argument blocks (node 3523:40585). It is its own component rather than a badge, and is not built yet."
      >
        <Caption>Nodes 3545:32264 (collapsed) and 3545:32266 (expanded).</Caption>
      </Section>
    </>
  );
}
