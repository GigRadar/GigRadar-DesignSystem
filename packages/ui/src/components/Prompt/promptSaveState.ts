/**
 * Whether a custom prompt can be saved — the rule behind `PromptSetup`'s Save.
 *
 * BF-4111: two teams switched on a "custom" prompt that was still GigRadar's
 * default and believed their agent was configured. So Save is live only once
 * the text is the team's own: not empty, not the default, not a template with
 * its `[blanks]` still in it, and not what is already saved.
 *
 * Exported on its own so a server or a caller can enforce the same rule the
 * card shows — a Save button that the API would accept anyway is only a hint.
 */

/** Why Save is off, or `ready` when it is on. */
export type PromptSaveReason = 'empty' | 'default' | 'blanks' | 'saved' | 'ready';

export type PromptSaveState = {
  canSave: boolean;
  reason: PromptSaveReason;
  /** The `[blanks]` still in the text, each once, in order. */
  blanks: string[];
};

/** Whitespace is not a change: a re-indented default is still the default. */
const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

/**
 * Two prompts that differ only in whitespace.
 *
 * @experimental In development (BF-4111): published so apps can build against it,
 * but the design is not signed off yet, so props and look may change in a minor release.
 */
export function samePrompt(a: string, b: string): boolean {
  return squash(a) === squash(b);
}

/**
 * The `[blanks]` left in a prompt, each once, in order.
 *
 * Square brackets on one line. `{{variables}}` are not blanks: they are filled
 * in by the runtime, not by the team.
 *
 * @experimental In development (BF-4111): published so apps can build against it,
 * but the design is not signed off yet, so props and look may change in a minor release.
 */
export function promptBlanks(text: string): string[] {
  return Array.from(new Set(text.match(/\[[^\]\n]+\]/g) ?? []));
}

/**
 * @experimental In development (BF-4111): published so apps can build against it,
 * but the design is not signed off yet, so props and look may change in a minor release.
 */
export function promptSaveState(
  text: string,
  {
    defaultPrompt,
    savedValue = null,
  }: {
    /** What the agent runs on until a prompt is saved. */
    defaultPrompt: string;
    /** The saved custom prompt, or `null` while running on the default. */
    savedValue?: string | null;
  },
): PromptSaveState {
  const blanks = promptBlanks(text);
  if (text.trim() === '') return { canSave: false, reason: 'empty', blanks };
  if (samePrompt(text, defaultPrompt)) return { canSave: false, reason: 'default', blanks };
  if (blanks.length > 0) return { canSave: false, reason: 'blanks', blanks };
  if (savedValue !== null && samePrompt(text, savedValue)) {
    return { canSave: false, reason: 'saved', blanks };
  }
  return { canSave: true, reason: 'ready', blanks };
}
