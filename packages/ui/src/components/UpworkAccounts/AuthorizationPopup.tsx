import { color, component, typography } from '@gigradar/theme';
import {
  Fragment,
  forwardRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { len, type CssLength } from '../../internal/length.js';
import type { RenderProp, WithDefaultRender } from '../../internal/render.js';
import { Icon } from '../../icons/Icon.js';
import { IconCheckmarkCircleStroke, IconXCirlceRoundStroke } from '../../icons/defs.js';
import { Button } from '../Button/Button.js';
import { ModalCard, ModalContent, ModalFooter, ModalHeader } from '../Modal/ModalBands.js';
import { Spinner } from '../Spinner/Spinner.js';

const { upworkAccounts } = component;

/**
 * Where the authorization attempt has got to.
 *
 * `progress` is the only one the user cannot leave — the other two are
 * terminal and offer a way onward.
 */
export type AuthorizationState = 'progress' | 'success' | 'failed';

/** Per-instance overrides for the popup's own metrics. */
export type AuthorizationPopupStyleProps = {
  /** Card width. Figma draws 413px. */
  width?: CssLength;
  /** Corner radius. */
  radius?: CssLength;
  /** Padding inside the panel of rows. */
  panelPadding?: CssLength;
  /** Space between the panel's title and its rows. */
  panelGap?: CssLength;
  /** The status glyph's slot in the head. */
  glyphSize?: CssLength;
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
  /** Overrides the heading in the head. */
  heading?: ReactNode;
  /** Overrides the line under that heading. */
  description?: ReactNode;
  /** Overrides the panel's heading. */
  panelTitle?: ReactNode;
  /** Overrides the panel's rows. */
  steps?: ReactNode[];
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
   * Called when the success state's second route is taken.
   *
   * An alternative to the Inbox rather than a way out: once an account is
   * connected the user either reads what synced or connects another, and only
   * one of those happens. Drawn beside the main action, at equal standing.
   */
  onConnectAnother?: () => void;
  /** Label for that action. */
  connectAnotherLabel?: ReactNode;
  /**
   * Called when the failed state's retry action is pressed. Drawn only in that
   * state, for the same reason: a dead end with no route out of it is the
   * defect, not the copy.
   */
  onRetry?: () => void;
  /** Label for the retry action. */
  retryLabel?: ReactNode;
  /**
   * Replaces the head's glyph and message, keeping the header band and the
   * close button's reserved space that holds every state at one height.
   *
   * `heading` and `description` arrive resolved against the state's defaults,
   * so a replacement does not have to reach into the state table.
   */
  renderHead?: RenderProp<AuthorizationHeadRenderProps>;
  /**
   * Replaces the whole tinted panel — its title and its rows together. Not
   * called when there are no rows, since the panel is dropped entirely then.
   *
   * Use `renderRow` instead to change only the rows inside it.
   */
  renderPanel?: RenderProp<AuthorizationPanelRenderProps>;
  /**
   * Replaces one row in the panel, keeping the panel's tint and title.
   *
   * The usual reason is a row that has to carry a link — a failed state
   * pointing at a status page, a success row linking to the Inbox.
   *
   * Not called when `renderPanel` has replaced the panel around it.
   */
  renderRow?: RenderProp<AuthorizationRowRenderProps>;
  /**
   * Replaces the footer's buttons. Not called in the `progress` state, which
   * draws no footer at all — an attempt in flight has nothing to offer but
   * waiting.
   *
   * The payload carries each action and whether the default would draw it, so
   * a replacement can reorder or relabel without re-deriving the state rules.
   */
  renderFooter?: RenderProp<AuthorizationFooterRenderProps>;
} & AuthorizationPopupStyleProps &
  Omit<HTMLAttributes<HTMLDivElement>, 'className' | 'style' | 'title'>;

/** What a `renderHead` function receives — the card's head. */
export type AuthorizationHeadRenderProps = WithDefaultRender & {
  /** Which state the card is in. */
  state: AuthorizationState;
  /** The heading, resolved against the state's default. */
  heading: ReactNode;
  /** The line under it, resolved against the state's default. */
  description: ReactNode;
  /** The state's accent colour, which the glyph is drawn in. */
  accent: string;
};

/** What a `renderPanel` function receives — the tinted block of rows. */
export type AuthorizationPanelRenderProps = WithDefaultRender & {
  /** Which state the card is in. */
  state: AuthorizationState;
  /** The panel's heading, resolved against the state's default. */
  panelTitle: ReactNode;
  /** The rows, resolved against the state's defaults. Never empty. */
  rows: ReactNode[];
  /** The state's accent colour, which the row dots are drawn in. */
  accent: string;
  /** The panel's fill for this state. */
  tint: string;
};

/** What a `renderRow` function receives — one row in the panel. */
export type AuthorizationRowRenderProps = WithDefaultRender & {
  /** The row's content. */
  row: ReactNode;
  /** Its position in the panel, for keying. */
  index: number;
  /** The state's accent colour, which the dot is drawn in. */
  accent: string;
};

/** What a `renderFooter` function receives — the card's actions. */
export type AuthorizationFooterRenderProps = WithDefaultRender & {
  /** Which state the card is in. Never `progress`. */
  state: AuthorizationState;
  /** Whether the default draws the Inbox action. */
  showGoToInbox: boolean;
  /** Whether the default draws the connect-another action. */
  showConnectAnother: boolean;
  /** Whether the default draws the retry action. */
  showRetry: boolean;
  /** Opens the Inbox, if the caller wired it. */
  goToInbox?: () => void;
  /** Starts another connection, if the caller wired it. */
  connectAnother?: () => void;
  /** Retries the attempt, if the caller wired it. */
  retry?: () => void;
  /** Dismisses the card, if the caller wired it. */
  close?: () => void;
};

/** Everything that differs between the three states, in one place. */
const states: Record<
  AuthorizationState,
  {
    accent: string;
    tint: string;
    heading: string;
    description: string;
    panelTitle: string;
    steps: string[];
  }
> = {
  progress: {
    accent: color.main.brand,
    tint: color.main.background,
    heading: 'Preparing authorization...',
    description: 'Please wait a moment',
    panelTitle: 'Important Reminders',
    steps: [
      'Sign in to your Upwork account',
      'Review permissions carefully',
      'Complete the authorization flow',
      'Return to this window',
    ],
  },
  success: {
    accent: color.status.success.main,
    tint: color.status.success.background,
    heading: "All set! You're ready to go",
    description: 'Upwork account has been successfully connected',
    panelTitle: 'What Next ?',
    /**
     * BF-3969. These rows previously read "Sync your jobs and contracts",
     * "Manage proposals and messages", and "Track your earnings and time" —
     * none of which the CRM does. The screen was drawn early, against a guess
     * at the eventual product, and shipped as a promise.
     *
     * Now the two routes onward, and "Or" is what makes them alternatives
     * rather than a sequence: the user reads what just synced, or connects
     * another account. Both are offered as buttons too, so the choice is
     * actionable and not only described.
     */
    steps: ['Go to the Inbox to read what just synced', 'Or add another Upwork account'],
  },
  failed: {
    accent: color.deprecated.errorAlt.main,
    tint: upworkAccounts.popup.tint.failedSurface,
    heading: 'Something went wrong',
    description: "We couldn't complete the authorization process",
    panelTitle: 'Possible Reason',
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
 * All three states are one layout — a head carrying the glyph and the message,
 * a panel of rows, and a footer — differing only in accent color, glyph, and
 * copy. Holding those differences in a table rather than in branches is what
 * keeps that structural sameness visible.
 *
 * The card states its outcome once. It previously said it three times — in the
 * head's title, again in a large centred status block, and a third time in the
 * description under that — which is what the review cut: the glyph and the
 * heading carry the outcome, and the description explains it. What is left
 * below is the panel, which is a different thing in each state: "What Next?" is
 * a pair of choices, "Possible Reason" a diagnosis, "Important Reminders" an
 * instruction.
 */
export const AuthorizationPopup = forwardRef<HTMLDivElement, AuthorizationPopupProps>(
  function AuthorizationPopup(
    {
      state = 'progress',
      heading,
      description,
      panelTitle,
      steps,
      onClose,
      onGoToInbox,
      goToInboxLabel = 'Go To Inbox',
      onConnectAnother,
      connectAnotherLabel = 'Connect Another Account',
      onRetry,
      retryLabel = 'Try Again',
      renderHead,
      renderPanel,
      renderRow,
      renderFooter,
      width,
      radius,
      panelPadding,
      panelGap,
      glyphSize,
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
    const showConnectAnother = state === 'success' && onConnectAnother != null;
    const showRetry = state === 'failed' && onRetry != null;
    const rows = steps ?? spec.steps;

    const glyphStyle: CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: len(glyphSize) ?? popup.glyphSlot,
      height: len(glyphSize) ?? popup.glyphSlot,
      color: spec.accent,
    };

    const resolvedHeading = heading ?? spec.heading;
    const resolvedDescription = description ?? spec.description;
    const resolvedPanelTitle = panelTitle ?? spec.panelTitle;

    const defaultHead = () => (
      <div style={{ display: 'flex', alignItems: 'center', gap: popup.headGap, minWidth: 0 }}>
        <span style={glyphStyle}>
          {state === 'progress' ? (
            <Spinner size="medium" aria-label="Authorizing" />
          ) : (
            <Icon
              icon={state === 'success' ? IconCheckmarkCircleStroke : IconXCirlceRoundStroke}
              // Fills the slot. The slot itself is fixed, so a larger glyph
              // cannot push the head — and the card — any taller.
              size="100%"
            />
          )}
        </span>

        {/* The description sits under the heading here rather than at the
            top of the body: it explains the outcome, so it belongs with it.
            The body is then the panel alone. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: popup.headTitleGap,
            minWidth: 0,
          }}
        >
          <span
            style={{
              ...typography.textStyle.lMedium,
              color: color.main.black,
              lineHeight: 1.2,
            }}
          >
            {resolvedHeading}
          </span>
          <span style={{ ...typography.textStyle.mRegular, color: color.navbar.text }}>
            {resolvedDescription}
          </span>
        </div>
      </div>
    );

    const defaultRow = (row: ReactNode, index: number) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: popup.rowGap,
          width: '100%',
        }}
      >
        <span
          aria-hidden
          style={{
            width: popup.dotSize,
            height: popup.dotSize,
            marginTop: popup.dotOffset,
            borderRadius: '50%',
            backgroundColor: spec.accent,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            ...typography.textStyle.mRegular,
            color: color.navbar.textActive,
            minWidth: 0,
          }}
        >
          {row}
        </span>
      </div>
    );

    const defaultPanel = () => (
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: len(panelGap) ?? `${popup.panelGap}px`,
          width: '100%',
          padding: len(panelPadding) ?? `${popup.panelPadding}px`,
          borderRadius: popup.panelRadius,
          // Painted over white rather than the page: the failed tint is
          // an alpha value that would otherwise pick up whatever is
          // behind the card.
          background: spec.tint,
        }}
      >
        <span style={{ ...typography.textStyle.mSemibold, color: color.navbar.textActive }}>
          {resolvedPanelTitle}
        </span>

        {/* Dots rather than numbered discs. A disc puts a row at a
            position in an order, which is a claim none of these lists
            makes: the success rows are alternatives, the failed rows are
            candidate causes of one failure, and the progress reminders
            are things to keep in mind rather than a checklist to work
            down. `AuthorizationSteps` is deliberately not used here for
            that reason — it numbers from position by design, because it
            draws the walkthrough, where the order IS the content. */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: popup.rowPadding,
            width: '100%',
          }}
        >
          {rows.map((row, index) => (
            <Fragment key={index}>
              {renderRow
                ? renderRow({
                    row,
                    index,
                    accent: spec.accent,
                    defaultRender: () => defaultRow(row, index),
                  })
                : defaultRow(row, index)}
            </Fragment>
          ))}
        </div>
      </div>
    );

    const defaultFooter = () => (
      <>
        {showRetry && (
          <>
            {onClose && (
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
            )}
            {/* The retry carries the danger tone: it is the action on a
                failure, and the card is already red around it. */}
            <Button tone="danger" onClick={onRetry}>
              {retryLabel}
            </Button>
          </>
        )}
        {showConnectAnother && (
          <Button variant="secondary" onClick={onConnectAnother}>
            {connectAnotherLabel}
          </Button>
        )}
        {showGoToInbox && <Button onClick={onGoToInbox}>{goToInboxLabel}</Button>}
      </>
    );

    return (
      <ModalCard
        {...rest}
        ref={ref}
        role="dialog"
        aria-modal="true"
        width={width ?? popup.width}
        radius={radius ?? popup.radius}
        background={background}
        shadow={shadow ?? popup.shadow}
      >
        {/* `reserveCloseSpace` keeps every state the same height: the progress
            state has no close button, and without the reservation the card
            would grow by the button's height the moment it resolves. */}
        <ModalHeader
          onClose={dismissible ? onClose : undefined}
          reserveCloseSpace
          closeSize="small"
        >
          {renderHead
            ? renderHead({
                state,
                heading: resolvedHeading,
                description: resolvedDescription,
                accent: spec.accent,
                defaultRender: defaultHead,
              })
            : defaultHead()}
        </ModalHeader>

        {rows.length > 0 && (
          <ModalContent>
            {renderPanel
              ? renderPanel({
                  state,
                  panelTitle: resolvedPanelTitle,
                  rows,
                  accent: spec.accent,
                  tint: spec.tint,
                  defaultRender: defaultPanel,
                })
              : defaultPanel()}
          </ModalContent>
        )}

        {/* Only the two terminal states get a footer. An attempt in flight has
            nothing to offer but waiting, and a button there would suggest
            otherwise. */}
        {(showGoToInbox || showConnectAnother || showRetry) && (
          <ModalFooter>
            {renderFooter
              ? renderFooter({
                  state,
                  showGoToInbox,
                  showConnectAnother,
                  showRetry,
                  goToInbox: onGoToInbox,
                  connectAnother: onConnectAnother,
                  retry: onRetry,
                  close: onClose,
                  defaultRender: defaultFooter,
                })
              : defaultFooter()}
          </ModalFooter>
        )}
      </ModalCard>
    );
  },
);
