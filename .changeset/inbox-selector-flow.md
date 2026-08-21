---
'@gigradar/ui': minor
---

Cover the whole of the inbox selector's flow.

`InboxAccount`'s `problem` widens from two states to five — `suspended`,
`tokenExpired`, `error`, `removed`, and `notInRoom` (Figma node 3790:64903).
They share one treatment because they answer one question, "why can I not pick
this", and differ only in the words: the row greys out and the reason takes the
unread count's place, since a count is meaningless on an account that cannot
receive anything.

Only `tokenExpired` and `error` offer "Reconnect". A suspended or removed
account is not something reconnecting solves, and `notInRoom` is not a fault at
all — it is an account that simply is not a participant in the room being looked
at, which the Add-to-room picker lists so it can be added. `accountProblems`
exports that mapping so a screen can ask whether a problem is recoverable
without re-deriving it.

An unavailable row is now `disabled`. It is listed so the absence is explained,
not so it can be picked, and a click that quietly did nothing would be worse
than no click at all.
