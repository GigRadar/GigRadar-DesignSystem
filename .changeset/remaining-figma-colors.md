---
'@gigradar/theme': minor
'@gigradar/ui': patch
---

Encode the remaining Figma color styles.

- `main.highlightSelect` — the selected match within a search result set
- `navbar.hoverStrong` — high-contrast hover for dark nav surfaces
- `badge.border` — a distinct badge outline, lighter than the foreground
- `accent.amber.hover`

Badge now uses `badge.border` for its brand tone outline rather than reusing
the foreground color.
