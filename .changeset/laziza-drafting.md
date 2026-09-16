---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Laziza drafting: the mention menu and the suggested-reply card

Typing `@laziza` in the composer opens the team's saved mention presets; picking
one fills the composer with that preset's prompt, which the user edits before
sending. Laziza thinks, then answers — sometimes with a reply drafted for the
client. Figma node 3451:37876, flow 7219:55390.

`MentionMenu` lists the presets saved in AI Configuration. It is deliberately
not `MentionPreset`, which is the settings-list row: that one carries move,
delete and a priority badge, all controls for *managing* presets, and a menu
offering them would be a settings screen opened over a conversation. Same data,
two surfaces, two jobs.

`DraftCard` is the card a draft arrives in, across `drafting` and `draft`. It is
not a `BubbleChat` and could not be one: a bubble is a message that happened,
and a draft is a proposal about one. The dashed edge is that distinction, and
the controls sit inside the card because the draft and the things you do to it
dismiss together — a row of buttons orphaned under a bubble has to answer which
bubble it belongs to.

The drafting dots fade rather than animate in sequence, so the state still reads
in a screenshot, a test, and a print.
