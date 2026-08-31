---
'@gigradar/theme': patch
'@gigradar/ui': patch
---

DatePicker: hug the calendar to its dates, and close the gap in a selected range

The calendar card now sizes to the grid it draws instead of to whatever holds
it. Dropped into a flex column — how every filter row stacks its contents — the
default `align-items: stretch` had been pulling the card out to the container's
full width, stranding a 224px grid inside a 454px card. `alignSelf`/`justifySelf`
opt out of that stretch in both flex and grid parents.

`datePicker.cellWidth` drops 36 → 32 and `datePicker.monthGap` drops `xl` → `l`,
trimming the two-month picker from 568px to 504px without crowding the 24px
day chip.

A selected range also no longer breaks at its endpoints. The pale band stopped
at each endpoint cell's edge, leaving a notch of white beside the solid chip;
the endpoint cells now carry a half-cell gradient on the side facing the range,
so the band runs continuously behind the chip.
