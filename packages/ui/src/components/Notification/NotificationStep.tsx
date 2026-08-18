import { borderWidth, color, component, radius as radiusToken, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import { IconCheck } from '../../icons/defs.js';

const { notification } = component;

/**
 * How far along one step of a connection walkthrough is.
 *
 * Three states, and the walkthrough is always exactly one of them per step:
 *
 *   `complete` done. Green disc with a tick, and a green rail carrying that
 *              completion down to the next step.
 *   `active`   the step being worked on. The channel's own color, so the card
 *              reads as belonging to Slack or Telegram rather than to a generic
 *              flow.
 *   `pending`  not reached yet. A hollow disc showing its number.
 */
export type NotificationStepState = 'complete' | 'active' | 'pending';

/** Per-instance overrides for the step's own metrics. */
export type NotificationStepStyleProps = {
  /** The numbered disc's diameter. */
  markerSize?: CssLength;
  /** The connector rail's thickness. */
  railWidth?: CssLength;
  /** Space between the disc column and the step's content. */
  gap?: CssLength;
  /** The number's type size. */
  fontSize?: CssLength;
  /**
   * The color an `active` step is drawn in. Defaults to the brand blue; the
   * notification cards pass their channel's own color.
   */
  accentColor?: string;
  /** The disc's fill. Overrides whatever the state supplies. */
  markerBackground?: string;
  /** The number's color. */
  markerTextColor?: string;
  /** The rail's color. */
  railColor?: string;
};

export type NotificationStepProps = {
  /** The step's position in the walkthrough, drawn inside the disc. */
  number: number;
  /**
   * How far along this step is.
   *
   * @default 'pending'
   */
  state?: NotificationStepState;
  /**
   * Draws the rail below the disc, connecting to the step under this one.
   *
   * On by default; pass `false` on the last step, which has nothing to connect
   * to. The rail stretches to whatever height the content beside it takes, so
   * an expanded step's rail grows with it.
   */
  connector?: boolean;
  /** The step's heading, body, and any actions. */
  children?: ReactNode;
} & NotificationStepStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/**
 * One step of a channel's connection walkthrough — Figma node 4101:28443.
 *
 * A numbered disc with a rail running from it to the step below, and the
 * step's content beside them. The rail is inside this component rather than
 * drawn by the list because it has to start at this disc and stretch to the
 * next one — the list above has no way to know how tall an expanded step's
 * content grew to.
 *
 * A complete step turns green and carries that color down its rail, so a
 * glance at the rail alone says how far the flow has got. An active step takes
 * the channel's color instead, which is what ties the walkthrough to the card
 * it sits in.
 */
export const NotificationStep = forwardRef<HTMLDivElement, NotificationStepProps>(
  function NotificationStep(
    {
      number,
      state = 'pending',
      connector = true,
      children,
      markerSize,
      railWidth,
      gap,
      fontSize,
      accentColor,
      markerBackground,
      markerTextColor,
      railColor,
      ...rest
    },
    ref,
  ) {
    const { step } = notification;
    const accent = accentColor ?? color.main.brand;
    const isComplete = state === 'complete';
    const isPending = state === 'pending';

    // A pending step is the only hollow one — it is drawn as an outlined disc
    // on white so it reads as a slot waiting to be filled rather than a state.
    const discBackground =
      markerBackground ??
      (isComplete ? color.status.success.main : isPending ? color.main.white : accent);

    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'flex-start',
      gap: len(gap) ?? `${step.gap}px`,
      width: '100%',
      fontFamily: typography.fontFamily.base,
    };

    const disc = len(markerSize) ?? `${step.markerSize}px`;

    return (
      <div {...rest} ref={ref} style={style}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            alignSelf: 'stretch',
            flexShrink: 0,
            width: disc,
          }}
        >
          <span
            style={{
              boxSizing: 'border-box',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: disc,
              height: disc,
              borderRadius: `${radiusToken.round}px`,
              backgroundColor: discBackground,
              border: isPending ? `${borderWidth.thick}px solid ${color.navbar.hover}` : undefined,
              color: markerTextColor ?? (isPending ? color.navbar.text : color.main.white),
              fontSize: len(fontSize) ?? `${step.markerFontSize}px`,
              fontWeight: typography.fontWeight.semibold,
              letterSpacing: typography.letterSpacing.s,
              lineHeight: 1,
            }}
          >
            {isComplete ? <Icon icon={IconCheck} size={14} /> : number}
          </span>
          {connector && (
            <span
              aria-hidden
              style={{
                flex: '1 1 auto',
                // The rail must be able to shrink below its content height for
                // `flex: 1` to mean "fill what is left" rather than "at least
                // my own height" — without this the column stretches.
                minHeight: 0,
                width: len(railWidth) ?? `${step.railWidth}px`,
                margin: `${step.railInset}px 0`,
                borderRadius: `${step.railRadius}px`,
                backgroundColor:
                  railColor ?? (isComplete ? color.status.success.main : color.navbar.hover),
              }}
            />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: `${step.contentGap}px`,
            flex: '1 1 auto',
            minWidth: 0,
            // Keeps a collapsed step's label centred against its disc.
            minHeight: disc,
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      </div>
    );
  },
);
