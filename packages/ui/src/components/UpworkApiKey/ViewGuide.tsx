import { color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type AnchorHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconGuideBookFill, IconRightArrow, type IconDef } from '../../icons/defs.js';

const { guideCard } = component.upworkApiKey;

/** Per-instance overrides for the card's own metrics. */
export type ViewGuideStyleProps = {
  /** Card width. Figma draws a fixed 255px in the right column. */
  width?: CssLength;
  /** Padding. */
  padding?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Edge color at rest. */
  borderColor?: string;
  /** Edge color on hover. */
  hoverBorderColor?: string;
  /** Fill. */
  background?: string;
  /** The icon plate's fill. */
  plateBackground?: string;
};

export type ViewGuideProps = {
  /** The card's heading. */
  title?: ReactNode;
  /** The line under it. */
  description?: ReactNode;
  /** The call to action at the foot of the card. */
  linkLabel?: ReactNode;
  /** The glyph on the plate. Defaults to the guidebook. */
  icon?: IconDef;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
} & ViewGuideStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'style'>;

/**
 * The "How to get the key?" card — Figma's "View Guide" (node 2133:1049).
 *
 * Drawn as an anchor rather than a card with a link inside it: the whole card
 * is the target in Figma's hover state, and a link that only covers its own
 * label leaves most of a 255px card inert.
 *
 * Hover moves the border and nothing else. The fill staying put is what keeps
 * it reading as a quiet aside in the right column rather than a button.
 */
export const ViewGuide = forwardRef<HTMLAnchorElement, ViewGuideProps>(function ViewGuide(
  {
    title = 'How to get the key?',
    description = 'Read this guide on how to generate and get the key.',
    linkLabel = 'View Guide',
    icon = IconGuideBookFill,
    hovered,
    width,
    padding,
    radius,
    borderColor,
    hoverBorderColor,
    background,
    plateBackground,
    onPointerEnter,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const [pointerInside, setPointerInside] = useState(false);
  const isHovered = hovered ?? pointerInside;

  const style: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
    width: len(width) ?? `${guideCard.width}px`,
    maxWidth: '100%',
    gap: `${guideCard.gap}px`,
    padding: len(padding) ?? `${guideCard.padding}px`,
    borderRadius: len(radius) ?? `${guideCard.radius}px`,
    border: `${guideCard.borderWidth}px solid ${
      isHovered ? (hoverBorderColor ?? color.main.brand) : (borderColor ?? color.main.backgroundAlt)
    }`,
    backgroundColor: background ?? color.main.white,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'border-color 120ms ease',
  };

  return (
    <a
      {...rest}
      ref={ref}
      style={style}
      onPointerEnter={(event) => {
        setPointerInside(true);
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setPointerInside(false);
        onPointerLeave?.(event);
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          width: guideCard.plateSize,
          height: guideCard.plateSize,
          borderRadius: `${guideCard.plateRadius}px`,
          backgroundColor: plateBackground ?? color.main.background,
          color: color.main.brand,
        }}
      >
        <Icon icon={icon} size={guideCard.plateIconSize} />
      </span>

      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minWidth: 0,
          gap: `${guideCard.textGap}px`,
        }}
      >
        <span
          style={{
            color: color.navbar.text2,
            fontFamily: typography.fontFamily.base,
            fontSize: `${guideCard.titleFontSize}px`,
            fontWeight: typography.fontWeight.medium,
            letterSpacing: typography.letterSpacing.m,
            lineHeight: 1.2,
          }}
        >
          {title}
        </span>

        <span
          style={{
            color: color.main.description,
            fontFamily: typography.fontFamily.base,
            fontSize: `${guideCard.bodyFontSize}px`,
            fontWeight: typography.fontWeight.regular,
            letterSpacing: typography.letterSpacing.s,
            lineHeight: 1.4,
          }}
        >
          {description}
        </span>

        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: `${guideCard.linkGap}px`,
            color: color.main.brand,
            fontFamily: typography.fontFamily.base,
            fontSize: `${guideCard.bodyFontSize}px`,
            fontWeight: typography.fontWeight.medium,
            letterSpacing: typography.letterSpacing.s,
            lineHeight: 1.2,
          }}
        >
          {linkLabel}
          <Icon icon={IconRightArrow} size={guideCard.linkIconSize} />
        </span>
      </span>
    </a>
  );
});
