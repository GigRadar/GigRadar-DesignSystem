import { color, component, typography } from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { SettingsCard } from './SettingsCard.js';
import { IconCollapseDoubleArrowLeft, IconExpandDoubleArrowRight } from '../../icons/defs.js';
import type { IconDef } from '../../icons/defs.js';

const { settingsPanel } = component;

/** One entry in the settings list. */
export type SettingsItem = {
  /** Stable identity. Used as the React key and echoed back by `onSelect`. */
  id: string;
  /** The label. Hidden when the panel is collapsed. */
  label: string;
  /** The glyph, from the icon set. Always drawn — it is all a collapsed panel has. */
  icon: IconDef;
  /**
   * Nested entries, indented under this one.
   *
   * Dropped entirely while collapsed: Figma shows only top-level icons there,
   * since an indented icon rail reads as noise once the labels are gone.
   */
  children?: SettingsItem[];
};

/** What one entry gets when a caller replaces its markup. */
export type SettingsItemRenderProps = WithDefaultRender & {
  item: SettingsItem;
  /** Whether this entry is the selected one. */
  selected: boolean;
  /** Nesting level. 0 is top-level, 1 is a sub-entry. */
  depth: number;
  /** Whether the panel is collapsed, so the label is hidden. */
  collapsed: boolean;
};

/** What the header gets when a caller replaces it. */
export type SettingsHeaderRenderProps = WithDefaultRender & {
  collapsed: boolean;
  /** Flips the panel between expanded and collapsed. */
  toggle: () => void;
};

/** Per-instance overrides for the panel's own metrics. */
export type SettingsPanelStyleProps = {
  /** Panel width when expanded. */
  width?: CssLength;
  /** Panel width when collapsed. */
  collapsedWidth?: CssLength;
  /** Corner radius of an entry. */
  radius?: CssLength;
  /** Panel fill. */
  background?: string;
  /** The rail's right-hand edge. */
  borderColor?: string;
  /** Fill and text of the selected entry. */
  selectedBackground?: string;
  selectedTextColor?: string;
};

export type SettingsPanelProps = {
  /** The entries, in the order they should appear. */
  items?: SettingsItem[];
  /** Id of the selected entry. Matches against nested entries too. */
  value?: string;
  onSelect?: (item: SettingsItem) => void;

  /** The heading. Hidden when collapsed, where only the toggle remains. */
  title?: ReactNode;

  /**
   * Whether the panel is collapsed to an icon rail.
   *
   * Leave it off for the common case: the panel manages its own state and
   * reports changes through `onCollapsedChange`. Pass it when something
   * outside the panel drives the layout.
   */
  collapsed?: boolean;
  /** The starting state of an uncontrolled panel. */
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;

  /** Replaces one entry. Call `defaultRender()` to decorate it. */
  renderItem?: RenderProp<SettingsItemRenderProps>;
  /** Replaces the header band. Call `defaultRender()` to decorate it. */
  renderHeader?: RenderProp<SettingsHeaderRenderProps>;
} & SettingsPanelStyleProps;

/**
 * The settings rail — CRM ▸ Settings, left panel.
 *
 * Figma: node 8272:40787 (expanded) and 8299:28723 (collapsed). A list of
 * rounded cards, one per settings screen, with the selected one filled brand
 * blue and its sub-entries indented beneath it.
 *
 * Collapsing is not a width change alone. Figma drops the title, the labels,
 * and every sub-entry, leaving one icon per top-level screen — so the two
 * states are different content, not the same content at two sizes, and the
 * component draws them as such.
 *
 * Entries take a render prop, per the convention in `internal/render.ts`: a
 * product may want a badge, a count, or a status dot on a row, which is where
 * settings lists genuinely differ. The rail's own frame does not.
 */
export const SettingsPanel = forwardRef<HTMLElement, SettingsPanelProps>(function SettingsPanel(
  {
    items = [],
    value,
    onSelect,
    title = 'Settings',
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    renderItem,
    renderHeader,
    width,
    collapsedWidth,
    radius,
    background,
    borderColor,
    selectedBackground,
    selectedTextColor,
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultCollapsed);

  const isControlled = collapsed !== undefined;
  const isCollapsed = isControlled ? collapsed : uncontrolled;

  const toggle = useCallback(() => {
    const next = !isCollapsed;
    if (!isControlled) setUncontrolled(next);
    onCollapsedChange?.(next);
  }, [isCollapsed, isControlled, onCollapsedChange]);

  const panelStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    flexShrink: 0,
    width: isCollapsed
      ? (len(collapsedWidth) ?? settingsPanel.collapsedWidth)
      : (len(width) ?? settingsPanel.width),
    borderRight: `1px solid ${borderColor ?? color.main.backgroundAlt}`,
    backgroundColor: background ?? color.main.white,
    fontFamily: typography.fontFamily.base,
    overflow: 'hidden',
    transition: 'width 160ms ease',
  };

  const defaultHeader = () => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        // The title takes the space and pushes the toggle to the edge; with no
        // title the toggle is all there is, so it sits at the start.
        justifyContent: isCollapsed ? 'flex-start' : 'space-between',
        boxSizing: 'border-box',
        width: '100%',
        height: settingsPanel.header.height,
        padding: `${settingsPanel.header.paddingY}px ${settingsPanel.header.paddingX}px`,
        flexShrink: 0,
      }}
    >
      {!isCollapsed && (
        <span
          style={{
            ...typography.textStyle.h4,
            color: color.main.black,
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
      )}
      <button
        type="button"
        onClick={toggle}
        aria-label={isCollapsed ? 'Expand the settings panel' : 'Collapse the settings panel'}
        aria-expanded={!isCollapsed}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          border: 'none',
          background: 'transparent',
          color: color.navbar.text,
          cursor: 'pointer',
          appearance: 'none',
        }}
      >
        <Icon
          icon={isCollapsed ? IconExpandDoubleArrowRight : IconCollapseDoubleArrowLeft}
          size={settingsPanel.item.iconSize}
        />
      </button>
    </div>
  );

  /** Draws one entry, plus its sub-entries when the panel is expanded. */
  const renderEntry = (item: SettingsItem, depth: number): ReactNode => {
    // A parent stays filled while one of its children is the selection, which
    // is what Figma draws: the section you are inside is highlighted, not just
    // the leaf you clicked. It also survives collapsing, where the child is
    // gone and the parent icon is the only thing left to carry the state.
    const selected = containsSelection(item, value);

    const defaultRender = () => (
      <SettingsCard
        label={item.label}
        icon={item.icon}
        iconOnly={isCollapsed}
        selected={selected}
        level={depth > 0 ? 'subSetting' : 'setting'}
        radius={radius}
        selectedBackground={selectedBackground}
        selectedTextColor={selectedTextColor}
        aria-current={selected ? 'page' : undefined}
        onClick={() => onSelect?.(item)}
      />
    );

    // Sub-entries are dropped while collapsed — see the component doc.
    const children =
      !isCollapsed && item.children?.length
        ? item.children.map((child) => renderEntry(child, depth + 1))
        : null;

    return (
      <div
        key={item.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: settingsPanel.subGap,
          width: '100%',
        }}
      >
        {renderItem
          ? renderItem({ item, selected, depth, collapsed: isCollapsed, defaultRender })
          : defaultRender()}
        {children && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: settingsPanel.subGap,
              padding: `0 ${settingsPanel.subInset}px`,
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav ref={ref} style={panelStyle} aria-label={typeof title === 'string' ? title : 'Settings'}>
      {renderHeader
        ? renderHeader({ collapsed: isCollapsed, toggle, defaultRender: defaultHeader })
        : defaultHeader()}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: settingsPanel.gap,
          boxSizing: 'border-box',
          width: '100%',
          padding: settingsPanel.listPadding,
          overflowY: 'auto',
        }}
      >
        {items.map((item) => renderEntry(item, 0))}
      </div>
    </nav>
  );
});

/**
 * Whether an entry is the selection, or holds it somewhere beneath.
 *
 * Recursive rather than a one-level check: Figma nests exactly one deep today,
 * and a flat `children.some(...)` would work — but it would fail silently the
 * first time a screen nests twice, leaving the grandparent unhighlighted with
 * nothing to explain why.
 */
function containsSelection(item: SettingsItem, value: string | undefined): boolean {
  if (item.id === value) return true;
  return item.children?.some((child) => containsSelection(child, value)) ?? false;
}

