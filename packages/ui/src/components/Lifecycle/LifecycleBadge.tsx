import { color, component, typography, type BadgeSize } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { statusBadge } = component;

/**
 * How far along a component is.
 *
 * Three stages, because a component is always in exactly one of three
 * situations: it is in the design system, it is on its way in, or it is on its
 * way out.
 *
 *   `stable`      in the system. Safe to use; changes to it are additive.
 *   `development` drawn and built, but not approved. Visible in the gallery so
 *                 it can be reviewed, and marked so nobody ships it by mistake.
 *   `deprecated`  still works, but is being removed. Use the replacement.
 *
 * Distinct from `StatusBadge`, which reports the state of an Upwork account.
 * That one is product UI a customer sees; this is the design system talking
 * about itself, and the two would otherwise fight over the same name.
 */
export type ComponentLifecycle = 'stable' | 'development' | 'deprecated';

export type LifecycleBadgeStyleProps = {
  paddingX?: CssLength;
  paddingY?: CssLength;
  fontSize?: CssLength;
  gap?: CssLength;
  radius?: CssLength;
  borderWidth?: CssLength;
  /** Dot diameter. */
  dotSize?: CssLength;
  background?: string;
  textColor?: string;
  borderColor?: string;
};

export type LifecycleBadgeProps = {
  /**
   * Which stage the component is at.
   *
   * @default 'development'
   */
  stage?: ComponentLifecycle;
  size?: BadgeSize;
  /** Overrides the label. Each stage supplies one. */
  children?: ReactNode;
  /**
   * Draws a leading dot.
   *
   * On by default for `development`, because that is the stage a reader must
   * not skim past — the dot is what catches the eye in a column of section
   * headings that are otherwise all text.
   */
  dot?: boolean;
} & LifecycleBadgeStyleProps &
  Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style'>;

/** The label and palette each stage carries. */
const stages: Record<
  ComponentLifecycle,
  { label: string; main: string; tint: string; text: string }
> = {
  stable: {
    label: 'Stable',
    main: color.status.success.main,
    tint: color.status.success.background,
    text: color.status.success.text,
  },
  development: {
    label: 'In development',
    main: color.accent.laziza.main,
    tint: color.accent.laziza.background,
    text: color.status.warning.textStrong,
  },
  deprecated: {
    label: 'Deprecated',
    main: color.disable.backgroundAlt,
    tint: color.disable.background,
    text: color.disable.text,
  },
};

/**
 * Marks how far along a component is.
 *
 * The design system's own chrome rather than product UI: it appears in the
 * gallery and its sidebar, never in an app. It exists because a component can
 * be visible in the gallery long before it is approved — the Upwork
 * authorization popup is the case that prompted it — and a reader with no way
 * to tell the difference will use whatever they can see.
 *
 * The lifecycle it marks: a component is drawn, built, and shown here as
 * `development`; it goes to a pull request for review; when that PR is approved
 * and merged, the marker comes off and it is part of the system.
 */
export const LifecycleBadge = forwardRef<HTMLSpanElement, LifecycleBadgeProps>(
  function LifecycleBadge(
    {
      stage = 'development',
      size = 'medium',
      children,
      dot,
      paddingX,
      paddingY,
      fontSize,
      gap,
      radius,
      borderWidth,
      dotSize,
      background,
      textColor,
      borderColor,
      ...rest
    },
    ref,
  ) {
    const spec = stages[stage];
    const showDot = dot ?? stage === 'development';

    // One drawing: a tinted fill with the stage's own text on it. This is the
    // system's own chrome rather than a product component, so it has no
    // variants — a marker that could be drawn three ways is three markers, and
    // a reader would have to learn which is which before reading any of them.
    const palette = { background: spec.tint, text: spec.text, border: spec.main };

    const style: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      gap: len(gap) ?? `${statusBadge.gap[size]}px`,
      padding: `${len(paddingY) ?? `${statusBadge.paddingY[size]}px`} ${
        len(paddingX) ?? `${statusBadge.paddingX[size]}px`
      }`,
      borderRadius: len(radius) ?? `${statusBadge.radius}px`,
      borderWidth: len(borderWidth) ?? `${statusBadge.borderWidth}px`,
      borderStyle: 'solid',
      backgroundColor: background ?? palette.background,
      color: textColor ?? palette.text,
      borderColor: borderColor ?? palette.border,
      fontFamily: typography.fontFamily.base,
      fontSize: len(fontSize) ?? `${statusBadge.fontSize[size]}px`,
      fontWeight: typography.fontWeight.medium,
      letterSpacing: typography.letterSpacing.s,
      lineHeight: 1,
      whiteSpace: 'nowrap',
    };

    return (
      <span {...rest} ref={ref} style={style}>
        {showDot && (
          <span
            aria-hidden
            style={{
              width: len(dotSize) ?? `${statusBadge.dotSize[size]}px`,
              height: len(dotSize) ?? `${statusBadge.dotSize[size]}px`,
              borderRadius: '9999px',
              // On the filled variant the dot has to read against the fill, so
              // it borrows the label's color rather than the stage's.
              backgroundColor: spec.main,
              flexShrink: 0,
            }}
          />
        )}
        {children ?? spec.label}
      </span>
    );
  },
);
