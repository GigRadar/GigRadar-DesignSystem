---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Inbox: the details pane — client, meeting, AI configuration, and who is in the room

The CRM ▸ Inbox gains its third column. `DetailsPane` stacks and scrolls; it
holds no section of its own, because which sections a room has is the app's
question — a room with no meeting should not draw an "Upcoming Meetings" header
with nothing under it.

`DetailsSection` is the fold every block shares. The whole header is the hit
target rather than just the chevron: the label is the larger thing to aim at,
and a reader closing a section is aiming at its name. A closed section unmounts
its body instead of hiding it, so a folded "Not in this room" does not leave
four Add buttons in the tab order. Controlled and uncontrolled both work, and
the pane ships no persistence — where the fold is remembered is the app's
decision, and a design system writing to `localStorage` would answer it for
every consumer at once.

`ClientJobDetails` answers one question, in the order it gets answered: who they
are, whether they are awake, how many people they have already talked to, and
what the money looks like. The stat strip sits above the rate table because it
is the part that decides it — six interviews and no hires reads at a glance.
`external` is a state rather than a separate component: a job posted outside
Upwork has no hiring history, so the card carries no stats and no table, which
is different from `error`, a load that can be retried.

`CrmAiConfiguration` is the one card drawn in the Laziza orange with a 1.5px
border. Everything else on the pane is something the reader looks up; this is
the only thing acting on the conversation on its own, so it should be findable
without reading. `off` keeps the message-type badges and greys them, so the
reader can see what would happen if they turned it back on. The prompt version
is shown, not chosen — that choice lives in AI settings.

`RelevanceButtons` draws the pair at rest in the border grey rather than black.
It is feedback the product asks for, not work the reader came to do, so it stays
quiet until pointed at and only commits to a colour once it holds the answer.
The two are equally wide because they are a choice between equals.

`ParticipantRow` carries the role under the name, which is the reason the row
exists — a name alone does not say whether the person typing is the client, your
own BM, or a freelancer you have never met. One component across both lists:
"Participant in this room" and "Not in this room" draw the same row, and what
differs is whether it ends in an Add button.
