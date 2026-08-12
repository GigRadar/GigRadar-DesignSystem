import { color, component } from '@gigradar/theme';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { len, type CssLength } from '../../internal/length.js';

const { modal } = component;

export type ModalStyleProps = {
  /** Card width. */
  width?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Card fill. */
  background?: string;
  /** The dimming layer over the page. */
  backdrop?: string;
  /** Drop shadow. */
  shadow?: string;
};

export type ModalProps = {
  /** Whether the modal is on screen. */
  open: boolean;
  /**
   * Called when the user asks to close — Escape, a backdrop click, or the
   * close button of whatever is inside.
   *
   * Omitting it makes the modal undismissable, which is what a step the user
   * must not interrupt needs. An authorization in flight is the example: there
   * is no correct thing to do with a half-finished OAuth handshake.
   */
  onClose?: () => void;
  /** The card's contents. */
  children?: ReactNode;
  /**
   * Accessible name for the dialog. Pass this when the content has no heading
   * of its own; when it does, point `aria-labelledby` at that heading instead.
   */
  label?: string;
  /** Id of the element naming this dialog. */
  labelledBy?: string;
  /**
   * Whether clicking the backdrop closes it.
   *
   * @default true
   */
  closeOnBackdrop?: boolean;
  /**
   * Whether Escape closes it.
   *
   * @default true
   */
  closeOnEscape?: boolean;
  /**
   * Where to mount. Defaults to `document.body`, which is what keeps the card
   * clear of any ancestor's `overflow` or stacking context.
   */
  container?: HTMLElement | null;
} & ModalStyleProps;

/** The selector for what can hold focus inside the card. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A centred card over a dimmed page.
 *
 * Figma draws the cards but never the layer behind them, so what this owns is
 * everything the drawing leaves out: the dimming, the portal, the focus trap,
 * Escape, and the scroll lock. Those are the parts every screen would
 * otherwise reimplement slightly differently — and the parts that are wrong in
 * a way nobody notices until a keyboard user is stuck behind an open dialog.
 *
 * The card itself is deliberately unstyled beyond a surface, a radius, and a
 * shadow. What goes inside is a component in its own right — the authorization
 * popup, a confirmation, a form — so this supplies the layer, not the layout.
 *
 * `onClose` being optional is the load-bearing detail: a modal with no handler
 * cannot be dismissed by any route, which is what an uninterruptible step
 * needs. Passing one opts into all three dismissals at once.
 */
export function Modal({
  open,
  onClose,
  children,
  label,
  labelledBy,
  closeOnBackdrop = true,
  closeOnEscape = true,
  container,
  width,
  radius,
  background,
  backdrop,
  shadow,
}: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // Where focus was before the modal opened, so it can be handed back on
  // close — without this the user is dropped at the top of the page.
  const restoreTo = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const dismiss = useCallback(() => onClose?.(), [onClose]);

  useEffect(() => {
    if (!open || typeof document === 'undefined') return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    // The page behind must not scroll under the card. Restoring the previous
    // value rather than clearing it keeps a page that was already locked —
    // one modal opening over another — locked when this one closes.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const card = cardRef.current;
    const first = card?.querySelector<HTMLElement>(FOCUSABLE);
    // Focus the first control, or the card itself when it holds none — either
    // way focus is inside, which is what makes the trap below meaningful.
    (first ?? card)?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        event.stopPropagation();
        dismiss();
        return;
      }

      if (event.key !== 'Tab' || !card) return;

      // The trap: Tab off either end of the card wraps to the other end,
      // rather than moving into the page behind, which is unreachable.
      const focusable = Array.from(card.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const firstItem = focusable[0];
      const lastItem = focusable[focusable.length - 1];
      if (!firstItem || !lastItem) return;

      const active = document.activeElement;

      if (event.shiftKey && (active === firstItem || active === card)) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      restoreTo.current?.focus?.();
    };
  }, [open, closeOnEscape, dismiss]);

  if (!open || typeof document === 'undefined') return null;

  const backdropStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: modal.viewportPadding,
    backgroundColor: backdrop ?? modal.backdrop,
    // Tall content scrolls within the overlay rather than being clipped, which
    // is what keeps a long dialog usable on a short viewport.
    overflowY: 'auto',
    zIndex: 1000,
  };

  const cardStyle: CSSProperties = {
    boxSizing: 'border-box',
    width: len(width) ?? `${modal.width}px`,
    maxWidth: '100%',
    borderRadius: len(radius) ?? `${modal.radius}px`,
    backgroundColor: background ?? color.main.white,
    boxShadow: shadow ?? modal.shadow,
    outline: 'none',
  };

  return createPortal(
    <div
      style={backdropStyle}
      onMouseDown={(event) => {
        // `mousedown` on the backdrop itself, not `click`: a click fires when
        // press and release land on different elements, so dragging a text
        // selection out of the card would otherwise close it.
        if (closeOnBackdrop && event.target === event.currentTarget) dismiss();
      }}
    >
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-label={labelledBy ? undefined : label}
        aria-labelledby={labelledBy ?? (label ? undefined : titleId)}
        tabIndex={-1}
        style={cardStyle}
      >
        {children}
      </div>
    </div>,
    container ?? document.body,
  );
}
