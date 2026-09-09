import { spacing } from '@gigradar/theme';
import { ChatAction, SendIndicator } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Row, Surface } from './parts';

const noop = () => undefined;

/**
 * Mid ▸ Chat Action — Figma node 3518:21085.
 *
 * The controls that appear on a message when it is hovered, and the send
 * indicator that reports what became of it. Filed together because both are
 * parts of a bubble rather than surfaces of their own.
 */
export function ChatActionPage() {
  return (
    <>
      <PageHeader
        title="Chat Action"
        description="The controls on a hovered message, and the mark under it reporting what became of it. Figma nodes 3518:21085 and 3523:40843."
      />

      <CrossLink
        eyebrow="Used by"
        links={[
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Mid ▸ Attachment Bubble', pageId: 'crm-mid-attachment' },
        ]}
      >
        Both bubbles compose these. Figma files the round button inside the bar as its own component
        (“Chat Menu”); it is not exported separately here, because it is only ever a button in this
        bar and nothing else can reach it.
      </CrossLink>

      <Section
        title="The bar"
        description="Which controls appear is decided by which handlers are passed rather than by a variant. A scheduled attachment can be downloaded, rescheduled, and cancelled all at once, and a fixed set of variants would have to name every combination the product turns out to need."
      >
        <Surface>
          <Row gap={spacing.s}>
            <ChatAction onEdit={noop} onDelete={noop} />
            <ChatAction onDownload={noop} onDelete={noop} />
            <ChatAction onSendNow={noop} onReschedule={noop} onCancel={noop} />
            <ChatAction
              onSendNow={noop}
              onReschedule={noop}
              onDownload={noop}
              onEdit={noop}
              onDelete={noop}
              onCancel={noop}
            />
          </Row>
        </Surface>
        <Caption>
          A message, an attachment, a scheduled message, and everything at once — the last is not a
          real combination, only proof the bar composes.
        </Caption>
        <CodeBlock
          code={`<ChatAction onEdit={editMessage} onDelete={deleteMessage} />
<ChatAction onDownload={downloadFile} onDelete={deleteFile} />
<ChatAction onSendNow={sendNow} onReschedule={reschedule} onCancel={cancel} />`}
        />
      </Section>

      <Section
        title="Destructive controls"
        description="Delete and cancel take the error red; everything else is the quiet nav text. Only those two destroy anything, and they should not be reachable by muscle memory alone."
      >
        <Surface>
          <Row gap={spacing.s}>
            <ChatAction onEdit={noop} onDownload={noop} onSendNow={noop} onReschedule={noop} />
            <ChatAction onDelete={noop} onCancel={noop} />
          </Row>
        </Surface>
        <Caption>The safe controls, then the two that are not.</Caption>
      </Section>

      <Section
        title="Send indicator"
        description="The time under a message and what became of it. Five states rather than a boolean, because “not delivered” means different things to the person who wrote it: offline resolves itself, error asks for action. Only the sender's own messages carry a mark — a received message has nothing to report about its delivery."
      >
        <Surface>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
            <SendIndicator time="08:30" state="sending" />
            <SendIndicator time="08:30" state="sent" />
            <SendIndicator time="08:30" state="read" />
            <SendIndicator time="08:30" state="offline" />
            <SendIndicator time="08:30" state="error" />
            <SendIndicator time="08:30" state="sent" edited />
          </div>
        </Surface>
        <Caption>
          Sending, sent, read, offline, error — then `edited`, which prefixes the time to say it
          now reports the change rather than the original.
        </Caption>
        <CodeBlock
          code={`<SendIndicator time="08:30" state="read" />
<SendIndicator time="08:30" state="sent" edited />`}
        />
      </Section>
    </>
  );
}
