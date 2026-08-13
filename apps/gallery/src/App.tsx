import { color, controlHeight, radius, spacing, textStyle } from '@gigradar/theme';
import { useState, type ReactNode } from 'react';
import { Icon, IconDropdownArrowDown, IconDropdownArrowUp, IconSearch, IconXClose } from '@gigradar/ui';
import { Section, Shell } from './layout';
import { NavigateProvider } from './navigation';
import { AiConfigurationPage } from './pages/AiConfigurationPage';
import { AiToolsPage } from './pages/ai/AiToolsPage';
import { AutoReplyPage } from './pages/ai/AutoReplyPage';
import { CustomPromptPage } from './pages/ai/CustomPromptPage';
import { MentionPresetPage } from './pages/ai/MentionPresetPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { ButtonPage } from './pages/ButtonPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { IconsPage } from './pages/IconsPage';
import { LifecyclePage } from './pages/LifecyclePage';
import { ModeTabPage } from './pages/ModeTabPage';
import { OptionButtonPage } from './pages/OptionButtonPage';
import { PaginationPage } from './pages/PaginationPage';
import { PresetPage } from './pages/PresetPage';
import { PromptPage } from './pages/PromptPage';
import { ScrollbarPage } from './pages/ScrollbarPage';
import { SettingsPanelPage } from './pages/SettingsPanelPage';
import { SpinnerPage } from './pages/SpinnerPage';
import { SwitchPage } from './pages/SwitchPage';
import { TokensPage } from './pages/TokensPage';
import { TooltipPage } from './pages/TooltipPage';
import { UpworkAccountsPage } from './pages/UpworkAccountsPage';

/**
 * A nav entry. Every entry is a page; some also hold sub-pages.
 *
 * There is no folder-that-is-not-a-page: the CRM section mirrors the product's
 * own navigation — CRM ▸ Settings ▸ AI Configuration — and Settings there is a
 * real screen (the settings rail) that happens to contain others. A row that
 * only expands and cannot be opened would be a nav construct the product does
 * not have.
 */
type Page = {
  id: string;
  label: string;
  render: () => ReactNode;
  children?: Page[];
};

const hasChildren = (page: Page): page is Page & { children: Page[] } =>
  (page.children?.length ?? 0) > 0;

/**
 * The sidebar, as it is drawn.
 *
 * Declared as a tree rather than derived by filtering one flat list: the old
 * arrangement worked out which group a page belonged to by excluding ids from
 * the other group, which cannot express a third group and silently puts any
 * new page under Components.
 */
/**
 * A nav group — a card in the sidebar.
 *
 * A group holds either pages directly or named sections of them. Components
 * carries sections because the split inside it is real and load-bearing:
 * Main is the generic tier, CRM is what is built on top. Both live in one card
 * because they are two halves of one idea — "the components" — rather than two
 * unrelated groups that happen to sit next to each other.
 */
type NavGroup = {
  title: string;
  nodes?: Page[];
  sections?: { title: string; nodes: Page[] }[];
};

const NAV: NavGroup[] = [
  {
    title: 'Foundations',
    nodes: [
      { id: 'tokens', label: 'Tokens', render: () => <TokensPage /> },
      { id: 'icons', label: 'Icons', render: () => <IconsPage /> },
      { id: 'lifecycle', label: 'Lifecycle', render: () => <LifecyclePage /> },
    ],
  },
  {
    title: 'Components',
    sections: [
      {
        /**
         * The generic tier: nothing here knows what a CRM is.
         *
         * The dividing line is the dependency graph, not the name. Every
         * component here is consumed by others and depends on nothing
         * screen-shaped, so a second product could take the section unchanged.
         */
        title: 'Main',
        nodes: [
          { id: 'avatar', label: 'Avatar', render: () => <AvatarPage /> },
          { id: 'badge', label: 'Badge', render: () => <BadgePage /> },
          { id: 'button', label: 'Button', render: () => <ButtonPage /> },
          { id: 'checkbox', label: 'Checkbox & Radio', render: () => <CheckboxPage /> },
          { id: 'pagination', label: 'Pagination', render: () => <PaginationPage /> },
          { id: 'prompt', label: 'Prompt field', render: () => <PromptPage /> },
          { id: 'scrollbar', label: 'Scrollbar', render: () => <ScrollbarPage /> },
          { id: 'spinner', label: 'Spinner', render: () => <SpinnerPage /> },
          { id: 'switch', label: 'Switch', render: () => <SwitchPage /> },
          { id: 'tooltip', label: 'Tooltip', render: () => <TooltipPage /> },
        ],
      },
      {
        /**
         * Built from Main, used by the CRM screens.
         *
         * These take no CRM-specific props — a mode tab is a tab, an option
         * button is a radio row — but nothing outside a CRM screen uses them
         * today, and filing them as generic advertised a reuse that does not
         * exist. Any of them can move up to Main the moment a second product
         * wants one. More product sections join this list as they are built.
         */
        title: 'CRM',
        nodes: [
          { id: 'mode-tab', label: 'Mode tab', render: () => <ModeTabPage /> },
          { id: 'option-button', label: 'Option button', render: () => <OptionButtonPage /> },
          { id: 'preset', label: 'Preset', render: () => <PresetPage /> },
        ],
      },
    ],
  },
  {
    title: 'CRM',
    nodes: [
      {
        id: 'crm-settings',
        label: 'Settings',
        render: () => <SettingsPanelPage />,
        children: [
          {
            id: 'crm-settings-ai',
            label: 'AI Configuration',
            render: () => <AiConfigurationPage />,
            // The screen's four sections, in the order it stacks them.
            children: [
              { id: 'crm-ai-prompt', label: 'Custom Prompt', render: () => <CustomPromptPage /> },
              { id: 'crm-ai-auto-reply', label: 'Auto Reply', render: () => <AutoReplyPage /> },
              { id: 'crm-ai-presets', label: 'Mention Preset', render: () => <MentionPresetPage /> },
              { id: 'crm-ai-tools', label: 'AI Tools', render: () => <AiToolsPage /> },
            ],
          },
          {
            id: 'crm-settings-upwork',
            label: 'Upwork Connected Account',
            render: () => <UpworkAccountsPage />,
          },
        ],
      },
    ],
  },
];

/**
 * The group heading's expand control.
 *
 * Larger than the 9px glyph it replaces: it is the only control on the row,
 * and at that size it read as punctuation rather than something to press.
 */
const NAV_CHEVRON = 16;

/** The expand box on a nav row. Square, so it reads as a control. */
const NAV_TOGGLE = 22;

/** Every page a group holds, whether it nests them in sections or not. */
const groupPages = (group: NavGroup): Page[] => [
  ...(group.nodes ?? []),
  ...(group.sections ?? []).flatMap((section) => section.nodes),
];

const flatten = (page: Page): Page[] => [page, ...(page.children ?? []).flatMap(flatten)];

const PAGES: Page[] = NAV.flatMap((group) => groupPages(group).flatMap(flatten));

export function App() {
  const [active, setActive] = useState(PAGES[0]?.id ?? '');
  // Folders start open, so a section's pages are visible without a click.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // Groups too — keyed by title, which is what identifies a group.
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  // And the sections inside a group, keyed by "group/section".
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [query, setQuery] = useState('');

  const page = PAGES.find((p) => p.id === active) ?? PAGES[0];
  if (!page) return null;

  /**
   * Switches pages, opening every folder the target sits inside.
   *
   * Without the second step, a cross-page link could land the reader on a page
   * whose sidebar row is hidden inside a collapsed folder — the content
   * changes but nothing in the nav shows where they are.
   *
   * Every ancestor, not just the immediate parent: the tree nests more than one
   * level (CRM ▸ Settings ▸ AI Configuration ▸ Custom Prompt), so opening the
   * parent alone can still leave it hidden inside a collapsed grandparent.
   */
  const navigate = (pageId: string) => {
    setActive(pageId);

    const ancestors: string[] = [];
    const walk = (nodes: Page[], trail: string[]): boolean =>
      nodes.some((node) => {
        if (node.id === pageId) {
          ancestors.push(...trail);
          return true;
        }
        return walk(node.children ?? [], [...trail, node.id]);
      });
    walk(NAV.flatMap(groupPages), []);

    if (ancestors.length) {
      setCollapsed((state) => {
        const next = { ...state };
        ancestors.forEach((id) => {
          next[id] = false;
        });
        return next;
      });
    }

    const group = NAV.find((g) =>
      groupPages(g).some((node) => flatten(node).some((p) => p.id === pageId)),
    );
    if (group) {
      setCollapsedGroups((state) => ({ ...state, [group.title]: false }));

      const section = group.sections?.find((sec) =>
        sec.nodes.some((node) => flatten(node).some((p) => p.id === pageId)),
      );
      if (section) {
        const key = `${group.title}/${section.title}`;
        setCollapsedSections((state) => ({ ...state, [key]: false }));
      }
    }
  };

  /**
   * Keeps a page when it matches, or when anything beneath it does.
   *
   * A parent whose child matched has to survive the filter, or the child has
   * nothing to hang from — so this rebuilds the branch rather than testing
   * each node in isolation.
   */
  const filterPage = (page: Page): Page | null => {
    const hit = page.label.toLowerCase().includes(query.trim().toLowerCase());
    const children = (page.children ?? []).map(filterPage).filter((c): c is Page => c !== null);
    if (!hit && children.length === 0) return null;
    // A matching parent keeps all of its children: the reader asked for that
    // branch, not for the one row whose text happened to match.
    return { ...page, children: hit ? page.children : children };
  };

  const searching = query.trim().length > 0;

  /**
   * Draws one nav row and, when it has children and is open, the rows beneath
   * it — at any depth.
   *
   * Recursive rather than a parent case plus a child case: the flat version
   * silently dropped a third level, so adding the AI Configuration sections
   * put four pages in the router that the sidebar never rendered.
   */
  const renderNode = (node: Page, depth: number): ReactNode => {
    if (!hasChildren(node)) {
      return (
        <NavItem
          key={node.id}
          label={node.label}
          depth={depth}
          query={query}
          active={active === node.id}
          onClick={() => navigate(node.id)}
        />
      );
    }

    const nodeOpen = searching || !collapsed[node.id];

    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
        <NavItem
          label={node.label}
          depth={depth}
          query={query}
          active={active === node.id}
          open={nodeOpen}
          onClick={() => navigate(node.id)}
          onToggle={() => setCollapsed((state) => ({ ...state, [node.id]: !state[node.id] }))}
        />
        {nodeOpen && node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <Shell
      collapsed={railCollapsed}
      onCollapsedChange={setRailCollapsed}
      search={
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: spacing.xs,
            boxSizing: 'border-box',
            width: '100%',
            height: controlHeight.medium,
            padding: `0 ${spacing.xs}px`,
            borderRadius: radius.xs,
            border: `1px solid ${color.navbar.hover}`,
            backgroundColor: color.main.white,
          }}
        >
          <span
            aria-hidden
            style={{
              display: 'inline-flex',
              flexShrink: 0,
              width: 14,
              height: 14,
              color: color.navbar.text,
            }}
          >
            <Icon icon={IconSearch} size="100%" />
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search pages"
            style={{
              ...textStyle.mRegular,
              flex: '1 1 auto',
              minWidth: 0,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: color.main.black,
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Clear search"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: 16,
                height: 16,
                padding: 0,
                border: 'none',
                background: 'transparent',
                color: color.navbar.text,
                cursor: 'pointer',
              }}
            >
              <Icon icon={IconXClose} size="100%" />
            </button>
          )}
        </label>
      }
      nav={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.s }}>
          {NAV.map((group) => {
            const nodes = (group.nodes ?? []).map(filterPage).filter((n): n is Page => n !== null);
            const sections = (group.sections ?? [])
              .map((section) => ({
                ...section,
                nodes: section.nodes.map(filterPage).filter((n): n is Page => n !== null),
              }))
              .filter((section) => section.nodes.length > 0);

            // A card with nothing left in it is noise, not an empty state.
            if (searching && nodes.length === 0 && sections.length === 0) return null;

            const open = searching || !collapsedGroups[group.title];

            return (
              <div
                key={group.title}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.xxs,
                  boxSizing: 'border-box',
                  padding: spacing.xxs,
                  borderRadius: radius.s,
                  border: `1px solid ${color.navbar.hover}`,
                  backgroundColor: color.main.white,
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() =>
                    setCollapsedGroups((state) => ({ ...state, [group.title]: !state[group.title] }))
                  }
                  style={{
                    ...textStyle.sSemibold,
                    display: 'flex',
                    alignItems: 'center',
                    // The chevron sits at the far right, so every group's
                    // control is in one column rather than tucked against a
                    // label whose length varies.
                    justifyContent: 'space-between',
                    gap: spacing.xxs,
                    width: '100%',
                    color: color.main.description,
                    padding: `${spacing.xs}px ${spacing.s}px`,
                    border: 'none',
                    background: 'transparent',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    letterSpacing: 0.5,
                    cursor: 'pointer',
                    appearance: 'none',
                  }}
                >
                  {group.title}
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: NAV_CHEVRON,
                      height: NAV_CHEVRON,
                      color: color.navbar.text,
                    }}
                  >
                    {/* Two drawn icons rather than one rotated: the set has
                        both, and a real up-arrow reads more definitely as
                        "this closes" than a down-arrow turned upside down. */}
                    <Icon icon={open ? IconDropdownArrowUp : IconDropdownArrowDown} size="100%" />
                  </span>
                </button>

                {open && nodes.map((node) => renderNode(node, 0))}
                {open &&
                  sections.map((section) => {
                    // Keyed by group and section, so two groups can both carry
                    // a section called "CRM" without sharing one toggle.
                    const key = `${group.title}/${section.title}`;
                    const sectionOpen = searching || !collapsedSections[key];

                    return (
                      <div
                        key={section.title}
                        style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}
                      >
                        {/* The same row the CRM folders use, rather than a
                            static label: a section holds pages and opens and
                            shuts, which is what that row already means. It
                            carries no page of its own, so clicking the label
                            toggles it too — there is nothing else for it to
                            do. */}
                        <NavItem
                          label={section.title}
                          variant="section"
                          query={query}
                          open={sectionOpen}
                          onClick={() =>
                            setCollapsedSections((state) => ({ ...state, [key]: !state[key] }))
                          }
                          onToggle={() =>
                            setCollapsedSections((state) => ({ ...state, [key]: !state[key] }))
                          }
                        />
                        {sectionOpen && section.nodes.map((node) => renderNode(node, 1))}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </nav>
      }
    >
      <NavigateProvider navigate={navigate}>{page.render()}</NavigateProvider>
    </Shell>
  );
}

/**
 * Draws a label with the searched-for run marked.
 *
 * Splits on the match rather than replacing markup in a string: the label is
 * arbitrary text, and building HTML out of it would make a page called
 * "<Button>" a rendering bug.
 */
function HighlightedLabel({ label, query }: { label: string; query: string }) {
  const needle = query.trim().toLowerCase();
  if (!needle) return <>{label}</>;

  const at = label.toLowerCase().indexOf(needle);
  if (at === -1) return <>{label}</>;

  return (
    <>
      {label.slice(0, at)}
      <mark
        style={{
          // The theme's own search-match wash — an alpha, so the row's own
          // background still shows through on the active row.
          backgroundColor: color.main.highlight,
          color: 'inherit',
          borderRadius: 2,
          padding: '0 1px',
        }}
      >
        {label.slice(at, at + needle.length)}
      </mark>
      {label.slice(at + needle.length)}
    </>
  );
}

function NavItem({
  label,
  active = false,
  depth = 0,
  open,
  variant = 'page',
  query = '',
  onClick,
  onToggle,
}: {
  label: string;
  active?: boolean;
  /** The live search, so the matched run can be marked. */
  query?: string;
  /**
   * What the row is.
   *
   * `page` is a link — regular weight, sentence case, indented under whatever
   * holds it. `section` names a band of pages inside a card and never opens a
   * page of its own, so it is drawn as a header: uppercase, tracked out, and
   * flush to the card's edge. Without that the section label sat at the same
   * weight and inset as the links beneath it, and the hierarchy read flat.
   */
  variant?: 'page' | 'section';
  /** Indent level. One step in is enough to read as nested at this width. */
  depth?: number;
  /**
   * Present only on a row that holds sub-pages. Draws the disclosure caret and
   * its rotation — a leaf has no caret, which is what tells the two apart.
   */
  open?: boolean;
  /** Opens the page. Every row navigates, including ones with children. */
  onClick: () => void;
  /**
   * Expands or collapses the sub-pages. Bound to the caret alone, not the row:
   * a parent row that both navigated and toggled would do two things per click,
   * and there would be no way to open the page without also folding its
   * children away.
   */
  onToggle?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: spacing.xxs,
        paddingLeft: depth * spacing.s,
        // A section is a header, so it takes room above it rather than sitting
        // in the same rhythm as the links it introduces.
        marginTop: variant === 'section' ? spacing.xs : undefined,
        borderRadius: radius.xs,
        backgroundColor: active ? color.navbar.hover : 'transparent',
      }}
    >
      <button
        onClick={onClick}
        style={{
          ...(variant === 'section' ? textStyle.sMedium : textStyle.mMedium),
          display: 'flex',
          alignItems: 'center',
          flex: '1 1 auto',
          minWidth: 0,
          textAlign: 'left',
          padding: `${spacing.xs}px ${spacing.s}px`,
          borderRadius: radius.xs,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          textTransform: variant === 'section' ? 'uppercase' : undefined,
          letterSpacing: variant === 'section' ? 0.5 : undefined,
          color:
            variant === 'section'
              ? color.main.description
              : active
                ? color.main.brand
                : color.navbar.text,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <HighlightedLabel label={label} query={query} />
      </button>

      {/* The toggle sits at the right in its own bordered box, so a row that
          both opens a page and holds sub-pages has two visibly separate
          targets: the label navigates, the box folds. Without the border the
          two ran together and there was no way to tell that clicking one edge
          of the row did something different from the other. */}
      {open !== undefined && onToggle && (
        <button
          type="button"
          onClick={onToggle}
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
          aria-expanded={open}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: NAV_TOGGLE,
            height: NAV_TOGGLE,
            marginRight: spacing.xxs,
            padding: 0,
            border: `1px solid ${color.navbar.hover}`,
            borderRadius: radius.xs,
            background: color.main.white,
            color: active ? color.main.brand : color.navbar.text,
            lineHeight: 1,
            cursor: 'pointer',
          }}
        >
          <Icon icon={open ? IconDropdownArrowUp : IconDropdownArrowDown} size={12} />
        </button>
      )}
    </div>
  );
}

export { Section };
