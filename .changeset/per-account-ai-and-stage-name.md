---
'@gigradar/ui': minor
'@gigradar/theme': minor
---

Per-account AI settings, and the stage event's name at max width

Two reviews decided, both on the same answer.

BF-4280 — a team running several Upwork profiles in unrelated niches had one
team-level prompt and one team-level auto-reply mode, so any single value was
right for one profile and wrong for the others. `AccountRow` is the list item
that scopes them: click an account and its settings unfold directly underneath,
so the account being edited stays in view above the field. What the row opens is
a slot, because the prompt screen and the auto-reply screen list the same
accounts and set different things on them — `AccountIdentity` is the part that
does not differ, shared so the two cannot drift.

A list rather than tabs or a side panel. Tabs do not survive fifty accounts —
they cannot wrap, and a scrolling strip hides the one being looked for — and a
side panel spends width the settings page does not have once its two columns
stack. The list's own cost is height: with a long panel open the accounts below
are pushed off the fold, which is accepted because the screen is used one
account at a time.

`RoomEvent` now clips the "by …" name at `roomEvent.byMaxWidth` instead of
letting it wrap. An event is one line; a name long enough to wrap pushed "by"
onto a second row and turned an inert marker into a two-row block in the middle
of the thread, and "Multiple" stacks three of them. The clipped name is not
recoverable, which is the accepted cost — the alternative was a hover target on
a row that is otherwise inert, and it would have carried nothing on a touch
screen anyway. Figma draws the ellipsis (node 8945:23018).

Both surfaces are ordinary gallery pages now rather than reviews, and Stage
Update in Room joins the nav under Chat Room — it was only ever reachable
through its review Artifact before.
