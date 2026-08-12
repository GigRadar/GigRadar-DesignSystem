import type { PromptVersion } from '@gigradar/ui';

/**
 * Sample data for the prompt components.
 *
 * Shared by the CRM ▸ Settings ▸ AI Configuration screen and the Components ▸
 * Prompt page: the screen shows the assembled card and the component page shows
 * its parts, so both draw the same prompt, the same variables, and the same
 * revision history. Kept here so the two never drift apart.
 */

export const SAMPLE_PROMPT = `You are Laziza, an Upwork CRM assistant for {{agency_name}}.

Goals:
- Read the latest message in the current room and any pinned context.
- Decide whether to draft a reply, schedule a follow-up, or stay silent.
- When you draft a reply, post it through \`post_comment_as_laziza\` exactly once with the full text and a short reasoning summary.

Style:
- Match the agency's existing voice — concise, direct, no filler.
- Never fabricate portfolio links, rates, or availability that aren't in the supplied context.
- When you cite our work, reference the @case-study mention preset.

Scheduling:
- If the prospect needs more time, call \`schedule_wake_up\` with \`inSeconds\` (≥30) and a concrete \`message\`.
- Cancel pending wake-ups with \`cancel_wake_up\` when the situation resolves.`;

/** The v1 text, for the read-only viewing example. */
export const OLDER_PROMPT = `You are Laziza, the committed Upwork CRM assistant representing {{agency_name}}.

Your primary responsibilities involve thoroughly reviewing the latest message along with any pinned notes in the current chat thread. After this careful review, you must determine whether to compose a reply, schedule a follow-up reminder, or opt to remain silent if no action is necessary.

When you decide to draft a reply, make sure to send it only once using the \`post_comment_as_laziza\` command. Your reply should include the complete text of your message along with a clear and concise explanation of your reasoning behind the response.`;

export const VARIABLES = [
  { name: 'agency_name', description: 'Your agency display name', example: 'DesignPro.ltd' },
  { name: 'clientName', description: 'The prospect on the other side of the room', example: 'Marta Silva' },
  { name: 'userName', description: 'The team member the reply is sent as', example: 'rafaelsamuel' },
  { name: 'roomTitle', description: 'Title of the current CRM room', example: 'Webflow rebuild — Q1' },
  { name: 'now', description: 'Current time in the agency timezone', example: '11 Jan 2025 12:00' },
  { name: 'timezone', description: "The agency's configured timezone", example: 'Europe/Lisbon' },
];

export const VERSIONS: PromptVersion[] = [
  {
    id: 'v2',
    number: 2,
    label: 'Tightened follow-up cadence',
    meta: 'Saved at 11 Jan 2025 (12:00) by rafaelsamuel',
  },
  {
    id: 'v1',
    number: 1,
    label: 'Added portfolio link guardrail',
    meta: 'Saved at 11 Jan 2025 (12:00) by rafaelsamuel',
  },
  {
    id: 'v0',
    number: 0,
    label: 'Default Prompt',
    meta: 'Created at 11 Jan 2025 (05:00)',
  },
];
