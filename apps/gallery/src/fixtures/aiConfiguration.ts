import { color } from '@gigradar/theme';
import { IconTrunOffPower, type AutoReplyOption, type AutoReplyTab, type MentionPresetItem } from '@gigradar/ui';

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
