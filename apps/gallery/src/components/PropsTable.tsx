import { color, radius, spacing, textStyle, typography } from '@gigradar/theme';

export type PropRow = {
  name: string;
  type: string;
  default?: string;
  description: string;
};

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
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
            {['Prop', 'Type', 'Default', 'Description'].map((heading) => (
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
              <td style={{ ...textStyle.sSemibold, padding: `${spacing.xs}px ${spacing.s}px`, fontFamily: typography.fontFamily.mono, color: color.main.brand }}>
                {row.name}
              </td>
              <td style={{ ...textStyle.sRegular, padding: `${spacing.xs}px ${spacing.s}px`, fontFamily: typography.fontFamily.mono, color: color.accent.schedule.main }}>
                {row.type}
              </td>
              <td style={{ ...textStyle.sRegular, padding: `${spacing.xs}px ${spacing.s}px`, fontFamily: typography.fontFamily.mono, color: color.main.description }}>
                {row.default ?? '—'}
              </td>
              <td style={{ ...textStyle.sRegular, padding: `${spacing.xs}px ${spacing.s}px`, color: color.navbar.textActive }}>
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
