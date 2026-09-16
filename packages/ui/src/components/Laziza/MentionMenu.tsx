import { borderWidth, color, component, shadow, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { AuthorBadge } from '../Middle/AuthorBadge.js';

const { laziza } = component;

/** One preset the menu offers. */
export type MentionMenuItem = {
  /** Stable identity, echoed back by `onSelect`. */
  id: string;
  /** The preset's name — what the row reads as. */
  title: string;
  /**
   * The prompt the preset inserts.
   *
   * Drawn under the title, clipped to one line. The whole thing goes into the
   * composer on select, so the clipped tail is not lost — only hidden until the
   * preset is picked.
   */
  prompt?: string;
};

/** Per-instance overrides for the menu's own metrics. */
export type MentionMenuStyleProps = {
  width?: CssLength;
  maxHeight?: CssLength;
  padding?: CssLength;
  radius?: CssLength;
  background?: string;
  borderColor?: string;
};

export type MentionMenuProps = {
  /** The team's saved presets, in the order they were prioritised. */
  items?: MentionMenuItem[];
  /** Which row the pointer or the keyboard is on. */
  activeId?: string;
  onActiveChange?: (id: string) => void;
  /** Fires with the picked preset. The caller fills the composer with it. */
  onSelect?: (item: MentionMenuItem) => void;
  /** The chip every row leads with. Defaults to the Laziza badge. */
  chip?: ReactNode;
  /** Drawn when no preset matches what has been typed. */
  emptyLabel?: ReactNode;
} & MentionMenuStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onSelect'>;

/**
 * The menu `@laziza` opens in the composer.
 *
 * Lists the presets saved in AI Configuration ▸ Mention Presets; picking one
 * fills the composer with that preset's prompt, which the user can edit before
 * sending. This is where presets are used, not where they are written.
 *
 * Deliberately not `MentionPreset`, which is the settings-list row: that one
 * carries move, delete and a priority badge, all of which are about *managing*
 * presets. A menu that offered them would be a settings screen opened over a
 * conversation.
 *
 * The prompt is drawn under the title and clipped to one line. Clipping is the
 * honest cost of putting it in the row at all — the alternative is a hover
 * tooltip, which a keyboard user arrowing down the list never sees.
 */
export const MentionMenu = forwardRef<HTMLDivElement, MentionMenuProps>(function MentionMenu(
  {
    items = [],
    activeId,
    onActiveChange,
    onSelect,
    chip,
    emptyLabel = 'No presets match.',
    width,
    maxHeight,
    padding,
    radius: radiusProp,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  return (
    <div
      ref={ref}
      role="listbox"
      aria-label="Laziza mention presets"
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        width: len(width) ?? laziza.menu.width,
        maxWidth: '100%',
        // The menu opens upward into the thread, so an unbounded one would
        // cover the messages the preset is about.
        maxHeight: len(maxHeight) ?? laziza.menu.maxHeight,
        overflowY: 'auto',
        padding: len(padding) ?? laziza.menu.padding,
        borderRadius: len(radiusProp) ?? laziza.menu.radius,
        border: `${borderWidth.thin}px solid ${borderColor ?? color.navbar.border}`,
        backgroundColor: background ?? color.main.white,
        boxShadow: shadow.base,
      }}
      {...rest}
    >
      {items.length === 0 && (
        <span
          style={{
            ...textStyle.sRegular,
            color: color.main.description,
            padding: `${laziza.menu.row.paddingY}px ${laziza.menu.row.paddingX}px`,
          }}
        >
          {emptyLabel}
        </span>
      )}

      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <div
            key={item.id}
            role="option"
            aria-selected={active}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: laziza.menu.row.gap,
              padding: `${laziza.menu.row.paddingY}px ${laziza.menu.row.paddingX}px`,
              borderRadius: laziza.menu.row.radius,
              cursor: 'pointer',
              backgroundColor: active ? color.navbar.hover : undefined,
            }}
            onMouseEnter={() => onActiveChange?.(item.id)}
            onClick={() => onSelect?.(item)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: laziza.menu.row.gap, minWidth: 0 }}>
              {chip ?? <AuthorBadge kind="ai">Laziza</AuthorBadge>}
              <span style={{ ...textStyle.sRegular, color: color.main.description }}>·</span>
              <span
                style={{
                  ...textStyle.mMedium,
                  color: color.main.black,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.title}
              </span>
            </span>
            {item.prompt != null && (
              <span
                style={{
                  ...textStyle.sRegular,
                  color: color.main.description,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {item.prompt}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});
