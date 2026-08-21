---
'@gigradar/ui': minor
---

Give the Inbox a phone layout, and the settings rail a footer.

`InboxScreen` owns which of the three panes is on screen. On a desktop all
three are; on a phone one is, and the room's back chevron returns to the list.
`layout` is a prop rather than a media query because this package ships no
stylesheet and the app already knows its own breakpoints — it also lets the
gallery draw both layouts side by side, which a media query cannot.

The panes not showing are not rendered, rather than hidden with CSS. Three
mounted panes would keep three scroll positions alive and let a hidden one's
focus trap the keyboard.

`InboxList` gains `fluid`, filling the width it is given instead of holding the
column's 328px: on a phone the list is the whole screen, and a fixed column
would leave a gap down one side. The panes are otherwise identical at either
size — a room card is the same card — which is why the shell owns the decision
rather than each pane checking its own width.

`SettingsPanel` gains `footer`, filling the rail's foot (Figma node 3804:2263).
The sync tracker goes there rather than on any one settings page, because an
import is a background job that outlives whichever page is open: starting it
from Upwork API and then walking to Notifications should not lose sight of it.
It hides while collapsed, where there is no room for anything but the icons.
