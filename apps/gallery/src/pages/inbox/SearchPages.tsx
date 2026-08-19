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
const PRESETS = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
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
        title="Searchbar"
        description="Finding a room by name, and the filter panel typing opens. Figma nodes 46:1389 (field) and 4685:5014 (panel), with its filter rows."
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
        title="The field"
        description="A real `<input>` rather than a button that swaps one in: the panel it opens is a filter surface, and typing has to keep working while it is open. The clear button only appears once there is something to clear, so the resting field stays as quiet as Figma draws it."
      >
        <Frame height="auto" hug>
          <Column>
            <InboxSearchField value={query} onValueChange={setQuery} />
          </Column>
        </Frame>
        <Caption>Type to see the clear button appear at the trailing edge.</Caption>
        <CodeBlock code={`<InboxSearchField value={query} onValueChange={setQuery} />`} />
      </Section>

      <Section
        title="Collapsed"
        description="Figma's Collapse variant drops the field to a circular button — the layout the column falls back to when the controls beside it need the room."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <InboxSearchField collapsed onExpand={() => undefined} />
          </div>
        </Frame>
        <Caption>Click to expand back to the full field.</Caption>
        <CodeBlock code={`<InboxSearchField collapsed onExpand={expand} />`} />
      </Section>

      <Section
        title="The panel"
        description="Only one row is open at a time. Three expanded lists — four clients, nine stages, a calendar — would bury the panel's own footer and turn a filter surface into a scroll."
      >
        <Frame height="auto" hug>
          <div style={{ padding: spacing.l }}>
            <AdvancedSearch
              value={filters}
              onValueChange={setFilters}
              clients={clients}
              stages={stages}
            />
          </div>
        </Frame>
        <Caption>Open a row to filter by it; the counters and chips update as you do.</Caption>
        <CodeBlock
          code={`<AdvancedSearch
  value={filters}
  onValueChange={setFilters}
  clients={clients}
  stages={stages}
/>`}
        />
      </Section>

      <Section
        title="Nothing applied"
        description="Figma's “Not Active” variant. Every counter is gray at zero — the counter is always drawn, because a row that hides its counter when empty makes “no filter” look like “no counter”."
      >
        <Frame height="auto" hug>
          <div style={{ padding: spacing.l }}>
            <AdvancedSearch defaultValue={NO_FILTERS} clients={clients} stages={stages} />
          </div>
        </Frame>
        <Caption>The resting panel, before anything is filtered.</Caption>
      </Section>

      <Section
        title="Filters applied"
        description="Applied filters are summarised as chips along the top rather than only inside the rows that set them: once a row is collapsed its selections are out of sight, and a filter you cannot see is one you forget is on. The chips are also where a filter is removed, which is why each carries its own ✕."
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
          Remove a chip and the row behind it updates — the chips read straight off the filter
          state, so the summary cannot fall out of step with the rows.
        </Caption>
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
        description="Presets first, calendar below. Most date filtering is “recently”, and a preset answers that in one click where a calendar asks for two — but the calendar has to be there for the case a preset cannot express. Picking one clears the other, since holding both would leave the counter ambiguous."
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
        title="Chips and presets"
        description="A preset and an applied filter are the same pill at different moments — a preset is a filter you have not applied yet — which is why Figma draws one component for both."
      >
        <Frame height="auto">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.m,
              padding: spacing.l,
            }}
          >
            <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
              {PRESETS.map((option) => (
                <FilterChip
                  key={option.id}
                  icon={IconCalendarFill}
                  selected={preset === option.id}
                  onClick={() => setPreset(option.id)}
                >
                  {option.label}
                </FilterChip>
              ))}
            </div>
            <div style={{ display: 'flex', gap: spacing.xs, flexWrap: 'wrap' }}>
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
          </div>
        </Frame>
        <Caption>
          Presets on top — exactly one is on at a time, since two spans cannot both be "the" last
          activity window. Below: default, selected, selected with a remove affordance, and disabled.
        </Caption>
        <CodeBlock
          code={`<FilterChip icon={IconCalendarFill} selected onRemove={clear}>Last 7 days</FilterChip>`}
        />
      </Section>
    </>
  );
}
