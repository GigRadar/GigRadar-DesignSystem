import { borderWidth, color, component, shadow, textStyle } from '@gigradar/theme';
import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconCalendarFill } from '../../icons/defs.js';
import { DatePicker, type DateRange } from '../DatePicker/DatePicker.js';

const { dateField } = component.dashboard;

/** Per-instance overrides for the field's own metrics. */
export type DateRangeFieldStyleProps = {
  height?: CssLength;
  paddingX?: CssLength;
  radius?: CssLength;
  background?: string;
  borderColor?: string;
};

export type DateRangeFieldProps = {
  /** The range being shown. Controlled. */
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (range: DateRange) => void;
  /** The month the calendar opens on. */
  defaultMonth?: Date;
  /** What each end shows before a date is picked. */
  placeholder?: { start: string; end: string };
  /**
   * How a date is written in the field.
   *
   * Figma draws `2025/05/01`, but the format belongs to the app's locale
   * rather than to this component, so it is a function with that as its
   * default rather than a hardcoded string.
   */
  format?: (date: Date) => string;
} & DateRangeFieldStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'defaultValue' | 'onChange'>;

/** Figma's own format — `2025/05/01`, zero-padded, most significant first. */
function defaultFormat(date: Date) {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}/${month}/${day}`;
}

/**
 * The period the dashboard is reporting on.
 *
 * The field is the trigger; the calendar it opens is `DatePicker`, the same
 * one the inbox's advanced search uses. That reuse is the point — a second
 * calendar drawn for this screen would be a second set of keyboard behaviour,
 * a second month-stepping rule, and a second thing to fix.
 *
 * Both ends sit in one box with an arrow between them rather than as two
 * fields: a range is one value, and two boxes invite picking an end without
 * the other.
 */
export const DateRangeField = forwardRef<HTMLDivElement, DateRangeFieldProps>(
  function DateRangeField(
    {
      value,
      defaultValue,
      onValueChange,
      defaultMonth,
      placeholder = { start: 'Start date', end: 'End date' },
      format = defaultFormat,
      height,
      paddingX,
      radius: fieldRadius,
      background,
      borderColor,
      ...rest
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [uncontrolled, setUncontrolled] = useState<DateRange | undefined>(defaultValue);
    const wrapper = useRef<HTMLDivElement>(null);

    const range = value ?? uncontrolled;

    /*
     * Closing on an outside click rather than on blur: the calendar is inside
     * this wrapper, so a click on a day is "outside the field" by focus but
     * very much inside the control, and a blur-close would shut the calendar
     * before the second end could be picked.
     */
    useEffect(() => {
      if (!open) return undefined;
      const onPointerDown = (event: MouseEvent) => {
        if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
      };
      document.addEventListener('mousedown', onPointerDown);
      return () => document.removeEventListener('mousedown', onPointerDown);
    }, [open]);

    const commit = (next: DateRange) => {
      if (value == null) setUncontrolled(next);
      onValueChange?.(next);
      // Shut once both ends are set. Closing on the first pick would make the
      // range impossible to finish; staying open after the second leaves the
      // calendar covering the numbers it was picked for.
      if (next.start && next.end) setOpen(false);
    };

    const endText = (end: 'start' | 'end') => {
      const date = range?.[end];
      return date ? format(date) : placeholder[end];
    };

    return (
      <div ref={wrapper} style={{ position: 'relative', display: 'inline-block' }}>
        <div
          ref={ref}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpen((wasOpen) => !wasOpen);
            }
          }}
          style={{
            ...textStyle.mRegular,
            display: 'inline-flex',
            alignItems: 'center',
            gap: dateField.gap,
            boxSizing: 'border-box',
            height: len(height) ?? dateField.height,
            padding: `0 ${len(paddingX) ?? `${dateField.paddingX}px`}`,
            borderRadius: len(fieldRadius) ?? dateField.radius,
            border: `${borderWidth.thin}px solid ${borderColor ?? color.navbar.border}`,
            backgroundColor: background ?? color.main.white,
            color: color.main.black,
            cursor: 'pointer',
          }}
          {...rest}
        >
          <span style={{ color: range?.start ? color.main.black : color.main.description }}>
            {endText('start')}
          </span>
          <span aria-hidden style={{ color: color.navbar.text }}>
            →
          </span>
          <span style={{ color: range?.end ? color.main.black : color.main.description }}>
            {endText('end')}
          </span>
          <Icon icon={IconCalendarFill} size={dateField.iconSize} color={color.navbar.text} />
        </div>

        {open && (
          <div
            style={{
              position: 'absolute',
              top: `calc(100% + ${dateField.popoverOffset}px)`,
              right: 0,
              zIndex: dateField.popoverZIndex,
              borderRadius: component.datePicker.radius,
              backgroundColor: color.main.white,
              boxShadow: shadow.popup,
            }}
          >
            <DatePicker
              value={range}
              onValueChange={commit}
              defaultMonth={defaultMonth ?? range?.start ?? undefined}
            />
          </div>
        )}
      </div>
    );
  },
);
