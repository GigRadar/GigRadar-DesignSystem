import { color, radius, shadow, spacing, textStyle, typography } from '@uiuxjoseph/theme';
import { PageHeader, Section } from '../layout';

export function TokensPage() {
  return (
    <>
      <PageHeader
        title="Tokens"
        description="Extracted from the Figma guidebook (node 4363:1685). These values are the source of truth — every component reads from them, and nothing hardcodes a color, size, or radius."
      />

      <Section title="Brand & surface" description="The Main row of the guidebook.">
        <Swatches entries={Object.entries(color.main)} />
      </Section>

      <Section title="Status" description="Canonical semantic colors. Figma's near-duplicate Error red is available as a deprecated alias.">
        {Object.entries(color.status).map(([group, values]) => (
          <div key={group} style={{ marginBottom: spacing.m }}>
            <GroupLabel>{group}</GroupLabel>
            <Swatches entries={Object.entries(values)} />
          </div>
        ))}
      </Section>

      <Section title="CRM stages" description="Nine pipeline states, grouped by the [U]/[P]/[L] prefixes in Figma.">
        {Object.entries(color.stage).map(([group, values]) => (
          <div key={group} style={{ marginBottom: spacing.m }}>
            <GroupLabel>{group}</GroupLabel>
            <Swatches entries={Object.entries(values)} />
          </div>
        ))}
      </Section>

      <Section title="Accents" description="Domain colors that are not status signals.">
        {Object.entries(color.accent).map(([group, values]) => (
          <div key={group} style={{ marginBottom: spacing.m }}>
            <GroupLabel>{group}</GroupLabel>
            <Swatches entries={Object.entries(values)} />
          </div>
        ))}
        <GroupLabel>proposal</GroupLabel>
        <Swatches entries={Object.entries(color.proposal)} />
      </Section>

      <Section
        title="Integrations"
        description="Brand colors owned by external services. Kept separate from the semantic tokens — use these only where the service itself is represented, never as a stand-in for a semantic color."
      >
        {Object.entries(color.integration).map(([service, values]) => (
          <div key={service} style={{ marginBottom: spacing.m }}>
            <GroupLabel>{service}</GroupLabel>
            <Swatches entries={Object.entries(values)} />
          </div>
        ))}
      </Section>

      <Section title="Navigation & disabled">
        <GroupLabel>navbar</GroupLabel>
        <Swatches entries={Object.entries(color.navbar)} />
        <div style={{ height: spacing.m }} />
        <GroupLabel>disable</GroupLabel>
        <Swatches entries={Object.entries(color.disable)} />
      </Section>

      <Section title="Typography" description="SF Pro Display. Line heights are the one value not taken from Figma — see the note in typography.ts.">
        <div style={{ backgroundColor: color.main.white, border: `1px solid ${color.navbar.border}`, borderRadius: radius.s, padding: spacing.l }}>
          {Object.entries(typography.textStyle).map(([name, style]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'baseline', gap: spacing.m, marginBottom: spacing.s, borderBottom: `1px solid ${color.main.background}`, paddingBottom: spacing.s }}>
              <code style={{ ...textStyle.sRegular, fontFamily: typography.fontFamily.mono, color: color.main.description, width: 110, flexShrink: 0 }}>
                {name}
              </code>
              <div style={{ ...style, color: color.navbar.textActive, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                The quick brown fox
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Spacing" description="Note: the spacing and radius scales share T-shirt names but differ — S is 12 here, 8 in radius.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
          {Object.entries(spacing).map(([name, value]) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: spacing.s }}>
              <code style={{ ...textStyle.sRegular, fontFamily: typography.fontFamily.mono, width: 60, color: color.main.description }}>{name}</code>
              <div style={{ height: 16, width: value, backgroundColor: color.main.brand, borderRadius: radius.xxs }} />
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>{value}px</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radius">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.m }}>
          {Object.entries(radius).map(([name, value]) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, backgroundColor: color.badge.background, border: `2px solid ${color.main.brand}`, borderRadius: value }} />
              <div style={{ ...textStyle.sMedium, marginTop: spacing.xxs, color: color.navbar.textActive }}>{name}</div>
              <div style={{ ...textStyle.sRegular, color: color.main.description }}>{value}px</div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Shadow"
        description="Two elevations. `base` is ambient — for surfaces that sit within the page. `popup` is tighter, for transient surfaces that float above it; a wide spread would make a dropdown read as part of the layout."
      >
        <div style={{ display: 'flex', gap: spacing.xl, padding: spacing.l, flexWrap: 'wrap' }}>
          {([
            ['base', shadow.base, 'Cards, panels, raised surfaces'],
            ['popup', shadow.popup, 'Dropdowns, menus, popovers, dialogs'],
          ] as const).map(([name, value, usage]) => (
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
    </>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
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
            <div style={{ ...textStyle.sMedium, color: color.navbar.textActive, marginTop: spacing.xxs }}>{name}</div>
            <code style={{ ...textStyle.sRegular, fontFamily: typography.fontFamily.mono, color: color.main.description, wordBreak: 'break-all' }}>
              {value}
            </code>
          </div>
        );
      })}
    </div>
  );
}
