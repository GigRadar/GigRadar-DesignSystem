const tsParser = require('@typescript-eslint/parser');
const gigradar = require('./packages/eslint-plugin/dist/index.js');

/**
 * The design system's own lint rules, run against itself.
 *
 * `@gigradar/eslint-plugin` exists to stop apps hardcoding colors and spacing
 * that the theme already names. This repo is the one place those rules were
 * never actually run — `npm run lint` was wired to `eslint .` with no config
 * for it to read, so it failed with "couldn't find a configuration file" and
 * nothing was ever checked. A rule the design system ships and does not itself
 * obey is worse than no rule.
 *
 * Flat config (`eslint.config.js`) rather than `.eslintrc`: the plugin's own
 * `recommended` export is already flat-shaped, so this is the format that can
 * consume it without translation.
 */
module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/*.tsbuildinfo',
      // Generated from the icon SVGs — the literals in it are path data and
      // viewBox numbers, not design decisions.
      'packages/ui/src/icons/defs.ts',
    ],
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: gigradar.configs.recommended.plugins,
    rules: {
      /**
       * `packages/theme` is exempt by the rule's own default — it defines the
       * tokens, so literals there are the source rather than a violation.
       *
       * The gallery is exempt because it is documentation: a props table
       * stating a default of `6`, or a preview box sized to show a component at
       * a fixed width, is prose about the system rather than a screen built
       * from it.
       */
      /**
       * `warn`, not `error`, and deliberately so.
       *
       * Switching it on surfaced 49 findings across 22 files that predate the
       * config. `docs/linting.md` prescribes exactly this for that situation:
       * warn, fix incrementally, promote to `error` once the count reaches
       * zero. Turning it red today would mean either a broken build or 49
       * rushed edits, and the second is how a real token bug gets hidden among
       * mechanical ones.
       *
       * A large share are false positives — `"1px solid "` is a border-width
       * string concatenated with a token color, not a hardcoded design value.
       * Those want a rule fix rather than a code change, which is its own
       * piece of work.
       */
      '@gigradar/no-hardcoded-values': [
        'warn',
        { allowIn: ['packages/theme/', 'apps/gallery/'] },
      ],
      '@gigradar/no-direct-antd-import': 'error',
    },
  },
];
