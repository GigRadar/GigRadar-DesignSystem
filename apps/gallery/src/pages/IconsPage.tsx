import { color, radius, spacing, textStyle, typography } from '@uiuxjoseph/theme';
import { Icon } from '@uiuxjoseph/ui';
import { useState } from 'react';
import { fillIcons, strokeIcons } from '../../../../packages/ui/src/icons/registry';
import { PageHeader, Section } from '../layout';

/**
 * The icon set, straight from the registry. The registry module imports every
 * icon, which is exactly right here and exactly wrong in an app — product code
 * imports individual icons (`IconLockFill`) so bundles stay lean.
 */
export function IconsPage() {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const q = query.trim().toLowerCase();
  const total = fillIcons.length + strokeIcons.length;

  const copyName = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopied(name);
    window.setTimeout(() => setCopied((current) => (current === name ? null : current)), 1200);
  };

  const groups: { title: string; icons: typeof fillIcons }[] = [
    { title: `Fill (${fillIcons.length})`, icons: fillIcons },
    { title: `Stroke (${strokeIcons.length})`, icons: strokeIcons },
  ];

  return (
    <>
      <PageHeader
        title="Icons"
        description={`${total} icons from the Figma icon set, drawn on a 24×24 grid in fill and stroke weights. All are monochrome and follow the surrounding text color. Click an icon to copy its name.`}
      />

      <div style={{ marginBottom: spacing.l }}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={`Search ${total} icons…`}
          aria-label="Search icons"
          style={{
            ...textStyle.mRegular,
            fontFamily: typography.fontFamily.base,
            width: 320,
            padding: `${spacing.xs}px ${spacing.s}px`,
            border: `1px solid ${color.main.border}`,
            borderRadius: radius.s,
            color: color.navbar.textActive,
            backgroundColor: color.main.white,
          }}
        />
      </div>

      {groups.map(({ title, icons }) => {
        const visible = q ? icons.filter((icon) => icon.name.includes(q)) : icons;
        if (visible.length === 0) return null;
        return (
          <Section key={title} title={title}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))',
                gap: spacing.xs,
              }}
            >
              {visible.map((icon) => (
                <button
                  key={icon.name}
                  onClick={() => copyName(icon.name)}
                  title={icon.figmaName ? `Figma: ${icon.figmaName}` : icon.name}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: spacing.xs,
                    padding: `${spacing.s}px ${spacing.xxs}px`,
                    border: `1px solid ${copied === icon.name ? color.status.success.main : 'transparent'}`,
                    borderRadius: radius.s,
                    backgroundColor: copied === icon.name ? color.status.success.background : 'transparent',
                    cursor: 'pointer',
                    color: color.navbar.textActive,
                  }}
                  onMouseEnter={(event) => {
                    if (copied !== icon.name) event.currentTarget.style.backgroundColor = color.navbar.hover;
                  }}
                  onMouseLeave={(event) => {
                    if (copied !== icon.name) event.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <Icon icon={icon} />
                  <span
                    style={{
                      ...textStyle.sRegular,
                      fontFamily: typography.fontFamily.mono,
                      fontSize: 10,
                      color: copied === icon.name ? color.status.success.text : color.main.description,
                      wordBreak: 'break-all',
                      textAlign: 'center',
                      lineHeight: 1.3,
                    }}
                  >
                    {copied === icon.name ? 'copied' : icon.name}
                  </span>
                </button>
              ))}
            </div>
          </Section>
        );
      })}
    </>
  );
}
