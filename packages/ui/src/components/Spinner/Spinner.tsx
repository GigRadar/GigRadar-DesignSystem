import { color, component, typography, type SpinnerSize } from '@uiuxjoseph/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

export type { SpinnerSize };

const { spinner } = component;

/**
 * The keyframes and the masked-gradient rule, injected once.
 *
 * This package ships no stylesheet, so anything that cannot be expressed as an
 * inline style has to arrive with the element. Two things qualify: the rotation
 * keyframes, and the `mask` shorthand — a conic gradient punched through a ring
 * mask is what produces the fading tail, and `mask-composite` has no inline
 * equivalent that works across engines.
 *
 * Written as a plain `<style>` next to the ring rather than appended to
 * `document.head`, so it works under SSR and cannot leak between roots. Browsers
 * de-duplicate identical rules, so several spinners on a page cost nothing.
 */
const SPINNER_CSS = `
@keyframes gr-spinner-turn { to { transform: rotate(360deg); } }
.gr-spinner-ring {
  border-radius: 50%;
  mask: radial-gradient(farthest-side, transparent calc(100% - var(--gr-spinner-stroke)), #000 calc(100% - var(--gr-spinner-stroke)));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - var(--gr-spinner-stroke)), #000 calc(100% - var(--gr-spinner-stroke)));
  animation: gr-spinner-turn var(--gr-spinner-duration) linear infinite;
}
/* The round cap on the dense end of the tail. Without it the gradient stops on
   a hard radial edge, which reads as a cut rather than a comet head. */
.gr-spinner-ring::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--gr-spinner-stroke);
  height: var(--gr-spinner-stroke);
  border-radius: 50%;
  background: var(--gr-spinner-head);
  transform: translateX(-50%);
}
@media (prefers-reduced-motion: reduce) {
  .gr-spinner-ring { animation-duration: calc(var(--gr-spinner-duration) * 3); }
}
`;

/**
 * Per-instance overrides for the spinner's own metrics.
 *
 * The same narrow set the other components expose — dimensions and colors, not
 * a general style system.
 */
export type SpinnerStyleProps = {
  /** Ring diameter. Overrides the `size` step. */
  diameter?: CssLength;
  /** Ring thickness. */
  strokeWidth?: CssLength;
  /** Space between the ring and its label. */
  gap?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** The dense, leading end of the tail. */
  headColor?: string;
  /** The color the tail sweeps through before fading out. */
  bodyColor?: string;
  /** Label color. */
  textColor?: string;
  /** One full turn, in milliseconds. */
  duration?: number;
};

export type SpinnerProps = {
  size?: SpinnerSize;
  /**
   * An optional caption beside the ring — "Loading results…". Rendered inline
   * by default; with `stacked` it sits underneath.
   */
  label?: ReactNode;
  /** Puts the label below the ring instead of beside it. */
  stacked?: boolean;
  /**
   * What a screen reader announces. Defaults to the `label` when that is a
   * plain string, and to "Loading" otherwise — a spinner with no accessible
   * name is just a decorative circle to anyone not looking at it.
   */
  'aria-label'?: string;
} & SpinnerStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The system loading indicator.
 *
 * Figma: node 1252:11907 — a 16px ring stroked with an angular gradient that
 * runs from a dark blue through the brand blue and fades to transparent, giving
 * the arc a comet tail. The tail is what makes the direction of travel legible;
 * a uniform arc spins ambiguously.
 *
 * This is deliberately NOT the button's spinner. `Button`'s `loading` prop
 * draws a monochrome `currentColor` ring so it fades along with the label it
 * sits beside — it belongs to the button. This one is a system-level indicator
 * for page, panel, and section loads, and always carries the brand gradient
 * regardless of the text around it.
 *
 * Drawn as a masked conic gradient rather than an SVG arc because the fade is
 * continuous: an SVG `stroke` can hold one color, so a tail would have to be
 * faked with a stack of stepped segments. It is also not the exported Figma
 * asset — that is a static image, and this has to turn.
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  {
    size = 'medium',
    label,
    stacked = false,
    diameter,
    strokeWidth,
    gap,
    fontSize,
    headColor,
    bodyColor,
    textColor,
    duration,
    'aria-label': ariaLabel,
    ...rest
  },
  ref,
) {
  const edge = len(diameter) ?? `${spinner.size[size]}px`;
  const stroke = len(strokeWidth) ?? `${spinner.strokeWidth[size]}px`;
  const head = headColor ?? spinner.gradient.head;
  const body = bodyColor ?? spinner.gradient.body;

  const rootStyle: CSSProperties = {
    display: 'inline-flex',
    flexDirection: stacked ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: len(gap) ?? `${spinner.gap[size]}px`,
  };

  const ringStyle: CSSProperties = {
    // `position` and the two custom properties are what the injected rule
    // reads — the mask geometry and the cap both depend on the stroke width.
    position: 'relative',
    boxSizing: 'border-box',
    flexShrink: 0,
    width: edge,
    height: edge,
    // The sweep starts at the top so the round cap sits at 12 o'clock, and the
    // dense head leads the direction of rotation. The tail reaches full
    // transparency just before coming back around, which is what leaves a gap
    // between head and tail instead of a closed ring.
    background: `conic-gradient(from 0deg, ${head} 0deg, ${body} 166deg, transparent 360deg)`,
    ['--gr-spinner-stroke' as string]: stroke,
    ['--gr-spinner-head' as string]: head,
    ['--gr-spinner-duration' as string]: `${duration ?? spinner.duration}ms`,
  };

  const labelStyle: CSSProperties = {
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${spinner.fontSize[size]}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.m,
    lineHeight: 1.2,
    color: textColor ?? color.main.description,
    whiteSpace: stacked ? 'normal' : 'nowrap',
  };

  const accessibleName = ariaLabel ?? (typeof label === 'string' ? label : 'Loading');

  return (
    <div {...rest} ref={ref} role="status" aria-live="polite" aria-label={accessibleName} style={rootStyle}>
      <style>{SPINNER_CSS}</style>
      {/* `aria-hidden` because the name is already on the wrapper — without it
          a screen reader reaches an unlabeled decorative circle. */}
      <div className="gr-spinner-ring" style={ringStyle} aria-hidden />
      {label !== undefined && label !== null && label !== false && (
        <span style={labelStyle}>{label}</span>
      )}
    </div>
  );
});
