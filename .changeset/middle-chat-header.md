---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Add the chat room's header — the first components of CRM ▸ Inbox ▸ Middle.

`ChatHeader` is the band across the top of the conversation (Figma node
3523:37230). Figma draws it as four variants across two axes, and it is built as
two independent props rather than one four-way union: `layout` (`desktop` /
`mobile`) is decided by the shell, and `scheduled` by the surface. A single
`variant` string would make every caller reassemble it from two facts it already
holds separately, and would make "mobile and scheduled" a name to remember
rather than a combination that falls out.

`layout="mobile"` is not the desktop header narrowed. A back chevron replaces
the sidebar toggle, the meta tags keep their glyph and drop their label, and the
three trailing controls collapse to one info button — at 402px there is room for
a mark but not for a name.

The header draws none of its own controls. Each interactive part is its own
exported component, because each is the same decision wherever a header band is
drawn and a second copy would drift:

`MenuButton` is one round control (node 3523:37499) — the same button draws
filter-chat, view-message, and view-job-posting, differing only by glyph and by
what it opens. Hover and selected are one fill rather than two, since what
separates them is duration and not appearance: selected outlives the pointer,
and reports that the surface it opened is still showing. Hover is tracked in
state rather than left to CSS, because the component styles inline and the
filled hover is a drawn state in Figma rather than a tint a browser would
approximate. Its count badge is omitted at zero: a badge reading zero reports
something where there is nothing to report.

`LeadStageButton` is the lead's stage (node 3523:37527), in eleven stages and
two sizes. Figma files it as a badge, but every instance carries a chevron and
opens the stage menu, so it is built as a button and `interactive={false}` is the
badge. Figma draws only the L size; `m` is added at 24px for rows that cannot
spend 30px on a pill. The type size does not change between them — 12px is
already the smallest step the label reads at, so `m` trims the box instead of
the text.

`FilterChat` is the popover the filter button opens (node 4486:31137). Figma's
two frames are not variants: "Hide" is the same panel with nothing ticked, so the
component takes the selection and both drawings fall out of it. The trailing
action reads for the direction it would move — "Hide all" with everything on,
"Show all" otherwise — so a mixed selection is one press from complete rather
than two. `defaultChatFilters` ships the three kinds Figma draws, exported rather
than baked in: the filterable kinds belong to the product.

`AddBmInfo` is the band offering to add the Business Manager (node 3541:29473),
which is also what the header's `addBusinessManager` prop draws under it. `adding`
is a prop rather than internal state — whether the manager actually joined the
room is known by whatever owns the room, and a spinner that cleared itself would
clear before the room changed.

`HeaderNavButton`, `HeaderMetaTag`, and `AutoCancelSwitch` are the three parts
Figma does not file separately, exported anyway for the same reason. The nav
button is bare where `MenuButton` is ringed, which is what separates them: this
one leaves the surface, and the round buttons act on it. `HeaderMetaTag` renders
as a `<button>` with `onClick` and a `<span>` without, because a focusable
element that does nothing is worse than a plain one. `AutoCancelSwitch` is
outlined in the Schedule Messages purple rather than the brand blue — it belongs
to the scheduling surface, not to the room.

Two stages are added to `color.stage.lost` and `color.stageFlat`: `wrongTarget`
and `alreadyEquipped`, which the Lead Stage Badge draws and the palette did not
carry. Figma gives all three lost stages the same fill and distinguishes them by
label; they are named separately anyway so a screen can key off the stage it
means, and so a later divergence is a token change rather than a new name.
`accent.laziza.backgroundSoft` is added for the wash the filter popover gives its
AI row — warmer than `background`, and drawn only there.
