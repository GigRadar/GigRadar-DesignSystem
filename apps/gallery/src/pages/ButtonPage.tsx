import { color, textStyle } from '@uiuxjoseph/theme';
import { Button, ComposerButton, HStack, VStack } from '@uiuxjoseph/ui';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

/** A stand-in glyph, so the icon slots have something to show. */
const PlusIcon = () => (
  <svg viewBox="0 0 16 16" width="100%" height="100%" fill="none" aria-hidden>
    <path
      d="M8 3.5v9M3.5 8h9"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
);

export function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        description="The application button — a 6px-radius control with 16/8 padding and 14px medium text, in a filled primary and an outlined secondary, across five tones. Covers the eight Figma button components: Main, Secondary, Cancel, Meeting, Schedule, Laziza AI, and the two composer tabs."
      />

      <Section
        title="Quick start"
        description="Everything on this page is imported from @uiuxjoseph/ui — components, layout primitives, and tokens all come from the one entry point."
      >
        <Preview>
          <HStack gap="s">
            <Button>Apply</Button>
            <Button variant="secondary">Cancel</Button>
            <Button loading>Send</Button>
          </HStack>
        </Preview>
      </Section>

      <Section
        title="Variants"
        description="Two kinds. primary is the blue filled button and secondary the white outlined one."
      >
        <Preview>
          <Button variant="primary">Apply</Button>
          <Button variant="secondary">Apply</Button>
        </Preview>
      </Section>

      <Section
        title="All 8 variants"
        description="Each feature button in Figma is drawn as eight named variants — Main and 2nd, each in Active, Hover, Disable, and Syncing. They are the two variants crossed with the four states, so the component reaches all eight through variant plus disabled/loading rather than eight separate names."
      >
        <VStack gap="m">
          {(['primary', 'secondary'] as const).map((variant) => (
            <VStack key={variant} gap="xxs">
              <div style={{ ...textStyle.sSemibold, color: color.main.description }}>
                {variant === 'primary' ? 'Main' : '2nd'}
              </div>
              <HStack gap="s">
                <Button variant={variant}>Active</Button>
                {/* Hover is a real pointer state, so this one is shown by
                    pointing at it rather than faked with a frozen style. */}
                <Button variant={variant}>Hover me</Button>
                <Button variant={variant} disabled>
                  Disable
                </Button>
                <Button variant={variant} loading>
                  Syncing
                </Button>
              </HStack>
            </VStack>
          ))}
        </VStack>
      </Section>

      <Section
        title="Tones"
        description="Figma draws one button per feature — Meeting, Schedule, Laziza AI, Cancel — and they are the same control in a different color: identical padding, radius, gap, and type. So the feature is a tone rather than a component, and a new one is a row in a table instead of a new file."
      >
        <Preview>
          <VStack gap="s">
            <HStack gap="s">
              <Button tone="brand">Send</Button>
              <Button tone="meeting">Send</Button>
              <Button tone="schedule">Send</Button>
              <Button tone="laziza">Send</Button>
              <Button tone="danger">Cancel</Button>
            </HStack>
            <HStack gap="s">
              <Button variant="secondary" tone="brand">
                Send
              </Button>
              <Button variant="secondary" tone="meeting">
                Send
              </Button>
              <Button variant="secondary" tone="schedule">
                Send
              </Button>
              <Button variant="secondary" tone="laziza">
                Send
              </Button>
              <Button variant="secondary" tone="danger">
                Cancel
              </Button>
            </HStack>
          </VStack>
        </Preview>
      </Section>

      <Section
        title="Tone hover"
        description="The outlined feature buttons stay neutral at rest and pick up their tone on hover — border and label together — so a row of them is quiet until you point at one. Cancel is the exception: it carries its red outline from the start, because a destructive action should read as destructive before it is hovered."
      >
        <Preview>
          <Button variant="secondary" tone="meeting">
            Hover me
          </Button>
          <Button variant="secondary" tone="schedule">
            Hover me
          </Button>
          <Button variant="secondary" tone="laziza">
            Hover me
          </Button>
          <Button variant="secondary" tone="danger">
            Cancel
          </Button>
        </Preview>
      </Section>

      <Section
        title="States"
        description="Hover is drawn in Figma for both variants. Disabled turns the primary grey on grey, while the secondary keeps its white fill and fades the label — that ghosted look is what stops a row of outlined buttons becoming a row of grey blocks. Hover the live examples to see the transition."
      >
        <Preview>
          <VStack gap="s">
            <HStack gap="s">
              <Button>Apply</Button>
              <Button disabled>Apply</Button>
              <Button loading>Send</Button>
            </HStack>
            <HStack gap="s">
              <Button variant="secondary">Apply</Button>
              <Button variant="secondary" disabled>
                Apply
              </Button>
              <Button variant="secondary" loading>
                Send
              </Button>
            </HStack>
          </VStack>
        </Preview>
      </Section>

      <Section
        title="Loading"
        description="Figma's Syncing variant. The button keeps its label and takes the disabled palette, so it does not change width as the work starts and does not look pressable while it runs. It is inert for the same reason a disabled button is, and carries aria-busy for screen readers."
      >
        <Preview>
          <Button loading>Send</Button>
          <Button variant="secondary" loading>
            Send
          </Button>
        </Preview>
      </Section>

      <Section
        title="With icons"
        description="An icon can sit on either side of the label. Each slot is a fixed square that never shrinks, so an SVG sized in percent fills it and one with an intrinsic size is contained rather than stretching the button. A loading spinner takes the endIcon slot."
      >
        <Preview>
          <Button startIcon={<PlusIcon />}>Add job</Button>
          <Button variant="secondary" endIcon={<PlusIcon />}>
            Add job
          </Button>
          <Button startIcon={<PlusIcon />} endIcon={<PlusIcon />}>
            Add job
          </Button>
        </Preview>
      </Section>

      <Section
        title="Size"
        description="Three steps. medium is the size drawn in Figma — the other two extend the scale proportionally."
      >
        <Preview>
          <Button size="small">Apply</Button>
          <Button size="medium">Apply</Button>
          <Button size="large">Apply</Button>
        </Preview>
      </Section>

      <Section
        title="Full width"
        description="Stretches the button to fill its container — for forms and narrow columns, where a centred inline button reads as unfinished."
      >
        <Preview>
          <VStack gap="s" width={280}>
            <Button fullWidth>Apply now</Button>
            <Button variant="secondary" fullWidth>
              Save draft
            </Button>
          </VStack>
        </Preview>
      </Section>

      <Section
        title="Style props"
        description="Every CSS property the button exposes is a typed prop — metrics and colors alike — so nothing here needs a style prop, which the component does not accept. Each writes the matching CSS variable, making a prop, a stylesheet rule, and the token default one mechanism. Numbers mean px."
      >
        <Preview>
          <Button radius={9999} paddingX={24}>
            Pill
          </Button>
          <Button variant="secondary" radius={0} borderWidth={2}>
            Square
          </Button>
          <Button fontSize={18} paddingY={14}>
            Roomy
          </Button>
          <Button startIcon={<PlusIcon />} iconSize={24} gap={16}>
            Big icon
          </Button>
          <Button background="#2E1065" textColor="#FDE68A" fontWeight={700}>
            Custom fill
          </Button>
          <Button variant="secondary" borderColor="#2E1065" textColor="#2E1065" borderWidth={2}>
            Custom outline
          </Button>
        </Preview>
      </Section>

      <Section
        title="Composer tabs"
        description="The Message / Note toggle above a message box. A separate component because the shape genuinely differs rather than just the color: no border, transparent until hovered or selected, 12px semibold rather than 14px medium, and its state is selected or not — Figma draws no disabled or loading state for it."
      >
        <Preview>
          <HStack gap="xxs">
            <ComposerButton selected info>
              Message
            </ComposerButton>
            <ComposerButton laziza info>
              Note
            </ComposerButton>
          </HStack>
          <HStack gap="xxs">
            <ComposerButton info>Message</ComposerButton>
            <ComposerButton selected laziza info>
              Note
            </ComposerButton>
          </HStack>
        </Preview>
      </Section>

      <Section title="Button props">
        <PropsTable
          rows={[
            {
              name: 'variant',
              type: `'primary' | 'secondary'`,
              default: `'primary'`,
              description:
                'Which of the two kinds to render. primary is the blue filled button, secondary the white outlined one.',
            },
            {
              name: 'tone',
              type: `'brand' | 'meeting' | 'schedule' | 'laziza' | 'danger'`,
              default: `'brand'`,
              description:
                "The button's hue. Each of Figma's per-feature buttons is one of these — danger is the Cancel button.",
            },
            {
              name: 'size',
              type: `'small' | 'medium' | 'large'`,
              default: `'medium'`,
              description: 'Padding, type scale, gap, and icon size. medium is the Figma size.',
            },
            {
              name: 'children',
              type: 'ReactNode',
              description: 'The label.',
            },
            {
              name: 'startIcon',
              type: 'ReactNode',
              description: 'Icon placed before the label, in a fixed square slot.',
            },
            {
              name: 'endIcon',
              type: 'ReactNode',
              description: 'Icon placed after the label. Replaced by the spinner while loading.',
            },
            {
              name: 'loading',
              type: 'boolean',
              default: 'false',
              description:
                "Figma's Syncing state. Shows a spinner, keeps the label, takes the disabled palette, and makes the button inert.",
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Makes the button inert and applies the disabled palette.',
            },
            {
              name: 'fullWidth',
              type: 'boolean',
              default: 'false',
              description: 'Stretches the button to fill its container.',
            },
            {
              name: 'paddingX',
              type: 'number | string',
              description: 'Horizontal padding, overriding the size step. Writes --gr-button-padding-x-*.',
            },
            {
              name: 'paddingY',
              type: 'number | string',
              description: 'Vertical padding, overriding the size step. Writes --gr-button-padding-y-*.',
            },
            {
              name: 'radius',
              type: 'number | string',
              description: 'Corner radius. Writes --gr-button-radius.',
            },
            {
              name: 'borderWidth',
              type: 'number | string',
              description: 'Border thickness. Writes --gr-button-border-width.',
            },
            {
              name: 'fontSize',
              type: 'number | string',
              description: 'Label type size. Writes --gr-button-font-size-*.',
            },
            {
              name: 'gap',
              type: 'number | string',
              description: 'Space between the icons and the label. Writes --gr-button-gap-*.',
            },
            {
              name: 'fontWeight',
              type: 'number',
              description: 'Label weight. Writes --gr-button-font-weight.',
            },
            {
              name: 'background',
              type: 'string',
              description: 'Surface fill, overriding the variant/tone pair. Writes --gr-button-background.',
            },
            {
              name: 'textColor',
              type: 'string',
              description: 'Label color, overriding the variant/tone pair. Writes --gr-button-text-color.',
            },
            {
              name: 'borderColor',
              type: 'string',
              description: 'Border color, overriding the variant/tone pair. Writes --gr-button-border-color.',
            },
            {
              name: 'iconSize',
              type: 'number | string',
              description: 'Icon slot edge length. Writes --gr-button-icon-size-*.',
            },
          ]}
        />
      </Section>

      <Section title="ComposerButton props">
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', description: 'The label.' },
            {
              name: 'selected',
              type: 'boolean',
              default: 'false',
              description:
                'Whether this tab is the active one. Fills brand blue with a white label, and sets aria-pressed.',
            },
            {
              name: 'laziza',
              type: 'boolean',
              default: 'false',
              description:
                'The Laziza spark drawn on the Note tab — the AI-assisted composer mark. Orange at rest, white when selected.',
            },
            {
              name: 'info',
              type: 'boolean',
              default: 'false',
              description:
                'The circled-i badge after the label. Outlined at rest; selected inverts it to a filled white circle with a blue glyph.',
            },
            {
              name: 'endIcon',
              type: 'ReactNode',
              description: 'Arbitrary trailing content, after the built-in marks.',
            },
          ]}
        />
      </Section>
    </>
  );
}
