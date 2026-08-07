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
 * Button metrics.
 *
 * These ARE from Figma (page 144:11090, the application button families
 * `Main button - feature` 2573:4267 and `Second button - feature` 2573:4294):
 * 16px horizontal padding, 8px vertical, a 6px corner radius, an 8px gap
 * between icon and label, and 14px medium text.
 *
 * That drawn button anchors the `medium` step. Figma draws only one size, so
 * `small` and `large` extend the scale proportionally — they are the one part
 * of this block not traceable to a Figma value.
 *
 * Note the radius is `radius.xs` (6), not `radius.s` (8): the button sits on
 * the radius scale's second step, matching what Figma draws.
 */
export const button = {
  /** Horizontal padding, paired to each size. */
  paddingX: {
    small: spacing.s,
    medium: spacing.m,
    large: spacing.l,
  },
  /** Vertical padding. Figma draws 8px, which is between `xs` and `s`. */
  paddingY: {
    small: 4,
    medium: 8,
    large: 12,
  },
  /** Label type size, paired to each size. */
  fontSize: {
    small: fontSize.s,
    medium: fontSize.m,
    large: fontSize.l,
  },
  /** Gap between the icon slots and the label. */
  gap: {
    small: spacing.xxs,
    medium: 8,
    large: spacing.s,
  },
  /** Icon edge length, matched to the label's type size. */
  iconSize: {
    small: 12,
    medium: 16,
    large: 20,
  },
  radius: radius.xs,
  borderWidth: 1,
} as const;

export type ButtonSize = keyof typeof button.fontSize;


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
   * Default space between avatars in a group. Negative, so they overlap.
   *
   * A fixed step rather than a fraction of the avatar size: the overlap then
   * stays put when the avatars are resized, and reads as a spacing decision
   * rather than a ratio to tune.
   */
  groupGap: -spacing.xs,
} as const;

export type AvatarSize = keyof typeof avatar.size;

/**
 * Badge metrics.
 *
 * Four badges are drawn in Figma, and all of them are pills built from the
 * same three decisions — a horizontal pad, a vertical pad, and a type size —
 * so they share one token block rather than four near-identical ones.
 *
 * `medium` is the size Figma draws in each case:
 *   credit  (1282:28608) 4/2 padding, 12px text, 16px credit mark
 *   eyebrow (163:10)     9/6 padding, 12px text, 18px sparkles, 9px gap
 *   counter (313:6469)   24px circle, 12px text
 *   rank    (333:15163)  6/2 padding, 12px text
 *
 * `small` and `large` extend each scale proportionally; Figma draws only the
 * medium step, so those two are inference rather than extraction.
 */
export const badge = {
  /** Horizontal padding of the pill badges (credit, rank). */
  paddingX: {
    small: spacing.xxs,
    medium: spacing.xxs,
    large: spacing.xs,
  },
  paddingY: {
    small: 1,
    medium: 2,
    large: 3,
  },
  fontSize: {
    small: 10,
    medium: fontSize.s,
    large: fontSize.m,
  },
  /** Space between a badge's icon and its label. */
  gap: {
    small: 1,
    medium: 2,
    large: 3,
  },
  radius: radius.round,

  /** The eyebrow badge is roomier than the others — it is a standalone pill. */
  eyebrow: {
    paddingX: {
      small: 6,
      medium: 9,
      large: 12,
    },
    paddingY: {
      small: 4,
      medium: 6,
      large: 8,
    },
    fontSize: {
      small: 10,
      medium: fontSize.s,
      large: fontSize.m,
    },
    /** Sparkle glyph edge length. */
    iconSize: {
      small: 14,
      medium: 18,
      large: 22,
    },
    gap: {
      small: 6,
      medium: 9,
      large: 12,
    },
  },

  /** The counter is a circle, so one diameter replaces padding. */
  counter: {
    size: {
      small: 18,
      medium: 24,
      large: 30,
    },
    fontSize: {
      small: 10,
      medium: fontSize.s,
      large: fontSize.m,
    },
  },

  /** The credit mark — the dark circular "G" inside the credit badge. */
  credit: {
    markSize: {
      small: 12,
      medium: 16,
      large: 20,
    },
  },

  /** The rank badge sits a step wider than the credit badge — Figma draws 6px. */
  rank: {
    paddingX: {
      small: spacing.xxs,
      medium: spacing.xs,
      large: spacing.s,
    },
    /** The up/down triangle. */
    triangleSize: {
      small: 6,
      medium: 8,
      large: 10,
    },
  },
} as const;

export type BadgeSize = keyof typeof badge.fontSize;

/**
 * Documentation chrome.
 *
 * The gallery's own surfaces — preview panels, prop tables, code blocks. These
 * are not product tokens: nothing in a GigRadar app should read them. They live
 * here so the gallery has names for its metrics instead of scattering bare
 * numbers, and so the docs and the components stay on one radius scale.
 */
export const docs = {
  /**
   * The area a component preview sits in. Borderless and unfilled — the
   * examples sit directly on the page, so only the breathing room around them
   * needs a value.
   */
  preview: {
    /** Vertical breathing room above and below the examples. */
    paddingY: spacing.m,
    /** Gap between examples in a preview row. */
    gap: spacing.s,
  },
  /** Prop tables and code blocks. */
  panel: {
    radius: radius.s,
    borderWidth: 1,
    paddingX: spacing.s,
    paddingY: spacing.xs,
  },
} as const;

export const component = {
  avatar,
  badge,
  button,
  docs,
} as const;

export type ComponentTokens = typeof component;
