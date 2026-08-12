import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconDeleteTrashStroke,
  IconDragDot,
  IconDropdownArrowDown,
  IconDropdownArrowUp,
} from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { ConfirmTooltip } from '../Tooltip/ConfirmTooltip.js';
import type { TooltipPlacement } from '../Tooltip/Tooltip.js';

const { mentionPreset } = component;

/** Per-instance overrides for the row's own metrics. */
export type MentionPresetStyleProps = {
  padding?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  fontSize?: CssLength;
  /** Border when neither active nor hovered. */
  borderColor?: string;
  /** Border when active. */
  activeBorderColor?: string;
};

export type MentionPresetProps = {
  /** Position in the list, 1-based. Drawn in the priority badge. */
  priority: number;
  /** The preset's name — what the writer types after `@`. */
  title: ReactNode;
  /** What the preset inserts, and when to reach for it. */
  description?: ReactNode;
  /**
   * Whether this row is the one being edited.
   *
   * Figma outlines it in brand blue (node 3774:8383). A list has at most one
   * active row, so this marks focus rather than selection.
   */
  active?: boolean;

  /** Moves the preset up one place. Omitted when absent or on the first row. */
  onMoveUp?: () => void;
  /** Moves it down. Omitted when absent or on the last row. */
  onMoveDown?: () => void;
  onDelete?: () => void;
  /**
   * The confirmation shown before deleting.
   *
   * Deleting a preset is irreversible and the button is one of three identical
   * squares in a row, so a mis-click is easy — the confirmation is not
   * optional politeness, it is what makes the row safe to use.
   */
  deleteTitle?: ReactNode;
  deleteDescription?: ReactNode;
  /**
   * Which side the confirmation opens on.
   *
   * `left` by default: the delete button is the last thing in the row, so a
   * card centred under it would hang past the row's right edge and be clipped
   * by the list's scroll area. Opening leftwards puts it over the row's own
   * width, where there is room. It is aligned to the row's top for the same
   * reason — the card is taller than the row, so centring it would push its
   * head above the top of the scroll area.
   */
  deletePlacement?: TooltipPlacement;
  /** Disables the up control — the row is already first. */
  disableMoveUp?: boolean;
  /** Disables the down control — the row is already last. */
  disableMoveDown?: boolean;

  /**
   * Characters used and the cap, drawn in the description's corner.
   *
   * Both or neither: a bare number with nothing to measure against is noise.
   */
  characterCount?: number;
  characterMax?: number;
} & MentionPresetStyleProps;

/**
 * One reusable @-mention snippet.
 *
 * Figma: node 3774:8382, with Active and Not Active variants.
 *
 * The row is an ordering control as much as a list item — a drag handle, the
 * priority number, and a pair of move buttons — because the order is the
 * feature: the top preset shows first in the mention picker. The handle is
 * drawn but inert here; wiring it to a drag library is the app's call, and the
 * move buttons mean the ordering still works by keyboard without one.
 */
export const MentionPreset = forwardRef<HTMLDivElement, MentionPresetProps>(
  function MentionPreset(
    {
      priority,
      title,
      description,
      active = false,
      onMoveUp,
      onMoveDown,
      onDelete,
      deleteTitle = 'Delete this preset?',
      deleteDescription = 'It will stop appearing in the @mention picker. This cannot be undone.',
      deletePlacement = 'left',
      disableMoveUp = false,
      disableMoveDown = false,
      characterCount,
      characterMax,
      padding,
      gap,
      radius,
      fontSize,
      borderColor,
      activeBorderColor,
    },
    ref,
  ) {
    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: len(gap) ?? `${mentionPreset.row.gap}px`,
      boxSizing: 'border-box',
      width: '100%',
      padding: len(padding) ?? mentionPreset.row.padding,
      borderRadius: len(radius) ?? `${mentionPreset.row.radius}px`,
      border: `1px solid ${
        active ? (activeBorderColor ?? color.main.brand) : (borderColor ?? color.navbar.hover)
      }`,
      backgroundColor: color.main.white,
      fontFamily: typography.fontFamily.base,
      transition: 'border-color 120ms ease',
    };

    const showCounter = characterCount !== undefined && characterMax !== undefined;

    return (
      <div ref={ref} style={style}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: mentionPreset.row.gap,
            width: '100%',
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: mentionPreset.row.handleSize,
              height: mentionPreset.row.handleSize,
              // Blue while active, so the handle joins the row's outline rather
              // than reading as a separate control.
              color: active ? color.main.brand : color.navbar.border,
              cursor: 'grab',
            }}
          >
            <Icon icon={IconDragDot} size="100%" />
          </span>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxSizing: 'border-box',
              minWidth: mentionPreset.row.badgeMinWidth,
              alignSelf: 'stretch',
              padding: '2px 4px',
              borderRadius: mentionPreset.description.radius,
              backgroundColor: color.badge.background,
              color: color.badge.foreground,
              ...typography.textStyle.mMedium,
            }}
          >
            {priority}
          </span>

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: '1 1 auto',
              minWidth: 0,
              alignSelf: 'stretch',
              boxSizing: 'border-box',
              padding: `${mentionPreset.description.paddingY}px ${mentionPreset.description.paddingX}px`,
              borderRadius: mentionPreset.description.radius,
              backgroundColor: color.main.background,
              color: color.main.black,
              ...typography.textStyle.mRegular,
              fontSize: len(fontSize) ?? mentionPreset.row.fontSize,
            }}
          >
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title}
            </span>
          </span>

          <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {onMoveUp && (
              <Button
                variant="subtle"
                size="medium"
                paddingX={mentionPreset.row.actionPaddingX}
                aria-label={`Move ${typeof title === 'string' ? title : 'preset'} up`}
                disabled={disableMoveUp}
                startIcon={<Icon icon={IconDropdownArrowUp} size="100%" />}
                onClick={onMoveUp}
              />
            )}
            {onMoveDown && (
              <Button
                variant="subtle"
                size="medium"
                paddingX={mentionPreset.row.actionPaddingX}
                aria-label={`Move ${typeof title === 'string' ? title : 'preset'} down`}
                disabled={disableMoveDown}
                startIcon={<Icon icon={IconDropdownArrowDown} size="100%" />}
                onClick={onMoveDown}
              />
            )}
            {onDelete && (
              <ConfirmTooltip
                title={deleteTitle}
                description={deleteDescription}
                confirmLabel="Delete"
                placement={deletePlacement}
                align="start"
                onConfirm={onDelete}
              >
                <Button
                  variant="secondary"
                  tone="danger"
                  size="medium"
                  paddingX={mentionPreset.row.actionPaddingX}
                  aria-label={`Delete ${typeof title === 'string' ? title : 'preset'}`}
                  startIcon={<Icon icon={IconDeleteTrashStroke} size="100%" />}
                />
              </ConfirmTooltip>
            )}
          </span>
        </div>

        {description && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              boxSizing: 'border-box',
              width: '100%',
              padding: `${mentionPreset.description.paddingY}px ${mentionPreset.description.paddingX}px`,
              borderRadius: mentionPreset.description.radius,
              backgroundColor: color.main.background,
            }}
          >
            <p
              style={{
                ...typography.textStyle.mRegular,
                color: color.navbar.text,
                margin: 0,
                width: '100%',
              }}
            >
              {description}
            </p>
            {showCounter && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: `${mentionPreset.counter.paddingY}px ${mentionPreset.counter.paddingX}px`,
                  borderRadius: mentionPreset.counter.radius,
                  // A 10% wash of the disabled grey, so the counter sits on the
                  // description without introducing a fourth surface color.
                  backgroundColor: 'rgba(165, 166, 168, 0.1)',
                  color: color.disable.text,
                  fontSize: mentionPreset.counter.fontSize,
                  letterSpacing: typography.letterSpacing.s,
                  lineHeight: 1,
                  opacity: 0.7,
                }}
              >
                {characterCount}/{characterMax}
              </span>
            )}
          </div>
        )}
      </div>
    );
  },
);
