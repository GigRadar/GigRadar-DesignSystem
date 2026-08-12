import { color, component, shadow, typography } from '@gigradar/theme';
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
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Button } from '../Button/Button.js';
import type { TooltipPlacement } from './Tooltip.js';

const { confirm } = component;

/** Per-instance overrides for the confirmation card's own metrics. */
export type ConfirmTooltipStyleProps = {
  /** Card width. */
  width?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Horizontal padding, applied to all three bands. */
  paddingX?: CssLength;
  /** Title type size. */
  titleFontSize?: CssLength;
  /** Message type size. */
  fontSize?: CssLength;
  /** Card fill. */
  background?: string;
  /** Title color. */
  titleColor?: string;
  /** Message color. */
  textColor?: string;
  /** Distance between the anchor and the card. */
  offset?: number;
};

export type ConfirmTooltipProps = {
  /**
   * The control that triggers the confirmation — usually the delete button
   * itself. Must be a single element that accepts props.
   */
  children: ReactElement;
  /** The heading. Figma draws 14px medium in the near-black heading color. */
  title?: ReactNode;
  /** The message below the title, explaining what is about to happen. */
  description?: ReactNode;
  /** Label on the destructive button. */
  confirmLabel?: string;
  /** Label on the dismissing button. */
  cancelLabel?: string;
  /**
   * Called when the destructive button is pressed. The popover closes after it
   * runs — return a promise and it stays open, showing the button's spinner,
   * until the work settles.
   */
  onConfirm?: () => void | Promise<unknown>;
  /** Called when the popover is dismissed without confirming. */
  onCancel?: () => void;
  placement?: TooltipPlacement;
  /**
   * Where the card sits along the placement's cross axis.
   *
   * `center` is the default and what Figma draws. `start` anchors the card's
   * leading edge to the anchor's — its top for a `left`/`right` placement, its
   * left for `top`/`bottom`. Reach for it when the card is taller (or wider)
   * than its anchor and centring would push it out of a scrolling container:
   * a row action near the top of a scroll area centres its card half above the
   * row, which the container then clips.
   */
  align?: ConfirmTooltipAlign;
  /** Controls the popover from the parent. Pairs with `onOpenChange`. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Renders the anchor with no confirmation at all. */
  disabled?: boolean;
  /**
   * Replaces the confirmation card, keeping the popover's positioning, its
   * open/close behaviour, the Escape and outside-click handling, and the
   * dialog ARIA wiring.
   *
   * The usual reason is a card the three bands cannot express — a list of what
   * will be deleted, a typed-confirmation field. `confirm` and `cancel` are
   * passed through so a replacement still drives the same handlers, including
   * the async `onConfirm` and its busy state.
   */
  renderCard?: RenderProp<ConfirmCardRenderProps>;
} & ConfirmTooltipStyleProps;

/**
 * What a `renderCard` function receives.
 *
 * `confirm` and `cancel` are the component's own handlers rather than the raw
 * props: calling `confirm()` runs `onConfirm`, awaits it if it returns a
 * promise, holds `busy` while it settles, and closes on success — behaviour a
 * replacement card should not have to reimplement.
 */
/** Where the card sits along its placement's cross axis. */
export type ConfirmTooltipAlign = 'center' | 'start';

export type ConfirmCardRenderProps = WithDefaultRender & {
  title: ReactNode;
  description: ReactNode;
  confirmLabel: ReactNode;
  cancelLabel: ReactNode;
  /** Runs `onConfirm`, showing the busy state until it settles. */
  confirm: () => void;
  /** Runs `onCancel` and closes. */
  cancel: () => void;
  /** True while an async `onConfirm` is in flight. */
  busy: boolean;
  placement: TooltipPlacement;
};

/**
 * A confirmation popover — the "are you sure" step before a destructive action.
 *
 * Figma: node 1272:11979, a 219px card built as three bands (a title head, a
 * message body, and a right-aligned footer holding Cancel and Remove).
 *
 * Deliberately a separate component from `Tooltip` rather than a variant of it.
 * The two look similar and behave nothing alike: a tooltip is a passive label
 * that appears on hover, is inert to the pointer, and describes its anchor. This
 * is a small dialog — it opens on click, traps a decision, and nothing else
 * should happen until the user answers. Folding it into `Tooltip` would mean a
 * component whose most important behaviors flip on whether a prop was passed.
 *
 * Note this is a popover, NOT a modal: it does not dim the page or trap focus,
 * because it confirms one row's deletion rather than a page-level action. For
 * something irreversible and far-reaching, a real modal is the right control.
 */
export function ConfirmTooltip({
  children,
  title = 'Are you sure?',
  description,
  confirmLabel = 'Remove',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  placement = 'bottom',
  align = 'center',
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  renderCard,
  width,
  radius,
  paddingX,
  titleFontSize,
  fontSize,
  background,
  titleColor,
  textColor,
  offset,
}: ConfirmTooltipProps) {
  const [selfOpen, setSelfOpen] = useState(defaultOpen);
  const [busy, setBusy] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const labelId = useId();

  const isControlled = open !== undefined;
  const isOpen = (isControlled ? open : selfOpen) && !disabled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) setSelfOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    onCancel?.();
  }, [setOpen, onCancel]);

  // Escape and an outside click both dismiss — the two ways anyone expects to
  // back out of a decision. Blocked while the confirm is in flight, since the
  // action has already started and closing would hide its outcome.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) dismiss();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (busy) return;
      if (!rootRef.current?.contains(event.target as Node)) dismiss();
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen, busy, dismiss]);

  const handleConfirm = async () => {
    // A synchronous handler closes immediately; an async one holds the popover
    // open and shows the spinner, so the user sees the work happen rather than
    // watching the card vanish and wondering whether it took.
    const result = onConfirm?.();
    if (result instanceof Promise) {
      setBusy(true);
      try {
        await result;
      } finally {
        setBusy(false);
        setOpen(false);
      }
      return;
    }
    setOpen(false);
  };

  const anchorProps: Record<string, unknown> = {};
  if (!disabled && isValidElement<{ onClick?: (event: unknown) => void }>(children)) {
    const theirClick = children.props.onClick;
    anchorProps.onClick = (event: unknown) => {
      theirClick?.(event);
      setOpen(!isOpen);
    };
    anchorProps['aria-haspopup'] = 'dialog';
    anchorProps['aria-expanded'] = isOpen;
  }

  const anchor = isValidElement(children) ? cloneElement(children, anchorProps) : children;

  const cardWidth = len(width) ?? `${confirm.width}px`;
  const padX = len(paddingX) ?? `${confirm.paddingX}px`;
  const surface = background ?? color.main.white;

  return (
    <span ref={rootRef} style={{ position: 'relative', display: 'inline-block' }}>
      {anchor}
      {isOpen && (
        <span
          role="dialog"
          aria-modal={false}
          aria-labelledby={labelId}
          style={{
            position: 'absolute',
            zIndex: 1000,
            width: cardWidth,
            ...placementStyle(placement, offset ?? 8, align),
          }}
        >
          {(() => {
            const defaultRender = () => (
        <span
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            // Figma clips the bands to the card's radius, which is what keeps
            // the head and footer fills from squaring off its corners.
            overflow: 'hidden',
            borderRadius: len(radius) ?? `${confirm.radius}px`,
            backgroundColor: surface,
            // The popup shadow rather than the ambient one: this floats above
            // the page and needs a crisp edge to read as detached.
            boxShadow: shadow.popup,
            fontFamily: typography.fontFamily.base,
            textAlign: 'left',
          }}
        >
          <span
            id={labelId}
            style={{
              display: 'block',
              paddingLeft: padX,
              paddingRight: padX,
              paddingTop: confirm.headPaddingY,
              paddingBottom: description == null ? confirm.headPaddingY : 0,
              fontSize: len(titleFontSize) ?? `${confirm.titleFontSize}px`,
              fontWeight: typography.fontWeight.medium,
              letterSpacing: typography.letterSpacing.m,
              lineHeight: 1.4,
              color: titleColor ?? color.navbar.textActive,
            }}
          >
            {title}
          </span>

          {description != null && (
            <span
              style={{
                display: 'block',
                paddingLeft: padX,
                paddingRight: padX,
                paddingTop: 4,
                paddingBottom: confirm.bodyPaddingBottom,
                fontSize: len(fontSize) ?? `${confirm.fontSize}px`,
                fontWeight: typography.fontWeight.regular,
                letterSpacing: typography.letterSpacing.m,
                lineHeight: 1.4,
                color: textColor ?? color.main.black,
              }}
            >
              {description}
            </span>
          )}

          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: confirm.footerGap,
              paddingLeft: padX,
              paddingRight: padX,
              paddingTop: confirm.footerPaddingY,
              paddingBottom: confirm.footerPaddingY,
            }}
          >
            {/* Cancel is drawn as bare text rather than an outlined button —
                the two actions should not look equally weighted when one of
                them deletes something. */}
            <Button
              variant="secondary"
              onClick={dismiss}
              disabled={busy}
              background="transparent"
              borderColor="transparent"
              textColor={color.navbar.text}
              paddingX={8}
              paddingY={6}
            >
              {cancelLabel}
            </Button>
            <Button tone="remove" onClick={handleConfirm} loading={busy} paddingX={8} paddingY={6}>
              {confirmLabel}
            </Button>
          </span>
        </span>
            );
            return renderCard
              ? renderCard({
                  title,
                  description,
                  confirmLabel,
                  cancelLabel,
                  confirm: handleConfirm,
                  cancel: dismiss,
                  busy,
                  placement,
                  defaultRender,
                })
              : defaultRender();
          })()}
        </span>
      )}
    </span>
  );
}

/**
 * Where the card sits relative to the anchor.
 *
 * The same four placements the tooltip offers, but written separately: this card
 * has a fixed width, so it centres against that rather than against a
 * content-driven box, and it carries no arrow to leave room for.
 */
function placementStyle(
  placement: TooltipPlacement,
  offset: number,
  align: ConfirmTooltipAlign,
): CSSProperties {
  // Centring is what Figma draws, but a card taller than its anchor centres
  // half of itself above the anchor — inside a scroll area that half is
  // clipped, so `start` pins the leading edges together instead.
  const centered = align === 'center';

  switch (placement) {
    case 'top':
      return {
        bottom: '100%',
        left: centered ? '50%' : 0,
        transform: centered ? 'translateX(-50%)' : undefined,
        marginBottom: offset,
      };
    case 'bottom':
      return {
        top: '100%',
        left: centered ? '50%' : 0,
        transform: centered ? 'translateX(-50%)' : undefined,
        marginTop: offset,
      };
    case 'left':
      return {
        right: '100%',
        top: centered ? '50%' : 0,
        transform: centered ? 'translateY(-50%)' : undefined,
        marginRight: offset,
      };
    case 'right':
      return {
        left: '100%',
        top: centered ? '50%' : 0,
        transform: centered ? 'translateY(-50%)' : undefined,
        marginLeft: offset,
      };
  }
}
