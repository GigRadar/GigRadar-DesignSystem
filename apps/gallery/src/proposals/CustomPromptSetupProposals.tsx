import {
  borderWidth,
  color,
  radius,
  shadow,
  spacing,
  textStyle,
  typography,
} from '@gigradar/theme';
import {
  AiPromptConfig,
  Button,
  CustomPromptField,
  HStack,
  Icon,
  IconCheck,
  IconDropdownArrowDown,
  IconDropdownArrowUp,
  IconInfoStroke,
  IconLeftArrow,
  IconPresetDocumentStroke,
  IconWarningCircleStroke,
  IconXClose,
  StatusBadge,
  Tooltip,
  VStack,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { VARIABLES } from '../fixtures/prompt';

/**
 * Three proposals for setting up the custom prompt — BF-4111.
 *
 * From the CRM usage audit: two teams switched on a "custom" prompt that was
 * still GigRadar's default text, and believe their agent is configured. The
 * field arrives pre-filled with that default, so Save is one click away from a
 * prompt nobody wrote. And a team that clears it gets a blank box with no idea
 * what belongs in it.
 *
 * **The one question these three disagree on: where the templates live
 * relative to the field.** Instead of the empty card (proposal 1), beside it
 * (proposal 2), or behind a button on the card itself (proposal 3). That is a
 * question about the moment of setup — whether a team is steered into a
 * template or offered one — and a reviewer can answer it by looking.
 *
 * Everything else is settled and identical in all three, drawn by the shared
 * parts below rather than by each proposal:
 *
 * - **The field starts empty**, with a placeholder that shows what a prompt
 *   looks like rather than saying "enter prompt".
 * - **Save is off** while the field is empty, while it still reads as the
 *   default, and while a template still has `[blanks]` in it — the last being
 *   the same failure as the first, one step later. The footer says which.
 * - **The guidance tooltip** sits on an info mark beside "Your prompt" and
 *   lists the five things a prompt needs: rate, start date, agency or solo,
 *   calendar link, and what the agent must never say.
 * - **The first-visit popup** points at the default badge, says "Change
 *   this", and goes for good the first time it closes — Got it, a click
 *   elsewhere, a keystroke in the field, or a template applied.
 *
 * All three share one fixture: the same five templates, the same default, the
 * same copy. The templates are placeholders for Appendix A of the usage report
 * (built from real chats that got replies), which this PR does not have.
 */

/* ------------------------------------------------------------------ */
/* The fixture — shared by all three.                                  */
/* ------------------------------------------------------------------ */

/** What Laziza runs on until a team saves a prompt of its own. */
export const DEFAULT_PROMPT = `You are Laziza, an Upwork CRM assistant for {{agency_name}}.
Reply to every client politely and professionally.
Answer their questions using the job post and the proposal that was sent.
Keep replies short, and suggest a call when the client seems interested.`;

/**
 * The empty field's placeholder: an example, not an instruction.
 *
 * A placeholder that says "Enter your prompt" is the blank box with a caption.
 * One that reads like a real brief shows the length and the register at a
 * glance, and disappears the moment the team starts typing.
 */
export const PLACEHOLDER = `Brief Laziza the way you would brief a new teammate. For example:

We're a 4-person Webflow agency. Our rate is $45/h and we can start next Monday.
Book calls at calendly.com/northwind/intro.
Never promise a deadline before we've had a call.`;

/** The tooltip's five points, in the order a client tends to ask. */
export const GUIDANCE = [
  { label: 'Your rate', example: '“$45/h”, or “fixed price from $1,500”' },
  { label: 'When you can start', example: '“next Monday”, “within 48 hours”' },
  { label: 'Agency or solo', example: 'clients ask, and it changes “I” to “we”' },
  { label: 'Your calendar link', example: 'so Laziza books the call instead of asking for times' },
  {
    label: 'What it must never say',
    example: '“never quote a deadline”, “never offer a discount”',
  },
];

export type PromptTemplate = {
  id: string;
  name: string;
  /** Who it is for, in one line. */
  forWho: string;
  body: string;
};

/**
 * Five ready templates.
 *
 * PLACEHOLDERS for Appendix A of the CRM usage report, which is built from
 * real chats that got replies and is not available to this PR. Each covers the
 * five guidance points, and each leaves `[blanks]` where only the team knows
 * the answer — which is what keeps Save off until they are filled.
 */
export const TEMPLATES: PromptTemplate[] = [
  {
    id: 'solo-dev',
    name: 'Solo developer',
    forWho: 'One person, first person, technical clients.',
    body: `You reply on behalf of {{userName}}, a solo full-stack developer.
- I work alone. Always say "I", never "we" or "our team".
- My rate is [your hourly rate]. Fixed price is fine once the scope is agreed on a call.
- I can start [start date] and take [hours per week] hours a week.
- When the client is interested, offer a 20-minute call: [calendar link].
- Never promise a deadline or a total price before the call.
- Keep replies under 80 words. No emojis.`,
  },
  {
    id: 'agency',
    name: 'Agency',
    forWho: 'A team selling as “we”, with a lead on every project.',
    body: `You reply on behalf of {{agency_name}}, a [team size]-person agency.
- Speak as "we". The project lead the client will work with is [lead's name].
- Our rates start at [rate]. Quote ranges, never a single number.
- We can start [start date].
- Book discovery calls through [calendar link].
- Never share an individual team member's rate. Never agree to unpaid test tasks.
- Mention one relevant case study when it fits, never more than one.`,
  },
  {
    id: 'designer',
    name: 'Designer',
    forWho: 'Brand, UI or product design, where the portfolio sells.',
    body: `You reply on behalf of {{userName}}, a [UI / brand / product] designer.
- Point to the portfolio early: [portfolio link].
- My rate is [rate]. Projects start from [minimum project size].
- I can start [start date].
- For anything bigger than a single screen, suggest a call: [calendar link].
- Never send free mockups or spec work. Never promise unlimited revisions.
- Ask one question about the client's audience before talking about style.`,
  },
  {
    id: 'writer',
    name: 'Writer or marketer',
    forWho: 'Content, copy, SEO and campaign work.',
    body: `You reply on behalf of {{userName}}, a [content writer / marketer] working solo.
- My rate is [rate per word or per hour].
- I can start [start date] and turn around a first draft in [turnaround].
- Share one writing sample that matches the client's industry: [samples link].
- Offer a short call to agree on tone and audience: [calendar link].
- Never guarantee rankings, traffic or conversion numbers.
- Keep replies warm and plain. No marketing jargon.`,
  },
  {
    id: 'short',
    name: 'Short & direct',
    forWho: 'Three-line replies for teams that hate long messages.',
    body: `You reply on behalf of {{agency_name}}. Keep every reply to three sentences or fewer.
- Rate: [rate]. Start: [start date]. We are [solo / an agency of N].
- If the client is interested, send [calendar link] and stop.
- Never negotiate price in chat, and never promise a deadline.`,
  },
];

/* ------------------------------------------------------------------ */
/* The settled rules — identical in all three.                         */
/* ------------------------------------------------------------------ */

const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

/** The `[blanks]` still left in a prompt, each once, in order. */
export function blanksIn(text: string): string[] {
  return Array.from(new Set(text.match(/\[[^\]\n]+\]/g) ?? []));
}

export type SaveRule = { canSave: boolean; reason: string };

/**
 * Whether Save is live, and the one line that says why not.
 *
 * Save is on only once the text is the team's own: not empty, not the
 * default (whitespace aside — a re-indented default is still the default),
 * not a template with its blanks unfilled, and not what is already saved.
 */
export function saveRule(text: string, saved: string | null): SaveRule {
  if (text.trim() === '') {
    return {
      canSave: false,
      reason: 'Empty. Laziza keeps using GigRadar’s default until you save a prompt of your own.',
    };
  }
  if (squash(text) === squash(DEFAULT_PROMPT)) {
    return {
      canSave: false,
      reason: 'This is still GigRadar’s default. Change it to make it yours.',
    };
  }
  const blanks = blanksIn(text);
  if (blanks.length > 0) {
    return {
      canSave: false,
      reason: `Fill in ${blanks.length} blank${blanks.length === 1 ? '' : 's'}: ${blanks.join(
        ', ',
      )}`,
    };
  }
  if (saved !== null && squash(text) === squash(saved)) {
    return { canSave: false, reason: 'Saved. Edit the prompt to save a new version.' };
  }
  return { canSave: true, reason: 'Ready to save. Laziza uses this from the next reply.' };
}

/* ------------------------------------------------------------------ */
/* Shared state and parts.                                             */
/* ------------------------------------------------------------------ */

/**
 * Where a frame starts — so the gallery can draw every state as a still.
 *
 * `hoverId` forces a template's hover look, since a screenshot has no pointer.
 */
export type SetupInitial = {
  text?: string;
  saved?: string | null;
  popup?: boolean;
  tipOpen?: boolean;
  hoverId?: string | null;
  selectedId?: string | null;
  appliedId?: string | null;
  /** Proposal 1: the card is showing the field rather than the picker. */
  writing?: boolean;
  /** Proposal 3: the template menu is open. */
  menuOpen?: boolean;
};

export type SetupRenderOptions = { phone?: boolean; initial?: SetupInitial };

/** The prompt, what is saved, and the one-time popup — the same in all three. */
function useSetup(initial: SetupInitial = {}) {
  const [text, setText] = useState(initial.text ?? '');
  const [saved, setSaved] = useState<string | null>(initial.saved ?? null);
  const [popup, setPopup] = useState(initial.popup ?? true);
  const [appliedId, setAppliedId] = useState<string | null>(initial.appliedId ?? null);

  return {
    text,
    saved,
    popup,
    appliedId,
    /** Any edit also retires the popup: the team has found the field. */
    edit: (next: string) => {
      setText(next);
      setPopup(false);
    },
    apply: (template: PromptTemplate) => {
      setText(template.body);
      setAppliedId(template.id);
      setPopup(false);
    },
    dismiss: () => setPopup(false),
    save: () => setSaved(text),
    cancel: () => setText(saved ?? ''),
  };
}

type Setup = ReturnType<typeof useSetup>;

const templateById = (id: string | null | undefined) => TEMPLATES.find((t) => t.id === id);

/** The five points, as the tooltip's body. */
function GuidanceList() {
  return (
    <VStack gap="xs">
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>
        A prompt that answers these gets replies. One line each is enough.
      </span>
      <ol
        style={{
          margin: 0,
          paddingLeft: spacing.m,
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.xxs,
        }}
      >
        {GUIDANCE.map((point) => (
          <li key={point.label} style={{ ...textStyle.sRegular, color: color.main.description }}>
            <span style={{ ...textStyle.sSemibold, color: color.navbar.text2 }}>{point.label}</span>
            {' — '}
            {point.example}
          </li>
        ))}
      </ol>
    </VStack>
  );
}

/** The info mark beside "Your prompt". Hover on a desktop, tap on a phone. */
function GuidanceTip({ phone, defaultOpen }: { phone?: boolean; defaultOpen?: boolean }) {
  return (
    <Tooltip
      title="What to write"
      content={<GuidanceList />}
      placement="bottom"
      align="start"
      trigger={phone ? 'click' : 'hover'}
      defaultOpen={defaultOpen}
      maxWidth={phone ? 300 : 360}
    >
      <button
        type="button"
        aria-label="What to write in your prompt"
        style={{
          display: 'inline-flex',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: color.navbar.text,
          cursor: 'pointer',
        }}
      >
        <Icon icon={IconInfoStroke} size={16} />
      </button>
    </Tooltip>
  );
}

/**
 * The row above the card: the label, the guidance tip, where the prompt
 * stands, and — in proposal 3 — the template button.
 *
 * The status badge is what the first-visit popup points at. It is the one
 * thing on screen that says the agent is running on text nobody wrote.
 */
function PromptHead({
  setup,
  phone,
  tipOpen,
  extra,
}: {
  setup: Setup;
  phone?: boolean;
  tipOpen?: boolean;
  extra?: ReactNode;
}) {
  const applied = templateById(setup.appliedId);
  const status =
    setup.saved !== null ? (
      <StatusBadge tone="active">Custom prompt</StatusBadge>
    ) : setup.text.trim() !== '' && squash(setup.text) !== squash(DEFAULT_PROMPT) ? (
      <StatusBadge tone="pending">Not saved yet</StatusBadge>
    ) : (
      <StatusBadge tone="inactive">Using GigRadar default</StatusBadge>
    );

  return (
    <HStack gap="s" alignItems="center" flexWrap="wrap">
      <HStack gap="xs" alignItems="center" flex={1} minWidth={0}>
        <span style={{ ...textStyle.mMedium, color: color.main.black }}>Your prompt</span>
        <GuidanceTip phone={phone} defaultOpen={tipOpen} />
        {applied && !phone && (
          <span style={{ ...textStyle.sRegular, color: color.main.description }}>
            · from “{applied.name}”
          </span>
        )}
      </HStack>
      {extra}
      <Tooltip
        open={setup.popup}
        onOpenChange={(open) => {
          if (!open) setup.dismiss();
        }}
        title="Change this"
        content="Laziza is replying with GigRadar’s default prompt, which knows nothing about your rate, your availability or your calendar. Write your own, or start from a template."
        actions={
          <Button size="small" onClick={setup.dismiss}>
            Got it
          </Button>
        }
        placement="bottom"
        align="end"
        maxWidth={phone ? 260 : 300}
      >
        <span style={{ display: 'inline-flex' }}>{status}</span>
      </Tooltip>
    </HStack>
  );
}

/** The footer every proposal shares: why Save is off, Cancel, and Save. */
function SetupFooter({ setup }: { setup: Setup }) {
  const rule = saveRule(setup.text, setup.saved);
  const dirty = squash(setup.text) !== squash(setup.saved ?? '');
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xs,
        flexWrap: 'wrap',
        padding: spacing.m,
        borderTop: `${borderWidth.thin}px solid ${color.navbar.hover}`,
      }}
    >
      <HStack gap="xxs" alignItems="center" flex="1 1 220px" minWidth={0}>
        <span
          style={{
            display: 'inline-flex',
            color: rule.canSave ? color.status.success.main : color.navbar.text,
          }}
        >
          <Icon icon={rule.canSave ? IconCheck : IconWarningCircleStroke} size={14} />
        </span>
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>{rule.reason}</span>
      </HStack>
      <HStack gap="xs" alignItems="center">
        <Button
          variant="secondary"
          size="medium"
          disabled={!dirty}
          startIcon={<Icon icon={IconXClose} size={16} />}
          onClick={setup.cancel}
        >
          Cancel
        </Button>
        <Button
          size="medium"
          disabled={!rule.canSave}
          startIcon={<Icon icon={IconCheck} size={16} />}
          onClick={setup.save}
        >
          Save
        </Button>
      </HStack>
    </div>
  );
}

/**
 * The card: the shipped `AiPromptConfig`, with the field given its
 * placeholder and the footer given the setup rule.
 *
 * Variables stay. The version pill goes: a team setting up its first prompt
 * has no versions, and the pill would list only the default it is replacing.
 */
function PromptCard({ setup, phone }: { setup: Setup; phone?: boolean }) {
  return (
    <AiPromptConfig
      value={setup.text}
      onChange={setup.edit}
      variables={VARIABLES}
      defaultVariablesOpen={!phone}
      variablesHint={phone ? null : 'Click to insert at your cursor, or hover for details.'}
      renderField={({ value, onChange, ref }) => (
        <CustomPromptField
          ref={ref}
          value={value}
          onChange={onChange}
          placeholder={PLACEHOLDER}
          minHeight={phone ? 220 : 180}
          radius={0}
          borderWidth={0}
        />
      )}
      renderFooter={() => <SetupFooter setup={setup} />}
    />
  );
}

/** A read-only look at a template before it touches the field. */
function TemplatePreview({ template, phone }: { template: PromptTemplate; phone?: boolean }) {
  const blanks = blanksIn(template.body);
  return (
    <VStack gap="xs">
      <CustomPromptField value={template.body} readOnly minHeight={phone ? 240 : 170} />
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>
        You fill in {blanks.length}: {blanks.join(', ')}
      </span>
    </VStack>
  );
}

const cardStyle = (hover: boolean, selected: boolean) => ({
  display: 'flex',
  flexDirection: 'column' as const,
  gap: spacing.xxs,
  boxSizing: 'border-box' as const,
  width: '100%',
  padding: spacing.s,
  textAlign: 'left' as const,
  borderRadius: radius.s,
  border: `${borderWidth.thin}px solid ${
    selected || hover ? color.main.brand : color.navbar.hover
  }`,
  backgroundColor: selected
    ? color.badge.background
    : hover
    ? color.main.background
    : color.main.white,
  cursor: 'pointer',
  fontFamily: typography.fontFamily.base,
});

/* ------------------------------------------------------------------ */
/* Proposal 1 — the templates are the empty card.                      */
/* ------------------------------------------------------------------ */

/**
 * With nothing written, the card shows the five templates and a "Write my
 * own" tile in place of the field. Pick one to preview it where the field will
 * be; use it and the field comes back, filled and editable. "Change template"
 * above the field returns to the cards.
 *
 * Buys: nobody meets a blank box. Costs: the field itself is hidden on
 * arrival, so a team that knows what to write takes one extra click.
 */
export function ProposalTemplatesFirst({ phone, initial = {} }: SetupRenderOptions) {
  const setup = useSetup(initial);
  const [writing, setWriting] = useState(initial.writing ?? setup.text !== '');
  const [hoverId, setHoverId] = useState<string | null>(initial.hoverId ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(initial.selectedId ?? null);
  const selected = templateById(selectedId);

  let body: ReactNode;
  if (writing) {
    body = (
      <VStack gap="xs">
        <HStack gap="xs" alignItems="center">
          <button
            type="button"
            onClick={() => {
              setWriting(false);
              setSelectedId(null);
            }}
            style={linkStyle}
          >
            <Icon icon={IconLeftArrow} size={14} />{' '}
            {setup.appliedId ? 'Change template' : 'Start from a template'}
          </button>
        </HStack>
        <PromptCard setup={setup} phone={phone} />
      </VStack>
    );
  } else if (selected) {
    body = (
      <VStack
        gap="s"
        p="m"
        radius="m"
        borderWidth={1}
        borderColor={color.navbar.hover}
        background={color.main.white}
      >
        <HStack gap="xs" alignItems="center" flexWrap="wrap">
          <button type="button" onClick={() => setSelectedId(null)} style={linkStyle}>
            <Icon icon={IconLeftArrow} size={14} /> All templates
          </button>
          <span style={{ flex: 1 }} />
          <span style={{ ...textStyle.mSemibold, color: color.navbar.text2 }}>{selected.name}</span>
        </HStack>
        <TemplatePreview template={selected} phone={phone} />
        <HStack gap="xs" justifyContent="flex-end">
          <Button variant="secondary" size="medium" onClick={() => setSelectedId(null)}>
            Back
          </Button>
          <Button
            size="medium"
            onClick={() => {
              setup.apply(selected);
              setWriting(true);
            }}
          >
            Use this template
          </Button>
        </HStack>
      </VStack>
    );
  } else {
    body = (
      <VStack
        gap="s"
        p="m"
        radius="m"
        borderWidth={1}
        borderColor={color.navbar.hover}
        background={color.main.white}
      >
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>
          Start from a prompt that gets replies, then make it yours. You can edit every word.
        </span>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: phone ? '1fr' : 'repeat(3, minmax(0, 1fr))',
            gap: spacing.xs,
          }}
        >
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              onMouseEnter={() => setHoverId(template.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => {
                setSelectedId(template.id);
                setup.dismiss();
              }}
              style={cardStyle(hoverId === template.id, false)}
            >
              <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
                {template.name}
              </span>
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>
                {template.forWho}
              </span>
              {hoverId === template.id && (
                <span style={{ ...textStyle.sMedium, color: color.main.brand }}>Preview →</span>
              )}
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setWriting(true);
              setup.dismiss();
            }}
            style={{ ...cardStyle(false, false), borderStyle: 'dashed', justifyContent: 'center' }}
          >
            <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>Write my own</span>
            <span style={{ ...textStyle.sRegular, color: color.main.description }}>
              An empty field, with the guide beside it.
            </span>
          </button>
        </div>
      </VStack>
    );
  }

  return (
    <VStack gap="s" width="100%">
      <PromptHead setup={setup} phone={phone} tipOpen={initial.tipOpen} />
      {body}
    </VStack>
  );
}

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: spacing.xxs,
  padding: 0,
  border: 'none',
  background: 'transparent',
  color: color.main.brand,
  cursor: 'pointer',
  fontFamily: typography.fontFamily.base,
  ...textStyle.sMedium,
};

/* ------------------------------------------------------------------ */
/* Proposal 2 — the templates sit beside the field.                    */
/* ------------------------------------------------------------------ */

/**
 * A list of the five down the left of the card, the field on the right.
 * Picking one previews it in the field's place, with Use and Cancel above;
 * using it fills the field, and the list marks it applied. On a phone the list
 * becomes a row of chips over the field.
 *
 * Buys: the field and the templates are both on screen, so writing from
 * scratch and starting from a template are equal choices. Costs: width, and
 * the list stays on the screen long after setup is done.
 */
export function ProposalTemplatesBeside({ phone, initial = {} }: SetupRenderOptions) {
  const setup = useSetup(initial);
  const [hoverId, setHoverId] = useState<string | null>(initial.hoverId ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(initial.selectedId ?? null);
  const selected = templateById(selectedId);

  const list = phone ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
      {TEMPLATES.map((template) => {
        const active =
          template.id === selectedId || (!selectedId && template.id === setup.appliedId);
        return (
          <button
            key={template.id}
            type="button"
            onClick={() => {
              setSelectedId(template.id);
              setup.dismiss();
            }}
            style={{
              flex: '0 0 auto',
              padding: `${spacing.xxs}px ${spacing.s}px`,
              borderRadius: radius.round,
              border: `${borderWidth.thin}px solid ${
                active ? color.main.brand : color.navbar.hover
              }`,
              backgroundColor: active ? color.badge.background : color.main.white,
              color: active ? color.badge.hover : color.navbar.text2,
              fontFamily: typography.fontFamily.base,
              ...textStyle.sMedium,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {template.id === setup.appliedId ? '✓ ' : ''}
            {template.name}
          </button>
        );
      })}
    </div>
  ) : (
    <VStack gap="xxs">
      <span
        style={{
          ...textStyle.sMedium,
          color: color.main.description,
          padding: `0 ${spacing.xxs}px ${spacing.xxs}px`,
        }}
      >
        Templates
      </span>
      {TEMPLATES.map((template) => {
        const applied = template.id === setup.appliedId;
        return (
          <button
            key={template.id}
            type="button"
            onMouseEnter={() => setHoverId(template.id)}
            onMouseLeave={() => setHoverId(null)}
            onClick={() => {
              setSelectedId(template.id);
              setup.dismiss();
            }}
            style={cardStyle(hoverId === template.id, selectedId === template.id)}
          >
            <HStack gap="xxs" alignItems="center">
              <span style={{ ...textStyle.mMedium, color: color.navbar.text2, flex: 1 }}>
                {template.name}
              </span>
              {applied && (
                <span style={{ display: 'inline-flex', color: color.status.success.main }}>
                  <Icon icon={IconCheck} size={14} />
                </span>
              )}
            </HStack>
            <span style={{ ...textStyle.sRegular, color: color.main.description }}>
              {template.forWho}
            </span>
          </button>
        );
      })}
    </VStack>
  );

  const replacing = setup.text.trim() !== '';
  const right = selected ? (
    <VStack
      gap="s"
      p="m"
      radius="m"
      borderWidth={1}
      borderColor={color.main.brand}
      background={color.main.white}
    >
      <HStack gap="xs" alignItems="center" flexWrap="wrap">
        <VStack gap={0} flex={1} minWidth={0}>
          <span style={{ ...textStyle.mSemibold, color: color.navbar.text2 }}>
            Preview · {selected.name}
          </span>
          {replacing && (
            <span style={{ ...textStyle.sRegular, color: color.main.description }}>
              Using it replaces what is in the field now.
            </span>
          )}
        </VStack>
        <Button variant="secondary" size="small" onClick={() => setSelectedId(null)}>
          Cancel
        </Button>
        <Button
          size="small"
          onClick={() => {
            setup.apply(selected);
            setSelectedId(null);
          }}
        >
          Use this template
        </Button>
      </HStack>
      <TemplatePreview template={selected} phone={phone} />
    </VStack>
  ) : (
    <PromptCard setup={setup} phone={phone} />
  );

  return (
    <VStack gap="s" width="100%">
      <PromptHead setup={setup} phone={phone} tipOpen={initial.tipOpen} />
      {phone ? (
        <VStack gap="xs">
          {list}
          {right}
        </VStack>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '220px minmax(0, 1fr)',
            gap: spacing.s,
            alignItems: 'start',
          }}
        >
          {list}
          {right}
        </div>
      )}
    </VStack>
  );
}

/* ------------------------------------------------------------------ */
/* Proposal 3 — the templates wait behind a button on the card.        */
/* ------------------------------------------------------------------ */

/**
 * The card as it ships, empty with its placeholder, and a "Templates" button
 * in the row above it. The button opens a menu: the list on the left, and the
 * template under the pointer previewed on the right. Click one to hold it,
 * then use it. On a phone the menu opens in the flow as a list, and a tap
 * previews — there is no hover to preview on.
 *
 * Buys: the smallest change to the screen, and the templates are one click
 * away forever, not just at setup. Costs: it is the closest to the blank box
 * that caused this ticket — the placeholder, the tip and the popup have to do
 * the steering the other two do with layout.
 */
export function ProposalTemplatesMenu({ phone, initial = {} }: SetupRenderOptions) {
  const setup = useSetup(initial);
  const [open, setOpen] = useState(initial.menuOpen ?? false);
  const [hoverId, setHoverId] = useState<string | null>(initial.hoverId ?? null);
  const [selectedId, setSelectedId] = useState<string | null>(initial.selectedId ?? null);
  const shown =
    templateById(selectedId) ?? templateById(hoverId) ?? (phone ? undefined : TEMPLATES[0]);

  const close = () => {
    setOpen(false);
    setSelectedId(null);
    setHoverId(null);
  };

  const trigger = (
    <Button
      variant="secondary"
      size="small"
      startIcon={<Icon icon={IconPresetDocumentStroke} size={14} />}
      endIcon={<Icon icon={open ? IconDropdownArrowUp : IconDropdownArrowDown} size={12} />}
      onClick={() => {
        if (open) close();
        else {
          setOpen(true);
          setup.dismiss();
        }
      }}
    >
      Templates
    </Button>
  );

  const items = (
    <VStack gap="xxs">
      {TEMPLATES.map((template) => (
        <button
          key={template.id}
          type="button"
          onMouseEnter={() => setHoverId(template.id)}
          onClick={() => setSelectedId(template.id)}
          style={{
            ...cardStyle(
              hoverId === template.id && selectedId !== template.id,
              selectedId === template.id,
            ),
            border: 'none',
            padding: `${spacing.xs}px ${spacing.s}px`,
          }}
        >
          <HStack gap="xxs" alignItems="center">
            <span style={{ ...textStyle.mMedium, color: color.navbar.text2, flex: 1 }}>
              {template.name}
            </span>
            {template.id === setup.appliedId && (
              <span style={{ ...textStyle.sRegular, color: color.status.success.main }}>
                In use
              </span>
            )}
          </HStack>
          <span
            style={{
              ...textStyle.sRegular,
              color: color.main.description,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {template.forWho}
          </span>
        </button>
      ))}
    </VStack>
  );

  const useButton = (template: PromptTemplate) => {
    const chosen = selectedId === template.id || phone;
    return (
      <HStack gap="xs" justifyContent="flex-end" alignItems="center">
        <span style={{ ...textStyle.sRegular, color: color.main.description, flex: 1 }}>
          {!chosen
            ? 'Click a template to choose it.'
            : setup.text.trim() !== ''
            ? 'Replaces what is in the field.'
            : ''}
        </span>
        {chosen && (
          <Button
            size="small"
            onClick={() => {
              setup.apply(template);
              close();
            }}
          >
            Use this template
          </Button>
        )}
      </HStack>
    );
  };

  const menu = phone ? (
    <VStack
      gap="xs"
      p="s"
      radius="m"
      borderWidth={1}
      borderColor={color.navbar.hover}
      background={color.main.white}
    >
      {shown ? (
        <>
          <button type="button" onClick={() => setSelectedId(null)} style={linkStyle}>
            <Icon icon={IconLeftArrow} size={14} /> All templates
          </button>
          <span style={{ ...textStyle.mSemibold, color: color.navbar.text2 }}>{shown.name}</span>
          <TemplatePreview template={shown} phone />
          {useButton(shown)}
        </>
      ) : (
        items
      )}
    </VStack>
  ) : (
    <div
      style={{
        position: 'absolute',
        top: `calc(100% + ${spacing.xs}px)`,
        right: 0,
        zIndex: 20,
        width: 620,
        display: 'grid',
        gridTemplateColumns: '220px minmax(0, 1fr)',
        gap: spacing.s,
        padding: spacing.s,
        borderRadius: radius.m,
        border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
        backgroundColor: color.main.white,
        boxShadow: shadow.popup,
      }}
      onMouseLeave={() => setHoverId(null)}
    >
      {items}
      {shown && (
        <VStack gap="xs">
          <span style={{ ...textStyle.mSemibold, color: color.navbar.text2 }}>{shown.name}</span>
          <TemplatePreview template={shown} />
          {useButton(shown)}
        </VStack>
      )}
    </div>
  );

  return (
    <VStack gap="s" width="100%">
      <div style={{ position: 'relative' }}>
        <PromptHead setup={setup} phone={phone} tipOpen={initial.tipOpen} extra={trigger} />
        {open && !phone && menu}
      </div>
      {open && phone && menu}
      <PromptCard setup={setup} phone={phone} />
    </VStack>
  );
}

/* ------------------------------------------------------------------ */
/* The settled states, without any picker.                             */
/* ------------------------------------------------------------------ */

/**
 * The head and the card alone — what all three proposals share once a
 * template is applied or the team is writing their own. The settled states
 * are drawn with this, so none of them looks like it belongs to one proposal.
 */
export function SharedPromptSetup({ phone, initial = {} }: SetupRenderOptions) {
  const setup = useSetup(initial);
  return (
    <VStack gap="s" width="100%">
      <PromptHead setup={setup} phone={phone} tipOpen={initial.tipOpen} />
      <PromptCard setup={setup} phone={phone} />
    </VStack>
  );
}

/* ------------------------------------------------------------------ */
/* The manifest.                                                       */
/* ------------------------------------------------------------------ */

export const PROPOSALS: {
  number: number;
  approach: string;
  rationale: string;
  render: (options?: SetupRenderOptions) => ReactNode;
}[] = [
  {
    number: 1,
    approach: 'The templates are the empty card',
    rationale:
      'Nobody meets a blank box: with nothing written, the card is five templates and a “Write my own” tile, and a template previews where the field will be. Costs one extra click for a team that already knows what to write, and once text exists the templates are behind a “Change template” link rather than on screen.',
    render: (options) => <ProposalTemplatesFirst {...options} />,
  },
  {
    number: 2,
    approach: 'The templates sit beside the field',
    rationale:
      'The field and the five templates are on screen together, so writing from scratch and starting from a template are equal choices, and switching templates is one click at any time. Costs width — on a phone it becomes a chip row over the field — and the list stays on the screen long after setup is done.',
    render: (options) => <ProposalTemplatesBeside {...options} />,
  },
  {
    number: 3,
    approach: 'The templates wait behind a button on the card',
    rationale:
      'The smallest change: the card as it ships, empty, with a “Templates” menu that previews on hover. Costs the most steering — it is the closest to the blank box that caused the ticket, so the placeholder, the tip and the popup do the work the other two do with layout. On a phone there is no hover, so preview is a tap.',
    render: (options) => <ProposalTemplatesMenu {...options} />,
  },
];
