---
'@gigradar/ui': minor
'@gigradar/theme': minor
---

Auto Reply mode clarity (BF-4113). `AutoReply` gains a `details` slot under its mode row, `renderPrompt` to replace or drop the additional-prompt block, `optionsDirection` to stack the modes on a phone, and `dirty` for edits made inside `details`. New: `AutoReplyNote` (one line on what the open mode does and where its result shows up), `ReplyRateStat` (the AI-first vs person-first reply rate), `StopRuleList` with `defaultStopRules` (the fixed, read-only stop rules), and `ReplyTemplatePicker` (a minimal template picker for all other replies, to be replaced by BF-4111's). Theme: `component.autoReply.optionsGap`, `details`, `stopRule` and `templatePicker` tokens.
