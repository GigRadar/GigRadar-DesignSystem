import { color, radius, spacing, textStyle, typography } from '@uiuxjoseph/theme';
import { useId, useState, type ReactNode } from 'react';

export type CssPropRow = {
  /** Variable name without the `--gr-` prefix, e.g. "button-height-medium". */
  name: string;
  value: string;
  description: string;
};

/**
 * Lists a component's CSS custom properties and lets you override them live.
 *
 * The live editor matters more than the table: reading that
 * `--gr-button-height-medium` exists is not the same as seeing the button
 * change when you set it. Overrides are scoped to the preview above, so
 * experimenting here cannot affect the rest of the gallery.
 */
export function CssPropsTable({ rows, children }: { rows: CssPropRow[]; children?: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const scopeId = useId().replace(/:/g, '');

  const activeOverrides = Object.entries(overrides).filter(([, v]) => v.trim() !== '');

  const scopeStyle = Object.fromEntries(
    activeOverrides.map(([name, value]) => [`--gr-${name}`, value]),
  ) as Record<string, string>;

  return (
    <div>
      {children && (
        <div
          id={scopeId}
          style={{
            ...scopeStyle,
            padding: spacing.l,
            backgroundColor: color.main.white,
            border: `1px solid ${color.navbar.border}`,
            borderRadius: radius.s,
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.s,
            alignItems: 'center',
            marginBottom: spacing.s,
          }}
        >
          {children}
        </div>
      )}

      <div
        style={{
          border: `1px solid ${color.navbar.border}`,
          borderRadius: radius.s,
          overflow: 'hidden',
          backgroundColor: color.main.white,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: typography.fontFamily.base }}>
          <thead>
            <tr style={{ backgroundColor: color.main.backgroundAlt }}>
              {['CSS property', 'Default', 'Try a value', 'Description'].map((heading) => (
                <th
                  key={heading}
                  style={{
                    ...textStyle.sSemibold,
                    textAlign: 'left',
                    padding: `${spacing.xs}px ${spacing.s}px`,
                    color: color.main.description,
                    borderBottom: `1px solid ${color.navbar.border}`,
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.name} style={{ borderTop: index === 0 ? undefined : `1px solid ${color.navbar.border}` }}>
                <td style={{ ...textStyle.sRegular, padding: `${spacing.xs}px ${spacing.s}px`, fontFamily: typography.fontFamily.mono, color: color.main.brand, whiteSpace: 'nowrap' }}>
                  --gr-{row.name}
                </td>
                <td style={{ ...textStyle.sRegular, padding: `${spacing.xs}px ${spacing.s}px`, fontFamily: typography.fontFamily.mono, color: color.main.description }}>
                  {row.value}
                </td>
                <td style={{ padding: `${spacing.xxs}px ${spacing.s}px` }}>
                  <input
                    value={overrides[row.name] ?? ''}
                    onChange={(event) =>
                      setOverrides((prev) => ({ ...prev, [row.name]: event.target.value }))
                    }
                    placeholder={row.value}
                    aria-label={`Override --gr-${row.name}`}
                    style={{
                      ...textStyle.sRegular,
                      fontFamily: typography.fontFamily.mono,
                      width: 90,
                      padding: `${spacing.xxs}px ${spacing.xs}px`,
                      border: `1px solid ${color.main.border}`,
                      borderRadius: radius.xs,
                      color: color.navbar.textActive,
                    }}
                  />
                </td>
                <td style={{ ...textStyle.sRegular, padding: `${spacing.xs}px ${spacing.s}px`, color: color.navbar.textActive }}>
                  {row.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeOverrides.length > 0 && (
        <div style={{ marginTop: spacing.s }}>
          <div style={{ ...textStyle.sMedium, color: color.main.description, marginBottom: spacing.xxs }}>
            Paste into your app's stylesheet:
          </div>
          <pre
            style={{
              margin: 0,
              padding: spacing.s,
              backgroundColor: color.main.backgroundAlt,
              border: `1px solid ${color.navbar.border}`,
              borderRadius: radius.s,
              fontFamily: typography.fontFamily.mono,
              fontSize: 12,
              lineHeight: 1.6,
              color: color.navbar.textActive,
              overflowX: 'auto',
            }}
          >
            <code>
              {`.your-scope {\n${activeOverrides.map(([n, v]) => `  --gr-${n}: ${v};`).join('\n')}\n}`}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
}
