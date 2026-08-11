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
 * Control heights — the one number every interactive control stands on.
 *
 * This is what makes a row of mixed controls line up: a button beside a text
 * input beside a dropdown all read the same step, so none of them has to know
 * about the others. Button applies it as `minHeight`; components that draw
 * their own box (the prompt field's version pill, its revision-name input)
 * read `controlHeight.medium` directly.
 *
 * Before this was wired up, height was whatever padding plus content happened
 * to sum to — a `medium` button came out at 32px, an icon-only one at 34px,
 * and any row mixing them needed hand-derived padding to look level. If a step
 * needs to change, change it here rather than in a component.
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

  /**
   * The status tag — Figma's "Account Status" (node 2113:1929).
   *
   * The one badge in the family that is not a round pill: Figma draws a 4px
   * radius with 6/2 padding, because it sits tucked under a name as a property
   * of the thing above it rather than standing alone in a row. Its own block
   * for that reason — the shared `radius: round` above would flatten exactly
   * the detail that distinguishes it.
   */
  status: {
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
    /** Figma draws 4px — the second step of the radius scale. */
    radius: radius.xxs + 2,
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
 * The prompt editor's metrics — the mono field, the variable chips, and the
 * version pill that make up the CRM ▸ Settings ▸ AI Configuration card
 * (Figma node 4949:2023).
 *
 * These ARE from Figma. The field is node 3770:117, the chip 3812:23322, and
 * the version pill 3770:1031 with its expanded list at 3804:22300.
 *
 * One block rather than three because the three are only ever drawn together:
 * the chips insert into the field, the version pill swaps what the field
 * holds, and they share a radius and a mono type size so they read as one
 * control.
 */
export const prompt = {
  /**
   * The mono editing surface. Figma draws a 12px-padded pale-blue box with
   * 11px Menlo text and no border of its own — the card around it draws the
   * edge.
   */
  field: {
    paddingX: spacing.s,
    paddingY: spacing.s,
    /** Mono type size. Figma draws 11px, below the 12px paragraph step. */
    fontSize: 11,
    /**
     * Line height for the mono text. Figma reports the usual `100` sentinel;
     * 1.6 is what keeps a wall of prompt text scannable, and is the one number
     * in this block that did not come from Figma.
     */
    lineHeight: 1.6,
    /** Default visible height before the field scrolls. Figma draws 322px. */
    minHeight: 322,
    /** The drag corner Figma draws bottom-right at 30% opacity. */
    resizeHandleSize: 24,
    /** Scrollbar thumb width. Figma draws an 8px pill. */
    scrollbarWidth: 8,
    radius: radius.m,
  },
  /**
   * The `{{agency_name}}` chip. A 4px-padded mono tag on the page background
   * that turns brand blue on hover, since clicking it inserts at the cursor.
   */
  variable: {
    paddingX: spacing.xxs,
    paddingY: spacing.xxs,
    /** Matches the field's mono size, so an inserted chip reads as its text. */
    fontSize: 11,
    radius: radius.xs,
    /** Space between chips in the insert strip. Figma draws 8px. */
    gap: 8,
  },
  /**
   * The version pill and the list it opens.
   *
   * `size` is the square the pill collapses to beside the name field. Figma
   * draws 33px — one off `controlHeight.medium` — but it reads the scale
   * anyway: the pill sits in a row with a text input and three buttons, and
   * every one of them lining up matters more than the odd pixel. A row that
   * derives its height from one token cannot drift.
   */
  version: {
    size: controlHeight.medium,
    paddingX: 8,
    paddingY: 8,
    /** Space between the `v2` label and its chevron. Figma draws 6px. */
    gap: 6,
    fontSize: fontSize.m,
    /** The chevron. Figma draws it at the small paragraph size. */
    iconSize: fontSize.s,
    radius: radius.xs,
    /** The dropdown panel. */
    menu: {
      radius: radius.m,
      padding: 8,
      /** Space between rows. Figma draws 8px. */
      gap: 8,
      /** Row padding. Figma draws 9px — between `xs` (6) and 8. */
      itemPadding: 9,
      itemRadius: radius.m,
      /** Cap on the panel's height before the list scrolls. Not from Figma. */
      maxHeight: 320,
      /** Panel width when it opens over the pill. Not from Figma. */
      minWidth: 380,
    },
  },
} as const;

/**
 * A titled section of a settings screen — Figma's "Custom Prompt" wrapper
 * (node 3770:886) and its siblings on the AI Configuration page.
 *
 * A heading, a line of explanation, and whatever the section holds. Every
 * block on that screen is one of these, which is why it is a component rather
 * than markup repeated four times.
 */
/**
 * The band at the top of a settings screen — Figma node 3767:1258.
 *
 * The screen's own title and its one-line explanation, with an optional back
 * chevron. Distinct from `settingsSection`, which titles a block *within* the
 * screen at the paragraph size; this one is a real heading step.
 */
export const settingsHeader = {
  paddingX: spacing.l,
  /** Figma draws 32px — the page's main separator step. */
  paddingY: spacing.xl,
  /** Space between the back chevron and the title block. */
  gap: spacing.l,
  /** Space between the title and its description. */
  titleGap: 2,
  /** The back chevron's slot. */
  iconSize: 17,
} as const;

export const settingsSection = {
  /** Space between the title block and the content below it. */
  gap: 10,
  /** Space between the heading and its description. */
  titleGap: 2,
  /** Horizontal inset. Figma draws 24px — the page's own separator step. */
  paddingX: spacing.l,
  /** Heading type size. Figma draws 14px Medium, not a heading style. */
  fontSize: fontSize.m,
  /** Description type size. */
  descriptionFontSize: fontSize.m,
} as const;

/**
 * The settings panel — the left rail of CRM ▸ Settings.
 *
 * Figma: node 8272:40787 expanded, 8299:28723 collapsed.
 *
 * The panel is a list of rounded cards rather than the flat rows a sidebar
 * usually draws, so it carries its own metrics instead of borrowing the
 * navbar's.
 */
export const settingsPanel = {
  /** Panel width when expanded. Figma draws 300px. */
  width: 300,
  /**
   * Panel width when collapsed — one icon plus the card's padding.
   *
   * Not a Figma number: the collapsed frame is auto-width around a 24px icon
   * in a 16px-padded card inside a 12px-padded list, which is what this sums.
   */
  collapsedWidth: 24 + 16 * 2 + 12 * 2,
  /** The header band holding the title and the collapse toggle. */
  header: {
    height: 75,
    paddingX: spacing.xl,
    paddingY: spacing.m,
  },
  /** Padding around the list of cards. */
  listPadding: spacing.s,
  /** Space between top-level entries. */
  gap: spacing.s,
  /**
   * One entry — Figma's "Settings Card" (node 2104:18385).
   *
   * A left-aligned row rather than a button: 16px radius against the button's
   * 6, a 24px icon against 16, and no min-height, since the row's height comes
   * from its own padding. Its selected state is a route, not a press.
   */
  item: {
    /** Figma draws a 16px radius — off the radius scale, between `m` and `l`. */
    radius: 16,
    paddingX: spacing.m,
    paddingY: spacing.s,
    /** Extra left padding on a sub-entry, which Figma indents to 32px. */
    subPaddingX: spacing.xl,
    /** Space between the icon and the label. */
    gap: 8,
    /** Icon slot. Figma draws 24px. */
    iconSize: 24,
    fontSize: fontSize.l,
  },
  /** Space between a parent entry and its sub-entries. */
  subGap: 8,
  /** Horizontal inset of the whole sub-list. */
  subInset: 8,
} as const;

/**
 * Loading placeholder metrics.
 *
 * Not from Figma — the design draws its loading state as flat grey bars
 * without specifying them. These are derived from the type and radius scales
 * so a placeholder sits at the height of the thing it stands in for.
 */
export const skeleton = {
  /** Height of a plain rectangle — a card, a panel, an image slot. */
  blockHeight: 16,
  /** Height of one line of text, matched to the paragraph step. */
  textHeight: 12,
  /** Default avatar-slot diameter. */
  circleSize: avatar.size.medium,
  radius: radius.xs,
  /** Space between stacked bars. */
  gap: 8,
  /** The bright band that sweeps across the base fill. */
  highlight: '#EFEFEF',
  /** One full sweep, in milliseconds. Slow enough to read as ambient. */
  duration: 1400,
} as const;

/**
 * Icon-only button metrics.
 *
 * A square button holding one glyph and no label — the close, back, and
 * overflow controls. Sized so the tap target stays at the control-height step
 * even though the glyph inside is much smaller than a label would be.
 */
export const iconButton = {
  /** The button's edge. Matches `controlHeight` so it lines up in a row. */
  size: {
    small: controlHeight.small,
    medium: controlHeight.medium,
    large: controlHeight.large,
  },
  /** The glyph inside, at roughly half the button's edge. */
  iconSize: {
    small: 14,
    medium: 16,
    large: 20,
  },
  /** Round by default — these are the chrome controls, not form buttons. */
  radius: radius.round,
} as const;

export type IconButtonSize = keyof typeof iconButton.size;

/**
 * Modal metrics — the dimmed overlay and the card floating in it.
 *
 * From the authorization popup Figma draws (node 2119:14503): a 24px-radius
 * white card with a heavy drop shadow. The backdrop is not drawn there, so its
 * dimming is chosen here — dark enough that the page behind stops competing,
 * light enough that the user keeps their place.
 */
export const modal = {
  /** The card's default width, when a caller names no size. */
  width: 480,
  radius: radius.l,
  /** Space between the viewport edge and the card on a small screen. */
  viewportPadding: spacing.m,
  /** The dimming layer over the page. */
  backdrop: 'rgba(0, 0, 0, 0.35)',
  shadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
  /** How long the card and backdrop take to appear, in milliseconds. */
  duration: 160,

  /**
   * The three bands every modal card is built from, extracted from Figma node
   * 2077:8840 — the schedule-message dialog, which is where the shell is drawn
   * most completely.
   *
   * Taken as the shell rather than as that one dialog: the head, the scrolling
   * body, and the right-aligned footer are the same in every modal on the
   * page, and only what sits between them changes.
   */
  header: {
    padding: spacing.m,
    /** Space between the title row and anything below it in the head. */
    gap: spacing.l,
    /** Title type size — 16px medium in Figma. */
    fontSize: fontSize.l,
    /**
     * The head's own shadow, which is what separates it from the body as the
     * body scrolls under it. A border would draw a hard line at rest; this
     * only reads once there is something to scroll.
     */
    shadow: '0px 6px 6px 0px rgba(0, 0, 0, 0.05)',
  },
  content: {
    paddingX: spacing.l,
    paddingTop: spacing.m,
    paddingBottom: spacing.s,
    /** Space between blocks inside the body. */
    gap: spacing.m,
  },
  footer: {
    padding: spacing.m,
    /** Space between the footer's buttons. */
    gap: spacing.xs,
  },
  /**
   * The dialog shell's own shadow, which is tighter than the generic modal
   * shadow above: Figma draws `0 1px 8px rgba(0,0,0,0.12)` on the card.
   */
  cardShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
} as const;

/**
 * The Upwork connected-account screen — CRM ▸ Settings ▸ Upwork Connected
 * Account (Figma node 2105:34594, seven states).
 *
 * The screen is a two-column split: a left column listing every account slot,
 * and a right column holding the authorize banner, the safety notice, and the
 * numbered steps. Both columns and every card inside them are drawn on their
 * own metrics rather than the settings rail's, so they carry their own block.
 *
 * Note the radii here are off the shared scale: Figma draws 14px on an account
 * card and 16px on a banner, which sit between `m` (12) and `l` (24). They are
 * held as literals for the same reason `settingsPanel.item.radius` is — the
 * drawn value wins over the scale when the two disagree.
 */
export const upworkAccounts = {
  /** The left column. Figma draws a fixed 640px against a flexible right. */
  listColumn: {
    width: 640,
    /** The column's own tint, a half-step off the page background. */
    background: '#FAFBFC',
  },
  /** The header band above each column — title, subtitle, and any actions. */
  header: {
    paddingX: spacing.l,
    paddingY: spacing.xl,
    gap: spacing.s,
    /** Space between the title and the subtitle under it. */
    titleGap: 2,
  },
  /** Padding around the body of either column. */
  bodyPaddingX: spacing.m,
  /** Space between blocks stacked in the left column. */
  gap: spacing.m,
  /** Space between blocks in the right column. Figma draws 19px. */
  sideGap: 19,
  /** The right column's cards are drawn at a fixed 285px. */
  sideWidth: 285,
  /** The grey bars the loading state draws in place of real content. */
  skeletonRadius: radius.xs,

  /**
   * One account slot — filled, empty, or a call to action.
   *
   * Figma draws all four variants (node 2117:9909) at the same 14px radius and
   * 12px padding, and separates them by border alone: a filled slot gets a
   * solid pale-blue edge, an empty one a dashed grey edge, and the two action
   * slots a dashed brand edge on the badge fill. One block, four palettes.
   */
  card: {
    radius: 14,
    padding: spacing.s,
    borderWidth: 1.5,
    /** Space between the avatar and the name/status stack. */
    gap: 8,
    /** Space between the name and its status pill. */
    textGap: spacing.xxs,
    /** Name type size. */
    fontSize: fontSize.m,
    /** Minimum height of an empty slot, so a row of them stays level. */
    minHeight: 63,
    /** The +/lock glyph on an action slot, matched to the label's type size. */
    iconSize: 16,
    /** The grid the slots are laid out on. Figma draws three per row. */
    columns: 3,
    columnGap: spacing.m,
    rowGap: spacing.m,
  },

  /**
   * The account's status pill — Active, Suspended, Pending, and the error
   * states. A squarer, tighter badge than the shared `badge` scale: 4px radius
   * against that scale's full round, since it sits under a name rather than
   * standing alone.
   */
  status: {
    paddingX: spacing.xs,
    paddingY: 2,
    radius: radius.xxs + 2,
    fontSize: fontSize.s,
  },

  /**
   * The empty-state panel the left column shows before any account exists —
   * Figma's "No Connected/API" (node 2130:2470).
   */
  empty: {
    radius: 14,
    paddingY: spacing.xl,
    borderWidth: 1,
    /** The round icon plate above the message. */
    iconPlateSize: 40,
    iconSize: 20,
    /** Space between the icon plate and the message. */
    gap: spacing.s,
    /** Space between the message block and the action button. */
    actionGap: spacing.l,
  },

  /**
   * The authorize banner (node 2130:2521) — the gradient-washed card at the
   * top of the right column.
   */
  banner: {
    radius: 16,
    padding: spacing.m,
    borderWidth: 2,
    gap: spacing.m,
    /** The gradient wash and its edge, both drawn at low alpha over white. */
    gradientFrom: 'rgba(93, 173, 253, 0.1)',
    gradientTo: 'rgba(24, 82, 211, 0.1)',
    borderColor: 'rgba(93, 173, 253, 0.3)',
  },

  /**
   * The primary authorize button (node 2130:2496). Wider and rounder than the
   * design system button — Figma draws a 253px pill at a 12px radius with
   * 16/12 padding, against Button's 6px radius and content width.
   */
  authorizeButton: {
    width: 253,
    radius: radius.m,
    paddingX: spacing.m,
    paddingY: spacing.s,
    gap: spacing.s,
    fontSize: fontSize.m,
    iconSize: 12.5,
  },

  /** The account safety notice (node 4893:16319). */
  notice: {
    radius: radius.m,
    padding: spacing.s,
    borderWidth: 1,
    gap: spacing.s,
    /** The round warning plate beside the heading. */
    iconPlateSize: 24,
    fontSize: fontSize.s,
  },

  /**
   * The numbered authorization steps, and the same numbered rows inside the
   * confirmation popup. One block: they are the same 24px disc and label.
   */
  step: {
    /** The numbered disc. Figma draws 24px with 11px semibold text. */
    size: 24,
    fontSize: 11,
    /** Space between the disc and its label. */
    gap: 8,
    /** Space between steps. */
    rowGap: 8,
    /** Space between the list's heading and the first step. */
    titleGap: spacing.s,
    labelFontSize: fontSize.s,
  },

  /**
   * The authorization confirmation popup (node 2119:14503) — three states:
   * in progress, successful, and failed.
   */
  popup: {
    width: 413,
    radius: radius.l,
    /** The head band holding the icon tile, the title, and the countdown. */
    headPaddingX: spacing.xl,
    headPaddingY: spacing.l,
    /** The square icon tile in the head. Figma draws 48px at a 16px radius. */
    tileSize: 48,
    tileRadius: 16,
    bodyPadding: spacing.xl,
    bodyGap: spacing.l,
    /** The large status disc in the body. */
    statusSize: 72,
    /**
     * Space between the head's icon tile, its title block, and the countdown.
     *
     * The popup's own value rather than the safety notice's, which it borrowed
     * before: the two are unrelated blocks that happened to agree at 12px, and
     * a shared reference makes retuning one silently move the other.
     */
    headGap: spacing.s,
    /** Space between the head's title and its subtitle. */
    headTitleGap: spacing.xxs,
    /** Space between the status disc and the heading under it. Figma draws 21px. */
    statusGap: 21,
    /** The heading and its description. */
    headingGap: 8,
    /** The disc beside the panel's own title, and the space between them. */
    panelIconSize: 32,
    panelTitleGap: spacing.s,
    /** The panel of numbered rows under the status. */
    panelRadius: 16,
    panelPadding: spacing.s,
    panelGap: spacing.m,
    /** One row inside that panel. */
    rowRadius: 14,
    rowPadding: 8,
    rowGap: spacing.s,
    titleFontSize: 20,
    shadow: '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
    /**
     * The tints the two terminal states wash their status disc and panel in.
     *
     * Alpha values rather than the flat `status.*.background` colors, because
     * Figma paints the failed state as a 15% red over white and the panel
     * border as the same red at 35% — a flat token cannot express the pair,
     * and the success panel's border needs the matching treatment to sit level
     * with it.
     */
    tint: {
      successBorder: 'rgba(0, 182, 122, 0.35)',
      failedSurface: 'rgba(250, 55, 55, 0.15)',
      failedBorder: 'rgba(250, 55, 55, 0.35)',
    },
  },
} as const;

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
  iconButton,
  modal,
  pagination,
  prompt,
  settingsHeader,
  settingsPanel,
  settingsSection,
  skeleton,
  spinner,
  switchControl,
  tooltip,
  upworkAccounts,
  docs,
} as const;

export type ComponentTokens = typeof component;
