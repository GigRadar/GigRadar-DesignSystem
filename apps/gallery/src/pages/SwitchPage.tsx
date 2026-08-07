import { color, component, textStyle } from '@uiuxjoseph/theme';
import { Switch, SwitchButton, HStack, VStack, type SwitchItem, type SwitchSize } from '@uiuxjoseph/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const SIZES: SwitchSize[] = ['small', 'medium', 'large'];

/** The switch as Figma draws it — four billing periods, the discount on Annual. */
const BILLING: SwitchItem[] = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'semi-annual', label: 'Semi-annual' },
  { value: 'annual', label: 'Annual', badge: 'Save 20%' },
];

/** Labels a row so the three size steps are readable side by side. */
function SizeRow({ render }: { render: (size: SwitchSize) => React.ReactNode }) {
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

/** A working switch, so the preview responds rather than sitting inert. */
function Live({
  items = BILLING,
  size,
  start = 'annual',
}: {
  items?: SwitchItem[];
  size?: SwitchSize;
  start?: string;
}) {
  const [value, setValue] = useState(start);
  return (
    <Switch items={items} value={value} onValueChange={setValue} size={size} label="Billing period" />
  );
}

export function SwitchPage() {
  return (
    <>
      <PageHeader
        title="Switch"
        description="A small set of mutually exclusive options in a pill, with the chosen one raised as a white segment. Figma node 977:11153 draws the subscription switch; node 3913:24775 draws the segment itself, in Default, Hover, and Selected."
      />

      <Section
        title="The subscription switch"
        description="Exactly what Figma draws — four billing periods on a D6DFE7 track, with the brand-blue discount badge on Annual. The white pill slides to the segment you pick, and stretches to its width. Click a segment, or focus it and use the arrow keys."
      >
        <Preview>
          <Live />
        </Preview>
        <CodeBlock
          code={`import { Switch } from '@uiuxjoseph/ui';

const [period, setPeriod] = useState('annual');

<Switch
  label="Billing period"
  value={period}
  onValueChange={setPeriod}
  items={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'semi-annual', label: 'Semi-annual' },
    { value: 'annual', label: 'Annual', badge: 'Save 20%' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Segment states"
        description="The three Figma draws. Idle is transparent with a regular-weight label; hover washes it E4EAF5; selected is a white pill with the label at medium. Hover only reads on an idle segment — washing the selected one would look like a second selection. Inside a Switch the white pill is the sliding thumb rather than the segment's own fill; standalone, as here, the segment paints it."
      >
        <Preview>
          <HStack gap="m" alignItems="center">
            {[
              { caption: 'Default', node: <SwitchButton>Monthly</SwitchButton> },
              // Pinned on, so the wash is visible without a real pointer.
              { caption: 'Hover', node: <SwitchButton hovered>Monthly</SwitchButton> },
              { caption: 'Selected', node: <SwitchButton selected>Monthly</SwitchButton> },
            ].map(({ caption, node }) => (
              <VStack key={caption} gap="xxs" alignItems="center">
                <div style={{ ...textStyle.sSemibold, color: color.main.description }}>{caption}</div>
                {/* Each segment sits on a scrap of track. Without it the white
                    selected pill is invisible against the white page, and the
                    hover wash has nothing to read against. */}
                <div
                  style={{
                    display: 'inline-flex',
                    padding: component.switchControl.trackPadding.medium,
                    borderRadius: component.switchControl.radius,
                    backgroundColor: color.navbar.border,
                  }}
                >
                  {node}
                </div>
              </VStack>
            ))}
          </HStack>
        </Preview>
        <CodeBlock
          code={`// Usually you never write these — Switch renders them from items.
// Reach for SwitchButton only to compose a row by hand.
<SwitchButton selected>Annual</SwitchButton>`}
        />
      </Section>

      <Section
        title="Two segments"
        description="The common case: a plain either/or. Any number of items works — Figma shows two through four."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Live
              items={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Annual', badge: 'Save 20%' },
              ]}
            />
            <Live
              items={[
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' },
              ]}
              start="active"
            />
          </VStack>
        </Preview>
        <CodeBlock
          code={`<Switch
  label="Billing period"
  items={[
    { value: 'monthly', label: 'Monthly' },
    { value: 'annual', label: 'Annual', badge: 'Save 20%' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="Sizes"
        description="Three steps. Medium is the 26px segment Figma draws; small and large extend the scale proportionally."
      >
        <Preview>
          <SizeRow
            render={(size) => (
              <Live
                size={size}
                items={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'annual', label: 'Annual', badge: 'Save 20%' },
                ]}
              />
            )}
          />
        </Preview>
        <CodeBlock
          code={`<Switch size="small" items={items} />
<Switch size="medium" items={items} />   // the drawn size
<Switch size="large" items={items} />`}
        />
      </Section>

      <Section
        title="Controlled and uncontrolled"
        description="Pass value to own the selection; pass defaultValue to let the switch track its own. Without either, the first item starts selected."
      >
        <CodeBlock
          code={`// Controlled — the parent owns the value. This is what a form wants.
const [period, setPeriod] = useState('annual');
<Switch value={period} onValueChange={setPeriod} items={items} label="Billing period" />

// Uncontrolled — the switch tracks its own state. Fine for a filter row.
<Switch defaultValue="monthly" onValueChange={(next) => refine(next)} items={items} label="Billing period" />`}
        />
      </Section>

      <Section
        title="Disabled"
        description="Figma draws no disabled state, so the control is dimmed rather than given a third palette. Disable the whole switch, or a single segment — the arrow keys skip a disabled segment rather than landing on it and refusing."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Switch
              label="Billing period"
              disabled
              defaultValue="annual"
              items={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Annual', badge: 'Save 20%' },
              ]}
            />
            <Live
              start="monthly"
              items={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly', disabled: true },
                { value: 'annual', label: 'Annual', badge: 'Save 20%' },
              ]}
            />
          </VStack>
        </Preview>
        <CodeBlock
          code={`// The whole control.
<Switch disabled items={items} label="Billing period" />

// Just one segment.
<Switch label="Billing period" items={[
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly', disabled: true },
]} />`}
        />
      </Section>

      <Section
        title="Accessibility"
        description="The track is a tablist and each segment a tab, so a screen reader announces the group and which option is chosen. Give it a label — without one it announces a set of tabs with no indication of what they choose. Only the selected segment is a tab stop; the arrow keys move within the group, so the switch is one stop in the page's tab order rather than four."
      >
        <CodeBlock code={`<Switch label="Billing period" items={items} />`} />
      </Section>

      <Section
        title="Style props"
        description="The track's own metrics and colors, as typed props — the same mechanism the other components use. Reach for size first; these are for genuine one-offs."
      >
        <Preview>
          <VStack gap="s" alignItems="flex-start">
            <Switch
              label="Tinted track"
              defaultValue="annual"
              background={color.badge.background}
              items={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Annual', badge: 'Save 20%' },
              ]}
            />
            <Switch
              label="Square track"
              defaultValue="monthly"
              radius={8}
              padding={6}
              items={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'annual', label: 'Annual' },
              ]}
            />
          </VStack>
        </Preview>
        <CodeBlock
          code={`// One-offs only. If the same override recurs, it belongs in the theme.
<Switch background={color.badge.background} items={items} />
<Switch radius={8} padding={6} items={items} />   // a boxy track instead of Figma's pill`}
        />
      </Section>

      <Section title="Switch props">
        <PropsTable
          rows={[
            { name: 'items', type: 'SwitchItem[]', description: 'The segments, in the order they are drawn.' },
            { name: 'value', type: 'string', description: 'Selected item value. Passing it makes the switch controlled.' },
            { name: 'defaultValue', type: 'string', description: 'Starting selection of an uncontrolled switch. Defaults to the first item.' },
            { name: 'onValueChange', type: '(value: string) => void', description: 'Called with the newly chosen value.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Segment height, padding, gap, and type size.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Dims the whole control and makes it inert.' },
            { name: 'label', type: 'string', description: 'Accessible name for the group, e.g. "Billing period".' },
            { name: 'padding / radius', type: 'number | string', description: 'The track inset and its corner radius.' },
            { name: 'background / thumbBackground', type: 'string', description: "The track's fill and the sliding thumb's." },
            { name: 'transition', type: 'string', description: "How the thumb slides. Pass 'none' to make the selection jump." },
          ]}
        />
      </Section>

      <Section title="SwitchItem">
        <PropsTable
          rows={[
            { name: 'value', type: 'string', description: 'Reported to onValueChange. Must be unique within the switch.' },
            { name: 'label', type: 'ReactNode', description: 'Visible label. Falls back to value.' },
            { name: 'badge', type: 'ReactNode', description: 'A pill after the label — "Save 20%" in Figma.' },
            { name: 'icon', type: 'IconDef', description: 'An optional glyph before the label.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Greys out this one segment and blocks selection.' },
          ]}
        />
      </Section>

      <Section title="SwitchButton props">
        <PropsTable
          rows={[
            { name: 'selected', type: 'boolean', default: 'false', description: 'Draws the white raised pill and the medium-weight label.' },
            { name: 'raised', type: 'boolean', description: "Whether the segment paints its own pill. Defaults to selected; Switch clears it so its sliding thumb draws the pill instead." },
            { name: 'hovered', type: 'boolean', description: 'Pins the hover wash on, for documenting the state.' },
            { name: 'children', type: 'ReactNode', description: "The segment's label." },
            { name: 'badge / icon', type: 'ReactNode | IconDef', description: 'The trailing pill and the leading glyph.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Height, padding, gap, and type size.' },
            { name: 'height / paddingX / paddingY', type: 'number | string', description: 'Segment dimensions.' },
            { name: 'radius / gap / fontSize / iconSize', type: 'number | string', description: 'Corner radius, label-to-badge gap, type and glyph size.' },
            { name: 'background / textColor', type: 'string', description: 'Selected fill and label color.' },
            { name: 'badgeBackground / badgeTextColor', type: 'string', description: "The discount pill's fill and text color." },
          ]}
        />
      </Section>
    </>
  );
}
