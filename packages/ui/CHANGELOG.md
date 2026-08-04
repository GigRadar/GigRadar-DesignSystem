# @gigradar/ui

## 0.2.0

### Minor Changes

- f70ac86: Initial release.

  - `@gigradar/theme` — design tokens extracted from the Figma guidebook, in two
    consumption formats: TS objects and CSS custom properties.
  - `@gigradar/ui` — Button, Badge (including the nine CRM pipeline stages), Card,
    and GigRadarProvider.
  - `@gigradar/eslint-plugin` — `no-hardcoded-values` and `no-direct-antd-import`.

### Patch Changes

- caae3aa: Encode the remaining Figma color styles.

  - `main.highlightSelect` — the selected match within a search result set
  - `navbar.hoverStrong` — high-contrast hover for dark nav surfaces
  - `badge.border` — a distinct badge outline, lighter than the foreground
  - `accent.laziza.hover`

  Badge now uses `badge.border` for its brand tone outline rather than reusing
  the foreground color.

- Updated dependencies [f70ac86]
- Updated dependencies [03667c9]
- Updated dependencies [9b1ba7e]
- Updated dependencies [caae3aa]
  - @gigradar/theme@0.2.0
