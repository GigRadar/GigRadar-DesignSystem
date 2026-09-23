import { color, spacing } from '@gigradar/theme';
import {
  StageIcon,
  TaskFeed,
  TaskFeedButton,
  TaskFeedCard,
  type TaskStage,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { feedTasks } from '../../fixtures/dashboard';
import { Caption } from './DashboardPage';

const STAGES: { stage: TaskStage; label: string }[] = [
  { stage: 'new', label: 'New' },
  { stage: 'interested', label: 'Interested' },
  { stage: 'notInterested', label: 'Not Interested' },
  { stage: 'objection', label: 'Objection' },
  { stage: 'closed', label: 'Closed Deals' },
  { stage: 'mentioned', label: 'Mentioned' },
  { stage: 'fallback', label: 'Fallback' },
];

const objection = feedTasks.find((task) => task.id === 'objection')!;

/**
 * Dashboard ▸ Task Feed (Right) — Figma node 473:6454, with the card at
 * 733:4475, its buttons at 476:4785, and the stage marker at 431:11969.
 *
 * Filed as one page rather than four, the same nesting as the Kanban pipeline:
 * a button only exists on a card, a card only inside the rail, and the stage
 * marker means nothing on its own.
 */
export function TaskFeedPage() {
  const [filter, setFilter] = useState<'open' | 'snoozed'>('open');

  return (
    <>
      <PageHeader
        title="Task Feed (Right)"
        description="The dashboard's right column — the tasks a closed deal, an objection, or a new message leaves behind. Figma node 473:6454."
      />

      <CrossLink
        eyebrow="Part of"
        links={[
          { label: 'CRM ▸ Dashboard', pageId: 'crm-dashboard' },
          { label: 'Dashboard ▸ Stats (Left)', pageId: 'crm-dashboard-stats' },
        ]}
      >
        The column beside <strong>Stats (Left)</strong>. Where the left side is what has happened,
        this is what to do about it.
      </CrossLink>

      <Section
        title="The rail"
        description="Fixed at 328px rather than sharing the dashboard's width: the feed accompanies the numbers, and a column that grew with the window would take width from the funnel it sits beside."
      >
        <Caption>
          Cards come in as children rather than as a `tasks` array. What a task is differs per
          stage — some can be completed, some only snoozed — and a prop would have to describe
          every one of those shapes before the column could draw one.
        </Caption>
        <Frame height={760} hug>
          <TaskFeed
            count={feedTasks.length}
            filter={filter}
            onFilterChange={setFilter}
          >
            {feedTasks.map((task) => (
              <TaskFeedCard
                key={task.id}
                stage={task.stage}
                title={task.title}
                description={task.description}
                time={task.time}
                completable={task.completable ?? true}
              />
            ))}
          </TaskFeed>
        </Frame>
        <CodeBlock
          code={`<TaskFeed count={7} filter={filter} onFilterChange={setFilter}>
  {tasks.map((task) => (
    <TaskFeedCard key={task.id} {...task} />
  ))}
</TaskFeed>`}
        />
      </Section>

      <Section
        title="The column's states"
        description="Four. Loading greys the title and the filters too — on a cold start there is no open-task count to put in them yet."
      >
        <Caption>
          Empty and coming soon draw a glyph on a tinted disc rather than a spot illustration. The
          rail is narrow and both moments are ordinary — a caught-up feed is the good outcome —
          so an illustration gives them more ceremony than they earn.
        </Caption>
        <Frame height={560} wide>
          <div style={{ display: 'flex', height: '100%', backgroundColor: color.main.white }}>
            <TaskFeed state="loading" />
            <TaskFeed state="empty" />
            <TaskFeed state="comingSoon" />
          </div>
        </Frame>
        <CodeBlock code={`<TaskFeed state="empty" />`} />
      </Section>

      <Section
        title="The end of the run"
        description="A rule under the last card, not a panel replacing it — the list still has cards in it, which is why this is separate from the empty state."
      >
        <Caption>
          A rule either side of the words rather than a heading: it marks the end of the run, and a
          heading would read as the start of another section.
        </Caption>
        <Frame height={480} hug>
          <TaskFeed count={2} atEnd>
            {feedTasks.slice(0, 2).map((task) => (
              <TaskFeedCard
                key={task.id}
                stage={task.stage}
                title={task.title}
                description={task.description}
                time={task.time}
                completable={task.completable ?? true}
              />
            ))}
          </TaskFeed>
        </Frame>
        <CodeBlock code={`<TaskFeed count={2} atEnd>{cards}</TaskFeed>`} />
      </Section>

      <Section
        title="One card"
        description="The stage it came from, what happened, how long ago, and what to do about it — then the two actions, along the foot."
      >
        <Caption>
          The description is held at a fixed two lines. The cards sit in a scrolling column, and a
          card that grew by a line for a longer sentence would make the column jump as tasks
          arrive and complete.
        </Caption>
        <Frame height="auto" hug>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
              padding: spacing.m,
              backgroundColor: color.main.white,
            }}
          >
            {feedTasks.slice(0, 3).map((task) => (
              <TaskFeedCard
                key={task.id}
                stage={task.stage}
                title={task.title}
                description={task.description}
                time={task.time}
                completable={task.completable ?? true}
              />
            ))}
          </div>
        </Frame>
        <CodeBlock
          code={`<TaskFeedCard
  stage="objection"
  title="Objection from James"
  description="James raised concerns about the budget…"
  time="10m ago"
/>`}
        />
      </Section>

      <Section
        title="The card's states"
        description="Four. Hover is pointer state rather than a prop, so it is not drawn here — move the pointer over a card above to see it."
      >
        <Caption>
          Snoozed and completed cover the card rather than replacing its content. The card is on
          its way out of the column, and swapping what is inside it would change its height on the
          way, shifting every card below while the confirmation is still being read.
        </Caption>
        <Frame height="auto" hug>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
              padding: spacing.m,
              backgroundColor: color.main.white,
            }}
          >
            {(['default', 'unread', 'snoozed', 'completed'] as const).map((state) => (
              <TaskFeedCard
                key={state}
                state={state}
                stage={objection.stage}
                title={objection.title}
                description={objection.description}
                time={objection.time}
              />
            ))}
          </div>
        </Frame>
        <CodeBlock code={`<TaskFeedCard state="snoozed" title="Objection from James" />`} />
      </Section>

      <Section
        title="The stage marker"
        description="Seven stages. The disc is the stage's color at a fifth strength and the glyph is the same color at full, so the two read as one mark rather than an icon dropped on a swatch."
      >
        <Caption>
          Closed Deals and Mentioned set <strong>$</strong> and <strong>@</strong> as text: those
          characters are already the symbols for a deal's value and for being named in a thread,
          and an icon of either would be a picture of a letterform. Fallback is the one stage on
          white — it stands for a task with no stage, and a tint would invent one.
        </Caption>
        <Frame height="auto" hug>
          <div
            style={{
              display: 'flex',
              gap: spacing.m,
              padding: spacing.m,
              backgroundColor: color.main.white,
            }}
          >
            {STAGES.map(({ stage, label }) => (
              <div
                key={stage}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: spacing.xxs,
                }}
              >
                <StageIcon stage={stage} />
                <span style={{ fontSize: 11, color: color.main.description }}>{label}</span>
              </div>
            ))}
          </div>
        </Frame>
        <CodeBlock code={`<StageIcon stage="objection" />`} />
      </Section>

      <Section
        title="The card's buttons"
        description="Not the design system's Button. That one is sized to be the thing you came to the screen to press; these two sit at the foot of every card in a scrolling column."
      >
        <Caption>
          Quiet by default, darkening only under the pointer. A rail of ordinary buttons would read
          as a rail of calls to action.
        </Caption>
        <Frame height="auto" hug>
          <div
            style={{
              display: 'flex',
              gap: spacing.xxs,
              width: 304,
              padding: spacing.m,
              backgroundColor: color.main.white,
            }}
          >
            <TaskFeedButton>Mark as Complete</TaskFeedButton>
            <TaskFeedButton>Snooze</TaskFeedButton>
          </div>
        </Frame>
        <CodeBlock code={`<TaskFeedButton onClick={onSnooze}>Snooze</TaskFeedButton>`} />
      </Section>
    </>
  );
}
