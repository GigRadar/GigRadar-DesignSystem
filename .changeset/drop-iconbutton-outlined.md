---
'@gigradar/ui': minor
---

Drop `IconButton`'s `outlined` variant and its `borderColor` prop.

The variant existed for one caller — the mention preset row's move and delete
actions — and that row now uses `Button` (`third` for the moves, `secondary`
with the danger tone for delete), so nothing reached for it. The remaining three
variants are border-less, so `borderColor` had nothing left to apply to.

`ghost`, `subtle`, and `solid` are unchanged.
