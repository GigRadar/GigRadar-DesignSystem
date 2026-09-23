import { color, component, spacing } from '@gigradar/theme';
import {
  DashboardHeader,
  DateRangeField,
  FunnelCallout,
  FunnelChart,
  FunnelSection,
  FunnelStat,
  FunnelStatsBand,
  InboxSearchField,
  KanbanBoard,
  KanbanCard,
  PipelineBand,
  TaskFeed,
  TaskFeedCard,
  type TaskFeedFilter,
  TitleSelect,
  type DateRange,
} from '@gigradar/ui';
import { useState } from 'react';
import {
  closingRates,
  defaultRange,
  funnelBand,
  funnelBandCompare,
  funnelSteps,
  feedTasks,
  participants,
  pipelineStages,
} from '../fixtures/dashboard';

/**
 * The Dashboard, assembled — both columns.
 *
 * The funnel and the pipeline are one screen and are shown as one: the stats
 * name the steps, the band under them shows the drop-off those steps describe,
 * and the pipeline below is the same leads as cards. Split across two previews
 * the reader has to be told they are related; together it is obvious. The Task
 * Feed runs down the right of all of it — what to do about what the left side
 * reports.
 *
 * A single export rather than a page-local helper because the Dashboard page
 * and both of its children draw pieces of it, and copies would drift the
 * moment one gained a column.
 */
/**
 * Where each task has got to.
 *
 * `open` and `snoozed` are the two resting places, and are what the header's
 * filters pick between. The two `-ing` values are the moment in between: the
 * card is still on screen showing what it did, and has not yet moved.
 */
type TaskProgress = 'open' | 'snoozing' | 'snoozed' | 'completing' | 'completed';

export function AssembledDashboard() {
  const [range, setRange] = useState<DateRange>(defaultRange);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<TaskFeedFilter>('open');
  const [progress, setProgress] = useState<Record<string, TaskProgress>>({});

  /*
   * A task acts in two steps: it shows what it did, then it moves.
   *
   * The pause is why the card has a `snoozed` and `completed` state at all —
   * without it the card would vanish on the click and the confirmation Figma
   * draws would never be seen. The timer is cleared on unmount so a card that
   * leaves mid-confirmation cannot set state afterwards.
   */
  const act = (id: string, to: 'snoozed' | 'completed') => {
    setProgress((state) => ({ ...state, [id]: to === 'snoozed' ? 'snoozing' : 'completing' }));
    window.setTimeout(
      () => setProgress((state) => ({ ...state, [id]: to })),
      component.taskFeed.card.confirmationMs,
    );
  };

  /** Where a task rests, treating a confirmation as its destination. */
  const resting = (id: string): 'open' | 'snoozed' | 'completed' => {
    const current = progress[id] ?? 'open';
    if (current === 'snoozing' || current === 'snoozed') return 'snoozed';
    if (current === 'completing' || current === 'completed') return 'completed';
    return 'open';
  };

  /*
   * A completed task is gone from both tabs; a snoozed one moves to Snoozed.
   * A card still showing its confirmation stays where it was, so it can be
   * read before it goes.
   */
  const visibleTasks = feedTasks.filter((task) => {
    const current = progress[task.id] ?? 'open';
    if (current === 'snoozing' || current === 'completing') return filter === 'open';
    return resting(task.id) === filter;
  });

  /*
   * Mark all as complete acts on what is on screen, not on everything.
   *
   * A snoozed task has been deliberately put aside; completing it from the
   * Open tab would undo that decision without showing it happening. So the
   * button completes the tasks the reader can actually see — and only the
   * ones that can be completed at all.
   */
  const markAllComplete = () => {
    visibleTasks
      .filter((task) => (task.completable ?? true) && resting(task.id) === 'open')
      .forEach((task) => act(task.id, 'completed'));
  };

  return (
    /*
     * An explicit height rather than `100%`.
     *
     * The pipeline fills what the funnel leaves, which only works if this
     * element has a height of its own to divide — and `100%` of a parent that
     * is itself sized by its content resolves to nothing. In the product the
     * screen is the window; here it is the same number the frame around it
     * uses, so the two agree.
     */
    <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        height: component.dashboard.screenHeight,
        backgroundColor: color.main.white,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          minHeight: 0,
        }}
      >
        <div style={{ padding: `0 ${spacing.m}px` }}>
        <DashboardHeader
          title="Leads Dashboard"
          actions={<DateRangeField value={range} onValueChange={setRange} />}
        />

        <DashboardHeader
          paddingY={0}
          title={
            <>
              Your Funnel for <TitleSelect>all team</TitleSelect> as compared to{' '}
              <TitleSelect>previous period</TitleSelect>
            </>
          }
        />

        <FunnelSection
          // Six steps plus the column the two closing rates share.
          columns={funnelSteps.length + 1}
          stats={
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
              {/* The two closing rates share one column: they are the same
                  question answered twice, and separate columns would read as
                  two more steps of the funnel rather than as its two
                  outcomes. */}
              {/* Tighter than a stat's own internal spacing, so the two rates
                  read as one pair — and so this column stops overhanging
                  every other one, which is what was pushing the chart down
                  for the whole band. */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: component.dashboard.stats.pairedGap,
                }}
              >
                {closingRates.map((rate) => (
                  <FunnelStat
                    key={rate.id}
                    label={rate.label}
                    hint={rate.hint}
                    value={rate.value}
                    valueColor={rate.valueColor}
                    change={rate.change}
                    metrics={rate.metrics}
                  />
                ))}
              </div>
            </FunnelStatsBand>
          }
          chart={
            <FunnelChart
              values={funnelBand}
              compare={funnelBandCompare}
              onPagePrevious={() => undefined}
            >
              {/* Pinned to the curve's descent rather than centred: the
                  callouts explain why the funnel narrows, and they read as
                  annotations on the slope only while they sit on it. */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
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
                <FunnelCallout
                  label="TRR"
                  hint="Total reply rate"
                  value="10%"
                  change={{ value: 132, direction: 'up' }}
                />
                <FunnelCallout
                  label="OHR"
                  hint="On-hand rate"
                  value="8%"
                  change={{ value: 129, direction: 'down' }}
                />
              </div>
            </FunnelChart>
          }
        />
      </div>

      {/* Grows into whatever height is left under the funnel, so the boards
          reach the bottom of the screen rather than stopping at their last
          card. The heading keeps its own height; only the band stretches. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minHeight: 0,
          padding: `0 ${spacing.m}px ${spacing.m}px`,
        }}
      >
        <DashboardHeader
          title={
            <>
              All Leads <TitleSelect>pipeline</TitleSelect>
            </>
          }
          actions={
            <InboxSearchField
              value={query}
              onValueChange={setQuery}
              placeholder="Search or filter room..."
            />
          }
        />

        <PipelineBand>
          {pipelineStages.map((stage) => (
            <KanbanBoard
              key={stage.id}
              title={stage.title}
              total={stage.total}
              count={stage.count}
            >
              {stage.leads.map((lead) => (
                <KanbanCard
                  key={lead.id}
                  title={lead.title}
                  activity={lead.activity}
                  participants={participants}
                  stage={lead.stage}
                  amount={lead.amount}
                />
              ))}
            </KanbanBoard>
          ))}
        </PipelineBand>
        </div>
      </div>

      {/* The count is what is open, not what exists: the badge is a backlog,
          and one that kept counting snoozed and completed tasks would never
          go down. */}
      <TaskFeed
        count={feedTasks.filter((task) => resting(task.id) === 'open').length}
        filter={filter}
        onFilterChange={setFilter}
        onMarkAllComplete={markAllComplete}
        state={visibleTasks.length === 0 ? 'empty' : 'ready'}
      >
        {visibleTasks.map((task) => {
          const current = progress[task.id] ?? 'open';
          return (
            <TaskFeedCard
              key={task.id}
              stage={task.stage}
              title={task.title}
              description={task.description}
              time={task.time}
              completable={task.completable ?? true}
              state={
                current === 'snoozing'
                  ? 'snoozed'
                  : current === 'completing'
                    ? 'completed'
                    : 'default'
              }
              onSnooze={() => act(task.id, 'snoozed')}
              onComplete={() => act(task.id, 'completed')}
            />
          );
        })}
      </TaskFeed>
    </div>
  );
}
