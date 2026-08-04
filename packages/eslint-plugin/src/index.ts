import { noDirectAntdImport } from './rules/no-direct-antd-import.js';
import { noHardcodedValues } from './rules/no-hardcoded-values.js';

/**
 * @gigradar/eslint-plugin
 *
 * Two rules, both enforcing constraints from skills/design-system/SKILL.md:
 *   - no-hardcoded-values   → tokens instead of literals
 *   - no-direct-antd-import → @gigradar/ui as the single import surface
 *
 * Coverage limit: ESLint sees JS/TS/JSX only. Colors and sizes in `.less` and
 * `.css` files are NOT covered here — use the stylelint config alongside this.
 * See docs/linting.md.
 */
export const rules = {
  'no-hardcoded-values': noHardcodedValues,
  'no-direct-antd-import': noDirectAntdImport,
};

export const configs = {
  /** Flat config (ESLint 9+). */
  recommended: {
    plugins: {} as Record<string, unknown>,
    rules: {
      '@gigradar/no-hardcoded-values': 'error',
      '@gigradar/no-direct-antd-import': 'error',
    },
  },
  /** Legacy .eslintrc config (ESLint 8). */
  legacy: {
    plugins: ['@gigradar'],
    rules: {
      '@gigradar/no-hardcoded-values': 'error',
      '@gigradar/no-direct-antd-import': 'error',
    },
  },
};

// Self-reference so flat config `plugins` resolves without extra wiring.
configs.recommended.plugins = { '@gigradar': { rules } };

export default { rules, configs };
