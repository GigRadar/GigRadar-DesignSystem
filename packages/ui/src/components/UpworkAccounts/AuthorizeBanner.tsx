import { color, component, radius as radiusToken, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconGoToExternal } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';

const { upworkAccounts } = component;

/** Per-instance overrides for the banner's own metrics. */
export type AuthorizeBannerStyleProps = {
  /** Corner radius. */
  radius?: CssLength;
  /** Padding on all sides. */
  padding?: CssLength;
  /** Border thickness. */
  borderWidth?: CssLength;
  /** Space between the title, the description, and the action. */
  gap?: CssLength;
  /** Fill. Replaces the drawn gradient wash. */
  background?: string;
  /** Border color. */
  borderColor?: string;
  /** Title color. */
  titleColor?: string;
  /** Description color. */
  textColor?: string;
};

/** What the action slot gets when a caller replaces it. */
export type AuthorizeBannerActionRenderProps = WithDefaultRender & {
  disabled: boolean;
};

export type AuthorizeBannerProps = {
  /** The heading. Figma draws "Connect Upwork Account". */
  title?: ReactNode;
  /** The line under it. */
  description?: ReactNode;
  /** The action's label. */
  actionLabel?: ReactNode;
  /** Called when the authorize button is pressed. */
  onAuthorize?: () => void;
  /**
   * Greys the action out. The design's default in the "API Not Connected"
   * state — there is nothing to authorize against until the API is connected.
   */
  disabled?: boolean;
  /**
   * Replaces the action. Call `defaultRender()` to decorate rather than
   * replace — a banner that needs a second button beside the first is the
   * common case.
   */
  renderAction?: RenderProp<AuthorizeBannerActionRenderProps>;
} & AuthorizeBannerStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * The card at the top of the right column — Figma's "Authorize Banner"
 * (node 2130:2521).
 *
 * A title, a line of explanation, and the authorize action, on a blue gradient
 * wash. The wash is what separates it from the plain white notice below it:
 * the two cards sit in the same column at the same width, and only the fill
 * says which one is the thing to act on.
 */
export const AuthorizeBanner = forwardRef<HTMLDivElement, AuthorizeBannerProps>(
  function AuthorizeBanner(
    {
      title = 'Connect Upwork Account',
      description = 'Click below to authorize and connect your Upwork account securely via OAuth 2.0',
      actionLabel = 'Authorize Account',
      onAuthorize,
      disabled = false,
      renderAction,
      radius,
      padding,
      borderWidth,
      gap,
      background,
      borderColor,
      titleColor,
      textColor,
      ...rest
    },
    ref,
  ) {
    const { banner } = upworkAccounts;

    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: len(gap) ?? `${banner.gap}px`,
      width: '100%',
      padding: len(padding) ?? `${banner.padding}px`,
      borderRadius: len(radius) ?? `${banner.radius}px`,
      border: `${len(borderWidth) ?? `${banner.borderWidth}px`} solid ${
        borderColor ?? banner.borderColor
      }`,
      // The wash is painted over white rather than straight onto the page, so
      // the card keeps its own surface wherever it is placed — the gradient's
      // low alpha would otherwise pick up whatever sits behind it.
      background:
        background ??
        `linear-gradient(180deg, ${banner.gradientFrom} 0%, ${banner.gradientTo} 100%), ${color.main.white}`,
      fontFamily: typography.fontFamily.base,
    };

    /*
      The design system button, drawn as Figma draws it here (node 2130:2496):
      a full-width pill at a 12px radius with 12px of vertical padding. Those
      three are the only divergence from the `large` step, so they are passed
      through rather than the button being rebuilt.
    */
    const defaultAction = () => (
      <Button
        size="large"
        fullWidth
        disabled={disabled}
        onClick={onAuthorize}
        radius={radiusToken.m}
        fontSize={typography.fontSize.m}
        endIcon={<Icon icon={IconGoToExternal} size={12.5} />}
      >
        {actionLabel}
      </Button>
    );

    return (
      <div {...rest} ref={ref} style={style}>
        <span
          style={{
            ...typography.textStyle.lSemibold,
            color: titleColor ?? color.navbar.textActive,
          }}
        >
          {title}
        </span>
        <span
          style={{
            ...typography.textStyle.mRegular,
            color: textColor ?? color.main.description,
          }}
        >
          {description}
        </span>
        {renderAction
          ? renderAction({ disabled, defaultRender: defaultAction })
          : defaultAction()}
      </div>
    );
  },
);
