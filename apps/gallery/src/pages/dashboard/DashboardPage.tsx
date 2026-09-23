import { color, component, spacing, textStyle } from '@gigradar/theme';
import type { ReactNode } from 'react';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { AssembledDashboard } from '../../demos/dashboardScreen';

/** A caption under a demo, matching the other gallery pages. */
export function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/**
 * CRM ▸ Dashboard.
 *
 * The numbers screen, as it is assembled. Figma node 447:3878.
 *
 * Both columns ship: the funnel and the pipeline down the left, the Task Feed
 * down the right. Each is documented on its own page beneath this one, which
 * is for how they sit together.
 */
export function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="The CRM's numbers screen — the funnel above, the lead pipeline below. Figma node 447:3878."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Dashboard ▸ Stats (Left)', pageId: 'crm-dashboard-stats' },
          { label: 'Dashboard ▸ Task Feed (Right)', pageId: 'crm-dashboard-tasks' },
          { label: 'Components ▸ Main ▸ Date picker', pageId: 'date-picker' },
        ]}
      >
        The screen is two columns, each documented beneath this page.{' '}
        <strong>Stats (Left)</strong> is the funnel and the pipeline;{' '}
        <strong>Task Feed (Right)</strong> is the tasks they leave behind.
      </CrossLink>

      <Section
        title="The screen"
        description="Both columns, as the product draws them."
      >
        <Caption>
          The left column is what has happened: where leads drop off, and where each one is now.
          The right is what to do about it. Pick a date range to see what the whole screen is
          scoped by.
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
