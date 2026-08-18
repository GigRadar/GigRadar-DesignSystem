import { color, component, spacing } from '@gigradar/theme';
import { AccountSafetyNotice, AuthorizationSteps, AuthorizeBanner, VStack } from '@gigradar/ui';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';

/**
 * The column's own metrics, read from the screen's tokens rather than retyped.
 *
 * The examples below are the right column as the Upwork screen draws it, so
 * they have to be the same 285px and 19px it uses — a literal here would
 * silently stop matching the moment the token moved.
 */
const { sideWidth, sideGap } = component.upworkAccounts;

/**
 * The three cards that make up an integration's explanatory column.
 *
 * One page because none of them is much use alone: the banner asks for the
 * action, the notice qualifies it, and the steps say what happens next. A
 * screen that wants one almost always wants all three, stacked.
 */
export function InfoDetailsPage() {
  return (
    <>
      <PageHeader
        title="Info details"
        description="The explanatory column beside an integration list — the authorize banner, the safety notice, and the numbered walkthrough. Figma nodes 2130:2521, 4893:16319, and 2116:3340."
      />

      <CrossLink
        eyebrow="Where it is used"
        links={[
          { label: 'CRM ▸ Settings ▸ Upwork ▸ Info details (Right)', pageId: 'crm-upwork-info' },
          { label: 'Components ▸ Button', pageId: 'button' },
        ]}
      >
        The Upwork Connected Account screen stacks all three in its right column at a fixed 285px.
        Each is exported on its own, so a screen can take just the banner or just the steps.
      </CrossLink>

      <Section
        title="The three, stacked"
        description="How the screen draws them. The banner carries a gradient wash and the notice is plain white — that contrast is what says which one is the thing to act on, since the two sit at the same width in the same column."
      >
        <Preview>
          <VStack gap={sideGap} width={sideWidth}>
            <AuthorizeBanner onAuthorize={() => undefined} />
            <AccountSafetyNotice onInvite={() => undefined} />
            <AuthorizationSteps />
          </VStack>
        </Preview>
        <CodeBlock
          code={`<VStack gap={19} width={285}>
  <AuthorizeBanner disabled={!apiConnected} onAuthorize={authorize} />
  <AccountSafetyNotice onInvite={inviteToWorkspace} />
  <AuthorizationSteps />
</VStack>`}
        />
      </Section>

      <Section
        title="AuthorizeBanner"
        description="A title, a line of explanation, and the action. Its disabled state is what the screen leans on: greyed until an API connection exists, which is how the right column says the left column has to come first."
      >
        <Preview>
          <div style={{ width: sideWidth }}>
            <AuthorizeBanner onAuthorize={() => undefined} />
          </div>
          <div style={{ width: sideWidth }}>
            <AuthorizeBanner disabled />
          </div>
        </Preview>
        <CodeBlock
          code={`<AuthorizeBanner
  title="Connect Upwork Account"
  description="Click below to authorize and connect your Upwork account securely via OAuth 2.0"
  actionLabel="Authorize Account"
  disabled={!apiConnected}
  onAuthorize={() => startOAuth()}
/>`}
        />
      </Section>

      <Section
        title="AccountSafetyNotice"
        description="White with an amber plate rather than a full amber card. The notice is permanent on the screen — nothing the user did raised it — and an amber card standing beside the blue banner would read as an error to act on. Its one action is the invite the paragraph asks for, and it drops out entirely when no handler is passed."
      >
        <Preview>
          <div style={{ width: sideWidth }}>
            <AccountSafetyNotice onInvite={() => undefined} />
          </div>
          <div style={{ width: sideWidth }}>
            <AccountSafetyNotice />
          </div>
        </Preview>
        <CodeBlock
          code={`// One action, and it is what the notice's own text asks for.
// Omit the handler and the button drops out entirely.
<AccountSafetyNotice onInvite={() => inviteOwnerToWorkspace()} />

// Pass your own copy:
<AccountSafetyNotice inviteLabel="Send Invite Link">
  For security reasons, logging into multiple Upwork accounts…
</AccountSafetyNotice>`}
        />
      </Section>

      <Section
        title="AuthorizationSteps"
        description="The numbered walkthrough. `boxed` draws each row on its own white card — the form the authorization popup uses, with its discs recolored to the state. Everything else about the two is identical, which is why it is one component."
      >
        <Preview>
          <div style={{ width: sideWidth }}>
            <AuthorizationSteps />
          </div>
          {/* Stood on the page background at the popup's own radius, which is
              the surface `boxed` is drawn against — the white cards do not
              read as cards on white. */}
          <div
            style={{
              width: sideWidth,
              padding: spacing.s,
              background: color.main.background,
              borderRadius: component.upworkAccounts.popup.panelRadius,
            }}
          >
            <AuthorizationSteps title={null} boxed />
          </div>
        </Preview>
        <CodeBlock
          code={`<AuthorizationSteps />                       // bare rows, with a heading
<AuthorizationSteps title={null} boxed />    // white cards, no heading

<AuthorizationSteps
  steps={['Click "Authorize Account"', 'Login to Upwork', 'Grant access', 'Return here']}
  markerBackground={accent}
/>`}
        />
      </Section>

      <Section title="Props">
        <PropsTable
          rows={[
            { name: 'AuthorizeBanner ▸ title / description', type: 'ReactNode', description: 'The heading and the line under it. Both have defaults.' },
            { name: 'AuthorizeBanner ▸ actionLabel', type: 'ReactNode', description: 'The button’s label.' },
            { name: 'AuthorizeBanner ▸ onAuthorize', type: '() => void', description: 'Fires when the button is pressed.' },
            { name: 'AuthorizeBanner ▸ disabled', type: 'boolean', default: 'false', description: 'Greys the action out — the “API not connected” state.' },
            { name: 'AuthorizeBanner ▸ renderAction', type: 'RenderProp', description: 'Replaces the action. Call `defaultRender()` to decorate rather than replace.' },
            { name: 'AccountSafetyNotice ▸ title / children', type: 'ReactNode', description: 'The heading and the warning itself. Both have defaults.' },
            { name: 'AccountSafetyNotice ▸ inviteLabel / onInvite', type: `ReactNode / () => void`, description: 'The workspace invite — the action the notice’s text asks for. Defaults to “Send Invite Link”. Omitting the handler drops the button.' },
            { name: 'AuthorizationSteps ▸ title', type: 'ReactNode', default: `'Authorization Steps'`, description: 'The heading. Pass `null` to drop it.' },
            { name: 'AuthorizationSteps ▸ steps', type: 'ReactNode[]', description: 'The steps, in order. Numbering comes from position.' },
            { name: 'AuthorizationSteps ▸ boxed', type: 'boolean', default: 'false', description: 'Wraps each row in its own white card — how the popup draws them.' },
            { name: 'AuthorizationSteps ▸ markerBackground', type: 'string', description: 'The numbered disc’s fill. The popup recolors it per state.' },
            { name: 'AuthorizationSteps ▸ renderStep', type: 'RenderProp', description: 'Replaces a step. Call `defaultRender()` to decorate.' },
          ]}
        />
      </Section>
    </>
  );
}
