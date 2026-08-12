import { color, component, textStyle } from '@gigradar/theme';
import {
  Button,
  HStack,
  Icon,
  IconCheckmarkCircleStroke,
  IconXCirlceRoundStroke,
  ModalCard,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  VStack,
  type AuthorizationState,
} from '@gigradar/ui';
import type { ReactNode } from 'react';

/**
 * Three proposals for the post-authorization popup, each drawn in all three
 * states.
 *
 * They are all the same layout — the modal shell, unmodified — and compete on
 * how much the card says. The drawn design states its outcome three times and
 * carries four rows of prose under it; the question under review is how much
 * of that survives.
 *
 * One thing is settled and no longer part of that question: the panels are
 * dotted, not numbered. Success read as step 1 then step 2 when the Inbox and
 * connecting another account are alternatives — Kolya raised that on the PR —
 * and the same is true of the other two lists, which are candidate causes and
 * things to keep in mind rather than an order to work down. Success also offers
 * both of its routes as buttons, so the choice is actionable and not only
 * described.
 *
 * Every one is built from the same tokens and the same components. Nothing
 * here introduces a primitive, so approving any of them adds nothing new to
 * the system.
 */

const { upworkAccounts } = component;

/**
 * The copy each state carries.
 *
 * Shared across the proposals, because the copy is settled: BF-3969 fixed what
 * the CRM can honestly claim, and Vadym asked for a route to the Inbox. What
 * is open is how much of it to show.
 *
 * Note the panel is a different thing in each state — "What Next?" is a pair of
 * choices, "Possible Reason" a diagnosis, "Important Reminders" an instruction.
 * Proposal 2 cuts all three, which is the part worth arguing about: a failure
 * with no reasons leaves the user with nothing to act on.
 */
const content: Record<
  AuthorizationState,
  {
    accent: string;
    tint: string;
    heading: string;
    description: string;
    panelTitle: string;
    /** Empty where the state has no panel to draw. */
    steps: string[];
    action?: string;
    /**
     * A second action of equal standing, drawn to the left of the main one.
     *
     * Only success has one, and only because its two routes onward are
     * alternatives rather than steps. `Cancel` and `Back` are not this: they
     * dismiss, so they stay where the proposals put them.
     */
    secondaryAction?: string;
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
    // Two rows, and "Or" is what makes them alternatives rather than a sequence.
    // The user goes to the Inbox or connects another account; only one happens.
    // Kolya raised exactly that on the PR, against the numbered discs these rows
    // used to carry.
    steps: ['Go to the Inbox to read what just synced', 'Or add another Upwork account'],
    action: 'Go To Inbox',
    // The alternative, drawn beside the main action rather than under it.
    secondaryAction: 'Connect Another Account',
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
    action: 'Try Again',
  },
};

/**
 * The status glyph, in a slot of one fixed size.
 *
 * A fixed slot rather than a bare icon: the two glyphs and the spinner are
 * different sizes, and without one the row's height would change with the
 * state.
 */
const GLYPH_TILE = 28;

function StateIcon({ state }: { state: AuthorizationState }) {
  const c = content[state];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: GLYPH_TILE,
        height: GLYPH_TILE,
        flexShrink: 0,
        color: c.accent,
      }}
    >
      {state === 'progress' ? (
        <Spinner size="medium" aria-label="Authorizing" />
      ) : (
        <Icon
          icon={state === 'success' ? IconCheckmarkCircleStroke : IconXCirlceRoundStroke}
          // Fills the slot. The slot itself is unchanged, so a larger glyph
          // cannot push the row — and the card — any taller.
          size={GLYPH_TILE}
        />
      )}
    </span>
  );
}

/**
 * The panel, tinted to the state.
 *
 * Dots rather than numbered discs, in every state. A disc puts a row at a
 * position in an order, which is a claim none of these lists actually make:
 * the two success rows are alternatives, the failed rows are candidate causes
 * of one failure, and even the progress reminders are things to keep in mind
 * rather than a checklist to work down. That numbering is what Kolya read as a
 * sequence on the PR.
 *
 * This is why `AuthorizationSteps` is not used here. That component numbers
 * from position by design — it draws the real authorization walkthrough, where
 * the order is the content. Passing it a list that is not ordered would be
 * using it against what it is for.
 *
 * Draws nothing where a state has no rows, so a proposal can keep the panel in
 * general and still have a state that does without one.
 */
function Panel({ state }: { state: AuthorizationState }) {
  const c = content[state];
  if (c.steps.length === 0) return null;

  return (
    <VStack gap="s" p="m" radius="s" background={c.tint} width="100%">
      <span style={{ ...textStyle.mSemibold, color: color.navbar.textActive }}>{c.panelTitle}</span>
      <VStack gap="xs" width="100%">
        {c.steps.map((step) => (
          <HStack key={step} gap="s" alignItems="flex-start" width="100%">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: c.accent,
                flexShrink: 0,
                // Sits the dot on the first line's optical centre. Centring it
                // on the row would drop it when a label wraps to two lines.
                marginTop: 7,
              }}
            />
            <span style={{ ...textStyle.mRegular, color: color.navbar.textActive, minWidth: 0 }}>
              {step}
            </span>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

/**
 * The body, drawn only where there is a panel to put in it.
 *
 * An empty `ModalContent` is not nothing — it still lays out its padding, so
 * the success card would carry a blank band between the header and the
 * buttons.
 */
function Body({ state }: { state: AuthorizationState }) {
  if (content[state].steps.length === 0) return null;
  return (
    <ModalContent>
      <Panel state={state} />
    </ModalContent>
  );
}

/**
 * The footer.
 *
 * Two kinds of button can sit left of the main action, and they are not the
 * same thing. `secondaryAction` is a real alternative — success offers the
 * Inbox or another account, and the user takes one — so both are drawn as
 * choices. `secondary` names a way out (Cancel, Back), which a proposal
 * supplies when it has no close button and would otherwise leave a terminal
 * state with only the action itself.
 */
function Actions({
  state,
  secondary,
}: {
  state: AuthorizationState;
  secondary?: (state: AuthorizationState) => string | null;
}) {
  const c = content[state];
  if (!c.action) return null;
  const back = secondary ? secondary(state) : state === 'failed' ? 'Cancel' : null;
  return (
    <ModalFooter>
      {c.secondaryAction && <Button variant="secondary">{c.secondaryAction}</Button>}
      {back && <Button variant="secondary">{back}</Button>}
      <Button tone={state === 'failed' ? 'danger' : 'brand'}>{c.action}</Button>
    </ModalFooter>
  );
}

/**
 * The header.
 *
 * `closable` is false where the proposal drops the close button entirely; the
 * space stays reserved either way, so the header is the same height in every
 * state.
 *
 * The glyph aligns to the top of the message rather than to its centre, so it
 * stays level with the heading whether the description runs to one line or
 * two.
 */
function Head({
  state,
  closable = true,
  children,
}: {
  state: AuthorizationState;
  closable?: boolean;
  children?: ReactNode;
}) {
  return (
    <ModalHeader
      onClose={closable && state !== 'progress' ? () => {} : undefined}
      reserveCloseSpace
      closeSize="small"
    >
      <HStack gap="s" alignItems="center">
        <StateIcon state={state} />
        {children}
      </HStack>
    </ModalHeader>
  );
}

/**
 * Proposal 1 — keep the card.
 *
 * Every state keeps its panel, and the description sits under the heading in
 * the header rather than at the top of the body. Success explains both routes
 * onward in the panel and offers both as buttons under it.
 *
 * The most conservative of the three — nothing is taken away.
 */
export function ProposalTrimmed({ state }: { state: AuthorizationState }) {
  const c = content[state];
  return (
    <ModalCard width={upworkAccounts.popup.width}>
      {/* The description sits under the heading rather than at the top of the
          body: it explains the outcome, so it belongs with it. The body is then
          the panel alone. */}
      <Head state={state}>
        <VStack gap={2}>
          <span style={{ lineHeight: 1.2 }}>{c.heading}</span>
          <span style={{ ...textStyle.mRegular, color: color.navbar.text }}>{c.description}</span>
        </VStack>
      </Head>
      <Body state={state} />
      <Actions state={state} />
    </ModalCard>
  );
}

/**
 * Proposal 2 — no panel.
 *
 * Drops the numbered rows in every state, and moves the description up under
 * the heading so the header carries the whole message. What is left below is
 * the action alone — and on progress, which has no action, nothing at all.
 *
 * The cost is not the same in each state, which is the thing to weigh: success
 * loses reassurance it can afford to lose, but failed loses its diagnosis, and
 * progress becomes a header and a spinner.
 */
export function ProposalNoPanel({ state }: { state: AuthorizationState }) {
  const c = content[state];
  return (
    <ModalCard width={upworkAccounts.popup.width}>
      {/* One band. The buttons sit under the message rather than in a footer,
          so there is no divider and nothing to split the card in two — but they
          keep the bottom-right corner every dialog puts its actions in.

          No close button either: Back is the way out, so there is one route
          rather than two competing ones in the corner. */}
      <ModalHeader divided={false} titleWidth="100%">
        <VStack gap="m" width="100%">
          <HStack gap="s" alignItems="center" minWidth={0}>
            <StateIcon state={state} />
            <VStack gap={2} minWidth={0}>
              <span style={{ lineHeight: 1.2 }}>{c.heading}</span>
              <span style={{ ...textStyle.mRegular, color: color.navbar.text }}>
                {c.description}
              </span>
            </VStack>
          </HStack>

          {c.action && (
            <HStack gap="xs" alignItems="center" justifyContent="flex-end" width="100%">
              {/* On success the left button is the other route onward, not a
                  way out — there is nothing to go back from once the account is
                  connected. Failed keeps Back, which is the only exit it has. */}
              <Button variant="secondary">{c.secondaryAction ?? 'Back'}</Button>
              <Button tone={state === 'failed' ? 'danger' : 'brand'}>{c.action}</Button>
            </HStack>
          )}
        </VStack>
      </ModalHeader>
    </ModalCard>
  );
}

/**
 * Proposal 3 — no description.
 *
 * Keeps the outcome and the panel, and drops the line under the heading. That
 * line restates the heading in every state: "All set! You're ready to go" is
 * followed by "Your Upwork account has been successfully connected", and
 * "Something went wrong" by "We couldn't complete the authorization process".
 *
 * The outcome moves into the header, so the card still says where the
 * authorization got to — the glyph alone would leave it to a colour. What goes
 * is the sentence that says it a second time.
 */
export function ProposalNoDescription({ state }: { state: AuthorizationState }) {
  const c = content[state];
  return (
    <ModalCard width={upworkAccounts.popup.width}>
      <Head state={state}>{c.heading}</Head>
      <Body state={state} />
      <Actions state={state} />
    </ModalCard>
  );
}

export const PROPOSALS: {
  number: number;
  approach: string;
  rationale: string;
  render: (state: AuthorizationState) => ReactNode;
}[] = [
  {
    number: 1,
    approach: 'Keep the card',
    rationale:
      'Nothing is taken away. Every state keeps its panel, and success explains both routes onward — the Inbox, or a second account — then offers both as buttons. The description sits under the heading rather than at the top of the body.',
    render: (state) => <ProposalTrimmed state={state} />,
  },
  {
    number: 2,
    approach: 'No panel anywhere',
    rationale:
      'One band in every state: the message, then the buttons under it at the bottom right, with no body and no footer to divide. The tightest of the three — and the only one where failed loses its diagnosis and progress loses its reminders.',
    render: (state) => <ProposalNoPanel state={state} />,
  },
  {
    number: 3,
    approach: 'No description',
    rationale:
      'Drops the line that restates the heading — "All set!" followed by "successfully connected" says one thing twice. Keeps every panel, so the card still explains the two routes onward; what goes is only the sentence said twice.',
    render: (state) => <ProposalNoDescription state={state} />,
  },
];
