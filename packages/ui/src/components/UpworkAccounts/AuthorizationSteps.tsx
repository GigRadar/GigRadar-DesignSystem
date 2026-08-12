import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';

const { upworkAccounts } = component;

/** Per-instance overrides for the list's own metrics. */
export type AuthorizationStepsStyleProps = {
  /** The numbered disc's diameter. */
  markerSize?: CssLength;
  /** Space between a disc and its label. */
  gap?: CssLength;
  /** Space between steps. */
  rowGap?: CssLength;
  /** Space between the heading and the first step. */
  titleGap?: CssLength;
  /** Label type size. */
  fontSize?: CssLength;
  /** The disc's fill. */
  markerBackground?: string;
  /** The number's color. */
  markerTextColor?: string;
  /** Label color. */
  textColor?: string;
  /** Heading color. */
  titleColor?: string;
};

/** What a step gets when a caller replaces it. */
export type AuthorizationStepRenderProps = WithDefaultRender & {
  step: ReactNode;
  index: number;
  number: number;
};

export type AuthorizationStepsProps = {
  /** The heading above the list. Pass `null` to drop it. */
  title?: ReactNode;
  /** The steps, in order. Numbering is derived from position. */
  steps?: ReactNode[];
  /**
   * Wraps each row in its own white card — how the confirmation popup draws
   * the same list, against the bare rows the settings column draws.
   */
  boxed?: boolean;
  /** Replaces a step. Call `defaultRender()` to decorate rather than replace. */
  renderStep?: RenderProp<AuthorizationStepRenderProps>;
} & AuthorizationStepsStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

const DEFAULT_STEPS = [
  'Click "Authorize Account" button',
  'Login to your Upwork account',
  'Grant access permissions',
  'Return here automatically',
];

/**
 * The numbered authorization walkthrough — Figma node 2116:3340 in the
 * settings column, and the same rows inside the confirmation popup's panel
 * (node 2119:13580).
 *
 * One component for both because they are the same list: a 24px numbered disc
 * and a 12px label. The popup draws each row on a white card and recolors the
 * discs to match its state, which is what `boxed` and `markerBackground` are
 * for — everything else about the two is identical.
 */
export const AuthorizationSteps = forwardRef<HTMLDivElement, AuthorizationStepsProps>(
  function AuthorizationSteps(
    {
      title = 'Authorization Steps',
      steps = DEFAULT_STEPS,
      boxed = false,
      renderStep,
      markerSize,
      gap,
      rowGap,
      titleGap,
      fontSize,
      markerBackground,
      markerTextColor,
      textColor,
      titleColor,
      ...rest
    },
    ref,
  ) {
    const { step } = upworkAccounts;

    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: len(titleGap) ?? `${step.titleGap}px`,
      width: '100%',
      fontFamily: typography.fontFamily.base,
    };

    const renderDefault = (item: ReactNode, index: number) => (
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: len(gap) ?? `${step.gap}px`,
          width: '100%',
          ...(boxed
            ? {
                padding: upworkAccounts.popup.rowPadding,
                borderRadius: upworkAccounts.popup.rowRadius,
                backgroundColor: color.main.white,
              }
            : null),
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            width: len(markerSize) ?? step.size,
            height: len(markerSize) ?? step.size,
            borderRadius: '50%',
            backgroundColor: markerBackground ?? color.main.brand,
            color: markerTextColor ?? color.main.white,
            fontSize: step.fontSize,
            fontWeight: typography.fontWeight.semibold,
            lineHeight: 1,
          }}
        >
          {index + 1}
        </span>
        <span
          style={{
            ...(boxed ? typography.textStyle.mMedium : typography.textStyle.sMedium),
            fontSize: len(fontSize) ?? (boxed ? undefined : step.labelFontSize),
            color: textColor ?? color.navbar.textActive,
            flex: '1 1 auto',
            minWidth: 0,
          }}
        >
          {item}
        </span>
      </div>
    );

    return (
      <div {...rest} ref={ref} style={style}>
        {title != null && (
          <span
            style={{
              ...typography.textStyle.mMedium,
              color: titleColor ?? color.navbar.textActive,
            }}
          >
            {title}
          </span>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: len(rowGap) ?? `${boxed ? upworkAccounts.popup.rowGap : step.rowGap}px`,
            width: '100%',
          }}
        >
          {steps.map((item, index) => (
            <div key={index} style={{ width: '100%' }}>
              {renderStep
                ? renderStep({
                    step: item,
                    index,
                    number: index + 1,
                    defaultRender: () => renderDefault(item, index),
                  })
                : renderDefault(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
