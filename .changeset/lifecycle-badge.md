---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Add `LifecycleBadge` — the marker that says whether a component is part of the
design system yet.

Three stages (`stable`, `development`, `deprecated`) and three variants
(`solid`, `subtle`, `outline`), one per place the marker appears: a page
heading, a section inside an already-marked page, and a sidebar row.

The gallery's `Section` takes a `stage` prop that draws it. A component shown
as `development` is built and visible but not approved; it graduates when its
pull request is reviewed and merged, and the marker comes off.
