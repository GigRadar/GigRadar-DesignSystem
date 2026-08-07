import { color, textStyle } from '@gigradar/theme';
import { Button, HStack, Spinner, VStack, type SpinnerSize } from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const SIZES: SpinnerSize[] = ['small', 'medium', 'large', 'xlarge'];

/** Labels a row so the size steps are readable side by side. */
function SizeRow({ render }: { render: (size: SpinnerSize) => React.ReactNode }) {
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

export function SpinnerPage() {
  return (
    <>
      <PageHeader
        title="Spinner"
        description="The system loading indicator. Figma node 1252:11907 draws a ring swept by an angular gradient — dark blue into the brand blue, then fading to nothing, so the arc trails a comet tail. The tail is what makes the direction of travel legible; a uniform arc spins ambiguously."
      />

      <Section
        title="Not the button's spinner"
        description="These are two different components on purpose. Button's own loading prop draws a monochrome currentColor ring so it fades along with the label beside it — it belongs to the button. Spinner is a system-level indicator for page, panel, and section loads, and always carries the brand gradient regardless of the text around it. Reach for Spinner when something other than a button is loading."
      >
        <Preview>
          <HStack gap="xl" alignItems="center" flexWrap="wrap">
            <VStack gap="xs" alignItems="center">
              <div style={{ ...textStyle.sSemibold, color: color.main.description }}>Spinner (system)</div>
              <Spinner size="large" />
            </VStack>
            <VStack gap="xs" alignItems="center">
              <div style={{ ...textStyle.sSemibold, color: color.main.description }}>Button loading</div>
              <Button loading>Saving</Button>
            </VStack>
          </HStack>
        </Preview>
        <CodeBlock
          code={`// A page, panel, or section is loading — the system indicator.
<Spinner label="Loading proposals…" />

// A button is busy because the user just clicked it — that is the button's own.
<Button loading>Saving</Button>`}
        />
      </Section>

      <Section
        title="Sizes"
        description="Four steps. Medium is the 16px Figma draws; the rest extend the scale at a constant stroke-to-diameter ratio, so a large spinner does not read as a thicker ring."
      >
        <Preview>
          <SizeRow render={(size) => <Spinner size={size} />} />
        </Preview>
        <CodeBlock
          code={`<Spinner size="small" />
<Spinner size="medium" />   // the drawn size
<Spinner size="large" />
<Spinner size="xlarge" />`}
        />
      </Section>

      <Section
        title="With a label"
        description="Pass a label and it sits beside the ring, or underneath with stacked. The label doubles as the accessible name — a spinner with no name is just a decorative circle to anyone not looking at it. When there is no visible text, the component falls back to announcing 'Loading'."
      >
        <Preview>
          <HStack gap="xl" alignItems="center" flexWrap="wrap">
            <Spinner label="Loading proposals…" />
            <Spinner size="large" stacked label="Fetching your dashboard" />
          </HStack>
        </Preview>
        <CodeBlock
          code={`// Inline — reads as one line of status.
<Spinner label="Loading proposals…" />

// Stacked — for a spinner centred in an empty panel.
<Spinner size="xlarge" stacked label="Fetching your dashboard" />

// No visible text? It still announces "Loading". Name it if you can do better.
<Spinner aria-label="Loading search results" />`}
        />
      </Section>

      <Section
        title="In place of content"
        description="The usual shape: a section that has not loaded yet shows a centred spinner at the size of the space it is holding, rather than a bare ring in the corner."
      >
        <Preview>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 160,
              borderRadius: 8,
              border: `1px solid ${color.main.border}`,
            }}
          >
            <Spinner size="xlarge" stacked label="Loading your feed…" />
          </div>
        </Preview>
        <CodeBlock
          code={`{loading ? (
  <VStack alignItems="center" justifyContent="center" minHeight={160}>
    <Spinner size="xlarge" stacked label="Loading your feed…" />
  </VStack>
) : (
  <Feed items={items} />
)}`}
        />
      </Section>

      <Section
        title="Style props"
        description="The spinner's own metrics and colors, as typed props — the same mechanism the other components use. Reach for size first; these are for genuine one-offs, like a spinner on a dark surface where the drawn gradient would disappear."
      >
        <Preview>
          <HStack gap="l" alignItems="center" flexWrap="wrap">
            <Spinner size="large" headColor={color.status.success.main} bodyColor={color.status.success.main} />
            <Spinner size="large" diameter={40} strokeWidth={2} />
            <Spinner size="large" duration={2000} label="Slow" />
          </HStack>
        </Preview>
        <CodeBlock
          code={`// One-offs only. If the same override recurs, it belongs in the theme.
<Spinner headColor={color.status.success.main} bodyColor={color.status.success.main} />
<Spinner diameter={40} strokeWidth={2} />   // a thin, oversized ring
<Spinner duration={2000} />                 // a slower turn`}
        />
      </Section>

      <Section
        title="Motion"
        description="One turn takes 900ms — slower than the button's 700ms, because that one accompanies a click the user just made while this often sits alone on a page, where a fast spin reads as frantic. Under prefers-reduced-motion the turn slows to a third of its speed rather than stopping, since a frozen spinner reads as a hang."
      >
        <CodeBlock code={`<Spinner duration={1400} />   // per instance, in milliseconds`} />
      </Section>

      <Section title="Spinner props">
        <PropsTable
          rows={[
            { name: 'size', type: `'small' | 'medium' | 'large' | 'xlarge'`, default: `'medium'`, description: 'Ring diameter, stroke, gap, and label size.' },
            { name: 'label', type: 'ReactNode', description: 'Caption beside the ring. Doubles as the accessible name when it is a string.' },
            { name: 'stacked', type: 'boolean', default: 'false', description: 'Puts the label below the ring instead of beside it.' },
            { name: 'aria-label', type: 'string', default: `'Loading'`, description: 'Accessible name. Overrides the one derived from label.' },
            { name: 'diameter / strokeWidth', type: 'number | string', description: 'Ring size and thickness.' },
            { name: 'gap / fontSize', type: 'number | string', description: 'Ring-to-label gap, and label type size.' },
            { name: 'headColor / bodyColor', type: 'string', description: 'The dense leading end of the tail, and the color it sweeps through before fading.' },
            { name: 'textColor', type: 'string', description: 'Label color.' },
            { name: 'duration', type: 'number', default: '900', description: 'One full turn, in milliseconds.' },
          ]}
        />
      </Section>
    </>
  );
}
