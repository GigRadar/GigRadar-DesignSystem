import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconKeyCrossFill, type IconDef } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';

const { rentBanner } = component.upworkApiKey;

/** Per-instance overrides for the banner's own metrics. */
export type RentApiBannerStyleProps = {
  /** Padding. */
  padding?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Space between the tile, the copy, and the action. */
  gap?: CssLength;
  /** Edge color. */
  borderColor?: string;
  /** The gradient's top stop. */
  gradientFrom?: string;
  /** The gradient's bottom stop. */
  gradientTo?: string;
  /** The key tile's fill. */
  tileBackground?: string;
};

/** What the action gets when a caller replaces it. */
export type RentApiBannerActionRenderProps = WithDefaultRender & {
  label: ReactNode;
};

export type RentApiBannerProps = {
  /** The banner's headline. */
  title?: ReactNode;
  /** The line under it. */
  description?: ReactNode;
  /** The action's label. */
  actionLabel?: ReactNode;
  /** Called when the action is pressed. */
  onAction?: () => void;
  /** The glyph on the tile. */
  icon?: IconDef;
  /** Replaces the action. Call `defaultRender()` to decorate it. */
  renderAction?: RenderProp<RentApiBannerActionRenderProps>;
} & RentApiBannerStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * The rented-key offer under the credential form — Figma's "Rent API Banner"
 * (node 2112:1174).
 *
 * A gradient-washed card rather than a plain one: it is an upsell sitting
 * below a form the user may not be able to complete, and the wash is what
 * separates an offer from the form's own instructions without shouting.
 *
 * The action is the design system `Button` — unlike the remove strip, this one
 * agrees with Button on every metric that matters, so it is the button.
 */
export const RentApiBanner = forwardRef<HTMLDivElement, RentApiBannerProps>(
  function RentApiBanner(
    {
      title = "Don't have an API key?",
      description = 'No problem! We rent API keys starting $200/month',
      actionLabel = 'Rent API Key',
      onAction,
      icon = IconKeyCrossFill,
      renderAction,
      padding,
      radius,
      gap,
      borderColor,
      gradientFrom,
      gradientTo,
      tileBackground,
      ...rest
    },
    ref,
  ) {
    const style: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      boxSizing: 'border-box',
      width: '100%',
      gap: len(gap) ?? `${rentBanner.gap}px`,
      padding: len(padding) ?? `${rentBanner.padding}px`,
      borderRadius: len(radius) ?? `${rentBanner.radius}px`,
      border: `${rentBanner.borderWidth}px solid ${borderColor ?? rentBanner.borderColor}`,
      // Figma draws the wash at 173°, near-vertical — the tint deepens down
      // the card rather than across it.
      backgroundImage: `linear-gradient(173deg, ${gradientFrom ?? rentBanner.gradientFrom} 0%, ${
        gradientTo ?? rentBanner.gradientTo
      } 100%)`,
    };

    const defaultAction = () => (
      <Button variant="primary" size="medium" onClick={onAction}>
        {actionLabel}
      </Button>
    );

    return (
      <div {...rest} ref={ref} style={style}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: rentBanner.tileSize,
            height: rentBanner.tileSize,
            borderRadius: `${rentBanner.tileRadius}px`,
            backgroundColor: tileBackground ?? color.main.brand,
            color: color.main.white,
          }}
        >
          <Icon icon={icon} size={rentBanner.tileIconSize} />
        </span>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 auto',
            minWidth: 0,
            gap: `${rentBanner.titleGap}px`,
          }}
        >
          <span
            style={{
              color: color.navbar.text2,
              fontFamily: typography.fontFamily.base,
              fontSize: `${rentBanner.titleFontSize}px`,
              fontWeight: typography.fontWeight.semibold,
              letterSpacing: typography.letterSpacing.l,
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>
          <span
            style={{
              color: color.main.description,
              fontFamily: typography.fontFamily.base,
              fontSize: `${rentBanner.bodyFontSize}px`,
              fontWeight: typography.fontWeight.regular,
              letterSpacing: typography.letterSpacing.m,
              lineHeight: 1.4,
            }}
          >
            {description}
          </span>
        </div>

        {renderAction
          ? renderAction({ label: actionLabel, defaultRender: defaultAction })
          : defaultAction()}
      </div>
    );
  },
);
