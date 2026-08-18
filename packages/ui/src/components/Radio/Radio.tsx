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

const { checkbox, radioControl } = component;

/** A radio is sized on the same scale as a checkbox — see the component doc. */
export type RadioSize = CheckboxSize;

/**
 * What the selected state draws inside the circle.
 *
 * `dot` is the classic radio — a ring holding a smaller filled circle.
 * `check` fills the whole circle and drops a white tick in, which is what
 * Figma draws for the Auto Reply modes (node 3866:3252). Both carry the same
 * meaning; the difference is how loud the selection reads in its row.
 */
export type RadioIndicator = 'dot' | 'check';

/** Per-instance overrides for the radio's own metrics. */
export type RadioStyleProps = {
  /** Control edge length. */
  controlSize?: CssLength;
  /** Corner radius. A radio is a circle; this exists to break that if needed. */
  radius?: CssLength;
  /** Ring thickness. */
  borderWidth?: CssLength;
  /** Space between the control and its label. */
  gap?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** Ring color when unselected. */
  borderColor?: string;
  /** Ring and dot color when selected. */
  selectedColor?: string;
  /** Label color. */
  textColor?: string;
};

export type RadioProps = {
  /**
   * Whether this option is the selected one. Passing it makes the radio
   * controlled — it renders what the parent says and reports clicks through
   * `onSelectedChange`.
   */
  checked?: boolean;
  /** The starting state of an uncontrolled radio. */
  defaultChecked?: boolean;
  /**
   * Called when this option is picked. Only ever fires with `true` — a radio
   * cannot be unset by clicking it, only by another in its group being chosen.
   */
  onSelectedChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: RadioSize;
  /**
   * Which mark the selected state draws.
   *
   * @default 'dot'
   */
  indicator?: RadioIndicator;
  /** The label beside the control. Clicking it selects the option. */
  children?: ReactNode;
  /** Accessible name, for a radio with no visible label. */
  label?: string;
} & RadioStyleProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'className' | 'style' | 'size' | 'type' | 'onChange'>;

/**
 * A radio — one option in a group where exactly one can be chosen.
 *
 * Figma draws this as the mode selector in Auto Reply (node 3962:39155): a
 * ring that fills with a solid dot when picked.
 *
 * Deliberately separate from `Checkbox` even though both are circles. The
 * difference is not the glyph but the meaning: a checkbox is `type="checkbox"`
 * and each one stands alone, so three of them would let a user pick all three.
 * This is `type="radio"`, so the browser enforces one-of-many within a `name`,
 * and arrow keys move between options rather than tabbing through them. Giving
 * Checkbox a dot variant would have produced the right picture with the wrong
 * behaviour.
 *
 * Metrics come from the `checkbox` token block rather than a duplicate set —
 * the two controls share their size, ring, and gap by design, and only the
 * indicator differs.
 */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  {
    checked,
    defaultChecked = false,
    onSelectedChange,
    size = 'medium',
    indicator = 'dot',
    children,
    label,
    controlSize,
    radius,
    borderWidth,
    gap,
    fontSize,
    borderColor,
    selectedColor,
    textColor,
    disabled,
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

  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : selfChecked;

  const edge = len(controlSize) ?? `${checkbox.size[size]}px`;
  const ring = len(borderWidth) ?? `${checkbox.borderWidth}px`;
  const accent = selectedColor ?? color.main.brand;

  const rootStyle: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: len(gap) ?? `${checkbox.gap[size]}px`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: typography.fontFamily.base,
    fontSize: len(fontSize) ?? `${checkbox.fontSize[size]}px`,
    color: textColor ?? color.navbar.text2,
    userSelect: 'none',
    // Dimmed as a whole rather than given a third palette, matching Checkbox.
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
    // The ring stays in both states — taking the accent when selected — so
    // picking an option never shifts the row by the ring's width.
    border: `${ring} solid ${isChecked ? accent : (borderColor ?? color.main.border)}`,
    // The `dot` indicator leaves the circle open so the ring reads around the
    // mark; `check` fills it, because a white tick needs a solid ground.
    backgroundColor: isChecked && indicator === 'check' ? accent : 'transparent',
    color: color.main.white,
    outline: focused ? `2px solid ${color.main.brand}` : undefined,
    outlineOffset: 2,
    transition: 'border-color 120ms ease',
  };

  return (
    <label htmlFor={inputId} style={rootStyle}>
      <input
        {...rest}
        ref={ref}
        id={inputId}
        type="radio"
        checked={isChecked}
        disabled={disabled}
        aria-label={label}
        onChange={(event) => {
          if (!isControlled) setSelfChecked(event.target.checked);
          onSelectedChange?.(event.target.checked, event);
        }}
        onFocus={(event) => {
          // `:focus-visible` distinguishes a keyboard tab from a click, so a
          // mouse press does not leave a ring behind.
          setFocused(event.target.matches(':focus-visible'));
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      />
      <span style={boxStyle} aria-hidden>
        {isChecked &&
          (indicator === 'check' ? (
            <span
              style={{
                display: 'flex',
                width: `${radioControl.checkRatio * 100}%`,
                height: `${radioControl.checkRatio * 100}%`,
              }}
            >
              <Icon icon={IconCheck} size="100%" />
            </span>
          ) : (
            <span
              style={{
                display: 'block',
                width: `${radioControl.dotRatio * 100}%`,
                height: `${radioControl.dotRatio * 100}%`,
                borderRadius: checkbox.radius,
                backgroundColor: accent,
              }}
            />
          ))}
      </span>
      {children}
    </label>
  );
});
