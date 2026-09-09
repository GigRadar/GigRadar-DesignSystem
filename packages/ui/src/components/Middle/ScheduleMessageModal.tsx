import { borderWidth, color, component, radius as radiusToken, textStyle } from '@gigradar/theme';
import { useState, type ReactNode } from 'react';
import { Avatar } from '../Avatar/Avatar.js';
import { Button } from '../Button/Button.js';
import { Checkbox } from '../Checkbox/Checkbox.js';
import { DatePicker } from '../DatePicker/DatePicker.js';
import { Modal } from '../Modal/Modal.js';
import { ModalHeader } from '../Modal/ModalBands.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown } from '../../icons/defs.js';

const { scheduleModal } = component.middle;

/** One timezone the message can be sent against. */
export type ScheduleTimezone = {
  /** Stable key, and what `onTimezoneChange` reports. */
  id: string;
  /** Whose clock it is — "You", "Client". */
  label: ReactNode;
  /** The offset, drawn after the name — "(UTC+08:00)". */
  offset: ReactNode;
  /** The face beside the name. */
  avatar?: { src?: string; tone?: 'purple' | 'default'; initials?: string };
};

export type ScheduleMessageModalProps = {
  /** Whether the modal is showing. */
  open: boolean;
  onClose: () => void;
  /** The chosen day. Controlled; `null` until one is picked. */
  date?: Date | null;
  onDateChange?: (date: Date) => void;
  /** The month the calendar is showing. */
  month?: Date;
  onMonthChange?: (month: Date) => void;
  /** The chosen time, as a label — "09:00". */
  time?: string;
  onTimeChange?: (time: string) => void;
  /**
   * The times the dropdown offers. Passed rather than generated, because the
   * step and the range are a product decision — half-hours today, quarters
   * tomorrow — and a component that generated them would own that.
   */
  times?: string[];
  /**
   * The two clocks a message can be scheduled against: yours and the client's.
   *
   * Two rather than a full timezone list — those are the only ones that mean
   * anything here. "09:00 their time" and "09:00 my time" is the whole question,
   * and a searchable list of four hundred zones would bury it.
   */
  timezones?: ScheduleTimezone[];
  timezoneId?: string;
  onTimezoneChange?: (id: string) => void;
  /** Whether the queued message withdraws itself if the client writes first. */
  autoCancel?: boolean;
  onAutoCancelChange?: (on: boolean) => void;
  /** Confirms the schedule. Disabled until a date is chosen. */
  onSchedule?: () => void;
};

const DEFAULT_TIMES = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0');
  return `${hour}:${i % 2 === 0 ? '00' : '30'}`;
});

/**
 * Choosing when a message goes out.
 *
 * Figma: node 2077:8807 — the modal the composer's schedule button opens, in two
 * states that are one thing: before a date is picked the time, timezone and
 * confirm are faded, and after it they are live. Built as one component reading
 * `date == null` rather than as two variants, because that is the only
 * difference between them.
 *
 * The calendar is the system's own `DatePicker` with its accent swapped for the
 * schedule purple — same component, wearing the colour of the surface it is on.
 */
export function ScheduleMessageModal({
  open,
  onClose,
  date = null,
  onDateChange,
  month,
  onMonthChange,
  time = '09:00',
  onTimeChange,
  times = DEFAULT_TIMES,
  timezones = [],
  timezoneId,
  onTimezoneChange,
  autoCancel = false,
  onAutoCancelChange,
  onSchedule,
}: ScheduleMessageModalProps) {
  const [timeOpen, setTimeOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);

  // Nothing below the calendar can be answered until there is a day to answer
  // it about, so the rest of the modal waits rather than offering choices that
  // would have nothing to attach to.
  const ready = date != null;
  const zone = timezones.find((t) => t.id === timezoneId) ?? timezones[0];

  return (
    <Modal open={open} onClose={onClose} width={scheduleModal.width} label="Schedule message">
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {/* The system's own band rather than a hand-rolled row: it already puts
            the title and the close button on one line, and it is what every
            other dialog's head is made of. */}
        <ModalHeader onClose={onClose} closeLabel="Close">
          Choose schedule message date &amp; time
        </ModalHeader>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: scheduleModal.gap,
            paddingLeft: scheduleModal.bodyPaddingX,
            paddingRight: scheduleModal.bodyPaddingX,
            paddingTop: scheduleModal.bodyPaddingY,
            paddingBottom: scheduleModal.bodyPaddingY,
          }}
        >
          <Field label="Select a date">
            <DatePicker
              months={1}
              fullWidth
              monthPicker
              accent={color.accent.schedule.main}
              month={month}
              onMonthChange={onMonthChange}
              value={{ start: date, end: date }}
              onValueChange={(range) => {
                // A single day, expressed through a range picker: both ends are
                // the same date, and the first click is the answer.
                if (range.start) onDateChange?.(range.start);
              }}
            />
          </Field>

          <div style={{ display: 'flex', gap: scheduleModal.fieldGap, alignItems: 'flex-start' }}>
            <Field label="Select a time">
              <Popover
                open={timeOpen && ready}
                onOpenChange={setTimeOpen}
                disabled={!ready}
                width={scheduleModal.timeWidth}
                trigger={<span style={{ ...textStyle.mMedium, color: color.navbar.text }}>{time}</span>}
              >
                {times.map((option) => (
                  <MenuItem
                    key={option}
                    selected={option === time}
                    onClick={() => {
                      onTimeChange?.(option);
                      setTimeOpen(false);
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Popover>
            </Field>

            <Field label="Timezone" grow>
              <Popover
                open={zoneOpen && ready}
                onOpenChange={setZoneOpen}
                disabled={!ready}
                width={scheduleModal.timezoneWidth}
                trigger={zone ? <TimezoneRow zone={zone} /> : null}
              >
                {timezones.map((option) => (
                  <MenuItem
                    key={option.id}
                    selected={option.id === zone?.id}
                    onClick={() => {
                      onTimezoneChange?.(option.id);
                      setZoneOpen(false);
                    }}
                  >
                    <TimezoneRow zone={option} />
                  </MenuItem>
                ))}
              </Popover>
            </Field>
          </div>

          <Checkbox
            checked={autoCancel}
            onCheckedChange={onAutoCancelChange}
            disabled={!ready}
            // Purple in both states, not only when checked: the control belongs to
            // the scheduling surface, and a blue ring waiting to turn purple
            // reads as a different control before and after it is ticked.
            background={autoCancel ? color.accent.schedule.main : undefined}
            borderColor={color.accent.schedule.main}
          >
            Automatically cancel scheduled messages if the client replies first.
          </Checkbox>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: scheduleModal.footerGap,
            padding: scheduleModal.footerPadding,
          }}
        >
          <Button variant="third" onClick={onClose}>
            Cancel
          </Button>
          <Button
            tone="schedule"
            disabled={!ready}
            onClick={onSchedule}
          >
            Schedule
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/** A label with its control under it. */
function Field({
  label,
  grow,
  children,
}: {
  label: ReactNode;
  grow?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: scheduleModal.labelGap,
        flex: grow ? 1 : undefined,
        minWidth: grow ? 0 : undefined,
        width: grow ? undefined : 'auto',
      }}
    >
      <span style={{ ...textStyle.mRegular, color: color.navbar.text2 }}>{label}</span>
      {children}
    </div>
  );
}

/** One clock, drawn the same in the button and in the list it opens. */
function TimezoneRow({ zone }: { zone: ScheduleTimezone }) {
  return (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: scheduleModal.timezoneGap,
        width: '100%',
        minWidth: 0,
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: scheduleModal.timezoneGap,
          minWidth: 0,
        }}
      >
        <Avatar
          size="small"
          diameter={scheduleModal.timezoneAvatarSize}
          src={zone.avatar?.src}
          tone={zone.avatar?.tone}
          initials={zone.avatar?.initials}
        />
        <span style={{ ...textStyle.mMedium, color: color.navbar.text2, whiteSpace: 'nowrap' }}>
          {zone.label}
        </span>
      </span>
      <span style={{ ...textStyle.sRegular, color: color.navbar.text, whiteSpace: 'nowrap' }}>
        {zone.offset}
      </span>
    </span>
  );
}

/** A bordered button that opens a list under itself. */
function Popover({
  open,
  onOpenChange,
  disabled,
  width,
  trigger,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  width: number;
  trigger: ReactNode;
  children: ReactNode;
}) {
  return (
    <span style={{ position: 'relative', display: 'inline-flex', width }}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onOpenChange(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: scheduleModal.timezoneGap,
          boxSizing: 'border-box',
          width: '100%',
          paddingLeft: scheduleModal.controlPaddingX,
          paddingRight: scheduleModal.controlPaddingX,
          paddingTop: scheduleModal.controlPaddingY,
          paddingBottom: scheduleModal.controlPaddingY,
          borderRadius: scheduleModal.controlRadius,
          border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
          backgroundColor: color.main.white,
          // Faded rather than hidden while there is no date: the row has to keep
          // its place so the modal does not resize the moment a day is picked.
          opacity: disabled ? scheduleModal.disabledOpacity : 1,
          cursor: disabled ? 'default' : 'pointer',
        }}
      >
        {trigger}
        <Icon icon={IconDropdownArrowDown} size={14} color={color.navbar.text} />
      </button>
      {open && (
        <span
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            maxHeight: scheduleModal.menuMaxHeight,
            overflowY: 'auto',
            marginTop: scheduleModal.menuPaddingY,
            paddingTop: scheduleModal.menuPaddingY,
            paddingBottom: scheduleModal.menuPaddingY,
            borderRadius: scheduleModal.menuRadius,
            border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
            backgroundColor: color.main.white,
          }}
        >
          {children}
        </span>
      )}
    </span>
  );
}

/** One row in a popover's list. */
function MenuItem({
  selected,
  onClick,
  children,
}: {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
        paddingLeft: scheduleModal.menuItemPaddingX,
        paddingRight: scheduleModal.menuItemPaddingX,
        paddingTop: scheduleModal.menuItemPaddingY,
        paddingBottom: scheduleModal.menuItemPaddingY,
        border: 'none',
        borderRadius: radiusToken.xs,
        ...textStyle.mMedium,
        color: selected ? color.accent.schedule.main : color.navbar.text2,
        backgroundColor: hovered ? color.navbar.hover : 'transparent',
        cursor: 'pointer',
        textAlign: 'left',
      }}
    >
      {children}
    </button>
  );
}
