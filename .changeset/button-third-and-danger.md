---
'@gigradar/ui': major
---

Rename the Button's `subtle` variant to `third`, and merge the `remove` tone into `danger`.

Figma already calls the quiet chrome button the "Third button" (node 4893:16258), so `subtle` was a second name for something the design had named. The variant is unchanged — it still fills with the nav grey on hover rather than tinting its border, which is what separates it from `secondary`.

The `danger` and `remove` tones turned out to draw the same button. Their outlined form was identical, and the filled form differed only in whether the fill moved on hover — which is not a distinction between two kinds of destruction, but one behaviour that `danger` was missing. The merged tone keeps `remove`'s: it deepens from the soft coral to a full red as the pointer approaches, because the button destroys something and should feel more serious the closer you get.

Note this changes how existing `tone="danger"` buttons behave. A filled one that previously held its colour on hover now darkens.

`ConfirmTooltip`'s Cancel now uses `variant="third"` rather than `secondary` with its background, border, and text colours overridden to imitate it. Same appearance, but a change to the third button now reaches that Cancel instead of passing it by.

Migrating:

```diff
-<Button variant="subtle">v2</Button>
+<Button variant="third">v2</Button>

-<Button tone="remove" onClick={doDelete}>Remove</Button>
+<Button tone="danger" onClick={doDelete}>Remove</Button>
```

`IconButton` has its own `subtle` variant, which is a different component and is unaffected.
