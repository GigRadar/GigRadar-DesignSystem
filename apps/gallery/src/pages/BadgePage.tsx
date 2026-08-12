import { color, textStyle } from '@gigradar/theme';
import {
  AiToolBadge,
  CounterBadge,
  CreditBadge,
  EyebrowBadge,
  HStack,
  ModeBadge,
  RankBadge,
  StatusBadge,
  VStack,
  type BadgeSize,
} from '@gigradar/ui';
import type { ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';

const SIZES: BadgeSize[] = ['small', 'medium', 'large'];

/** Labels a row so the three size steps are readable side by side. */
function SizeRow({ render }: { render: (size: BadgeSize) => ReactNode }) {
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

export function BadgePage() {
  return (
    <>
      <PageHeader
        title="Badge"
        description="A family of badges, each a different job rather than a variant of one component — a credit amount, an AI eyebrow, an unread count, a rank with its direction of travel, a connection status, the Laziza reply mode, and the AI tool category marker. The sized ones come in three steps."
      />

      <Section
        title="Credit badge"
        description="A GigRadar credit amount followed by the credit mark. Figma node 1282:28608 — a light blue pill with a regular-weight number and a dark disc."
      >
        <Preview>
          <SizeRow render={(size) => <CreditBadge size={size}>1</CreditBadge>} />
        </Preview>
        <Preview>
          <CreditBadge>1</CreditBadge>
          <CreditBadge>12</CreditBadge>
          <CreditBadge>250</CreditBadge>
        </Preview>
        <CodeBlock
          code={`import { CreditBadge } from '@gigradar/ui';

// The amount is the child, so format it however your data needs —
// the badge does not know your locale.
<CreditBadge>{credits}</CreditBadge>
<CreditBadge>{credits.toLocaleString()}</CreditBadge>

// Three sizes; medium is the size Figma draws.
<CreditBadge size="small">1</CreditBadge>
<CreditBadge size="large">250</CreditBadge>`}
        />
      </Section>

      <Section
        title="Eyebrow badge"
        description="A label flanked by sparkles, for AI features and onboarding steps. Figma node 163:10 — a pale blue pill with semibold text."
      >
        <Preview>
          <SizeRow render={(size) => <EyebrowBadge size={size}>Lesson 2</EyebrowBadge>} />
        </Preview>
        <Preview>
          <EyebrowBadge>Lesson 2</EyebrowBadge>
          <EyebrowBadge sparkles="start">AI reply</EyebrowBadge>
          <EyebrowBadge sparkles="end">Beta</EyebrowBadge>
          <EyebrowBadge sparkles="none">Plain</EyebrowBadge>
        </Preview>
        <CodeBlock
          code={`import { EyebrowBadge } from '@gigradar/ui';

// Both sparkles by default — the drawn state. Drop one when the badge sits
// in a tight row and the pair reads as noise.
<EyebrowBadge>Lesson 2</EyebrowBadge>
<EyebrowBadge sparkles="start">AI reply</EyebrowBadge>
<EyebrowBadge sparkles="none">Plain</EyebrowBadge>`}
        />
      </Section>

      <Section
        title="Counter badge"
        description="An unread or pending count in a filled circle. Figma node 313:6469. Counts above max collapse to “99+” so the circle keeps its shape."
      >
        <Preview>
          <SizeRow render={(size) => <CounterBadge size={size} count={1} />} />
        </Preview>
        <Preview>
          <CounterBadge count={1} label="1 unread message" />
          <CounterBadge count={12} label="12 unread messages" />
          <CounterBadge count={120} label="120 unread messages" />
          <CounterBadge count={1204} max={999} label="1204 unread messages" />
          <CounterBadge dot label="Unread messages" />
        </Preview>
        <CodeBlock
          code={`import { CounterBadge } from '@gigradar/ui';

// count is a number, not text, so the overflow rule can apply.
// Always pass a label — "3" alone tells a screen reader nothing.
<CounterBadge count={unreadCount} label={\`\${unreadCount} unread messages\`} />

// Raise the cap when the number genuinely matters:
<CounterBadge count={1204} max={999} />   // renders "999+"

// No number to show, but something is waiting:
<CounterBadge dot label="Unread messages" />`}
        />
      </Section>

      <Section
        title="Rank badge"
        description="A position with its direction of travel. Figma node 333:15163 draws seven variants; two pairs are the same drawing mirrored, so they collapse to five states — up, down, none, syncing, and error."
      >
        <Preview>
          <SizeRow render={(size) => <RankBadge size={size} state="up" rank={11} />} />
        </Preview>
        <Preview>
          <RankBadge state="up" rank={11} label="Rank 11, up" />
          <RankBadge state="down" rank={11} label="Rank 11, down" />
          <RankBadge state="none" label="Not ranked" />
          <RankBadge state="syncing" label="Fetching rank" />
          <RankBadge state="error" label="Rank unavailable" />
        </Preview>
        <CodeBlock
          code={`import { RankBadge } from '@gigradar/ui';

// Drive the state from your data — the badge does not infer direction.
<RankBadge state="up" rank={11} label="Rank 11, up from yesterday" />
<RankBadge state="down" rank={14} label="Rank 14, down from yesterday" />

// The three states that carry no number:
<RankBadge state="none" />                      // ranked, no position yet
<RankBadge state="syncing" label="Fetching" />  // in flight
<RankBadge state="error" label="Unavailable" /> // fetch failed

// The triangle alone does not say "up" to a screen reader — pass a label.`}
        />
      </Section>


      <Section
        title="Status badge"
        description="An account's state, tucked under the name it belongs to. Figma node 2113:1929 — the one badge in the family that is not a round pill: a 4px box, because it reads as a property of the thing above it rather than standing alone in a row."
      >
        <Preview>
          <HStack gap={12}>
            <StatusBadge tone="active" />
            <StatusBadge tone="suspended" />
            <StatusBadge tone="error" />
            <StatusBadge tone="pending" />
            <StatusBadge tone="inactive" />
          </HStack>
        </Preview>
        <CodeBlock
          code={`<StatusBadge tone="active" />

// The label is overridable — the error state in particular
// carries a specific message on some screens.
<StatusBadge tone="error">Token expired</StatusBadge>`}
        />
      </Section>

      <Section
        title="StatusBadge props"
      >
        <PropsTable
          rows={[
            { name: 'tone', type: `'active' | 'suspended' | 'error' | 'pending' | 'inactive'`, default: `'active'`, description: 'Which state to draw. Each carries its own palette and default label.' },
            { name: 'children', type: 'ReactNode', description: 'Overrides the label. Most callers pass only `tone`.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Padding and type size.' },
            { name: 'paddingX / paddingY / radius / fontSize', type: 'number | string', description: "Overrides for the badge's own metrics." },
            { name: 'background / textColor', type: 'string', description: 'Fill and label, overriding the tone’s own.' },
          ]}
        />
      </Section>

      <Section
        title="Mode badge — Laziza"
        description="Names how Laziza handles a class of message. Figma node 4498:4800. The two Laziza oranges separate “sends on its own” from “waits for you”; OFF drops to the neutral nav pair so a disabled thread reads as inactive rather than as a third mode."
      >
        <Preview>
          <HStack gap={12}>
            <ModeBadge mode="fullAuto" />
            <ModeBadge mode="coPilot" />
            <ModeBadge mode="other" />
            <ModeBadge mode="off" />
          </HStack>
        </Preview>
        <CodeBlock code={`<ModeBadge mode="fullAuto" />`} />
      </Section>

      <Section
        title="Two labels"
        description="One badge reporting two things — a thread whose first message and later messages run in different modes. The separator dot takes the label color, so it stays legible on the filled and the pale variants alike."
      >
        <Preview>
          <HStack gap={12}>
            <ModeBadge mode="fullAuto" secondaryLabel="Co-pilot" />
            <ModeBadge mode="other" secondaryLabel="OFF" />
          </HStack>
        </Preview>
        <CodeBlock code={`<ModeBadge mode="fullAuto" secondaryLabel="Co-pilot" />`} />
      </Section>

      <Section title="ModeBadge props">
        <PropsTable
          rows={[
            { name: 'mode', type: `'fullAuto' | 'coPilot' | 'off' | 'other'`, default: `'fullAuto'`, description: 'Which mode the badge names. Each carries its own palette and default label.' },
            { name: 'children', type: 'ReactNode', description: 'Overrides the label. Each mode has a default.' },
            { name: 'secondaryLabel', type: 'ReactNode', description: 'A second label after a separator dot — Figma’s `text2`.' },
            { name: 'paddingX / paddingY / radius / fontSize / gap', type: 'number | string', description: "Overrides for the badge's own metrics." },
            { name: 'background / textColor', type: 'string', description: 'Fill and label, overriding the mode’s own.' },
          ]}
        />
      </Section>

      <Section
        title="AI tool badge"
        description="The square category marker at the head of an AI tool row. Figma node 3777:9826. Four categories, each an accent pair already in the theme — so a capability keeps its identity wherever it appears."
      >
        <Preview>
          <HStack gap={12}>
            <AiToolBadge category="message" />
            <AiToolBadge category="notes" />
            <AiToolBadge category="schedule" />
            <AiToolBadge category="meeting" />
          </HStack>
        </Preview>
        <CodeBlock code={`<AiToolBadge category="schedule" />`} />
      </Section>

      <Section
        title="Disabled capability"
        description="The slash marks a capability the agent cannot currently call. A slash rather than a grey-out, because the category still matters when it is off: you need to see which capability is unavailable, not just that one is."
      >
        <Preview>
          <HStack gap={12}>
            <AiToolBadge category="message" crossed />
            <AiToolBadge category="notes" crossed />
            <AiToolBadge category="schedule" crossed />
            <AiToolBadge category="meeting" crossed />
          </HStack>
        </Preview>
        <CodeBlock code={`<AiToolBadge category="schedule" crossed />`} />
      </Section>

      <Section title="AiToolBadge props">
        <PropsTable
          rows={[
            { name: 'category', type: `'message' | 'notes' | 'schedule' | 'meeting'`, default: `'message'`, description: 'Colours the badge and, through `aiToolPalette`, the tag beside it.' },
            { name: 'crossed', type: 'boolean', default: 'false', description: 'Draws the disabled slash. The category palette stays.' },
            { name: 'icon', type: 'IconDef', description: "Overrides the category's own glyph." },
            { name: 'size / radius / iconSize', type: 'number | string', description: "The square's edge, corner radius, and glyph size." },
            { name: 'background / iconColor', type: 'string', description: 'Fill and glyph, overriding the category palette.' },
          ]}
        />
      </Section>

      <Section
        title="Style props"
        description="Every badge exposes its own metrics and colors as typed props, the same mechanism the other components use. Reach for a variant or size first — these are for genuine one-offs."
      >
        <Preview>
          <CreditBadge background={color.accent.laziza.background} textColor={color.accent.laziza.main}>
            9
          </CreditBadge>
          <EyebrowBadge background={color.accent.schedule.background} textColor={color.accent.schedule.main} iconColor={color.accent.schedule.main}>
            Scheduled
          </EyebrowBadge>
          <CounterBadge count={3} background={color.status.error.main} />
          <RankBadge state="up" rank={2} paddingX={12} fontSize={14} />
        </Preview>
        <CodeBlock
          code={`// One-offs only. If the same override recurs, it belongs in the theme.
<CounterBadge count={3} background={color.status.error.main} />
<RankBadge state="up" rank={2} paddingX={12} fontSize={14} />`}
        />
      </Section>

      <Section title="CreditBadge props">
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', description: 'The credit amount. Format it yourself.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Padding, type size, and credit mark diameter.' },
            { name: 'paddingX / paddingY', type: 'number | string', description: 'Padding, overriding the size step.' },
            { name: 'fontSize / gap / radius', type: 'number | string', description: 'Type size, number-to-mark gap, corner radius.' },
            { name: 'markSize', type: 'number | string', description: 'Credit mark diameter.' },
            { name: 'background / textColor', type: 'string', description: 'Pill fill and number color.' },
            { name: 'markBackground / markColor', type: 'string', description: 'Credit mark disc and glyph colors.' },
          ]}
        />
      </Section>

      <Section title="EyebrowBadge props">
        <PropsTable
          rows={[
            { name: 'children', type: 'ReactNode', description: 'The label.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Padding, type size, sparkle size, and gap.' },
            { name: 'sparkles', type: `'both' | 'start' | 'end' | 'none'`, default: `'both'`, description: 'Which sparkles to draw.' },
            { name: 'paddingX / paddingY', type: 'number | string', description: 'Padding, overriding the size step.' },
            { name: 'fontSize / gap / radius / iconSize', type: 'number | string', description: 'Type size, gap, corner radius, sparkle edge length.' },
            { name: 'background / textColor / iconColor', type: 'string', description: 'Pill fill, label color, sparkle color.' },
          ]}
        />
      </Section>

      <Section title="CounterBadge props">
        <PropsTable
          rows={[
            { name: 'count', type: 'number', description: 'The count. A number rather than text, so the overflow rule can apply.' },
            { name: 'max', type: 'number', default: '99', description: 'Counts above this render as "{max}+".' },
            { name: 'dot', type: 'boolean', default: 'false', description: 'Render a small empty dot instead of a number.' },
            { name: 'label', type: 'string', description: 'Accessible description. A bare number does not say what is counted.' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Circle diameter and type size.' },
            { name: 'diameter / fontSize / fontWeight', type: 'number | string', description: 'Circle diameter, type size, and weight.' },
            { name: 'background / textColor', type: 'string', description: 'Circle fill and number color.' },
          ]}
        />
      </Section>

      <Section title="RankBadge props">
        <PropsTable
          rows={[
            { name: 'rank', type: 'number | string', description: 'The position. Rendered as given, so "11", "1,204", and "#3" all work.' },
            { name: 'state', type: `'up' | 'down' | 'none' | 'syncing' | 'error'`, default: `'none'`, description: 'Which of the drawn states to render.' },
            { name: 'label', type: 'string', description: 'Accessible description. The triangle alone does not say "up".' },
            { name: 'size', type: `'small' | 'medium' | 'large'`, default: `'medium'`, description: 'Padding, type size, and triangle size.' },
            { name: 'paddingX / paddingY', type: 'number | string', description: 'Padding, overriding the size step.' },
            { name: 'fontSize / gap / radius / triangleSize', type: 'number | string', description: 'Type size, gap, corner radius, triangle edge length.' },
            { name: 'background / textColor', type: 'string', description: 'Pill fill and text color, overriding the state palette.' },
          ]}
        />
      </Section>
    </>
  );
}
