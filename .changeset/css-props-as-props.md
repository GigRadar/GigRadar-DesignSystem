---
'@uiuxjoseph/ui': minor
---

Expose the remaining CSS properties as typed props on `Avatar` and `Box`.

`style` and `className` are not accepted on these components — the props are
the customisation surface, so anything a caller needs to override has to be one.
The metric props already covered sizing; the colors did not, which left
"tint this one avatar outside the palette" with no supported answer.

`Avatar` gains `background`, `borderColor`, `textColor`, `badgeRingColor`, and
`fontWeight`. Like the existing style props, each writes its `--gr-avatar-*`
variable and falls back to the tone, so a prop overrides the palette without
the palette being restated at the call site.

`Box` gains `background`, `textColor`, `borderColor`, `borderWidth`, `radius`,
`position`, `overflow`, and `textAlign`. `radius` takes a token name
(`radius="m"`) or a number. Setting `borderColor` or `borderWidth` applies
`borderStyle: solid`, since a border with neither renders nothing —
a silent no-op is worse than an opinionated default here.
