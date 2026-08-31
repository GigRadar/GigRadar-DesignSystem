---
'@gigradar/ui': patch
---

Stop the advanced search panel being squeezed by the column it hangs from.

The panel is absolutely positioned inside the search band, and an absolutely
positioned box in a flex column takes that container's width — so a 520px panel
anchored to a 328px column arrived 330px wide, with its filter rows crushed.
`width: max-content` keeps it at its own size, and a `max-width` of the viewport
stops it running off a narrow screen.

It overhangs to the right because that is the only direction with room: the
column is the leftmost thing on the screen, so a panel centred or right-aligned
on it would run off the window.
