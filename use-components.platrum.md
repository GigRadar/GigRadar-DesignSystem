| Name | Value |
|----------|----------|
| Platrum Page | https://gigradar.platrum.com/wiki/page/1422-use-components |
| Platrum Page Title | Design System — Using Components |
| Last edit date | %github_edit_date% |
| Last edit by | %github_author_username% |

# Overview

This is the guide for **using** the GigRadar Design System in an app — home,
dashboard, crm, or inbound. It covers installing the packages, importing
components, and reading the documentation.

If you need to **build something the system does not have yet**, that is the
companion article: [Design System — Building New
Design](https://gigradar.platrum.com/wiki/page/1423-build-design).

The point of the system is narrow and worth stating plainly: a color, a spacing
step, or a button drawn twice will drift. Anything visual is defined once and
imported everywhere else.

| Package | What it holds |
|---|---|
| `@gigradar/theme` | Colors, typography, spacing, radius, shadow, per-component metrics |
| `@gigradar/ui` | The single import surface — every component the apps use |
| `@gigradar/eslint-plugin` | Rules banning hardcoded values and legacy antd imports |

# Current version

| Package | Version |
|---|---|
| `@gigradar/ui` | 2.1.1 |
| `@gigradar/theme` | 2.1.0 |
| `@gigradar/eslint-plugin` | 1.0.0 |

## Coming from `@uiuxjoseph/*`

The packages were published under `@uiuxjoseph` before the design system moved
to the GigRadar organization. Those versions stay on the registry, so nothing
breaks until an app chooses to move. To move:

1. Find-and-replace `@uiuxjoseph/` with `@gigradar/` across the app.
2. Add the `.npmrc` routing line (step 2 below).
3. `npm install @gigradar/ui @gigradar/theme`.

The ESLint rule prefix follows the package name, so `@uiuxjoseph/no-hardcoded-values`
becomes `@gigradar/no-hardcoded-values`.

## What changed in 2.1.0

Additive only — nothing to migrate.

The CRM Inbox arrives: the room list and its cards, the account selector, the
advanced search panel, mark-as-read, sync and import, push notifications, and
the websocket indicator. Alongside them the smaller marks they are built from —
`StagePill`, `SelectTick`, `ScheduleMark`, `PlanBadge`, `SignalIcon`,
`HighlightedText` — each exported on its own so a screen can draw one without
rebuilding it.

`DatePicker` and `PlanBadge` are generic and filed under Components ▸ Main. The
Inbox parts are under Components ▸ CRM ▸ Inbox parts, and each is also
documented in place on the screen that draws it.

`SettingsPanel` gains a `footer` slot, and `Tooltip` gains `align`
(`center` | `start` | `end`) for cards much wider than their anchor.

## What changed in 2.0.0

Two renames affect existing code:

```diff
-<Button variant="subtle">v2</Button>
+<Button variant="third">v2</Button>

-<Button tone="remove" onClick={doDelete}>Remove</Button>
+<Button tone="danger" onClick={doDelete}>Remove</Button>
```

`Button`'s `subtle` variant is now `third` — the name Figma already used for it.
The `remove` tone merged into `danger`, and the merged tone keeps `remove`'s
behaviour: a filled button deepens from soft coral to full red on hover, where
`danger` previously held its colour. If you have filled `tone="danger"` buttons,
they now darken on hover.

`IconButton` has its own `subtle` variant. That is a different component and is
unaffected — its variants are `ghost` (the default, transparent), `subtle` (pale
badge blue), and `solid` (brand blue). Its `outlined` variant was dropped, along
with the `borderColor` prop it existed for.

# Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node | `>=18` | CI runs 20. There is no `.nvmrc`, so set your version manager yourself. |
| npm | 9+ | Ships with Node 18+. |
| GitHub PAT | classic, `read:packages` | Required even to *read* the packages. |

# Installation

## 1. Authenticate

The packages are private and hosted on GitHub Packages, which requires
authentication **even to read**. Each developer authenticates once.

Create a **classic** Personal Access Token with the `read:packages` scope only.
Fine-grained tokens do not yet support npm reads from GitHub Packages.

Add it to your **global** `~/.npmrc` — never a file inside a repo:

```ini
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxx
```

**Check it worked:**

```bash
npm view @gigradar/ui version --registry=https://npm.pkg.github.com
```

A version number means you are authenticated. A `404` means you are not — see
**Troubleshooting**.

## 2. Point the scope at GitHub Packages

In the app's `.npmrc` (this file is safe to commit — it holds no secret):

```ini
@gigradar:registry=https://npm.pkg.github.com
```

## 3. Install

```bash
npm install @gigradar/ui @gigradar/theme
```

`@gigradar/ui` declares `react` and `react-dom` as peer dependencies
(`^17 || ^18`), so it uses the app's copy of React rather than bundling a
second one.

**Check it worked:** `npm ls @gigradar/ui` prints the installed version with no
`UNMET PEER DEPENDENCY` warning.

## Staying up to date

Everything in this section is a plain terminal command. Run it from the app's
directory in whatever terminal you already use — macOS Terminal, iTerm,
PowerShell, the one built into VS Code. It needs `npm` and the token in your
`~/.npmrc`, nothing else. No Claude Code, no plugin, no GitHub Actions.

```bash
cd your-app
npm update @gigradar/ui @gigradar/theme
```

**Start here.** One command tells you which of the two updates you need:

```bash
npm outdated @gigradar/ui
```

| Column | Means |
|---|---|
| `Current` | What is installed now |
| `Wanted` | The newest version your caret range allows — safe, additive |
| `Latest` | The newest published version. Above `Wanted` means a major is waiting. |

Then run whichever applies:

| If | Run | Safe? |
|---|---|---|
| `Current` < `Wanted` | `npm update @gigradar/ui @gigradar/theme` | Yes — nothing removed or renamed |
| `Latest` > `Wanted` | `npm install @gigradar/ui@latest @gigradar/theme@latest` | No — read the changelog first |

Two commands rather than one, and deliberately so. A minor version cannot remove
or rename anything, so `npm update` can never break your build. A major can, and
npm refuses to cross one for you — that refusal is the safety. Collapsing both
into "always install the latest" would mean a developer reaching for a bug fix
could land a breaking change, and find out when their build failed rather than
when they chose.

### Why `npm install` alone does nothing

`npm install @gigradar/ui` writes a caret range — `"@gigradar/ui": "^2.0.0"` —
which allows every patch and minor. But the range is only half the story:
`package-lock.json` pins the exact version, and **`npm install` respects the
lock**. A new minor will not arrive on its own; `npm update` is what moves it.

## When to update

There is no schedule to keep. Run `npm update @gigradar/ui @gigradar/theme`
when:

- A component or prop you expected is missing — you may simply be behind.
- The gallery shows something your app does not have.
- You are starting a feature and want current components.
- A release announcement says a fix you need has shipped.

That is the whole workflow. One command, no pull request, no review step — a
design system upgrade is not a code change anyone needs to approve, because a
minor version cannot remove or rename anything.

**Why there is no bot doing this for you.** Dependabot and Renovate can run
`npm update` on a schedule, but neither can commit to `main` on its own — they
open a pull request. That pull request lands in the same queue as real work, so
automating a one-command task costs a review instead of saving one. For a team
this size that is a worse trade, which is why it is not set up.

The exception is an app nobody touches for months: there, a scheduled bot is
the only thing that keeps it from falling several majors behind. If that
becomes the situation, add Dependabot to that repo alone rather than to all
four.

## 4. Mount the provider

Once, at the app root:

```tsx
import { GigRadarProvider } from '@gigradar/ui';

export function App() {
  return (
    <GigRadarProvider>
      <YourApp />
    </GigRadarProvider>
  );
}
```

The provider injects the tokens as CSS custom properties. Because it owns token
delivery, a token change reaches an app as a `@gigradar/ui` version bump rather
than a code change in each of the four repos.

**Check it worked:** run the app, open DevTools, and look for a
`<style id="gigradar-tokens">` element in `<head>`. Or in the console:

```js
getComputedStyle(document.documentElement).getPropertyValue('--gr-color-brand')
```

An empty string means the provider is not mounted, or is mounted below the
component you are inspecting.

## 5. Turn on the lint rules

```bash
npm install -D @gigradar/eslint-plugin
```

```js
// eslint.config.js
const gigradar = require('@gigradar/eslint-plugin');

module.exports = [
  {
    files: ['**/*.{ts,tsx}'],
    plugins: gigradar.configs.recommended.plugins,
    rules: {
      '@gigradar/no-hardcoded-values': 'warn',
      '@gigradar/no-direct-antd-import': 'error',
    },
  },
];
```

`no-hardcoded-values` at `warn` rather than `error` is the recommended starting
point for an existing codebase — see **Lint rules** below.

# How to Use

## Per component

Every component is imported from `@gigradar/ui` and from nowhere else.

```tsx
import { Button, Icon, IconPlus } from '@gigradar/ui';

<Button variant="secondary" startIcon={<Icon icon={IconPlus} size={16} />}>
  Add filter
</Button>
```

Do not import from `antd` or any other kit. Some apps still carry antd 4.x in
their dependency tree from before the design system existed; reaching into it
bypasses the system. If something you need is missing, say so rather than
working around the wrapper — see **When something is missing**.

## Per feature section

Larger screens are composed from feature components that already carry their
own layout, states, and behaviour. Rather than assembling a screen from
primitives, take the feature component and pass it data:

```tsx
import { UpworkConnectedAccounts } from '@gigradar/ui';

<UpworkConnectedAccounts
  accounts={accounts}
  capacity={10}
  apiConnected={apiConnected}
  selected={selected}
  onSelectionChange={setSelected}
  onAuthorize={startOAuth}
/>
```

These live under feature folders — `UpworkAccounts`, `UpworkApiKey`, `Inbox`,
`Notification`, `Prompt`, `AutoReply`, `MentionPreset`, `SettingsPanel`. Each
one is a screen or a band of a screen that Figma drew as a unit.

## Tokens

Never hardcode a color, spacing, radius, font size, or shadow — including "just
this once".

```tsx
import { color, spacing, radius, textStyle } from '@gigradar/theme';

// Correct
<div style={{ color: color.main.brand, padding: spacing.m, borderRadius: radius.s }} />

// Wrong
<div style={{ color: '#378AFA', padding: 16, borderRadius: 8 }} />
```

Available token groups:

| Import | Holds |
|---|---|
| `color` | `main`, `status`, `stage`, `stageFlat`, `accent`, `navbar`, `badge`, `integration`, `disable`, `proposal`, `avatarTone` |
| `typography` | `textStyle`, `fontFamily`, `fontWeight`, `fontSize`, `letterSpacing`, `lineHeight` |
| `spacing`, `radius`, `shadow`, `borderWidth` | The scales |
| `component`, `controlHeight` | Per-component metrics — `component.button.paddingX`, etc. |

> **Watch out:** `spacing` and `radius` share T-shirt names but are different
> scales. `spacing.s` is 12; `radius.s` is 8. `spacing.m` is 16; `radius.m` is
> 12. They are intentionally separate — do not substitute one for the other.

Tokens are also emitted as CSS custom properties (`--gr-color-brand`) for
places a React import cannot reach, such as a stylesheet or a third-party
widget.

# How to Read the Documentation

Run the gallery:

```bash
npm run dev     # http://localhost:5173
```

## Navigating

The sidebar is grouped into **Foundations** (tokens, icons, lifecycle),
**Components** (split into Main and CRM), and **CRM** — the assembled screens,
which today are Settings and Inbox. Guide rails connect a parent to its children
so nesting is traceable. There is a search box at the top that filters pages by
name.

## Finding a component

The package exports several hundred names across dozens of gallery pages, so
browsing is not the fastest route. In order of speed:

1. **Search the gallery** — the box at the top of the sidebar filters pages by
   name as you type.
2. **Search the barrel** — `packages/ui/src/index.ts` lists every export in one
   file. If it is not there, it is not in the system.
3. **Search the Tokens page** — for a value rather than a component. It matches
   on token name *and* value, so pasting a hex from a mockup finds its token.

Feature components are grouped by the screen they belong to (`UpworkAccounts`,
`Inbox`, `Prompt`), so if you know the screen you can find the component.

## A component page

Each page carries the same bands, in this order:

| Band | What it tells you |
|---|---|
| Header | What the component is, the problem it solves, the Figma node |
| Preview | The live component, in each state that matters |
| Code | The snippet to paste |
| Props | Every prop, its type, its default, and what it is for |
| Cross-links | Related components and the screens that use it |

The **Tokens** page renders every token live and is searchable by name *or*
value — paste a hex from a mockup and it finds the token.

# Lifecycle: Development vs Ready

A component can be built and visible in the gallery long before it is approved.
A reader with no way to tell will use whatever they can see, so the stage is
marked explicitly.

## The three stages

| Stage | Badge | Meaning |
|---|---|---|
| `stable` | Green — "Stable" | In the system. Safe to use; changes are additive. |
| `development` | Amber with a dot — "In development" | Drawn and built, **not** approved. Do not ship. |
| `deprecated` | Grey — "Deprecated" | Still works, being removed. Use the replacement. |

The amber badge carries a leading dot by default. That is deliberate: it is the
stage a reader must not skim past, and the dot is what catches the eye in a
column of headings that are otherwise all text.

## What each stage means for you

Check the badge before you use a component.

- **Stable** — use it. Breaking changes arrive as a `major` version bump with a
  changelog entry saying what to change.
- **In development** — do not ship it. It is visible so it can be reviewed, and
  it may change shape or disappear entirely before it is approved. An
  in-development component does not get a normal page: no live example, no
  usage snippet, no props table, because all three read as "this is ready".
- **Deprecated** — it still works, but it is being removed. The page names the
  replacement; move to it before the next major.

If you need an in-development component *now*, say so rather than copying its
source into your app — that is the fastest way to get it prioritised, and a
copy will diverge the moment the real one lands.

# Lint Rules

Two rules ship in `@gigradar/eslint-plugin`:

| Rule | Recommended default | Catches |
|---|---|---|
| `@gigradar/no-hardcoded-values` | `error` | Hex colors, raw px, magic spacing numbers |
| `@gigradar/no-direct-antd-import` | `error` | `import { Button } from 'antd'` |

The plugin's own `configs.recommended` sets both to `error`. An app adopting the
rules on an existing codebase will usually want `no-hardcoded-values` at `warn`
first: switching it straight to `error` on a codebase that predates it means
either a broken build or a batch of rushed edits — and the second is how a real
token bug gets hidden among mechanical ones. Warn, fix incrementally, promote to
`error` once the count reaches zero.

`no-hardcoded-values` accepts an `allowIn` option for paths that legitimately
hold literals:

```js
'@gigradar/no-hardcoded-values': ['warn', { allowIn: ['src/legacy/'] }]
```

# The Claude Code Plugin

The design system ships a **Claude Code plugin** so the rules apply while code
is being written, rather than being caught in review.

**It is optional, and it does not install or update anything.** The plugin
ships rules to the AI assistant — it has no hooks and no commands, so it cannot
touch your `node_modules`. A developer who does not use Claude Code installs and
updates exactly the same way, with `npm install` and `npm update`. What the
plugin adds is an assistant that checks the installed package before telling you
a component does not exist, and that notices when your app is behind.

The marketplace manifest lives at `.claude-plugin/marketplace.json` in the
design system repo; the skill itself is `skills/design-system/SKILL.md`. Add the
marketplace in Claude Code and enable the `design-system` plugin.

The skill activates whenever UI is being written or reviewed in any GigRadar app
— building components, styling anything, picking colors or spacing, or importing
from antd. It carries three rules:

1. **Import UI from `@gigradar/ui`** — never antd, never another kit.
2. **Never hardcode a color, spacing, radius, font size, or shadow** — every
   visual value comes from a token, with no exceptions.
3. **Say what is missing** rather than reaching around the wrapper.

# Troubleshooting

## `404 Not Found` when installing

```text
npm error code E404
npm error 404 Not Found - GET https://npm.pkg.github.com/@gigradar%2fui
npm error 404  ... could not be found or you do not have permission to access it.
```

**This is an auth failure, not a missing package.** GitHub Packages returns
`404` rather than `401` for private packages you cannot see, so the message is
misleading — the package exists. Check, in order:

1. Is the token in your **global** `~/.npmrc`, not the repo's?
2. Is it a **classic** PAT? Fine-grained tokens do not support npm reads from
   GitHub Packages.
3. Does it have the `read:packages` scope?
4. Has it expired? Tokens are commonly issued for a year.
5. Does the app's `.npmrc` have `@gigradar:registry=https://npm.pkg.github.com`?

## `UNMET PEER DEPENDENCY: react`

`@gigradar/ui` requires React `^17 || ^18`. On React 19 or 16, npm either
refuses to install or installs a second copy of React, which breaks hooks with
"Invalid hook call". Align the app's React version rather than forcing the
install with `--legacy-peer-deps`.

## Tokens are undefined at runtime

`color.main.brand` is `undefined`, or a CSS variable resolves to an empty
string. Usually one of:

- **`GigRadarProvider` is not mounted**, or is mounted *below* the component
  reading the token. It belongs at the app root.
- **Two copies of `@gigradar/theme`** in the tree — check `npm ls @gigradar/theme`.
  A duplicate means one copy is initialised and the other is what your import
  resolves to.

## `npm error code EBADENGINE`

The packages require Node `>=18`. CI runs Node 20. There is no `.nvmrc`, so
nothing corrects your version automatically — set it yourself with `nvm use 20`
or the equivalent.

## The lint rule fires on something legitimate

`no-hardcoded-values` flags string concatenations like `` `1px solid ${color.x}` ``
even though the color is a token. Use the `allowIn` option for paths that
legitimately hold literals rather than disabling the rule:

```js
'@gigradar/no-hardcoded-values': ['warn', { allowIn: ['src/legacy/'] }]
```

# When Something Is Missing

Do not reach around the wrapper. A component that exists in one app's local
folder is a divergence that will be found later and cost more to remove.

If what you need is not in `@gigradar/ui`, that is the trigger for the companion
article: [Design System — Building New
Design](https://gigradar.platrum.com/wiki/page/1423-build-design).
