---
'@gigradar/ui': minor
'@gigradar/theme': minor
---

Add `PromptSetup`, `PromptTemplatePicker` and `promptSaveState` for setting up the CRM custom prompt (BF-4111).

The card no longer arrives holding the default prompt. With nothing written it offers ready templates and "Write my own" in the field's place; a template previews read-only before it fills the field, which stays editable. The field starts empty with an example placeholder, Save stays off while the text is empty, the default, a template with `[blanks]` left, or already saved, an info tooltip lists what a prompt needs, and a one-time "Change this" popup points at the default badge. `promptSaveState` exports the same save rule for callers and servers. New `component.promptSetup` tokens in `@gigradar/theme`.
