import { borderWidth, color, component, shadow, textStyle } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCalendarFill,
  IconClientIdPeopleStroke,
  IconDropdownArrowDown,
  IconDropdownArrowUp,
  IconStageTripleLine,
  type IconDef,
} from '../../icons/defs.js';
import { Avatar } from '../Avatar/Avatar.js';
import { CounterBadge } from '../Badge/CounterBadge.js';
import { DatePicker, type DateRange } from '../DatePicker/DatePicker.js';
import { FilterChip, InboxSearchField } from './InboxSearch.js';
import { StagePill } from './StagePill.js';

const { inbox } = component;
const { panel } = inbox;

/** A client the conversations can be filtered by. */
export type ClientFilterOption = {
  id: string;
  name: string;
  avatarSrc?: string;
  /** How many conversations this client accounts for. */
  conversations: number;
};

/** A lead stage the conversations can be filtered by. */
export type StageFilterOption = {
  id: string;
  /** The stage's display name — "Interested", "Booked". */
  label: string;
  /** The stage's tint, from `color.stageFlat`. */
  tone: string;
  conversations: number;
};

/** A named date span offered above the calendar. */
export type DatePresetOption = {
  id: string;
  label: string;
};

/** Which of the three filter rows is open. */
export type FilterRowName = 'client' | 'stage' | 'date';

/** Everything the panel is currently filtering by. */
export type InboxFilters = {
  clients: string[];
  stages: string[];
  /** The chosen preset's id, if a preset rather than a custom range is set. */
  datePreset?: string | null;
  dateRange?: DateRange;
};

const EMPTY: InboxFilters = { clients: [], stages: [], datePreset: null };

/** What a `renderFooter` function receives — the hint along the panel's foot. */
export type AdvancedSearchFooterRenderProps = WithDefaultRender & {
  /** How many filters are applied. */
  count: number;
};

/** Per-instance overrides for the panel's own metrics. */
export type AdvancedSearchStyleProps = {
  width?: CssLength;
  radius?: CssLength;
  background?: string;
  borderColor?: string;
  shadow?: string;
};

export type AdvancedSearchProps = {
  /** The active filters. Controlled. */
  value?: InboxFilters;
  defaultValue?: InboxFilters;
  onValueChange?: (filters: InboxFilters) => void;
  /** Clients to offer under the Client row. */
  clients?: ClientFilterOption[];
  /** Stages to offer under the Stage row. */
  stages?: StageFilterOption[];
  /**
   * Named spans above the calendar — "Today", "Last 7 days".
   * @default a Today / Yesterday / Last 7 days / Last 30 days set
   */
  datePresets?: DatePresetOption[];
  /** Rooms matching the current query, listed under "Recent Search". */
  recentSearches?: ReactNode;
  /** The hint along the panel's foot. */
  footer?: ReactNode;
  /** Called when "Clear all" is used. */
  onClearAll?: () => void;
  /**
   * The line under the Date row's title.
   *
   * Says what the dates mean, which the label alone cannot: every span is read
   * in the viewer's own timezone, and a filter that silently used the client's
   * or UTC would quietly disagree with the timestamps on the cards.
   *
   * @default 'Filter by last activity · your time'
   */
  dateDescription?: string;
  /**
   * What the date filter means, for the consumer implementing the query:
   *
   * - "Last activity" is the room's **last message** — not stage changes,
   *   notes, or assignment, which move a room around the pipeline without
   *   anyone having said anything in it.
   * - A custom range **includes both endpoint days in full**: picking
   *   1 May – 7 May covers 00:00 on the 1st through 23:59 on the 7th. An
   *   exclusive end would silently drop the last day, which reads as a bug to
   *   anyone who picked it on a calendar.
   * - Every span is read in the **viewer's own timezone**, so "today" is their
   *   day rather than the client's or UTC's.
   *
   * Recorded here rather than only in the gallery because the panel reports a
   * filter but does not run it — the app does, and this is the contract it has
   * to hold to for the counts to mean what the labels say.
   */
  /**
   * Which filter row starts open.
   *
   * Only one row is open at a time — three expanded lists would bury the
   * panel's own footer — so this is one name rather than a set.
   */
  defaultExpanded?: FilterRowName | null;
  /**
   * Replaces the hint along the panel's foot.
   *
   * The default names the keys that close the panel, which is right until a
   * screen binds different ones. Call `defaultRender()` to decorate.
   */
  renderFooter?: RenderProp<AdvancedSearchFooterRenderProps>;
} & AdvancedSearchStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onChange'>;

/**
 * The preset that opens the calendar instead of setting a span itself.
 *
 * Named rather than positional so a consumer can reorder or retitle the
 * presets without the calendar quietly attaching to the wrong one.
 */
export const CUSTOM_PRESET_ID = 'custom';

/**
 * The date spans the panel offers, and the only ones it offers.
 *
 * Three named spans plus Custom. Deliberately short: the row filters by last
 * activity, and "was there movement recently" is nearly always answered by one
 * of these three — anything more specific is what the calendar is for.
 *
 * Every span is read in the viewer's own timezone, not the client's and not
 * UTC. A room's last activity is a moment in time, but "today" is a question
 * about the reader's day, and someone scanning at 9am in Jakarta means their
 * morning rather than a UTC boundary eight hours behind them.
 */
const DEFAULT_PRESETS: DatePresetOption[] = [
  { id: 'today', label: 'Today' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last30', label: 'Last 30 days' },
  { id: CUSTOM_PRESET_ID, label: 'Custom' },
];

/**
 * One collapsible filter row — the glyph, its label, its count, and whatever
 * it opens.
 *
 * A row is closed until it is used and counts what it has selected, so the
 * panel can list three filters in the space one expanded one would take, and
 * still say which of them are doing something.
 */
function FilterRow({
  icon,
  title,
  description,
  count,
  expanded,
  onToggle,
  children,
}: {
  icon: IconDef;
  title: string;
  description: string;
  count: number;
  expanded: boolean;
  onToggle: () => void;
  children?: ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const active = count > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: panel.rowGap,
          width: '100%',
          boxSizing: 'border-box',
          padding: `${panel.rowPaddingY}px ${panel.rowPaddingX}px`,
          border: 'none',
          textAlign: 'left',
          font: 'inherit',
          cursor: 'pointer',
          backgroundColor: hover ? color.navbar.hover : 'transparent',
        }}
      >
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: panel.rowMarkSize,
            height: panel.rowMarkSize,
            borderRadius: '50%',
            backgroundColor: color.navbar.border,
          }}
        >
          <Icon icon={icon} size={panel.rowIconSize} color={color.navbar.text2} />
        </span>

        <span
          style={{
            flex: 1,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: panel.rowStackGap,
          }}
        >
          <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>{title}</span>
          <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>{description}</span>
        </span>

        {/* The count is always drawn, gray at zero. A row that hides its
            counter when empty makes "no filter" look like "no counter" —
            which is why this is a CounterBadge with its colors overridden
            rather than one that disappears below one. */}
        <CounterBadge
          count={count}
          diameter={panel.counterSize}
          background={active ? color.badge.foreground : color.navbar.border}
          textColor={active ? color.main.white : color.navbar.text}
          label={`${count} applied`}
        />

        <Icon
          icon={expanded ? IconDropdownArrowUp : IconDropdownArrowDown}
          size={panel.rowIconSize}
          color={color.navbar.text}
        />
      </button>

      {expanded && children != null && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: panel.optionGap,
            paddingLeft: panel.optionInset,
            paddingRight: panel.rowPaddingX,
            paddingBottom: panel.optionPaddingY,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** One selectable option under an expanded row. */
function OptionRow({
  selected,
  onSelect,
  leading,
  label,
  count,
}: {
  selected: boolean;
  onSelect: () => void;
  leading?: ReactNode;
  label: ReactNode;
  count: number;
}) {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: panel.optionInnerGap,
        width: '100%',
        boxSizing: 'border-box',
        minHeight: panel.optionHeight,
        padding: `${panel.optionPaddingY}px ${panel.optionPaddingX}px`,
        border: 'none',
        borderRadius: panel.optionRadius,
        textAlign: 'left',
        font: 'inherit',
        cursor: 'pointer',
        backgroundColor: selected
          ? color.badge.background
          : hover
            ? color.navbar.hover
            : 'transparent',
      }}
    >
      {leading}
      <span
        style={{
          ...textStyle.mMedium,
          flex: 1,
          minWidth: 0,
          color: color.main.black,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
      <span style={{ ...textStyle.sRegular, color: color.navbar.text, flexShrink: 0 }}>
        {count} {count === 1 ? 'conversation' : 'conversations'}
      </span>
    </button>
  );
}

/**
 * The advanced search panel — the filter surface that opens over the room list.
 *
 * Figma: node 4685:5014, with the filter summary at 4685:5278 and the three
 * rows at 4652:38365 (Client), 4654:38785 (Stage), and 4654:39194 (Date).
 *
 * The applied filters are summarised as chips along the top rather than only
 * inside the rows that set them: once a row is collapsed its selections are
 * out of sight, and a filter you cannot see is one you forget is on. The chips
 * are also where a filter is removed, which is why each carries its own ✕.
 */
export const AdvancedSearch = forwardRef<HTMLDivElement, AdvancedSearchProps>(
  function AdvancedSearch(
    {
      value,
      defaultValue = EMPTY,
      onValueChange,
      clients = [],
      stages = [],
      datePresets = DEFAULT_PRESETS,
      recentSearches,
      footer = 'Search applies instantly · Esc/Enter or touch outside to close',
      onClearAll,
      dateDescription = 'Filter by last activity · your time',
      defaultExpanded = null,
      renderFooter,
      width,
      radius,
      background,
      borderColor,
      shadow: shadowOverride,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState<InboxFilters>(defaultValue);
    const [expanded, setExpanded] = useState<FilterRowName | null>(defaultExpanded);
    const [clientQuery, setClientQuery] = useState('');
    const [clearHovered, setClearHovered] = useState(false);

    const filters = value ?? uncontrolled;

    const commit = (next: InboxFilters) => {
      if (value === undefined) setUncontrolled(next);
      onValueChange?.(next);
    };

    const toggleIn = (list: string[], id: string) =>
      list.includes(id) ? list.filter((item) => item !== id) : [...list, id];

    const dateCount = filters.datePreset != null || filters.dateRange?.start != null ? 1 : 0;

    // The chips read straight off the filter state rather than being tracked
    // alongside it, so the summary cannot fall out of step with the rows.
    const chips = [
      ...filters.stages.map((id) => {
        const stage = stages.find((item) => item.id === id);
        return {
          key: `stage:${id}`,
          label: stage?.label ?? id,
          icon: IconStageTripleLine,
          remove: () => commit({ ...filters, stages: filters.stages.filter((item) => item !== id) }),
        };
      }),
      ...filters.clients.map((id) => {
        const client = clients.find((item) => item.id === id);
        return {
          key: `client:${id}`,
          label: client?.name ?? id,
          icon: IconClientIdPeopleStroke,
          remove: () =>
            commit({ ...filters, clients: filters.clients.filter((item) => item !== id) }),
        };
      }),
      ...(filters.datePreset != null
        ? [
            {
              key: `date:${filters.datePreset}`,
              label:
                datePresets.find((preset) => preset.id === filters.datePreset)?.label ??
                filters.datePreset,
              icon: IconCalendarFill,
              remove: () => commit({ ...filters, datePreset: null }),
            },
          ]
        : []),
    ];

    /**
     * The clients the dropdown offers.
     *
     * Already-picked clients drop out rather than showing as ticked: they are
     * listed as chips in the band above, and offering them again is offering a
     * no-op. The same rule applies to stages.
     */
    const clientTerm = clientQuery.trim().toLowerCase();
    const visibleClients = clients.filter(
      (client) =>
        !filters.clients.includes(client.id) &&
        client.name.toLowerCase().includes(clientTerm),
    );
    // A query that matches nothing shows no dropdown at all, rather than an
    // empty one — an empty list reads as "loading" where absence reads as
    // "nothing by that name".
    const showClientResults = clientTerm === '' || visibleClients.length > 0;

    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width: len(width) ?? panel.width,
          borderRadius: len(radius) ?? panel.radius,
          backgroundColor: background ?? color.main.white,
          border: `${borderWidth.thin}px solid ${borderColor ?? color.navbar.hover}`,
          boxShadow: shadowOverride ?? shadow.base,
          overflow: 'hidden',
        }}
        {...rest}
      >
        <div
          style={{
            display: 'flex',
            alignItems: chips.length > 0 ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: panel.summaryGap,
            padding: `${panel.rowPaddingY}px ${panel.rowPaddingX}px`,
            borderBottom: `${borderWidth.thin}px solid ${color.main.backgroundAlt}`,
          }}
        >
          <span
            style={{
              ...textStyle.mMedium,
              color: color.navbar.text,
              flexShrink: 0,
              lineHeight: `${inbox.chip.height}px`,
            }}
          >
            Filters
          </span>

          <span
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: panel.chipGap,
              flex: 1,
              minWidth: 0,
              justifyContent: 'flex-start',
            }}
          >
            {/* A pill standing in for the chips when none are applied, so the
                band keeps its height and the panel does not jump as the first
                filter goes on. */}
            {chips.length === 0 ? (
              <span
                style={{
                  ...textStyle.sMedium,
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: `${panel.emptyPillPaddingY}px ${panel.emptyPillPaddingX}px`,
                  borderRadius: panel.emptyPillRadius,
                  backgroundColor: color.navbar.hover,
                  color: color.navbar.text,
                }}
              >
                No filters active
              </span>
            ) : (
              chips.map((chip) => (
                <FilterChip key={chip.key} icon={chip.icon} selected onRemove={chip.remove}>
                  {chip.label}
                </FilterChip>
              ))
            )}
          </span>

          <button
            type="button"
            onClick={() => {
              commit(EMPTY);
              onClearAll?.();
            }}
            onMouseEnter={() => setClearHovered(true)}
            onMouseLeave={() => setClearHovered(false)}
            style={{
              ...textStyle.mRegular,
              flexShrink: 0,
              height: panel.clearHeight,
              padding: `0 ${panel.clearPaddingX}px`,
              borderRadius: panel.clearRadius,
              border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
              // Hover fills rather than darkens the text: this drops every
              // filter at once, so it should feel like a button being pressed
              // rather than a link being read.
              backgroundColor: clearHovered ? color.navbar.hover : 'transparent',
              color: color.navbar.text,
              cursor: 'pointer',
            }}
          >
            Clear all
          </button>
        </div>

        <FilterRow
          icon={IconClientIdPeopleStroke}
          title="Client"
          description="Filter by client name"
          count={filters.clients.length}
          expanded={expanded === 'client'}
          onToggle={() => setExpanded(expanded === 'client' ? null : 'client')}
        >
          {/* The client list is the only one long enough to need searching —
              stages are a fixed set of nine, dates are a calendar. */}
          <InboxSearchField
            value={clientQuery}
            onValueChange={setClientQuery}
            placeholder="Type client name..."
          />
          {showClientResults &&
            visibleClients.map((client) => (
              <OptionRow
                key={client.id}
                selected={false}
                onSelect={() =>
                  commit({ ...filters, clients: toggleIn(filters.clients, client.id) })
                }
                leading={<Avatar size="small" name={client.name} src={client.avatarSrc} />}
                label={client.name}
                count={client.conversations}
              />
            ))}
        </FilterRow>

        <FilterRow
          icon={IconStageTripleLine}
          title="Stage"
          description="Filter by lead stage"
          count={filters.stages.length}
          expanded={expanded === 'stage'}
          onToggle={() => setExpanded(expanded === 'stage' ? null : 'stage')}
        >
          {/* Selected stages drop out of the list rather than showing ticked:
              they are chips in the band above, and the pill itself is the
              control here — Figma draws no checkbox beside it. */}
          {stages
            .filter((stage) => !filters.stages.includes(stage.id))
            .map((stage) => (
              <OptionRow
                key={stage.id}
                selected={false}
                onSelect={() => commit({ ...filters, stages: toggleIn(filters.stages, stage.id) })}
                label={<StagePill tone={stage.tone}>{stage.label}</StagePill>}
                count={stage.conversations}
              />
            ))}
        </FilterRow>

        <FilterRow
          icon={IconCalendarFill}
          title="Date"
          description={dateDescription}
          count={dateCount}
          expanded={expanded === 'date'}
          onToggle={() => setExpanded(expanded === 'date' ? null : 'date')}
        >
          <span
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: panel.chipGap,
              paddingBottom: panel.optionGap,
            }}
          >
            {datePresets.map((preset) => (
              <FilterChip
                key={preset.id}
                icon={IconCalendarFill}
                selected={filters.datePreset === preset.id}
                onClick={() =>
                  commit({
                    ...filters,
                    // One preset at a time: they are alternative answers to the
                    // same question, and holding two would leave the count
                    // ambiguous. Switching away from Custom drops its range too.
                    datePreset: filters.datePreset === preset.id ? null : preset.id,
                    dateRange: undefined,
                  })
                }
              >
                {preset.label}
              </FilterChip>
            ))}
          </span>
          {/* The calendar appears only once "Custom" is picked. Most date
              filtering is "recently", which a preset answers in one click;
              showing a calendar underneath every time makes the common case
              scroll past the uncommon one. */}
          {filters.datePreset === CUSTOM_PRESET_ID && (
            <DatePicker
              months={1}
              value={filters.dateRange}
              onValueChange={(range) => commit({ ...filters, dateRange: range })}
            />
          )}
        </FilterRow>

        {recentSearches != null && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: panel.sectionGap,
              padding: `${panel.sectionPaddingY}px ${panel.rowPaddingX}px`,
            }}
          >
            <span style={{ ...textStyle.mMedium, color: color.navbar.text }}>Recent Search</span>
            {recentSearches}
          </div>
        )}

        {footer != null &&
          (() => {
            const defaultRender = () => (
              <div
                style={{
                  padding: `${panel.footerPaddingTop}px ${panel.rowPaddingX}px ${panel.footerPaddingBottom}px`,
                  borderTop: `${borderWidth.thin}px solid ${color.main.backgroundAlt}`,
                }}
              >
                <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>{footer}</span>
              </div>
            );
            return renderFooter
              ? renderFooter({ count: chips.length, defaultRender })
              : defaultRender();
          })()}
      </div>
    );
  },
);
