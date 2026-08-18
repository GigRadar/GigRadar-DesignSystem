---
'@gigradar/theme': major
'@gigradar/ui': minor
---

Add the components CRM ▸ Settings ▸ Upwork API Key is built from.

`TextField` is the system's single-line input — the first one the design system
has — carrying its own label, a `secret` mode with a reveal control, and an
`error` prop that takes either a flag or a message. It sits under Components ▸
Main because nothing about it knows what a CRM is.

`ApiStatus` is the card above the credential form: six states on one shape, with
the detail rows passed as data so the divider, the spacing, and the secret
masking are the component's job rather than each screen's. `TestStatus` reports
what a key test came back with, `RemoveApiButton` is the strip that closes the
card, and `ViewGuide` and `RentApiBanner` are the two reference cards.

`UpworkApiKey` assembles them into the screen. `show` draws one column or both,
mirroring `UpworkColumns` on the connected-accounts screen rather than inventing
a second vocabulary for the same idea — each column is a coherent unit, and
rendering one should not mean rendering the other and cropping it. Figma draws five states and all
five are this one composition with parts switched off — `loading` swaps the
blocks for skeletons, `hideForm` drops the form once a key is saved, and
`testTone` drives both the result strip and whether the actions are live — so
there is no variant prop.

**Breaking:** `color.navbar.textActive` is renamed `color.navbar.text2`, matching
Figma's "NavBar/Text-2". The old name described a nav state, but the color is
drawn on plenty of things that are not nav items — a settings card's label, a
detail row's value — so it named only the first place it was used.

The old name is removed outright rather than kept as an alias, so an app reading
`color.navbar.textActive` (or the `--gr-color-navbar-text-active` custom
property) fails to compile until it is updated. Values are unchanged — `text`
#6C82A4, `text2` #2D323E — so nothing repaints; the 43 usages in this repo are
migrated.

`RemoveApiButton` draws in `status.error` rather than the deprecated `errorAlt`
red Figma paints it with, which shifts it one step. It is the only place these
components depart from the drawing.

Adds a `borderWidth` scale — `hairline` 0.5, `thin` 1, `medium` 1.5, `thick` 2 —
and moves the twenty raw `1px solid` borders across the package onto `thin`.
Not from the Figma guidebook, which documents no border scale; these are the
widths the components were already drawing, given names, so retuning the
hairline is one edit rather than twenty. No visual change.

The status card's detail rows carry an accepted drift from the drawing: Figma
paints them #516F90 / #33475B as raw hex bound to no style, and they are built
from the nav text pair (#6C82A4 / #2D323E) instead — a step lighter in both
cases. The design system is the authority, and a two-off pair does not earn
tokens of its own.
