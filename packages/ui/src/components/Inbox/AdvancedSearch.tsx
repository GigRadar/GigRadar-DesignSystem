import { borderWidth, color, component, shadow, textStyle } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
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
import { SelectTick } from './SelectTick.js';
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
   * Which filter row starts open.
   *
   * Only one row is open at a time — three expanded lists would bury the
   * panel's own footer — so this is one name rather than a set.
   */
  defaultExpanded?: FilterRowName | null;
} & AdvancedSearchStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onChange'>;

const DEFAULT_PRESETS: DatePresetOption[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last7', label: 'Last 7 days' },
  { id: 'last30', label: 'Last 30 days' },
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
      defaultExpanded = null,
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

    const visibleClients = clients.filter((client) =>
      client.name.toLowerCase().includes(clientQuery.trim().toLowerCase()),
    );

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
              justifyContent: chips.length > 0 ? 'flex-start' : 'flex-end',
            }}
          >
            {chips.map((chip) => (
              <FilterChip key={chip.key} icon={chip.icon} selected onRemove={chip.remove}>
                {chip.label}
              </FilterChip>
            ))}
          </span>

          <button
            type="button"
            onClick={() => {
              commit(EMPTY);
              onClearAll?.();
            }}
            style={{
              ...textStyle.mRegular,
              flexShrink: 0,
              height: panel.clearHeight,
              padding: `0 ${panel.clearPaddingX}px`,
              borderRadius: panel.clearRadius,
              border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
              backgroundColor: 'transparent',
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
            placeholder="Search client..."
          />
          {visibleClients.map((client) => (
            <OptionRow
              key={client.id}
              selected={filters.clients.includes(client.id)}
              onSelect={() => commit({ ...filters, clients: toggleIn(filters.clients, client.id) })}
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
          {stages.map((stage) => {
            const checked = filters.stages.includes(stage.id);
            return (
              <OptionRow
                key={stage.id}
                selected={checked}
                onSelect={() => commit({ ...filters, stages: toggleIn(filters.stages, stage.id) })}
                // A decorative tick rather than a real <Checkbox>: the row is
                // already a button, and a checkbox inside a button is invalid
                // markup that swallows its own click. `aria-pressed` on the
                // row is what carries the state to a screen reader.
                leading={<SelectTick shape="square" checked={checked} />}
                label={<StagePill tone={stage.tone}>{stage.label}</StagePill>}
                count={stage.conversations}
              />
            );
          })}
        </FilterRow>

        <FilterRow
          icon={IconCalendarFill}
          title="Date"
          description="Filter by last activity"
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
                    // Picking a preset clears any custom range, and vice
                    // versa: they are two ways to say the same thing, and
                    // holding both would leave the count ambiguous.
                    datePreset: filters.datePreset === preset.id ? null : preset.id,
                    dateRange: undefined,
                  })
                }
              >
                {preset.label}
              </FilterChip>
            ))}
          </span>
          <DatePicker
            months={1}
            value={filters.dateRange}
            onValueChange={(range) => commit({ ...filters, dateRange: range, datePreset: null })}
          />
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

        {footer != null && (
          <div
            style={{
              padding: `${panel.footerPaddingTop}px ${panel.rowPaddingX}px ${panel.footerPaddingBottom}px`,
              borderTop: `${borderWidth.thin}px solid ${color.main.backgroundAlt}`,
            }}
          >
            <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>{footer}</span>
          </div>
        )}
      </div>
    );
  },
);
