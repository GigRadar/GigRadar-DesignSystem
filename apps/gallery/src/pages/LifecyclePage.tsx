import { color, textStyle } from '@gigradar/theme';
import { HStack, LifecycleBadge, VStack, type ComponentLifecycle, type LifecycleBadgeVariant } from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const STAGES: ComponentLifecycle[] = ['stable', 'development', 'deprecated'];
const VARIANTS: LifecycleBadgeVariant[] = ['solid', 'subtle', 'outline'];

export function LifecyclePage() {
  return (
    <>
      <PageHeader
        title="Lifecycle"
        description="How the gallery says whether a component is part of the design system yet. A component can be visible here long before it is approved, and a reader with no way to tell the difference will use whatever they can see."
      />

      <Section
        title="The three stages"
        description="A component is always in exactly one of three situations: it is in the system, it is on its way in, or it is on its way out."
      >
        <Preview>
          <HStack gap="s" flexWrap="wrap">
            {STAGES.map((stage) => (
              <LifecycleBadge key={stage} stage={stage} />
            ))}
          </HStack>
        </Preview>
        <CodeBlock
          code={`import { LifecycleBadge } from '@gigradar/ui';

<LifecycleBadge stage="stable" />       // in the system, safe to use
<LifecycleBadge stage="development" />  // built, not approved — do not ship
<LifecycleBadge stage="deprecated" />   // still works, being removed`}
        />
      </Section>

      <Section
        title="Three variants"
        description="The same badge at three volumes, one per place it appears. Every component in this system ships three variants; these are the three a lifecycle marker actually needs."
      >
        <VStack gap="m">
          {VARIANTS.map((variant) => (
            <VStack key={variant} gap="xxs">
              <div style={{ ...textStyle.sSemibold, color: color.main.description }}>{variant}</div>
              <HStack gap="s" flexWrap="wrap">
                {STAGES.map((stage) => (
                  <LifecycleBadge key={stage} stage={stage} variant={variant} />
                ))}
              </HStack>
            </VStack>
          ))}
        </VStack>
        <CodeBlock
          code={`// solid — a page heading, where the marker is the first thing to read
<LifecycleBadge stage="development" variant="solid" />

// subtle — a section inside a page that is already marked
<LifecycleBadge stage="development" variant="subtle" />

// outline — a sidebar row, where a filled pill beside every label
// would be louder than the labels
<LifecycleBadge stage="development" variant="outline" />`}
        />
      </Section>

      <Section
        title="Sizes"
        description="Three steps, matching the badge scale so a lifecycle marker and a product badge do not read as two different systems."
      >
        <Preview>
          <HStack gap="s" alignItems="center" flexWrap="wrap">
            <LifecycleBadge size="small" />
            <LifecycleBadge size="medium" />
            <LifecycleBadge size="large" />
          </HStack>
        </Preview>
      </Section>

      <Section
        title="Marking a section"
        description="Pass stage to any gallery Section. It is deliberately omitted on everything approved — a badge on every heading would stop meaning anything."
      >
        <CodeBlock
          code={`<Section
  stage="development"
  title="The three popup states"
  description="…"
>
  <PopupDemo />
</Section>`}
        />
      </Section>

      <Section
        title="How a component graduates"
        description="The marker is not decoration; it tracks a process."
      >
        <VStack gap="s">
          {[
            'Drawn in Figma, built here, shown in the gallery as In development.',
            'Opened as a pull request, with screenshots of every state.',
            'Reviewed — a designer on the design, a PM on the copy and behaviour.',
            'On approval and merge the marker comes off, and it is part of the system.',
          ].map((line, index) => (
            <HStack key={line} gap="s" alignItems="flex-start">
              <span
                style={{
                  ...textStyle.sSemibold,
                  color: color.main.white,
                  backgroundColor: color.main.brand,
                  borderRadius: 9999,
                  width: 20,
                  height: 20,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </span>
              <span style={{ ...textStyle.mRegular, color: color.navbar.textActive }}>{line}</span>
            </HStack>
          ))}
        </VStack>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            {
              name: 'stage',
              type: `'stable' | 'development' | 'deprecated'`,
              default: `'development'`,
              description: 'Which stage the component is at.',
            },
            {
              name: 'variant',
              type: `'solid' | 'subtle' | 'outline'`,
              default: `'solid'`,
              description: 'How loudly to draw it. One per place the marker appears.',
            },
            {
              name: 'size',
              type: `'small' | 'medium' | 'large'`,
              default: `'medium'`,
              description: 'Padding, type size, and dot diameter.',
            },
            {
              name: 'dot',
              type: 'boolean',
              description:
                'Draws a leading dot. On by default for development — the stage a reader must not skim past.',
            },
            { name: 'children', type: 'ReactNode', description: 'Overrides the label.' },
            {
              name: 'paddingX / paddingY / fontSize / gap / radius / borderWidth / dotSize',
              type: 'number | string',
              description: 'Metrics, overriding the size step.',
            },
            {
              name: 'background / textColor / borderColor',
              type: 'string',
              description: 'Colors, overriding the stage palette.',
            },
          ]}
        />
      </Section>
    </>
  );
}
