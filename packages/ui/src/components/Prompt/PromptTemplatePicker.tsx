import { borderWidth, color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../../icons/Icon.js';
import { IconLeftArrow } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { CustomPromptField } from './CustomPromptField.js';
import { promptBlanks } from './promptSaveState.js';

const { promptSetup } = component;
const { textStyle } = typography;

/** A ready prompt a team can start from. */
export type PromptTemplate = {
  id: string;
  /** Short name on the tile — "Agency", "Solo developer". */
  name: string;
  /** Who it is for, in one line, under the name. */
  description: string;
  /** The prompt itself. `[blanks]` mark what only the team can fill in. */
  body: string;
};

export type PromptTemplatePickerProps = {
  templates: PromptTemplate[];

  /** The template being previewed. `null` shows the tiles. Controlled. */
  selectedId?: string | null;
  /** Initial preview when uncontrolled. */
  defaultSelectedId?: string | null;
  onSelectedChange?: (id: string | null) => void;

  /**
   * The tile drawn in its hover state. Tracks the pointer on its own; set it
   * to draw the hover state as a still.
   */
  defaultHighlightedId?: string | null;

  /** The template currently in the field, marked with a tick on its tile. */
  appliedId?: string | null;

  /** "Use this template" on the preview. */
  onApply?: (template: PromptTemplate) => void;
  /**
   * The "Write my own" tile. Omitted when not supplied — a picker that is not
   * standing in for an empty field has nothing to go back to.
   */
  onWriteOwn?: () => void;

  /**
   * Whether using a template will replace text already written. Adds a line
   * to the preview saying so.
   */
  replaces?: boolean;

  /** One tile per row, for a phone. */
  narrow?: boolean;

  /** The line above the tiles. */
  intro?: ReactNode;
  writeOwnLabel?: ReactNode;
  writeOwnDescription?: ReactNode;
};

/**
 * Five ready prompts, drawn as tiles, with a preview before any of them
 * touches the field — BF-4111, proposal 1.
 *
 * Tiles are the default state: name, who it is for, and "Preview →" on hover.
 * Picking one swaps the tiles for a read-only preview that lists the blanks
 * the team will fill in, with Back and "Use this template". Using it is the
 * caller's move: `PromptSetup` fills the field and hides the picker.
 *
 * On its own rather than inside `PromptSetup`, so another surface can offer
 * templates the same way (BF-4113 reuses it for presets).
 */
export const PromptTemplatePicker = forwardRef<HTMLDivElement, PromptTemplatePickerProps>(
  function PromptTemplatePicker(
    {
      templates,
      selectedId,
      defaultSelectedId = null,
      onSelectedChange,
      defaultHighlightedId = null,
      appliedId = null,
      onApply,
      onWriteOwn,
      replaces = false,
      narrow = false,
      intro = 'Start from a prompt that gets replies, then make it yours. You can edit every word.',
      writeOwnLabel = 'Write my own',
      writeOwnDescription = 'An empty field, with the guide beside it.',
    },
    ref,
  ) {
    const [ownSelected, setOwnSelected] = useState<string | null>(defaultSelectedId);
    const [highlighted, setHighlighted] = useState<string | null>(defaultHighlightedId);
    const current = selectedId !== undefined ? selectedId : ownSelected;
    const select = (id: string | null) => {
      if (selectedId === undefined) setOwnSelected(id);
      onSelectedChange?.(id);
    };
    const selected = templates.find((template) => template.id === current);

    const panel: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      gap: promptSetup.picker.gap,
      boxSizing: 'border-box',
      width: '100%',
      padding: promptSetup.picker.padding,
      borderRadius: promptSetup.picker.radius,
      border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
      backgroundColor: color.main.white,
      fontFamily: typography.fontFamily.base,
    };

    const link: CSSProperties = {
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
    };

    if (selected) {
      const blanks = promptBlanks(selected.body);
      return (
        <div ref={ref} style={panel}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: promptSetup.headGap,
              flexWrap: 'wrap',
            }}
          >
            <button type="button" onClick={() => select(null)} style={link}>
              <Icon icon={IconLeftArrow} size={promptSetup.picker.linkIconSize} /> All templates
            </button>
            <span
              style={{
                ...textStyle.mSemibold,
                color: color.navbar.text2,
                flex: 1,
                textAlign: 'right',
              }}
            >
              {selected.name}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: promptSetup.headGap }}>
            <CustomPromptField
              value={selected.body}
              readOnly
              aria-label={`${selected.name} template`}
              minHeight={narrow ? promptSetup.narrowPreviewMinHeight : promptSetup.previewMinHeight}
            />
            {blanks.length > 0 && (
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>
                You fill in {blanks.length}: {blanks.join(', ')}
              </span>
            )}
            {replaces && (
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>
                Using it replaces what you have written.
              </span>
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: promptSetup.headGap }}>
            <Button variant="secondary" size="medium" onClick={() => select(null)}>
              Back
            </Button>
            <Button
              size="medium"
              onClick={() => {
                select(null);
                onApply?.(selected);
              }}
            >
              Use this template
            </Button>
          </div>
        </div>
      );
    }

    const tile = (hover: boolean, dashed = false): CSSProperties => ({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: dashed ? 'center' : 'flex-start',
      gap: promptSetup.template.gap,
      boxSizing: 'border-box',
      width: '100%',
      padding: promptSetup.template.padding,
      textAlign: 'left',
      borderRadius: promptSetup.template.radius,
      border: `${borderWidth.thin}px ${dashed ? 'dashed' : 'solid'} ${
        hover ? color.main.brand : color.navbar.hover
      }`,
      backgroundColor: hover ? color.main.background : color.main.white,
      cursor: 'pointer',
      fontFamily: typography.fontFamily.base,
    });

    return (
      <div ref={ref} style={panel}>
        {intro && (
          <span style={{ ...textStyle.sRegular, color: color.main.description }}>{intro}</span>
        )}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${
              narrow ? promptSetup.picker.narrowColumns : promptSetup.picker.columns
            }, minmax(0, 1fr))`,
            gap: promptSetup.picker.cardGap,
          }}
        >
          {templates.map((template) => {
            const hover = highlighted === template.id;
            return (
              <button
                key={template.id}
                type="button"
                onMouseEnter={() => setHighlighted(template.id)}
                onMouseLeave={() => setHighlighted(null)}
                onFocus={() => setHighlighted(template.id)}
                onBlur={() => setHighlighted(null)}
                onClick={() => select(template.id)}
                style={tile(hover)}
              >
                <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
                  {template.name}
                  {template.id === appliedId && (
                    <span style={{ color: color.status.success.main }}> ✓</span>
                  )}
                </span>
                <span style={{ ...textStyle.sRegular, color: color.main.description }}>
                  {template.description}
                </span>
                {/* Kept in the flow and only shown on hover, so a tile does
                    not grow under the pointer and push its row about. */}
                <span
                  style={{
                    ...textStyle.sMedium,
                    color: color.main.brand,
                    visibility: hover ? 'visible' : 'hidden',
                  }}
                >
                  Preview →
                </span>
              </button>
            );
          })}
          {onWriteOwn && (
            <button type="button" onClick={onWriteOwn} style={tile(false, true)}>
              <span style={{ ...textStyle.mMedium, color: color.navbar.text2 }}>
                {writeOwnLabel}
              </span>
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>
                {writeOwnDescription}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  },
);
