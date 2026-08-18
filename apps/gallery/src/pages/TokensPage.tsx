import { color, radius, shadow, spacing, textStyle, typography } from '@gigradar/theme';
import { useMemo, useState, type ReactNode } from 'react';
import { SearchField } from '../components/SearchField';
import { PageHeader, Section } from '../layout';

/**
 * Does a token match what was typed?
 *
 * Name and value both, so "brand" and "#F5F8FF" each find the same swatch —
 * the page is as often used to answer "what is this hex I found in a mockup"
 * as "what is the brand color". Case-insensitive, and the `#` is optional so
 * pasting a bare hex works.
 */
function matches(name: string, value: string | number, query: string) {
  if (!query) return true;
  const needle = query.trim().toLowerCase().replace(/^#/, '');
  if (!needle) return true;
  const haystack = `${name} ${value}`.toLowerCase().replace(/#/g, '');
  return haystack.includes(needle);
}

/** Filters `[name, value]` pairs, keeping the section's own ordering. */
function filterEntries<T extends string | number>(
  entries: [string, T][],
  query: string,
): [string, T][] {
  return entries.filter(([name, value]) => matches(name, value, query));
}

export function TokensPage() {
  const [query, setQuery] = useState('');

  // The non-color scales, filtered once per keystroke. Memoised because the
  // typography list rebuilds a style object per row and the page re-renders on
  // every character typed.
  const typeEntries = useMemo(
    () => Object.entries(typography.textStyle).filter(([name]) => matches(name, '', query)),
    [query],
  );
  const spacingEntries = useMemo(() => filterEntries(Object.entries(spacing), query), [query]);
  const radiusEntries = useMemo(() => filterEntries(Object.entries(radius), query), [query]);
  const shadowEntries = useMemo(
    () =>
      (
        [
          ['base', shadow.base, 'Cards, panels, raised surfaces'],
          ['popup', shadow.popup, 'Dropdowns, menus, popovers, dialogs'],
        ] as const
      ).filter(([name, value]) => matches(name, value, query)),
    [query],
  );

  // Every color group the page draws, so "nothing matched" can be answered
  // without each section reporting up. Cheap: these are small literal objects.
  const colorGroups: Record<string, string>[] = [
    color.main,
    ...Object.values(color.status),
    ...Object.values(color.stage),
    ...Object.values(color.accent),
    color.proposal,
    ...Object.values(color.integration),
    color.navbar,
    color.disable,
  ];
  const anyColor = colorGroups.some(
    (group) => filterEntries(Object.entries(group), query).length > 0,
  );
  const empty =
    !anyColor &&
    typeEntries.length === 0 &&
    spacingEntries.length === 0 &&
    radiusEntries.length === 0 &&
    shadowEntries.length === 0;

  return (
    <>
      <PageHeader
        title="Tokens"
        description="Extracted from the Figma guidebook (node 4363:1685). These values are the source of truth — every component reads from them, and nothing hardcodes a color, size, or radius."
      />

      <div style={{ marginBottom: spacing.l }}>
        <SearchField
          value={query}
          onValueChange={setQuery}
          label="Search tokens"
          placeholder="Search tokens by name or value — brand, #F5F8FF, 16"
          maxWidth={420}
        />
      </div>

      {empty && (
        <p style={{ ...textStyle.mRegular, color: color.main.description }}>
          No token matches <strong>{query}</strong>. Names and values are both searched, so a hex
          from a mockup finds its token.
        </p>
      )}

      <TokenSection
        title="Brand & surface"
        description="The Main row of the guidebook."
        query={query}
        entries={Object.entries(color.main)}
      />

      <GroupedTokenSection
        title="Status"
        description="Canonical semantic colors. Figma's near-duplicate Error red is available as a deprecated alias."
        query={query}
        groups={Object.entries(color.status)}
      />

      <GroupedTokenSection
        title="CRM stages"
        description="Nine pipeline states, grouped by the [U]/[P]/[L] prefixes in Figma."
        query={query}
        groups={Object.entries(color.stage)}
      />

      <GroupedTokenSection
        title="Accents"
        description="Domain colors that are not status signals."
        query={query}
        groups={[...Object.entries(color.accent), ['proposal', color.proposal]]}
      />

      <GroupedTokenSection
        title="Integrations"
        description="Brand colors owned by external services. Kept separate from the semantic tokens — use these only where the service itself is represented, never as a stand-in for a semantic color."
        query={query}
        groups={Object.entries(color.integration)}
      />

      <GroupedTokenSection
        title="Navigation & disabled"
        query={query}
        groups={[
          ['navbar', color.navbar],
          ['disable', color.disable],
        ]}
      />

      {typeEntries.length > 0 && (
      <Section title="Typography" description="SF Pro Display. Line heights are the one value not taken from Figma — see the note in typography.ts.">
        <div style={{ backgroundColor: color.main.white, border: `1px solid ${color.navbar.border}`, borderRadius: radius.s, padding: spacing.l }}>
          {typeEntries.map(([name, style]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: spacing.m, marginBottom: spacing.s, borderBottom: `1px solid ${color.main.background}`, paddingBottom: spacing.s }}>
              <code style={{ ...textStyle.sRegular, fontFamily: typography.fontFamily.mono, color: color.main.description, width: 110, flexShrink: 0 }}>
                {name}
              </code>
              <div style={{ ...style, color: color.navbar.text2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                The quick brown fox
              </div>
            </div>
          ))}
        </div>
      </Section>
      )}

      {spacingEntries.length > 0 && (
      <Section title="Spacing" description="Note: the spacing and radius scales share T-shirt names but differ — S is 12 here, 8 in radius.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          {spacingEntries.map(([name, value]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: spacing.s }}>
              <code style={{ ...textStyle.sRegular, fontFamily: typography.fontFamily.mono, width: 60, color: color.main.description }}>{name}</code>
              <div style={{ height: 16, width: value, backgroundColor: color.main.brand, borderRadius: radius.xxs }} />
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>{value}px</span>
            </div>
          ))}
        </div>
      </Section>
      )}

      {radiusEntries.length > 0 && (
      <Section title="Radius">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.m }}>
          {radiusEntries.map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, backgroundColor: color.badge.background, border: `2px solid ${color.main.brand}`, borderRadius: value }} />
              <div style={{ ...textStyle.sMedium, marginTop: spacing.xxs, color: color.navbar.text2 }}>{name}</div>
              <div style={{ ...textStyle.sRegular, color: color.main.description }}>{value}px</div>
            </div>
          ))}
        </div>
      </Section>
      )}

      {shadowEntries.length > 0 && (
      <Section
        title="Shadow"
        description="Two elevations. `base` is ambient — for surfaces that sit within the page. `popup` is tighter, for transient surfaces that float above it; a wide spread would make a dropdown read as part of the layout."
      >
        <div style={{ display: 'flex', gap: spacing.xl, padding: spacing.l, flexWrap: 'wrap' }}>
          {shadowEntries.map(([name, value, usage]) => (
            <div key={name} style={{ width: 220 }}>
              <div
                style={{
                  height: 96,
                  backgroundColor: color.main.white,
                  borderRadius: radius.m,
                  boxShadow: value,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...textStyle.mMedium,
                  color: color.main.description,
                }}
              >
                {name}
              </div>
              <div style={{ ...textStyle.sRegular, color: color.main.description, marginTop: spacing.s }}>{usage}</div>
              <code style={{ ...textStyle.sRegular, fontFamily: typography.fontFamily.mono, color: color.main.description, wordBreak: 'break-all', display: 'block', marginTop: spacing.xxs }}>
                --gr-shadow-{name}
              </code>
            </div>
          ))}
        </div>
      </Section>
      )}
    </>
  );
}

/**
 * A color section whose swatches are one flat list.
 *
 * Renders nothing at all when the filter empties it — a heading standing over
 * no swatches reads as a section that failed to load rather than one with no
 * matches.
 */
function TokenSection({
  title,
  description,
  query,
  entries,
}: {
  title: string;
  description?: string;
  query: string;
  entries: [string, string][];
}) {
  const shown = filterEntries(entries, query);
  if (shown.length === 0) return null;

  return (
    <Section title={title} description={description}>
      <Swatches entries={shown} />
    </Section>
  );
}

/**
 * A color section split into named groups — status tones, CRM stages.
 *
 * Each group hides on its own, so a search for "hover" leaves the one group
 * that has it rather than every group it appears under.
 */
function GroupedTokenSection({
  title,
  description,
  query,
  groups,
}: {
  title: string;
  description?: string;
  query: string;
  groups: [string, Record<string, string>][];
}) {
  const shown = groups
    .map(([group, values]) => [group, filterEntries(Object.entries(values), query)] as const)
    .filter(([, entries]) => entries.length > 0);
  if (shown.length === 0) return null;

  return (
    <Section title={title} description={description}>
      {shown.map(([group, entries]) => (
        <div key={group} style={{ marginBottom: spacing.m }}>
          <GroupLabel>{group}</GroupLabel>
          <Swatches entries={entries} />
        </div>
      ))}
    </Section>
  );
}

function GroupLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ ...textStyle.sSemibold, color: color.main.description, marginBottom: spacing.xs, textTransform: 'capitalize' }}>
      {children}
    </div>
  );
}

/** Checkerboard, so translucent tokens read as translucent rather than pale. */
const ALPHA_CHECKER =
  'repeating-conic-gradient(#E8E8E8 0% 25%, #FFFFFF 0% 50%) 50% / 12px 12px';

function Swatches({ entries }: { entries: [string, string][] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.s }}>
      {entries.map(([name, value]) => {
        const isTranslucent = value.startsWith('rgba');
        return (
          <div key={name} style={{ width: 132 }}>
            <div
              style={{
                height: 56,
                borderRadius: radius.s,
                border: `1px solid ${color.navbar.border}`,
                background: isTranslucent ? ALPHA_CHECKER : undefined,
                overflow: 'hidden',
              }}
            >
              <div style={{ height: '100%', backgroundColor: value }} />
            </div>
            <div style={{ ...textStyle.sMedium, color: color.navbar.text2, marginTop: spacing.xxs }}>{name}</div>
            <code style={{ ...textStyle.sRegular, fontFamily: typography.fontFamily.mono, color: color.main.description, wordBreak: 'break-all' }}>
              {value}
            </code>
          </div>
        );
      })}
    </div>
  );
}
