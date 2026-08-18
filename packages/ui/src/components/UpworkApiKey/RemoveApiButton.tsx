import { color, component, typography } from '@gigradar/theme';
import { forwardRef, useState, type ButtonHTMLAttributes, type CSSProperties } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconTryAgain, IconXClose } from '../../icons/defs.js';
import { Spinner } from '../Spinner/Spinner.js';

const { removeButton } = component.upworkApiKey;

/** Per-instance overrides for the button's own metrics. */
export type RemoveApiButtonStyleProps = {
  /** Box height. */
  height?: CssLength;
  /** Horizontal padding. */
  paddingX?: CssLength;
  /** Vertical padding. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Space between the glyph and the label. */
  gap?: CssLength;
  /** Fill at rest. */
  background?: string;
  /** Edge color. */
  borderColor?: string;
  /** Label and glyph color. */
  textColor?: string;
  /** Fill on hover. */
  hoverBackground?: string;
};

/**
 * What the strip is doing.
 *
 * `removing` is not a `disabled` flag with a spinner bolted on: Figma drops the
 * edge to the pale error tint while it works, so the strip recedes rather than
 * greying out. `failed` keeps the button live — the label becomes the retry
 * instruction, because a removal that failed is retried from the same place.
 */
export type RemoveApiButtonState = 'idle' | 'removing' | 'failed';

export type RemoveApiButtonProps = {
  /**
   * Which state to draw.
   *
   * @default 'idle'
   */
  state?: RemoveApiButtonState;
  /** Overrides the label. Each state supplies its own. */
  children?: React.ReactNode;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
} & RemoveApiButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/** The label each state draws when the caller passes none. */
const labels: Record<RemoveApiButtonState, string> = {
  idle: 'Remove API key',
  removing: 'Removing API key...',
  failed: 'Failed to remove API key. Click this button to try again',
};

/**
 * The destructive strip closing the API status card — Figma's "Remove API
 * Button" (node 2133:1146).
 *
 * Deliberately NOT `Button` with `variant="danger"`. Figma draws a 30px
 * full-width outline strip at 12px text; the design system button is a
 * content-width 36px control at 14px with a filled danger variant. The
 * difference is the shape and the job — this is a full-bleed footer closing a
 * card, and Button has no step that draws one. Reusing it would mean
 * overriding height, width, radius, type size, and the fill, at which point
 * nothing of Button is left.
 *
 * The glyph switches with the state: a cross to remove, a spinner while it
 * works, and the retry arrow once it has failed.
 *
 * Figma paints this from its "Error" group (#EF5350 edge, #C62828 label). The
 * design system is the authority on red, not the drawing: those two were
 * deprecated in favour of the canonical "Failed" red, so this reads
 * `status.error`. One step off what Figma shows, deliberately.
 */
export const RemoveApiButton = forwardRef<HTMLButtonElement, RemoveApiButtonProps>(
  function RemoveApiButton(
    {
      state = 'idle',
      children,
      hovered,
      height,
      paddingX,
      paddingY,
      radius,
      fontSize,
      gap,
      background,
      borderColor,
      textColor,
      hoverBackground,
      disabled,
      onPointerEnter,
      onPointerLeave,
      ...rest
    },
    ref,
  ) {
    const [pointerInside, setPointerInside] = useState(false);
    const isRemoving = state === 'removing';
    const isHovered = (hovered ?? pointerInside) && !disabled && !isRemoving;

    const style: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      width: '100%',
      height: len(height) ?? `${removeButton.height}px`,
      gap: len(gap) ?? `${removeButton.gap}px`,
      padding: `${len(paddingY) ?? `${removeButton.paddingY}px`} ${
        len(paddingX) ?? `${removeButton.paddingX}px`
      }`,
      borderRadius: len(radius) ?? `${removeButton.radius}px`,
      // While removing, the edge drops to the pale tint so the strip recedes
      // rather than greying out — the card is still showing a live key.
      border: `${removeButton.borderWidth}px solid ${
        borderColor ?? (isRemoving ? color.status.error.background : color.status.error.main)
      }`,
      background: isHovered
        ? (hoverBackground ?? removeButton.hoverSurface)
        : (background ?? color.main.white),
      color: textColor ?? color.status.error.text,
      fontFamily: typography.fontFamily.base,
      fontSize: len(fontSize) ?? `${removeButton.fontSize}px`,
      fontWeight: typography.fontWeight.medium,
      letterSpacing: typography.letterSpacing.s,
      lineHeight: 1,
      cursor: disabled || isRemoving ? 'default' : 'pointer',
      appearance: 'none',
      transition: 'background-color 120ms ease, border-color 120ms ease',
    };

    return (
      <button
        {...rest}
        ref={ref}
        type="button"
        disabled={disabled || isRemoving}
        style={style}
        onPointerEnter={(event) => {
          setPointerInside(true);
          onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          setPointerInside(false);
          onPointerLeave?.(event);
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: removeButton.iconSize,
            height: removeButton.iconSize,
          }}
        >
          {isRemoving ? (
            <Spinner
              diameter="100%"
              headColor={color.status.error.text}
              bodyColor={color.status.error.main}
            />
          ) : (
            <Icon icon={state === 'failed' ? IconTryAgain : IconXClose} size="100%" />
          )}
        </span>
        {children ?? labels[state]}
      </button>
    );
  },
);
