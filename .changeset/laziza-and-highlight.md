---
'@gigradar/theme': minor
---

Rename `accent.amber` to `accent.laziza`, matching Figma exactly so the name is
searchable in both places.

Encode the highlight colors at their Figma opacity. `main.highlight` and
`main.highlightSelect` are now `rgba(…, 0.35)` rather than opaque hex; the
underlying solid fills remain available as `main.highlightSolid` and
`main.highlightSelectSolid`.
