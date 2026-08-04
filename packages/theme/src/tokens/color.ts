/**
 * GigRadar color tokens.
 *
 * Extracted from the Figma guidebook (file HNZEuaniWtXmEINBodTtal, node
 * 4363:1685). Every hex here came from Figma — none were invented.
 *
 * Organised into six categories:
 *
 *   Foundation   `main`                    brand, text, surfaces, border
 *   State        `disable`, `status`       disabled, success, error, warning
 *   Surface      `navbar`, `badge`         component-specific chrome
 *   Domain       `accent`, `proposal`,     GigRadar concepts
 *                `stage`
 *   Integration  `integration`             external service brand colors
 *   Legacy       `deprecated`              retained for compatibility only
 *
 * These are LOCAL STYLES in Figma, not variables. When the Figma file is
 * migrated to variables, the values below should not change; only the
 * extraction method does.
 *
 * Not yet encoded — present in Figma's Color styles panel but not drawn into
 * the guidebook frame, which is the only machine-readable source:
 * Annotation (Text & Border, Background). Add it to the guidebook frame to
 * have it extracted.
 *
 * Known mismatch: Figma's Color styles panel names Laziza's first swatch
 * "Text", while the guidebook frame names it "Main". Encoded below as
 * `accent.laziza.main`, following the guidebook.
 */

/**
 * Core brand + surface colors. The "Main" row of the guidebook.
 */
export const main = {
  /** Primary brand blue. Buttons, links, active states, focus rings. */
  brand: '#378AFA',
  /** Secondary text — descriptions, captions, supporting copy. */
  description: '#525F7B',
  black: '#000000',
  white: '#FFFFFF',
  /** Page background — the default canvas behind content. */
  background: '#F5F8FF',
  /** Secondary background — raised or inset panels against `background`. */
  backgroundAlt: '#E7EFF6',
  /**
   * Search-match highlight — sits behind matched text. Figma: "Highlight-Search".
   *
   * Applied at 35% opacity in Figma, encoded as rgba rather than flattened so
   * the text and whatever surface is beneath both show through. Flattening to
   * an opaque hex would only be correct over white.
   */
  highlight: 'rgba(243, 211, 129, 0.35)',
  /** The solid fill behind `highlight`, for cases that need it opaque. */
  highlightSolid: '#F3D381',
  /**
   * Selected-match highlight — the current match within a result set.
   * Figma: "Highlight-Select". Also 35% opacity.
   */
  highlightSelect: 'rgba(55, 169, 250, 0.35)',
  /** The solid fill behind `highlightSelect`. */
  highlightSelectSolid: '#37A9FA',
  /** Default border/divider color. */
  border: '#C3CBD3',
} as const;

/**
 * Disabled state colors. Applies to any inert control.
 */
export const disable = {
  background: '#E3E3E3',
  backgroundAlt: '#C4C4C4',
  text: '#A5A6A8',
} as const;

/**
 * Navigation chrome. Sidebar and top-nav only — not general UI.
 */
export const navbar = {
  /** Inactive nav item label. */
  text: '#6C82A4',
  /** Active nav item label. */
  textActive: '#2D323E',
  hover: '#E4EAF5',
  /** High-contrast hover, for dark nav surfaces. Figma: "Hover-2". */
  hoverStrong: '#0A0B0E',
  background: '#FFFFFF',
  border: '#D6DFE7',
  disabledBackground: '#DCE8FF',
} as const;

/**
 * Badge / tag colors in the brand blue family.
 */
export const badge = {
  /** Text and icon color. Figma: "Text-Icon-Border". */
  foreground: '#378AFA',
  hover: '#145FC4',
  background: '#DAECFF',
  backgroundAlt: '#FFFFFF',
  /** Badge outline — lighter than `foreground`. Figma: "Border". */
  border: '#C2DDFE',
} as const;

/**
 * Semantic status colors.
 *
 * DECISION (reversible): Figma contains four overlapping alert palettes —
 * Failed (#FA3737), Error (#EF5350), Warning (#FFB74D), and Laziza (#FA8C16).
 * Failed/Error are near-duplicate reds; Warning/Laziza are near-duplicate
 * oranges. Four consuming apps would otherwise pick arbitrarily.
 *
 * Canonical: `error` (from Figma "Failed") and `warning` (from Figma "Warning").
 * The duplicates remain available via `deprecated` below so nothing breaks.
 */
export const status = {
  success: {
    main: '#00B67A',
    background: '#D9F4EB',
    text: '#00823D',
  },
  /** Canonical error. Figma group: "Failed". */
  error: {
    main: '#FA3737',
    /**
     * Figma has this as a 15% #FA3737 wash over white.
     * DECISION (reversible): flattened to an opaque hex so it composites
     * predictably over any surface.
     */
    background: '#FEE1E1',
    text: '#CF0000',
  },
  /** Canonical warning. Figma group: "Warning". */
  warning: {
    main: '#FFB74D',
    background: '#FFF8E1',
    text: '#F57C00',
    /** Higher-contrast warning text for small sizes. Figma: "Text-2". */
    textStrong: '#894600',
  },
  /** Informational. Aliased to the brand blue — Figma has no distinct info color. */
  info: {
    main: '#378AFA',
    background: '#DAECFF',
    text: '#145FC4',
  },
} as const;

/**
 * Domain-specific accents that are not status colors.
 */
export const accent = {
  /**
   * Figma group: "Laziza". Named to match Figma exactly, so a search for
   * "Laziza" finds this in both places.
   *
   * Distinct from `status.warning`, which is the semantic warning color —
   * these are near-identical oranges with different meanings, so pick by
   * intent rather than by appearance.
   */
  laziza: {
    main: '#FA8C16',
    hover: '#DE7B11',
    background: '#FFFBE6',
    backgroundAlt: '#F7B716',
  },
  /**
   * Figma group: "Decrease". Reads as a metric-delta color (a falling number),
   * which is why it is softer than `status.error`.
   */
  decrease: {
    main: '#F28B82',
    /** Figma: 25% #F28B82 over white. Flattened — see `status.error.background`. */
    background: '#FCE8E6',
    text: '#C66D65',
  },
  /** Figma group: "Schedule Messages". */
  schedule: {
    main: '#9B51E0',
    background: '#EFE6FF',
    hover: '#763BAD',
  },
  /** Figma group: "Meetings". */
  meetings: {
    main: '#27AE60',
    background: '#F3FFF9',
    hover: '#0C813E',
  },
} as const;

/**
 * Proposal state colors.
 *
 * Figma group: "Proposal". Only the `sent` state exists today; further states
 * are additive when they are designed.
 */
export const proposal = {
  sent: '#FBF0FF',
} as const;

/**
 * Brand colors for external services.
 *
 * Deliberately separate from the semantic tokens. These are Slack's and
 * Telegram's brand colors, owned by those companies — they carry no meaning
 * inside GigRadar's own UI. Keeping them out of `status` and `accent` stops
 * `slack.main` being reached for when a semantic purple was wanted.
 *
 * Use these only where the service itself is being represented: a channel
 * badge, a connection card, an integration toggle.
 */
export const integration = {
  slack: {
    main: '#4A154B',
    hover: '#340E35',
    background: '#F3EEF4',
    border: '#C6B4C7',
  },
  telegram: {
    main: '#2AABEE',
    hover: '#1D74A1',
    background: '#E8F6FD',
    border: '#B5E2F9',
  },
} as const;

export type IntegrationName = keyof typeof integration;

/**
 * CRM pipeline stage colors.
 *
 * Figma prefixes these `[U]`, `[P]`, and `[L]`.
 * DECISION (reversible): read as Unqualified / Pipeline / Lost and grouped
 * accordingly. If the prefixes mean something else, only this grouping changes —
 * the hex values and stage names are verbatim from Figma.
 *
 * These are background fills; pair with a dark foreground.
 */
export const stage = {
  unqualified: {
    new: '#DFEFFF',
    contactLater: '#E3E9EF',
  },
  pipeline: {
    interested: '#D9EFEE',
    booked: '#D5EFE2',
    happened: '#CFF0D9',
    qualified: '#BEF2C7',
    converted: '#A6F4AB',
  },
  lost: {
    unreachable: '#FBDDDD',
    /** Figma: "[L] Not Interest - Already Equipped". */
    notInterested: '#F7B8B8',
  },
} as const;

/**
 * Flat map of every stage color, for lookups keyed by stage name.
 */
export const stageFlat = {
  new: stage.unqualified.new,
  contactLater: stage.unqualified.contactLater,
  interested: stage.pipeline.interested,
  booked: stage.pipeline.booked,
  happened: stage.pipeline.happened,
  qualified: stage.pipeline.qualified,
  converted: stage.pipeline.converted,
  unreachable: stage.lost.unreachable,
  notInterested: stage.lost.notInterested,
} as const;

export type StageName = keyof typeof stageFlat;

/**
 * Avatar tone palette.
 *
 * Extracted from the Avatar component in Figma (node 456:8607). Each tone is a
 * background / border / text triplet drawn from one hue, so initials stay
 * legible on their own fill.
 *
 * Deliberately separate from `status` and `accent`: these carry no semantic
 * meaning. A tone is picked to distinguish one person from another — usually by
 * hashing a name — not to signal state. Keeping them apart stops
 * `avatarTone.red` being reached for when `status.error` was meant.
 */
export const avatarTone = {
  cyan: { background: '#E6FFFB', border: '#87E8DE', text: '#006D75' },
  magenta: { background: '#FFF0F6', border: '#FFADD2', text: '#C41D7F' },
  purple: { background: '#F9F0FF', border: '#D3ADF7', text: '#531DAB' },
  orange: { background: '#FFF7E6', border: '#FFD591', text: '#AD4E00' },
  red: { background: '#FFF1F0', border: '#FFA39E', text: '#CF1322' },
  volcano: { background: '#FFF2E8', border: '#FFBB96', text: '#D4380D' },
  green: { background: '#F6FFED', border: '#B7EB8F', text: '#237804' },
  gold: { background: '#FFFBE6', border: '#FFE58F', text: '#874D00' },
  lime: { background: '#FCFFE6', border: '#EAFF8F', text: '#4B700E' },
  geekBlue: { background: '#F0F5FF', border: '#ADC6FF', text: '#1D39C4' },
  blue: { background: '#E6F4FF', border: '#91CAFF', text: '#0958D9' },
  /**
   * The placeholder tone — Figma's "*️⃣ 0.5 - Default" variant. Uses the
   * disabled greys, and is what an avatar falls back to with no name to show.
   */
  default: { background: disable.background, border: disable.text, text: disable.text },
} as const;

export type AvatarToneName = keyof typeof avatarTone;

/**
 * Values kept only so existing screens keep compiling.
 *
 * Per the additive-by-default rule, nothing is deleted outright — removal
 * requires a deprecation cycle and a major version.
 */
export const deprecated = {
  /** @deprecated Use `status.error` (#FA3737). This near-duplicate red was Figma's "Error" group. */
  errorAlt: {
    main: '#EF5350',
    background: '#FFEBEE',
    text: '#C62828',
  },
} as const;

export const color = {
  main,
  disable,
  navbar,
  badge,
  status,
  accent,
  proposal,
  stage,
  stageFlat,
  integration,
  avatarTone,
  deprecated,
} as const;

export type ColorTokens = typeof color;
