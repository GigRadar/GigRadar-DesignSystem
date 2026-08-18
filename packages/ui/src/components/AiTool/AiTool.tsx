import { borderWidth, color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
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
  /**
   * Replaces the badge at the head of the row, keeping the row's layout.
   *
   * The payload carries the resolved `palette`, so a replacement badge can
   * stay on the category's colour without re-deriving it.
   *
   * Call `defaultRender()` to wrap rather than replace.
   */
  renderBadge?: RenderProp<AiToolBadgeRenderProps>;
  /**
   * Replaces the category tag beside the name, keeping the header row.
   *
   * The usual reason is a tag that has to carry something extra — a link to
   * the category's docs, a count, a tooltip. Not called when there is no
   * `categoryLabel`, since there is no tag to draw.
   *
   * Call `defaultRender()` to wrap rather than replace.
   */
  renderTag?: RenderProp<AiToolTagRenderProps>;
} & AiToolStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The colours a category resolves to, shared by the badge and the tag.
 *
 * Handed to both render props so a replacement cannot drift off the palette
 * the other half of the row is using.
 */
export type AiToolPalette = ReturnType<typeof aiToolPalette>;

/**
 * What a `renderBadge` function receives — the head of the row.
 */
export type AiToolBadgeRenderProps = WithDefaultRender & {
  /** The category the badge is drawing. */
  category: AiToolCategory;
  /** The glyph override, if the caller passed one. */
  icon?: IconDef;
  /** Whether the disabled slash is drawn. */
  crossed: boolean;
  /** The category's resolved colours. */
  palette: AiToolPalette;
};

/**
 * What a `renderTag` function receives — the category tag beside the name.
 */
export type AiToolTagRenderProps = WithDefaultRender & {
  /** The tag's text, as passed. Never empty — the tag is skipped when it is. */
  categoryLabel: ReactNode;
  /** The category the label belongs to. */
  category: AiToolCategory;
  /** The category's resolved colours. */
  palette: AiToolPalette;
};

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
    renderBadge,
    renderTag,
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
    border: `${borderWidth.thin}px solid ${borderColor ?? color.navbar.hover}`,
    backgroundColor: background ?? color.main.white,
    fontFamily: typography.fontFamily.base,
    overflow: 'hidden',
  };

  const defaultBadge = () => <AiToolBadge category={category} icon={icon} crossed={crossed} />;

  const defaultTag = () => (
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
  );

  return (
    <div {...rest} ref={ref} style={style}>
      {renderBadge
        ? renderBadge({ category, icon, crossed, palette, defaultRender: defaultBadge })
        : defaultBadge()}

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
          {categoryLabel &&
            (renderTag
              ? renderTag({ categoryLabel, category, palette, defaultRender: defaultTag })
              : defaultTag())}
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
