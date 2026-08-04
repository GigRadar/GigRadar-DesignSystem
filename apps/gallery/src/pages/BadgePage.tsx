import { color, component, spacing, textStyle } from '@uiuxjoseph/theme';
import { Badge, type StageName } from '@uiuxjoseph/ui';
import { CodeBlock } from '../components/CodeBlock';
import { CssPropsTable } from '../components/CssPropsTable';
import { Example } from '../components/Example';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Section } from '../layout';
import { BADGE_SOURCE } from '../sources';

const STAGE_GROUPS: { label: string; stages: StageName[] }[] = [
  { label: 'Unqualified', stages: ['new', 'contactLater'] },
  { label: 'Pipeline', stages: ['interested', 'booked', 'happened', 'qualified', 'converted'] },
  { label: 'Lost', stages: ['unreachable', 'notInterested'] },
];

export function BadgePage() {
  return (
    <>
      <PageHeader title="Badge" description="A status or category label. The stage prop covers the nine CRM pipeline states from Figma, so pipeline UI never hand-rolls colors." />

      <Section title="Tones">
        <Example
          code={`<Badge tone="brand">Brand</Badge>
<Badge tone="success">Success</Badge>
<Badge tone="warning">Warning</Badge>
<Badge tone="error">Error</Badge>
<Badge tone="neutral">Neutral</Badge>
<Badge tone="schedule">Scheduled</Badge>
<Badge tone="meetings">Meeting</Badge>`}
        >
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="error">Error</Badge>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="schedule">Scheduled</Badge>
          <Badge tone="meetings">Meeting</Badge>
        </Example>
      </Section>

      <Section title="CRM stages" description="Grouped by the [U] / [P] / [L] prefixes in the Figma guidebook.">
        {STAGE_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: spacing.xxs }}>
            <div style={{ ...textStyle.sSemibold, color: color.main.description, marginBottom: spacing.xxs }}>{group.label}</div>
            <Example
              code={group.stages.map((s) => `<Badge stage="${s}">${s}</Badge>`).join('\n')}
            >
              {group.stages.map((stage) => (
                <Badge key={stage} stage={stage}>
                  {stage}
                </Badge>
              ))}
            </Example>
          </div>
        ))}
      </Section>

      <Section title="Sizes and dot">
        <Example
          code={`<Badge size="small">Small</Badge>
<Badge size="medium">Medium</Badge>
<Badge tone="success" dot>With dot</Badge>
<Badge tone="error" dot size="small">Failed</Badge>`}
        >
          <Badge size="small">Small</Badge>
          <Badge size="medium">Medium</Badge>
          <Badge tone="success" dot>
            With dot
          </Badge>
          <Badge tone="error" dot size="small">
            Failed
          </Badge>
        </Example>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'tone', type: `'brand' | 'success' | 'warning' | 'error' | 'neutral' | 'schedule' | 'meetings'`, default: `'neutral'`, description: 'Semantic color. Ignored when stage is set.' },
            { name: 'stage', type: 'StageName', description: 'Renders a CRM pipeline stage badge. Takes precedence over tone.' },
            { name: 'size', type: `'small' | 'medium'`, default: `'medium'`, description: 'Badge height and type scale.' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Renders a filled dot before the label.' },
          ]}
        />
      </Section>

      <Section
        title="CSS properties"
        description="Type a value to see it apply — the override is scoped to this preview."
      >
        <CssPropsTable
          rows={[
            { name: 'badge-height-medium', value: `${component.badge.height.medium}px`, description: 'Badge height at the default size.' },
            { name: 'badge-height-small', value: `${component.badge.height.small}px`, description: 'Badge height at size="small".' },
            { name: 'badge-padding-x-medium', value: `${component.badge.paddingX.medium}px`, description: 'Horizontal padding at the default size.' },
            { name: 'badge-radius', value: `${component.badge.radius}px`, description: 'Corner radius. 9999px produces the pill shape.' },
            { name: 'badge-border-width', value: `${component.badge.borderWidth}px`, description: 'Border thickness.' },
            { name: 'badge-dot-size', value: `${component.badge.dotSize}px`, description: 'Diameter of the leading dot.' },
          ]}
        >
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success" dot>Success</Badge>
          <Badge stage="qualified">qualified</Badge>
          <Badge size="small">Small</Badge>
        </CssPropsTable>
      </Section>

      <Section title="Source">
        <CodeBlock code={BADGE_SOURCE} readingOnly />
      </Section>
    </>
  );
}
