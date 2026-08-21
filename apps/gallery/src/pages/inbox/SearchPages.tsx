import { spacing } from '@gigradar/theme';
import {
  AdvancedSearch,
  FilterChip,
  IconCalendarFill,
  IconClientIdPeopleStroke,
  IconStageTripleLine,
  InboxSearchField,
  type InboxFilters,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { clients, stages } from '../../fixtures/inbox';
import { Caption, Column } from './parts';

/** No filters applied — the panel's resting state. */
const NO_FILTERS: InboxFilters = { clients: [], stages: [], datePreset: null };

/** The presets Figma lists above the calendar. */
/** The spans the panel offers. Custom is added by the component itself. */
const PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last30', label: 'Last 30 days' },
];

/**
 * Left ▸ Searchbar — Figma nodes 46:1389, 4685:5014, 4685:5278, 4652:38365,
 * 4653:38693, 4654:38785, 4654:38963, 4654:39194, and 4654:39288.
 *
 * One page for the field and everything it opens. Figma files the advanced
 * panel and its three filter rows as separate components because they are
 * separate frames to draw, but they are not separate things to use: none of
 * them can be reached except by typing in this field, and a reader deciding
 * how filtering works needs them in one place, in the order the interaction
 * unfolds.
 */
export function SearchbarPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<InboxFilters>({
    clients: [],
    stages: ['interested'],
    datePreset: 'last7',
  });
  const [chips, setChips] = useState<InboxFilters>({
    clients: ['floyd'],
    stages: ['new', 'interested'],
    datePreset: 'last7',
  });
  const [preset, setPreset] = useState('last7');

  return (
    <>
      <PageHeader
        title="Advanced Searchbar"
        description="The filter panel the search field opens — client, stage, date, and the summary of what is applied. Figma node 4685:5014, with its flow documented at 9930:159252 in the CRM file."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Components ▸ Main ▸ Date picker', pageId: 'date-picker' },
          { label: 'Components ▸ Main ▸ Avatar', pageId: 'avatar' },
          { label: 'Components ▸ Main ▸ Badge', pageId: 'badge' },
          { label: 'List of Room (Left)', pageId: 'crm-inbox-left' },
        ]}
      >
        The panel draws <strong>Avatar</strong> beside each client, a <strong>CounterBadge</strong>{' '}
        per filter row, <strong>StagePill</strong> and <strong>SelectTick</strong> in the stage
        list, and the generic <strong>Date picker</strong> under the date presets — filed under Main
        because a calendar knows nothing about conversations.
      </CrossLink>

      <Section
        title="The panel"
        description="Opened by clicking or typing in the search field. Only one filter row is open at a time — three expanded lists (four clients, nine stages, a calendar) would bury the panel's own footer and turn a filter surface into a scroll."
      >
        <Frame height="auto" hug>
          <div style={{ display: 'flex', gap: spacing.l, padding: spacing.l, alignItems: 'flex-start' }}>
            <Column>
              <InboxSearchField value={query} onValueChange={setQuery} />
            </Column>
            <AdvancedSearch
              value={filters}
              onValueChange={setFilters}
              clients={clients}
              stages={stages}
            />
          </div>
        </Frame>
        <Caption>
          The field that opens it, and the panel itself. Every counter is drawn even at zero — a row
          that hides its counter when empty makes “no filter” look like “no counter”.
        </Caption>
        <CodeBlock
          code={`<InboxSearchField value={query} onValueChange={setQuery} />
<AdvancedSearch value={filters} onValueChange={setFilters} clients={clients} stages={stages} />`}
        />
      </Section>

      <Section
        title="Filter by client"
        description="The client list is the only one long enough to need searching — stages are a fixed set of nine, dates are a calendar — so it carries its own field. Figma draws the match in brand blue and the rest of the name in black, which is what tells you why a row matched."
      >
        <Frame height="auto" hug>
          <div style={{ padding: spacing.l }}>
            <AdvancedSearch
              defaultValue={NO_FILTERS}
              clients={clients}
              stages={stages}
              defaultExpanded="client"
              recentSearches={null}
            />
          </div>
        </Frame>
        <Caption>
          Type in the nested field to narrow the list. Hover a client for the nav grey; pick one and
          the row takes the brand tint, with the count staying put on the right.
        </Caption>
        <CodeBlock code={`<AdvancedSearch clients={clients} defaultExpanded="client" />`} />
      </Section>

      <Section
        title="Filter by stage"
        description="Nine stages, each in its own tint from `color.stageFlat` — the same tints the room cards use, so a stage is recognisable before its name is read. Multi-select, because filtering to “Interested or Booked” is a real question."
      >
        <Frame height="auto" hug>
          <div style={{ padding: spacing.l }}>
            <AdvancedSearch
              defaultValue={NO_FILTERS}
              clients={clients}
              stages={stages}
              defaultExpanded="stage"
              recentSearches={null}
            />
          </div>
        </Frame>
        <Caption>
          The tick is drawn rather than rendered as a real `Checkbox`: the row is already a button,
          and a checkbox inside a button is invalid markup that swallows its own click.
        </Caption>
        <CodeBlock code={`<AdvancedSearch stages={stages} defaultExpanded="stage" />`} />
      </Section>

      <Section
        title="Filter by date"
        description="Three named spans — Today, Last 7 days, Last 30 days — and Custom, which is the only thing that opens the calendar. Picking a preset clears any custom range and vice versa, since holding both would leave the counter ambiguous."
      >
        <Frame height="auto" hug>
          <div style={{ padding: spacing.l }}>
            <AdvancedSearch
              defaultValue={NO_FILTERS}
              clients={clients}
              stages={stages}
              defaultExpanded="date"
              recentSearches={null}
            />
          </div>
        </Frame>
        <Caption>Pick a preset, then pick a range on the calendar — the preset clears.</Caption>
        <CodeBlock code={`<AdvancedSearch datePresets={presets} defaultExpanded="date" />`} />
      </Section>

      <Section
        title="What the dates mean"
        description="The panel reports a filter but does not run it — the app does. These three are the contract it has to hold to for the counts to mean what the labels say, and none of them is visible from the UI alone."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s, padding: spacing.l, maxWidth: 620 }}>
            <p style={{ margin: 0 }}>
              <strong>“Last activity” is the last message.</strong> Stage changes, notes, and
              assignment move a room around the pipeline without anyone having said anything in it,
              so they do not count.
            </p>
            <p style={{ margin: 0 }}>
              <strong>A custom range includes both endpoint days in full.</strong> 1 May – 7 May
              covers 00:00 on the 1st through 23:59 on the 7th. Stopping at midnight on the 7th
              would silently drop the last day, which reads as a bug to anyone who picked it on a
              calendar.
            </p>
            <p style={{ margin: 0 }}>
              <strong>Every span is the viewer’s own timezone</strong> — not the client’s, not UTC.
              A room’s last activity is a moment in time, but “today” is a question about the
              reader’s day.
            </p>
          </div>
        </Frame>
        <Caption>
          Stated here because none of it is visible from the control. The row says “· your time” for
          the same reason.
        </Caption>
      </Section>

      <Section
        title="Multiple filters at once + Clear all"
        description="Filters combine, and every applied one is summarised as a chip along the top rather than only inside the row that set it: once a row is collapsed its selections are out of sight, and a filter you cannot see is one you forget is on. The chips are also where a filter is removed, which is why each carries its own ✕."
      >
        <Frame height="auto" hug>
          <div style={{ padding: spacing.l }}>
            <AdvancedSearch
              value={chips}
              onValueChange={setChips}
              clients={clients}
              stages={stages}
              recentSearches={null}
            />
          </div>
        </Frame>
        <Caption>
          Client, stage, and date applied together. Remove a chip and the row behind it updates —
          the chips read straight off the filter state, so the summary cannot fall out of step with
          the rows. “Clear all” drops every filter in one action, which is the only way back to an
          unfiltered list once several are on.
        </Caption>
        <CodeBlock
          code={`<AdvancedSearch
  value={filters}
  onValueChange={setFilters}
  onClearAll={reset}
  clients={clients}
  stages={stages}
/>`}
        />
      </Section>

      <Section
        title="The chip"
        description="A preset and an applied filter are the same pill at different moments — a preset is a filter you have not applied yet — which is why Figma draws one component for both."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', gap: spacing.xs, padding: spacing.l, flexWrap: 'wrap' }}>
            <FilterChip icon={IconStageTripleLine}>New</FilterChip>
            <FilterChip icon={IconStageTripleLine} selected>
              Interested
            </FilterChip>
            <FilterChip icon={IconCalendarFill} selected onRemove={() => undefined}>
              Last 7 days
            </FilterChip>
            <FilterChip icon={IconClientIdPeopleStroke} disabled>
              Floyd Miles
            </FilterChip>
          </div>
        </Frame>
        <Caption>Default, selected, selected with a remove affordance, and disabled.</Caption>
        <CodeBlock
          code={`<FilterChip icon={IconCalendarFill} selected onRemove={clear}>Last 7 days</FilterChip>`}
        />
      </Section>

    </>
  );
}
