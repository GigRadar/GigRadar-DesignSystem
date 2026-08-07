import { color, textStyle } from '@gigradar/theme';
import {
  CounterBadge,
  CreditBadge,
  EyebrowBadge,
  HStack,
  RankBadge,
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
        description="Four badges, each a different job rather than a variant of one component — a credit amount, an AI eyebrow, an unread count, and a rank with its direction of travel. Every one comes in three sizes."
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
