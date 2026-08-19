import { borderWidth, color, radius, spacing, textStyle } from '@gigradar/theme';
import type { ReactNode } from 'react';

/**
 * The bits every Chat Room (Mid) page repeats.
 *
 * Shared rather than copied into each page: they are one decision — how a
 * caption reads, how wide the thread previews at — and copies drift.
 */

/** A caption under a demo, matching the other gallery pages. */
export function Caption({ children }: { children: ReactNode }) {
  return (
    <p style={{ ...textStyle.sRegular, color: color.navbar.text, margin: `0 0 ${spacing.m}px` }}>
      {children}
    </p>
  );
}

/**
 * The thread at one of its two real widths.
 *
 * The header truncates its title and drops its tag labels, so previewing it
 * full-bleed would show a layout the product never draws. 788px is the desktop
 * column, 402px the mobile one — both from Figma.
 */
export function Thread({ children, width = 788 }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        width,
        maxWidth: '100%',
        border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
        borderRadius: radius.xs,
        overflow: 'hidden',
        backgroundColor: color.main.white,
      }}
    >
      {children}
    </div>
  );
}

/** A white surface, for parts drawn on a menu rather than in the band. */
export function Surface({ children }: { children: ReactNode }) {
  return (
    <div style={{ padding: spacing.l, backgroundColor: color.main.background }}>{children}</div>
  );
}

/** A row of variants, wrapped so a wide set stays on the page. */
export function Row({ children, gap = spacing.s }: { children: ReactNode; gap?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap,
        marginBottom: spacing.m,
      }}
    >
      {children}
    </div>
  );
}
