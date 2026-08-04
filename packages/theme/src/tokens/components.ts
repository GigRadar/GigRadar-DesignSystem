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
 * Sized so the text sits on the spacing scale: a `medium` control is the
 * medium font size (14) plus `spacing.m` above and below, rounded to an even
 * number for crisp centring.
 */
export const controlHeight = {
  small: 28,
  medium: 36,
  large: 44,
} as const;

export type ControlSize = keyof typeof controlHeight;

export const button = {
  height: controlHeight,
  paddingX: {
    small: spacing.s,
    medium: spacing.m,
    large: spacing.l,
  },
  gap: {
    small: spacing.xxs,
    medium: spacing.xs,
    large: spacing.xs,
  },
  radius: radius.s,
  borderWidth: 1,
  /** Width of the focus ring drawn outside the border. */
  focusRingWidth: 3,
} as const;

export const badge = {
  height: {
    small: 20,
    medium: 24,
  },
  paddingX: {
    small: spacing.xs,
    medium: spacing.s,
  },
  gap: {
    small: spacing.xxs,
    medium: spacing.xxs,
  },
  radius: radius.round,
  borderWidth: 1,
  /** Diameter of the optional leading dot. */
  dotSize: 6,
} as const;

export const card = {
  padding: {
    none: 0,
    small: spacing.s,
    medium: spacing.m,
    large: spacing.l,
  },
  /** Vertical padding of the header strip; horizontal follows the body. */
  headerPaddingY: spacing.s,
  radius: radius.m,
  borderWidth: 1,
  gap: spacing.s,
} as const;

export const input = {
  height: controlHeight,
  paddingX: {
    small: spacing.xs,
    medium: spacing.s,
    large: spacing.s,
  },
  radius: radius.s,
  borderWidth: 1,
  focusRingWidth: 3,
  /** Gap between the field and its label or helper text. */
  labelGap: spacing.xxs,
  fontSize: {
    small: fontSize.s,
    medium: fontSize.m,
    large: fontSize.l,
  },
} as const;

export const component = {
  button,
  badge,
  card,
  input,
} as const;

export type ComponentTokens = typeof component;
