import { color, component, spacing } from '@gigradar/theme';
import {
  DashboardHeader,
  DateRangeField,
  FunnelCallout,
  FunnelChart,
  FunnelSection,
  FunnelStat,
  FunnelStatsBand,
  Icon,
  IconDashboardFill,
  TitleSelect,
  type DateRange,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { closingRates, defaultRange, funnelBand, funnelBandCompare, funnelSteps } from '../../fixtures/dashboard';
import { Caption } from './DashboardPage';

/**
 * Dashboard ▸ Funnel Graphs — Figma nodes 485:11568 (the section) and
 * 751:7118 (one stat).
 *
 * The stats band, the chart behind it, and the callouts floating over it. The
 * three are one page because none of them is reachable without the others: a
 * callout has nowhere to float and the band's shape means nothing without the
 * steps named above it.
 */
export function FunnelGraphsPage() {
  const [range, setRange] = useState<DateRange>(defaultRange);

  return (
    <>
      <PageHeader
        title="Funnel Graphs"
        description="The funnel's steps, the band that shows their drop-off, and the diagnostics floating over it. Figma nodes 485:11568 and 751:7118."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Components ▸ Main ▸ Badge', pageId: 'badge' },
          { label: 'Components ▸ Main ▸ Date picker', pageId: 'date-picker' },
          { label: 'Dashboard ▸ Stats (Left)', pageId: 'crm-dashboard-stats' },
        ]}
      >
        A stat's change badge is <strong>RankBadge</strong> off the generic tier, in the same three
        states it draws anywhere else. The chart and the callouts have no Figma component behind
        them — they are drawn here, for the reason given under <strong>The chart</strong>.
      </CrossLink>

      <Section
        title="The band"
        description="One column per step, divided rather than spaced: the funnel is a sequence, and dividers say the columns are readings of one thing while gaps would say they are six separate cards."
      >
        <Caption>
          The band is a grid that fits as many columns as the width allows and wraps the rest, so
          every step stays on screen. Narrow the window to see it drop to fewer columns — a funnel
          read by scrolling is one whose last step is invisible until you look for it.
        </Caption>
        <Frame height="auto" wide>
          <div style={{ padding: spacing.m, backgroundColor: color.main.white }}>
            <FunnelStatsBand>
              {funnelSteps.map((step) => (
                <FunnelStat
                  key={step.id}
                  label={step.label}
                  hint={step.hint}
                  value={step.value}
                  change={step.change}
                  metrics={step.metrics}
                />
              ))}
            </FunnelStatsBand>
          </div>
        </Frame>
        <CodeBlock
          code={`<FunnelStatsBand>
  <FunnelStat
    label="Qualified Reply Rate"
    value="30%"
    change={{ value: 240, direction: 'down' }}
    metrics={[{ label: 'Total Qualify Reply', value: '189' }]}
  />
</FunnelStatsBand>`}
        />
      </Section>

      <Section
        title="One step"
        description="A rate, its movement against the comparison period, and the counts it is derived from. The sub-metrics are a list rather than two named props: what they count changes per step, and naming them would bake one step's vocabulary into every other."
      >
        <Caption>
          The closing rates carry their outcome's color while the middle of the funnel stays black —
          a won rate is good news and a lost rate is not, and the steps between are neither.
        </Caption>
        <Frame height="auto" hug>
          <div style={{ padding: spacing.m, backgroundColor: color.main.white }}>
            <FunnelStatsBand>
              <FunnelStat {...funnelSteps[1]!} />
              {closingRates.map((rate) => (
                <FunnelStat key={rate.id} {...rate} />
              ))}
            </FunnelStatsBand>
          </div>
        </Frame>
      </Section>

      <Section
        title="No comparison, and loading"
        description="A rate with nothing to compare against draws the badge's `none` state — a dash — rather than no badge at all, which would read as a rate that has not moved."
      >
        <Frame height="auto" hug>
          <div style={{ padding: spacing.m, backgroundColor: color.main.white }}>
            <FunnelStatsBand>
            <FunnelStat
              label="Closed Won Rate"
              hint="Qualified leads that became customers."
              value="10%"
              valueColor={color.status.success.main}
              change={{ value: '-', direction: 'none' }}
              metrics={[{ label: 'Total Closed Deals', value: '45' }]}
            />
            <FunnelStat loading label="Loading" value="" metrics={[{ label: '', value: '' }]} />
            </FunnelStatsBand>
          </div>
        </Frame>
        <CodeBlock code={`<FunnelStat loading label="Qualified Reply Rate" value="" />`} />
      </Section>

      <Section
        title="The chart"
        description="Drawn as a shape rather than charted. Every number on this screen is already written out in the stats above it, so the band's job is the drop-off's shape — and axes, gridlines or ticks would promise a precision it does not have."
      >
        <Caption>
          The paler band behind is the comparison period: the same measure at two times, which is
          why it is the same shape at a lower opacity rather than a second color.
        </Caption>
        <Frame height="auto" wide>
          <div style={{ backgroundColor: color.main.white }}>
            <FunnelChart values={funnelBand} compare={funnelBandCompare} onPagePrevious={() => undefined}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignSelf: 'flex-end',
                  gap: spacing.xxs,
                  marginLeft: component.dashboard.chart.calloutOffsetX,
                  marginBottom: spacing.m,
                }}
              >
                <FunnelCallout
                  label="FRT"
                  hint="First response time"
                  value="2 hours"
                  description="Slow first response times?"
                  action="Boost with GigRadar CRM →"
                  onActionClick={() => undefined}
                />
                <FunnelCallout label="TRR" hint="Total reply rate" value="10%" change={{ value: 132, direction: 'up' }} />
                <FunnelCallout label="OHR" hint="On-hand rate" value="8%" change={{ value: 129, direction: 'down' }} />
              </div>
            </FunnelChart>
          </div>
        </Frame>
        <CodeBlock code={`<FunnelChart values={[0.92, 0.78, 0.6, 0.48]} compare={previous} />`} />
      </Section>

      <Section
        title="The rules"
        description="The column dividers belong to the section rather than to a stat, and run the full height of the numbers and the chart together. Stopping at the foot of the figures would cut the section in two and leave the chart looking like a separate panel beneath it; running down, the rules frame it — the chart reads as floating under the columns."
      >
        <Caption>
          `FunnelSection` draws them as their own layer on the same grid the stats use, so a rule
          lands on every column edge however many columns the width allows.
        </Caption>
        <Frame height="auto" wide>
          <div style={{ backgroundColor: color.main.white }}>
            <FunnelSection
              columns={funnelSteps.length}
              stats={
                <div style={{ padding: `0 ${spacing.m}px` }}>
                  <FunnelStatsBand>
                    {funnelSteps.map((step) => (
                      <FunnelStat
                        key={step.id}
                        label={step.label}
                        hint={step.hint}
                        value={step.value}
                        change={step.change}
                        metrics={step.metrics}
                      />
                    ))}
                  </FunnelStatsBand>
                </div>
              }
              chart={<FunnelChart values={funnelBand} compare={funnelBandCompare} />}
            />
          </div>
        </Frame>
        <CodeBlock
          code={`<FunnelSection
  stats={<FunnelStatsBand>{steps}</FunnelStatsBand>}
  chart={<FunnelChart values={band} />}
/>`}
        />
      </Section>

      <Section
        title="When there is nothing to draw"
        description="The chart's empty slot takes whatever the screen wants to say. Figma writes the failure as the chart's own state rather than blanking the area, so the space the band occupied still reads as the band."
      >
        <Frame height="auto" wide>
          <div style={{ backgroundColor: color.main.white }}>
            <FunnelChart
              values={[]}
              empty={
                <>
                  <Icon icon={IconDashboardFill} size={40} color={color.main.brand} />
                  <span style={{ color: color.main.black }}>Funnel Chart Unavailable</span>
                  <span style={{ color: color.main.description, maxWidth: 420 }}>
                    We couldn't display the funnel chart data right now. It may be empty, or failed
                    to load — please try again later.
                  </span>
                </>
              }
            />
          </div>
        </Frame>
      </Section>

      <Section
        title="The date range"
        description="The period everything on the screen is scoped by. Both ends sit in one box with an arrow between them: a range is one value, and two fields invite picking an end without the other."
      >
        <Caption>
          The calendar it opens is the Inbox's <strong>DatePicker</strong>, unchanged. It shuts once
          both ends are set — closing on the first pick would make a range impossible to finish.
        </Caption>
        <Frame height="auto" hug>
          {/* Tall enough for the calendar it opens: a hugging frame would clip
              the popover, and clipping the thing the section is about is worse
              than the empty strip under a shut field. */}
          <div style={{ padding: spacing.m, paddingBottom: 380 }}>
            <DateRangeField value={range} onValueChange={setRange} />
          </div>
        </Frame>
        <CodeBlock code={`<DateRangeField value={range} onValueChange={setRange} />`} />
      </Section>

      <Section
        title="The heading"
        description="A sentence with its choices inside it — 'Your Funnel for all team as compared to previous period' — rather than a title with two dropdowns beside it. Written as a sentence, the heading says what the numbers below it mean."
      >
        <Frame height="auto" wide>
          <div style={{ padding: `0 ${spacing.m}px`, backgroundColor: color.main.white }}>
            <DashboardHeader
              title={
                <>
                  Your Funnel for <TitleSelect>all team</TitleSelect> as compared to{' '}
                  <TitleSelect>previous period</TitleSelect>
                </>
              }
              actions={<DateRangeField defaultValue={defaultRange} />}
            />
          </div>
        </Frame>
      </Section>
    </>
  );
}
