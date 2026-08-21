# Installing @gigradar packages in an app

Two ways to consume the packages:

1. **Local clone + `file:` dependencies** — no registry, no auth. This is how
   the gigradar-monorepo frontend apps consume them (the same pattern as their
   `gigradar-definitions` dependency). See
   [consuming-monorepo.md](consuming-monorepo.md).
2. **GitHub Packages registry** — for standalone app repos. The rest of this
   document.

The registry packages are hosted on GitHub Packages, which requires
authentication **even to read**. Each developer authenticates once; the app
repos hold no secrets.

## One-time: you (the maintainer)

### 1. Create a read token

GitHub → Settings → Developer settings → Personal access tokens → **Tokens
(classic)** → Generate new token.

- Scope: **`read:packages`** only
- Expiry: your call — a year is common; note that renewal means redistributing

Classic tokens are required here. Fine-grained tokens do not yet support npm
reads from GitHub Packages.

> This token grants read access to **all** private packages the account can
> see, not just `@gigradar/*`. GitHub Packages has no per-package npm scoping.
> If that is too broad, create a machine user with access limited to this repo
> and issue the token from that account instead.

### 2. Share it with the developers

Use a password manager — 1Password, Bitwarden, whatever the team already has.
Not Slack, not email.

### 3. Enable Actions publishing

Repo → Settings → Actions → General → Workflow permissions → **Read and write
permissions**.

The release workflow uses the automatic `GITHUB_TOKEN`, so no publish secret
needs to be created.

## One-time: each developer

Add the token to the **global** `~/.npmrc` (never a repo file):

```ini
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxx
```

Verify:

```bash
npm view @gigradar/theme --registry https://npm.pkg.github.com
```

## Per app repo

Commit a `.npmrc` at the repo root. It contains no secret — only routing:

```ini
@gigradar:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install @gigradar/theme @gigradar/ui
npm install -D @gigradar/eslint-plugin
```

## CI in the app repos

App CI needs the same auth. If the app repo is in the same org, the automatic
`GITHUB_TOKEN` works:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: 20
    registry-url: https://npm.pkg.github.com
    scope: '@gigradar'
- run: npm ci
  env:
    NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

If the app repo is in a different org or account, add the read token as a repo
secret and use that instead.

## Vercel / Cloudflare / other build hosts

Set an environment variable in the host's dashboard:

```
NPM_RC="//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxx"
```

Most hosts write `NPM_RC` to `~/.npmrc` before install. Check your host's docs —
the variable name differs.

## Enabling the lint rules

In the app's ESLint config:

```js
// Flat config (ESLint 9)
import gigradar from '@gigradar/eslint-plugin';

export default [
  {
    plugins: { '@gigradar': gigradar },
    rules: {
      '@gigradar/no-hardcoded-values': 'error',
      '@gigradar/no-direct-antd-import': 'error',
    },
  },
];
```

```js
// .eslintrc (ESLint 8)
module.exports = {
  plugins: ['@gigradar'],
  rules: {
    '@gigradar/no-hardcoded-values': 'error',
    '@gigradar/no-direct-antd-import': 'error',
  },
};
```

Expect a large number of errors on first run in an existing app. Start with
`'warn'`, fix incrementally, then promote to `'error'` once the count is zero.

## Installing the Claude Code plugin

So each developer's Claude knows the design system rules:

```
/plugin marketplace add CallB007/GigRadar-DesignSystem
/plugin install design-system@gigradar
```

This works per-developer regardless of which Claude account they are on.
