import type { Rule } from 'eslint';

/**
 * Requires antd components to be imported from @gigradar/ui.
 *
 * This is what makes the wrapper worth having: if app code names antd
 * directly, an implementation can never be swapped without touching every
 * app. Icons are exempt — @ant-design/icons is a separate concern.
 */
export const noDirectAntdImport: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Require antd components to be imported from @gigradar/ui',
      recommended: true,
    },
    fixable: undefined,
    messages: {
      directImport:
        'Import from "@gigradar/ui" instead of "{{source}}". The wrapper is what lets an implementation change without touching app code. If {{names}} is not exported yet, add it to @gigradar/ui rather than reaching around it.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowIn: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = (context.options[0] ?? {}) as { allowIn?: string[] };
    const filename = context.filename ?? context.getFilename();

    // @gigradar/ui itself must import antd — that is its job.
    const exempt = (options.allowIn ?? ['packages/ui/']).some((fragment) =>
      filename.includes(fragment),
    );
    if (exempt) return {};

    return {
      ImportDeclaration(node) {
        const source = node.source.value;
        if (typeof source !== 'string') return;
        if (source !== 'antd' && !source.startsWith('antd/')) return;

        const names = node.specifiers
          .map((specifier) =>
            specifier.type === 'ImportSpecifier' && specifier.imported.type === 'Identifier'
              ? specifier.imported.name
              : specifier.local.name,
          )
          .join(', ');

        context.report({
          node,
          messageId: 'directImport',
          data: { source, names: names || 'the component' },
        });
      },
    };
  },
};
