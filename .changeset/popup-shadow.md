---
'@uiuxjoseph/theme': minor
'@uiuxjoseph/ui': minor
---

Add the `popup` shadow and a matching Card variant.

`shadow.popup` (`0 6px 12px rgba(0,0,0,0.05)`) is extracted from Figma's "Popup
Border" style. It is deliberately tighter than `shadow.base` — a dropdown needs
a crisp edge to read as detached, where `base`'s 78px spread makes a surface
feel part of the layout.

`<Card variant="popup">` uses it. The shadow emitter now iterates every
elevation, so future additions need no change there.

The gallery gains a CSS properties table per component with a live override
editor, and generates the stylesheet snippet for whatever you change.
