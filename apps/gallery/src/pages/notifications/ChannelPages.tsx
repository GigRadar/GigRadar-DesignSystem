import { color, spacing, textStyle } from '@gigradar/theme';
import {
  Button,
  HStack,
  Icon,
  IconRightArrow,
  NotificationCard,
  NotificationWalkthrough,
  type NotificationChannel,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { ConnectedSettings, DESTINATION, FLOWS } from '../../fixtures/notifications';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';

/** A caption under a demo, matching the other gallery pages. */
function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/** What each channel's page says about itself. */
const COPY: Record<
  NotificationChannel,
  { title: string; node: string; description: string; summary: string }
> = {
  telegram: {
    title: 'Telegram',
    node: '4101:28455',
    description:
      'The Telegram channel — three steps: add the bot to a channel or group, send it the start command, then verify.',
    summary:
      'The longest of the three flows, and the only one whose middle step hands the user something to copy. The command carries the workspace id, so it cannot be typed from memory — which is what the copy field is for.',
  },
  slack: {
    title: 'Slack',
    node: '4102:98',
    description:
      'The Slack channel — two steps: allow GigRadar in the workspace, then verify the webhook delivers.',
    summary:
      'Two steps rather than three: Slack’s OAuth screen does the work Telegram needs a command for, so authorizing and choosing a channel are one action.',
  },
  browser: {
    title: 'Browser',
    node: '4102:439',
    description:
      'The browser channel — two steps: request the notification permission, then confirm it was granted.',
    summary:
      'The only flow whose first step is answered outside the page. The browser paints the permission prompt itself, so the second step asks what happened rather than checking.',
  },
};

/**
 * One channel's page — its flow stepped through, and its connected state.
 *
 * The three pages are one component because they differ only in which flow
 * they walk: the states a channel moves through, and what each looks like, is
 * the same question for all three.
 */
function ChannelPage({ channel }: { channel: NotificationChannel }) {
  const copy = COPY[channel];
  const steps = FLOWS[channel];

  return (
    <>
      <PageHeader
        title={copy.title}
        description={`CRM ▸ Settings ▸ CRM Notifications ▸ ${copy.title}. ${copy.description} Figma node ${copy.node}.`}
      />

      <CrossLink
        eyebrow="Part of the notifications screen"
        links={[
          { label: 'The whole screen', pageId: 'crm-settings-notifications' },
          { label: 'Components ▸ Main ▸ Toggle', pageId: 'toggle' },
        ]}
      >
        {copy.summary} The card, the walkthrough, and the settings below are the same components
        every channel uses — only the steps differ, and they are passed as data.
      </CrossLink>

      <Section
        title="Step through it"
        description="Every step past the current one shows its title alone; the active step is the only one carrying a description and buttons. Once every step is done the card swaps its walkthrough for the connected settings."
      >
        <FlowDemo channel={channel} />
        <CodeBlock
          code={`<NotificationCard channel="${channel}" connected={done} defaultEnabled>
  {done
    ? <ConnectedSettings />
    : <NotificationWalkthrough steps={steps} current={current} />}
</NotificationCard>`}
        />
      </Section>

      <Section
        title="Every state"
        description="The same card at each point in its flow, so they can be compared side by side rather than stepped through."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.m }}>
            <NotificationCard channel={channel} />
          </div>
        </Frame>
        <Caption>Off — collapsed, not connected. The state every card starts in.</Caption>

        {steps.map((step, index) => (
          <div key={index}>
            <Frame height="auto">
              <div style={{ padding: spacing.m }}>
                <NotificationCard channel={channel} defaultEnabled>
                  <NotificationWalkthrough steps={steps} current={index} />
                </NotificationCard>
              </div>
            </Frame>
            <Caption>
              Step {index + 1} of {steps.length}
              {typeof step.title === 'string' ? ` — “${step.title}”.` : '.'}
            </Caption>
          </div>
        ))}

        <Frame height="auto">
          <div style={{ padding: spacing.m }}>
            <NotificationCard channel={channel} connected defaultEnabled expanded={false} />
          </div>
        </Frame>
        <Caption>Connected, folded shut — Figma's “ON - Minimized”.</Caption>

        <Frame height="auto">
          <div style={{ padding: spacing.m }}>
            <NotificationCard channel={channel} connected defaultEnabled>
              <ConnectedSettings channel={channel} value={DESTINATION[channel]} />
            </NotificationCard>
          </div>
        </Frame>
        <Caption>Connected and open — the destination, and the two option cards.</Caption>
      </Section>
    </>
  );
}

/** One channel stepped through by hand, so every state is reachable. */
function FlowDemo({ channel }: { channel: NotificationChannel }) {
  const steps = FLOWS[channel];
  const [current, setCurrent] = useState(0);
  const done = current >= steps.length;

  return (
    <>
      <HStack gap={8} mb="s">
        <Button size="small" variant="secondary" onClick={() => setCurrent((n) => Math.max(0, n - 1))}>
          Back
        </Button>
        <Button
          size="small"
          onClick={() => setCurrent((n) => Math.min(steps.length, n + 1))}
          endIcon={<Icon icon={IconRightArrow} size={12} />}
        >
          {done ? 'Done' : `Step ${current + 1} of ${steps.length}`}
        </Button>
      </HStack>
      <Frame height="auto">
        <div style={{ padding: spacing.m }}>
          <NotificationCard channel={channel} connected={done} defaultEnabled>
            {done ? (
              <ConnectedSettings channel={channel} value={DESTINATION[channel]} />
            ) : (
              <NotificationWalkthrough steps={steps} current={current} />
            )}
          </NotificationCard>
        </div>
      </Frame>
    </>
  );
}

export function TelegramNotificationPage() {
  return <ChannelPage channel="telegram" />;
}

export function SlackNotificationPage() {
  return <ChannelPage channel="slack" />;
}

export function BrowserNotificationPage() {
  return <ChannelPage channel="browser" />;
}
