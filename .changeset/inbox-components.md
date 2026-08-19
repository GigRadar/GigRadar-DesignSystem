---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Add the components CRM ▸ Inbox is built from.

`InboxList` is the left column — the header, the account picker, the search
band, and the connection pill pinned to the foot — and takes the rooms as
children. The six states Figma draws for the column (default, load rooms, empty,
first load, searching, onboarding) are what a consumer passes in rather than
variants of the frame: they differ in what fills the list, not in how the frame
is drawn.

`InboxEmpty`, `InboxLoading`, and `InboxOnboarding` are those fillers, exported
so a screen does not reinvent them. `InboxEmpty` covers both "no conversations"
and "no matches" — the card is identical and only the words differ.
`InboxLoading` draws its rows through `InboxRoom`'s own `loading` state, so the
placeholder and the real card cannot drift in height, which is the entire point
of a skeleton. `InboxOnboarding` is deliberately separate from `InboxLoading`:
one waits on a request returning in a moment, the other on a job long enough to
need its stages named, and skeleton rows there would promise rooms that are not
coming yet.

`InboxRoom` is one conversation. Every line is clamped to one row and the card's
height is fixed, so a long job title and a long message cannot push the next
room down the list — scanning depends on the rows staying where the eye expects
them.

Its Figma states (node 43:3835) are modelled as axes rather than a single
union: how the card is being read (`selected`, plus hover), whether the list is
picking (`selecting` and `checked`), and whether the room is unavailable
(`disabled`, `error`, `loading`). A union would make "selected and scheduled" or
"ticked while erroring" unrepresentable when both really occur. In selection
mode the unread counter gives way to a round tick and the sender drops off the
preview, because the row stops being about who spoke last. `scheduled` marks a
room that already carries a queued message.

Hover fills the card with the badge tint and drops its border — the border is
matched to the fill rather than removed, so the card does not shift by a pixel
as it lights up. Figma also draws two quick actions on hover (reply, open job
post); those are left out until the screen has somewhere for them to go.

`selecting` is a boolean rather than a mode. Figma draws a second, purple set
for picking rooms to schedule a message to, but the column has no action that
starts that flow, so shipping the mode would be shipping a state nothing can
reach.

`InboxRoom` takes an `account` — which connected account (the BM) handles the
room — and draws it as a mini avatar in the client avatar's corner. That mark is
what makes the combined "All accounts" inbox readable: with every account's
rooms interleaved, it is the only thing saying who owns a conversation.
Filtering the list to one account through the selector is the same question
asked the other way round, so the two were built together. It is an object
carrying a name rather than a bare URL, since a photo with no alt text tells a
screen reader nothing about who is handling the room.

`HighlightedText` marks the search query inside a string, and `InboxRoom` takes
a `query` that runs the title and preview through it. The solid
`color.main.highlightSolid` is used rather than the translucent `highlight`:
these matches sit on cards whose own fill changes — white, hover grey, brand
blue when selected — and a translucent wash would come out a different color on
each. Rendered as `<mark>`, so the highlight carries to a screen reader instead
of being decoration only sighted users can act on; the query is escaped before
matching, so searching for "C++" finds something rather than throwing.

`InboxSelector` and `InboxAccountRow` pick which connected account is showing.
The combined "All accounts" view is a real option rather than the absence of a
filter, so it appears in the list alongside the accounts. An account whose token
has expired stays listed but grays out, and its unread count is replaced by a
reconnect prompt — a count that cannot change is not worth showing.

`AdvancedSearch` is the filter panel, with `InboxSearchField`, `MarkAsReadButton`,
and `FilterChip` as its parts. It takes `defaultExpanded`, naming which of the
three filter rows starts open — one name rather than a set, because only one row
is open at a time. Applied filters are summarised as chips along the
top rather than only inside the rows that set them: once a row is collapsed its
selections are out of sight, and a filter you cannot see is one you forget is on.
The chips are also where a filter is removed.

The column's smaller marks are exported too, rather than living inline in
whatever draws them: `StagePill` (a lead's pipeline stage, taking a tone from
`color.stageFlat` so it stays presentational), `SelectTick` (the drawn checkbox
every selectable row shows — round on a room card, square in the filter panel),
`ScheduleMark` (the purple clock on a room with a queued message), and
`NotificationToggle` (the header's bell switch, Figma node 1135:16742). Each was
duplicated across two or three call sites before; each is now one definition
that a screen outside the Inbox can also reach for.

`SelectTick` is deliberately not `Checkbox`: every row it appears in is already
a `<button>`, and a real `<input type="checkbox">` nested in a button is invalid
markup whose click the row then swallows. The row carries `aria-pressed`, so the
state still reaches a screen reader.

`NotificationToggle` grows to 60×36 with a 28px handle, and draws the filled
bell in both states — colour carries on/off, because an outline bell at that
size reads as a smudge beside the filled one. The account dropdown's "Connect
another account" row gains a hover state, taking the same nav tint the account
rows above it use — it is the last row of that list, not a separate control.

`PushNotificationToggle` wraps `NotificationToggle` with the two behaviours that
only make sense together: a hover explainer (Figma node 2426:155901 in the CRM
file) and asking the browser for permission on the way on. The bare toggle stays
the right component wherever permission is already settled and no explanation is
owed. If the browser blocks the request the switch returns to off rather than
lying about a channel that will deliver nothing, and a newly granted permission
fires one sample notification so the person sees what they just enabled.

`Tooltip` gains `align` — `center` (the default, what Figma draws), `start`, or
`end`. A card much wider than its anchor centres half its width past the
anchor's edge, and against the side of a column that half is clipped; the new
values pin the matching edges together instead. `ConfirmTooltip` already had a
narrower version of this for the vertical axis.

`PlanBadge` names the subscription the workspace is on — Figma node 4016:22052.
Filed with the badges rather than with the Inbox because nothing about it is
inbox-shaped; the header it sits in is just the only screen showing a plan today.

`ConnectionIndicator` and `SignalIcon` report the websocket. Four states rather
than a boolean, because "not receiving messages" means three different things to
the person reading it: offline is expected, error is not, and syncing is
temporary. Only error asks for action.

`SelectionBar` is the row shown while the list is in selection mode. It reads off
`selectedCount` rather than taking a state prop — Figma's three states are all
derived from the count, and the count is what a consumer already has.

`DatePicker` is filed under the generic tier: a calendar knows nothing about
conversations, even though the inbox's date filter is what prompted it. Figma's
four variants are the halves of one interaction rather than four separate states
— first click sets the start, second sets the end, third starts over — so that
state machine lives in the component and every range filter behaves the same way.
Two months by default, because the ranges people pick routinely straddle a month
boundary.
