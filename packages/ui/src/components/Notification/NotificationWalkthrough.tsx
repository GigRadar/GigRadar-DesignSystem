import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { NotificationStep, type NotificationStepState } from './NotificationStep.js';

const { notification } = component;

/** One step of a channel's connection flow, described as data. */
export type WalkthroughStep = {
  /** The step's heading — "Verify connection". */
  title: ReactNode;
  /**
   * The line under the heading, drawn only while this step is the active one.
   * A step that is done or not yet reached shows its title alone.
   */
  description?: ReactNode;
  /** The step's actions and any fields, drawn only while it is active. */
  content?: ReactNode;
};

/** What a `renderStep` function receives — one row of the walkthrough. */
export type WalkthroughStepRenderProps = WithDefaultRender & {
  /** The step being drawn, as declared. */
  step: WalkthroughStep;
  /** Its position in the list, from zero. */
  index: number;
  /** Its number as drawn in the disc, from one. */
  number: number;
  /** How far along this step is. */
  state: NotificationStepState;
};

/** Per-instance overrides for the walkthrough's own metrics. */
export type NotificationWalkthroughStyleProps = {
  /** The color the active step and its rail are drawn in. */
  accentColor?: string;
  /** An active step's heading color. */
  titleColor?: string;
  /** Body and inactive-title color. */
  textColor?: string;
  /** Heading type size. */
  fontSize?: CssLength;
};

export type NotificationWalkthroughProps = {
  /** The steps, in order. Numbering follows position. */
  steps: WalkthroughStep[];
  /**
   * Which step is being worked on, from zero. Steps before it are complete,
   * steps after it are pending.
   *
   * Pass `steps.length` to draw every step complete — the state a flow is in
   * on the tick before the card swaps to its connected settings.
   *
   * @default 0
   */
  current?: number;
  /** Replaces a step. Call `defaultRender()` to decorate rather than replace. */
  renderStep?: RenderProp<WalkthroughStepRenderProps>;
} & NotificationWalkthroughStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * A channel's connection walkthrough — the body of a notification card while
 * it is being connected.
 *
 * Figma draws one of these per channel (Slack 4102:98, Telegram 4101:28455,
 * browser 4102:439) and they are the same list holding different copy: the
 * same numbered discs, the same rail, the same "expanded step carries buttons,
 * the others carry only a title" rule. So the flows are data passed to one
 * component rather than three components that would drift apart.
 *
 * Only the active step shows its description and actions. That is what keeps a
 * three-step flow readable — the steps behind are a checklist of what is done,
 * the steps ahead are a promise of what is left, and exactly one of them is
 * asking for anything.
 */
export const NotificationWalkthrough = forwardRef<HTMLDivElement, NotificationWalkthroughProps>(
  function NotificationWalkthrough(
    { steps, current = 0, renderStep, accentColor, titleColor, textColor, fontSize, ...rest },
    ref,
  ) {
    const { step } = notification;
    // Falls back to the card's own channel tint, which `NotificationCard`
    // publishes on the body — so a walkthrough dropped into a Slack card comes
    // out Slack-colored without being told which channel it is in.
    const accent = accentColor ?? 'var(--gr-notification-accent, currentColor)';

    const style: CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: '100%',
      fontFamily: typography.fontFamily.base,
    };

    const stateOf = (index: number): NotificationStepState =>
      index < current ? 'complete' : index === current ? 'active' : 'pending';

    const renderDefault = (item: WalkthroughStep, index: number) => {
      const state = stateOf(index);
      const isActive = state === 'active';

      return (
        <NotificationStep
          number={index + 1}
          state={state}
          accentColor={accent}
          // The last step has nothing to connect down to, so its rail would be
          // a line trailing into the card's padding.
          connector={index < steps.length - 1}
        >
          <span
            style={{
              ...(isActive ? typography.textStyle.mMedium : typography.textStyle.mRegular),
              fontSize: len(fontSize) ?? `${step.titleFontSize}px`,
              color: isActive ? (titleColor ?? color.navbar.text2) : (textColor ?? color.navbar.text),
            }}
          >
            {item.title}
          </span>
          {isActive && item.description != null && (
            <span
              style={{
                ...typography.textStyle.sRegular,
                fontSize: `${step.bodyFontSize}px`,
                color: textColor ?? color.navbar.text,
                width: '100%',
              }}
            >
              {item.description}
            </span>
          )}
          {isActive && item.content}
          {/* Only an expanded step needs breathing room under it; a collapsed
              one is a single line and the rail supplies its own spacing. */}
          {isActive && (item.description != null || item.content != null) && (
            <span aria-hidden style={{ height: `${step.contentPaddingBottom}px` }} />
          )}
        </NotificationStep>
      );
    };

    return (
      <div {...rest} ref={ref} style={style}>
        {steps.map((item, index) => (
          <div key={index} style={{ width: '100%' }}>
            {renderStep
              ? renderStep({
                  step: item,
                  index,
                  number: index + 1,
                  state: stateOf(index),
                  defaultRender: () => renderDefault(item, index),
                })
              : renderDefault(item, index)}
          </div>
        ))}
      </div>
    );
  },
);

/** Per-instance overrides for the settings block's own metrics. */
export type NotificationSettingsStyleProps = {
  /** Corner radius. */
  radius?: CssLength;
  /** Padding inside each card. */
  padding?: CssLength;
  /** Space between the two cards. */
  gap?: CssLength;
  /** Border color. */
  borderColor?: string;
  /** Heading color. */
  titleColor?: string;
};

export type NotificationSettingsGroupProps = {
  /** The card's heading — "Notify me about", "When to notify". */
  title: ReactNode;
  /** The option rows. */
  children?: ReactNode;
} & NotificationSettingsStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/**
 * One of the two option cards a connected channel draws — Figma's "Notify me
 * about" and "When to notify" panels.
 *
 * A titled box holding a stack of option rows. It does not own the rows: the
 * two cards hold different controls — one is a multi-select, the other a radio
 * group — so what goes inside is the caller's, and only the box is shared.
 */
export const NotificationSettingsGroup = forwardRef<HTMLDivElement, NotificationSettingsGroupProps>(
  function NotificationSettingsGroup(
    { title, children, radius, padding, gap, borderColor, titleColor, ...rest },
    ref,
  ) {
    const { settings } = notification;

    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: len(gap) ?? `${settings.titleGap}px`,
      flex: '1 1 0',
      minWidth: 0,
      padding: len(padding) ?? `${settings.padding}px`,
      borderRadius: len(radius) ?? `${settings.radius}px`,
      border: `${settings.borderWidth}px solid ${borderColor ?? color.navbar.hover}`,
      backgroundColor: color.main.white,
      fontFamily: typography.fontFamily.base,
    };

    return (
      <div {...rest} ref={ref} style={style}>
        <span
          style={{
            ...typography.textStyle.mMedium,
            fontSize: `${settings.titleFontSize}px`,
            color: titleColor ?? color.main.black,
          }}
        >
          {title}
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: `${settings.optionGap}px`,
            width: '100%',
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);
