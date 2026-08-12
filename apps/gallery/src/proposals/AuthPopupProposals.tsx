import { color, component, textStyle } from '@gigradar/theme';
import {
  AuthorizationSteps,
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
 * Note the panel is a different thing in each state — "What Next?" is a list of
 * consequences, "Possible Reason" a diagnosis, "Important Reminders" an
 * instruction. Proposal 2 cuts all three, which is the part worth arguing
 * about: a failure with no reasons is a different loss from a success with no
 * next steps.
 */
const content: Record<
  AuthorizationState,
  {
    accent: string;
    tint: string;
    heading: string;
    description: string;
    panelTitle: string;
    steps: string[];
    action?: string;
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
    // Two rows, not four. The four described what connecting enables, which is
    // reassurance; these two are the only things the user can act on.
    steps: ['Go to the Inbox to read what just synced', 'Connect another Upwork account'],
    action: 'Go To Inbox',
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

/** The panel of numbered rows, tinted to the state. */
function Panel({ state }: { state: AuthorizationState }) {
  const c = content[state];
  return (
    <VStack gap="s" p="m" radius="s" background={c.tint} width="100%">
      <span style={{ ...textStyle.mSemibold, color: color.navbar.textActive }}>{c.panelTitle}</span>
      <AuthorizationSteps title={null} steps={c.steps} markerBackground={c.accent} />
    </VStack>
  );
}

/**
 * The footer.
 *
 * `secondary` names the button beside the main action. Proposals that keep the
 * close button leave it off on success — there are two ways out already —
 * while a proposal with no close button needs one here, or the only route out
 * of a terminal state is the action itself.
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
 * Proposal 1 — trim the list.
 *
 * Keeps the whole card and cuts the success panel from four rows to two: the
 * Inbox, and connecting another account. The four rows it replaces described
 * what connecting enables, which the user has just been told by the heading —
 * these two are the only things there is to do.
 *
 * The most conservative of the three. Progress and failed are unchanged.
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
      <ModalContent>
        <Panel state={state} />
      </ModalContent>
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
              <Button variant="secondary">Back</Button>
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
      <ModalContent>
        <Panel state={state} />
      </ModalContent>
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
    approach: 'Trim the list',
    rationale:
      'Keeps the card and cuts success to two rows — the Inbox, and connecting another account. The rows it drops described what connecting enables, which the heading already said. Progress and failed are unchanged.',
    render: (state) => <ProposalTrimmed state={state} />,
  },
  {
    number: 2,
    approach: 'No panel',
    rationale:
      'One band: the message, then the buttons under it at the bottom right, with no body and no footer to divide. The tightest of the three. Success loses reassurance it can afford to; failed loses its diagnosis.',
    render: (state) => <ProposalNoPanel state={state} />,
  },
  {
    number: 3,
    approach: 'No description',
    rationale:
      'Keeps the outcome in the header and the panel under it, and drops the line that restates the heading — "All set!" followed by "successfully connected" says one thing twice.',
    render: (state) => <ProposalNoDescription state={state} />,
  },
];
