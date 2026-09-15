import { component } from '@gigradar/theme';
import { CrmAiConfiguration } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { aiConfiguration } from '../../fixtures/inbox';
import { Caption } from '../inbox/parts';

/** The card's width inside the pane — the column less its own padding. */
const CARD_WIDTH = component.details.width - component.details.padding * 2;

/**
 * CRM ▸ Inbox ▸ Details ▸ CRM AI Configuration.
 *
 * The pane's one loud section. Figma node 4285:25258.
 */
export function CrmAiConfigurationPage() {
  return (
    <>
      <PageHeader
        title="CRM AI Configuration"
        description="What the AI is doing in this room, and on which prompt. The one card on the pane drawn in the Laziza orange. Figma node 4285:25258."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[
          { label: 'CRM ▸ Inbox ▸ Details (Right)', pageId: 'crm-details' },
          { label: 'CRM ▸ Settings ▸ AI Configuration', pageId: 'crm-settings-ai' },
        ]}
      >
        The prompt version is shown, not chosen. Which revision a room runs on is decided in the AI
        settings screen; this card says which one won and offers the way back there.
      </CrossLink>

      <Section
        title="Default"
        description="A 1.5px border in the Laziza orange, where every other card on the pane is a hairline on white."
      >
        <Caption>
          That is deliberate. Everything else on the pane is something the reader looks up; this is
          the only thing acting on the conversation on its own, so it should be findable without
          reading.
        </Caption>
        <Preview>
          <div style={{ width: CARD_WIDTH }}>
            <CrmAiConfiguration
              version={aiConfiguration.version}
              modes={aiConfiguration.modes}
              onEdit={() => undefined}
            />
          </div>
        </Preview>
        <CodeBlock
          code={`<CrmAiConfiguration
  version="Tightened follow-up cadence"
  modes={[
    { type: 'First', mode: 'Full Auto' },
    { type: 'Other', mode: 'Co-pilot' },
  ]}
  onEdit={openPromptSettings}
/>`}
        />
      </Section>

      <Section title="Off, and failed to load" description="Its other two states.">
        <Caption>
          <strong>off</strong> keeps the badges and greys them, so the reader can see what would
          happen if they turned it back on — switched off is not the same as failed to load. The
          error state draws the sparkle with a stroke through it: the AI is the thing that did not
          load, so the glyph says so rather than a generic warning.
        </Caption>
        <Preview>
          <div style={{ width: CARD_WIDTH }}>
            <CrmAiConfiguration
              state="off"
              version={aiConfiguration.version}
              modes={aiConfiguration.modes}
            />
          </div>
          <div style={{ width: CARD_WIDTH }}>
            <CrmAiConfiguration state="error" onRetry={() => undefined} />
          </div>
        </Preview>
      </Section>

      <Section
        title="The message-type badges"
        description="Each pairs a kind of message with what the AI does with it, around a dot — the pair is one fact, since a mode means nothing without the messages it applies to."
      >
        <Caption>
          The default tones run orange then amber, which is the order Figma draws them: the first
          message is the one that goes out unattended, so it carries the stronger colour.
        </Caption>
        <Preview>
          <div style={{ width: CARD_WIDTH }}>
            <CrmAiConfiguration
              version="Default prompt"
              modes={[
                { type: 'First', mode: 'Full Auto' },
                { type: 'Other', mode: 'Co-pilot' },
                { type: 'Follow-up', mode: 'Off' },
              ]}
            />
          </div>
        </Preview>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            {
              name: 'state',
              type: "'default' | 'off' | 'error'",
              default: "'default'",
              description:
                'Switched off is not the same as failed to load — `off` keeps the badges, greyed.',
            },
            {
              name: 'version',
              type: 'ReactNode',
              description:
                'Which revision the room runs on. Shown, not chosen — the choice lives in AI settings.',
            },
            {
              name: 'modes',
              type: 'AiMessageMode[]',
              description:
                'The badges. Each pairs a message type with what the AI does with it — "First • Full Auto".',
            },
            {
              name: 'onEdit',
              type: '() => void',
              description: 'Opens the prompt. Draws the pencil when set.',
            },
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
