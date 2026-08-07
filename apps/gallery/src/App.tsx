import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { useState } from 'react';
import { Section, Shell } from './layout';
import { AvatarPage } from './pages/AvatarPage';
import { BadgePage } from './pages/BadgePage';
import { ButtonPage } from './pages/ButtonPage';
import { CheckboxPage } from './pages/CheckboxPage';
import { IconsPage } from './pages/IconsPage';
import { PaginationPage } from './pages/PaginationPage';
import { SpinnerPage } from './pages/SpinnerPage';
import { SwitchPage } from './pages/SwitchPage';
import { TokensPage } from './pages/TokensPage';
import { TooltipPage } from './pages/TooltipPage';

const PAGES = [
  { id: 'tokens', label: 'Tokens', render: () => <TokensPage /> },
  { id: 'icons', label: 'Icons', render: () => <IconsPage /> },
  { id: 'avatar', label: 'Avatar', render: () => <AvatarPage /> },
  { id: 'badge', label: 'Badge', render: () => <BadgePage /> },
  { id: 'button', label: 'Button', render: () => <ButtonPage /> },
  { id: 'checkbox', label: 'Checkbox', render: () => <CheckboxPage /> },
  { id: 'pagination', label: 'Pagination', render: () => <PaginationPage /> },
  { id: 'spinner', label: 'Spinner', render: () => <SpinnerPage /> },
  { id: 'switch', label: 'Switch', render: () => <SwitchPage /> },
  { id: 'tooltip', label: 'Tooltip', render: () => <TooltipPage /> },
] as const;

type PageId = (typeof PAGES)[number]['id'];

export function App() {
  const [active, setActive] = useState<PageId>('tokens');
  const page = PAGES.find((p) => p.id === active) ?? PAGES[0];

  return (
    <Shell
      nav={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
          <div style={{ ...textStyle.sSemibold, color: color.main.description, padding: `${spacing.xs}px ${spacing.s}px`, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Foundations
          </div>
          {PAGES.filter((p) => p.id === 'tokens' || p.id === 'icons').map((p) => (
            <NavItem key={p.id} label={p.label} active={active === p.id} onClick={() => setActive(p.id)} />
          ))}
          <div style={{ ...textStyle.sSemibold, color: color.main.description, padding: `${spacing.s}px ${spacing.s}px ${spacing.xs}px`, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            Components
          </div>
          {PAGES.filter((p) => p.id !== 'tokens' && p.id !== 'icons').map((p) => (
            <NavItem key={p.id} label={p.label} active={active === p.id} onClick={() => setActive(p.id)} />
          ))}
        </nav>
      }
    >
      {page.render()}
    </Shell>
  );
}

function NavItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...textStyle.mMedium,
        textAlign: 'left',
        padding: `${spacing.xs}px ${spacing.s}px`,
        borderRadius: radius.xs,
        border: 'none',
        cursor: 'pointer',
        backgroundColor: active ? color.navbar.hover : 'transparent',
        color: active ? color.main.brand : color.navbar.text,
      }}
    >
      {label}
    </button>
  );
}

export { Section };
