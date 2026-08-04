# Component CSS properties

Every component reads its metrics from a CSS custom property with the design
token as the fallback:

```css
height: var(--gr-button-height-medium, 36px);
```

If nothing sets the variable, the token value applies — so an app that does
nothing gets the design system's defaults. If an app sets the variable, that
wins, without forking the component or fighting the `style` prop.

## Overriding

Set the variable on any ancestor. Scope it as tightly as the change deserves:

```css
/* Everywhere in this app */
:root {
  --gr-button-radius: 4px;
}

/* Only inside one region */
.compact-toolbar {
  --gr-button-height-medium: 28px;
  --gr-button-padding-x-medium: 8px;
}
```

Because these cascade, a section can restyle its controls without touching
anything global.

## Available properties

**Button** — `--gr-button-`
`height-{small,medium,large}` · `padding-x-{small,medium,large}` ·
`gap-{small,medium,large}` · `radius` · `border-width` · `focus-ring-width`

**Badge** — `--gr-badge-`
`height-{small,medium}` · `padding-x-{small,medium}` · `gap-{small,medium}` ·
`radius` · `border-width` · `dot-size`

**Card** — `--gr-card-`
`padding-{none,small,medium,large}` · `header-padding-y` · `radius` ·
`border-width` · `gap`

**Input** — `--gr-input-`
`height-{small,medium,large}` · `padding-x-{small,medium,large}` ·
`font-size-{small,medium,large}` · `radius` · `border-width` ·
`focus-ring-width` · `label-gap`

> Input tokens exist ahead of the component, so the values are settled before
> it is built.

Colors, spacing, radius, typography, and shadow are also available as
`--gr-color-*`, `--gr-space-*`, `--gr-radius-*`, `--gr-font-*`, and
`--gr-shadow-base`. 143 variables in total.

## Where these numbers come from

**Colors and typography are extracted from Figma. Component sizes are not.**

The Figma guidebook documents colors, type, spacing, radius, and shadow, but
contains no component specs — no button heights, no input padding. The sizes in
`packages/theme/src/tokens/components.ts` are derived from the spacing and type
scales to be internally consistent, and they are the one part of this package
that does not trace back to a Figma value.

When component specs are added to Figma, replace those numbers. That is a
visual change, not an API change — the variable names stay the same, so no
consuming app breaks.

## When to use a variable and when to use a prop

Use the **prop** for a choice the design system offers: `size="small"`,
`variant="ghost"`. That is the supported vocabulary.

Use a **CSS variable** to retune the system for an app or a region — a denser
toolbar, a squarer corner radius throughout. If you find yourself overriding
the same variable in many places, that is a signal the token itself is wrong;
change it here rather than in each app.

Do not use variables to make one component look like a different component.
That is divergence with extra steps.
