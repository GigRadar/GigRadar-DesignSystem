import { color } from '@gigradar/theme';
import {
  AutoReplyButton,
  Button,
  CustomPromptField,
  HStack,
  Icon,
  IconAllMessageBubbleFill,
  IconAssignedPeopleFill,
  IconBubbleCrossFill,
  IconCheck,
  IconGoToExternal,
  IconLeadRepliesBubbleFill,
  IconMentioned,
  IconNotificationBellFill,
  IconRestoreArrow,
  IconRightArrow,
  IconUnreadBubbleFill,
  IconXClose,
  NotificationSettingsGroup,
  VStack,
  channelPalette,
  type NotificationChannel,
  type WalkthroughStep,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';

export const BOT = '@GigRadarStage2_bot';
export const START_COMMAND = '/subscribe_crm_6a0497c04099a2304fe24287@GigRadarStage2_bot';

/** Where each connected channel says its notifications are going. */
export const DESTINATION: Record<NotificationChannel, string> = {
  telegram: START_COMMAND,
  slack: 'GigRadar #@channel.name',
  browser: 'Site Settings > Notifications > Allowed to send notifications',
};

/**
 * The action row an active step carries.
 *
 * Every flow ends its active step with the same shape — a channel-tinted
 * secondary action beside a filled primary — so the flows below describe
 * theirs as data rather than repeating the markup.
 */
function StepActions({
  channel,
  secondary,
  secondaryIcon,
  primary,
  primaryIcon = <Icon icon={IconRightArrow} size={12} />,
}: {
  channel: NotificationChannel;
  secondary: string;
  secondaryIcon?: ReactNode;
  primary: string;
  primaryIcon?: ReactNode;
}) {
  const accent = channelPalette[channel];
  return (
    <HStack gap={8}>
      <Button
        size="small"
        variant="secondary"
        startIcon={secondaryIcon}
        background={accent.background}
        textColor={accent.color}
        borderColor={channel === 'browser' ? color.badge.border : undefined}
      >
        {secondary}
      </Button>
      <Button size="small" background={accent.color} borderColor={accent.color} endIcon={primaryIcon}>
        {primary}
      </Button>
    </HStack>
  );
}

/** The three connection flows, exactly as Figma writes them. */
export const FLOWS: Record<NotificationChannel, WalkthroughStep[]> = {
  telegram: [
    {
      title: (
        <>
          Add <span style={{ color: color.main.brand }}>{BOT}</span> to your channel or group first
        </>
      ),
      description: `Click the button below to add ${BOT} to your Telegram.`,
      content: (
        <StepActions
          channel="telegram"
          secondary="Add to your channel or group"
          secondaryIcon={<Icon icon={IconGoToExternal} size={12} />}
          primary="Next"
        />
      ),
    },
    {
      title: 'Send the start command',
      description: `Before running this command, be sure to there is ${BOT} to your group or channel.`,
      content: (
        <VStack gap={8} width="100%">
          <CustomPromptField
            value={START_COMMAND}
            resizable={false}
            readOnly
            copyButton
            rows={1}
            minHeight={36}
          />
          <StepActions channel="telegram" secondary="Back" primary="Next" />
        </VStack>
      ),
    },
    {
      title: 'Verify connection',
      description: 'Click verify to confirm Telegram is receiving messages from this account.',
      content: (
        <StepActions
          channel="telegram"
          secondary="Restart"
          secondaryIcon={<Icon icon={IconRestoreArrow} size={12} />}
          primary="Confirm and Connect"
          primaryIcon={<Icon icon={IconCheck} size={12} />}
        />
      ),
    },
  ],
  slack: [
    {
      title: 'Allow GigRadar in your Slack workspace and channels',
      description:
        'Click the button below to add GigRadar to your Slack workspace and channels for Incoming Webhook.',
      content: (
        <StepActions
          channel="slack"
          secondary="Allow to your workspace and channels"
          secondaryIcon={<Icon icon={IconGoToExternal} size={12} />}
          primary="Next"
        />
      ),
    },
    {
      title: 'Verify connection',
      description: 'A test message will be sent to your Slack channel to confirm delivery.',
      content: (
        <StepActions
          channel="slack"
          secondary="Restart"
          secondaryIcon={<Icon icon={IconRestoreArrow} size={12} />}
          primary="Confirm and Connect"
          primaryIcon={<Icon icon={IconCheck} size={12} />}
        />
      ),
    },
  ],
  browser: [
    {
      title: 'Request browser permission',
      description:
        'Your browser will show a permission prompt. Click Allow to enable push notifications.',
      content: (
        <StepActions
          channel="browser"
          secondary="Request permission"
          secondaryIcon={<Icon icon={IconNotificationBellFill} size={12} />}
          primary="Next"
        />
      ),
    },
    {
      title: 'Verify connection',
      description: 'Browser prompt appeared — did you click Allow?',
      content: (
        <StepActions
          channel="browser"
          secondary="Restart"
          secondaryIcon={<Icon icon={IconRestoreArrow} size={12} />}
          primary="Confirm and Connect"
          primaryIcon={<Icon icon={IconCheck} size={12} />}
        />
      ),
    },
  ],
};

/** What a connected channel is showing — the two option cards and the disconnect row. */
export function ConnectedSettings({
  channel,
  value,
}: {
  channel: NotificationChannel;
  value?: string;
}) {
  const accent = channelPalette[channel].color;
  const accentBackground = channelPalette[channel].background;
  const [about, setAbout] = useState<string[]>(['assigned', 'replies']);
  const [when, setWhen] = useState('all');

  const toggle = (id: string) =>
    setAbout((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <>
      <HStack gap={8} width="100%" alignItems="center">
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <CustomPromptField
            value={value ?? DESTINATION[channel]}
            resizable={false}
            readOnly
            rows={1}
            minHeight={36}
          />
        </div>
        <Button
          size="small"
          variant="secondary"
          tone="danger"
          startIcon={<Icon icon={IconXClose} size={12} />}
        >
          Disconnect
        </Button>
      </HStack>
      <HStack gap={16} width="100%" alignItems="flex-start">
        <NotificationSettingsGroup title="Notify me about">
          <AutoReplyButton
            title="New lead assigned"
            description="Replies are sent automatically"
            markerIcon={IconAssignedPeopleFill}
            accentColor={accent}
            selectedBackground={accentBackground}
            selected={about.includes('assigned')}
            onSelect={() => toggle('assigned')}
          />
          <AutoReplyButton
            title="Lead replies"
            description="Drafts a reply for your approval"
            markerIcon={IconLeadRepliesBubbleFill}
            accentColor={accent}
            selectedBackground={accentBackground}
            selected={about.includes('replies')}
            onSelect={() => toggle('replies')}
          />
          <AutoReplyButton
            title="Missed conversations"
            description="Drafts a reply for your approval"
            markerIcon={IconBubbleCrossFill}
            accentColor={accent}
            selectedBackground={accentBackground}
            selected={about.includes('missed')}
            onSelect={() => toggle('missed')}
          />
        </NotificationSettingsGroup>
        <NotificationSettingsGroup title="When to notify">
          <AutoReplyButton
            title="All Message"
            description="Every notification immediately"
            markerIcon={IconAllMessageBubbleFill}
            accentColor={accent}
            selectedBackground={accentBackground}
            name={`when-${channel}`}
            selected={when === 'all'}
            onSelect={() => setWhen('all')}
          />
          <AutoReplyButton
            title="Unread Only"
            description="Only if message is unread"
            markerIcon={IconUnreadBubbleFill}
            accentColor={accent}
            selectedBackground={accentBackground}
            name={`when-${channel}`}
            selected={when === 'unread'}
            onSelect={() => setWhen('unread')}
          />
          <AutoReplyButton
            title="Mentions Only"
            description="Only when you're mentioned"
            markerIcon={IconMentioned}
            accentColor={accent}
            selectedBackground={accentBackground}
            name={`when-${channel}`}
            selected={when === 'mentions'}
            onSelect={() => setWhen('mentions')}
          />
        </NotificationSettingsGroup>
      </HStack>
    </>
  );
}
