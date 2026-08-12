import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { autoReply } = component;

/**
 * How Laziza handles a class of message.
 *
 * `fullAuto` sends without review, `coPilot` drafts for approval, `off`
 * disables replies. `other` is the neutral tone Figma uses when a badge names
 * a mode it is not itself set to.
 */
export type ReplyMode = 'fullAuto' | 'coPilot' | 'off' | 'other';

/** Per-instance overrides for the badge's own metrics. */
export type ModeBadgeStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  radius?: CssLength;
  fontSize?: CssLength;
  gap?: CssLength;
  /** Pill fill. Overrides the mode's own. */
  background?: string;
  /** Label color. Overrides the mode's own. */
  textColor?: string;
};

export type ModeBadgeProps = {
  /**
   * Which mode the badge names.
   *
   * @default 'fullAuto'
   */
  mode?: ReplyMode;
  /** Overrides the label. Each mode has a default. */
  children?: ReactNode;
  /**
   * A second label after a separator dot — Figma's `text2`.
   *
   * Used where one badge reports two things at once, such as a thread whose
   * first message and later messages run in different modes.
   */
  secondaryLabel?: ReactNode;
} & ModeBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * The palette and default label per mode — Figma node 4498:4800.
 *
 * Every value is a token: the two Laziza oranges separate "sends on its own"
 * from "waits for you", and `off` drops to the neutral nav pair so a disabled
 * thread reads as inactive rather than as a third mode.
 */
const modes: Record<ReplyMode, { background: string; text: string; label: string }> = {
  fullAuto: { background: color.accent.laziza.main, text: color.main.white, label: 'Full Auto' },
  coPilot: {
    background: color.accent.laziza.backgroundAlt,
    text: color.main.white,
    label: 'Co-pilot',
  },
  off: { background: color.navbar.hover, text: color.navbar.text, label: 'OFF' },
  other: {
    background: color.accent.laziza.background,
    text: color.accent.laziza.main,
    label: 'Other',
  },
};

/**
 * The pill naming an auto-reply mode.
 *
 * Figma: node 4498:4800 ("Mode badge"), with four variants.
 *
 * Not a step of the badge family. Those are built around 12px text in a tight
 * pill and carry their own meanings — credit, rank, count, account status —
 * where this is 14px in a fully round pill and names a mode. Sharing the block
 * would mean overriding padding, type size, and palette, which is every value
 * a badge has.
 */
export const ModeBadge = forwardRef<HTMLSpanElement, ModeBadgeProps>(function ModeBadge(
  {
    mode = 'fullAuto',
    children,
    secondaryLabel,
    paddingX,
    paddingY,
    radius,
    fontSize,
    gap,
    background,
    textColor,
    ...rest
  },
  ref,
) {
  const palette = modes[mode];
  const label = textColor ?? palette.text;

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    gap: len(gap) ?? `${autoReply.modeBadge.gap}px`,
    padding: `${len(paddingY) ?? `${autoReply.modeBadge.paddingY}px`} ${
      len(paddingX) ?? `${autoReply.modeBadge.paddingX}px`
    }`,
    borderRadius: len(radius) ?? `${autoReply.modeBadge.radius}px`,
    backgroundColor: background ?? palette.background,
    color: label,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${autoReply.modeBadge.fontSize}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.m,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  return (
    <span {...rest} ref={ref} style={style}>
      {children ?? palette.label}
      {secondaryLabel !== undefined && (
        <>
          <span
            aria-hidden
            style={{
              display: 'block',
              flexShrink: 0,
              width: autoReply.modeBadge.dotSize,
              height: autoReply.modeBadge.dotSize,
              borderRadius: '50%',
              // The separator takes the label's color, so it stays legible on
              // both the filled and the pale variants.
              backgroundColor: label,
            }}
          />
          {secondaryLabel}
        </>
      )}
    </span>
  );
});
