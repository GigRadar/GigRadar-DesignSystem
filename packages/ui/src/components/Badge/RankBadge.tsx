import { color, component, typography, type BadgeSize } from '@uiuxjoseph/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { badge } = component;

/**
 * The rank badge's states, as Figma draws them (node 333:15163).
 *
 * Figma has seven variants, but two pairs are the same drawing: "UP Rank" /
 * "[UP] Mirror" and "DOWN Rank" / "[DOWN] Mirror" differ only in which way the
 * triangle is flipped, which is the direction itself. So the seven collapse to
 * four states plus a direction:
 *
 *   up      green pill, triangle pointing up
 *   down    salmon pill, triangle pointing down
 *   none    grey pill with a dash — ranked, but no position yet
 *   syncing brand-colored, no pill — the rank is being fetched
 *   error   red, no pill — the fetch failed
 */
export type RankState = 'up' | 'down' | 'none' | 'syncing' | 'error';

export type RankBadgeStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  fontSize?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  /** Triangle edge length. */
  triangleSize?: CssLength;
  background?: string;
  textColor?: string;
};

export type RankBadgeProps = {
  /**
   * The position. Rendered as given, so "11", "1,204", and "#3" all work —
   * unlike the counter, this badge is a pill and grows with its content.
   */
  rank?: number | string;
  /**
   * Which state to draw. Defaults to `none` so a badge with no data renders
   * the dash rather than an empty pill.
   */
  state?: RankState;
  size?: BadgeSize;
  /**
   * Accessible description, e.g. "Rank 11, up from yesterday". The triangle
   * alone does not say "up" to a screen reader.
   */
  label?: string;
} & RankBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/**
 * Per-state fill and text color, every value a theme token.
 *
 * `up` uses the success pair and `down` the decrease pair — the same colors
 * the guidebook gives a rising and falling metric, which is what a rank change
 * is. `syncing` and `error` have no pill in Figma: they are a glyph on the
 * surrounding surface, so their background is transparent.
 */
const states: Record<RankState, { background: string; text: string }> = {
  up: { background: color.status.success.background, text: color.status.success.text },
  down: { background: color.accent.decrease.background, text: color.accent.decrease.text },
  none: { background: color.disable.background, text: color.disable.text },
  syncing: { background: 'transparent', text: color.main.brand },
  error: { background: 'transparent', text: color.status.error.main },
};

/**
 * The rank or position badge — a position with its direction of travel.
 *
 * Figma: node 333:15163.
 */
export const RankBadge = forwardRef<HTMLSpanElement, RankBadgeProps>(function RankBadge(
  {
    rank,
    state = 'none',
    size = 'medium',
    label,
    paddingX,
    paddingY,
    fontSize,
    gap,
    radius,
    triangleSize,
    background,
    textColor,
    ...rest
  },
  ref,
) {
  const palette = states[state];
  const bare = state === 'syncing' || state === 'error';
  const triangle = len(triangleSize) ?? `${badge.rank.triangleSize[size]}px`;

  const style: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    gap: len(gap) ?? `${badge.gap[size]}px`,
    padding: bare
      ? 0
      : `${len(paddingY) ?? `${badge.paddingY[size]}px`} ${len(paddingX) ?? `${badge.rank.paddingX[size]}px`}`,
    borderRadius: len(radius) ?? `${badge.radius}px`,
    backgroundColor: background ?? palette.background,
    color: textColor ?? palette.text,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${badge.fontSize[size]}px`,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    whiteSpace: 'nowrap',
  };

  return (
    <span {...rest} ref={ref} style={style} role={label ? 'img' : undefined} aria-label={label}>
      {(state === 'up' || state === 'down') && (
        <Triangle size={triangle} direction={state} />
      )}
      {state === 'syncing' && <SyncGlyph size={triangle} />}
      {state === 'error' && <ErrorGlyph size={triangle} />}
      {state === 'none' ? '-' : state === 'up' || state === 'down' ? rank : null}
    </span>
  );
});

function Triangle({ size, direction }: { size: string; direction: 'up' | 'down' }) {
  return (
    <svg
      viewBox="0 0 10 10"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      style={{
        flexShrink: 0,
        display: 'block',
        transform: direction === 'down' ? 'scaleY(-1)' : undefined,
      }}
    >
      <path d="M5 1.5 9.33 8.5H0.67L5 1.5Z" />
    </svg>
  );
}

/** A circular arrow, for the in-flight state. */
function SyncGlyph({ size }: { size: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
      style={{ flexShrink: 0, display: 'block' }}
    >
      <path d="M12 7a5 5 0 1 1-1.46-3.54" />
      <path d="M12 1.5V4.5H9" strokeLinejoin="round" />
    </svg>
  );
}

/** An exclamation mark, for the failed state. */
function ErrorGlyph({ size }: { size: string }) {
  return (
    <svg
      viewBox="0 0 14 14"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      style={{ flexShrink: 0, display: 'block' }}
    >
      <rect x="6" y="1.5" width="2" height="7" rx="1" />
      <circle cx="7" cy="11.5" r="1.25" />
    </svg>
  );
}
