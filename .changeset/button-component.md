---
'@uiuxjoseph/theme': minor
'@uiuxjoseph/ui': minor
---

Add `Button` and `ComposerButton`, covering the eight Figma button components.

`Button` mirrors the application button (nodes 2573:4267 and 2573:4294): 16px
horizontal padding, 8px vertical, a 6px corner radius, an 8px gap between icon
and label, and 14px medium text. Two variants — `primary` (filled) and
`secondary` (outlined).

Figma draws one button per feature — Meeting (4881:1023), Schedule (4881:1395),
Laziza AI (4884:10597), Cancel (4881:1003) — and they are the same control in a
different color: identical padding, radius, gap, and type. So the feature is a
`tone` rather than a component, and a new one is a row in a table instead of a
new file. Tones: `brand`, `meeting`, `schedule`, `laziza`, `danger`.

Outlined feature buttons stay neutral at rest and pick up their tone on hover,
border and label together, which is what Figma draws. `danger` is the exception
and carries its red outline from the start, since a destructive action should
read as destructive before it is hovered. Disabled outlined buttons are dimmed
with opacity rather than restyled per part, again matching Figma.

Every color comes from the theme tokens. Where the Figma buttons deviate
slightly from the guidebook tokens — Schedule hovers to `#6321A0` vs the token
`#763BAD`, Laziza to `#D57815` vs `#DE7B11`, and Schedule's resting outline is
`#E4EAF5` where the other feature buttons use `#C3CBD3` — the tokens win, so
the tones stay uniform and a token change reaches the buttons.

Figma's "Syncing" is the `loading` prop: it shows a spinner, keeps the label so
the button does not change width as work starts, takes the disabled palette, and
marks the button inert and `aria-busy`. `startIcon` / `endIcon` render into fixed
square slots that never shrink, so an icon cannot stretch the button.

`ComposerButton` is the Message / Note toggle (nodes 100:4694 and 100:4695), kept
separate because the shape differs rather than the color: no border, transparent
until hovered or selected, 12px semibold rather than 14px medium, and its state
is `selected` or not — no disabled or loading state is drawn for it. The two
marks Figma draws are built in: `laziza` renders the Note tab's spark (orange at
rest, white when selected) and `info` the circled-i badge (outlined at rest,
inverting to a filled white circle with a blue glyph when selected). Both glyphs
are SF Symbols in Figma, which do not exist on the web — the paths are Figma's
own SVG exports of those text layers, tinted via `currentColor`.

Metrics are exposed as typed style props — `paddingX`, `paddingY`, `radius`,
`borderWidth`, `fontSize`, `gap`, and `iconSize` — each writing its matching
`--gr-button-*` variable rather than a concrete style, the same mechanism
`Avatar` uses. Numbers are treated as px and any other unit passes through.

`@uiuxjoseph/theme` gains `component.button` and the `ButtonSize` type.

Three sizes, with `medium` as the drawn one; `small` and `large` extend the scale
proportionally and are the one part of the button tokens not traceable to Figma.
