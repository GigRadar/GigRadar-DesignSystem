import { color, spacing, textStyle } from '@gigradar/theme';
import { Badge, type StageName } from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
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
        <Preview>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="success">Success</Badge>
          <Badge tone="warning">Warning</Badge>
          <Badge tone="error">Error</Badge>
          <Badge tone="neutral">Neutral</Badge>
          <Badge tone="schedule">Scheduled</Badge>
          <Badge tone="meetings">Meeting</Badge>
        </Preview>
        <CodeBlock code={`<Badge tone="brand">Brand</Badge>\n<Badge tone="success">Success</Badge>\n<Badge tone="error">Error</Badge>`} />
      </Section>

      <Section title="CRM stages" description="Grouped by the [U] / [P] / [L] prefixes in the Figma guidebook.">
        {STAGE_GROUPS.map((group) => (
          <div key={group.label} style={{ marginBottom: spacing.s }}>
            <div style={{ ...textStyle.sSemibold, color: color.main.description, marginBottom: spacing.xxs }}>{group.label}</div>
            <Preview>
              {group.stages.map((stage) => (
                <Badge key={stage} stage={stage}>
                  {stage}
                </Badge>
              ))}
            </Preview>
          </div>
        ))}
        <CodeBlock code={`<Badge stage="new">New</Badge>\n<Badge stage="qualified">Qualified</Badge>\n<Badge stage="unreachable">Unreachable</Badge>`} />
      </Section>

      <Section title="Sizes and dot">
        <Preview>
          <Badge size="small">Small</Badge>
          <Badge size="medium">Medium</Badge>
          <Badge tone="success" dot>
            With dot
          </Badge>
          <Badge tone="error" dot size="small">
            Failed
          </Badge>
        </Preview>
        <CodeBlock code={`<Badge size="small">Small</Badge>\n<Badge tone="success" dot>With dot</Badge>`} />
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

      <Section title="Source">
        <CodeBlock code={BADGE_SOURCE} readingOnly />
      </Section>
    </>
  );
}
