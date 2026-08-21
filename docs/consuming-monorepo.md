# Consuming from the gigradar-monorepo (local clone, no registry)

Frontend apps inside the gigradar-monorepo (`gigradar-ant`,
`gigradar-agent-admin`, `gigradar-partner-portal`, …) already consume shared
code through `file:` dependencies (`"gigradar": "file:../gigradar-definitions"`).
The design system plugs into the same pattern: a clone at the monorepo root
plus `file:` entries. No GitHub Packages auth, no `.npmrc`.

## Setup

Clone at the monorepo root (the monorepo gitignores `GigRadar-DesignSystem/`),
install, and build:

```bash
# from the monorepo root
git clone https://github.com/GigRadar/GigRadar-DesignSystem
cd GigRadar-DesignSystem
npm install
npm run build
```

In each consuming app's `package.json`:

```json
"dependencies": {
  "@gigradar/theme": "file:../GigRadar-DesignSystem/packages/theme",
  "@gigradar/ui": "file:../GigRadar-DesignSystem/packages/ui"
},
"devDependencies": {
  "@gigradar/eslint-plugin": "file:../GigRadar-DesignSystem/packages/eslint-plugin"
}
```

npm symlinks `file:` packages, so after a design-system change only
`npm run build` in the clone is needed — consumers see the new `dist/` without
reinstalling.

## Updating

```bash
cd GigRadar-DesignSystem
git pull
npm install
npm run build
```

## CI

The clone is not in the monorepo checkout. The repository is public, so CI
clones and builds it before the app install — e.g. in an Amplify `preBuild`:

```yaml
- git clone --depth 1 https://github.com/GigRadar/GigRadar-DesignSystem ../GigRadar-DesignSystem
- npm --prefix ../GigRadar-DesignSystem install
- npm --prefix ../GigRadar-DesignSystem run build
- npm install
```

Pin a release tag with `--branch @gigradar/ui@2.0.0` to keep CI off `main`.

## Known caveat

A symlinked `@gigradar/ui` can resolve `react` from the design-system clone's
own `node_modules`, producing the "Invalid hook call" duplicate-React error.
Fix in the app's bundler config by aliasing `react` and `react-dom` to the
app's copies (`alias: { react: require.resolve('react') }`).

The full monorepo-side walkthrough lives in the monorepo at
`docs/design-system.md`.
