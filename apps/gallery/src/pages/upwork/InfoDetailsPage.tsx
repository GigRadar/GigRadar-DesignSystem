import { component } from '@gigradar/theme';
import {
  AccountSafetyNotice,
  AuthorizationSteps,
  AuthorizeBanner,
  UpworkConnectedAccounts,
  VStack,
} from '@gigradar/ui';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { ACCOUNTS } from '../../fixtures/upworkAccounts';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';

/**
 * CRM ▸ Settings ▸ Upwork Connected Account ▸ Info details.
 *
 * The screen's right column. Unlike the left, it does not change between the
 * screen's states — the same three cards throughout, with only the authorize
 * button's enabled-ness moving.
 */
const { sideWidth, sideGap } = component.upworkAccounts;

export function UpworkInfoDetailsPage() {
  return (
    <>
      <PageHeader
        title="Info details (Right)"
        description="The right column of the Upwork Connected Account screen — the authorize banner, the safety notice, and the numbered walkthrough. Figma node 2105:34594."
      />

      <CrossLink
        eyebrow="Built from CRM components"
        links={[
          { label: 'Components ▸ CRM ▸ Info details', pageId: 'info-details' },
          { label: 'The whole screen', pageId: 'crm-settings-upwork' },
        ]}
      >
        All three cards come from Components ▸ CRM ▸ Info details — <code>AuthorizeBanner</code>,{' '}
        <code>AccountSafetyNotice</code>, and <code>AuthorizationSteps</code>. This column stacks
        them at a fixed 285px and passes the one piece of screen state they care about: whether the
        API is connected.
      </CrossLink>

      <Section
        title="The column"
        description="Its own header over the three cards, exactly as the screen draws it. On the assembled screen this sits to the right of the account grid and takes whatever width the fixed 640px list leaves it."
      >
        {/*
          Hugging the column's own width rather than the page's, and scrolling
          rather than clipping: the cards are drawn at a fixed 285px, so a
          full-width frame would stretch the header above content that cannot
          follow it.
        */}
        <Frame hug scroll>
          <UpworkConnectedAccounts
            show="side"
            accounts={ACCOUNTS}
            capacity={10}
            onAuthorize={() => undefined}
            onInviteToWorkspace={() => undefined}
          />
        </Frame>
        <CodeBlock code={`<UpworkConnectedAccounts show="side" onAuthorize={authorize} />`} />
      </Section>

      <Section
        title="The three cards on their own"
        description="Stacked exactly as the column stacks them. The banner's gradient against the notice's plain white is what says which one is the thing to act on — the two sit at the same width in the same column, so fill is the only thing separating them."
      >
        <Preview>
          <VStack gap={sideGap} width={sideWidth}>
            <AuthorizeBanner onAuthorize={() => undefined} />
            <AccountSafetyNotice onInvite={() => undefined} />
            <AuthorizationSteps />
          </VStack>
        </Preview>
      </Section>

      <Section
        title="The one state it responds to"
        description="`apiConnected` is the only screen state this column reads. False greys the authorize action out, because there is nothing to authorize against until the API is in — the left column's empty state asks for that first, and the two together say which order they go in."
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
          code={`<VStack gap={19} style={{ width: 285 }}>
  <AuthorizeBanner disabled={!apiConnected} onAuthorize={authorize} />
  <AccountSafetyNotice onInvite={inviteToWorkspace} />
  <AuthorizationSteps />
</VStack>`}
        />
      </Section>
    </>
  );
}
