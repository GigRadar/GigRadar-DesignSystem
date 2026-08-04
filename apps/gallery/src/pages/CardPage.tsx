import { color, component, spacing, textStyle } from '@uiuxjoseph/theme';
import { Badge, Button, Card } from '@uiuxjoseph/ui';
import { CodeBlock } from '../components/CodeBlock';
import { CssPropsTable } from '../components/CssPropsTable';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Section } from '../layout';
import { CARD_SOURCE } from '../sources';

export function CardPage() {
  return (
    <>
      <PageHeader title="Card" description="A surface container. Elevated uses the single four-layer shadow defined in Figma — there is no elevation scale, by design." />

      <Section title="Variants">
        <Example
          code={`<Card variant="elevated" title="Elevated">
  Ambient shadow. Sits within the page.
</Card>

<Card variant="popup" title="Popup">
  Tighter shadow. Floats above the page.
</Card>

<Card variant="outlined" title="Outlined">…</Card>
<Card variant="flat" title="Flat">…</Card>`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.m, width: '100%' }}>
            <Card variant="elevated" title="Elevated">
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Ambient shadow. Sits within the page.</span>
            </Card>
            <Card variant="popup" title="Popup">
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Tighter shadow. Floats above the page.</span>
            </Card>
            <Card variant="outlined" title="Outlined">
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Border only, no shadow.</span>
            </Card>
            <Card variant="flat" title="Flat">
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Tinted, no border or shadow.</span>
            </Card>
          </div>
        </Example>
      </Section>

      <Section title="With header actions">
        <Example
          code={`<Card title="Pipeline" extra={<Badge stage="qualified">qualified</Badge>}>
  <Text>Cards accept any node in extra — badges, counts, or menus.</Text>
  <Button size="small">View all</Button>
</Card>`}
        >
          <div style={{ width: 420 }}>
            <Card title="Pipeline" extra={<Badge stage="qualified">qualified</Badge>}>
              <div style={{ ...textStyle.mRegular, color: color.main.description, marginBottom: spacing.m }}>
                Cards accept any node in `extra` — badges, counts, or menus.
              </div>
              <Button size="small">View all</Button>
            </Card>
          </div>
        </Example>
      </Section>

      <Section title="Padding">
        <Example
          code={`<Card padding="none">…</Card>
<Card padding="small">…</Card>
<Card padding="medium">…</Card>
<Card padding="large">…</Card>`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing.s, width: '100%' }}>
            {(['none', 'small', 'medium', 'large'] as const).map((padding) => (
              <Card key={padding} variant="outlined" padding={padding}>
                <div style={{ ...textStyle.sMedium, backgroundColor: color.badge.background, padding: spacing.xs, textAlign: 'center' }}>{padding}</div>
              </Card>
            ))}
          </div>
        </Example>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'variant', type: `'elevated' | 'popup' | 'outlined' | 'flat'`, default: `'elevated'`, description: 'Surface treatment. Use popup for dropdowns and menus.' },
            { name: 'padding', type: `'none' | 'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Inner padding of the content area.' },
            { name: 'title', type: 'ReactNode', description: 'Heading rendered above the content, with a divider.' },
            { name: 'extra', type: 'ReactNode', description: 'Rendered opposite the title — actions, menus, counts.' },
          ]}
        />
      </Section>

      <Section
        title="CSS properties"
        description="Type a value to see it apply — the override is scoped to this preview."
      >
        <CssPropsTable
          rows={[
            { name: 'card-radius', value: `${component.card.radius}px`, description: 'Corner radius.' },
            { name: 'card-padding-medium', value: `${component.card.padding.medium}px`, description: 'Inner padding at the default size.' },
            { name: 'card-padding-large', value: `${component.card.padding.large}px`, description: 'Inner padding at padding="large".' },
            { name: 'card-header-padding-y', value: `${component.card.headerPaddingY}px`, description: 'Vertical padding of the header strip.' },
            { name: 'card-gap', value: `${component.card.gap}px`, description: 'Gap between title and extra.' },
            { name: 'card-border-width', value: `${component.card.borderWidth}px`, description: 'Border thickness.' },
          ]}
        >
          <div style={{ width: 280 }}>
            <Card title="Pipeline" extra={<Badge stage="qualified">qualified</Badge>}>
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>Adjust the values to see this card change.</span>
            </Card>
          </div>
        </CssPropsTable>
      </Section>

      <Section title="Source">
        <CodeBlock code={CARD_SOURCE} readingOnly />
      </Section>
    </>
  );
}
