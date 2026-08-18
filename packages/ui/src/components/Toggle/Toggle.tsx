import { color, component, radius as radiusToken, typography, type ToggleSize } from '@gigradar/theme';
import {
  forwardRef,
  useState,
  type CSSProperties,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';

export type { ToggleSize };

const { toggle } = component;

/** Per-instance overrides for the track's own metrics. */
export type ToggleStyleProps = {
  /** Track width. */
  width?: CssLength;
  /** The sliding handle's diameter. The track's height follows from it. */
  handleSize?: CssLength;
  /** Corner radius. Figma draws a pill. */
  radius?: CssLength;
  /** Caption type size. */
  fontSize?: CssLength;
  /** The track's fill while on. */
  background?: string;
  /** The track's fill while off. */
  offBackground?: string;
  /** The handle's fill. */
  handleBackground?: string;
  /** The caption's color. */
  captionColor?: string;
  /** How the handle slides, as a CSS transition value. Pass `'none'` to jump. */
  transition?: string;
};

export type ToggleProps = {
  /** Whether the toggle is on. Controlled. */
  checked?: boolean;
  /** The starting position when the toggle manages its own state. */
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Draws "ON"/"OFF" inside the track, on the side the handle is not.
   *
   * Off by default: the notification cards draw a bare track, and the caption
   * is what Figma's wider standalone variant carries.
   *
   * @default false
   */
  caption?: boolean;
  /** Overrides the caption text. Defaults to "ON" and "OFF". */
  captionLabels?: { on: ReactNode; off: ReactNode };
  size?: ToggleSize;
  disabled?: boolean;
  /**
   * Names the control for a screen reader. Required unless a visible label is
   * already wired up through `aria-labelledby`.
   */
  label?: string;
} & ToggleStyleProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'style' | 'onChange' | 'type' | 'value'
  >;

/**
 * A binary on/off toggle — Figma node 3460:60145.
 *
 * Distinct from `Switch`, which despite the name is the segmented control: a
 * row of labelled choices where exactly one is picked. This is the two-state
 * track with a sliding handle, and the two are different controls that Figma
 * happens to file near each other.
 *
 * Built on a real `<button>` with `role="switch"`, so it is reachable by Tab
 * and toggles on Space and Enter without any of that being reimplemented here.
 *
 * The handle moves with `justify-content` rather than a transform: the track
 * carries asymmetric padding in Figma — tighter on the side the handle rests
 * against, wider on the caption's side — and letting flexbox place the handle
 * keeps that relationship intact at every size.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    checked,
    defaultChecked = false,
    onCheckedChange,
    caption = false,
    captionLabels,
    size = 'medium',
    disabled = false,
    label,
    width,
    handleSize,
    radius,
    fontSize,
    background,
    offBackground,
    handleBackground,
    captionColor,
    transition,
    onClick,
    ...rest
  },
  ref,
) {
  const [uncontrolled, setUncontrolled] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : uncontrolled;

  const handle = len(handleSize) ?? `${toggle.handleSize[size]}px`;
  const tight = toggle.padding[size];
  const wide = toggle.paddingWide[size];
  const move = transition ?? toggle.transition;

  // A bare track is only as wide as it needs to be: the handle, the distance
  // it travels, and the insets. The captioned track keeps its declared width
  // instead, so the handle does not shift as "ON" becomes the longer "OFF".
  const trackWidth =
    len(width) ??
    (caption
      ? `${toggle.width[size]}px`
      : `${toggle.handleSize[size] + toggle.bareTravel[size] + tight + wide}px`);

  const style: CSSProperties = {
    boxSizing: 'border-box',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: isOn ? 'flex-end' : 'flex-start',
    gap: `${toggle.gap}px`,
    width: trackWidth,
    // The wider inset is always on the side the handle is sliding away from,
    // which is what keeps the caption clear of it.
    padding: isOn ? `${tight}px ${tight}px ${tight}px ${wide}px` : `${tight}px ${wide}px ${tight}px ${tight}px`,
    borderRadius: len(radius) ?? `${toggle.radius}px`,
    border: 'none',
    backgroundColor: isOn
      ? (background ?? color.main.brand)
      : (offBackground ?? color.disable.backgroundAlt),
    fontFamily: typography.fontFamily.base,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    overflow: 'hidden',
    transition: move === 'none' ? undefined : `background-color ${move}`,
    // A pill this small has nowhere to put a focus ring inside itself.
    outlineOffset: 2,
  };

  const captionText = isOn ? (captionLabels?.on ?? 'ON') : (captionLabels?.off ?? 'OFF');

  return (
    <button
      {...rest}
      ref={ref}
      type="button"
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      disabled={disabled}
      style={style}
      onClick={(event) => {
        if (!isControlled) setUncontrolled(!isOn);
        onCheckedChange?.(!isOn);
        onClick?.(event);
      }}
    >
      {caption && isOn && (
        <span
          style={{
            color: captionColor ?? color.main.white,
            fontSize: len(fontSize) ?? `${toggle.captionFontSize[size]}px`,
            letterSpacing: typography.letterSpacing.s,
            lineHeight: 1,
          }}
        >
          {captionText}
        </span>
      )}
      <span
        aria-hidden
        style={{
          flexShrink: 0,
          width: handle,
          height: handle,
          borderRadius: `${radiusToken.round}px`,
          backgroundColor: handleBackground ?? color.main.white,
          boxShadow: toggle.handleShadow,
        }}
      />
      {caption && !isOn && (
        <span
          style={{
            color: captionColor ?? color.main.white,
            fontSize: len(fontSize) ?? `${toggle.captionFontSize[size]}px`,
            letterSpacing: typography.letterSpacing.s,
            lineHeight: 1,
          }}
        >
          {captionText}
        </span>
      )}
    </button>
  );
});
