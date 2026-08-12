import { color, component, typography } from '@gigradar/theme';
import { forwardRef, useRef, type CSSProperties, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconCheck, IconPlus, IconPresetDocumentFill, IconTryAgain, IconXClose } from '../../icons/defs.js';
import type { IconDef } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { MentionPreset } from './MentionPreset.js';
import { useScrollbar } from '../Scrollbar/Scrollbar.js';

const { mentionPreset } = component;

/** One preset in the list. */
export type MentionPresetItem = {
  /** Stable identity. Used as the React key and echoed back by callbacks. */
  id: string;
  /** The preset's name — what the writer types after `@`. */
  title: string;
  /** What it inserts, and when to reach for it. */
  description?: string;
  /** Characters used, for the counter. Paired with the list's `characterMax`. */
  characterCount?: number;
};

/** What one row gets when a caller replaces its markup. */
export type MentionPresetRenderProps = WithDefaultRender & {
  item: MentionPresetItem;
  /** Position in the list, 1-based. */
  priority: number;
  /** Whether this row is the one being edited. */
  active: boolean;
};

/** What the empty state gets when a caller replaces it. */
export type MentionPresetEmptyRenderProps = WithDefaultRender;

/** What the footer gets when a caller replaces it. */
export type MentionPresetFooterRenderProps = WithDefaultRender & {
  /** Whether anything has changed since the last save. */
  dirty: boolean;
};

/** Per-instance overrides for the list's own metrics. */
export type MentionPresetListStyleProps = {
  padding?: CssLength;
  gap?: CssLength;
  /** Height before the list scrolls. */
  maxHeight?: CssLength;
  background?: string;
};

export type MentionPresetListProps = {
  /** The presets, in priority order — the first shows first in the picker. */
  items?: MentionPresetItem[];
  /** Id of the row being edited. */
  activeId?: string;

  onMoveUp?: (item: MentionPresetItem, index: number) => void;
  onMoveDown?: (item: MentionPresetItem, index: number) => void;
  onDelete?: (item: MentionPresetItem, index: number) => void;

  /** The character cap every row measures against. */
  characterMax?: number;

  /** Heading of the empty state. */
  emptyTitle?: ReactNode;
  /** The line under it. */
  emptyDescription?: ReactNode;
  /** The glyph in the empty state's circle. */
  emptyIcon?: IconDef;

  /** Adds a preset. The button is omitted when absent. */
  onAdd?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onReset?: () => void;
  /**
   * Whether the list has unsaved edits.
   *
   * Gates Save and Cancel. Controlled, because the list does not own the rows
   * — a caller reordering or editing them is what makes it dirty.
   */
  dirty?: boolean;
  /** Puts Save in its loading state and blocks the other controls. */
  saving?: boolean;

  /** Replaces one row. Call `defaultRender()` to decorate it. */
  renderItem?: RenderProp<MentionPresetRenderProps>;
  /** Replaces the empty state. */
  renderEmpty?: RenderProp<MentionPresetEmptyRenderProps>;
  /** Replaces the footer row. */
  renderFooter?: RenderProp<MentionPresetFooterRenderProps>;
} & MentionPresetListStyleProps;

/**
 * The list of mention presets, in priority order.
 *
 * Figma: node 3950:510, with the two states at 3948:27566.
 *
 * Scrolls past `maxHeight` rather than growing without limit — the list sits
 * inside a settings screen with sections below it, so an unbounded list would
 * push them off the page. The scrollbar is the design system's: `scrollbar-width`
 * for Firefox and the WebKit pseudo-elements elsewhere, both reading the
 * `scrollbar` tokens, so it matches the prompt field's bar rather than the
 * browser default.
 *
 * The empty state is a real state, not a fallback — Figma draws it at the same
 * height as a filled list so the section does not jump when the first preset
 * is added.
 */
export const MentionPresetList = forwardRef<HTMLDivElement, MentionPresetListProps>(
  function MentionPresetList(
    {
      items = [],
      activeId,
      onMoveUp,
      onMoveDown,
      onDelete,
      characterMax,
      emptyTitle = 'No Presets Yet',
      emptyDescription = 'Create your first preset to quickly trigger using @mention in any chat.',
      emptyIcon = IconPresetDocumentFill,
      onAdd,
      onSave,
      onCancel,
      onReset,
      dirty = false,
      saving = false,
      renderItem,
      renderEmpty,
      renderFooter,
      padding,
      gap,
      maxHeight,
      background,
    },
    ref,
  ) {
    const bar = useScrollbar();

    const isEmpty = items.length === 0;

    const scrollStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      // An empty list centres its message; a filled one stacks from the top.
      alignItems: isEmpty ? 'center' : 'flex-start',
      justifyContent: isEmpty ? 'center' : 'flex-start',
      gap: len(gap) ?? `${mentionPreset.list.gap}px`,
      boxSizing: 'border-box',
      width: '100%',
      padding: len(padding) ?? mentionPreset.list.padding,
      // A fixed height when empty, a cap when filled — so the section holds its
      // place either way.
      height: isEmpty ? (len(maxHeight) ?? mentionPreset.list.maxHeight) : undefined,
      maxHeight: len(maxHeight) ?? mentionPreset.list.maxHeight,
      overflowY: isEmpty ? 'hidden' : 'auto',
      backgroundColor: 'transparent',
      ...bar.style,
    };

    /**
     * The card around the scroll area and its footer.
     *
     * Figma draws the list as a bordered white card (node 3950:510) — the rows
     * are already bordered, so without this outer edge a filled list reads as
     * loose cards on the page rather than one control with a save row.
     */
    const cardStyle: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      width: '100%',
      borderRadius: mentionPreset.list.radius,
      border: `1px solid ${color.navbar.hover}`,
      backgroundColor: background ?? color.main.white,
      overflow: 'hidden',
      fontFamily: typography.fontFamily.base,
    };

    const defaultFooter = () => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: mentionPreset.list.footerGap,
          boxSizing: 'border-box',
          padding: mentionPreset.list.footerPadding,
          borderTop: `1px solid ${color.navbar.hover}`,
          flexWrap: 'wrap',
        }}
      >
        {onAdd && (
          <Button
            variant="secondary"
            size="medium"
            disabled={saving}
            startIcon={<Icon icon={IconPlus} size="100%" />}
            onClick={onAdd}
          >
            Add New
          </Button>
        )}
        <Button
          size="medium"
          disabled={!dirty || saving}
          loading={saving}
          startIcon={<Icon icon={IconCheck} size="100%" />}
          onClick={onSave}
        >
          Save
        </Button>
        <Button
          variant="secondary"
          size="medium"
          disabled={!dirty || saving}
          startIcon={<Icon icon={IconXClose} size="100%" />}
          onClick={onCancel}
        >
          Cancel
        </Button>
        {onReset && (
          <Button
            variant="secondary"
            tone="danger"
            size="medium"
            disabled={saving}
            startIcon={<Icon icon={IconTryAgain} size="100%" />}
            onClick={onReset}
          >
            Reset
          </Button>
        )}
      </div>
    );

    const defaultEmpty = () => (
      <>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: mentionPreset.empty.iconContainerSize,
            height: mentionPreset.empty.iconContainerSize,
            borderRadius: '50%',
            backgroundColor: color.main.background,
            color: color.main.brand,
          }}
        >
          <Icon icon={emptyIcon} size={mentionPreset.empty.iconSize} />
        </span>
        <span
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <span style={{ ...typography.textStyle.mMedium, color: color.main.black }}>
            {emptyTitle}
          </span>
          <span style={{ ...typography.textStyle.sRegular, color: color.navbar.text }}>
            {emptyDescription}
          </span>
        </span>
      </>
    );

    return (
      <div ref={ref} style={cardStyle}>
        <div {...bar.props} style={scrollStyle}>
          {bar.styleTag}

        {isEmpty
          ? renderEmpty
            ? renderEmpty({ defaultRender: defaultEmpty })
            : defaultEmpty()
          : items.map((item, index) => {
              const priority = index + 1;
              const active = item.id === activeId;

              const defaultRender = () => (
                <MentionPreset
                  priority={priority}
                  title={item.title}
                  description={item.description}
                  active={active}
                  characterCount={item.characterCount}
                  characterMax={characterMax}
                  onMoveUp={onMoveUp && (() => onMoveUp(item, index))}
                  onMoveDown={onMoveDown && (() => onMoveDown(item, index))}
                  onDelete={onDelete && (() => onDelete(item, index))}
                  // The ends of the list have nowhere to move to. Disabled
                  // rather than hidden, so the row's controls stay in the same
                  // place from first to last.
                  disableMoveUp={index === 0}
                  disableMoveDown={index === items.length - 1}
                />
              );

              return (
                <div key={item.id} style={{ width: '100%' }}>
                  {renderItem
                    ? renderItem({ item, priority, active, defaultRender })
                    : defaultRender()}
                </div>
              );
            })}
        </div>

        {renderFooter ? renderFooter({ dirty, defaultRender: defaultFooter }) : defaultFooter()}
      </div>
    );
  },
);
