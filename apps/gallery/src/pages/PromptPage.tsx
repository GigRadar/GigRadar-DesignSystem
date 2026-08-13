import { color, textStyle } from '@gigradar/theme';
import {
  CustomPromptField,
  PromptVariable,
  VersionNumber,
  type CustomPromptFieldHandle,
} from '@gigradar/ui';
import { useRef, useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { SAMPLE_PROMPT, VARIABLES, VERSIONS } from '../fixtures/prompt';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * The three reusable prompt primitives.
 *
 * The screen they were drawn for lives under CRM ▸ Settings ▸ AI Configuration.
 * This page is about the parts on their own, since each is usable outside that
 * screen: the field is any mono editor, the chip is any insertable token, and
 * the version pill is any revision picker.
 */
export function PromptPage() {
  return (
    <>
      <PageHeader
        title="Prompt field"
        description="The mono prompt field, the variable chips that insert into it, and the version pill. Each is independent — the AI Configuration screen composes all three, but nothing here depends on that screen."
      />

      <CrossLink
        eyebrow="Where these are used"
        links={[{ label: 'CRM ▸ Settings ▸ AI Configuration', pageId: 'crm-settings-ai' }]}
      >
        These three are what <code>AiPromptConfig</code> composes to build the AI Configuration
        settings screen. Use that card if you want the assembled screen. Use the parts below to
        build something else out of them — each works on its own, and the sections here document
        them independently of that screen.
      </CrossLink>

      <Section
        title="Custom prompt field"
        description="A real textarea in 11px mono. It scrolls at its set height and drags taller from the bottom-right corner. `insertAtCursor` on the ref is what the chips call."
      >
        <FieldDemo />
        <CodeBlock
          code={`const field = useRef<CustomPromptFieldHandle>(null);

<CustomPromptField ref={field} defaultValue={prompt} minHeight={220} />
<PromptVariable name="agency_name" onInsert={(token) => field.current?.insertAtCursor(token)} />`}
        />
      </Section>

      <Section
        title="With a copy button"
        description="Figma's `copyButton` variant. The field draws a working button on its own; `renderCopyButton` is there when you want a different one."
      >
        <Preview>
          <div style={{ width: '100%' }}>
            <CustomPromptField defaultValue={SAMPLE_PROMPT} minHeight={160} copyButton />
          </div>
        </Preview>
        <CodeBlock
          code={`// The default button:
<CustomPromptField defaultValue={prompt} copyButton />

// Or your own — call defaultRender() to decorate rather than replace:
<CustomPromptField
  defaultValue={prompt}
  copyButton
  renderCopyButton={({ copy, copied, defaultRender }) => (
    <Tooltip content="Copy the whole prompt">{defaultRender()}</Tooltip>
  )}
/>`}
        />
      </Section>

      <Section
        title="Variables"
        description="The chip writes its own braces — pass `agency_name`, not `{{agency_name}}`. It is a button, so it takes focus and inserts on Enter."
      >
        <Caption>↓ Hover a chip to see what the token expands to.</Caption>
        <Preview>
          {VARIABLES.slice(0, 4).map((variable) => (
            <PromptVariable
              key={variable.name}
              name={variable.name}
              description={variable.description}
              example={variable.example}
            />
          ))}
          <PromptVariable name="agency_name" hovered />
        </Preview>
        <Caption>The last chip is pinned to its hover palette and has no tooltip.</Caption>
        <CodeBlock
          code={`<PromptVariable
  name="agency_name"
  description="Your agency display name"
  example="DesignPro.ltd"
  onInsert={(token) => field.current?.insertAtCursor(token)}
/>`}
        />
      </Section>

      <Section
        title="Version number"
        description="The pill and the revision list are one component, matching how Figma models Expanded as a fourth state. It opens on click and closes on outside click or Escape."
      >
        <VersionDemo />
        <CodeBlock
          code={`<VersionNumber
  versions={versions}
  value={current}
  onSelect={(version) => load(version)}
  onRestore={(version) => restore(version)}
  onDelete={(version) => remove(version)}
/>`}
        />
      </Section>

      <Section title="Pill states" description="Default, hover, active, and without the chevron.">
        <Preview>
          <VersionNumber versions={VERSIONS} value="v2" />
          <VersionNumber versions={VERSIONS} value="v2" hovered />
          <VersionNumber versions={VERSIONS} value="v2" active />
          <VersionNumber versions={VERSIONS} value="v2" active chevron={false} />
        </Preview>
      </Section>

      <Section
        title="Using them without the card"
        description="Nothing here needs AiPromptConfig. Wire the three together yourself when the surrounding layout is not the settings screen — a modal, a side panel, a step in a wizard."
      >
        <StandaloneDemo />
        <CodeBlock
          code={`// A minimal composer: field + chips + revision picker, no card.
const field = useRef<CustomPromptFieldHandle>(null);
const [version, setVersion] = useState('v2');

<CustomPromptField ref={field} defaultValue={prompt} minHeight={140} />
<VersionNumber versions={versions} value={version} onSelect={(v) => setVersion(v.id)} />
{variables.map((v) => (
  <PromptVariable key={v.name} {...v} onInsert={(t) => field.current?.insertAtCursor(t)} />
))}`}
        />
      </Section>

      <Section title="CustomPromptField props">
        <PropsTable
          rows={[
            { name: 'value / defaultValue', type: 'string', description: 'The text, controlled or not.' },
            { name: 'onChange', type: '(value: string) => void', description: 'Fires with the full text on every edit.' },
            { name: 'ref', type: 'CustomPromptFieldHandle', description: '`insertAtCursor(text)`, `focus()`, and `element` for the raw textarea.' },
            { name: 'resizable', type: 'boolean', default: 'true', description: 'Whether the bottom-right corner drags taller.' },
            { name: 'copyButton', type: 'boolean', default: 'false', description: 'Pins a copy control top-right.' },
            { name: 'renderCopyButton', type: 'RenderProp<CopyButtonRenderProps>', description: 'Replaces the copy button. The field draws a working one on its own; call `defaultRender()` to decorate it.' },
            { name: 'minHeight', type: 'CssLength', default: '322', description: 'Visible height before the text scrolls.' },
            { name: 'paddingX / paddingY / radius / fontSize / lineHeight', type: 'CssLength', description: "Overrides for the field's own metrics." },
            { name: 'background / textColor', type: 'string', description: 'Fill and text color.' },
            { name: 'borderColor', type: 'string', description: "The edge. The field's fill matches the page background, so it needs one to be visible on its own." },
            { name: 'borderWidth', type: 'CssLength', default: '1', description: 'Set to 0 when a surrounding card already draws the edge — AiPromptConfig does exactly this.' },
          ]}
        />
      </Section>

      <Section title="PromptVariable props">
        <PropsTable
          rows={[
            { name: 'name', type: 'string', description: 'The variable name WITHOUT braces. The chip draws them.' },
            { name: 'delimiters', type: '[string, string]', default: `['{{', '}}']`, description: 'Change it if the prompt runtime uses another notation.' },
            { name: 'onInsert', type: '(token: string) => void', description: 'Called with the full token on click. `onClick` still fires first.' },
            { name: 'description', type: 'ReactNode', description: 'What the variable means. Supplying it turns on the hover tooltip.' },
            { name: 'example', type: 'ReactNode', description: 'A sample expansion, shown in the tooltip as `eg. DesignPro.ltd`.' },
            { name: 'hovered', type: 'boolean', description: 'Pins the hover palette. For docs and tests.' },
            { name: 'paddingX / paddingY / radius / fontSize', type: 'CssLength', description: "Overrides for the chip's own metrics." },
            { name: 'background / textColor / hoverTextColor', type: 'string', description: 'Fill, resting text, and hover text.' },
          ]}
        />
      </Section>

      <Section title="VersionNumber props">
        <PropsTable
          rows={[
            { name: 'versions', type: 'PromptVersion[]', default: '[]', description: '`{ id, number, label, meta }` per revision.' },
            { name: 'value', type: 'string', description: 'Id of the current revision. Defaults to the first.' },
            { name: 'onSelect', type: '(version) => void', description: 'A row was picked. The menu closes unless `open` is controlled.' },
            { name: 'onRestore / onDelete', type: '(version) => void', description: 'Row actions. Each button is omitted when its handler is absent.' },
            { name: 'open / onOpenChange', type: 'boolean / (open) => void', description: 'Take over the menu. Self-managed when `open` is left off.' },
            { name: 'active', type: 'boolean', default: 'false', description: 'The filled blue palette.' },
            { name: 'hovered', type: 'boolean', description: 'Pins the hover palette. For docs and tests.' },
            { name: 'chevron', type: 'boolean', default: 'true', description: "Figma's `rIcon`. Off leaves the bare `v2` square." },
            { name: 'renderItem', type: 'RenderProp<VersionItemRenderProps>', description: 'Replace a row. Call `defaultRender()` to decorate.' },
          ]}
        />
      </Section>
    </>
  );
}

/** The field on its own, with chips wired to its ref. */
function FieldDemo() {
  const field = useRef<CustomPromptFieldHandle>(null);

  return (
    <Preview>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CustomPromptField ref={field} defaultValue={SAMPLE_PROMPT} minHeight={220} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {VARIABLES.map((variable) => (
            <PromptVariable
              key={variable.name}
              name={variable.name}
              description={variable.description}
              example={variable.example}
              onInsert={(token) => field.current?.insertAtCursor(token)}
            />
          ))}
        </div>
      </div>
    </Preview>
  );
}

/**
 * The three parts wired together by hand, with no card around them.
 *
 * Proves the point the section makes: the wiring is a ref and a state
 * variable, so a product that needs a different frame is not stuck with
 * `AiPromptConfig`'s.
 */
function StandaloneDemo() {
  const field = useRef<CustomPromptFieldHandle>(null);
  const [version, setVersion] = useState('v2');

  return (
    <Preview>
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <CustomPromptField ref={field} defaultValue={SAMPLE_PROMPT} minHeight={140} />
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <VersionNumber
            versions={VERSIONS}
            value={version}
            active
            onSelect={(picked) => setVersion(picked.id)}
          />
          {VARIABLES.slice(0, 3).map((variable) => (
            <PromptVariable
              key={variable.name}
              name={variable.name}
              description={variable.description}
              example={variable.example}
              onInsert={(token) => field.current?.insertAtCursor(token)}
            />
          ))}
        </div>
      </div>
    </Preview>
  );
}

/** The pill on its own — click it to see the expanded list. */
function VersionDemo() {
  const [current, setCurrent] = useState('v2');

  return (
    <>
      <Caption>↓ Click the pill to open the revision list.</Caption>
      <Preview>
        {/* The menu opens upward, so it needs room above it in this page flow. */}
        <div style={{ paddingTop: 260, display: 'inline-flex' }}>
          <VersionNumber
            versions={VERSIONS}
            value={current}
            active
            onSelect={(version) => setCurrent(version.id)}
            onRestore={() => undefined}
            onDelete={() => undefined}
          />
        </div>
      </Preview>
    </>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <div style={{ ...textStyle.sMedium, color: color.main.description }}>{children}</div>;
}
