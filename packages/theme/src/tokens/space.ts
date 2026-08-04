/**
 * GigRadar spacing, radius, and shadow tokens.
 *
 * Extracted from the Figma guidebook (nodes 4363:1776 spacing,
 * 4363:1801 radius, 4363:1774 shadow).
 */

/**
 * Spacing scale, in px.
 *
 * Note this scale is NOT the same as `radius` — they share T-shirt names but
 * differ at S (12 vs 8) and M (16 vs 12). They are intentionally separate.
 */
export const spacing = {
  xxs: 4,
  xs: 6,
  s: 12,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 64,
  /** "SXXL" in Figma — the largest step, for page-level section gaps. */
  sxxl: 128,
} as const;

export type SpacingToken = keyof typeof spacing;

/**
 * Border radius scale, in px.
 *
 * DECISION (reversible): Figma's ROUND is 100000000, a sentinel for "fully
 * round". Emitted as 9999px, which pills any realistic element without risking
 * overflow in layout math.
 */
export const radius = {
  xxs: 2,
  xs: 6,
  s: 8,
  m: 12,
  l: 24,
  xl: 32,
  xxl: 64,
  round: 9999,
} as const;

export type RadiusToken = keyof typeof radius;

/**
 * Elevation.
 *
 * Figma has exactly one shadow — a four-layer stack named "Tooltips Shadow",
 * despite being used more broadly. Reproduced layer for layer.
 */
export const shadow = {
  /**
   * The single GigRadar elevation. Four stacked drop shadows.
   * Figma name: "Tooltips Shadow".
   */
  base: [
    '0px 0.27px 3.53px rgba(0, 0, 0, 0.035)',
    '0px 0.75px 9.77px rgba(0, 0, 0, 0.05)',
    '0px 1.81px 23.51px rgba(0, 0, 0, 0.067)',
    '0px 6px 78px rgba(0, 0, 0, 0.10)',
  ].join(', '),
  none: 'none',
} as const;

export type ShadowToken = keyof typeof shadow;
