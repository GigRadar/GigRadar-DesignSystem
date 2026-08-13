import { AiPromptConfig, SettingsSection } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { OLDER_PROMPT, SAMPLE_PROMPT, VARIABLES, VERSIONS } from '../../fixtures/prompt';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Custom Prompt.
 *
 * The first of the screen's four sections. This page is about the section as
 * the screen assembles it — the card wired to real state, and the one prop
 * that genuinely changes its mode. The three primitives it composes are
 * documented under Components ▸ Prompt.
 */
export function CustomPromptPage() {
  return (
    <>
      <PageHeader
        title="Custom Prompt"
        description="The instructions Laziza follows on every CRM run, the variables it can interpolate, and the revision history behind it. Figma node 4949:2023."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'The whole screen', pageId: 'crm-settings-ai' },
          { label: 'Components ▸ Prompt field', pageId: 'prompt' },
        ]}
      >
        This section is one component — <code>AiPromptConfig</code> — assembled from the prompt
        field, the variable chips, and the version pill. Those three are design system primitives
        documented on their own; reach for them when building something other than this screen.
      </CrossLink>

      <Section
        title="The section"
        description="A SettingsSection title over the card, which is exactly how the screen stacks it. Edit the prompt to arm Save, click a variable chip to insert it at the caret, or open the version pill to browse revisions."
      >
        <PromptDemo />
        <CodeBlock
          code={`<SettingsSection
  title="Custom Prompt"
  description="The instructions Laziza follows on every CRM run…"
>
  <AiPromptConfig
    defaultValue={prompt}
    variables={variables}
    versions={versions}
    versionId={versionId}
    onVersionChange={(version) => load(version)}
    onSave={({ value, label }) => save(value, label)}
    onReset={() => resetToDefault()}
    savedHint="4 minutes ago"
  />
</SettingsSection>`}
        />
      </Section>

      <Section
        title="Viewing an older revision"
        description="Figma's “Another” state. The prompt goes read-only, the variable strip disappears, and Save/Cancel become Back and Restore. Reset drops out entirely — there is nothing to reset until you are back on the current revision."
      >
        <Preview>
          <div style={{ width: '100%' }}>
            <AiPromptConfig
              mode="viewing"
              defaultValue={OLDER_PROMPT}
              fieldHeight={200}
              variables={VARIABLES}
              versions={VERSIONS}
              versionId="v1"
              versionLabel="Default prompt from GigRadar"
            />
          </div>
        </Preview>
        <CodeBlock
          code={`<AiPromptConfig mode="viewing" versionId="v1" onBack={back} onRestore={restore} />`}
        />
      </Section>

      <Section
        title="Reset asks first"
        description="Reset discards every unsaved edit at once and cannot be undone, so the button opens a confirmation rather than firing. Pass `resetTitle` and `resetDescription` to reword it."
      >
        <CodeBlock
          code={`<AiPromptConfig
  onReset={() => resetToBase()}
  resetTitle="Discard your changes?"
  resetDescription="The prompt goes back to the last saved version."
/>`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'mode', type: `'editing' | 'viewing'`, default: `'editing'`, description: "Figma's “Another” state. Viewing is read-only, drops the strip, and swaps Save/Cancel for Back/Restore." },
            { name: 'onBack / onRestore', type: '() => void', description: 'The two viewing-mode buttons.' },
            { name: 'value / defaultValue', type: 'string', description: 'The prompt text, controlled or not.' },
            { name: 'onChange', type: '(value: string) => void', description: 'Fires on every keystroke and on every chip insert.' },
            { name: 'variables', type: 'PromptVariableDef[]', default: '[]', description: 'Chips in the insert strip. `{ name, description, example }` — the last two fill the hover tooltip.' },
            { name: 'variablesHint / defaultVariablesOpen', type: 'ReactNode / boolean', description: 'The strip’s helper line, and whether it starts expanded.' },
            { name: 'versions / versionId', type: 'PromptVersion[] / string', description: 'Saved revisions, newest first, and which one is loaded.' },
            { name: 'onVersionChange', type: '(version) => void', description: 'A revision was picked from the list.' },
            { name: 'onVersionRestore / onVersionDelete', type: '(version) => void', description: 'Row actions. Each button is omitted when its handler is absent.' },
            { name: 'versionLabel / onVersionLabelChange', type: 'string / (label) => void', description: 'The revision-name field.' },
            { name: 'onSave', type: '({ value, label }) => void', description: 'Enabled only while the text differs from the loaded revision.' },
            { name: 'onCancel', type: '() => void', description: 'Reverts the field to the loaded revision, then calls back.' },
            { name: 'onReset', type: '() => void', description: 'The destructive reset. Confirms first. Omitted when absent, and in viewing mode.' },
            { name: 'resetTitle / resetDescription', type: 'ReactNode', description: 'The reset confirmation’s wording.' },
            { name: 'savedHint / saving', type: 'ReactNode / boolean', description: 'The right-hand status, and the in-flight state that spins Save.' },
            { name: 'renderField / renderVariables / renderFooter', type: 'RenderProp', description: 'Replace the prompt field, the insert strip, or the footer row. Call `defaultRender()` to decorate rather than replace.' },
          ]}
        />
      </Section>
    </>
  );
}

/** The section, wired the way the screen wires it. */
function PromptDemo() {
  const [versionId, setVersionId] = useState('v2');
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <Preview>
      <div style={{ width: '100%' }}>
                <SettingsSection
          paddingX={0}
          title="Custom Prompt"
          description="The instructions Laziza follows on every CRM run. Save your changes to commit a new version, you can restore any earlier version below."
        >
          <AiPromptConfig
            defaultValue={SAMPLE_PROMPT}
            fieldHeight={260}
            variables={VARIABLES}
            versions={VERSIONS}
            versionId={versionId}
            onVersionChange={(version) => setVersionId(version.id)}
            onVersionRestore={(version) => setSaved(`restored ${version.id}`)}
            onVersionDelete={(version) => setSaved(`deleted ${version.id}`)}
            onSave={({ label }) => setSaved(label ? `saved as “${label}”` : 'saved')}
            onReset={() => setSaved('reset to v0')}
            savedHint={saved ?? '4 minutes ago'}
          />
        </SettingsSection>
      </div>
    </Preview>
  );
}
