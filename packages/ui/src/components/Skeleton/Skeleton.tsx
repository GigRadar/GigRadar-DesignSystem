import { color, component, radius as radiusToken } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { skeleton } = component;

/**
 * What the placeholder stands in for.
 *
 * `block` is the default rectangle — a card, a panel, an image. `text` draws a
 * shorter bar at a line's height, and `circle` a disc for an avatar slot.
 * Naming the shape rather than passing dimensions is what keeps a loading
 * state from drifting: two screens both loading an avatar get the same disc.
 */
export type SkeletonVariant = 'block' | 'text' | 'circle';

export type SkeletonStyleProps = {
  /** Corner radius. Ignored by `circle`, which is always round. */
  radius?: CssLength;
  /** The bar's fill. */
  background?: string;
  /** One full shimmer cycle, in milliseconds. */
  duration?: number;
};

export type SkeletonProps = {
  /**
   * Which shape to draw.
   *
   * @default 'block'
   */
  variant?: SkeletonVariant;
  /** Width. Defaults to filling the container, or to the diameter for a circle. */
  width?: CssLength;
  /** Height. Defaults to the variant's own step. */
  height?: CssLength;
  /** Circle diameter. Sets both dimensions at once. */
  size?: CssLength;
  /**
   * How many bars to draw, stacked. Each after the first is a repeat of the
   * same shape — the common case for a paragraph or a list.
   */
  count?: number;
  /**
   * Turns off the shimmer, leaving a flat bar.
   *
   * Worth reaching for when many skeletons animate at once: a screen of
   * synchronised shimmer reads as a fault rather than as loading.
   */
  still?: boolean;
} & SkeletonStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** The keyframes, injected once, since this package ships no stylesheet. */
const SHIMMER_ID = 'gigradar-skeleton-shimmer';
const SHIMMER_CSS = `@keyframes gr-skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`;

function useShimmerKeyframes() {
  // A module-level side effect rather than a hook body: the rule is global and
  // identical for every instance, so injecting it once at import beats
  // re-checking the document on every render.
  if (typeof document === 'undefined') return;
  if (document.getElementById(SHIMMER_ID)) return;

  const style = document.createElement('style');
  style.id = SHIMMER_ID;
  style.textContent = SHIMMER_CSS;
  document.head.appendChild(style);
}

/**
 * A loading placeholder — a grey bar in the shape of what is coming.
 *
 * Not drawn in Figma. It is here because every screen that loads needs one,
 * and the alternative is each of them hand-rolling a grey `<div>` at its own
 * radius and its own grey — which is what the Upwork account screen did before
 * this existed.
 *
 * The shimmer is a moving gradient rather than a pulsing opacity: opacity
 * fades the bar toward the page and reads as content disappearing, where the
 * sweep reads as something arriving.
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  {
    variant = 'block',
    width,
    height,
    size,
    count = 1,
    still = false,
    radius,
    background,
    duration,
    ...rest
  },
  ref,
) {
  useShimmerKeyframes();

  const isCircle = variant === 'circle';
  const base = background ?? color.disable.background;

  const resolvedHeight = isCircle
    ? (len(size) ?? len(height) ?? skeleton.circleSize)
    : (len(height) ?? `${variant === 'text' ? skeleton.textHeight : skeleton.blockHeight}px`);

  const resolvedWidth = isCircle
    ? (len(size) ?? len(width) ?? skeleton.circleSize)
    : (len(width) ?? '100%');

  const barStyle: CSSProperties = {
    boxSizing: 'border-box',
    width: resolvedWidth,
    height: resolvedHeight,
    flexShrink: 0,
    borderRadius: isCircle
      ? '50%'
      : (len(radius) ?? `${variant === 'text' ? radiusToken.xxs : skeleton.radius}px`),
    backgroundColor: base,
    ...(still
      ? null
      : {
          // The sweep is a highlight travelling across the base fill. Sized at
          // 200% so the bright band is off-canvas at both ends of the cycle,
          // which is what makes the loop read as continuous.
          backgroundImage: `linear-gradient(90deg, ${base} 0%, ${skeleton.highlight} 50%, ${base} 100%)`,
          backgroundSize: '200% 100%',
          animation: `gr-skeleton-shimmer ${duration ?? skeleton.duration}ms ease-in-out infinite`,
        }),
  };

  if (count === 1) {
    return <div {...rest} ref={ref} aria-hidden style={barStyle} />;
  }

  return (
    <div
      {...rest}
      ref={ref}
      aria-hidden
      style={{ display: 'flex', flexDirection: 'column', gap: skeleton.gap, width: '100%' }}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          style={{
            ...barStyle,
            // The last line of a paragraph runs short, which is what makes a
            // stack of bars read as text rather than as a table.
            width: variant === 'text' && index === count - 1 ? '60%' : barStyle.width,
          }}
        />
      ))}
    </div>
  );
});
