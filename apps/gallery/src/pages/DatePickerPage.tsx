import { color, spacing, textStyle } from '@gigradar/theme';
import { DatePicker, type DateRange } from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Frame } from '../components/Frame';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Section } from '../layout';
import { CrossLink } from '../navigation';

function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/** A fixed month, so the page looks the same on every render. */
const MAY_2025 = new Date(2025, 4, 1);

/**
 * Components ▸ Main ▸ Date picker.
 *
 * The generic tier: a calendar knows nothing about conversations. It is filed
 * here even though the inbox's date filter is what prompted it.
 */
export function DatePickerPage() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2025, 4, 6),
    end: new Date(2025, 4, 20),
  });

  return (
    <>
      <PageHeader
        title="Date picker"
        description="Two months side by side, selecting a range. Figma node 351:11760."
      />

      <CrossLink
        eyebrow="Used by"
        links={[{ label: 'Left ▸ Searchbar', pageId: 'crm-inbox-searchbar' }]}
      >
        The inbox's date filter opens this calendar under its presets. A preset and a custom range
        are two ways of saying the same thing, so picking one clears the other.
      </CrossLink>

      <Section
        title="Picking a range"
        description="Figma's four variants — Default, Hover, “Date Started Selected”, “Date End Selected” — are the halves of one interaction, not four separate states. The first click sets the start, the second sets the end, and a third starts over. That state machine lives in the component so every range filter behaves the same way."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <DatePicker value={range} onValueChange={setRange} defaultMonth={MAY_2025} />
          </div>
        </Frame>
        <Caption>
          Click a day, then another. Moving between the two clicks draws the band as it will be —
          without it, picking a range gives no feedback until it is already picked. Picking an
          earlier day second swaps the ends rather than rejecting the click.
        </Caption>
        <CodeBlock code={`<DatePicker value={range} onValueChange={setRange} />`} />
      </Section>

      <Section
        title="One month"
        description="Two months is the default because the ranges people pick — “last week”, “since the 28th” — routinely straddle a month boundary, and paging back and forth to pick two ends is where a one-month calendar becomes tedious. Narrow surfaces that cannot fit both pass `months={1}`."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <DatePicker months={1} defaultMonth={MAY_2025} />
          </div>
        </Frame>
        <Caption>The same calendar in one panel — what the inbox's filter row uses.</Caption>
        <CodeBlock code={`<DatePicker months={1} />`} />
      </Section>

      <Section
        title="Bounds"
        description="`minDate` and `maxDate` gray out what cannot be picked rather than hiding it, so the shape of the month stays readable."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <DatePicker
              months={1}
              defaultMonth={MAY_2025}
              minDate={new Date(2025, 4, 5)}
              maxDate={new Date(2025, 4, 23)}
            />
          </div>
        </Frame>
        <Caption>Only the 5th through the 23rd can be picked.</Caption>
        <CodeBlock code={`<DatePicker minDate={start} maxDate={end} />`} />
      </Section>

      <PropsTable
        rows={[
          { name: 'value', type: 'DateRange', description: 'The selected range. Controlled.' },
          { name: 'defaultValue', type: 'DateRange', description: 'The starting range when uncontrolled.' },
          {
            name: 'onValueChange',
            type: '(range: DateRange) => void',
            description:
              'Called as each end is picked — once with only `start`, then again with both.',
          },
          { name: 'month', type: 'Date', description: "The left panel's month. Controlled." },
          { name: 'defaultMonth', type: 'Date', description: "The left panel's month on first render." },
          { name: 'months', type: '1 | 2', default: '2', description: 'How many months to draw.' },
          { name: 'minDate', type: 'Date', description: 'Days before this cannot be picked.' },
          { name: 'maxDate', type: 'Date', description: 'Days after this cannot be picked.' },
          {
            name: 'weekStartsOn',
            type: '0 | 1',
            default: '0',
            description: 'First day of the week, 0 = Sunday.',
          },
        ]}
      />
    </>
  );
}
