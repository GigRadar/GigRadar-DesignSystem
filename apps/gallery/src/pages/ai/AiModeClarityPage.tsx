import { color, spacing, textStyle } from '@gigradar/theme';
import { HStack, LifecycleBadge, SettingsSection, VStack } from '@gigradar/ui';
import { DevelopmentPlaceholder, Proposal } from '../../components/DevelopmentPlaceholder';
import { Frame } from '../../components/Frame';
import { PHONE_WIDTH, SettingsScreen } from '../../demos/settingsScreen';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { PROPOSALS } from '../../proposals/AiModeClarityProposals';
import { Caption } from '../middle/parts';

/** The width the settings screen is drawn at — the Figma frame's. */
const SCREEN_WIDTH = 1421;

/**
 * The Auto Reply section under review, in place of the shipped one.
 *
 * Replaced rather than added beside: every change here lands inside the card
 * that already ships, and two Auto Reply cards on one screen would leave the
 * reviewer asking which is real.
 */
function AutoReplyUnderReview({ phone = false }: { phone?: boolean }) {
  return (
    <SettingsSection
      title={
        <HStack gap="xs" alignItems="center">
          Auto Reply
          <LifecycleBadge stage="development" />
        </HStack>
      }
      description="How much of a reply Laziza sends by itself — for the first reply, and for the rest of the thread."
    >
      {/* SettingsSection sizes its children to their content; the full-width
          wrapper holds the card to the pane, so a phone's tab strip truncates
          its labels rather than pushing the card past the screen edge. */}
      <div style={{ width: '100%' }}>
        <DevelopmentPlaceholder
          title="Mode clarity and stop rules"
          problem="A line per mode, the 68% reply rate, a template for all other replies — and the stop rules, which is the open question: fixed, switchable, or fixed plus your own."
          proposalCount={PROPOSALS.length}
        >
          <VStack gap="l">
            {PROPOSALS.map((p) => (
              <Proposal
                key={p.number}
                number={p.number}
                approach={p.approach}
                rationale={p.rationale}
              >
                {p.render({ phone })}
              </Proposal>
            ))}
          </VStack>
        </DevelopmentPlaceholder>
      </div>
    </SettingsSection>
  );
}

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Auto Reply — BF-4113, under review.
 *
 * Not in the nav: a surface with competing proposals is not something to
 * build against, so it is reached from its review Artifact (listed in
 * `developmentArtifacts.ts`). The page stays in the tree because the
 * Artifact's screenshots are captured from it.
 *
 * The desktop screen and the phone pane sit side by side where the window has
 * room for both, and wrap where it does not — the same card answers
 * differently at 402px (the modes stack, the lock loses its label), and that
 * difference is only visible when the two are compared rather than
 * remembered.
 */
export function AiModeClarityPage() {
  return (
    <>
      <PageHeader
        title="Auto Reply — mode clarity"
        description="What each mode does, why the first reply is worth handing over, and what Laziza will never do by itself. BF-4113."
      />

      <CrossLink
        eyebrow="The problem it solves"
        links={[
          { label: 'CRM ▸ AI Configuration', pageId: 'crm-settings-ai' },
          { label: 'AI ▸ Auto Reply', pageId: 'crm-ai-auto-reply' },
        ]}
      >
        From the CRM usage audit: 111 people opened the AI settings page, and only 27 teams saved
        anything — the modes are not clear. When the AI answers a client first the client replies
        68% of the time, against 50% when a person answers, and that is not shown anywhere. None of
        16 teams has configured “all other replies”.
      </CrossLink>

      <Section
        title="The screen"
        description="Auto Reply is replaced by the section under review; everything else is the shipped screen. Open the development card to see the three proposals — each opens on All other replies, where the stop rules live."
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: spacing.l,
            alignItems: 'flex-start',
          }}
        >
          <VStack gap="xs">
            <span style={{ ...textStyle.sMedium, color: color.main.description }}>
              Desktop · {SCREEN_WIDTH}px
            </span>
            <div data-state-screen="screen">
              <Frame wide={SCREEN_WIDTH} height="auto">
                <SettingsScreen instead={{ autoReply: <AutoReplyUnderReview /> }} />
              </Frame>
            </div>
          </VStack>
          <VStack gap="xs">
            <span style={{ ...textStyle.sMedium, color: color.main.description }}>
              Phone · {PHONE_WIDTH}px, the AI Configuration pane
            </span>
            <div data-state-screen="screen-mobile">
              <Frame hug height="auto">
                <SettingsScreen phone instead={{ autoReply: <AutoReplyUnderReview phone /> }} />
              </Frame>
            </div>
          </VStack>
        </div>
      </Section>

      <Section
        title="Settled across all three"
        description="Drawn the same in every proposal, so the eye goes to the stop rules."
      >
        <Caption>
          One line per mode, under the mode row, changing as the mode changes — what happens once it
          is on, and where the result shows up. Under the row rather than in each option: the
          option’s description is a single truncated line on a desktop and is dropped on a phone.
        </Caption>
        <Caption>
          The reply rate under the First reply modes, with the AI figure in weight and an up
          indicator. The tabs are renamed First reply and All other replies, the words the audit
          uses.
        </Caption>
        <Caption>
          The template picker is deliberately plain. BF-4111 is deciding the custom prompt’s picker,
          and this one follows whichever shape wins there.
        </Caption>
      </Section>

      <Section title="Still open" description="What none of the three answers.">
        <Caption>
          Whether the modes should be renamed Autopilot and Copilot, as the ticket calls them —
          every proposal keeps the shipped Full Auto and Co-pilot.
        </Caption>
        <Caption>
          Whether the stop rules also hold on the first reply. Every proposal draws them on All
          other replies, where the ticket places them.
        </Caption>
      </Section>
    </>
  );
}
