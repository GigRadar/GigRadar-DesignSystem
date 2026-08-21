---
'@gigradar/theme': minor
'@gigradar/ui': minor
---

Give push notifications their own section, and cover the rest of the flow.

`NotificationToggle` gains `caption`, drawing Figma's "Turn On" pill (node
2426:154627). For the first run, before anyone has answered the permission
prompt: a bare switch says a setting exists, while the words say what turning it
on would do. Once permission is settled the caption is dropped, since by then
the control is a setting rather than an invitation. A captioned pill grows to
fit its words; a bare one holds the switch's own width so the handle has
somewhere to travel.

`OsNotification` previews a browser notification as the operating system draws
it — six renderings across Windows and macOS (Figma nodes 2452:9832 onward).
Presentational only, and deliberately so: the browser owns that chrome, a page
supplies a title, a body, and an icon and nothing else. It exists so copy can be
reviewed where it lands, because the words are the only part the product
controls and the space they get differs by platform — a title that fits Safari
can be cut by Chrome. Chrome and Edge name themselves above the site, Firefox
names only the site, and Safari attributes in its own chrome and shows neither.
