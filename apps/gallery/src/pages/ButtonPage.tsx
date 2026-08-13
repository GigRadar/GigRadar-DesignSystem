import { color, textStyle } from '@gigradar/theme';
import {
  Button,
  ComposerButton,
  HStack,
  Icon,
  IconLazizaSparkleStroke,
  IconMeetingsStroke,
  IconPlus,
  IconScheduleClockStroke,
  IconXClose,
  VStack,
  type ButtonProps,
  type IconDef,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const VARIANT_LABEL: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'Button (Main)',
  secondary: 'Button (Secondary)',
  third: 'Button (Third)',
};

/**
 * One feature, complete: every variant it is drawn in, all four states
 * (Active, Hover, Disable, Syncing), and the icon slot — so a developer
 * building that feature sees everything it can do in one place.
 *
 * `variants` defaults to Main and 2nd, which is what a tone has. The third
 * button is chrome and carries no hue, so it is drawn once on the default
 * section rather than repeated identically under every feature colour.
 */
function FeatureStates({
  tone,
  label,
  icon,
  variants = ['primary', 'secondary'],
  usageMain,
  usageSecondary,
  usageThird,
}: {
  tone: ButtonProps['tone'];
  label: string;
  icon: IconDef;
  /** Which variants to draw, in order. */
  variants?: NonNullable<ButtonProps['variant']>[];
  /** Usage snippet shown under the Main row. */
  usageMain: string;
  /** Usage snippet shown under the Secondary row. */
  usageSecondary: string;
  /** Usage snippet shown under the Third row, where one is drawn. */
  usageThird?: string;
}) {
  const usage: Partial<Record<NonNullable<ButtonProps['variant']>, string>> = {
    primary: usageMain,
    secondary: usageSecondary,
    third: usageThird,
  };

  return (
    <VStack gap="l" mb="m">
      {variants.map((variant) => (
        <VStack key={variant} gap="s">
          <VStack gap="xxs">
            <div style={{ ...textStyle.sSemibold, color: color.main.description }}>
              {VARIANT_LABEL[variant]}
            </div>
            <HStack gap="s" flexWrap="wrap">
              <Button variant={variant} tone={tone}>
                {label}
              </Button>
              {/* Hover is a real pointer state — point at it rather than a frozen fake. */}
              <Button variant={variant} tone={tone}>
                Hover me
              </Button>
              <Button variant={variant} tone={tone} disabled>
                {label}
              </Button>
              <Button variant={variant} tone={tone} loading>
                {label}
              </Button>
              {/* The icon is optional, and goes on either side — or both. */}
              <Button variant={variant} tone={tone} startIcon={<Icon icon={icon} size={16} />}>
                {label}
              </Button>
              <Button variant={variant} tone={tone} endIcon={<Icon icon={icon} size={16} />}>
                {label}
              </Button>
            </HStack>
          </VStack>
          {usage[variant] && (
            <CodeBlock label={`Usage — ${VARIANT_LABEL[variant]}`} code={usage[variant]} />
          )}
        </VStack>
      ))}
    </VStack>
  );
}

function ComposerDemo() {
  const [tab, setTab] = useState<'message' | 'note'>('message');
  return (
    <HStack gap="xxs">
      <ComposerButton selected={tab === 'message'} info onClick={() => setTab('message')}>
        Message
      </ComposerButton>
      <ComposerButton laziza selected={tab === 'note'} info onClick={() => setTab('note')}>
        Note
      </ComposerButton>
    </HStack>
  );
}

export function ButtonPage() {
  return (
    <>
      <PageHeader
        title="Button"
        description="The application button, organised by feature the way Figma draws them — each feature is the same control in its own tone, shown with both variants, all four states, and the icon slot."
      />

      <Section
        title="Quick start"
        description="Everything comes from @gigradar/ui — components, icons, layout, and tokens through one entry point. Mount GigRadarProvider once at the app root."
      >
        <Preview>
          <HStack gap="s">
            <Button>Apply</Button>
            <Button variant="secondary">Cancel</Button>
            <Button loading>Send</Button>
          </HStack>
        </Preview>
        <CodeBlock
          code={`import { GigRadarProvider, Button, HStack } from '@gigradar/ui';

// Mount the provider ONCE at the app root — it delivers the design tokens.
<GigRadarProvider>
  <HStack gap="s">
    <Button onClick={apply}>Apply</Button>
    <Button variant="secondary" onClick={cancel}>Cancel</Button>
  </HStack>
</GigRadarProvider>`}
        />
      </Section>

      <Section
        title="Main + 2nd + 3rd"
        description="The default button, in all three variants — Figma's Main (filled), 2nd (outlined), and 3rd (quiet chrome). One Main per view: the action you want taken. Everything beside it is the 2nd. The 3rd is for controls that are not part of the decision at all — a version pill, a toolbar toggle, the Cancel beside a destructive action — and it is the one variant with no tone, since chrome has no hue to announce."
      >
        <FeatureStates
          tone="brand"
          label="Apply"
          icon={IconPlus}
          variants={['primary', 'secondary', 'third']}
          usageMain={`// ONE Main per view — the action you want taken.
<Button onClick={apply}>Apply</Button>

// States come from your data, not from styling:
<Button loading={isSending} onClick={send}>Send</Button>   // in flight
<Button disabled={!form.isValid}>Apply</Button>            // not allowed yet

// Icons are OPTIONAL — left, right, or both. size 16 matches the slot:
<Button startIcon={<Icon icon={IconPlus} size={16} />}>Add job</Button>
<Button endIcon={<Icon icon={IconDropdownArrowDown} size={16} />}>More</Button>`}
          usageSecondary={`// Everything beside the Main action — same states, same icon slots.
<Button variant="secondary" onClick={saveDraft}>Save draft</Button>
<Button variant="secondary" disabled={!hasChanges}>Reset</Button>
<Button variant="secondary" startIcon={<Icon icon={IconPlus} size={16} />}>
  Add filter
</Button>`}
          usageThird={`// Chrome — a control that is not part of the decision. It fills with the
// nav grey on hover instead of tinting its border, because it has no hue
// to announce. Pass no tone: the 3rd variant ignores it.
<Button variant="third" endIcon={<Icon icon={IconDropdownArrowDown} size={16} />}>
  v2
</Button>

// The Cancel beside a destructive action — quiet, so the two do not look
// equally weighted when one of them deletes something. ConfirmTooltip
// already draws its Cancel this way.
<Button variant="third" onClick={dismiss}>Cancel</Button>`}
        />
      </Section>

      <Section
        title="Schedule message + 2nd"
        description="The Schedule Messages feature button — purple, per the schedule accent tokens. Same control, same states; only the tone changes."
      >
        <FeatureStates
          tone="schedule"
          label="Schedule message"
          icon={IconScheduleClockStroke}
          usageMain={`// Pick the tone by FEATURE, not by color — scheduling is purple because
// the design system says so, not because this call site chose purple.
<Button tone="schedule" startIcon={<Icon icon={IconScheduleClockStroke} size={16} />}>
  Schedule message
</Button>`}
          usageSecondary={`<Button variant="secondary" tone="schedule">Reschedule</Button>
<Button variant="secondary" tone="schedule" loading={isRescheduling}>
  Rescheduling…
</Button>`}
        />
      </Section>

      <Section
        title="Meetings + 2nd"
        description="The Meetings feature button — green, per the meetings accent tokens."
      >
        <FeatureStates
          tone="meeting"
          label="Book a meeting"
          icon={IconMeetingsStroke}
          usageMain={`<Button tone="meeting" startIcon={<Icon icon={IconMeetingsStroke} size={16} />}>
  Book a meeting
</Button>`}
          usageSecondary={`<Button variant="secondary" tone="meeting">Suggest a time</Button>
<Button variant="secondary" tone="meeting" loading={isBooking}>
  Booking…
</Button>`}
        />
      </Section>

      <Section
        title="Laziza AI + 2nd"
        description="The Laziza AI feature button — amber, per the laziza accent tokens."
      >
        <FeatureStates
          tone="laziza"
          label="Ask Laziza AI"
          icon={IconLazizaSparkleStroke}
          usageMain={`<Button tone="laziza" startIcon={<Icon icon={IconLazizaSparkleStroke} size={16} />}>
  Ask Laziza AI
</Button>`}
          usageSecondary={`<Button variant="secondary" tone="laziza">Improve reply</Button>
<Button variant="secondary" tone="laziza" loading={isGenerating}>
  Generating…
</Button>`}
        />
      </Section>

      <Section
        title="Cancel / negative + 2nd"
        description="Destructive actions — cancelling a proposal, removing a member, deleting a record. Two things set this tone apart. The 2nd variant carries its red outline at rest, where the other tones stay neutral until hovered: destructive should read as destructive before you point at it. And the filled variant DEEPENS on hover, from the soft coral to a full red, rather than lightening — the button destroys something, so it should feel more serious the closer the pointer gets."
      >
        <FeatureStates
          tone="danger"
          label="Cancel proposal"
          icon={IconXClose}
          usageMain={`// Filled red is the loudest thing on any screen — reserve it for the
// confirm step of a destructive flow, not the entry point.
<Button tone="danger" onClick={confirmCancel} loading={isCancelling}>
  Cancel proposal
</Button>

// ConfirmTooltip already draws this button as its Remove, so reach for it
// directly only when you are building your own confirm surface:
<ConfirmTooltip onConfirm={doDelete}>
  <Button variant="secondary" tone="danger">Delete</Button>
</ConfirmTooltip>`}
          usageSecondary={`// The usual entry point. Unlike other tones it carries its red outline at
// rest — destructive should read as destructive before it is hovered.
// Confirm before acting when the action is not undoable: the color warns,
// it does not protect.
<Button variant="secondary" tone="danger" onClick={askToConfirm}>
  Cancel proposal
</Button>`}
        />
      </Section>

      <Section
        title="Composer text"
        description="The Message / Note toggle above a message box. A separate component because the shape genuinely differs: no border, transparent until hovered or selected, 12px semibold — and its state is selected or not. Figma draws no disabled or loading state for it. Click the live example."
      >
        <Preview>
          <ComposerDemo />
        </Preview>
        <CodeBlock
          code={`// A toggle, not an action — drive selected from state, one selected per row.
const [tab, setTab] = useState<'message' | 'note'>('message');

<HStack gap="xxs">
  <ComposerButton selected={tab === 'message'} onClick={() => setTab('message')}>
    Message
  </ComposerButton>
  <ComposerButton laziza selected={tab === 'note'} onClick={() => setTab('note')}>
    Note
  </ComposerButton>
</HStack>`}
        />
      </Section>

      <Section
        title="Size"
        description="Three steps. medium is the size drawn in Figma — the other two extend the scale proportionally. Size is orthogonal to feature: every tone comes in all three."
      >
        <Preview>
          <Button size="small">Apply</Button>
          <Button size="medium">Apply</Button>
          <Button size="large">Apply</Button>
        </Preview>
        <CodeBlock code={`<Button size="small">Apply</Button>   // dense tables and toolbars
<Button>Apply</Button>                // default — the Figma size
<Button size="large">Apply</Button>   // hero moments`} />
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
        <CodeBlock code={`<Button fullWidth>Apply now</Button>`} />
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
          <Button startIcon={<Icon icon={IconPlus} size={24} />} iconSize={24} gap={16}>
            Big icon
          </Button>
          <Button background="#2E1065" textColor="#FDE68A" fontWeight={700}>
            Custom fill
          </Button>
          <Button variant="secondary" borderColor="#2E1065" textColor="#2E1065" borderWidth={2}>
            Custom outline
          </Button>
        </Preview>
        <CodeBlock
          code={`// Escape hatch for genuine one-offs — reach for variant / tone / size FIRST.
// If you set the same override in more than one place, it is not a one-off:
// ask for a token or variant instead of repeating it.
<Button radius={9999} paddingX={24}>Pill</Button>
<Button variant="secondary" radius={0} borderWidth={2}>Square</Button>`}
        />
      </Section>

      <Section title="Button props">
        <PropsTable
          rows={[
            {
              name: 'variant',
              type: `'primary' | 'secondary' | 'third'`,
              default: `'primary'`,
              description:
                'Which of the three kinds to render. primary is the blue filled button, secondary the white outlined one, and third the quiet chrome control that fills with the nav grey on hover.',
            },
            {
              name: 'tone',
              type: `'brand' | 'meeting' | 'schedule' | 'laziza' | 'danger'`,
              default: `'brand'`,
              description:
                "The button's hue. Each of Figma's per-feature buttons is one of these — danger is the destructive tone, covering both Cancel and Remove.",
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
