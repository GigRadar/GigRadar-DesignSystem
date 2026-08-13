import { color, component, radius, spacing, textStyle } from '@gigradar/theme';
import {
  AiTool,
  AiPromptConfig,
  CustomPromptField,
  PromptVariable,
  ModeBadge,
  SettingsHeader,
  SettingsSection,
  VersionNumber,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { AutoReplyDemo, MentionPresetDemo } from '../demos/aiConfiguration';
import { AI_TOOLS } from '../fixtures/aiConfiguration';
import { OLDER_PROMPT, SAMPLE_PROMPT, VARIABLES, VERSIONS } from '../fixtures/prompt';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * CRM ▸ Settings ▸ AI Configuration — the screen, not the components.
 *
 * This page is about the assembled card and the states it moves through. The
 * three reusable parts it is built from — the prompt field, the variable chips,
 * and the version pill — are documented under Components ▸ Prompt, since they
 * are design system primitives that other screens can use.
 */
export function AiConfigurationPage() {
  return (
    <>
      <PageHeader
        title="AI Configuration"
        description="CRM ▸ Settings ▸ AI Configuration. The agency's custom prompt, the variables it can interpolate, and the revision history behind it. Figma node 4949:2023."
      />

      <CrossLink
        eyebrow="Composed from components"
        links={[{ label: 'Components ▸ Prompt', pageId: 'prompt' }]}
      >
        This screen is one component — <code>AiPromptConfig</code> — assembled from three smaller
        ones that are documented on their own under Components ▸ Prompt. Use the card when you want
        the whole settings screen; reach for the parts when you are building something else out of
        them.
      </CrossLink>

      <Section
        title="The screen"
        description="Figma node 3756:2588, rendered from the design system. The page header, the section title, and the card are all components — nothing here is page-local markup."
      >
        <ConfigDemo />
        <CodeBlock
          code={`<AiPromptConfig
  defaultValue={prompt}
  variables={[
    { name: 'agency_name', description: 'Your agency display name', example: 'DesignPro.ltd' },
    { name: 'clientName', description: 'The prospect on the other side of the room' },
  ]}
  versions={versions}
  versionId="v2"
  savedHint="4 minutes ago"
  onSave={({ value, label }) => save(value, label)}
  onVersionChange={(version) => load(version)}
  onReset={() => resetToDefault()}
/>`}
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
        <CodeBlock code={`<AiPromptConfig mode="viewing" versionId="v1" onBack={back} onRestore={restore} />`} />
      </Section>

      <Section
        title="Anatomy"
        description="The three components the card composes. Each stands alone — the card's only job is the wiring between them: routing a chip click to the field's caret, and deriving “dirty” from the text against the loaded revision."
      >
        <Part
          name="CustomPromptField"
          role="The mono editing surface. Holds the prompt text, scrolls, and drags taller."
        >
          <div style={{ width: '100%' }}>
            <CustomPromptField defaultValue={SAMPLE_PROMPT} minHeight={120} />
          </div>
        </Part>

        <Part
          name="PromptVariable"
          role="One insertable token. The card renders one per entry in `variables` and wires each to the field's caret."
        >
          {VARIABLES.slice(0, 3).map((variable) => (
            <PromptVariable
              key={variable.name}
              name={variable.name}
              description={variable.description}
              example={variable.example}
            />
          ))}
        </Part>

        <Part
          name="VersionNumber"
          role="The revision picker — the pill and the history list it opens."
        >
          <VersionNumber versions={VERSIONS} value="v2" active />
        </Part>

        <CodeBlock
          code={`// The card, when you want the whole screen:
<AiPromptConfig defaultValue={prompt} variables={variables} versions={versions} />

// The parts, when you are building something else:
const field = useRef<CustomPromptFieldHandle>(null);

<CustomPromptField ref={field} defaultValue={prompt} />
<PromptVariable name="agency_name" onInsert={(t) => field.current?.insertAtCursor(t)} />
<VersionNumber versions={versions} value={current} onSelect={load} />`}
        />
      </Section>

      <Section
        title="States"
        description="Figma draws four variants. Only one of them is a prop."
      >
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0, marginBottom: 12 }}>
            “Current - Default”, “Current - Edit”, and “Current - Default Prompt” are the same
            editing card at different moments — whether the text has been touched, and which
            revision happens to be loaded. The card already tracks both, so they are states it
            arrives at rather than something a caller sets.
          </p>
          <p style={{ margin: 0 }}>
            “Another” is different in kind: the prompt is read-only, the variable strip is gone, and
            the save row is replaced. Nothing the card can derive tells it the user is browsing
            history, so that one is <code>mode="viewing"</code>.
          </p>
        </div>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'mode', type: `'editing' | 'viewing'`, default: `'editing'`, description: "Figma's “Another” state. Viewing is read-only, drops the strip, and swaps Save/Cancel for Back/Restore." },
            { name: 'onBack / onRestore', type: '() => void', description: 'The two viewing-mode buttons.' },
            { name: 'value / defaultValue', type: 'string', description: 'The prompt text, controlled or not.' },
            { name: 'onChange', type: '(value: string) => void', description: 'Fires on every keystroke and on every chip insert.' },
            { name: 'variables', type: 'PromptVariableDef[]', default: '[]', description: 'Chips in the insert strip. `{ name, description, example }` — the last two fill the hover tooltip.' },
            { name: 'variablesHint', type: 'ReactNode', description: 'Helper line at the right of the strip header.' },
            { name: 'defaultVariablesOpen', type: 'boolean', default: 'true', description: 'Whether the strip starts expanded.' },
            { name: 'versions', type: 'PromptVersion[]', default: '[]', description: 'Saved revisions, newest first.' },
            { name: 'versionId', type: 'string', description: 'Id of the loaded revision. Defaults to the first.' },
            { name: 'onVersionChange', type: '(version) => void', description: 'A revision was picked from the list.' },
            { name: 'onVersionRestore / onVersionDelete', type: '(version) => void', description: 'Row actions. Each button is omitted when its handler is absent.' },
            { name: 'versionLabel', type: 'string', description: 'The revision-name field, controlled. Uncontrolled otherwise.' },
            { name: 'onSave', type: '({ value, label }) => void', description: 'Enabled only while the text differs from the loaded revision.' },
            { name: 'onCancel', type: '() => void', description: 'Reverts the field to the loaded revision, then calls back.' },
            { name: 'onReset', type: '() => void', description: 'The destructive reset. Its button is omitted when absent, and in viewing mode.' },
            { name: 'savedHint', type: 'ReactNode', description: 'The right-hand status — Figma draws "4 minutes ago", or "Viewing v1" while browsing.' },
            { name: 'saving', type: 'boolean', default: 'false', description: 'Spins Save and blocks editing.' },
            { name: 'renderField / renderVariables / renderFooter', type: 'RenderProp', description: 'Replace the prompt field, the insert strip, or the footer row. Call `defaultRender()` to decorate rather than replace.' },
          ]}
        />
      </Section>
    </>
  );
}

/**
 * One row of the anatomy list: a component's name, what it does in this
 * screen, and the thing itself.
 *
 * The live example matters more than the name — a reader recognises the chip
 * they just saw in the card faster than they parse "PromptVariable".
 */
function Part({ name, role, children }: { name: string; role: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        boxSizing: 'border-box',
        padding: spacing.s,
        marginBottom: spacing.s,
        borderRadius: radius.s,
        border: `1px solid ${color.navbar.hover}`,
        backgroundColor: color.main.white,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: spacing.xs }}>
        <code style={{ ...textStyle.mMedium, color: color.main.brand }}>{name}</code>
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>{role}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xs }}>
        {children}
      </div>
    </div>
  );
}

/**
 * The Custom Prompt block, exactly as the screen assembles it — Figma node
 * 3770:886: a `SettingsSection` title over the `AiPromptConfig` card.
 */
function ConfigDemo() {
  const [versionId, setVersionId] = useState('v2');
  const [saved, setSaved] = useState<string | null>(null);

  return (
    <Preview>
      {/*
        The screen's own surface — white, with the header and section drawing
        their own 24px inset. Without this the blocks sit on the gallery's page
        background and the header's padding reads as stray space.
      */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // Figma stacks the content sections 24px apart (node 3770:964). The
          // header supplies its own 32px of bottom padding, so it sits clear of
          // the first section without this having to special-case it.
          gap: component.settingsSection.stackGap,
          width: '100%',
          backgroundColor: color.main.white,
          borderRadius: radius.m,
          border: `1px solid ${color.navbar.hover}`,
          overflow: 'hidden',
        }}
      >
        <SettingsHeader
          title="CRM AI Configuration"
          description="Customize your CRM AI on the go for seamless automation."
          // The stack's own gap supplies the room below the header, so its
          // bottom padding would double it. Figma leaves 32px between the
          // header and the first section, which is what the gap already gives.
          paddingBottom={0}
        />
        <SettingsSection
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

        <SettingsSection
          title="Mention Presets"
          description="Reusable @-mention snippets your team can drop into CRM replies. Drag to set priority, the top preset shows first in the mention picker."
        >
          <MentionPresetDemo />
        </SettingsSection>

        <SettingsSection
          title="Auto Reply"
          description="Reply to every message in a thread, or only the first one."
        >
          <AutoReplyDemo />
        </SettingsSection>
        <SettingsSection
          title="AI Tools"
          description="Registered capabilities available to Laziza on every CRM run. Reference them by name in your custom prompt above."
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
            {AI_TOOLS.map((tool) => (
              <AiTool key={tool.name} {...tool} />
            ))}
          </div>
        </SettingsSection>

        {/* The screen's sections sit on 32px of bottom room. */}
        <div style={{ height: spacing.xl }} />
      </div>
    </Preview>
  );
}
