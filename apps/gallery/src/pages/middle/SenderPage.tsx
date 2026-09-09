import { spacing } from '@gigradar/theme';
import { AuthorBadge, BubbleChat, SendIndicator, Sender } from '@gigradar/ui';
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
 * Mid ▸ Sender — Figma node 3523:40493.
 *
 * The line above a message naming who sent it. Figma draws fourteen states; they
 * are three independent things, so the page documents those rather than the
 * fourteen.
 */
export function SenderPage() {
  return (
    <>
      <PageHeader
        title="Sender"
        description="The line above a message naming who sent it, and on whose behalf. Figma node 3523:40493."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Mid ▸ Laziza AI', pageId: 'crm-mid-laziza' },
          { label: 'Components ▸ Main ▸ Avatar', pageId: 'avatar' },
        ]}
      >
        Figma's fourteen states are three independent things: which side the message is on, what
        kind of sender it is, and which badges follow the name. They are built to compose — so “my
        scheduled message written by the AI” is a combination rather than a fifteenth variant nobody
        drew. The badges are <strong>Author Badge</strong>, documented under Laziza AI.
      </CrossLink>

      <Section
        title="Which side"
        description="`side` mirrors the whole row — the avatar moves to the trailing edge and the name reads right-to-left. One row reversed rather than two arrangements, so a thread scans as two columns without either side needing its own component."
      >
        <Surface>
          <Stack>
            <Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />
            <Sender side="own" name="Marina Ovcharenko" avatar={{ tone: 'green' }} />
          </Stack>
        </Surface>
        <CodeBlock
          code={`<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />
<Sender side="own" name="Marina Ovcharenko" avatar={{ tone: 'green' }} />`}
        />
      </Section>

      <Section
        title="What kind of sender"
        description="The avatar is what says whether a message came from a person, from Upwork, or from Zoom — so a service message needs no separate variant, only a different mark. `Avatar` already draws the service marks."
      >
        <Surface>
          <Stack>
            <Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />
            <Sender name="Marina Ovcharenko" avatar={{ tone: 'volcano', badge: 'upworkApi' }} />
            <Sender name="The meeting starts in 30 minutes" avatar={{ service: 'upwork' }} />
            <Sender name="Recording from 3.12.2025" avatar={{ service: 'zoom' }} />
          </Stack>
        </Surface>
        <CodeBlock
          code={`<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} />
<Sender name="The meeting starts…" avatar={{ service: 'upwork' }} />`}
        />
      </Section>

      <Section
        title="With badges"
        description="`badges` takes whatever follows the name — who it was sent on behalf of, whether the AI wrote it, when it is scheduled for. They stack in the order passed, and reverse with the row on an own message."
      >
        <Surface>
          <Stack>
            <Sender
              name="Marina Ovcharenko"
              avatar={{ tone: 'volcano', badge: 'upworkApi' }}
              badges={<AuthorBadge>by janecooper@email.com</AuthorBadge>}
            />
            <Sender
              side="own"
              name="Marina Ovcharenko"
              avatar={{ tone: 'green' }}
              badges={
                <>
                  <AuthorBadge kind="ai">Laziza AI</AuthorBadge>
                  <AuthorBadge kind="schedule">Scheduled for 12 Jan 2025 at 14:00</AuthorBadge>
                </>
              }
            />
          </Stack>
        </Surface>
        <CodeBlock
          code={`<Sender
  name="Marina Ovcharenko"
  avatar={{ src: photo }}
  badges={<AuthorBadge>by janecooper@email.com</AuthorBadge>}
/>`}
        />
      </Section>

      <Section
        title="The unread rule"
        description="`divider` draws the line separating read from unread. The rule takes the leftover width, so it runs from the name to the far edge of the thread rather than being a fixed length. A comment's rule is amber rather than brand blue, matching the wash on the comment itself."
      >
        <Surface>
          <Stack>
            <Sender name="Floyd Miles" avatar={{ tone: 'purple' }} divider="New Message" />
            <Sender
              name="kulusevski@email.com"
              avatar={{ tone: 'default' }}
              divider="New Comment"
              dividerTone="comment"
            />
          </Stack>
        </Surface>
        <CodeBlock
          code={`<Sender name="Floyd Miles" avatar={{ tone: 'purple' }} divider="New Message" />
<Sender name="…" divider="New Comment" dividerTone="comment" />`}
        />
      </Section>

      <Section
        title="Loading"
        description="The skeleton drawn while the first page loads. Its own state rather than a separate component, so the row it replaces cannot drift away from it in height."
      >
        <Surface>
          <Stack>
            <Sender loading />
          </Stack>
        </Surface>
        <CodeBlock code={`<Sender loading />`} />
      </Section>

      <Section
        title="A message, assembled"
        description="What the pieces look like together: the sender's line, the bubble under it, and the delivery mark inside that."
      >
        <Surface>
          <Stack>
            <div>
              <Sender
                name="Marina Ovcharenko"
                avatar={{ tone: 'volcano', badge: 'upworkApi' }}
                badges={<AuthorBadge kind="ai">Laziza AI</AuthorBadge>}
              />
              <div style={{ marginTop: spacing.xs, marginLeft: 44 }}>
                <BubbleChat time="08:30">Lorem Ipsum dolor sit amet</BubbleChat>
              </div>
            </div>
          </Stack>
        </Surface>
        <Caption>
          The indicator inside the bubble is <code>SendIndicator</code>, usable on its own:{' '}
          <SendIndicator time="08:30" state="read" />
        </Caption>
      </Section>
    </>
  );
}
