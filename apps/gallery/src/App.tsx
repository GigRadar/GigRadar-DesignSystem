import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { useState, type ReactNode } from 'react';
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
const NAV: { title: string; nodes: Page[] }[] = [
  {
    title: 'Foundations',
    nodes: [
      { id: 'tokens', label: 'Tokens', render: () => <TokensPage /> },
      { id: 'icons', label: 'Icons', render: () => <IconsPage /> },
      { id: 'lifecycle', label: 'Lifecycle', render: () => <LifecyclePage /> },
    ],
  },
  {
    /**
     * The generic tier: nothing here knows what a CRM is.
     *
     * The dividing line is the dependency graph, not the name. Every component
     * in this group is consumed by others and depends on nothing screen-shaped,
     * so a second product could take the whole group unchanged.
     */
    title: 'Components',
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
     * The CRM tier: built from the group above, used by the screens below.
     *
     * These take no CRM-specific props — a mode tab is a tab, an option button
     * is a radio row — but nothing outside a CRM screen uses them today, and
     * filing them as generic advertised a reuse that does not exist. Any of
     * them can be promoted the moment a second product wants one.
     */
    title: 'CRM Components',
    nodes: [
      { id: 'mode-tab', label: 'Mode tab', render: () => <ModeTabPage /> },
      { id: 'option-button', label: 'Option button', render: () => <OptionButtonPage /> },
      { id: 'preset', label: 'Preset', render: () => <PresetPage /> },
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

const flatten = (page: Page): Page[] => [page, ...(page.children ?? []).flatMap(flatten)];

const PAGES: Page[] = NAV.flatMap((group) => group.nodes.flatMap(flatten));

export function App() {
  const [active, setActive] = useState(PAGES[0]?.id ?? '');
  // Folders start open, so a section's pages are visible without a click.
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  // Groups too — keyed by title, which is what identifies a group.
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

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
    walk(NAV.flatMap((group) => group.nodes), []);

    if (ancestors.length) {
      setCollapsed((state) => {
        const next = { ...state };
        ancestors.forEach((id) => {
          next[id] = false;
        });
        return next;
      });
    }

    const group = NAV.find((g) => g.nodes.some((node) => flatten(node).some((p) => p.id === pageId)));
    if (group) setCollapsedGroups((state) => ({ ...state, [group.title]: false }));
  };

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
          active={active === node.id}
          onClick={() => navigate(node.id)}
        />
      );
    }

    return (
      <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
        <NavItem
          label={node.label}
          depth={depth}
          active={active === node.id}
          open={!collapsed[node.id]}
          onClick={() => navigate(node.id)}
          onToggle={() => setCollapsed((state) => ({ ...state, [node.id]: !state[node.id] }))}
        />
        {!collapsed[node.id] && node.children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <Shell
      nav={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
          {NAV.map((group, index) => {
            const open = !collapsedGroups[group.title];

            return (
              <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
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
                    gap: spacing.xxs,
                    width: '100%',
                    color: color.main.description,
                    padding:
                      index === 0
                        ? `${spacing.xs}px ${spacing.s}px`
                        : `${spacing.s}px ${spacing.s}px ${spacing.xs}px`,
                    border: 'none',
                    background: 'transparent',
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    letterSpacing: 0.5,
                    cursor: 'pointer',
                    appearance: 'none',
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      display: 'inline-block',
                      // The same quarter-turn the page rows use, so a heading
                      // and a folder read as the same kind of control.
                      transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
                      transition: 'transform 120ms ease',
                      fontSize: 9,
                      lineHeight: 1,
                    }}
                  >
                    ▾
                  </span>
                  {group.title}
                </button>

                {open && group.nodes.map((node) => renderNode(node, 0))}
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

function NavItem({
  label,
  active = false,
  depth = 0,
  open,
  onClick,
  onToggle,
}: {
  label: string;
  active?: boolean;
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
        borderRadius: radius.xs,
        backgroundColor: active ? color.navbar.hover : 'transparent',
      }}
    >
      {open !== undefined && (
        <button
          onClick={onToggle}
          aria-label={open ? `Collapse ${label}` : `Expand ${label}`}
          aria-expanded={open}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 20,
            height: 20,
            marginLeft: spacing.xs,
            padding: 0,
            border: 'none',
            borderRadius: radius.xs,
            background: 'transparent',
            color: active ? color.main.brand : color.navbar.text,
            fontSize: 10,
            lineHeight: 1,
            cursor: 'pointer',
            transform: open ? undefined : 'rotate(-90deg)',
            transition: 'transform 120ms ease',
          }}
        >
          ▾
        </button>
      )}
      <button
        onClick={onClick}
        style={{
          ...textStyle.mMedium,
          flex: '1 1 auto',
          minWidth: 0,
          textAlign: 'left',
          padding: `${spacing.xs}px ${spacing.s}px`,
          // The caret already supplies the left inset on a parent row.
          paddingLeft: open === undefined ? spacing.s : 0,
          borderRadius: radius.xs,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          color: active ? color.main.brand : color.navbar.text,
        }}
      >
        {label}
      </button>
    </div>
  );
}

export { Section };
