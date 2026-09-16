import { color, spacing } from '@gigradar/theme';
import { BubbleChat, DraftCard, MentionMenu, Sender, type MentionMenuItem } from '@gigradar/ui';
import { useState } from 'react';
import { CodeBlock } from '../../../components/CodeBlock';
import { PropsTable } from '../../../components/PropsTable';
import { PageHeader, Section } from '../../../layout';
import { CrossLink } from '../../../navigation';
import { Caption, Surface, Thread } from '../parts';

/** The presets the menu offers — the ones saved in AI Configuration. */
const PRESETS: MentionMenuItem[] = [
  {
    id: 'summarise',
    title: 'Summarise the conversation',
    prompt:
      'summarise the conversation so far in 3-5 bullet points: where we are, what the client wants, and what the next move should be.',
  },
  {
    id: 'follow-up',
    title: 'Schedule a follow-up tomorrow morning',
    prompt: 'schedule a wake-up for tomorrow at 9am the team can act on.',
  },
  {
    id: 'eod',
    title: 'Follow up if client doesn’t reply by EOD',
    prompt: 'schedule a wake-up for 6pm today. If the client has replied by then, cancel it.',
  },
  {
    id: 'next',
    title: 'What’s the next step here?',
    prompt: 'read the thread and say what the single next action should be, and who owns it.',
  },
];

const DRAFT =
  'Happy to break it down! Milestone one covers secure login, onboarding, and the core feed — roughly 2 weeks. I’d scope that phase at $2,400, ending with a build you can test on your phone. Want me to send a short scope doc?';

/** Laziza's own sender line, which every state below draws above its bubble. */
function LazizaSender() {
  return (
    <Sender name="Laziza AI" avatar={{ tone: 'orange' }} textColor={color.accent.laziza.main} />
  );
}

/**
 * Laziza AI ▸ Drafting — what happens between `@laziza` and a sent reply.
 *
 * Figma node 3451:37876 draws the states; the CRM flow at 7219:55390 draws the
 * order they arrive in. Two components come out of it — the menu the composer
 * opens, and the card a draft arrives in — and everything else is the ordinary
 * chat components wearing the amber.
 */
export function LazizaDraftingPage() {
  const [activeId, setActiveId] = useState('summarise');
  const [picked, setPicked] = useState<string | null>(null);
  const [instruction, setInstruction] = useState('');

  return (
    <>
      <PageHeader
        title="Drafting"
        description="Typing @laziza in the composer, the thinking state while Laziza works, and the reply it comes back with. Figma node 3451:37876, flow 7219:55390."
      />

      <CrossLink
        eyebrow="Built from"
        links={[
          { label: 'Mid ▸ Composer', pageId: 'crm-mid-composer' },
          { label: 'Mid ▸ Bubble Chat', pageId: 'crm-mid-bubble' },
          { label: 'Laziza AI ▸ Author Badge', pageId: 'crm-laziza-badge' },
          { label: 'CRM ▸ Settings ▸ Mention Preset', pageId: 'crm-ai-presets' },
        ]}
      >
        The presets the menu offers are the ones saved in{' '}
        <strong>AI Configuration ▸ Mention Presets</strong> — this is where they are used, not where
        they are written. Everything Laziza says lands in a <code>comment</code> bubble, because a
        draft is internal until somebody sends it.
      </CrossLink>

      <Section
        title="The sequence"
        description="Four states in the order they arrive. The request stays a comment, so the client never sees it; Laziza answers under its own sender; and a suggested reply arrives in a dashed card rather than a bubble, because it has not been sent."
      >
        <Surface>
          <Thread>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing.l,
                padding: spacing.m,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing.xxs,
                  alignItems: 'flex-end',
                }}
              >
                <Sender side="own" name="rafaelsamuel@email.com" avatar={{ tone: 'volcano' }} />
                <BubbleChat side="own" tone="comment" time="08:30" state="read">
                  <span style={{ color: color.accent.laziza.main }}>@laziza</span> Follow up this
                  client.
                </BubbleChat>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
                <span style={{ color: color.accent.laziza.main, fontSize: 12 }}>Thinking …</span>
                <LazizaSender />
                <DraftCard state="drafting" width={220} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xxs }}>
                <LazizaSender />
                <BubbleChat tone="comment" time="08:30" state="read">
                  Key action items: (1) Confirm the design brief with Jane Cooper, (2) Share the
                  revised Draft Design PDF, (3) Schedule a 30-min review call.
                </BubbleChat>
                <DraftCard
                  label="Suggested reply to the client — Draft"
                  instructionValue={instruction}
                  onInstructionChange={setInstruction}
                  onRegenerate={() => undefined}
                  onEdit={() => undefined}
                  onSend={() => undefined}
                >
                  {DRAFT}
                </DraftCard>
              </div>
            </div>
          </Thread>
        </Surface>
        <Caption>
          The card's buttons are live — the instruction field takes input. Everything Laziza produces
          is amber and internal until <strong>Send now</strong> puts it in front of the client.
        </Caption>
      </Section>

      <Section
        title="The @laziza menu"
        description="Typing @laziza in the composer opens the team's saved presets. Picking one fills the composer with that preset's prompt, which the user can edit before sending — the menu inserts text, it does not run anything."
      >
        <Surface>
          <MentionMenu
            items={PRESETS}
            activeId={activeId}
            onActiveChange={setActiveId}
            onSelect={(item) => setPicked(item.title)}
          />
        </Surface>
        <Caption>
          Hover a row, then click it. {picked ? `Picked: “${picked}”.` : 'Nothing picked yet.'} The
          prompt under each title is clipped to one line — the whole thing goes into the composer, so
          the clipped tail is hidden rather than lost.
        </Caption>
        <CodeBlock
          code={`<MentionMenu
  items={savedPresets}
  activeId={activeId}
  onActiveChange={setActiveId}
  onSelect={(preset) => composer.insert(preset.prompt)}
/>`}
        />
      </Section>

      <Section
        title="Why not MentionPreset"
        description="The settings list already has a preset row, and this is deliberately not it. That one carries move, delete and a priority badge — all controls for managing presets. A menu offering them would be a settings screen opened over a conversation."
      >
        <Caption>
          Same data, two surfaces, two jobs: <code>MentionPreset</code> is where a preset is written
          and ordered, <code>MentionMenu</code> is where one is picked.
        </Caption>
      </Section>

      <Section
        title="The card's two states"
        description="`drafting` is Laziza working — three dots and nothing to act on. `draft` is the reply, and the only state carrying controls. Each dot is fainter than the one before rather than animated in sequence, so the state still reads in a screenshot, a test, and a print."
      >
        <Surface>
          <div style={{ display: 'flex', gap: spacing.m, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <DraftCard state="drafting" width={220} />
            <DraftCard label="Suggested reply to the client — Draft" instruction={false} width={320}>
              {DRAFT}
            </DraftCard>
          </div>
        </Surface>
        <Caption>
          Right: the same card with <code>instruction={'{false}'}</code> and no controls — a draft
          that is only being shown, not acted on.
        </Caption>
        <CodeBlock
          code={`<DraftCard state="drafting" />

<DraftCard
  label="Suggested reply to the client — Draft"
  onRegenerate={regenerate}
  onEdit={openInComposer}
  onSend={send}
>
  {draft}
</DraftCard>`}
        />
      </Section>

      <Section
        title="Props"
        description="`DraftCard` above, `MentionMenu` below. Both take the usual per-instance style overrides on top of these."
      >
        <PropsTable
          rows={[
            {
              name: 'state',
              type: `'drafting' | 'draft'`,
              default: `'draft'`,
              description:
                'What the card is showing. `drafting` draws the dots and hides everything else.',
            },
            {
              name: 'label',
              type: 'ReactNode',
              description:
                'The line above the draft. Passed rather than fixed — the same card carries summaries and key actions, which are not replies.',
            },
            {
              name: 'instruction',
              type: 'boolean',
              default: 'true',
              description: 'Shows the custom-instruction field above the controls.',
            },
            {
              name: 'onRegenerate / onEdit / onSend',
              type: '() => void',
              description:
                'Each draws its control when passed. Omit all three for a card that is shown but not acted on.',
            },
            {
              name: 'items',
              type: 'MentionMenuItem[]',
              description:
                'The saved presets — `id`, `title`, and the `prompt` the row inserts on select.',
            },
            {
              name: 'activeId / onActiveChange',
              type: 'string / (id) => void',
              description:
                'Which row is highlighted. Held by the caller so the keyboard and the pointer drive the same state.',
            },
            {
              name: 'onSelect',
              type: '(item) => void',
              description:
                'Fires with the picked preset. The caller puts its prompt in the composer — the menu does not send.',
            },
          ]}
        />
      </Section>

      <Section
        title="Still open"
        description="Two things the Figma flow does not settle, worth naming so they are decided rather than defaulted."
      >
        <Caption>
          <strong>What happens to a draft nobody acts on?</strong> It is not a message and it is not
          scheduled, and the thread has no state for a thing that is neither.
          <br />
          <br />
          <strong>Does Re-generate replace the draft or add another?</strong> The instruction field
          implies replace, but nothing states it — and replacing loses the version you were comparing
          against.
        </Caption>
      </Section>
    </>
  );
}
