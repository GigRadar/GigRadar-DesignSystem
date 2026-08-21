import { spacing } from '@gigradar/theme';
import {
  InboxList,
  InboxRoom,
  PlanBadge,
  SyncBanner,
  SyncProgress,
  SyncTrack,
  type SyncPhase,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { accounts, rooms } from '../../fixtures/inbox';
import { Caption, Column } from './parts';

/** The column at its real height, matching the other Inbox previews. */
const COLUMN_HEIGHT = 734;

/** The phases in the order the import runs through them. */
const PHASES: { phase: SyncPhase; label: string }[] = [
  { phase: 'preparing', label: 'Preparing' },
  { phase: 'importing', label: 'Importing' },
  { phase: 'blocked', label: 'Action required' },
  { phase: 'done', label: 'Done' },
];

/**
 * Left ▸ Sync & import — Figma nodes 2965:18056 (step), 2966:18086 (progress),
 * 3312:24083 (banner), 2959:16844 (the column while importing), with the flow
 * at 5205:68950 in the CRM file.
 *
 * Its own SubNav rather than a section on another page: importing is a phase
 * the whole column is in, not a control inside it, and it owns three exported
 * components of its own.
 */
export function SyncPage() {
  const [phase, setPhase] = useState<SyncPhase>('importing');

  return (
    <>
      <PageHeader
        title="Sync & import"
        description="Bringing chat history into the room list — the progress tracker, its steps, and the note under them. Figma nodes 2966:18086 and 2965:18056."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'List of Room (Left)', pageId: 'crm-inbox-left' },
          { label: 'Components ▸ Main ▸ Spinner', pageId: 'spinner' },
        ]}
      >
        <strong>SyncProgress</strong> stacks a headline over a three-step{' '}
        <strong>SyncStep</strong> tracker and a <strong>SyncBanner</strong>. It fills the room list
        as its children while the import runs, the same slot the empty and loading states use.
      </CrossLink>

      <Section
        title="In the column"
        description="Importing is a phase the whole column is in, so it takes the place of the room list rather than sitting above it. The controls stay put — an account can still be picked while history arrives — and the rooms appear underneath as they land."
      >
        <Frame height={COLUMN_HEIGHT} hug>
          <InboxList
            badge={<PlanBadge tone="pro" />}
            accounts={accounts}
            connection={phase === 'done' ? 'online' : 'syncing'}
          >
            <SyncProgress phase={phase} imported={98} total={110} />
            {phase !== 'preparing' &&
              rooms.slice(0, phase === 'done' ? 4 : 2).map((room) => (
                <InboxRoom
                  key={room.id}
                  title={room.title}
                  sender={room.sender}
                  preview={room.preview}
                  timestamp={room.timestamp}
                  stage={room.stage}
                  name={room.name}
                  avatarSrc={room.avatarSrc}
                  unread={room.unread}
                />
              ))}
          </InboxList>
        </Frame>
        <Caption>
          <span style={{ display: 'inline-flex', gap: spacing.xs, flexWrap: 'wrap' }}>
            {PHASES.map((item) => (
              <button
                key={item.phase}
                type="button"
                onClick={() => setPhase(item.phase)}
                style={{ font: 'inherit', cursor: 'pointer' }}
              >
                {item.label}
              </button>
            ))}
          </span>
        </Caption>
        <CodeBlock
          code={`<InboxList accounts={accounts} connection="syncing">
  <SyncProgress phase="importing" imported={98} total={110} />
  {arrived.map((room) => <InboxRoom key={room.id} {...room} />)}
</InboxList>`}
        />
      </Section>

      <Section
        title="The phases"
        description="Four, and the fourth is not an error. `blocked` means the import stopped and is waiting on the person — reauthorising an account, usually — and it resumes once that is cleared, which is why it takes the warning tone rather than the error one."
      >
        <Frame height="auto" hug>
          <Column width={359}>
            <SyncProgress phase="preparing" />
            <SyncProgress phase="importing" imported={98} total={110} />
            <SyncProgress phase="blocked" />
            <SyncProgress phase="done" />
          </Column>
        </Frame>
        <Caption>
          Preparing, importing with its running count, blocked, and done. The headline drops away at
          the end — three ticks say it already.
        </Caption>
        <CodeBlock code={`<SyncProgress phase="importing" imported={98} total={110} />`} />
      </Section>

      <Section
        title="The track"
        description="Built as one row that alternates mark, rail, mark — not as steps each carrying their own rail. A rail has to end exactly where the next mark begins, and a step laid out on its own cannot know where that is, so the rails belong to the track rather than to the steps either side of them."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l, width: 335 }}>
            <SyncTrack
              steps={[
                { label: 'Prepare', state: 'done' },
                { label: 'Import', state: 'active' },
                { label: 'Done', state: 'pending' },
              ]}
            />
          </div>
        </Frame>
        <Caption>
          Done, active, and pending. Each rail carries the colour of the step it leaves, so the line
          changes hue at the mark it has reached rather than between marks.
        </Caption>
        <CodeBlock
          code={`<SyncTrack
  steps={[
    { label: 'Prepare', state: 'done' },
    { label: 'Import', state: 'active' },
    { label: 'Done' },
  ]}
/>`}
        />
      </Section>

      <Section
        title="The banner"
        description="Takes its message as children rather than a string: every variant Figma draws carries an inline link — “contact our team”, “dismiss it now” — and a component owning the copy would have to own those handlers too."
      >
        <Frame height="auto" hug>
          <Column width={359}>
            <SyncBanner>
              By default, CRM imports the past 90 days of your chat history.{' '}
              <a href="#contact">Contact our team</a> to import more.
            </SyncBanner>
            <SyncBanner tone="warning">
              Please authorise your Upwork account through Settings › Upwork API.
            </SyncBanner>
          </Column>
        </Frame>
        <Caption>Info and warning. Warning is a pause, not a failure.</Caption>
        <CodeBlock
          code={`<SyncBanner tone="warning">Please authorise your Upwork account.</SyncBanner>`}
        />
      </Section>
    </>
  );
}
