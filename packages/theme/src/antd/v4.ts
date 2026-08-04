import { color } from '../tokens/color';
import { radius, spacing } from '../tokens/space';
import { fontFamily, fontSize, lineHeight } from '../tokens/typography';

/**
 * antd v4 Less variable overrides.
 *
 * antd v4 has no runtime theming — it themes at BUILD time through Less
 * variables. Consuming apps wire this into their build config; see
 * `docs/adoption-antd-v4.md`. There is no `ConfigProvider` equivalent for
 * these, so a change here requires an app rebuild to take effect.
 *
 * Only the components you keep from antd (DatePicker, Table, Select, Form,
 * Upload) need to look right — the identity components come from
 * `@gigradar/ui` and do not read these values.
 */
export const antdV4LessVariables: Record<string, string> = {
  // Brand
  '@primary-color': color.main.brand,
  '@link-color': color.main.brand,
  '@success-color': color.status.success.main,
  '@warning-color': color.status.warning.main,
  '@error-color': color.status.error.main,
  '@info-color': color.status.info.main,

  // Text
  '@heading-color': color.navbar.textActive,
  '@text-color': color.navbar.textActive,
  '@text-color-secondary': color.main.description,
  '@disabled-color': color.disable.text,

  // Surfaces
  '@body-background': color.main.background,
  '@component-background': color.main.white,
  '@background-color-light': color.main.backgroundAlt,
  '@background-color-base': color.main.backgroundAlt,

  // Borders
  '@border-color-base': color.main.border,
  '@border-color-split': color.navbar.border,
  '@border-radius-base': `${radius.s}px`,

  // Typography
  '@font-family': fontFamily.base,
  '@font-size-base': `${fontSize.m}px`,
  '@font-size-lg': `${fontSize.l}px`,
  '@font-size-sm': `${fontSize.s}px`,
  '@line-height-base': String(lineHeight.paragraph),

  // Layout / spacing
  '@padding-lg': `${spacing.l}px`,
  '@padding-md': `${spacing.m}px`,
  '@padding-sm': `${spacing.s}px`,
  '@padding-xs': `${spacing.xs}px`,

  // Disabled
  '@disabled-bg': color.disable.background,

  // Table — one of the components you are keeping from antd
  '@table-header-bg': color.main.backgroundAlt,
  '@table-row-hover-bg': color.navbar.hover,
  '@table-border-color': color.navbar.border,

  // Layout chrome
  '@layout-header-background': color.navbar.background,
  '@layout-sider-background': color.navbar.background,
  '@layout-body-background': color.main.background,

  // Menu / nav
  '@menu-item-color': color.navbar.text,
  '@menu-highlight-color': color.main.brand,
  '@menu-item-active-bg': color.navbar.hover,
};

/**
 * Serializes the variable map for a Less `modifyVars` config.
 * Usable directly in umi's `theme` key or webpack's less-loader options.
 */
export function getAntdV4ModifyVars(): Record<string, string> {
  return { ...antdV4LessVariables };
}
