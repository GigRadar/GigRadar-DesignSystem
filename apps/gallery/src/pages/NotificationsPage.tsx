import { color, spacing, textStyle } from '@gigradar/theme';
import {
  ChannelLogo,
  CrmNotifications,
  HStack,
  NotificationStep,
  NotificationWalkthrough,
  StatusBadge,
  Toggle,
  VStack,
  channelPalette,
  type NotificationChannel,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Frame } from '../components/Frame';
import { ConnectedSettings, DESTINATION, FLOWS } from '../fixtures/notifications';
import { PageHeader, Section } from '../layout';
import { CrossLink } from '../navigation';

/** A caption under a demo, matching the other gallery pages. */
function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/**
 * CRM ▸ Settings ▸ CRM Notifications — the screen, not the channels.
 *
 * Figma node 4102:3182 draws it collapsed. Each channel's own flow has a page
 * under this one, so this page is about what the screen owns: the stack, and
 * the pieces every card is built from.
 */
export function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="CRM Notifications"
        description="CRM ▸ Settings ▸ CRM Notifications. One card per delivery channel, each with its own connection walkthrough and, once connected, its notification settings. Figma node 4102:3182."
      />

      <CrossLink
        eyebrow="The screen's three channels"
        links={[
          { label: 'Telegram', pageId: 'crm-notif-telegram' },
          { label: 'Slack', pageId: 'crm-notif-slack' },
          { label: 'Browser', pageId: 'crm-notif-browser' },
          { label: 'Components ▸ Main ▸ Toggle', pageId: 'toggle' },
        ]}
      >
        This page is the assembled screen and the parts every card shares. Each channel's own
        connection flow — and the states it moves through — has a page under this one, because the
        three flows ask for genuinely different things.
      </CrossLink>

      <Section
        title="The screen"
        description="Three channels, stacked. Every card starts switched off and collapsed; switching one on opens its walkthrough. The toggle and the chevron are separate — switching a channel off stops notifications, folding it only tidies the screen."
      >
        <ScreenDemo />
        <CodeBlock
          code={`<CrmNotifications
  channels={[
    { channel: 'telegram', children: <NotificationWalkthrough steps={telegramSteps} current={step} /> },
    { channel: 'slack', children: <NotificationWalkthrough steps={slackSteps} current={step} /> },
    { channel: 'browser', children: <NotificationWalkthrough steps={browserSteps} current={step} /> },
  ]}
  onEnabledChange={(channel, enabled) => save(channel, enabled)}
/>`}
        />
      </Section>

      <Section
        title="Category icon or logo"
        description="Figma node 4101:28355. One tile per channel, each on its own tint: Slack and Telegram take their brand colors from `color.integration`, and the browser — which is nobody's brand — takes the GigRadar badge blue."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <HStack gap={16} alignItems="center">
              <ChannelLogo channel="telegram" />
              <ChannelLogo channel="slack" />
              <ChannelLogo channel="browser" />
            </HStack>
          </div>
        </Frame>
        <Caption>Telegram, Slack, browser. 36px tile, 8px radius, 20px glyph.</Caption>
        <CodeBlock code={`<ChannelLogo channel="slack" />`} />
      </Section>

      <Section
        title="Step"
        description="Figma node 4101:28443. Three states. A complete step turns green and carries that color down its rail, so the rail alone says how far the flow has got. An active step takes the channel's color; a pending one is a hollow disc showing its number."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <VStack width={320}>
              <NotificationStep
                number={1}
                state="complete"
                accentColor={channelPalette.telegram.color}
              >
                <span style={{ ...textStyle.mRegular, color: color.navbar.text }}>
                  Open the Telegram bot
                </span>
              </NotificationStep>
              <NotificationStep number={2} state="active" accentColor={channelPalette.telegram.color}>
                <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
                  Send the start command
                </span>
              </NotificationStep>
              <NotificationStep
                number={3}
                state="pending"
                connector={false}
                accentColor={channelPalette.telegram.color}
              >
                <span style={{ ...textStyle.mRegular, color: color.navbar.text }}>
                  Verify connection
                </span>
              </NotificationStep>
            </VStack>
          </div>
        </Frame>
        <Caption>
          Complete, active, pending. The last step drops its connector — it has nothing to join.
        </Caption>
        <CodeBlock
          code={`<NotificationStep number={2} state="active" accentColor={accent}>
  Send the start command
</NotificationStep>`}
        />
      </Section>

      <Section
        title="Status badge"
        description="Figma node 4100:28304. The existing StatusBadge, extended rather than replaced: two connection tones that draw as a round pill with a leading dot, beside the account tones that still draw as Figma's 4px box."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <VStack gap={12} alignItems="flex-start">
              <HStack gap={8}>
                <StatusBadge tone="connected" />
                <StatusBadge tone="notConnected" />
              </HStack>
              <HStack gap={8}>
                <StatusBadge tone="active" />
                <StatusBadge tone="suspended" />
                <StatusBadge tone="pending" />
              </HStack>
            </VStack>
          </div>
        </Frame>
        <Caption>
          The two connection tones (pill, dotted) over the account tones they were added beside.
        </Caption>
        <CodeBlock
          code={`<StatusBadge tone="connected" />     // ● Connected — pill
<StatusBadge tone="notConnected" />  // ● Not connected — pill
<StatusBadge tone="active" />        // Active — unchanged 4px box`}
        />
      </Section>

      <Section
        title="Toggle"
        description="The switch on every card's header. Filed under Components ▸ Main, since a binary switch knows nothing about notifications — this is the one place the notification screen uses it."
      >
        <Frame height="auto">
          <div style={{ padding: spacing.l }}>
            <HStack gap={16} alignItems="center">
              <Toggle defaultChecked={false} label="Off example" />
              <Toggle defaultChecked label="On example" />
            </HStack>
          </div>
        </Frame>
        <Caption>
          The cards draw the bare track, which hugs its handle. The captioned variant and every
          other state are documented on the Toggle page.
        </Caption>
        <CodeBlock code={`<Toggle checked={on} onCheckedChange={setOn} label="Slack notifications" />`} />
      </Section>
    </>
  );
}

/** The whole screen, with each card driving its own flow. */
function ScreenDemo() {
  const [progress, setProgress] = useState<Record<string, number>>({
    telegram: 0,
    slack: 0,
    browser: 0,
  });

  const bodyFor = (channel: NotificationChannel) => {
    const steps = FLOWS[channel];
    const current = progress[channel] ?? 0;
    if (current >= steps.length) {
      return <ConnectedSettings channel={channel} value={DESTINATION[channel]} />;
    }
    return (
      <NotificationWalkthrough
        steps={steps}
        current={current}
        renderStep={({ state, defaultRender }) => (
          <div
            onClick={
              state === 'active'
                ? () => setProgress((prev) => ({ ...prev, [channel]: (prev[channel] ?? 0) + 1 }))
                : undefined
            }
            style={{ cursor: state === 'active' ? 'pointer' : undefined }}
          >
            {defaultRender()}
          </div>
        )}
      />
    );
  };

  return (
    <Frame height="auto">
      <CrmNotifications
        channels={(['telegram', 'slack', 'browser'] as NotificationChannel[]).map((channel) => ({
          channel,
          connected: (progress[channel] ?? 0) >= FLOWS[channel].length,
          children: bodyFor(channel),
        }))}
      />
    </Frame>
  );
}
