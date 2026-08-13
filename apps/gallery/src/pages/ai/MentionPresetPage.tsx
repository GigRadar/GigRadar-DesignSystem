import { SettingsSection } from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { MentionPresetDemo } from '../../demos/aiConfiguration';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Mention Preset.
 *
 * The ordered list of @-mention snippets. Order is the feature — the top
 * preset shows first in the picker — which is why the section is as much an
 * ordering control as a list.
 */
export function MentionPresetPage() {
  return (
    <>
      <PageHeader
        title="Mention Preset"
        description="Reusable @-mention snippets the team drops into CRM replies, in the order the picker offers them. Figma nodes 3950:510 and 3774:8382."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'The whole screen', pageId: 'crm-settings-ai' },
          { label: 'Components ▸ Preset', pageId: 'preset' },
          { label: 'Components ▸ Scrollbar', pageId: 'scrollbar' },
        ]}
      >
        The row and the card are documented under Components ▸ Preset, including the empty state
        and the delete confirmation. This page is the section as the screen wires it.
      </CrossLink>

      <Section
        title="The section"
        description="Move a preset with the arrows and the priority numbers follow it. Delete asks first. Any of those edits arms Save — and Reset, which asks before discarding them."
      >
        <Preview>
          <div style={{ width: '100%' }}>
            <SettingsSection
              title="Mention Presets"
              description="Reusable @-mention snippets your team can drop into CRM replies. Drag to set priority, the top preset shows first in the mention picker."
            >
              <MentionPresetDemo />
            </SettingsSection>
          </div>
        </Preview>
        <CodeBlock
          code={`<MentionPresetList
  items={presets}
  activeId={presets[0]?.id}
  characterMax={400}
  dirty={dirty}
  onMoveUp={(item, index) => move(index, -1)}
  onMoveDown={(item, index) => move(index, 1)}
  onDelete={(item) => remove(item.id)}
  onAdd={add}
  onSave={save}
  onCancel={revert}
  onReset={revert}
/>`}
        />
      </Section>

      <Section
        title="Order is the content"
        description="Array order is the priority — there is no `priority` field on an item."
      >
        <CodeBlock
          code={`// The list draws the priority badge from the index, so reordering the
// array IS reordering the presets. Nothing else has to be kept in sync.
const move = (index, delta) =>
  setPresets((list) => {
    const next = [...list];
    const target = index + delta;
    if (target < 0 || target >= next.length) return list;
    [next[index], next[target]] = [next[target], next[index]];
    return next;
  });`}
        />
      </Section>

      <Section
        title="Dirty is yours to own"
        description="`dirty` is a prop, not internal state. The list does not own the presets it draws, so it cannot know whether what you hold differs from what you saved — only you can. That is also what gates Save and Cancel."
      >
        <CodeBlock
          code={`const [dirty, setDirty] = useState(false);

<MentionPresetList
  items={presets}
  dirty={dirty}
  onDelete={(item) => { setDirty(true); remove(item.id); }}
  onSave={() => { save(presets); setDirty(false); }}
/>`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'items', type: 'MentionPresetItem[]', default: '[]', description: '`{ id, title, description, characterCount }` per preset. Array order is the priority.' },
            { name: 'activeId', type: 'string', description: 'Id of the row being edited — outlined in brand blue.' },
            { name: 'onMoveUp / onMoveDown / onDelete', type: '(item, index) => void', description: 'Row actions, carrying both the item and where it sat. Delete confirms first.' },
            { name: 'characterMax', type: 'number', description: 'The cap every row’s counter measures against.' },
            { name: 'emptyTitle / emptyDescription / emptyIcon', type: 'ReactNode / IconDef', description: 'The empty state’s wording and glyph.' },
            { name: 'onAdd / onSave / onCancel / onReset', type: '() => void', description: 'The footer’s four actions. Each button is omitted when its handler is. Reset confirms first.' },
            { name: 'resetTitle / resetDescription', type: 'ReactNode', description: 'The reset confirmation’s wording.' },
            { name: 'dirty / saving', type: 'boolean', default: 'false', description: 'Whether there are unsaved edits, and whether a save is in flight.' },
            { name: 'renderItem / renderEmpty / renderFooter', type: 'RenderProp', description: 'Replace a row, the empty state, or the footer. Call `defaultRender()` to decorate.' },
            { name: 'padding / gap / maxHeight / background', type: 'CssLength / string', description: 'Card metrics. `maxHeight` is where the scrollbar starts.' },
          ]}
        />
      </Section>
    </>
  );
}
