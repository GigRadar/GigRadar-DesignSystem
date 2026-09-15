/**
 * The design reviews currently out for a decision.
 *
 * A surface under development is not a gallery page. Its states are not settled,
 * its proposals compete, and nothing in it can be used yet — so it lives in a
 * review Artifact rather than in the nav, where every other entry is something a
 * reader is allowed to build against. The nav says what ships; this list says
 * what is still being decided.
 *
 * Entries come out when the review is over: the winning proposal moves into
 * `packages/ui` and the surface gets an ordinary page, at which point the link
 * here is the record of a decision rather than a thing to open.
 */
export type DevelopmentArtifact = {
  /** The ticket, where there is one. */
  ticket?: string;
  /** What the review is about, in the reader's words. */
  title: string;
  /** One line on what is being decided. */
  question: string;
  /** How many decisions are open inside it. */
  decisions: number;
  url: string;
};

export const DEVELOPMENT_ARTIFACTS: DevelopmentArtifact[] = [
  {
    ticket: 'BF-4280',
    title: 'Per-account AI prompt and auto-reply',
    question: 'Where an account’s prompt lives, and how its reply mode is reached.',
    decisions: 2,
    url: 'https://claude.ai/artifact/M5VMFPffnoqvBa6kDi38Su',
  },
  {
    title: 'Stage update in room',
    question: 'What a stage event’s name does when it no longer fits the row.',
    decisions: 1,
    url: 'https://claude.ai/artifact/KAVemxWFmSwMnAj4LVhoXJ',
  },
];
