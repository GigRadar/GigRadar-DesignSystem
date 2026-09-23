import { color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconInfoStroke } from '../../icons/defs.js';
import { RankBadge, type RankState } from '../Badge/RankBadge.js';

const { stats } = component.dashboard;

/** Per-instance overrides for a stat column's own metrics. */
export type FunnelStatStyleProps = {
  width?: CssLength;
  paddingX?: CssLength;
  gap?: CssLength;
  figureFontSize?: CssLength;
};

/** One of the two small numbers under the headline figure. */
export type FunnelStatMetric = {
  /** What it counts — "Total Reply", "Cost per reply". */
  label: string;
  /** The count, already formatted. "134", "$124". */
  value: string;
};

export type FunnelStatProps = {
  /** The step's name — "Qualified Reply Rate". */
  label: ReactNode;
  /** The headline percentage, already formatted. */
  value: ReactNode;
  /**
   * The change against the comparison period, drawn as a rank badge.
   *
   * Omit it and no badge appears: a step with nothing to compare against
   * should show its figure alone rather than a grey placeholder pill, which
   * reads as "no change" when the truth is "no comparison".
   */
  change?: { value: number | string; direction: RankState };
  /** The sub-metrics under the figure. Figma draws two; more would wrap. */
  metrics?: FunnelStatMetric[];
  /**
   * Colors the figure — the closing rates are drawn in their outcome's color
   * while the middle of the funnel stays black.
   *
   * A color rather than a tone name: which steps count as won or lost is a
   * property of the funnel being shown, not of this component.
   */
  valueColor?: string;
  /** Shows the info glyph beside the label, and what it explains. */
  hint?: string;
  /** Replaces every line with a grey bar while the figures load. @default false */
  loading?: boolean;
} & FunnelStatStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** A grey bar standing in for one line of a stat while it loads. */
function SkeletonBar({ width, height }: { width: CssLength; height: CssLength }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'block',
        width: len(width),
        height: len(height),
        borderRadius: stats.skeletonRadius,
        backgroundColor: color.disable.background,
      }}
    />
  );
}

/**
 * One step of the funnel — a rate, its movement, and what it is made of.
 *
 * Figma: "Section Content" (node 751:7118), which draws three states — the
 * figures, the loading bars, and the two placeholder boxes the funnel chart
 * shows in its own loading state.
 *
 * The sub-metrics are a list rather than two named props because what they
 * count changes per step: replies carry "Total Reply" and "Cost per reply",
 * the closing rates carry deals and an acquisition cost. Naming them here
 * would bake one step's vocabulary into every other step.
 */
export const FunnelStat = forwardRef<HTMLDivElement, FunnelStatProps>(function FunnelStat(
  {
    label,
    value,
    change,
    metrics = [],
    valueColor,
    hint,
    loading = false,
    width,
    paddingX,
    gap,
    figureFontSize,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        // Top-aligned, not centred. The closing-rates column is two stats tall
        // and centring would float every other column's figure down to meet
        // it, breaking the line the figures are meant to be read along.
        justifyContent: 'flex-start',
        gap: len(gap) ?? stats.gap,
        boxSizing: 'border-box',
        // An equal share of the band's width, shrinking with its siblings
        // rather than holding a fixed size: the band is one row that never
        // wraps, so every column has to give ground together.
        //
        // `minWidth: 0` is what allows the shrink at all — a flex child will
        // not go below its content's width without it, which would push the
        // last steps off the end instead.
        flex: `1 1 ${len(width) ?? `${stats.columnWidth}px`}`,
        minWidth: stats.columnMinWidth,
        padding: `0 ${len(paddingX) ?? `${stats.columnPaddingX}px`}`,
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: stats.tightGap }}>
        {loading ? (
          <SkeletonBar width={stats.skeletonTitleWidth} height={stats.skeletonTitleHeight} />
        ) : (
          <span
            style={{
              ...textStyle.mMedium,
              display: 'flex',
              alignItems: 'center',
              gap: component.dashboard.stats.gap,
              color: color.main.black,
              // Two lines was never a real reading — "Appointment Booked"
              // wrapped its second word under the figure below it, not under
              // its own first word, because the label is a flex row and it is
              // the row that wraps. One line, clipped, is what Figma draws.
              minWidth: 0,
            }}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                minWidth: 0,
              }}
            >
              {label}
            </span>
            {hint != null && (
              <span style={{ flexShrink: 0, display: 'inline-flex' }}>
                <Icon icon={IconInfoStroke} size={14} color={color.navbar.text} label={hint} />
              </span>
            )}
          </span>
        )}

        {loading ? (
          <SkeletonBar width={96} height={stats.figureFontSize} />
        ) : (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: stats.gap * 2 }}>
            <span
              style={{
                ...textStyle.h3,
                fontSize: len(figureFontSize) ?? stats.figureFontSize,
                letterSpacing: stats.figureLetterSpacing,
                color: valueColor ?? color.main.black,
              }}
            >
              {value}
            </span>
            {change != null && (
              <RankBadge
                rank={change.value}
                state={change.direction}
                label={`${change.value} against the previous period`}
              />
            )}
          </span>
        )}
      </div>

      {/* Each metric is its own block rather than a label/value pair on one
          row: Figma stacks the name above the number so the numbers share a
          left edge and can be read down the column without the labels in
          between. */}
      {metrics.map((metric) =>
        loading ? (
          <div key={metric.label} style={{ display: 'flex', flexDirection: 'column', gap: stats.tightGap }}>
            <SkeletonBar width={72} height={14} />
            <SkeletonBar width={48} height={16} />
          </div>
        ) : (
          <div key={metric.label} style={{ display: 'flex', flexDirection: 'column', gap: stats.tightGap }}>
            <span style={{ ...textStyle.sRegular, color: color.main.description }}>
              {metric.label}
            </span>
            <span style={{ ...textStyle.sSemibold, color: color.main.black }}>{metric.value}</span>
          </div>
        ),
      )}
    </div>
  );
});
