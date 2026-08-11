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

Also adds `ModalCard`, `ModalHeader`, `ModalContent`, and `ModalFooter` —
the dialog shell from Figma node 2077:8840, extracted so every dialog is built
from the same three bands rather than each redrawing them.
