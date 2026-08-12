import { color, textStyle } from '@gigradar/theme';
import { Checkbox, Radio, HStack, VStack, type CheckboxSize } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const SIZES: CheckboxSize[] = ['small', 'medium', 'large'];

/** Labels a row so the three size steps are readable side by side. */
function SizeRow({ render }: { render: (size: CheckboxSize) => React.ReactNode }) {
  return (
    <HStack gap="l" alignItems="center" flexWrap="wrap">
      {SIZES.map((size) => (
        <VStack key={size} gap="xxs" alignItems="center">
          <div style={{ ...textStyle.sSemibold, color: color.main.description }}>{size}</div>
          {render(size)}
        </VStack>
      ))}
    </HStack>
  );
}

/** A working checkbox, so the preview toggles rather than sitting inert. */
function Live({ label }: { label?: string }) {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox checked={checked} onCheckedChange={setChecked} label={label ?? 'Example'}>
      {label}
    </Checkbox>
  );
}

export function CheckboxPage() {
  return (
    <>
      <PageHeader
        title="Checkbox & Radio"
        description="Two controls that look alike and mean different things. A checkbox is one independent on/off choice; a radio is one option in a group where exactly one applies. Both are circles in Figma — the contract, not the shape, is what tells them apart."
      />

      <Section
        title="The two states"
        description="Complete and Uncomplete, exactly as Figma draws them. The ring is present in both — it matches the fill when checked — so ticking the box never shifts the row it sits in."
      >
        <Preview>
          <HStack gap="m" alignItems="center">
            <Checkbox checked label="Complete" />
            <Checkbox checked={false} label="Uncomplete" />
          </HStack>
        </Preview>
        <CodeBlock
          code={`import { Checkbox } from '@gigradar/ui';

// Controlled — the parent owns the value. This is what a form wants.
const [done, setDone] = useState(false);
<Checkbox checked={done} onCheckedChange={setDone}>Mark complete</Checkbox>

// Uncontrolled — the box tracks its own state. Fine for a filter row.
<Checkbox defaultChecked onCheckedChange={(next) => refine(next)}>Only open jobs</Checkbox>`}
        />
      </Section>

      <Section
        title="Sizes"
        description="Three steps. Medium is the 22px Figma draws; small and large extend the scale proportionally."
      >
        <Preview>
          <SizeRow render={(size) => <Checkbox size={size} defaultChecked label={size} />} />
        </Preview>
        <CodeBlock
          code={`<Checkbox size="small" />
<Checkbox size="medium" />   // the drawn size
<Checkbox size="large" />`}
        />
      </Section>

      <Section
        title="With a label"
        description="Pass children and the whole thing renders as one <label>, so clicking the text toggles the box. Without a visible label, pass the label prop — an unnamed checkbox tells a screen reader nothing."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Live label="Send a follow-up after 3 days" />
            <Live label="Notify me when the client replies" />
          </VStack>
        </Preview>
        <CodeBlock
          code={`// The label is clickable, because the box and text share one <label>.
<Checkbox checked={notify} onCheckedChange={setNotify}>
  Notify me when the client replies
</Checkbox>

// No visible text? Name it anyway.
<Checkbox checked={selected} onCheckedChange={setSelected} label="Select this proposal" />`}
        />
      </Section>

      <Section
        title="Disabled"
        description="Figma draws no disabled state, so the whole control is dimmed rather than given a third palette — that fades the box and its label together and stays correct if the drawn colors change."
      >
        <Preview>
          <HStack gap="m" alignItems="center">
            <Checkbox checked disabled>
              Locked on
            </Checkbox>
            <Checkbox checked={false} disabled>
              Locked off
            </Checkbox>
          </HStack>
        </Preview>
        <CodeBlock code={`<Checkbox checked disabled>Locked on</Checkbox>`} />
      </Section>

      <Section
        title="Style props"
        description="The checkbox's own metrics and colors, as typed props — the same mechanism the other components use. Reach for size first; these are for genuine one-offs."
      >
        <Preview>
          <HStack gap="m" alignItems="center">
            <Checkbox defaultChecked background={color.status.success.main} borderColor={color.status.success.main} label="Success" />
            <Checkbox defaultChecked background={color.accent.laziza.main} borderColor={color.accent.laziza.main} label="Laziza" />
            <Checkbox defaultChecked radius={6} label="Square" />
            <Checkbox defaultChecked boxSize={30} iconSize={26} label="Oversized" />
          </HStack>
        </Preview>
        <CodeBlock
          code={`// One-offs only. If the same override recurs, it belongs in the theme.
<Checkbox background={color.status.success.main} borderColor={color.status.success.main} />
<Checkbox radius={6} />       // a square box instead of Figma's circle
<Checkbox boxSize={30} iconSize={26} />`}
        />
      </Section>


      <Section
        title="Radio"
        description="The same circle, a different contract. A checkbox stands alone — three of them let a user pick all three. A radio belongs to a group and the browser enforces one-of-many, so arrow keys move between options instead of tabbing through them."
      >
        <Preview>
          <VStack gap={12}>
            <Radio name="demo-plan" defaultChecked>
              Full Auto
            </Radio>
            <Radio name="demo-plan">Co-pilot</Radio>
            <Radio name="demo-plan">Turn Off</Radio>
          </VStack>
        </Preview>
        <CodeBlock
          code={`// One name binds the group. Picking one clears the rest.
<Radio name="mode" checked={mode === 'auto'} onSelectedChange={() => setMode('auto')}>
  Full Auto
</Radio>`}
        />
      </Section>

      <Section
        title="Indicators"
        description="dot is the classic radio — a ring around a smaller filled circle. check fills the whole circle and drops a white tick in, which is what Figma draws for the Auto Reply modes (node 3866:3252). Same meaning; the difference is how loudly the selection reads in its row."
      >
        <Preview>
          <HStack gap={24}>
            <Radio name="demo-dot" defaultChecked>
              dot
            </Radio>
            <Radio name="demo-check" indicator="check" defaultChecked>
              check
            </Radio>
            <Radio
              name="demo-accent"
              indicator="check"
              selectedColor={color.accent.laziza.main}
              borderColor={color.accent.laziza.main}
              defaultChecked
            >
              check, Laziza accent
            </Radio>
          </HStack>
        </Preview>
        <CodeBlock code={`<Radio indicator="check" selectedColor={color.accent.laziza.main} />`} />
      </Section>

      <Section title="Radio props">
        <PropsTable
          rows={[
            { name: 'checked', type: 'boolean', description: 'The value. Passing it makes the radio controlled.' },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Starting value of an uncontrolled radio.' },
            { name: 'onSelectedChange', type: '(checked, event) => void', description: 'Fires when this option is picked. Only ever with `true` — a radio cannot be unset by clicking it.' },
            { name: 'name', type: 'string', description: 'Binds the group. Options sharing a name are mutually exclusive.' },
            { name: 'indicator', type: `'dot' | 'check'`, default: `'dot'`, description: 'Which mark the selected state draws.' },
            { name: 'children', type: 'ReactNode', description: 'Visible label. Clicking it selects the option.' },
            { name: 'label', type: 'string', description: 'Accessible name, for a radio with no visible label.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Reads the same scale as Checkbox — the two are the same size by design.' },
            { name: 'controlSize / radius / borderWidth / gap / fontSize', type: 'number | string', description: "Overrides for the control's own metrics." },
            { name: 'selectedColor / borderColor / textColor', type: 'string', description: 'Accent when selected, ring when not, and the label.' },
          ]}
        />
      </Section>

      <Section title="Checkbox props">
        <PropsTable
          rows={[
            { name: 'checked', type: 'boolean', description: 'The value. Passing it makes the checkbox controlled.' },
            { name: 'defaultChecked', type: 'boolean', default: 'false', description: 'Starting value of an uncontrolled checkbox.' },
            { name: 'onCheckedChange', type: '(checked, event) => void', description: 'Called with the new boolean, and the event second.' },
            { name: 'children', type: 'ReactNode', description: 'Visible label. Clicking it toggles the box.' },
            { name: 'label', type: 'string', description: 'Accessible name, for a checkbox with no visible label.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Box edge, checkmark, gap, and type size.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the control and makes it inert.' },
            { name: 'boxSize / iconSize', type: 'number | string', description: 'Box edge length and checkmark size.' },
            { name: 'radius / borderWidth / gap / fontSize', type: 'number | string', description: 'Corner radius, ring thickness, box-to-label gap, label size.' },
            { name: 'background / checkColor', type: 'string', description: 'Checked fill and checkmark color.' },
            { name: 'borderColor / textColor', type: 'string', description: 'Ring color and label color.' },
          ]}
        />
      </Section>
    </>
  );
}
