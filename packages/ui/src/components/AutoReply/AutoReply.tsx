import { borderWidth, color, component, controlHeight, typography } from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useId,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconCheck, IconEditPencilArrow, IconTryAgain, IconXClose } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { ConfirmTooltip } from '../Tooltip/ConfirmTooltip.js';
import { CustomPromptField } from '../Prompt/CustomPromptField.js';
import { Radio } from '../Radio/Radio.js';
import { AutoReplyButton } from './AutoReplyButton.js';
import { AutoReplyModeTab } from './AutoReplyModeTab.js';
import { ModeBadge, type ReplyMode } from './ModeBadge.js';

const { autoReply } = component;

export type { ReplyMode };

/** One message class the card can configure. */
export type AutoReplyTab = {
  /** Stable identity, echoed back by `onTabChange`. */
  id: string;
  /** The tab's label — "First Message", "Other Message". */
  label: string;
  /** The mode this class runs in. Drawn as the tab's badge. */
  mode: ReplyMode;
};

/** One selectable mode inside the card. */
export type AutoReplyOption = {
  /** Matches a `ReplyMode`, so the tab badge and the choice stay in step. */
  id: ReplyMode;
  /** The choice's name — "Full Auto", "Co-pilot", "Turn Off". */
  label: string;
  /** The line under it. */
  description: string;
  /**
   * The short label in the square marker — "Auto", "50%".
   *
   * Omit for an icon marker; pass `markerIcon` instead.
   */
  markerLabel?: string;
  /** An icon marker, for a choice with no natural abbreviation. */
  markerIcon?: Parameters<typeof Icon>[0]['icon'];
  /** The marker's fill. Defaults to the mode's own badge color. */
  markerColor?: string;
};

/** What one option gets when a caller replaces its markup. */
export type AutoReplyOptionRenderProps = WithDefaultRender & {
  option: AutoReplyOption;
  selected: boolean;
};

/** What the footer gets when a caller replaces it. */
export type AutoReplyFooterRenderProps = WithDefaultRender & {
  /** Whether anything has changed since the last save. */
  dirty: boolean;
};

/** What the prompt block gets when a caller replaces it. */
export type AutoReplyPromptRenderProps = WithDefaultRender & {
  /** The open tab, so a caller can draw a different block per message class. */
  tab: AutoReplyTab | undefined;
  /** The open tab's mode. */
  value: ReplyMode | undefined;
};

/**
 * How the mode options sit.
 *
 * `row` is the desktop card: three options side by side, each with its
 * one-line description. `column` stacks them full width, which is what a phone
 * wants — side by side at 402px each option is ~105px and its description
 * cannot fit.
 */
export type AutoReplyOptionsDirection = 'row' | 'column';

/** Per-instance overrides for the card's own metrics. */
export type AutoReplyStyleProps = {
  radius?: CssLength;
  padding?: CssLength;
  gap?: CssLength;
  background?: string;
  borderColor?: string;
};

export type AutoReplyProps = {
  /** The message classes across the top. */
  tabs?: AutoReplyTab[];
  /** Id of the open tab. */
  tabId?: string;
  onTabChange?: (tab: AutoReplyTab) => void;

  /** The modes on offer. */
  options?: AutoReplyOption[];
  /** The chosen mode. */
  value?: ReplyMode;
  onChange?: (mode: ReplyMode) => void;
  /**
   * How the mode options sit — side by side, or stacked for a phone.
   *
   * @default 'row'
   */
  optionsDirection?: AutoReplyOptionsDirection;

  /**
   * Content directly under the mode row, before the prompt.
   *
   * Where the open mode is explained — `AutoReplyNote` for what the mode does
   * and where its result shows up, `ReplyRateStat` on the first-reply tab,
   * and on the other tab the template picker and `StopRuleList`. It sits
   * under the row rather than inside each option because an option's
   * description is one truncated line on a desktop and is dropped on a phone.
   */
  details?: ReactNode;

  /** Heading over the extra-prompt block. */
  promptLabel?: ReactNode;
  /** The extra prompt's text. Controlled. */
  promptValue?: string;
  /** Initial text when the card manages its own state. */
  defaultPromptValue?: string;
  onPromptChange?: (value: string) => void;
  /** Placeholder for the extra prompt. */
  promptPlaceholder?: string;
  /** Whether the extra prompt is switched on. */
  promptEnabled?: boolean;
  onPromptEnabledChange?: (enabled: boolean) => void;

  onSave?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  /**
   * The confirmation shown before resetting.
   *
   * Reset throws away every unsaved edit at once and cannot be undone, so it
   * asks first — the same standing as any other destructive action.
   */
  resetTitle?: ReactNode;
  resetDescription?: ReactNode;
  /**
   * Marks the card as changed from outside — edits made inside `details`
   * (a template picked, a prompt typed) that the card cannot see itself.
   * Save and Cancel enable while either this or the card's own edits say so.
   */
  dirty?: boolean;
  /** Puts Save in its loading state and blocks editing. */
  saving?: boolean;
  /**
   * Dims the whole card and blocks every control.
   *
   * Figma's disabled variant fades the card rather than restyling it, so a
   * turned-off thread reads as inert without inventing a second palette.
   */
  disabled?: boolean;

  /** Replaces one mode option. Call `defaultRender()` to decorate it. */
  renderOption?: RenderProp<AutoReplyOptionRenderProps>;
  /** Replaces the footer row. */
  renderFooter?: RenderProp<AutoReplyFooterRenderProps>;
  /**
   * Replaces the additional-prompt block. Return `null` to drop it — the
   * all-other-replies tab carries its prompt inside `details`, under a
   * template picker, and a second prompt below would be two places to write
   * the same instructions.
   */
  renderPrompt?: RenderProp<AutoReplyPromptRenderProps>;
} & AutoReplyStyleProps;

/**
 * The Auto Reply card — CRM ▸ Settings ▸ AI Configuration.
 *
 * Figma: node 3962:39155, with its tabs at 4498:4818 and mode badge at
 * 4498:4800. A tab per message class, three mutually exclusive modes, an
 * optional extra prompt, and a save row.
 *
 * The modes are `Radio`s rather than styled boxes: exactly one applies at a
 * time, which is a radio group's job and gives arrow-key movement for free.
 * The extra prompt reuses `CustomPromptField`, and the footer reuses `Button`.
 *
 * Options and the footer take render props, per `internal/render.ts` — a
 * product may add a mode or change the save row, which is where these differ.
 */
export const AutoReply = forwardRef<HTMLDivElement, AutoReplyProps>(function AutoReply(
  {
    tabs = [],
    tabId,
    onTabChange,
    options = [],
    value,
    onChange,
    optionsDirection = 'row',
    details,
    promptLabel = 'Additional prompt',
    promptValue,
    defaultPromptValue = '',
    onPromptChange,
    promptPlaceholder = "None, tap to 'Add Prompt' to use this feature.",
    promptEnabled = false,
    onPromptEnabledChange,
    onSave,
    onCancel,
    onReset,
    resetTitle = 'Discard your changes?',
    resetDescription = 'The reply modes and prompts go back to the last saved version. This cannot be undone.',
    saving = false,
    dirty: externalDirty = false,
    disabled = false,
    renderOption,
    renderFooter,
    renderPrompt,
    radius,
    padding,
    gap,
    background,
    borderColor,
  },
  ref,
) {
  const groupName = useId();
  const [uncontrolledPrompt, setUncontrolledPrompt] = useState(defaultPromptValue);
  const [ownDirty, setDirty] = useState(false);
  const dirty = ownDirty || externalDirty;

  const isPromptControlled = promptValue !== undefined;
  const prompt = isPromptControlled ? promptValue : uncontrolledPrompt;

  const activeTab = tabs.find((tab) => tab.id === tabId) ?? tabs[0];
  const border = borderColor ?? color.navbar.hover;

  const commitPrompt = useCallback(
    (next: string) => {
      if (!isPromptControlled) setUncontrolledPrompt(next);
      setDirty(true);
      onPromptChange?.(next);
    },
    [isPromptControlled, onPromptChange],
  );

  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    width: '100%',
    borderRadius: len(radius) ?? `${autoReply.radius}px`,
    border: `${borderWidth.thin}px solid ${border}`,
    backgroundColor: background ?? color.main.background,
    overflow: 'hidden',
    fontFamily: typography.fontFamily.base,
    opacity: disabled ? autoReply.disabledOpacity : undefined,
  };

  const defaultPrompt = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <span style={{ ...typography.textStyle.mMedium, color: color.main.black }}>
        {promptLabel}
      </span>
      <AutoReplyButton
        title={promptLabel}
        markerIcon={IconEditPencilArrow}
        selected={promptEnabled}
        name={`${groupName}-prompt`}
        disabled={disabled || saving}
        onSelect={() => {
          setDirty(true);
          onPromptEnabledChange?.(!promptEnabled);
        }}
      >
        <CustomPromptField
          value={prompt}
          onChange={commitPrompt}
          placeholder={promptPlaceholder}
          minHeight={autoReply.promptHeight}
          disabled={disabled || saving || !promptEnabled}
        />
      </AutoReplyButton>
    </div>
  );

  const defaultFooter = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxSizing: 'border-box',
        padding: autoReply.padding,
        borderTop: `${borderWidth.thin}px solid ${border}`,
        backgroundColor: color.main.white,
        flexWrap: 'wrap',
      }}
    >
      <Button
        size="medium"
        disabled={!dirty || saving || disabled}
        loading={saving}
        startIcon={<Icon icon={IconCheck} size="100%" />}
        onClick={() => {
          setDirty(false);
          onSave?.();
        }}
      >
        Save
      </Button>
      <Button
        variant="secondary"
        size="medium"
        disabled={!dirty || saving || disabled}
        startIcon={<Icon icon={IconXClose} size="100%" />}
        onClick={() => {
          setDirty(false);
          onCancel?.();
        }}
      >
        Cancel
      </Button>
      {onReset && (
        <ConfirmTooltip
          title={resetTitle}
          description={resetDescription}
          confirmLabel="Reset"
          placement="top"
          onConfirm={onReset}
        >
          <Button
            variant="secondary"
            tone="danger"
            size="medium"
            disabled={saving || disabled}
            startIcon={<Icon icon={IconTryAgain} size="100%" />}
          >
            Reset
          </Button>
        </ConfirmTooltip>
      )}
    </div>
  );

  return (
    <div ref={ref} style={cardStyle}>
      {tabs.length > 0 && (
        <div role="tablist" style={{ display: 'flex', width: '100%' }}>
          {tabs.map((tab) => (
            <AutoReplyModeTab
              key={tab.id}
              label={tab.label}
              mode={tab.mode}
              selected={tab.id === activeTab?.id}
              disabled={disabled}
              onClick={() => onTabChange?.(tab)}
            />
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: len(gap) ?? autoReply.gap,
          boxSizing: 'border-box',
          padding: len(padding) ?? autoReply.padding,
          backgroundColor: color.main.white,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: optionsDirection,
            gap: autoReply.optionsGap,
            width: '100%',
          }}
        >
          {options.map((option) => {
            const selected = option.id === value;
            const defaultRender = () => (
              <AutoReplyButton
                title={option.label}
                description={option.description}
                markerLabel={option.markerLabel}
                markerIcon={option.markerIcon}
                accentColor={option.markerColor}
                selected={selected}
                name={groupName}
                disabled={disabled || saving}
                onSelect={() => {
                  setDirty(true);
                  onChange?.(option.id);
                }}
              />
            );

            return (
              <div
                key={option.id}
                style={{
                  flex: optionsDirection === 'row' ? '1 1 0' : '0 0 auto',
                  minWidth: 0,
                  display: 'flex',
                }}
              >
                {renderOption ? renderOption({ option, selected, defaultRender }) : defaultRender()}
              </div>
            );
          })}
        </div>

        {details !== undefined && details !== null && details !== false && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: autoReply.details.gap,
              width: '100%',
            }}
          >
            {details}
          </div>
        )}

        {renderPrompt
          ? renderPrompt({ tab: activeTab, value, defaultRender: defaultPrompt })
          : defaultPrompt()}
      </div>

      {renderFooter ? renderFooter({ dirty, defaultRender: defaultFooter }) : defaultFooter()}
    </div>
  );
});
