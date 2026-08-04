---
'@uiuxjoseph/ui': minor
---

Add `Box`, `HStack`, and `VStack` — layout as props instead of style objects.

    <HStack gap="s">
      <Avatar name="Ada Lovelace" />
    </HStack>

rather than

    <div style={{ display: 'flex', gap: spacing.s }}>

Spacing props take a token name — `gap="s"` resolves `spacing.s` — so app code
stays on the scale without importing it, and `gap="nope"` is a type error
rather than a silently missing gap. Numbers remain available as an escape
hatch for genuinely one-off values (`gap={20}`), and are treated as px.

`Box` covers flex layout (`display`, `flexDirection`, `alignItems`,
`justifyContent`, `flexWrap`, `flex`), padding and margin with the usual
shorthands (`p`, `px`, `py`, `pt`…), and sizing. `HStack` and `VStack` are
`Box` with the flex defaults filled in. Anything not listed is forwarded to the
element, so `onClick`, `id`, and ARIA attributes work as normal, and `as` picks
the tag.

Deliberately layout-only: no color, typography, or border props, because those
belong to the components that own them.

Why a component rather than props on a plain `div`: `display=` and `gap=` on a
`div` are invalid DOM attributes — React warns and the browser ignores them.
`Box` resolves the tokens and emits a single `style` attribute.
