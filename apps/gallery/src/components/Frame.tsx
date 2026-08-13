import { color, radius, spacing } from '@gigradar/theme';
import type { ReactNode } from 'react';

export type FrameProps = {
  children: ReactNode;
  height?: number;
  /**
   * Shrinks the box to its content instead of filling the page.
   *
   * For a preview whose content is a fixed width — a single column rather than
   * a whole screen — where a full-width frame would stretch a header across
   * empty space its content cannot follow.
   */
  hug?: boolean;
  /**
   * Scrolls the overflow rather than clipping it.
   *
   * Off by default: a screen preview is showing a layout, and a scrollbar
   * inside it reads as part of the design. Turn it on where the content is
   * genuinely taller than the frame and cutting it off would hide the point.
   */
  scroll?: boolean;
};

/**
 * A fixed-height bordered container for a whole screen.
 *
 * Screens fill whatever they are given, so without a height one would run the
 * length of the page and a two-column split would stop reading as a split.
 * Shared rather than redeclared per page so every screen preview sits in the
 * same box — the border, the radius, and the height below it are the same
 * decision everywhere, and a page that redraws them by hand drifts.
 */
export function Frame({ children, height = 560, hug = false, scroll = false }: FrameProps) {
  return (
    <div
      style={{
        display: hug ? 'inline-block' : undefined,
        height,
        overflow: scroll ? undefined : 'hidden',
        overflowY: scroll ? 'auto' : undefined,
        borderRadius: radius.s,
        border: `1px solid ${color.navbar.border}`,
        marginBottom: spacing.s,
      }}
    >
      {children}
    </div>
  );
}
