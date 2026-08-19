import { color, component } from '@gigradar/theme';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconNotificationBellFill } from '../../icons/defs.js';

const { bell } = component.inbox;

/** Per-instance overrides for the toggle's own metrics. */
export type NotificationToggleStyleProps = {
  width?: CssLength;
  height?: CssLength;
  radius?: CssLength;
  /** The sliding handle's diameter. */
  handleSize?: CssLength;
  /** Inset between the track and the handle. */
  padding?: CssLength;
  /** Track fill while on. */
  background?: string;
  /** Track fill while off. */
  offBackground?: string;
  /** The handle's fill. */
  handleBackground?: string;
  /** How the track changes color, as a CSS transition value. */
  transition?: string;
};

export type NotificationToggleProps = {
  /** Whether push notifications are on. Controlled. */
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Names the control for a screen reader.
   * @default 'Push notifications'
   */
  label?: string;
} & NotificationToggleStyleProps &
  Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'className' | 'style' | 'onChange' | 'type' | 'value'
  >;

/**
 * The push-notification switch in the Inbox header.
 *
 * Figma: node 1135:16742.
 *
 * Distinct from the generic `Toggle`, which slides a plain handle: this one
 * carries a bell inside the handle. That glyph is the whole affordance — the
 * header has room for one control and no room for a caption beside it — so it
 * is not something `Toggle` can express by taking a prop.
 *
 * Filed with the Inbox rather than under the generic tier because the bell
 * names what is being switched. A second product wanting a switch wants
 * `Toggle`; one wanting *this* is showing notifications.
 */
export const NotificationToggle = forwardRef<HTMLButtonElement, NotificationToggleProps>(
  function NotificationToggle(
    {
      checked = false,
      onCheckedChange,
      label = 'Push notifications',
      width,
      height,
      radius,
      handleSize,
      padding,
      background,
      offBackground,
      handleBackground,
      transition,
      onClick,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={(event) => {
          onCheckedChange?.(!checked);
          onClick?.(event);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          // The handle is placed by the track's own alignment rather than a
          // transform, so the two insets stay symmetrical at any width.
          justifyContent: checked ? 'flex-end' : 'flex-start',
          flexShrink: 0,
          boxSizing: 'border-box',
          width: len(width) ?? bell.width,
          height: len(height) ?? bell.height,
          padding: len(padding) ?? bell.padding,
          border: 'none',
          borderRadius: len(radius) ?? bell.radius,
          backgroundColor: checked
            ? background ?? color.badge.foreground
            : offBackground ?? color.disable.background,
          cursor: 'pointer',
          transition: transition ?? bell.transition,
        }}
        {...rest}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: len(handleSize) ?? bell.handleSize,
            height: len(handleSize) ?? bell.handleSize,
            borderRadius: '50%',
            backgroundColor: handleBackground ?? color.main.white,
          }}
        >
          {/* Filled in both states, with color carrying on/off rather than
              weight: the glyph sits in a 28px handle, and an outline bell at
              that size reads as a smudge next to the filled one. */}
          <Icon
            icon={IconNotificationBellFill}
            size={bell.iconSize}
            color={checked ? color.badge.foreground : color.disable.text}
          />
        </span>
      </button>
    );
  },
);
