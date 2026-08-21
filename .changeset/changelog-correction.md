---
'@gigradar/ui': patch
---

Correct two claims in the 2.1.0 changelog that no longer matched the code.

`NotificationToggle` never shipped a `caption` prop. It was written up from a
hidden Figma frame, built, and then removed once that turned out to be the wrong
source — but the changeset describing it had already been written, so the
release documented a prop that does not exist. The bell is the whole affordance;
the hover explainer carries the words.

The room card's sender no longer drops off the preview in selection mode either.
That was true when the tick sat in the trailing slot; the tick now leads the row
and nothing else moves.
