import { borderWidth, color, component, fontWeight, spacing, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown } from '../../icons/defs.js';

const { stats, header, board, pipeline } = component.dashboard;

/**
 * A word in a band's title that can be clicked to change what is shown.
 *
 * The dashboard's headings are sentences with two choices in them — "Your
 * Funnel for **all team** as compared to **previous period**" — rather than a
 * title with two dropdowns beside it. Written as a sentence, the heading says
 * what the numbers below it mean; as a title plus controls, the reader has to
 * assemble that themselves.
 */
export type TitleSelectProps = {
  children: ReactNode;
  onClick?: () => void;
} & Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

export const TitleSelect = forwardRef<HTMLButtonElement, TitleSelectProps>(function TitleSelect(
  { children, onClick, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      style={{
        // Inherits the heading's type rather than setting its own: it is a
        // word in the sentence, and a word at a different size is a control
        // that happens to be in a sentence.
        font: 'inherit',
        fontWeight: fontWeight.semibold,
        display: 'inline-flex',
        alignItems: 'center',
        gap: spacing.xxs,
        padding: 0,
        border: 'none',
        background: 'none',
        color: color.main.black,
        cursor: 'pointer',
      }}
      {...rest}
    >
      {children}
      <Icon icon={IconDropdownArrowDown} size={stats.labelFontSize} color={color.navbar.text} />
    </button>
  );
});

/** Per-instance overrides for a band header's own metrics. */
export type DashboardHeaderStyleProps = {
  paddingY?: CssLength;
  gap?: CssLength;
};

export type DashboardHeaderProps = {
  /** The heading — usually a sentence with `<TitleSelect>` inside it. */
  title: ReactNode;
  /** The controls on the heading's trailing edge — the date range field. */
  actions?: ReactNode;
} & DashboardHeaderStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * The band above a section of the dashboard — its sentence and its controls.
 *
 * Shared by the funnel and the pipeline because both are one heading with
 * something on the right, and building two would let them drift apart at the
 * one place the screen most needs to look like one screen.
 */
export const DashboardHeader = forwardRef<HTMLDivElement, DashboardHeaderProps>(
  function DashboardHeader({ title, actions, paddingY, gap, ...rest }, ref) {
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          // Wraps rather than squeezing: on a narrow screen the controls drop
          // under the sentence, which keeps the sentence readable — a heading
          // that has to be read across two columns is not a sentence.
          flexWrap: 'wrap',
          gap: len(gap) ?? pipeline.headerGap,
          padding: `${len(paddingY) ?? `${pipeline.headerPaddingY}px`} 0`,
        }}
        {...rest}
      >
        <h2
          style={{
            ...textStyle.h4,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            // The word space between the sentence's parts. Flex drops the
            // whitespace around its items, so without this the text runs into
            // the choices inside it.
            gap: header.wordGap,
            margin: 0,
            minWidth: 0,
            color: color.main.black,
          }}
        >
          {title}
        </h2>
        {actions != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.xs }}>{actions}</div>
        )}
      </div>
    );
  },
);

/** Per-instance overrides for the stats band's own metrics. */
export type FunnelStatsBandStyleProps = {
  /** How narrow a column may be squeezed before the band scrolls. */
  columnMinWidth?: CssLength;
};

export type FunnelStatsBandProps = {
  /** The steps — a row of `<FunnelStat>`. */
  children: ReactNode;
} & FunnelStatsBandStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The row of funnel steps above the chart.
 *
 * One row, always. The funnel is a sequence that runs left to right and ends
 * at the closing rates, so a step that wrapped onto a second row would be a
 * step read out of order — and the drop-off, which is the whole point of the
 * band, is only legible when every step is comparable against the one beside
 * it.
 *
 * So the columns share the width and shrink together rather than wrapping or
 * dropping off the end. `auto-fill` with a `1fr` maximum would do the same
 * until the row ran out of room; this uses `flex` instead, because flex is
 * what shrinks children below their ideal width on one line.
 */
export const FunnelStatsBand = forwardRef<HTMLDivElement, FunnelStatsBandProps>(
  function FunnelStatsBand({ children, columnMinWidth, ...rest }, ref) {
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          // Fills its container and may shrink inside it. Without `minWidth`
          // the band takes its content's width as a floor and pushes the last
          // steps past the right edge instead of squeezing them.
          width: '100%',
          minWidth: 0,
          // The band scrolls only once every column has been squeezed to its
          // own minimum.
          overflowX: 'auto',
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

/** Per-instance overrides for the funnel section's own metrics. */
export type FunnelSectionStyleProps = {
  /** A column's ideal width, matching the band's. */
  columnWidth?: CssLength;
  dividerColor?: string;
};

export type FunnelSectionProps = {
  /** The stats band. */
  stats: ReactNode;
  /** The chart the dividers run down over. */
  chart: ReactNode;
  /**
   * How many rules to draw — one per stat column.
   *
   * Passed rather than counted: the stats arrive as opaque children, and a
   * layer that guessed would put a rule where no column is.
   */
  columns: number;
} & FunnelSectionStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The stats and the chart as one surface, with the column rules running the
 * full height of both.
 *
 * The dividers belong here rather than to a stat column because of what they
 * are for: they say the band and the shape under it are readings of one thing.
 * A rule that stopped at the foot of the numbers would cut the section in two
 * and leave the chart looking like a separate panel that happened to be
 * beneath them. Running to the bottom, the rules frame the chart instead — it
 * reads as floating under the columns rather than stacked after them.
 *
 * Drawn as a background layer sized to the same grid the stats use, so the
 * rules land on the column edges however many columns the width allows, and
 * follow them when the band wraps.
 */
export const FunnelSection = forwardRef<HTMLDivElement, FunnelSectionProps>(
  function FunnelSection(
    { stats: statsBand, chart: chartBand, columns, columnWidth, dividerColor, ...rest },
    ref,
  ) {
    const min = len(columnWidth) ?? `${stats.columnWidth}px`;
    const rule = dividerColor ?? color.navbar.border;

    return (
      <div ref={ref} style={{ position: 'relative' }} {...rest}>
        {/*
         * The rules, as their own layer.
         *
         * One empty cell per column with a leading border, laid out on the
         * same grid as the stats: that is what keeps a rule on every column
         * edge without the stat components knowing anything about their
         * neighbours. The first cell's border is suppressed — a rule down the
         * section's outer edge would read as a frame around it.
         */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            pointerEvents: 'none',
          }}
        >
          {/* One cell per column, laid out the way the stats are, so the rules
              land on the same edges as the band shrinks. The first cell's
              border is suppressed — a rule down the section's outer edge would
              read as a frame around it rather than as a division inside it. */}
          {Array.from({ length: columns }, (_, index) => (
            <span
              key={index}
              style={{
                flex: `1 1 ${min}`,
                minWidth: stats.columnMinWidth,
                borderLeft:
                  index === 0 ? undefined : `${borderWidth.thin}px solid ${rule}`,
              }}
            />
          ))}
        </div>

        <div style={{ position: 'relative' }}>
          {statsBand}
          {chartBand}
        </div>
      </div>
    );
  },
);

/** Per-instance overrides for the pipeline's own metrics. */
export type PipelineBandStyleProps = {
  gap?: CssLength;
};

export type PipelineBandProps = {
  /** The stages — a row of `<KanbanBoard>`. */
  children: ReactNode;
} & PipelineBandStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The row of pipeline stages.
 *
 * One row, like the stats and for the same reason: the stages are ordered and
 * end at Closed, so a stage on a second row is a stage out of sequence — and
 * a lead is dragged along that sequence, which a wrap would break.
 *
 * Boards are top-aligned: a board's height is how many leads it holds, which
 * is worth seeing across the band, and stretching would make every stage look
 * equally full.
 */
export const PipelineBand = forwardRef<HTMLDivElement, PipelineBandProps>(
  function PipelineBand({ children, gap, ...rest }, ref) {
    return (
      <div
        ref={ref}
        style={{
          display: 'flex',
          flexWrap: 'nowrap',
          // Stretch, so every stage stands the same height and the band reads
          // as one surface. A board's own content decides nothing about its
          // height any more — the cards inside it keep their size and the
          // board scrolls them.
          alignItems: 'stretch',
          width: '100%',
          minWidth: 0,
          // Fills the height it is given, so a pipeline in a tall screen
          // reaches the bottom instead of leaving white under it — and shrinks
          // with it, so a short one fits rather than running past the fold.
          //
          // No floor here. A minimum is what a board falls back to when there
          // is no height to divide at all (see `board.minHeight`, applied by
          // the caller), but inside a bounded screen it is exactly the thing
          // that would push the band past the bottom.
          flex: '1 1 auto',
          minHeight: 0,
          overflowX: 'auto',
          gap: len(gap) ?? pipeline.boardGap,
          // Every board carries its own left inset before its title draws
          // (`board.padding` plus `board.headerPaddingX`) — the same margin
          // every board has, on every side. Left alone, that margin stacks on
          // top of whatever inset the page already gives this row, and the
          // first board's title lands to the right of the heading above it.
          // Pulling the row left cancels it, so the title lines up with the
          // rest of the page's left edge instead of with its own container.
          marginLeft: -pipeline.edgeCorrection,
          // Room for the tallest board's shadow and for a card lifted out of a
          // column mid-drag.
          paddingBottom: pipeline.boardGap,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
