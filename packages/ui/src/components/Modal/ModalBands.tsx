import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { IconXClose } from '../../icons/defs.js';
import { IconButton } from '../Button/IconButton.js';

const { modal } = component;

/**
 * The three bands a modal card is built from.
 *
 * Figma draws the shell most completely on node 2077:8840 (the
 * schedule-message dialog): a head carrying the title and the close button, a
 * scrolling body, and a right-aligned footer of buttons. Every other dialog on
 * the page is the same three bands with different content between them, so
 * they are the shell rather than that one dialog.
 *
 * Split into three exported pieces rather than a single `Modal` with `title`
 * and `footer` props, because the body is the part that varies most — some
 * dialogs hold a form, some a status, some a list — and prop-driven slots
 * would push every one of those through the same narrow opening.
 *
 * `Modal` supplies the layer: the portal, the dimming, the focus trap, Escape.
 * These supply the card. They compose but do not depend on each other, so a
 * head can sit in a popover that is not a modal at all — which is exactly what
 * the Upwork authorization popup does.
 */

export type ModalHeaderStyleProps = {
  padding?: CssLength;
  gap?: CssLength;
  /** Title type size. */
  fontSize?: CssLength;
  background?: string;
  textColor?: string;
  /** The shadow separating the head from the scrolling body. */
  shadow?: string;
};

export type ModalHeaderProps = {
  /** The dialog's title. Point the modal's `labelledBy` at this. */
  children?: ReactNode;
  /**
   * Called when the close button is pressed. Omit it to drop the button —
   * which is what a step the user must not interrupt needs.
   */
  onClose?: () => void;
  /** Accessible name for the close button. */
  closeLabel?: string;
  /** Rendered between the title and the close button. */
  extra?: ReactNode;
  /**
   * Whether to draw the shadow under the head.
   *
   * On by default because the head is normally pinned over a scrolling body.
   * Turn it off when the body cannot scroll — a shadow with nothing moving
   * under it reads as an unexplained line.
   */
  divided?: boolean;
} & ModalHeaderStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

export const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(function ModalHeader(
  {
    children,
    onClose,
    closeLabel = 'Close',
    extra,
    divided = true,
    padding,
    gap,
    fontSize,
    background,
    textColor,
    shadow,
    ...rest
  },
  ref,
) {
  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: len(gap) ?? `${modal.header.gap}px`,
    padding: len(padding) ?? `${modal.header.padding}px`,
    width: '100%',
    flexShrink: 0,
    backgroundColor: background ?? color.main.white,
    // Sits above the body so the shadow falls ON the scrolling content rather
    // than under it.
    position: 'relative',
    zIndex: 1,
    boxShadow: divided ? (shadow ?? modal.header.shadow) : undefined,
  };

  return (
    <div {...rest} ref={ref} style={style}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: `${modal.footer.gap}px`,
          width: '100%',
        }}
      >
        <div
          style={{
            fontFamily: typography.fontFamily.base,
            fontSize: len(fontSize) ?? `${modal.header.fontSize}px`,
            fontWeight: typography.fontWeight.medium,
            letterSpacing: typography.letterSpacing.l,
            lineHeight: 1.3,
            color: textColor ?? color.main.black,
          }}
        >
          {children}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: `${modal.footer.gap}px`, flexShrink: 0 }}>
          {extra}
          {onClose && <IconButton icon={IconXClose} aria-label={closeLabel} onClick={onClose} />}
        </div>
      </div>
    </div>
  );
});

export type ModalContentStyleProps = {
  paddingX?: CssLength;
  paddingTop?: CssLength;
  paddingBottom?: CssLength;
  gap?: CssLength;
};

export type ModalContentProps = {
  children?: ReactNode;
  /**
   * Cap on the body's height before it scrolls. Without one a long body grows
   * the card past the viewport and takes the footer's buttons off screen.
   */
  maxHeight?: CssLength;
} & ModalContentStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

export const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>(function ModalContent(
  { children, maxHeight, paddingX, paddingTop, paddingBottom, gap, ...rest },
  ref,
) {
  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: len(gap) ?? `${modal.content.gap}px`,
    paddingLeft: len(paddingX) ?? `${modal.content.paddingX}px`,
    paddingRight: len(paddingX) ?? `${modal.content.paddingX}px`,
    paddingTop: len(paddingTop) ?? `${modal.content.paddingTop}px`,
    paddingBottom: len(paddingBottom) ?? `${modal.content.paddingBottom}px`,
    width: '100%',
    // Only the body scrolls, so the head stays pinned and the footer's buttons
    // stay reachable however long the content runs.
    overflowX: 'clip',
    overflowY: 'auto',
    maxHeight: len(maxHeight),
  };

  return (
    <div {...rest} ref={ref} style={style}>
      {children}
    </div>
  );
});

export type ModalFooterStyleProps = {
  padding?: CssLength;
  gap?: CssLength;
  background?: string;
};

export type ModalFooterProps = {
  children?: ReactNode;
  /**
   * How the buttons sit in the band.
   *
   * Right by default, which is what Figma draws and where a confirming action
   * is looked for. `between` is for a footer carrying a destructive action on
   * the left, away from the one the user is reaching toward.
   *
   * @default 'end'
   */
  align?: 'end' | 'start' | 'between' | 'center';
} & ModalFooterStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

const justify: Record<NonNullable<ModalFooterProps['align']>, CSSProperties['justifyContent']> = {
  end: 'flex-end',
  start: 'flex-start',
  between: 'space-between',
  center: 'center',
};

export const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(function ModalFooter(
  { children, align = 'end', padding, gap, background, ...rest },
  ref,
) {
  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: justify[align],
    gap: len(gap) ?? `${modal.footer.gap}px`,
    padding: len(padding) ?? `${modal.footer.padding}px`,
    width: '100%',
    flexShrink: 0,
    backgroundColor: background,
  };

  return (
    <div {...rest} ref={ref} style={style}>
      {children}
    </div>
  );
});

export type ModalCardStyleProps = {
  width?: CssLength;
  radius?: CssLength;
  background?: string;
  shadow?: string;
};

export type ModalCardProps = {
  children?: ReactNode;
} & ModalCardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The card the three bands sit in.
 *
 * Separate from `Modal` so the same shell can be used where there is no
 * backdrop — a popover, a docked panel, a gallery example.
 */
export const ModalCard = forwardRef<HTMLDivElement, ModalCardProps>(function ModalCard(
  { children, width, radius, background, shadow, ...rest },
  ref,
) {
  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: len(width) ?? `${modal.width}px`,
    maxWidth: '100%',
    borderRadius: len(radius) ?? `${modal.radius}px`,
    backgroundColor: background ?? color.main.white,
    boxShadow: shadow ?? modal.cardShadow,
    // Clips the bands to the card's radius, which is what stops the head and
    // footer squaring off its corners.
    overflow: 'hidden',
  };

  return (
    <div {...rest} ref={ref} style={style}>
      {children}
    </div>
  );
});
