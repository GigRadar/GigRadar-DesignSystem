# Linting

`@uiuxjoseph/eslint-plugin` ships two rules:

| Rule | Catches |
|---|---|
| `no-hardcoded-values` | Hex/rgb colors, `px` strings, and numeric spacing/radius/fontSize in JS, TS, and JSX |
| `no-direct-antd-import` | `import … from 'antd'` — legacy antd still resolves in app repos that carry it |

## What these rules do NOT catch

Worth stating plainly, because "we have a lint rule for that" tends to end the
conversation about a problem that is only partly solved.

ESLint parses JavaScript. It cannot see:

1. **Stylesheets (`.css`, `.less`, `.scss`).** A hardcoded `#378AFA` in a
   stylesheet is invisible to ESLint, and stylesheets are where a great deal of
   color and spacing actually lives.
2. **Values behind an indirection.** `const c = getBrandColor()` passes, no
   matter what that function returns.
3. **Runtime-computed strings.** `` `#${hex}` `` is not a literal.
4. **CSS-in-JS in some forms.** Template literals are checked, but a value
   assembled across several expressions may slip through.

The rule is a useful backstop, not a guarantee. Design review still matters.

## Covering stylesheets

Add stylelint alongside ESLint to close gap #1:

```bash
npm install -D stylelint stylelint-config-standard
```

`.stylelintrc.json`:

```json
{
  "extends": "stylelint-config-standard",
  "rules": {
    "color-no-hex": true,
    "declaration-property-value-disallowed-list": {
      "/^(padding|margin|gap|border-radius|font-size)/": ["/^\\d+px$/"]
    }
  }
}
```

Then use the CSS custom properties instead:

```less
.card {
  background: var(--gr-color-white);
  padding: var(--gr-space-m);
  border-radius: var(--gr-radius-s);
}
```

Those variables come from `GigRadarProvider`, or from a build-time
`renderCssVars()` emit. See [consuming-packages.md](consuming-packages.md).

## Exemptions

Both rules accept an `allowIn` option — an array of path fragments that are
skipped:

```js
'@uiuxjoseph/no-hardcoded-values': ['error', { allowIn: ['packages/theme/', 'src/legacy/'] }]
```

Defaults: `no-hardcoded-values` exempts `packages/theme/` (it defines the
tokens), and `no-direct-antd-import` exempts `packages/ui/`.

## Rolling out to an existing app

Turning both rules to `error` on a mature codebase produces hundreds of
failures. Instead:

1. Set both to `'warn'` and commit
2. Fix incrementally, highest-traffic files first
3. Promote to `'error'` once the count reaches zero

This keeps CI green while the debt is paid down.
