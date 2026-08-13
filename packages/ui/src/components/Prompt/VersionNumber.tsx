import { color, component, shadow, typography } from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Button } from '../Button/Button.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconDeleteTrashStroke,
  IconDropdownArrowDown,
  IconRestoreArrow,
} from '../../icons/defs.js';

const { prompt } = component;

/** One saved revision of a prompt. */
export type PromptVersion = {
  /** Stable identity. Used as the React key and echoed back by callbacks. */
  id: string;
  /**
   * The version number the pill shows. A number renders as `v2`; a string
   * passes through, so a scheme like `2.1` or `draft` still works.
   */
  number: number | string;
  /** What changed in this revision. Figma: "Tightened follow-up cadence". */
  label: string;
  /**
   * The line under the label — Figma draws "Saved at 11 Jan 2025 (12:00) by
   * rafaelsamuel".
   *
   * A pre-formatted string rather than a date and an author: the format is a
   * product decision (locale, timezone, whether "by" appears at all) and
   * hard-coding one here would make every app that disagrees fight the
   * component.
   */
  meta?: string;
};

/** Per-instance overrides for the pill's own metrics. */
export type VersionNumberStyleProps = {
  /** Horizontal padding of the pill. */
  paddingX?: CssLength;
  /** Vertical padding of the pill. */
  paddingY?: CssLength;
  /** Corner radius of the pill. */
  radius?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Space between the label and the chevron. */
  gap?: CssLength;
  /** Chevron size. */
  iconSize?: CssLength;
  /** Pill fill when neither active nor hovered. */
  background?: string;
  /** Label color when neither active nor hovered. */
  textColor?: string;
  /** Pill border. */
  borderColor?: string;
};

/** What a row of the dropdown gets, when a caller replaces its markup. */
export type VersionItemRenderProps = WithDefaultRender & {
  version: PromptVersion;
  /** Whether this is the version currently loaded in the field. */
  selected: boolean;
  /** Position in the list, newest first as passed. */
  index: number;
};

export type VersionNumberProps = {
  /** The versions to list, in the order they should appear. */
  versions?: PromptVersion[];
  /** The version the pill shows and the list marks as current. */
  value?: string;
  /** Fires when a row is picked. The menu closes unless `open` is controlled. */
  onSelect?: (version: PromptVersion) => void;
  /**
   * Fires when a row's restore button is pressed. The button is omitted when
   * this is not supplied — a control that cannot do anything should not be
   * drawn.
   */
  onRestore?: (version: PromptVersion) => void;
  /** Fires when a row's delete button is pressed. Omitted when not supplied. */
  onDelete?: (version: PromptVersion) => void;
  /**
   * Forces the dropdown open or closed.
   *
   * Leave it off for the common case: the pill manages its own open state,
   * closes on outside click and on Escape, and reports changes through
   * `onOpenChange`. Pass it only when something outside the pill — a form
   * step, a tour — needs to drive the menu.
   */
  open?: boolean;
  /** Called whenever the pill wants to open or close. */
  onOpenChange?: (open: boolean) => void;
  /** Draws the active (filled blue) palette. The pill's "selected" look. */
  active?: boolean;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
  /**
   * Hides the chevron, leaving the bare `v2` square.
   *
   * Figma's `rIcon` toggle, used where the pill is a static marker in a list
   * row rather than a dropdown trigger.
   *
   * @default true
   */
  chevron?: boolean;
  /** Replaces a row of the dropdown. Call `defaultRender()` to decorate it. */
  renderItem?: RenderProp<VersionItemRenderProps>;
  disabled?: boolean;
} & VersionNumberStyleProps;

/**
 * The version pill — `v2 ⌄` — and the revision list it opens.
 *
 * Figma: node 3770:1031, with the Hover (3804:21454), Active (3770:1033), and
 * Expanded (3804:22300) variants.
 *
 * Figma models Expanded as a fourth state of the same component, so the pill
 * and its menu are one component here rather than a trigger plus a separate
 * popover. That keeps the open state, the selection, and the palette in one
 * place: a caller wires `versions` and `value` and gets the whole control.
 *
 * The pill takes a render prop for its rows — it composes arbitrary version
 * entries, which is where products genuinely differ — while the pill itself
 * does not, per the convention in `internal/render.ts`.
 */
export const VersionNumber = forwardRef<HTMLDivElement, VersionNumberProps>(function VersionNumber(
  {
    versions = [],
    value,
    onSelect,
    onRestore,
    onDelete,
    open,
    onOpenChange,
    active = false,
    hovered,
    chevron = true,
    renderItem,
    disabled = false,
    paddingX,
    paddingY,
    radius,
    fontSize,
    gap,
    iconSize,
    background,
    textColor,
    borderColor,
  },
  ref,
) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const isControlled = open !== undefined;
  const isOpen = (isControlled ? open : uncontrolledOpen) && !disabled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // Outside click and Escape close the menu. Bound only while it is open, so
  // a page holding many pills is not carrying a listener per closed one.
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, setOpen]);

  const current = versions.find((version) => version.id === value) ?? versions[0];

  /**
   * `hovered` pins the hover palette without a pointer, for docs and tests.
   *
   * Button tracks its own hover and offers no override, so this paints the
   * same two values Button would — it cannot reach inside Button to flip its
   * internal flag. Only meaningful on the resting pill: the active one is
   * already filled, and a disabled one does not react.
   */
  const pinHover = (hovered ?? false) && !disabled && !active;

  /**
   * An open pill holds the hover fill even once the pointer leaves it.
   *
   * The menu is a detached surface, so without this the trigger drops back to
   * resting the moment you move toward the list — leaving an open dropdown
   * with nothing on screen tying it to the control that opened it.
   */
  const holdsHoverFill = (pinHover || isOpen) && !disabled && !active;

  return (
    <div
      ref={mergeRefs(ref, rootRef)}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      {/*
        The design system's Button rather than a bare <button>: it already
        carries the hover and pressed palettes, which a hand-rolled pill has to
        reimplement and then keep in step.

        `active` maps onto the filled primary variant; the resting pill onto
        `third`, the variant that fills with the nav hover gray rather than
        tinting its border — which is what Figma draws for this control, and
        what `secondary` does not do.
      */}
      <Button
        variant={active ? 'primary' : 'third'}
        size="medium"
        disabled={disabled}
        paddingX={paddingX ?? prompt.version.paddingX}
        paddingY={paddingY}
        radius={radius ?? prompt.version.radius}
        gap={gap ?? prompt.version.gap}
        fontSize={fontSize ?? prompt.version.fontSize}
        fontWeight={typography.fontWeight.regular}
        background={background ?? (holdsHoverFill ? color.navbar.hover : undefined)}
        textColor={textColor}
        borderColor={borderColor}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setOpen(!isOpen)}
        endIcon={
          chevron ? (
            <Chevron size={len(iconSize) ?? `${prompt.version.iconSize}px`} open={isOpen} />
          ) : undefined
        }
      >
        {formatVersion(current?.number)}
      </Button>

      {isOpen && (
        <div
          role="listbox"
          style={{
            position: 'absolute',
            bottom: `calc(100% + ${prompt.version.menu.gap}px)`,
            left: 0,
            zIndex: 1,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: prompt.version.menu.gap,
            minWidth: prompt.version.menu.minWidth,
            maxHeight: prompt.version.menu.maxHeight,
            overflowY: 'auto',
            padding: prompt.version.menu.padding,
            borderRadius: prompt.version.menu.radius,
            backgroundColor: color.main.white,
            boxShadow: shadow.base,
          }}
        >
          {versions.map((version, index) => {
            const selected = version.id === current?.id;
            const defaultRender = () => (
              <VersionRow
                version={version}
                selected={selected}
                onSelect={() => {
                  onSelect?.(version);
                  if (!isControlled) setOpen(false);
                }}
                onRestore={onRestore && (() => onRestore(version))}
                onDelete={onDelete && (() => onDelete(version))}
              />
            );

            return (
              <div key={version.id}>
                {renderItem
                  ? renderItem({ version, selected, index, defaultRender })
                  : defaultRender()}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

/**
 * `2` becomes `v2`; a string is trusted as already spelled.
 *
 * Exported so the card's "Viewing v1" hint spells a version the same way the
 * pill does, rather than the two drifting apart.
 */
export function formatVersion(number: number | string | undefined): string {
  if (number === undefined) return '—';
  return typeof number === 'number' ? `v${number}` : number;
}

/**
 * One row of the expanded list — the version square, the label and its
 * timestamp, and the restore/delete actions.
 *
 * Figma: node 3804:22191. The selected row takes a brand-blue border and a
 * filled square; the rest take the default border and an outlined square.
 */
function VersionRow({
  version,
  selected,
  onSelect,
  onRestore,
  onDelete,
}: {
  version: PromptVersion;
  selected: boolean;
  onSelect: () => void;
  onRestore?: () => void;
  onDelete?: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  // A pointed-at row takes the brand outline the selected one wears — border
  // only, no fill, so hover and selected read as the same state and the row's
  // label, timestamp, and two icon buttons keep their contrast.
  const highlighted = hovered || selected;

  return (
    <div
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: prompt.version.menu.gap,
        boxSizing: 'border-box',
        padding: prompt.version.menu.itemPadding,
        borderRadius: prompt.version.menu.itemRadius,
        border: `1px solid ${highlighted ? color.main.brand : color.navbar.hover}`,
        backgroundColor: color.main.white,
        cursor: 'pointer',
        transition: 'border-color 120ms ease',
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          width: prompt.version.size,
          height: prompt.version.size,
          borderRadius: prompt.version.radius,
          border: `1px solid ${selected ? 'transparent' : color.navbar.hover}`,
          backgroundColor: selected ? color.main.brand : color.main.white,
          color: selected ? color.main.white : color.navbar.text,
          fontFamily: typography.fontFamily.base,
          fontSize: typography.fontSize.m,
          letterSpacing: typography.letterSpacing.m,
          lineHeight: 1,
        }}
      >
        {formatVersion(version.number)}
      </span>

      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          flex: '1 1 auto',
          minWidth: 0,
        }}
      >
        <span
          style={{
            ...typography.textStyle.mMedium,
            color: color.navbar.textActive,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {version.label}
        </span>
        {version.meta && (
          <span
            style={{
              ...typography.textStyle.sRegular,
              color: color.navbar.text,
              opacity: 0.7,
              padding: '2px 4px',
              borderRadius: prompt.version.radius,
              backgroundColor: color.main.background,
              whiteSpace: 'nowrap',
            }}
          >
            {version.meta}
          </span>
        )}
      </span>

      {(onRestore || onDelete) && (
        <span style={{ display: 'flex', alignItems: 'center', gap: prompt.version.menu.gap, flexShrink: 0 }}>
          {onRestore && (
            <RowAction
              label={`Restore ${formatVersion(version.number)}`}
              onClick={onRestore}
              borderColor={color.navbar.hover}
              iconColor={color.navbar.text}
              icon={<Icon icon={IconRestoreArrow} size={16} />}
            />
          )}
          {onDelete && (
            <RowAction
              label={`Delete ${formatVersion(version.number)}`}
              onClick={onDelete}
              borderColor={color.status.error.background}
              iconColor={color.status.error.main}
              icon={<Icon icon={IconDeleteTrashStroke} size={16} />}
            />
          )}
        </span>
      )}
    </div>
  );
}

/**
 * A square icon button in a version row.
 *
 * Not the design system's Button: Figma draws these as bare 33px squares with
 * no label and a tinted border, which is a different control from a button
 * with an icon slot. Bending Button into this shape would mean zeroing its
 * padding, gap, and label — at which point nothing of Button is left.
 */
function RowAction({
  label,
  onClick,
  icon,
  borderColor,
  iconColor,
}: {
  label: string;
  onClick: () => void;
  icon: ReactNode;
  borderColor: string;
  iconColor: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={(event) => {
        // The whole row selects on click; an action button must not also
        // switch the version out from under what it is acting on.
        event.stopPropagation();
        onClick();
      }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        width: prompt.version.size,
        height: prompt.version.size,
        padding: 0,
        borderRadius: prompt.version.radius,
        border: `1px solid ${borderColor}`,
        backgroundColor: color.main.white,
        color: iconColor,
        cursor: 'pointer',
        appearance: 'none',
      }}
    >
      {icon}
    </button>
  );
}

/**
 * The chevron on the pill, rotating when the menu is open.
 *
 * One icon rather than swapping `IconDropdownArrowDown` for
 * `IconDropdownArrowUp`: rotating keeps the transition, and swapping the
 * element would make the glyph jump between the two states.
 */
function Chevron({ size, open }: { size: string; open: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: 'flex',
        flexShrink: 0,
        transform: open ? 'rotate(180deg)' : undefined,
        transition: 'transform 120ms ease',
      }}
    >
      <Icon icon={IconDropdownArrowDown} size={size} />
    </span>
  );
}

/**
 * Feeds one node to both the forwarded ref and the internal one.
 *
 * The pill needs its own ref for outside-click detection, and a caller may
 * still want the element — neither can give up the ref, so both get it.
 */
function mergeRefs<T>(
  forwarded: React.Ref<T> | undefined,
  local: React.MutableRefObject<T | null>,
) {
  return (node: T | null) => {
    local.current = node;
    if (typeof forwarded === 'function') forwarded(node);
    else if (forwarded) (forwarded as React.MutableRefObject<T | null>).current = node;
  };
}
