# Handoff to the GigRadar organization — complete

The repo now lives at `github.com/GigRadar/GigRadar-DesignSystem` and the
packages publish under the `@gigradar` scope. This page is kept as a record of
what moved and what to check if something still points at the old location.

## What changed

The packages were published as `@uiuxjoseph/*` up to `1.0.0`, because GitHub
Packages requires the npm scope to match the repo owner and the GigRadar org
was not available when the design system was set up. They are now `@gigradar/*`:

| Before | After |
|---|---|
| `@uiuxjoseph/theme` | `@gigradar/theme` |
| `@uiuxjoseph/ui` | `@gigradar/ui` |
| `@uiuxjoseph/eslint-plugin` | `@gigradar/eslint-plugin` |
| `uiuxjoseph/GigRadar-DesignSystem` | `GigRadar/GigRadar-DesignSystem` |

The ESLint rule prefix follows the package name, so the rules are now
`@gigradar/no-hardcoded-values` and `@gigradar/no-direct-antd-import`.

## If an app still uses the old scope

One find-and-replace covers it:

```bash
grep -rl "@uiuxjoseph" --exclude-dir=node_modules . \
  | xargs perl -i -pe 's{\@uiuxjoseph}{\@gigradar}g'

rm -rf node_modules package-lock.json && npm install
```

Then update the app's `.npmrc` routing line:

```ini
@gigradar:registry=https://npm.pkg.github.com
```

The old `@uiuxjoseph/*` versions are still published and will keep resolving,
so nothing breaks until an app chooses to move.

## Local clones

`git remote set-url origin https://github.com/GigRadar/GigRadar-DesignSystem.git`

GitHub redirects the old URL, but re-pointing avoids surprises later.

## The Claude Code plugin

The marketplace path changed with the org:

```
/plugin marketplace add GigRadar/GigRadar-DesignSystem
/plugin install design-system@gigradar
```

Anyone who added it from the old path should re-add it.

## Worth checking once

- **Actions permissions do not survive a transfer.** Settings → Actions →
  General → Workflow permissions must be **Read and write**, with
  "Allow GitHub Actions to create and approve pull requests" checked, or the
  release workflow cannot open its version PR.
- **Repository visibility.** Confirm the repo's public/private setting matches
  what the org intends — a transfer is a good moment for it to be wrong.
