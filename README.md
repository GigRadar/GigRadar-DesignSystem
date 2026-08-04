# GigRadar Design System

One source of truth for home, dashboard, crm, and inbound.

```bash
npm install
npm run dev     # gallery at http://localhost:5173
```

## What this repo publishes

| Output | Where |
|---|---|
| `@uiuxjoseph/theme` | Design tokens — colors, typography, spacing, radius, shadow |
| `@uiuxjoseph/ui` | Components — the single import surface for all four apps |
| `@uiuxjoseph/eslint-plugin` | Rules banning hardcoded values and legacy antd imports |
| Claude Code plugin | `.claude-plugin/marketplace.json` + `skills/design-system/SKILL.md` |
| Gallery | `apps/gallery` — run locally with `npm run dev` |

## Layout

```
packages/
  theme/           @uiuxjoseph/theme — tokens + CSS custom properties
  ui/              @uiuxjoseph/ui — Button, Badge, Card, GigRadarProvider
  eslint-plugin/   @uiuxjoseph/eslint-plugin — enforcement rules
apps/
  gallery/         Vite + React gallery
skills/
  design-system/   SKILL.md — the rules developers get in their app repos
.claude-plugin/    marketplace.json
.github/workflows/ release.yml — Changesets → GitHub Packages
docs/
  consuming-packages.md  auth setup for installing the packages
  linting.md             what the rules catch, and what they miss
```

## Tokens

Extracted from the Figma guidebook (file `HNZEuaniWtXmEINBodTtal`, node
`4363:1685`). Values are verbatim from Figma; see `packages/theme/src/tokens/`.

Six decisions were made where Figma was ambiguous. Each is marked
`DECISION (reversible)` in the source:

| Decision | Rationale |
|---|---|
| Figma "Laziza" kept as `accent.laziza` | Matches Figma exactly, so the name is searchable in both places |
| `status.error` = `#FA3737`, `status.warning` = `#FFB74D` | Figma had four overlapping alert palettes; duplicates kept as deprecated aliases |
| Stages grouped `[U]`/`[P]`/`[L]` → unqualified/pipeline/lost | Read from the Figma prefixes |
| Line heights 1.2 heading / 1.5 paragraph | Figma reports `lineHeight: 100` (its "100%" auto setting), unusable literally |
| Radius `round` = `9999px` | Figma's `100000000` sentinel |
| Gradient backgrounds flattened | Failed/Decrease backgrounds were color washes over white |

Anything here can be changed in one file. Nothing is load-bearing.

## Adoption

See [docs/consuming-packages.md](docs/consuming-packages.md) for the GitHub
Packages auth each developer needs, and how to enable the lint rules.

## Releasing

```bash
npm run changeset          # describe the change
npm run version-packages   # bump versions + changelogs
npm run release            # build + publish to GitHub Packages
```

Additive by default: new variants and props ship as minor versions. Removing
anything requires a deprecation cycle and a major version.
