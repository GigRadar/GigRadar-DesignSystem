import { color, component, radius as radiusToken, textStyle } from '@gigradar/theme';
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { paywall } = component;

/**
 * Which plan the card sells.
 *
 * A tone rather than three components: Basic, Pro and Unlimited are the same
 * card at the same width with the same rows, and what differs is the colour of
 * the edge, the bullets and the button. Three files would be three places to
 * fix the next time a row is added to all of them.
 */
export type PlanCardTone = 'basic' | 'pro' | 'unlimited';

/**
 * What the card is to this workspace.
 *
 * `current` is the plan already paid for — its button goes inert and says so.
 * `popular` is the one being pushed, which Figma draws only on Pro.
 */
export type PlanCardState = 'default' | 'popular' | 'current';

/** One line of the feature list. */
export type PlanFeature = {
  label: ReactNode;
  /**
   * Whether this plan includes it. Excluded rows stay on the card, greyed —
   * what a cheaper plan does *not* buy is the argument for the dearer one, and
   * dropping those rows would leave three cards of different heights saying
   * nothing about each other.
   * @default true
   */
  included?: boolean;
};

/** Per-instance overrides for the card's own metrics. */
export type PlanCardStyleProps = {
  width?: CssLength;
  padding?: CssLength;
  radius?: CssLength;
  borderWidth?: CssLength;
  gap?: CssLength;
  /** The edge, the bullets, and the button. Overrides the tone's. */
  accent?: string;
};

export type PlanCardProps = {
  /**
   * @default 'basic'
   */
  tone?: PlanCardTone;
  /**
   * @default 'default'
   */
  state?: PlanCardState;
  /** The plan's name — drawn in its own accent above the price. */
  name?: ReactNode;
  /** The price, as it should read — "$99". */
  price: ReactNode;
  /** The unit after it. Defaults to "/month,". */
  unit?: ReactNode;
  /** The line under the price. */
  note?: ReactNode;
  /** A struck-through price before the real one, when the cycle discounts it. */
  wasPrice?: ReactNode;
  /** The rows. */
  features?: PlanFeature[];
  /** The main button's label. Defaults to what the state means. */
  actionLabel?: ReactNode;
  /** Called when it is pressed. A `current` card's button does nothing. */
  onAction?: () => void;
  /** The second button — "Start free trial". Omit to drop it. */
  trialLabel?: ReactNode;
  /** Called when that one is pressed. */
  onTrial?: () => void;
  /** The pill straddling the top edge. Defaults to what the state means. */
  flag?: ReactNode;
} & PlanCardStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** The accent each plan is drawn in. */
const accents: Record<PlanCardTone, string> = {
  basic: color.badge.foreground,
  pro: color.accent.laziza.main,
  unlimited: color.main.ink,
};

/**
 * One plan on the paywall.
 *
 * Figma: Basic at 4062:1088, Pro at 4062:1158, Unlimited at 4062:1199.
 *
 * The card argues by comparison: every plan lists every feature, and the ones
 * it does not include stay on the card in grey. Three cards of the same height
 * with the same rows let the eye run across a row and see where the colour
 * stops, which is the whole point of putting them side by side.
 *
 * The accent is the plan's identity — the edge, the bullets and the button all
 * carry it, and so does the `PlanBadge` for the same plan, so a badge in the
 * header and a card in the modal can be matched without reading either.
 */
export const PlanCard = forwardRef<HTMLDivElement, PlanCardProps>(function PlanCard(
  {
    tone = 'basic',
    state = 'default',
    name,
    price,
    unit = '/month,',
    note,
    wasPrice,
    features = [],
    actionLabel,
    onAction,
    trialLabel,
    onTrial,
    flag,
    width,
    padding,
    radius,
    borderWidth,
    gap,
    accent,
    ...rest
  },
  ref,
) {
  const hue = accent ?? accents[tone];
  const current = state === 'current';
  const flagged = state !== 'default';
  const { card } = paywall;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxSizing: 'border-box',
        gap: len(gap) ?? `${card.gap}px`,
        width: len(width) ?? `${card.width}px`,
        padding: len(padding) ?? `${card.padding}px`,
        borderRadius: len(radius) ?? `${card.radius}px`,
        /*
         * The edge carries the plan's colour only when the card is being
         * argued for. A default card sits on the nav wash so the flagged one
         * beside it is the one the eye lands on.
         */
        border: `${len(borderWidth) ?? `${card.borderWidth}px`} solid ${
          flagged ? hue : color.navbar.hover
        }`,
        backgroundColor: color.main.white,
      }}
      {...rest}
    >
      {/* The pill straddling the top edge. */}
      {flagged && (
        <span
          style={{
            ...textStyle.sRegular,
            position: 'absolute',
            left: '50%',
            top: `${card.flagOffsetY}px`,
            transform: 'translateX(-50%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: `${card.flagPaddingY}px ${card.flagPaddingX}px`,
            borderRadius: `${card.flagRadius}px`,
            backgroundColor: hue,
            color: color.main.white,
            fontSize: card.flagFontSize,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          {flag ?? (current ? 'Current Plan' : 'Most popular')}
        </span>
      )}

      {/* The plan, its price, and the cycle it bills on. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: `${card.headGap}px`, width: '100%' }}>
        <span
          style={{
            ...textStyle.sRegular,
            fontSize: card.nameFontSize,
            fontWeight: 600,
            color: hue,
          }}
        >
          {name ?? tone}
        </span>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: `${card.priceGap}px` }}>
            {wasPrice != null && (
              <span
                style={{
                  fontSize: `${card.priceFontSize}px`,
                  fontWeight: 600,
                  color: color.navbar.hover,
                  textDecoration: 'line-through',
                }}
              >
                {wasPrice}
              </span>
            )}
            <span
              style={{
                fontSize: `${card.priceFontSize}px`,
                fontWeight: 600,
                color: color.main.black,
              }}
            >
              {price}
            </span>
            <span
              style={{
                ...textStyle.sRegular,
                fontSize: card.noteFontSize,
                color: color.main.description,
                opacity: 0.7,
              }}
            >
              {unit}
            </span>
          </div>
          {note != null && (
            <span
              style={{
                ...textStyle.sRegular,
                fontSize: card.noteFontSize,
                color: color.main.description,
                opacity: 0.7,
              }}
            >
              {note}
            </span>
          )}
        </div>
      </div>

      {/* The actions. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${card.buttonGap}px`,
          width: '100%',
        }}
      >
        {/*
         * Not the design system `Button`: these are fully round, full width,
         * and take the plan's own colour rather than a tone from the button's
         * table. Reaching for `Button` here would mean overriding its radius,
         * its fill and its width at every call site.
         */}
        <button
          type="button"
          disabled={current}
          onClick={current ? undefined : onAction}
          style={{
            ...textStyle.mMedium,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: `${card.buttonPaddingY}px ${card.buttonPaddingX}px`,
            borderRadius: `${radiusToken.round}px`,
            border: 'none',
            backgroundColor: current ? color.disable.background : hue,
            color: current ? color.disable.text : color.main.white,
            cursor: current ? 'default' : 'pointer',
          }}
        >
          {actionLabel ?? (current ? `${name ?? tone} plan` : `Choose ${name ?? tone} Plan`)}
        </button>

        {trialLabel != null && (
          <button
            type="button"
            onClick={onTrial}
            style={{
              ...textStyle.mMedium,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              padding: `${card.buttonPaddingY}px ${card.buttonPaddingX}px`,
              borderRadius: `${radiusToken.round}px`,
              border: 'none',
              backgroundColor: color.navbar.hover,
              color: color.navbar.text,
              cursor: 'pointer',
            }}
          >
            {trialLabel}
          </button>
        )}
      </div>

      {/* What the plan buys, and what it does not. */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${card.featureGap}px`,
          width: '100%',
        }}
      >
        {features.map((feature, index) => {
          const included = feature.included ?? true;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: `${card.featureGap}px`,
              }}
            >
              <span
                aria-hidden
                style={{
                  flexShrink: 0,
                  width: `${card.bulletSize}px`,
                  height: `${card.bulletSize}px`,
                  borderRadius: `${card.bulletRadius}px`,
                  backgroundColor: included ? hue : color.navbar.hover,
                }}
              />
              <span
                style={{
                  ...textStyle.sRegular,
                  fontSize: card.featureFontSize,
                  color: included ? color.main.inkSoft : color.navbar.hover,
                }}
              >
                {feature.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
