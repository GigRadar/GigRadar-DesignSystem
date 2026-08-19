import { color, component, shadow, textStyle } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCheck,
  IconNotesDocumentStroke,
  IconRoom2peopleClientStroke,
  IconStageTripleLine,
} from '../../icons/defs.js';
import type { IconDef } from '../../icons/defs.js';

const { filterChat } = component.middle;

/** One kind of message the thread can hide. */
export type ChatFilter = {
  /** Stable key, and what `onChange` reports. */
  name: string;
  /** The row's label — "Custom events", "Room events". */
  label: string;
  /** The glyph in the tinted square. */
  icon: IconDef;
  /** The square's fill. Figma tints one per kind. */
  tint?: string;
  /** The glyph's color inside the square. */
  iconColor?: string;
};

/** Per-instance overrides for the popover's own metrics. */
export type FilterChatStyleProps = {
  width?: CssLength;
  radius?: CssLength;
  padding?: CssLength;
  background?: string;
  /** The drop shadow. Set to `'none'` to draw the panel inline. */
  boxShadow?: string;
};

export type FilterChatProps = {
  /** The filters, in the order they are listed. */
  filters: ChatFilter[];
  /**
   * Which filters are showing, by name. Controlled — pass `onChange` with it.
   * Uncontrolled, every filter starts on, which is Figma's "Un-hide (Default)".
   */
  value?: string[];
  defaultValue?: string[];
  onChange?: (shown: string[]) => void;
  /** The band's leading label. */
  title?: string;
} & FilterChatStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'defaultValue' | 'onChange'>;

/**
 * The filter-chat popover — which kinds of message the thread shows.
 *
 * Figma: node 4486:31137, drawn in two states. They are not variants: "Hide" is
 * the same panel with nothing ticked, so the component takes the selection and
 * the two drawings fall out of it.
 *
 * The trailing action toggles everything, and reads "Hide all" or "Show all"
 * depending on which way that would move — with a mixed selection, the useful
 * action is to clear the rest, so it offers "Hide all".
 */
export const FilterChat = forwardRef<HTMLDivElement, FilterChatProps>(function FilterChat(
  {
    filters,
    value,
    defaultValue,
    onChange,
    title = 'Show in chat',
    width,
    radius,
    padding,
    background,
    boxShadow,
    ...rest
  },
  ref,
) {
  // Uncontrolled, everything starts on — the resting panel hides nothing.
  const [uncontrolled, setUncontrolled] = useState<string[]>(
    defaultValue ?? filters.map((filter) => filter.name),
  );
  const shown = value ?? uncontrolled;

  const commit = (next: string[]) => {
    if (value === undefined) setUncontrolled(next);
    onChange?.(next);
  };

  const allShown = filters.length > 0 && filters.every((filter) => shown.includes(filter.name));

  return (
    <div
      ref={ref}
      role="group"
      aria-label={title}
      style={{
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        width: len(width) ?? filterChat.width,
        padding: len(padding) ?? filterChat.padding,
        borderRadius: len(radius) ?? filterChat.radius,
        backgroundColor: background ?? color.main.white,
        boxShadow: boxShadow ?? shadow.popup,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: filterChat.headerPadding,
        }}
      >
        <span style={{ ...textStyle.sRegular, color: color.navbar.text }}>{title}</span>
        <button
          type="button"
          onClick={() => commit(allShown ? [] : filters.map((filter) => filter.name))}
          style={{
            ...textStyle.sRegular,
            padding: 0,
            border: 'none',
            background: 'transparent',
            color: color.badge.foreground,
            cursor: 'pointer',
          }}
        >
          {allShown ? 'Hide all' : 'Show all'}
        </button>
      </div>
      {filters.map((filter) => {
        const on = shown.includes(filter.name);

        return (
          <button
            key={filter.name}
            type="button"
            role="switch"
            aria-checked={on}
            onClick={() =>
              commit(
                on
                  ? shown.filter((name) => name !== filter.name)
                  : [...shown, filter.name],
              )
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: filterChat.rowGap,
              width: '100%',
              boxSizing: 'border-box',
              padding: filterChat.rowPadding,
              border: 'none',
              borderRadius: filterChat.rowRadius,
              background: 'transparent',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: filterChat.markSize,
                height: filterChat.markSize,
                borderRadius: filterChat.markRadius,
                backgroundColor: filter.tint ?? color.badge.background,
              }}
            >
              <Icon
                icon={filter.icon}
                size={filterChat.markIconSize}
                color={filter.iconColor ?? color.badge.foreground}
              />
            </span>
            <span style={{ ...textStyle.mRegular, flex: 1, minWidth: 0, color: color.main.black }}>
              {filter.label}
            </span>
            {/* The tick is drawn rather than a Checkbox: it is a circle here,
                and the system's Checkbox is square by design. */}
            <span
              aria-hidden
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxSizing: 'border-box',
                width: filterChat.tickSize,
                height: filterChat.tickSize,
                borderRadius: filterChat.tickRadius,
                border: on
                  ? 'none'
                  : `${filterChat.tickBorderWidth}px solid ${color.badge.foreground}`,
                backgroundColor: on ? color.badge.foreground : 'transparent',
              }}
            >
              {on && (
                <Icon icon={IconCheck} size={filterChat.tickIconSize} color={color.main.white} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
});

/**
 * The three filters Figma draws, with the tints it gives them.
 *
 * Exported as a default rather than baked into the component: the set of
 * filterable kinds is the product's, and a screen with a fourth kind should be
 * able to pass its own list.
 */
export const defaultChatFilters: ChatFilter[] = [
  {
    name: 'customEvents',
    label: 'Custom events',
    icon: IconStageTripleLine,
    tint: color.badge.background,
    iconColor: color.badge.foreground,
  },
  {
    name: 'roomEvents',
    label: 'Room events',
    icon: IconRoom2peopleClientStroke,
    tint: color.navbar.hover,
    iconColor: color.navbar.text,
  },
  {
    name: 'notesAndAiReplies',
    label: 'Notes & AI Replies',
    icon: IconNotesDocumentStroke,
    // Figma tints this one from the Laziza ramp — the color the AI features
    // carry elsewhere in the product.
    tint: color.accent.laziza.backgroundSoft,
    iconColor: color.accent.laziza.main,
  },
];
