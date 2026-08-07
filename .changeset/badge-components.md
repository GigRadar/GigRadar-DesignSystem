---
'@uiuxjoseph/theme': minor
'@uiuxjoseph/ui': minor
---

Add four badge components, each in three sizes.

`CreditBadge` (Figma 1282:28608), `EyebrowBadge` (163:10), `CounterBadge`
(313:6469), and `RankBadge` (333:15163). They are separate components rather
than variants of one — a credit amount, an AI eyebrow, an unread count, and a
rank with its direction of travel share a pill shape but nothing else.

Figma draws only the medium step of each; small and large extend those scales
proportionally.

Also extracts the duplicated `len` / `CssLength` helper from Button and Avatar
into a shared internal module.
