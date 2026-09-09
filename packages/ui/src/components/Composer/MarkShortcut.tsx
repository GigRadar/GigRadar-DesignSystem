import { color, component, textStyle } from '@gigradar/theme';
import type { CSSProperties, ReactNode } from 'react';
import { CommandKey, Key, PlatformMark, Plus } from './markGlyphs.js';

const { markTooltip } = component.middle.composer;

/** Which mark the shortcut applies. Matches `ComposerField`'s `TextMark`. */
export type MarkShortcutName = 'bold' | 'italic' | 'strike' | 'code';

/**
 * What each mark is called, how it is written, and what it is bound to.
 *
 * The title is drawn in the mark it names — a bold "Bold", a struck-through
 * "Strikethrough" — so the tooltip shows the effect as well as saying it, which
 * is the one thing a row of similar letterforms cannot do on its own.
 *
 * The modifiers differ per platform only in the first key, so the shared tail
 * is written once and each row supplies its own head.
 */
const MARKS: Record<
  MarkShortcutName,
  { title: string; style: CSSProperties; keys: string[]; phrase: string }
> = {
  bold: {
    title: 'Bold',
    style: { fontWeight: 700 },
    keys: ['B'],
    phrase: 'to make bold',
  },
  italic: {
    title: 'Italic',
    style: { fontStyle: 'italic' },
    keys: ['I'],
    phrase: 'to make italic',
  },
  strike: {
    title: 'Strikethrough',
    style: { textDecoration: 'line-through' },
    keys: ['Shift', 'X'],
    phrase: 'to make strikethrough',
  },
  code: {
    title: 'Code',
    style: {},
    keys: ['Shift', 'C'],
    phrase: 'to make code',
  },
};

export type MarkShortcutProps = {
  /** Which mark to describe. */
  mark: MarkShortcutName;
};

/**
 * The body of the tooltip a rich-text mark opens.
 *
 * Figma: nodes 7843:662917, 662945, 663001 and 663040 — one card per mark,
 * each naming the mark and then giving the shortcut twice, once for macOS and
 * once for Windows.
 *
 * Built as content rather than as its own tooltip so it goes through the
 * system's `Tooltip` unchanged, and inherits its positioning, delay, focus
 * wiring and ARIA along with it:
 *
 *   <Tooltip content={<MarkShortcut mark="bold" />}>…</Tooltip>
 *
 * The card's `title` slot is deliberately not used: that slot is the badge blue
 * at a larger step, and Figma draws this title in the body's own colour and size
 * with the mark applied to it. Passing it as `title` would recolour and resize
 * the one piece of text whose appearance is the point.
 */
export function MarkShortcut({ mark }: MarkShortcutProps) {
  const { title, style, keys, phrase } = MARKS[mark];

  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: markTooltip.gap,
      }}
    >
      <span style={{ ...textStyle.sMedium, color: color.main.description, ...style }}>{title}</span>
      <ShortcutRow
        platform="mac"
        keys={[<CommandKey key="command" />, ...keys]}
        phrase={phrase}
      />
      <ShortcutRow
        platform="windows"
        keys={['Ctrl', ...keys]}
        phrase={phrase}
      />
    </span>
  );
}

/** One platform's line: its mark, the keys, and what pressing them does. */
function ShortcutRow({
  platform,
  keys,
  phrase,
}: {
  platform: 'mac' | 'windows';
  keys: ReactNode[];
  phrase: string;
}) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: markTooltip.rowGap }}>
      <PlatformMark platform={platform} />
      <span style={{ display: 'flex', alignItems: 'center', gap: markTooltip.keyGap }}>
        {keys.map((key, index) => (
          // The keys are a fixed list per mark, so the index is stable.
          <span key={index} style={{ display: 'contents' }}>
            {index > 0 && <Plus />}
            {typeof key === 'string' ? <Key>{key}</Key> : key}
          </span>
        ))}
        <span
          style={{
            ...textStyle.sRegular,
            color: color.main.description,
            whiteSpace: 'nowrap',
          }}
        >
          &nbsp;{phrase}
        </span>
      </span>
    </span>
  );
}

