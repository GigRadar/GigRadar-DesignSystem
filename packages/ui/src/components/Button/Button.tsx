import { color, component, typography, type ButtonSize } from '@gigradar/theme';
import { len, type CssLength } from '../../internal/length.js';

export type { CssLength };
import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from 'react';

export type { ButtonSize };


/**
 * The two button kinds drawn in Figma.
 *
 * `primary` is the blue filled button (node 2573:4267) and `secondary` the
 * white outlined one (node 2573:4294). Every per-feature button on the Figma
 * page — Cancel, Reschedule, Meeting, Schedule, Laziza AI — is one of these
 * two with a different label, so they are variants rather than components.
 */
export type ButtonVariant = 'primary' | 'secondary';

/**
 * The button's hue.
 *
 * Figma draws one button per feature — Meeting (4881:1023), Schedule
 * (4881:1395), Laziza AI (4884:10597), Cancel (4881:1003) — and they are the
 * same control in a different color: identical padding, radius, gap, and type.
 * So the feature is a tone rather than a component, and a new one is a row in
 * this table instead of a new file.
 *
 * `brand` is the default blue. `danger` is Figma's Cancel button, which is the
 * one tone drawn only as an outline. `remove` is the filled destructive button
 * from the confirmation popover (node 1272:11993).
 */
export type ButtonTone = 'brand' | 'meeting' | 'schedule' | 'laziza' | 'danger' | 'remove';

/**
 * Per-instance overrides for the button's own metrics.
 *
 * These are the same knobs as the `--gr-button-*` CSS variables, surfaced as
 * typed props: setting one writes that variable on the element, so a prop, a
 * stylesheet rule, and the token default are one mechanism rather than three.
 * Reach for a prop for a one-off, and the variable for a whole surface.
 *
 * Deliberately narrow — these are the button's own metrics, not a general
 * style system. There is no `margin`, `color`, or layout prop here.
 */
export type ButtonStyleProps = {
  /** Horizontal padding. Overrides the `size` step. */
  paddingX?: CssLength;
  /** Vertical padding. Overrides the `size` step. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Border thickness. */
  borderWidth?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Space between the icons and the label. */
  gap?: CssLength;
  /** Icon slot edge length. */
  iconSize?: CssLength;
  /** Label weight. */
  fontWeight?: number;

  /**
   * Surface, label, and border color. Each overrides whatever the
   * variant/tone pair supplies, so a one-off button can sit outside the
   * palette without reaching for a `style` prop.
   */
  background?: string;
  textColor?: string;
  borderColor?: string;
};

export type ButtonProps = {
  /** Which of the two kinds to render. */
  variant?: ButtonVariant;
  /**
   * The button's hue. Each of Figma's per-feature buttons is one of these —
   * `meeting`, `schedule`, and `laziza` are the feature colors, and `danger` is
   * the Cancel button.
   */
  tone?: ButtonTone;
  size?: ButtonSize;
  /** The label. */
  children?: ReactNode;
  /** Icon placed before the label. Sized to `iconSize` and not stretched. */
  startIcon?: ReactNode;
  /** Icon placed after the label. */
  endIcon?: ReactNode;
  /**
   * Shows the spinner in place of `endIcon` and makes the button inert.
   *
   * This is Figma's "Syncing" variant. It renders the disabled palette, since
   * a button that cannot be pressed should not look pressable — but it keeps
   * its label, so the button does not change width as it starts working.
   */
  loading?: boolean;
  /** Stretches the button to fill its container. */
  fullWidth?: boolean;
} & ButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

const { button } = component;


/**
 * Builds the CSS variables for whichever style props were passed.
 *
 * Writing variables rather than concrete properties is what lets the icon
 * slots — separate elements further down the tree — pick up `iconSize`
 * without the value being threaded through as a prop.
 *
 * Size-stepped variables are written unsuffixed AND at the active step, since
 * the component reads `--gr-button-font-size-medium` rather than a generic
 * name.
 */
function styleVars(props: ButtonStyleProps, size: ButtonSize): Record<string, string> {
  const vars: Record<string, string> = {};
  const set = (name: string, value: CssLength | undefined) => {
    const formatted = len(value);
    if (formatted !== undefined) vars[name] = formatted;
  };

  set(`--gr-button-padding-x-${size}`, props.paddingX);
  set(`--gr-button-padding-y-${size}`, props.paddingY);
  set(`--gr-button-font-size-${size}`, props.fontSize);
  set(`--gr-button-gap-${size}`, props.gap);
  set(`--gr-button-icon-size-${size}`, props.iconSize);
  set('--gr-button-radius', props.radius);
  set('--gr-button-border-width', props.borderWidth);

  // Colors are already CSS values — no px to append.
  const setRaw = (name: string, value: string | number | undefined) => {
    if (value !== undefined) vars[name] = String(value);
  };
  setRaw('--gr-button-font-weight', props.fontWeight);
  setRaw('--gr-button-background', props.background);
  setRaw('--gr-button-text-color', props.textColor);
  setRaw('--gr-button-border-color', props.borderColor);

  return vars;
}

/**
 * Each tone's fill, hover, and resting outline — every value a theme token.
 *
 * DECISION (reversible): Figma draws two of these slightly differently — the
 * Schedule button hovers to #6321A0 (the token is #763BAD), Laziza to #D57815
 * (token #DE7B11), and Schedule's resting outline is the lighter #E4EAF5 where
 * the other feature buttons use #C3CBD3. Encoded here as the tokens instead,
 * so the tones stay uniform and a token change reaches the buttons; if the
 * Figma-drawn one-offs are intended, they belong in the guidebook as tokens.
 */
const tones = {
  brand: { main: color.main.brand, hover: color.badge.hover, outline: color.navbar.hover },
  meeting: {
    main: color.accent.meetings.main,
    hover: color.accent.meetings.hover,
    outline: color.main.border,
  },
  schedule: {
    main: color.accent.schedule.main,
    hover: color.accent.schedule.hover,
    outline: color.main.border,
  },
  laziza: {
    main: color.accent.laziza.main,
    hover: color.accent.laziza.hover,
    outline: color.main.border,
  },
  danger: {
    main: color.accent.decrease.main,
    hover: color.accent.decrease.main,
    outline: color.accent.decrease.main,
  },
  /**
   * The Remove button from the confirmation popover (node 1272:11993).
   *
   * Distinct from `danger`, which Figma draws as an outline: this one is filled,
   * and it is the only tone that deepens rather than lightens on hover — from
   * the soft `decrease` coral to a full red. That jump is the point. The button
   * confirms a deletion, so it should feel more serious the closer the pointer
   * gets, where the other tones just acknowledge the hover.
   */
  remove: {
    main: color.accent.decrease.main,
    hover: color.status.error.text,
    outline: color.accent.decrease.main,
  },
} as const;

/**
 * The fills a variant takes at a given tone.
 *
 * `border` is always set — including on `primary`, where it matches the
 * background. A transparent border would work visually, but matching the fill
 * keeps both variants the same total size, so swapping one for the other never
 * shifts the layout by the border width.
 *
 * The secondary's resting border is neutral and only picks up the tone on
 * hover, which is what Figma draws for every feature button: a row of outlined
 * buttons stays quiet until you point at one.
 */
function paletteFor(variant: ButtonVariant, tone: ButtonTone) {
  const { main, hover, outline } = tones[tone];

  if (variant === 'primary') {
    return {
      background: main,
      hoverBackground: hover,
      border: main,
      hoverBorder: hover,
      text: color.main.white,
    };
  }

  // Cancel is drawn as an outline in its own color rather than a neutral one,
  // and tints its fill on hover instead of filling solid — a destructive action
  // should read as destructive before it is hovered. `remove` outlines the same
  // way: Figma draws it only as a filled button, so rather than invent a
  // neutral-bordered variant it borrows the destructive outline.
  if (tone === 'danger' || tone === 'remove') {
    return {
      background: color.main.white,
      hoverBackground: color.accent.decrease.background,
      border: main,
      hoverBorder: main,
      text: main,
    };
  }

  return {
    background: color.main.white,
    hoverBackground: color.main.white,
    border: outline,
    hoverBorder: main,
    text: tone === 'brand' ? color.navbar.textActive : color.navbar.text,
    hoverText: main,
  };
}

/**
 * The disabled palette.
 *
 * Figma draws two different disabled states: the primary button goes grey on
 * grey, while the secondary keeps its white fill and fades the label to the
 * border color. Both are reproduced rather than unified — the secondary's
 * ghosted look is what keeps a row of outlined buttons from turning into a row
 * of grey blocks.
 */
function disabledPaletteFor(variant: ButtonVariant, tone: ButtonTone) {
  if (variant === 'primary') {
    return {
      background: color.disable.background,
      border: color.disable.background,
      text: color.disable.text,
    };
  }

  // Cancel fades its outline to the disabled grey; the feature buttons keep a
  // neutral border and lean on `opacity` instead, which Figma applies to the
  // whole button rather than recoloring each part. `remove` follows Cancel,
  // matching how it borrows the destructive outline above.
  if (tone === 'danger' || tone === 'remove') {
    return {
      background: color.main.white,
      border: color.disable.background,
      text: color.disable.background,
    };
  }

  return {
    background: color.main.white,
    border: tones[tone].outline,
    text: tone === 'brand' ? color.navbar.hover : color.navbar.text,
  };
}

/**
 * Figma dims the whole disabled secondary rather than restyling its parts, on
 * every feature tone. Applied as opacity for the same reason: it fades border,
 * label, and icon together without a third palette per tone.
 */
const disabledSecondaryOpacity = 0.3;

/**
 * A button.
 *
 * Mirrors the Figma component (page 144:11090, nodes 2573:4267 and
 * 2573:4294): a 6px-radius control with 16/8 padding, 14px medium text, and
 * optional icons on either side of the label.
 *
 * Hover is tracked in state rather than written as a `:hover` rule, because
 * the component styles inline — the same reason the rest of this package does.
 * A disabled or loading button never takes the hover fill.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    tone = 'brand',
    size = 'medium',
    children,
    startIcon,
    endIcon,
    loading = false,
    fullWidth = false,
    disabled = false,
    type = 'button',
    paddingX,
    paddingY,
    radius,
    borderWidth,
    fontSize,
    gap,
    iconSize,
    fontWeight,
    background,
    textColor,
    borderColor,
    onMouseEnter,
    onMouseLeave,
    ...rest
  },
  ref,
) {
  const [hovered, setHovered] = useState(false);

  const vars = styleVars(
    {
      paddingX,
      paddingY,
      radius,
      borderWidth,
      fontSize,
      gap,
      iconSize,
      fontWeight,
      background,
      textColor,
      borderColor,
    },
    size,
  );

  // A loading button is inert for the same reason a disabled one is: the work
  // it would start is already running.
  const inert = disabled || loading;
  const hovering = hovered && !inert;

  // Resolved up front rather than at each property: the disabled palette has
  // no hover fills, since an inert button never takes one.
  const active = paletteFor(variant, tone);
  const fill = inert
    ? disabledPaletteFor(variant, tone)
    : hovering
      ? {
          background: active.hoverBackground,
          border: active.hoverBorder,
          // Only the outlined feature buttons recolor their label on hover.
          text: 'hoverText' in active ? active.hoverText : active.text,
        }
      : active;

  const style: CSSProperties = {
    // The variables land on the button so every descendant — including the
    // icon slots — resolves them, and so a `var()` further down still sees the
    // override.
    ...vars,
    boxSizing: 'border-box',
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center',
    justifyContent: 'center',
    gap: `var(--gr-button-gap-${size}, ${button.gap[size]}px)`,
    paddingLeft: `var(--gr-button-padding-x-${size}, ${button.paddingX[size]}px)`,
    paddingRight: `var(--gr-button-padding-x-${size}, ${button.paddingX[size]}px)`,
    paddingTop: `var(--gr-button-padding-y-${size}, ${button.paddingY[size]}px)`,
    paddingBottom: `var(--gr-button-padding-y-${size}, ${button.paddingY[size]}px)`,
    borderRadius: `var(--gr-button-radius, ${button.radius}px)`,
    // Each reads its variable and falls back to the resolved palette, so a
    // prop overrides the variant/tone pair without restating it.
    border: `var(--gr-button-border-width, ${button.borderWidth}px) solid var(--gr-button-border-color, ${fill.border})`,
    backgroundColor: `var(--gr-button-background, ${fill.background})`,
    color: `var(--gr-button-text-color, ${fill.text})`,
    // Figma dims the whole disabled outlined button rather than restyling it.
    // The destructive tones are excluded — they recolor border and label
    // instead, so dimming on top would fade them twice.
    opacity:
      inert && variant === 'secondary' && tone !== 'danger' && tone !== 'remove'
        ? disabledSecondaryOpacity
        : undefined,
    fontFamily: typography.fontFamily.base,
    fontSize: `var(--gr-button-font-size-${size}, ${button.fontSize[size]}px)`,
    fontWeight: `var(--gr-button-font-weight, ${typography.fontWeight.medium})`,
    letterSpacing: typography.letterSpacing.m,
    lineHeight: 1,
    // Figma draws the label on one line — a wrapped button changes height and
    // breaks the row it sits in.
    whiteSpace: 'nowrap',
    textAlign: 'center',
    cursor: inert ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    appearance: 'none',
  };

  return (
    <button
      {...rest}
      ref={ref}
      type={type}
      disabled={inert}
      // `aria-busy` is what tells a screen reader the button is working; the
      // spinner alone is purely visual.
      aria-busy={loading || undefined}
      style={style}
      onMouseEnter={(event) => {
        setHovered(true);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setHovered(false);
        onMouseLeave?.(event);
      }}
    >
      {startIcon != null && <ButtonIcon size={size}>{startIcon}</ButtonIcon>}
      {children}
      {loading ? (
        <ButtonIcon size={size}>
          <Spinner />
        </ButtonIcon>
      ) : (
        endIcon != null && <ButtonIcon size={size}>{endIcon}</ButtonIcon>
      )}
    </button>
  );
});

/**
 * A fixed-size slot for an icon.
 *
 * Both dimensions are set and the slot never shrinks, so an SVG sized in
 * percent fills it and one with an intrinsic size is contained rather than
 * stretching the button.
 */
function ButtonIcon({ size, children }: { size: ButtonSize; children: ReactNode }) {
  const edge = `var(--gr-button-icon-size-${size}, ${button.iconSize[size]}px)`;
  return (
    <span
      aria-hidden
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: edge,
        height: edge,
      }}
    >
      {children}
    </span>
  );
}

/**
 * The syncing spinner.
 *
 * Drawn as an SVG arc rather than shipped as an exported asset: Figma's is a
 * static image of a spinner, and this one has to actually turn. `currentColor`
 * keeps it on whatever the label is using, so it fades with the disabled text.
 *
 * The keyframes are injected alongside the element instead of living in a
 * stylesheet, since this package ships no CSS file.
 */
function Spinner() {
  return (
    <>
      <style>{'@keyframes gr-button-spin{to{transform:rotate(360deg)}}'}</style>
      <svg
        viewBox="0 0 16 16"
        width="100%"
        height="100%"
        fill="none"
        style={{ animation: 'gr-button-spin 0.7s linear infinite', display: 'block' }}
      >
        {/* The full ring, faded — it is the track the arc travels around. */}
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="2" opacity={0.3} />
        {/* A quarter arc at full strength, which is what reads as movement. */}
        <path
          d="M8 1.5a6.5 6.5 0 0 1 6.5 6.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </>
  );
}
