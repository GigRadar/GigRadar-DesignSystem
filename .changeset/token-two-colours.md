---
'@gigradar/theme': minor
'@gigradar/ui': patch
---

Add `color.main.gigRadarLogoBackground`, and take the last two hardcoded colors
out of `@gigradar/ui`.

`#191D28` — the navy field sampled from the GigRadar logo asset, so any
sub-pixel gap between the scaled artwork and its clip reads as part of the mark
rather than as a white sliver — was a module-level literal inside `Avatar`. It
is a real value with a real reason, so it becomes a token rather than an
exception.

The mention preset's character counter washed its background with a hardcoded
`rgba(165, 166, 168, 0.1)`, which is `color.disable.text` at 10%. It now derives
that with `color-mix`, so the wash tracks the token if the grey is ever retuned.
