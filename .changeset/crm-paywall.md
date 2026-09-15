---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

CRM: the paywall — plan cards, the billing switch, and the locked modal

`Paywall` is the screen-level component: give it the plans and where the
workspace stands, and it draws the modal. Figma's three periods are one layout
with three answers to the same question — what is this workspace allowed to do
right now — so they are a `period` prop rather than three screens. A paying
workspace gets its own card marked `current` and the rest relabelled as
upgrades; the other two periods get a locked badge and a row of offers. The
rented-key banner appears only for a paying workspace, because someone who has
not chosen a plan has a more immediate decision in front of them.

`PlanCard` is one component for Basic, Pro and Unlimited. They are the same
card at the same width with the same rows, and what differs is the accent
colouring the edge, the bullets and the button — three files would be three
places to fix the next time a row is added to all of them. Every plan lists
every feature, with the ones it does not include left on the card in grey: what
a cheaper plan does *not* buy is the argument for the dearer one, and dropping
those rows would leave three cards of different heights saying nothing about
each other.

`SubscriptionSwitch` and `PaywallSwitchButton` take their segments as children
rather than a list of cycles. Figma's own component carries Quarterly and
Semi-annual hidden beside Monthly and Annual, so which cycles a product sells
is the product's question. Only the cycle that saves money carries a pill,
which is what makes it an argument rather than a label.

`PlanBadge` gains a `basic` tone and its unpaid tones are corrected to the
Figma node (4016:22047): `trial` and `free` now sit on the nav wash in grey
rather than as a solid fill, because they name a state the workspace is passing
through rather than a plan it is on, and `unlimited` takes the near-black the
Unlimited card is drawn in rather than the brand blue. Each paid tone matches
its plan's card, so a badge in a header and a card in the modal can be paired
by eye.

`color.main.ink` and `color.main.inkSoft` are new — the near-black the top plan
is drawn in, and the navy its feature lists are set in.

The rented-key offer is the shipped `RentApiBanner`, borrowed from the API key
screen rather than redrawn.
