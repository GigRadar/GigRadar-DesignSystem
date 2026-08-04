import { color, spacing, textStyle } from '@uiuxjoseph/theme';
import { Badge, Button, Card } from '@uiuxjoseph/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CARD_SOURCE } from '../sources';

export function CardPage() {
  return (
    <>
      <PageHeader title="Card" description="A surface container. Elevated uses the single four-layer shadow defined in Figma — there is no elevation scale, by design." />

      <Section title="Variants">
        <Preview>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing.m, width: '100%' }}>
            <Card variant="elevated" title="Elevated">
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Default surface with shadow.</span>
            </Card>
            <Card variant="outlined" title="Outlined">
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Border only, no shadow.</span>
            </Card>
            <Card variant="flat" title="Flat">
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Tinted, no border or shadow.</span>
            </Card>
          </div>
        </Preview>
        <CodeBlock code={`<Card variant="elevated" title="Elevated">…</Card>\n<Card variant="outlined" title="Outlined">…</Card>\n<Card variant="flat" title="Flat">…</Card>`} />
      </Section>

      <Section title="With header actions">
        <Preview>
          <div style={{ width: 420 }}>
            <Card title="Pipeline" extra={<Badge stage="qualified">qualified</Badge>}>
              <div style={{ ...textStyle.mRegular, color: color.main.description, marginBottom: spacing.m }}>
                Cards accept any node in `extra` — badges, counts, or menus.
              </div>
              <Button size="small">View all</Button>
            </Card>
          </div>
        </Preview>
        <CodeBlock code={`<Card title="Pipeline" extra={<Badge stage="qualified">qualified</Badge>}>\n  <Button size="small">View all</Button>\n</Card>`} />
      </Section>

      <Section title="Padding">
        <Preview>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.s, width: '100%' }}>
            {(['none', 'small', 'medium', 'large'] as const).map((padding) => (
              <Card key={padding} variant="outlined" padding={padding}>
                <div style={{ ...textStyle.sMedium, backgroundColor: color.badge.background, padding: spacing.xs, textAlign: 'center' }}>{padding}</div>
              </Card>
            ))}
          </div>
        </Preview>
        <CodeBlock code={`<Card padding="none">…</Card>\n<Card padding="small">…</Card>\n<Card padding="large">…</Card>`} />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'variant', type: `'elevated' | 'outlined' | 'flat'`, default: `'elevated'`, description: 'Surface treatment.' },
            { name: 'padding', type: `'none' | 'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Inner padding of the content area.' },
            { name: 'title', type: 'ReactNode', description: 'Heading rendered above the content, with a divider.' },
            { name: 'extra', type: 'ReactNode', description: 'Rendered opposite the title — actions, menus, counts.' },
          ]}
        />
      </Section>

      <Section title="Source">
        <CodeBlock code={CARD_SOURCE} readingOnly />
      </Section>
    </>
  );
}
