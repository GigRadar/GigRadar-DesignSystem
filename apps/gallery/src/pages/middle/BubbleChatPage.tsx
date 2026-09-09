import { spacing } from '@gigradar/theme';
import { BubbleChat } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Surface } from './parts';

const noop = () => undefined;

/** The bubbles stacked as a thread, so the states read against each other. */
function Stack({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-start' }}>
      {children}
    </div>
  );
}

/**
 * Mid ▸ Bubble Chat — Figma node 3523:40393.
 *
 * One message in the thread. Figma draws ten states; they are three independent
 * things, so the page is organised by those rather than by the ten.
 */
export function BubbleChatPage() {
  return (
    <>
      <PageHeader
        title="Bubble Chat"
        description="One message in the thread — who said it, when, and what became of it. Figma node 3523:40393."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Mid ▸ Chat Action', pageId: 'crm-mid-chataction' },
          { label: 'Mid ▸ Sender', pageId: 'crm-mid-sender' },
          { label: 'Mid ▸ Attachment Bubble', pageId: 'crm-mid-attachment' },
        ]}
      >
        The time under a message is <strong>Send Indicator</strong>, and the controls on hover are{' '}
        <strong>Chat Action</strong> — both exported on their own. <strong>Sender</strong> is the row
        above that names who wrote it.
      </CrossLink>

      <Section
        title="Whose message it is"
        description="`side` decides which way the row reads. At rest both sides are white — the sender is told apart by the thread's alignment and by carrying a delivery mark, since only your own messages have a delivery to report. Hovering your own message fills it, which is what Figma's “Right - Hover” draws."
      >
        <Surface>
          <Stack>
            <BubbleChat time="08:30">Lorem Ipsum dolor sit amet</BubbleChat>
            <BubbleChat side="own" time="08:30" state="read">
              Lorem Ipsum dolor sit amet
            </BubbleChat>
          </Stack>
        </Surface>
        <Caption>Received, then sent — hover the second to see it fill.</Caption>
        <CodeBlock
          code={`<BubbleChat time="08:30">Lorem Ipsum dolor sit amet</BubbleChat>
<BubbleChat side="own" time="08:30" state="read">Lorem Ipsum dolor sit amet</BubbleChat>`}
        />
      </Section>

      <Section
        title="What kind of message"
        description="`tone` names the surface. A comment is an internal note — visible to the team, never sent to the client — and takes the Laziza wash so that difference is impossible to miss while scanning. A system message is the room speaking rather than a person."
      >
        <Surface>
          <Stack>
            <BubbleChat time="08:30">An ordinary message.</BubbleChat>
            <BubbleChat tone="comment" time="08:30">
              A comment — the client never sees this.
            </BubbleChat>
            <BubbleChat tone="system" locked time="8:30">
              View meetings, files with GigRadar Business Manager in this room
            </BubbleChat>
          </Stack>
        </Surface>
        <CodeBlock
          code={`<BubbleChat tone="comment" time="08:30">A comment</BubbleChat>
<BubbleChat tone="system" locked time="8:30">View meetings…</BubbleChat>`}
        />
      </Section>

      <Section
        title="What became of it"
        description="`state` is the delivery, drawn as the mark beside the time. Five states rather than a boolean, because “not delivered” means different things to the person who wrote it: offline resolves itself, error asks for action."
      >
        <Surface>
          <Stack>
            <BubbleChat side="own" time="08:30" state="sending">
              Sending…
            </BubbleChat>
            <BubbleChat side="own" time="08:30" state="sent">
              Reached the server.
            </BubbleChat>
            <BubbleChat side="own" time="08:30" state="read">
              Reached the other person.
            </BubbleChat>
            <BubbleChat side="own" time="08:30" state="error">
              This one did not go.
            </BubbleChat>
          </Stack>
        </Surface>
        <CodeBlock code={`<BubbleChat side="own" time="08:30" state="error">…</BubbleChat>`} />
      </Section>

      <Section
        title="Deleted and disabled"
        description="A deleted message keeps its place in the thread rather than vanishing, so the conversation around it still reads in order. `disabled` grays a message that cannot be acted on yet."
      >
        <Surface>
          <Stack>
            <BubbleChat deleted />
            <BubbleChat disabled>&nbsp;</BubbleChat>
          </Stack>
        </Surface>
        <CodeBlock code={`<BubbleChat deleted />`} />
      </Section>

      <Section
        title="The code chip"
        description="A value a preset filled in, drawn inline with the text rather than under it: it is a word inside the sentence, not a block quoted after it."
      >
        <Surface>
          <Stack>
            <BubbleChat time="08:30" code="Floyd">
              Lorem Ipsum dolor sit amet
            </BubbleChat>
          </Stack>
        </Surface>
        <CodeBlock code={`<BubbleChat time="08:30" code="Floyd">Lorem Ipsum dolor sit amet</BubbleChat>`} />
      </Section>

      <Section
        title="The hover controls"
        description="Passing `actions` makes the bubble draw its own action bar on hover. The bar overhangs the bubble's bottom edge rather than sitting inside it — the bubble is sized by its message, and reserving a strip for controls that are usually absent would leave every resting bubble with a gap in it."
      >
        <Surface>
          <div style={{ paddingBottom: spacing.m }}>
            <Stack>
              <BubbleChat side="own" time="08:30" state="read" actions={{ onEdit: noop, onDelete: noop }}>
                Hover me for edit and delete.
              </BubbleChat>
            </Stack>
          </div>
        </Surface>
        <Caption>Hover the bubble — the bar appears below its lower-left corner.</Caption>
        <CodeBlock
          code={`<BubbleChat
  side="own"
  time="08:30"
  actions={{ onEdit: editMessage, onDelete: deleteMessage }}
>
  Lorem Ipsum dolor sit amet
</BubbleChat>`}
        />
      </Section>
    </>
  );
}
