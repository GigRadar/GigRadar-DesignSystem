import { color, component, typography, type AvatarSize } from '@uiuxjoseph/theme';
import { Children, forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export type AvatarGroupProps = {
  /** Applied to the overflow count; the avatars keep their own `size`. */
  size?: AvatarSize;
  /**
   * Show at most this many avatars, then a `+N` count. Without it, every child
   * renders.
   */
  max?: number;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const { avatar } = component;

/**
 * A row of overlapping avatars.
 *
 * Each avatar is drawn with a white ring and pulled left over the one before
 * it, so a crowded row stays readable. Leftmost sits on top — the reading
 * order matches the stacking order.
 */
export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(function AvatarGroup(
  { size = 'medium', max, children, ...rest },
  ref,
) {
  const items = Children.toArray(children);
  const visible = max != null ? items.slice(0, max) : items;
  const overflow = items.length - visible.length;

  const diameter = avatar.size[size];
  const ring = avatar.badgeRingWidth;
  const overlap = `calc(-1 * var(--gr-avatar-size-${size}, ${diameter}px) * var(--gr-avatar-group-overlap, ${avatar.groupOverlap}))`;

  return (
    <div {...rest} ref={ref} style={{ display: 'inline-flex', alignItems: 'center' }}>
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
            marginLeft: index === 0 ? 0 : overlap,
            // Leftmost on top. Without an explicit order, later siblings would
            // paint over earlier ones and the stack would read right-to-left.
            zIndex: visible.length - index,
            borderRadius: `var(--gr-avatar-radius, ${avatar.radius}px)`,
            boxShadow: `0 0 0 ${ring}px ${color.main.white}`,
          }}
        >
          {child}
        </span>
      ))}
      {overflow > 0 && <OverflowCount count={overflow} size={size} offset={overlap} ring={ring} />}
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
  ring,
}: {
  count: number;
  size: AvatarSize;
  offset: string;
  ring: number;
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
    boxShadow: `0 0 0 ${ring}px ${color.main.white}`,
    fontFamily: typography.fontFamily.base,
    fontSize: `var(--gr-avatar-font-size-${size}, ${avatar.fontSize[size]}px)`,
    fontWeight: typography.fontWeight.medium,
    lineHeight: 1,
    userSelect: 'none',
  };

  return <span style={style}>+{count}</span>;
}
