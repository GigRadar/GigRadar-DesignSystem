import { color, spacing, textStyle } from '@gigradar/theme';
import {
  HStack,
  LifecycleBadge,
  ReplyTemplatePicker,
  SettingsSection,
  StopRuleList,
  VStack,
} from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../components/CodeBlock';
import { Frame } from '../../components/Frame';
import { PropsTable } from '../../components/PropsTable';
import { AutoReplyClarityDemo } from '../../demos/aiConfiguration';
import { PHONE_WIDTH, SettingsScreen } from '../../demos/settingsScreen';
import { REPLY_TEMPLATES } from '../../fixtures/aiConfiguration';
import { PageHeader, Preview, Section } from '../../layout';
import { CrossLink } from '../../navigation';
import { Caption } from '../middle/parts';

/** The width the settings screen is drawn at — the Figma frame's. */
const SCREEN_WIDTH = 1421;

/**
 * The Auto Reply section, as the settings screen will draw it.
 *
 * Replaces the shipped section rather than sitting beside it: the new lines
 * land inside the card that already ships, and two Auto Reply cards on one
 * screen would leave a reader asking which is real. Still marked in
 * development in its title until the built result is reviewed.
 */
function AutoReplySection({ phone = false }: { phone?: boolean }) {
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
        <AutoReplyClarityDemo phone={phone} />
      </div>
    </SettingsSection>
  );
}

/** A picker wired to a field, for the picker's own example. */
function PickerExample() {
  const [id, setId] = useState(REPLY_TEMPLATES[0]?.id ?? '');
  const current = REPLY_TEMPLATES.find((t) => t.id === id);
  return (
    <VStack gap="s" width="100%">
      <ReplyTemplatePicker templates={REPLY_TEMPLATES} value={id} onChange={(t) => setId(t.id)} />
      <span style={{ ...textStyle.sRegular, color: color.main.description }}>
        Fills: {current?.prompt || '(empty — write your own)'}
      </span>
    </VStack>
  );
}

/**
 * CRM ▸ Settings ▸ AI Configuration ▸ Auto Reply — BF-4113, built and in review.
 *
 * Proposal 1 won: the stop rules are fixed and read-only. The winner is built
 * into `packages/ui` — `AutoReply` gains a `details` slot under its mode row,
 * with `AutoReplyNote`, `ReplyRateStat`, `ReplyTemplatePicker` and
 * `StopRuleList` to fill it — and this page draws the real components.
 *
 * Still not in the nav: the section stays marked in development until the
 * built result is reviewed, and a surface in review is reached from its
 * Artifact (`developmentArtifacts.ts`). The Artifact's screenshots are
 * captured from here.
 */
export function AiModeClarityPage() {
  return (
    <>
      <PageHeader
        title="Auto Reply — mode clarity"
        description="What each mode does, why the first reply is worth handing over, and what Laziza will never do by itself. BF-4113, proposal 1 built — in development until reviewed."
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
        description="The shipped screen with the Auto Reply section built. Switch tabs and modes and the line under the modes changes; First reply carries the reply rate; All other replies carries the template picker and the fixed stop rules."
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.l, alignItems: 'flex-start' }}>
          <VStack gap="xs">
            <span style={{ ...textStyle.sMedium, color: color.main.description }}>
              Desktop · {SCREEN_WIDTH}px
            </span>
            <div data-state-screen="screen">
              <Frame wide={SCREEN_WIDTH} height="auto">
                <SettingsScreen instead={{ autoReply: <AutoReplySection /> }} />
              </Frame>
            </div>
          </VStack>
          <VStack gap="xs">
            <span style={{ ...textStyle.sMedium, color: color.main.description }}>
              Phone · {PHONE_WIDTH}px, the AI Configuration pane
            </span>
            <div data-state-screen="screen-mobile">
              <Frame hug height="auto">
                <SettingsScreen phone instead={{ autoReply: <AutoReplySection phone /> }} />
              </Frame>
            </div>
          </VStack>
        </div>
        <Caption>
          On a phone the modes stack, so each keeps its description, and the stop rules keep the lock
          but drop its “Always on” label.
        </Caption>
      </Section>

      <Section
        title="Usage"
        description="Everything new rides in `details`, under the mode row. `renderPrompt` returning null drops the old additional-prompt block, since the template’s prompt now does its job."
      >
        <CodeBlock
          code={`<AutoReply
  tabs={tabs}                       // First reply / All other replies
  tabId={tabId}
  onTabChange={(tab) => setTabId(tab.id)}
  options={OPTIONS}
  value={mode}
  onChange={setMode}
  optionsDirection={isPhone ? 'column' : 'row'}
  details={
    <>
      <AutoReplyNote>{MODE_LINES[tabId][mode]}</AutoReplyNote>
      {tabId === 'first' && <ReplyRateStat aiRate={68} humanRate={50} />}
      {tabId === 'other' && mode !== 'off' && (
        <>
          <ReplyTemplatePicker
            templates={TEMPLATES}
            value={templateId}
            onChange={(t) => { setTemplateId(t.id); setPrompt(t.prompt); }}
          />
          <CustomPromptField value={prompt} onChange={setPrompt} />
          <StopRuleList compact={isPhone} />
        </>
      )}
    </>
  }
  renderPrompt={() => null}
  dirty={detailsChanged}
  onSave={save}
/>`}
        />
      </Section>

      <Section
        title="Stop rules"
        description="Fixed and read-only — the floor that makes Full Auto safe to turn on. `defaultStopRules` carries the three, so no call site retypes them."
      >
        <Preview>
          <div style={{ width: '100%', maxWidth: 640 }}>
            <StopRuleList />
          </div>
          <div style={{ width: PHONE_WIDTH - 2 * spacing.l }}>
            <StopRuleList compact />
          </div>
        </Preview>
        <PropsTable
          rows={[
            { name: 'rules', type: 'StopRule[]', default: 'defaultStopRules', description: '`{ id, title, detail }` per rule.' },
            { name: 'title', type: 'ReactNode', default: '"Stop rules"', description: 'The heading. `null` drops it.' },
            { name: 'description', type: 'ReactNode', description: 'The lead-in line above the list.' },
            { name: 'footnote', type: 'ReactNode', description: 'The line under the list — where a passed thread ends up.' },
            { name: 'lockLabel', type: 'ReactNode', default: '"Always on"', description: 'The word beside each lock.' },
            { name: 'compact', type: 'boolean', default: 'false', description: 'Keeps the lock, hides its label visually (still read out). For a phone.' },
          ]}
        />
      </Section>

      <Section
        title="Template picker"
        description="Minimal on purpose. BF-4111 is building the custom prompt’s template picker (templates as the empty card), and this component is swapped for that one once it lands."
      >
        <Preview>
          <PickerExample />
        </Preview>
        <PropsTable
          rows={[
            { name: 'templates', type: 'ReplyTemplate[]', description: '`{ id, name, prompt }`, in menu order.' },
            { name: 'value', type: 'string', description: 'The chosen template’s id. Falls back to the first.' },
            { name: 'onChange', type: '(template) => void', description: 'Called with the picked template — fill the prompt from `template.prompt`.' },
            { name: 'label', type: 'ReactNode', default: '"Reply template"', description: 'The label above the button. `null` drops it.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Blocks the button.' },
          ]}
        />
      </Section>

      <Section title="Props" description="What BF-4113 added to `AutoReply`, and the two note lines.">
        <PropsTable
          rows={[
            { name: 'AutoReply · details', type: 'ReactNode', description: 'Content under the mode row, before the prompt.' },
            { name: 'AutoReply · renderPrompt', type: 'RenderProp<{ tab, value }>', description: 'Replaces the additional-prompt block; return `null` to drop it.' },
            { name: 'AutoReply · optionsDirection', type: "'row' | 'column'", default: "'row'", description: 'Stacks the modes for a phone.' },
            { name: 'AutoReply · dirty', type: 'boolean', default: 'false', description: 'Marks edits made inside `details`, so Save and Cancel enable.' },
            { name: 'AutoReplyNote · children', type: 'ReactNode', description: 'The line: what the open mode does, and where its result shows up.' },
            { name: 'AutoReplyNote · icon / iconColor / textColor', type: 'IconDef / string', description: 'An optional leading glyph and the colors.' },
            { name: 'ReplyRateStat · aiRate / humanRate', type: 'number', description: 'Reply rates in percent, AI first against a person first.' },
            { name: 'ReplyRateStat · agentName', type: 'string', default: '"Laziza"', description: 'The AI’s name in the sentence.' },
          ]}
        />
      </Section>

      <Section title="Still open" description="What the build does not answer.">
        <Caption>
          Whether the modes should be renamed Autopilot and Copilot, as the ticket calls them — the
          build keeps the shipped Full Auto and Co-pilot.
        </Caption>
        <Caption>
          Whether the stop rules also hold on the first reply. The build draws them on All other
          replies, where the ticket places them.
        </Caption>
        <Caption>
          On a phone both tab labels truncate beside their mode badge (“First r…”, “All oth…”). The
          shipped labels truncate the same way.
        </Caption>
      </Section>
    </>
  );
}
