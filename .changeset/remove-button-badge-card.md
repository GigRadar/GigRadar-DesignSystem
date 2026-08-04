---
'@uiuxjoseph/ui': major
'@uiuxjoseph/theme': major
---

**Breaking:** remove `Button`, `Badge`, and `Card`.

`@uiuxjoseph/ui` now exports `Avatar`, `AvatarGroup`, and `GigRadarProvider`.
Their component tokens (`component.button`, `component.badge`, `component.card`,
`component.input`) and the corresponding `--gr-*` CSS custom properties are
removed from `@uiuxjoseph/theme`.

Anything importing these will fail to compile after upgrading. They were built
before component specs existed in Figma, so their metrics were inferred from
the spacing and type scales rather than extracted; removing them clears the way
to rebuild from real specs.

Color, typography, spacing, radius, and shadow tokens are unaffected.
