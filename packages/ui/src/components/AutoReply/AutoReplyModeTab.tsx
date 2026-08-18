import { borderWidth, color, component, typography } from '@gigradar/theme';
import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { ModeBadge, type ReplyMode } from './ModeBadge.js';

const { autoReply } = component;

/** Per-instance overrides for the tab's own metrics. */
export type AutoReplyModeTabStyleProps = {
  height?: CssLength;
  padding?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  fontSize?: CssLength;
  borderColor?: string;
};

export type AutoReplyModeTabProps = {
  /** The message class this tab configures — "First Message", "Other Message". */
  label: ReactNode;
  /** The mode that class currently runs in. Drawn as a badge beside the label. */
  mode?: ReplyMode;
  /** Whether this tab is the open one. */
  selected?: boolean;
} & AutoReplyModeTabStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * One tab of the Auto Reply card — Figma node 4498:4818.
 *
 * A selected tab is white with black text and rounds its top corners, sitting
 * flush against the panel below it; an unselected one drops to the page
 * background, keeps only its bottom border, and dims its label. That asymmetry
 * is the whole point: the selected tab and the panel read as one surface, and
 * the unselected one reads as the edge of another.
 */
export const AutoReplyModeTab = forwardRef<HTMLButtonElement, AutoReplyModeTabProps>(
  function AutoReplyModeTab(
    {
      label,
      mode,
      selected = false,
      height,
      padding,
      gap,
      radius,
      fontSize,
      borderColor,
      ...rest
    },
    ref,
  ) {
    const edge = borderColor ?? color.navbar.hover;
    const corner = len(radius) ?? `${autoReply.tab.radius}px`;

    const style: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: len(gap) ?? `${autoReply.tab.gap}px`,
      boxSizing: 'border-box',
      flex: '1 1 0',
      minWidth: 0,
      height: len(height) ?? autoReply.tab.height,
      padding: len(padding) ?? autoReply.tab.padding,
      // Only the selected tab carries side and top borders — the unselected one
      // has a bottom border instead, which continues the panel's edge under it.
      border: selected ? `${borderWidth.thin}px solid ${edge}` : 'none',
      borderBottom: selected ? 'none' : `${borderWidth.thin}px solid ${edge}`,
      borderTopLeftRadius: selected ? corner : 0,
      borderTopRightRadius: selected ? corner : 0,
      backgroundColor: selected ? color.main.white : color.main.background,
      color: selected ? color.main.black : color.navbar.text,
      fontFamily: typography.fontFamily.base,
      fontSize: len(fontSize) ?? `${autoReply.tab.fontSize}px`,
      fontWeight: typography.fontWeight.medium,
      letterSpacing: typography.letterSpacing.m,
      lineHeight: 1,
      textAlign: 'left',
      cursor: 'pointer',
      appearance: 'none',
      overflow: 'hidden',
    };

    return (
      <button {...rest} ref={ref} type="button" role="tab" aria-selected={selected} style={style}>
        <span
          style={{
            flex: '1 1 auto',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </span>
        {mode && <ModeBadge mode={mode} />}
      </button>
    );
  },
);
