import { color, component, textStyle } from '@gigradar/theme';
import {
  AccountIdentity,
  AccountList,
  AccountRow,
  AutoReply,
  Avatar,
  Button,
  CustomPromptField,
  HStack,
  SettingsSection,
  StatusBadge,
  VStack,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { SettingsScreen } from '../../demos/settingsScreen';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption } from '../middle/parts';

const { accountPrompt } = component;

/**
 * The accounts the screen lists.
 *
 * Three profiles in three unrelated niches, which is the shape the ticket
 * reported — and the reason the setting exists at all. One of them carries a
 * prompt of its own and two run on the team prompt, so both states of the row
 * are on screen without having to be described.
 */
const ACCOUNTS = [
  {
    id: 'ai-crm',
    name: 'Investa Garden — AI & CRM Automation',
    initials: 'IG',
    tone: 'purple' as const,
    prompt:
      'We build AI and CRM automation for mid-market teams. Do not offer social media management or logistics work.',
  },
  {
    id: 'social',
    name: 'Investa Garden — Social Media Marketing',
    initials: 'IG',
    tone: 'magenta' as const,
    prompt: '',
  },
  {
    id: 'logistics',
    name: 'Investa Garden — Logistics',
    initials: 'IG',
    tone: 'geekBlue' as const,
    prompt: '',
  },
];

const PLACEHOLDER =
  'e.g. We do social media marketing only. Do not offer CRM automation or logistics.';

/** The identity block, which is the same row on both screens. */
function Identity({ account }: { account: (typeof ACCOUNTS)[number] }) {
  const custom = account.prompt !== '';
  return (
    <AccountIdentity
      avatar={<Avatar size="medium" initials={account.initials} tone={account.tone} />}
      name={account.name}
      status={custom ? 'Team prompt + account prompt' : 'Team prompt only'}
      badge={
        <StatusBadge tone={custom ? 'active' : 'inactive'}>
          {custom ? 'Custom' : 'Inherited'}
        </StatusBadge>
      }
    />
  );
}

/** The account list, with each row opening its own prompt field. */
function AccountPromptList() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>(
    Object.fromEntries(ACCOUNTS.map((account) => [account.id, account.prompt])),
  );

  return (
    <AccountList>
      {ACCOUNTS.map((account, index) => (
        <AccountRow
          key={account.id}
          open={openId === account.id}
          onOpenChange={(open) => setOpenId(open ? account.id : null)}
          last={index === ACCOUNTS.length - 1}
          panel={
            <VStack gap={accountPrompt.gap}>
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>
                Added after the team prompt, for this account only.
              </span>
              <CustomPromptField
                value={drafts[account.id] ?? ''}
                onChange={(next) => setDrafts((state) => ({ ...state, [account.id]: next }))}
                placeholder={PLACEHOLDER}
                minHeight={accountPrompt.stackedFieldMinHeight}
              />
              <HStack gap="xs" justifyContent="flex-end">
                <Button
                  size="small"
                  variant="secondary"
                  onClick={() => setDrafts((state) => ({ ...state, [account.id]: '' }))}
                >
                  Cancel
                </Button>
                {/* Saving an empty field is how an account goes back to
                    inherited — the same gesture as clearing it, rather than a
                    separate Reset to find. */}
                <Button size="small" disabled={(drafts[account.id] ?? '').length === 0}>
                  Save
                </Button>
              </HStack>
            </VStack>
          }
        >
          <Identity account={account} />
        </AccountRow>
      ))}
    </AccountList>
  );
}

/** The same list, with each row opening the auto-reply card instead. */
function AccountAutoReplyList() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <AccountList>
      {ACCOUNTS.map((account, index) => (
        <AccountRow
          key={account.id}
          open={openId === account.id}
          onOpenChange={(open) => setOpenId(open ? account.id : null)}
          last={index === ACCOUNTS.length - 1}
          panel={<AutoReply />}
        >
          <Identity account={account} />
        </AccountRow>
      ))}
    </AccountList>
  );
}

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Per-Account Prompt.
 *
 * BF-4280, decided. One team runs several Upwork profiles in unrelated niches,
 * and both the prompt and the auto-reply mode were set once at team level — so
 * any single value was right for one profile and wrong for the others.
 *
 * Both decisions landed on the same shape: a list of accounts, each row opening
 * its own settings. That agreement is the point. The prompt screen and the
 * auto-reply screen list the same accounts, and picking a list in one place and
 * a badge menu in the other would have left the screen with two ways of
 * choosing an account for no reason a reader could name.
 *
 * Drawn in place rather than on a page of its own: an account prompt sits
 * directly under the team prompt it appends to, and per-account auto-reply
 * beside the team-level card it scopes — which is half of what makes either
 * legible.
 */
export function PerAccountPromptPage() {
  return (
    <>
      <PageHeader
        title="Per-Account AI Prompt"
        description="Scoping the AI prompt and auto-reply to a connected Upwork account rather than the whole team. BF-4280."
      />

      <CrossLink
        eyebrow="The problem it solves"
        links={[
          { label: 'CRM ▸ AI Configuration', pageId: 'crm-settings-ai' },
          { label: 'AI ▸ Custom Prompt', pageId: 'crm-ai-prompt' },
          { label: 'AI ▸ Auto Reply', pageId: 'crm-ai-auto-reply' },
        ]}
      >
        One team, three Upwork profiles, three unrelated niches — AI/CRM automation, social media
        marketing, logistics. Both settings were team-wide, so any single value was right for one
        profile and wrong for the other two. The inbox already filters by account, so the system
        knows which profile a chat belongs to; now the prompt and the auto-reply mode do too.
      </CrossLink>

      <Section
        title="The screen"
        description="Account Prompt sits under the team prompt it appends to, and per-account auto-reply beside the team-level card it scopes. Both are the same list, so an account is reached one way whatever is being set."
      >
        <SettingsScreen
          after={{
            prompt: (
              <SettingsSection
                title="Account Prompt"
                description="Instructions for one connected Upwork account, added after the team prompt above. An account with nothing of its own runs on the team prompt alone."
              >
                <AccountPromptList />
              </SettingsSection>
            ),
            autoReply: (
              <SettingsSection
                title="Auto Reply, per account"
                description="The same card as above, scoped to one account rather than the team. It already carries a mode per message class and “off” among those modes, so “this profile does not auto-reply” is a setting that exists rather than a switch to invent."
              >
                <AccountAutoReplyList />
              </SettingsSection>
            ),
          }}
        />
        <Caption>
          Every row is collapsed until it is opened: the list is what the screen is for, and every
          row open at once would bury it.
        </Caption>
      </Section>

      <Section
        title="The row"
        description="`AccountRow` is the list item and what it opens is a slot — the row's job is which account is being edited, and what “edited” means differs per settings page."
      >
        <Caption>
          The whole row is the control rather than a button inside it. A button beside the name
          implies a second thing to hit, and its label has to change to say what the chevron already
          says by pointing.
        </Caption>
        <CodeBlock
          code={`<AccountList>
  <AccountRow
    open={openId === account.id}
    onOpenChange={(open) => setOpenId(open ? account.id : null)}
    panel={<CustomPromptField value={draft} onChange={setDraft} />}
  >
    <AccountIdentity
      avatar={<Avatar initials="IG" tone="purple" />}
      name="Investa Garden — Logistics"
      status="Team prompt only"
      badge={<StatusBadge tone="inactive">Inherited</StatusBadge>}
    />
  </AccountRow>
</AccountList>`}
        />
      </Section>

      <Section
        title="Why a list"
        description="Tabs do not survive fifty accounts — they cannot wrap, and a scrolling strip hides the one being looked for. A side panel spends width the settings page does not have once the two columns stack on a narrow screen."
      >
        <Caption>
          The list's own cost is height: with a long panel open, the accounts below are pushed off
          the fold. That is the accepted trade, because the screen is used one account at a time.
        </Caption>
      </Section>

      <Section
        title="Still open"
        description="Whether an account prompt should be able to replace the team prompt outright rather than only add to it. What ships appends, so this is the question it does not answer. Splitting teams, and what breaks around billing, API keys and connected-account limits, are product decisions that nothing here commits to."
      />
    </>
  );
}
