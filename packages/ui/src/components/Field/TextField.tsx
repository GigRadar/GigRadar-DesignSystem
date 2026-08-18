import { color, component, typography } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type PointerEventHandler,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconEyeCrossViewStroke, IconEyeViewStroke, type IconDef } from '../../icons/defs.js';

const { upworkApiKey } = component;
const { field } = upworkApiKey;

/** Per-instance overrides for the field's own metrics. */
export type TextFieldStyleProps = {
  /** Box height. */
  height?: CssLength;
  /** Horizontal padding. */
  paddingX?: CssLength;
  /** Vertical padding. */
  paddingY?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Value type size. */
  fontSize?: CssLength;
  /** Space between the field's slots. */
  gap?: CssLength;
  /** Fill. */
  background?: string;
  /** Edge color at rest. */
  borderColor?: string;
  /** Edge color while focused or hovered. */
  activeBorderColor?: string;
  /** Value color. */
  textColor?: string;
  /** Placeholder color. */
  placeholderColor?: string;
};

export type TextFieldProps = {
  /** The label above the box. Omit for a bare field. */
  label?: ReactNode;
  /** A glyph beside the label, naming what the field holds. */
  labelIcon?: IconDef;
  /**
   * Masks the value and offers a reveal control.
   *
   * The reveal is the reason this is a prop rather than `type="password"` at
   * the call site: a secret a user just pasted has to be checkable, and every
   * screen that takes one would otherwise build the same eye toggle.
   */
  secret?: boolean;
  /**
   * Draws the error palette and, when given a node, the message under the box.
   *
   * A single prop rather than a `state` enum plus a message: an error is the
   * only state a caller sets deliberately — hover and focus come from the
   * pointer and the keyboard, so the component owns those.
   */
  error?: boolean | ReactNode;
  /** Draws the focus palette regardless of the keyboard. For docs and tests. */
  focused?: boolean;
  /** Draws the hover palette regardless of the pointer. For docs and tests. */
  hovered?: boolean;
  /** Content pinned to the right of the value — a copy button, a unit. */
  trailing?: ReactNode;
} & TextFieldStyleProps &
  Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'className' | 'style' | 'size' | 'onPointerEnter' | 'onPointerLeave'
  > & {
    /** Fires when the pointer enters the field's box. */
    onPointerEnter?: PointerEventHandler<HTMLDivElement>;
    /** Fires when it leaves. */
    onPointerLeave?: PointerEventHandler<HTMLDivElement>;
  };

/**
 * A single-line text input — Figma's "Settings Textfield" (node 2104:32695).
 *
 * Four states are drawn and all four are the same box: only the edge and the
 * value color move. Default is a pale blue edge on the page background, hover
 * and focus lift the edge to brand blue, and a filled field darkens the value
 * from the placeholder tint to black.
 *
 * The label sits inside the component rather than beside it because Figma
 * draws the pair as one unit everywhere it appears, and splitting them would
 * make every call site re-derive the 6px gap and the label's 4px icon spacing.
 *
 * Deliberately NOT built on the design system's control height. Figma draws
 * this at 33px against `controlHeight.small`'s 28 and `medium`'s 36 — it is a
 * settings-form field that stacks two or three deep inside a card, and the
 * system steps are sized for controls that stand in a toolbar row.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    label,
    labelIcon,
    secret = false,
    error = false,
    focused,
    hovered,
    trailing,
    height,
    paddingX,
    paddingY,
    radius,
    fontSize,
    gap,
    background,
    borderColor,
    activeBorderColor,
    textColor,
    placeholderColor,
    disabled,
    id,
    onFocus,
    onBlur,
    onPointerEnter,
    onPointerLeave,
    ...rest
  },
  ref,
) {
  const [pointerInside, setPointerInside] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isFocused = (focused ?? keyboardFocus) && !disabled;
  const isHovered = (hovered ?? pointerInside) && !disabled;
  const hasError = error !== false && error != null;
  const message = typeof error === 'boolean' ? null : error;

  // The placeholder tint is the same pale blue as the resting edge, so an
  // empty field reads as one flat shape rather than a box with text in it.
  const resolvedPlaceholder = placeholderColor ?? color.navbar.disabledBackground;

  const resolvedBorder = hasError
    ? color.status.error.main
    : isFocused || isHovered
      ? (activeBorderColor ?? color.main.brand)
      : (borderColor ?? color.navbar.disabledBackground);

  const boxStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    height: len(height) ?? `${field.height}px`,
    gap: len(gap) ?? `${field.gap}px`,
    padding: `${len(paddingY) ?? `${field.paddingY}px`} ${len(paddingX) ?? `${field.paddingX}px`}`,
    borderRadius: len(radius) ?? `${field.radius}px`,
    border: `${field.borderWidth}px solid ${resolvedBorder}`,
    backgroundColor: background ?? (disabled ? color.disable.background : color.main.background),
    opacity: disabled ? 0.6 : 1,
    transition: 'border-color 120ms ease',
  };

  const inputStyle: CSSProperties = {
    flex: '1 1 auto',
    minWidth: 0,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: 0,
    color: textColor ?? (disabled ? color.disable.text : color.main.black),
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${field.fontSize}px`,
    fontWeight: typography.fontWeight.regular,
    letterSpacing: typography.letterSpacing.m,
    lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'text',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: `${field.labelGap}px`, width: '100%' }}>
      {label != null && (
        <label
          htmlFor={id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: `${field.labelGap2}px`,
            color: color.navbar.text2,
            fontFamily: typography.fontFamily.base,
            fontSize: `${field.labelFontSize}px`,
            fontWeight: typography.fontWeight.medium,
            letterSpacing: typography.letterSpacing.m,
            lineHeight: 1,
          }}
        >
          {labelIcon && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: field.labelIconSize,
                height: field.labelIconSize,
              }}
            >
              <Icon icon={labelIcon} size="100%" />
            </span>
          )}
          {label}
        </label>
      )}

      <div
        data-gr-field=""
        style={boxStyle}
        onPointerEnter={(event) => {
          setPointerInside(true);
          onPointerEnter?.(event);
        }}
        onPointerLeave={(event) => {
          setPointerInside(false);
          onPointerLeave?.(event);
        }}
      >
        <input
          {...rest}
          ref={ref}
          id={id}
          disabled={disabled}
          type={secret && !revealed ? 'password' : 'text'}
          aria-invalid={hasError || undefined}
          style={inputStyle}
          onFocus={(event) => {
            setKeyboardFocus(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setKeyboardFocus(false);
            onBlur?.(event);
          }}
        />

        {/* The placeholder tint cannot be set inline, so it arrives as a rule
            scoped to this element. Browsers de-duplicate identical rules. */}
        <style>{`[data-gr-field] input::placeholder { color: ${resolvedPlaceholder}; opacity: 1; }`}</style>

        {secret && (
          <button
            type="button"
            onClick={() => setRevealed((value) => !value)}
            disabled={disabled}
            title={revealed ? 'Hide' : 'Reveal'}
            aria-label={revealed ? 'Hide value' : 'Reveal value'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: field.actionSize,
              height: field.actionSize,
              padding: 0,
              border: 'none',
              background: 'transparent',
              color: color.navbar.text,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            <Icon icon={revealed ? IconEyeCrossViewStroke : IconEyeViewStroke} size="100%" />
          </button>
        )}

        {trailing}
      </div>

      {message != null && (
        <span
          style={{
            color: color.status.error.text,
            fontFamily: typography.fontFamily.base,
            fontSize: `${component.upworkApiKey.testStatus.fontSize}px`,
            fontWeight: typography.fontWeight.regular,
            letterSpacing: typography.letterSpacing.m,
            lineHeight: 1.4,
          }}
        >
          {message}
        </span>
      )}
    </div>
  );
});
