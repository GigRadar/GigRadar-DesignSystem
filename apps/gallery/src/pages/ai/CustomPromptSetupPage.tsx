import { color, spacing, textStyle } from '@gigradar/theme';
import {
  HStack,
  LifecycleBadge,
  PromptSetup,
  SettingsSection,
  VStack,
  type PromptSetupProps,
} from '@gigradar/ui';
import type { ReactNode } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PropsTable } from '../../components/PropsTable';
import { SettingsScreen } from '../../demos/settingsScreen';
import { AGENCY_FILLED, DEFAULT_PROMPT, PROMPT_TEMPLATES } from '../../fixtures/promptSetup';
import { VARIABLES } from '../../fixtures/prompt';
import { PageHeader, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption } from '../middle/parts';

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Custom Prompt — setup. BF-4111.
 *
 * Proposal 1 of three ("the templates are the empty card") was picked and is
 * built as `PromptSetup` and `PromptTemplatePicker` in `packages/ui`. It stays
 * marked in development until the built result is reviewed, so the page is
 * still reached through its review Artifact (`developmentArtifacts.ts`) rather
 * than the nav, and it is what that Artifact's screenshots are captured from.
 */

/** The desktop a state frame is drawn at — the settings pane is flexible. */
const DESKTOP_WIDTH = 1024;

/** The phone every state is drawn beside. */
const PHONE_WIDTH = 402;

/** The Custom Prompt section, marked as in development, holding the setup card. */
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

/** The card as the screen wires it, from a starting state. */
function Setup(props: Partial<PromptSetupProps>) {
  return (
    <PromptSetup
      defaultPrompt={DEFAULT_PROMPT}
      templates={PROMPT_TEMPLATES}
      variables={VARIABLES}
      {...props}
    />
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
  initial,
}: {
  name: string;
  /** The capture hook — `-mobile` is added for the phone frame. */
  slug: string;
  trigger: ReactNode;
  initial: Partial<PromptSetupProps>;
}) {
  return (
    <VStack gap="s" mb="xl">
      <span style={{ ...textStyle.lSemibold, color: color.navbar.text2 }}>{name}</span>
      <p style={{ ...textStyle.mRegular, color: color.main.description, margin: 0, maxWidth: 720 }}>
        {trigger}
      </p>
      <Frame wide={DESKTOP_WIDTH + PHONE_WIDTH + spacing.l + 2} height="auto">
        <div style={{ display: 'flex', gap: spacing.l, alignItems: 'flex-start' }}>
          <VStack gap="xs" width={DESKTOP_WIDTH} flex="0 0 auto">
            <FrameLabel>Desktop · {DESKTOP_WIDTH}px</FrameLabel>
            <div data-state-screen={slug}>
              <SettingsScreen
                height="auto"
                through="prompt"
                replace={{
                  prompt: (
                    <PromptSection>
                      <Setup {...initial} />
                    </PromptSection>
                  ),
                }}
              />
            </div>
          </VStack>
          <VStack gap="xs" width={PHONE_WIDTH} flex="0 0 auto">
            <FrameLabel>Phone · {PHONE_WIDTH}px, the Prompt pane</FrameLabel>
            <div data-state-screen={`${slug}-mobile`}>
              <SettingsScreen
                phone
                height="auto"
                through="prompt"
                replace={{
                  prompt: (
                    <PromptSection>
                      <Setup {...initial} narrow />
                    </PromptSection>
                  ),
                }}
              />
            </div>
          </VStack>
        </div>
      </Frame>
    </VStack>
  );
}

function FrameLabel({ children }: { children: ReactNode }) {
  return <span style={{ ...textStyle.sMedium, color: color.main.description }}>{children}</span>;
}

/** Every state the card can be in, drawn at both widths. */
const STATES: {
  slug: string;
  name: string;
  trigger: string;
  initial: Partial<PromptSetupProps>;
}[] = [
  {
    slug: 'first-visit',
    name: 'First visit — templates, popup open',
    trigger:
      'Nothing written, so the card is five templates and “Write my own”. The popup points at the default badge and closes for good on Got it, a click elsewhere, the first keystroke, or a template used.',
    initial: { defaultFirstVisit: true },
  },
  {
    slug: 'template-hover',
    name: 'Template — hover',
    trigger:
      'The pointer is over “Agency”, which says it previews. A phone has no hover, so its frame shows the tiles at rest.',
    initial: { defaultHighlightedTemplateId: 'agency' },
  },
  {
    slug: 'template-selected',
    name: 'Template — selected, preview',
    trigger:
      '“Agency” opens read-only in the field’s place, with its blanks listed. Nothing has touched the field yet.',
    initial: { defaultSelectedTemplateId: 'agency' },
  },
  {
    slug: 'template-applied',
    name: 'Template — applied',
    trigger:
      'The template is in the field and editable, and “Change template” goes back. Its blanks are still there, so Save stays off and the footer names them.',
    initial: {
      defaultValue: PROMPT_TEMPLATES[1]!.body,
      defaultAppliedTemplateId: 'agency',
    },
  },
  {
    slug: 'empty',
    name: 'Write my own — empty field',
    trigger:
      'The empty field with its example placeholder. Save is off, and the footer says Laziza keeps the default until a prompt is saved.',
    initial: { defaultView: 'field' },
  },
  {
    slug: 'tooltip',
    name: 'Guidance tooltip',
    trigger:
      'The info mark beside “Your prompt”: rate, start date, agency or solo, calendar link, and what Laziza must never say. Hover on a desktop, tap on a phone.',
    initial: { defaultView: 'field', defaultGuidanceOpen: true },
  },
  {
    slug: 'typing',
    name: 'Typing — Save on',
    trigger:
      'The placeholder goes at the first keystroke. The text is the team’s own, so Save is on.',
    initial: {
      defaultValue:
        'We are a 3-person Webflow studio. Our rate is $45/h and we can start next Monday.',
    },
  },
  {
    slug: 'unchanged-default',
    name: 'Unchanged from the default — Save off',
    trigger:
      'The default pasted back in, whitespace aside. Save is off and the footer says why: this is the audit’s two teams, caught.',
    initial: { defaultValue: DEFAULT_PROMPT },
  },
  {
    slug: 'changed',
    name: 'Changed — Save on',
    trigger:
      'A template with every blank filled in. Save is on, and the badge says the prompt is not saved yet.',
    initial: { defaultValue: AGENCY_FILLED, defaultAppliedTemplateId: 'agency' },
  },
  {
    slug: 'saved',
    name: 'Saved',
    trigger: 'After Save: the badge turns to “Custom prompt”, and Save waits for the next edit.',
    initial: {
      defaultValue: AGENCY_FILLED,
      defaultSavedValue: AGENCY_FILLED,
      defaultAppliedTemplateId: 'agency',
    },
  },
];

export function CustomPromptSetupPage() {
  return (
    <>
      <PageHeader
        title="Custom Prompt setup"
        description="An empty field, guidance on what to write, and ready templates instead of a blank box. BF-4111 — proposal 1 was picked and is built; in development until the built result is reviewed."
      />

      <CrossLink
        eyebrow="The problem"
        links={[
          { label: 'CRM ▸ AI Configuration', pageId: 'crm-settings-ai' },
          { label: 'AI ▸ Custom Prompt', pageId: 'crm-ai-prompt' },
        ]}
      >
        From the CRM usage audit: two teams turned on a “custom” prompt that was still the default
        text, and believe their agent is configured. The field pre-filled with the default, so Save
        was one click from a prompt nobody wrote, and a team that cleared it got a blank box with no
        idea what belonged in it.
      </CrossLink>

      <Section
        title="The section, in the screen"
        stage="development"
        description="PromptSetup in place of the shipped Custom Prompt card — everything around it is the shipped screen. Pick a template, preview it, use it, fill its blanks and watch Save turn on; paste the default back and watch it turn off. The phone is beside the desktop."
      >
        <Frame wide={1421 + PHONE_WIDTH + spacing.l + 2} height="auto">
          <div style={{ display: 'flex', gap: spacing.l, alignItems: 'flex-start' }}>
            <VStack gap="xs" width={1421} flex="0 0 auto">
              <FrameLabel>Desktop · 1421px</FrameLabel>
              <div data-screen-shot="desktop">
                <SettingsScreen
                  replace={{
                    prompt: (
                      <PromptSection>
                        <Setup defaultFirstVisit />
                      </PromptSection>
                    ),
                  }}
                />
              </div>
            </VStack>
            <VStack gap="xs" width={PHONE_WIDTH} flex="0 0 auto">
              <FrameLabel>Phone · 402px</FrameLabel>
              <div data-screen-shot="phone">
                <SettingsScreen
                  phone
                  replace={{
                    prompt: (
                      <PromptSection>
                        <Setup defaultFirstVisit narrow />
                      </PromptSection>
                    ),
                  }}
                />
              </div>
            </VStack>
          </div>
        </Frame>
        <CodeBlock
          code={`<SettingsSection title="Custom Prompt" description="…">
  <PromptSetup
    defaultPrompt={gigradarDefault}
    templates={templates}
    variables={variables}
    value={draft}
    onChange={setDraft}
    savedValue={team.customPrompt}      // null while running on the default
    onSave={({ value }) => save(value)}
    firstVisit={!user.seenPromptSetup}
    onFirstVisitDismiss={() => markSeen('promptSetup')}
    narrow={isPhone}
  />
</SettingsSection>`}
        />
      </Section>

      <Section
        title="Every state, desktop beside phone"
        stage="development"
        description="Each drawn from a starting state, so none of them needs a pointer to reach."
      >
        {STATES.map((state) => (
          <StatePair key={state.slug} {...state} />
        ))}
      </Section>

      <Section
        title="The save rule"
        description="promptSaveState is exported on its own, so the API can refuse what the card refuses — a Save button the server would accept anyway is only a hint."
      >
        <CodeBlock
          code={`import { promptSaveState } from '@gigradar/ui';

promptSaveState(text, { defaultPrompt, savedValue });
// → { canSave: false, reason: 'empty' | 'default' | 'blanks' | 'saved', blanks }
// → { canSave: true,  reason: 'ready', blanks: [] }`}
        />
        <Caption>
          Whitespace is not a change, so a re-indented default is still the default. Square-bracket
          blanks on one line count; <code>{'{{variables}}'}</code> do not, since the runtime fills
          those in.
        </Caption>
      </Section>

      <Section title="PromptSetup props">
        <PropsTable
          rows={[
            {
              name: 'defaultPrompt',
              type: 'string',
              description:
                'What the agent runs on until a prompt is saved. Never shown in the field — it is what Save refuses to save as custom.',
            },
            {
              name: 'templates',
              type: 'PromptTemplate[]',
              description:
                '`{ id, name, description, body }`. `[blanks]` in the body mark what only the team can fill in.',
            },
            {
              name: 'value / defaultValue / onChange',
              type: 'string',
              default: `''`,
              description: 'The prompt text. Starts empty — the default is not pre-filled.',
            },
            {
              name: 'savedValue / defaultSavedValue',
              type: 'string | null',
              default: 'null',
              description:
                'The saved custom prompt, or null while running on the default. Drives the badge and the “already saved” rule.',
            },
            {
              name: 'onSave / onCancel / saving',
              type: '({ value }) => void / () => void / boolean',
              description:
                'Save is reachable only when promptSaveState allows it. Cancel reverts to what is saved.',
            },
            {
              name: 'firstVisit / defaultFirstVisit / onFirstVisitDismiss',
              type: 'boolean / boolean / () => void',
              default: 'false',
              description:
                'The one-time “Change this” popup. The product owns the seen flag; every way of closing it calls back once.',
            },
            {
              name: 'firstVisitTitle / firstVisitDescription',
              type: 'ReactNode',
              description: 'The popup’s wording.',
            },
            {
              name: 'onTemplateApply',
              type: '(template) => void',
              description: 'After a template has filled the field.',
            },
            {
              name: 'defaultView',
              type: `'templates' | 'field'`,
              description:
                'Which face the card starts on. Templates while empty, the field once there is text.',
            },
            {
              name: 'defaultSelectedTemplateId / defaultHighlightedTemplateId / defaultAppliedTemplateId',
              type: 'string | null',
              description:
                'Start in preview, draw a tile hovered, or mark which template the text came from — for stills and restored state.',
            },
            {
              name: 'placeholder',
              type: 'string',
              default: 'DEFAULT_PROMPT_PLACEHOLDER',
              description: 'The empty field’s example brief.',
            },
            {
              name: 'guidance / guidanceTitle / guidanceIntro',
              type: 'PromptGuidancePoint[] / ReactNode',
              default: 'DEFAULT_PROMPT_GUIDANCE',
              description:
                'The tooltip beside the label: rate, start date, agency or solo, calendar link, what it must never say.',
            },
            {
              name: 'defaultGuidanceOpen',
              type: 'boolean',
              default: 'false',
              description: 'Opens the tooltip on mount.',
            },
            {
              name: 'label',
              type: 'ReactNode',
              default: `'Your prompt'`,
              description: 'The label over the card.',
            },
            {
              name: 'statusLabels',
              type: '{ default, unsaved, saved }',
              description: 'The badge text for each state of the prompt.',
            },
            {
              name: 'reasonCopy',
              type: '(state: PromptSaveState) => ReactNode',
              description: 'The footer line for each reason Save is off, or on.',
            },
            {
              name: 'variables / variablesHint',
              type: 'PromptVariableDef[] / ReactNode',
              description: 'Passed to the AiPromptConfig card’s insert strip.',
            },
            {
              name: 'narrow',
              type: 'boolean',
              default: 'false',
              description:
                'The phone layout: one template per row, tooltip on tap, variable strip collapsed, a taller field.',
            },
          ]}
        />
      </Section>

      <Section
        title="PromptTemplatePicker props"
        description="The tiles and the preview, on their own, so another surface can offer templates the same way. PromptSetup is this plus the card."
      >
        <PropsTable
          rows={[
            { name: 'templates', type: 'PromptTemplate[]', description: 'The tiles, in order.' },
            {
              name: 'selectedId / defaultSelectedId / onSelectedChange',
              type: 'string | null',
              description: 'The template in preview; null shows the tiles.',
            },
            {
              name: 'defaultHighlightedId',
              type: 'string | null',
              description: 'A tile drawn hovered. Tracks the pointer on its own after that.',
            },
            {
              name: 'appliedId',
              type: 'string | null',
              description: 'Ticks the tile of the template currently in the field.',
            },
            {
              name: 'onApply',
              type: '(template) => void',
              description: '“Use this template” on the preview.',
            },
            {
              name: 'onWriteOwn',
              type: '() => void',
              description: 'The dashed “Write my own” tile. Omitted when not supplied.',
            },
            {
              name: 'replaces',
              type: 'boolean',
              default: 'false',
              description: 'Adds a line to the preview saying the field’s text will be replaced.',
            },
            { name: 'narrow', type: 'boolean', default: 'false', description: 'One tile per row.' },
            {
              name: 'intro / writeOwnLabel / writeOwnDescription',
              type: 'ReactNode',
              description: 'The picker’s wording.',
            },
          ]}
        />
      </Section>

      <Section
        title="Awaiting review"
        stage="development"
        description="Built and in development: the section keeps its badge until the built result is reviewed. The five templates are placeholders for Appendix A of the usage report. Proposals 2 (templates beside the field) and 3 (templates behind a button) were not picked; they stay in the review Artifact as the record."
      >
        <Caption>
          Still open: whether unfilled <code>[blanks]</code> should block Save, as built, or only
          warn; and what happens to the teams already saved on the default.
        </Caption>
      </Section>
    </>
  );
}
