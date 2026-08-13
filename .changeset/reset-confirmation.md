---
'@gigradar/ui': minor
---

Reset now asks before it discards.

`MentionPresetList`, `AutoReply`, and `AiPromptConfig` each carry a Reset that
threw away every unsaved edit on a single click. That is the same standing as
deleting a preset — irreversible, and sitting in a row of similar-looking
buttons — so it gets the same treatment: the button opens a `ConfirmTooltip`
rather than firing.

Each takes `resetTitle` and `resetDescription`, defaulted to copy naming what
that particular reset discards, since "your changes" means the presets in one
card and the prompt in another.
