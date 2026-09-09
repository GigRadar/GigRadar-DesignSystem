import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import {
  Avatar,
  Button,
  CustomPromptField,
  HStack,
  Icon,
  IconDropdownArrowDown,
  IconDropdownArrowUp,
  StatusBadge,
  VStack,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { SettingsPanel, SettingsRow } from '../pages/middle/parts';

/**
 * Three proposals for scoping the AI prompt to one connected Upwork account.
 *
 * BF-4280. A team runs three Upwork profiles in unrelated niches — AI/CRM
 * automation, social media marketing, logistics — and the prompt is set once at
 * team level, so any single prompt is wrong for two of the three. The inbox
 * already filters by account, so the system knows which profile a chat belongs
 * to; the prompt has no access to that.
 *
 * All three do the same thing: one prompt field per account, appended after the
 * team prompt. Nothing here invents a second concept — no sections to migrate
 * into, no presets to assign — because the reported team has three accounts in
 * three niches and would carry the cost of either without getting anything back.
 *
 * What is actually being chosen is where that field lives: inline in the list,
 * in a panel beside it, or all of them on one page at once. That is a question
 * about how the screen is used — one account at a time, or all three in a
 * sitting — and it is the only thing these three disagree about.
 */

const { accountPrompt } = component;

/**
 * The accounts, shared across the proposals.
 *
 * Same three profiles, same prompt text, same order in every proposal, so the
 * comparison is between the placements rather than between the contents.
 */
const ACCOUNTS = [
  {
    id: 'ai-crm',
    name: 'Investa Garden — AI & CRM Automation',
    initials: 'IG',
    tone: 'purple' as const,
    /** Empty means the account is running on the team prompt alone. */
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

/** The line under a field, identical in all three. */
const HINT = 'Added after the team prompt, for this account only.';

/** The face, the name, and whether the account has a prompt of its own. */
function Identity({ account }: { account: (typeof ACCOUNTS)[number] }) {
  const custom = account.prompt !== '';
  return (
    <>
      <Avatar size="medium" initials={account.initials} tone={account.tone} />
      <VStack gap={accountPrompt.stackGap} flex={1} minWidth={0}>
        <span style={{ ...textStyle.mMedium, color: color.main.black }}>{account.name}</span>
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>
          {custom ? 'Team prompt + account prompt' : 'Team prompt only'}
        </span>
      </VStack>
      <StatusBadge tone={custom ? 'active' : 'inactive'}>
        {custom ? 'Custom' : 'Inherited'}
      </StatusBadge>
    </>
  );
}

/** The field and its buttons — the same block wherever a proposal puts it. */
function PromptEditor({
  value,
  onChange,
  onCancel,
}: {
  value: string;
  onChange: (next: string) => void;
  onCancel?: () => void;
}) {
  return (
    <VStack gap={accountPrompt.gap}>
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>{HINT}</span>
      <CustomPromptField
        value={value}
        onChange={onChange}
        placeholder={PLACEHOLDER}
        minHeight={accountPrompt.stackedFieldMinHeight}
      />
      <HStack gap="xs" justifyContent="flex-end">
        <Button size="small" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {/* Saving an empty field is how an account goes back to inherited — the
            same gesture as clearing it, rather than a separate Reset to find. */}
        <Button size="small" disabled={value.length === 0}>
          Save
        </Button>
      </HStack>
    </VStack>
  );
}

/**
 * Proposal 1 — the field opens inside the row.
 *
 * Click an account and its prompt unfolds under it, pushing the rest of the
 * list down. The account it belongs to stays directly above the field, and
 * nothing else moves.
 *
 * One account at a time, and the list is the whole screen. Its cost is height:
 * with a long prompt open, the accounts below are pushed off the fold.
 */
export function ProposalInline() {
  // Collapsed by default: the list is what the screen is for, and every row
  // open would bury it.
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');

  return (
    <SettingsPanel>
      {ACCOUNTS.map((account, index) => {
        const open = openId === account.id;
        const last = index === ACCOUNTS.length - 1;
        return (
          <div key={account.id}>
            {/* While the row is open its divider moves to the bottom of the
                field, so the line closes the whole account rather than cutting
                between a row and its own prompt. */}
            <SettingsRow last={open || last} onClick={() => setOpenId(open ? null : account.id)}>
              <Identity account={account} />
              {/* A chevron rather than an Edit button: the row is already the
                  control, and a button beside it implies a second thing to hit.
                  It also says which way the row goes — a labelled button has to
                  swap its word to say the same. */}
              <Icon
                icon={open ? IconDropdownArrowUp : IconDropdownArrowDown}
                size={accountPrompt.chevronSize}
                color={color.main.description}
              />
            </SettingsRow>
            {open && (
              <div
                style={{
                  padding: `0 ${accountPrompt.padding}px ${accountPrompt.padding}px`,
                  borderBottom: last
                    ? undefined
                    : `${borderWidth.thin}px solid ${color.navbar.border}`,
                }}
              >
                <PromptEditor value={draft} onChange={setDraft} onCancel={() => setDraft('')} />
              </div>
            )}
          </div>
        );
      })}
    </SettingsPanel>
  );
}

/**
 * Proposal 2 — the field sits in a panel beside the list.
 *
 * Selecting an account fills the right-hand panel. The list never moves, so
 * the other accounts stay visible and switching between them is one click with
 * nothing reflowing.
 *
 * The cost is width: on a narrow screen the two columns have to stack, at
 * which point this becomes proposal 1 with extra steps.
 */
export function ProposalSidePanel() {
  const [selectedId, setSelectedId] = useState('social');
  const [draft, setDraft] = useState('');
  const selected = ACCOUNTS.find((a) => a.id === selectedId)!;

  return (
    <HStack gap="m" alignItems="flex-start" width="100%">
      <VStack flex={1} minWidth={0}>
        <SettingsPanel>
          {ACCOUNTS.map((account, index) => (
            <SettingsRow
              key={account.id}
              last={index === ACCOUNTS.length - 1}
              onClick={() => setSelectedId(account.id)}
            >
              {/* The selected row is marked by its own tint rather than a rail
                  or a chevron: the panel beside it already says which account is
                  open, so the list only has to agree. */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: accountPrompt.gap,
                  flex: 1,
                  minWidth: 0,
                  opacity: account.id === selectedId ? 1 : 0.6,
                }}
              >
                <Identity account={account} />
              </div>
            </SettingsRow>
          ))}
        </SettingsPanel>
      </VStack>

      <VStack flex={1} minWidth={0}>
        <SettingsPanel>
          <VStack p={accountPrompt.padding} gap={accountPrompt.gap}>
            <span style={{ ...textStyle.mMedium, color: color.main.black }}>{selected.name}</span>
            <PromptEditor value={draft} onChange={setDraft} onCancel={() => setDraft('')} />
          </VStack>
        </SettingsPanel>
      </VStack>
    </HStack>
  );
}

/**
 * Proposal 3 — every field on the page at once.
 *
 * No opening and no selecting: each account carries its own field, and all of
 * them are editable together. One Save at the bottom commits the lot.
 *
 * The only one where the three prompts can be read against each other, which is
 * the actual job when the point is that they must not overlap. It is also the
 * longest page, and it does not stay reasonable past a handful of accounts.
 */
export function ProposalAllAtOnce() {
  const [drafts, setDrafts] = useState<Record<string, string>>({
    'ai-crm': ACCOUNTS[0]!.prompt,
    social: '',
    logistics: '',
  });

  return (
    <VStack gap="m" width="100%">
      <SettingsPanel>
        {ACCOUNTS.map((account, index) => (
          <div key={account.id}>
            {/* No divider under the row: the field belongs to the account above
                it, and a line between them would split one account in two. The
                divider goes under the field instead. */}
            <SettingsRow last>
              <Identity account={account} />
            </SettingsRow>
            {/* The divider goes under the field, not around it: a border on
                every side drew a box around the last account's prompt that read
                as a selection it never had. */}
            <div
              style={{
                padding: `0 ${accountPrompt.padding}px ${accountPrompt.padding}px`,
                borderBottom:
                  index === ACCOUNTS.length - 1
                    ? undefined
                    : `${borderWidth.thin}px solid ${color.navbar.border}`,
              }}
            >
              <CustomPromptField
                value={drafts[account.id] ?? ''}
                onChange={(next) => setDrafts((current) => ({ ...current, [account.id]: next }))}
                placeholder={PLACEHOLDER}
                minHeight={accountPrompt.stackedFieldMinHeight}
              />
            </div>
          </div>
        ))}
      </SettingsPanel>
      <HStack gap="xs" justifyContent="flex-end" width="100%">
        <span
          style={{
            ...textStyle.sRegular,
            color: color.main.description,
            flex: 1,
            minWidth: 0,
          }}
        >
          {HINT}
        </span>
        <Button size="small" variant="secondary">
          Cancel
        </Button>
        <Button size="small">Save all</Button>
      </HStack>
    </VStack>
  );
}

export const PROPOSALS: {
  number: number;
  approach: string;
  rationale: string;
  render: () => ReactNode;
}[] = [
  {
    number: 1,
    approach: 'The field opens inside the row',
    rationale:
      'Click an account and its prompt unfolds under it. The account stays directly above the field and nothing else moves — but an open prompt pushes the accounts below it off the fold.',
    render: () => <ProposalInline />,
  },
  {
    number: 2,
    approach: 'The field sits in a panel beside the list',
    rationale:
      'Selecting an account fills the right-hand panel. The list never reflows, so switching between accounts is one click — at the cost of width, since two columns have to stack on a narrow screen.',
    render: () => <ProposalSidePanel />,
  },
  {
    number: 3,
    approach: 'Every field on the page at once',
    rationale:
      'No opening and no selecting: all three prompts are editable together and one Save commits the lot. The only one where the prompts can be read against each other — which is the job, when the point is that they must not overlap.',
    render: () => <ProposalAllAtOnce />,
  },
];
