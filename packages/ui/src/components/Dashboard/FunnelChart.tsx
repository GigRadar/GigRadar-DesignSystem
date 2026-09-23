import { color, component, radius, shadow, spacing, textStyle } from '@gigradar/theme';
import { forwardRef, useId, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowLeft, IconDropdownArrowRight, IconInfoStroke } from '../../icons/defs.js';
import { RankBadge, type RankState } from '../Badge/RankBadge.js';

const { chart, callout } = component.dashboard;

/** Per-instance overrides for the chart's own metrics. */
export type FunnelChartStyleProps = {
  height?: CssLength;
  /**
   * How far the chart is lifted under whatever sits above it.
   *
   * Defaults to the token, which closes the white stripe the stats band leaves
   * beneath its shorter columns. Pass `0` to draw the chart where it falls.
   */
  overlapY?: CssLength;
  /** The band's fill. Two shades are derived from it. */
  tone?: string;
};

export type FunnelChartProps = {
  /**
   * The funnel's steps, as the share of the top of the funnel each one keeps.
   *
   * Values are 0–1 and are expected to descend; nothing enforces that, because
   * a funnel that widens is a real thing to see rather than an error to hide.
   */
  values: number[];
  /**
   * A second series drawn behind the first — the period being compared to.
   *
   * Omit it and only one band is drawn. The two are the same shape at
   * different opacities rather than two colors, because they are the same
   * measure at two times, not two measures.
   */
  compare?: number[];
  /** The metric cards floating over the band. */
  children?: ReactNode;
  /** Shown when there is nothing to draw — no data, or a failed load. */
  empty?: ReactNode;
  onPagePrevious?: () => void;
  onPageNext?: () => void;
} & FunnelChartStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * Turns a series into a smooth path across the box.
 *
 * Drawn with cubic segments whose control points sit halfway between each
 * pair, which is the cheapest curve that passes through every point without
 * overshooting between them — a funnel that dips below its own floor between
 * two steps would be reporting a number that never happened.
 */
function bandPath(values: number[], width: number, height: number) {
  const [first, ...rest] = values;
  if (first == null) return '';
  const step = values.length === 1 ? width : width / (values.length - 1);
  const y = (value: number) => height - Math.max(0, Math.min(1, value)) * height;

  let previous = first;
  let d = `M 0 ${y(first)}`;
  rest.forEach((value, index) => {
    const x0 = index * step;
    const x1 = (index + 1) * step;
    const mid = (x0 + x1) / 2;
    d += ` C ${mid} ${y(previous)}, ${mid} ${y(value)}, ${x1} ${y(value)}`;
    previous = value;
  });
  return `${d} L ${width} ${height} L 0 ${height} Z`;
}

/** A paging chevron floating over the chart's edge. */
function Pager({
  side,
  onClick,
}: {
  side: 'start' | 'end';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === 'start' ? 'Previous period' : 'Next period'}
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        [side === 'start' ? 'left' : 'right']: chart.pagerOffsetX,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: chart.pagerSize,
        height: chart.pagerSize,
        padding: 0,
        borderRadius: radius.round,
        border: 'none',
        backgroundColor: color.main.white,
        boxShadow: shadow.popup,
        color: color.navbar.text,
        cursor: 'pointer',
      }}
    >
      <Icon icon={side === 'start' ? IconDropdownArrowLeft : IconDropdownArrowRight} size={16} />
    </button>
  );
}

/**
 * The band behind the funnel stats.
 *
 * Figma draws this as a shape rather than a chart, and it is built that way
 * here: no axes, no gridlines, no tick labels, no library. Every number on
 * this screen is already written out in the stats above it, so the band's job
 * is to show the drop-off's shape, and anything that invited reading a value
 * off it would be promising a precision it does not have.
 *
 * Figma: the dashboard's funnel area (node 447:3878).
 */
export const FunnelChart = forwardRef<HTMLDivElement, FunnelChartProps>(function FunnelChart(
  {
    values,
    compare,
    children,
    empty,
    onPagePrevious,
    onPageNext,
    height,
    overlapY,
    tone,
    ...rest
  },
  ref,
) {
  const gradientId = useId();
  // How far the curve is held below the box's top — enough that the band
  // cannot reach the numbers, but less than the lift, so the lift still
  // closes most of the stripe.
  const headroom = chart.overlapHeadroom;
  const fill = tone ?? color.main.brand;
  const box = { width: chart.viewBoxWidth, height: chart.viewBoxHeight };
  const isEmpty = empty != null && values.length === 0;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        // The box carries the curve plus the headroom above it, so lifting it
        // never costs the curve any of its own height.
        height:
          height != null ? len(height) : `${chart.height + headroom}px`,
        marginTop: len(overlapY) ?? chart.overlapY,
        overflow: 'hidden',
      }}
      {...rest}
    >
      {isEmpty ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: spacing.xs,
            height: '100%',
            textAlign: 'center',
          }}
        >
          {empty}
        </div>
      ) : (
        <>
          {/* `preserveAspectRatio="none"` so the band stretches to whatever
              width the screen gives it. The shape carries no measurements, so
              distorting it horizontally costs nothing — and keeping the ratio
              would leave the band shorter than the stats it sits under. */}
          <svg
            viewBox={`0 0 ${box.width} ${box.height}`}
            preserveAspectRatio="none"
            aria-hidden
            style={{
              display: 'block',
              width: '100%',
              // The box is lifted under the stats; the curve is not. Holding
              // it off the top by the same amount means the lift only ever
              // closes empty space — the band cannot reach a figure.
              height: `calc(100% - ${headroom}px)`,
              marginTop: headroom,
            }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={fill} stopOpacity={chart.gradientTopOpacity} />
                <stop offset="100%" stopColor={fill} stopOpacity={chart.gradientBottomOpacity} />
              </linearGradient>
            </defs>
            {compare != null && (
              <path
                d={bandPath(compare, box.width, box.height)}
                fill={fill}
                fillOpacity={chart.backOpacity}
              />
            )}
            <path
              d={bandPath(values, box.width, box.height)}
              fill={`url(#${gradientId})`}
              fillOpacity={chart.frontOpacity}
            />
          </svg>

          {children != null && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                gap: spacing.xs,
                pointerEvents: 'none',
              }}
            >
              {children}
            </div>
          )}
        </>
      )}

      {onPagePrevious && <Pager side="start" onClick={onPagePrevious} />}
      {onPageNext && <Pager side="end" onClick={onPageNext} />}
    </div>
  );
});

/** Per-instance overrides for a callout's own metrics. */
export type FunnelCalloutStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  radius?: CssLength;
  background?: string;
  /** The card's outline against the chart's fill. */
  borderColor?: string;
};

export type FunnelCalloutProps = {
  /** The measure's short name — "FRT", "TRR", "OHR". */
  label: string;
  /** Its value, already formatted — "2 hours", "10%". */
  value: ReactNode;
  /** The change against the comparison period. */
  change?: { value: number | string; direction: RankState };
  /** What the abbreviation stands for, behind the info glyph. */
  hint?: string;
  /** A sentence under the figure — the reason the nudge is there. */
  description?: ReactNode;
  /** The nudge itself — "Boost with GigRadar CRM →". */
  action?: ReactNode;
  onActionClick?: () => void;
} & FunnelCalloutStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * A diagnostic that sits on the funnel rather than in it.
 *
 * First response time, reply rate and on-hand rate are properties of how the
 * team works the funnel, not steps a lead passes through, so Figma floats them
 * over the band instead of adding columns for them. They are cards here for
 * the same reason: a column would claim they are part of the sequence.
 *
 * Built by hand rather than as a variant of anything — Figma has no component
 * for it, and the nearest thing in the system (a stat column) is a different
 * shape at a different reading distance.
 */
export const FunnelCallout = forwardRef<HTMLDivElement, FunnelCalloutProps>(function FunnelCallout(
  {
    label,
    value,
    change,
    hint,
    description,
    action,
    onActionClick,
    paddingX,
    paddingY,
    radius: cardRadius,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        gap: callout.paddingY,
        boxSizing: 'border-box',
        padding: `${len(paddingY) ?? `${callout.paddingY}px`} ${
          len(paddingX) ?? `${callout.paddingX}px`
        }`,
        borderRadius: len(cardRadius) ?? callout.radius,
        border: `${callout.borderWidth}px solid ${borderColor ?? color.navbar.border}`,
        backgroundColor: background ?? color.main.white,
        boxShadow: shadow.popup,
        pointerEvents: 'auto',
      }}
      {...rest}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: callout.gap }}>
        <span
          style={{
            ...textStyle.sMedium,
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xxs,
            color: color.main.black,
          }}
        >
          {label}
          {hint != null && (
            <Icon icon={IconInfoStroke} size={12} color={color.navbar.text} label={hint} />
          )}
        </span>
        <span style={{ ...textStyle.sSemibold, color: color.main.black }}>{value}</span>
        {change != null && (
          <RankBadge
            rank={change.value}
            state={change.direction}
            label={`${change.value} against the previous period`}
          />
        )}
      </div>

      {description != null && (
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>{description}</span>
      )}

      {action != null && (
        <button
          type="button"
          onClick={onActionClick}
          style={{
            ...textStyle.sMedium,
            fontSize: callout.actionFontSize,
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing.xxs,
            alignSelf: 'flex-start',
            padding: `${callout.actionPaddingY}px ${callout.actionPaddingX}px`,
            borderRadius: callout.actionRadius,
            border: 'none',
            backgroundColor: color.main.brand,
            color: color.main.white,
            cursor: onActionClick ? 'pointer' : 'default',
          }}
        >
          {action}
        </button>
      )}
    </div>
  );
});
