import type { Rule } from 'eslint';

/**
 * Bans importing from antd.
 *
 * GigRadar no longer builds on antd, but several app repos still carry antd
 * 4.x in their dependency tree from before the design system existed — which
 * means an autocomplete-driven `import { Button } from 'antd'` still resolves
 * and still compiles. This rule catches that.
 *
 * Icons are not covered: `@ant-design/icons` is a separate package and a
 * separate decision.
 */
export const noDirectAntdImport: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Disallow importing from antd; use @gigradar/ui',
      recommended: true,
    },
    fixable: undefined,
    messages: {
      directImport:
        'Do not import from "{{source}}" — GigRadar no longer builds on antd. Use @gigradar/ui. If {{names}} is not exported yet, add it there rather than reaching around the design system.',
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
