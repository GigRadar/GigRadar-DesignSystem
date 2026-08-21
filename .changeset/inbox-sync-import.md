---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Add the room list's sync-and-import state.

`SyncProgress` (Figma node 2966:18086) stacks two readings of the same thing: a
headline saying what is happening right now, and a three-step tracker saying
where that sits in the whole run. A long import needs both — the headline
answers "what is it doing", the tracker answers "how much is left" — and neither
alone is enough. It fills the room list as its children, the same slot the empty
and loading states use, because importing is a phase the whole column is in
rather than a control inside it.

Four phases, and the fourth is deliberately not called "error": `blocked` means
the import stopped and is waiting on the person — reauthorising an account,
usually — and it resumes once that is cleared. It takes the warning tone rather
than the error one for the same reason.

`SyncTrack` (node 2965:18056) draws the steps as one row alternating mark, rail,
mark. The rails belong to the track rather than to the steps either side of
them: a rail has to end exactly where the next mark begins, and a step laid out
on its own cannot know where that is. Each rail carries the colour of the step
it leaves, so the line changes hue at the mark it has reached. Labels sit in a
second row on the same flex rule, absolutely centred over each mark, so a label
wider than its mark overhangs evenly instead of pushing the marks apart. That
row carries an explicit height: an absolutely positioned label takes its parent
out of the flow, and without one the row measures zero and whatever follows the
track rides up against the words.

`SyncStep` is the mark and label alone, exported for a screen wanting one on its
own. Each step carries its own `icon` — an envelope for preparing, a download
arrow for the import — because the state colours the mark while the glyph says
which step it is; a `warning` overrides it, since a stopped step matters more
than what it was doing.

The panel draws no padding of its own: it sits inside the room list's already
padded column, and inset again it would be narrower than the search field above
it.

`SyncBanner` (node 3312:24083) takes its message as children rather than a
string. Every variant Figma draws carries an inline link — "contact our team",
"dismiss it now" — and a component that owned the copy would have to own those
handlers too.

`color.accent.notice` carries the banner's blue, which is neither the brand nor
`status.info`: a quieter wash for a note that explains rather than alerts.
