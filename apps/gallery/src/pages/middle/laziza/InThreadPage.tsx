import { color, spacing } from '@gigradar/theme';
import { AuthorBadge, BubbleChat, Sender } from '@gigradar/ui';
import { CodeBlock } from '../../../components/CodeBlock';
import { PageHeader, Section } from '../../../layout';
import { CrossLink } from '../../../navigation';
import { Caption, Surface } from '../parts';

function Stack({ children }: { children: React.ReactNode }) {
  return <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s }}>{children}</div>;
}

/**
 * Laziza AI ▸ In the thread — the two ways the AI reaches a conversation.
 *
 * Either it is the sender, or it acted for one. Those are different messages
 * with different marks, and telling them apart is the whole job of this page:
 * one is a message from the AI, the other is a person's message the AI wrote.
 */
export function LazizaInThreadPage() {
  return (
    <>
      <PageHeader
        title="In the thread"
        description="How a message says the AI was involved — as the sender itself, or as the thing that drafted someone else's. No new components: the ordinary Sender and Bubble Chat wearing the Laziza amber."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Laziza AI ▸ Author Badge', pageId: 'crm-laziza-badge' },
          { label: 'Mid ▸ Sender', pageId: 'crm-mid-sender' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
        ]}
      >
        Nothing on this page is a Laziza component. The distinction that matters — <em>from</em> the
        AI versus <em>drafted by</em> the AI — is carried entirely by which slot the amber lands in:
        the avatar, or a badge beside a human name.
      </CrossLink>

      <Section
        title="The AI as the sender"
        description="When Laziza writes a message it is the sender, not a badge on someone else's. Its avatar takes the Laziza amber; deactivated, it goes grey — the same distinction the badges make."
      >
        <Surface>
          <Stack>
            <Sender name="Laziza AI" avatar={{ tone: 'orange' }} textColor={color.accent.laziza.main} />
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
        title="Drafted for a person"
        description="More often Laziza acts on behalf of someone — it drafts, and the message still goes out under their name and their avatar. The badge is the only thing that says so, which is why it is a badge rather than a change to the sender."
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
        <Caption>
          Two badges, in order: what wrote it, then who it went out under. The client sees neither —
          they see Marina's message.
        </Caption>
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
        title="Still to build"
        description="Figma's Author component also carries a Reasoning state — the AI's expanded trace, with a step rail, tool calls, and monospace argument blocks. It is its own component rather than a badge, and is not built yet."
      >
        <Caption>Nodes 3545:32264 (collapsed) and 3545:32266 (expanded).</Caption>
      </Section>
    </>
  );
}
