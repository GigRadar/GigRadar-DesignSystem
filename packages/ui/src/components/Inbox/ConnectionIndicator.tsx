import { borderWidth, color, component, shadow, textStyle } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { len, type CssLength } from '../../internal/length.js';

const { inbox } = component;
const { connection } = inbox;

/**
 * What the socket is doing.
 *
 * Four states rather than a boolean because "not receiving messages" has three
 * different meanings to the person reading it: `offline` is expected (they are
 * disconnected), `error` is not (the connection broke), and `syncing` is
 * temporary (it is coming back on its own). Only `error` asks for action.
 */
export type ConnectionState = 'online' | 'offline' | 'error' | 'syncing';

/** Per-instance overrides for the indicator's own metrics. */
export type ConnectionIndicatorStyleProps = {
  /** Corner radius. The default draws a pill. */
  radius?: CssLength;
  paddingX?: CssLength;
  paddingY?: CssLength;
  /** Space between the label and the signal glyph. */
  gap?: CssLength;
  /** Fill. */
  background?: string;
  /** The label's color. Defaults to the state's own. */
  textColor?: string;
  /** The signal bars' color. Defaults to the state's own. */
  signalColor?: string;
  /** Elevation, as a CSS `box-shadow`. */
  shadow?: string;
};

export type ConnectionIndicatorProps = {
  /**
   * Which state to draw.
   * @default 'online'
   */
  state?: ConnectionState;
  /** Overrides the label. Defaults to the state's own name. */
  label?: string;
} & ConnectionIndicatorStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style'>;

/** Label and color per state, as Figma draws them. */
const states: Record<ConnectionState, { label: string; tone: string }> = {
  online: { label: 'Online', tone: color.status.success.main },
  offline: { label: 'Offline', tone: color.navbar.text2 },
  error: { label: 'Error', tone: color.status.error.main },
  syncing: { label: 'Syncing', tone: color.badge.foreground },
};

/**
 * The signal glyph — three bars rising left to right.
 *
 * Exported because the account rows in the inbox dropdown draw it on its own,
 * without the pill around it. Figma files it as its own component (node
 * 2727:4848) for the same reason.
 */
export type SignalIconProps = {
  /**
   * Which state to draw. `syncing` has no bars of its own in Figma — the pill
   * swaps in a spinner — so it falls back to the offline gray here.
   * @default 'online'
   */
  state?: ConnectionState;
  /** Overrides the bars' color. */
  color?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, 'className' | 'style' | 'color'>;

export const SignalIcon = forwardRef<HTMLSpanElement, SignalIconProps>(function SignalIcon(
  { state = 'online', color: tone, ...rest },
  ref,
) {
  // Offline is the only state that grays the bars rather than tinting them:
  // the others are all reporting something, and gray reads as "nothing to
  // report" against the white pill.
  const fill =
    tone ??
    (state === 'online'
      ? color.status.success.main
      : state === 'error'
        ? color.status.error.main
        : color.main.border);

  const bar: CSSProperties = {
    width: connection.barWidth,
    borderRadius: connection.barRadius,
    backgroundColor: fill,
  };

  return (
    <span
      ref={ref}
      aria-hidden
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: connection.barGap,
        height: connection.height,
      }}
      {...rest}
    >
      <span style={{ ...bar, height: connection.barWidth }} />
      <span style={{ ...bar, height: connection.height * connection.midBarRatio }} />
      <span style={{ ...bar, height: connection.height }} />
      {/* The error state strikes the bars through, so a red signal cannot be
          mistaken for a strong one at a glance. */}
      {state === 'error' && (
        <span
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: connection.strikeWidth,
            height: connection.strikeHeight,
            backgroundColor: fill,
            border: `${borderWidth.thin}px solid ${color.main.white}`,
            borderRadius: connection.barRadius,
            transform: `translate(-50%, -50%) rotate(${connection.strikeAngle})`,
          }}
        />
      )}
    </span>
  );
});

/**
 * The websocket indicator — whether the inbox is receiving messages live.
 *
 * Figma: node 2694:21065, floating at the foot of the room list.
 *
 * Drawn as a floating pill rather than a line in the header because it reports
 * a condition that changes on its own, without the person doing anything. It
 * sits where it will be noticed on a glance down the list and nowhere near the
 * controls, so it never reads as something to click.
 */
export const ConnectionIndicator = forwardRef<HTMLDivElement, ConnectionIndicatorProps>(
  function ConnectionIndicator(
    {
      state = 'online',
      label,
      radius,
      paddingX,
      paddingY,
      gap,
      background,
      textColor,
      signalColor,
      shadow: shadowOverride,
      ...rest
    },
    ref,
  ) {
    const { label: defaultLabel, tone } = states[state];

    return (
      <div
        ref={ref}
        role="status"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          gap: len(gap) ?? connection.gap,
          paddingLeft: len(paddingX) ?? connection.paddingX,
          paddingRight: len(paddingX) ?? connection.paddingX,
          paddingTop: len(paddingY) ?? connection.paddingY,
          paddingBottom: len(paddingY) ?? connection.paddingY,
          borderRadius: len(radius) ?? connection.radius,
          backgroundColor: background ?? color.main.white,
          boxShadow: shadowOverride ?? shadow.base,
        }}
        {...rest}
      >
        <span style={{ ...textStyle.mMedium, color: textColor ?? tone }}>
          {label ?? defaultLabel}
        </span>
        {/* Syncing shows a spinning ring instead of bars: the bars report a
            level, and during a reconnect there is no level to report yet. */}
        {state === 'syncing' ? (
          <SyncingRing color={signalColor ?? tone} />
        ) : (
          <SignalIcon state={state} color={signalColor} />
        )}
      </div>
    );
  },
);

/** The spinner shown while reconnecting — a ring with one quarter cut away. */
function SyncingRing({ color: tone }: { color: string }) {
  return (
    <span
      aria-hidden
      style={{
        width: connection.height,
        height: connection.height,
        borderRadius: '50%',
        border: `${connection.spinnerWidth}px solid ${tone}`,
        borderTopColor: 'transparent',
        animation: `gr-connection-spin ${connection.spinnerDuration} linear infinite`,
      }}
    >
      <style>
        {'@keyframes gr-connection-spin { to { transform: rotate(360deg); } }'}
      </style>
    </span>
  );
}
