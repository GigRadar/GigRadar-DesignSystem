---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Add `LifecycleBadge`, and the modal header props the in-development proposals
needed.

`LifecycleBadge` marks how far along a component is — `stable`, `development`,
or `deprecated` — so the gallery can show something that is built but not yet
approved without it reading as ready to use.

`ModalHeader` gains `closeSize`, `reserveCloseSpace`, and `titleWidth`. The
first two keep a header the same height whether or not it carries a close
button, which matters on a dialog that gains one as it resolves; the third lets
a header whose title block carries its own right-aligned content reach the
card's edge.
