import { color } from '@gigradar/theme';
import {
  Paywall,
  PaywallSwitchButton,
  PlanCard,
  PlanBadge,
  SubscriptionSwitch,
  type PaywallPeriod,
} from '@gigradar/ui';
import { useState, type ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PropsTable } from '../components/PropsTable';
import { PageHeader, Preview, Section } from '../layout';
import { CrossLink } from '../navigation';
import { cycles, pitch, plans } from '../fixtures/paywall';
import { Caption } from './inbox/parts';

/**
 * The headline, with the half that carries the argument set in brand blue.
 *
 * Passed as a node rather than a string because the emphasis is the caller's:
 * a paywall in another language breaks the phrase somewhere else, and a
 * component that split it on a fixed word would break with it.
 */
const TITLE = (
  <>
    Turn <span style={{ color: color.main.brand }}>Leads Into Clients</span> Faster.
  </>
);

/** The modal in one period, with its own cycle and plan state. */
function PaywallDemo({
  period,
  currentPlan,
  planBadge,
  daysRemaining,
  status,
  onRentApiKey,
}: {
  period: PaywallPeriod;
  currentPlan?: string;
  planBadge?: ReactNode;
  daysRemaining?: number;
  status?: ReactNode;
  onRentApiKey?: () => void;
}) {
  const [cycle, setCycle] = useState('monthly');

  return (
    <Paywall
      period={period}
      title={TITLE}
      description={pitch.description}
      cycles={cycles}
      cycle={cycle}
      onCycleChange={setCycle}
      plans={plans}
      currentPlan={currentPlan}
      daysRemaining={daysRemaining}
      status={status}
      planBadge={planBadge}
      onChoosePlan={() => undefined}
      onStartTrial={() => undefined}
      onRentApiKey={onRentApiKey}
    />
  );
}

/**
 * CRM ▸ Paywall.
 *
 * The locked modal that sells the plans, in each of the three periods Figma
 * draws for it. Figma node 1360:9925.
 */
export function PaywallPage() {
  return (
    <>
      <PageHeader
        title="Paywall"
        description="The locked modal that sells the CRM's plans — the period badge, the billing switch, the three plan cards, and the rented-key offer. Figma node 1360:9925."
      />

      <CrossLink
        eyebrow="Built from components"
        links={[
          { label: 'Components ▸ Badge', pageId: 'badge' },
          { label: 'CRM ▸ Settings ▸ Upwork API Key', pageId: 'crm-settings-api-key' },
        ]}
      >
        <strong>Paywall</strong> is the screen-level component: give it the plans and where the
        workspace stands, and it draws the modal. <strong>PlanCard</strong> and{' '}
        <strong>SubscriptionSwitch</strong> are exported beside it for screens that show a plan
        outside this modal. The rented-key offer is the shipped{' '}
        <strong>RentApiBanner</strong>, borrowed from the API key screen rather than redrawn.
      </CrossLink>

      <Section
        title="New — never subscribed"
        description="The modal is locked and every plan is on offer. Pro carries the `Most popular` flag, and Basic offers the free trial."
      >
        <Preview>
          <PaywallDemo period="new" />
        </Preview>
        <CodeBlock
          code={`<Paywall
  period="new"
  title={<>Turn <Highlight>Leads Into Clients</Highlight> Faster.</>}
  description={pitch}
  cycles={cycles}
  cycle={cycle}
  onCycleChange={setCycle}
  plans={plans}
  onChoosePlan={subscribe}
  onStartTrial={startTrial}
/>`}
        />
      </Section>

      <Section
        title="Current — already subscribed"
        description="One card is theirs and the rest become upgrades. The period badge counts down the trial instead of showing a lock, and the rented-key offer appears."
      >
        <Caption>
          The banner is shown only here. Someone who has not chosen a plan has a more immediate
          decision in front of them, which is why Figma hides it in both locked periods.
        </Caption>
        <Preview>
          <PaywallDemo
            period="current"
            currentPlan="basic"
            daysRemaining={23}
            planBadge={<PlanBadge tone="basic">Monthly Basic Plan</PlanBadge>}
            onRentApiKey={() => undefined}
          />
        </Preview>
      </Section>

      <Section
        title="Trial ended"
        description="`new` with the reason said out loud — the same locked row of offers, under a badge that says why."
      >
        <Preview>
          <PaywallDemo
            period="trialEnded"
            planBadge={
              <PlanBadge background={color.status.error.main}>Free Trial Ended</PlanBadge>
            }
          />
        </Preview>
      </Section>

      <Section
        title="PlanCard"
        description="One card per plan, and one component for all three: same width, same rows, and a tone that colours the edge, the bullets and the button."
      >
        <Caption>
          Every plan lists every feature, and the rows it does not include stay on the card in
          grey. Three cards of the same height with the same rows let the eye run across a row and
          see where the colour stops — which is the whole point of putting them side by side.
        </Caption>
        <Preview>
          <PlanCard {...plans[0]!} onAction={() => undefined} />
          <PlanCard {...plans[1]!} state="popular" onAction={() => undefined} />
          <PlanCard {...plans[2]!} state="current" onAction={() => undefined} />
        </Preview>
        <PropsTable
          rows={[
            {
              name: 'tone',
              type: "'basic' | 'pro' | 'unlimited'",
              default: "'basic'",
              description:
                "The plan's identity — the edge, the bullets and the button, and the colour its `PlanBadge` carries too.",
            },
            {
              name: 'state',
              type: "'default' | 'popular' | 'current'",
              default: "'default'",
              description:
                '`current` turns the button inert and says so; `popular` is the one being pushed.',
            },
            { name: 'price', type: 'ReactNode', description: 'The price, as it should read.' },
            { name: 'wasPrice', type: 'ReactNode', description: 'A struck-through price before it.' },
            {
              name: 'features',
              type: 'PlanFeature[]',
              description:
                'Every row, with `included` saying which this plan buys. Excluded rows stay, greyed.',
            },
            {
              name: 'trialLabel',
              type: 'ReactNode',
              description: 'The second button — "Start free trial". Omit to drop it.',
            },
          ]}
        />
      </Section>

      <Section
        title="SubscriptionSwitch"
        description="The billing-cycle track. It takes its segments as children — which cycles a product sells is the product's question, and Figma's own component carries Quarterly and Semi-annual hidden beside Monthly and Annual."
      >
        <Preview>
          <SubscriptionSwitch>
            <PaywallSwitchButton selected>Monthly</PaywallSwitchButton>
            <PaywallSwitchButton saving="Save 20%">Annual</PaywallSwitchButton>
          </SubscriptionSwitch>
          <SubscriptionSwitch>
            <PaywallSwitchButton>Monthly</PaywallSwitchButton>
            <PaywallSwitchButton>Quarterly</PaywallSwitchButton>
            <PaywallSwitchButton selected saving="Save 20%">
              Annual
            </PaywallSwitchButton>
          </SubscriptionSwitch>
        </Preview>
        <Caption>
          Only the cycle that saves money carries a pill, which is what makes it an argument rather
          than a label.
        </Caption>
        <CodeBlock
          code={`<SubscriptionSwitch>
  <PaywallSwitchButton selected={cycle === 'monthly'} onClick={() => setCycle('monthly')}>
    Monthly
  </PaywallSwitchButton>
  <PaywallSwitchButton
    selected={cycle === 'annual'}
    saving="Save 20%"
    onClick={() => setCycle('annual')}
  >
    Annual
  </PaywallSwitchButton>
</SubscriptionSwitch>`}
        />
      </Section>

      <Section
        title="PlanBadge"
        description="The pill that names a plan. Its colour is the plan's own, so a badge in a header and a card in the modal can be matched without reading either."
      >
        <Caption>
          Only the unpaid tones are quiet — <strong>trial</strong> and <strong>free</strong> sit on
          the nav wash in grey, because they name a state the workspace is passing through rather
          than a plan it is on.
        </Caption>
        <Preview>
          <PlanBadge tone="free" />
          <PlanBadge tone="trial" note="(7D Remaining)" />
          <PlanBadge tone="basic" />
          <PlanBadge tone="pro" />
          <PlanBadge tone="unlimited" />
        </Preview>
      </Section>
    </>
  );
}
