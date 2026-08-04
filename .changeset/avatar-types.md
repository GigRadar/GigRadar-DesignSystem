---
'@uiuxjoseph/theme': minor
'@uiuxjoseph/ui': minor
---

Name the six avatar types, and add tokens for the gallery's own chrome.

`Avatar` gains a `type` prop covering the six kinds the component actually has:
`default` (tinted initials), `image`, `placeholder` (the disabled grey state),
and the three service marks `upwork`, `zoom`, and `gigradar`.

The type is still inferred from whichever content prop was given — `src` makes
an `image`, `service` makes that mark, a bare `<Avatar />` makes a
`placeholder` — so existing usage is unchanged. Pass `type` when the design
fixes the kind and it should not follow the data: a `placeholder` set
explicitly stays grey and empty even once a name arrives, where the inferred
one would switch to initials.

New in `@uiuxjoseph/theme`: `component.docs`, holding the metrics for the
gallery's preview panels and tables. These are documentation chrome, not
product tokens — nothing in a GigRadar app should read them — but they keep the
docs off bare numbers and on the same radius scale as the components.
