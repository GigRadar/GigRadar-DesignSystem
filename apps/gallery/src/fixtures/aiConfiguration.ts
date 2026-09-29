import { color } from '@gigradar/theme';
import {
  IconTrunOffPower,
  type AutoReplyOption,
  type AutoReplyTab,
  type MentionPresetItem,
  type ReplyTemplate,
} from '@gigradar/ui';

/**
 * The sample data behind CRM ▸ Settings ▸ AI Configuration.
 *
 * Shared rather than page-local: the screen page and each of its four section
 * pages draw the same content, and a reader who sees "Top performing case
 * study" on one page and different presets on another has to work out whether
 * the difference means anything. It does not.
 */

/** The capabilities Figma lists on this screen (node 3777:9422). */
export const AI_TOOLS = [
  {
    name: 'post_comment_as_laziza',
    category: 'message' as const,
    categoryLabel: 'Public Communication',
    description:
      'Post the final assistant reply as an internal CRM comment authored by Laziza. Called exactly once per run with the full reply text and a short reasoning summary. The room is bound by the runtime — Laziza cannot post into a different room.',
  },
  {
    name: 'schedule_wake_up',
    category: 'schedule' as const,
    categoryLabel: 'Scheduling',
    description:
      'Schedule a one-shot follow-up that re-invokes the agent at a future time. Use when the user asks for a deferred check ("ping me tomorrow", "check back when the client replies"). Takes inSeconds (30s minimum, 1 year max) and a concrete message (≥10 chars) Laziza will act on at wake-up time.',
  },
  {
    name: 'cancel_wake_up',
    category: 'schedule' as const,
    categoryLabel: 'Scheduling',
    description:
      'Cancel a previously scheduled wake-up by id. Use when the user asks to retract a pending follow-up or when the situation that motivated the wake-up has resolved early.',
  },
  {
    name: 'list_my_wakeups',
    category: 'schedule' as const,
    categoryLabel: 'Scheduling',
    description:
      'List pending wake-ups visible to this team on this room. Use sparingly — only when the user asks to see what is scheduled, or when Laziza needs to avoid duplicating an existing wake-up.',
  },
];

/** Sample presets, in priority order. */
export const PRESETS: MentionPresetItem[] = [
  {
    id: 'case-study',
    title: 'Top performing case study',
    description:
      'Inserts our flagship fintech case study link with a 1-line value framing. Used in cold-outreach replies.',
    characterCount: 103,
  },
  {
    id: 'discovery',
    title: 'Book discovery call',
    description:
      "Drops the team's Cal.com link and a 30-minute scheduling line. Auto-tags the room as `Booked`.",
    characterCount: 96,
  },
  {
    id: 'pricing',
    title: 'Send pricing tiers',
    description: "Returns the three-tier pricing block with the current month's promo footnote.",
    characterCount: 78,
  },
];

/** The message classes and modes, exactly as Figma draws them. */
export const AUTO_REPLY_TABS: AutoReplyTab[] = [
  { id: 'first', label: 'First Message', mode: 'fullAuto' },
  { id: 'other', label: 'Other Message', mode: 'coPilot' },
];

export const AUTO_REPLY_OPTIONS: AutoReplyOption[] = [
  {
    id: 'fullAuto',
    label: 'Full Auto',
    description: 'Replies are sent automatically',
    markerLabel: 'Auto',
  },
  {
    id: 'coPilot',
    label: 'Co-pilot',
    description: 'Drafts a reply for your approval',
    markerLabel: '50%',
    markerColor: color.accent.laziza.backgroundAlt,
  },
  {
    id: 'off',
    label: 'Turn Off',
    description: 'Disable automatic replies',
    markerIcon: IconTrunOffPower,
    markerColor: color.navbar.text,
  },
];

/*
 * BF-4113 — the Auto Reply card with its modes explained. In development: the
 * section it draws is marked as such until the built result is reviewed.
 */

/** The message classes, in the words the CRM usage audit uses. */
export const REPLY_TABS: AutoReplyTab[] = [
  { id: 'first', label: 'First reply', mode: 'fullAuto' },
  { id: 'other', label: 'All other replies', mode: 'coPilot' },
];

/** What each mode does once it is on, and where you see it — per class. */
export const MODE_LINES: Record<string, Partial<Record<string, string>>> = {
  first: {
    fullAuto:
      'Laziza answers a new client message by itself. The reply shows in the Inbox thread, marked Laziza.',
    coPilot:
      'Laziza writes the first reply into the composer. Nothing sends until you press Send in the Inbox.',
    off: 'Laziza stays out of it. New client messages wait in the Inbox for your team to answer.',
  },
  other: {
    fullAuto:
      'Laziza keeps the conversation going by itself, within the stop rules below. Replies show in the thread, marked Laziza.',
    coPilot:
      'Laziza drafts each follow-up into the composer. You review it in the Inbox and send it yourself.',
    off: 'Every reply after the first is yours. Laziza drafts nothing and sends nothing.',
  },
};

/** The audit's reply rates: AI first against a person first. */
export const REPLY_RATE = { ai: 68, human: 50 };

/** Starting points for "all other replies". Picking one fills the prompt. */
export const REPLY_TEMPLATES: ReplyTemplate[] = [
  {
    id: 'call',
    name: 'Answer, then book a call',
    prompt:
      'Answer the client’s question in two or three sentences, then offer a 20-minute call to go through the details. Share {{calendar_link}}.',
  },
  {
    id: 'warm',
    name: 'Keep it warm',
    prompt:
      'Thank the client, answer anything they asked directly, and end with one question about their timeline.',
  },
  {
    id: 'qualify',
    name: 'Qualify before scoping',
    prompt:
      'Before discussing approach, ask about budget range, deadline and who makes the decision. One question per message.',
  },
  { id: 'blank', name: 'Write my own', prompt: '' },
];
