import { color, component, spacing, textStyle } from '@gigradar/theme';
import type { ReactNode } from 'react';
import { LifecycleBadge, type ComponentLifecycle } from '@gigradar/ui';

export function Shell({ nav, children }: { nav: ReactNode; children: ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: color.main.background }}>
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          backgroundColor: color.navbar.background,
          borderRight: `1px solid ${color.navbar.border}`,
          padding: spacing.s,
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ padding: `${spacing.s}px ${spacing.s}px ${spacing.m}px` }}>
          <div style={{ ...textStyle.lSemibold, color: color.navbar.textActive }}>GigRadar</div>
          <div style={{ ...textStyle.sRegular, color: color.main.description }}>Design System</div>
        </div>
        {nav}
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
