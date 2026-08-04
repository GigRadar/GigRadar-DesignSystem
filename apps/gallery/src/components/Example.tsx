import { color, radius, spacing, textStyle, typography } from '@uiuxjoseph/theme';
import { useState, type ReactNode } from 'react';

/**
 * A live example with its JSX collapsed underneath.
 *
 * The pattern follows Chakra's docs: the rendered result is what you look at,
 * and the code is one click away when you want to copy it. Collapsing it by
 * default keeps a page of twelve examples readable — the alternative is a wall
 * of code you scroll past to reach the next preview.
 */
export function Example({
  code,
  children,
  label = 'Show code',
  defaultOpen = false,
}: {
  code: string;
  children: ReactNode;
  label?: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        border: `1px solid ${color.navbar.border}`,
        borderRadius: radius.s,
        overflow: 'hidden',
        backgroundColor: color.main.white,
        marginBottom: spacing.s,
      }}
    >
      {/* Preview */}
      <div
        style={{
          padding: spacing.l,
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing.s,
          alignItems: 'center',
        }}
      >
        {children}
      </div>

      {/* Toggle bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.s,
          padding: `${spacing.xxs}px ${spacing.s}px`,
          borderTop: `1px solid ${color.navbar.border}`,
          backgroundColor: color.main.background,
        }}
      >
        <button
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          style={{
            ...textStyle.sMedium,
            fontFamily: typography.fontFamily.base,
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xxs,
            padding: `${spacing.xxs}px ${spacing.xs}px`,
            border: 'none',
            background: 'none',
            color: color.main.description,
            cursor: 'pointer',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-block',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 120ms ease',
              fontSize: 10,
            }}
          >
            ▶
          </span>
          {open ? 'Hide code' : label}
        </button>

        {open && (
          <button
            onClick={handleCopy}
            style={{
              ...textStyle.sMedium,
              fontFamily: typography.fontFamily.base,
              padding: `${spacing.xxs}px ${spacing.xs}px`,
              borderRadius: radius.xs,
              border: `1px solid ${color.main.border}`,
              backgroundColor: color.main.white,
              color: copied ? color.status.success.text : color.main.description,
              cursor: 'pointer',
            }}
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {open && (
        <pre
          style={{
            margin: 0,
            padding: spacing.s,
            borderTop: `1px solid ${color.navbar.border}`,
            overflowX: 'auto',
            fontFamily: typography.fontFamily.mono,
            fontSize: 12,
            lineHeight: 1.6,
            color: color.navbar.textActive,
            backgroundColor: color.main.white,
          }}
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
