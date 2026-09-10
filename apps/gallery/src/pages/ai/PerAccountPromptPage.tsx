import { HStack, LifecycleBadge, SettingsSection, VStack } from '@gigradar/ui';
import { DevelopmentPlaceholder, Proposal } from '../../components/DevelopmentPlaceholder';
import { SettingsScreen } from '../../demos/settingsScreen';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { AUTO_REPLY_PROPOSALS } from '../../proposals/AccountAutoReplyProposals';
import { PROPOSALS } from '../../proposals/AccountPromptProposals';
import { Caption } from '../middle/parts';

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Per-Account Prompt.
 *
 * BF-4280, under review. The screen around the proposals is the real one,
 * assembled from the components that ship it — rail, header, and the four
 * sections that already exist. Only the two blocks under review are new, and
 * each is a `DevelopmentPlaceholder` holding three competing proposals.
 *
 * Drawn in place rather than on a page of their own: an account prompt sits
 * directly under the team prompt it appends to, and per-account auto-reply
 * beside the team-level card it scopes — which is half of what makes either
 * legible.
 */
export function PerAccountPromptPage() {
  return (
    <>
      <PageHeader
        title="Per-Account AI Prompt"
        description="Scoping the AI prompt and auto-reply to a connected Upwork account rather than the whole team. BF-4280 — two decisions, three proposals each."
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
        marketing, logistics. Both the prompt and the auto-reply mode are set once at team level, so
        any single value is right for one profile and wrong for the other two. The inbox already
        filters by account, so the system knows which profile a chat belongs to; neither setting has
        access to that.
      </CrossLink>

      <Section
        title="The screen, with both decisions in place"
        description="Everything except the two development cards is the shipped screen — SettingsPanel for the rail, SettingsHeader, and a SettingsSection per block wrapping AiPromptConfig, MentionPresetList, AutoReply and AiTool. Scroll the pane: Account Prompt sits under the team prompt it appends to, and per-account auto-reply beside the team-level card it scopes."
      >
        <SettingsScreen
          after={{
            prompt: (
              <SettingsSection
                title={
                  <HStack gap="xs" alignItems="center">
                    Account Prompt
                    <LifecycleBadge stage="development" />
                  </HStack>
                }
                description="Instructions for one connected Upwork account, added after the team prompt above. Three proposals, all appending one field per account and differing only in where that field lives."
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
              </SettingsSection>
            ),
            autoReply: (
              <SettingsSection
                title={
                  <HStack gap="xs" alignItems="center">
                    Auto Reply, per account
                    <LifecycleBadge stage="development" />
                  </HStack>
                }
                description="The same card as above, scoped to one account rather than the team. It already carries a mode per message class and “off” among those modes, so “this profile does not auto-reply” is a setting that exists rather than a switch to invent — what differs between the proposals is how an account is reached."
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
              </SettingsSection>
            ),
          }}
        />
        <Caption>
          Both cards are collapsed until opened, so the screen first reads as it would once one
          proposal per card has won and the rest are deleted.
        </Caption>
      </Section>

      <Section
        title="Deciding"
        description="Every proposal is drawn against fifty accounts as well as three — a shape that works at three and collapses at fifty is a layout, not a design, which is why an earlier tab strip and card stack were cut."
      >
        <Caption>
          Worth picking the same shape for both cards. If the list wins on the prompt section and the
          badge menu wins on auto-reply, the screen ends up with two ways of choosing an account for
          no reason a reader could name. My read is proposal 1 on both: three accounts is small
          enough that a list reads at a glance, and it is then the same list in both places.
        </Caption>
      </Section>

      <Section
        title="Open for review"
        description="Whether an account prompt should be able to replace the team prompt outright rather than only add to it. Every prompt proposal here appends, so this is the question none of them answers — worth settling before the pick rather than after. Robert's other two questions — splitting teams, and what breaks around billing, API keys, and connected-account limits — are product decisions, and nothing here commits to an answer."
      >
        <Caption>
          Once each card is decided, the winner moves into <code>packages/ui</code> and takes the
          section over with the usual live example, usage snippet and props table. The losers are
          deleted with the proposals file.
        </Caption>
      </Section>
    </>
  );
}
