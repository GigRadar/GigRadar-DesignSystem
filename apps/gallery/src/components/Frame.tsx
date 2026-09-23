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

/**
 * The gutter a `wide` frame keeps on its right.
 *
 * The same as the well's left padding, so a screen that escapes the well sits
 * as far from the window's right edge as it does from the nav rail. Without
 * it the frame ran to the last pixel of the viewport, and whatever a screen
 * put at its far right — the Task Feed rail, a thread's send button — read
 * as pressed against the browser rather than as the edge of a design.
 */
const WELL_RIGHT = spacing.xxl;

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
   * Lets the frame out of the page's 1100px reading well, up to the width it
   * asks for — or to the window, whichever is smaller.
   *
   * For a screen whose real width exceeds the well. The Inbox is three fixed
   * columns and a thread; held inside the well its thread is squeezed to
   * ~300px and the chat header sheds the title and tags it would never drop
   * in the product. The well is sized for prose, and a screen is not prose.
   *
   * Pass the width the screen wants rather than `true`, so it stops where its
   * content stops instead of stretching a fixed composition across whatever
   * monitor it is opened on.
   */
  wide?: boolean | number;
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
         * `main` rather than a container, so the frame reclaims what the cap
         * is holding back by measuring the viewport — and stops `WELL_RIGHT`
         * short of the window, so the screen has a gutter on both sides.
         */
        ...(wide
          ? {
              // The room it can have, and the room it asks for — whichever is
              // less. A numeric `wide` stops the frame at its content's own
              // width so a fixed composition hugs rather than stretches.
              width:
                typeof wide === 'number'
                  ? `min(${wide}px, calc(100vw - ${WELL_LEFT + WELL_RIGHT}px))`
                  : `calc(100vw - ${WELL_LEFT + WELL_RIGHT}px)`,
              maxWidth: `calc(100vw - ${WELL_LEFT + WELL_RIGHT}px)`,
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
