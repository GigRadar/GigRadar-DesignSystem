---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Fix the post-authorization "What Next?" copy and give the terminal states a
route out (BF-3969).

The success popup listed four things connecting an Upwork account would let you
do — sync jobs and contracts, manage proposals, track earnings and time — none
of which the CRM does. It now lists what connecting actually enables today.

Both terminal states gain a footer action: success routes to the Inbox, failure
offers a retry. A terminal state with nothing to press was the other half of the
defect.

The card now states its outcome once. It said it three times — in the head's
title, again in a large centred status disc, and a third time in the description
under that. The glyph and the heading carry the outcome, the description explains
it, and the disc is gone. This drops `title`, `subtitle`, `countdown`, and the
metrics that only positioned the disc; `heading`, `description`, `panelTitle`,
and `steps` still override the copy.

Panel rows are dotted rather than numbered. A numbered disc puts a row at a
position in an order, which none of these lists claims: success offers two
alternatives, failure lists candidate causes of one failure, and the progress
rows are reminders rather than a checklist. Success also offers its second route
as a button — `onConnectAnother`, drawn `secondary` beside `onGoToInbox` — and
the retry takes the danger tone.

Also adds `ModalCard`, `ModalHeader`, `ModalContent`, and `ModalFooter` —
the dialog shell from Figma node 2077:8840, extracted so every dialog is built
from the same three bands rather than each redrawing them.
