import { color, spacing, textStyle } from '@gigradar/theme';
import {
  ConnectionIndicator,
  HighlightedText,
  NotificationToggle,
  PlanBadge,
  ScheduleMark,
  SelectTick,
  SignalIcon,
  StagePill,
  SyncBanner,
  SyncTrack,
  VStack,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Frame } from '../components/Frame';
import { PageHeader, Section } from '../layout';
import { CrossLink } from '../navigation';

function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/** A labelled row, so each mark is named where it is drawn. */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: spacing.m }}>
      <span style={{ ...textStyle.sRegular, color: color.navbar.text, width: 150 }}>{label}</span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: spacing.s }}>
        {children}
      </span>
    </div>
  );
}

/**
 * Components ▸ CRM ▸ Inbox parts.
 *
 * The marks and controls the Inbox screens are assembled from, listed where a
 * developer looks for a component rather than only inside the screen that
 * happens to draw them. Each is exported from `@gigradar/ui` on its own.
 *
 * Filed under CRM rather than Main because every one of them names something
 * CRM-shaped — a lead's stage, a queued message, an Upwork account's socket.
 * None would mean anything in a second product.
 */
export function InboxPartsPage() {
  const [notify, setNotify] = useState(true);

  return (
    <>
      <PageHeader
        title="Inbox parts"
        description="The marks and controls the Inbox is built from — each exported on its own, and each documented in place on the screen that uses it."
      />

      <CrossLink
        eyebrow="Drawn in"
        links={[
          { label: 'CRM ▸ Inbox ▸ Cards', pageId: 'crm-inbox-cards' },
          { label: 'Left ▸ Push notifications', pageId: 'crm-inbox-push' },
          { label: 'Left ▸ Sync & import', pageId: 'crm-inbox-sync' },
          { label: 'Left ▸ Websocket indicators', pageId: 'crm-inbox-websocket' },
        ]}
      >
        This page is the index. Each part's own states, and the reasoning behind them, live on the
        screen that draws it — a mark makes sense next to the thing it marks.
      </CrossLink>

      <Section
        title="Marks"
        description="Small, presentational, and reused across screens. `StagePill` takes a tone from `color.stageFlat` rather than a stage name, so it stays a presentation component; `SelectTick` is drawn rather than a real `Checkbox`, because every row it appears in is already a button."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.m, padding: spacing.l }}>
            <Row label="StagePill">
              <StagePill tone={color.stageFlat.interested}>Interested</StagePill>
              <StagePill tone={color.stageFlat.notInterested}>Not Interested</StagePill>
            </Row>
            <Row label="SelectTick">
              <SelectTick />
              <SelectTick checked />
              <SelectTick shape="square" checked />
              <SelectTick disabled />
            </Row>
            <Row label="ScheduleMark">
              <ScheduleMark />
            </Row>
            <Row label="PlanBadge">
              <PlanBadge tone="pro" />
              <PlanBadge tone="trial" note="(7D Remaining)" />
            </Row>
            <Row label="SignalIcon">
              <SignalIcon state="online" />
              <SignalIcon state="offline" />
              <SignalIcon state="error" />
            </Row>
          </div>
        </Frame>
        <CodeBlock
          code={`<StagePill tone={color.stageFlat.interested}>Interested</StagePill>
<SelectTick checked shape="square" />
<ScheduleMark />
<PlanBadge tone="pro" />
<SignalIcon state="offline" />`}
        />
      </Section>

      <Section
        title="Controls"
        description="These carry behaviour rather than only appearance, so each has its own page where that behaviour is walked through."
      >
        <Frame height="auto">
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.m, padding: spacing.l }}>
            <Row label="NotificationToggle">
              <NotificationToggle checked={notify} onCheckedChange={setNotify} />
            </Row>
            <Row label="ConnectionIndicator">
              <ConnectionIndicator state="online" />
              <ConnectionIndicator state="error" />
            </Row>
            <Row label="HighlightedText">
              <HighlightedText query="Developer">Full Stack Developer — Immediate Start</HighlightedText>
            </Row>
          </div>
        </Frame>
        <CodeBlock
          code={`<NotificationToggle checked={on} onCheckedChange={setOn} />
<ConnectionIndicator state="online" />
<HighlightedText query={query}>{room.title}</HighlightedText>`}
        />
      </Section>

      <Section
        title="Sync"
        description="The import's tracker and its note. `SyncTrack` draws the marks and the rails between them as one row, because a rail has to end exactly where the next mark begins."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l, maxWidth: 360 }}>
            <VStack gap={16}>
              <SyncTrack
                steps={[
                  { label: 'Prepare', state: 'done' },
                  { label: 'Import', state: 'active' },
                  { label: 'Done' },
                ]}
              />
              <SyncBanner>By default, CRM imports the past 90 days of your chat history.</SyncBanner>
            </VStack>
          </div>
        </Frame>
        <Caption>
          `SyncProgress` assembles both with a headline — see Left ▸ Sync &amp; import.
        </Caption>
        <CodeBlock
          code={`<SyncTrack steps={[{ label: 'Prepare', state: 'done' }, …]} />
<SyncBanner tone="warning">Please authorise your Upwork account.</SyncBanner>`}
        />
      </Section>
    </>
  );
}
