import {
  color,
  component,
  spacing,
  typography,
  type AvatarSize,
  type SpacingToken,
} from '@gigradar/theme';
import { Children, forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import type { CssLength } from './Avatar.js';

/** A spacing token, its negative (`"-xs"`), or a raw number of px. */
export type AvatarGroupGap = SpacingToken | `-${SpacingToken}` | number;

/**
 * Resolves the gap to px.
 *
 * A leading `-` flips the sign of the token it names, which is what turns a
 * gap into an overlap — `"-xs"` is `-6px`.
 */
function resolveGap(gap: AvatarGroupGap): number {
  if (typeof gap === 'number') return gap;
  if (gap.startsWith('-')) return -spacing[gap.slice(1) as SpacingToken];
  return spacing[gap as SpacingToken];
}

export type AvatarGroupProps = {
  /** Applied to the overflow count; the avatars keep their own `size`. */
  size?: AvatarSize;
  /**
   * Show at most this many avatars, then a `+N` count. Without it, every child
   * renders.
   */
  max?: number;
  /**
   * Space between avatars, as a spacing token. Negative values overlap them —
   * `"-xs"` is the default, pulling each avatar 6px over the one before it.
   *
   * A token rather than a fraction of the avatar size, so the overlap stays
   * put when the avatars are resized.
   */
  gap?: AvatarGroupGap;
  /** Avatar diameter, applied to the row. Overrides the `size` step. */
  diameter?: CssLength;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const { avatar } = component;

/**
 * A row of overlapping avatars.
 *
 * Each avatar is pulled left over the one before it. Leftmost sits on top — the
 * reading order matches the stacking order.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { size = 'medium', max, gap = '-xs', diameter: diameterProp, children, ...rest },
  ref,
) {
  const items = Children.toArray(children);
  const visible = max != null ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  const offset = resolveGap(gap);

  // Set on the row rather than per-child so every avatar picks up the diameter.
  const vars: Record<string, string> = {};
  if (diameterProp != null) {
    vars[`--gr-avatar-size-${size}`] =
      typeof diameterProp === 'number' ? `${diameterProp}px` : diameterProp;
  }

  return (
    <div {...rest} ref={ref} style={{ ...vars, display: 'inline-flex', alignItems: 'center' }}>
      {visible.map((child, index) => (
        <span
          key={index}
          style={{
            display: 'inline-flex',
            // `zIndex` only applies to positioned elements — without this the
            // stack order below is silently ignored and each avatar paints over
            // the one before it, covering its initials.
            position: 'relative',
            // Negative margins would otherwise make flexbox shrink the wrapper
            // rather than overlap the avatars.
            flexShrink: 0,
            marginLeft: index === 0 ? 0 : offset,
            // Leftmost on top. Without an explicit order, later siblings would
            // paint over earlier ones and the stack would read right-to-left.
            zIndex: visible.length - index,
            borderRadius: `var(--gr-avatar-radius, ${avatar.radius}px)`,
          }}
        >
          {child}
        </span>
      ))}
      {overflow > 0 && <OverflowCount count={overflow} size={size} offset={offset} />}
    </div>
  );
});

/**
 * The `+N` chip closing a truncated group. Styled as an avatar in the neutral
 * greys so it sits in the row without competing with the faces.
 */
function OverflowCount({
  count,
  size,
  offset,
}: {
  count: number;
  size: AvatarSize;
  offset: number;
}) {
  const diameter = `var(--gr-avatar-size-${size}, ${avatar.size[size]}px)`;

  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: diameter,
    height: diameter,
    flexShrink: 0,
    marginLeft: offset,
    // Positioned so the zIndex below applies — it must sit under every avatar.
    position: 'relative',
    zIndex: 0,
    borderRadius: `var(--gr-avatar-radius, ${avatar.radius}px)`,
    backgroundColor: color.main.backgroundAlt,
    color: color.main.description,
    border: `var(--gr-avatar-border-width, ${avatar.borderWidth}px) solid ${color.main.border}`,
    fontFamily: typography.fontFamily.base,
    fontSize: `var(--gr-avatar-font-size-${size}, ${avatar.fontSize[size]}px)`,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 1,
    userSelect: 'none',
  };

  return <span style={style}>+{count}</span>;
}
