import { spacing } from '@gigradar/theme';
import {
  AutoCancelSwitch,
  Button,
  ScheduleMessageModal,
  ScheduledBadge,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption, Row, Surface } from './parts';

const TIMEZONES = [
  {
    id: 'you',
    label: 'You',
    offset: '(UTC+08:00)',
    avatar: { initials: 'MO', tone: 'purple' as const },
  },
  {
    id: 'client',
    label: 'Client',
    offset: '(UTC+06:00)',
    avatar: { initials: 'FM', tone: 'purple' as const },
  },
];

/**
 * Mid ▸ Schedule Message ▸ Badge & Modal.
 *
 * The two pieces that belong to scheduling rather than to either room: the bar
 * that links them, and the modal that puts a message in the queue.
 */
export function SchedulePartsPage() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState('09:00');
  const [zone, setZone] = useState('you');
  const [autoCancel, setAutoCancel] = useState(false);

  return (
    <>
      <PageHeader
        title="Badge & Modal"
        description="The bar linking a chat room to its outbox, and the modal that queues a message. Figma nodes 2077:17394, 2089:7347 and 2077:8807."
      />

      <CrossLink
        eyebrow="Related"
        links={[
          { label: 'Schedule Message (Mid)', pageId: 'crm-mid-scheduled' },
          { label: 'Chat Room (Mid)', pageId: 'crm-mid' },
          { label: 'Components ▸ Main ▸ Date picker', pageId: 'date-picker' },
        ]}
      >
        The modal's calendar is the system's own <strong>DatePicker</strong> with its accent swapped
        for the schedule purple — the same component wearing the colour of the surface it is on.
      </CrossLink>

      <Section
        title="The badge"
        description="Two states of one bar. In the room it offers the way out to the queue; in the queue it offers the way back. The glyphs report what is waiting rather than decorating the bar — the clock is always there because the badge only appears when something is scheduled, and the other two appear only when they are true."
      >
        <Surface>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s }}>
            <ScheduledBadge place="room" onNavigate={() => undefined} />
            <ScheduledBadge place="room" autoCancel onNavigate={() => undefined} />
            <ScheduledBadge place="room" autoCancel laziza onNavigate={() => undefined} />
            <ScheduledBadge place="queue" onNavigate={() => undefined} />
          </div>
        </Surface>
        <Caption>
          Top to bottom: scheduled messages, scheduled with auto-cancel armed, the same with a
          Laziza follow-up queued, and the bar as it reads from inside the queue.
        </Caption>
        <CodeBlock
          code={`<ScheduledBadge place="room" autoCancel laziza onNavigate={openQueue} />
<ScheduledBadge place="queue" onNavigate={backToRoom} />`}
        />
      </Section>

      <Section
        title="Auto-cancel"
        description="Whether a queued message withdraws itself when the client writes first. The label takes the schedule purple on hover and while on — the two states where the control is the thing you are looking at rather than a setting sitting in a header."
      >
        <Surface>
          <Row>
            <AutoCancelSwitch defaultChecked={false} />
            <AutoCancelSwitch defaultChecked />
            <AutoCancelSwitch compact defaultChecked />
          </Row>
        </Surface>
        <Caption>
          Hover either of the first two to see the label tint. The third is the label-less form the
          mobile queue header draws.
        </Caption>
        <CodeBlock code={`<AutoCancelSwitch checked={on} onCheckedChange={setOn} />`} />
      </Section>

      <Section
        title="Choosing a time"
        description="The modal the composer's schedule button opens. Built as one component reading whether a date has been picked rather than as Figma's two variants: before a date there is nothing for the time, timezone or confirm to attach to, so they wait; after it they are live. That is the only difference between the two frames."
      >
        <Surface>
          <Row>
            <Button tone="schedule" onClick={() => setOpen(true)}>
              Open the picker
            </Button>
          </Row>
        </Surface>
        <Caption>
          {date == null
            ? 'Open it and pick a day — the time, timezone and Schedule button are faded until you do.'
            : `Scheduled for ${date.toDateString()} at ${time}, ${zone === 'you' ? 'your' : "the client's"} time.`}
        </Caption>
        <ScheduleMessageModal
          open={open}
          onClose={() => setOpen(false)}
          date={date}
          onDateChange={setDate}
          time={time}
          onTimeChange={setTime}
          timezones={TIMEZONES}
          timezoneId={zone}
          onTimezoneChange={setZone}
          autoCancel={autoCancel}
          onAutoCancelChange={setAutoCancel}
          onSchedule={() => setOpen(false)}
        />
        <CodeBlock
          code={`<ScheduleMessageModal
  open={open}
  onClose={close}
  date={date}
  onDateChange={setDate}
  time={time}
  onTimeChange={setTime}
  timezones={[
    { id: 'you', label: 'You', offset: '(UTC+08:00)', avatar: { src: me } },
    { id: 'client', label: 'Client', offset: '(UTC+06:00)', avatar: { src: them } },
  ]}
  timezoneId={zone}
  onTimezoneChange={setZone}
  autoCancel={autoCancel}
  onAutoCancelChange={setAutoCancel}
  onSchedule={queue}
/>`}
        />
      </Section>

      <Section
        title="Only two timezones"
        description="Yours and the client's, rather than a searchable list. “09:00 their time” against “09:00 my time” is the whole question a scheduled message asks, and four hundred zones would bury it — the two that matter are the two people the message is between."
      >
        <CodeBlock
          code={`timezones={[
  { id: 'you', label: 'You', offset: '(UTC+08:00)' },
  { id: 'client', label: 'Client', offset: '(UTC+06:00)' },
]}`}
        />
      </Section>
    </>
  );
}
