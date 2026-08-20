# @gigradar/eslint-plugin

## 1.0.0

### Major Changes

- 80a7d67: **Breaking:** the package scope is now `@gigradar`.

  The design system moved to the GigRadar organization, so the packages are
  renamed from `@uiuxjoseph/*` to `@gigradar/*`. The ESLint rule prefix follows
  the package name, so the rules become `@gigradar/no-hardcoded-values` and
  `@gigradar/no-direct-antd-import`.

  Consuming apps need one find-and-replace and an `.npmrc` routing line pointing
  `@gigradar` at GitHub Packages. The old `@uiuxjoseph/*` versions stay
  published, so nothing breaks until an app chooses to move.
  See docs/handoff-to-gigradar-org.md.

## 0.2.0

### Minor Changes

- f70ac86: Initial release.

  - `@gigradar/theme` — design tokens extracted from the Figma guidebook, in two
    consumption formats: TS objects and CSS custom properties.
  - `@gigradar/ui` — Button, Badge (including the nine CRM pipeline stages), Card,
    and GigRadarProvider.
  - `@gigradar/eslint-plugin` — `no-hardcoded-values` and `no-direct-antd-import`.
