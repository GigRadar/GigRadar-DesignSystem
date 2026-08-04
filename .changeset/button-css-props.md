---
'@uiuxjoseph/ui': minor
---

Bring `Button` to the same prop surface as `Avatar` and `Box`.

`Button` gains `background`, `textColor`, `borderColor`, and `fontWeight`,
matching the color props added to `Avatar`. Each writes its `--gr-button-*`
variable and falls back to the resolved variant/tone palette, so a prop
overrides the pair without restating it — and `style` stays unaccepted, since
the props are the customisation surface.

Also documents the eight Figma button variants in the gallery. Each feature
button (Meeting, Schedule, Laziza AI) is drawn as eight named variants — Main
and 2nd, each in Active, Hover, Disable, and Syncing. Those are the two
variants crossed with the four states, which the component already reaches
through `variant` plus `disabled`/`loading`, so this is a documentation gap
rather than a missing API. Hover is shown as a live button to point at rather
than a frozen style, because it is a real pointer state.
