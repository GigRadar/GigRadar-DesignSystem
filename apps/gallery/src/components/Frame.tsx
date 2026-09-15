import { color, radius, spacing } from '@gigradar/theme';
import type { ReactNode } from 'react';

/**
 * Everything to the left of the reading well's content — the nav rail and the
 * well's own left padding.
 *
 * A `wide` frame subtracts this from the viewport to work out how much room it
 * actually has. It matches `Shell`'s open rail and `main`'s padding; a
 * collapsed rail only leaves the frame narrower than it could be, which is the
 * safe direction to be wrong in.
 */
const WELL_LEFT = 280 + spacing.xxl;

export type FrameProps = {
  children: ReactNode;
  /**
   * Fixed height in px, for a screen that would otherwise run the length of
   * the page. Omit — or pass `"auto"` — to let the content set its own
   * height, which is what a screen that is already a finite composition
   * wants: a fixed box crops it instead of showing it.
   */
  height?: number | 'auto';
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
  /**
   * Lets the frame out of the page's 1100px reading well, up to the window.
   *
   * For a screen whose real width exceeds the well — the Inbox is three fixed
   * columns and a thread, about 1360px before the thread has any room at all.
   * Held inside the well, the thread is squeezed to ~300px and its header
   * sheds the title and tags it would never drop in the product. The well is
   * sized for prose, and a screen is not prose.
   */
  wide?: boolean;
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
export function Frame({
  children,
  height = 560,
  hug = false,
  scroll = false,
  wide = false,
}: FrameProps) {
  const auto = height === 'auto';
  return (
    <div
      style={{
        display: hug ? 'inline-block' : undefined,
        /*
         * `100cqw` would be cleaner, but the well is a plain `max-width` on
         * `main` rather than a container, so the frame reclaims the gutters by
         * measuring the viewport: the well's own right padding plus whatever
         * the cap is holding back.
         */
        ...(wide
          ? {
              width: `calc(100vw - ${WELL_LEFT}px)`,
              maxWidth: `calc(100vw - ${WELL_LEFT}px)`,
            }
          : null),
        // An auto frame is sized by what is inside it, so it neither crops
        // nor scrolls — the clipping and the scrollbar both belong to the
        // fixed-height case.
        height: auto ? undefined : height,
        overflow: auto ? undefined : scroll ? undefined : 'hidden',
        overflowY: auto ? undefined : scroll ? 'auto' : undefined,
        borderRadius: radius.s,
        border: `1px solid ${color.navbar.border}`,
        marginBottom: spacing.s,
      }}
    >
      {children}
    </div>
  );
}
