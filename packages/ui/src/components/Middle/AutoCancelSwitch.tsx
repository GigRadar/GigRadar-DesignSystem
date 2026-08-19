import { borderWidth, color, component, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Toggle } from '../Toggle/Toggle.js';
import { Icon } from '../../icons/Icon.js';
import { IconAutoCancelShieldStroke } from '../../icons/defs.js';

const { autoCancel } = component.middle;

/** Per-instance overrides for the control's own metrics. */
export type AutoCancelSwitchStyleProps = {
  radius?: CssLength;
  paddingX?: CssLength;
  paddingY?: CssLength;
  gap?: CssLength;
  background?: string;
  /** The outline, and the shield glyph inside it. */
  accentColor?: string;
};

export type AutoCancelSwitchProps = {
  /** Whether auto-cancel is on. Controlled. */
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (on: boolean) => void;
  /**
   * The label beside the shield. Pass `null` to drop it — the mobile scheduled
   * header draws the glyph and the switch with no room for the word.
   */
  label?: ReactNode;
  disabled?: boolean;
} & AutoCancelSwitchStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'onChange' | 'defaultChecked'>;

/**
 * The auto-cancel switch on the scheduled-messages header.
 *
 * Figma: node 3523:37238, and the mobile version at 4209:32375 which drops the
 * label. Outlined in the Schedule Messages purple rather than the brand blue —
 * it belongs to the scheduling surface, not to the room.
 *
 * A component rather than a `Toggle` the header wraps: the shield, the purple
 * outline, and the label are what make it read as auto-cancel, and every screen
 * drawing a scheduled queue needs the same three.
 */
export const AutoCancelSwitch = forwardRef<HTMLDivElement, AutoCancelSwitchProps>(
  function AutoCancelSwitch(
    {
      checked,
      defaultChecked,
      onCheckedChange,
      label = 'Auto-cancel',
      disabled = false,
      radius,
      paddingX,
      paddingY,
      gap,
      background,
      accentColor,
      ...rest
    },
    ref,
  ) {
    const accent = accentColor ?? color.accent.schedule.main;

    return (
      <div
        ref={ref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          flexShrink: 0,
          boxSizing: 'border-box',
          gap: len(gap) ?? autoCancel.gap,
          paddingLeft: len(paddingX) ?? autoCancel.paddingX,
          paddingRight: len(paddingX) ?? autoCancel.paddingX,
          paddingTop: len(paddingY) ?? autoCancel.paddingY,
          paddingBottom: len(paddingY) ?? autoCancel.paddingY,
          borderRadius: len(radius) ?? autoCancel.radius,
          border: `${borderWidth.thin}px solid ${accent}`,
          backgroundColor: background ?? color.main.white,
          opacity: disabled ? autoCancel.disabledOpacity : 1,
        }}
        {...rest}
      >
        <Icon icon={IconAutoCancelShieldStroke} size={autoCancel.iconSize} color={accent} />
        {label != null && (
          <span style={{ ...textStyle.mMedium, color: color.main.black, whiteSpace: 'nowrap' }}>
            {label}
          </span>
        )}
        <Toggle
          size="small"
          label="Auto-cancel scheduled messages"
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      </div>
    );
  },
);
