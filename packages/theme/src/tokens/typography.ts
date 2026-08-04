/**
 * GigRadar typography tokens.
 *
 * Extracted from the Figma guidebook (node 4363:1755).
 */

/**
 * SF Pro Display is the Figma family. It is a system font on Apple platforms
 * and absent elsewhere, so the stack falls back to the native UI font rather
 * than shipping a webfont.
 */
export const fontFamily = {
  base: `'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
  mono: `ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace`,
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
} as const;

export const fontSize = {
  h1: 78,
  h2: 48,
  h3: 32,
  h4: 24,
  /** Paragraph large. */
  l: 16,
  /** Paragraph medium — the default body size. */
  m: 14,
  /** Paragraph small — captions, helper text. */
  s: 12,
} as const;

export const letterSpacing = {
  h1: -4,
  h2: -2,
  h3: -1.2,
  h4: -0.8,
  l: -0.3,
  m: -0.3,
  s: -0.2,
} as const;

/**
 * DECISION (reversible): Figma reports `lineHeight: 100` on every text style.
 * Read literally that is 100px, which is wrong for 12px text; it is Figma's
 * "100%" auto setting, i.e. a 1.0 ratio. A 1.0 ratio is too tight for running
 * text, so headings use 1.2 and paragraphs 1.5.
 *
 * Override here if the intended values differ — this is the one set of numbers
 * on this page that did not come from Figma.
 */
export const lineHeight = {
  heading: 1.2,
  paragraph: 1.5,
} as const;

type TextStyle = {
  fontSize: number;
  fontWeight: number;
  letterSpacing: number;
  lineHeight: number;
};

/**
 * The 13 named text styles from the guidebook, ready to spread into a style
 * object or a CSS-in-JS rule.
 */
export const textStyle = {
  h1: { fontSize: fontSize.h1, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.h1, lineHeight: lineHeight.heading },
  h2: { fontSize: fontSize.h2, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.h2, lineHeight: lineHeight.heading },
  h3: { fontSize: fontSize.h3, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.h3, lineHeight: lineHeight.heading },
  /** Note: H4 is Regular in Figma, not Semibold like H1–H3. Preserved as-is. */
  h4: { fontSize: fontSize.h4, fontWeight: fontWeight.regular, letterSpacing: letterSpacing.h4, lineHeight: lineHeight.heading },

  lSemibold: { fontSize: fontSize.l, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.l, lineHeight: lineHeight.paragraph },
  lMedium: { fontSize: fontSize.l, fontWeight: fontWeight.medium, letterSpacing: letterSpacing.l, lineHeight: lineHeight.paragraph },
  lRegular: { fontSize: fontSize.l, fontWeight: fontWeight.regular, letterSpacing: letterSpacing.l, lineHeight: lineHeight.paragraph },

  mSemibold: { fontSize: fontSize.m, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.m, lineHeight: lineHeight.paragraph },
  mMedium: { fontSize: fontSize.m, fontWeight: fontWeight.medium, letterSpacing: letterSpacing.m, lineHeight: lineHeight.paragraph },
  mRegular: { fontSize: fontSize.m, fontWeight: fontWeight.regular, letterSpacing: letterSpacing.m, lineHeight: lineHeight.paragraph },

  sSemibold: { fontSize: fontSize.s, fontWeight: fontWeight.semibold, letterSpacing: letterSpacing.s, lineHeight: lineHeight.paragraph },
  sMedium: { fontSize: fontSize.s, fontWeight: fontWeight.medium, letterSpacing: letterSpacing.s, lineHeight: lineHeight.paragraph },
  sRegular: { fontSize: fontSize.s, fontWeight: fontWeight.regular, letterSpacing: letterSpacing.s, lineHeight: lineHeight.paragraph },
} as const satisfies Record<string, TextStyle>;

export type TextStyleName = keyof typeof textStyle;

export const typography = {
  fontFamily,
  fontWeight,
  fontSize,
  letterSpacing,
  lineHeight,
  textStyle,
} as const;

export type TypographyTokens = typeof typography;
