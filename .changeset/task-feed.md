---
'@gigradar/ui': minor
'@gigradar/theme': minor
---

Task Feed: the CRM dashboard's right-hand column

Everything waiting on the user, newest first — Figma node 473:6454, with the
card at 733:4475, its buttons at 476:4785, and the stage marker at 431:11969.
Five components and a `component.taskFeed` token block behind them.

`TaskFeed` is the rail. Fixed at 328px rather than sharing the dashboard's
width: the feed accompanies the numbers, and a column that grew with the window
would take width from the funnel it sits beside. Cards come in as children
rather than as a `tasks` array — what a task is differs per stage, and a prop
would have to describe every one of those shapes before the column could draw
one.

`TaskFeedCard` writes its body once and lets state change only its edge and its
cover. Figma draws five bordered variants over one identical body; as five
variants in code that would be five copies of the same three lines of text. The
border is transparent by default so a card does not shift by a pixel when a
state gives it one, and the description is held at a fixed two lines so the
column does not jump as tasks of different lengths arrive and complete.

`snoozed` and `completed` cover the card rather than replacing its content. The
card is on its way out of the column, and swapping what is inside it would
change its height on the way, shifting every card below while the confirmation
is still being read.

`StageIcon` is the disc at the head of each card. The disc is the stage's color
at a fifth strength and the glyph is the same color at full, so the two read as
one mark rather than an icon dropped on a swatch — mixed toward white rather
than set as an alpha, because the marker sits on the card's own tint and a
transparent disc would pick that up and shift per state. `closed` and
`mentioned` set `$` and `@` as text: those characters are already the symbols
for a deal's value and for being named in a thread, and an icon of either would
be a picture of a letterform. `fallback` is the one stage on white — it stands
for a task with no stage, and a tint would invent one.

`TaskFeedButton` is not the design system's `Button`. That one is sized to be
the thing you came to the screen to press; these two sit at the foot of every
card in a scrolling column, so they are quiet and only darken under the pointer.
A rail of ordinary buttons would read as a rail of calls to action.

The empty and coming-soon states draw a glyph on a tinted disc rather than
Figma's 64px spot illustrations. The rail is narrow and both moments are
ordinary — a caught-up feed is the good outcome, not an error — so an
illustration gives them more ceremony than they earn, and commits the set to a
second art style to keep in step with the icons. The disc is the same badge
pair the Inbox's own empty state uses, so these read as part of the product
rather than as a place it stops.

`TaskFeedEnd` closes a list that still has cards in it, which is why it is
separate from the empty state: a rule under the last card, not a panel
replacing it. A rule either side of the words rather than a heading — it marks
the end of the run, and a heading would read as the start of another section.
