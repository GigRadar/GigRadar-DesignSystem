---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Inbox: the chat thread, its composer, and the scheduled and meeting surfaces

The CRM ▸ Inbox thread gains the components it draws. `BubbleChat` carries the
message and its delivery state, with `ChatAction` on hover — download only where
there is an attachment to download, and edit and delete only inside the hour
after sending, since a message Upwork has already delivered cannot be recalled.
Incoming bubbles get the hover fill but only the download action, because the
rest are not yours to perform.

`Composer` replaces the message field: rich-text marks with their shortcuts on
both platforms, an attachment row that previews uploads while they are in
flight, and a schedule control beside send. On mobile the marks collapse behind
a chevron rather than wrapping, trading them against the attach and meeting
controls for the width they need.

`ChatRoom` sticks the date separator to the top of the thread while it floats,
dropping the shadow once another separator meets it, and narrates its own empty
and notice states.

Scheduled messages get `ScheduledBadge`, `ScheduleMessageModal`, and a room that
rings its bubbles purple and keeps their actions indefinitely — nothing has left
the server yet, so the hour limit does not apply, and Send now and Reschedule
join the set. `MeetingBubble` draws a meeting through propose, booked,
rescheduled, cancelled, ended, and recording, with the details it happens to
carry passed as rows rather than folded into the state.

`Avatar` now scales its initials to a custom `diameter`. Text sized for the
named size overflowed a smaller circle — a 20px avatar drew its two letters at
the medium size and spilled them past the edge.

`DatePicker` gains a month dropdown and single-chevron navigation, for pickers
that never need to cross a year.
