import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { createContext, useContext, type ReactNode } from 'react';

/**
 * Lets one page send the reader to another.
 *
 * The gallery has no router — `App` holds the active page in state — so a page
 * that wants to link elsewhere needs a way to reach that setter. This is that
 * way, and it is deliberately the only one: a page never learns *which* page is
 * active, only how to ask for a different one.
 *
 * It exists because the same components are documented from two angles. The
 * CRM ▸ Settings ▸ AI Configuration screen is assembled from the prompt
 * primitives, and those primitives are also documented on their own under
 * Components ▸ Prompt. Whichever page a reader lands on, they should be one
 * click from the other view rather than hunting the sidebar for it.
 */
const NavigateContext = createContext<((pageId: string) => void) | null>(null);

export function NavigateProvider({
  navigate,
  children,
}: {
  navigate: (pageId: string) => void;
  children: ReactNode;
}) {
  return <NavigateContext.Provider value={navigate}>{children}</NavigateContext.Provider>;
}

export function useNavigate() {
  const navigate = useContext(NavigateContext);
  if (!navigate) throw new Error('useNavigate must be used inside <NavigateProvider>');
  return navigate;
}

/**
 * A callout pointing at the page's counterpart.
 *
 * Drawn as a pale panel rather than an inline link so it reads as orientation —
 * "here is the other half of this" — before the reader starts scrolling
 * examples, which is exactly when the question comes up.
 */
export function CrossLink({
  eyebrow,
  children,
  links,
}: {
  /** The relationship, e.g. "Built from components". */
  eyebrow: string;
  /** One or two sentences on how the two pages relate. */
  children: ReactNode;
  links: { label: string; pageId: string }[];
}) {
  const navigate = useNavigate();

  return (
    <aside
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        boxSizing: 'border-box',
        padding: spacing.s,
        marginBottom: spacing.xl,
        borderRadius: radius.s,
        border: `1px solid ${color.navbar.hover}`,
        backgroundColor: color.main.background,
        maxWidth: 680,
      }}
    >
      <div
        style={{
          ...textStyle.sSemibold,
          color: color.main.description,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
        }}
      >
        {eyebrow}
      </div>
      <div style={{ ...textStyle.mRegular, color: color.main.description }}>{children}</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.xs }}>
        {links.map((link) => (
          <button
            key={link.pageId}
            onClick={() => navigate(link.pageId)}
            style={{
              ...textStyle.mMedium,
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xxs,
              padding: `${spacing.xs}px ${spacing.s}px`,
              borderRadius: radius.xs,
              border: `1px solid ${color.navbar.hover}`,
              backgroundColor: color.main.white,
              color: color.main.brand,
              cursor: 'pointer',
            }}
          >
            {link.label}
            <span aria-hidden>→</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
