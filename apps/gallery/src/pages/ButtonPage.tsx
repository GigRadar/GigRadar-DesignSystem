import { Button } from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { BUTTON_SOURCE } from '../sources';

export function ButtonPage() {
  return (
    <>
      <PageHeader title="Button" description="The primary action control. Every value reads from @gigradar/theme — no hardcoded colors or sizes." />

      <Section title="Variants">
        <Preview>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
        </Preview>
        <CodeBlock
          code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>`}
        />
      </Section>

      <Section title="Sizes">
        <Preview>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </Preview>
        <CodeBlock code={`<Button size="small">Small</Button>\n<Button size="medium">Medium</Button>\n<Button size="large">Large</Button>`} />
      </Section>

      <Section title="States">
        <Preview>
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Preview>
        <CodeBlock code={`<Button>Default</Button>\n<Button disabled>Disabled</Button>\n<Button loading>Loading</Button>`} />
      </Section>

      <Section title="Block">
        <Preview>
          <div style={{ width: '100%' }}>
            <Button block>Full width</Button>
          </div>
        </Preview>
        <CodeBlock code={`<Button block>Full width</Button>`} />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'variant', type: `'primary' | 'secondary' | 'ghost' | 'danger'`, default: `'primary'`, description: 'Visual style.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Control height and type scale.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Shows a spinner and blocks interaction.' },
            { name: 'block', type: 'boolean', default: 'false', description: 'Stretches to fill the container.' },
            { name: 'icon', type: 'ReactNode', description: 'Rendered before the label.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Standard button disabled state.' },
          ]}
        />
      </Section>

      <Section title="Source">
        <CodeBlock code={BUTTON_SOURCE} readingOnly />
      </Section>
    </>
  );
}
