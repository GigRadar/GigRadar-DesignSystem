import { color, component, radius, textStyle } from '@gigradar/theme';
import { Button, HStack, Icon, IconInfoStroke, VStack } from '@gigradar/ui';
import { DevelopmentPlaceholder, Proposal } from '../../components/DevelopmentPlaceholder';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { AUTO_REPLY_PROPOSALS } from '../../proposals/AccountAutoReplyProposals';
import { PROPOSALS } from '../../proposals/AccountPromptProposals';
import { Caption, SettingsPanel, Surface } from '../middle/parts';

const { accountPrompt } = component;

const noop = () => undefined;

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Per-Account Prompt.
 *
 * BF-4280, under review. Both halves of the screen are competing proposals
 * inside development cards — how an account gets its own prompt, and how it
 * gets its own auto-reply settings. Only the empty state is settled, because
 * every proposal draws it the same way.
 */
export function PerAccountPromptPage() {
  return (
    <>
      <PageHeader
        title="Per-Account AI Prompt"
        description="Scoping the AI prompt to a connected Upwork account rather than the whole team. BF-4280 — three proposals under review."
      />

      <CrossLink
        eyebrow="The problem"
        links={[
          { label: 'CRM ▸ AI Configuration', pageId: 'crm-settings-ai' },
          { label: 'AI ▸ Custom Prompt', pageId: 'crm-ai-prompt' },
          { label: 'AI ▸ Auto Reply', pageId: 'crm-ai-auto-reply' },
        ]}
      >
        One team, three Upwork profiles, three unrelated niches — AI/CRM automation, social media
        marketing, logistics. The prompt is set once at team level, so any single prompt is wrong
        for two of the three: wrong standard answers, wrong do-not-offer list, wrong positioning.
        The inbox already filters by account, so the system knows which profile a chat belongs to;
        the prompt just has no access to that.
      </CrossLink>

      <Section
        stage="development"
        title="Scoping the prompt"
        description="Not part of the design system yet. Three proposals are under review. All of them do the same thing — one prompt field per account, appended after the team prompt — and differ only in where that field lives: inline in the row, in a panel beside the list, or all of them on the page at once. Open the card to compare them; whichever is approved takes this section over, with the usual live example, usage snippet, and props table."
      >
        <DevelopmentPlaceholder
          title="Account prompt"
          problem="A team running unrelated niches on separate Upwork profiles gets one team-level prompt that is wrong for every profile but one. Give an account instructions of its own, and say plainly which text wins when the two disagree."
          proposalCount={PROPOSALS.length}
        >
          <VStack gap="l">
            {PROPOSALS.map((proposal) => (
              <Proposal
                key={proposal.number}
                number={proposal.number}
                approach={proposal.approach}
                rationale={proposal.rationale}
              >
                {proposal.render()}
              </Proposal>
            ))}
          </VStack>
        </DevelopmentPlaceholder>
      </Section>

      <Section
        stage="development"
        title="Auto-reply, per account"
        description="Also under review. The AutoReply card is used unchanged in all three — it already carries a mode per message class and “off” among those modes, so “this profile does not auto-reply” is a setting that exists rather than a switch to invent. What differs is how an account is reached, drawn against fifty accounts as well as three: a design that only works at three is not one."
      >
        <DevelopmentPlaceholder
          title="Account auto-reply"
          problem="Stopping one profile from auto-replying currently means writing “do not auto-reply from account X” into the team prompt — asking a language model to enforce a rule the system could guarantee outright."
          proposalCount={AUTO_REPLY_PROPOSALS.length}
        >
          <VStack gap="l">
            {AUTO_REPLY_PROPOSALS.map((proposal) => (
              <Proposal
                key={proposal.number}
                number={proposal.number}
                approach={proposal.approach}
                rationale={proposal.rationale}
              >
                {proposal.render()}
              </Proposal>
            ))}
          </VStack>
        </DevelopmentPlaceholder>
        <Caption>
          Worth picking the same shape for both cards. If the prompt list wins upstairs and tabs win
          here, the screen ends up with two ways of choosing an account for no reason a reader could
          name.
        </Caption>
      </Section>

      <Section
        title="No accounts yet"
        description="The one settled part — every proposal on this page draws it the same way, because none of them has anything to show until an account exists. It points at the thing that has to happen first rather than reporting that a list is empty."
      >
        <Surface>
          <SettingsPanel>
            <VStack
              alignItems="center"
              gap={accountPrompt.emptyGap}
              p={accountPrompt.emptyPadding}
              textAlign="center"
            >
              <HStack
                width={accountPrompt.emptyMarkSize}
                height={accountPrompt.emptyMarkSize}
                radius={radius.round}
                alignItems="center"
                justifyContent="center"
                background={color.badge.background}
              >
                <Icon
                  icon={IconInfoStroke}
                  size={accountPrompt.emptyIconSize}
                  color={color.badge.foreground}
                />
              </HStack>
              <span style={{ ...textStyle.lMedium, color: color.main.black }}>
                No accounts connected
              </span>
              <span
                style={{
                  ...textStyle.mRegular,
                  color: color.main.description,
                  maxWidth: accountPrompt.emptyMaxWidth,
                }}
              >
                Connect an Upwork account to give it its own prompt. Until then the team prompt
                applies to everything.
              </span>
              <Button size="small" onClick={noop}>
                Connect an account
              </Button>
            </VStack>
          </SettingsPanel>
        </Surface>
      </Section>

      <Section
        title="Open for review"
        description="Whether an account prompt should be able to replace the team prompt outright rather than only add to it. Every prompt proposal here appends, so this is the question none of them answers — worth settling before the pick rather than after. Robert's other two questions — splitting teams, and what breaks around billing, API keys, and connected-account limits — are product decisions, and nothing here commits to an answer."
      >
        <Caption>
          My read on both cards: proposal 1. Three accounts is small enough that a list reads at a
          glance, and it is the same list in both halves of the screen, so an account is chosen one
          way here whatever is being set. Proposal 3 wins in either card only if the job is
          comparing accounts rather than setting one.
        </Caption>
      </Section>
    </>
  );
}
