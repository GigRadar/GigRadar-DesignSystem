---
'@uiuxjoseph/theme': minor
'@uiuxjoseph/ui': minor
---

Add component-level design tokens and CSS custom properties.

Every component now reads its metrics from a CSS variable with the design token
as fallback — `height: var(--gr-button-height-medium, 36px)` — so an app can
retune a component without forking it or overriding the `style` prop. Apps that
set nothing are unaffected.

New: `component` export from `@uiuxjoseph/theme`, and 42 component variables
covering Button, Badge, Card, and Input (Input's tokens land ahead of the
component). 143 CSS variables in total.

Component sizes are derived from the spacing and type scales, not extracted
from Figma — the guidebook contains no component specs. Replacing them later is
a visual change, not an API change.
