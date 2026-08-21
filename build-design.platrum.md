| Name | Value |
|----------|----------|
| Platrum Page | https://gigradar.platrum.com/wiki/page/1423-build-design |
| Platrum Page Title | Design System — Building New Design |
| Last edit date | %github_edit_date% |
| Last edit by | %github_author_username% |

# Overview

This is the guide for **adding to** the GigRadar Design System — a new
component, a changed token, or a screen the system does not cover yet.

If you only need to *use* what already exists, that is the companion article:
[Design System — Using
Components](https://gigradar.platrum.com/wiki/page/1422-use-components).

## Who this is for

Developers. There is no designer in this loop.

That is the situation this article is written for: a feature needs a screen, no
Figma exists for it, and the developer produces the design themselves — often
with an AI assistant. That works, and it is how most new surface gets built
here. But it only works under one condition:

> **The system is the constraint, not a suggestion.** A design generated without
> reference to the tokens and existing components will look like a different
> product, and the divergence gets found in review or — worse — in production.

Everything below is about staying inside that constraint while still moving
fast.

# Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node | `>=18` | CI runs 20. There is no `.nvmrc`, so set your version manager yourself. |
| npm | 9+ | The repo uses npm workspaces. |
| Repo access | write | You are changing the design system itself, not just using it in an app. |

# Working in the Repo

Everything below assumes you have cloned the design system itself, not an app
that consumes it.

## Getting set up

Every command in this article is a plain terminal command — run them in whatever
terminal you already use. Node and npm are the only requirements.

```bash
git clone https://github.com/GigRadar/GigRadar-DesignSystem.git
cd GigRadar-DesignSystem
npm install
npm run dev        # gallery at http://localhost:5173
```

`npm install` builds all three packages on its way through — they declare
`prepare` scripts — so the first install is slower than a plain dependency
fetch.

**Check it worked:** the gallery loads at `http://localhost:5173` and
`packages/theme/dist/index.d.ts` exists. If the install failed partway, that
file is the first thing missing.

### If a gallery is already running

```text
Port 5173 is already in use
```

That is the intended behaviour, not a misconfiguration. The port is pinned with
`strictPort`, so a second `npm run dev` fails rather than quietly starting on
5174 — two galleries means editing one and looking at the other, which wastes
more time than the error does.

Usually you do not need a second one: the server already running hot-reloads
your edits, including edits to `packages/theme` and `packages/ui`, because the
gallery aliases those to source rather than to their built output. Switch to
that tab and keep working.

If it is stale, or belongs to a different checkout, stop it:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN   # what is holding the port
kill <PID>                         # stop it
```

The dev server is pinned to port 5173 with `strictPort`. A second
`npm run dev` **fails** rather than quietly opening a second gallery on 5174.
That is deliberate: two galleries means editing one and looking at the other.

## The commands

| Command | Does |
|---|---|
| `npm run dev` | Gallery at `http://localhost:5173`, hot-reloading on token and component edits |
| `npm run typecheck` | `tsc --build --force` across every package |
| `npm run lint` | The design system's own rules, run against itself |
| `npm run build` | Builds all three packages |
| `npm run changeset` | Records a version bump for the next release |

## Where things live

| You want to change | Edit |
|---|---|
| A component | `packages/ui/src/components/<Name>/` |
| A token | `packages/theme/src/tokens/` |
| A lint rule | `packages/eslint-plugin/src/rules/` |
| A gallery page | `apps/gallery/src/pages/` |
| The AI skill | `skills/design-system/SKILL.md` |

A new component also needs an export added to `packages/ui/src/index.ts` — that
barrel is the single import surface, and a component missing from it does not
exist as far as the apps are concerned.

**Check it worked:** `grep YourComponent packages/ui/src/index.ts` returns the
export line. If it does not, the component is invisible to every app.

# Designing Something New Without a Designer

When a feature needs a screen and no Figma exists for it, the design is yours to
produce. The steps below keep that design on-system.

## 1. Establish what already exists

Before generating anything, inventory the parts. Most screens are assemblies of
existing components, and the genuinely new part is usually smaller than it first
appears.

```bash
npm run dev        # gallery at http://localhost:5173
```

Search the gallery, then search `packages/ui/src/index.ts`. If a component is
not in that barrel, it is not in the system.

## 2. Give the AI the constraints, not just the request

An assistant asked for "a settings page" will invent colors, spacing, and
controls. Asked with the system in hand, it assembles instead of inventing.

Enable the **Claude Code plugin** (below) so the rules are always in context,
and state the constraint explicitly in your prompt:

```text
Build the notification settings screen.

Constraints:
- Import every component from @gigradar/ui. Never antd, never a new control.
- Every visual value comes from @gigradar/theme tokens — no hex, no raw px.
- Reuse SettingsPanel and SettingsSection for the page shell.
- If something genuinely does not exist, stop and say so rather than
  inventing it.
```

That last line matters most. An assistant that invents a control rather than
flagging a gap produces something that looks finished and is not on-system.

## 3. Compose from feature components first

Larger screens are composed from feature components that already carry their own
layout, states, and behaviour — `UpworkAccounts`, `UpworkApiKey`, `Inbox`,
`Notification`, `Prompt`, `AutoReply`, `MentionPreset`, `SettingsPanel`. Reach
for those before primitives.

## 4. Extend rather than fork

Higher-level components take **render props**, so you can replace a composed
part while keeping the behaviour that is hard to get right — positioning, focus
handling, keyboard wiring, ARIA relationships.

```tsx
<Pagination
  page={page}
  pageCount={pageCount}
  renderPage={({ page, selected, defaultRender }) => (
    <Tooltip title={`Go to page ${page}`}>{defaultRender()}</Tooltip>
  )}
/>
```

The shape is always the same, so learning one teaches the rest:

- The prop is named `render<Part>`.
- Its payload carries the **resolved data** the default would have drawn.
- It always carries `defaultRender()`, so you can decorate rather than replace.

Low-level components — Button, Badge, Avatar, Checkbox — deliberately have **no**
render props. Their markup is the component; a caller who needs different markup
needs a different component.

## 5. Check it against the system

```bash
npm run lint        # catches hardcoded values and antd imports
npm run typecheck
```

**Check it worked:** `typecheck` exits silently — any output is an error. `lint`
reports warnings but must show **0 errors**; a hardcoded value is a warning, an
antd import is an error.

The lint rules are the mechanical half of the review. The other half is reading
the result beside an existing screen in the gallery and asking whether it looks
like the same product.

## 6. Mark it as in development

A new component is not approved the moment it works. Mark it so nobody ships it
by mistake — see **Lifecycle** below.

# How to Modify

## Changing a component

1. Edit the source in `packages/ui/src/components/`.
2. Check it in the gallery — `npm run dev`, then find its page.
3. Run the checks below.
4. Add a changeset — see below.
5. Push to `main`. That publishes — see **Release Process**.

```bash
npm run typecheck   # tsc --build --force across all packages
npm run lint        # the design system's own rules, run against itself
npm run build       # all three packages
```

## Writing a changeset

`npm run changeset` prompts for the package and the bump, then writes a
markdown file into `.changeset/`. Pick the bump by what a developer using the
packages would have to do:

| Bump | When | Consumer impact |
|---|---|---|
| `patch` | A fix. Nothing about the API moved. | Upgrade freely |
| `minor` | A new component, a new prop, a new token. | Upgrade freely |
| `major` | A rename, a removal, or a changed default. | Consumer must change code |

The file it writes looks like this:

```markdown
---
'@gigradar/ui': major
---

Rename the Button's `subtle` variant to `third`, and merge the `remove` tone
into `danger`.

Figma already calls the quiet chrome button the "Third button" (node
4893:16258), so `subtle` was a second name for something the design had
named...

Note this changes how existing `tone="danger"` buttons behave. A filled one
that previously held its colour on hover now darkens.
```

Changesets here carry **why**, not just what. The summary line becomes the
changelog entry; the body is where the reasoning lives, and a `major` bump
should always say what a developer has to change. `@gigradar/gallery` is in the
`ignore` list — it is never published, so it never needs a changeset.

## Changing a token

Token edits are the highest-blast-radius change in the repo — every app inherits
them. Edit `packages/theme/src/tokens/`, then check the gallery's **Tokens**
page, which renders every token live.

# If a Figma Node Does Exist

Some components were drawn before this workflow. Where a Figma node exists, cite
it in the source and on the gallery page:

```text
Figma: node 3777:9845, with a variant per category.
```

The node ID is what lets the next person confirm the code matches the design,
and what lets them find the origin of a decision years later. The tokens
themselves come from the Figma guidebook (file `HNZEuaniWtXmEINBodTtal`), which
is why a new hex in a mockup is always a question rather than a value.

# Lifecycle: Marking What Is Not Ready

A component can be built and visible in the gallery long before it is approved.
A reader with no way to tell will use whatever they can see, so the stage is
marked explicitly.

| Stage | Badge | Meaning |
|---|---|---|
| `stable` | Green — "Stable" | In the system. Safe to use; changes are additive. |
| `development` | Amber with a dot — "In development" | Drawn and built, **not** approved. Do not ship. |
| `deprecated` | Grey — "Deprecated" | Still works, being removed. Use the replacement. |

The amber badge carries a leading dot by default. That is deliberate: it is the
stage a reader must not skim past, and the dot is what catches the eye in a
column of headings that are otherwise all text.

## Marking a section in development

Pass the stage to a gallery `Section`:

```tsx
<Section title="Date picker" stage="development">
  ...
</Section>
```

## Marking a whole component in development

An in-development component does **not** get a normal page. No live example, no
usage snippet, no props table — all three read as "this is ready". It gets a
`DevelopmentPlaceholder` instead:

```tsx
<DevelopmentPlaceholder
  title="Date picker"
  problem="Every screen that filters by date draws its own calendar."
  proposalCount={3}
>
  {/* the competing proposals */}
</DevelopmentPlaceholder>
```

The card shows the name, the problem, and the marker. Opening it reveals the
proposals competing to solve that problem, which is the thing actually under
review.

## Promoting to stable

When the pull request is approved, the placeholder comes out and the winning
proposal takes its place as an ordinary component section with a `stable` badge.

# The Claude Code Plugin

The repo ships a **Claude Code plugin** so the rules apply while code is being
written, rather than being caught in review. For AI-assisted design that is not
a convenience — it is what keeps a generated screen on-system.

**It ships rules, not packages.** The plugin has no hooks and no commands, so it
never installs or updates anything. Building and releasing still happens through
the plain terminal commands above — `npm install`, `npm run build`,
`npm run changeset`. The plugin's job is to keep what you generate inside the
system's constraints.

The marketplace manifest lives at `.claude-plugin/marketplace.json`; the skill
itself is `skills/design-system/SKILL.md`. Add the marketplace in Claude Code and
enable the `design-system` plugin.

The skill activates whenever UI is being written or reviewed in any GigRadar app.
It carries three rules:

1. **Import UI from `@gigradar/ui`** — never antd, never another kit.
2. **Never hardcode a color, spacing, radius, font size, or shadow** — every
   visual value comes from a token, with no exceptions.
3. **Say what is missing** rather than reaching around the wrapper.

# Troubleshooting

## `TS6305: Output file ... has not been built from source file`

```text
error TS6305: Output file 'packages/theme/dist/index.d.ts' has not been
built from source file 'packages/theme/src/index.ts'.
```

The packages are TypeScript **composite projects** — `@gigradar/ui` references
`@gigradar/theme`. A plain `tsc -p` refuses to compile when a referenced
project's outputs are missing; it will not build them for you.

Every package's build script uses `tsc --build`, which resolves the reference
order. If you hit this, you are running `tsc -p` somewhere — a script, an
editor task, or a copied command. Use `--build`.

To recover a half-built tree:

```bash
rm -rf packages/*/dist packages/*/tsconfig.tsbuildinfo
npm run build
```

This error typically appears in **CI and not locally**, because a local `dist/`
left over from an earlier build masks it. A clean checkout is the honest test.

## `Port 5173 is already in use`

Deliberate. The gallery pins the port with `strictPort: true` so a second
`npm run dev` fails instead of quietly opening a second gallery on 5174 — two
galleries means editing one and looking at the other.

Find and stop the existing server:

```bash
lsof -nP -iTCP:5173 -sTCP:LISTEN
kill <PID>
```

## The gallery does not show my change

- **A new component needs a gallery page** — building it in `packages/ui` does
  not make it appear. Add a page under `apps/gallery/src/pages/` and register it
  in the nav in `apps/gallery/src/App.tsx`.
- **A new export needs adding to `packages/ui/src/index.ts`.** The gallery
  imports from the barrel, so a component missing from it cannot be imported.

## `eslint.config.js` fails to load

```text
Cannot find module './packages/eslint-plugin/dist/index.js'
```

The lint config imports the plugin's **built** output. If you have cleaned
`dist/`, rebuild before linting:

```bash
npm run build
```

## Lint reports warnings I did not introduce

There is a standing baseline of `no-hardcoded-values` warnings that predate the
config. The rule is `warn` rather than `error` for exactly that reason. Compare
against the baseline before assuming your change caused them:

```bash
git stash && npm run lint | tail -3 && git stash pop
```

Your change should not raise the count. A large share of the existing warnings
are false positives — `"1px solid "` concatenated with a token color is a border
width, not a hardcoded design value.

# Repository Layout

```text
packages/
  theme/           @gigradar/theme — tokens + CSS custom properties
  ui/              @gigradar/ui — the single import surface
  eslint-plugin/   @gigradar/eslint-plugin — enforcement rules
apps/
  gallery/         Vite + React gallery (npm run dev)
skills/
  design-system/   SKILL.md — the rules developers get in their app repos
.claude-plugin/    marketplace.json
.github/workflows/ release.yml — Changesets → GitHub Packages
docs/
  consuming-packages.md      auth setup for installing the packages
  linting.md                 what the rules catch, and what they miss
  component-css-properties.md
  handoff-to-gigradar-org.md
```

# Release Process

Publishing is automated through Changesets. A push to `main` carrying pending
changesets does the whole thing:

1. CI runs typecheck and build.
2. Changesets computes the new versions, writes the changelogs, and consumes the
   changeset files.
3. The packages publish to GitHub Packages, and the version commit and tags are
   pushed back to `main`.

A push with **no** pending changesets publishes nothing, so ordinary commits —
docs, CI config, gallery-only work — are safe.

> **There is no review step.** Publishing is irreversible: GitHub Packages
> refuses to reuse a version number, so a mistake means shipping another version
> rather than fixing the one that went out. The changeset you write in step 4 is
> the last checkpoint. Re-read `.changeset/*.md` before pushing when several have
> accumulated — Changesets concatenates them without noticing that a later one
> contradicts an earlier one, which has already produced a changelog claiming
> `Button` gained a `subtle` variant that a later changeset had renamed away.

After a release your local `main` is behind by the version commit — pull before
starting new work.

Packages are built with `tsc --build` rather than `tsc -p`, because they are
TypeScript composite projects with references between them — `--build` resolves
the dependency order, where a plain `-p` fails when a referenced project has not
been built yet.
