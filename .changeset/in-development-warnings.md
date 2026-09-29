---
'@gigradar/ui': patch
---

Mark the BF-4111, BF-4113 and BF-3481 parts as in development. Their designs are not signed off yet, so their props and look may still change in a minor release.

- Every new export carries an `@experimental` JSDoc tag, shown on hover in the editor: `PromptSetup`, `PromptTemplatePicker`, `promptSaveState`, `promptBlanks`, `samePrompt`, `DEFAULT_PROMPT_GUIDANCE`, `DEFAULT_PROMPT_PLACEHOLDER`, `AutoReplyNote`, `ReplyRateStat`, `StopRuleList`, `defaultStopRules`, `ReplyTemplatePicker`, `RoomTypeTag`, `roomTypeLabels`, `CreateBmRoomModal` and `CreateBmRoomConfirm`. So do the new props `ChatHeader.roomType` and `roomTypeLoading`, `AddBmInfo.busyLabel`, and `AutoReply`'s `details`, `renderPrompt`, `optionsDirection` and `dirty`.
- Each new component logs one console warning per page load the first time it renders, naming its ticket. Production builds skip it.
