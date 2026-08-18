import { color, radius, spacing, textStyle } from '@gigradar/theme';
import {
  AccountCard,
  AccountSafetyNotice,
  AuthorizationPopup,
  AuthorizationSteps,
  AuthorizeBanner,
  Button,
  HStack,
  Icon,
  IconButton,
  IconGoToExternal,
  IconXClose,
  Modal,
  Skeleton,
  StatusBadge,
  UpworkConnectedAccounts,
  VStack,
  type AuthorizationState,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Frame } from '../components/Frame';
import { PropsTable } from '../components/PropsTable';
import { ACCOUNTS, FULL_ACCOUNTS, MORE_ACCOUNTS } from '../fixtures/upworkAccounts';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * CRM ▸ Settings ▸ Upwork Connected Account — the screen, not the components.
 *
 * Figma draws seven states of it (node 2105:34594). Six of them are the same
 * screen holding different data, so this page shows what produces each rather
 * than treating them as seven variants to configure.
 */
export function UpworkAccountsPage() {
  return (
    <>
      <PageHeader
        title="Upwork Connected Account"
        description="CRM ▸ Settings ▸ Upwork Connected Account. Every Upwork account the workspace has authorized, the slots left on the plan, and the walkthrough for connecting another. Figma node 2105:34594."
      />

      <CrossLink
        eyebrow="The screen's two columns"
        links={[
          { label: 'Account slots (Left)', pageId: 'crm-upwork-slots' },
          { label: 'Info details (Right)', pageId: 'crm-upwork-info' },
          { label: 'Components ▸ CRM ▸ Account slot', pageId: 'account-slot' },
          { label: 'Components ▸ CRM ▸ Info details', pageId: 'info-details' },
        ]}
      >
        This page is the assembled screen. Each column has its own page under it — the left column's
        states and capacity arithmetic under <strong>Account slots</strong>, the right column's three
        cards under <strong>Info details</strong>. Both are built from components filed in{' '}
        <strong>Components ▸ CRM</strong>, which is where their props are documented.
      </CrossLink>

      <Section
        title="The screen"
        description="Two columns. The left lists every slot the plan allows; the right holds the authorize banner, the safety notice, and the steps. Tick accounts to see the header's selection actions appear."
      >
        <ScreenDemo />
        <CodeBlock
          code={`<UpworkConnectedAccounts
  accounts={accounts}
  capacity={10}
  selected={selected}
  onSelectionChange={setSelected}
  onAuthorize={() => startOAuth()}
  onRemove={(ids) => remove(ids)}
  onUpgrade={() => openBilling()}
  onInviteToWorkspace={() => inviteOwnerToWorkspace()}
/>`}
        />
      </Section>

      <Section
        title="States"
        description="Figma draws seven. Only one of them is a prop — the rest are what the screen looks like holding different data."
      >
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0, marginBottom: spacing.s }}>
            “API Not Connected”, “Empty - API Connected”, “Select”, “Fill”, “Select all”, and “Fill
            +99” are one screen at six moments: whether the API is connected, how many accounts came
            back, and which of them are ticked. The screen already has all three —{' '}
            <code>apiConnected</code>, <code>accounts</code>, and <code>selected</code> — so those
            six are states it arrives at rather than something a caller sets.
          </p>
          <p style={{ margin: 0 }}>
            “Loading” is different in kind. Nothing in the data says whether it has arrived yet, so
            that one is <code>loading</code>.
          </p>
        </div>
      </Section>

      <Section
        title="No API connection"
        description="The first fork. Without an API connection there is nothing to authorize against, so the left column asks for the API and the right column's authorize button is dead — that pairing is what tells the user which order the two go in."
      >
        <Frame>
          <UpworkConnectedAccounts apiConnected={false} capacity={10} />
        </Frame>
        <CodeBlock code={`<UpworkConnectedAccounts apiConnected={false} onConnectApi={connect} />`} />
      </Section>

      <Section
        title="Connected, but empty"
        description="The API is in and no account has been authorized yet. Same panel, different call to action."
      >
        <Frame>
          <UpworkConnectedAccounts accounts={[]} capacity={10} onAuthorize={() => {}} />
        </Frame>
        <CodeBlock code={`<UpworkConnectedAccounts accounts={[]} onAuthorize={authorize} />`} />
      </Section>

      <Section
        title="Selection"
        description="Passing `selected` is what puts a checkbox on each card — a list with no selection prop renders without them. Select all disables once everything is ticked, Clear once nothing is, and Remove appears with a count as soon as there is something to remove."
      >
        <SelectionDemo />
        <CodeBlock
          code={`const [selected, setSelected] = useState<string[]>([]);

<UpworkConnectedAccounts
  accounts={accounts}
  selected={selected}
  onSelectionChange={setSelected}
  onRemove={(ids) => remove(ids)}
/>`}
        />
      </Section>

      <Section
        title="A full plan"
        description="Every slot taken. The empty slots and the authorize card drop out on their own once `accounts.length` reaches `capacity` — there is nothing to configure."
      >
        <Frame height={620}>
          <UpworkConnectedAccounts
            accounts={FULL_ACCOUNTS}
            capacity={FULL_ACCOUNTS.length}
            selected={[]}
            onSelectionChange={() => {}}
          />
        </Frame>
      </Section>

      <Section
        title="Loading"
        description="Grey bars in the shape of what is coming, in both columns at once. The right column is static content, but loading only half a screen reads as broken rather than pending."
      >
        <Frame>
          <UpworkConnectedAccounts loading />
        </Frame>
        <CodeBlock code={`<UpworkConnectedAccounts loading />`} />
      </Section>

      <Section
        title="The authorization flow"
        description="Pressing Authorize opens Upwork in a new window. The popup covers the wait: it shows “in progress” while the user is away, then resolves to connected or failed when they come back. Press the button below to walk the whole thing."
      >
        <FlowDemo />
        <CodeBlock
          code={`const [auth, setAuth] = useState<AuthorizationState | null>(null);

const authorize = async () => {
  setAuth('progress');                       // popup opens, no way to dismiss
  const upwork = window.open(OAUTH_URL);     // the redirect
  try {
    const account = await waitForCallback(upwork);
    setAccounts((current) => [...current, account]);
    setAuth('success');
  } catch {
    setAuth('failed');
  }
};

<UpworkConnectedAccounts accounts={accounts} onAuthorize={authorize} />
{auth && <AuthorizationPopup state={auth} onClose={() => setAuth(null)} />}`}
        />
        <Caption>
          The popup is the card only — no backdrop, no positioning. Wrap it in <code>Modal</code>{' '}
          for the dimming, the portal, and the focus trap, or drop it into an overlay the shell
          already has.
        </Caption>
      </Section>

      <Section
        title="The three popup states"
        description="One layout across all three — a head carrying the glyph and the message, a panel of rows, and a footer — differing only in accent, glyph, and copy. Switch between them below."
      >
        <PopupDemo />
        <Caption>
          The card states its outcome once. It previously said it three times — in the head's
          title, again in a large centred status disc, and a third time in the description under
          that. The glyph and the heading carry the outcome now, and the description explains it.
        </Caption>
        <CodeBlock
          code={`<AuthorizationPopup
  state="success"
  onClose={dismiss}
  onGoToInbox={openInbox}            // the main route onward
  onConnectAnother={authorizeAgain}  // its alternative, at equal standing
/>

<AuthorizationPopup state="failed" onClose={dismiss} onRetry={authorize} />

// In flight. No close button, no footer — and Modal withholds its own
// onClose too, so there is no route out of an attempt in progress.
<AuthorizationPopup state="progress" />`}
        />
      </Section>

      <Section
        title="Why the panel is dotted"
        description="Every row in every state carries a dot, not a numbered disc."
      >
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0, marginBottom: spacing.s }}>
            A disc puts a row at a position in an order, which is a claim none of these lists makes.
            The two success rows are alternatives — the Inbox <em>or</em> another account, and only
            one happens. The failed rows are candidate causes of a single failure. Even the progress
            reminders are things to keep in mind rather than a checklist to work down.
          </p>
          <p style={{ margin: 0, marginBottom: spacing.s }}>
            This is why <code>AuthorizationSteps</code> is not used here, though it draws a visually
            similar list. That component numbers from position by design, because it draws the real
            walkthrough, where the order <em>is</em> the content. Passing it an unordered list would
            be using it against what it is for.
          </p>
          <p style={{ margin: 0 }}>
            Success also offers both of its routes as buttons, so the choice is actionable and not
            only described. <code>Connect Another Account</code> is drawn <code>secondary</code>{' '}
            beside the main action rather than as a way out — Cancel and Back dismiss, and this does
            not.
          </p>
        </div>
      </Section>

      <Section title="AuthorizationPopup props">
        <PropsTable
          rows={[
            { name: 'state', type: `'progress' | 'success' | 'failed'`, default: `'progress'`, description: 'Which of the three to draw. Everything else follows from it.' },
            { name: 'heading / description', type: 'ReactNode', description: 'The message in the head. Each state has its own.' },
            { name: 'panelTitle / steps', type: 'ReactNode / ReactNode[]', description: 'The panel’s heading and rows. Pass an empty array to drop the panel and the body with it.' },
            { name: 'onClose', type: '() => void', description: 'Draws the close button — in the two terminal states only. An attempt in flight cannot be dismissed without leaving it in a state neither side can report on.' },
            { name: 'onGoToInbox / goToInboxLabel', type: '() => void / ReactNode', default: `'Go To Inbox'`, description: 'The success state’s main action. Omitted, no button is drawn.' },
            { name: 'onConnectAnother / connectAnotherLabel', type: '() => void / ReactNode', default: `'Connect Another Account'`, description: 'Its alternative, drawn secondary beside it.' },
            { name: 'onRetry / retryLabel', type: '() => void / ReactNode', default: `'Try Again'`, description: 'The failed state’s action, in the danger tone. Drawn with Cancel when `onClose` is passed.' },
            { name: 'width / radius', type: 'CssLength', default: '413 / radius.l', description: 'The card.' },
            { name: 'panelPadding / panelGap', type: 'CssLength', description: 'Inside the panel, and between its title and rows.' },
            { name: 'glyphSize', type: 'CssLength', default: '28', description: 'The status glyph’s slot. Fixed, so the spinner and the two icons cannot change the head’s height between states.' },
            { name: 'background / shadow', type: 'string', description: 'Card fill and drop shadow.' },
          ]}
        />
      </Section>

      <Section
        title="Loading, everywhere"
        description="Every loading state on this screen is Skeleton — the header bars, the account grid, and the right column. It ships with the system, so the next screen does not hand-roll grey divs."
      >
        <Preview>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s, width: 280 }}>
            <Skeleton variant="text" width={160} />
            <Skeleton height={63} radius={14} />
            <Skeleton variant="text" count={3} />
          </div>
          <Skeleton variant="circle" />
        </Preview>
        <CodeBlock
          code={`<Skeleton />                       // a block, filling its container
<Skeleton variant="text" count={3} />  // three lines, the last one short
<Skeleton variant="circle" />          // an avatar slot
<Skeleton still />                     // no shimmer, for a screen full of them`}
        />
      </Section>

      <Section
        title="Anatomy"
        description="The parts the screen composes. Each stands alone — the screen's job is the wiring between them."
      >
        <Part name="AccountCard" role="One slot in the grid. Four variants: a connected account, and the three kinds of empty.">
          <div style={{ width: 200 }}>
            <AccountCard name="Harper Garcia" status="active" selected={false} />
          </div>
          <div style={{ width: 200 }}>
            <AccountCard name="Olivia Smith" status="suspended" selected />
          </div>
          <div style={{ width: 200 }}>
            <AccountCard variant="authorize" onClick={() => {}} />
          </div>
          <div style={{ width: 200 }}>
            <AccountCard variant="available" />
          </div>
          <div style={{ width: 200 }}>
            <AccountCard variant="upgrade" onClick={() => {}} />
          </div>
        </Part>

        <Part name="StatusBadge" role="The tag under a name, from the Badge family. Five tones, and an account is always exactly one of them.">
          <StatusBadge tone="active" />
          <StatusBadge tone="suspended" />
          <StatusBadge tone="pending" />
          <StatusBadge tone="inactive" />
          <StatusBadge tone="error" />
        </Part>

        <Part name="Button" role="The primary action is the design system button with the external-link icon — no bespoke component. Its disabled state is what the design leans on: greyed until an API connection exists.">
          <Button size="large" radius={12} fontSize={14} endIcon={<Icon icon={IconGoToExternal} size={12.5} />}>
            Authorize Account
          </Button>
          <Button size="large" radius={12} fontSize={14} disabled endIcon={<Icon icon={IconGoToExternal} size={12.5} />}>
            Authorize Account
          </Button>
        </Part>

        <Part name="IconButton" role="The chrome controls — the popup's close and the header's back. Ghost by default, filling only on hover.">
          <IconButton icon={IconXClose} aria-label="Close" />
          <IconButton icon={IconXClose} aria-label="Close" variant="subtle" />
          <IconButton icon={IconXClose} aria-label="Close" variant="solid" />
          <IconButton icon={IconXClose} aria-label="Close" size="small" />
          <IconButton icon={IconXClose} aria-label="Close" size="large" />
        </Part>

        <Part name="AuthorizeBanner" role="The gradient card at the top of the right column.">
          <div style={{ width: 285 }}>
            <AuthorizeBanner onAuthorize={() => {}} />
          </div>
        </Part>

        <Part name="AccountSafetyNotice" role="The standing security warning. White with an amber plate, not an amber card — it is permanent, not something the user triggered.">
          <div style={{ width: 285 }}>
            <AccountSafetyNotice onInvite={() => {}} />
          </div>
        </Part>

        <Part name="AuthorizationSteps" role="The numbered walkthrough. `boxed` is the same list as the popup draws it — white rows, recolored discs.">
          <div style={{ width: 285 }}>
            <AuthorizationSteps />
          </div>
        </Part>
      </Section>

      <Section
        title="What this screen added to the system"
        description="Four of the parts this screen needed were general, not Upwork-specific. They live in the system rather than in this folder, so the next screen gets them for free."
      >
        <div style={{ ...textStyle.mRegular, color: color.main.description, maxWidth: 680 }}>
          <p style={{ margin: 0, marginBottom: spacing.s }}>
            <code>StatusBadge</code> joined the Badge family — the one badge drawn as a soft 4px box
            rather than a round pill, because it sits tucked under a name as a property of the thing
            above it. <code>Skeleton</code> is the loading placeholder every screen needs and none
            had. <code>IconButton</code> exists because getting a bare round glyph out of{' '}
            <code>Button</code> took four override props purely to suppress the box it draws.
          </p>
          <p style={{ margin: 0, marginBottom: spacing.s }}>
            <code>Modal</code> is the layer Figma never draws: the dimming, the portal, the focus
            trap, Escape, and the scroll lock. Its <code>onClose</code> is optional, and that is the
            load-bearing detail — a modal with no handler cannot be dismissed by any route, which is
            exactly what an authorization in flight needs.
          </p>
          <p style={{ margin: 0 }}>
            The rest of this folder is Upwork-specific and stays here. The authorize action is now
            plain <code>Button</code> with the external-link icon — the fixed 253px pill it used to
            be was a bespoke component earning nothing.
          </p>
        </div>
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'accounts', type: 'UpworkAccount[]', default: '[]', description: 'The connected accounts. `{ id, name, avatarSrc?, status?, statusLabel? }`. An empty list draws the empty state.' },
            { name: 'capacity', type: 'number', default: '10', description: 'Slots the plan allows. Drives the (3/10) counter and how many empty slots follow the accounts.' },
            { name: 'apiConnected', type: 'boolean', default: 'true', description: 'Whether the Upwork API is connected. False swaps the empty state’s call to action and disables the authorize banner.' },
            { name: 'selected', type: 'string[]', description: 'Ticked account ids. Omitting it renders a list with no checkboxes at all.' },
            { name: 'onSelectionChange', type: '(selected: string[]) => void', description: 'The new selection, on every tick.' },
            { name: 'loading', type: 'boolean', default: 'false', description: 'Draws the skeleton in both columns.' },
            { name: 'backButton', type: 'boolean', default: 'false', description: 'Draws a back arrow left of each column title.' },
            { name: 'onAuthorize', type: '() => void', description: 'The authorize action, in either column.' },
            { name: 'onConnectApi', type: '() => void', description: 'The empty state’s action while `apiConnected` is false.' },
            { name: 'onUpgrade', type: '() => void', description: 'The upgrade slot. Omitting it drops the slot entirely.' },
            { name: 'onRemove', type: '(selected: string[]) => void', description: 'The header’s Remove action. Appears with a count once something is ticked.' },
            { name: 'onInviteToWorkspace', type: '() => void', description: 'The safety notice’s invite action — what its text tells the user to do instead of logging in as someone else. Omitting it drops the button.' },
            { name: 'renderAccounts', type: 'RenderProp<AccountListRenderProps>', description: 'Replaces the account grid. Call `defaultRender()` to decorate rather than replace.' },
            { name: 'listWidth / sideWidth', type: 'CssLength', description: 'Column widths. Figma draws 640px and 285px.' },
            { name: 'columns', type: 'number', default: '3', description: 'Slots per row in the account grid.' },
          ]}
        />
      </Section>
    </>
  );
}

/** The screen, wired the way the product would wire it. */
function ScreenDemo() {
  const [selected, setSelected] = useState<string[]>([]);
  const [accounts, setAccounts] = useState(MORE_ACCOUNTS);

  return (
    <>
      <Frame height={640}>
        <UpworkConnectedAccounts
          accounts={accounts}
          capacity={10}
          selected={selected}
          onSelectionChange={setSelected}
          onAuthorize={() => {}}
          onUpgrade={() => {}}
          onInviteToWorkspace={() => {}}
          onRemove={(ids) => {
            setAccounts((current) => current.filter((account) => !ids.includes(account.id)));
            setSelected([]);
          }}
        />
      </Frame>
      <Caption>
        Remove actually removes here, so the counter and the empty slots move with it.
      </Caption>
    </>
  );
}

/** The selection states, on a list that starts with two already ticked. */
function SelectionDemo() {
  const [selected, setSelected] = useState<string[]>(['olivia', 'isabella']);

  return (
    <Frame height={560}>
      <UpworkConnectedAccounts
        accounts={ACCOUNTS}
        capacity={10}
        selected={selected}
        onSelectionChange={setSelected}
        onAuthorize={() => {}}
        onRemove={() => {}}
        onUpgrade={() => {}}
      />
    </Frame>
  );
}

/**
 * The whole authorization flow, end to end.
 *
 * Stands in for the real thing: `authorize` would open Upwork and wait on the
 * OAuth callback, where this waits on a timer and lets the reader pick which
 * way it lands. What matters is the sequence around it — the popup opens on
 * `progress` with no way out, resolves to one of the two terminal states, and
 * a success is what actually adds the account to the list behind it.
 */
function FlowDemo() {
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const [auth, setAuth] = useState<AuthorizationState | null>(null);
  const [outcome, setOutcome] = useState<'success' | 'failed'>('success');

  const authorize = () => {
    setAuth('progress');
    window.setTimeout(() => {
      if (outcome === 'success') {
        setAccounts((current) => [
          ...current,
          { id: `new-${current.length}`, name: 'Ava Thompson', status: 'active' },
        ]);
      }
      setAuth(outcome);
    }, 1600);
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.s, marginBottom: spacing.s }}>
        <button
          onClick={authorize}
          disabled={auth === 'progress'}
          style={{
            ...textStyle.mMedium,
            padding: `${spacing.xs}px ${spacing.s}px`,
            borderRadius: radius.xs,
            border: 'none',
            backgroundColor: auth === 'progress' ? color.disable.background : color.main.brand,
            color: auth === 'progress' ? color.disable.text : color.main.white,
            cursor: auth === 'progress' ? 'not-allowed' : 'pointer',
          }}
        >
          Authorize an account
        </button>
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>
          resolving to
        </span>
        {(['success', 'failed'] as const).map((value) => (
          <button
            key={value}
            onClick={() => setOutcome(value)}
            style={{
              ...textStyle.sMedium,
              padding: `${spacing.xxs}px ${spacing.xs}px`,
              borderRadius: radius.xs,
              border: `1px solid ${outcome === value ? color.main.brand : color.navbar.hover}`,
              backgroundColor: outcome === value ? color.badge.background : color.main.white,
              color: outcome === value ? color.main.brand : color.navbar.text,
              cursor: 'pointer',
            }}
          >
            {value}
          </button>
        ))}
      </div>

      <Frame height={560}>
        <UpworkConnectedAccounts
          accounts={accounts}
          capacity={10}
          onAuthorize={authorize}
          onInviteToWorkspace={() => {}}
        />
      </Frame>

      {/*
        The real Modal, not a backdrop hand-rolled for the demo. Note the
        `onClose` is withheld while the attempt is in flight, which is what
        makes the progress state genuinely undismissable — no Escape, no
        backdrop click, no close button.
      */}
      <Modal
        open={auth !== null}
        onClose={auth === 'progress' ? undefined : () => setAuth(null)}
        label="Upwork authorization"
        width={413}
        // The popup draws its own surface, radius, and shadow, so the modal's
        // card steps back to a bare wrapper rather than stacking a second one.
        background="transparent"
        shadow="none"
        radius={0}
      >
        {auth && <AuthorizationPopup state={auth} onClose={() => setAuth(null)} />}
      </Modal>
    </>
  );
}

/** The three popup states, switchable. */
function PopupDemo() {
  const [state, setState] = useState<'progress' | 'success' | 'failed'>('progress');

  return (
    <Preview>
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.s }}>
        <div style={{ display: 'flex', gap: spacing.xs }}>
          {(['progress', 'success', 'failed'] as const).map((value) => (
            <button
              key={value}
              onClick={() => setState(value)}
              style={{
                ...textStyle.mMedium,
                padding: `${spacing.xs}px ${spacing.s}px`,
                borderRadius: radius.xs,
                border: `1px solid ${state === value ? color.main.brand : color.navbar.hover}`,
                backgroundColor: state === value ? color.badge.background : color.main.white,
                color: state === value ? color.main.brand : color.navbar.text,
                cursor: 'pointer',
              }}
            >
              {value}
            </button>
          ))}
        </div>
        <AuthorizationPopup
          state={state}
          onClose={() => {}}
          onGoToInbox={() => {}}
          onConnectAnother={() => {}}
          onRetry={() => {}}
        />
      </div>
    </Preview>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return (
    <p
      style={{
        ...textStyle.sRegular,
        color: color.main.description,
        margin: 0,
        marginBottom: spacing.s,
      }}
    >
      {children}
    </p>
  );
}

/** One row of the anatomy list — a component's name, its role, and the thing itself. */
function Part({ name, role, children }: { name: string; role: string; children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
        boxSizing: 'border-box',
        padding: spacing.s,
        marginBottom: spacing.s,
        borderRadius: radius.s,
        border: `1px solid ${color.navbar.hover}`,
        backgroundColor: color.main.white,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: spacing.xs }}>
        <code style={{ ...textStyle.mMedium, color: color.main.brand }}>{name}</code>
        <span style={{ ...textStyle.sRegular, color: color.main.description }}>{role}</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: spacing.s }}>
        {children}
      </div>
    </div>
  );
}
