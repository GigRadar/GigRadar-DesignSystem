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

/*
 * BF-4280 (per-account prompt and auto-reply) and the stage event's max-width
 * name were both decided: the winning proposals moved into `packages/ui` and
 * their surfaces became ordinary gallery pages, which is where a decided
 * design belongs. What is left here is still open.
 */
export const DEVELOPMENT_ARTIFACTS: DevelopmentArtifact[] = [
  {
    ticket: 'BF-4111',
    title: 'Custom prompt setup',
    question:
      'Proposal 1 (templates are the empty card) is built as PromptSetup and published in @gigradar/ui 2.5.0 — still in development, awaiting review.',
    decisions: 1,
    url: 'https://claude.ai/artifact/XueoTo44KeWYZoCiaZ8RKc',
  },
  {
    ticket: 'BF-4113',
    title: 'Auto Reply mode clarity',
    question:
      'Proposal 1 (fixed, read-only stop rules) is built onto AutoReply and published in @gigradar/ui 2.5.0 — still in development, awaiting review.',
    decisions: 1,
    url: 'https://claude.ai/artifact/5MnoFwFwmLbrH57gpguGXb',
  },
  {
    ticket: 'BF-3481',
    title: 'Room type and Create BM room',
    question:
      'Proposal 1 (header tag + band) is built as RoomTypeTag and CreateBmRoomModal and published in @gigradar/ui 2.5.0 — still in development, awaiting review.',
    decisions: 1,
    url: 'https://claude.ai/artifact/BgHUXKC7K3HXUYK5MsgfED',
  },
];
