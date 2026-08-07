import { color, textStyle } from '@uiuxjoseph/theme';
import { Checkbox, HStack, VStack, type CheckboxSize } from '@uiuxjoseph/ui';
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
        title="Checkbox"
        description="A single on/off choice. Figma node 538:9016 draws two states — a brand-blue disc holding a white checkmark when complete, and the same circle as a thin ring when not."
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
          code={`import { Checkbox } from '@uiuxjoseph/ui';

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
