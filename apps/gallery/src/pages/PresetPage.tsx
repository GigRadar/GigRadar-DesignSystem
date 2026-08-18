import { color, textStyle } from '@gigradar/theme';
import {
  MentionPreset,
  MentionPresetList,
  VStack,
  type MentionPresetItem,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

const SEED: MentionPresetItem[] = [
  {
    id: 'case-study',
    title: 'Top performing case study',
    description: 'Inserts our flagship fintech case study link with a 1-line value framing.',
    characterCount: 103,
  },
  {
    id: 'discovery',
    title: 'Book discovery call',
    description: "Drops the team's Cal.com link and a 30-minute scheduling line.",
    characterCount: 96,
  },
  {
    id: 'pricing',
    title: 'Pricing ranges',
    description: 'States our hourly band and what moves a project to the top of it.',
    characterCount: 88,
  },
];

/**
 * The @-mention preset row and the list that owns it.
 *
 * Both on one page because neither is much use alone: the row is an ordering
 * control, and ordering only means something inside a list.
 */
export function PresetPage() {
  return (
    <>
      <PageHeader
        title="Preset"
        description="A reusable @-mention snippet, and the card that holds an ordered list of them. Figma nodes 3774:8382 (the row), 3950:510 (the list), and 3948:27566 (its states)."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[{ label: 'CRM ▸ Settings ▸ AI Configuration', pageId: 'crm-settings-ai' }]}
      >
        The AI Configuration screen wires <code>MentionPresetList</code> straight in. Reach for{' '}
        <code>MentionPreset</code> on its own when a screen needs the row outside that card.
      </CrossLink>

      <Section
        title="The row"
        description="The row is an ordering control as much as a list item — a drag handle, the priority number, and a pair of move buttons — because the order is the feature: the top preset shows first in the mention picker. The handle is drawn but inert; wiring it to a drag library is the app's call, and the move buttons mean the ordering still works by keyboard without one."
      >
        <Preview>
          <VStack gap={8} width="100%">
            <MentionPreset
              priority={1}
              title="Top performing case study"
              description="Inserts our flagship fintech case study link with a 1-line value framing."
              characterCount={103}
              characterMax={400}
              active
              onMoveUp={() => undefined}
              onMoveDown={() => undefined}
              onDelete={() => undefined}
              disableMoveUp
            />
            <MentionPreset
              priority={2}
              title="Book discovery call"
              description="Drops the team's Cal.com link and a 30-minute scheduling line."
              characterCount={96}
              characterMax={400}
              onMoveUp={() => undefined}
              onMoveDown={() => undefined}
              onDelete={() => undefined}
              disableMoveDown
            />
          </VStack>
        </Preview>
        <Caption>
          The active row outlines in brand blue and turns its handle blue with it, so the handle
          joins the outline rather than reading as a separate control.
        </Caption>
        <CodeBlock
          code={`<MentionPreset
  priority={1}
  title="Top performing case study"
  description="Inserts our flagship fintech case study link…"
  characterCount={103}
  characterMax={400}
  active
  onMoveUp={up}
  onMoveDown={down}
  onDelete={remove}
  disableMoveUp={isFirst}
/>`}
        />
      </Section>

      <Section
        title="Row actions"
        description="Three design system buttons, not bespoke squares. Move up and move down are the third variant, quiet enough that a pair of them does not compete with the preset's own text. Delete is the secondary button in the danger tone, icon-only."
      >
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0, marginBottom: 12 }}>
            Press delete and a confirmation opens over the button rather than firing straight away.
            Deleting a preset cannot be undone and the control is one of three identical squares in
            a row, so a mis-click is easy — the confirmation is what makes the row safe to use, not
            optional politeness.
          </p>
          <p style={{ margin: 0 }}>
            Pass <code>deleteTitle</code> and <code>deleteDescription</code> to reword it. The
            confirmation itself is the shared <code>ConfirmTooltip</code>.
          </p>
        </div>
        <Preview>
          <MentionPreset
            priority={1}
            title="Try the delete button"
            description="It opens a confirmation instead of deleting."
            characterCount={48}
            characterMax={400}
            onMoveUp={() => undefined}
            onMoveDown={() => undefined}
            onDelete={() => undefined}
          />
        </Preview>
        <CodeBlock
          code={`<MentionPreset
  priority={1}
  title="Top performing case study"
  onDelete={() => remove(id)}
  deleteTitle="Delete this preset?"
  deleteDescription="It will stop appearing in the @mention picker."
/>`}
        />
      </Section>

      <Section
        title="The list"
        description="The card that owns the rows: a bordered panel, a scroll area capped at 350px, and a footer holding Add New beside Save, Cancel, and Reset. Move and delete a row — the demo reorders in place."
      >
        <ListDemo />
        <CodeBlock
          code={`<MentionPresetList
  items={items}
  activeId={activeId}
  characterMax={400}
  dirty={dirty}
  onMoveUp={(item, index) => move(index, -1)}
  onMoveDown={(item, index) => move(index, 1)}
  onDelete={(item) => remove(item.id)}
  onAdd={add}
  onSave={save}
  onCancel={cancel}
  onReset={reset}
/>`}
        />
      </Section>

      <Section
        title="Empty"
        description="No presets yet. The empty state is part of the card rather than something the screen substitutes for it, so the footer — and therefore Add New — stays where it was."
      >
        <Preview>
          <MentionPresetList items={[]} onAdd={() => undefined} />
        </Preview>
        <CodeBlock code={`<MentionPresetList items={[]} onAdd={add} />`} />
      </Section>

      <Section title="MentionPreset props">
        <PropsTable
          rows={[
            { name: 'priority', type: 'number', description: 'Position in the list, 1-based. Drawn in the priority badge.' },
            { name: 'title', type: 'ReactNode', description: 'The preset’s name — what the writer types after `@`.' },
            { name: 'description', type: 'ReactNode', description: 'What it inserts, and when to reach for it.' },
            { name: 'active', type: 'boolean', default: 'false', description: 'The row being edited. At most one per list, so this marks focus rather than selection.' },
            { name: 'onMoveUp / onMoveDown / onDelete', type: '() => void', description: 'The three row actions. Each control is omitted when its handler is.' },
            { name: 'deleteTitle / deleteDescription', type: 'ReactNode', description: 'The delete confirmation’s wording.' },
            { name: 'disableMoveUp / disableMoveDown', type: 'boolean', default: 'false', description: 'The ends of the list. Disabled rather than hidden, so the controls stay in place.' },
            { name: 'characterCount / characterMax', type: 'number', description: 'The counter. Both or neither — a bare number has nothing to measure against.' },
            { name: 'padding / gap / radius / fontSize', type: 'number | string', description: 'Overrides for the row’s own metrics.' },
            { name: 'borderColor / activeBorderColor', type: 'string', description: 'The resting edge and the active one.' },
          ]}
        />
      </Section>

      <Section title="MentionPresetList props">
        <PropsTable
          rows={[
            { name: 'items', type: 'MentionPresetItem[]', default: '[]', description: '`{ id, title, description, characterCount }` per preset. Array order is the priority.' },
            { name: 'activeId', type: 'string', description: 'Id of the row being edited.' },
            { name: 'onMoveUp / onMoveDown / onDelete', type: '(item, index) => void', description: 'Row actions, carrying both the item and where it sat.' },
            { name: 'characterMax', type: 'number', description: 'The cap every row counts against.' },
            { name: 'emptyTitle / emptyDescription / emptyIcon', type: 'ReactNode / IconDef', description: 'The empty state’s wording and glyph.' },
            { name: 'onAdd / onSave / onCancel / onReset', type: '() => void', description: 'The footer’s four actions. Each button is omitted when its handler is.' },
            { name: 'dirty', type: 'boolean', default: 'false', description: 'Whether there are unsaved edits. A prop, not internal state — the list does not own the data it draws.' },
            { name: 'saving', type: 'boolean', default: 'false', description: 'A save in flight. Disables the footer.' },
            { name: 'renderItem / renderEmpty / renderFooter', type: 'RenderProp<…>', description: 'Replace a row, the empty state, or the footer. Call `defaultRender()` to decorate.' },
            { name: 'padding / gap / maxHeight / background', type: 'number | string', description: 'Card metrics. `maxHeight` is where the scrollbar starts.' },
          ]}
        />
      </Section>
    </>
  );
}

/** The list, wired so move and delete actually reorder. */
function ListDemo() {
  const [items, setItems] = useState(SEED);
  const [activeId, setActiveId] = useState('case-study');

  const move = (index: number, by: number) => {
    setItems((current) => {
      const next = [...current];
      const target = index + by;
      if (target < 0 || target >= next.length) return current;
      const [row] = next.splice(index, 1);
      if (!row) return current;
      next.splice(target, 0, row);
      return next;
    });
  };

  return (
    <Preview>
      <MentionPresetList
        items={items}
        activeId={activeId}
        characterMax={400}
        dirty={items.length !== SEED.length}
        onMoveUp={(_item, index) => move(index, -1)}
        onMoveDown={(_item, index) => move(index, 1)}
        onDelete={(item) => setItems((current) => current.filter((row) => row.id !== item.id))}
        onAdd={() => undefined}
        onSave={() => undefined}
        onCancel={() => undefined}
        onReset={() => {
          setItems(SEED);
          setActiveId('case-study');
        }}
      />
    </Preview>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <div style={{ ...textStyle.sMedium, color: color.main.description }}>{children}</div>;
}
