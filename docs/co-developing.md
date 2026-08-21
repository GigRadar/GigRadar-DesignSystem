# Co-developing with an app

Apps consume the published packages from GitHub Packages
([consuming-packages.md](consuming-packages.md)). A local clone is only for
changing the design system and an app at the same time.

## Setup

Clone next to the app (the gigradar-monorepo gitignores a
`GigRadar-DesignSystem/` clone at its root), install, build:

```bash
git clone https://github.com/GigRadar/GigRadar-DesignSystem
cd GigRadar-DesignSystem
npm install
npm run build          # or: npm run dev --workspace @gigradar/ui for watch
```

Temporarily point the app's dependency at the clone and reinstall:

```json
"@gigradar/ui": "file:../GigRadar-DesignSystem/packages/ui"
```

npm symlinks `file:` packages — rebuilds in the clone are picked up without
reinstalling. Restore the registry version before committing the app.

## Shipping

Add a changeset, merge to `main` — the release workflow versions and publishes
automatically. Then bump the version in the app:

```bash
npm run changeset      # in this repo, describe the change
# merge → published
npm install @gigradar/ui@latest   # in the app
```

## Known caveat

A symlinked `@gigradar/ui` can resolve `react` from this repo's own
`node_modules`, producing the "Invalid hook call" duplicate-React error. Alias
`react` and `react-dom` to the app's copies in the app's bundler config
(`alias: { react: require.resolve('react') }`).
