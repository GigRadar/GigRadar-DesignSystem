import { color, component, radius, spacing, textStyle, typography } from '@gigradar/theme';
import { useState, type ReactNode } from 'react';

type CodeBlockProps = {
  code: string;
  /**
   * Source is shown for understanding, not for copying into an app.
   * When true, the block is labelled accordingly.
   */
  readingOnly?: boolean;
  label?: ReactNode;
  /**
   * Expanded on load. Code sits next to the preview it explains, so the
   * default is open — collapsing is for getting a long page back under
   * control, not the normal reading state.
   */
  defaultOpen?: boolean;
};

export function CodeBlock({ code, readingOnly = false, label, defaultOpen = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  const lineCount = code.split('\n').length;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      style={{
        border: `${component.docs.panel.borderWidth}px solid ${color.navbar.border}`,
        borderRadius: component.docs.panel.radius,
        overflow: 'hidden',
        backgroundColor: color.main.white,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: `${component.docs.panel.paddingY}px ${component.docs.panel.paddingX}px`,
          backgroundColor: color.main.backgroundAlt,
          borderBottom: `1px solid ${color.navbar.border}`,
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          style={{
            ...textStyle.sMedium,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.xxs,
            // Fills the header so the whole strip is the hit target, not just
            // the words — the chevron sits at the far right of it.
            width: '100%',
            padding: 0,
            border: 'none',
            background: 'none',
            fontFamily: typography.fontFamily.base,
            color: color.main.description,
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.xxs }}>
            {label ?? (readingOnly ? 'Source — for reading, not for pasting' : 'Usage')}
            {!open && <span style={{ opacity: 0.7 }}>({lineCount} lines)</span>}
          </span>
          <Chevron direction={open ? 'down' : 'up'} />
        </button>
      </div>
      {open && (
        <div style={{ position: 'relative' }}>
          <button
            onClick={handleCopy}
            aria-label={copied ? 'Copied' : 'Copy code'}
            style={{
              ...textStyle.sMedium,
              position: 'absolute',
              top: spacing.xs,
              right: spacing.xs,
              // Above the code it floats over, so a long line scrolling
              // underneath cannot cover it.
              zIndex: 1,
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
          <pre
            style={{
              margin: 0,
              padding: spacing.s,
              // Keeps the longest line clear of the floating Copy button.
              paddingRight: spacing.xxl,
              overflowX: 'auto',
              fontFamily: typography.fontFamily.mono,
              fontSize: 12,
              lineHeight: 1.6,
              color: color.navbar.textActive,
            }}
          >
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * The expand/collapse chevron.
 *
 * Drawn as an SVG rather than a rotated text glyph — `▾` renders at a
 * different weight and baseline in every font, and the arrow must line up with
 * the label beside it.
 */
function Chevron({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      style={{
        flexShrink: 0,
        transition: 'transform 120ms ease',
        transform: direction === 'up' ? 'rotate(180deg)' : 'none',
      }}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
