import { color, component, radius as radiusToken, textStyle } from '@gigradar/theme';
import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { paywall } = component;

/** Per-instance overrides for one segment's own metrics. */
export type SwitchButtonStyleProps = {
  height?: CssLength;
  paddingX?: CssLength;
  paddingY?: CssLength;
  gap?: CssLength;
  fontSize?: CssLength;
};

export type PaywallSwitchButtonProps = {
  /** The cycle's name — "Monthly", "Annual". */
  children: ReactNode;
  /**
   * Whether this is the chosen cycle. The selected segment is the white pill.
   * @default false
   */
  selected?: boolean;
  /**
   * A trailing pill — "Save 20%". Only the cycle that saves money carries one,
   * which is what makes it an argument rather than a label.
   */
  saving?: ReactNode;
} & SwitchButtonStyleProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'style'>;

/**
 * One cycle in the subscription switch.
 *
 * Figma: node 3913:24775.
 *
 * Exported because the switch takes its segments as children — which cycles a
 * product sells is the product's question, and Figma's own component carries
 * hidden Quarterly and Semi-annual segments for exactly that reason.
 */
export const PaywallSwitchButton = forwardRef<HTMLButtonElement, PaywallSwitchButtonProps>(
  function PaywallSwitchButton(
    { children, selected = false, saving, height, paddingX, paddingY, gap, fontSize, ...rest },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={selected}
        style={{
          ...(selected ? textStyle.mMedium : textStyle.mRegular),
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          gap: len(gap) ?? `${paywall.switch.itemGap}px`,
          height: len(height) ?? `${paywall.switch.itemHeight}px`,
          padding: `${len(paddingY) ?? `${paywall.switch.itemPaddingY}px`} ${
            len(paddingX) ?? `${paywall.switch.itemPaddingX}px`
          }`,
          fontSize: len(fontSize) ?? paywall.switch.itemFontSize,
          /*
           * The selected segment is a white pill on the track; the others are
           * transparent. Both keep the same text colour — the fill is what
           * says which is chosen, and recolouring the label as well would make
           * the unselected cycles read as disabled rather than as available.
           */
          borderRadius: `${radiusToken.round}px`,
          border: 'none',
          backgroundColor: selected ? color.main.white : 'transparent',
          color: color.navbar.text,
          cursor: 'pointer',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
        {...rest}
      >
        {children}
        {saving != null && (
          <span
            style={{
              ...textStyle.sRegular,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              padding: `${paywall.switch.savingPaddingY}px ${paywall.switch.savingPaddingX}px`,
              borderRadius: `${radiusToken.round}px`,
              backgroundColor: color.badge.foreground,
              color: color.main.white,
              fontSize: paywall.switch.savingFontSize,
            }}
          >
            {saving}
          </span>
        )}
      </button>
    );
  },
);

/** Per-instance overrides for the switch's own metrics. */
export type SubscriptionSwitchStyleProps = {
  padding?: CssLength;
  radius?: CssLength;
  /** The track's fill. */
  background?: string;
};

export type SubscriptionSwitchProps = {
  /** The segments — `PaywallSwitchButton`s. */
  children: ReactNode;
} & SubscriptionSwitchStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * The billing-cycle switch above the plan cards.
 *
 * Figma: node 977:11153.
 *
 * Takes its segments as children rather than a list of cycles: Figma's
 * component carries Quarterly and Semi-annual hidden beside Monthly and
 * Annual, so which cycles exist is a product decision and the switch's job is
 * only to draw a track around them.
 */
export const SubscriptionSwitch = forwardRef<HTMLDivElement, SubscriptionSwitchProps>(
  function SubscriptionSwitch({ children, padding, radius, background, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="group"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: len(padding) ?? `${paywall.switch.padding}px`,
          borderRadius: len(radius) ?? `${paywall.switch.radius}px`,
          backgroundColor: background ?? color.navbar.border,
        }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
