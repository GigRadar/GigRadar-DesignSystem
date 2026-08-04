# Handoff: moving to the GigRadar organization

The packages publish as `@uiuxjoseph/*` today. This is temporary.

GitHub Packages requires the npm scope to match the repo owner, and at the time
of setup there was no access to a GigRadar organization — so the scope follows
the org that actually hosts the repo. `github.com/GigRadar` exists but was not
accessible; whether it is the company's is unconfirmed.

When GigRadar org access is available, do the handoff below.

## Before you start

Confirm two things:

1. You have **owner or admin** rights on the GigRadar org
2. `github.com/GigRadar` is genuinely the company's org, not an unrelated
   account that happens to hold the name

If the name is taken by someone else, the `@gigradar` scope is permanently
unavailable on GitHub Packages, and the options are npmjs.com (where scopes are
not tied to repo ownership) or keeping the current scope.

## Steps

### 1. Transfer the repo

`uiuxjoseph/GigRadar-DesignSystem` → Settings → General → Danger Zone →
Transfer ownership → `GigRadar`.

GitHub redirects the old URL, but every existing clone should re-point:

```bash
git remote set-url origin https://github.com/GigRadar/GigRadar-DesignSystem.git
```

### 2. Restore Actions permissions

**Repository settings do not survive a transfer, and org settings can override
them.** After transferring, set at the org level
(`github.com/organizations/GigRadar/settings/actions`):

- Workflow permissions → **Read and write permissions**
- Check **Allow GitHub Actions to create and approve pull requests**

Then confirm at the repo level:

```bash
gh api repos/GigRadar/GigRadar-DesignSystem/actions/permissions/workflow
# expect: {"default_workflow_permissions":"write","can_approve_pull_request_reviews":true}
```

### 3. Rename the scope

```bash
grep -rl "@uiuxjoseph" --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git . \
  | xargs perl -i -pe 's{\@uiuxjoseph}{\@gigradar}g'
```

This also renames the ESLint rule prefix, which derives from the package name
(`@gigradar/no-hardcoded-values`). Then:

```bash
rm -rf node_modules package-lock.json packages/*/dist
npm install
npm run typecheck
npm run build --workspaces
```

### 4. Publish as a major version

The scope change is breaking for every consuming app. Ship it as a major:

```bash
npm run changeset   # select all packages, choose "major"
```

Describe it plainly — the changelog is what a developer reads when their build
breaks:

> Renamed the package scope from `@uiuxjoseph` to `@gigradar`. Update imports
> and your `.npmrc` registry line.

### 5. Update the consuming apps

Each app repo needs:

- `.npmrc` → `@gigradar:registry=https://npm.pkg.github.com`
- `package.json` → dependency names
- Every import → `@uiuxjoseph/ui` becomes `@gigradar/ui`
- ESLint config → the rule prefix

A find-and-replace of `@uiuxjoseph` → `@gigradar` covers all of it.

### 6. Update the Claude Code plugin

`.claude-plugin/marketplace.json` and the install command developers run:

```
/plugin marketplace add GigRadar/GigRadar-DesignSystem
```

Anyone who installed from the old path must re-add it.

## Doing this earlier is cheaper

The rename is a find-and-replace here and a find-and-replace in each app. The
cost scales with how much app code imports the old scope — so the fewer apps
that have adopted, the cheaper it is. If org access is close, consider holding
off on broad adoption until after the move.
