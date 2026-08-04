import { radius as radiusScale, spacing, type RadiusToken, type SpacingToken } from '@uiuxjoseph/theme';
import {
  createElement,
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from 'react';

/**
 * A spacing value: a token name, or a number for the escape hatch.
 *
 * The token name is the point — `gap="s"` keeps app code on the scale without
 * importing anything, and a typo is a type error rather than a silently odd
 * layout. Numbers stay available for the genuinely one-off value, and are
 * treated as px.
 */
export type SpaceValue = SpacingToken | number;

/** A CSS length. Numbers mean px; strings pass through (`"100%"`, `"20rem"`). */
export type SizeValue = number | string;

/** A radius token name, or a number of px. */
export type RadiusValue = RadiusToken | number;

/** Resolves a radius prop, looking up a token name on the scale. */
function resolveRadius(value: RadiusValue | undefined): number | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? value : radiusScale[value];
}

export type BoxProps = {
  /** The element to render. Defaults to `div`. */
  as?: ElementType;

  display?: CSSProperties['display'];
  flexDirection?: CSSProperties['flexDirection'];
  alignItems?: CSSProperties['alignItems'];
  justifyContent?: CSSProperties['justifyContent'];
  flexWrap?: CSSProperties['flexWrap'];
  flex?: CSSProperties['flex'];

  /** Gap between children. */
  gap?: SpaceValue;

  /** Padding. `p` sets all sides; `px`/`py` and the single sides override it. */
  p?: SpaceValue;
  px?: SpaceValue;
  py?: SpaceValue;
  pt?: SpaceValue;
  pr?: SpaceValue;
  pb?: SpaceValue;
  pl?: SpaceValue;

  /** Margin, same shorthand rules as padding. */
  m?: SpaceValue;
  mx?: SpaceValue;
  my?: SpaceValue;
  mt?: SpaceValue;
  mr?: SpaceValue;
  mb?: SpaceValue;
  ml?: SpaceValue;

  width?: SizeValue;
  height?: SizeValue;
  maxWidth?: SizeValue;
  minWidth?: SizeValue;

  /**
   * Surface and border. Colors are passed through as written, so a token
   * (`color.main.brand`) or any CSS color both work.
   */
  background?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: SizeValue;
  /** Corner radius. A token name resolves the radius scale; a number means px. */
  radius?: RadiusValue;

  position?: CSSProperties['position'];
  overflow?: CSSProperties['overflow'];
  textAlign?: CSSProperties['textAlign'];

  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, 'className' | 'style' | 'color' | 'children'>;

/**
 * Resolves a spacing prop to px.
 *
 * A string is looked up on the scale rather than passed through: `gap="s"`
 * must mean `spacing.s`, not the invalid CSS `gap: s`.
 */
function space(value: SpaceValue | undefined): number | undefined {
  if (value == null) return undefined;
  return typeof value === 'number' ? value : spacing[value];
}

/**
 * A layout primitive.
 *
 * Exists so layout can be written as props rather than a `style` object:
 *
 *     <Box display="flex" gap="s">
 *
 * rather than
 *
 *     <div style={{ display: 'flex', gap: spacing.s }}>
 *
 * Spacing props take a token name, so app code stays on the scale without
 * importing it. Deliberately layout-only — there are no color, typography, or
 * border props here, because those belong to the components that own them.
 *
 * Anything not listed is forwarded to the element, so `onClick`, `id`, and
 * ARIA attributes work as normal.
 */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    as = 'div',
    display,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    flex,
    gap,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    m,
    mx,
    my,
    mt,
    mr,
    mb,
    ml,
    width,
    height,
    maxWidth,
    minWidth,
    background,
    textColor,
    borderColor,
    borderWidth,
    radius,
    position,
    overflow,
    textAlign,
    children,
    ...rest
  },
  ref,
) {
  // Ordered least to most specific: `p` is the base, `px`/`py` narrow it, and
  // a single side wins outright. `??` rather than `||` so a 0 is honoured.
  const style: CSSProperties = {
    display,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    flex,
    gap: space(gap),

    paddingTop: space(pt ?? py ?? p),
    paddingRight: space(pr ?? px ?? p),
    paddingBottom: space(pb ?? py ?? p),
    paddingLeft: space(pl ?? px ?? p),

    marginTop: space(mt ?? my ?? m),
    marginRight: space(mr ?? mx ?? m),
    marginBottom: space(mb ?? my ?? m),
    marginLeft: space(ml ?? mx ?? m),

    // React already treats a bare number as px on these, so they pass straight
    // through — unlike the spacing props, which must resolve a token name.
    width,
    height,
    maxWidth,
    minWidth,

    backgroundColor: background,
    color: textColor,
    borderColor,
    borderWidth,
    // A border needs a style to render at all; setting a color or width alone
    // would otherwise silently do nothing.
    borderStyle: borderColor != null || borderWidth != null ? 'solid' : undefined,
    borderRadius: resolveRadius(radius),

    position,
    overflow,
    textAlign,
  };

  return createElement(as, { ...rest, ref, style }, children);
});

/**
 * A horizontal row. `Box` with the flex defaults filled in, since a row of
 * centred items is the layout wanted most often.
 */
export const HStack = forwardRef<HTMLElement, BoxProps>(function HStack(
  { gap = 's', alignItems = 'center', ...rest },
  ref,
) {
  return <Box ref={ref} display="flex" alignItems={alignItems} gap={gap} {...rest} />;
});

/** A vertical stack. The column counterpart to `HStack`. */
export const VStack = forwardRef<HTMLElement, BoxProps>(function VStack(
  { gap = 's', ...rest },
  ref,
) {
  return <Box ref={ref} display="flex" flexDirection="column" gap={gap} {...rest} />;
});
