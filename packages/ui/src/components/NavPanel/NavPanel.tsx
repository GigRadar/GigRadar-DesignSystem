import { component } from '@gigradar/theme';
import { Fragment, forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import type { IconDef } from '../../icons/defs.js';
import { NavPanelItem } from './NavPanelItem.js';

const { navPanel } = component;

/**
 * Which way the rail runs.
 *
 * `vertical` is the desktop rail down the left edge; `horizontal` is the mobile
 * bar along the bottom. Same entries at the same size either way — the design
 * differs by direction alone, which is why this is an orientation rather than
 * two components.
 */
export type NavPanelOrientation = 'vertical' | 'horizontal';

/** One product area in the rail. */
export type NavPanelArea = {
  /** Stable identity. The React key, and what `onSelect` reports back. */
  id: string;
  /** The area's name — "Dashboard", "Unified Inbox". */
  label: ReactNode;
  /** The glyph. */
  icon: IconDef;
  /** Unread count for this area. Zero or absent draws no badge. */
  count?: number;
  /** What the count means, for a screen reader — "4 unread messages". */
  countLabel?: string;
};

/** What a `renderArea` function receives — one entry in the rail. */
export type NavAreaRenderProps = WithDefaultRender & {
  /** The area being drawn. */
  area: NavPanelArea;
  /** Whether it is the current one. */
  selected: boolean;
  /** Whether the onboarding walkthrough has faded it. */
  dimmed: boolean;
  /** Its position in the rail, for keying. */
  index: number;
  /** Moves to this area. A no-op while dimmed. */
  select: () => void;
};

/** Per-instance overrides for the rail's own metrics. */
export type NavPanelStyleProps = {
  /** Space between entries. */
  itemGap?: CssLength;
  /** Padding around the rail. */
  padding?: CssLength;
  /** The rail's fill. Transparent by default — it sits on the app background. */
  background?: string;
};

export type NavPanelProps = {
  /** The product areas, in the order they are drawn. */
  areas: NavPanelArea[];
  /** The `id` of the area the user is in. */
  selected?: string;
  /** Called with the `id` of the area pressed. */
  onSelect?: (id: string) => void;
  /**
   * Which way the rail runs.
   *
   * @default 'vertical'
   */
  orientation?: NavPanelOrientation;
  /**
   * Fades every area except one, for the onboarding walkthrough.
   *
   * Pass the `id` the current step is explaining. The rest drop to a tenth —
   * dimmed rather than removed, so the rail keeps its size and the highlighted
   * entry stays put as the walkthrough advances.
   *
   * The highlighted area does not have to be `selected`; a step can point at an
   * area the user has not opened yet.
   */
  highlight?: string;
  /** Accessible name for the rail, e.g. "Main". */
  label?: string;
  /**
   * Replaces one entry, keeping the rail's layout and its selection wiring.
   *
   * The usual reason is an entry that has to carry something the design system
   * does not draw — a per-area status dot, a tooltip, a drag handle.
   */
  renderArea?: RenderProp<NavAreaRenderProps>;
} & NavPanelStyleProps &
  Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'onSelect'>;

/**
 * The app's left navigation rail — Figma node 2712:30773 ("Left Panel").
 *
 * One entry per product area, each a round icon plate above a label. Figma
 * draws four states: desktop, mobile, and an onboarding variant of each where
 * every area but one is faded to a tenth.
 *
 * Those four are two props rather than four variants. Desktop and mobile differ
 * only in which way the entries flow, and the onboarding states are the same
 * rail with `highlight` set — holding them as variants would mean four copies
 * of one layout, and a change to an entry would have to be made in all of them.
 *
 * The rail is stateless: it draws whatever `selected` says and reports presses
 * through `onSelect`. That keeps the current area wherever it already lives —
 * a router, usually — rather than duplicating it here and letting the two
 * disagree about which page you are on.
 */
export const NavPanel = forwardRef<HTMLElement, NavPanelProps>(function NavPanel(
  {
    areas,
    selected,
    onSelect,
    orientation = 'vertical',
    highlight,
    label = 'Main',
    renderArea,
    itemGap,
    padding,
    background,
    ...rest
  },
  ref,
) {
  const horizontal = orientation === 'horizontal';

  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: horizontal ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: len(itemGap) ?? `${navPanel.itemGap}px`,
    padding: len(padding) ?? `${navPanel.padding}px`,
    backgroundColor: background,
    // The rail is a fixed strip beside the app rather than something that
    // grows with it, so its entries never stretch.
    flexShrink: 0,
    overflow: 'hidden',
  };

  return (
    <nav {...rest} ref={ref} aria-label={label} style={style}>
      {areas.map((area, index) => {
        const isSelected = area.id === selected;
        // Every area except the highlighted one fades, and only while a
        // walkthrough is running — no `highlight` means nothing is dimmed.
        const dimmed = highlight !== undefined && area.id !== highlight;
        const select = () => (dimmed ? undefined : onSelect?.(area.id));

        const defaultRender = () => (
          <NavPanelItem
            label={area.label}
            icon={area.icon}
            count={area.count}
            countLabel={area.countLabel}
            selected={isSelected}
            dimmed={dimmed}
            onSelect={select}
          />
        );

        return (
          <Fragment key={area.id}>
            {renderArea
              ? renderArea({ area, selected: isSelected, dimmed, index, select, defaultRender })
              : defaultRender()}
          </Fragment>
        );
      })}
    </nav>
  );
});
