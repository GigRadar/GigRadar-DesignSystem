---
'@gigradar/ui': minor
'@gigradar/theme': minor
---

Room type and Create BM room (BF-3481).

- New `RoomTypeTag` (`oneToOne` / `businessManager`, with a `loading` bar) and `roomTypeLabels`.
- `ChatHeader` takes optional `roomType` and `roomTypeLoading`, drawing the tag at the head of the meta row.
- `AddBmInfo` takes an optional `busyLabel` (defaults to "Adding"), and `managerName` is now optional — omitted, the manager chip is dropped.
- `HeaderMetaTag` gains a `meeting` variant.
- New `CreateBmRoomModal` and `CreateBmRoomConfirm`: the confirmation before a one-to-one room starts a Business Manager room.
- Theme: `component.middle.roomType` and `component.middle.createBmRoom` tokens.
