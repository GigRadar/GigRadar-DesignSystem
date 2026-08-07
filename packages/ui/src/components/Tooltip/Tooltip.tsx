import { color, component, shadow, typography, type TooltipSize } from '@gigradar/theme';
import {
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';

export type { TooltipSize };

const { tooltip } = component;

/**
 * Which side of the anchor the tooltip sits on.
 *
 * Named for where the TOOLTIP goes, not where the arrow points — `top` puts the
 * card above the anchor with its arrow pointing down. Figma names the same four
 * variants "Up", "Bottom", "Left", and "Right" from the arrow's side; these
 * names match the convention every other popover library uses, so a developer
 * reaching for `placement="top"` gets what they expect.
 */
export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

/** Per-instance overrides for the tooltip's own metrics. */
export type TooltipStyleProps = {
  /** Horizontal padding inside the card. */
  paddingX?: CssLength;
  /** Vertical padding inside the card. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Space between the title, description, and actions. */
  gap?: CssLength;
  /** Description type size. */
  fontSize?: CssLength;
  /** Title type size. */
  titleFontSize?: CssLength;
  /** Cap on the card's width before the text wraps. */
  maxWidth?: CssLength;
  /** Distance between the anchor and the card. */
  offset?: number;
  /** Card fill. The arrow follows it. */
  background?: string;
  /** Description color. */
  textColor?: string;
  /** Title color. Defaults to the badge blue. */
  titleColor?: string;
};

export type TooltipProps = {
  /**
   * The element the tooltip describes. Must be a single element that forwards
   * its ref and props — the tooltip attaches its hover, focus, and describedby
   * wiring to it rather than wrapping it in a div, so it never disturbs layout.
   */
  children: ReactElement;
  /**
   * The tooltip's body. This is the part every tooltip has.
   *
   * Named `content` rather than `description` because it is the tooltip, not a
   * subordinate part of it — a tooltip with no `title` is just this text.
   */
  content: ReactNode;
  /**
   * An optional heading above the content, drawn in the badge blue.
   *
   * Most tooltips do NOT use this. Reach for it only when the tooltip explains
   * a named thing and the name is worth repeating — a feature callout, an
   * onboarding hint. For "what does this button do", `content` alone is right:
   * a title turns a one-line label into a small dialog and slows it down.
   */
  title?: ReactNode;
  /**
   * Buttons below the content — the "Apply" / "Later" pair Figma draws.
   *
   * A tooltip with actions is no longer a hover label: it stays open on click
   * rather than hover, since the user has to be able to reach the buttons.
   */
  actions?: ReactNode;
  placement?: TooltipPlacement;
  size?: TooltipSize;
  /**
   * Opens on click instead of hover, and stays open until dismissed.
   *
   * Set automatically when `actions` are passed. Also the right choice on
   * touch, where there is no hover to begin with.
   */
  trigger?: 'hover' | 'click';
  /** Controls the tooltip from the parent. Pairs with `onOpenChange`. */
  open?: boolean;
  /** The starting state of an uncontrolled tooltip. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Milliseconds to wait before opening on hover. */
  openDelay?: number;
  /** Renders the anchor with no tooltip at all. */
  disabled?: boolean;
  /** Hides the arrow, leaving a detached card. */
  hideArrow?: boolean;
} & TooltipStyleProps;

/**
 * A tooltip.
 *
 * Figma: node 64:2546, which draws one card in four positions — a white
 * 6px-radius panel carrying an optional 18px title, a 12px description,
 * and optionally a pair of buttons, with a 10×5px arrow aimed at the anchor.
 *
 * Positioned with `position: absolute` against a wrapper that is
 * `display: contents`-adjacent — an inline-block shrink-wrapped to the anchor —
 * rather than a portal. That keeps the whole component dependency-free and
 * self-contained, at the cost of being clipped by an ancestor with
 * `overflow: hidden`. For the tooltip's usual homes — a toolbar, a table cell, a
 * form row — that trade is right; a tooltip inside a scroll container that clips
 * it wants a portal, which is a larger piece of machinery than this package
 * carries today.
 *
 * Hover and focus are tracked in state rather than written as CSS rules,
 * because this package styles inline and ships no stylesheet — the same reason
 * the button does it.
 */
export function Tooltip({
  children,
  content,
  title,
  actions,
  placement = 'top',
  size = 'medium',
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay,
  disabled = false,
  hideArrow = false,
  paddingX,
  paddingY,
  radius,
  gap,
  fontSize,
  titleFontSize,
  maxWidth,
  offset,
  background,
  textColor,
  titleColor,
}: TooltipProps) {
  const [selfOpen, setSelfOpen] = useState(defaultOpen);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const rootRef = useRef<HTMLSpanElement>(null);
  const describedById = useId();

  // A tooltip carrying buttons cannot be hover-driven: the pointer has to
  // travel to the button, and any gap on the way would close it.
  const mode = trigger ?? (actions != null ? 'click' : 'hover');

  const isControlled = open !== undefined;
  const isOpen = (isControlled ? open : selfOpen) && !disabled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setSelfOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  // Cleared on unmount so a pending open never fires against a gone component.
  useEffect(() => () => clearTimeout(timer.current), []);

  const cancelPending = () => clearTimeout(timer.current);

  const openAfterDelay = () => {
    cancelPending();
    const wait = openDelay ?? tooltip.openDelay;
    // The delay is what stops tooltips flashing as the pointer crosses a
    // toolbar. Focus and click open immediately — those are deliberate.
    timer.current = setTimeout(() => setOpen(true), wait);
  };

  const close = () => {
    cancelPending();
    setOpen(false);
  };

  // Escape closes, and a click outside dismisses a click-triggered tooltip —
  // both are what a user expects from anything that floats above the page.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener('keydown', onKeyDown);
    if (mode === 'click') document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen, mode]);

  const gapToAnchor = offset ?? tooltip.offset;

  const anchorProps: Record<string, unknown> = {
    'aria-describedby': isOpen ? describedById : undefined,
  };

  // The anchor's own handlers, if it has any — chained rather than replaced, so
  // cloning it never silently drops behavior it already had.
  const theirs = isValidElement<AnchorHandlers>(children)
    ? children.props
    : ({} as AnchorHandlers);

  if (!disabled) {
    if (mode === 'hover') {
      anchorProps.onMouseEnter = compose(theirs.onMouseEnter, openAfterDelay);
      anchorProps.onMouseLeave = compose(theirs.onMouseLeave, close);
      // Keyboard users get the tooltip on focus — without this the content is
      // reachable only with a pointer.
      anchorProps.onFocus = compose(theirs.onFocus, () => setOpen(true));
      anchorProps.onBlur = compose(theirs.onBlur, close);
    } else {
      anchorProps.onClick = compose(theirs.onClick, () => setOpen(!isOpen));
    }
  }

  const anchor = isValidElement(children) ? cloneElement(children, anchorProps) : children;

  return (
    <span
      ref={rootRef}
      style={{
        // The positioning context for the card. `inline-block` shrink-wraps to
        // the anchor so the wrapper never changes how the anchor lays out.
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {anchor}
      {isOpen && (
        <span
          id={describedById}
          role="tooltip"
          style={{
            position: 'absolute',
            zIndex: 1000,
            // The card is laid out at its natural width, so a short tooltip
            // stays short; `maxWidth` is what makes a long one wrap.
            width: 'max-content',
            maxWidth: len(maxWidth) ?? `${tooltip.maxWidth}px`,
            // Never intercepts the pointer on a hover tooltip — moving onto the
            // card would otherwise count as leaving the anchor and close it.
            pointerEvents: mode === 'click' ? 'auto' : 'none',
            ...placementStyle(placement, gapToAnchor),
          }}
        >
          <Card
            title={title}
            content={content}
            actions={actions}
            size={size}
            paddingX={paddingX}
            paddingY={paddingY}
            radius={radius}
            gap={gap}
            fontSize={fontSize}
            titleFontSize={titleFontSize}
            background={background}
            textColor={textColor}
            titleColor={titleColor}
          />
          {!hideArrow && (
            <Arrow placement={placement} background={background} offset={gapToAnchor} />
          )}
        </span>
      )}
    </span>
  );
}

/**
 * The handlers the tooltip takes over on its anchor. Everything is optional —
 * the anchor is usually a plain button that has none of them.
 */
type AnchorHandlers = {
  onMouseEnter?: (event: unknown) => void;
  onMouseLeave?: (event: unknown) => void;
  onFocus?: (event: unknown) => void;
  onBlur?: (event: unknown) => void;
  onClick?: (event: unknown) => void;
};

/**
 * Chains the caller's handler with the tooltip's own, so cloning the anchor
 * never silently drops an `onClick` it already had.
 */
function compose<E>(theirs: ((event: E) => void) | undefined, ours: () => void) {
  return (event: E) => {
    theirs?.(event);
    ours();
  };
}

/**
 * Where the card sits relative to the anchor.
 *
 * Each placement pins the card to one edge and centres it on the other axis
 * with a 50% offset and a translate — which centres correctly whatever the
 * card's own width turns out to be, since the width is content-driven.
 */
function placementStyle(placement: TooltipPlacement, offset: number): CSSProperties {
  switch (placement) {
    case 'top':
      return { bottom: '100%', left: '50%', transform: 'translateX(-50%)', paddingBottom: offset };
    case 'bottom':
      return { top: '100%', left: '50%', transform: 'translateX(-50%)', paddingTop: offset };
    case 'left':
      return { right: '100%', top: '50%', transform: 'translateY(-50%)', paddingRight: offset };
    case 'right':
      return { left: '100%', top: '50%', transform: 'translateY(-50%)', paddingLeft: offset };
  }
}

/** The white panel — everything except the arrow. */
function Card({
  title,
  content,
  actions,
  size,
  paddingX,
  paddingY,
  radius,
  gap,
  fontSize,
  titleFontSize,
  background,
  textColor,
  titleColor,
}: {
  title?: ReactNode;
  content: ReactNode;
  actions?: ReactNode;
  size: TooltipSize;
} & TooltipStyleProps) {
  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: len(gap) ?? `${tooltip.gap[size]}px`,
    paddingLeft: len(paddingX) ?? `${tooltip.paddingX[size]}px`,
    paddingRight: len(paddingX) ?? `${tooltip.paddingX[size]}px`,
    paddingTop: len(paddingY) ?? `${tooltip.paddingY[size]}px`,
    paddingBottom: len(paddingY) ?? `${tooltip.paddingY[size]}px`,
    borderRadius: len(radius) ?? `${tooltip.radius}px`,
    backgroundColor: background ?? color.main.white,
    boxShadow: shadow.base,
    fontFamily: typography.fontFamily.base,
  };

  return (
    <span style={style}>
      {title != null && (
        <span
          style={{
            fontSize: len(titleFontSize) ?? `${tooltip.titleFontSize[size]}px`,
            fontWeight: typography.fontWeight.semibold,
            letterSpacing: typography.letterSpacing.h4,
            lineHeight: 1.2,
            ...titleFill(titleColor),
          }}
        >
          {title}
        </span>
      )}
      <span
        style={{
          fontSize: len(fontSize) ?? `${tooltip.fontSize[size]}px`,
          fontWeight: typography.fontWeight.medium,
          letterSpacing: typography.letterSpacing.s,
          lineHeight: 1.4,
          color: textColor ?? color.main.description,
        }}
      >
        {content}
      </span>
      {actions != null && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            // Actions are the one part that should stretch: a lone button in a
            // narrow tooltip reads better filling the width than floating left.
            width: '100%',
          }}
        >
          {actions}
        </span>
      )}
    </span>
  );
}

/**
 * The title's fill.
 *
 * Figma paints the title with a radial gradient, but it is a flat badge blue
 * here. The gradient reads as decoration on a label whose job is to be scanned
 * in a fraction of a second, and it costs a `background-clip: text` trick that
 * renders the title invisible wherever that is unsupported. The token also ties
 * the title to the rest of the system, so a brand change reaches it.
 *
 * The gradient values are kept in the theme (`tooltip.titleGradient`) rather
 * than deleted — they are still what Figma draws, and a caller who wants them
 * can pass a gradient through `titleColor`.
 */
function titleFill(titleColor: string | undefined): CSSProperties {
  return { color: titleColor ?? color.badge.foreground };
}

/**
 * The arrow.
 *
 * Drawn as a CSS border triangle rather than Figma's exported SVG: the shape is
 * a plain 10×5 triangle that borders reproduce exactly, and drawn this way it
 * takes the card's own background — so recoloring a tooltip never leaves a
 * white arrow behind, which an exported asset would.
 *
 * Positioned against the CARD's edge rather than the wrapper's. The wrapper is
 * bigger than the card by `offset` on the anchor's side — that padding is what
 * holds the card off the anchor — so pinning the arrow to the wrapper would
 * park it at the far side of that gap and leave it visibly floating. Insetting
 * it by the offset puts its base on the card, where it belongs.
 */
function Arrow({
  placement,
  background,
  offset,
}: {
  placement: TooltipPlacement;
  background: string | undefined;
  offset: number;
}) {
  const fill = background ?? color.main.white;
  const { width, height } = tooltip.arrow;
  const half = width / 2;
  // The card's edge sits `offset` in from the wrapper, and the triangle grows
  // from that edge outward toward the anchor — so a base flush with the card
  // starts at `offset - height`. One extra pixel slides it back INTO the card,
  // so the two overlap rather than merely touching: at fractional device pixel
  // ratios an exact meeting can round apart and show a hairline seam.
  //
  // Clamped at 0 because a caller may set `offset` smaller than the arrow;
  // without it the triangle would be pushed outside the wrapper and clipped.
  const seat = Math.max(0, offset - height + 1);

  // A triangle is one solid border edge against two transparent ones. The solid
  // edge faces the card, so the point aims at the anchor.
  const base: CSSProperties = {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  };

  const vertical = { borderLeftColor: 'transparent', borderRightColor: 'transparent' };
  const horizontal = { borderTopColor: 'transparent', borderBottomColor: 'transparent' };

  switch (placement) {
    case 'top':
      return (
        <span
          style={{
            ...base,
            ...vertical,
            bottom: seat,
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: `${height}px ${half}px 0 ${half}px`,
            borderTopColor: fill,
            borderBottomColor: 'transparent',
          }}
        />
      );
    case 'bottom':
      return (
        <span
          style={{
            ...base,
            ...vertical,
            top: seat,
            left: '50%',
            transform: 'translateX(-50%)',
            borderWidth: `0 ${half}px ${height}px ${half}px`,
            borderBottomColor: fill,
            borderTopColor: 'transparent',
          }}
        />
      );
    case 'left':
      return (
        <span
          style={{
            ...base,
            ...horizontal,
            right: seat,
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: `${half}px 0 ${half}px ${height}px`,
            borderLeftColor: fill,
            borderRightColor: 'transparent',
          }}
        />
      );
    case 'right':
      return (
        <span
          style={{
            ...base,
            ...horizontal,
            left: seat,
            top: '50%',
            transform: 'translateY(-50%)',
            borderWidth: `${half}px ${height}px ${half}px 0`,
            borderRightColor: fill,
            borderLeftColor: 'transparent',
          }}
        />
      );
  }
}
