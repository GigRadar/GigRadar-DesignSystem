import { radius, spacing } from './space.js';
import { fontSize } from './typography.js';

/**
 * Component-level design tokens.
 *
 * These sit one layer above the primitives: a component reads
 * `component.button.height.medium` rather than a bare `36`, so the value has a
 * name, appears in the CSS custom properties, and can be overridden per app
 * without forking the component.
 *
 * ⚠️ SOURCE: unlike the color and typography tokens, these sizes are NOT
 * extracted from Figma — the guidebook (node 4363:1685) documents colors,
 * type, spacing, radius, and shadow, but contains no component specs. The
 * values below are derived from the spacing and type scales to be internally
 * consistent, and are the one part of this package that does not trace back to
 * a Figma value.
 *
 * When component specs are added to Figma, these should be replaced with the
 * real numbers. Doing so is a visual change but not an API change — the token
 * names stay the same.
 */

/**
 * Control heights.
 *
 * Kept as a shared scale for controls added later, so sizes stay consistent
 * across components rather than each picking its own.
 */
export const controlHeight = {
  small: 28,
  medium: 36,
  large: 44,
} as const;

export type ControlSize = keyof typeof controlHeight;

/**
 * Button metrics.
 *
 * These ARE from Figma (page 144:11090, the application button families
 * `Main button - feature` 2573:4267 and `Second button - feature` 2573:4294):
 * 16px horizontal padding, 8px vertical, a 6px corner radius, an 8px gap
 * between icon and label, and 14px medium text.
 *
 * That drawn button anchors the `medium` step. Figma draws only one size, so
 * `small` and `large` extend the scale proportionally — they are the one part
 * of this block not traceable to a Figma value.
 *
 * Note the radius is `radius.xs` (6), not `radius.s` (8): the button sits on
 * the radius scale's second step, matching what Figma draws.
 */
export const button = {
  /** Horizontal padding, paired to each size. */
  paddingX: {
    small: spacing.s,
    medium: spacing.m,
    large: spacing.l,
  },
  /** Vertical padding. Figma draws 8px, which is between `xs` and `s`. */
  paddingY: {
    small: 4,
    medium: 8,
    large: 12,
  },
  /** Label type size, paired to each size. */
  fontSize: {
    small: fontSize.s,
    medium: fontSize.m,
    large: fontSize.l,
  },
  /** Gap between the icon slots and the label. */
  gap: {
    small: spacing.xxs,
    medium: 8,
    large: spacing.s,
  },
  /** Icon edge length, matched to the label's type size. */
  iconSize: {
    small: 12,
    medium: 16,
    large: 20,
  },
  radius: radius.xs,
  borderWidth: 1,
} as const;

export type ButtonSize = keyof typeof button.fontSize;


/**
 * Avatar metrics.
 *
 * Unlike the tokens above, these ARE from Figma (node 456:8607): the component
 * is drawn at 32px with a 16px corner badge and 14px initials. That 32px
 * measurement anchors the `medium` step; the other sizes extend the scale
 * proportionally, keeping the badge at half the avatar diameter throughout.
 */
export const avatar = {
  size: {
    small: 24,
    medium: 32,
    large: 40,
  },
  /** Initials type size, paired to each avatar size. */
  fontSize: {
    small: fontSize.s,
    medium: fontSize.m,
    large: fontSize.l,
  },
  /**
   * Corner badge diameter — half the avatar, so it reads as a marker rather
   * than a second avatar.
   */
  badgeSize: {
    small: 12,
    medium: 16,
    large: 20,
  },
  /**
   * The white ring separating the badge from the avatar beneath it. Figma
   * draws this at 1.255px; rounded to 1.5px, which renders cleanly at 1x and 2x
   * where a fractional value would blur.
   */
  badgeRingWidth: 1.5,
  radius: radius.round,
  borderWidth: 1,
  /**
   * Default space between avatars in a group. Negative, so they overlap.
   *
   * A fixed step rather than a fraction of the avatar size: the overlap then
   * stays put when the avatars are resized, and reads as a spacing decision
   * rather than a ratio to tune.
   */
  groupGap: -spacing.xs,
} as const;

export type AvatarSize = keyof typeof avatar.size;

/**
 * Badge metrics.
 *
 * Four badges are drawn in Figma, and all of them are pills built from the
 * same three decisions — a horizontal pad, a vertical pad, and a type size —
 * so they share one token block rather than four near-identical ones.
 *
 * `medium` is the size Figma draws in each case:
 *   credit  (1282:28608) 4/2 padding, 12px text, 16px credit mark
 *   eyebrow (163:10)     9/6 padding, 12px text, 18px sparkles, 9px gap
 *   counter (313:6469)   24px circle, 12px text
 *   rank    (333:15163)  6/2 padding, 12px text
 *
 * `small` and `large` extend each scale proportionally; Figma draws only the
 * medium step, so those two are inference rather than extraction.
 */
export const badge = {
  /** Horizontal padding of the pill badges (credit, rank). */
  paddingX: {
    small: spacing.xxs,
    medium: spacing.xxs,
    large: spacing.xs,
  },
  paddingY: {
    small: 1,
    medium: 2,
    large: 3,
  },
  fontSize: {
    small: 10,
    medium: fontSize.s,
    large: fontSize.m,
  },
  /** Space between a badge's icon and its label. */
  gap: {
    small: 1,
    medium: 2,
    large: 3,
  },
  radius: radius.round,

  /** The eyebrow badge is roomier than the others — it is a standalone pill. */
  eyebrow: {
    paddingX: {
      small: 6,
      medium: 9,
      large: 12,
    },
    paddingY: {
      small: 4,
      medium: 6,
      large: 8,
    },
    fontSize: {
      small: 10,
      medium: fontSize.s,
      large: fontSize.m,
    },
    /** Sparkle glyph edge length. */
    iconSize: {
      small: 14,
      medium: 18,
      large: 22,
    },
    gap: {
      small: 6,
      medium: 9,
      large: 12,
    },
  },

  /** The counter is a circle, so one diameter replaces padding. */
  counter: {
    size: {
      small: 18,
      medium: 24,
      large: 30,
    },
    fontSize: {
      small: 10,
      medium: fontSize.s,
      large: fontSize.m,
    },
  },

  /** The credit mark — the dark circular "G" inside the credit badge. */
  credit: {
    markSize: {
      small: 12,
      medium: 16,
      large: 20,
    },
  },

  /** The rank badge sits a step wider than the credit badge — Figma draws 6px. */
  rank: {
    paddingX: {
      small: spacing.xxs,
      medium: spacing.xs,
      large: spacing.s,
    },
    /** The up/down triangle. */
    triangleSize: {
      small: 6,
      medium: 8,
      large: 10,
    },
  },
} as const;

export type BadgeSize = keyof typeof badge.fontSize;

/**
 * Checkbox metrics.
 *
 * Figma draws one size (node 538:9016): a 22px square with a full radius, a
 * 1.5px ring when unchecked, and a checkmark filling most of the box.
 * `small` and `large` extend that proportionally, as the badges do.
 *
 * Unlike the rest of this file the medium step IS extracted from Figma, so it
 * should not be re-derived when component specs land.
 */
export const checkbox = {
  /** Box edge length. Figma draws 22px. */
  size: {
    small: 18,
    medium: 22,
    large: 26,
  },
  /**
   * The checkmark's slot — a little under the box's own edge.
   *
   * Read this as a slot, not the glyph: `IconCheck` is drawn inset on its
   * 24×24 grid, occupying about 59% of the viewBox with roughly 5px of padding
   * on every side. So the visible tick is ~59% of whatever this value is, and
   * these numbers put it at just over half the box — a mark that reads clearly
   * as a checkmark with a comfortable margin inside the disc.
   *
   * Sizing by the glyph's own bounds rather than the slot is the trap here: a
   * slot of two thirds the edge, which looks right on paper, draws a tick
   * around a third of the box and reads as a dot.
   */
  iconSize: {
    small: 15,
    medium: 19,
    large: 22,
  },
  /** The ring drawn in the unchecked state. */
  borderWidth: 1.5,
  /**
   * Figma draws a 19.25px radius on a 22px box — past half the edge, so the
   * box is a circle. `round` says that intent without carrying the arithmetic.
   */
  radius: radius.round,
  /** Space between the box and its label. */
  gap: {
    small: spacing.xxs,
    medium: spacing.xs,
    large: spacing.s,
  },
  /** Label type size, matched to the box. */
  fontSize: {
    small: fontSize.s,
    medium: fontSize.s,
    large: fontSize.m,
  },
} as const;

export type CheckboxSize = keyof typeof checkbox.size;

/**
 * System loading spinner metrics.
 *
 * Figma node 1252:11907 draws a 16px ring with a 2px stroke, swept by an
 * angular gradient that runs from a dark blue through the brand blue and fades
 * to nothing — so the arc reads as a comet tail rather than a solid quarter.
 * The tail is what makes the direction of travel legible; a uniform arc spins
 * ambiguously.
 *
 * Only the 16px step is extracted; the rest of the scale extends it
 * proportionally at a constant stroke-to-size ratio, so a large spinner does
 * not read as a thicker ring.
 *
 * Distinct from the button's spinner (`Button`'s own `loading` prop), which is
 * a monochrome `currentColor` ring so it fades with the label it sits beside.
 * This one is a system-level indicator and always carries the brand gradient.
 */
export const spinner = {
  /** Ring diameter. Figma draws 16px. */
  size: {
    small: 12,
    medium: 16,
    large: 24,
    xlarge: 32,
  },
  /**
   * Stroke width, kept at 1/8 of the diameter — the ratio Figma's 2px-on-16px
   * ring sets. Held as explicit steps rather than computed so a step can be
   * nudged without the others moving.
   */
  strokeWidth: {
    small: 1.5,
    medium: 2,
    large: 3,
    xlarge: 4,
  },
  /**
   * One full turn, in milliseconds. Slower than the button's 700ms: that one
   * accompanies a click the user just made, while this one often sits alone on
   * a page and a fast spin reads as frantic.
   */
  duration: 900,
  /** Space between the ring and its adjacent label. */
  gap: {
    small: spacing.xxs,
    medium: spacing.xs,
    large: spacing.xs,
    xlarge: spacing.s,
  },
  /** Label type size, matched to the ring. */
  fontSize: {
    small: fontSize.s,
    medium: fontSize.s,
    large: fontSize.m,
    xlarge: fontSize.m,
  },
  /**
   * The gradient sweep. `head` is the dense end of the tail and `tail` the end
   * that fades out — both drawn from the same brand blue the rest of the system
   * uses, with the head darkened so the ring has a leading edge.
   */
  gradient: {
    head: '#205194',
    body: '#378AFA',
  },
} as const;

export type SpinnerSize = keyof typeof spinner.size;

/**
 * Segmented switch metrics.
 *
 * From Figma: the track (node 977:11153) is a `D6DFE7` pill with 4px of
 * padding, and each segment (node 3913:24775) is 26px tall with 8px of
 * horizontal padding, 4px vertical, a 4px gap to its badge, and 14px text —
 * regular when idle, medium when selected.
 *
 * Those measurements anchor the `medium` step. Figma draws only one size, so
 * `small` and `large` extend the scale proportionally — the one part of this
 * block not traceable to a Figma value.
 *
 * The discount badge inside a segment is drawn smaller than any step of the
 * shared `badge` scale above (6px/2px padding, 12px text), so it carries its
 * own numbers rather than bending that scale to fit.
 */
export const switchControl = {
  /** Segment height. Figma draws 26px. */
  height: {
    small: 22,
    medium: 26,
    large: 32,
  },
  /** Horizontal padding inside a segment. */
  paddingX: {
    small: spacing.xs,
    medium: 8,
    large: spacing.s,
  },
  /** Vertical padding inside a segment. */
  paddingY: {
    small: 2,
    medium: spacing.xxs,
    large: spacing.xs,
  },
  /** Label type size, paired to each size. */
  fontSize: {
    small: fontSize.s,
    medium: fontSize.m,
    large: fontSize.l,
  },
  /** Gap between a segment's label and its badge. */
  gap: {
    small: 2,
    medium: spacing.xxs,
    large: spacing.xxs,
  },
  /** Icon edge length, matched to the label's type size. */
  iconSize: {
    small: 12,
    medium: 14,
    large: 16,
  },
  /** The track's padding — the inset that makes the selected segment read as raised. */
  trackPadding: {
    small: 3,
    medium: spacing.xxs,
    large: spacing.xxs,
  },
  /**
   * Both the track and its segments are fully round. Figma draws 31.5px on a
   * 34px-tall track, which is past half the height — `round` says that intent
   * without carrying the arithmetic.
   */
  radius: radius.round,

  /** The "Save 20%" pill inside a segment. Smaller than the shared badge scale. */
  badge: {
    paddingX: {
      small: spacing.xxs,
      medium: spacing.xs,
      large: 8,
    },
    paddingY: {
      small: 1,
      medium: 2,
      large: 3,
    },
    fontSize: {
      small: 10,
      medium: fontSize.s,
      large: fontSize.m,
    },
    radius: radius.round,
  },
} as const;

export type SwitchSize = keyof typeof switchControl.height;

/**
 * Tooltip metrics.
 *
 * From Figma (node 64:2546, the four-position component set): a white 6px-radius
 * card with 14px horizontal and 10px vertical padding, an 8px gap between the
 * title and the body, and a 10×5px arrow pointing at the anchor. The title is
 * 18px Bold and the description 12px Medium in `main.description`.
 *
 * That drawn card anchors the `medium` step. Figma draws one size, so `small`
 * and `large` extend the scale proportionally — the part of this block not
 * traceable to a Figma value.
 *
 * Figma constrains the card to 110px wide, but that is the mock's own text
 * rather than a spec: a tooltip is sized by its content and capped by
 * `maxWidth`, so a real sentence wraps instead of being clipped at 110px.
 */
export const tooltip = {
  /** Horizontal padding. Figma draws 14px. */
  paddingX: {
    small: spacing.s,
    medium: 14,
    large: spacing.m,
  },
  /** Vertical padding. Figma draws 10px. */
  paddingY: {
    small: 8,
    medium: 10,
    large: spacing.s,
  },
  /** Gap between the title, the description, and any actions. */
  gap: {
    small: spacing.xs,
    medium: spacing.xs,
    large: spacing.xs,
  },
  /** Title type size. Figma draws 18px Bold. */
  titleFontSize: {
    small: fontSize.m,
    medium: 18,
    large: 20,
  },
  /** Description type size. Figma draws 12px Medium. */
  fontSize: {
    small: 11,
    medium: fontSize.s,
    large: fontSize.m,
  },
  radius: radius.xs,
  /**
   * The arrow, drawn as a CSS triangle rather than the exported SVG: Figma
   * ships one asset per direction, but the shape is a plain 10×5 triangle that
   * borders draw exactly — and drawn in CSS it inherits the card's background,
   * so recoloring the tooltip never leaves a white arrow behind.
   */
  arrow: {
    /** Base width of the triangle. Figma draws 10px. */
    width: 10,
    /** How far it protrudes from the card. Figma draws 5px. */
    height: 5,
  },
  /**
   * Distance between the anchor and the card, arrow included. The arrow is 5px,
   * so this leaves ~3px of daylight — enough that the tooltip reads as detached
   * without drifting away from what it points at.
   */
  offset: 8,
  /**
   * The cap on a tooltip's width before its text wraps. Not a Figma value —
   * Figma's 110px is the width of the word "Description". A tooltip is a short
   * sentence, and this is about where one becomes hard to scan.
   */
  maxWidth: 260,
  /**
   * The title's gradient, as Figma paints it — a radial sweep across the text
   * running light blue through the brand blue into a deeper blue.
   *
   * NOT what the component draws. The title renders as a flat `badge.foreground`
   * blue instead: the gradient reads as decoration on a label meant to be
   * scanned in a fraction of a second, and it costs a `background-clip: text`
   * trick that renders the title invisible wherever that is unsupported.
   * Retained here because it is still the drawn design, and a caller who wants
   * it can pass it through `titleColor`.
   */
  titleGradient: {
    from: '#5DADFD',
    via: '#3F8CF6',
    to: '#216BEF',
  },
  /** How long the tooltip waits before opening on hover, in milliseconds. */
  openDelay: 150,
} as const;

export type TooltipSize = keyof typeof tooltip.fontSize;

/**
 * Confirmation popover metrics.
 *
 * From Figma (node 1272:11979): a 219px-wide white card at an 8px radius, built
 * as three bands — a head holding the title, a body holding the message, and a
 * footer holding the actions right-aligned with a 4px gap. Padding is 16px
 * horizontal throughout, 12px vertical in the head, and 8px in the footer.
 *
 * Deliberately its own block rather than a size step of `tooltip`: the two are
 * different shapes. A tooltip is a floating label sized by its text, while this
 * is a fixed-width card with banded structure and a footer — sharing tokens
 * would mean one of them fighting the other's numbers.
 */
export const confirm = {
  /** Card width. Figma draws 219px. */
  width: 219,
  radius: radius.s,
  paddingX: spacing.m,
  /** Vertical padding in the head band. Figma draws 12px. */
  headPaddingY: spacing.s,
  /** Vertical padding in the footer band. Figma draws 8px. */
  footerPaddingY: 8,
  /** Space below the message, before the footer. */
  bodyPaddingBottom: spacing.s,
  /** Gap between the footer's buttons. Figma draws 4px. */
  footerGap: spacing.xxs,
  /** Title type size. Figma draws 14px Medium. */
  titleFontSize: fontSize.m,
  /** Message type size. Figma draws 14px Regular. */
  fontSize: fontSize.m,
} as const;

/**
 * Pagination metrics.
 *
 * From Figma: the page number (node 189:701) is a 24px round cell holding 12px
 * semibold text, and the bar it sits in (node 189:504) is a white pill with
 * 12/6 padding and a 12px gap between the arrows and the number row. The dot
 * indicator (node 527:13264) is a separate control — 8px dots, a 6px gap, and
 * 8/4 padding.
 *
 * The 24px cell anchors the `medium` step. Figma draws one size, so `small` and
 * `large` extend the scale proportionally — the part of this block not
 * traceable to a Figma value.
 *
 * Note the number row itself has NO gap in Figma: the cells butt together, and
 * the 24px cell around 12px text is what separates the numbers. Encoded as 0
 * rather than dropped so it stays overridable.
 */
export const pagination = {
  /** The round cell holding one page number. Figma draws 24px. */
  itemSize: {
    small: 20,
    medium: 24,
    large: 32,
  },
  /** Page number type size. Figma draws 12px semibold. */
  fontSize: {
    small: 10,
    medium: fontSize.s,
    large: fontSize.m,
  },
  /** The arrow glyphs flanking the row. */
  iconSize: {
    small: 10,
    medium: 12,
    large: 16,
  },
  /**
   * Space between cells in the number row. Zero, as drawn — the cells are wide
   * enough that their padding does the separating.
   */
  itemGap: {
    small: 0,
    medium: 0,
    large: 0,
  },
  /** Space between the arrows and the number row. Figma draws 12px. */
  gap: {
    small: 8,
    medium: spacing.s,
    large: spacing.m,
  },
  /** Horizontal padding of the surrounding bar. */
  paddingX: {
    small: 8,
    medium: spacing.s,
    large: spacing.m,
  },
  /** Vertical padding of the surrounding bar. */
  paddingY: {
    small: spacing.xxs,
    medium: spacing.xs,
    large: 8,
  },
  /** Both the bar and its cells are fully round. */
  radius: radius.round,

  /**
   * The dot indicator (node 527:13264) — Figma's "Pagination Auto".
   *
   * A separate control rather than a size step of the numbered bar: it shows
   * position without page numbers, the way a carousel does, so it carries its
   * own metrics instead of bending the 24px cell scale down to 8px.
   */
  dot: {
    /** Dot diameter. Figma draws 8px. */
    size: {
      small: 6,
      medium: 8,
      large: 10,
    },
    /** Space between dots. Figma draws 6px. */
    gap: {
      small: spacing.xxs,
      medium: spacing.xs,
      large: 8,
    },
    paddingX: {
      small: spacing.xs,
      medium: 8,
      large: spacing.s,
    },
    paddingY: {
      small: 2,
      medium: spacing.xxs,
      large: spacing.xs,
    },
  },
} as const;

export type PaginationSize = keyof typeof pagination.itemSize;

/**
 * Documentation chrome.
 *
 * The gallery's own surfaces — preview panels, prop tables, code blocks. These
 * are not product tokens: nothing in a GigRadar app should read them. They live
 * here so the gallery has names for its metrics instead of scattering bare
 * numbers, and so the docs and the components stay on one radius scale.
 */
export const docs = {
  /**
   * The area a component preview sits in. Borderless and unfilled — the
   * examples sit directly on the page, so only the breathing room around them
   * needs a value.
   */
  preview: {
    /** Vertical breathing room above and below the examples. */
    paddingY: spacing.m,
    /** Gap between examples in a preview row. */
    gap: spacing.s,
  },
  /** Prop tables and code blocks. */
  panel: {
    radius: radius.s,
    borderWidth: 1,
    paddingX: spacing.s,
    paddingY: spacing.xs,
  },
} as const;

export const component = {
  avatar,
  badge,
  button,
  checkbox,
  confirm,
  pagination,
  spinner,
  switchControl,
  tooltip,
  docs,
} as const;

export type ComponentTokens = typeof component;
