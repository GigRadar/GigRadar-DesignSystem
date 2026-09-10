import { borderWidth, color, component, radius, shadow, spacing, textStyle } from '@gigradar/theme';
import {
  Avatar,
  HStack,
  Icon,
  IconDropdownArrowDown,
  IconDropdownArrowUp,
  InboxSearchField,
  ModeBadge,
  Pagination,
  VStack,
  type ReplyMode,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { AutoReplyDemo } from '../demos/aiConfiguration';
import { ListPanel, ListRow } from '../pages/middle/parts';

/**
 * Three proposals for auto-reply, scoped to one connected Upwork account.
 *
 * BF-4280's other half. Today the only way to stop one profile replying is to
 * write "do not auto-reply from account X" into the team prompt — asking a
 * language model to enforce a rule the system could guarantee outright.
 *
 * Nothing here adds a component. `off` is already one of AutoReply's modes, so
 * "this account does not auto-reply" is a setting that exists rather than a
 * switch to invent; 1 and 2 reach the card unchanged, and 3 makes the mode
 * badge itself the control and does without the card entirely.
 *
 * What is being chosen is how an account is reached, and every proposal is
 * drawn against fifty accounts as well as three: what works at three and
 * collapses at fifty is not a design, and the row of tabs that was here before
 * was exactly that.
 */

const { accountPrompt } = component;

type Account = {
  id: string;
  name: string;
  tone: 'purple' | 'magenta' | 'geekBlue';
  /** The mode for the first message in a thread. */
  first: ReplyMode;
  /** The mode for every message after it. */
  other: ReplyMode;
};

/**
 * The accounts, and the two modes each runs in.
 *
 * Logistics is off on both, which is the reported case: the team wants that
 * profile silent and is currently asking the prompt to arrange it.
 */
const ACCOUNTS: Account[] = [
  {
    id: 'ai-crm',
    name: 'Investa Garden — AI & CRM Automation',
    tone: 'purple',
    first: 'fullAuto',
    other: 'coPilot',
  },
  {
    id: 'social',
    name: 'Investa Garden — Social Media Marketing',
    tone: 'magenta',
    first: 'coPilot',
    other: 'coPilot',
  },
  {
    id: 'logistics',
    name: 'Investa Garden — Logistics',
    tone: 'geekBlue',
    first: 'off',
    other: 'off',
  },
];

/**
 * A row's two mode badges — one per message class.
 *
 * Both are always drawn, because "first message on, later messages off" is a
 * real setting and a single badge cannot say it. The one that is off fades
 * rather than disappearing: a row that dropped a badge would change width with
 * its own state, and the pair should read as one control at a glance.
 */
function ModePair({ account }: { account: Account }) {
  return (
    <HStack gap="xxs" alignItems="center">
      <ModeSlot label="1st" mode={account.first} />
      <ModeSlot label="Other" mode={account.other} />
    </HStack>
  );
}

/** One of the pair, faded when that class is not replying. */
function ModeSlot({ label, mode }: { label: string; mode: ReplyMode }) {
  const inactive = mode === 'off';
  return (
    <HStack gap="xxs" alignItems="center">
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>{label}</span>
      <ModeBadge
        mode={mode}
        {...(inactive
          ? { background: color.disable.background, textColor: color.disable.text }
          : null)}
      />
    </HStack>
  );
}

/** The name and face, drawn the same way in all three. */
function Identity({ account }: { account: Account }) {
  return (
    <>
      <Avatar size="medium" initials="IG" tone={account.tone} />
      <span style={{ ...textStyle.mMedium, color: color.main.black, flex: 1, minWidth: 0 }}>
        {account.name}
      </span>
    </>
  );
}

/**
 * The mode badge as a control — the pill with a chevron inside it.
 *
 * Clicking it opens the mode menu for that one message class. The chevron sits
 * inside the pill rather than beside it, so the thing that looks clickable is
 * the thing that is: a chevron outside would read as belonging to the row.
 */
function ModeMenuBadge({
  label,
  mode,
  open,
  onToggle,
  onSelect,
}: {
  label: string;
  mode: ReplyMode;
  open: boolean;
  onToggle: () => void;
  onSelect: (mode: ReplyMode) => void;
}) {
  const inactive = mode === 'off';
  return (
    <HStack gap="xxs" alignItems="center">
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>{label}</span>
      {/* The anchor the menu hangs from. Relative here rather than on the row,
          so the menu lines up with the badge that opened it rather than with
          whichever edge of the row it happens to sit near. */}
      <span style={{ position: 'relative', display: 'inline-flex' }}>
        <span
          style={{ display: 'inline-flex', cursor: 'pointer' }}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
        >
          <ModeBadge
            mode={mode}
            {...(inactive
              ? { background: color.disable.background, textColor: color.disable.text }
              : null)}
          >
            <HStack gap="xxs" alignItems="center">
              {MODE_LABELS[mode]}
              <Icon
                icon={open ? IconDropdownArrowUp : IconDropdownArrowDown}
                size={accountPrompt.badgeChevronSize}
                color={inactive ? color.disable.text : color.main.white}
              />
            </HStack>
          </ModeBadge>
        </span>
        {open && (
          // Floating, so opening a menu does not push the rows below it down.
          // Right-aligned: the badges sit at the end of the row, and a menu
          // wider than its badge has only the one direction to grow in.
          <span
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: accountPrompt.menuOffset,
              zIndex: accountPrompt.menuLayer,
            }}
          >
            <ModeMenu value={mode} onSelect={onSelect} />
          </span>
        )}
      </span>
    </HStack>
  );
}

/** The mode names, since passing children overrides the badge's own label. */
const MODE_LABELS: Record<ReplyMode, string> = {
  fullAuto: 'Full Auto',
  coPilot: 'Co-pilot',
  off: 'OFF',
  other: 'Other',
};

/** The menu the badge opens — the three modes, for one message class. */
function ModeMenu({ value, onSelect }: { value: ReplyMode; onSelect: (mode: ReplyMode) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xxs,
        padding: spacing.xs,
        borderRadius: radius.s,
        backgroundColor: color.main.white,
        border: `${borderWidth.thin}px solid ${color.navbar.border}`,
        // Elevated rather than only outlined: it floats over the rows below it,
        // and a flat panel would read as part of the list it is covering.
        boxShadow: shadow.base,
        whiteSpace: 'nowrap',
      }}
    >
      {(['fullAuto', 'coPilot', 'off'] as const).map((mode) => (
        <span
          key={mode}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: accountPrompt.gap,
            padding: `${accountPrompt.menuItemPaddingY}px ${accountPrompt.menuItemPaddingX}px`,
            borderRadius: accountPrompt.radius,
            cursor: 'pointer',
            backgroundColor: mode === value ? color.badge.background : undefined,
          }}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(mode);
          }}
        >
          <ModeBadge
            mode={mode}
            {...(mode === 'off'
              ? { background: color.disable.background, textColor: color.disable.text }
              : null)}
          />
          <span style={{ ...textStyle.sRegular, color: color.main.description }}>
            {MODE_DESCRIPTIONS[mode]}
          </span>
        </span>
      ))}
    </div>
  );
}

const MODE_DESCRIPTIONS: Record<ReplyMode, string> = {
  fullAuto: 'Replies are sent automatically',
  coPilot: 'Drafts a reply for your approval',
  off: 'Disable automatic replies',
  other: '',
};

/**
 * Proposal 1 — the row expands into its settings.
 *
 * Every account is one row carrying both of its modes: first message and later
 * messages, each as a badge, faded where that class is off. The chevron opens
 * the account's Auto Reply card underneath it.
 *
 * The list is the screen, and it stays the screen at any number of accounts —
 * fifty rows is a long list, but a list is what fifty of something should look
 * like. The same shape as the prompt proposal, so an account is reached one way
 * whatever is being set.
 */
export function ProposalExpandingRow() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <ListPanel>
      {ACCOUNTS.map((account, index) => {
        const open = openId === account.id;
        const last = index === ACCOUNTS.length - 1;
        return (
          <div key={account.id}>
            {/* Open, the row's divider moves below the card, so the line closes
                the whole account rather than cutting it from its own settings. */}
            <ListRow
              last={open || last}
              gap={accountPrompt.gap}
              padding={accountPrompt.padding}
              onClick={() => setOpenId(open ? null : account.id)}
            >
              <Identity account={account} />
              <ModePair account={account} />
              <Icon
                icon={open ? IconDropdownArrowUp : IconDropdownArrowDown}
                size={accountPrompt.chevronSize}
                color={color.main.description}
              />
            </ListRow>
            {open && (
              <div
                style={{
                  padding: `0 ${accountPrompt.padding}px ${accountPrompt.padding}px`,
                  borderBottom: last
                    ? undefined
                    : `${borderWidth.thin}px solid ${color.navbar.border}`,
                }}
              >
                {/* Keyed by account so opening another remounts the card with
                    that account's modes rather than carrying the last across. */}
                <AutoReplyDemo key={account.id} />
              </div>
            )}
          </div>
        );
      })}
    </ListPanel>
  );
}

/**
 * Proposal 2 — search the accounts, configure the one you found.
 *
 * A search field over the list, and the card below belongs to whichever account
 * is selected. At three accounts the search does nothing; at fifty it is the
 * only way anyone finds the profile they meant.
 *
 * The row of tabs this replaces could not survive fifty accounts — tabs do not
 * wrap, and a scrolling tab strip hides exactly the account you are looking for.
 */
export function ProposalSearch() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState('logistics');
  const selected = ACCOUNTS.find((a) => a.id === selectedId)!;
  const shown = ACCOUNTS.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <VStack gap="m" width="100%">
      <InboxSearchField
        value={query}
        onValueChange={setQuery}
        placeholder="Search accounts"
      />
      <ListPanel>
        {shown.map((account, index) => (
          <ListRow
            key={account.id}
            last={index === shown.length - 1}
            gap={accountPrompt.gap}
            padding={accountPrompt.padding}
            selected={account.id === selectedId}
            onClick={() => setSelectedId(account.id)}
          >
            <Identity account={account} />
            <ModePair account={account} />
          </ListRow>
        ))}
      </ListPanel>
      <SettingsSectionHeading name={selected.name} />
      <AutoReplyDemo key={selectedId} />
    </VStack>
  );
}

/** Which account the card below belongs to. */
function SettingsSectionHeading({ name }: { name: ReactNode }) {
  return (
    <VStack gap={accountPrompt.stackGap}>
      <span style={{ ...textStyle.mMedium, color: color.main.black }}>Auto Reply</span>
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>
        Reply to every message in a thread, or only the first one. Applies to {name} alone.
      </span>
    </VStack>
  );
}

/**
 * Proposal 3 — the badge is the control.
 *
 * No card and no expanding. Each badge carries a chevron, and clicking it opens
 * a menu of the three modes for that one message class. Setting an account to
 * co-pilot on first messages is two clicks from the list, with nothing opening
 * underneath and nothing else moving.
 *
 * The most direct of the three, and the only one where the whole list stays
 * visible while a mode is being changed — which is what makes fifty accounts
 * workable, since the list never grows and paging keeps it one screen tall.
 *
 * Its cost is that the card's other setting has nowhere to go: `Additional
 * prompt` belongs to a message class too, and a floating menu of three modes
 * has no room for it. That would need its own way in.
 */
export function ProposalBadgeMenu() {
  const [modes, setModes] = useState<Record<string, { first: ReplyMode; other: ReplyMode }>>(
    Object.fromEntries(ACCOUNTS.map((a) => [a.id, { first: a.first, other: a.other }])),
  );
  /** Which badge is open, as `accountId:class` — only ever one. */
  const [openKey, setOpenKey] = useState<string | null>('social:first');
  const [page, setPage] = useState(1);

  const set = (id: string, cls: 'first' | 'other', mode: ReplyMode) => {
    setModes((current) => ({ ...current, [id]: { ...current[id]!, [cls]: mode } }));
    setOpenKey(null);
  };

  return (
    <VStack gap="m" width="100%">
      <ListPanel overflowing>
        {ACCOUNTS.map((account, index) => {
          const mode = modes[account.id]!;
          const openClass = openKey?.startsWith(`${account.id}:`)
            ? (openKey.split(':')[1] as 'first' | 'other')
            : null;
          return (
            <ListRow
              key={account.id}
              last={index === ACCOUNTS.length - 1}
              gap={accountPrompt.gap}
              padding={accountPrompt.padding}
            >
              <Identity account={account} />
              <ModeMenuBadge
                label="1st"
                mode={mode.first}
                open={openClass === 'first'}
                onToggle={() => setOpenKey(openClass === 'first' ? null : `${account.id}:first`)}
                onSelect={(next) => set(account.id, 'first', next)}
              />
              <ModeMenuBadge
                label="Other"
                mode={mode.other}
                open={openClass === 'other'}
                onToggle={() => setOpenKey(openClass === 'other' ? null : `${account.id}:other`)}
                onSelect={(next) => set(account.id, 'other', next)}
              />
            </ListRow>
          );
        })}
      </ListPanel>
      {/* Drawn at three accounts, so the bar shows one page. It is here for the
          fifty-account case: the list stays one screen tall however many there
          are, which is the whole argument for this shape. */}
      <HStack justifyContent="flex-end" width="100%">
        <Pagination page={page} pageCount={1} onPageChange={setPage} size="small" bare />
      </HStack>
    </VStack>
  );
}

export const AUTO_REPLY_PROPOSALS: {
  number: number;
  approach: string;
  rationale: string;
  render: () => ReactNode;
}[] = [
  {
    number: 1,
    approach: 'The row expands into its settings',
    rationale:
      'Each account is one row carrying both of its modes — first message and later messages, faded where that class is off — and the chevron opens its card underneath. A list is what fifty accounts should look like, and it is the same shape as the prompt proposal, so an account is reached one way whatever is being set.',
    render: () => <ProposalExpandingRow />,
  },
  {
    number: 2,
    approach: 'Search, then configure',
    rationale:
      'A search field over the list, with the card below belonging to the selected account. At three accounts the search does nothing; at fifty it is the only way anyone finds the profile they meant. Replaces the tab row, which could not survive fifty — tabs do not wrap, and a scrolling strip hides the account being looked for.',
    render: () => <ProposalSearch />,
  },
  {
    number: 3,
    approach: 'The badge is the control',
    rationale:
      'No card and no expanding: each badge carries a chevron and opens a menu of the three modes for that message class. Two clicks from the list, with nothing opening underneath and the whole list still visible — which is what makes fifty workable. Its cost is that the card’s Additional prompt has nowhere to go, and would need its own way in.',
    render: () => <ProposalBadgeMenu />,
  },
];
