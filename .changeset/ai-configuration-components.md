---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Add the components CRM ▸ Settings ▸ AI Configuration is built from.

`AutoReply` and its parts — `AutoReplyModeTab`, `AutoReplyButton`, `ModeBadge` —
draw the reply-mode card. `MentionPreset` and `MentionPresetList` are the
@-mention snippets and the card that orders them. `AiTool` and `AiToolBadge` are
the capability rows. `Radio` is a separate control from `Checkbox` rather than a
variant of it: the difference is the semantics, not the glyph.

`useScrollbar` is a hook rather than a component, because a scrollbar belongs to
whichever box actually scrolls and the only way to style it is CSS on that box —
a `<Scrollbar />` element would have nothing to attach to. It returns the three
pieces a scrolling element needs: a scoped data attribute, the Firefox
properties, and the WebKit pseudo-element rules.

`Button` gains the `third` variant — quiet chrome that fills with the nav grey
on hover instead of tinting its border — and every size now sets `min-height`
from `controlHeight`, so a row mixing inputs, pills, and buttons lines up without
hand-derived padding. `ConfirmTooltip` gains
`align`, which pins the card's leading edge to its anchor's: a card taller than
its anchor centres half of itself outside a scroll container, which then clips
it.
