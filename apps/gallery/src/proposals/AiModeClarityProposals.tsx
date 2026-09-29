import { borderWidth, color, component, radius, shadow, spacing, textStyle } from '@gigradar/theme';
import {
  AutoReplyButton,
  AutoReplyModeTab,
  Button,
  CustomPromptField,
  HStack,
  Icon,
  IconButton,
  IconCheck,
  IconDeleteTrashFill,
  IconDropdownArrowDown,
  IconDropdownArrowUp,
  IconIndicatorUpFill,
  IconLockFill,
  IconNosign,
  IconPlus,
  IconTryAgain,
  IconWarningTriangleFill,
  IconXClose,
  TextField,
  Toggle,
  VStack,
  type ReplyMode,
} from '@gigradar/ui';
import { useId, useState, type ComponentType, type ReactNode } from 'react';
import { AUTO_REPLY_OPTIONS } from '../fixtures/aiConfiguration';

/**
 * BF-4113 — Copilot / Autopilot mode clarity, on the Auto Reply card.
 *
 * The CRM usage audit: 111 people opened the AI settings page and 27 teams
 * saved anything. When Laziza answers a client first the client replies 68% of
 * the time, against 50% when a person answers — and the screen says so nowhere.
 * None of 16 teams has set up "all other replies".
 *
 * THE QUESTION THESE THREE DIFFER ON: **can a team change the stop rules —
 * and how far?** The rules are the three things Laziza must never do on its
 * own (talk price, confirm scope, answer a negative message); each one hands
 * the thread to a person instead. A reviewer answers it by looking at the three
 * lists: one that cannot be touched, one whose rules switch off, and one that
 * stays fixed but takes rules of the team's own.
 *
 * SETTLED, AND SHARED BY ALL THREE — drawn identically so the eye goes to the
 * rules:
 *
 * - **One line per mode**, under the mode row, changing with the selected mode:
 *   what happens when it is on, and where the result shows up. Under the row
 *   rather than in each option's description, because the option description
 *   is one truncated line on a desktop and is dropped entirely on a phone.
 * - **The reply-rate line** under the First reply modes, 68% against 50%, with
 *   the AI figure in weight and an up-indicator — the one number that says why
 *   the first reply is worth handing over.
 * - **A template picker** for all other replies. Deliberately minimal and
 *   neutral: its shape is being decided on BF-4111 (the custom prompt's
 *   template picker), and this one follows whichever wins there.
 *
 * Everything is built from shipped parts — `AutoReplyModeTab`,
 * `AutoReplyButton`, `CustomPromptField`, `Toggle`, `TextField`, `Button` —
 * arranged the way `AutoReply` arranges them. The card is composed here rather
 * than drawn through `AutoReply` because the shipped card has no slot between
 * its mode row and its prompt, which is exactly where every new line goes. The
 * winner adds that slot.
 */

// ---------------------------------------------------------------------------
// The one fixture, shared by all three
// ---------------------------------------------------------------------------

type TabId = 'first' | 'other';

/** The three modes the card offers. `ReplyMode` also carries `other`, which only a badge draws. */
type Mode = Exclude<ReplyMode, 'other'>;

/**
 * The message classes, renamed from "First Message" and "Other Message" to the
 * words the ticket and the audit use. "Other message" read as a leftover
 * bucket; "all other replies" says it covers the rest of the thread.
 */
export const TABS: { id: TabId; label: string }[] = [
  { id: 'first', label: 'First reply' },
  { id: 'other', label: 'All other replies' },
];

/**
 * What each mode does once it is on, and where you will see it.
 *
 * One line each, per class, because "sends a reply" means a different moment
 * on the first message than on the tenth.
 */
export const MODE_LINES: Record<TabId, Record<Mode, string>> = {
  first: {
    fullAuto:
      'Laziza answers a new client message by itself. The reply shows in the Inbox thread, marked Laziza.',
    coPilot:
      'Laziza writes the first reply into the composer. Nothing sends until you press Send in the Inbox.',
    off: 'Laziza stays out of it. New client messages wait in the Inbox for your team to answer.',
  },
  other: {
    fullAuto:
      'Laziza keeps the conversation going by itself, within the stop rules below. Replies show in the thread, marked Laziza.',
    coPilot:
      'Laziza drafts each follow-up into the composer. You review it in the Inbox and send it yourself.',
    off: 'Every reply after the first is yours. Laziza drafts nothing and sends nothing.',
  },
};

/** The audit's reply rates. The only numbers on the card. */
export const REPLY_RATE = { ai: 68, human: 50 };

/** Starting points for "all other replies". Picking one fills the field. */
export const TEMPLATES = [
  {
    id: 'call',
    name: 'Answer, then book a call',
    prompt:
      'Answer the client’s question in two or three sentences, then offer a 20-minute call to go through the details. Share {{calendar_link}}.',
  },
  {
    id: 'warm',
    name: 'Keep it warm',
    prompt:
      'Thank the client, answer anything they asked directly, and end with one question about their timeline.',
  },
  {
    id: 'qualify',
    name: 'Qualify before scoping',
    prompt:
      'Before discussing approach, ask about budget range, deadline and who makes the decision. One question per message.',
  },
  { id: 'blank', name: 'Write my own', prompt: '' },
];

/**
 * The three things Laziza never does on its own. Each hands the thread to a
 * person — in the ticket's words, "pass those to a human".
 */
export const STOP_RULES = [
  {
    id: 'price',
    title: 'Talks about price',
    detail: 'Never quotes, discounts or agrees to a rate.',
  },
  {
    id: 'scope',
    title: 'Asks to confirm scope',
    detail: 'Never agrees to deliverables, deadlines or extra work.',
  },
  {
    id: 'negative',
    title: 'Sounds unhappy',
    detail: 'Never answers a complaint, a refusal or a frustrated message.',
  },
];

/** The line over the rules. Where a handed-over thread ends up is half of it. */
const STOP_HEAD = 'Laziza stops and passes the thread to you when a client message…';
const STOP_FOOT = 'A passed thread waits in the Inbox with a note saying which rule stopped it.';

// ---------------------------------------------------------------------------
// Shared, settled pieces
// ---------------------------------------------------------------------------

const { autoReply } = component;

/** The mode line — settled item 1. */
function ModeLine({ tab, mode }: { tab: TabId; mode: Mode }) {
  return (
    <span style={{ ...textStyle.mRegular, color: color.main.description }}>
      {MODE_LINES[tab][mode]}
    </span>
  );
}

/** The reply-rate line — settled item 2. Under the First reply modes only. */
function ReplyRateLine() {
  return (
    <HStack gap="xs" alignItems="flex-start">
      <span style={{ color: color.status.success.main, display: 'inline-flex', paddingTop: 2 }}>
        <Icon icon={IconIndicatorUpFill} size={16} />
      </span>
      <span style={{ ...textStyle.mRegular, color: color.main.description }}>
        Clients reply{' '}
        <strong style={{ ...textStyle.mSemibold, color: color.status.success.text }}>
          {REPLY_RATE.ai}% of the time
        </strong>{' '}
        when Laziza answers first, against {REPLY_RATE.human}% when a person does.
      </span>
    </HStack>
  );
}

/**
 * The template picker — settled item 3, and deliberately plain.
 *
 * A button naming the current template and a list under it. BF-4111 is deciding
 * the custom prompt's picker; whichever shape wins there replaces this one, so
 * none of the three proposals competes on it.
 */
function TemplatePicker({
  value,
  onPick,
}: {
  value: string;
  onPick: (template: (typeof TEMPLATES)[number]) => void;
}) {
  const [open, setOpen] = useState(false);
  const current = TEMPLATES.find((t) => t.id === value) ?? TEMPLATES[0]!;

  return (
    <VStack gap="xs">
      <span style={{ ...textStyle.mMedium, color: color.main.black }}>Reply template</span>
      <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
        <Button
          variant="secondary"
          size="medium"
          aria-expanded={open}
          endIcon={<Icon icon={open ? IconDropdownArrowUp : IconDropdownArrowDown} size="100%" />}
          onClick={() => setOpen((v) => !v)}
        >
          {current.name}
        </Button>
        {open && (
          <div
            role="listbox"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              minWidth: 240,
              padding: spacing.xs,
              borderRadius: radius.s,
              border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
              backgroundColor: color.main.white,
              boxShadow: shadow.popup,
            }}
          >
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                type="button"
                role="option"
                aria-selected={template.id === current.id}
                onClick={() => {
                  onPick(template);
                  setOpen(false);
                }}
                style={{
                  ...textStyle.mRegular,
                  textAlign: 'left',
                  padding: `${spacing.xs}px ${spacing.s}px`,
                  border: 0,
                  borderRadius: radius.xs,
                  cursor: 'pointer',
                  backgroundColor:
                    template.id === current.id ? color.badge.background : 'transparent',
                  color: template.id === current.id ? color.main.black : color.navbar.text2,
                  fontFamily: 'inherit',
                }}
              >
                {template.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </VStack>
  );
}

/** One stop rule's row. The right-hand slot is what the proposals disagree on. */
function RuleRow({
  title,
  detail,
  trailing,
  muted = false,
  last = false,
}: {
  title: ReactNode;
  detail: ReactNode;
  trailing: ReactNode;
  muted?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.s,
        padding: spacing.s,
        borderBottom: last ? 'none' : `${borderWidth.thin}px solid ${color.navbar.hover}`,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          flexShrink: 0,
          color: muted ? color.disable.text : color.status.error.main,
        }}
      >
        <Icon icon={IconNosign} size={16} />
      </span>
      <VStack gap={2} flex="1 1 auto" minWidth={0}>
        <span style={{ ...textStyle.mMedium, color: muted ? color.disable.text : color.navbar.text2 }}>
          {title}
        </span>
        <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>{detail}</span>
      </VStack>
      <div style={{ flexShrink: 0 }}>{trailing}</div>
    </div>
  );
}

/** The list's frame — the same bordered panel the rows sit in for all three. */
function RuleList({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        borderRadius: radius.s,
        border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
        backgroundColor: color.main.white,
        overflow: 'hidden',
      }}
    >
      {children}
    </div>
  );
}

/** The lock the fixed rules carry, in place of a control. */
function AlwaysOn({ phone }: { phone: boolean }) {
  return (
    <HStack gap="xxs" alignItems="center" textColor={color.navbar.text}>
      <Icon icon={IconLockFill} size={14} />
      {!phone && <span style={textStyle.sMedium}>Always on</span>}
    </HStack>
  );
}

/** The block the rules sit in: head line, the proposal's list, foot line. */
function StopRulesBlock({ children }: { children: ReactNode }) {
  return (
    <VStack gap="xs">
      <span style={{ ...textStyle.mMedium, color: color.main.black }}>Stop rules</span>
      <span style={{ ...textStyle.mRegular, color: color.main.description }}>{STOP_HEAD}</span>
      {children}
      <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>{STOP_FOOT}</span>
    </VStack>
  );
}

export type Viewport = { phone?: boolean };

/**
 * The Auto Reply card with the settled lines in place, and a slot where the
 * proposal draws its stop rules.
 *
 * Opens on "All other replies" in Co-pilot — the tab nobody has configured and
 * the one the rules live on, so the reviewer lands on the question.
 */
function ModeCard({
  phone = false,
  rules: Rules,
}: Viewport & {
  /** The proposal's stop rules, drawn on the All other replies tab. */
  rules: ComponentType<{ phone: boolean }>;
}) {
  const group = useId();
  const [tab, setTab] = useState<TabId>('other');
  const [modes, setModes] = useState<Record<TabId, Mode>>({
    first: 'fullAuto',
    other: 'coPilot',
  });
  const [templateId, setTemplateId] = useState(TEMPLATES[0]!.id);
  const [prompt, setPrompt] = useState(TEMPLATES[0]!.prompt);
  const [dirty, setDirty] = useState(false);

  const mode = modes[tab];
  const edge = color.navbar.hover;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        borderRadius: autoReply.radius,
        border: `${borderWidth.thin}px solid ${edge}`,
        backgroundColor: color.main.background,
        overflow: 'hidden',
      }}
    >
      <div role="tablist" style={{ display: 'flex', width: '100%' }}>
        {TABS.map((t) => (
          <AutoReplyModeTab
            key={t.id}
            label={t.label}
            mode={modes[t.id]}
            selected={t.id === tab}
            onClick={() => setTab(t.id)}
          />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: autoReply.gap,
          padding: autoReply.padding,
          backgroundColor: color.main.white,
        }}
      >
        <VStack gap="s">
          {/* A phone stacks the three modes: side by side at 402px each row is
              ~105px and the description has to go, which is the one line that
              said what the mode does. */}
          <div
            style={{
              display: 'flex',
              flexDirection: phone ? 'column' : 'row',
              gap: spacing.s,
              width: '100%',
            }}
          >
            {AUTO_REPLY_OPTIONS.map((option) => (
              <div key={option.id} style={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>
                <AutoReplyButton
                  title={option.label}
                  description={option.description}
                  markerLabel={option.markerLabel}
                  markerIcon={option.markerIcon}
                  accentColor={option.markerColor}
                  selected={option.id === mode}
                  name={`${group}-${tab}`}
                  onSelect={() => {
                    setDirty(true);
                    setModes((state) => ({ ...state, [tab]: option.id as Mode }));
                  }}
                />
              </div>
            ))}
          </div>
          <ModeLine tab={tab} mode={mode} />
          {tab === 'first' && <ReplyRateLine />}
        </VStack>

        {tab === 'other' && mode !== 'off' && (
          <>
            <VStack gap="s">
              <TemplatePicker
                value={templateId}
                onPick={(template) => {
                  setDirty(true);
                  setTemplateId(template.id);
                  setPrompt(template.prompt);
                }}
              />
              <CustomPromptField
                value={prompt}
                onChange={(next) => {
                  setDirty(true);
                  setPrompt(next);
                }}
                placeholder="Tell Laziza how to handle the rest of the conversation."
                minHeight={autoReply.promptHeight}
              />
            </VStack>
            <Rules phone={phone} />
          </>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing.xs,
          padding: autoReply.padding,
          borderTop: `${borderWidth.thin}px solid ${edge}`,
          backgroundColor: color.main.white,
        }}
      >
        <Button
          size="medium"
          disabled={!dirty}
          startIcon={<Icon icon={IconCheck} size="100%" />}
          onClick={() => setDirty(false)}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          size="medium"
          disabled={!dirty}
          startIcon={<Icon icon={IconXClose} size="100%" />}
          onClick={() => setDirty(false)}
        >
          Cancel
        </Button>
        <Button
          variant="secondary"
          tone="danger"
          size="medium"
          startIcon={<Icon icon={IconTryAgain} size="100%" />}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// The three stop-rule shapes
// ---------------------------------------------------------------------------

/** 1 — Fixed. Read-only, each rule carrying a lock instead of a control. */
function FixedRules({ phone }: { phone: boolean }) {
  return (
    <StopRulesBlock>
      <RuleList>
        {STOP_RULES.map((rule, i) => (
          <RuleRow
            key={rule.id}
            title={rule.title}
            detail={rule.detail}
            trailing={<AlwaysOn phone={phone} />}
            last={i === STOP_RULES.length - 1}
          />
        ))}
      </RuleList>
    </StopRulesBlock>
  );
}

/** 2 — Switchable. The same three, each on a toggle, on by default. */
function ToggleRules(_: { phone: boolean }) {
  const [on, setOn] = useState<Record<string, boolean>>(
    Object.fromEntries(STOP_RULES.map((rule) => [rule.id, true])),
  );

  return (
    <StopRulesBlock>
      <RuleList>
        {STOP_RULES.map((rule, i) => {
          const enabled = on[rule.id] ?? true;
          return (
            <RuleRow
              key={rule.id}
              title={rule.title}
              muted={!enabled}
              detail={
                enabled ? (
                  rule.detail
                ) : (
                  // Switching a rule off is the one change on this card that
                  // lets Laziza say something the team cannot take back, so
                  // the row says so in place rather than in a dialog.
                  <HStack gap="xxs" alignItems="center" textColor={color.status.warning.text}>
                    <Icon icon={IconWarningTriangleFill} size={12} />
                    <span>Off — Laziza may now answer this by itself.</span>
                  </HStack>
                )
              }
              trailing={
                <Toggle
                  checked={enabled}
                  onCheckedChange={(next) => setOn((state) => ({ ...state, [rule.id]: next }))}
                  label={rule.title}
                />
              }
              last={i === STOP_RULES.length - 1}
            />
          );
        })}
      </RuleList>
    </StopRulesBlock>
  );
}

/** 3 — Fixed floor, open ceiling. The three locked, plus rules of the team's own. */
function CustomRules({ phone }: { phone: boolean }) {
  const [custom, setCustom] = useState<string[]>([]);
  const [draft, setDraft] = useState('');

  const add = () => {
    const text = draft.trim();
    if (!text) return;
    setCustom((list) => [...list, text]);
    setDraft('');
  };

  return (
    <StopRulesBlock>
      <RuleList>
        {STOP_RULES.map((rule, i) => (
          <RuleRow
            key={rule.id}
            title={rule.title}
            detail={rule.detail}
            trailing={<AlwaysOn phone={phone} />}
            last={custom.length === 0 && i === STOP_RULES.length - 1}
          />
        ))}
        {custom.map((text, i) => (
          <RuleRow
            key={`${text}-${i}`}
            title={text}
            detail="Your team’s rule"
            trailing={
              <IconButton
                icon={IconDeleteTrashFill}
                aria-label={`Remove “${text}”`}
                size="small"
                onClick={() => setCustom((list) => list.filter((_, j) => j !== i))}
              />
            }
            last={i === custom.length - 1}
          />
        ))}
      </RuleList>
      {/* On a phone the field takes the whole row and the button goes under
          it — side by side, the field is left too narrow to show a rule. */}
      <div
        style={{
          display: 'flex',
          flexDirection: phone ? 'column' : 'row',
          alignItems: phone ? 'stretch' : 'flex-end',
          gap: spacing.xs,
        }}
      >
        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
          <TextField
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') add();
            }}
            placeholder="e.g. Asks for our portfolio before a call"
          />
        </div>
        <Button
          variant="secondary"
          size="medium"
          disabled={draft.trim() === ''}
          startIcon={<Icon icon={IconPlus} size="100%" />}
          onClick={add}
        >
          Add rule
        </Button>
      </div>
    </StopRulesBlock>
  );
}

// ---------------------------------------------------------------------------
// The manifest
// ---------------------------------------------------------------------------

export const PROPOSALS: {
  number: number;
  approach: string;
  rationale: string;
  render: (viewport?: Viewport) => ReactNode;
}[] = [
  {
    number: 1,
    approach: 'Fixed: the three rules, read-only',
    rationale:
      'The rules are a floor Laziza stands on, not a setting — every team gets the same three and none can be switched off, so Full Auto can never quote a price. Nothing to store and nothing to configure, on a screen most visitors already leave without saving. The cost: a team that sells fixed-price packages cannot let Laziza state its own listed price, and every disagreement with a rule becomes a support request rather than a setting.',
    render: ({ phone } = {}) => <ModeCard phone={phone} rules={FixedRules} />,
  },
  {
    number: 2,
    approach: 'Switchable: the same three, each on a toggle',
    rationale:
      'The team owns the trade-off: all three start on, and turning one off says in the row what Laziza may now do. The cost: a team can switch off "talks about price" and Full Auto will then commit to a number nobody approved — the failure the rules exist to prevent. Three new stored booleans per team (and per account, once BF-4280’s per-account auto-reply lands), and support has to ask which ones are off before answering any complaint.',
    render: ({ phone } = {}) => <ModeCard phone={phone} rules={ToggleRules} />,
  },
  {
    number: 3,
    approach: 'Fixed floor, plus rules of your own',
    rationale:
      'The three stay locked, and a team adds its own on top — "asks for our portfolio before a call". Nothing can be loosened, only tightened. The cost is the largest to build: a free-text rule is an instruction to the model, not a check, so it holds most of the time rather than always, and the screen cannot say which. It needs storage, a length limit and a cap on how many; at ten rules the list is longer than the rest of the card.',
    render: ({ phone } = {}) => <ModeCard phone={phone} rules={CustomRules} />,
  },
];
