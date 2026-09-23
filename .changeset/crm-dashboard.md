---
'@gigradar/ui': minor
'@gigradar/theme': minor
---

Dashboard: the CRM's numbers screen, left side

The funnel and the lead pipeline — Figma node 447:3878. Six components plus the
bands that lay them out, and a `component.dashboard` token block behind them.

`FunnelStat` is one step of the funnel — a rate, its movement against the
comparison period, and the counts it is derived from (Figma's "Section
Content", node 751:7118). Its sub-metrics are a list rather than two named
props: what they count changes per step, so naming them would bake one step's
vocabulary into every other. It carries Figma's loading state, drawing a grey
bar per line rather than a spinner, so the band keeps its shape while it fills.

`FunnelChart` and `FunnelCallout` have no Figma component behind them and are
drawn here. The chart is a shape, not a chart: no axes, no gridlines, no ticks,
no library. Every number on the screen is already written out in the stats
above it, so the band's job is the drop-off's shape, and anything that invited
reading a value off it would promise a precision it does not have. The callouts
— FRT, TRR, OHR — float over it because they are properties of how the team
works the funnel rather than steps a lead passes through.

`KanbanBoard` is one stage (node 2010:2069) with the four states Figma draws.
Only two of them speak: an empty stage is ordinary, and six columns each
explaining their emptiness would bury the columns that have leads in them.
`KanbanCard` is one lead in it (node 1994:5317), reusing the room list's
`StagePill` and the generic `Avatar` a step smaller — six columns sit side by
side, and at the Inbox's sizes a board would hold two cards before scrolling.

`DateRangeField` is the period everything is scoped by. It is a trigger around
the existing `DatePicker`, not a second calendar: both ends sit in one box
because a range is one value, and two fields invite picking an end without the
other.

The bands — `DashboardHeader`, `FunnelSection`, `FunnelStatsBand`,
`PipelineBand`, and the `TitleSelect` that puts a choice inside a heading's
sentence — are the layout. Both bands keep their columns on one row and shrink
them together as the width drops, rather than wrapping: the funnel is a
sequence ending at the closing rates, and the pipeline is a sequence ending at
Closed, so a column on a second row is a column out of order. They scroll only
once every column has been squeezed to its own minimum, past which a card's
title has room for about two words a line.

The chart is lifted under the stats rather than stacked after them. The band is
as tall as its tallest column — the one holding both closing rates — so every
other column ended well above its foot and left a stripe of white between the
numbers and the curve. `chart.overlapY` pulls the chart up into that stripe,
and `chart.overlapHeadroom` holds the curve off the box's own top so the lift
only ever closes empty space and the band cannot run behind a figure.

`FunnelSection` owns the column rules and runs them the full height of the
numbers and the chart together. A rule stopping at the foot of the figures cut
the section in two and left the chart looking like a separate panel beneath it;
running down, the rules frame it and the chart reads as floating under the
columns.

The Task Feed column down the right is not built yet.
