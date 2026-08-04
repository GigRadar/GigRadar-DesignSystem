# @gigradar/theme

## 0.2.0

### Minor Changes

- f70ac86: Initial release.

  - `@gigradar/theme` — design tokens extracted from the Figma guidebook, in two
    consumption formats: TS objects and CSS custom properties.
  - `@gigradar/ui` — Button, Badge (including the nine CRM pipeline stages), Card,
    and GigRadarProvider.
  - `@gigradar/eslint-plugin` — `no-hardcoded-values` and `no-direct-antd-import`.

- 03667c9: Add integration and proposal color tokens.

  - `color.integration.slack` and `color.integration.telegram` — brand colors for
    external services, deliberately separate from the semantic tokens.
  - `color.proposal.sent`

  Colors are now documented in six categories: Foundation, State, Surface,
  Domain, Integration, and Legacy.

- 9b1ba7e: Rename `accent.amber` to `accent.laziza`, matching Figma exactly so the name is
  searchable in both places.

  Encode the highlight colors at their Figma opacity. `main.highlight` and
  `main.highlightSelect` are now `rgba(…, 0.35)` rather than opaque hex; the
  underlying solid fills remain available as `main.highlightSolid` and
  `main.highlightSelectSolid`.

- caae3aa: Encode the remaining Figma color styles.

  - `main.highlightSelect` — the selected match within a search result set
  - `navbar.hoverStrong` — high-contrast hover for dark nav surfaces
  - `badge.border` — a distinct badge outline, lighter than the foreground
  - `accent.laziza.hover`

  Badge now uses `badge.border` for its brand tone outline rather than reusing
  the foreground color.
