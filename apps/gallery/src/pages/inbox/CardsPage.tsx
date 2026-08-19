import { color, spacing, textStyle } from '@gigradar/theme';
import {
  InboxRoom,
  NotificationToggle,
  PushNotificationToggle,
  ScheduleMark,
  SelectTick,
  StagePill,
  type PushPermission,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { rooms } from '../../fixtures/inbox';
import { Caption, Column } from './parts';

/**
 * Left ▸ Cards — Figma node 43:3835 ("Select Chat").
 *
 * The card itself, split off the column's page: it is the piece with ten
 * states and the piece a second screen is most likely to want, and documenting
 * it inside the column's page buried it under the column's own concerns.
 */
export function CardsPage() {
  const [selected, setSelected] = useState('r1');
  const [picked, setPicked] = useState<string[]>(['r1']);
  const [notify, setNotify] = useState(true);
  const [push, setPush] = useState(false);
  const [permission, setPermission] = useState<PushPermission | null>(null);

  return (
    <>
      <PageHeader
        title="Cards"
        description="One conversation per card — stage, title, sender, preview, and unread count. Figma node 43:3835, whose ten states this draws."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Components ▸ Main ▸ Avatar', pageId: 'avatar' },
          { label: 'Components ▸ Main ▸ Badge', pageId: 'badge' },
          { label: 'List of Room (Left)', pageId: 'crm-inbox-left' },
        ]}
      >
        A card is assembled from <strong>Avatar</strong>, <strong>CounterBadge</strong>, and{' '}
        <strong>Skeleton</strong> off the generic tier, plus the column's own{' '}
        <strong>StagePill</strong>, <strong>SelectTick</strong>, and <strong>ScheduleMark</strong> —
        each exported on its own and shown in the last section here.
      </CrossLink>

      <Section
        title="Resting"
        description="Every line is clamped to one row and the card's height is fixed, so a long job title and a long message cannot push the next room down the list. Scanning depends on the rows staying where the eye expects them."
      >
        <Frame height="auto" hug>
          <Column>
            {rooms.map((room) => (
              <InboxRoom
                key={room.id}
                title={room.title}
                sender={room.sender}
                preview={room.preview}
                timestamp={room.timestamp}
                stage={room.stage}
                name={room.name}
              avatarSrc={room.avatarSrc}
                avatarSrc={room.avatarSrc}
                unread={room.unread}
                selected={selected === room.id}
                onClick={() => setSelected(room.id)}
              />
            ))}
          </Column>
        </Frame>
        <Caption>
          The selected card takes the brand blue and inverts its text; the rest sit on white with a
          pale border.
        </Caption>
        <CodeBlock
          code={`<InboxRoom
  title="Full Stack Developer - Immediate Start"
  sender="Michael"
  preview="Perfect. Let's try to have a working login…"
  timestamp="Now"
  stage={{ label: 'New', tone: color.stageFlat.new }}
  name="Olivia Moore"
  unread={1}
  selected={id === selected}
  onClick={() => setSelected(id)}
/>`}
        />
      </Section>

      <Section
        title="Hover"
        description="The card fills with the badge tint and drops its border. The border is matched to the fill rather than removed, so the card does not shift by a pixel as it lights up."
      >
        <Frame height="auto" hug>
          <Column>
            {rooms.slice(0, 2).map((room) => (
              <InboxRoom
                key={room.id}
                title={room.title}
                sender={room.sender}
                preview={room.preview}
                timestamp={room.timestamp}
                stage={room.stage}
                name={room.name}
              avatarSrc={room.avatarSrc}
                avatarSrc={room.avatarSrc}
                unread={room.unread}
              />
            ))}
          </Column>
        </Frame>
        <Caption>Hover either card.</Caption>
      </Section>

      <Section
        title="Picking rooms"
        description="In selection mode the unread counter gives way to a round tick and the sender drops off the preview — the row is about which rooms are picked, not who spoke last. Marking read is the only flow that selects rooms today, so `selecting` is a boolean rather than a mode."
      >
        <Frame height="auto" hug>
          <Column>
            {rooms.slice(0, 3).map((room) => (
              <InboxRoom
                key={room.id}
                title={room.title}
                preview={room.preview}
                timestamp={room.timestamp}
                stage={room.stage}
                name={room.name}
              avatarSrc={room.avatarSrc}
                avatarSrc={room.avatarSrc}
                selecting
                checked={picked.includes(room.id)}
                onClick={() =>
                  setPicked((current) =>
                    current.includes(room.id)
                      ? current.filter((id) => id !== room.id)
                      : [...current, room.id],
                  )
                }
              />
            ))}
          </Column>
        </Frame>
        <Caption>Click to tick. The bar that drives this lives on the Mark as read page.</Caption>
        <CodeBlock code={`<InboxRoom selecting checked={picked} onClick={toggle} />`} />
      </Section>

      <Section
        title="Unavailable"
        description="Three states where the room cannot be acted on. Disabled and error keep the text legible rather than hiding it — the error card in particular is the one the person has to do something about, so removing its content would be exactly backwards."
      >
        <Frame height="auto" hug>
          <Column>
            <InboxRoom
              title={rooms[0].title}
              preview={rooms[0].preview}
              timestamp={rooms[0].timestamp}
              name={rooms[0].name}
              avatarSrc={rooms[0].avatarSrc}
              selecting
              disabled
            />
            <InboxRoom
              title={rooms[0].title}
              preview={rooms[0].preview}
              timestamp={rooms[0].timestamp}
              name={rooms[0].name}
              avatarSrc={rooms[0].avatarSrc}
              selecting
              error
            />
            <InboxRoom title="" loading />
          </Column>
        </Frame>
        <Caption>
          Disabled, error, and the first-load placeholder — which matches the card's height exactly,
          so the list does not reflow as rooms arrive.
        </Caption>
        <CodeBlock
          code={`<InboxRoom selecting disabled />
<InboxRoom selecting error />
<InboxRoom loading />`}
        />
      </Section>

      <Section
        title="Scheduled"
        description="A purple clock beside the preview marks a room that already carries a scheduled message. It sits with the preview rather than the title because it describes what is queued to happen, not what the room is."
      >
        <Frame height="auto" hug>
          <Column>
            <InboxRoom
              title={rooms[0].title}
              sender={rooms[0].sender}
              preview={rooms[0].preview}
              timestamp={rooms[0].timestamp}
              stage={rooms[0].stage}
              name={rooms[0].name}
              avatarSrc={rooms[0].avatarSrc}
              scheduled
            />
            <InboxRoom
              title={rooms[1].title}
              preview={rooms[1].preview}
              timestamp={rooms[1].timestamp}
              stage={rooms[1].stage}
              name={rooms[1].name}
              avatarSrc={rooms[1].avatarSrc}
              selecting
              checked
              scheduled
            />
          </Column>
        </Frame>
        <Caption>On a resting card, and on one ticked for a new scheduled send.</Caption>
        <CodeBlock code={`<InboxRoom scheduled />`} />
      </Section>

      <Section
        title="The parts a card is built from"
        description="Each of these is exported on its own, so a screen outside the Inbox can draw one without rebuilding it. `StagePill` takes a tone from `color.stageFlat` rather than a stage name, so it stays presentational; `SelectTick` is a drawn mark rather than a real `Checkbox`, because every row it appears in is already a button and a checkbox nested in a button swallows its own click."
      >
        <Frame height="auto">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: spacing.l,
              padding: spacing.l,
              flexWrap: 'wrap',
            }}
          >
            <StagePill tone={color.stageFlat.interested}>Interested</StagePill>
            <StagePill tone={color.stageFlat.new}>New</StagePill>
            <SelectTick />
            <SelectTick checked />
            <SelectTick shape="square" checked />
            <SelectTick disabled />
            <ScheduleMark />
            <NotificationToggle checked={notify} onCheckedChange={setNotify} />
          </div>
        </Frame>
        <Caption>
          Stage pills, the round tick with its square form and disabled state, the schedule clock,
          and the header's notification toggle.
        </Caption>
        <CodeBlock
          code={`<StagePill tone={color.stageFlat.interested}>Interested</StagePill>
<SelectTick shape="square" checked />
<ScheduleMark />
<NotificationToggle checked={on} onCheckedChange={setOn} />`}
        />
      </Section>

      <Section
        title="Push notifications"
        description="`PushNotificationToggle` wraps the bare switch with the two behaviours that only make sense together: a hover explainer, and asking the browser for permission on the way on. The bare `NotificationToggle` is still right wherever permission is already settled and no explanation is owed."
      >
        <Frame height={280}>
          <div style={{ display: 'flex', gap: spacing.l, padding: spacing.l, alignItems: 'center' }}>
            <PushNotificationToggle
              checked={push}
              onCheckedChange={setPush}
              onPermissionChange={setPermission}
              // Left-aligned here because this demo puts the toggle at the
              // frame's leading edge; in the real header it sits at the
              // trailing one, which is what the `end` default is for.
              tooltipAlign="start"
            />
            <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>
              {permission ? `Browser said: ${permission}` : 'Hover the toggle, then switch it on.'}
            </span>
          </div>
        </Frame>
        <Caption>
          Hovering opens the explainer; "Later" retires it for the session. Switching on calls the
          browser's permission prompt and fires a sample notification if it is granted — and if the
          browser blocks it, the switch returns to off rather than lying about a channel that will
          deliver nothing.
        </Caption>
        <CodeBlock
          code={`<PushNotificationToggle
  checked={enabled}
  onCheckedChange={setEnabled}
  onPermissionChange={(p) => console.log(p)} // 'granted' | 'denied' | 'default' | 'unsupported'
/>`}
        />
      </Section>
    </>
  );
}
