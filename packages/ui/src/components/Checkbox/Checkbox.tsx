import { color, component, typography, type CheckboxSize } from '@gigradar/theme';
import {
  forwardRef,
  useId,
  useState,
  type CSSProperties,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconCheck } from '../../icons/defs.js';

export type { CheckboxSize };

const { checkbox } = component;

/**
 * Per-instance overrides for the checkbox's own metrics.
 *
 * The same narrow set the other components expose — the box's own dimensions
 * and colors, not a general style system. There is no `margin` or layout prop.
 */
export type CheckboxStyleProps = {
  /** Box edge length. Overrides the `size` step. */
  boxSize?: CssLength;
  /** The checkmark inside the box. */
  iconSize?: CssLength;
  /** Corner radius. Figma draws a circle. */
  radius?: CssLength;
  /** Thickness of the unchecked ring. */
  borderWidth?: CssLength;
  /** Space between the box and its label. */
  gap?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Fill of the checked box. */
  background?: string;
  /** The checkmark's color. */
  checkColor?: string;
  /** The unchecked ring, and the checked box's outline. */
  borderColor?: string;
  /** Label color. */
  textColor?: string;
};

export type CheckboxProps = {
  /**
   * Whether the box is ticked. Passing this makes the checkbox controlled —
   * it then renders whatever the parent says and reports clicks through
   * `onChange`, rather than tracking its own state.
   */
  checked?: boolean;
  /** The starting state of an uncontrolled checkbox. */
  defaultChecked?: boolean;
  /**
   * Called with the new checked value. Takes the boolean rather than the
   * event, since that is what a caller almost always wants; the event is the
   * second argument for the cases that need it.
   */
  onCheckedChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: CheckboxSize;
  /**
   * The label beside the box. Clicking it toggles the checkbox, since the
   * whole thing renders as one `<label>`.
   */
  children?: ReactNode;
  /**
   * Accessible name, for a checkbox with no visible label. Without either one
   * the box is unnamed to a screen reader.
   */
  label?: string;
} & CheckboxStyleProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'size' | 'type' | 'onChange'>;

/**
 * A checkbox.
 *
 * Figma: node 538:9016, which draws two states — "Complete", a 22px brand-blue
 * disc holding a white checkmark, and "Uncomplete", the same circle as a 1.5px
 * brand-blue ring on nothing.
 *
 * The real `<input type="checkbox">` is kept and visually hidden rather than
 * replaced with a styled `<div>`: that is what gives the component keyboard
 * focus, form participation, and the checkbox role for free. The visible box is
 * drawn beside it and reflects the input's state.
 *
 * Hover and focus are tracked in state rather than written as CSS rules,
 * because this package styles inline and ships no stylesheet — the same reason
 * the button does it.
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    size = 'medium',
    children,
    label,
    disabled = false,
    boxSize,
    iconSize,
    radius,
    borderWidth,
    gap,
    fontSize,
    background,
    checkColor,
    borderColor,
    textColor,
    id,
    onFocus,
    onBlur,
    ...rest
  },
  ref,
) {
  const [selfChecked, setSelfChecked] = useState(defaultChecked);
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  // Controlled when `checked` is passed, uncontrolled otherwise — the standard
  // React input contract, so the component drops into either kind of form.
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : selfChecked;

  const edge = len(boxSize) ?? `${checkbox.size[size]}px`;
  const mark = len(iconSize) ?? `${checkbox.iconSize[size]}px`;
  const ring = len(borderWidth) ?? `${checkbox.borderWidth}px`;
  const fill = background ?? color.main.brand;
  const outline = borderColor ?? color.main.brand;

  const rootStyle: CSSProperties = {
    // The positioning context for the hidden input. Without it the input's
    // `position: absolute` resolves against the page, so it drifts away from
    // the box it belongs to — invisible, but it takes the real click target
    // with it.
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: len(gap) ?? `${checkbox.gap[size]}px`,
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${checkbox.fontSize[size]}px`,
    fontWeight: typography.fontWeight.medium,
    letterSpacing: typography.letterSpacing.s,
    lineHeight: 1,
    color: textColor ?? (disabled ? color.disable.text : color.navbar.textActive),
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    // Figma has no disabled state for this component; the whole control is
    // dimmed rather than given a third palette, which fades box and label
    // together and stays correct if the drawn colors change.
    opacity: disabled ? 0.4 : undefined,
  };

  const boxStyle: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: edge,
    height: edge,
    borderRadius: len(radius) ?? `${checkbox.radius}px`,
    // The border is present in both states — matching the fill when checked —
    // so ticking the box never shifts the layout by the ring's width.
    border: `${ring} solid ${outline}`,
    backgroundColor: isChecked ? fill : 'transparent',
    color: checkColor ?? color.main.white,
    // The focus ring is drawn with `outline` so it sits outside the box and
    // does not disturb the circle. Only shown for keyboard focus.
    outline: focused ? `2px solid ${color.main.brand}` : undefined,
    outlineOffset: 2,
    transition: 'background-color 120ms ease, border-color 120ms ease',
  };

  return (
    <label htmlFor={inputId} style={rootStyle}>
      <input
        {...rest}
        ref={ref}
        id={inputId}
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => {
          if (!isControlled) setSelfChecked(event.target.checked);
          onCheckedChange?.(event.target.checked, event);
        }}
        onFocus={(event) => {
          // `:focus-visible` is what distinguishes a keyboard tab from a click,
          // and it is readable from the element even though the styles are
          // inline — so a mouse click does not leave a ring behind.
          setFocused(event.target.matches(':focus-visible'));
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        // Transparent and laid over the box rather than shrunk to a 1px sliver:
        // the input stays the real click target at the place the box is drawn,
        // which a 1px clipped input is not. `display: none` would be worse
        // still — it drops the input out of the tab order entirely.
        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: edge,
          height: edge,
          margin: 0,
          padding: 0,
          opacity: 0,
          // The label already shows `not-allowed` when disabled; without this
          // the input on top would override it with its own cursor.
          cursor: 'inherit',
        }}
      />
      <span aria-hidden style={boxStyle}>
        {isChecked && (
          <span
            style={{
              display: 'flex',
              width: mark,
              height: mark,
              // The box is `border-box`, so its content area is the edge minus
              // two borders — a mark sized to the full edge would be squeezed
              // by that inset. `flexShrink: 0` keeps it at its true size, and
              // the box's own radius clips nothing since the glyph is drawn
              // well inside its grid.
              flexShrink: 0,
            }}
          >
            <Icon icon={IconCheck} size="100%" />
          </span>
        )}
      </span>
      {children}
    </label>
  );
});
