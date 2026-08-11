import { color, component, radius as radiusToken, spacing, typography } from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCheck,
  IconDropdownArrowDown,
  IconLastActivity,
  IconLeftArrow,
  IconRestoreArrow,
  IconTryAgain,
  IconXClose,
} from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { CustomPromptField, type CustomPromptFieldHandle } from './CustomPromptField.js';
import { PromptVariable } from './PromptVariable.js';
import { VersionNumber, formatVersion, type PromptVersion } from './VersionNumber.js';

const { prompt } = component;

export type { PromptVersion };

/** A variable offered in the insert strip. */
export type PromptVariableDef = {
  /** The name, without braces. */
  name: string;
  /** What it means. Shown as the tooltip body on hover. */
  description?: string;
  /** A sample expansion, shown in the tooltip as `eg. DesignPro.ltd`. */
  example?: string;
};

/**
 * Which of Figma's four card states to draw (node 3804:21514).
 *
 * Only `viewing` is a genuinely separate mode. Figma's other three —
 * "Current - Default", "Current - Edit", and "Current - Default Prompt" — are
 * the same editing card at different moments: whether the text has been
 * touched, and which version happens to be loaded. Both of those the card
 * already knows, so they are states it arrives at rather than a prop a caller
 * has to set and keep in sync.
 *
 * `viewing` is different in kind: the prompt is read-only, the variable strip
 * is gone, and Save/Cancel are replaced by Back and Restore. Nothing the card
 * can derive tells it the user is browsing history rather than editing, so
 * that one is a prop.
 */
export type PromptCardMode = 'editing' | 'viewing';

/** What the footer gets when a caller replaces it. */
export type PromptFooterRenderProps = WithDefaultRender & {
  /** Whether the prompt differs from the loaded version. */
  dirty: boolean;
  /** The version currently loaded. */
  version?: PromptVersion;
};

/** What the prompt field gets when a caller replaces it. */
export type PromptFieldRenderProps = WithDefaultRender & {
  /** The current prompt text. */
  value: string;
  /** Writes new text, and re-runs the dirty check that gates Save. */
  onChange: (value: string) => void;
  /** True while an older revision is open, so the field should be read-only. */
  readOnly: boolean;
  /**
   * Hand this to whatever replaces the field, or the variable chips lose the
   * caret they insert at.
   */
  ref: RefObject<CustomPromptFieldHandle>;
};

/** What the variable strip gets when a caller replaces it. */
export type PromptVariablesRenderProps = WithDefaultRender & {
  variables: PromptVariableDef[];
  /** Drops a token into the field at the caret. */
  insert: (token: string) => void;
};

/** Per-instance overrides for the card's own metrics. */
export type AiPromptConfigStyleProps = {
  /** Corner radius of the card. */
  radius?: CssLength;
  /** Card fill. */
  background?: string;
  /** Border and divider color. */
  borderColor?: string;
  /** Visible height of the prompt field before it scrolls. */
  fieldHeight?: CssLength;
};

export type AiPromptConfigProps = {
  /**
   * `editing` is the settings card. `viewing` is Figma's "Another" state — an
   * older revision opened read-only, with Back and Restore in place of the
   * save row.
   *
   * @default 'editing'
   */
  mode?: PromptCardMode;
  /** Leaves `viewing` and returns to the current revision. */
  onBack?: () => void;
  /** Makes the revision being viewed the current one. */
  onRestore?: () => void;
  /** The prompt text. Controlled. */
  value?: string;
  /** Initial text when the card manages its own state. */
  defaultValue?: string;
  onChange?: (value: string) => void;

  /** Variables offered in the insert strip. */
  variables?: PromptVariableDef[];
  /** Helper line at the right of the strip's header. */
  variablesHint?: ReactNode;
  /**
   * Whether the insert strip starts open.
   *
   * @default true
   */
  defaultVariablesOpen?: boolean;

  /** Saved revisions, newest first. Drives the version pill. */
  versions?: PromptVersion[];
  /** Id of the loaded version. */
  versionId?: string;
  onVersionChange?: (version: PromptVersion) => void;
  onVersionRestore?: (version: PromptVersion) => void;
  onVersionDelete?: (version: PromptVersion) => void;

  /** The revision name typed into the footer field. Controlled. */
  versionLabel?: string;
  onVersionLabelChange?: (label: string) => void;
  /** Placeholder for that field. */
  versionLabelPlaceholder?: string;

  /** Fires with the current text and revision name. Enabled only when dirty. */
  onSave?: (payload: { value: string; label: string }) => void;
  /** Reverts to the loaded version. Enabled only when dirty. */
  onCancel?: () => void;
  /**
   * Resets to the base version. The button is omitted when not supplied, and
   * in `viewing` mode — an older revision has nothing to reset.
   */
  onReset?: () => void;

  /** The right-hand save status. Figma draws "4 minutes ago". */
  savedHint?: ReactNode;
  /** Puts the save button in its loading state and blocks further edits. */
  saving?: boolean;

  /**
   * Replaces the prompt field. Call `defaultRender()` to decorate it.
   *
   * Pass the supplied `ref` through to whatever you render, otherwise the
   * variable chips have no caret to insert at.
   */
  renderField?: RenderProp<PromptFieldRenderProps>;
  /** Replaces the insert strip. Call `defaultRender()` to decorate it. */
  renderVariables?: RenderProp<PromptVariablesRenderProps>;
  /** Replaces the whole footer row. */
  renderFooter?: RenderProp<PromptFooterRenderProps>;
} & AiPromptConfigStyleProps;

/**
 * The AI Configuration card — CRM ▸ Settings ▸ AI Configuration.
 *
 * Figma: node 4949:2023 ("Custom Prompt"). A bordered white card holding the
 * mono prompt field, a collapsible strip of variable chips, and a footer with
 * the revision name, the version pill, and the save/cancel/reset row.
 *
 * This is the composition, not a new control: the field, the chips, and the
 * pill are the three components beside it in this folder, and the buttons are
 * the design system's Button. What the card adds is the wiring those three
 * cannot do on their own — routing a chip click into the field's caret, and
 * deriving `dirty` from the text against the loaded version, which is what
 * decides whether Save is live.
 *
 * The composed parts take render props, per the convention in
 * `internal/render.ts`: the footer's button set and the variable strip are
 * where products differ, while the card's own frame does not.
 */
export const AiPromptConfig = forwardRef<HTMLDivElement, AiPromptConfigProps>(
  function AiPromptConfig(
    {
      mode = 'editing',
      onBack,
      onRestore,
      value,
      defaultValue = '',
      onChange,
      variables = [],
      variablesHint = 'Click to insert at your cursor in the custom prompt, or hover for details.',
      defaultVariablesOpen = true,
      versions = [],
      versionId,
      onVersionChange,
      onVersionRestore,
      onVersionDelete,
      versionLabel,
      onVersionLabelChange,
      versionLabelPlaceholder = 'Name this revision',
      onSave,
      onCancel,
      onReset,
      savedHint,
      saving = false,
      renderField,
      renderVariables,
      renderFooter,
      radius,
      background,
      borderColor,
      fieldHeight,
    },
    ref,
  ) {
    const fieldRef = useRef<CustomPromptFieldHandle>(null);
    const [uncontrolledText, setUncontrolledText] = useState(defaultValue);
    const [uncontrolledLabel, setUncontrolledLabel] = useState('');
    const [variablesOpen, setVariablesOpen] = useState(defaultVariablesOpen);

    const isControlled = value !== undefined;
    const text = isControlled ? value : uncontrolledText;

    // The baseline the dirty check runs against. Held in a ref rather than
    // state because it only ever changes in response to a save or a version
    // switch — re-rendering when it moves would be redundant with the
    // re-render those already cause.
    const baseline = useRef(text);
    const [dirty, setDirty] = useState(false);

    const commitText = useCallback(
      (next: string) => {
        if (!isControlled) setUncontrolledText(next);
        setDirty(next !== baseline.current);
        onChange?.(next);
      },
      [isControlled, onChange],
    );

    const label = versionLabel ?? uncontrolledLabel;
    const commitLabel = useCallback(
      (next: string) => {
        if (versionLabel === undefined) setUncontrolledLabel(next);
        onVersionLabelChange?.(next);
      },
      [versionLabel, onVersionLabelChange],
    );

    const insert = useCallback((token: string) => {
      fieldRef.current?.insertAtCursor(token);
    }, []);

    const currentVersion = versions.find((v) => v.id === versionId) ?? versions[0];
    const border = borderColor ?? color.navbar.hover;
    const isViewing = mode === 'viewing';

    // Figma swaps the timestamp for "Viewing v1" while an old revision is
    // open. The caller can still override it — a product may want the
    // revision's own save time there instead.
    const statusHint =
      savedHint ?? (isViewing && currentVersion ? `Viewing ${formatVersion(currentVersion.number)}` : undefined);

    const cardStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      width: '100%',
      borderRadius: len(radius) ?? `${radiusToken.m}px`,
      border: `1px solid ${border}`,
      backgroundColor: background ?? color.main.white,
      overflow: 'hidden',
      fontFamily: typography.fontFamily.base,
    };

    const defaultField = () => (
      <CustomPromptField
        ref={fieldRef}
        value={text}
        onChange={commitText}
        minHeight={fieldHeight}
        radius={0}
        // The card's own border and the strip's divider already draw every
        // edge around the field; its border would double them.
        borderWidth={0}
        disabled={saving}
        readOnly={isViewing}
      />
    );

    const defaultVariables = () => (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          boxSizing: 'border-box',
          padding: 8,
          borderTop: `1px solid ${border}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing.s }}>
          <button
            type="button"
            onClick={() => setVariablesOpen((open) => !open)}
            aria-expanded={variablesOpen}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: 0,
              border: 'none',
              background: 'transparent',
              color: color.navbar.text,
              ...typography.textStyle.mMedium,
              cursor: 'pointer',
              appearance: 'none',
            }}
          >
            <span
              aria-hidden
              style={{
                display: 'flex',
                transform: variablesOpen ? undefined : 'rotate(-90deg)',
                transition: 'transform 120ms ease',
              }}
            >
              <Icon icon={IconDropdownArrowDown} size={12} />
            </span>
            Insert Variables
          </button>
          {variablesHint && (
            <span style={{ ...typography.textStyle.sRegular, color: color.navbar.text, opacity: 0.7 }}>
              {variablesHint}
            </span>
          )}
        </div>

        {variablesOpen && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: prompt.variable.gap }}>
            {variables.map((variable) => (
              <PromptVariable
                key={variable.name}
                name={variable.name}
                description={variable.description}
                example={variable.example}
                onInsert={insert}
              />
            ))}
          </div>
        )}
      </div>
    );

    const defaultFooter = () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          boxSizing: 'border-box',
          padding: spacing.m,
          borderTop: `1px solid ${border}`,
          flexWrap: 'wrap',
        }}
      >
        <input
          value={label}
          placeholder={versionLabelPlaceholder}
          onChange={(event) => commitLabel(event.target.value)}
          style={{
            flex: '1 1 200px',
            minWidth: 0,
            boxSizing: 'border-box',
            height: prompt.version.size,
            padding: `0 ${prompt.version.paddingX}px`,
            borderRadius: prompt.version.radius,
            border: `1px solid ${border}`,
            backgroundColor: color.main.white,
            color: color.main.black,
            fontFamily: typography.fontFamily.base,
            fontSize: typography.fontSize.m,
            letterSpacing: typography.letterSpacing.m,
            outline: 'none',
          }}
        />

        <VersionNumber
          versions={versions}
          value={currentVersion?.id}
          active
          onSelect={(version) => {
            baseline.current = text;
            setDirty(false);
            onVersionChange?.(version);
          }}
          onRestore={onVersionRestore}
          onDelete={onVersionDelete}
        />

        {isViewing ? (
          <>
            <Button
              size="medium"
              startIcon={<Icon icon={IconLeftArrow} size={16} />}
              onClick={onBack}
            >
              Back
            </Button>
            <Button
              variant="secondary"
              size="medium"
              startIcon={<Icon icon={IconRestoreArrow} size={16} />}
              onClick={onRestore}
            >
              Restore
            </Button>
          </>
        ) : (
          <>
            <Button
              size="medium"
              disabled={!dirty || saving}
              loading={saving}
              startIcon={<Icon icon={IconCheck} size={16} />}
              onClick={() => {
                baseline.current = text;
                setDirty(false);
                onSave?.({ value: text, label });
              }}
            >
              Save
            </Button>

            <Button
              variant="secondary"
              size="medium"
              disabled={!dirty || saving}
              startIcon={<Icon icon={IconXClose} size={16} />}
              onClick={() => {
                commitText(baseline.current);
                onCancel?.();
              }}
            >
              Cancel
            </Button>
          </>
        )}

        {/* Reset belongs to the current revision. While an older one is open
            there is nothing to reset, so the button is dropped rather than
            greyed — a disabled control still asks to be read. */}
        {onReset && !isViewing && (
          <Button
            variant="secondary"
            tone="danger"
            size="medium"
            disabled={saving}
            startIcon={<Icon icon={IconTryAgain} size={16} />}
            onClick={onReset}
          >
            Reset
          </Button>
        )}

        {statusHint && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              ...typography.textStyle.sRegular,
              color: color.navbar.text,
              opacity: 0.7,
              whiteSpace: 'nowrap',
            }}
          >
            <Icon icon={IconLastActivity} size={14} />
            {statusHint}
          </span>
        )}
      </div>
    );

    return (
      <div ref={ref} style={cardStyle}>
        {renderField
          ? renderField({
              value: text,
              onChange: commitText,
              readOnly: isViewing,
              ref: fieldRef,
              defaultRender: defaultField,
            })
          : defaultField()}

        {/* Figma drops the strip entirely while viewing — there is nothing to
            insert into a read-only prompt. */}
        {!isViewing &&
          (renderVariables
            ? renderVariables({ variables, insert, defaultRender: defaultVariables })
            : defaultVariables())}

        {renderFooter
          ? renderFooter({ dirty, version: currentVersion, defaultRender: defaultFooter })
          : defaultFooter()}
      </div>
    );
  },
);

