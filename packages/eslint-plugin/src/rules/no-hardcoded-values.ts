import type { Rule } from 'eslint';
import type { Node } from 'estree';

/**
 * Bans hardcoded colors and pixel values in favour of design tokens.
 *
 * Scope note: this rule sees JS/TS/JSX only. It CANNOT see `.less` or `.css`
 * files, and it cannot follow a value through an import. Stylesheets are
 * covered by the separate stylelint config; see docs/linting.md. Treating this
 * rule alone as full enforcement will give a false sense of coverage.
 */

const HEX_COLOR = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const RGB_COLOR = /\b(?:rgba?|hsla?)\s*\(/;
const PX_VALUE = /\b\d+(?:\.\d+)?px\b/;

/**
 * Properties whose numeric values are spatial and should come from tokens.
 * Numeric literals on other properties (zIndex, flex, opacity, lineHeight)
 * are left alone.
 */
const SPATIAL_PROPERTIES = new Set([
  'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'gap', 'rowGap', 'columnGap',
  'borderRadius', 'borderTopLeftRadius', 'borderTopRightRadius',
  'borderBottomLeftRadius', 'borderBottomRightRadius',
  'fontSize', 'letterSpacing',
  'top', 'right', 'bottom', 'left',
]);

/**
 * Values that are semantically meaningful rather than design decisions.
 * 0 is not a spacing choice; 1px borders and 100%-style values are structural.
 */
const ALLOWED_NUMBERS = new Set([0, 1]);

const COLOR_PROPERTY = /color|background|border|fill|stroke|shadow|outline/i;

export const noHardcodedValues: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow hardcoded colors and spacing; use @gigradar/theme tokens',
      recommended: true,
    },
    messages: {
      hardcodedColor:
        'Hardcoded color "{{value}}". Use a token from @gigradar/theme (e.g. color.main.brand). See skills/design-system/SKILL.md.',
      hardcodedSpacing:
        'Hardcoded {{property}} of {{value}}. Use a spacing or radius token (e.g. spacing.m, radius.s).',
      hardcodedPx:
        'Hardcoded px value "{{value}}". Use a token from @gigradar/theme.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          /** Files matching these globs are exempt (e.g. the theme package itself). */
          allowIn: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = (context.options[0] ?? {}) as { allowIn?: string[] };
    const filename = context.filename ?? context.getFilename();

    // The theme package defines the tokens, so literals there are the point.
    const exempt = (options.allowIn ?? ['packages/theme/']).some((fragment) =>
      filename.includes(fragment),
    );
    if (exempt) return {};

    // A string literal inside a style property is visited by both the Literal
    // and Property handlers. Track what has been reported so each violation is
    // surfaced once.
    const reported = new WeakSet<object>();

    const reportString = (node: Node, value: string) => {
      if (reported.has(node)) return;
      if (HEX_COLOR.test(value) || RGB_COLOR.test(value)) {
        reported.add(node);
        context.report({ node, messageId: 'hardcodedColor', data: { value } });
        return;
      }
      if (PX_VALUE.test(value)) {
        reported.add(node);
        context.report({ node, messageId: 'hardcodedPx', data: { value } });
      }
    };

    return {
      // Catches: style={{ color: '#378AFA' }} and const c = '#378AFA'
      Literal(node) {
        if (typeof node.value === 'string') {
          reportString(node as Node, node.value);
        }
      },

      // Catches: `${x}px solid #fff` in template literals
      TemplateElement(node) {
        const raw = node.value.raw;
        if (raw) reportString(node as unknown as Node, raw);
      },

      // Catches: style={{ padding: 16 }}
      Property(node) {
        const key = node.key;
        const name =
          key.type === 'Identifier' ? key.name : key.type === 'Literal' ? String(key.value) : null;
        if (!name) return;

        const value = node.value;
        if (value.type !== 'Literal') return;

        if (typeof value.value === 'number') {
          if (!SPATIAL_PROPERTIES.has(name)) return;
          if (ALLOWED_NUMBERS.has(value.value)) return;
          context.report({
            node: value as Node,
            messageId: 'hardcodedSpacing',
            data: { property: name, value: String(value.value) },
          });
          return;
        }

        if (typeof value.value === 'string' && COLOR_PROPERTY.test(name)) {
          reportString(value as Node, value.value);
        }
      },
    };
  },
};
