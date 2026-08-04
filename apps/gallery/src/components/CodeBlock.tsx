import { color, radius, spacing, textStyle, typography } from '@uiuxjoseph/theme';
import { useState, type ReactNode } from 'react';

type CodeBlockProps = {
  code: string;
  /**
   * Source is shown for understanding, not for copying into an app.
   * When true, the block is labelled accordingly.
   */
  readingOnly?: boolean;
  label?: ReactNode;
};

export function CodeBlock({ code, readingOnly = false, label }: CodeBlockProps) {
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
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.s,
          padding: `${spacing.xs}px ${spacing.s}px`,
          backgroundColor: color.main.backgroundAlt,
          borderBottom: `1px solid ${color.navbar.border}`,
        }}
      >
        <span style={{ ...textStyle.sMedium, color: color.main.description }}>
          {label ?? (readingOnly ? 'Source — for reading, not for pasting' : 'Usage')}
        </span>
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
      </div>
      <pre
        style={{
          margin: 0,
          padding: spacing.s,
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
  );
}
