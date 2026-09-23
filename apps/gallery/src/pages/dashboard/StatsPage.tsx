import { component } from '@gigradar/theme';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { AssembledDashboard } from '../../demos/dashboardScreen';
import { Caption } from './DashboardPage';

/**
 * Dashboard ▸ Stats (Left) — the screen's left column.
 *
 * The funnel and the pipeline are one column rather than two sections of the
 * screen: they scroll together, they are scoped by the same date range, and
 * they describe the same leads. What separates them from the Task Feed on the
 * right is not subject matter but tense — the left side is what has happened,
 * the right is what to do next.
 */
export function StatsPage() {
  return (
    <>
      <PageHeader
        title="Stats (Left)"
        description="The dashboard's left column — the funnel above, the lead pipeline below, both scoped by one date range. Figma node 485:11568."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Stats ▸ Funnel Graphs', pageId: 'crm-dashboard-funnel' },
          { label: 'Stats ▸ Kanban Pipeline', pageId: 'crm-dashboard-pipeline' },
          { label: 'Components ▸ Main ▸ Date picker', pageId: 'date-picker' },
        ]}
      >
        The two halves are documented beneath this page. The date range in the top right is the
        Inbox's <strong>DatePicker</strong> behind a field that shows both ends — the same
        calendar, not a second one drawn for this screen.
      </CrossLink>

      <Section
        title="The column"
        description="The funnel and the pipeline from one set of fixtures, at the width the product draws them."
      >
        <Caption>
          The two halves answer different questions about the same leads: the funnel is where they
          drop off, the pipeline is where each one is now. Pick a date range to see what the whole
          column is scoped by.
        </Caption>
        {/* A real height rather than `auto`: the pipeline fills what is left
            under the funnel, and a frame sized by its content has nothing for
            it to fill. */}
        <Frame height={component.dashboard.screenHeight} wide>
          <AssembledDashboard />
        </Frame>
      </Section>
    </>
  );
}
