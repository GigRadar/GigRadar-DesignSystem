---
name: design-system
description: GigRadar design system rules. Use when writing or reviewing UI in any GigRadar app (home, dashboard, crm, inbound) — building components, styling anything, picking colors or spacing, or importing from antd.
---

# GigRadar Design System

The design system lives in `@uiuxjoseph/theme` and `@uiuxjoseph/ui`. This skill is
the contract for consuming it. Four apps share these packages — home, dashboard,
crm, and inbound — so a violation in one app is a divergence across the product.

## The three rules

### 1. Import UI from `@uiuxjoseph/ui`

```tsx
// Correct
import { Button, Badge, Card } from '@uiuxjoseph/ui';

// Wrong — bypasses the design system
import { Button } from 'antd';
import { Button } from 'some-other-ui-kit';
```

`@uiuxjoseph/ui` is the single import surface, so an implementation can be
swapped without touching app code.

Some apps still have antd 4.x in their dependency tree from before the design
system existed. Do not import from it. If a component you need is not exported
from `@uiuxjoseph/ui` yet, say what is missing rather than reaching around the
wrapper — see "When something is missing" below.

### 2. Never hardcode a color, spacing, radius, font size, or shadow

Every visual value comes from tokens. No exceptions, including "just this once"
and "it's only a one-off."

```tsx
import { color, spacing, radius, textStyle } from '@uiuxjoseph/ui';

// Correct
<div style={{ color: color.main.brand, padding: spacing.m, borderRadius: radius.s }} />

// Wrong
<div style={{ color: '#378AFA', padding: 16, borderRadius: 8 }} />
```

Tokens are reachable from three places, because a React hook cannot reach
everywhere:

| Context | How |
|---|---|
| React components | `import { color, spacing } from '@uiuxjoseph/ui'` |
| Non-React code (charts, utils, configs) | `import { tokens } from '@uiuxjoseph/theme'` |
| Stylesheets | `var(--gr-color-brand)`, `var(--gr-space-m)` |

Charts are the usual place hardcoded hex creeps in. Use `tokens` there.

### 3. Additive by default

New variants, new props, new tokens are free — ship them in a minor version.

Removing or renaming anything is a breaking change. It requires:
1. Marking the old name `@deprecated` with a pointer to the replacement
2. Keeping it working for at least one minor release
3. Removing it only in a major version

Four apps consume these packages. One bad push must not break all four.

## Tokens

Everything is extracted from the Figma guidebook. Do not invent values.

**Colors** — semantic groups, not a raw ramp:
- `color.main` — `brand`, `description`, `background`, `backgroundAlt`, `border`, `highlight`, `black`, `white`
- `color.status` — `success`, `error`, `warning`, `info`; each has `.main`, `.background`, `.text`
- `color.navbar` — nav chrome only: `text`, `textActive`, `hover`, `background`, `border`
- `color.badge` — `foreground`, `hover`, `background`
- `color.disable` — `background`, `backgroundAlt`, `text`
- `color.accent` — `laziza`, `decrease`, `schedule`, `meetings`
- `color.proposal` — `sent`
- `color.stageFlat` — the nine CRM pipeline stages, keyed by name
- `color.integration` — `slack`, `telegram`; each has `.main`, `.hover`, `.background`, `.border`

`color.integration` holds brand colors owned by Slack and Telegram. Use them
only where the service itself is being represented — a channel badge, a
connection card, an integration toggle. They carry no meaning inside GigRadar's
own UI, so never reach for `integration.slack.main` because a dark purple was
wanted; that is what `accent.schedule` is for.

**Spacing** (px): `xxs` 4, `xs` 6, `s` 12, `m` 16, `l` 24, `xl` 32, `xxl` 64, `sxxl` 128

**Radius** (px): `xxs` 2, `xs` 6, `s` 8, `m` 12, `l` 24, `xl` 32, `xxl` 64, `round` 9999

> The spacing and radius scales share T-shirt names but differ. `s` is 12 in
> spacing and 8 in radius. Do not assume they match.

**Typography** — use `textStyle`, which bundles size, weight, letter-spacing,
and line-height:

```tsx
<span style={{ ...textStyle.mMedium }}>Body text</span>
```

Available: `h1`–`h4`, and `l`/`m`/`s` × `Semibold`/`Medium`/`Regular`.
`mRegular` (14px) is the default body style.

**Shadow** — `shadow.base` is the only elevation. There is no scale.

## CRM stage colors

Pipeline UI must use the `stage` prop rather than picking colors by hand:

```tsx
<Badge stage="qualified">Qualified</Badge>
```

Stages: `new`, `contactLater` (unqualified) · `interested`, `booked`,
`happened`, `qualified`, `converted` (pipeline) · `unreachable`,
`notInterested` (lost).

## Legacy antd

GigRadar no longer builds on antd. Some app repos still list antd 4.x as a
dependency from before the design system existed.

Do not add new antd usage. Do not reach for `theme.useToken()` or
`ConfigProvider` — those are antd APIs and have no role here. Tokens come from
`@uiuxjoseph/ui` or `@uiuxjoseph/theme`, as described above.

When you encounter existing antd usage, leave it alone unless the task is to
migrate it. If you do migrate something, note that our component APIs differ
from antd's — our `Button` uses `variant="primary"` where antd used
`type="primary"`, and `variant="danger"` where antd used a `danger` boolean.

## Deprecations in effect

- `color.deprecated.errorAlt` — use `color.status.error`. Figma had two
  near-duplicate reds; `#FA3737` is canonical.

## When something is missing

If a component, variant, or token you need does not exist, do not work around it
with a hardcoded value or a one-off local component. Say what is missing and
what you would add. The design system is meant to grow — additions are cheap,
divergence is not.
