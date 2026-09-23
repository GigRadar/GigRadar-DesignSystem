import { color } from '@gigradar/theme';
import type { KanbanCardParticipant, TaskStage } from '@gigradar/ui';

/**
 * Sample data for the Dashboard pages.
 *
 * Taken from the Figma frame (node 447:3878) rather than invented, because the
 * screen's hard cases are in the real numbers: a rate that has no comparison
 * to show, a stage holding nothing, and job titles long enough to clip inside
 * a 147px column.
 */

/** A face from Unsplash, cropped square. See the inbox fixtures for why. */
function face(photoId: string, size = 96) {
  return `https://images.unsplash.com/photo-${photoId}?w=${size}&h=${size}&fit=crop&crop=faces&auto=format&q=80`;
}

export const participants: KanbanCardParticipant[] = [
  { id: 'floyd', name: 'Floyd Miles', avatarSrc: face('1507003211169-0a1dd7228f2d') },
  { id: 'marco', name: 'Marco Gabriella' },
  { id: 'maria', name: 'Maria Ovcharenko' },
];

export type FunnelStep = {
  id: string;
  label: string;
  hint: string;
  value: string;
  change?: { value: number; direction: 'up' | 'down' };
  valueColor?: string;
  metrics: { label: string; value: string }[];
};

/**
 * The funnel, top to bottom.
 *
 * "Closed Won Rate" carries no change: Figma draws its badge in the `none`
 * state — a dash rather than a number — which is what a rate looks like before
 * the comparison period has closed. It is the case most easily forgotten, so
 * it is in the fixtures rather than only in the states page.
 */
export const funnelSteps: FunnelStep[] = [
  {
    id: 'replies',
    label: 'Total Replies',
    hint: 'Every reply received from a lead in the period.',
    value: '34%',
    change: { value: 321, direction: 'down' },
    metrics: [
      { label: 'Total Reply', value: '$189' },
      { label: 'Cost per reply', value: '$124' },
    ],
  },
  {
    id: 'qualified',
    label: 'Qualified Reply Rate',
    hint: 'Replies that met the qualification criteria.',
    value: '30%',
    change: { value: 240, direction: 'down' },
    metrics: [
      { label: 'Total Qualify Reply', value: '189' },
      { label: 'Cost per reply', value: '$124' },
    ],
  },
  {
    id: 'booked',
    label: 'Appointment Booked',
    hint: 'Leads that booked a call.',
    value: '28%',
    change: { value: 32, direction: 'down' },
    metrics: [
      { label: 'Total Appointment Booked', value: '134' },
      { label: 'Cost per booked appointment', value: '$124' },
    ],
  },
  {
    id: 'showup',
    label: 'Show up Rate',
    hint: 'Booked calls the lead attended.',
    value: '24%',
    change: { value: 24, direction: 'up' },
    metrics: [
      { label: 'Total Appointment Happened', value: '42' },
      { label: 'Cost per happened appointment', value: '$82' },
    ],
  },
  {
    id: 'qualification',
    label: 'Qualification Rate',
    hint: 'Attended calls that qualified.',
    value: '12%',
    change: { value: 38, direction: 'up' },
    metrics: [
      { label: 'Total Qualification', value: '59' },
      { label: 'Cost per qualification', value: '$79' },
    ],
  },
];

/** The two closing rates, which share a column and carry their outcome's color. */
export const closingRates: FunnelStep[] = [
  {
    id: 'won',
    label: 'Closed Won Rate',
    hint: 'Qualified leads that became customers.',
    value: '10%',
    valueColor: color.status.success.main,
    metrics: [
      { label: 'Total Closed Deals', value: '45' },
      { label: 'Customer acquisition cost', value: '$45' },
    ],
  },
  {
    id: 'lost',
    label: 'Closed Lost Rate',
    hint: 'Qualified leads that did not convert.',
    value: '5%',
    valueColor: color.status.error.main,
    change: { value: 32, direction: 'down' },
    metrics: [{ label: 'Total Lost Deals', value: '13' }],
  },
];

/** The band's shape — the share of the top of the funnel each step keeps. */
export const funnelBand = [0.92, 0.78, 0.6, 0.48, 0.42, 0.38, 0.34];
export const funnelBandCompare = [0.85, 0.7, 0.55, 0.44, 0.4, 0.36, 0.33];

export type PipelineStage = {
  id: string;
  title: string;
  total: string;
  count: string;
  leads: {
    id: string;
    title: string;
    activity: string;
    stage: { label: string; tone: string };
    amount: string;
  }[];
};

/**
 * The pipeline, left to right.
 *
 * "Booked" holds one lead and "Qualify" holds one: Figma draws the columns at
 * uneven heights, and a fixture with the same count in every column would hide
 * that a short column and an empty one look different.
 */
export const pipelineStages: PipelineStage[] = [
  {
    id: 'unassigned',
    title: 'Unassigned',
    total: '$1500',
    count: '3 Deals',
    leads: [
      {
        id: 'u1',
        title: 'UI/UX Product Designer',
        activity: 'Chat created 1 day ago',
        stage: { label: 'New', tone: color.stageFlat.new },
        amount: '$500',
      },
      {
        id: 'u2',
        title: 'React Front-End Developer',
        activity: 'Chat created 1 day ago',
        stage: { label: 'New', tone: color.stageFlat.new },
        amount: '$500',
      },
      {
        id: 'u3',
        title: 'Full-Stack MERN Developer for Automation, familiar with n8n',
        activity: 'Chat created 2 days ago',
        stage: { label: 'Contact Later', tone: color.stageFlat.contactLater },
        amount: '$500',
      },
    ],
  },
  {
    id: 'interested',
    title: 'Interested',
    total: '$1000',
    count: '2 Deals',
    leads: [
      {
        id: 'i1',
        title: 'Mobile App UI Designer',
        activity: 'Meeting created 5 mins ago',
        stage: { label: 'Interested', tone: color.stageFlat.interested },
        amount: '$500',
      },
      {
        id: 'i2',
        title: 'Python AI Machine Learning',
        activity: 'Message sent 1 hour ago',
        stage: { label: 'Interested', tone: color.stageFlat.interested },
        amount: '$500',
      },
    ],
  },
  {
    id: 'booked',
    title: 'Booked',
    total: '$500',
    count: '1 Deals',
    leads: [
      {
        id: 'b1',
        title: 'Back-End Programmer for Automation using Javascript',
        activity: 'Meeting created 5 days ago',
        stage: { label: 'Booked', tone: color.stageFlat.booked },
        amount: '$500',
      },
    ],
  },
  {
    id: 'happened',
    title: 'Happened',
    total: '$500',
    count: '1 Deals',
    leads: [
      {
        id: 'h1',
        title: 'Next.js Web Developer',
        activity: 'Proposal viewed 6 days ago',
        stage: { label: 'Happened', tone: color.stageFlat.happened },
        amount: '$500',
      },
    ],
  },
  {
    id: 'qualify',
    title: 'Qualify',
    total: '$500',
    count: '1 Deals',
    leads: [
      {
        id: 'q1',
        title: 'Landing Page UI Specialist',
        activity: 'Proposal viewed 6 days ago',
        stage: { label: 'Qualified', tone: color.stageFlat.qualified },
        amount: '$500',
      },
    ],
  },
  {
    id: 'closed',
    title: 'Closed',
    total: '$2000',
    count: '4 Deals',
    leads: [
      {
        id: 'c1',
        title: 'React Front-End Developer',
        activity: 'Invitation received 3 days ago',
        stage: { label: 'Converted', tone: color.stageFlat.converted },
        amount: '$500',
      },
      {
        id: 'c2',
        title: 'SaaS Dashboard Front-End Specialist',
        activity: 'Proposal boosted 3 days ago',
        stage: { label: 'Converted', tone: color.stageFlat.converted },
        amount: '$500',
      },
      {
        id: 'c3',
        title: 'Full-Stack MERN Developer',
        activity: 'Chat created 3 months ago',
        stage: { label: 'Unreachable', tone: color.stageFlat.unreachable },
        amount: '$500',
      },
      {
        id: 'c4',
        title: 'Landing Page UI Specialist',
        activity: 'Chat created 3 months ago',
        stage: { label: 'Not Interested', tone: color.stageFlat.notInterested },
        amount: '$500',
      },
    ],
  },
];

/** The period the screen opens on — Figma's own May 2025. */
export const defaultRange = {
  start: new Date(2025, 4, 1),
  end: new Date(2025, 4, 31),
};

/** One card in the Task Feed. */
export type FeedTask = {
  id: string;
  stage: TaskStage;
  title: string;
  description: string;
  time: string;
  /** Notices have nothing to mark done — see `TaskFeedCard.completable`. */
  completable?: boolean;
};

/**
 * The feed as Figma fills it (node 473:7122), in its order.
 *
 * Kept verbatim rather than trimmed: the run is the hard case. It carries a
 * title long enough to clip, a description that runs past two lines, and the
 * one task that cannot be completed — the states a feed of three tidy cards
 * would never show.
 */
export const feedTasks: FeedTask[] = [
  {
    id: 'closed',
    stage: 'closed',
    title: 'Closed Deal with John Smith',
    description: 'Great job! You’ve successfully closed a deal with John Smith. 🎉',
    time: '10m ago',
  },
  {
    id: 'objection',
    stage: 'objection',
    title: 'Objection from James',
    description:
      'James raised concerns about the budget — consider addressing the pricing objection.',
    time: '10m ago',
    // The one task with nothing to tick off: an objection is handled in the
    // conversation, not from the feed, so the card can only be put aside.
    completable: false,
  },
  {
    id: 'message',
    stage: 'new',
    title: 'New Message from John Smith',
    description: 'You’ve received a new message from John Smith. Check the conversation to stay updated.',
    time: '10m ago',
  },
  {
    id: 'interested',
    stage: 'interested',
    title: 'John Smith is Interested',
    description: 'John Smith marked as interested. Keep the momentum and follow up promptly.',
    time: '10m ago',
  },
  {
    id: 'not-interested',
    stage: 'notInterested',
    title: 'Elena Brooks is Not Interested',
    description:
      'Don’t lose hope — try a different angle or reconnect later when the timing’s better.',
    time: '10m ago',
  },
  {
    id: 'mentioned',
    stage: 'mentioned',
    title: 'Mentioned by James Floyd',
    description:
      'You were mentioned in “Mobile and Website UI & UX Designer, familiar with webflow - Hiring Now” — check the message to follow up.',
    time: '10m ago',
  },
  {
    id: 'call',
    stage: 'fallback',
    title: 'Update Call Status',
    description:
      'You had a call with John Smith on June 7. Don’t forget to update the call outcome to keep your lead funnel accurate.',
    time: '10m ago',
  },
];
