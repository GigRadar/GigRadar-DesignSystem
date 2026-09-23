import { color, component, spacing } from '@gigradar/theme';
import {
  DashboardHeader,
  InboxSearchField,
  KanbanBoard,
  KanbanCard,
  PipelineBand,
  TitleSelect,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { participants, pipelineStages } from '../../fixtures/dashboard';
import { Caption } from './DashboardPage';

const qualify = pipelineStages.find((stage) => stage.id === 'qualify')!;
const lead = qualify.leads[0]!;

/**
 * Dashboard ▸ Kanban Pipeline — Figma nodes 1675:10587 (the band),
 * 2010:2069 (a board), and 1994:5317 (a card).
 *
 * Filed as one page rather than three because the three are one nesting: a
 * card only exists inside a board and a board only means something inside the
 * band, the same reason the Inbox's SubNavs document what they open.
 */
export function KanbanPipelinePage() {
  const [query, setQuery] = useState('');

  return (
    <>
      <PageHeader
        title="Kanban Pipeline"
        description="Every lead as a card, in the stage it is in. Figma nodes 1675:10587, 2010:2069, and 1994:5317."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Components ▸ Main ▸ Avatar', pageId: 'avatar' },
          { label: 'Components ▸ CRM ▸ Inbox parts', pageId: 'inbox-parts' },
          { label: 'Dashboard ▸ Stats (Left)', pageId: 'crm-dashboard-stats' },
        ]}
      >
        A card reuses the room list's <strong>StagePill</strong> and the generic{' '}
        <strong>Avatar</strong>, at a smaller step: six columns sit side by side here, and at the
        Inbox's sizes a board would hold two cards before scrolling.
      </CrossLink>

      <Section
        title="The band"
        description="One board per stage, ordered left to right, scrolling sideways. A stage that wrapped to a second line could not be dragged to in one gesture — which is how a lead moves along the pipeline."
      >
        <Caption>
          The boards are even widths and uneven heights: how many leads a stage holds is the thing
          worth seeing at a glance, and equal heights would hide it.
        </Caption>
        <Frame height="auto" wide>
          <div style={{ padding: spacing.m, backgroundColor: color.main.white }}>
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
                <KanbanBoard key={stage.id} title={stage.title} total={stage.total} count={stage.count}>
                  {stage.leads.map((item) => (
                    <KanbanCard
                      key={item.id}
                      title={item.title}
                      activity={item.activity}
                      participants={participants}
                      stage={item.stage}
                      amount={item.amount}
                    />
                  ))}
                </KanbanBoard>
              ))}
            </PipelineBand>
          </div>
        </Frame>
      </Section>

      <Section
        title="One board"
        description="A stage's name, what it is worth, and how many leads are in it. The summary is 9px — below every step on the type scale, like the prompt field's counter: it is a running total glanced at while scanning the cards, not a line to read."
      >
        <Frame height="auto" hug>
          <div style={{ display: 'flex', gap: spacing.xs, padding: spacing.m, alignItems: 'flex-start' }}>
            <KanbanBoard
              title={qualify.title}
              total={qualify.total}
              count={qualify.count}
              width={component.dashboard.board.minWidth}
            >
              {qualify.leads.map((item) => (
                <KanbanCard
                  key={item.id}
                  title={item.title}
                  activity={item.activity}
                  participants={participants}
                  stage={item.stage}
                  amount={item.amount}
                />
              ))}
            </KanbanBoard>
            <KanbanBoard
              title="Qualify"
              total="$0"
              count="0 Deals"
              state="empty"
              width={component.dashboard.board.minWidth}
            />
          </div>
        </Frame>
        <CodeBlock
          code={`<KanbanBoard title="Qualify" total="$1500" count="3 Deals">
  {leads.map((lead) => <KanbanCard key={lead.id} {...lead} />)}
</KanbanBoard>`}
        />
      </Section>

      <Section
        title="The board's states"
        description="Four, and only two of them speak. An empty stage is ordinary — most pipelines have one — so it draws nothing; six columns each explaining their emptiness would bury the columns that have leads in them."
      >
        <Caption>
          Error and not found are different failures and say so: one is the board's data missing,
          the other is the search excluding everything in a stage that is not otherwise empty.
        </Caption>
        <Frame height="auto" hug>
          <div style={{ display: 'flex', gap: spacing.xs, padding: spacing.m, alignItems: 'flex-start' }}>
            {(['empty', 'error', 'notFound'] as const).map((state) => (
              <KanbanBoard
                key={state}
                title="Qualify"
                total={state === 'error' ? '$-' : state === 'empty' ? '$0' : '$500'}
                count={state === 'error' ? '- Deals' : state === 'empty' ? '0 Deals' : '1 Deals'}
                state={state}
                width={component.dashboard.board.minWidth}
              />
            ))}
          </div>
        </Frame>
        <CodeBlock code={`<KanbanBoard title="Qualify" state="error" />`} />
      </Section>

      <Section
        title="One card"
        description="What the lead is, what last happened on it, who is on the conversation, its stage, and what it is worth — in that order, because that is the order the question is asked in."
      >
        <Caption>
          The title clamps to two lines and everything else to one. A card that grew with its
          content would make a column's height a function of its longest job title.
        </Caption>
        <Frame height="auto" hug>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
              width: component.dashboard.board.minWidth,
              padding: spacing.m,
              backgroundColor: color.main.backgroundAlt,
            }}
          >
            <KanbanCard
              title={lead.title}
              activity={lead.activity}
              participants={participants}
              stage={lead.stage}
              amount={lead.amount}
            />
            <KanbanCard
              title="Mobile and Website UI & UX Designer, familiar with webflow - Hiring Now"
              activity="Chat created 1 day ago"
              participants={participants}
              stage={{ label: 'Contact Later', tone: color.stageFlat.contactLater }}
              amount="$500"
            />
            <KanbanCard
              title="React Front-End Developer"
              activity="Invitation received 3 days ago"
              participants={participants.slice(0, 1)}
              stage={{ label: 'Converted', tone: color.stageFlat.converted }}
              amount="$500"
              dragging
            />
          </div>
        </Frame>
        <CodeBlock
          code={`<KanbanCard
  title="Landing Page UI Specialist"
  activity="Proposal viewed 6 days ago"
  participants={participants}
  stage={{ label: 'Qualified', tone: color.stageFlat.qualified }}
  amount="$500"
/>`}
        />
      </Section>
    </>
  );
}
