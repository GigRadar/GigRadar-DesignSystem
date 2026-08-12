import { color, textStyle } from '@gigradar/theme';
import { HStack, LifecycleBadge, VStack, type ComponentLifecycle } from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { DevelopmentPlaceholder, Proposal } from '../components/DevelopmentPlaceholder';
import { PageHeader, Preview, Section } from '../layout';

const STAGES: ComponentLifecycle[] = ['stable', 'development', 'deprecated'];

export function LifecyclePage() {
  return (
    <>
      <PageHeader
        title="Lifecycle"
        description="How a component gets into the design system, and how the gallery says where it has got to. A component can be built and visible here long before it is approved — a reader with no way to tell will use whatever they can see."
      />

      <Section
        title="How a component gets in"
        description="The marker is not decoration; it tracks a process with one decision in it."
      >
        <VStack gap="s">
          {[
            'A problem is identified — a screen that misleads, a pattern repeated by hand in three apps.',
            'Three proposals are drawn for it, differing in layout and approach, all built from existing tokens and components.',
            'The gallery shows a placeholder card marked In development. No live example, no usage snippet, no props table — nothing that reads as "ready".',
            'A pull request puts the three proposals in front of a reviewer, rendered in every state.',
            'One is approved. The placeholder, the marker, and the two losing proposals come out.',
            'The winner takes the section over as an ordinary component — live examples, usage snippets, props table, like everything else here.',
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

      <Section
        title="The marker"
        description="Three stages, because a component is always in exactly one of three situations: in the system, on its way in, or on its way out. One drawing each — a marker that could be drawn three ways would be three markers, and a reader would have to learn which is which before reading any of them."
      >
        <Preview>
          <HStack gap="s" flexWrap="wrap">
            {STAGES.map((stage) => (
              <LifecycleBadge key={stage} stage={stage} />
            ))}
          </HStack>
        </Preview>
        <CodeBlock
          code={`// On a gallery section, which draws the marker beside the heading.
<Section stage="development" title="The three popup states" description="…">
  <DevelopmentPlaceholder …>…</DevelopmentPlaceholder>
</Section>`}
        />
      </Section>

      <Section
        title="What in development looks like"
        description="A placeholder card standing in for the component, holding the proposals. This is the pattern itself, shown on a made-up example — the real one is on CRM ▸ Settings ▸ Upwork Connected Account."
      >
        <DevelopmentPlaceholder
          title="Example component"
          problem="The one-line statement of what the proposals are competing to solve."
          proposalCount={2}
        >
          <VStack gap="l">
            <Proposal
              number={1}
              approach="One approach"
              rationale="What makes it different, and what it costs. A reviewer picks on this line, not on the picture."
            >
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>
                Each proposal renders here, in every state the component has.
              </span>
            </Proposal>
            <Proposal
              number={2}
              approach="Another approach"
              rationale="Three proposals that differ only in decoration are not a choice. They have to disagree about something."
            >
              <span style={{ ...textStyle.mRegular, color: color.main.description }}>
                All built from existing tokens and components, so approving one adds no new
                primitives to the system.
              </span>
            </Proposal>
          </VStack>
        </DevelopmentPlaceholder>
      </Section>
    </>
  );
}
