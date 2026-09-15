import type { BillingCycle, PaywallPlan } from '@gigradar/ui';

/**
 * The paywall's sample data, from Figma node 1360:9925.
 *
 * The prices and the feature list are the frame's own. The list matters more
 * than it looks: all three plans carry the same seven rows in the same order,
 * and which of them each plan includes is the whole argument the row of cards
 * makes. Inventing a different list per card would hide that.
 */

/** Every feature, in the order the cards list them. */
const FEATURES = [
  'Up to 3 accounts',
  'AI assistance',
  'Schedule messages',
  'Schedule meetings',
  'Send attachments',
  'Real time updates',
  'GigRadar Business Manager',
];

/**
 * How many of those rows each plan includes, counting from the top.
 *
 * Figma draws the plans as nested tiers — everything Basic buys, Pro buys too
 * — so a count says it more honestly than three hand-written lists that could
 * drift out of agreement.
 */
function featuresUpTo(count: number, firstLabel = FEATURES[0]) {
  return FEATURES.map((label, index) => ({
    label: index === 0 ? firstLabel : label,
    included: index < count,
  }));
}

export const cycles: BillingCycle[] = [
  { id: 'monthly', label: 'Monthly' },
  { id: 'annual', label: 'Annual', saving: 'Save 20%' },
];

export const plans: PaywallPlan[] = [
  {
    id: 'basic',
    tone: 'basic',
    name: 'Basic',
    price: '$99',
    note: 'same cycle as main GigRadar plan',
    features: featuresUpTo(3),
    trialLabel: 'Start free trial',
  },
  {
    id: 'pro',
    tone: 'pro',
    name: 'Pro',
    price: '$199',
    note: 'same cycle as main GigRadar plan',
    features: featuresUpTo(FEATURES.length, 'Up to 10 accounts'),
  },
  {
    id: 'unlimited',
    tone: 'unlimited',
    name: 'Unlimited',
    price: '$499',
    note: 'same cycle as main GigRadar plan',
    features: featuresUpTo(FEATURES.length, 'Unlimited accounts'),
  },
];

/** The pitch, as Figma writes it. */
export const pitch = {
  description:
    'You found the leads, now close them. Manage every Upwork conversation, attachment, meetings and follow-up with AI without leaving GigRadar. One place, full context, zero tab-switching. Try it free and see how it feels to manage every Upwork lead, chat, and follow-up without switching tabs.',
};
