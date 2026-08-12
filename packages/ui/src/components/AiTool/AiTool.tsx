import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { IconDef } from '../../icons/defs.js';
import { AiToolBadge, aiToolPalette, type AiToolCategory } from './AiToolBadge.js';

const { aiTool } = component;

export type { AiToolCategory };

/** Per-instance overrides for the row's own metrics. */
export type AiToolStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  fontSize?: CssLength;
  background?: string;
  borderColor?: string;
};

export type AiToolProps = {
  /** The function name, drawn in mono — `post_comment_as_laziza`. */
  name: ReactNode;
  /** What it does, and when the agent should reach for it. */
  description?: ReactNode;
  /**
   * Which category it belongs to. Colours the badge and the tag together.
   *
   * @default 'message'
   */
  category?: AiToolCategory;
  /**
   * The category's label — "Public Communication", "Scheduling".
   *
   * Free text rather than derived from `category`: the categories are colour
   * groups, and several capabilities in one group carry different wording.
   */
  categoryLabel?: ReactNode;
  /** Overrides the badge glyph. Each category has its own. */
  icon?: IconDef;
  /** Draws the badge's disabled slash — the agent cannot call this one. */
  crossed?: boolean;
} & AiToolStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One capability available to the agent.
 *
 * Figma: node 3777:9845, with a variant per category.
 *
 * The function name is mono because it is an identifier the writer types into
 * the custom prompt verbatim — the same reason the prompt field is mono. The
 * tag beside it and the badge at the head read one palette from
 * `aiToolPalette`, so a capability's colour cannot drift between the two.
 */
export const AiTool = forwardRef<HTMLDivElement, AiToolProps>(function AiTool(
  {
    name,
    description,
    category = 'message',
    categoryLabel,
    icon,
    crossed = false,
    paddingX,
    paddingY,
    gap,
    radius,
    fontSize,
    background,
    borderColor,
    ...rest
  },
  ref,
) {
  const palette = aiToolPalette(category);

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: len(gap) ?? `${aiTool.row.gap}px`,
    boxSizing: 'border-box',
    width: '100%',
    padding: `${len(paddingY) ?? `${aiTool.row.paddingY}px`} ${
      len(paddingX) ?? `${aiTool.row.paddingX}px`
    }`,
    borderRadius: len(radius) ?? `${aiTool.row.radius}px`,
    border: `1px solid ${borderColor ?? color.navbar.hover}`,
    backgroundColor: background ?? color.main.white,
    fontFamily: typography.fontFamily.base,
    overflow: 'hidden',
  };

  return (
    <div {...rest} ref={ref} style={style}>
      <AiToolBadge category={category} icon={icon} crossed={crossed} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 2,
          flex: '1 1 auto',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: aiTool.row.headerGap,
            maxWidth: '100%',
          }}
        >
          <code
            style={{
              fontFamily: typography.fontFamily.mono,
              fontSize: len(fontSize) ?? aiTool.row.nameFontSize,
              color: color.main.black,
              lineHeight: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </code>
          {categoryLabel && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: `${aiTool.tag.paddingY}px ${aiTool.tag.paddingX}px`,
                borderRadius: aiTool.tag.radius,
                backgroundColor: palette.background,
                color: palette.accent,
                ...typography.textStyle.sRegular,
                lineHeight: 1,
                whiteSpace: 'nowrap',
              }}
            >
              {categoryLabel}
            </span>
          )}
        </div>

        {description && (
          <p
            style={{
              ...typography.textStyle.mRegular,
              color: color.navbar.text,
              margin: 0,
              width: '100%',
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
});
