import { borderWidth, color, component, radius as radiusToken, shadow, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCollapseDoubleArrowLeft,
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
        gap: len(monthGap) ?? datePicker.monthGap,
        boxSizing: 'border-box',
        padding: `${datePicker.cardPaddingY}px ${datePicker.cardPaddingX}px`,
        borderRadius: len(radius) ?? datePicker.radius,
        backgroundColor: background ?? color.main.white,
        boxShadow: shadowOverride ?? shadow.base,
      }}
      onMouseLeave={() => setHovered(null)}
      {...rest}
    >
      {Array.from({ length: months }, (_, index) => {
        const panelMonth = addMonths(viewMonth, index);
        const isFirst = index === 0;
        const isLast = index === months - 1;

        return (
          <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
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
                <NavButton
                  label="Previous year"
                  icon={IconCollapseDoubleArrowLeft}
                  onClick={() => goToMonth(addMonths(viewMonth, -12))}
                />
                <NavButton
                  label="Previous month"
                  icon={IconDropdownArrowLeft}
                  onClick={() => goToMonth(addMonths(viewMonth, -1))}
                />
              </span>

              <span style={{ ...textStyle.mRegular, color: color.main.black }}>
                {MONTHS[panelMonth.getMonth()]} {panelMonth.getFullYear()}
              </span>

              <span style={{ display: 'flex', gap: datePicker.headerGap, visibility: isLast ? 'visible' : 'hidden' }}>
                <NavButton
                  label="Next month"
                  icon={IconDropdownArrowRight}
                  onClick={() => goToMonth(addMonths(viewMonth, 1))}
                />
                <NavButton
                  label="Next year"
                  icon={IconExpandDoubleArrowRight}
                  onClick={() => goToMonth(addMonths(viewMonth, 12))}
                />
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${datePicker.cellWidth}px)` }}>
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
                      width: datePicker.cellWidth,
                      height: datePicker.cellWidth,
                      padding: 0,
                      border: 'none',
                      font: 'inherit',
                      cursor: isDisabled ? 'default' : 'pointer',
                      // The band runs edge to edge so consecutive days join up,
                      // while the endpoints keep their own rounded chip.
                      backgroundColor: between ? rangeFill : 'transparent',
                    }}
                  >
                    <span
                      style={{
                        ...textStyle.mRegular,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: cell,
                        height: cell,
                        borderRadius: datePicker.cellRadius,
                        backgroundColor: isEndpoint ? accentColor : 'transparent',
                        color: isEndpoint
                          ? color.main.white
                          : isDisabled || outside
                            ? color.disable.text
                            : color.main.black,
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
