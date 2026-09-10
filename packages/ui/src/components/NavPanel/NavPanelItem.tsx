import { color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type CSSProperties, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import type { IconDef } from '../../icons/defs.js';
import { CounterBadge } from '../Badge/CounterBadge.js';

const { navPanel } = component;

/** Per-instance overrides for the entry's own metrics. */
export type NavPanelItemStyleProps = {
  /** Entry width. Fixed so labels of different lengths stay on one axis. */
  width?: CssLength;
  /** The round plate behind the glyph. */
  plateSize?: CssLength;
  /** The glyph inside the plate. */
  iconSize?: CssLength;
  /** Space between the plate and the label. */
  gap?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Plate fill while selected. */
  selectedBackground?: string;
  /** Plate fill while hovered. */
  hoverBackground?: string;
  /** Label colour at rest. */
  textColor?: string;
  /** Label colour while hovered or selected. */
  activeTextColor?: string;
  /** The unread counter's fill. Red by default. */
  counterBackground?: string;
};

export type NavPanelItemProps = {
  /** The product area's name — "Dashboard", "Unified Inbox". */
  label: ReactNode;
  /** The glyph. Every entry has one; it is all a narrow rail has room for. */
  icon: IconDef;
  /**
   * Whether this is the area the user is in.
   *
   * Fills the plate white and darkens the label. Only one entry in a rail is
   * selected, so this marks position rather than a toggle state.
   */
  selected?: boolean;
  /**
   * Unread count, drawn overhanging the plate's top-right.
   *
   * `0` and `undefined` both drop the badge — a counter reading zero is worse
   * than none, since it draws the eye to nothing.
   */
  count?: number;
  /**
   * Dims the entry to a tenth.
   *
   * For the onboarding walkthrough, where every area except the one being
   * explained is faded. Dimmed rather than hidden so the rail keeps its height
   * and the highlighted entry does not move between steps.
   */
  dimmed?: boolean;
  /**
   * What the counter is counting, for a screen reader — "4 unread messages".
   *
   * Without it the badge announces a bare number, which says nothing about
   * what is waiting. Falls back to "{count} unread".
   */
  countLabel?: string;
  /** Called when the entry is pressed. */
  onSelect?: () => void;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
  /**
   * Replaces the icon plate, keeping the label and the counter around it.
   *
   * The payload carries the resolved state, so a replacement can match the
   * plate's fill without re-deriving it from `selected` and `hovered`.
   */
  renderPlate?: RenderProp<NavPlateRenderProps>;
  /**
   * Replaces the unread counter. Not called when there is nothing to count.
   */
  renderCounter?: RenderProp<NavCounterRenderProps>;
} & NavPanelItemStyleProps;

/** What a `renderPlate` function receives — the round icon plate. */
export type NavPlateRenderProps = WithDefaultRender & {
  /** The glyph the plate is drawing. */
  icon: IconDef;
  /** Whether this entry is the current area. */
  selected: boolean;
  /** Whether the pointer is over the entry. */
  hovered: boolean;
  /** The plate's resolved fill, or undefined when it is transparent. */
  background?: string;
};

/** What a `renderCounter` function receives — the unread badge. */
export type NavCounterRenderProps = WithDefaultRender & {
  /** How many unread items. Never zero — the badge is dropped then. */
  count: number;
};

/**
 * One entry in the left navigation rail — Figma node 2712:30773.
 *
 * A round icon plate above a label, in three states: at rest the plate is
 * transparent and the label is the nav grey; hovered, the plate takes the nav
 * hover wash; selected, it fills white and the label darkens.
 *
 * The plate is what carries the state, not the label. That is deliberate — the
 * rail is scanned by glyph, and moving the emphasis to a 32px disc reads at a
 * glance where a colour change on 12px text does not.
 *
 * Not a `Button`: this is chrome that reports position, and the design gives it
 * a shape the button family does not have. It still renders as a `<button>` so
 * the keyboard and screen reader treat it as the control it is.
 */
export const NavPanelItem = forwardRef<HTMLButtonElement, NavPanelItemProps>(
  function NavPanelItem(
    {
      label,
      icon,
      selected = false,
      count,
      dimmed = false,
      countLabel,
      onSelect,
      hovered: hoveredProp,
      renderPlate,
      renderCounter,
      width,
      plateSize,
      iconSize,
      gap,
      fontSize,
      selectedBackground,
      hoverBackground,
      textColor,
      activeTextColor,
      counterBackground,
    },
    ref,
  ) {
    const [pointerInside, setPointerInside] = useState(false);
    const hovered = hoveredProp ?? pointerInside;

    // A zero count is dropped rather than drawn: a badge reading "0" pulls the
    // eye toward the one area with nothing waiting in it.
    const showCounter = count !== undefined && count > 0;

    // Selected wins over hover — the pointer resting on the area you are
    // already in should not restyle it as though it were a destination.
    const plateBackground = selected
      ? (selectedBackground ?? color.main.white)
      : hovered
        ? (hoverBackground ?? color.navbar.hover)
        : undefined;

    const rootStyle: CSSProperties = {
      position: 'relative',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: len(gap) ?? `${navPanel.gap}px`,
      width: len(width) ?? `${navPanel.itemWidth}px`,
      padding: 0,
      border: 'none',
      background: 'transparent',
      cursor: dimmed ? 'default' : 'pointer',
      // The whole entry fades together, so the plate and its label never
      // disagree about how present the area is.
      opacity: dimmed ? navPanel.onboardingDimOpacity : undefined,
      // A dimmed entry is scenery for the step being explained, so it does not
      // take the pointer either.
      pointerEvents: dimmed ? 'none' : undefined,
      fontFamily: typography.fontFamily.base,
      transition: 'opacity 160ms ease',
    };

    const defaultPlate = () => (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: len(plateSize) ?? navPanel.plateSize,
          height: len(plateSize) ?? navPanel.plateSize,
          borderRadius: '50%',
          backgroundColor: plateBackground,
          color: selected || hovered ? color.navbar.text2 : color.navbar.text,
          transition: 'background-color 120ms ease, color 120ms ease',
        }}
      >
        <Icon icon={icon} size={len(iconSize) ?? navPanel.iconSize} />
      </span>
    );

    /*
      Red rather than the counter badge's default brand blue. The rail's plate
      already fills with the brand family when selected, so a blue counter over
      it would read as part of the selection rather than as something waiting.

      `status.error` rather than the `#EF5350` Figma draws: that value is
      `deprecated.errorAlt`, the near-duplicate red the theme is retiring, and
      wiring a new component to it would deepen a dependency the design system
      is trying to remove.
    */
    const defaultCounter = () => (
      <CounterBadge
        count={count}
        background={counterBackground ?? color.status.error.main}
        label={countLabel ?? `${count} unread`}
      />
    );

    return (
      <button
        ref={ref}
        type="button"
        onClick={onSelect}
        aria-current={selected ? 'page' : undefined}
        style={rootStyle}
        onPointerEnter={() => setPointerInside(true)}
        onPointerLeave={() => setPointerInside(false)}
      >
        {renderPlate
          ? renderPlate({
              icon,
              selected,
              hovered,
              background: plateBackground,
              defaultRender: defaultPlate,
            })
          : defaultPlate()}

        <span
          style={{
            ...typography.textStyle.sSemibold,
            fontSize: len(fontSize) ?? navPanel.fontSize,
            color: selected || hovered
              ? (activeTextColor ?? color.navbar.text2)
              : (textColor ?? color.navbar.text),
            textAlign: 'center',
            // The label wraps rather than truncating: the rail is fixed-width
            // and a clipped area name is worse than a two-line one.
            wordBreak: 'break-word',
            transition: 'color 120ms ease',
          }}
        >
          {label}
        </span>

        {showCounter && (
          <span
            style={{
              position: 'absolute',
              top: navPanel.counterOffsetY,
              left: navPanel.counterOffsetX,
            }}
          >
            {renderCounter
              ? renderCounter({ count, defaultRender: defaultCounter })
              : defaultCounter()}
          </span>
        )}
      </button>
    );
  },
);
