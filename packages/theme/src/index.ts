/**
 * @gigradar/theme — the single source of truth for GigRadar design tokens.
 *
 * Values are extracted from the Figma guidebook
 * (file HNZEuaniWtXmEINBodTtal, node 4363:1685).
 *
 * Two consumption formats, one source:
 *   1. `tokens`          — plain TS objects, usable anywhere
 *   2. `renderCssVars()` — CSS custom properties, for stylesheets
 *
 * This package has NO runtime dependencies, so charts, utils, and build
 * scripts can import it freely.
 */

export { color, main, disable, navbar, badge, status, accent, stage, stageFlat, deprecated } from './tokens/color.js';
export type { ColorTokens, StageName } from './tokens/color.js';

export {
  typography,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  textStyle,
} from './tokens/typography.js';
export type { TypographyTokens, TextStyleName } from './tokens/typography.js';

export { spacing, radius, shadow } from './tokens/space.js';
export type { SpacingToken, RadiusToken, ShadowToken } from './tokens/space.js';

export { buildCssVars, renderCssVars } from './css-vars.js';

import { color } from './tokens/color.js';
import { radius, shadow, spacing } from './tokens/space.js';
import { typography } from './tokens/typography.js';

/**
 * Every token under one object, for ergonomic destructuring:
 *
 *   import { tokens } from '@gigradar/theme';
 *   const { color, spacing } = tokens;
 */
export const tokens = {
  color,
  typography,
  spacing,
  radius,
  shadow,
} as const;

export type Tokens = typeof tokens;
