import { color, radius, spacing, textStyle } from '@gigradar/theme';
import { HStack, LifecycleBadge, SettingsSection, VStack } from '@gigradar/ui';
import type { ReactNode } from 'react';
import { DevelopmentPlaceholder, Proposal } from '../../components/DevelopmentPlaceholder';
import { Frame } from '../../components/Frame';
import { SettingsScreen } from '../../demos/settingsScreen';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import {
  DEFAULT_PROMPT,
  PROPOSALS,
  SharedPromptSetup,
  TEMPLATES,
  type SetupInitial,
  type SetupRenderOptions,
} from '../../proposals/CustomPromptSetupProposals';
import { Caption } from '../middle/parts';

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Custom Prompt — setup. BF-4111, under
 * review.
 *
 * Not in the nav: a surface under development is reached through its review
 * Artifact (`developmentArtifacts.ts`), and this page is what that Artifact's
 * screenshots are captured from. The screen around the proposals is the real
 * one — `SettingsScreen`, assembled from the shipped rail, header and sections
 * — with the Custom Prompt section replaced by the block under review.
 */

/** The desktop a state frame is drawn at — the settings pane is flexible. */
const DESKTOP_WIDTH = 1024;

/** The phone every state is drawn beside. */
const PHONE_WIDTH = 402;

/** The Custom Prompt section, marked as under review, holding whatever it is given. */
function PromptSection({ children }: { children: ReactNode }) {
  return (
    <SettingsSection
      title={
        <HStack gap="xs" alignItems="center">
          Custom Prompt
          <LifecycleBadge stage="development" />
        </HStack>
      }
      description="The instructions Laziza follows on every CRM run. Until you save a prompt of your own, Laziza uses GigRadar’s default."
    >
      {children}
    </SettingsSection>
  );
}

/** The three proposals, in the placeholder the screen draws collapsed. */
function Proposals({ phone }: { phone?: boolean }) {
  return (
    <PromptSection>
      <DevelopmentPlaceholder
        title="Custom prompt setup"
        problem="Two teams switched on a “custom” prompt that was still GigRadar’s default, and a team that clears the field gets a blank box. Start empty, guide what to write, offer templates — and keep Save off until the prompt is theirs."
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
              {proposal.render({ phone })}
            </Proposal>
          ))}
        </VStack>
      </DevelopmentPlaceholder>
    </PromptSection>
  );
}

/**
 * One state: its name, when it happens, and the screen at both widths, the
 * phone beside the desktop so the two are compared rather than remembered.
 */
function StatePair({
  name,
  slug,
  trigger,
  settled,
  draw,
}: {
  name: string;
  /** The capture hook — `-mobile` is added for the phone frame. */
  slug: string;
  trigger: ReactNode;
  /** Settled states are the same in all three proposals. */
  settled?: boolean;
  draw: (options: SetupRenderOptions) => ReactNode;
}) {
  return (
    <VStack gap="s" mb="xl">
      <HStack gap="s" alignItems="center" flexWrap="wrap">
        <span style={{ ...textStyle.lSemibold, color: color.navbar.text2 }}>{name}</span>
        {settled ? (
          <span
            style={{
              ...textStyle.sMedium,
              color: color.main.description,
              border: `1px solid ${color.navbar.border}`,
              borderRadius: radius.xs,
              padding: `0 ${spacing.xxs}px`,
            }}
          >
            Settled · same in all three
          </span>
        ) : (
          <LifecycleBadge stage="development" />
        )}
      </HStack>
      <p style={{ ...textStyle.mRegular, color: color.main.description, margin: 0, maxWidth: 720 }}>
        {trigger}
      </p>
      <Frame wide={DESKTOP_WIDTH + PHONE_WIDTH + spacing.l + 2} height="auto">
        <div style={{ display: 'flex', gap: spacing.l, alignItems: 'flex-start', padding: 0 }}>
          <VStack gap="xs" width={DESKTOP_WIDTH} flex="0 0 auto">
            <span style={{ ...textStyle.sMedium, color: color.main.description }}>
              Desktop · {DESKTOP_WIDTH}px
            </span>
            <div data-state-screen={slug}>
              <SettingsScreen
                height="auto"
                through="prompt"
                replace={{ prompt: <PromptSection>{draw({})}</PromptSection> }}
              />
            </div>
          </VStack>
          <VStack gap="xs" width={PHONE_WIDTH} flex="0 0 auto">
            <span style={{ ...textStyle.sMedium, color: color.main.description }}>
              Phone · {PHONE_WIDTH}px, the Prompt pane
            </span>
            <div data-state-screen={`${slug}-mobile`}>
              <SettingsScreen
                phone
                height="auto"
                through="prompt"
                replace={{ prompt: <PromptSection>{draw({ phone: true })}</PromptSection> }}
              />
            </div>
          </VStack>
        </div>
      </Frame>
    </VStack>
  );
}

/** Draws the shared, picker-less card from a starting state. */
const shared = (initial: SetupInitial) => (options: SetupRenderOptions) =>
  <SharedPromptSetup {...options} initial={initial} />;

/** Draws one proposal from a starting state. */
const proposal = (index: number, initial: SetupInitial) => (options: SetupRenderOptions) =>
  PROPOSALS[index]?.render({ ...options, initial });

const AGENCY = TEMPLATES[1]!;

/** The agency template with its blanks filled — a prompt that can be saved. */
const AGENCY_FILLED = AGENCY.body
  .replace('[team size]', '4')
  .replace("[lead's name]", 'Marta')
  .replace('[rate]', '$45/h')
  .replace('[start date]', 'next Monday')
  .replace('[calendar link]', 'calendly.com/northwind/intro');

/** The template states every proposal is drawn in. */
const TEMPLATE_STATES: { key: string; name: string; trigger: string; initial: SetupInitial }[] = [
  {
    key: 'default',
    name: 'Default',
    trigger: 'First visit, popup already dismissed: nothing written, nothing picked.',
    initial: { popup: false },
  },
  {
    key: 'hover',
    name: 'Hover',
    trigger:
      'The pointer is over “Agency”. On a phone there is no hover, so the phone frame shows the same rest state.',
    initial: { popup: false, hoverId: 'agency', menuOpen: true },
  },
  {
    key: 'selected',
    name: 'Selected — preview',
    trigger:
      '“Agency” is picked and previewed read-only, with its blanks listed. Nothing has touched the field yet.',
    initial: { popup: false, selectedId: 'agency', menuOpen: true },
  },
  {
    key: 'applied',
    name: 'Applied',
    trigger:
      'The template is in the field and editable. Its blanks are still there, so Save stays off and the footer names them.',
    initial: { popup: false, text: AGENCY.body, appliedId: 'agency', writing: true },
  },
];

export function CustomPromptSetupPage() {
  return (
    <>
      <PageHeader
        title="Custom Prompt setup"
        description="An empty field, guidance on what to write, and ready templates instead of a blank box. BF-4111 — one decision, three proposals."
      />

      <CrossLink
        eyebrow="The problem"
        links={[
          { label: 'CRM ▸ AI Configuration', pageId: 'crm-settings-ai' },
          { label: 'AI ▸ Custom Prompt', pageId: 'crm-ai-prompt' },
        ]}
      >
        From the CRM usage audit: two teams turned on a “custom” prompt that was still the default
        text, and believe their agent is configured. The field pre-fills with the default, so Save
        is one click from a prompt nobody wrote — and a team that clears it gets a blank box with no
        idea what belongs in it.
      </CrossLink>

      <Section
        title="The screen, with the decision in place"
        description="Everything except the Custom Prompt block is the shipped screen — SettingsPanel, SettingsHeader, and a SettingsSection per block. The block under review replaces the shipped Custom Prompt card rather than sitting beside it. The phone is beside the desktop."
      >
        <Frame wide={1421 + PHONE_WIDTH + spacing.l + 2} height="auto">
          <div style={{ display: 'flex', gap: spacing.l, alignItems: 'flex-start' }}>
            <VStack gap="xs" width={1421} flex="0 0 auto">
              <span style={{ ...textStyle.sMedium, color: color.main.description }}>
                Desktop · 1421px
              </span>
              <div data-screen-shot="desktop">
                <SettingsScreen replace={{ prompt: <Proposals /> }} />
              </div>
            </VStack>
            <VStack gap="xs" width={PHONE_WIDTH} flex="0 0 auto">
              <span style={{ ...textStyle.sMedium, color: color.main.description }}>
                Phone · 402px
              </span>
              <div data-screen-shot="phone">
                <SettingsScreen phone replace={{ prompt: <Proposals phone /> }} />
              </div>
            </VStack>
          </div>
        </Frame>
        <Caption>
          The card is collapsed until opened, so the screen first reads as it will once one proposal
          has won and the other two are deleted.
        </Caption>
      </Section>

      <Section
        title="Settled — the same in all three"
        description="The field starts empty, Save is off until the prompt is the team’s own, the guidance tip lists the five points, and the first-visit popup goes for good once closed. Drawn without any picker, so none of it reads as belonging to one proposal."
      >
        <StatePair
          settled
          name="First visit — empty, popup open"
          slug="first-visit"
          trigger="The field is empty with its example placeholder. The popup points at the default badge; it closes for good on Got it, a click elsewhere, the first keystroke, or a template applied."
          draw={shared({ popup: true })}
        />
        <StatePair
          settled
          name="Guidance tooltip"
          slug="tooltip"
          trigger="The info mark beside “Your prompt”: rate, start date, agency or solo, calendar link, and what Laziza must never say. Hover on a desktop, tap on a phone."
          draw={shared({ popup: false, tipOpen: true })}
        />
        <StatePair
          settled
          name="Typing"
          slug="typing"
          trigger="The placeholder is gone at the first keystroke. The text is the team’s own, so Save is on."
          draw={shared({
            popup: false,
            text: 'We are a 3-person Webflow studio. Our rate is $45/h and we can start next Monday.',
          })}
        />
        <StatePair
          settled
          name="Unchanged from the default — Save off"
          slug="unchanged-default"
          trigger="The default text pasted back in (whitespace aside). Save is off and the footer says why — this is the audit’s two teams, caught."
          draw={shared({ popup: false, text: DEFAULT_PROMPT })}
        />
        <StatePair
          settled
          name="Changed — Save on"
          slug="changed"
          trigger="A template with every blank filled in. Save is on, and the badge says the prompt is not saved yet."
          draw={shared({ popup: false, text: AGENCY_FILLED, appliedId: 'agency' })}
        />
      </Section>

      {PROPOSALS.map((p, index) => (
        <Section
          key={p.number}
          title={`Proposal ${p.number} — ${p.approach}`}
          description={p.rationale}
          stage="development"
        >
          {TEMPLATE_STATES.map((state) => (
            <StatePair
              key={state.key}
              name={state.name}
              slug={`p${p.number}-${state.key}`}
              trigger={state.trigger}
              draw={proposal(index, state.initial)}
            />
          ))}
        </Section>
      ))}

      <Section
        title="Open for review"
        description="Whether an applied template with blanks left should block Save outright, as drawn, or only warn. Blocking is the same rule as the unchanged default one step later; warning trusts a team that deliberately leaves “[calendar link]” for later. The templates are placeholders for Appendix A of the usage report."
      >
        <Caption>
          Once a proposal is picked, the winner moves into <code>packages/ui</code> — most likely as
          props on <code>AiPromptConfig</code> (placeholder, a save rule, templates) rather than a
          new card — and gets the usual live example, usage snippet and props table. The losers are
          deleted with the proposals file.
        </Caption>
      </Section>
    </>
  );
}
