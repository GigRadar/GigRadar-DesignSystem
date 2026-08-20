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
 *
 * Carries its own bottom margin because `Section` does not space its children:
 * on the pages where a caption follows, that caption supplies the gap, but a
 * preview sitting directly above a code block would otherwise butt against it.
 */
export function Thread({ children, width = 788 }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        width,
        maxWidth: '100%',
        marginBottom: spacing.m,
        border: `${borderWidth.thin}px solid ${color.navbar.hover}`,
        borderRadius: radius.xs,
        // Clipped across, open below: the rounded corners need the horizontal
        // clip, but the header's filter and stage popovers hang past the bottom
        // edge and `hidden` would cut them off mid-menu.
        overflowX: 'clip',
        overflowY: 'visible',
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
