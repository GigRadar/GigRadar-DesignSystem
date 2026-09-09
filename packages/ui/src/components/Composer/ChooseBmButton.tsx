import { borderWidth, color, component } from '@gigradar/theme';
import { forwardRef, useState, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Avatar, type AvatarToneName } from '../Avatar/Avatar.js';
import { Icon } from '../../icons/Icon.js';
import { IconDropdownArrowDown } from '../../icons/defs.js';

const { chooseBm } = component.middle.composer;

/** Per-instance overrides for the button's own metrics. */
export type ChooseBmButtonStyleProps = {
  height?: CssLength;
  radius?: CssLength;
  background?: string;
  borderColor?: string;
};

export type ChooseBmButtonProps = {
  /** The manager currently sending — their photo, and the name behind it. */
  name?: string;
  avatar?: string;
  /** Pins the initials' palette when there is no photo. */
  tone?: AvatarToneName;
  /**
   * Whether the picker it opens is showing. Figma calls it "Clicked": the pill
   * takes a brand outline and the chevron flips.
   * @default false
   */
  open?: boolean;
  /** Whether the sender can be changed. */
  disabled?: boolean;
} & ChooseBmButtonStyleProps &
  Omit<HTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * The Business Manager picker — which account the message goes out from.
 *
 * Figma: node 1109:10591.
 *
 * The avatar is the label. Which manager is sending is a face people recognise
 * faster than a name, and the pill has to sit in a toolbar beside a text box
 * without taking the room a name would need.
 */
export const ChooseBmButton = forwardRef<HTMLButtonElement, ChooseBmButtonProps>(
  function ChooseBmButton(
    {
      name,
      avatar,
      tone,
      open = false,
      disabled = false,
      height,
      radius,
      background,
      borderColor,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref,
  ) {
    const [hovered, setHovered] = useState(false);

    return (
      <button
        ref={ref}
        type="button"
        aria-label={name ? `Sending as ${name}` : 'Choose Business Manager'}
        aria-expanded={open}
        disabled={disabled}
        onMouseEnter={(event) => {
          setHovered(true);
          onMouseEnter?.(event);
        }}
        onMouseLeave={(event) => {
          setHovered(false);
          onMouseLeave?.(event);
        }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          gap: chooseBm.gap,
          height: len(height) ?? chooseBm.height,
          paddingLeft: chooseBm.paddingLeft,
          paddingRight: chooseBm.paddingRight,
          paddingTop: chooseBm.paddingY,
          paddingBottom: chooseBm.paddingY,
          borderRadius: len(radius) ?? chooseBm.radius,
          // Open outlines rather than fills: the pill stays on the page
          // background so the picker hanging off it reads as the lit surface.
          border: `${borderWidth.thin}px solid ${
            open ? borderColor ?? color.badge.foreground : 'transparent'
          }`,
          backgroundColor:
            background ?? (hovered && !open ? color.navbar.hover : color.main.background),
          cursor: disabled ? 'default' : 'pointer',
          transition: 'background-color 120ms ease',
        }}
        {...rest}
      >
        <Avatar size="medium" diameter={chooseBm.avatarSize} name={name} src={avatar} tone={tone} />
        <span
          aria-hidden
          style={{
            display: 'inline-flex',
            transform: open ? 'rotate(180deg)' : undefined,
            transition: 'transform 120ms ease',
          }}
        >
          <Icon
            icon={IconDropdownArrowDown}
            size={chooseBm.chevronSize}
            color={color.main.description}
          />
        </span>
      </button>
    );
  },
);
