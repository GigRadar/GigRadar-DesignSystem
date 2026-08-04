/**
 * @gigradar/theme — the single source of truth for GigRadar design tokens.
 *
 * Values are extracted from the Figma guidebook
 * (file HNZEuaniWtXmEINBodTtal, node 4363:1685).
 *
 * Three consumption formats, one source:
 *   1. `tokens`               — plain TS objects, usable anywhere
 *   2. `getAntdV4ModifyVars()` — antd v4 Less variables, for the build config
 *   3. `renderCssVars()`      — CSS custom properties, for stylesheets
 *
 * This package has NO runtime dependency on React or antd, so charts, utils,
 * and build scripts can import it freely.
 */

export { color, main, disable, navbar, badge, status, accent, stage, stageFlat, deprecated } from './tokens/color';
export type { ColorTokens, StageName } from './tokens/color';

export {
  typography,
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  textStyle,
} from './tokens/typography';
export type { TypographyTokens, TextStyleName } from './tokens/typography';

export { spacing, radius, shadow } from './tokens/space';
export type { SpacingToken, RadiusToken, ShadowToken } from './tokens/space';

export { antdV4LessVariables, getAntdV4ModifyVars } from './antd/v4';

export { buildCssVars, renderCssVars } from './css-vars';

import { color } from './tokens/color';
import { radius, shadow, spacing } from './tokens/space';
import { typography } from './tokens/typography';

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
