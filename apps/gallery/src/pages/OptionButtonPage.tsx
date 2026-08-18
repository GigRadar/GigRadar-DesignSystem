import { color } from '@gigradar/theme';
import { AutoReplyButton, HStack, IconTrunOffPower, VStack } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * The large selectable option row.
 *
 * A button in name only — it is a radio in a group, and behaves like one. The
 * page leads with that, because reaching for it as a button is the mistake it
 * invites.
 */
export function OptionButtonPage() {
  return (
    <>
      <PageHeader
        title="Option button"
        description="A large selectable row: a square marker, a title, an explanation, and an indicator. Exactly one option in a group applies, so it carries radio semantics rather than button ones. Figma nodes 3866:3252 (desktop) and 3957:5107 (mobile)."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[{ label: 'CRM ▸ Settings ▸ AI Configuration', pageId: 'crm-settings-ai' }]}
      >
        The Auto Reply card stacks three of these to pick a reply mode. Nothing about the row is
        reply-specific — the marker, title, and accent all come from props.
      </CrossLink>

      <Section
        title="Desktop"
        description="Three states on two axes: Default is white on the neutral edge, Hover keeps the white fill but takes the accent border, and Selected takes both the border and the pale accent fill. Hover previews the commitment without making it, which is why the border moves first and the fill only follows on selection."
      >
        <OptionDemo />
        <CodeBlock
          code={`<AutoReplyButton
  title="Full Auto"
  description="Replies are sent automatically"
  markerLabel="Auto"
  name="mode"
  selected={mode === 'fullAuto'}
  onSelect={() => setMode('fullAuto')}
/>`}
        />
      </Section>

      <Section
        title="Mobile"
        description="Figma draws a 168px card (node 3957:5107) that drops the description and shrinks the marker — at that width the description would wrap to three lines and the row would stop reading as one choice."
      >
        <Preview>
          <HStack gap={12}>
            <div style={{ width: 168 }}>
              <AutoReplyButton title="First message" markerLabel="Auto" layout="mobile" selected />
            </div>
            <div style={{ width: 168 }}>
              <AutoReplyButton title="First message" markerLabel="Auto" layout="mobile" />
            </div>
            <div style={{ width: 168 }}>
              <AutoReplyButton
                title="Turn off"
                markerIcon={IconTrunOffPower}
                accentColor={color.navbar.text}
                layout="mobile"
              />
            </div>
          </HStack>
        </Preview>
        <CodeBlock
          code={`<AutoReplyButton title="First message" markerLabel="Auto" layout="mobile" />`}
        />
      </Section>

      <Section
        title="Markers"
        description="The square at the head takes either a short label or a glyph. A label when the option abbreviates cleanly — “Auto”, “50%” — and an icon when it does not."
      >
        <Preview>
          <VStack gap={12} width="100%">
            <AutoReplyButton title="Full Auto" description="Label marker" markerLabel="Auto" />
            <AutoReplyButton
              title="Turn Off"
              description="Icon marker"
              markerIcon={IconTrunOffPower}
              accentColor={color.navbar.text}
            />
          </VStack>
        </Preview>
        <CodeBlock
          code={`<AutoReplyButton title="Full Auto" markerLabel="Auto" />
<AutoReplyButton title="Turn Off" markerIcon={IconTrunOffPower} accentColor={color.navbar.text} />`}
        />
      </Section>

      <Section
        title="With content below"
        description="Pass children and the row becomes a stack — Figma's `[CUSTOM]` variants, where choosing an option reveals the field that configures it. The field belongs inside the option because it only applies while that option is chosen."
      >
        <Preview>
          <AutoReplyButton
            title="Custom"
            description="Reply with your own instructions"
            markerLabel="You"
            selected
          >
            <textarea
              readOnly
              rows={3}
              defaultValue="Reply in the client's language, keep it under 80 words, and always end with a question."
              style={{
                boxSizing: 'border-box',
                width: '100%',
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${color.navbar.hover}`,
                backgroundColor: color.main.white,
                color: color.main.black,
                font: 'inherit',
                resize: 'none',
              }}
            />
          </AutoReplyButton>
        </Preview>
        <CodeBlock
          code={`<AutoReplyButton title="Custom" markerLabel="You" selected>
  <CustomPromptField value={prompt} onChange={setPrompt} />
</AutoReplyButton>`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'title', type: 'ReactNode', description: 'The choice’s name.' },
            { name: 'description', type: 'ReactNode', description: 'The line under it. Dropped in the `mobile` layout.' },
            { name: 'markerLabel / markerIcon', type: 'string / IconDef', description: 'The square marker at the head — a short label or a glyph.' },
            { name: 'selected', type: 'boolean', default: 'false', description: 'Whether this option is the chosen one.' },
            { name: 'hovered', type: 'boolean', description: 'Pins the hover palette regardless of the pointer. For docs and tests.' },
            { name: 'layout', type: `'desktop' | 'mobile'`, default: `'desktop'`, description: 'How much of the row to draw.' },
            { name: 'name', type: 'string', description: 'The radio group. Options sharing a name move together under the arrow keys.' },
            { name: 'onSelect', type: '() => void', description: 'This option was chosen.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Unselectable, and skipped by hover.' },
            { name: 'children', type: 'ReactNode', description: 'Content below the row — a prompt field. Its presence turns the row into a stack.' },
            { name: 'padding / gap / radius / fontSize / markerSize', type: 'number | string', description: 'Overrides for the row’s own metrics.' },
            { name: 'accentColor', type: 'string', description: 'Border, title, marker, and indicator when selected.' },
            { name: 'selectedBackground / borderColor', type: 'string', description: 'The selected fill and the resting edge.' },
          ]}
        />
      </Section>
    </>
  );
}

/** The three modes, wired so the group behaves as it would on a screen. */
function OptionDemo() {
  const [mode, setMode] = useState('fullAuto');

  return (
    <Preview>
      <VStack gap={12} width="100%">
        <AutoReplyButton
          title="Full Auto"
          description="Replies are sent automatically"
          markerLabel="Auto"
          name="option-button-mode"
          selected={mode === 'fullAuto'}
          onSelect={() => setMode('fullAuto')}
        />
        <AutoReplyButton
          title="Co-pilot"
          description="Drafts a reply for your approval"
          markerLabel="50%"
          accentColor={color.accent.laziza.backgroundAlt}
          name="option-button-mode"
          selected={mode === 'coPilot'}
          onSelect={() => setMode('coPilot')}
        />
        <AutoReplyButton
          title="Turn Off"
          description="Disable automatic replies"
          markerIcon={IconTrunOffPower}
          accentColor={color.navbar.text}
          name="option-button-mode"
          selected={mode === 'off'}
          onSelect={() => setMode('off')}
        />
        <AutoReplyButton
          title="Full Auto"
          description="Pinned to its hover palette, for docs"
          markerLabel="Auto"
          hovered
        />
      </VStack>
    </Preview>
  );
}
