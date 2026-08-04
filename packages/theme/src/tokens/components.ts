import { radius, spacing } from './space.js';
import { fontSize } from './typography.js';

/**
 * Component-level design tokens.
 *
 * These sit one layer above the primitives: a component reads
 * `component.button.height.medium` rather than a bare `36`, so the value has a
 * name, appears in the CSS custom properties, and can be overridden per app
 * without forking the component.
 *
 * ⚠️ SOURCE: unlike the color and typography tokens, these sizes are NOT
 * extracted from Figma — the guidebook (node 4363:1685) documents colors,
 * type, spacing, radius, and shadow, but contains no component specs. The
 * values below are derived from the spacing and type scales to be internally
 * consistent, and are the one part of this package that does not trace back to
 * a Figma value.
 *
 * When component specs are added to Figma, these should be replaced with the
 * real numbers. Doing so is a visual change but not an API change — the token
 * names stay the same.
 */

/**
 * Control heights.
 *
 * Kept as a shared scale for controls added later, so sizes stay consistent
 * across components rather than each picking its own.
 */
export const controlHeight = {
  small: 28,
  medium: 36,
  large: 44,
} as const;

export type ControlSize = keyof typeof controlHeight;





/**
 * Avatar metrics.
 *
 * Unlike the tokens above, these ARE from Figma (node 456:8607): the component
 * is drawn at 32px with a 16px corner badge and 14px initials. That 32px
 * measurement anchors the `medium` step; the other sizes extend the scale
 * proportionally, keeping the badge at half the avatar diameter throughout.
 */
export const avatar = {
  size: {
    small: 24,
    medium: 32,
    large: 40,
  },
  /** Initials type size, paired to each avatar size. */
  fontSize: {
    small: fontSize.s,
    medium: fontSize.m,
    large: fontSize.l,
  },
  /**
   * Corner badge diameter — half the avatar, so it reads as a marker rather
   * than a second avatar.
   */
  badgeSize: {
    small: 12,
    medium: 16,
    large: 20,
  },
  /**
   * The white ring separating the badge from the avatar beneath it. Figma
   * draws this at 1.255px; rounded to 1.5px, which renders cleanly at 1x and 2x
   * where a fractional value would blur.
   */
  badgeRingWidth: 1.5,
  radius: radius.round,
  borderWidth: 1,
  /**
   * Overlap between avatars in a stacked group, as a fraction of the size.
   *
   * 0.2 rather than the tighter values common elsewhere: two initials centred
   * in a 32px circle span roughly 20px, so an overlap above ~0.25 starts
   * cutting the first letter of every avatar but the leftmost.
   */
  groupOverlap: 0.2,
} as const;

export type AvatarSize = keyof typeof avatar.size;

export const component = {
  avatar,
} as const;

export type ComponentTokens = typeof component;
