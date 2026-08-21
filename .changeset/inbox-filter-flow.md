---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Follow the Inbox filter and mark-as-read flows documented in the CRM file.

The filter panel follows node 9930:159252. A client query matching nothing hides
the dropdown rather than showing an empty one — an empty list reads as "loading"
where absence reads as "nothing by that name". Already-picked clients and stages
drop out of their dropdowns: they are chips in the band above, and offering them
again offers a no-op. The stage rows lose their checkbox, since the pill itself
is the control and Figma draws no box beside it.

The date row offers three named spans — Today, Last 7 days, Last 30 days — plus
`Custom` (exported as `CUSTOM_PRESET_ID`), which is the only thing that opens the
calendar. Most date filtering is "recently", which a preset answers in one click;
a calendar under every visit makes the common case scroll past the uncommon one.

The filter's meaning is now recorded on the panel and in the gallery, because
none of it is visible from the control: "last activity" is the room's **last
message** — stage changes, notes, and assignment move a room around the pipeline
without anyone having said anything in it — and a custom range **includes both
endpoint days in full**, so 1 May – 7 May runs 00:00 on the 1st to 23:59 on the
7th. An exclusive end would silently drop the last day, which reads as a bug to
anyone who picked it on a calendar.

Every span is read in the viewer's own timezone rather than the client's or UTC.
A room's last activity is a moment in time, but "today" is a question about the
reader's day. The row says so under its title — `dateDescription`, defaulting to
"Filter by last activity · your time" — because a filter that silently used a
different clock would quietly disagree with the timestamps on the cards.

"Clear all" gains a hover fill — it drops every filter at once, so it should feel
like a button being pressed rather than a link being read. An empty summary band
shows a "No filters active" pill so the band keeps its height and the panel does
not jump as the first filter goes on. `panel.widthMobile` (379px) carries the
phone width from Figma's mobile flow.

`MarkAsReadButton` gains `cancel`, swapping the double-check for the ✕ that
leaves selection mode. It is the same button in the same place because it is the
same control seen from the other side — the one that turned selection on is what
turns it off, and moving the exit elsewhere leaves the person hunting for the way
back. `InboxList` flips it automatically with `selectionMode`.

`InboxRoom`'s selection tick moves to the leading edge, before the avatar (node
8487:27438). In selection mode the question is "which of these", and a column of
ticks down the left scans in a way one tucked behind each preview does not. A
ticked card fills brand blue like the open one — both mean "this is the row you
are acting on" — with the tick inverting so it stays visible, and the unread
counter keeps its place so nothing shifts as the mode changes.

The unread counter and the schedule mark both survive being ticked. The counter
inverts on the filled card, since a brand-blue disc on a brand-blue card would
disappear; the schedule mark keeps its purple, because that purple identifies
the scheduling flow wherever it appears and recolouring it per card state would
make the mark say "scheduled, on a selected row" rather than "scheduled". They have separate lifetimes
and separate actions: selecting a room is not reading it — only "Mark as read"
drops `unread` to zero — and a queued message stays queued until it actually goes
out. Neither should vanish because the other happened, and the counter was
previously being hidden by the selection fill.
