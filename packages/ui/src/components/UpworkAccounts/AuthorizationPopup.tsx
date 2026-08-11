import { color, component, typography } from '@gigradar/theme';
import { forwardRef, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { len, type CssLength } from '../../internal/length.js';
import { Icon } from '../../icons/Icon.js';
import {
  IconCheckmarkCircleFill,
  IconGoToExternal,
  IconXCirlceRoundFill,
  IconXClose,
} from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { IconButton } from '../Button/IconButton.js';
import { ModalFooter } from '../Modal/ModalBands.js';
import { Spinner } from '../Spinner/Spinner.js';
import { AuthorizationSteps } from './AuthorizationSteps.js';

const { upworkAccounts } = component;

/**
 * Where the authorization attempt has got to.
 *
 * `progress` is the only one the user cannot leave — the other two are
 * terminal and carry a countdown to auto-dismiss.
 */
export type AuthorizationState = 'progress' | 'success' | 'failed';

/** Per-instance overrides for the popup's own metrics. */
export type AuthorizationPopupStyleProps = {
  /** Card width. Figma draws 413px. */
  width?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Horizontal padding of the head band. */
  headPaddingX?: CssLength;
  /** Vertical padding of the head band. */
  headPaddingY?: CssLength;
  /** Space between the head's tile, title, and countdown. */
  headGap?: CssLength;
  /** Padding of the body below the head. */
  bodyPadding?: CssLength;
  /** Space between the status block and the panel under it. */
  bodyGap?: CssLength;
  /** Padding inside the panel of numbered rows. */
  panelPadding?: CssLength;
  /** Space between the panel's title and its rows. */
  panelGap?: CssLength;
  /** Fill. */
  background?: string;
  /** Drop shadow. */
  shadow?: string;
};

export type AuthorizationPopupProps = {
  /**
   * Which of the three states to draw.
   *
   * @default 'progress'
   */
  state?: AuthorizationState;
  /** Overrides the head's title. */
  title?: ReactNode;
  /** Overrides the head's subtitle. */
  subtitle?: ReactNode;
  /** Overrides the large centred heading. */
  heading?: ReactNode;
  /** Overrides the line under that heading. */
  description?: ReactNode;
  /** Overrides the panel's heading. */
  panelTitle?: ReactNode;
  /** Overrides the panel's numbered rows. */
  steps?: ReactNode[];
  /**
   * The auto-dismiss countdown, in seconds. Drawn in the head at 70% opacity.
   * Pass `null` to drop it.
   */
  countdown?: number | null;
  /**
   * Called when the close button is pressed. The button is only drawn in the
   * two terminal states — an authorization in progress cannot be dismissed
   * without leaving the attempt in an unknown state.
   */
  onClose?: () => void;
  /**
   * Called when the success state's primary action is pressed.
   *
   * BF-3969: a success screen that only lists what happened leaves the user to
   * find their own way out. Passing this draws the footer's action, which is
   * the one thing there is to do next — read the messages that just synced.
   */
  onGoToInbox?: () => void;
  /** Label for that action. */
  goToInboxLabel?: ReactNode;
  /**
   * Called when the failed state's retry action is pressed. Drawn only in that
   * state, for the same reason: a dead end with no route out of it is the
   * defect, not the copy.
   */
  onRetry?: () => void;
  /** Label for the retry action. */
  retryLabel?: ReactNode;
} & AuthorizationPopupStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/** Everything that differs between the three states, in one place. */
const states: Record<
  AuthorizationState,
  {
    accent: string;
    statusBackground: string;
    title: string;
    subtitle: string;
    heading: string;
    description: string;
    panelTitle: string;
    panelBackground: string;
    panelBorder: string;
    steps: string[];
  }
> = {
  progress: {
    accent: color.main.brand,
    statusBackground: 'transparent',
    title: 'Authorization in Progress',
    subtitle: 'Opening Upwork...',
    heading: 'Preparing authorization...',
    description: 'Please wait a moment',
    panelTitle: 'Important Reminders',
    panelBackground: color.main.background,
    panelBorder: color.navbar.disabledBackground,
    steps: [
      'Sign in to your Upwork account',
      'Review permissions carefully',
      'Complete the authorization flow',
      'Return to this window',
    ],
  },
  success: {
    accent: color.status.success.main,
    statusBackground: color.status.success.background,
    title: 'Authorization Successful',
    subtitle: 'Account connected successfully',
    heading: "All set! You're ready to go",
    description: 'Your Upwork account has been successfully connected',
    panelTitle: 'What Next ?',
    panelBackground: color.status.success.background,
    panelBorder: upworkAccounts.popup.tint.successBorder,
    /**
     * BF-3969. These four lines previously read "Sync your jobs and
     * contracts", "Manage proposals and messages", and "Track your earnings
     * and time" — none of which the CRM does. The screen was drawn early,
     * against a guess at the eventual product, and shipped as a promise.
     *
     * Replaced with what connecting an account actually enables today. Kept
     * to four rows so the panel's shape is unchanged; the fix is the copy, not
     * the layout.
     */
    steps: [
      'Your Upwork messages now sync to the Inbox',
      'Replies you send from GigRadar reach the client on Upwork',
      'Job invitations arrive here as they come in',
      'Connect another account any time from Settings',
    ],
  },
  failed: {
    accent: color.deprecated.errorAlt.main,
    statusBackground: upworkAccounts.popup.tint.failedSurface,
    title: 'Authorization Failed',
    subtitle: 'Unable to complete authorization',
    heading: 'Something went wrong',
    description: "We couldn't complete the authorization process",
    panelTitle: 'Possible Reason',
    panelBackground: upworkAccounts.popup.tint.failedSurface,
    panelBorder: upworkAccounts.popup.tint.failedBorder,
    steps: [
      'Authorization window was closed',
      'Permission denied',
      'Network connection issue',
      'Session timeout',
    ],
  },
};

/**
 * The authorization confirmation popup — Figma node 2119:14503, which draws
 * three states.
 *
 * The card itself, without a backdrop or any positioning. Wrap it in `Modal`
 * for the dimming, the portal, and the focus trap; a caller with its own
 * overlay can drop this straight into that instead.
 *
 * All three states are one layout — a head band, a centred status block, a
 * panel of four numbered rows, and a footer — differing only in accent color,
 * glyph, and copy. Holding those differences in a table rather than in
 * branches is what keeps that structural sameness visible.
 *
 * The head is this popup's own rather than `ModalHeader`: Figma draws it with
 * a status tile, a two-line title, and a countdown, where the shared header is
 * a single title and a close button. The footer IS `ModalFooter`, since that
 * band is identical to every other dialog's.
 */
export const AuthorizationPopup = forwardRef<HTMLDivElement, AuthorizationPopupProps>(
  function AuthorizationPopup(
    {
      state = 'progress',
      title,
      subtitle,
      heading,
      description,
      panelTitle,
      steps,
      countdown = 5,
      onClose,
      onGoToInbox,
      goToInboxLabel = 'Go To Inbox',
      onRetry,
      retryLabel = 'Try Again',
      width,
      radius,
      headPaddingX,
      headPaddingY,
      headGap,
      bodyPadding,
      bodyGap,
      panelPadding,
      panelGap,
      background,
      shadow,
      ...rest
    },
    ref,
  ) {
    const { popup } = upworkAccounts;
    const spec = states[state];
    // An attempt still in flight has no close button: dismissing it would
    // leave the authorization in a state neither side can report on.
    const dismissible = state !== 'progress' && onClose != null;
    const showGoToInbox = state === 'success' && onGoToInbox != null;
    const showRetry = state === 'failed' && onRetry != null;

    const style: CSSProperties = {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      width: len(width) ?? `${popup.width}px`,
      maxWidth: '100%',
      borderRadius: len(radius) ?? `${popup.radius}px`,
      backgroundColor: background ?? color.main.white,
      boxShadow: shadow ?? popup.shadow,
      overflow: 'hidden',
      fontFamily: typography.fontFamily.base,
    };

    return (
      <div {...rest} ref={ref} style={style} role="dialog" aria-modal="true">
        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            alignItems: 'center',
            gap: len(headGap) ?? `${popup.headGap}px`,
            width: '100%',
            padding: `${len(headPaddingY) ?? `${popup.headPaddingY}px`} ${
              len(headPaddingX) ?? `${popup.headPaddingX}px`
            }`,
            borderBottom: `1px solid ${color.main.backgroundAlt}`,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              width: popup.tileSize,
              height: popup.tileSize,
              borderRadius: popup.tileRadius,
              backgroundColor: spec.accent,
              color: color.main.white,
            }}
          >
            <Icon
              icon={
                state === 'success'
                  ? IconCheckmarkCircleFill
                  : state === 'failed'
                    ? IconXCirlceRoundFill
                    : IconGoToExternal
              }
              size={18}
            />
          </span>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: popup.headTitleGap,
              flex: '1 1 auto',
              minWidth: 0,
            }}
          >
            <span
              style={{
                ...typography.textStyle.lSemibold,
                fontSize: popup.titleFontSize,
                color: color.main.black,
              }}
            >
              {title ?? spec.title}
            </span>
            <span style={{ ...typography.textStyle.mRegular, color: color.navbar.text }}>
              {subtitle ?? spec.subtitle}
            </span>
          </div>

          {countdown != null && (
            <span
              style={{
                ...typography.textStyle.mRegular,
                color: color.navbar.text,
                opacity: 0.7,
                flexShrink: 0,
              }}
            >
              {countdown}s
            </span>
          )}

          {dismissible && (
            <IconButton icon={IconXClose} aria-label="Close" onClick={onClose} />
          )}
        </div>

        <div
          style={{
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: len(bodyGap) ?? `${popup.bodyGap}px`,
            width: '100%',
            padding: len(bodyPadding) ?? `${popup.bodyPadding}px`,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: popup.statusGap,
              width: '100%',
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: popup.statusSize,
                height: popup.statusSize,
                borderRadius: '50%',
                backgroundColor: spec.statusBackground,
                color: spec.accent,
              }}
            >
              {state === 'progress' ? (
                <Spinner size="xlarge" aria-label="Authorizing" />
              ) : (
                <Icon
                  icon={state === 'success' ? IconCheckmarkCircleFill : IconXCirlceRoundFill}
                  size={40}
                />
              )}
            </span>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: popup.headingGap,
                textAlign: 'center',
              }}
            >
              <span style={{ ...typography.textStyle.lMedium, color: color.main.black }}>
                {heading ?? spec.heading}
              </span>
              <span style={{ ...typography.textStyle.mRegular, color: color.navbar.text }}>
                {description ?? spec.description}
              </span>
            </div>
          </div>

          <div
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              gap: len(panelGap) ?? `${popup.panelGap}px`,
              width: '100%',
              padding: len(panelPadding) ?? `${popup.panelPadding}px`,
              borderRadius: popup.panelRadius,
              border: `1px solid ${spec.panelBorder}`,
              // Painted over white for the same reason the banner is — both
              // fills are alpha values that would otherwise pick up the page.
              background: `${spec.panelBackground}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: popup.panelTitleGap }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: popup.panelIconSize,
                  height: popup.panelIconSize,
                  borderRadius: '50%',
                  backgroundColor: spec.accent,
                  color: color.main.white,
                }}
              >
                <Icon
                  icon={state === 'failed' ? IconXCirlceRoundFill : IconCheckmarkCircleFill}
                  size={16}
                />
              </span>
              <span style={{ ...typography.textStyle.lSemibold, color: color.navbar.textActive }}>
                {panelTitle ?? spec.panelTitle}
              </span>
            </div>

            <AuthorizationSteps
              title={null}
              boxed
              steps={steps ?? spec.steps}
              markerBackground={spec.accent}
            />
          </div>
        </div>

        {/* Only the two terminal states get a footer. An attempt in flight has
            nothing to offer but waiting, and a button there would suggest
            otherwise. */}
        {(showGoToInbox || showRetry) && (
          <ModalFooter>
            {showRetry && (
              <>
                {onClose && (
                  <Button variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                )}
                <Button onClick={onRetry}>{retryLabel}</Button>
              </>
            )}
            {showGoToInbox && <Button onClick={onGoToInbox}>{goToInboxLabel}</Button>}
          </ModalFooter>
        )}
      </div>
    );
  },
);
