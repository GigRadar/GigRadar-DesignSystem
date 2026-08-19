import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconDoubleCheckRead, IconSearch, IconXClose } from '../../icons/defs.js';
import type { IconDef } from '../../icons/defs.js';

const { inbox } = component;
const { search, chip } = inbox;

/** Per-instance overrides for the search field's own metrics. */
export type InboxSearchFieldStyleProps = {
  height?: CssLength;
  radius?: CssLength;
  /** Fill. */
  background?: string;
  /** Border color while focused. */
  borderColor?: string;
  /** The text and placeholder color. */
  textColor?: string;
};

export type InboxSearchFieldProps = {
  /** The query. Controlled. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Placeholder. */
  placeholder?: string;
  /**
   * Collapses the field to a circular button — the layout the narrow column
   * falls back to when the controls beside it need the room.
   * @default false
   */
  collapsed?: boolean;
  /** Called when the collapsed button is clicked. */
  onExpand?: () => void;
  /** Reports focus, so the panel above can open with the field. */
  onFocusChange?: (focused: boolean) => void;
} & InboxSearchFieldStyleProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'value' | 'onChange' | 'size'>;

/**
 * The room search field.
 *
 * Figma: node 46:1389 — Default, Hover, Clicked, Search, and Collapse.
 *
 * A plain `<input>` rather than a button that swaps in a field: the panel it
 * opens is a filter surface, and typing has to keep working while it is open.
 */
export const InboxSearchField = forwardRef<HTMLInputElement, InboxSearchFieldProps>(
  function InboxSearchField(
    {
      value,
      defaultValue = '',
      onValueChange,
      placeholder = 'Search or filter room...',
      collapsed = false,
      onExpand,
      onFocusChange,
      height,
      radius,
      background,
      borderColor,
      textColor,
      onFocus,
      onBlur,
      ...rest
    },
    ref,
  ) {
    const [uncontrolled, setUncontrolled] = useState(defaultValue);
    const [focused, setFocused] = useState(false);
    const query = value ?? uncontrolled;

    if (collapsed) {
      return (
        <button
          type="button"
          aria-label="Search rooms"
          onClick={onExpand}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: len(height) ?? search.height,
            height: len(height) ?? search.height,
            padding: search.collapsedPadding,
            border: 'none',
            borderRadius: '50%',
            backgroundColor: background ?? color.main.backgroundAlt,
            cursor: 'pointer',
          }}
        >
          <Icon icon={IconSearch} size={search.iconSize} color={color.navbar.text} />
        </button>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: search.innerGap,
          flex: 1,
          minWidth: 0,
          boxSizing: 'border-box',
          height: len(height) ?? search.height,
          paddingLeft: search.paddingLeft,
          paddingRight: search.paddingRight,
          borderRadius: len(radius) ?? search.radius,
          backgroundColor: background ?? color.main.backgroundAlt,
          border: `${borderWidth.thin}px solid ${
            focused ? borderColor ?? color.badge.foreground : 'transparent'
          }`,
        }}
      >
        <Icon icon={IconSearch} size={search.iconSize} color={color.navbar.text} />
        <input
          ref={ref}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(event) => {
            if (value === undefined) setUncontrolled(event.target.value);
            onValueChange?.(event.target.value);
          }}
          onFocus={(event) => {
            setFocused(true);
            onFocusChange?.(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onFocusChange?.(false);
            onBlur?.(event);
          }}
          style={{
            ...textStyle.mRegular,
            flex: 1,
            minWidth: 0,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: textColor ?? color.main.black,
          }}
          {...rest}
        />
        {/* The clear button only appears once there is something to clear, so
            the resting field stays as quiet as Figma draws it. */}
        {query.length > 0 && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              if (value === undefined) setUncontrolled('');
              onValueChange?.('');
            }}
            style={{
              display: 'inline-flex',
              padding: 0,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
            }}
          >
            <Icon icon={IconXClose} size={search.clearIconSize} color={color.navbar.text} />
          </button>
        )}
      </div>
    );
  },
);

/** Per-instance overrides for the mark-as-read control. */
export type MarkAsReadButtonStyleProps = {
  height?: CssLength;
  radius?: CssLength;
  /**
   * Leading inset. Ignored without a label — an icon-only button is a circle,
   * and its inset follows from `height` rather than being set.
   */
  paddingX?: CssLength;
  gap?: CssLength;
  background?: string;
  textColor?: string;
};

export type MarkAsReadButtonProps = {
  /**
   * Whether the control is armed — the state where the list is in selection
   * mode. Figma calls it "Clicked" and fills the pill blue.
   * @default false
   */
  active?: boolean;
  /** Draws the "Mark as read" label beside the glyph. */
  label?: ReactNode;
  /** Whether the button can be used — false while nothing is selected. */
  disabled?: boolean;
} & MarkAsReadButtonStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * The mark-as-read control beside the search field.
 *
 * Figma: node 3980:25204. Glyph-only in the resting row; the label appears in
 * the selection bar below, where there is room for it.
 */
export const MarkAsReadButton = forwardRef<HTMLButtonElement, MarkAsReadButtonProps>(
  function MarkAsReadButton(
    {
      active = false,
      label,
      disabled = false,
      height,
      radius,
      paddingX,
      gap,
      background,
      textColor,
      ...rest
    },
    ref,
  ) {
    const tone = textColor ?? (active ? color.main.white : color.navbar.text);
    // Icon-only, the button is a circle: square it off at `height` and let the
    // glyph centre itself, rather than padding a pill until it happens to look
    // round. Labelled, it grows to fit and the insets do the work.
    const bare = label == null;
    const size = len(height) ?? `${search.height}px`;

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        disabled={disabled}
        aria-label={bare ? 'Mark as read' : undefined}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          gap: bare ? undefined : len(gap) ?? search.actionGap,
          height: size,
          width: bare ? size : undefined,
          paddingLeft: bare ? 0 : len(paddingX) ?? search.actionPaddingX,
          paddingRight: bare ? 0 : search.actionPaddingRight,
          border: 'none',
          borderRadius: len(radius) ?? search.actionRadius,
          backgroundColor:
            background ?? (active ? color.badge.foreground : color.main.backgroundAlt),
          cursor: disabled ? 'default' : 'pointer',
          opacity: disabled ? search.disabledOpacity : 1,
        }}
        {...rest}
      >
        {label != null && (
          <span style={{ ...textStyle.mRegular, color: tone, opacity: active ? 1 : inbox.mutedOpacity }}>
            {label}
          </span>
        )}
        <Icon icon={IconDoubleCheckRead} size={search.iconSize} color={tone} />
      </button>
    );
  },
);

/** Per-instance overrides for a filter chip. */
export type FilterChipStyleProps = {
  height?: CssLength;
  radius?: CssLength;
  paddingX?: CssLength;
  gap?: CssLength;
  background?: string;
  borderColor?: string;
  textColor?: string;
};

export type FilterChipProps = {
  /** The chip's label. */
  children: ReactNode;
  /** A glyph before the label — which filter this is. */
  icon?: IconDef;
  /**
   * Whether the filter is applied. Selected chips take the brand tint; that is
   * the difference between "this filter exists" and "this filter is on".
   * @default false
   */
  selected?: boolean;
  /**
   * Grays the chip out — a preset that cannot apply because another filter
   * already excludes it.
   * @default false
   */
  disabled?: boolean;
  /** Draws a remove affordance and calls this when it is used. */
  onRemove?: () => void;
} & FilterChipStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style' | 'children'>;

/**
 * A filter chip — one applied filter, or one date preset.
 *
 * Figma: date preset at node 4654:39288, applied filter at 4685:5278. The same
 * pill in both places, because they are the same thing at different moments:
 * a preset is a filter you have not applied yet.
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(function FilterChip(
  {
    children,
    icon,
    selected = false,
    disabled = false,
    onRemove,
    height,
    radius,
    paddingX,
    gap,
    background,
    borderColor,
    textColor,
    ...rest
  },
  ref,
) {
  const tone = textColor ?? (disabled ? color.navbar.text : selected ? color.badge.foreground : color.navbar.text2);
  const fill = background ?? (disabled ? color.navbar.hover : selected ? color.badge.background : color.main.white);
  const edge = borderColor ?? (selected ? color.badge.foreground : color.navbar.hover);

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        gap: len(gap) ?? chip.gap,
        height: len(height) ?? chip.height,
        paddingLeft: len(paddingX) ?? chip.paddingX,
        paddingRight: len(paddingX) ?? chip.paddingX,
        borderRadius: len(radius) ?? chip.radius,
        border: `${borderWidth.thin}px solid ${edge}`,
        backgroundColor: fill,
        cursor: disabled ? 'default' : 'pointer',
      }}
      {...rest}
    >
      {icon && <Icon icon={icon} size={chip.iconSize} color={tone} />}
      <span style={{ ...textStyle.sMedium, color: tone, whiteSpace: 'nowrap' }}>{children}</span>
      {/* Rendered as a span, not a nested button: a button inside a button is
          invalid, and the chip's own click already carries the toggle. The
          remove handler stops propagation so the two do not both fire. */}
      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          aria-label="Remove filter"
          onClick={(event) => {
            event.stopPropagation();
            onRemove();
          }}
          style={{ display: 'inline-flex', cursor: 'pointer' }}
        >
          <Icon icon={IconXClose} size={chip.iconSize} color={tone} />
        </span>
      )}
    </button>
  );
});
