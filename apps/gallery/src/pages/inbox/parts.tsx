import { color, component, spacing, textStyle } from '@gigradar/theme';
import type { ReactNode } from 'react';

/**
 * The bits every Inbox page repeats.
 *
 * Shared rather than copied into each of the fifteen pages under Left: they
 * are one decision — how a caption reads, how wide the column preview is —
 * and fifteen copies drift.
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
 * A fixed-width preview at the column's real width.
 *
 * The controls in the left column are all sized to 304px and several of them
 * truncate, so previewing them full-bleed would show a layout the product
 * never draws.
 *
 * Stacks its children with the room list's own gap, taken from the same token
 * `InboxList` uses: a preview that butts cards together shows a rhythm the
 * product does not have, and separated cards are half of what makes the list
 * scannable.
 */
export function Column({ children, width = 304 }: { children: ReactNode; width?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: component.inbox.list.chatGap,
        width,
        padding: spacing.s,
      }}
    >
      {children}
    </div>
  );
}

/** A white surface, for parts that are drawn on a menu rather than the page. */
export function Surface({ children, width = 315 }: { children: ReactNode; width?: number }) {
  return (
    <div style={{ width, padding: spacing.s, backgroundColor: color.main.white }}>{children}</div>
  );
}
