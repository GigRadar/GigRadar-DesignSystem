import { spacing } from '@gigradar/theme';
import { AttachmentBubble } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Surface } from './parts';

const noop = () => undefined;

function Stack({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, alignItems: 'flex-start' }}>
      {children}
    </div>
  );
}

/**
 * Mid ▸ Attachment Bubble — Figma nodes 3523:40358 and 3523:40410.
 *
 * Figma files the file and the picture as two components; they are one layout
 * with two glyphs, so the page documents them together and `kind` is what picks.
 */
export function AttachmentBubblePage() {
  return (
    <>
      <PageHeader
        title="Attachment Bubble"
        description="A file or a picture in the thread, and what became of the upload. Figma nodes 3523:40358 (file) and 3523:40410 (picture)."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Mid ▸ Chat Action', pageId: 'crm-mid-chataction' },
        ]}
      >
        Figma draws the file and the picture as separate components. They are one component here:
        the layout, the states, and the controls are identical, and the only difference is which
        glyph leads and whether a type line follows.
      </CrossLink>

      <Section
        title="File and picture"
        description="`kind` picks the glyph. A file carries its type under the name; a picture does not, because the glyph has already said what it is. Both are fixed at 258px rather than sized by the filename — a column of attachments whose widths follow their names reads as ragged noise, so the name truncates and the bubble holds its shape."
      >
        <Surface>
          <Stack>
            <AttachmentBubble name="Draft Design.pdf" type="PDF" time="08:30" state="read" />
            <AttachmentBubble kind="picture" name="Screenshot 2022-06-21.png" time="08:30" state="read" />
            <AttachmentBubble
              name="A rather long filename that will not fit in the bubble.pdf"
              type="PDF"
              time="08:30"
            />
          </Stack>
        </Surface>
        <Caption>The third shows the truncation.</Caption>
        <CodeBlock
          code={`<AttachmentBubble name="Draft Design.pdf" type="PDF" time="08:30" state="read" />
<AttachmentBubble kind="picture" name="Screenshot.png" time="08:30" />`}
        />
      </Section>

      <Section
        title="Failed"
        description="`failed` washes the bubble red and drops the controls, since there is nothing to open and nothing to download. There is no uploading state here: a file only reaches the thread once it has arrived, so the wait belongs to the composer's own chip — see Mid ▸ Composer."
      >
        <Surface>
          <Stack>
            <AttachmentBubble name="Draft Design.pdf" type="PDF" failed />
            <AttachmentBubble kind="picture" name="Screenshot 2022-06-21.png" failed />
          </Stack>
        </Surface>
        <Caption>
          The failed wash is a 15% red layered over the bubble rather than a flat tint, so it
          composites the same way over whatever fill sits beneath it.
        </Caption>
        <CodeBlock
          code={`<AttachmentBubble name="Draft Design.pdf" type="PDF" failed />`}
        />
      </Section>

      <Section
        title="The hover controls"
        description="An attachment offers download alongside delete, which an ordinary message does not. Which controls appear is decided by which handlers are passed rather than by a variant."
      >
        <Surface>
          <div style={{ paddingBottom: spacing.m }}>
            <Stack>
              <AttachmentBubble
                name="Draft Design.pdf"
                type="PDF"
                time="08:30"
                state="read"
                onOpen={noop}
                actions={{ onDownload: noop, onDelete: noop }}
              />
            </Stack>
          </div>
        </Surface>
        <Caption>Hover the bubble.</Caption>
        <CodeBlock
          code={`<AttachmentBubble
  name="Draft Design.pdf"
  type="PDF"
  time="08:30"
  onOpen={openFile}
  actions={{ onDownload: downloadFile, onDelete: deleteFile }}
/>`}
        />
      </Section>

      <Section
        title="Props"
        description="A file and a picture are one component in two kinds rather than two components: they carry the same delivery state, the same hover controls and the same scheduled ring, and only the body between them differs."
      >
        <PropsTable
          rows={[
            {
              name: 'name',
              type: 'ReactNode',
              description: "The file's name. Truncates rather than wrapping — the bubble is fixed.",
            },
            {
              name: 'type',
              type: 'ReactNode',
              description:
                'The file type, drawn under the name — “PDF”. Ignored for a picture, which does not carry one.',
            },
            {
              name: 'kind',
              type: "'file' | 'picture'",
              default: "'file'",
              description: 'Which body to draw — the file row, or the thumbnail.',
            },
            { name: 'time', type: 'ReactNode', description: 'The time under the bubble.' },
            {
              name: 'state',
              type: "'sending' | 'sent' | 'read' | 'offline' | 'error'",
              default: "'sent'",
              description: 'The delivery, drawn beside the time — the same states a message carries.',
            },
            {
              name: 'failed',
              type: 'boolean',
              default: 'false',
              description:
                'The upload did not complete. Washes the bubble red and drops the controls: there is nothing to open, and nothing to download.',
            },
            { name: 'onOpen', type: '() => void', description: 'Opens the file.' },
            {
              name: 'actions',
              type: 'ChatActionProps',
              description:
                'The hover controls. Download is offered on both sides — a file someone sent you is still a file you can keep — while edit and delete stay on your own attachment inside the edit window.',
            },
            {
              name: 'side',
              type: "'own' | 'other'",
              default: "'other'",
              description: 'Whose attachment it is, and which way the row reads.',
            },
            {
              name: 'sentAt',
              type: 'Date | number',
              description: 'Drives the edit window, exactly as it does on a message bubble.',
            },
            {
              name: 'scheduled',
              type: 'boolean',
              default: 'false',
              description:
                'Rings the bubble in the schedule purple — a file attached to a message that has not gone out yet.',
            },
          ]}
        />
      </Section>
    </>
  );
}
