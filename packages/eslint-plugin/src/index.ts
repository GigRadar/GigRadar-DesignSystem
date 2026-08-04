import { noDirectAntdImport } from './rules/no-direct-antd-import.js';
import { noHardcodedValues } from './rules/no-hardcoded-values.js';

/**
 * @uiuxjoseph/eslint-plugin
 *
 * Two rules, both enforcing constraints from skills/design-system/SKILL.md:
 *   - no-hardcoded-values   → tokens instead of literals
 *   - no-direct-antd-import → catches legacy antd imports, which still resolve
 *                             in app repos that carry antd 4.x
 *
 * Coverage limit: ESLint sees JS/TS/JSX only. Colors and sizes in stylesheets
 * are NOT covered here — use the stylelint config alongside this.
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
      '@uiuxjoseph/no-hardcoded-values': 'error',
      '@uiuxjoseph/no-direct-antd-import': 'error',
    },
  },
  /** Legacy .eslintrc config (ESLint 8). */
  legacy: {
    plugins: ['@uiuxjoseph'],
    rules: {
      '@uiuxjoseph/no-hardcoded-values': 'error',
      '@uiuxjoseph/no-direct-antd-import': 'error',
    },
  },
};

// Self-reference so flat config `plugins` resolves without extra wiring.
configs.recommended.plugins = { '@uiuxjoseph': { rules } };

export default { rules, configs };
