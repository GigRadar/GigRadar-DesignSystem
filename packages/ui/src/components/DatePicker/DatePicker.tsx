import { borderWidth, color, component, radius as radiusToken, shadow, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCollapseDoubleArrowLeft,
  IconDropdownArrowDown,
  IconDropdownArrowLeft,
  IconDropdownArrowRight,
  IconExpandDoubleArrowRight,
} from '../../icons/defs.js';

const { datePicker } = component;

/**
 * A selected range. Either end may be null — a range is picked one end at a
 * time, and the half-picked state is the one the calendar spends most of its
 * time in.
 */
export type DateRange = {
  start: Date | null;
  end: Date | null;
};

/** Per-instance overrides for the calendar's own metrics. */
export type DatePickerStyleProps = {
  radius?: CssLength;
  /** Space between the two month panels. */
  monthGap?: CssLength;
  /** Cell diameter. The grid follows from it. */
  cellSize?: CssLength;
  /** Fill. */
  background?: string;
  /** The selected endpoints' fill. */
  accent?: string;
  /** The fill behind the days between the endpoints. */
  rangeBackground?: string;
  /** Elevation, as a CSS `box-shadow`. */
  shadow?: string;
};

export type DatePickerProps = {
  /** The selected range. Controlled. */
  value?: DateRange;
  /** The starting range when the calendar manages its own state. */
  defaultValue?: DateRange;
  /**
   * Called as each end is picked — once with only `start` set, then again with
   * both. A consumer that only cares about complete ranges should check `end`.
   */
  onValueChange?: (range: DateRange) => void;
  /** The left panel's month. Controlled. */
  month?: Date;
  /** The left panel's month on first render. */
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  /**
   * How many months to draw side by side.
   * @default 2
   */
  months?: 1 | 2;
  /** Days outside this range cannot be picked. */
  minDate?: Date;
  maxDate?: Date;
  /**
   * First day of the week, 0 = Sunday.
   * @default 0
   */
  weekStartsOn?: 0 | 1;
  /**
   * Fills the width it is given rather than hugging its dates.
   *
   * The calendar's default is to size to its grid, because a filter popover
   * should not be padded out with white. Inside a modal it is the opposite: the
   * calendar is a field like any other and should line up with the ones under
   * it, so it stretches and its cells share the width.
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Makes the month name a button that opens a list of months.
   *
   * Off by default: the chevrons are enough for stepping a month or two, and a
   * dropdown on every calendar would be a control most of them never need.
   * Turned on where a date might be months out — scheduling a message, say.
   * @default false
   */
  monthPicker?: boolean;
} & DatePickerStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onChange'>;

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Midnight on the given day — the unit every comparison here works in. */
function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date | null, b: Date | null) {
  return a != null && b != null && startOfDay(a).getTime() === startOfDay(b).getTime();
}

function addMonths(date: Date, delta: number) {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

/**
 * The half of an endpoint's cell that carries the range band.
 *
 * An endpoint sits at one end of the run, so only the side facing the rest of
 * it should be filled: the start fills its right half, the end its left. Filling
 * the whole cell would push the band a half-cell past the range; filling none
 * of it leaves a notch between the chip and the first shaded day.
 *
 * A linear-gradient rather than a pseudo-element, because the cell is a
 * `<button>` styled inline and this package ships no stylesheet to put a
 * `::before` in.
 */
function bandSide(isStart: boolean, isEnd: boolean, fill: string) {
  // A one-day range is both ends at once, and needs no band at all.
  if (isStart && isEnd) return 'transparent';
  if (isStart) return `linear-gradient(to right, transparent 50%, ${fill} 50%)`;
  if (isEnd) return `linear-gradient(to right, ${fill} 50%, transparent 50%)`;
  return 'transparent';
}

/**
 * The six-week grid for one month.
 *
 * Always 42 cells, including the days either side that fill the first and last
 * weeks. A fixed count is what stops the calendar changing height as the month
 * changes, which would move the controls under it.
 */
function monthGrid(month: Date, weekStartsOn: 0 | 1) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const start = new Date(first.getFullYear(), first.getMonth(), 1 - offset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index);
    return { date: day, outside: day.getMonth() !== month.getMonth() };
  });
}

/**
 * The range calendar — two months side by side.
 *
 * Figma: node 351:11760, which draws Default, Hover, "Date Started Selected",
 * and "Date End Selected". Those last two are the halves of one interaction:
 * the first click sets the start, the second sets the end, and a third starts
 * over. That is the whole state machine, and it lives here rather than in the
 * consumer so every range filter behaves the same way.
 *
 * Two months rather than one because the ranges people pick — "last week",
 * "since the 28th" — routinely straddle a month boundary, and paging back and
 * forth to pick two ends is where a one-month calendar becomes tedious.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    value,
    defaultValue = { start: null, end: null },
    onValueChange,
    month,
    defaultMonth,
    onMonthChange,
    months = 2,
    minDate,
    maxDate,
    weekStartsOn = 0,
    fullWidth = false,
    monthPicker = false,
    radius,
    monthGap,
    cellSize,
    background,
    accent,
    rangeBackground,
    shadow: shadowOverride,
    ...rest
  },
  ref,
) {
  const [uncontrolledRange, setUncontrolledRange] = useState<DateRange>(defaultValue);
  const [uncontrolledMonth, setUncontrolledMonth] = useState<Date>(
    () => defaultMonth ?? value?.start ?? new Date(),
  );
  /**
   * The day under the cursor while only one end is set.
   *
   * Without it, picking a range gives no feedback between the two clicks — the
   * person is choosing an end with nothing showing what they are ending.
   */
  const [hovered, setHovered] = useState<Date | null>(null);
  // Which panel's month list is open, by index — two panels, one list at a time.
  const [monthListFor, setMonthListFor] = useState<number | null>(null);
  // Captured once per render rather than per cell: 42 cells times two panels is
  // 84 `new Date()` calls, all answering the same question.
  const today = startOfDay(new Date());
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);

  const range = value ?? uncontrolledRange;
  const viewMonth = month ?? uncontrolledMonth;

  const accentColor = accent ?? color.badge.foreground;
  const rangeFill = rangeBackground ?? color.badge.background;
  const cell = typeof cellSize === 'number' ? cellSize : datePicker.cellSize;

  const goToMonth = (next: Date) => {
    if (month === undefined) setUncontrolledMonth(next);
    onMonthChange?.(next);
  };

  const pick = (day: Date) => {
    // A complete range means the next click is starting a new one; a
    // half-range means it is finishing this one.
    const next: DateRange =
      range.start == null || range.end != null
        ? { start: day, end: null }
        : day < range.start
          ? // Picking an earlier day second means the ends came in backwards.
            // Swapping is friendlier than rejecting the click.
            { start: day, end: range.start }
          : { start: range.start, end: day };

    if (value === undefined) setUncontrolledRange(next);
    onValueChange?.(next);
  };

  const disabled = (day: Date) =>
    (minDate != null && startOfDay(day) < startOfDay(minDate)) ||
    (maxDate != null && startOfDay(day) > startOfDay(maxDate));

  // While one end is set, the hovered day stands in for the other, so the band
  // between them is drawn as the person moves.
  const provisionalEnd = range.end ?? (range.start != null ? hovered : null);

  // Two distinct days, so there is a span for the band to cover. A start on its
  // own — or a start and end on the same day — has nothing to join up.
  const hasRange =
    range.start != null && provisionalEnd != null && !sameDay(range.start, provisionalEnd);

  const inRange = (day: Date) => {
    if (range.start == null || provisionalEnd == null) return false;
    const time = startOfDay(day).getTime();
    const from = Math.min(startOfDay(range.start).getTime(), startOfDay(provisionalEnd).getTime());
    const to = Math.max(startOfDay(range.start).getTime(), startOfDay(provisionalEnd).getTime());
    return time > from && time < to;
  };

  const weekdays = weekStartsOn === 1 ? [...WEEKDAYS.slice(1), WEEKDAYS[0]] : WEEKDAYS;

  return (
    <div
      ref={ref}
      role="application"
      aria-label="Date range"
      style={{
        display: 'inline-flex',
        /**
         * The calendar is as wide as the dates it draws, never as wide as
         * whatever holds it.
         *
         * `inline-flex` alone does not guarantee that: dropped into a flex
         * column — which is how every filter row stacks its contents — the
         * default `align-items: stretch` pulls the card out to the container's
         * full width, leaving the grid marooned in a field of white. Pinning
         * both the flex and grid cross-axis keywords opts out of that stretch
         * in either kind of parent.
         */
        // Full width opts out of the hug: inside a modal the calendar is a field
        // among fields, and should line up with them.
        alignSelf: fullWidth ? 'stretch' : 'start',
        justifySelf: fullWidth ? 'stretch' : 'start',
        width: fullWidth ? '100%' : undefined,
        gap: len(monthGap) ?? datePicker.monthGap,
        boxSizing: 'border-box',
        padding: `${datePicker.cardPaddingY}px ${datePicker.cardPaddingX}px`,
        borderRadius: len(radius) ?? datePicker.radius,
        backgroundColor: background ?? color.main.white,
        // A calendar that fills a panel is part of that panel, so it takes a
        // border instead of floating over it on an elevation.
        border: fullWidth ? `${borderWidth.thin}px solid ${color.navbar.border}` : undefined,
        boxShadow: shadowOverride ?? (fullWidth ? 'none' : shadow.base),
      }}
      onMouseLeave={() => setHovered(null)}
      {...rest}
    >
      {Array.from({ length: months }, (_, index) => {
        const panelMonth = addMonths(viewMonth, index);
        const isFirst = index === 0;
        const isLast = index === months - 1;

        return (
          <div
            key={index}
            // Full width runs through the panel too, so the header spreads its
            // chevrons to the same edges the date grid reaches.
            style={{ display: 'flex', flexDirection: 'column', flex: fullWidth ? 1 : undefined, minWidth: fullWidth ? 0 : undefined }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: datePicker.headerHeight,
                marginBottom: datePicker.headerGap,
              }}
            >
              {/* Only the outer edges carry navigation: the two panels move
                  together, so a control between them would be ambiguous. */}
              <span style={{ display: 'flex', gap: datePicker.headerGap, visibility: isFirst ? 'visible' : 'hidden' }}>
                {/* The month list makes a year jump redundant, and nothing is
                    scheduled a year out — so with it on, the header keeps one
                    chevron each way and nothing else. */}
                {!monthPicker && (
                  <NavButton
                    label="Previous year"
                    icon={IconCollapseDoubleArrowLeft}
                    onClick={() => goToMonth(addMonths(viewMonth, -12))}
                  />
                )}
                <NavButton
                  label="Previous month"
                  icon={IconDropdownArrowLeft}
                  onClick={() => goToMonth(addMonths(viewMonth, -1))}
                />
              </span>

              {monthPicker ? (
                <span style={{ position: 'relative', display: 'inline-flex' }}>
                  <button
                    type="button"
                    onClick={() => setMonthListFor((open) => (open === index ? null : index))}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: datePicker.headerGap,
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      ...textStyle.mRegular,
                      color: color.main.black,
                      cursor: 'pointer',
                    }}
                  >
                    {MONTHS[panelMonth.getMonth()]} {panelMonth.getFullYear()}
                    <Icon icon={IconDropdownArrowDown} size={14} color={color.navbar.text} />
                  </button>
                  {monthListFor === index && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        zIndex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        maxHeight: datePicker.monthListMaxHeight,
                        overflowY: 'auto',
                        marginTop: datePicker.monthListOffset,
                        padding: datePicker.monthListPadding,
                        borderRadius: radiusToken.xs,
                        backgroundColor: color.main.white,
                        boxShadow: shadow.base,
                      }}
                    >
                      {MONTHS.map((name, monthIndex) => {
                        const current = monthIndex === panelMonth.getMonth();
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              goToMonth(
                                new Date(panelMonth.getFullYear(), monthIndex - index, 1),
                              );
                              setMonthListFor(null);
                            }}
                            onMouseEnter={() => setHoveredMonth(monthIndex)}
                            onMouseLeave={() => setHoveredMonth(null)}
                            style={{
                              padding: `${datePicker.monthItemPaddingY}px ${datePicker.monthItemPaddingX}px`,
                              border: 'none',
                              borderRadius: radiusToken.s,
                              ...textStyle.mRegular,
                              // The same three states the day cells use: the
                              // chosen month takes the accent, a hovered one the
                              // nav wash, the rest none.
                              color: current ? color.main.white : color.main.black,
                              backgroundColor: current
                                ? accentColor
                                : hoveredMonth === monthIndex
                                  ? color.navbar.hover
                                  : 'transparent',
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                              textAlign: 'left',
                            }}
                          >
                            {name}
                          </button>
                        );
                      })}
                    </span>
                  )}
                </span>
              ) : (
                <span style={{ ...textStyle.mRegular, color: color.main.black }}>
                  {MONTHS[panelMonth.getMonth()]} {panelMonth.getFullYear()}
                </span>
              )}

              <span style={{ display: 'flex', gap: datePicker.headerGap, visibility: isLast ? 'visible' : 'hidden' }}>
                <NavButton
                  label="Next month"
                  icon={IconDropdownArrowRight}
                  onClick={() => goToMonth(addMonths(viewMonth, 1))}
                />
                {!monthPicker && (
                  <NavButton
                    label="Next year"
                    icon={IconExpandDoubleArrowRight}
                    onClick={() => goToMonth(addMonths(viewMonth, 12))}
                  />
                )}
              </span>
            </div>

            <div
              style={{
                display: 'grid',
                // Full width shares the row between seven equal cells; otherwise
                // each keeps its own width and the grid centres in whatever it
                // is given.
                gridTemplateColumns: fullWidth
                  ? 'repeat(7, 1fr)'
                  : `repeat(7, ${datePicker.cellWidth}px)`,
                justifyContent: 'center',
              }}
            >
              {weekdays.map((day) => (
                <span
                  key={day}
                  style={{
                    ...textStyle.mRegular,
                    color: color.main.black,
                    height: datePicker.cellWidth,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {day}
                </span>
              ))}

              {monthGrid(panelMonth, weekStartsOn).map(({ date, outside }) => {
                const isStart = sameDay(date, range.start);
                const isEnd = sameDay(date, provisionalEnd);
                const isEndpoint = isStart || isEnd;
                const between = inRange(date);
                const isDisabled = disabled(date);
                const isToday = sameDay(date, today);
                const isHovered = !isDisabled && !isEndpoint && sameDay(date, hovered);

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    disabled={isDisabled}
                    aria-label={date.toDateString()}
                    aria-pressed={isEndpoint}
                    onMouseEnter={() => setHovered(date)}
                    onClick={() => pick(date)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: fullWidth ? '100%' : datePicker.cellWidth,
                      height: datePicker.cellWidth,
                      padding: 0,
                      border: 'none',
                      font: 'inherit',
                      cursor: isDisabled ? 'default' : 'pointer',
                      // The band runs edge to edge so consecutive days join up.
                      // An endpoint carries it too, but only on the side the
                      // range runs towards — without that the fill stops at the
                      // endpoint's cell edge and leaves a notch beside the chip.
                      background: between
                        ? rangeFill
                        : // Only once there is a second end to run towards: a
                          // lone start would otherwise trail half a band into
                          // empty space.
                          hasRange
                          ? bandSide(isStart, isEnd, rangeFill)
                          : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        ...textStyle.mRegular,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        // Full width lets the chip fill its cell, so a row of
                        // days divides the panel evenly instead of leaving
                        // gutters between fixed-width chips.
                        width: fullWidth ? '100%' : cell,
                        height: fullWidth ? '100%' : cell,
                        borderRadius: isEndpoint || isHovered ? radiusToken.s : datePicker.cellRadius,
                        // Three fills across Figma's states (node 2030:12197):
                        // a selected day takes the accent, a hovered one the
                        // nav wash, and every other day none.
                        backgroundColor: isEndpoint
                          ? accentColor
                          : isHovered
                            ? color.navbar.hover
                            : 'transparent',
                        // Today is named by its colour rather than a fill, so it
                        // still reads as today once something else is selected.
                        color: isEndpoint
                          ? color.main.white
                          : isDisabled || outside
                            ? color.disable.text
                            : isToday
                              ? accentColor
                              : color.main.black,
                        opacity: outside ? datePicker.outsideOpacity : 1,
                      }}
                    >
                      {date.getDate()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

/** One of the four month/year steppers in a panel header. */
function NavButton({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: Parameters<typeof Icon>[0]['icon'];
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: datePicker.headerHeight,
        height: datePicker.headerHeight,
        padding: 0,
        border: 'none',
        borderRadius: radiusToken.xs,
        backgroundColor: 'transparent',
        cursor: 'pointer',
      }}
    >
      <Icon icon={icon} size={datePicker.navIconSize} color={color.navbar.text} />
    </button>
  );
}
