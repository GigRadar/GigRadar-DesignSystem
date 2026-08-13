import { color, component, type SwitchSize } from '@gigradar/theme';
import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { SwitchButton } from './SwitchButton.js';
import type { IconDef } from '../../icons/defs.js';

export type { SwitchSize };

const { switchControl } = component;

/**
 * One segment, described as data.
 *
 * A switch is almost always driven from a list — billing periods, a filter
 * set — so the segments are declared rather than composed. `SwitchButton` is
 * exported for the rarer case where a caller needs to build the row by hand.
 */
export type SwitchItem = {
  /** The value reported to `onValueChange`. Must be unique within the switch. */
  value: string;
  /** The segment's visible label. Falls back to `value`. */
  label?: ReactNode;
  /** A pill drawn after the label — "Save 20%" in Figma. */
  badge?: ReactNode;
  /** An optional glyph before the label. */
  icon?: IconDef;
  /** Greys this one segment out and blocks selection. */
  disabled?: boolean;
};

/**
 * What a `renderSegment` function receives — one segment's content.
 *
 * The states are resolved rather than left to be re-derived: `disabled` already
 * folds the whole control's flag into the segment's own, and `selected` is the
 * comparison against the current value.
 */
export type SwitchSegmentRenderProps = WithDefaultRender & {
  /** The segment being drawn, as declared in `items`. */
  item: SwitchItem;
  /** Whether this segment is the current selection. */
  selected: boolean;
  /** Whether the segment is blocked, by its own flag or the whole control's. */
  disabled: boolean;
  /** The segment's position in `items`. */
  index: number;
  /** Selects this segment. A no-op while it is disabled. */
  select: () => void;
};

/** Per-instance overrides for the track's own metrics. */
export type SwitchStyleProps = {
  /** The inset around the segments that makes the selected one read as raised. */
  padding?: CssLength;
  /** Corner radius. Figma draws a pill. */
  radius?: CssLength;
  /** The track's fill. */
  background?: string;
  /** The sliding thumb's fill. */
  thumbBackground?: string;
  /**
   * How the thumb slides, as a CSS transition value. Pass `'none'` to make the
   * selection jump instead.
   */
  transition?: string;
};

export type SwitchProps = {
  /** The segments, in the order they are drawn. */
  items: SwitchItem[];
  /**
   * The selected segment's `value`. Passing this makes the switch controlled —
   * it then renders whatever the parent says and reports clicks through
   * `onValueChange`, rather than tracking its own state.
   */
  value?: string;
  /** The starting selection of an uncontrolled switch. Defaults to the first item. */
  defaultValue?: string;
  /** Called with the newly chosen `value`. */
  onValueChange?: (value: string) => void;
  size?: SwitchSize;
  /** Greys out and blocks the whole control. */
  disabled?: boolean;
  /**
   * Accessible name for the group, e.g. "Billing period". Without it a screen
   * reader announces a set of tabs with no indication of what they choose.
   */
  label?: string;
  /**
   * Replaces a segment's content — the default icon + label + badge row —
   * keeping the behaviour that is hard to get right: the pill, the hover, the
   * sliding thumb, the roving tab stop, the arrow-key wrapping.
   *
   * Only the content inside the segment changes; the segment itself is still
   * the switch's. Call `defaultRender()` to wrap rather than replace, which is
   * also how one segment opts back out while the others are customised.
   *
   * The one thing `defaultRender()` cannot give back is `item.icon` and
   * `item.badge`: `SwitchButton` draws those from its own props, around its
   * children, and this prop only supplies the children. So passing it drops
   * both from EVERY segment, and a renderer that wants them draws them itself
   * — `item` carries them for exactly that. They are dropped rather than left
   * in place because a caller replacing the label almost always means to
   * replace what sits beside it too, and a badge surviving into custom markup
   * lands in the wrong place more often than the right one.
   */
  renderSegment?: RenderProp<SwitchSegmentRenderProps>;
} & SwitchStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onChange' | 'defaultValue'>;

/**
 * A segmented switch — a small set of mutually exclusive options laid out in a
 * pill, with the chosen one raised as a white segment.
 *
 * Figma: node 977:11153 ("Subscription Switch"), a `D6DFE7` track with 4px of
 * padding holding segments drawn by node 3913:24775. The design shows two to
 * four of them — Monthly / Quarterly / Semi-annual / Annual — with a brand-blue
 * "Save 20%" badge on the discounted one.
 *
 * The selection is drawn as one white thumb sitting behind the segments, which
 * slides to the chosen one. Because the labels differ in width the thumb has to
 * be measured rather than computed — a `ResizeObserver` on the track keeps its
 * position and width correct as fonts load, the size prop changes, or the
 * control reflows.
 *
 * Until that first measurement lands the thumb is not drawn, and the selected
 * segment paints its own white fill instead. That keeps the control correct on
 * the first paint and in any environment without layout (SSR, jsdom), rather
 * than flashing a thumb parked at the left edge.
 *
 * Keyboard: arrow keys move the selection along the row and wrap at the ends,
 * which is what the tab pattern this maps to expects. Disabled segments are
 * skipped rather than landed on and refused.
 */
export const Switch = forwardRef<HTMLDivElement, SwitchProps>(function Switch(
  {
    items,
    value,
    defaultValue,
    onValueChange,
    size = 'medium',
    disabled = false,
    label,
    renderSegment,
    padding,
    radius,
    background,
    thumbBackground,
    transition,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const [selfValue, setSelfValue] = useState(defaultValue ?? items[0]?.value);

  // Controlled when `value` is passed, uncontrolled otherwise — the standard
  // React input contract, so the component drops into either kind of form.
  const isControlled = value !== undefined;
  const current = isControlled ? value : selfValue;

  const select = (next: string) => {
    if (!isControlled) setSelfValue(next);
    onValueChange?.(next);
  };

  const trackRef = useRef<HTMLDivElement | null>(null);
  const segmentRefs = useRef(new Map<string, HTMLButtonElement>());
  const [thumb, setThumb] = useState<{ left: number; width: number } | null>(null);
  // The very first placement must not animate, or the thumb slides in from the
  // left edge on mount. Only moves after that one are a transition.
  const placed = useRef(false);
  const [animate, setAnimate] = useState(false);

  /**
   * Reads the selected segment's box relative to the track. Offsets are taken
   * from `offsetLeft` rather than `getBoundingClientRect`, so the value is
   * already in the track's coordinate space and unaffected by page scroll or
   * any transform on an ancestor.
   */
  const measure = useCallback(() => {
    const node = current === undefined ? undefined : segmentRefs.current.get(current);
    if (!node) {
      setThumb(null);
      placed.current = false;
      return;
    }
    setThumb({ left: node.offsetLeft, width: node.offsetWidth });
    if (placed.current) setAnimate(true);
    placed.current = true;
  }, [current]);

  // Layout effect, so the thumb is positioned in the same frame the segments
  // are laid out — a passive effect would paint one frame with no thumb.
  useLayoutEffect(measure, [measure, size, items]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || typeof ResizeObserver === 'undefined') return;
    // Re-measure when the track or any segment changes size: a late-loading
    // font or a reflow would otherwise leave the thumb at a stale width.
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    for (const node of segmentRefs.current.values()) observer.observe(node);
    return () => observer.disconnect();
  }, [measure, items]);

  const rootStyle: CSSProperties = {
    // The positioning context for the thumb. Without it the thumb's
    // `position: absolute` resolves against the page and it drifts away from
    // the segments it belongs to.
    position: 'relative',
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: len(padding) ?? `${switchControl.trackPadding[size]}px`,
    borderRadius: len(radius) ?? `${switchControl.radius}px`,
    backgroundColor: background ?? color.navbar.border,
    // The whole control dims together, matching how the checkbox handles a
    // state Figma does not draw.
    opacity: disabled ? 0.4 : undefined,
  };

  const thumbStyle: CSSProperties | undefined = thumb
    ? {
        position: 'absolute',
        // `top`/`bottom` rather than a measured height: the thumb then spans
        // the track's inner box exactly, and stays right when the padding is
        // overridden.
        top: len(padding) ?? `${switchControl.trackPadding[size]}px`,
        bottom: len(padding) ?? `${switchControl.trackPadding[size]}px`,
        left: 0,
        width: thumb.width,
        transform: `translateX(${thumb.left}px)`,
        borderRadius: `${switchControl.radius}px`,
        backgroundColor: thumbBackground ?? color.main.white,
        // Sits behind the labels, which are lifted out of the stacking order by
        // their own `position: relative`.
        zIndex: 0,
        pointerEvents: 'none',
        transition:
          transition ??
          (animate ? 'transform 220ms cubic-bezier(0.4, 0, 0.2, 1), width 220ms cubic-bezier(0.4, 0, 0.2, 1)' : undefined),
      }
    : undefined;

  /**
   * Moves the selection by `step`, skipping disabled segments and wrapping at
   * the ends. Returns without doing anything if every segment is disabled,
   * which would otherwise loop forever.
   */
  const move = (step: number) => {
    const from = items.findIndex((item) => item.value === current);
    if (from === -1) return;
    for (let i = 1; i <= items.length; i += 1) {
      // `% n` then `+ n) % n` so a leftward step off index 0 wraps to the end
      // rather than landing on a negative index.
      const at = (((from + step * i) % items.length) + items.length) % items.length;
      const next = items[at];
      if (next && !next.disabled) {
        select(next.value);
        return;
      }
    }
  };

  return (
    <div
      {...rest}
      // The node is needed internally for measurement and externally by the
      // caller, so the callback feeds both.
      ref={(node) => {
        trackRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      role="tablist"
      aria-label={label}
      aria-orientation="horizontal"
      style={rootStyle}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (disabled || event.defaultPrevented) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          move(1);
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          move(-1);
        }
      }}
    >
      {thumbStyle && <span aria-hidden style={thumbStyle} />}
      {items.map((item, index) => {
        const selected = item.value === current;
        const itemDisabled = disabled || Boolean(item.disabled);
        const defaultRender = () => item.label ?? item.value;
        // A replaced segment owns its whole content, so the icon and badge
        // slots step aside rather than doubling up around it. They are props on
        // the button rather than children, so `defaultRender()` cannot carry
        // them; `item` is handed over so the renderer can redraw whichever it
        // still wants. Suppressed for every segment, not just the replaced
        // ones, so the row stays consistent while a caller customises it.
        const content = renderSegment
          ? renderSegment({
              item,
              selected,
              disabled: itemDisabled,
              index,
              select: () => (itemDisabled ? undefined : select(item.value)),
              defaultRender,
            })
          : defaultRender();
        return (
          <SwitchButton
            key={item.value}
            ref={(node) => {
              if (node) segmentRefs.current.set(item.value, node);
              else segmentRefs.current.delete(item.value);
            }}
            size={size}
            selected={selected}
            // The thumb paints the white pill once it has been measured, so the
            // segment must not paint its own on top — that would clip the
            // sliding thumb behind a stationary one. Before the first
            // measurement there is no thumb, and the segment fills in.
            raised={selected && thumb === null}
            badge={renderSegment ? undefined : item.badge}
            icon={renderSegment ? undefined : item.icon}
            disabled={itemDisabled}
            // Only the selected segment is a tab stop; the arrow keys move
            // within the group. That is the roving-tabindex the tab pattern
            // expects, and it keeps the switch one stop in the page's tab order
            // rather than four.
            tabIndex={selected ? 0 : -1}
            onClick={() => select(item.value)}
          >
            {content}
          </SwitchButton>
        );
      })}
    </div>
  );
});
