---
'@uiuxjoseph/theme': minor
'@uiuxjoseph/ui': minor
---

Drop the white ring from `AvatarGroup`, and express its overlap as a spacing token.

The ring is gone — each avatar's own border now reads as its edge, rather than
being wrapped in a second one.

**Breaking for `AvatarGroup`:** the `overlap` prop is replaced by `gap`. Where
`overlap` was a fraction of the avatar size (`overlap={0.2}`), `gap` is a
spacing token whose negative form overlaps: `gap="-xs"` is the default, pulling
each avatar 6px over the one before it. Positive tokens space them apart
(`gap="s"`), and a raw number still works as an escape hatch.

A fixed step rather than a ratio, so the overlap stays put when the avatars are
resized — under the old scheme a `large` group overlapped more in absolute
terms than a `small` one, for no reason anybody asked for.

`component.avatar.groupOverlap` (0.2) is replaced by `component.avatar.groupGap`
(-6). The `--gr-avatar-group-overlap` CSS variable is gone with it; the gap is
now a prop rather than a variable, since it is a per-row decision.
