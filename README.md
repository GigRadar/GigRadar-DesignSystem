# GigRadar Design System

One source of truth for home, dashboard, crm, and inbound.

```bash
npm install
npm run dev     # gallery at http://localhost:5173
```

## What this repo publishes

| Output | Where |
|---|---|
| `@gigradar/theme` | Design tokens — colors, typography, spacing, radius, shadow |
| `@gigradar/ui` | Components — the single import surface for all four apps |
| Claude Code plugin | `.claude-plugin/marketplace.json` + `skills/design-system/SKILL.md` |
| Gallery | `apps/gallery` — live previews, props, and source |

## Layout

```
packages/
  theme/          @gigradar/theme — tokens, antd v4 Less map, CSS vars
  ui/             @gigradar/ui — Button, Badge, Card, GigRadarProvider
apps/
  gallery/        Vite + React gallery
skills/
  design-system/  SKILL.md — the rules developers get in their app repos
.claude-plugin/   marketplace.json
docs/
  adoption-antd-v4.md
```

## Tokens

Extracted from the Figma guidebook (file `HNZEuaniWtXmEINBodTtal`, node
`4363:1685`). Values are verbatim from Figma; see `packages/theme/src/tokens/`.

Six decisions were made where Figma was ambiguous. Each is marked
`DECISION (reversible)` in the source:

| Decision | Rationale |
|---|---|
| Figma "Laziza" → `accent.amber` | Undocumented name; reads as a general amber accent |
| `status.error` = `#FA3737`, `status.warning` = `#FFB74D` | Figma had four overlapping alert palettes; duplicates kept as deprecated aliases |
| Stages grouped `[U]`/`[P]`/`[L]` → unqualified/pipeline/lost | Read from the Figma prefixes |
| Line heights 1.2 heading / 1.5 paragraph | Figma reports `lineHeight: 100` (its "100%" auto setting), unusable literally |
| Radius `round` = `9999px` | Figma's `100000000` sentinel |
| Gradient backgrounds flattened | Failed/Decrease backgrounds were color washes over white |

Anything here can be changed in one file. Nothing is load-bearing.

## Adoption

The apps run antd v4, which themes at build time through Less variables —
see [docs/adoption-antd-v4.md](docs/adoption-antd-v4.md).

## Releasing

```bash
npm run changeset          # describe the change
npm run version-packages   # bump versions + changelogs
npm run release            # build + publish to GitHub Packages
```

Additive by default: new variants and props ship as minor versions. Removing
anything requires a deprecation cycle and a major version.
