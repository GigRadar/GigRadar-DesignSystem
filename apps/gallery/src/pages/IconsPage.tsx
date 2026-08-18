import { color, radius, spacing, textStyle, typography } from '@gigradar/theme';
import { Icon, IconFailedErrorStroke, IconSearch, IconSendPlaneFill } from '@gigradar/ui';
import { useState } from 'react';
import { fillIcons, strokeIcons } from '../../../../packages/ui/src/icons/registry';
import { CodeBlock } from '../components/CodeBlock';
import { PageHeader, Preview, Section } from '../layout';

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

      <Section
        title="How to use"
        description="Each icon is a named export — the icon's kebab-case name in PascalCase with an Icon prefix, so send-plane-fill becomes IconSendPlaneFill. Click any icon below to copy its name. Import icons individually; your bundle carries only the ones you name."
      >
        <Preview>
          <Icon icon={IconSearch} size={16} />
          <Icon icon={IconSendPlaneFill} label="Send message" />
          <span
            style={{
              ...textStyle.mRegular,
              color: color.status.error.text,
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xxs,
            }}
          >
            <Icon icon={IconFailedErrorStroke} size={16} /> Failed to send
          </span>
        </Preview>
        <CodeBlock
          code={`import { Icon, IconSearch, IconSendPlaneFill, IconFailedErrorStroke } from '@gigradar/ui';

// Decorative (the default): hidden from screen readers —
// the text beside it carries the meaning.
<Icon icon={IconSearch} size={16} />

// Standing alone (an icon-only button, a status glyph): give it a label.
<Icon icon={IconSendPlaneFill} label="Send message" />

// Color: icons inherit the surrounding text color, so tint the text and
// the icon follows — one source of truth for both.
<span style={{ color: color.status.error.text }}>
  <Icon icon={IconFailedErrorStroke} size={16} /> Failed to send
</span>

// Sizes: 24 is the drawn grid; 16 matches button icon slots and body text.`}
        />
      </Section>

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
            color: color.navbar.text2,
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
                    color: color.navbar.text2,
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
