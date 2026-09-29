import { borderWidth, color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import {
  IconCheck,
  IconInfoStroke,
  IconLeftArrow,
  IconWarningCircleStroke,
  IconXClose,
} from '../../icons/defs.js';
import { StatusBadge } from '../Badge/StatusBadge.js';
import { Button } from '../Button/Button.js';
import { Tooltip } from '../Tooltip/Tooltip.js';
import { AiPromptConfig, type PromptVariableDef } from './AiPromptConfig.js';
import { CustomPromptField } from './CustomPromptField.js';
import { PromptTemplatePicker, type PromptTemplate } from './PromptTemplatePicker.js';
import { promptSaveState, samePrompt, type PromptSaveState } from './promptSaveState.js';

const { promptSetup } = component;
const { textStyle } = typography;

/** One line of the guidance tooltip. */
export type PromptGuidancePoint = {
  /** What to cover — "Your rate". */
  label: ReactNode;
  /** An example of it — "“$45/h”". */
  example?: ReactNode;
};

/** The five points BF-4111 asks every prompt to cover. */
export const DEFAULT_PROMPT_GUIDANCE: PromptGuidancePoint[] = [
  { label: 'Your rate', example: '“$45/h”, or “fixed price from $1,500”' },
  { label: 'When you can start', example: '“next Monday”, “within 48 hours”' },
  { label: 'Agency or solo', example: 'clients ask, and it changes “I” to “we”' },
  { label: 'Your calendar link', example: 'so Laziza books the call instead of asking for times' },
  {
    label: 'What it must never say',
    example: '“never quote a deadline”, “never offer a discount”',
  },
];

/**
 * The empty field's placeholder: an example brief rather than an instruction.
 * One that reads like a real prompt shows the length and the register at a
 * glance, and goes the moment the team starts typing.
 */
export const DEFAULT_PROMPT_PLACEHOLDER = `Brief Laziza the way you would brief a new teammate. For example:

We're a 4-person Webflow agency. Our rate is $45/h and we can start next Monday.
Book calls at calendly.com/northwind/intro.
Never promise a deadline before we've had a call.`;

/** Which of the card's two faces is showing. */
export type PromptSetupView = 'templates' | 'field';

export type PromptSetupProps = {
  /** The prompt text. Controlled. */
  value?: string;
  /** Initial text when uncontrolled. Empty is the point: the default is not pre-filled. */
  defaultValue?: string;
  onChange?: (value: string) => void;

  /**
   * The saved custom prompt, or `null` while the agent runs on the default.
   * Controlled; drives the status badge and the "already saved" rule.
   */
  savedValue?: string | null;
  defaultSavedValue?: string | null;
  /** Fires with the text. Only reachable once `promptSaveState` allows it. */
  onSave?: (payload: { value: string }) => void;
  /** Reverts the field to what is saved, then calls back. */
  onCancel?: () => void;
  /** Puts Save in its loading state. */
  saving?: boolean;

  /**
   * What the agent runs on until a prompt is saved. Never shown in the field —
   * it is what Save refuses to save as custom.
   */
  defaultPrompt: string;

  /** The ready prompts the empty card offers. */
  templates: PromptTemplate[];
  /** Fires when a template is used, after it has filled the field. */
  onTemplateApply?: (template: PromptTemplate) => void;
  /** The template the saved or loaded text came from, if any. */
  defaultAppliedTemplateId?: string | null;

  /**
   * Which face the card starts on. Defaults to the templates while there is
   * nothing written, and to the field once there is.
   */
  defaultView?: PromptSetupView;
  /** A template to open in preview — for drawing that state as a still. */
  defaultSelectedTemplateId?: string | null;
  /** A tile to draw hovered — for drawing that state as a still. */
  defaultHighlightedTemplateId?: string | null;

  /**
   * The one-time "Change this" popup. Controlled — the product owns the
   * per-user flag that says it has been seen. It closes on Got it, a click
   * elsewhere, the first keystroke, or a template used; each fires
   * `onFirstVisitDismiss`, and none brings it back.
   */
  firstVisit?: boolean;
  /** Initial popup state when uncontrolled. */
  defaultFirstVisit?: boolean;
  onFirstVisitDismiss?: () => void;
  firstVisitTitle?: ReactNode;
  firstVisitDescription?: ReactNode;

  /** The label over the card. */
  label?: ReactNode;
  /** The empty field's placeholder. */
  placeholder?: string;
  /** The guidance tooltip's points. */
  guidance?: PromptGuidancePoint[];
  guidanceTitle?: ReactNode;
  guidanceIntro?: ReactNode;
  /** Opens the guidance tooltip on mount — for drawing that state as a still. */
  defaultGuidanceOpen?: boolean;

  /** The badge text for each state of the prompt. */
  statusLabels?: { default?: ReactNode; unsaved?: ReactNode; saved?: ReactNode };
  /** The footer line for each reason Save is off, or on. */
  reasonCopy?: (state: PromptSaveState) => ReactNode;

  /** Variables offered in the card's insert strip. */
  variables?: PromptVariableDef[];
  variablesHint?: ReactNode;

  /**
   * The phone layout: one template per row, the guidance tooltip on tap
   * rather than hover, the variable strip collapsed, a taller field.
   */
  narrow?: boolean;
};

/** The footer copy, reason by reason. */
function defaultReason(state: PromptSaveState): ReactNode {
  switch (state.reason) {
    case 'empty':
      return 'Empty. Laziza keeps using GigRadar’s default until you save a prompt of your own.';
    case 'default':
      return 'This is still GigRadar’s default. Change it to make it yours.';
    case 'blanks':
      return `Fill in ${state.blanks.length} blank${
        state.blanks.length === 1 ? '' : 's'
      }: ${state.blanks.join(', ')}`;
    case 'saved':
      return 'Saved. Edit the prompt to save a new version.';
    default:
      return 'Ready to save. Laziza uses this from the next reply.';
  }
}

/**
 * Setting up the custom prompt — CRM ▸ Settings ▸ AI Configuration, BF-4111.
 *
 * The card no longer arrives holding the default. With nothing written it
 * shows five templates and "Write my own" in the field's place; a template
 * previews before it touches anything, and using it fills the field, which
 * stays editable. "Change template" above the field goes back.
 *
 * Settled around that:
 * - the field starts empty, with an example brief as its placeholder;
 * - Save is off while the text is empty, the default, a template with
 *   `[blanks]` left, or already saved — the footer says which
 *   (`promptSaveState`);
 * - an info mark beside the label lists what a prompt needs;
 * - a one-time "Change this" popup points at the "Using GigRadar default"
 *   badge on first visit.
 *
 * The card itself is `AiPromptConfig`: its field gets the placeholder and its
 * footer gets the save rule. The version pill is left out — a team setting up
 * its first prompt has nothing to version.
 */
export const PromptSetup = forwardRef<HTMLDivElement, PromptSetupProps>(function PromptSetup(
  {
    value,
    defaultValue = '',
    onChange,
    savedValue,
    defaultSavedValue = null,
    onSave,
    onCancel,
    saving = false,
    defaultPrompt,
    templates,
    onTemplateApply,
    defaultAppliedTemplateId = null,
    defaultView,
    defaultSelectedTemplateId = null,
    defaultHighlightedTemplateId = null,
    firstVisit,
    defaultFirstVisit = false,
    onFirstVisitDismiss,
    firstVisitTitle = 'Change this',
    firstVisitDescription = 'Laziza is replying with GigRadar’s default prompt, which knows nothing about your rate, your availability or your calendar. Write your own, or start from a template.',
    label = 'Your prompt',
    placeholder = DEFAULT_PROMPT_PLACEHOLDER,
    guidance = DEFAULT_PROMPT_GUIDANCE,
    guidanceTitle = 'What to write',
    guidanceIntro = 'A prompt that answers these gets replies. One line each is enough.',
    defaultGuidanceOpen = false,
    statusLabels,
    reasonCopy = defaultReason,
    variables = [],
    variablesHint = 'Click to insert at your cursor, or hover for details.',
    narrow = false,
  },
  ref,
) {
  const [ownText, setOwnText] = useState(defaultValue);
  const text = value !== undefined ? value : ownText;
  const [ownSaved, setOwnSaved] = useState<string | null>(defaultSavedValue);
  const saved = savedValue !== undefined ? savedValue : ownSaved;
  const [ownFirstVisit, setOwnFirstVisit] = useState(defaultFirstVisit);
  const popupOpen = firstVisit !== undefined ? firstVisit : ownFirstVisit;
  const [view, setView] = useState<PromptSetupView>(
    defaultView ?? (text.trim() === '' ? 'templates' : 'field'),
  );
  const [appliedId, setAppliedId] = useState<string | null>(defaultAppliedTemplateId);

  const write = (next: string) => {
    if (value === undefined) setOwnText(next);
    onChange?.(next);
  };
  const dismiss = () => {
    if (!popupOpen) return;
    if (firstVisit === undefined) setOwnFirstVisit(false);
    onFirstVisitDismiss?.();
  };

  const state = promptSaveState(text, { defaultPrompt, savedValue: saved });
  const dirty = !samePrompt(text, saved ?? '');
  const own = text.trim() !== '' && !samePrompt(text, defaultPrompt);
  const applied = templates.find((template) => template.id === appliedId);

  const status =
    saved !== null ? (
      <StatusBadge tone="active">{statusLabels?.saved ?? 'Custom prompt'}</StatusBadge>
    ) : own ? (
      <StatusBadge tone="pending">{statusLabels?.unsaved ?? 'Not saved yet'}</StatusBadge>
    ) : (
      <StatusBadge tone="inactive">{statusLabels?.default ?? 'Using GigRadar default'}</StatusBadge>
    );

  const guidanceBody = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: promptSetup.guidance.gap }}>
      {guidanceIntro && (
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>
          {guidanceIntro}
        </span>
      )}
      <ol
        style={{
          margin: 0,
          paddingLeft: promptSetup.guidance.indent,
          display: 'flex',
          flexDirection: 'column',
          gap: promptSetup.guidance.listGap,
        }}
      >
        {guidance.map((point, index) => (
          <li key={index} style={{ ...textStyle.sRegular, color: color.main.description }}>
            <span style={{ ...textStyle.sSemibold, color: color.navbar.text2 }}>{point.label}</span>
            {point.example && <> — {point.example}</>}
          </li>
        ))}
      </ol>
    </div>
  );

  const head = (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: promptSetup.headGap, flexWrap: 'wrap' }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: promptSetup.headGap,
          flex: 1,
          minWidth: 0,
        }}
      >
        <span style={{ ...textStyle.mMedium, color: color.main.black, whiteSpace: 'nowrap' }}>
          {label}
        </span>
        <Tooltip
          title={guidanceTitle}
          content={guidanceBody}
          placement="bottom"
          align="start"
          trigger={narrow ? 'click' : 'hover'}
          defaultOpen={defaultGuidanceOpen}
          maxWidth={narrow ? promptSetup.narrowTooltipMaxWidth : promptSetup.tooltipMaxWidth}
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
            <Icon icon={IconInfoStroke} size={promptSetup.infoIconSize} />
          </button>
        </Tooltip>
        {applied && view === 'field' && !narrow && (
          <span style={{ ...textStyle.sRegular, color: color.main.description }}>
            · from “{applied.name}”
          </span>
        )}
      </div>
      <Tooltip
        open={popupOpen}
        onOpenChange={(open) => {
          if (!open) dismiss();
        }}
        title={firstVisitTitle}
        content={firstVisitDescription}
        actions={
          <Button size="small" onClick={dismiss}>
            Got it
          </Button>
        }
        placement="bottom"
        align="end"
        maxWidth={narrow ? promptSetup.narrowPopupMaxWidth : promptSetup.popupMaxWidth}
      >
        <span style={{ display: 'inline-flex' }}>{status}</span>
      </Tooltip>
    </div>
  );

  const footer = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: promptSetup.footer.gap,
        flexWrap: 'wrap',
        padding: promptSetup.footer.padding,
        borderTop: `${borderWidth.thin}px solid ${color.navbar.hover}`,
      }}
    >
      <div
        aria-live="polite"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: promptSetup.footer.reasonGap,
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: promptSetup.footer.reasonBasis,
          minWidth: 0,
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            color: state.canSave ? color.status.success.main : color.navbar.text,
          }}
        >
          <Icon
            icon={state.canSave ? IconCheck : IconWarningCircleStroke}
            size={promptSetup.footer.reasonIconSize}
          />
        </span>
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>
          {reasonCopy(state)}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: promptSetup.footer.gap }}>
        <Button
          variant="secondary"
          size="medium"
          disabled={!dirty || saving}
          startIcon={<Icon icon={IconXClose} size={promptSetup.footer.buttonIconSize} />}
          onClick={() => {
            write(saved ?? '');
            onCancel?.();
          }}
        >
          Cancel
        </Button>
        <Button
          size="medium"
          disabled={!state.canSave || saving}
          loading={saving}
          startIcon={<Icon icon={IconCheck} size={promptSetup.footer.buttonIconSize} />}
          onClick={() => {
            if (savedValue === undefined) setOwnSaved(text);
            onSave?.({ value: text });
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );

  const body =
    view === 'templates' ? (
      <PromptTemplatePicker
        templates={templates}
        defaultSelectedId={defaultSelectedTemplateId}
        defaultHighlightedId={defaultHighlightedTemplateId}
        appliedId={appliedId}
        replaces={text.trim() !== ''}
        narrow={narrow}
        onSelectedChange={(id) => {
          if (id) dismiss();
        }}
        onApply={(template) => {
          write(template.body);
          setAppliedId(template.id);
          setView('field');
          dismiss();
          onTemplateApply?.(template);
        }}
        onWriteOwn={() => {
          setView('field');
          dismiss();
        }}
      />
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: promptSetup.headGap }}>
        {templates.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setView('templates')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: promptSetup.picker.linkGap,
                padding: 0,
                border: 'none',
                background: 'transparent',
                color: color.main.brand,
                cursor: 'pointer',
                fontFamily: typography.fontFamily.base,
                ...textStyle.sMedium,
              }}
            >
              <Icon icon={IconLeftArrow} size={promptSetup.picker.linkIconSize} />
              {appliedId ? 'Change template' : 'Start from a template'}
            </button>
          </div>
        )}
        <AiPromptConfig
          value={text}
          onChange={(next) => {
            write(next);
            dismiss();
          }}
          variables={variables}
          variablesHint={narrow ? null : variablesHint}
          defaultVariablesOpen={!narrow}
          saving={saving}
          renderField={({ value: fieldValue, onChange: fieldChange, ref: fieldRef }) => (
            <CustomPromptField
              ref={fieldRef}
              value={fieldValue}
              onChange={fieldChange}
              placeholder={placeholder}
              aria-label="Your prompt"
              disabled={saving}
              minHeight={narrow ? promptSetup.narrowFieldMinHeight : promptSetup.fieldMinHeight}
              radius={0}
              borderWidth={0}
            />
          )}
          renderFooter={() => footer}
        />
      </div>
    );

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: promptSetup.gap,
        width: '100%',
        fontFamily: typography.fontFamily.base,
      }}
    >
      {head}
      {body}
    </div>
  );
});
