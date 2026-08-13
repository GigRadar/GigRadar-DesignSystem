import { SettingsSection } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { AutoReplyDemo } from '../../demos/aiConfiguration';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Auto Reply.
 *
 * The card that decides how much of a reply Laziza sends on its own. The tab
 * strip is the part worth understanding: each message class carries its own
 * mode, so the card holds a mode *per tab* rather than one setting the tabs
 * merely filter.
 */
export function AutoReplyPage() {
  return (
    <>
      <PageHeader
        title="Auto Reply"
        description="How much of a reply Laziza sends without asking — per message class, not per thread. Figma node 3962:39155."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'The whole screen', pageId: 'crm-settings-ai' },
          { label: 'Components ▸ Option button', pageId: 'option-button' },
          { label: 'Components ▸ Mode tab', pageId: 'mode-tab' },
          { label: 'Components ▸ Badge', pageId: 'badge' },
        ]}
      >
        The card composes the mode tab, the option button, and the mode badge — each documented on
        its own under Components. This page is the assembled section and its wiring.
      </CrossLink>

      <Section
        title="The section"
        description="Switch tabs and the mode changes with them: First Message and Other Message each hold their own setting, and the badge on each tab reports it without the tab having to be open. Pick Co-pilot to reveal the extra-prompt field."
      >
        <Preview>
          <div style={{ width: '100%' }}>
            <SettingsSection
              paddingX={0}
              title="Auto Reply"
              description="Reply to every message in a thread, or only the first one."
            >
              <AutoReplyDemo />
            </SettingsSection>
          </div>
        </Preview>
        <CodeBlock
          code={`// Each class carries its own mode, so the state is keyed by tab.
const [modes, setModes] = useState({ first: 'fullAuto', other: 'coPilot' });
const [tabId, setTabId] = useState('first');

<AutoReply
  tabs={TABS.map((tab) => ({ ...tab, mode: modes[tab.id] }))}
  tabId={tabId}
  onTabChange={(tab) => setTabId(tab.id)}
  options={OPTIONS}
  value={modes[tabId]}
  onChange={(mode) => setModes((s) => ({ ...s, [tabId]: mode }))}
  onSave={save}
  onCancel={cancel}
  onReset={reset}
/>`}
        />
      </Section>

      <Section
        title="Why the mode is per tab"
        description="The tabs are message classes, not filters over one setting."
      >
        <CodeBlock
          code={`// Wrong — one mode behind two tabs. Switching tabs appears to work, then
// changing the mode silently rewrites the other class's setting too.
const [mode, setMode] = useState('fullAuto');

// Right — a mode per class. The badge on each tab can then report that
// class's setting while a different tab is open.
const [modes, setModes] = useState({ first: 'fullAuto', other: 'coPilot' });`}
        />
      </Section>

      <Section
        title="Reset asks first"
        description="Reset discards every unsaved edit at once and cannot be undone, so the button opens a confirmation rather than firing. Pass `resetTitle` and `resetDescription` to reword it."
      >
        <CodeBlock
          code={`<AutoReply
  onReset={() => revert()}
  resetTitle="Discard your changes?"
  resetDescription="The reply modes and prompts go back to the last saved version."
/>`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'tabs', type: 'AutoReplyTab[]', default: '[]', description: '`{ id, label, mode }` per message class. `mode` draws the badge on the tab.' },
            { name: 'tabId / onTabChange', type: 'string / (tab) => void', description: 'The open tab, controlled.' },
            { name: 'options', type: 'AutoReplyOption[]', default: '[]', description: '`{ id, label, description, markerLabel, markerIcon, markerColor }` per mode.' },
            { name: 'value / onChange', type: 'ReplyMode / (mode) => void', description: 'The selected mode for the open tab.' },
            { name: 'promptEnabled / onPromptEnabledChange', type: 'boolean / (enabled) => void', description: 'Whether the extra-prompt field is shown under the chosen mode.' },
            { name: 'promptValue / defaultPromptValue / onPromptChange', type: 'string / (value) => void', description: 'That field’s text, controlled or not.' },
            { name: 'promptLabel / promptPlaceholder', type: 'ReactNode / string', description: 'Its label and placeholder.' },
            { name: 'onSave / onCancel', type: '() => void', description: 'The footer actions. Save is enabled only while dirty.' },
            { name: 'onReset', type: '() => void', description: 'The destructive reset. Confirms first, and is omitted when absent.' },
            { name: 'resetTitle / resetDescription', type: 'ReactNode', description: 'The reset confirmation’s wording.' },
            { name: 'saving / disabled', type: 'boolean', description: 'A save in flight, and the whole card inert.' },
            { name: 'renderOption / renderFooter', type: 'RenderProp', description: 'Replace one option row or the footer. Call `defaultRender()` to decorate.' },
            { name: 'radius / padding / gap / background / borderColor', type: 'CssLength / string', description: 'The card’s own metrics.' },
          ]}
        />
      </Section>
    </>
  );
}
