import { color, component, spacing, textStyle } from '@gigradar/theme';
import type { ReactNode } from 'react';
import {
  IconButton,
  IconCollapseDoubleArrowLeft,
  IconExpandDoubleArrowRight,
  LifecycleBadge,
  type ComponentLifecycle,
} from '@gigradar/ui';

/**
 * The rail's two widths.
 *
 * Collapsed keeps the toggle reachable and nothing else — the nav rows are
 * text, and a label clipped to 56px is worse than no label, so the collapsed
 * rail drops them rather than truncating.
 */
const RAIL_WIDTH = 280;
const RAIL_COLLAPSED = 56;

export function Shell({
  nav,
  search,
  collapsed = false,
  onCollapsedChange,
  children,
}: {
  nav: ReactNode;
  /** The filter field, drawn under the title. */
  search?: ReactNode;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color.main.background }}>
      <aside
        style={{
          width: collapsed ? RAIL_COLLAPSED : RAIL_WIDTH,
          flexShrink: 0,
          boxSizing: 'border-box',
          backgroundColor: color.navbar.background,
          borderRight: `1px solid ${color.navbar.border}`,
          padding: spacing.s,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width 160ms ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: spacing.xs,
            padding: collapsed ? 0 : `${spacing.s}px ${spacing.s}px ${spacing.s}px`,
          }}
        >
          {!collapsed && (
            <div style={{ flex: '1 1 auto', minWidth: 0 }}>
              <div style={{ ...textStyle.lSemibold, color: color.navbar.textActive }}>GigRadar</div>
              <div style={{ ...textStyle.sRegular, color: color.main.description }}>
                Design System
              </div>
            </div>
          )}
          {onCollapsedChange && (
            <IconButton
              icon={collapsed ? IconExpandDoubleArrowRight : IconCollapseDoubleArrowLeft}
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              onClick={() => onCollapsedChange(!collapsed)}
            />
          )}
        </div>

        {!collapsed && search && (
          <div style={{ padding: `0 ${spacing.s}px ${spacing.m}px` }}>{search}</div>
        )}

        {/* The rail keeps its scroll position and its open/shut state while
            collapsed — the rows are hidden, not unmounted, so expanding
            returns to exactly what was there. */}
        <div style={{ display: collapsed ? 'none' : 'block' }}>{nav}</div>
      </aside>
      <main style={{ flex: 1, padding: `${spacing.xl}px ${spacing.xxl}px`, maxWidth: 1100 }}>{children}</main>
    </div>
  );
}

export function Section({
  title,
  description,
  children,
  stage,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  /**
   * Marks the section as not yet part of the system.
   *
   * Omitted on everything approved — a badge on every heading would stop
   * meaning anything. Only the sections still awaiting a review carry one.
   */
  stage?: ComponentLifecycle;
}) {
  return (
    <section style={{ marginBottom: spacing.xl }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing.s,
          marginBottom: description ? spacing.xxs : spacing.m,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ ...textStyle.h3, color: color.navbar.textActive, margin: 0 }}>
          {title}
        </h2>
        {stage && <LifecycleBadge stage={stage} />}
      </div>
      {description && (
        <p style={{ ...textStyle.mRegular, color: color.main.description, margin: 0, marginBottom: spacing.m, maxWidth: 680 }}>
          {description}
        </p>
      )}
      {children}
    </section>
  );
}

export function Preview({ children }: { children: ReactNode }) {
  const { preview } = component.docs;

  return (
    <div
      style={{
        // Open on the page — no fill, no border, no card. The component is the
        // only thing drawn here, so nothing competes with it for the eye.
        padding: `${preview.paddingY}px 0`,
        display: 'flex',
        flexWrap: 'wrap',
        gap: preview.gap,
        alignItems: 'center',
        marginBottom: spacing.s,
      }}
    >
      {children}
    </div>
  );
}

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <header style={{ marginBottom: spacing.xl }}>
      <h1 style={{ ...textStyle.h2, color: color.navbar.textActive, margin: 0, marginBottom: spacing.xs }}>{title}</h1>
      <p style={{ ...textStyle.lRegular, color: color.main.description, margin: 0, maxWidth: 680 }}>{description}</p>
    </header>
  );
}
