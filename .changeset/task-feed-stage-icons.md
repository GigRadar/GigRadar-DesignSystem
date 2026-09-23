---
'@gigradar/ui': minor
---

Icons: the seven the Task Feed's stage marker needs

The Task Feed's `StageIcon` (Figma node 431:11969) marks each card with the
stage it came from. Five of its seven variants draw an icon, and four of those
had nothing in the set to draw with: no hand, no heart, no telephone, and
nothing crossed out with a slash rather than an X. The other two variants set
`$` and `@` as text, so they need no icon at all.

`raise-hand`, `heart`, and `phone` land in both weights. Only the fill is
needed today — the stage marker is a tinted disc with a solid glyph — but the
set pairs its weights, and an icon that arrives alone tends to stay alone.

`nosign` has no pair. It is a circle with a slash and the slash *is* the
drawing; a stroke weight would be the same picture at a different thickness.
Following `mentioned` and `warning`, an unpaired icon carries no suffix.

`nosign` keeps its SF Symbols name rather than becoming `slash-circle`. The
existing `x-cirlce-round-*` is the neighbouring idea — a circle with an X —
and two names as close as `x-circle` and `slash-circle` would be picked
between by guessing.

These are the stage marker's icons only. The Task Feed's own components are
not built yet.
