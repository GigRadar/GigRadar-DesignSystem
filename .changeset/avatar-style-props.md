---
'@uiuxjoseph/ui': minor
---

Expose the avatar's CSS custom properties as typed component props.

`Avatar` gains `diameter`, `radius`, `borderWidth`, `fontSize`, `badgeSize`,
and `badgeRingWidth`; `AvatarGroup` gains `overlap` and `diameter`. Numbers are
treated as px, so `radius={8}` and `radius="8px"` are the same, and any other
unit passes through (`"30%"`, `"2rem"`).

Each prop writes its matching `--gr-avatar-*` variable on the element rather
than setting a concrete style, so a prop, a stylesheet rule, and the token
default stay one mechanism instead of three. Writing variables is also what
lets `badgeSize` reach the badge, which is a separate element further down the
tree. Reach for a prop for a one-off; the variable still covers a whole surface.

Deliberately scoped to the avatar's own metrics — there is no `margin`,
`color`, or layout prop. Existing usage is unaffected: every prop is optional
and omitting it falls through to the token default.
