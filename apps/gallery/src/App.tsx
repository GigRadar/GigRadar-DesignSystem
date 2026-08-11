import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { useState, type ReactNode } from 'react';
import { Section, Shell } from './layout';
import { NavigateProvider } from './navigation';
import { AiConfigurationPage } from './pages/AiConfigurationPage';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { ButtonPage } from './pages/ButtonPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { IconsPage } from './pages/IconsPage';
import { PaginationPage } from './pages/PaginationPage';
import { PromptPage } from './pages/PromptPage';
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
    ],
  },
  {
    title: 'Components',
    nodes: [
      { id: 'avatar', label: 'Avatar', render: () => <AvatarPage /> },
      { id: 'badge', label: 'Badge', render: () => <BadgePage /> },
      { id: 'button', label: 'Button', render: () => <ButtonPage /> },
      { id: 'checkbox', label: 'Checkbox', render: () => <CheckboxPage /> },
      { id: 'pagination', label: 'Pagination', render: () => <PaginationPage /> },
      { id: 'prompt', label: 'Prompt', render: () => <PromptPage /> },
      { id: 'spinner', label: 'Spinner', render: () => <SpinnerPage /> },
      { id: 'switch', label: 'Switch', render: () => <SwitchPage /> },
      { id: 'tooltip', label: 'Tooltip', render: () => <TooltipPage /> },
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
          { id: 'crm-settings-ai', label: 'AI Configuration', render: () => <AiConfigurationPage /> },
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

  const page = PAGES.find((p) => p.id === active) ?? PAGES[0];
  if (!page) return null;

  /**
   * Switches pages, opening the folder the target sits in.
   *
   * Without the second step, a cross-page link could land the reader on a page
   * whose sidebar row is hidden inside a collapsed folder — the content
   * changes but nothing in the nav shows where they are.
   */
  const navigate = (pageId: string) => {
    setActive(pageId);
    const parent = PAGES.find((p) => p.children?.some((child) => child.id === pageId));
    if (parent) setCollapsed((state) => ({ ...state, [parent.id]: false }));
  };

  return (
    <Shell
      nav={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
          {NAV.map((group, index) => (
            <div key={group.title} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
              <div
                style={{
                  ...textStyle.sSemibold,
                  color: color.main.description,
                  padding:
                    index === 0
                      ? `${spacing.xs}px ${spacing.s}px`
                      : `${spacing.s}px ${spacing.s}px ${spacing.xs}px`,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {group.title}
              </div>

              {group.nodes.map((node) =>
                hasChildren(node) ? (
                  <div key={node.id} style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
                    <NavItem
                      label={node.label}
                      active={active === node.id}
                      open={!collapsed[node.id]}
                      onClick={() => navigate(node.id)}
                      onToggle={() =>
                        setCollapsed((state) => ({ ...state, [node.id]: !state[node.id] }))
                      }
                    />
                    {!collapsed[node.id] &&
                      node.children.map((child) => (
                        <NavItem
                          key={child.id}
                          label={child.label}
                          depth={1}
                          active={active === child.id}
                          onClick={() => navigate(child.id)}
                        />
                      ))}
                  </div>
                ) : (
                  <NavItem
                    key={node.id}
                    label={node.label}
                    active={active === node.id}
                    onClick={() => navigate(node.id)}
                  />
                ),
              )}
            </div>
          ))}
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
