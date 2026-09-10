---
'@gigradar/ui': minor
---

NavPanel: the app's left navigation rail

One entry per product area, each a round icon plate above a label — Figma node
2712:30773. The rail down the left edge of every CRM screen, and the bar along
the bottom on mobile.

Figma draws four states: desktop, mobile, and an onboarding variant of each
where every area but one fades. Those are two props rather than four variants.
Desktop and mobile differ only in which way the entries flow, so that is
`orientation`; the onboarding states are the same rail with `highlight` set.
Holding them as variants would mean four copies of one layout, and a change to
an entry would have to be made in all of them.

The rail is stateless — it draws whatever `selected` says and reports presses
through `onSelect`, so the current area stays wherever it already lives rather
than being duplicated here.

`NavPanelItem` ships alongside it for a screen that needs one entry on its own.
